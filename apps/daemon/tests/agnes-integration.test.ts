import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  AGNES_BASE_URL,
  AGNES_TEXT_MODEL,
  AgnesIntegrationError,
  generateAgnesDesign,
  testAgnesConnection,
} from '../src/integrations/agnes.js';

const TEST_KEY = 'agnes-test-key-never-log';

describe('Agnes text integration', () => {
  const originalKey = process.env.OD_AGNES_API_KEY;

  beforeEach(() => {
    process.env.OD_AGNES_API_KEY = TEST_KEY;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    if (originalKey === undefined) delete process.env.OD_AGNES_API_KEY;
    else process.env.OD_AGNES_API_KEY = originalKey;
  });

  it('calls the fixed Agnes chat model and constrains returned HTML', async () => {
    const fetchMock = vi.fn(async (_input: string | URL | Request, _init?: RequestInit) => new Response(
      JSON.stringify({
        choices: [{
          message: {
            content: '```html\n<!doctype html><html><head><title>Demo</title></head><body><main>Hello Agnes</main><script>fetch("https://bad.test")</script></body></html>\n```',
          },
        }],
        usage: { total_tokens: 42 },
      }),
      { status: 200, headers: { 'content-type': 'application/json' } },
    ));

    const result = await generateAgnesDesign({
      prompt: 'Create a polished landing page',
      locale: 'en',
      mode: 'Web prototype',
      projectName: 'Launch site',
      fetchImpl: fetchMock as typeof fetch,
    });

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(String(url)).toBe(`${AGNES_BASE_URL}/chat/completions`);
    expect(init?.method).toBe('POST');
    expect(init?.headers).toMatchObject({
      authorization: `Bearer ${TEST_KEY}`,
      'content-type': 'application/json',
    });
    const body = JSON.parse(String(init?.body));
    expect(body.model).toBe(AGNES_TEXT_MODEL);
    expect(body.stream).toBe(false);
    expect(body.messages[1].content).toContain('Existing project label (context only; never substitute it for the current request): Launch site.');
    expect(body.messages[1].content).toContain('Current user request (authoritative):\nCreate a polished landing page');
    expect(result.html).toContain('Content-Security-Policy');
    expect(result.html).toContain('Hello Agnes');
    expect(result.html).not.toContain('<script');
    expect(result.html).not.toContain(TEST_KEY);
    expect(result.usage).toEqual({ total_tokens: 42 });
  });

  it('uses the same fixed text model for connection checks', async () => {
    const fetchMock = vi.fn(async (_input: string | URL | Request, _init?: RequestInit) => new Response(
      JSON.stringify({ choices: [{ message: { content: 'OK' } }] }),
      { status: 200, headers: { 'content-type': 'application/json' } },
    ));

    await testAgnesConnection({ fetchImpl: fetchMock as typeof fetch });

    const body = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body));
    expect(body.model).toBe('agnes-3.0-flash');
    expect(body.max_tokens).toBe(8);
  });

  it('never exposes an upstream HTML gateway page as the generation error', async () => {
    const fetchMock = vi.fn(async () => new Response(
      '<!DOCTYPE html><html><body>Cloud gateway failure</body></html>',
      { status: 502, headers: { 'content-type': 'text/html' } },
    ));

    let error: AgnesIntegrationError | null = null;
    try {
      await generateAgnesDesign({
        prompt: 'Create a page',
        fetchImpl: fetchMock as typeof fetch,
      });
    } catch (reason) {
      error = reason as AgnesIntegrationError;
    }
    expect(error).toMatchObject({
      code: 'AGNES_UPSTREAM_ERROR',
      status: 502,
    } satisfies Partial<AgnesIntegrationError>);
    expect(error?.message).not.toMatch(/DOCTYPE|Cloud gateway/i);
  });

  it('redacts HTML even when a JSON error envelope contains the gateway document', async () => {
    const fetchMock = vi.fn(async () => new Response(
      JSON.stringify({
        error: {
          message: '<!DOCTYPE html><!--[if lt IE 7]><html class="oldie"><body>Cloudflare Ray ID secret</body></html>',
        },
      }),
      { status: 502, headers: { 'content-type': 'application/json' } },
    ));

    let error: AgnesIntegrationError | null = null;
    try {
      await generateAgnesDesign({
        prompt: 'Create a page',
        fetchImpl: fetchMock as typeof fetch,
      });
    } catch (reason) {
      error = reason as AgnesIntegrationError;
    }
    expect(error).toMatchObject({
      code: 'AGNES_UPSTREAM_ERROR',
      status: 502,
    } satisfies Partial<AgnesIntegrationError>);
    expect(error?.message).toContain('HTML error page');
    expect(error?.message).not.toMatch(/DOCTYPE|oldie|Cloudflare Ray ID secret/i);
  });

  it('reports outbound TLS failures as actionable Agnes network errors', async () => {
    const fetchMock = vi.fn().mockRejectedValue(
      Object.assign(new TypeError('fetch failed'), {
        cause: Object.assign(new Error('TLS socket closed'), { code: 'ECONNRESET' }),
      }),
    );

    await expect(generateAgnesDesign({
      prompt: 'Create a page',
      fetchImpl: fetchMock as typeof fetch,
    })).rejects.toMatchObject({
      code: 'AGNES_NETWORK_ERROR',
      status: 502,
    } satisfies Partial<AgnesIntegrationError>);
  });

  it('fails without exposing or accepting a browser credential when daemon env is unset', async () => {
    delete process.env.OD_AGNES_API_KEY;
    const fetchMock = vi.fn();

    await expect(generateAgnesDesign({
      prompt: 'Create a page',
      fetchImpl: fetchMock as typeof fetch,
    })).rejects.toMatchObject({
      code: 'AGNES_NOT_CONFIGURED',
      status: 503,
    } satisfies Partial<AgnesIntegrationError>);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
