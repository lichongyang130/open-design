// DesignBuddy demo-layer API. The static pages in apps/web/public call these
// with same-origin relative URLs; the web dev server (and the packaged sidecar)
// proxy /api/* to this daemon, so no CORS setup is needed on the client.
//
//   GET  /api/db/profile           -> persisted local-workspace display name
//   PUT  /api/db/profile           <- { displayName }
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
//   POST /api/db/agnes/generation-jobs -> start proxy-safe background HTML generation
//   GET/DELETE /api/db/agnes/generation-jobs/:id -> poll or cancel generation
//   POST /api/db/custom-model/generation-jobs -> generate through the selected custom config
//   GET/DELETE /api/db/custom-model/generation-jobs/:id -> poll or cancel custom generation
//   POST /api/db/custom-model/constrain-html -> harden browser-fallback model output
//   POST /api/db/agnes/generate    -> bounded synchronous compatibility endpoint

import type { Express } from 'express';
import { randomUUID } from 'node:crypto';
import type { RouteDeps } from '../server-context.js';
import { sendApiError } from '../http/api-errors.js';
import {
  proxyDispatcherRequestInit,
  validateUserProviderBaseUrl,
} from '../connectionTest.js';
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
  OpenAiCompatibleDesignError,
  constrainOpenAiCompatibleDesignHtml,
  generateOpenAiCompatibleDesign,
  type OpenAiCompatibleDesignConfig,
} from '../integrations/openai-compatible-design.js';
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
  readDesignBuddyProfile,
  readDesignBuddyRole,
  readDesignBuddyStarterStatus,
  setDesignBuddyProfile,
  setDesignBuddyReviewStatus,
  setDesignBuddyRole,
} from '../designbuddy-store.js';

export interface RegisterDesignBuddyRoutesDeps extends RouteDeps<'db'> {}

type AgnesGenerationJob = {
  id: string;
  status: 'running' | 'succeeded' | 'failed' | 'canceled';
  createdAt: number;
  updatedAt: number;
  controller: AbortController;
  result?: {
    html: string;
    model: string;
    usage: Record<string, unknown> | null;
    latencyMs: number;
  };
  error?: { code: string; message: string; status: number };
};

const AGNES_GENERATION_JOB_TTL_MS = 15 * 60_000;
const AGNES_GENERATION_JOB_LIMIT = 4;
const agnesGenerationJobs = new Map<string, AgnesGenerationJob>();

function pruneAgnesGenerationJobs(now = Date.now()): void {
  for (const [id, job] of agnesGenerationJobs) {
    if (job.status !== 'running' && now - job.updatedAt > AGNES_GENERATION_JOB_TTL_MS) {
      agnesGenerationJobs.delete(id);
    }
  }
}

function normalizeAgnesError(error: unknown): AgnesIntegrationError {
  return error instanceof AgnesIntegrationError
    ? error
    : new AgnesIntegrationError('AGNES_UNAVAILABLE', 'Agnes is currently unavailable.');
}

type CustomModelGenerationJob = {
  id: string;
  status: 'running' | 'succeeded' | 'failed' | 'canceled';
  createdAt: number;
  updatedAt: number;
  controller: AbortController;
  result?: {
    html: string;
    model: string;
    usage: Record<string, unknown> | null;
    latencyMs: number;
  };
  error?: { code: string; message: string; status: number };
};

const CUSTOM_MODEL_GENERATION_JOB_TTL_MS = 15 * 60_000;
const CUSTOM_MODEL_GENERATION_JOB_LIMIT = 4;
const customModelGenerationJobs = new Map<string, CustomModelGenerationJob>();

function pruneCustomModelGenerationJobs(now = Date.now()): void {
  for (const [id, job] of customModelGenerationJobs) {
    if (job.status !== 'running' && now - job.updatedAt > CUSTOM_MODEL_GENERATION_JOB_TTL_MS) {
      customModelGenerationJobs.delete(id);
    }
  }
}

