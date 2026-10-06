import Database from 'better-sqlite3';
import { describe, expect, it } from 'vitest';

import {
  appendDesignBuddyGenEvent,
  initializeDesignBuddyStarterProjects,
  listDesignBuddyGenEvents,
  listDesignBuddyGenSummaries,
  migrateDesignBuddy,
  readDesignBuddyStarterStatus,
} from '../src/designbuddy-store.js';

function fixtureDb() {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      skill_id TEXT,
      design_system_id TEXT,
      pending_prompt TEXT,
      metadata_json TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);
  migrateDesignBuddy(db);
  return db;
}

describe('DesignBuddy real starter projects', () => {
  it('materializes six persisted Designer projects with completed v1 artifacts', () => {
    const db = fixtureDb();
    expect(readDesignBuddyStarterStatus(db, 'designer').initialized).toBe(false);

    const initialized = initializeDesignBuddyStarterProjects(db, 'designer');
    expect(initialized.initialized).toBe(true);
    expect(initialized.version).toBe(1);
    expect(initialized.createdProjectIds).toHaveLength(6);
    expect(new Set(initialized.projectIds).size).toBe(6);

    const projects = db
      .prepare(
        'SELECT id, name, metadata_json AS metadataJson, created_at AS createdAt, updated_at AS updatedAt FROM projects ORDER BY created_at ASC',
      )
      .all() as Array<{
        id: string;
        name: string;
        metadataJson: string;
        createdAt: number;
        updatedAt: number;
      }>;
    expect(projects).toHaveLength(6);
    expect(projects.map((project) => project.name)).toEqual([
      '品牌官网改版',
      '会员中心 App',
      '秋季发布会提案',
      '社区招募海报',
      '增长指标 Dashboard',
      'Aurora 设计系统',
    ]);
    const metadata = projects.map((project) => JSON.parse(project.metadataJson));
    expect(metadata.map((item) => item.designBuddyMode)).toEqual([
      'landing',
      'app',
      'deck',
      'poster',
      'dashboard',
      'design-system',
    ]);
    expect(metadata.every((item) => item.designBuddyRole === 'designer')).toBe(true);
    expect(metadata.every((item) => item.source === 'starter-project')).toBe(true);
    expect(new Set(metadata.map((item) => item.starterKey)).size).toBe(6);
    expect(projects.every((project) => project.id.startsWith('db-starter-'))).toBe(true);
    expect(projects.every((project) => project.createdAt <= project.updatedAt)).toBe(true);
    expect(projects.every((project) => project.updatedAt <= Date.now())).toBe(true);

    const artifactHtml = new Set<string>();
    for (const project of projects) {
      const events = listDesignBuddyGenEvents(db, project.id);
      expect(events.map((event) => event.type)).toEqual([
        'user',
        'ai',
        'step',
        'step',
        'step',
        'artifact',
        'ai',
        'done',
      ]);
      const artifact = events.find((event) => event.type === 'artifact');
      expect(artifact?.payload?.version).toBe(1);
      const html = String(artifact?.payload?.html);
      expect(html).toContain('<!doctype html>');
      artifactHtml.add(html);
    }
    expect(artifactHtml.size).toBe(6);

    const summaries = listDesignBuddyGenSummaries(db);
    expect(summaries).toHaveLength(6);
    expect(summaries.every((summary) => summary.status === 'succeeded')).toBe(true);
    expect(summaries.every((summary) => summary.latestVersion === 1)).toBe(true);
    expect(summaries.every((summary) => summary.artifactCount === 1)).toBe(true);
    db.close();
  });

  it('is idempotent, preserves user projects, and does not resurrect a deleted starter', () => {
    const db = fixtureDb();
    db.prepare(
      `INSERT INTO projects
         (id, name, skill_id, design_system_id, pending_prompt, metadata_json, created_at, updated_at)
       VALUES (?, ?, NULL, NULL, NULL, ?, ?, ?)`,
    ).run('user-project', '用户自己的项目', JSON.stringify({ source: 'user' }), 100, 100);

    const first = initializeDesignBuddyStarterProjects(db, 'designer');
    const deletedId = first.projectIds[0]!;
    db.prepare('DELETE FROM projects WHERE id = ?').run(deletedId);

    const second = initializeDesignBuddyStarterProjects(db, 'designer');
    expect(second.createdProjectIds).toEqual([]);
    expect(second.projectIds).toEqual(first.projectIds);
    expect(
      (
        db.prepare('SELECT COUNT(*) AS count FROM projects').get() as {
          count: number;
        }
      ).count,
    ).toBe(6);
    expect(db.prepare('SELECT name FROM projects WHERE id = ?').get('user-project')).toEqual({
      name: '用户自己的项目',
    });
    expect(
      (
        db.prepare('SELECT COUNT(*) AS count FROM designbuddy_gen').get() as {
          count: number;
        }
      ).count,
    ).toBe(40);
    expect(readDesignBuddyStarterStatus(db, 'designer').initialized).toBe(true);
    expect(listDesignBuddyGenSummaries(db)).toHaveLength(5);
    db.close();
  });

  it('derives live status from appended generation events', () => {
    const db = fixtureDb();
    const initialized = initializeDesignBuddyStarterProjects(db, 'designer');
    const projectId = initialized.projectIds[0]!;

    appendDesignBuddyGenEvent(db, projectId, 'user', {
      text: '继续打磨移动端布局',
    });
    const running = listDesignBuddyGenSummaries(db).find((summary) => summary.projectId === projectId);
    expect(running?.status).toBe('running');
    expect(running?.latestVersion).toBe(1);

    appendDesignBuddyGenEvent(db, projectId, 'artifact', {
      name: '品牌官网改版',
      version: 2,
      kind: 'landing',
      html: '<!doctype html><title>v2</title>',
    });
    appendDesignBuddyGenEvent(db, projectId, 'done', {
      version: 2,
      kind: 'landing',
    });
    const completed = listDesignBuddyGenSummaries(db).find((summary) => summary.projectId === projectId);
    expect(completed).toMatchObject({
      status: 'succeeded',
      latestVersion: 2,
      artifactCount: 2,
    });
    expect(completed?.html).toContain('<title>v2</title>');
    db.close();
  });
});
