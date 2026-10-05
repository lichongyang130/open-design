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
//   GET  /api/db/projects/:id/gen  -> { events: [...] }   (AI 生成过程事件流)
//   POST /api/db/projects/:id/gen  <- { type, payload } -> 201 { event }

import type { Express } from 'express';
import type { RouteDeps } from '../server-context.js';
import { sendApiError } from '../http/api-errors.js';
import {
  DESIGNBUDDY_GEN_EVENT_TYPES,
  DESIGNBUDDY_GEN_PAYLOAD_LIMIT,
  DESIGNBUDDY_REVIEW_STATUS_TRANSITIONS,
  DESIGNBUDDY_ROLES,
  appendDesignBuddyGenEvent,
  createDesignBuddyReview,
  designBuddyStats,
  listDesignBuddyGenEvents,
  listDesignBuddyReviews,
  readDesignBuddyRole,
  setDesignBuddyReviewStatus,
  setDesignBuddyRole,
} from '../designbuddy-store.js';

export interface RegisterDesignBuddyRoutesDeps extends RouteDeps<'db'> {}

export function registerDesignBuddyRoutes(app: Express, ctx: RegisterDesignBuddyRoutesDeps): void {
  const { db } = ctx;

  app.get('/api/db/role', (_req, res) => {
    // hasRole=false 表示从未选择过 —— 登录端据此决定是否先去选角页。
    res.json(readDesignBuddyRole(db));
  });

  app.put('/api/db/role', (req, res) => {
    const role = req.body?.role;
    if (typeof role !== 'string' || !(DESIGNBUDDY_ROLES as readonly string[]).includes(role)) {
      return sendApiError(res, 400, 'BAD_REQUEST', 'role must be one of designer|pm|dev|admin');
    }
    setDesignBuddyRole(db, role as (typeof DESIGNBUDDY_ROLES)[number]);
    res.json({ role, hasRole: true });
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
    if (JSON.stringify(payload).length > DESIGNBUDDY_GEN_PAYLOAD_LIMIT) {
      return sendApiError(res, 400, 'BAD_REQUEST', 'payload too large');
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
