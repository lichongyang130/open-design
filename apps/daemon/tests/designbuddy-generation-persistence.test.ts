import Database from 'better-sqlite3';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import {
  appendDesignBuddyGenEvent,
  completeDesignBuddyGenerationJob,
  createDesignBuddyGenerationJob,
  getDesignBuddyGenerationJob,
  listDesignBuddyGenerationJobs,
  listDesignBuddyGenEvents,
  migrateDesignBuddy,
  reconcileInterruptedDesignBuddyGenerationJobs,
} from '../src/designbuddy-store.js';
import {
  designBuddyGeneratedFileName,
  persistDesignBuddyHtmlArtifact,
  reconcileDesignBuddyProjectArtifacts,
} from '../src/designbuddy-artifacts.js';
import { listProjectFileVersions } from '../src/project-file-versions.js';

function fixtureDb() {
  const db = new Database(':memory:');
  db.pragma('foreign_keys = ON');
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
  db.prepare(
    `INSERT INTO projects
       (id, name, skill_id, design_system_id, pending_prompt, metadata_json, created_at, updated_at)
     VALUES ('project-1', 'Northstar launch', NULL, NULL, NULL, ?, 1, 1)`,
  ).run(JSON.stringify({ source: 'user', designBuddyRole: 'designer' }));
  return db;
}

