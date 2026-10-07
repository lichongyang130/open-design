import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';

const publicRoot = resolve(__dirname, '../public');
const repoRoot = resolve(__dirname, '../../..');
const login = readFileSync(resolve(publicRoot, 'login.html'), 'utf8');
const role = readFileSync(resolve(publicRoot, 'role.html'), 'utf8');
const studio = readFileSync(resolve(publicRoot, 'studio.html'), 'utf8');
const templates = readFileSync(resolve(publicRoot, 'studio-templates.js'), 'utf8');
const previewScript = readFileSync(resolve(repoRoot, 'scripts/preview-studio.mjs'), 'utf8');
const rootPackage = JSON.parse(readFileSync(resolve(repoRoot, 'package.json'), 'utf8')) as {
  scripts?: Record<string, string>;
};

function functionBody(source: string, name: string, nextName: string): string {
  const start = source.indexOf(`function ${name}`);
  const end = source.indexOf(`function ${nextName}`, start + 1);
  if (start < 0 || end < 0) throw new Error(`Could not isolate ${name}`);
  return source.slice(start, end);
}

describe('DesignBuddy Studio reliability contracts', () => {
  it('derives the Arena preview origin and health-gates both public services', () => {
    expect(rootPackage.scripts?.['preview-studio']).toBe('node ./scripts/preview-studio.mjs');
    expect(previewScript).toContain('process.env.E2B_SANDBOX_ID');
    expect(previewScript).toContain("OD_BIND_HOST: '0.0.0.0'");
    expect(previewScript).toContain("OD_HOST: '0.0.0.0'");
    expect(previewScript).toContain('/api/health');
    expect(previewScript).toContain('/api/db/starter-projects/initialize');
    expect(previewScript).toContain("['designer', 'pm', 'dev', 'admin']");
    expect(previewScript).toContain('/studio.html');
  });

  it('uses an explicit persisted local workspace instead of simulated authentication', () => {
    expect(login).toContain('本地工作区');
    expect(login).toContain('/api/db/profile');
    expect(login).toContain('db-auth=local-workspace');
    expect(login).not.toContain('type="password"');
    expect(login).not.toContain('id="google"');
    expect(login).not.toContain('id="github"');
    expect(login).not.toContain('fakeAsync');
    expect(login).not.toContain('db-auth=demo');
  });

  it('waits for role persistence before navigating away from onboarding', () => {
    const save = functionBody(role, 'saveRole', 'render');
    expect(save).toContain('return fetch("/api/db/role"');
    expect(role).toContain('saveRole().then(function ()');
    expect(role).toContain('button.disabled = false');
  });

  it('blocks generation before project creation when Agnes is unavailable', () => {
    const submit = functionBody(studio, 'submitPrompt', 'esc');
    expect(submit).toContain('refreshAgnesConfig()');
    expect(submit).toContain('if (!configured)');
    expect(submit).toContain('modelRequired');
    expect(submit.indexOf('if (!configured)')).toBeLessThan(submit.indexOf('createRealProject(v)'));
    const create = functionBody(studio, 'createRealProject', 'currentTemplateRoute');
    expect(create).not.toContain('离线演示');
    expect(create).not.toContain('openGen({ id: id');
    expect(create).toContain('projectCreateFailed');
  });

  it('only advertises live plus-menu resources', () => {
    const menuStart = studio.indexOf('var PLUS_MENU = [');
    const menuEnd = studio.indexOf('];', menuStart);
    const menu = studio.slice(menuStart, menuEnd);
    expect(menu).toContain('k: "ref"');
    expect(menu).toContain('k: "skill"');
    expect(menu).toContain('k: "plugin"');
    expect(menu).not.toMatch(/k: "(?:attach|link|figma|conn|mcp)"/);
    expect(studio).toContain('<div class="cp-dir" hidden>');
  });

  it('scopes persisted projects to the active role and initializes all roles', () => {
    const render = functionBody(studio, 'renderProjects', 'renderHomeRecent');
    expect(render).toContain('project.role === state.role');
    expect(render).not.toContain('real.concat(samples)');
    const initialize = functionBody(studio, 'ensureRoleStarterProjects', 'loadProjects');
    expect(initialize).toContain('{ role: requestedRole }');
    expect(initialize).not.toContain('state.role !== "designer"');
  });

  it('lets the Projects gallery and live artifact thumbnails cover all available space', () => {
    expect(studio).toContain('.main.projects-wall { align-items: stretch; padding: 24px 24px 52px; }');
    expect(studio).toContain('.main-inner.project-wall { width: 100%; max-width: none; }');
    expect(studio).toContain('grid-template-columns: repeat(3, minmax(0, 1fr))');
    expect(studio).toContain('aspect-ratio: 16 / 10; min-height: 280px');
    expect(studio).toContain('.pcard .thumb.real iframe { position: absolute; inset: 0;');
    const apply = functionBody(studio, 'applyView', 'closePicker');
    expect(apply).toContain('inner.classList.toggle("project-wall", v === "projects")');
    expect(apply).toContain('main.classList.toggle("projects-wall", v === "projects")');
    const thumbnail = functionBody(studio, 'projectThumbnailDocument', 'renameRealProject');
    expect(thumbnail).toContain('width:100%!important;height:100%!important;overflow:hidden!important');
    expect(thumbnail).toContain('.wrap,.shell,.wide,.project{width:100vw!important;max-width:none!important');
    expect(thumbnail).toContain('.hero{min-height:100vh!important}');
  });

  it('round-trips a shared template id and page through the hash router', async () => {
    const dom = new JSDOM('<!doctype html><body></body>', {
      pretendToBeVisual: true,
      runScripts: 'outside-only',
      url: 'https://preview.example/studio.html#/templates',
    });
    let copiedUrl = '';
    Object.defineProperty(dom.window.navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async (value: string) => { copiedUrl = value; } },
    });
    dom.window.eval(templates);
    const library = (dom.window as unknown as {
      StudioTemplates: { items: Array<{ id: string }>; open: (id: string, options: object) => boolean };
    }).StudioTemplates;
    const templateId = library.items[0]!.id;
    expect(library.open(templateId, { lang: 'en', page: 7 })).toBe(true);
    dom.window.document.getElementById('tplShareButton')!.click();
    await Promise.resolve();
    expect(copiedUrl).toContain(`#/templates/${encodeURIComponent(templateId)}/8`);

    const routeSource = functionBody(studio, 'currentTemplateRoute', 'currentView');
    const parseRoute = Function('location', `${routeSource}; return currentTemplateRoute();`) as (
      location: { hash: string },
    ) => { id: string; page: number } | null;
    const parsed = parseRoute({ hash: new URL(copiedUrl).hash });
    expect(parsed).toEqual({ id: templateId, page: 7 });
    expect(studio).toContain('openTemplatePreview(templateRoute.id, templateRoute.page, true)');
    expect(studio).not.toContain('#template=');
    dom.window.close();
  });

  it('escapes server-backed review, project-picker, and design-system content', () => {
    const helperStart = studio.indexOf('function esc(x)');
    const helperEnd = studio.indexOf('var GEN_KIND_KEY', helperStart);
    const helpers = Function(`${studio.slice(helperStart, helperEnd)}; return { esc, safeCssColor };`)() as {
      esc: (value: unknown) => string;
      safeCssColor: (value: unknown, fallback: string) => string;
    };
    const attack = '<img src=x onerror="window.__designBuddyXss=1"><script>window.__designBuddyXss=2<\/script>';
    const escaped = helpers.esc(attack);
    const dom = new JSDOM(`<main>${escaped}</main>`, { runScripts: 'dangerously' });
    expect(dom.window.document.querySelector('img,script')).toBeNull();
    expect((dom.window as unknown as { __designBuddyXss?: number }).__designBuddyXss).toBeUndefined();
    expect(helpers.safeCssColor('red; background:url(javascript:alert(1))', '#e8e8e8')).toBe('#e8e8e8');
    dom.window.close();

    const picker = functionBody(studio, 'renderPkList', 'positionPickerPanel');
    expect(picker).toContain('esc(it.name)');
    expect(picker).toContain('esc(it.desc || it.tag || it.id)');
    const systems = functionBody(studio, 'renderSystems', 'renderCommunity');
    expect(systems).toContain('esc(s.title || s.id || "")');
    expect(systems).toContain('esc(s.summary || s.category || "")');
    expect(systems).toContain('safeCssColor');
    const reviews = functionBody(studio, 'drawReview', 'renderReview');
    expect(reviews).toContain('esc(reviewTitle)');
    expect(reviews).toContain('esc(reviewAuthor)');
    expect(reviews).toContain('safeCssColor(r.avc');
  });
});