function resolveCustomModelGenerationConfig(value: unknown): OpenAiCompatibleDesignConfig {
  const provider = value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
  if (provider.protocol !== 'openai') {
    throw new OpenAiCompatibleDesignError(
      'CUSTOM_MODEL_PROTOCOL_UNSUPPORTED',
      'Custom-model generation currently requires the OpenAI-compatible protocol. Change it in Settings.',
      422,
    );
  }
  const serverManaged = provider.credentialSource === 'designbuddy_custom_model';
  if (serverManaged) {
    const baseUrl = process.env.OD_CUSTOM_MODEL_BASE_URL?.trim() || '';
    const apiKey = process.env.OD_CUSTOM_MODEL_API_KEY?.trim() || '';
    const model = process.env.OD_CUSTOM_MODEL_NAME?.trim() || '';
    if (!baseUrl || !apiKey || !model) {
      throw new OpenAiCompatibleDesignError(
        'CUSTOM_MODEL_NOT_CONFIGURED',
        'The server-managed custom model is not configured. Set OD_CUSTOM_MODEL_BASE_URL, OD_CUSTOM_MODEL_API_KEY, and OD_CUSTOM_MODEL_NAME, then restart the daemon.',
        503,
      );
    }
    return {
      baseUrl,
      apiKey,
      model,
      ...(typeof provider.outputLimit === 'number'
        ? { outputLimit: provider.outputLimit }
        : {}),
    };
  }
  return {
    baseUrl: typeof provider.baseUrl === 'string' ? provider.baseUrl : '',
    apiKey: typeof provider.apiKey === 'string' ? provider.apiKey : '',
    model: typeof provider.model === 'string' ? provider.model : '',
    ...(typeof provider.outputLimit === 'number'
      ? { outputLimit: provider.outputLimit }
      : {}),
  };
}

