// DesignBuddy demo-layer API. The static pages in apps/web/public call these
// with same-origin relative URLs; the web dev server (and the packaged sidecar)
// proxy /api/* to this daemon, so no CORS setup is needed on the client.
//
//   GET  /api/db/role              -> { role }
//   PUT  /api/db/role              <- { role }  (designer | pm | dev | admin)
//   GET  /api/db/reviews           -> { reviews: [...] }
//   POST /api/db/reviews           <- { title, author?, note? } -> 201 { review }
//   POST /api/db/reviews/:id/status <- { status: 'pass' | 'reject' } -> { review }
//   GET  /api/db/stats             -> { projects, promptsThisMonth, ... trend }
//   GET  /api/db/starter-projects/status -> persisted starter initialization marker
//   POST /api/db/starter-projects/initialize <- { role } -> materialized starter projects
//   GET  /api/db/projects/gen-summaries -> latest generation state and artifact per project
//   GET  /api/db/projects/:id/gen  -> { events: [...] }   (AI 生成过程事件流)
//   POST /api/db/projects/:id/gen  <- { type, payload } -> 201 { event }
//   GET  /api/db/agnes/config      -> public fixed-model metadata (never the key)
//   POST /api/db/agnes/test        -> daemon-side Agnes connectivity check
//   POST /api/db/agnes/generate    -> bounded, daemon-side Agnes HTML generation

import type { Express } from 'express';
import type { RouteDeps } from '../server-context.js';
import { sendApiError } from '../http/api-errors.js';
import { proxyDispatcherRequestInit } from '../connectionTest.js';
import {
  AGNES_BASE_URL,
  AGNES_IMAGE_MODEL,
  AGNES_TEXT_MODEL,
  AGNES_VIDEO_MODEL,
  AgnesIntegrationError,
  generateAgnesDesign,
  isAgnesConfigured,
  testAgnesConnection,
} from '../integrations/agnes.js';
import {
  DESIGNBUDDY_GEN_EVENT_TYPES,
  DESIGNBUDDY_GEN_PAYLOAD_LIMIT,
  DESIGNBUDDY_REVIEW_STATUS_TRANSITIONS,
  DESIGNBUDDY_ROLES,
  appendDesignBuddyGenEvent,
  createDesignBuddyReview,
  designBuddyStats,
  initializeDesignBuddyStarterProjects,
  listDesignBuddyGenEvents,
  listDesignBuddyGenSummaries,
  listDesignBuddyReviews,
  readDesignBuddyRole,
  readDesignBuddyStarterStatus,
  setDesignBuddyReviewStatus,
  setDesignBuddyRole,
} from '../designbuddy-store.js';

export interface RegisterDesignBuddyRoutesDeps extends RouteDeps<'db'> {}

