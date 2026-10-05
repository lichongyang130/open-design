// DesignBuddy demo layer persistence: the selected workspace role and the
// design review queue. The marketing/demo pages under apps/web/public
// (login.html, role.html, studio.html) read and write these tables through
// the daemon's /api/db/* routes so the role picker, the project list, and the
// PM review queue survive page reloads and browser storage clears — the same
// SQLite database (.od/app.sqlite) that owns projects and conversations.

import type Database from 'better-sqlite3';
import { randomUUID } from 'node:crypto';

type SqliteDb = Database.Database;
type DbRow = Record<string, any>;

export const DESIGNBUDDY_ROLES = ['designer', 'pm', 'dev', 'admin'] as const;
export type DesignBuddyRole = (typeof DESIGNBUDDY_ROLES)[number];

export const DESIGNBUDDY_REVIEW_STATUS_TRANSITIONS = ['pass', 'reject'] as const;
export type DesignBuddyReviewStatus = 'wait' | 'pass' | 'reject';

export interface DesignBuddyReview {
  id: string;
  title: string;
  author: string;
  status: DesignBuddyReviewStatus;
  note: string | null;
  projectId: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface DesignBuddyStats {
  projects: number;
  prompts: number;
  promptsThisMonth: number;
  pendingReviews: number;
  quotaTotal: number;
  quotaUsed: number;
  trend: number[];
}

/* ── AI 生成过程事件流（studio.html 生成视图的持久化）──
   Append-only log per project: user prompts, engine replies, progress steps,
   generated artifacts (self-contained HTML) and finish/stop markers. The
   static studio page replays this log into the chat pane + design-files pane
   so a generation session survives reloads. */

export const DESIGNBUDDY_GEN_EVENT_TYPES = [
  'user',
  'ai',
  'step',
  'artifact',
  'done',
  'stop',
] as const;
export type DesignBuddyGenEventType = (typeof DESIGNBUDDY_GEN_EVENT_TYPES)[number];

/** JSON payload cap per event; generous enough for a full artifact HTML doc. */
export const DESIGNBUDDY_GEN_PAYLOAD_LIMIT = 400_000;

export interface DesignBuddyGenEvent {
  id: string;
  projectId: string;
  seq: number;
  type: DesignBuddyGenEventType;
  payload: Record<string, any> | null;
  createdAt: number;
}

const SEED_REVIEWS: Array<{ title: string; author: string; status: DesignBuddyReviewStatus; ageHours: number }> = [
  { title: '官网首页改版', author: '小鹿', status: 'wait', ageHours: 2 },
  { title: '注册流程 v2', author: '阿明', status: 'wait', ageHours: 5 },
  { title: 'Q3 路演演示', author: 'Momo', status: 'wait', ageHours: 26 },
  { title: '移动端改版', author: 'Kevin', status: 'pass', ageHours: 30 },
  { title: '品牌手册', author: 'Lin', status: 'pass', ageHours: 50 },
  { title: '数据看板原型', author: '阿杰', status: 'pass', ageHours: 74 },
];

export function migrateDesignBuddy(db: SqliteDb): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS designbuddy_prefs (
      key        TEXT PRIMARY KEY,
      value      TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS designbuddy_reviews (
      id         TEXT PRIMARY KEY,
      title      TEXT NOT NULL,
      author     TEXT NOT NULL,
      status     TEXT NOT NULL DEFAULT 'wait',
      note       TEXT,
      project_id TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_designbuddy_reviews_status
      ON designbuddy_reviews(status, updated_at DESC);

    CREATE TABLE IF NOT EXISTS designbuddy_gen (
      id         TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      seq        INTEGER NOT NULL,
      type       TEXT NOT NULL,
      payload    TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_designbuddy_gen_project
      ON designbuddy_gen(project_id, seq);
  `);
  const count = (db.prepare('SELECT COUNT(*) AS c FROM designbuddy_reviews').get() as DbRow).c;
  if (count > 0) return;
  // Seed the queue once so the PM home has real rows to act on. After the
  // seed, every mutation comes from the UI and lives only in the database.
  const now = Date.now();
  const insert = db.prepare(
    `INSERT INTO designbuddy_reviews (id, title, author, status, note, project_id, created_at, updated_at)
     VALUES (?, ?, ?, ?, NULL, NULL, ?, ?)`,
  );
  db.transaction(() => {
    for (const review of SEED_REVIEWS) {
      const at = now - review.ageHours * 3_600_000;
      insert.run(randomUUID(), review.title, review.author, review.status, at, at);
    }
  })();
}

export function readDesignBuddyRole(db: SqliteDb): { role: DesignBuddyRole | null; hasRole: boolean } {
  const row = db
    .prepare(`SELECT value FROM designbuddy_prefs WHERE key = 'role'`)
    .get() as DbRow | undefined;
  const value = row?.value;
  if ((DESIGNBUDDY_ROLES as readonly string[]).includes(value)) {
    return { role: value as DesignBuddyRole, hasRole: true };
  }
  return { role: null, hasRole: false };
}

export function setDesignBuddyRole(db: SqliteDb, role: DesignBuddyRole): DesignBuddyRole {
  db.prepare(
    `INSERT INTO designbuddy_prefs (key, value, updated_at) VALUES ('role', ?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
  ).run(role, Date.now());
  return role;
}

function reviewFromRow(row: DbRow): DesignBuddyReview {
  return {
    id: String(row.id),
    title: String(row.title),
    author: String(row.author),
    status: row.status as DesignBuddyReviewStatus,
    note: row.note == null ? null : String(row.note),
    projectId: row.project_id == null ? null : String(row.project_id),
    createdAt: Number(row.created_at),
    updatedAt: Number(row.updated_at),
  };
}

export function listDesignBuddyReviews(db: SqliteDb): DesignBuddyReview[] {
  const rows = db
    .prepare(`SELECT * FROM designbuddy_reviews ORDER BY created_at DESC`)
    .all() as DbRow[];
  return rows.map(reviewFromRow);
}

export function createDesignBuddyReview(
  db: SqliteDb,
  input: { title: string; author: string; note?: string | null; projectId?: string | null },
): DesignBuddyReview {
  const now = Date.now();
  const id = randomUUID();
  db.prepare(
    `INSERT INTO designbuddy_reviews (id, title, author, status, note, project_id, created_at, updated_at)
     VALUES (?, ?, ?, 'wait', ?, ?, ?, ?)`,
  ).run(id, input.title, input.author, input.note ?? null, input.projectId ?? null, now, now);
  return {
    id,
    title: input.title,
    author: input.author,
    status: 'wait',
    note: input.note ?? null,
    projectId: input.projectId ?? null,
    createdAt: now,
    updatedAt: now,
  };
}

export function setDesignBuddyReviewStatus(
  db: SqliteDb,
  id: string,
  status: Exclude<DesignBuddyReviewStatus, 'wait'>,
): DesignBuddyReview | null {
  const info = db
    .prepare(`UPDATE designbuddy_reviews SET status = ?, updated_at = ? WHERE id = ?`)
    .run(status, Date.now(), id);
  if (info.changes === 0) return null;
  const row = db.prepare(`SELECT * FROM designbuddy_reviews WHERE id = ?`).get(id) as DbRow;
  return reviewFromRow(row);
}

function genEventFromRow(row: DbRow): DesignBuddyGenEvent {
  let payload: Record<string, any> | null = null;
  try {
    payload = row.payload == null ? null : (JSON.parse(String(row.payload)) as Record<string, any>);
  } catch {
    payload = null;
  }
  return {
    id: String(row.id),
    projectId: String(row.project_id),
    seq: Number(row.seq),
    type: row.type as DesignBuddyGenEventType,
    payload,
    createdAt: Number(row.created_at),
  };
}

export function listDesignBuddyGenEvents(db: SqliteDb, projectId: string): DesignBuddyGenEvent[] {
  const rows = db
    .prepare(`SELECT * FROM designbuddy_gen WHERE project_id = ? ORDER BY seq ASC, created_at ASC`)
    .all(projectId) as DbRow[];
  return rows.map(genEventFromRow);
}

export function appendDesignBuddyGenEvent(
  db: SqliteDb,
  projectId: string,
  type: DesignBuddyGenEventType,
  payload: Record<string, any> | null,
): DesignBuddyGenEvent {
  const now = Date.now();
  const id = randomUUID();
  const lastSeq = (
    db
      .prepare(`SELECT COALESCE(MAX(seq), 0) AS s FROM designbuddy_gen WHERE project_id = ?`)
      .get(projectId) as DbRow
  ).s as number;
  const seq = Number(lastSeq) + 1;
  db.prepare(
    `INSERT INTO designbuddy_gen (id, project_id, seq, type, payload, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
  ).run(id, projectId, seq, type, JSON.stringify(payload ?? null), now);
  return { id, projectId, seq, type, payload, createdAt: now };
}

export function designBuddyStats(db: SqliteDb): DesignBuddyStats {
  const projects = (
    db.prepare(`SELECT COUNT(*) AS c FROM projects`).get() as DbRow
  ).c as number;
  // Every user prompt in a project conversation is one "generation" request.
  const prompts = (
    db.prepare(`SELECT COUNT(*) AS c FROM messages WHERE role = 'user'`).get() as DbRow
  ).c as number;
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const promptsThisMonth = (
    db
      .prepare(`SELECT COUNT(*) AS c FROM messages WHERE role = 'user' AND created_at >= ?`)
      .get(monthStart.getTime()) as DbRow
  ).c as number;
  const pendingReviews = (
    db.prepare(`SELECT COUNT(*) AS c FROM designbuddy_reviews WHERE status = 'wait'`).get() as DbRow
  ).c as number;

  // 14-day activity trend from user prompts, oldest first.
  const dayBuckets = new Array<number>(14).fill(0);
  const since = Date.now() - 13 * 86_400_000;
  const trendRows = db
    .prepare(`SELECT created_at AS at FROM messages WHERE role = 'user' AND created_at >= ?`)
    .all(since) as DbRow[];
  const dayMs = 86_400_000;
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  for (const row of trendRows) {
    const ageDays = Math.floor((todayStart.getTime() + dayMs - Number(row.at)) / dayMs) - 1;
    const idx = 13 - ageDays;
    if (idx >= 0 && idx < dayBuckets.length) dayBuckets[idx] = (dayBuckets[idx] ?? 0) + 1;
  }

  const quotaTotal = 2000;
  return {
    projects,
    prompts,
    promptsThisMonth,
    pendingReviews,
    quotaTotal,
    quotaUsed: prompts,
    trend: dayBuckets,
  };
}