function normalizeCustomModelError(error: unknown): OpenAiCompatibleDesignError {
  return error instanceof OpenAiCompatibleDesignError
    ? error
    : new OpenAiCompatibleDesignError(
        'CUSTOM_MODEL_UNAVAILABLE',
        'The custom model is currently unavailable. Check its connection in Settings.',
      );
}

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

  // Text generation can take longer than browser-facing reverse proxies allow.
  // Start it in the daemon and let Studio poll a short-lived local job instead
  // of keeping one HTTPS request open until the model finishes.
  app.post('/api/db/agnes/generation-jobs', (req, res) => {
    pruneAgnesGenerationJobs();
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
    const activeJobs = Array.from(agnesGenerationJobs.values())
      .filter((job) => job.status === 'running').length;
    if (activeJobs >= AGNES_GENERATION_JOB_LIMIT) {
      return sendApiError(res, 429, 'RATE_LIMITED', 'Too many Agnes generations are already running');
    }

    const now = Date.now();
    const job: AgnesGenerationJob = {
      id: randomUUID(),
      status: 'running',
      createdAt: now,
      updatedAt: now,
      controller: new AbortController(),
    };
    agnesGenerationJobs.set(job.id, job);
    res.status(202).json({ jobId: job.id, status: job.status });

    const proxyDispatcher = proxyDispatcherRequestInit(process.env);
    void (async () => {
      const startedAt = Date.now();
      try {
        const result = await generateAgnesDesign({
          prompt,
          locale: req.body?.locale === 'en' ? 'en' : 'zh',
          mode: typeof req.body?.mode === 'string' ? req.body.mode : undefined,
          projectName: typeof req.body?.projectName === 'string' ? req.body.projectName : undefined,
          previousHtml,
          signal: job.controller.signal,
          requestInit: proxyDispatcher.requestInit,
        });
        if (job.status === 'canceled') return;
        job.status = 'succeeded';
        job.updatedAt = Date.now();
        job.result = {
          html: result.html,
          model: AGNES_TEXT_MODEL,
          usage: result.usage,
          latencyMs: Date.now() - startedAt,
        };
      } catch (error) {
        if (job.status === 'canceled') return;
        const normalized = normalizeAgnesError(error);
        job.status = 'failed';
        job.updatedAt = Date.now();
        job.error = {
          code: normalized.code,
          message: normalized.message,
          status: normalized.status,
        };
      } finally {
        await proxyDispatcher.close();
      }
    })();
  });

  app.get('/api/db/agnes/generation-jobs/:jobId', (req, res) => {
    pruneAgnesGenerationJobs();
    const job = agnesGenerationJobs.get(req.params.jobId);
    if (!job) return sendApiError(res, 404, 'NOT_FOUND', 'Agnes generation job not found');
    if (job.status === 'succeeded') {
      return res.json({ status: job.status, result: job.result });
    }
    if (job.status === 'failed' || job.status === 'canceled') {
      return res.json({ status: job.status, error: job.error || {
        code: 'AGNES_CANCELED',
        message: 'Agnes generation was canceled.',
        status: 499,
      } });
    }
    return res.json({ status: job.status, createdAt: job.createdAt });
  });

  app.delete('/api/db/agnes/generation-jobs/:jobId', (req, res) => {
    const job = agnesGenerationJobs.get(req.params.jobId);
    if (!job) return res.status(204).end();
    if (job.status === 'running') {
      job.status = 'canceled';
      job.updatedAt = Date.now();
      job.controller.abort();
    }
    return res.status(204).end();
  });

  // Browser fallback is allowed only when the user already holds a manual key.
  // Keep model output untrusted: send it back through the daemon's exact same
  // HTML constraint before Studio renders it in an artifact frame.
  app.post('/api/db/custom-model/constrain-html', (req, res) => {
    const content = req.body?.content;
    if (typeof content !== 'string' || !content.trim()) {
      return sendApiError(res, 400, 'BAD_REQUEST', 'content is required');
    }
    if (Buffer.byteLength(content, 'utf8') > 1024 * 1024) {
      return sendApiError(res, 413, 'PAYLOAD_TOO_LARGE', 'content is too large');
    }
    try {
      return res.json({ html: constrainOpenAiCompatibleDesignHtml(content) });
    } catch (error) {
      const normalized = normalizeCustomModelError(error);
      const code = normalized.code === 'CUSTOM_MODEL_HTML_TOO_LARGE'
        ? 'CUSTOM_MODEL_HTML_TOO_LARGE'
        : 'CUSTOM_MODEL_INVALID_HTML';
      return sendApiError(
        res,
        normalized.status === 413 ? 413 : 422,
        code,
        normalized.message,
      );
    }
  });

  app.post('/api/db/custom-model/generation-jobs', async (req, res) => {
    pruneCustomModelGenerationJobs();
    const prompt = req.body?.prompt;
    const previousHtml = req.body?.previousHtml;
    if (typeof prompt !== 'string' || !prompt.trim()) {
      return sendApiError(res, 400, 'BAD_REQUEST', 'prompt is required');
    }
    if (prompt.length > 12_000) {
      return sendApiError(res, 413, 'PAYLOAD_TOO_LARGE', 'prompt is too long');
    }
    if (previousHtml !== undefined && typeof previousHtml !== 'string') {
      return sendApiError(res, 400, 'BAD_REQUEST', 'previousHtml must be a string');
    }
    if (typeof previousHtml === 'string' && previousHtml.length > 120_000) {
      return sendApiError(res, 413, 'PAYLOAD_TOO_LARGE', 'previousHtml is too large');
    }
    let config: OpenAiCompatibleDesignConfig;
    try {
      config = resolveCustomModelGenerationConfig(req.body?.provider);
    } catch (error) {
      const normalized = normalizeCustomModelError(error);
      const code = normalized.code === 'CUSTOM_MODEL_NOT_CONFIGURED'
        ? 'CUSTOM_MODEL_NOT_CONFIGURED'
        : normalized.code === 'CUSTOM_MODEL_PROTOCOL_UNSUPPORTED'
          ? 'CUSTOM_MODEL_PROTOCOL_UNSUPPORTED'
          : 'CUSTOM_MODEL_INVALID_CONFIG';
      return sendApiError(res, normalized.status, code, normalized.message);
    }
    const validatedEndpoint = await validateUserProviderBaseUrl(config.baseUrl);
    if (validatedEndpoint.error || !validatedEndpoint.parsed) {
      return sendApiError(
        res,
        validatedEndpoint.forbidden ? 403 : 400,
        validatedEndpoint.forbidden ? 'FORBIDDEN' : 'BAD_REQUEST',
        validatedEndpoint.forbidden
          ? 'The custom model endpoint is blocked by the daemon network policy.'
          : 'The custom model endpoint is invalid. Fix it in Settings.',
      );
    }
    const activeJobs = Array.from(customModelGenerationJobs.values())
      .filter((job) => job.status === 'running').length;
    if (activeJobs >= CUSTOM_MODEL_GENERATION_JOB_LIMIT) {
      return sendApiError(
        res,
        429,
        'RATE_LIMITED',
        'Too many custom-model generations are already running',
      );
    }

    const now = Date.now();
    const job: CustomModelGenerationJob = {
      id: randomUUID(),
      status: 'running',
      createdAt: now,
      updatedAt: now,
      controller: new AbortController(),
    };
    customModelGenerationJobs.set(job.id, job);
    res.status(202).json({ jobId: job.id, status: job.status });

    const proxyDispatcher = proxyDispatcherRequestInit(process.env);
    void (async () => {
      const startedAt = Date.now();
      try {
        const result = await generateOpenAiCompatibleDesign({
          config,
          prompt,
          locale: req.body?.locale === 'en' ? 'en' : 'zh',
          ...(typeof req.body?.mode === 'string' ? { mode: req.body.mode } : {}),
          ...(typeof req.body?.projectName === 'string'
            ? { projectName: req.body.projectName }
            : {}),
          ...(typeof previousHtml === 'string' ? { previousHtml } : {}),
          signal: job.controller.signal,
          requestInit: proxyDispatcher.requestInit,
        });
        if (job.status === 'canceled') return;
        job.status = 'succeeded';
        job.updatedAt = Date.now();
        job.result = {
          html: result.html,
          model: result.model,
          usage: result.usage,
          latencyMs: Date.now() - startedAt,
        };
      } catch (error) {
        if (job.status === 'canceled') return;
        const normalized = normalizeCustomModelError(error);
        job.status = 'failed';
        job.updatedAt = Date.now();
        job.error = {
          code: normalized.code,
          message: normalized.message,
          status: normalized.status,
        };
      } finally {
        await proxyDispatcher.close();
      }
    })();
  });

  app.get('/api/db/custom-model/generation-jobs/:jobId', (req, res) => {
    pruneCustomModelGenerationJobs();
    const job = customModelGenerationJobs.get(req.params.jobId);
    if (!job) {
      return sendApiError(res, 404, 'NOT_FOUND', 'Custom-model generation job not found');
    }
    if (job.status === 'succeeded') {
      return res.json({ status: job.status, result: job.result });
    }
    if (job.status === 'failed' || job.status === 'canceled') {
      return res.json({
        status: job.status,
        error: job.error || {
          code: 'CUSTOM_MODEL_CANCELED',
          message: 'Custom-model generation was canceled.',
          status: 499,
        },
      });
    }
    return res.json({ status: job.status, createdAt: job.createdAt });
  });

  app.delete('/api/db/custom-model/generation-jobs/:jobId', (req, res) => {
    const job = customModelGenerationJobs.get(req.params.jobId);
    if (!job) return res.status(204).end();
    if (job.status === 'running') {
      job.status = 'canceled';
      job.updatedAt = Date.now();
      job.controller.abort();
    }
    return res.status(204).end();
  });

  // Keep the synchronous endpoint for API compatibility. Studio uses the job
  // endpoint above so a CDN timeout can never replace a model result with HTML.
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

  app.get('/api/db/profile', (_req, res) => {
    res.json(readDesignBuddyProfile(db));
  });

  app.put('/api/db/profile', (req, res) => {
    const displayName = typeof req.body?.displayName === 'string'
      ? req.body.displayName.trim().replace(/\s+/g, ' ')
      : '';
    if (!displayName || displayName.length > 60) {
      return sendApiError(res, 400, 'BAD_REQUEST', 'displayName required (max 60 chars)');
    }
    res.json(setDesignBuddyProfile(db, displayName));
  });

  app.get('/api/db/role', (_req, res) => {
    // hasRole=false means this local workspace has not completed onboarding.
    res.json(readDesignBuddyRole(db));
  });

  app.put('/api/db/role', (req, res) => {
    const role = req.body?.role;
    if (typeof role !== 'string' || !(DESIGNBUDDY_ROLES as readonly string[]).includes(role)) {
      return sendApiError(res, 400, 'BAD_REQUEST', 'role must be one of designer|pm|dev|admin');
    }
    const selectedRole = role as (typeof DESIGNBUDDY_ROLES)[number];
    setDesignBuddyRole(db, selectedRole);
    const starterProjects = initializeDesignBuddyStarterProjects(db, selectedRole);
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
