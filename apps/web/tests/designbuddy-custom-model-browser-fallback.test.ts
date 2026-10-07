import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it, vi } from 'vitest';

const studio = readFileSync(resolve(__dirname, '../public/studio.html'), 'utf8');

function functionBody(source: string, name: string, nextName: string): string {
  const functionStart = source.indexOf(`function ${name}`);
  const nextFunctionStart = source.indexOf(`function ${nextName}`, functionStart + 1);
  if (functionStart < 0 || nextFunctionStart < 0) throw new Error(`Could not isolate ${name}`);
  const start = source.slice(Math.max(0, functionStart - 6), functionStart) === 'async '
    ? functionStart - 6
    : functionStart;
  const end = source.slice(Math.max(0, nextFunctionStart - 6), nextFunctionStart) === 'async '
    ? nextFunctionStart - 6
    : nextFunctionStart;
  return source.slice(start, end);
}

function customGenerationHarness(options: {
  browserResult?: Record<string, unknown>;
} = {}) {
  const source = functionBody(studio, 'invokeCustomModelText', 'invokeAgnesMedia');
  const apiSend = vi.fn(async (
    _path: string,
    _method: string,
    _body: Record<string, unknown>,
    _options: { signal: AbortSignal },
  ) => ({ jobId: 'job-1' }));
  const apiGet = vi.fn(async () => ({
    status: 'failed',
    error: {
      code: 'CUSTOM_MODEL_NETWORK_ERROR',
      message: 'The daemon could not establish a secure connection.',
      status: 502,
    },
  }));
  const invokeCustomModelInBrowser = vi.fn(async () => options.browserResult || ({
    html: '<!doctype html><html><body>safe</body></html>',
    transport: 'browser',
  }));
  const steps: Array<Record<string, unknown>> = [];
  const state = {
    lang: 'en',
    gen: { name: 'Fallback test' },
  };
  const build = Function(
    'window',
    'state',
    'customModelDaemonBaseUrl',
    'generationModeLabel',
    'latestTextArtifactHtml',
    'apiSend',
    'apiGet',
    'waitForAgnesPoll',
    'apiErrorMessage',
    'fetch',
    'genPersist',
    'renderGen',
    'accountL',
    'invokeCustomModelInBrowser',
    'customModelBrowserFailure',
    `${source}; return invokeCustomModelText;`,
  ) as (...args: unknown[]) => (
    prompt: string,
    kind: string,
    version: number,
    entry: Record<string, unknown>,
    signal: AbortSignal,
  ) => Promise<Record<string, unknown>>;
  const invoke = build(
    {},
    state,
    (value: string) => value.replace(/\/+$/, ''),
    () => 'Web prototype',
    () => '',
    apiSend,
    apiGet,
    async () => undefined,
    (value: { message?: string }, fallback: string) => value?.message || fallback,
    vi.fn(async () => new Response(null, { status: 204 })),
    (_type: string, payload: Record<string, unknown>) => steps.push(payload),
    () => undefined,
    (_zh: string, en: string) => en,
    invokeCustomModelInBrowser,
    (code: string, message: string, status: number) => Object.assign(new Error(message), {
      code,
      status,
    }),
  );
  return { invoke, apiSend, invokeCustomModelInBrowser, steps };
}

