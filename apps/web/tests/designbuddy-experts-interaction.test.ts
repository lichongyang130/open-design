import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';

const publicRoot = resolve(__dirname, '../public');
const studio = readFileSync(resolve(publicRoot, 'studio.html'), 'utf8');
const experts = readFileSync(resolve(publicRoot, 'studio-experts.js'), 'utf8');
const expertStyles = readFileSync(resolve(publicRoot, 'studio-experts.css'), 'utf8');

function click(window: JSDOM['window'], element: Element | null): void {
  if (!element) throw new Error('Expected a clickable element');
  element.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
}

describe('DesignBuddy expert marketplace', () => {
  it('places Experts immediately above Templates and exposes the full-width route', () => {
    expect(studio).toContain('<link rel="stylesheet" href="/studio-experts.css" />');
    expect(studio).toContain('<script src="/studio-experts.js"></script>');
    expect(studio).toContain('id="view-experts"');
    expect(studio).toContain('"brain", "experts", "templates"');
    expect(studio).toContain('experts: "navExperts"');
    expect(studio).toContain('inner.classList.toggle("expert-wall", v === "experts")');
    expect(studio).toContain('main.classList.toggle("experts-wall", v === "experts")');

    const roleNavs = [...studio.matchAll(/nav: \[([^\]]+)]/g)].map((match) => match[1]!);
    expect(roleNavs).toHaveLength(8);
    roleNavs.forEach((nav) => expect(nav).toContain('"experts"'));
    roleNavs.filter((nav) => nav.includes('"templates"')).forEach((nav) => {
      expect(nav.indexOf('"experts"')).toBeLessThan(nav.indexOf('"templates"'));
    });

    expect(expertStyles).toContain('grid-template-columns: repeat(4, minmax(218px, 1fr))');
    expect(expertStyles).toContain('.main-inner.expert-wall');
    expect(expertStyles).toContain('@media (max-width: 620px)');
  });

  it('supports search, catalog tabs, saved experts, skills, connectors, details, and composer handoff', async () => {
    const dom = new JSDOM(studio, {
      url: 'https://designbuddy.test/studio.html#/experts',
      runScripts: 'outside-only',
      pretendToBeVisual: true,
    });
    const { window } = dom;
    const { document } = window;
    const toasts: string[] = [];

    Object.defineProperty(window.HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value() {},
    });
    Object.defineProperty(window.HTMLElement.prototype, 'scrollBy', {
      configurable: true,
      value() {},
    });
    Object.defineProperty(window, 'StudioWorkbenchHost', {
      configurable: true,
      value: {
        $(id: string) { return document.getElementById(id); },
        go(view: string) { window.location.hash = `/${view}`; },
        toast(message: string) { toasts.push(message); },
      },
    });

    window.eval(experts);

    expect(document.querySelectorAll('#expertSpotlights .expert-spotlight-card')).toHaveLength(6);
    expect(document.querySelectorAll('#expertGrid .expert-card').length).toBeGreaterThanOrEqual(18);
    expect(document.querySelector('#expertGrid')?.textContent).toContain('UI设计师');
    expect(document.querySelector('#expertGrid')?.textContent).toContain('代码审查专家');

    const search = document.getElementById('expertSearch') as HTMLInputElement;
    search.value = '代码审查';
    search.dispatchEvent(new window.Event('input', { bubbles: true }));
    expect(document.querySelectorAll('#expertGrid .expert-card')).toHaveLength(1);
    expect(document.querySelector('#expertGrid')?.textContent).toContain('代码审查专家');

    search.value = '';
    search.dispatchEvent(new window.Event('input', { bubbles: true }));
    click(window, document.querySelector('[data-expert-catalog="teams"]'));
    expect(document.querySelectorAll('#expertGrid .expert-card-team')).toHaveLength(6);
    expect(document.querySelector('#expertGrid')?.textContent).toContain('深度研究团队');

    click(window, document.querySelector('[data-expert-mode="skills"]'));
    expect(document.querySelectorAll('#expertGrid .expert-card')).toHaveLength(12);
    expect(document.querySelector('#expertGrid')?.textContent).toContain('设计系统生成');

    click(window, document.querySelector('[data-expert-mode="connectors"]'));
    expect(document.querySelectorAll('#expertGrid [data-connector]')).toHaveLength(10);
    const github = document.querySelector('[data-connector="github"] [data-action="connector"]');
    click(window, github);
    expect(window.localStorage.getItem('db-expert-connectors')).toContain('github');
    expect(document.querySelector('[data-connector="github"]')?.textContent).toContain('已连接');

    click(window, document.querySelector('[data-expert-mode="experts"]'));
    const favorite = document.querySelector('#expertGrid [data-id="career-coach"] [data-action="favorite"]');
    click(window, favorite);
    expect(window.localStorage.getItem('db-saved-experts')).toContain('career-coach');
    click(window, document.getElementById('expertMine'));
    expect(document.querySelectorAll('#expertGrid .expert-card')).toHaveLength(1);
    expect(document.querySelector('#expertGrid')?.textContent).toContain('求职顾问');

    click(window, document.querySelector('#expertGrid [data-action="detail"]'));
    expect((document.getElementById('expertDetail') as HTMLElement).hidden).toBe(false);
    expect(document.getElementById('expertDetailBody')?.textContent).toContain('推荐任务');
    click(window, document.getElementById('expertDetailUse'));
    const prompt = document.getElementById('prompt') as HTMLTextAreaElement;
    expect(prompt.value).toContain('求职顾问');
    expect(window.location.hash).toBe('#/home');
    await new Promise((resolvePromise) => window.setTimeout(resolvePromise, 60));
    expect(toasts.some((message) => message.includes('求职顾问'))).toBe(true);

    (window as typeof window & { StudioExperts: { setLanguage(lang: string): void } }).StudioExperts.setLanguage('en');
    expect(document.querySelector('[data-expert-mode="experts"] span')?.textContent).toBe('Experts');
    expect(document.getElementById('expertSearch')?.getAttribute('placeholder')).toBe('Search experts');

    dom.window.close();
  });
});
