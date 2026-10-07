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
  readDesignBuddyProfile,
  readDesignBuddyStarterStatus,
  setDesignBuddyProfile,
} from '../src/designbuddy-store.js';
import { DESIGNER_COMMERCIAL_STARTERS } from '../src/designbuddy-commercial-projects.js';
import { DESIGNBUDDY_ROLE_STARTERS } from '../src/designbuddy-role-projects.js';

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
  it('persists an explicit local-workspace profile in SQLite', () => {
    const db = fixtureDb();
    expect(readDesignBuddyProfile(db)).toEqual({
      displayName: null,
      hasProfile: false,
      mode: 'local-workspace',
    });
    expect(setDesignBuddyProfile(db, '  小鹿   Studio  ')).toEqual({
      displayName: '小鹿 Studio',
      hasProfile: true,
      mode: 'local-workspace',
    });
    expect(readDesignBuddyProfile(db).displayName).toBe('小鹿 Studio');
    db.close();
  });

  it('ships 50 distinct long-form commercial pages across ten real product systems', () => {
    expect(DESIGNER_COMMERCIAL_STARTERS).toHaveLength(50);
    expect(new Set(DESIGNER_COMMERCIAL_STARTERS.map((starter) => starter.key)).size).toBe(50);
    expect(new Set(DESIGNER_COMMERCIAL_STARTERS.map((starter) => starter.html)).size).toBe(50);
    const families = new Set<string>();
    const layouts = new Map<string, Set<string>>();
    for (const starter of DESIGNER_COMMERCIAL_STARTERS) {
      expect((starter.html.match(/<section/g) ?? []).length).toBeGreaterThanOrEqual(5);
      expect((starter.html.match(/<button/g) ?? []).length).toBeGreaterThanOrEqual(12);
      expect(starter.html).toContain('scroll-behavior:smooth');
      expect(starter.html).toContain('id="experience"');
      expect(starter.html).toContain('data-open-action');
      expect(starter.html).toContain('data-detail');
      expect(starter.html).toContain("addEventListener('click'");
      expect(starter.html).not.toContain('关键价值，<br>一眼可见');
      expect(starter.interactive).toBe(true);
      const family = starter.html.match(/data-family="([^"]+)"/)?.[1];
      const layout = starter.html.match(/data-layout="([^"]+)"/)?.[1];
      expect(family).toBeTruthy();
      expect(layout).toBeTruthy();
      families.add(family!);
      const familyLayouts = layouts.get(family!) ?? new Set<string>();
      familyLayouts.add(layout!);
      layouts.set(family!, familyLayouts);
    }
    expect(families.size).toBe(10);
    expect(Array.from(layouts.values()).every((familyLayouts) => familyLayouts.size === 5)).toBe(true);

    const dom = new JSDOM(DESIGNER_COMMERCIAL_STARTERS[0]!.html, {
      runScripts: 'dangerously',
      pretendToBeVisual: true,
      url: 'https://preview.example/project',
    });
    const document = dom.window.document;

    const productChoices = document.querySelectorAll('[data-choice][data-group="product"]');
    (productChoices[1]).click();
    expect(productChoices[1]?.classList.contains('active')).toBe(true);
    expect(document.querySelector('[data-choice-output="product"]')?.textContent).toBe(
      productChoices[1]?.getAttribute('data-choice'),
    );

    const add = document.querySelector('[data-add]');
    add.click();
    expect(document.querySelector('[data-bag-count]')?.textContent).toBe('1');
    expect(add.textContent).toContain('已加入');

    const thirdFeature = document.querySelectorAll('[data-detail]')[2];
    thirdFeature.click();
    expect(document.querySelector('#detailTitle')?.textContent).toBe(thirdFeature.dataset.detail);

    (document.querySelector('[data-open-action]')).click();
    expect(document.querySelector('#actionDrawer')?.classList.contains('open')).toBe(true);
    (document.querySelector('[data-confirm-action]')).click();
    expect(document.querySelector('#actionDrawer')?.classList.contains('open')).toBe(false);
    expect(document.querySelector('#toast')?.textContent).toContain('方案已确认');
    dom.window.close();
  });

  it('ships and persists six real, interactive workspaces for every operational role', () => {
    const roles = ['pm', 'dev', 'admin'] as const;
    const allBlueprints = roles.flatMap((role) => [...DESIGNBUDDY_ROLE_STARTERS[role]]);
    expect(allBlueprints).toHaveLength(18);
    expect(new Set(allBlueprints.map((starter) => starter.key)).size).toBe(18);
    expect(new Set(allBlueprints.map((starter) => starter.html)).size).toBe(18);

    for (const role of roles) {
      expect(DESIGNBUDDY_ROLE_STARTERS[role]).toHaveLength(6);
      for (const starter of DESIGNBUDDY_ROLE_STARTERS[role]) {
        expect(starter.role).toBe(role);
        expect(starter.html).toContain(`data-role-starter="${role}"`);
        expect(starter.html).toContain('data-stage');
        expect(starter.html).toContain('data-record');
        expect(starter.html).toContain("addEventListener('click'");
        expect(starter.interactive).toBe(true);
      }
    }

    for (const starter of allBlueprints) {
      const dom = new JSDOM(starter.html, {
        runScripts: 'dangerously',
        pretendToBeVisual: true,
        url: `https://preview.example/project/${starter.key}`,
      });
      const document = dom.window.document;
      const metrics = document.querySelectorAll<HTMLElement>('[data-select]');
      metrics[1]!.click();
      expect(metrics[1]!.classList.contains('active')).toBe(true);
      document.getElementById('openAction')!.click();
      expect(document.getElementById('drawer')!.classList.contains('open')).toBe(true);
      document.getElementById('confirmAction')!.click();
      expect(document.getElementById('drawer')!.classList.contains('open')).toBe(false);
      expect(document.getElementById('toast')!.textContent).toContain('状态已更新');
      dom.window.close();
    }

    const db = fixtureDb();
    for (const role of roles) {
      expect(readDesignBuddyStarterStatus(db, role).initialized).toBe(false);
      const initialized = initializeDesignBuddyStarterProjects(db, role);
      expect(initialized).toMatchObject({ role, initialized: true, version: 1 });
      expect(initialized.createdProjectIds).toHaveLength(6);
      expect(new Set(initialized.projectIds).size).toBe(6);
    }
    const rows = db.prepare('SELECT id, metadata_json AS metadataJson FROM projects').all() as Array<{
      id: string;
      metadataJson: string;
    }>;
    expect(rows).toHaveLength(18);
    const metadata = rows.map((row) => ({ id: row.id, ...JSON.parse(row.metadataJson) }));
    for (const role of roles) {
      const roleRows = metadata.filter((item) => item.designBuddyRole === role);
      expect(roleRows).toHaveLength(6);
      expect(roleRows.every((item) => item.source === 'starter-project')).toBe(true);
      expect(new Set(roleRows.map((item) => item.designBuddyMode)).size).toBe(6);
      expect(roleRows.every((item) => String(item.starterKey).startsWith(`${role}.`))).toBe(true);
    }
    expect(listDesignBuddyGenSummaries(db)).toHaveLength(18);

    const pmBefore = readDesignBuddyStarterStatus(db, 'pm');
    db.prepare('DELETE FROM projects WHERE id = ?').run(pmBefore.projectIds[0]);
    const pmAgain = initializeDesignBuddyStarterProjects(db, 'pm');
    expect(pmAgain.createdProjectIds).toEqual([]);
    expect((db.prepare('SELECT COUNT(*) AS count FROM projects').get() as { count: number }).count).toBe(17);
    db.close();
  });

  it('materializes 56 persisted Designer projects, including 50 commercial interactive experiences', () => {
    const db = fixtureDb();
    expect(readDesignBuddyStarterStatus(db, 'designer').initialized).toBe(false);

    const initialized = initializeDesignBuddyStarterProjects(db, 'designer');
    expect(initialized.initialized).toBe(true);
    expect(initialized.version).toBe(3);
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
        expect(html).toContain('id="proof"');
        expect(html).toContain('id="experience"');
        expect(html).toContain('data-open-action');
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
    expect(upgraded.version).toBe(3);
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

  it('upgrades a v2 library in place without overwriting a later user artifact', () => {
    const db = fixtureDb();
    const seeded = initializeDesignBuddyStarterProjects(db, 'designer');
    const rows = db.prepare('SELECT id, metadata_json AS metadataJson FROM projects').all() as Array<{
      id: string;
      metadataJson: string;
    }>;
    const metadata = rows.map((row) => ({ row, value: JSON.parse(row.metadataJson) as Record<string, any> }));
    const commercial = metadata.find((item) => String(item.value.starterKey).startsWith('designer.commercial.'))!;
    const legacy = metadata.find((item) => item.value.starterKey === 'designer.brand-site')!;

    const setOriginalHtml = db.prepare(
      `UPDATE designbuddy_gen SET payload = ? WHERE project_id = ? AND type = 'artifact'`,
    );
    setOriginalHtml.run(
      JSON.stringify({ name: '旧商业界面', version: 1, kind: 'landing', html: '<!doctype html><p>generic v2</p>' }),
      commercial.row.id,
    );
    setOriginalHtml.run(
      JSON.stringify({ name: '旧品牌界面', version: 1, kind: 'landing', html: '<!doctype html><p>legacy v2</p>' }),
      legacy.row.id,
    );
    appendDesignBuddyGenEvent(db, commercial.row.id, 'artifact', {
      name: '用户定制版本',
      version: 2,
      kind: 'landing',
      html: '<!doctype html><title>user-owned-v2</title>',
    });
    appendDesignBuddyGenEvent(db, commercial.row.id, 'done', { version: 2, kind: 'landing' });

    db.prepare(
      `UPDATE designbuddy_prefs SET value = ?, updated_at = ? WHERE key = 'starter-projects:designer'`,
    ).run(
      JSON.stringify({
        version: 2,
        projectIds: seeded.projectIds,
        starterKeys: metadata.map((item) => item.value.starterKey),
      }),
      Date.now(),
    );
    const markMetadataV2 = db.prepare('UPDATE projects SET metadata_json = ? WHERE id = ?');
    db.transaction(() => metadata.forEach((item) => {
      markMetadataV2.run(JSON.stringify({ ...item.value, starterVersion: 2 }), item.row.id);
    }))();

    const upgraded = initializeDesignBuddyStarterProjects(db, 'designer');
    expect(upgraded.version).toBe(3);
    expect(upgraded.createdProjectIds).toEqual([]);
    expect((db.prepare('SELECT COUNT(*) AS count FROM projects').get() as { count: number }).count).toBe(56);

    const commercialArtifacts = listDesignBuddyGenEvents(db, commercial.row.id)
      .filter((event) => event.type === 'artifact');
    expect(String(commercialArtifacts[0]?.payload?.html)).toContain('data-family="commerce"');
    expect(String(commercialArtifacts[0]?.payload?.html)).toContain('id="experience"');
    expect(commercialArtifacts[1]?.payload?.html).toContain('user-owned-v2');
    const commercialSummary = listDesignBuddyGenSummaries(db)
      .find((summary) => summary.projectId === commercial.row.id);
    expect(commercialSummary?.latestVersion).toBe(2);
    expect(commercialSummary?.html).toContain('user-owned-v2');

    const legacyArtifact = listDesignBuddyGenEvents(db, legacy.row.id)
      .find((event) => event.type === 'artifact');
    expect(String(legacyArtifact?.payload?.html)).toContain('data-od-legacy-interactions');
    expect(String(legacyArtifact?.payload?.html)).toContain('SELECTED CUSTOMER STORIES');
    const versions = db.prepare('SELECT metadata_json AS metadataJson FROM projects').all() as Array<{
      metadataJson: string;
    }>;
    expect(versions.every((row) => JSON.parse(row.metadataJson).starterVersion === 3)).toBe(true);
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
