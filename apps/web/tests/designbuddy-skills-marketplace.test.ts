import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';

const publicRoot = resolve(__dirname, '../public');
const studio = readFileSync(resolve(publicRoot, 'studio.html'), 'utf8');
const skillsScript = readFileSync(resolve(publicRoot, 'studio-skills.js'), 'utf8');
const skillsStyles = readFileSync(resolve(publicRoot, 'studio-skills.css'), 'utf8');

function click(window: JSDOM['window'], element: Element | null): void {
  if (!element) throw new Error('Expected a clickable element');
  element.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
}

function skill(index: number) {
  const groups = [
    { id: 'development', category: 'developer-tools', mode: 'prototype', name: '代码质量审查' },
    { id: 'content', category: 'content-writing', mode: 'template', name: '品牌内容写作' },
    { id: 'data', category: 'data-analysis', mode: 'template', name: '数据洞察分析' },
    { id: 'office', category: 'office-collaboration', mode: 'deck', name: '办公文档协作' },
    { id: 'commerce', category: 'business-operations', mode: 'template', name: '商业运营规划' },
    { id: 'knowledge', category: 'knowledge-learning', mode: 'template', name: '知识研究整理' },
  ];
  const group = groups[index % groups.length]!;
  return {
    id: `${group.id}-skill-${index}`,
    name: `${group.id}-skill-${index}`,
    displayName: { 'zh-CN': `${group.name} ${index + 1}`, en: `${group.id} skill ${index + 1}` },
    description: `A real workspace skill for ${group.category}`,
    descriptionI18n: { 'zh-CN': `来自工作区的${group.name}专业技能。`, en: `A workspace ${group.id} skill.` },
    triggers: [group.id, `task-${index}`],
    mode: group.mode,
    category: group.category,
    source: index % 7 === 0 ? 'user' : 'built-in',
    featured: index < 8 ? 100 - index : null,
    examplePrompt: `Complete task ${index}`,
    examplePromptI18n: { 'zh-CN': `完成第 ${index + 1} 个示例任务`, en: `Complete example task ${index + 1}` },
  };
}

