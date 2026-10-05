// DesignBuddy demo-layer API. The static pages in apps/web/public call these
// with same-origin relative URLs; the web dev server (and the packaged sidecar)
// proxy /api/* to this daemon, so no CORS setup is needed on the client.
//
//   GET  /api/db/role              -> { role }
//   PUT  /api/db/role              <- { role }  (designer | pm | dev | admin)
//   GET  /api/db/reviews           -> { reviews: [...] }
//   POST /api/db/reviews           <- { title, author?, note? }  -> 201 { review }
//   POST /api/db/reviews/:id/status <- { status: 'pass' | 'reject' } -> { review }
//   GET  /api/db/stats             -> { projects, promptsThisMonth, ... trend }

import type { Express } from 'express';
import type { RouteDeps } from '../server-context.js';
import { sendApiError } from '../http/api-errors.js';
import {
  DESIGNBUDDY_REVIEW_STATUS_TRANSITIONS,
  DESIGNBUDDY_ROLES,
  createDesignBuddyReview,
  designBuddyStats,
  getDesignBuddyRole,
  listDesignBuddyReviews,
  setDesignBuddyReviewStatus,
  setDesignBuddyRole,
} from '../designbuddy-store.js';

export interface RegisterDesignBuddyRoutesDeps extends RouteDeps<'db'> {}

export function registerDesignBuddyRoutes(app: Express, ctx: RegisterDesignBuddyRoutesDeps): void {
  const { db } = ctx;

  app.get('/api/db/role', (_req, res) => {
    res.json({ role: getDesignBuddyRole(db) });
  });

  app.put('/api/db/role', (req, res) => {
    const role = req.body?.role;
    if (typeof role !== 'string' || !(DESIGNBUDDY_ROLES as readonly string[]).includes(role)) {
      return sendApiError(res, 400, 'BAD_REQUEST', 'role must be one of designer|pm|dev|admin');
    }
    setDesignBuddyRole(db, role as (typeof DESIGNBUDDY_ROLES)[number]);
    res.json({ role });
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
}
