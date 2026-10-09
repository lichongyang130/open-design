// @vitest-environment jsdom
//
// OPEND-3140 — Home carries no 最近项目 grid in the local (signed-out) shell
// either: the rail's 最近项目 section and the 项目 page are the entries, exactly
// as with a cloud identity (OPEND-2683), so the filter / sort / view controls
// the grid brought along leave Home with it.

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

vi.mock('../../src/components/home-hero/PlaceholderCarousel', () => ({
  PlaceholderCarousel: () => null,
}));

import { HomeView } from '../../src/components/HomeView';
import { I18nProvider } from '../../src/i18n';

const PROJECTS = [
  { id: 'p1', name: 'Local landing page', createdAt: 1, updatedAt: 2, skillId: null, designSystemId: null },
  { id: 'p2', name: 'Local brand deck', createdAt: 1, updatedAt: 1, skillId: null, designSystemId: null },
];

function stubFetch() {
  vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input);
    if (url.endsWith('/api/workspace/context')) return Response.json({ context: null });
    if (url.endsWith('/api/plugins')) return Response.json({ plugins: [] });
    return Response.json({});
  }));
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  window.localStorage.clear();
});

describe('HomeView in the local shell', () => {
  it('routes all four office quick actions through the real spreadsheet-repair skill when available', async () => {
    const tasks = [
      { name: 'Check and repair Excel', promptEvidence: 'formula errors, missing values, and anomalies' },
      { name: 'Remove duplicate records', promptEvidence: 'List suspected duplicate rows by sheet and row number' },
      { name: 'Normalize formats and dates', promptEvidence: 'Normalize only clearly equivalent formats' },
      { name: 'Verify formulas and totals', promptEvidence: 'formula gaps and summary anomalies' },
    ];
    const spreadsheetSkill = {
      id: 'spreadsheet-repair',
      name: 'Spreadsheet Troubleshooting & Repair',
      description: 'Inspect and safely repair real spreadsheet files.',
      mode: 'utility',
      surface: 'web',
      source: 'built-in',
      category: 'office',
      aggregatesExamples: false,
    };

    for (const task of tasks) {
      cleanup();
      stubFetch();
      const onSubmit = vi.fn(async () => true);
      render(
        <I18nProvider initial="en">
          <HomeView
            projects={PROJECTS as never}
            skills={[spreadsheetSkill] as never}
            onSubmit={onSubmit}
            onOpenProject={() => undefined}
          />
        </I18nProvider>,
      );
      fireEvent.click(screen.getByRole('button', { name: new RegExp(task.name, 'i') }));
      expect(screen.getByTestId('home-hero-active-skill').textContent).toContain('Spreadsheet Troubleshooting & Repair');
      expect(screen.queryByTestId('office-quick-actions')).toBeNull();
      const submitButton = screen.getByTestId('home-hero-submit');
      expect(submitButton).not.toBeDisabled();
      fireEvent.click(submitButton);
      await waitFor(() => expect(onSubmit).toHaveBeenCalled());
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
        skillId: 'spreadsheet-repair',
        prompt: expect.stringContaining(task.promptEvidence),
      }));
    }
  });

  it('renders the hero without a recent-projects grid or its controls', async () => {
    stubFetch();
    render(
      <I18nProvider initial="en">
        <HomeView
          projects={PROJECTS as never}
          onSubmit={() => undefined}
          onOpenProject={() => undefined}
        />
      </I18nProvider>,
    );
    expect(await screen.findByTestId('home-hero')).toBeTruthy();
    expect(await screen.findByRole('heading', { name: 'What work can I help with today?' })).toBeTruthy();
    expect(screen.getByTestId('office-quick-actions').querySelectorAll('button')).toHaveLength(4);
    expect(screen.queryByTestId('recent-projects-strip')).toBeNull();
    expect(document.querySelector('.recent-projects')).toBeNull();
    expect(screen.queryByText('Local landing page')).toBeNull();
    expect(screen.queryByRole('heading', { name: 'Recent projects' })).toBeNull();
  });
});
