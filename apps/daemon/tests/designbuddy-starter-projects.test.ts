import Database from 'better-sqlite3';
// @ts-expect-error jsdom is a runtime-only daemon test dependency without DOM typings.
import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';

import {
  appendDesignBuddyGenEvent,
  initializeDesignBuddyStarterProjects,
  listDesignBuddyGenEvents,
  listDesignBuddyGenSummaries,
  migrateDesignBuddy,
  readDesignBuddyStarterStatus,
} from '../src/designbuddy-store.js';
import { DESIGNER_COMMERCIAL_STARTERS } from '../src/designbuddy-commercial-projects.js';

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
  it('ships 50 distinct long-form commercial pages with working in-page controls', () => {
    expect(DESIGNER_COMMERCIAL_STARTERS).toHaveLength(50);
    expect(new Set(DESIGNER_COMMERCIAL_STARTERS.map((starter) => starter.key)).size).toBe(50);
    expect(new Set(DESIGNER_COMMERCIAL_STARTERS.map((starter) => starter.html)).size).toBe(50);
    for (const starter of DESIGNER_COMMERCIAL_STARTERS) {
      expect((starter.html.match(/<section/g) ?? []).length).toBeGreaterThanOrEqual(5);
      expect((starter.html.match(/<button/g) ?? []).length).toBeGreaterThanOrEqual(12);
      expect(starter.html).toContain('scroll-behavior:smooth');
      expect(starter.html).toContain('data-action="primary"');
      expect(starter.html).toContain('data-tab="1"');
      expect(starter.html).toContain("addEventListener('click'");
      expect(starter.interactive).toBe(true);
    }

    const dom = new JSDOM(DESIGNER_COMMERCIAL_STARTERS[0]!.html, {
      runScripts: 'dangerously',
      pretendToBeVisual: true,
      url: 'https://preview.example/project',
    });
    const document = dom.window.document;
    const save = document.querySelector('[data-action="save"]')!;
    save.click();
    expect(save.classList.contains('is-saved')).toBe(true);
    expect(save.textContent).toContain('已保存');

    const secondTab = document.querySelector('[data-tab="1"]')!;
    secondTab.click();
    expect(secondTab.classList.contains('active')).toBe(true);
    expect(document.querySelector('[data-panel="1"]')?.classList.contains('active')).toBe(true);

    const thirdFeature = document.querySelector('[data-feature="2"]')!;
    thirdFeature.click();
    expect(document.querySelector('#featureTitle')?.textContent).toBe(thirdFeature.dataset.title);

    document.querySelector('[data-action="primary"]')!.click();
    expect(document.querySelector('#demoModal')?.classList.contains('open')).toBe(true);
    const form = document.querySelector('#demoForm')!;
    form.dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
    expect(document.querySelector('#demoModal')?.classList.contains('open')).toBe(false);
    expect(document.querySelector('#toast')?.textContent).toContain('提交成功');
    dom.window.close();
  });

  it('materializes 56 persisted Designer projects, including 50 commercial interactive experiences', () => {
    const db = fixtureDb();
    expect(readDesignBuddyStarterStatus(db, 'designer').initialized).toBe(false);

    const initialized = initializeDesignBuddyStarterProjects(db, 'designer');
    expect(initialized.initialized).toBe(true);
    expect(initialized.version).toBe(2);
    expect(initialized.createdProjectIds).toHaveLength(56);
    expect(new Set(initialized.projectIds).size).toBe(56);

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
    expect(projects).toHaveLength(56);
    expect(projects.slice(0, 6).map((project) => project.name)).toEqual([
      '品牌官网改版',
      '会员中心 App',
      '秋季发布会提案',
      '社区招募海报',
      '增长指标 Dashboard',
      'Aurora 设计系统',
    ]);
    const metadata = projects.map((project) => JSON.parse(project.metadataJson));
    expect(metadata.slice(0, 6).map((item) => item.designBuddyMode)).toEqual([
      'landing',
      'app',
      'deck',
      'poster',
      'dashboard',
      'design-system',
    ]);
    expect(metadata.every((item) => item.designBuddyRole === 'designer')).toBe(true);
    expect(metadata.every((item) => item.source === 'starter-project')).toBe(true);
    expect(new Set(metadata.map((item) => item.starterKey)).size).toBe(56);
    expect(metadata.filter((item) => String(item.starterKey).startsWith('designer.commercial.'))).toHaveLength(50);
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
      expect(html).toContain('<script');
      expect(artifact?.payload?.interactive).toBe(true);
      if (html.includes('data-commercial-project')) {
        expect(html).toContain('id="overview"');
        expect(html).toContain('id="product"');
        expect(html).toContain('data-action="primary"');
        expect(html).toContain("scrollIntoView");
      }
      artifactHtml.add(html);
    }
    expect(artifactHtml.size).toBe(56);
    expect(Array.from(artifactHtml).filter((html) => html.includes('data-commercial-project'))).toHaveLength(50);

    const summaries = listDesignBuddyGenSummaries(db);
    expect(summaries).toHaveLength(56);
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
    ).toBe(56);
    expect(db.prepare('SELECT name FROM projects WHERE id = ?').get('user-project')).toEqual({
      name: '用户自己的项目',
    });
    expect(
      (
        db.prepare('SELECT COUNT(*) AS count FROM designbuddy_gen').get() as {
          count: number;
        }
      ).count,
    ).toBe(440);
    expect(readDesignBuddyStarterStatus(db, 'designer').initialized).toBe(true);
    expect(listDesignBuddyGenSummaries(db)).toHaveLength(55);
    db.close();
  });

  it('upgrades a v1 six-project library by adding exactly 50 projects without duplicating legacy rows', () => {
    const db = fixtureDb();
    initializeDesignBuddyStarterProjects(db, 'designer');
    const rows = db.prepare('SELECT id, metadata_json AS metadataJson FROM projects').all() as Array<{
      id: string;
      metadataJson: string;
    }>;
    const legacyIds: string[] = [];
    const commercialIds: string[] = [];
    for (const row of rows) {
      const metadata = JSON.parse(row.metadataJson);
      if (String(metadata.starterKey).startsWith('designer.commercial.')) commercialIds.push(row.id);
      else legacyIds.push(row.id);
    }
    expect(legacyIds).toHaveLength(6);
    expect(commercialIds).toHaveLength(50);
    const removeProject = db.prepare('DELETE FROM projects WHERE id = ?');
    db.transaction(() => commercialIds.forEach((id) => removeProject.run(id)))();
    db.prepare(
      `UPDATE designbuddy_prefs SET value = ?, updated_at = ? WHERE key = 'starter-projects:designer'`,
    ).run(JSON.stringify({ version: 1, projectIds: legacyIds }), Date.now());

    expect(readDesignBuddyStarterStatus(db, 'designer').initialized).toBe(false);
    const upgraded = initializeDesignBuddyStarterProjects(db, 'designer');
    expect(upgraded.version).toBe(2);
    expect(upgraded.createdProjectIds).toHaveLength(50);
    expect((db.prepare('SELECT COUNT(*) AS count FROM projects').get() as { count: number }).count).toBe(56);
    expect(new Set(upgraded.projectIds).size).toBe(56);
    const legacyArtifacts = legacyIds.map((id) =>
      listDesignBuddyGenEvents(db, id).find((event) => event.type === 'artifact'),
    );
    expect(legacyArtifacts.every((artifact) => artifact?.payload?.interactive === true)).toBe(true);
    expect(legacyArtifacts.every((artifact) => String(artifact?.payload?.html).includes('data-od-legacy-interactions'))).toBe(true);
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
