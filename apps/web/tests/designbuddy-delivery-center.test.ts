import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';

const publicRoot = resolve(__dirname, '../public');
const studio = readFileSync(resolve(publicRoot, 'studio.html'), 'utf8');
const workbench = readFileSync(resolve(publicRoot, 'studio-workbench.js'), 'utf8');
const styles = readFileSync(resolve(publicRoot, 'studio-workbench.css'), 'utf8');

async function waitFor(check: () => boolean, timeoutMs = 1500): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (!check()) {
    if (Date.now() > deadline) throw new Error('Timed out waiting for Delivery Center');
    await new Promise((resolveWait) => setTimeout(resolveWait, 10));
  }
}

describe('DesignBuddy Delivery Center', () => {
  it('keeps durable generation recovery and browser artifact persistence wired into Studio', () => {
    expect(studio).toContain('/generation-jobs?limit=8');
    expect(studio).toContain('/api/db/generation-jobs/');
    expect(studio).toContain('/generated-artifacts');
    expect(studio).toContain('function resumeDurableGenerationJob');
    expect(studio).toContain('function persistGeneratedTextArtifact');
    expect(studio).toContain('StudioWorkbench.reloadFiles');
    expect(studio).toContain('artifact.quality');
    expect(studio).toContain('{ id: "delivery"');
    expect(studio).toContain('window.StudioWorkbench.open(d.id)');
  });

  it('surfaces versioned delivery formats and actionable lint findings', async () => {
    const dom = new JSDOM(studio, {
      url: 'https://designbuddy.test/studio.html#/gen',
      runScripts: 'outside-only',
      pretendToBeVisual: true,
    });
    const { window } = dom;
    const { document } = window;
    const requested: string[] = [];
    const downloaded: string[] = [];
    const state = {
      lang: 'zh',
      role: 'designer',
      model: 'agnes-3.0-flash',
      gen: {
        status: 'done',
        events: [{
          type: 'artifact',
          payload: {
            name: 'Northstar launch',
            version: 2,
            kind: 'landing',
            surface: 'text',
            fileName: 'generated/design.html',
            quality: {
              status: 'needs-attention',
              counts: { p0: 1, p1: 0, p2: 0 },
              findings: [{
                severity: 'P0',
                id: 'purple-gradient',
                message: 'Avoid the default violet gradient.',
                fix: 'Use a flat brand surface token.',
                snippet: 'linear-gradient(...)',
              }],
            },
          },
        }],
      },
    };

    Object.defineProperty(window.URL, 'createObjectURL', {
      configurable: true,
      value: () => 'blob:https://designbuddy.test/export',
    });
    Object.defineProperty(window.URL, 'revokeObjectURL', {
      configurable: true,
      value: () => undefined,
    });
    window.HTMLAnchorElement.prototype.click = function click() {
      downloaded.push(this.download);
    };
    window.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      requested.push(`${init?.method ?? 'GET'} ${url}`);
      if (url.includes('/export/html')) {
        return new Response('<!doctype html><title>Export</title>', {
          status: 200,
          headers: {
            'content-type': 'text/html',
            'content-disposition': 'attachment; filename="northstar.html"',
          },
        });
      }
      if (url.includes('/raw/') || url.includes('/files/')) {
        return new Response('<!doctype html><section data-od-id="hero">Northstar</section>', {
          status: 200,
          headers: { 'content-type': 'text/html' },
        });
      }
      return new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } });
    }) as typeof fetch;

    Object.defineProperty(window, 'StudioWorkbenchHost', {
      configurable: true,
      value: {
        $(id: string) { return document.getElementById(id); },
        getState() { return state; },
        cleanErrorMessage(error: unknown) { return error instanceof Error ? error.message : String(error); },
        projectFileUrl(_projectId: string, name: string) { return `/api/projects/project-1/files/${name}`; },
        apiGet(path: string) {
          requested.push(`GET ${path}`);
          if (path.endsWith('/files')) {
            return Promise.resolve({ files: [{ name: 'generated/design.html', mime: 'text/html', size: 4200, mtime: 2 }] });
          }
          if (path.endsWith('/export/manifest')) {
            return Promise.resolve({
              projectId: 'project-1',
              projectName: 'Northstar launch',
              entryFile: 'generated/design.html',
              files: [{ name: 'generated/design.html', role: 'entry', kind: 'html' }],
              artifacts: [{ file: 'generated/design.html', kind: 'html', exports: ['html', 'pdf', 'zip'] }],
            });
          }
          return Promise.resolve({});
        },
        apiSend(path: string) {
          requested.push(`POST ${path}`);
          return Promise.resolve({ findings: [], agentMessage: '' });
        },
        apiRequest() { return Promise.resolve({}); },
        toast() {},
        renderGenFiles() {},
        renderGenActions() {},
        startGenTurn() {},
        loadSystems() {},
      },
    });

    try {
      window.eval(workbench);
      const api = (window as unknown as { StudioWorkbench: { onProjectOpen(id: string, name: string): void; open(kind: string): Promise<void> } }).StudioWorkbench;
      api.onProjectOpen('project-1', 'Northstar launch');
      await api.open('delivery');
      await waitFor(() => document.querySelectorAll('[data-delivery-export]').length === 6);

      expect(document.getElementById('genWorkbench')?.textContent).toContain('交付中心');
      expect(document.getElementById('genWorkbench')?.textContent).toContain('Northstar launch');
      expect(document.getElementById('genWorkbench')?.textContent).toContain('Avoid the default violet gradient.');
      expect(document.getElementById('genWorkbench')?.textContent).toContain('Use a flat brand surface token.');
      expect([...document.querySelectorAll('[data-delivery-export]')].map((node) => node.getAttribute('data-delivery-export')))
        .toEqual(['html', 'zip', 'pdf', 'pptx', 'image', 'manifest']);
      expect((document.querySelector('[data-delivery-export="pptx"]') as HTMLButtonElement).disabled).toBe(true);

      (document.getElementById('gwDeliveryRelint') as HTMLButtonElement).click();
      await waitFor(() => requested.includes('POST /api/artifacts/lint'));
      expect(document.getElementById('genWorkbench')?.textContent).toContain('没有发现阻断问题');

      (document.querySelector('[data-delivery-export="html"]') as HTMLButtonElement).click();
      await waitFor(() => requested.some((entry) => entry.includes('POST /api/projects/project-1/export/html')));
      await waitFor(() => downloaded.includes('northstar.html'));

      expect(styles).toContain('.gw-delivery-grid');
      expect(styles).toContain('.gw-quality-finding');
      expect(workbench).toContain('format === "pdf" ? "pdf-image" : format');
      expect(workbench).toContain('root + "/export/"');
      expect(workbench).toContain('/export/manifest');
    } finally {
      dom.window.close();
    }
  });
});