describe('DesignBuddy standalone Skills marketplace', () => {
  it('places Skills directly below Templates for every role and exposes a full-width route', () => {
    expect(studio).toContain('<link rel="stylesheet" href="/studio-skills.css" />');
    expect(studio).toContain('<script src="/studio-skills.js"></script>');
    expect(studio).toContain('id="view-skills"');
    expect(studio).toContain('templates: "navTemplates", skills: "navSkills"');
    expect(studio).toContain('"templates", "skills"');
    expect(studio).toContain('inner.classList.toggle("skills-wall", v === "skills")');
    expect(studio).toContain('main.classList.toggle("skills-wall", v === "skills")');

    const roleNavs = [...studio.matchAll(/nav: \[([^\]]+)]/g)].map((match) => match[1]!);
    expect(roleNavs).toHaveLength(8);
    roleNavs.forEach((nav) => {
      expect(nav).toContain('"templates"');
      expect(nav).toContain('"skills"');
      expect(nav.indexOf('"skills"')).toBeGreaterThan(nav.indexOf('"templates"'));
      expect(nav.slice(nav.indexOf('"templates"'))).toMatch(/^"templates", "skills"/);
    });

    expect(skillsStyles).toContain('grid-template-columns: repeat(5, minmax(0, 1fr))');
    expect(skillsStyles).toContain('.main-inner.skills-wall');
    expect(skillsStyles).toContain('@media (max-width: 620px)');
  });

  it('renders daemon-shaped skill data and supports filters, suites, details, refresh, and composer handoff', async () => {
    const dom = new JSDOM(studio, {
      url: 'https://designbuddy.test/studio.html#/skills',
      runScripts: 'outside-only',
      pretendToBeVisual: true,
    });
    const { window } = dom;
    const { document } = window;
    const items = Array.from({ length: 42 }, (_, index) => skill(index));
    const toasts: string[] = [];
    const attached: Array<{ id: string; name: string }> = [];
    const detached: string[] = [];
    const hostState: { selSkill: { id: string; name: string } | null } = { selSkill: null };
    let refreshes = 0;

    Object.defineProperty(window.HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value() {},
    });
    Object.defineProperty(window, 'StudioWorkbenchHost', {
      configurable: true,
      value: {
        getState() { return hostState; },
        $(id: string) { return document.getElementById(id); },
        go(view: string) { window.location.hash = `/${view}`; },
        toast(message: string) { toasts.push(message); },
        attachSkill(value: { id: string; name: string }) {
          attached.push(value);
          hostState.selSkill = value;
          return true;
        },
        detachSkill(id: string) {
          detached.push(id);
          if (hostState.selSkill?.id === id) hostState.selSkill = null;
          return true;
        },
        ensureSkills(force: boolean) {
          if (force) refreshes += 1;
          return Promise.resolve(items);
        },
      },
    });

    window.eval(skillsScript);
    const api = (window as typeof window & {
      StudioSkills: {
        setItems(items: unknown[]): void;
        setLanguage(lang: string): void;
      };
    }).StudioSkills;
    api.setItems(items);

    expect(document.querySelectorAll('#skillsFeaturedGrid .skills-feature-card')).toHaveLength(5);
    expect(document.querySelectorAll('#skillsGrid .skills-card')).toHaveLength(30);
    expect(document.getElementById('skillsResultsMeta')?.textContent).toContain('42');
    expect((document.getElementById('skillsLoadMore') as HTMLButtonElement).hidden).toBe(false);

    const search = document.getElementById('skillsSearch') as HTMLInputElement;
    search.value = '代码质量审查 1';
    search.dispatchEvent(new window.Event('input', { bubbles: true }));
    expect(document.querySelectorAll('#skillsGrid .skills-card').length).toBeGreaterThan(0);
    expect(document.getElementById('skillsGrid')?.textContent).toContain('代码质量审查');

    search.value = '';
    search.dispatchEvent(new window.Event('input', { bubbles: true }));
    click(window, document.querySelector('[data-skills-category="development"]'));
    expect(document.querySelectorAll('#skillsGrid .skills-card')).toHaveLength(7);
    expect(document.getElementById('skillsGrid')?.textContent).toContain('代码质量审查');

    const firstAdd = document.querySelector('#skillsGrid [data-skill-toggle]');
    const firstId = firstAdd?.getAttribute('data-skill-toggle');
    click(window, firstAdd);
    expect(attached.at(-1)?.id).toBe(firstId);
    expect(window.localStorage.getItem('db-studio-skills')).toContain(firstId);
    expect(toasts.at(-1)).toContain('添加到创作器');

    const firstCard = document.querySelector('#skillsGrid [data-skill-open]');
    click(window, firstCard);
    expect((document.getElementById('skillsDetail') as HTMLElement).hidden).toBe(false);
    expect(document.getElementById('skillsDetailBody')?.textContent).toContain('示例任务');
    click(window, document.getElementById('skillsDetailUse'));
    expect(window.location.hash).toBe('#/home');
    expect((document.getElementById('prompt') as HTMLTextAreaElement).value).toContain('请使用');

    click(window, document.querySelector('[data-skills-tab="suites"]'));
    expect(document.querySelectorAll('#skillsGrid .skills-suite-card')).toHaveLength(6);
    const suiteAction = document.querySelector('#skillsGrid [data-suite-open="development"]');
    click(window, suiteAction);
    expect(document.querySelector('[data-skills-tab="hub"]')?.classList.contains('active')).toBe(true);
    expect(document.querySelector('[data-skills-category="development"]')?.classList.contains('active')).toBe(true);

    click(window, document.getElementById('skillsRefresh'));
    await new Promise((resolvePromise) => window.setTimeout(resolvePromise, 0));
    expect(refreshes).toBe(1);
    expect(document.querySelectorAll('#skillsFeaturedGrid .skills-feature-card')).toHaveLength(5);

    api.setLanguage('en');
    expect(document.querySelector('[data-skills-tab="recommended"]')?.textContent).toBe('Recommended');
    expect(document.getElementById('skillsSearch')?.getAttribute('placeholder')).toBe('Search skills');

    // The same plus button removes a selected skill instead of creating a fake duplicate.
    click(window, document.querySelector(`#skillsGrid [data-skill-toggle="${firstId}"]`));
    if (document.querySelector(`#skillsGrid [data-skill-toggle="${firstId}"]`)) {
      expect(detached).toContain(firstId);
    }

    dom.window.close();
  });
});
