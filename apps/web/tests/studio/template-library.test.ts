// @vitest-environment jsdom
/**
 * Regression coverage for the commercial template library that powers the
 * DesignBuddy studio template view (`apps/web/public/studio*.js`).
 *
 * The library is a pair of plain browser scripts, so the suite loads them with
 * the jsdom globals the studio page provides and drives the real modal.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

type LocalizedInfo = { name: string; category: string; desc: string; tags: string[]; pages: string[] };
type TemplateItem = {
  id: string;
  category: string;
  kind: string;
  skin: string;
  accent: string;
  uses: string;
  zh: LocalizedInfo;
  en: LocalizedInfo;
  more?: { zh: string[]; en: string[] };
};
type Library = {
  items: TemplateItem[];
  byId: (id: string) => TemplateItem | null;
  localized: (template: TemplateItem, lang: string) => LocalizedInfo;
  categories: (lang: string) => { id: string; label: string; count: number }[];
  text: (lang: string, key: string, values?: Record<string, string | number>) => string;
  stats: () => { kits: number; screens: number; pages: number };
  subtitle: (lang: string) => string;
  screensOf: (template: TemplateItem, lang: string) => string[];
  cardMarkup: (template: TemplateItem, lang: string) => string;
  featuredMarkup: (template: TemplateItem, lang: string) => string;
  thumbnailMarkup: (template: TemplateItem, lang: string, page?: number) => string;
  artMarkup: (template: TemplateItem, page: number, lang: string, compact: boolean, alternate: boolean) => string;
  open: (id: string | TemplateItem, options?: Record<string, unknown>) => boolean;
  close: () => void;
};

const publicDir = resolve(__dirname, '../../public');

function runInWindow(file: string) {
  const code = readFileSync(resolve(publicDir, file), 'utf8');
  // The studio scripts are classic IIFEs that close over browser globals.
  new Function(code)();
}

function requireLibrary(): Library {
  const library = (window as unknown as { StudioTemplates?: Library }).StudioTemplates;
  if (!library) throw new Error('StudioTemplates was not registered on window');
  return library;
}

let library: Library;

beforeAll(() => {
  runInWindow('studio-templates-catalog.js');
  runInWindow('studio-templates.js');
  library = requireLibrary();
});

function click(node: Element) {
  node.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
}

describe('studio template catalog', () => {
  it('merges the 50-kit catalog into the 18 built-in kits', () => {
    expect(library.items).toHaveLength(68);
    const ids = library.items.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(library.byId('helios-solar-landing')).toBeTruthy();
    expect(library.byId('northstar-saas-console')).toBeTruthy();
  });

  it('ships 13 localized screens for every kit', () => {
    library.items.forEach((item) => {
      expect(item.zh.pages.length, item.id).toBe(13);
      expect(item.en.pages.length, item.id).toBe(13);
      expect(item.zh.name.length, item.id).toBeGreaterThan(1);
      expect(item.en.name.length, item.id).toBeGreaterThan(1);
      expect(item.zh.tags.length, item.id).toBeGreaterThan(1);
    });
  });

  it('reports real library numbers in the subtitle', () => {
    expect(library.stats()).toEqual({ kits: 68, screens: 13, pages: 884 });
    expect(library.subtitle('zh')).toContain('68 套商业级模板');
    expect(library.subtitle('zh')).toContain('884');
    expect(library.subtitle('en')).toContain('68 commercial-grade kits');
    expect(library.subtitle('en')).not.toContain('{');
  });

  it('counts every category from live data', () => {
    const categories = library.categories('zh');
    const all = categories.find((entry) => entry.id === 'all');
    expect(all?.count).toBe(68);
    const summed = categories
      .filter((entry) => entry.id !== 'all')
      .reduce((total, entry) => total + entry.count, 0);
    expect(summed).toBe(68);
  });
});

describe('template artwork', () => {
  it('renders every screen of every kit in both languages without gaps', () => {
    const problems: string[] = [];
    library.items.forEach((item) => {
      (['zh', 'en'] as const).forEach((lang) => {
        for (let page = 0; page < 13; page += 1) {
          const compact = library.artMarkup(item, page, lang, true, false);
          const deep = library.artMarkup(item, page, lang, false, false);
          [compact, deep].forEach((markup) => {
            if (/undefined|NaN|\[object/.test(markup)) problems.push(`${item.id}/${lang}/${page}`);
            const open = (markup.match(/<div/g) || []).length;
            const close = (markup.match(/<\/div>/g) || []).length;
            if (open !== close) problems.push(`${item.id}/${lang}/${page} unbalanced`);
          });
        }
      });
    });
    expect(problems).toEqual([]);
  });

  it('renders thumbnails as framed windows with a scroll hint', () => {
    const card = library.cardMarkup(library.items[20], 'zh');
    expect(card).toContain('tpl-thumb-chrome');
    expect(card).toContain('tpl-thumb-view');
    expect(card).toContain('tpl-thumb-scrollhint');
    expect(card).toContain('tpl-thumb-count');
    expect(library.featuredMarkup(library.items[0], 'zh')).toContain('tpl-thumb-chrome');
  });

  it('hydrates the next screen thumbnail on hover instead of painting it up front', () => {
    const host = document.createElement('div');
    host.innerHTML = library.cardMarkup(library.items[0], 'zh');
    document.body.appendChild(host);
    const thumb = host.querySelector('.tpl-thumb') as HTMLElement;
    expect(thumb).toBeTruthy();
    const pending = host.querySelector('[data-thumb-next]') as HTMLElement;
    expect(pending.getAttribute('data-ready')).toBeNull();
    expect(pending.innerHTML).toBe('');
    thumb.dispatchEvent(new window.MouseEvent('mouseover', { bubbles: true }));
    expect(host.querySelector('[data-thumb-next]')!.getAttribute('data-ready')).toBe('1');
    expect((host.querySelector('[data-thumb-next]') as HTMLElement).innerHTML).toContain('tpl-art');
    host.remove();
  });

  it('renders the full preview as a long page with every commercial chapter', () => {
    const deep = library.artMarkup(library.byId('helios-solar-landing')!, 0, 'zh', false, false);
    [
      'tpl-art--deep',
      'tpl-deep-hero',
      'tpl-band--stats',
      'tpl-band--features',
      'tpl-band--showcase',
      'tpl-band--trust',
      'tpl-band--pricing',
      'tpl-band--faq',
      'tpl-band--cta'
    ].forEach((token) => expect(deep).toContain(token));
  });
});

describe('interactive preview', () => {
  it('opens a scrollable canvas and wires the deep page controls', () => {
    expect(library.open('helios-solar-landing', { lang: 'zh', page: 0 })).toBe(true);
    const scroller = document.getElementById('tplCanvasScroll');
    const frame = document.getElementById('tplPreviewCanvas');
    expect(scroller).toBeTruthy();
    expect(frame).toBeTruthy();
    expect(scroller!.className).toContain('tpl-canvas-scroll');
    expect(scroller!.innerHTML).toContain('tpl-band--pricing');
    expect(scroller!.innerHTML).not.toContain('tpl-canvas-toast');
    expect(document.getElementById('tplCanvasProgress')).toBeTruthy();
    expect(document.getElementById('tplScrollBadge')?.textContent).toBeTruthy();
  });

  it('navigates to another screen when a nav item inside the artwork is clicked', () => {
    library.open('helios-solar-landing', { lang: 'zh', page: 0 });
    const target = document.querySelector('#tplCanvasScroll [data-goto-screen="4"]') as HTMLElement;
    expect(target).toBeTruthy();
    click(target);
    expect(document.getElementById('tplScreenCounter')?.textContent).toContain('05 / 13');
    expect(document.getElementById('tplScreenName')?.textContent).toBe(
      library.localized(library.byId('helios-solar-landing')!, 'zh').pages[4]
    );
  });

  it('gives buttons visible feedback and real state changes', () => {
    library.open('helios-solar-landing', { lang: 'zh', page: 0 });
    const canvas = document.getElementById('tplCanvasScroll')!;

    const action = canvas.querySelector('[data-demo-action]') as HTMLElement;
    expect(action).toBeTruthy();
    click(action);
    expect(document.getElementById('tplCanvasToast')?.textContent).toContain('已触发');
    expect(action.classList.contains('tpl-pressed')).toBe(true);

    const accordion = canvas.querySelector('[data-accordion-toggle]') as HTMLElement;
    const item = accordion.closest('[data-accordion]') as HTMLElement;
    const wasOpen = item.classList.contains('is-open');
    click(accordion);
    expect(item.classList.contains('is-open')).toBe(!wasOpen);

    const yearly = canvas.querySelector('[data-billing="yearly"]') as HTMLElement;
    const price = canvas.querySelector('[data-plan-price]') as HTMLElement;
    const monthly = Number(price.getAttribute('data-plan-price'));
    click(yearly);
    expect(Number(price.textContent)).toBe(monthly * 10);
  });

  it('totals every kit in both languages', () => {
    library.items.forEach((item) => {
      (['zh', 'en'] as const).forEach((lang) => {
        expect(library.open(item.id, { lang, page: 0 })).toBe(true);
        const counter = document.getElementById('tplScreenCounter')?.textContent;
        expect(counter).toContain('/ 13');
        expect(document.getElementById('tplCanvasScroll')!.innerHTML).toContain('tpl-band--cta');
      });
    });
    library.close();
  });
});
