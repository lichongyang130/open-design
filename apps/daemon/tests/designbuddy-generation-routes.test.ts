import type http from 'node:http';
import { randomUUID } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { openDatabase } from '../src/db.js';
import { createDesignBuddyGenerationJob } from '../src/designbuddy-store.js';
import { startServer } from '../src/server.js';

const generatedHtml = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Route artifact</title><style>
:root{--paper:#f5f1e7;--ink:#12231a}body{margin:0;background:var(--paper);color:var(--ink);font-family:Arial,sans-serif}h1{font-family:Georgia,serif}
</style></head><body><main><section data-od-id="route-hero"><h1>A useful workspace for launch teams</h1><p>Coordinate the brief, review decisions, and prepare the handoff.</p></section></main></body></html>`;

describe('DesignBuddy generation recovery routes', () => {
  let server: http.Server;
  let baseUrl: string;
  const projects: string[] = [];

  beforeAll(async () => {
    const started = await startServer({ port: 0, returnServer: true }) as { url: string; server: http.Server };
    baseUrl = started.url;
    server = started.server;
  });

  afterAll(async () => {
    for (const projectId of projects) {
      await fetch(`${baseUrl}/api/projects/${projectId}`, { method: 'DELETE' }).catch(() => undefined);
    }
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  async function createProject(): Promise<string> {
    const id = `designbuddy-generation-${randomUUID()}`;
    const response = await fetch(`${baseUrl}/api/projects`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id, name: 'DesignBuddy generation route test' }),
    });
    expect(response.status).toBe(200);
    projects.push(id);
    return id;
  }

  it('persists browser-fallback output through the generic artifact API', async () => {
    const projectId = await createProject();
    const response = await fetch(`${baseUrl}/api/db/projects/${projectId}/generated-artifacts`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        html: generatedHtml,
        prompt: 'Create a useful launch workspace',
        kind: 'landing',
        title: 'Route artifact',
        model: 'auto',
        provider: 'browser-fallback',
        version: 1,
      }),
    });
    expect(response.status).toBe(201);
    const body = await response.json() as {
      artifact: {
        fileName: string;
        fileVersion: { version: number; source: string; promptSource: string };
        quality: { status: string; counts: Record<string, number>; findings: unknown[] };
      };
    };
    expect(body.artifact).toMatchObject({
      fileName: 'generated/design.html',
      fileVersion: { version: 1, source: 'ai', promptSource: 'message' },
      quality: {
        status: expect.stringMatching(/passed|advisory|needs-attention/),
        counts: expect.objectContaining({ p0: expect.any(Number), p1: expect.any(Number), p2: expect.any(Number) }),
        findings: expect.any(Array),
      },
    });

    const raw = await fetch(`${baseUrl}/api/projects/${projectId}/raw/generated/design.html`);
    expect(raw.status).toBe(200);
    expect(await raw.text()).toContain('A useful workspace for launch teams');

    const versions = await fetch(`${baseUrl}/api/projects/${projectId}/files/generated%2Fdesign.html/versions`);
    expect(versions.status).toBe(200);
    const versionBody = await versions.json() as { versions: Array<{ version: number; source: string }> };
    expect(versionBody.versions).toEqual(expect.arrayContaining([
      expect.objectContaining({ version: 1, source: 'ai' }),
    ]));
  });

  it('lists, reads, and cancels a durable project generation job', async () => {
    const projectId = await createProject();
    if (!process.env.OD_DATA_DIR) throw new Error('OD_DATA_DIR is required for daemon route tests');
    const db = openDatabase(process.cwd(), { dataDir: process.env.OD_DATA_DIR });
    const job = createDesignBuddyGenerationJob(db, {
      provider: 'custom-model',
      projectId,
      request: {
        prompt: 'Create a launch workspace',
        version: 1,
        model: 'auto',
        baseUrl: 'https://gateway.example/v1',
      },
    });

    const list = await fetch(`${baseUrl}/api/db/projects/${projectId}/generation-jobs?provider=custom-model`);
    expect(list.status).toBe(200);
    const listed = await list.json() as { jobs: Array<{ id: string; status: string }> };
    expect(listed.jobs).toEqual([
      expect.objectContaining({
        id: job.id,
        status: 'running',
      }),
    ]);
    expect(JSON.stringify(listed)).not.toMatch(/apiKey|authorization/i);

    const read = await fetch(`${baseUrl}/api/db/generation-jobs/${job.id}`);
    expect(read.status).toBe(200);
    const readBody = await read.json() as Record<string, unknown>;
    expect(readBody).toMatchObject({
      id: job.id,
      projectId,
      provider: 'custom-model',
      status: 'running',
    });
    expect(readBody).not.toHaveProperty('request');
    expect(JSON.stringify(readBody)).not.toMatch(/apiKey|authorization/i);

    const cancel = await fetch(`${baseUrl}/api/db/generation-jobs/${job.id}`, { method: 'DELETE' });
    expect(cancel.status).toBe(204);
    const canceled = await fetch(`${baseUrl}/api/db/generation-jobs/${job.id}`);
    await expect(canceled.json()).resolves.toMatchObject({
      id: job.id,
      status: 'canceled',
      error: { code: 'GENERATION_CANCELED' },
    });
  });

  it('marks an orphaned running job interrupted when routes restart', async () => {
    const projectId = await createProject();
    if (!process.env.OD_DATA_DIR) throw new Error('OD_DATA_DIR is required for daemon route tests');
    const db = openDatabase(process.cwd(), { dataDir: process.env.OD_DATA_DIR });
    const job = createDesignBuddyGenerationJob(db, {
      provider: 'agnes',
      projectId,
      request: { prompt: 'Create a durable launch page', version: 1 },
    });

    await new Promise<void>((resolve) => server.close(() => resolve()));
    const restarted = await startServer({ port: 0, returnServer: true }) as { url: string; server: http.Server };
    baseUrl = restarted.url;
    server = restarted.server;

    const recovered = await fetch(`${baseUrl}/api/db/generation-jobs/${job.id}`);
    expect(recovered.status).toBe(200);
    await expect(recovered.json()).resolves.toMatchObject({
      id: job.id,
      projectId,
      provider: 'agnes',
      status: 'interrupted',
      error: {
        code: 'GENERATION_INTERRUPTED',
        status: 503,
      },
    });
  });
});
