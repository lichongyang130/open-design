import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { JSDOM, VirtualConsole } from 'jsdom';
import { describe, expect, it } from 'vitest';

const studio = readFileSync(resolve(__dirname, '../public/studio.html'), 'utf8');

function responseFor(url: string): unknown {
  if (url.includes('/api/db/agnes/config')) return { configured: true };
  if (url.includes('/api/db/profile')) return { displayName: 'Generation Tester' };
  if (url.includes('/api/db/role')) return { role: 'designer' };
  if (url.includes('/api/db/starter-projects/status')) {
    return { initialized: true, roles: ['designer', 'pm', 'dev', 'admin'] };
  }
  if (url.includes('/api/db/projects/gen-summaries')) return { summaries: [] };
  if (url.includes('/api/projects')) return { projects: [] };
  if (url.includes('/api/db/reviews')) return { reviews: [] };
  if (url.includes('/api/db/stats')) {
    return {
      projects: 0,
      promptsThisMonth: 0,
      quotaTotal: 2000,
      quotaUsed: 0,
      pendingReviews: 0,
      trend: [0],
    };
  }
  if (url.includes('/api/design-systems')) return { designSystems: [] };
  if (url.includes('/api/design-templates')) return { templates: [] };
  if (url.includes('/api/skills')) return { skills: [] };
  if (url.includes('/api/plugins')) return { plugins: [] };
  if (url.includes('/api/db/brain')) return { items: [] };
  return {};
}

async function waitFor(check: () => boolean, timeoutMs = 2000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (!check()) {
    if (Date.now() >= deadline) throw new Error('Timed out waiting for Studio interaction');
    await new Promise((resolveWait) => setTimeout(resolveWait, 10));
  }
}

describe('DesignBuddy optimistic generation entry', () => {
  it('opens the split generation workspace before project creation resolves', async () => {
    const scriptErrors: string[] = [];
    const virtualConsole = new VirtualConsole();
    virtualConsole.on('jsdomError', (error) => scriptErrors.push(error.message));

    let projectCreateStarted = false;
    let projectCreateResolved = false;
    let projectScopedRequestStarted = false;
    let resolveProjectCreate: (response: Response) => void = () => undefined;
    const pendingProjectCreate = new Promise<Response>((resolveCreate) => {
      resolveProjectCreate = resolveCreate;
    });

    const dom = new JSDOM(studio, {
      url: 'https://preview.example/studio.html',
      runScripts: 'dangerously',
      pretendToBeVisual: true,
      virtualConsole,
      beforeParse(window) {
        window.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
          const url = String(input);
          const pathname = new URL(url, 'https://preview.example').pathname;
          if (pathname === '/api/projects' && init?.method === 'POST') {
            projectCreateStarted = true;
            const response = await pendingProjectCreate;
            projectCreateResolved = true;
            return response;
          }
          if (
            init?.method === 'POST'
            && (/^\/api\/db\/projects\/[^/]+\//.test(pathname)
              || /^\/api\/projects\/[^/]+\//.test(pathname))
          ) {
            projectScopedRequestStarted = true;
          }
          return new Response(JSON.stringify(responseFor(url)), {
            status: 200,
            headers: { 'content-type': 'application/json' },
          });
        }) as typeof fetch;
        window.scrollTo = () => undefined;
        window.confirm = () => true;
        window.matchMedia = (() => ({
          matches: false,
          media: '',
          onchange: null,
          addEventListener: () => undefined,
          removeEventListener: () => undefined,
          addListener: () => undefined,
          removeListener: () => undefined,
          dispatchEvent: () => true,
        })) as typeof window.matchMedia;
        window.ResizeObserver = class {
          observe() {}
          unobserve() {}
          disconnect() {}
        };
        window.requestAnimationFrame = (callback) => window.setTimeout(
          () => callback(Date.now()),
          0,
        );
      },
    });

    try {
      const { document } = dom.window;
      await waitFor(() => document.getElementById('selectedModelName')?.textContent === 'agnes-3.0-flash');

      const prompt = 'Design a polished analytics workspace with accessible interactions';
      const promptInput = document.getElementById('prompt') as HTMLTextAreaElement;
      promptInput.value = prompt;
      document.getElementById('send')!.click();

      await waitFor(() => dom.window.location.hash === '#/gen' && projectCreateStarted);

      expect(projectCreateResolved).toBe(false);
      expect(projectScopedRequestStarted).toBe(false);
      expect(document.getElementById('view-gen')?.classList.contains('on')).toBe(true);
      expect(document.querySelector('.main')?.classList.contains('generation-workspace')).toBe(true);
      expect(document.querySelector('.gm-user')?.textContent).toBe(prompt);
      expect(document.getElementById('genStatus')?.textContent).toMatch(/生成中|Generating/);
      expect(document.getElementById('send')?.classList.contains('loading')).toBe(false);

      resolveProjectCreate(new Response(JSON.stringify({
        error: { code: 'PROJECT_CREATE_FAILED', message: 'Project storage is unavailable' },
      }), {
        status: 503,
        headers: { 'content-type': 'application/json' },
      }));
      await waitFor(() => projectCreateResolved
        && /失败|failed|error/i.test(document.getElementById('genStatus')?.textContent ?? ''));

      expect(dom.window.location.hash).toBe('#/gen');
      expect((document.getElementById('genPrompt') as HTMLTextAreaElement).disabled).toBe(true);
      expect(document.querySelector('.gm-ai')?.textContent).toContain('Project storage is unavailable');
      expect(scriptErrors).toEqual([]);
    } finally {
      dom.window.close();
    }
  });
});
