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
import {
  DESIGNER_COMMERCIAL_ALIASES,
  DESIGNER_COMMERCIAL_STARTERS,
} from '../src/designbuddy-commercial-projects.js';
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

  it('keeps one enriched commercial project per visual system and folds duplicate content into scenarios', () => {
    expect(DESIGNER_COMMERCIAL_STARTERS).toHaveLength(10);
    expect(Object.keys(DESIGNER_COMMERCIAL_ALIASES)).toHaveLength(40);
    expect(new Set(DESIGNER_COMMERCIAL_STARTERS.map((starter) => starter.key)).size).toBe(10);
    expect(new Set(DESIGNER_COMMERCIAL_STARTERS.map((starter) => starter.html)).size).toBe(10);
    const families = new Set<string>();
    const canonicalTemplates = new Set<string>();
    for (const starter of DESIGNER_COMMERCIAL_STARTERS) {
      expect((starter.html.match(/<section/g) ?? []).length).toBeGreaterThanOrEqual(6);
      expect((starter.html.match(/<button/g) ?? []).length).toBeGreaterThanOrEqual(30);
      expect((starter.html.match(/data-scenario-pack=/g) ?? []).length).toBe(5);
      expect((starter.html.match(/data-content-screen=/g) ?? []).length).toBe(15);
      expect(starter.html).toContain('scroll-behavior:smooth');
      expect(starter.html).toContain('id="experience"');
      expect(starter.html).toContain('id="scenario-library"');
      expect(starter.html).toContain('data-open-action');
      expect(starter.html).toContain('data-detail');
      expect(starter.html).toContain("addEventListener('click'");
      expect(starter.interactive).toBe(true);
      const family = starter.html.match(/data-family="([^"]+)"/)?.[1];
      const canonicalTemplate = starter.html.match(/data-canonical-template="([^"]+)"/)?.[1];
      expect(family).toBeTruthy();
      expect(canonicalTemplate).toBe(family);
      families.add(family!);
      canonicalTemplates.add(canonicalTemplate!);
    }
    expect(families.size).toBe(10);
    expect(canonicalTemplates.size).toBe(10);
    expect(new Set(Object.values(DESIGNER_COMMERCIAL_ALIASES)).size).toBe(10);

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
    const scenarioScreen = document.querySelectorAll('[data-content-screen]')[14];
    scenarioScreen.click();
    expect(scenarioScreen.classList.contains('active')).toBe(true);
    expect(document.querySelector('#detailTitle')?.textContent).toBe(scenarioScreen.dataset.detail);

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
    const layoutSignatures = allBlueprints.map((starter) =>
      /data-layout-signature="([^"]+)"/.exec(starter.html)?.[1],
    );
    expect(layoutSignatures.every(Boolean)).toBe(true);
    expect(new Set(layoutSignatures).size).toBe(18);

    for (const role of roles) {
      expect(DESIGNBUDDY_ROLE_STARTERS[role]).toHaveLength(6);
      for (const starter of DESIGNBUDDY_ROLE_STARTERS[role]) {
        expect(starter.role).toBe(role);
        expect(starter.html).toContain(`data-role-starter="${role}"`);
        expect(starter.html).toContain('data-project-layout=');
        expect(starter.html).toContain('min-height:1180px');
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
      const inlineAction = Array.from(document.querySelectorAll('[data-action]') as any)
        .find((button: any) =>
          !button.hasAttribute('data-modal')
          && !button.hasAttribute('disabled')
          && !button.classList.contains('active'),
        ) as any;
      expect(inlineAction).toBeTruthy();
      inlineAction.click();
      expect(inlineAction.classList.contains('active')).toBe(true);
      const modalAction = document.querySelector('[data-action][data-modal]') as any;
      expect(modalAction).toBeTruthy();
      modalAction!.click();
      expect(document.getElementById('projectDialog')!.classList.contains('open')).toBe(true);
      document.getElementById('dialogConfirm')!.click();
      expect(document.getElementById('projectDialog')!.classList.contains('open')).toBe(false);
      expect(document.getElementById('liveStatus')!.textContent).toContain('操作已确认');
      dom.window.close();
    }

    const db = fixtureDb();
    for (const role of roles) {
      expect(readDesignBuddyStarterStatus(db, role).initialized).toBe(false);
      const initialized = initializeDesignBuddyStarterProjects(db, role);
      expect(initialized).toMatchObject({ role, initialized: true, version: 2 });
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

  it('materializes exactly 34 visible default projects across all four roles', () => {
    const db = fixtureDb();
    for (const role of ['designer', 'pm', 'dev', 'admin'] as const) {
      initializeDesignBuddyStarterProjects(db, role);
    }
    const rows = db.prepare(
      `SELECT json_extract(metadata_json, '$.designBuddyRole') AS role,
              json_extract(metadata_json, '$.starterRetired') AS retired
       FROM projects`,
    ).all() as Array<{ role: string; retired: number | null }>;
    expect(rows).toHaveLength(34);
    expect(rows.filter((row) => row.role === 'designer' && row.retired !== 1)).toHaveLength(16);
    expect(rows.filter((row) => row.role === 'pm')).toHaveLength(6);
    expect(rows.filter((row) => row.role === 'dev')).toHaveLength(6);
    expect(rows.filter((row) => row.role === 'admin')).toHaveLength(6);
    expect(listDesignBuddyGenSummaries(db)).toHaveLength(34);
    db.close();
  });

  it('upgrades repeated operational-role v1 shells in place without replacing later user artifacts', () => {
    const db = fixtureDb();
    const initial = initializeDesignBuddyStarterProjects(db, 'pm');
    const ids = [...initial.projectIds];
    const rows = db.prepare(
      `SELECT p.id, p.metadata_json AS metadataJson, g.id AS eventId, g.payload
       FROM projects p JOIN designbuddy_gen g ON g.project_id = p.id
       WHERE g.type = 'artifact' AND json_extract(g.payload, '$.version') = 1`,
    ).all() as Array<{ id: string; metadataJson: string; eventId: string; payload: string }>;
    expect(rows).toHaveLength(6);
    for (const row of rows) {
      const metadata = JSON.parse(row.metadataJson);
      db.prepare('UPDATE projects SET metadata_json = ? WHERE id = ?')
        .run(JSON.stringify({ ...metadata, starterVersion: 1 }), row.id);
      const payload = JSON.parse(row.payload);
      db.prepare('UPDATE designbuddy_gen SET payload = ? WHERE id = ?')
        .run(JSON.stringify({ ...payload, html: '<html data-old-repeated-shell></html>' }), row.eventId);
    }
    const preference = {
      version: 1,
      projectIds: ids,
      starterKeys: DESIGNBUDDY_ROLE_STARTERS.pm.map((starter) => starter.key),
    };
    db.prepare(`UPDATE designbuddy_prefs SET value = ? WHERE key = 'starter-projects:pm'`)
      .run(JSON.stringify(preference));
    db.prepare(
      `INSERT INTO designbuddy_gen (id, project_id, seq, type, payload, created_at)
       VALUES ('user-v2-artifact', ?, 99, 'artifact', ?, ?)`,
    ).run(ids[0], JSON.stringify({ version: 2, name: 'User iteration', html: '<main>keep me</main>' }), Date.now());

    const upgraded = initializeDesignBuddyStarterProjects(db, 'pm');
    expect(upgraded).toMatchObject({ role: 'pm', initialized: true, version: 2, createdProjectIds: [] });
    expect(upgraded.projectIds).toEqual(ids);
    const upgradedV1 = rows.map((row) => {
      const event = db.prepare('SELECT payload FROM designbuddy_gen WHERE id = ?').get(row.eventId) as { payload: string };
      return JSON.parse(event.payload).html as string;
    });
    expect(upgradedV1.every((html) => html.includes('data-layout-signature='))).toBe(true);
    expect(new Set(upgradedV1.map((html) => /data-layout-signature="([^"]+)"/.exec(html)?.[1])).size).toBe(6);
    expect(listDesignBuddyGenEvents(db, ids[0]!).at(-1)?.payload).toMatchObject({
      version: 2,
      html: '<main>keep me</main>',
    });
    const metadataVersions = db.prepare(
      `SELECT json_extract(metadata_json, '$.starterVersion') AS version
       FROM projects WHERE json_extract(metadata_json, '$.designBuddyRole') = 'pm'`,
    ).all() as Array<{ version: number }>;
    expect(metadataVersions.every((row) => row.version === 2)).toBe(true);
    db.close();
  });

  it('materializes 16 persisted Designer projects with ten enriched commercial systems', () => {
    const db = fixtureDb();
    expect(readDesignBuddyStarterStatus(db, 'designer').initialized).toBe(false);

    const initialized = initializeDesignBuddyStarterProjects(db, 'designer');
    expect(initialized.initialized).toBe(true);
    expect(initialized.version).toBe(4);
    expect(initialized.createdProjectIds).toHaveLength(16);
    expect(new Set(initialized.projectIds).size).toBe(16);

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
    expect(projects).toHaveLength(16);
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
    expect(new Set(metadata.map((item) => item.starterKey)).size).toBe(16);
    expect(metadata.filter((item) => String(item.starterKey).startsWith('designer.commercial.'))).toHaveLength(10);
    expect(metadata.every((item) => item.starterRetired === false)).toBe(true);
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
    expect(artifactHtml.size).toBe(16);
    expect(Array.from(artifactHtml).filter((html) => html.includes('data-commercial-project'))).toHaveLength(10);

    const summaries = listDesignBuddyGenSummaries(db);
    expect(summaries).toHaveLength(16);
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
    ).toBe(16);
    expect(db.prepare('SELECT name FROM projects WHERE id = ?').get('user-project')).toEqual({
      name: '用户自己的项目',
    });
    expect(
      (
        db.prepare('SELECT COUNT(*) AS count FROM designbuddy_gen').get() as {
          count: number;
        }
      ).count,
    ).toBe(120);
    expect(readDesignBuddyStarterStatus(db, 'designer').initialized).toBe(true);
    expect(listDesignBuddyGenSummaries(db)).toHaveLength(15);
    db.close();
  });

  it('upgrades a v1 six-project library by adding ten canonical systems without duplicating legacy rows', () => {
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
    expect(commercialIds).toHaveLength(10);
    const removeProject = db.prepare('DELETE FROM projects WHERE id = ?');
    db.transaction(() => commercialIds.forEach((id) => removeProject.run(id)))();
    db.prepare(
      `UPDATE designbuddy_prefs SET value = ?, updated_at = ? WHERE key = 'starter-projects:designer'`,
    ).run(JSON.stringify({ version: 1, projectIds: legacyIds }), Date.now());

    expect(readDesignBuddyStarterStatus(db, 'designer').initialized).toBe(false);
    const upgraded = initializeDesignBuddyStarterProjects(db, 'designer');
    expect(upgraded.version).toBe(4);
    expect(upgraded.createdProjectIds).toHaveLength(10);
    expect((db.prepare('SELECT COUNT(*) AS count FROM projects').get() as { count: number }).count).toBe(16);
    expect(new Set(upgraded.projectIds).size).toBe(16);
    const legacyArtifacts = legacyIds.map((id) =>
      listDesignBuddyGenEvents(db, id).find((event) => event.type === 'artifact'),
    );
    expect(legacyArtifacts.every((artifact) => artifact?.payload?.interactive === true)).toBe(true);
    expect(legacyArtifacts.every((artifact) => String(artifact?.payload?.html).includes('data-od-legacy-interactions'))).toBe(true);
    db.close();
  });

  it('retires forty duplicated v3 starters while preserving their rows and canonical ids', () => {
    const db = fixtureDb();
    const seeded = initializeDesignBuddyStarterProjects(db, 'designer');
    const aliasEntries = Object.entries(DESIGNER_COMMERCIAL_ALIASES);
    const insertProject = db.prepare(
      `INSERT INTO projects
         (id, name, skill_id, design_system_id, pending_prompt, metadata_json, created_at, updated_at)
       VALUES (?, ?, NULL, NULL, NULL, ?, ?, ?)`,
    );
    const insertEvent = db.prepare(
      `INSERT INTO designbuddy_gen (id, project_id, seq, type, payload, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
    );
    const aliasIds: string[] = [];
    db.transaction(() => aliasEntries.forEach(([starterKey], index) => {
      const id = `duplicate-starter-${index}`;
      const at = Date.now() - index * 1000;
      aliasIds.push(id);
      insertProject.run(id, `Duplicate ${index}`, JSON.stringify({
        designBuddyRole: 'designer',
        designBuddyMode: 'landing',
        source: 'starter-project',
        starterKey,
        starterVersion: 3,
      }), at, at + 1);
      insertEvent.run(`duplicate-artifact-${index}`, id, 1, 'artifact', JSON.stringify({
        version: 1,
        name: `Duplicate ${index}`,
        kind: 'landing',
        html: '<!doctype html><main>historical duplicate</main>',
      }), at);
      insertEvent.run(`duplicate-done-${index}`, id, 2, 'done', JSON.stringify({
        version: 1,
        kind: 'landing',
      }), at + 1);
    }))();
    const canonicalKeys = DESIGNER_COMMERCIAL_STARTERS.map((starter) => starter.key);
    db.prepare(
      `UPDATE designbuddy_prefs SET value = ?, updated_at = ? WHERE key = 'starter-projects:designer'`,
    ).run(JSON.stringify({
      version: 3,
      projectIds: [...seeded.projectIds, ...aliasIds],
      starterKeys: [...canonicalKeys, ...Object.keys(DESIGNER_COMMERCIAL_ALIASES)],
    }), Date.now());

    const upgraded = initializeDesignBuddyStarterProjects(db, 'designer');
    expect(upgraded).toMatchObject({ role: 'designer', initialized: true, version: 4, createdProjectIds: [] });
    expect(upgraded.projectIds).toHaveLength(16);
    expect((db.prepare('SELECT COUNT(*) AS count FROM projects').get() as { count: number }).count).toBe(56);
    const retiredRows = db.prepare(
      `SELECT metadata_json AS metadataJson FROM projects
       WHERE json_extract(metadata_json, '$.starterRetired') = 1`,
    ).all() as Array<{ metadataJson: string }>;
    expect(retiredRows).toHaveLength(40);
    expect(retiredRows.every((row) => {
      const metadata = JSON.parse(row.metadataJson);
      return metadata.starterVersion === 4
        && DESIGNER_COMMERCIAL_ALIASES[metadata.starterKey] === metadata.canonicalStarterKey;
    })).toBe(true);
    expect(listDesignBuddyGenSummaries(db)).toHaveLength(16);
    expect(listDesignBuddyGenEvents(db, aliasIds[0]!)).toHaveLength(2);
    db.close();
  });

  it('upgrades a v3 canonical library in place without overwriting a later user artifact', () => {
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
        version: 3,
        projectIds: seeded.projectIds,
        starterKeys: metadata.map((item) => item.value.starterKey),
      }),
      Date.now(),
    );
    const markMetadataV3 = db.prepare('UPDATE projects SET metadata_json = ? WHERE id = ?');
    db.transaction(() => metadata.forEach((item) => {
      markMetadataV3.run(JSON.stringify({ ...item.value, starterVersion: 3 }), item.row.id);
    }))();

    const upgraded = initializeDesignBuddyStarterProjects(db, 'designer');
    expect(upgraded.version).toBe(4);
    expect(upgraded.createdProjectIds).toEqual([]);
    expect((db.prepare('SELECT COUNT(*) AS count FROM projects').get() as { count: number }).count).toBe(16);

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
    expect(versions.every((row) => JSON.parse(row.metadataJson).starterVersion === 4)).toBe(true);
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
