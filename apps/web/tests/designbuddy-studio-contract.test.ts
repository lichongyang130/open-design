import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';

const publicRoot = resolve(__dirname, '../public');
const repoRoot = resolve(__dirname, '../../..');
const login = readFileSync(resolve(publicRoot, 'login.html'), 'utf8');
const role = readFileSync(resolve(publicRoot, 'role.html'), 'utf8');
const studio = readFileSync(resolve(publicRoot, 'studio.html'), 'utf8');
const workbench = readFileSync(resolve(publicRoot, 'studio-workbench.js'), 'utf8');
const templates = readFileSync(resolve(publicRoot, 'studio-templates.js'), 'utf8');
const templateStyles = readFileSync(resolve(publicRoot, 'studio-templates.css'), 'utf8');
const previewScript = readFileSync(resolve(repoRoot, 'scripts/preview-studio.mjs'), 'utf8');
const daemonChat = readFileSync(resolve(repoRoot, 'apps/daemon/src/routes/chat.ts'), 'utf8');
const daemonConnectionTest = readFileSync(resolve(repoRoot, 'apps/daemon/src/connectionTest.ts'), 'utf8');
const daemonDesignBuddy = readFileSync(resolve(repoRoot, 'apps/daemon/src/routes/designbuddy.ts'), 'utf8');
const clientApp = readFileSync(
  resolve(repoRoot, 'apps/web/app/[[...slug]]/client-app.tsx'),
  'utf8',
);
const customModelDesign = readFileSync(
  resolve(repoRoot, 'apps/daemon/src/integrations/openai-compatible-design.ts'),
  'utf8',
);
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
  it('brands the transient app-loading shell as DesignBuddy', () => {
    expect(clientApp).toContain('Loading DesignBuddy…');
    expect(clientApp).not.toContain('Loading OpenDesign…');
  });

  it('derives the Arena preview origin and health-gates both public services', () => {
    expect(rootPackage.scripts?.['preview-studio']).toBe(
      'node --env-file-if-exists=.env.local ./scripts/preview-studio.mjs',
    );
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

  it('enters generation immediately, then validates the model before project persistence', () => {
    const readiness = functionBody(studio, 'ensureGenerationModelReady', 'submitPrompt');
    expect(readiness).toContain('entry.provider === "custom"');
    expect(readiness).toContain('!entry.linked');
    expect(readiness).toContain('modelCustomRequired');
    expect(readiness).toContain('modelCustomProtocolUnsupported');
    expect(readiness).toContain('refreshAgnesConfig()');
    expect(readiness).toContain('modelRequired');

    const submit = functionBody(studio, 'submitPrompt', 'esc');
    expect(submit).toContain('beginPendingGeneration(submission, v)');
    expect(submit).toContain('ensureGenerationModelReady()');
    expect(submit).not.toContain('classList.add("loading")');
    expect(submit.indexOf('beginPendingGeneration(submission, v)')).toBeLessThan(
      submit.indexOf('ensureGenerationModelReady()'),
    );
    expect(submit.indexOf('if (!ready)')).toBeLessThan(
      submit.indexOf('createRealProject(v, submission)'),
    );
    const pending = functionBody(studio, 'beginPendingGeneration', 'pendingGenerationIsCurrent');
    expect(pending).toContain('go("gen")');
    expect(pending).toContain('state.gen.status = "run"');
    expect(pending.indexOf('go("gen")')).toBeLessThan(pending.indexOf('return true'));
    const create = functionBody(studio, 'createRealProject', 'currentTemplateRoute');
    expect(create).not.toContain('离线演示');
    expect(create).not.toContain('openGen({ id: id');
    expect(create).toContain('failPendingGeneration(submission, message)');
    expect(create).toContain('projectCreateFailed');
  });

  it('matches the seven-row composer menu and backs every exposed action with a real flow', () => {
    const menuStart = studio.indexOf('var PLUS_MENU = [');
    const menuEnd = studio.indexOf('];', menuStart);
    const menu = studio.slice(menuStart, menuEnd);
    expect([...menu.matchAll(/k: "([^"]+)"/g)].map((match) => match[1])).toEqual([
      'attach', 'ref', 'link', 'plugin', 'figma', 'conn', 'mcp',
    ]);
    expect(menu).not.toContain('k: "skill"');
    expect(studio).toContain('pmFigma: "从 Figma 导入"');
    expect(studio).toContain('class="pm-chevron"');
    expect(studio).toContain('.pm-menu {');
    expect(studio).toContain('width: 192px; padding: 8px;');
    expect(studio).toContain('.pm-flyout {');
    expect(studio).toContain('left: 192px; top: 96px; width: 468px; height: 328px;');
    expect(studio).toContain('grid-template-columns: 237px minmax(0, 1fr)');
    expect(studio).toContain('id="pmAttachInput"');
    expect(studio).toContain('id="pmFigmaInput"');
    expect(studio).toContain('id="pmCodeFolderInput"');
    expect(studio).toContain('id="pmPluginZipInput"');
    expect(studio).toContain('id="pmPluginFolderInput"');
    expect(studio).toContain('/api/dialog/open-folder');
    expect(studio).toContain('/api/plugins/upload-zip');
    expect(studio).toContain('/api/plugins/upload-folder');
    expect(studio).toContain('/api/connectors');
    expect(studio).toContain('/api/mcp/servers');
    expect(studio).toContain('/figma/import');
    expect(studio).toContain('/upload');
    expect(studio).toContain('composerResources');
    expect(studio).toContain('metadata.linkedDirs');
    expect(studio).toContain('metadata.connectorIds');
    expect(studio).toContain('metadata.mcpServerIds');
    expect(workbench).toContain('addContext: addContext');
    expect(studio).toContain('<div class="cp-dir" hidden>');
  });

  it('rotates role-aware suggestions, expands every prompt, and binds a real skill', () => {
    expect(studio).toContain('id="refreshTiles"');
    expect(studio).toContain('data-i18n="examplesRefresh">换一批</span>');
    expect(studio.indexOf('data-i18n="examplesTitle"')).toBeLessThan(studio.indexOf('id="refreshTiles"'));

    const suggestionsStart = studio.indexOf('var SUGGESTION_BATCH_SIZE');
    const suggestionsEnd = studio.indexOf('/* 项目中心跟随注册角色变化', suggestionsStart);
    expect(suggestionsStart).toBeGreaterThan(-1);
    expect(suggestionsEnd).toBeGreaterThan(suggestionsStart);
    const suggestionContract = Function(
      `${studio.slice(suggestionsStart, suggestionsEnd)}; return { SUGGESTION_BATCH_SIZE, SUGGESTION_SKILL_IDS, buildSuggestionPrompt };`,
    )() as {
      SUGGESTION_BATCH_SIZE: number;
      SUGGESTION_SKILL_IDS: Record<string, string[][]>;
      buildSuggestionPrompt: (tile: { p: string }, role: string, lang: string) => string;
    };
    expect(suggestionContract.SUGGESTION_BATCH_SIZE).toBe(6);

    const rolesStart = studio.indexOf('var ROLES = {');
    const roleData = Function(
      'ROLE_ICONS',
      `${studio.slice(rolesStart, suggestionsStart)}; return ROLES;`,
    )({ designer: '', pm: '', dev: '', admin: '' }) as Record<
      string,
      Record<'zh' | 'en', { tiles: Array<{ p: string }> }>
    >;
    const roleNames = ['designer', 'pm', 'dev', 'admin'];
    roleNames.forEach((roleName) => {
      const skillRows = suggestionContract.SUGGESTION_SKILL_IDS[roleName]!;
      expect(skillRows).toHaveLength(12);
      skillRows.flat().forEach((skillId) => {
        expect(existsSync(resolve(repoRoot, 'skills', skillId, 'SKILL.md')), skillId).toBe(true);
      });
      (['zh', 'en'] as const).forEach((lang) => {
        const tiles = roleData[roleName]![lang].tiles;
        expect(tiles).toHaveLength(skillRows.length);
        tiles.forEach((tile) => {
          const prompt = suggestionContract.buildSuggestionPrompt(tile, roleName, lang);
          expect(prompt.startsWith(tile.p)).toBe(true);
          expect(prompt).toContain('\n\n');
          expect(prompt.length).toBeGreaterThan(tile.p.length + 150);
        });
      });
    });

    const apply = functionBody(studio, 'applySuggestion', 'renderTiles');
    expect(apply).toContain('prompt.value = buildSuggestionPrompt(tile, state.role, state.lang)');
    expect(apply).toContain('state.selSkill = resolved');
    expect(apply).toContain('pending: true');
    expect(apply).toContain('updateChips()');
    const render = functionBody(studio, 'renderTiles', 'refreshSuggestionBatch');
    expect(render).toContain('tiles.slice(start, start + SUGGESTION_BATCH_SIZE)');
    expect(render).toContain('data-skill-id');
    expect(render).toContain('applySuggestion(tl, index)');
    const refresh = functionBody(studio, 'refreshSuggestionBatch', 'renderModelPicker');
    expect(refresh).toContain('state.tileBatch = (state.tileBatch + 1) % batchCount');
    expect(refresh).toContain('renderTiles()');

    const loadSkills = functionBody(studio, 'loadSkills', 'ensureSuggestionSkillReady');
    expect(loadSkills).toContain('apiGet("/api/skills")');
    expect(loadSkills).toContain('reconcilePendingSuggestionSkill()');
    const readiness = functionBody(studio, 'ensureSuggestionSkillReady', 'loadPlugins');
    expect(readiness).toContain('!state.selSkill.pending');
    const submit = functionBody(studio, 'submitPrompt', 'esc');
    expect(submit.indexOf('beginPendingGeneration(submission, v)')).toBeLessThan(
      submit.indexOf('ensureSuggestionSkillReady()'),
    );
    expect(submit.indexOf('ensureSuggestionSkillReady()')).toBeLessThan(
      submit.indexOf('createRealProject(v, submission)'),
    );
    const create = functionBody(studio, 'createRealProject', 'currentTemplateRoute');
    expect(create).toContain('extras.skillId = state.selSkill.id');
  });

  it('removes the home recent-project block and opens the reference-style settings workspace', () => {
    expect(studio).not.toContain('id="homeRecent"');
    expect(studio).not.toContain('id="homeProjGrid"');
    expect(studio).toContain('.tiles { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr));');
    const applyRole = functionBody(studio, 'applyRole', 'accountMenuIsOpen');
    expect(applyRole).not.toContain('homeRecent');

    expect(studio).toContain('id="accountDialog"');
    expect(studio).toContain('.account-dialog.settings-workspace');
    expect(studio).toContain('grid-template-columns: 220px minmax(0,1fr)');
    const openSettings = functionBody(studio, 'openAccountSurface', 'closeAccountSurface');
    expect(openSettings).toContain('settingsSection = "models"');
    const surface = functionBody(studio, 'renderAccountSurface', 'openAccountSurface');
    expect(surface).toContain('dialog.classList.toggle("settings-workspace", action === "settings")');

    const navSource = functionBody(studio, 'settingsNavGroups', 'settingsNavIcon');
    const groups = Function(
      'accountL',
      `${navSource}; return settingsNavGroups();`,
    )((zh: string) => zh) as Array<{ items: string[][] }>;
    expect(groups.flatMap((group) => group.items.map((item) => item[0]))).toEqual([
      'general', 'profile', 'shortcuts', 'personalization', 'memory', 'agents',
      'models', 'assistant', 'data', 'security', 'about', 'help',
    ]);
    const sections = functionBody(studio, 'renderSettingsSection', 'renderSettingsModels');
    [
      'renderSettingsGeneral', 'renderSettingsProfile', 'renderSettingsShortcuts',
      'renderSettingsPersonalization', 'renderSettingsMemory', 'renderSettingsAgents',
      'renderSettingsAssistant', 'renderSettingsData', 'renderSettingsSecurity',
      'renderSettingsAbout', 'renderSettingsHelp', 'renderSettingsModels',
    ].forEach((renderer) => expect(sections).toContain(renderer));

    const defaultsSource = functionBody(studio, 'accountDefaults', 'readAccountState');
    const defaults = Function(`${defaultsSource}; return accountDefaults();`)() as {
      customModels: Array<{ id: string }>;
    };
    expect(defaults.customModels.map((model) => model.id)).toEqual(['auto']);
    const models = functionBody(studio, 'renderSettingsModels', 'renderSettingsGeneral');
    expect(models).toContain('id="settingsAddModel"');
    expect(models).toContain('data-model-edit');
    expect(models).toContain('data-model-link');
    expect(models).toContain('data-model-delete');
    expect(models).toContain('saveAccountState()');
  });

  it('uses one complete add/edit custom-model dialog with real connection testing', () => {
    const dom = new JSDOM(studio);
    const document = dom.window.document;
    const modal = document.getElementById('customModelModal');
    expect(modal).toBeTruthy();
    expect(modal!.hasAttribute('hidden')).toBe(true);
    expect(modal!.querySelector('[role="dialog"][aria-modal="true"]')).toBeTruthy();
    expect(document.getElementById('customModelTitle')!.textContent).toBe('添加模型');
    expect(document.getElementById('customModelProviderLabel')!.textContent).toContain(
      '仅支持 OpenAI 兼容协议 API',
    );
    expect(document.querySelector<HTMLSelectElement>('#customModelProvider')!.value).toBe('custom');
    expect(document.querySelector<HTMLInputElement>('#customModelEndpoint')!.placeholder).toBe(
      'https://api.example.com/v1/chat/completions',
    );
    expect(document.querySelector<HTMLInputElement>('#customModelApiKey')!.type).toBe('password');
    expect(document.getElementById('customModelTest')!.textContent).toBe('测试连接');
    expect(document.querySelector<HTMLInputElement>('#customModelTools')!.checked).toBe(true);
    expect(document.getElementById('customModelImages')).toBeTruthy();
    expect(document.getElementById('customModelReasoning')).toBeTruthy();
    expect(document.getElementById('customModelProtocol')).toBeTruthy();
    expect(document.querySelector<HTMLInputElement>('#customModelInputLimit')!.placeholder).toBe(
      '使用提供商默认值',
    );
    expect(document.querySelector<HTMLInputElement>('#customModelOutputLimit')!.placeholder).toBe(
      '使用提供商默认值',
    );
    expect(document.getElementById('customModelCancel')!.textContent).toBe('取消');
    expect(document.getElementById('customModelSave')!.textContent).toBe('保存');
    expect(studio).toContain('width:min(644px, calc(100vw - 24px))');
    expect(studio).toContain('height:min(580px, calc(100dvh - 24px))');
    expect(studio).toContain('overflow-y:auto; overscroll-behavior:contain');

    const endpoint = functionBody(studio, 'customModelDaemonBaseUrl', 'customModelResultMessage');
    const normalizeEndpoint = Function(`${endpoint}; return customModelDaemonBaseUrl;`)() as (
      value: string,
    ) => string;
    expect(normalizeEndpoint('https://api.example.com/v1/chat/completions')).toBe(
      'https://api.example.com/v1',
    );
    expect(normalizeEndpoint('https://api.example.com/v1/')).toBe('https://api.example.com/v1');

    const testConnection = functionBody(studio, 'testCustomModelConnection', 'saveCustomModel');
    expect(testConnection).toContain('apiSend("/api/test/connection", "POST"');
    expect(testConnection).toContain('mode: "provider"');
    expect(testConnection).toContain('protocol: "openai"');
    expect(testConnection).toContain('customModelDaemonBaseUrl(config.baseUrl)');
    expect(testConnection).toContain('credentialSource: config.credentialSource === "server"');
    expect(testConnection).toContain('{ signal: controller.signal }');
    expect(testConnection).toContain('customModelShouldTryBrowser(result, config)');
    expect(testConnection).toContain('testCustomModelInBrowser(config, controller.signal)');
    expect(testConnection).toContain('customModelSetStatus("loading"');
    expect(testConnection).toContain('customModelSetStatus("success"');
    expect(testConnection).toContain('customModelSetStatus("error"');
    const browserTest = functionBody(studio, 'testCustomModelInBrowser', 'setCustomModelTesting');
    expect(browserTest).toContain('mode: "cors"');
    expect(browserTest).toContain('"Authorization": "Bearer " + config.apiKey');
    expect(browserTest).toContain('split(config.apiKey).join("[REDACTED]")');
    expect(browserTest).toContain('viaBrowser: true');
    expect(daemonChat).toContain("body.credentialSource === 'designbuddy_custom_model'");
    expect(daemonChat).toContain('process.env.OD_CUSTOM_MODEL_BASE_URL');
    expect(daemonChat).toContain('process.env.OD_CUSTOM_MODEL_API_KEY');
    expect(daemonChat).toContain('process.env.OD_CUSTOM_MODEL_NAME');
    expect(daemonChat).toContain("'CUSTOM_MODEL_NOT_CONFIGURED'");
    const transportClassifier = daemonConnectionTest.slice(
      daemonConnectionTest.indexOf('function networkErrorToKind'),
      daemonConnectionTest.indexOf('async function validateLocalOpenAiModel'),
    );
    expect(transportClassifier).toContain("code === 'ECONNRESET'");
    expect(transportClassifier).toContain("return 'upstream_unavailable'");

    const saveModel = functionBody(studio, 'saveCustomModel', 'renderSettingsModels');
    expect(saveModel).toContain('checkDuplicate: true');
    expect(saveModel).toContain('Object.assign({}, previous || {}, config');
    expect(saveModel).toContain('fingerprint === customModelTestFingerprint');
    expect(saveModel).toContain('saveAccountState()');
    const renderModels = functionBody(studio, 'renderSettingsModels', 'renderSettingsGeneral');
    expect(renderModels).toContain('openCustomModelModal(Number(button.getAttribute("data-model-edit"))');
    expect(renderModels).not.toContain('window.prompt');

    const accountStateSource = studio.slice(
      studio.indexOf('function accountDefaults()'),
      studio.indexOf('var state = {'),
    );
    const restored = Function(
      'localStorage',
      `${accountStateSource}; return readAccountState();`,
    )({
      getItem: () => JSON.stringify({
        customModels: [
          {
            id: 'auto',
            model: 'auto',
            baseUrl: 'https://legacy.example/v1',
            apiKey: 'sk-test-only',
            linked: true,
            retained: 'yes',
          },
          { id: 'legacy/model', linked: false },
        ],
      }),
    }) as {
      customModelsVersion: number;
      customModels: Array<{
        id: string;
        model: string;
        baseUrl: string;
        apiKey: string;
        apiKeyConfigured: boolean;
        credentialSource: string;
        protocol: string;
        capabilities: { tools: boolean; imageInput: boolean; reasoning: boolean; customProtocol: boolean };
        inputLimit: number | null;
        outputLimit: number | null;
        linked: boolean;
        retained?: string;
      }>;
    };
    expect(restored.customModelsVersion).toBe(2);
    expect(restored.customModels).toHaveLength(1);
    expect(restored.customModels[0]).toMatchObject({
      id: 'auto',
      model: 'auto',
      baseUrl: 'https://legacy.example/v1',
      apiKey: 'sk-test-only',
      apiKeyConfigured: true,
      credentialSource: 'manual',
      protocol: 'openai',
      capabilities: {
        tools: true,
        imageInput: false,
        reasoning: false,
        customProtocol: false,
      },
      inputLimit: null,
      outputLimit: null,
      linked: false,
      retained: 'yes',
    });
    dom.window.close();
  });

  it('synchronizes collision-safe custom models across the home picker and General settings', () => {
    const registryStart = studio.indexOf('var AGNES_MODEL_REGISTRY = [');
    const registryEnd = studio.indexOf('function accountDefaults()', registryStart);
    expect(registryStart).toBeGreaterThan(-1);
    expect(registryEnd).toBeGreaterThan(registryStart);
    const writes: Array<[string, string]> = [];
    const contract = Function(
      'localStorage',
      `${studio.slice(registryStart, registryEnd)}
       var state = {
         model: "agnes-3.0-flash",
         agnesConfigured: true,
         account: { customModels: [
           { id: "auto", model: "auto", protocol: "openai", linked: true },
           { id: "agnes-3.0-flash", model: "agnes-3.0-flash", protocol: "openai", linked: true }
         ] }
       };
       return { state, sharedModelRegistry, customModelSelectionId, modelEntryBySelectionId, reconcileSelectedModel };`,
    )({
      getItem: () => null,
      setItem: (key: string, value: string) => writes.push([key, value]),
    }) as {
      state: { model: string; account: { customModels: Array<{ id: string; model: string }> } };
      sharedModelRegistry: () => Array<{
        selectionId: string;
        model: string;
        provider: string;
        customIndex: number;
      }>;
      customModelSelectionId: (model: { id: string; model: string }) => string;
      modelEntryBySelectionId: (selectionId: string) => { provider: string; model: string } | null;
      reconcileSelectedModel: (persist: boolean) => { provider: string; model: string } | null;
    };

    const registry = contract.sharedModelRegistry();
    expect(registry.map((entry) => entry.model)).toEqual([
      'agnes-3.0-flash',
      'agnes-image-2.5-flash',
      'agnes-video-2.5-flash',
      'auto',
      'agnes-3.0-flash',
    ]);
    const customCollision = registry.find((entry) =>
      entry.provider === 'custom' && entry.model === 'agnes-3.0-flash');
    expect(customCollision?.selectionId).toMatch(/^custom:/);
    expect(customCollision?.selectionId).not.toBe('agnes-3.0-flash');
    expect(contract.modelEntryBySelectionId('agnes-3.0-flash')?.provider).toBe('agnes');
    expect(contract.modelEntryBySelectionId(customCollision!.selectionId)?.provider).toBe('custom');

    const autoSelection = contract.customModelSelectionId(contract.state.account.customModels[0]!);
    contract.state.model = autoSelection;
    expect(contract.reconcileSelectedModel(true)?.model).toBe('auto');
    expect(writes.at(-1)).toEqual(['db-model', autoSelection]);
    contract.state.account.customModels.splice(0, 1);
    expect(contract.reconcileSelectedModel(true)?.model).toBe('agnes-3.0-flash');
    expect(contract.state.model).toBe('agnes-3.0-flash');

    const picker = functionBody(studio, 'renderModelPicker', 'refreshSynchronizedModelSurfaces');
    expect(picker).toContain('sharedModelRegistry().forEach');
    expect(picker).toContain('data-selection-id');
    expect(picker).toContain('entry.name');
    expect(picker).toContain('entry.linked');
    const general = functionBody(studio, 'renderSettingsGeneral', 'renderSettingsProfile');
    expect(general).toContain('sharedModelRegistry().map');
    expect(general).toContain('entry.selectionId');
    const save = functionBody(studio, 'saveCustomModel', 'renderSettingsModels');
    expect(save).toContain('previousSelectionId');
    expect(save).toContain('state.model = customModelSelectionId(saved)');
    expect(save).toContain('refreshSynchronizedModelSurfaces()');
    const models = functionBody(studio, 'renderSettingsModels', 'renderSettingsGeneral');
    expect(models).toContain('refreshSynchronizedModelSurfaces()');
  });

  it('routes custom-model generation through a bounded daemon job with a secure browser fallback', () => {
    const invoke = functionBody(studio, 'invokeCustomModelText', 'invokeAgnesMedia');
    expect(invoke).toContain('/api/db/custom-model/generation-jobs');
    expect(invoke).toContain('credentialSource: config.credentialSource === "server"');
    expect(invoke).toContain('provider.apiKey = config.apiKey');
    expect(invoke).toContain('snapshot.status === "succeeded"');
    expect(invoke).toContain('method: "DELETE"');
    expect(invoke).toContain('code === "CUSTOM_MODEL_NETWORK_ERROR"');
    expect(invoke).toContain('code === "CUSTOM_MODEL_TIMEOUT"');
    expect(invoke).toContain('config.apiKey && config.credentialSource !== "server"');
    expect(invoke).toContain('invokeCustomModelInBrowser(prompt, kind, version, entry, signal)');
    expect(invoke).toContain('"CUSTOM_MODEL_BROWSER_KEY_REQUIRED"');

    const browserInvoke = functionBody(
      studio,
      'invokeCustomModelInBrowser',
      'invokeCustomModelText',
    );
    expect(browserInvoke).toContain('mode: "cors"');
    expect(browserInvoke).toContain('credentials: "omit"');
    expect(browserInvoke).toContain('referrerPolicy: "no-referrer"');
    expect(browserInvoke).toContain('"Authorization": "Bearer " + config.apiKey');
    expect(browserInvoke).toContain('readCustomModelBrowserResponse(response, 1024 * 1024)');
    expect(browserInvoke).toContain('/api/db/custom-model/constrain-html');
    expect(browserInvoke).toContain('content.split(config.apiKey).join("[REDACTED]")');
    expect(browserInvoke).not.toContain('html: content');

    const turn = functionBody(studio, 'startGenTurn', 'stopGen');
    expect(turn).toContain('modelEntry.provider === "custom"');
    expect(turn).toContain('invokeCustomModelText(requestPrompt');
    expect(turn).toContain('invokeAgnesText(requestPrompt');
    expect(daemonDesignBuddy).toContain("app.post('/api/db/custom-model/generation-jobs'");
    expect(daemonDesignBuddy).toContain("app.post('/api/db/custom-model/constrain-html'");
    expect(daemonDesignBuddy).toContain('resolveCustomModelGenerationConfig');
    expect(daemonDesignBuddy).toContain('generateOpenAiCompatibleDesign');
    expect(daemonDesignBuddy).toContain('constrainOpenAiCompatibleDesignHtml(content)');
    expect(daemonDesignBuddy).toContain('Buffer.byteLength(content, \'utf8\') > 1024 * 1024');
    expect(daemonDesignBuddy).toContain('process.env.OD_CUSTOM_MODEL_API_KEY');
    expect(customModelDesign).toContain('normalizeOpenAiCompatibleBaseUrl');
    expect(customModelDesign).toContain('export function constrainOpenAiCompatibleDesignHtml');
    expect(customModelDesign).toContain('CUSTOM_MODEL_AUTH_FAILED');
    expect(customModelDesign).toContain('HTML_GATEWAY_RESPONSE_PATTERN');
    expect(customModelDesign).toContain(".replace(/<script\\b[^>]*>[\\s\\S]*?<\\/script\\s*>/gi, '')");
    expect(studio).toContain('genToastError: "生成失败：{message}"');
    expect(studio).toContain('genToastError: "Generation failed: {message}"');
    expect(studio).not.toContain('genToastError: "Agnes 生成失败：{message}"');
    expect(studio).not.toContain('genToastError: "Agnes generation failed: {message}"');
    expect(studio).not.toContain('genToastDone: "✦ Agnes 已生成 v{v}"');
    expect(studio).not.toContain('genToastDone: "✦ Agnes generated v{v}"');
    const cleanError = functionBody(studio, 'cleanErrorMessage', 'apiRequest');
    expect(cleanError).toContain('code === "CUSTOM_MODEL_NETWORK_ERROR"');
    expect(cleanError).toContain('code === "CUSTOM_MODEL_BROWSER_BLOCKED"');
    expect(cleanError).toContain('code === "CUSTOM_MODEL_AUTH_FAILED"');
    expect(cleanError).toContain('/^CUSTOM_MODEL_/.test(code)');
  });

  it('scopes persisted projects to the active role and initializes all roles', () => {
    const render = functionBody(studio, 'renderProjects', 'renderHomeRecent');
    expect(render).toContain('project.role === state.role');
    expect(render).toContain('return !project.retired');
    expect(render).not.toContain('real.concat(samples)');
    const initialize = functionBody(studio, 'ensureRoleStarterProjects', 'loadProjects');
    expect(initialize).toContain('{ role: requestedRole }');
    expect(initialize).not.toContain('state.role !== "designer"');
  });

  it('lets the Projects gallery and live artifact thumbnails cover all available space', () => {
    expect(studio).toContain('.main.projects-wall { align-items: stretch; padding: 24px 24px 52px; }');
    expect(studio).toContain('.main-inner.project-wall, .main-inner.generation-wall { width: 100%; max-width: none; }');
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

  it('fills the generation workspace and polls Agnes outside the browser proxy timeout', () => {
    expect(studio).toContain('.main.generation-workspace { align-items: stretch; height: 100dvh;');
    expect(studio).toContain('grid-template-columns: clamp(320px, 29vw, 420px) minmax(0, 1fr)');
    expect(studio).toContain('.main-inner.project-wall, .main-inner.generation-wall { width: 100%; max-width: none; }');
    expect(studio).toContain('.gf-card.is-primary .pv iframe { width: 100%; height: 100%; transform: none; pointer-events: auto;');
    const apply = functionBody(studio, 'applyView', 'closePicker');
    expect(apply).toContain('inner.classList.toggle("generation-wall", v === "gen")');
    expect(apply).toContain('main.classList.toggle("generation-workspace", v === "gen")');
    const invoke = functionBody(studio, 'invokeAgnesText', 'invokeAgnesMedia');
    expect(invoke).toContain('/api/db/agnes/generation-jobs');
    expect(invoke).toContain('snapshot.status === "succeeded"');
    expect(invoke).toContain('method: "DELETE"');
    const request = functionBody(studio, 'apiRequest', 'apiGet');
    expect(request).toContain('HTML_GATEWAY_RESPONSE');
    expect(request).not.toContain('data = { error: raw }');
  });

  it('binds every generation turn to the newly submitted prompt and redacts legacy gateway HTML', () => {
    const startTurn = functionBody(studio, 'startGenTurn', 'stopGen');
    expect(startTurn).toContain('var requestPrompt = String(prompt || "").trim()');
    expect(startTurn).toContain('text: requestPrompt');
    expect(startTurn).toContain('.replace("{prompt}", generationPromptLabel(requestPrompt))');
    expect(startTurn).toContain('invokeAgnesText(requestPrompt');
    expect(startTurn).not.toContain('.replace("{name}", state.gen.name)');
    expect(startTurn).toContain('message: message');
    expect(startTurn).toContain('code: errorCode');

    const promptLabelSource = functionBody(studio, 'generationPromptLabel', 'startGenTurn').replace(/\s*async\s*$/, '');
    const promptLabel = Function(`${promptLabelSource}; return generationPromptLabel;`)() as (value: string) => string;
    expect(promptLabel('帮我生成一套wordpress主题模版')).toBe('帮我生成一套wordpress主题模版');

    const htmlDetectorSource = functionBody(studio, 'isHtmlGatewayErrorText', 'htmlGatewayErrorMessage');
    const detectsHtmlGateway = Function(`${htmlDetectorSource}; return isHtmlGatewayErrorText;`)() as (
      value: string,
    ) => boolean;
    const legacyGatewayPage = '<!DOCTYPE html><!--[if lt IE 7]><html>Cloudflare</html>';
    expect(detectsHtmlGateway(legacyGatewayPage)).toBe(true);
    expect(detectsHtmlGateway('Agnes generation timed out')).toBe(false);
    const displaySource = functionBody(studio, 'generationAiDisplayText', 'renderGen');
    const displayGenerationError = Function(
      'isHtmlGatewayErrorText',
      'cleanErrorMessage',
      't',
      `${displaySource}; return generationAiDisplayText;`,
    )(
      detectsHtmlGateway,
      () => '已安全清理网关错误',
      () => 'Agnes 生成失败：{message}',
    ) as (payload: Record<string, unknown>) => string;
    expect(displayGenerationError({ text: `Agnes 生成失败：${legacyGatewayPage}`, error: true })).toBe(
      'Agnes 生成失败：已安全清理网关错误',
    );
    expect(studio).toContain('aiTexts.push(generationAiDisplayText(e.payload))');
    expect(workbench).toContain('stopMessage = cleanError({');
    expect(workbench).not.toContain("E(stop.payload && (stop.payload.detail || stop.payload.message || stop.payload.error)");
  });

  it('exposes sixteen non-repeating templates with twenty interactive screens each', () => {
    const dom = new JSDOM('<!doctype html><body></body>', {
      runScripts: 'outside-only',
      url: 'https://preview.example/studio.html#/templates',
    });
    dom.window.eval(templates);
    const library = (dom.window as unknown as {
      StudioTemplates: {
        items: Array<{ id: string; kind: string; zh: { pages: string[] }; en: { pages: string[] } }>;
        aliases: Record<string, string>;
        byId: (id: string) => { id: string } | null;
        artMarkup: (template: object, page: number, lang: string, compact: boolean, alternate: boolean) => string;
        cardMarkup: (template: object, lang: string) => string;
        featuredMarkup: (template: object, lang: string) => string;
      };
    }).StudioTemplates;
    expect(library.items).toHaveLength(16);
    expect(new Set(library.items.map((item) => item.id)).size).toBe(16);
    expect(new Set(library.items.map((item) => item.kind)).size).toBe(16);
    expect(library.items.every((item) =>
      item.zh.pages.length === 20
      && item.en.pages.length === 20
      && new Set(item.zh.pages).size === 20
      && new Set(item.en.pages).size === 20,
    )).toBe(true);
    expect(library.items.reduce((total, item) => total + item.zh.pages.length, 0)).toBe(320);
    expect(Object.keys(library.aliases)).toHaveLength(9);
    expect(library.items.some((item) => library.aliases[item.id])).toBe(false);
    expect(library.byId('pulse-care-center')?.id).toBe('northstar-saas-console');
    const rendererRoots = library.items.map((item) => {
      const html = library.artMarkup(item, 0, 'zh', true, false);
      expect(html).toContain('data-demo-action=');
      expect(library.cardMarkup(item, 'zh')).toContain('tpl-card-stage');
      expect(library.featuredMarkup(item, 'en')).toContain('tpl-featured-art');
      item.zh.pages.forEach((_, page) => {
        const screen = library.artMarkup(item, page, 'zh', false, page % 2 === 1);
        expect(screen).toContain('data-demo-action=');
        expect(screen).toContain(item.zh.pages[page]);
      });
      return /tpl-art--([a-z]+)/.exec(html)?.[1];
    });
    expect(rendererRoots.every(Boolean)).toBe(true);
    expect(new Set(rendererRoots).size).toBe(16);
    dom.window.close();
  });

  it('opens every template at preview scale with a scrollable rail and working controls', () => {
    const dom = new JSDOM('<!doctype html><body></body>', {
      pretendToBeVisual: true,
      runScripts: 'outside-only',
      url: 'https://preview.example/studio.html#/templates',
    });
    dom.window.eval(templates);
    expect(templateStyles).toMatch(/\.tpl-preview-thumbs\s*\{[^}]*overflow-y:\s*scroll/s);
    const library = (dom.window as unknown as {
      StudioTemplates: {
        items: Array<{ id: string }>;
        open: (id: string, options: object) => boolean;
      };
    }).StudioTemplates;
    library.items.forEach((item) => {
      expect(library.open(item.id, { lang: 'zh', page: 19 })).toBe(true);
      expect(dom.window.document.querySelectorAll('#tplPreviewThumbs [data-template-page]')).toHaveLength(20);
      const action = dom.window.document.querySelector<HTMLElement>('#tplPreviewCanvas [data-demo-action]');
      expect(action).toBeTruthy();
      action!.click();
      expect(action!.classList.contains('is-demo-active')).toBe(true);
      expect(dom.window.document.getElementById('tplInteractionText')!.textContent).toContain(
        action!.getAttribute('data-demo-action'),
      );
      dom.window.document.querySelector<HTMLElement>('[data-preview-viewport="mobile"]')!.click();
      expect(dom.window.document.getElementById('tplPreviewCanvas')!.getAttribute('data-viewport')).toBe('mobile');
      dom.window.document.querySelector<HTMLElement>('[data-template-page="0"]')!.click();
      expect(dom.window.document.getElementById('tplScreenCounter')!.textContent).toContain('01 / 20');
    });
    dom.window.close();
  }, 10_000);

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
