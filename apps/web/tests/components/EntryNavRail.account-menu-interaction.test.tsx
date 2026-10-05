// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import type { WorkspaceBillingResponse, WorkspaceCollabContext } from '@open-design/contracts';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { EntryNavRail, resetWorkspaceDirectoryCache } from '../../src/components/EntryNavRail';
import type { EntrySettingsSection } from '../../src/components/EntrySettingsMenu';
import { I18nProvider } from '../../src/i18n';
import { WORKSPACE_CHROME_ACCOUNT_ACTIONS_ID } from '../../src/components/workspaceChromeActions';

function teamContext(): WorkspaceCollabContext {
  return {
    workspaceId: 'ws-team',
    workspaceType: 'team',
    workspaceMemberId: 'wm-1',
    role: 'owner',
    memberStatus: 'active',
    lifecycleState: 'active',
    billingState: 'active',
    planId: 'team_plus',
    displayName: 'Leaf',
    seatSummary: { seatLimit: 5, usedSeats: 1, availableSeats: 4, isSeatFull: false },
    permissions: { canInviteMembers: true, canViewWorkspaceSettings: true },
  } as unknown as WorkspaceCollabContext;
}

const accountBillingResponse: WorkspaceBillingResponse = {
  summary: {
    workspaceId: null,
    membershipTier: 'team_plus',
    totalAvailableCredits: 3892,
    subscriptionCredits: 3000,
    rechargeCredits: 892,
    balanceUsd: '12.34',
    subscriptionStatus: 'active',
    availableActions: [],
    workspaceBalance: null,
  },
  workspaceBalance: {
    workspaceId: 'ws-team',
    workspaceMemberId: 'wm-1',
    balanceUsd: '12.34',
    billingScopeVersion: 2,
    expiresAt: null,
    updatedAt: null,
  },
};

function renderRail(options: {
  onInvite?: () => void;
  onOpenSettings?: (section?: EntrySettingsSection) => void;
} = {}) {
  return render(
    <I18nProvider initial="zh-CN">
      <EntryNavRail
        view="home"
        onViewChange={() => {}}
        onNewProject={() => {}}
        open
        context={teamContext()}
        billing={null}
        billingResponse={accountBillingResponse}
        {...options}
      />
    </I18nProvider>,
  );
}

function stubFetch() {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('/messages?')) {
        return Response.json({ messages: [], nextCursor: null, unreadCount: 0 });
      }
      if (url.includes('/status')) {
        return Response.json({
          loggedIn: true,
          user: { id: '19932101651', email: 'leaf@example.com' },
        });
      }
      return Response.json({ items: [] });
    }),
  );
}

let chromeActionsHost: HTMLDivElement;

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
  resetWorkspaceDirectoryCache();
  stubFetch();
  const chrome = document.createElement('header');
  chrome.className = 'workspace-tabs-chrome';
  chromeActionsHost = document.createElement('div');
  chromeActionsHost.id = WORKSPACE_CHROME_ACCOUNT_ACTIONS_ID;
  chrome.append(chromeActionsHost);
  document.body.append(chrome);
});

afterEach(() => {
  cleanup();
  resetWorkspaceDirectoryCache();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
  document.querySelector('.workspace-tabs-chrome')?.remove();
});

async function advancePastHoverClose() {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(220);
  });
}