describe('DesignBuddy custom-model browser generation fallback', () => {
  it('falls back after daemon TLS failure only when the browser already holds a manual key', async () => {
    const harness = customGenerationHarness();
    const controller = new AbortController();
    const entry = {
      model: 'auto',
      config: {
        baseUrl: 'https://provider.example/v1',
        apiKey: 'manual-test-key',
        model: 'auto',
        credentialSource: 'manual',
      },
    };

    const result = await harness.invoke('Create a dashboard', 'site', 1, entry, controller.signal);

    expect(result.transport).toBe('browser');
    expect(harness.invokeCustomModelInBrowser).toHaveBeenCalledWith(
      'Create a dashboard',
      'site',
      1,
      entry,
      controller.signal,
    );
    expect(harness.steps.at(-1)).toMatchObject({ transport: 'browser', model: 'auto' });
    expect(harness.apiSend).toHaveBeenCalledWith(
      '/api/db/custom-model/generation-jobs',
      'POST',
      expect.objectContaining({
        provider: expect.objectContaining({
          credentialSource: 'manual',
          apiKey: 'manual-test-key',
          model: 'auto',
        }),
      }),
      { signal: controller.signal },
    );
  });

  it('never exposes a daemon-managed key to the browser fallback', async () => {
    const harness = customGenerationHarness();
    const controller = new AbortController();
    const entry = {
      model: 'auto',
      config: {
        baseUrl: 'https://api.hcnsec.cn/v1',
        apiKey: '',
        model: 'auto',
        credentialSource: 'server',
      },
    };

    await expect(harness.invoke('Create a dashboard', 'site', 1, entry, controller.signal))
      .rejects.toMatchObject({ code: 'CUSTOM_MODEL_BROWSER_KEY_REQUIRED', status: 502 });
    expect(harness.invokeCustomModelInBrowser).not.toHaveBeenCalled();
    const submitted = harness.apiSend.mock.calls[0]?.[2] as {
      provider: Record<string, unknown>;
    };
    expect(submitted.provider).toMatchObject({
      credentialSource: 'designbuddy_custom_model',
      model: 'auto',
    });
    expect(submitted.provider).not.toHaveProperty('apiKey');
  });

  it('uses credentialless CORS and sends browser output back to the daemon constraint', async () => {
    const source = studio.slice(
      studio.indexOf('function customModelBrowserFailure'),
      studio.indexOf('async function invokeCustomModelText'),
    );
    const key = 'browser-secret-never-forward';
    const providerFetch = vi.fn(async (
      _input: string | URL | Request,
      _init?: RequestInit,
    ) => new Response(JSON.stringify({
      choices: [{
        message: {
          content: `<!doctype html><html><body>Generated ${key}<script>bad()</script></body></html>`,
        },
      }],
    }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    }));
    const apiSend = vi.fn(async (
      path: string,
      method: string,
      body: { content: string },
    ) => {
      expect(path).toBe('/api/db/custom-model/constrain-html');
      expect(method).toBe('POST');
      expect(body.content).toContain('[REDACTED]');
      expect(body.content).not.toContain(key);
      return { html: '<!doctype html><html><body>daemon constrained</body></html>' };
    });
    const build = Function(
      'accountL',
      'latestTextArtifactHtml',
      'state',
      'generationModeLabel',
      'customModelDaemonBaseUrl',
      'fetch',
      'isHtmlGatewayErrorText',
      'htmlGatewayErrorMessage',
      'apiSend',
      `${source}; return invokeCustomModelInBrowser;`,
    ) as (...args: unknown[]) => (
      prompt: string,
      kind: string,
      version: number,
      entry: Record<string, unknown>,
      signal: AbortSignal,
    ) => Promise<Record<string, unknown>>;
    const invoke = build(
      (_zh: string, en: string) => en,
      () => '',
      { lang: 'en', gen: { name: 'Secure fallback' } },
      () => 'Web prototype',
      (value: string) => value.replace(/\/+$/, ''),
      providerFetch,
      () => false,
      () => 'gateway error',
      apiSend,
    );
    const controller = new AbortController();

    const result = await invoke('Create a page', 'site', 2, {
      model: 'auto',
      config: {
        baseUrl: 'https://provider.example/v1',
        apiKey: key,
        model: 'auto',
        credentialSource: 'manual',
      },
    }, controller.signal);

    expect(result).toMatchObject({
      html: '<!doctype html><html><body>daemon constrained</body></html>',
      transport: 'browser',
      model: 'auto',
    });
    const [, init] = providerFetch.mock.calls[0]!;
    expect(init).toMatchObject({
      method: 'POST',
      mode: 'cors',
      credentials: 'omit',
      cache: 'no-store',
      referrerPolicy: 'no-referrer',
    });
    expect((init?.headers as Record<string, string>).Authorization).toBe(`Bearer ${key}`);
    expect(apiSend).toHaveBeenCalledOnce();
  });
});