const htmlV1 = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Northstar launch</title><style>
:root{--canvas:#f4f1e8;--ink:#18221b;--accent:#3f7a51}
*{box-sizing:border-box}body{margin:0;background:var(--canvas);color:var(--ink);font-family:Arial,sans-serif}
h1{font-family:Georgia,serif;font-size:64px;line-height:1.02}.hero{min-height:100vh;padding:80px}.action{padding:12px 18px;border:0;background:var(--ink);color:white}
</style></head><body><main><section class="hero" data-od-id="hero"><h1>A clearer path to launch.</h1><p>Northstar aligns the product story, launch plan, and team handoff.</p><button class="action" type="button">Review launch plan</button></section></main></body></html>`;

const htmlV2 = htmlV1.replace('A clearer path to launch.', 'One launch plan. Every team aligned.');

const tempRoots: string[] = [];
afterEach(async () => {
  await Promise.all(tempRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe('DesignBuddy durable generation jobs', () => {
  it('keeps terminal jobs and reconciles only in-flight rows after restart', () => {
    const db = fixtureDb();
    const running = createDesignBuddyGenerationJob(db, {
      provider: 'agnes',
      projectId: 'project-1',
      request: { prompt: 'Create the launch page', version: 1 },
    });
    const completed = createDesignBuddyGenerationJob(db, {
      provider: 'custom-model',
      projectId: 'project-1',
      request: { prompt: 'Create an alternate direction', version: 2 },
    });
    completeDesignBuddyGenerationJob(db, completed.id, {
      html: htmlV1,
      model: 'auto',
      fileName: 'generated/design.html',
    });

    expect(reconcileInterruptedDesignBuddyGenerationJobs(db, 10_000)).toBe(1);
    expect(getDesignBuddyGenerationJob(db, running.id)).toMatchObject({
      status: 'interrupted',
      error: {
        code: 'GENERATION_INTERRUPTED',
        status: 503,
      },
      updatedAt: 10_000,
    });
    expect(getDesignBuddyGenerationJob(db, completed.id)).toMatchObject({
      status: 'succeeded',
      result: { model: 'auto', fileName: 'generated/design.html' },
    });
    expect(listDesignBuddyGenerationJobs(db, { projectId: 'project-1' })).toHaveLength(2);
    db.close();
  });
});

describe('DesignBuddy generated project artifacts', () => {
  it('writes a manifest, stable project file, immutable versions, and lint results', async () => {
    const db = fixtureDb();
    const projectsRoot = await mkdtemp(path.join(os.tmpdir(), 'designbuddy-artifacts-'));
    tempRoots.push(projectsRoot);

    expect(designBuddyGeneratedFileName('page', '../../escape.html')).toBe('generated/design.html');
    const first = await persistDesignBuddyHtmlArtifact(db, projectsRoot, {
      projectId: 'project-1',
      html: htmlV1,
      prompt: 'Create the launch page',
      kind: 'landing',
      title: 'Northstar launch',
      model: 'agnes-3.0-flash',
      provider: 'agnes',
      jobId: 'job-first',
      version: 1,
    });
    const second = await persistDesignBuddyHtmlArtifact(db, projectsRoot, {
      projectId: 'project-1',
      html: htmlV2,
      prompt: 'Make the headline more direct',
      kind: 'landing',
      title: 'Northstar launch',
      model: 'agnes-3.0-flash',
      provider: 'agnes',
      jobId: 'job-second',
      version: 2,
      fileName: first.fileName,
    });

    expect(first.fileName).toBe('generated/design.html');
    expect(first.fileVersion).toMatchObject({ version: 1, source: 'ai', promptSource: 'message' });
    expect(second.fileVersion).toMatchObject({ version: 2, source: 'ai', promptSource: 'message' });
    expect(second.quality).toMatchObject({
      counts: expect.objectContaining({ p0: expect.any(Number), p1: expect.any(Number), p2: expect.any(Number) }),
      findings: expect.any(Array),
    });

    const committed = await readFile(path.join(projectsRoot, 'project-1', 'generated', 'design.html'), 'utf8');
    expect(committed).toContain('One launch plan. Every team aligned.');
    const manifest = JSON.parse(await readFile(
      path.join(projectsRoot, 'project-1', 'generated', 'design.html.artifact.json'),
      'utf8',
    ));
    expect(manifest).toMatchObject({
      version: 1,
      kind: 'html',
      renderer: 'html',
      primary: true,
      metadata: {
        source: 'designbuddy-generation',
        generationJobId: 'job-second',
        generationVersion: 2,
      },
    });
    const versions = await listProjectFileVersions(
      projectsRoot,
      'project-1',
      'generated/design.html',
      { source: 'user', designBuddyRole: 'designer' },
    );
    expect(versions.map((version) => version.version)).toEqual([1, 2]);
    const row = db.prepare(`SELECT metadata_json FROM projects WHERE id = 'project-1'`).get() as { metadata_json: string };
    expect(JSON.parse(row.metadata_json)).toMatchObject({
      entryFile: 'generated/design.html',
      designBuddyArtifactFile: 'generated/design.html',
    });
    db.close();
  });

  it('lazily materializes legacy event-only artifacts exactly once', async () => {
    const db = fixtureDb();
    const projectsRoot = await mkdtemp(path.join(os.tmpdir(), 'designbuddy-reconcile-'));
    tempRoots.push(projectsRoot);
    appendDesignBuddyGenEvent(db, 'project-1', 'user', { text: 'Create the launch page' });
    appendDesignBuddyGenEvent(db, 'project-1', 'artifact', {
      name: 'Northstar launch',
      version: 1,
      kind: 'landing',
      html: htmlV1,
    });

    await expect(reconcileDesignBuddyProjectArtifacts(db, projectsRoot, 'project-1'))
      .resolves.toEqual({ reconciled: 1 });
    const artifact = listDesignBuddyGenEvents(db, 'project-1').find((event) => event.type === 'artifact');
    expect(artifact?.payload).toMatchObject({
      fileName: 'generated/design.html',
      fileVersion: { version: 1, source: 'ai' },
      quality: { findings: expect.any(Array) },
    });
    await expect(reconcileDesignBuddyProjectArtifacts(db, projectsRoot, 'project-1'))
      .resolves.toEqual({ reconciled: 0 });
    const versions = await listProjectFileVersions(
      projectsRoot,
      'project-1',
      'generated/design.html',
      { source: 'user', designBuddyRole: 'designer' },
    );
    expect(versions).toHaveLength(1);
    db.close();
  });
});