export function registerDesignBuddyRoutes(app: Express, ctx: RegisterDesignBuddyRoutesDeps): void {
  const { db } = ctx;

  app.get('/api/db/agnes/config', (_req, res) => {
    res.json({
      provider: 'Agnes AI',
      baseUrl: AGNES_BASE_URL,
      configured: isAgnesConfigured(),
      models: {
        text: AGNES_TEXT_MODEL,
        image: AGNES_IMAGE_MODEL,
        video: AGNES_VIDEO_MODEL,
      },
    });
  });

  app.post('/api/db/agnes/test', async (req, res) => {
    const controller = new AbortController();
    const proxyDispatcher = proxyDispatcherRequestInit(process.env);
    const abort = () => controller.abort();
    req.once('aborted', abort);
    try {
      const startedAt = Date.now();
      await testAgnesConnection({
        signal: controller.signal,
        requestInit: proxyDispatcher.requestInit,
      });
      res.json({ ok: true, model: AGNES_TEXT_MODEL, latencyMs: Date.now() - startedAt });
    } catch (error) {
      if (res.headersSent) return;
      const normalized = error instanceof AgnesIntegrationError
        ? error
        : new AgnesIntegrationError('AGNES_UNAVAILABLE', 'Agnes is currently unavailable.');
      res.status(normalized.status).json({
        error: { code: normalized.code, message: normalized.message },
      });
    } finally {
      await proxyDispatcher.close();
      req.off('aborted', abort);
    }
  });

  app.post('/api/db/agnes/generate', async (req, res) => {
    const prompt = req.body?.prompt;
    const previousHtml = req.body?.previousHtml;
    if (typeof prompt !== 'string' || !prompt.trim()) {
      return sendApiError(res, 400, 'BAD_REQUEST', 'prompt is required');
    }
    if (previousHtml !== undefined && typeof previousHtml !== 'string') {
      return sendApiError(res, 400, 'BAD_REQUEST', 'previousHtml must be a string');
    }
    if (typeof previousHtml === 'string' && previousHtml.length > 120_000) {
      return sendApiError(res, 413, 'PAYLOAD_TOO_LARGE', 'previousHtml is too large');
    }

    const controller = new AbortController();
    const proxyDispatcher = proxyDispatcherRequestInit(process.env);
    const abort = () => controller.abort();
    req.once('aborted', abort);
    try {
      const startedAt = Date.now();
      const result = await generateAgnesDesign({
        prompt,
        locale: req.body?.locale === 'en' ? 'en' : 'zh',
        mode: typeof req.body?.mode === 'string' ? req.body.mode : undefined,
        projectName: typeof req.body?.projectName === 'string' ? req.body.projectName : undefined,
        previousHtml,
        signal: controller.signal,
        requestInit: proxyDispatcher.requestInit,
      });
      res.json({
        html: result.html,
        model: AGNES_TEXT_MODEL,
        usage: result.usage,
        latencyMs: Date.now() - startedAt,
      });
    } catch (error) {
      if (res.headersSent) return;
      const normalized = error instanceof AgnesIntegrationError
        ? error
        : new AgnesIntegrationError('AGNES_UNAVAILABLE', 'Agnes is currently unavailable.');
      res.status(normalized.status).json({
        error: { code: normalized.code, message: normalized.message },
      });
    } finally {
      await proxyDispatcher.close();
      req.off('aborted', abort);
    }
  });

  app.get('/api/db/role', (_req, res) => {
    // hasRole=false 表示从未选择过 —— 登录端据此决定是否先去选角页。
    res.json(readDesignBuddyRole(db));
  });

  app.put('/api/db/role', (req, res) => {
    const role = req.body?.role;
    if (typeof role !== 'string' || !(DESIGNBUDDY_ROLES as readonly string[]).includes(role)) {
      return sendApiError(res, 400, 'BAD_REQUEST', 'role must be one of designer|pm|dev|admin');
    }
    const selectedRole = role as (typeof DESIGNBUDDY_ROLES)[number];
    setDesignBuddyRole(db, selectedRole);
    const starterProjects = selectedRole === 'designer'
      ? initializeDesignBuddyStarterProjects(db, selectedRole)
      : null;
    res.json({ role, hasRole: true, starterProjects });
  });

  app.get('/api/db/starter-projects/status', (req, res) => {
    const role = typeof req.query.role === 'string' ? req.query.role : '';
    if (!(DESIGNBUDDY_ROLES as readonly string[]).includes(role)) {
      return sendApiError(res, 400, 'BAD_REQUEST', 'role must be one of designer|pm|dev|admin');
    }
    res.json(readDesignBuddyStarterStatus(db, role as (typeof DESIGNBUDDY_ROLES)[number]));
  });

  app.post('/api/db/starter-projects/initialize', (req, res) => {
    const role = req.body?.role;
    if (typeof role !== 'string' || !(DESIGNBUDDY_ROLES as readonly string[]).includes(role)) {
      return sendApiError(res, 400, 'BAD_REQUEST', 'role must be one of designer|pm|dev|admin');
    }
    const result = initializeDesignBuddyStarterProjects(db, role as (typeof DESIGNBUDDY_ROLES)[number]);
    res.status(result.createdProjectIds.length > 0 ? 201 : 200).json(result);
  });

  app.get('/api/db/projects/gen-summaries', (_req, res) => {
    res.json({ summaries: listDesignBuddyGenSummaries(db) });
  });

  app.get('/api/db/reviews', (_req, res) => {
    res.json({ reviews: listDesignBuddyReviews(db) });
  });

  app.post('/api/db/reviews', (req, res) => {
    const title = typeof req.body?.title === 'string' ? req.body.title.trim() : '';
    if (!title || title.length > 200) {
      return sendApiError(res, 400, 'BAD_REQUEST', 'title required (max 200 chars)');
    }
    const author =
      typeof req.body?.author === 'string' && req.body.author.trim() ? req.body.author.trim().slice(0, 60) : '设计师';
    const note = typeof req.body?.note === 'string' ? req.body.note.slice(0, 2000) : null;
    res.status(201).json({ review: createDesignBuddyReview(db, { title, author, note }) });
  });

  app.post('/api/db/reviews/:id/status', (req, res) => {
    const status = req.body?.status;
    if (
      typeof status !== 'string' ||
      !(DESIGNBUDDY_REVIEW_STATUS_TRANSITIONS as readonly string[]).includes(status)
    ) {
      return sendApiError(res, 400, 'BAD_REQUEST', "status must be 'pass' or 'reject'");
    }
    const review = setDesignBuddyReviewStatus(db, req.params.id, status as 'pass' | 'reject');
    if (!review) {
      return sendApiError(res, 404, 'NOT_FOUND', 'review not found');
    }
    res.json({ review });
  });

  app.get('/api/db/stats', (_req, res) => {
    res.json(designBuddyStats(db));
  });

  // ── AI 生成过程事件流（studio 生成视图）──
  //   GET  /api/db/projects/:id/gen  -> { events: [...] }
  //   POST /api/db/projects/:id/gen  <- { type, payload } -> 201 { event }

  app.get('/api/db/projects/:id/gen', (req, res) => {
    res.json({ events: listDesignBuddyGenEvents(db, req.params.id) });
  });

  app.post('/api/db/projects/:id/gen', (req, res) => {
    const type = req.body?.type;
    if (
      typeof type !== 'string' ||
      !(DESIGNBUDDY_GEN_EVENT_TYPES as readonly string[]).includes(type)
    ) {
      return sendApiError(
        res,
        400,
        'BAD_REQUEST',
        `type must be one of ${DESIGNBUDDY_GEN_EVENT_TYPES.join('|')}`,
      );
    }
    const payload = req.body?.payload ?? null;
    if (payload !== null && (typeof payload !== 'object' || Array.isArray(payload))) {
      return sendApiError(res, 400, 'BAD_REQUEST', 'payload must be an object or null');
    }
    if (Buffer.byteLength(JSON.stringify(payload), 'utf8') > DESIGNBUDDY_GEN_PAYLOAD_LIMIT) {
      return sendApiError(res, 413, 'PAYLOAD_TOO_LARGE', 'payload too large');
    }
    // 只允许绑定到真实存在的项目行，避免生成日志脱离项目。
    const project = db
      .prepare(`SELECT 1 AS ok FROM projects WHERE id = ?`)
      .get(req.params.id) as { ok: number } | undefined;
    if (!project) {
      return sendApiError(res, 404, 'NOT_FOUND', 'project not found');
    }
    const event = appendDesignBuddyGenEvent(
      db,
      req.params.id,
      type as (typeof DESIGNBUDDY_GEN_EVENT_TYPES)[number],
      payload as Record<string, any> | null,
    );
    res.status(201).json({ event });
  });
}
