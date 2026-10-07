import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { JSDOM, VirtualConsole } from 'jsdom';
import { describe, expect, it } from 'vitest';

const studio = readFileSync(resolve(__dirname, '../public/studio.html'), 'utf8');

function responseFor(url: string): unknown {
  if (url.includes('/api/db/agnes/config')) return { configured: true };
  if (url.includes('/api/test/connection')) {
    return { ok: true, kind: 'success', model: 'auto', latencyMs: 24, sample: 'OK' };
  }
  if (url.includes('/api/db/profile')) return { displayName: 'Model Tester' };
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

function modelButtons(document: Document): HTMLButtonElement[] {
  return Array.from(document.querySelectorAll<HTMLButtonElement>('#modelOptions .model-option'));
}

function modelButton(
  document: Document,
  name: string,
  provider?: string,
): HTMLButtonElement | undefined {
  return modelButtons(document).find((button) =>
    button.querySelector('.model-option-name')?.textContent === name
    && (!provider || button.dataset.provider === provider));
}

describe('DesignBuddy custom-model synchronization interactions', () => {
  it('connects, adds, renames, persists, and safely deletes synchronized models', async () => {
    const scriptErrors: string[] = [];
    const virtualConsole = new VirtualConsole();
    virtualConsole.on('jsdomError', (error) => scriptErrors.push(error.message));
    const dom = new JSDOM(studio, {
      url: 'https://preview.example/studio.html',
      runScripts: 'dangerously',
      pretendToBeVisual: true,
      virtualConsole,
      beforeParse(window) {
        window.fetch = (async (input: RequestInfo | URL) => new Response(
          JSON.stringify(responseFor(String(input))),
          { status: 200, headers: { 'content-type': 'application/json' } },
        )) as typeof fetch;
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
      const { document, localStorage } = dom.window;
      await waitFor(() => modelButtons(document).length === 4);
      expect(modelButtons(document).map((button) =>
        button.querySelector('.model-option-name')?.textContent)).toEqual([
        'agnes-3.0-flash',
        'agnes-image-2.5-flash',
        'agnes-video-2.5-flash',
        'auto',
      ]);

      modelButton(document, 'auto', 'custom')!.click();
      expect(document.getElementById('selectedModelName')?.textContent).toBe('auto');
      expect(localStorage.getItem('db-model')).toMatch(/^custom:/);

      document.getElementById('roleSw')!.click();
      document.querySelector<HTMLButtonElement>('[data-account-action="settings"]')!.click();
      await waitFor(() => Boolean(document.getElementById('settingsContent')));
      document.querySelector<HTMLButtonElement>('[data-settings-section="general"]')!.click();
      await waitFor(() => Boolean(document.getElementById('accountSettingsModel')));
      const generalSelect = document.getElementById('accountSettingsModel') as HTMLSelectElement;
      expect(Array.from(generalSelect.options).map((option) => option.textContent)).toContain(
        'auto · Custom · Connect',
      );
      expect(generalSelect.selectedOptions[0]?.textContent).toBe('auto · Custom · Connect');

      document.querySelector<HTMLButtonElement>('[data-settings-section="models"]')!.click();
      await waitFor(() => Boolean(document.querySelector('[data-model-link="0"]')));
      document.querySelector<HTMLButtonElement>('[data-model-link="0"]')!.click();
      await waitFor(() => modelButton(document, 'auto', 'custom')
        ?.querySelector('.model-badge')?.textContent === 'Connected');
      expect(document.getElementById('customModelTestStatus')?.textContent).toContain('Connected');
      document.getElementById('customModelCancel')!.click();

      document.getElementById('settingsAddModel')!.click();
      (document.getElementById('customModelEndpoint') as HTMLInputElement).value =
        'https://provider.example/v1';
      (document.getElementById('customModelApiKey') as HTMLInputElement).value =
        'interaction-test-key';
      (document.getElementById('customModelName') as HTMLInputElement).value =
        'agnes-3.0-flash';
      (document.getElementById('customModelForm') as HTMLFormElement).requestSubmit();
      await waitFor(() => modelButtons(document).filter((button) =>
        button.querySelector('.model-option-name')?.textContent === 'agnes-3.0-flash').length === 2);

      const collidingCustom = modelButton(document, 'agnes-3.0-flash', 'custom')!;
      expect(collidingCustom.dataset.selectionId).toMatch(/^custom:/);
      expect(collidingCustom.dataset.selectionId).not.toBe('agnes-3.0-flash');
      collidingCustom.click();
      const oldSelection = localStorage.getItem('db-model');
      expect(oldSelection).toBe(collidingCustom.dataset.selectionId);

      document.querySelector<HTMLButtonElement>('[data-model-edit="1"]')!.click();
      (document.getElementById('customModelName') as HTMLInputElement).value = 'renamed-model';
      (document.getElementById('customModelForm') as HTMLFormElement).requestSubmit();
      await waitFor(() => Boolean(modelButton(document, 'renamed-model', 'custom')));
      expect(document.getElementById('selectedModelName')?.textContent).toBe('renamed-model');
      expect(localStorage.getItem('db-model')).toMatch(/^custom:/);
      expect(localStorage.getItem('db-model')).not.toBe(oldSelection);

      document.querySelector<HTMLButtonElement>('[data-model-delete="1"]')!.click();
      await waitFor(() => !modelButton(document, 'renamed-model', 'custom'));
      expect(document.getElementById('selectedModelName')?.textContent).toBe('agnes-3.0-flash');
      expect(localStorage.getItem('db-model')).toBe('agnes-3.0-flash');
      expect(scriptErrors).toEqual([]);
    } finally {
      dom.window.close();
    }
  });
});