describe('EntryNavRail account menu interaction state', () => {
  it('mounts the top-right cluster in the chrome host and the account row in the rail', async () => {
    renderRail();

    await act(async () => {});
    // The chrome's no-drag host carries the cluster (GitHub chip, credits
    // pill); the identity row itself lives at the foot of the rail's nav
    // column (per product: 账户移到左栏底部).
    expect(screen.getByTestId('entry-top-right-github').closest('#workspace-chrome-account-actions'))
      .toBe(chromeActionsHost);
    const trigger = screen.getByTestId('entry-nav-account');
    expect(trigger.closest('#workspace-chrome-account-actions')).toBeNull();
    expect(trigger.closest('.entry-nav-rail__account-dock')).not.toBeNull();
    expect(trigger.closest('.entry-nav-rail__group')).not.toBeNull();
  });

  it('pins a hover-open menu when the avatar is clicked', async () => {
    renderRail();
    const trigger = screen.getByTestId('entry-nav-account');

    fireEvent.mouseEnter(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    fireEvent.mouseLeave(trigger.closest('.entry-nav-rail__account') as HTMLElement);
    await advancePastHoverClose();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('still closes a hover-only menu after the pointer leaves', async () => {
    renderRail();
    const trigger = screen.getByTestId('entry-nav-account');

    fireEvent.mouseEnter(trigger);
    fireEvent.mouseLeave(trigger.closest('.entry-nav-rail__account') as HTMLElement);
    await advancePastHoverClose();

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('treats a second avatar click as an explicit close', () => {
    renderRail();
    const trigger = screen.getByTestId('entry-nav-account');

    fireEvent.mouseEnter(trigger);
    fireEvent.click(trigger);
    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('does not treat focus loss as a close action after a click pins the menu', () => {
    renderRail();
    const trigger = screen.getByTestId('entry-nav-account');

    fireEvent.mouseEnter(trigger);
    fireEvent.click(trigger);
    fireEvent.blur(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it.each([
    ['Escape', () => fireEvent.keyDown(document, { key: 'Escape' })],
    ['an outside press', () => fireEvent.pointerDown(document.body)],
  ])('keeps %s as an explicit close action', (_label, close) => {
    renderRail();
    const trigger = screen.getByTestId('entry-nav-account');

    fireEvent.mouseEnter(trigger);
    fireEvent.click(trigger);
    close();

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders the account menu rows shown in the reference design', async () => {
    renderRail({ onInvite: vi.fn(), onOpenSettings: vi.fn() });
    const trigger = screen.getByTestId('entry-nav-account');
    fireEvent.mouseEnter(trigger);

    await act(async () => {});

    expect(screen.getByText('19932101651')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: '复制账号 ID' })).toBeInTheDocument();
    expect(screen.getByTestId('entry-account-credits')).toHaveTextContent('3,892');
    expect(screen.getByTestId('entry-account-credits')).not.toHaveTextContent('$12.34');
    expect(screen.getByTestId('entry-account-menu')).not.toHaveTextContent('650');
    expect(screen.getByTestId('entry-account-growth-plan')).toHaveAttribute(
      'href',
      expect.stringContaining('/cloud/dashboard'),
    );
    for (const label of [
      '积分余额',
      'Buddy加油站',
      '邀请成员',
      '成长计划',
      '连登抽取 Buddy 周边',
      '设置',
      '记忆与进化',
      '外观',
      '外观上新',
      '帮助与反馈',
      '检查更新',
      '退出登录',
    ]) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    }
  });

  it('uses the invite callback and a settings deep link from the account menu', () => {
    const onInvite = vi.fn();
    const onOpenSettings = vi.fn();
    renderRail({ onInvite, onOpenSettings });
    const trigger = screen.getByTestId('entry-nav-account');
    fireEvent.mouseEnter(trigger);

    fireEvent.click(screen.getByRole('menuitem', { name: /记忆与进化/ }));
    expect(onOpenSettings).toHaveBeenCalledWith('memory');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    fireEvent.mouseEnter(trigger);
    fireEvent.click(screen.getByRole('menuitem', { name: /邀请成员/ }));
    expect(onInvite).toHaveBeenCalledOnce();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('limits the menu to the space available above the account trigger', () => {
    const originalInnerHeight = window.innerHeight;
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 480 });
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      if (this.classList.contains('entry-nav-rail__account-menu')) {
        return {
          x: 12, y: 280, width: 322, height: 200,
          top: 280, right: 334, bottom: 472, left: 12,
          toJSON: () => ({}),
        } as DOMRect;
      }
      if (this.classList.contains('entry-nav-rail__panel')) {
        return {
          x: 12, y: 400, width: 236, height: 80,
          top: 400, right: 248, bottom: 480, left: 12,
          toJSON: () => ({}),
        } as DOMRect;
      }
      return {
        x: 0, y: 0, width: 0, height: 0,
        top: 0, right: 0, bottom: 0, left: 0,
        toJSON: () => ({}),
      } as DOMRect;
    });

    try {
      renderRail({ onInvite: vi.fn() });
      fireEvent.mouseEnter(screen.getByTestId('entry-nav-account'));
      expect(screen.getByTestId('entry-account-menu')).toHaveStyle({ maxHeight: '61px' });
    } finally {
      Object.defineProperty(window, 'innerHeight', { configurable: true, value: originalInnerHeight });
    }
  });

  it('copies the live account identifier from the menu header', async () => {
    const writeText = vi.fn(async () => {});
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    renderRail({ onInvite: vi.fn() });
    fireEvent.mouseEnter(screen.getByTestId('entry-nav-account'));
    await act(async () => {});

    fireEvent.click(screen.getByRole('menuitem', { name: '复制账号 ID' }));
    await act(async () => {});
    expect(writeText).toHaveBeenCalledWith('19932101651');
  });
});
