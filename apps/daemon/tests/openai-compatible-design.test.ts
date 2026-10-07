import { describe, expect, it, vi } from 'vitest';

import {
  OpenAiCompatibleDesignError,
  constrainOpenAiCompatibleDesignHtml,
  generateOpenAiCompatibleDesign,
  normalizeOpenAiCompatibleBaseUrl,
} from '../src/integrations/openai-compatible-design.js';

const CONFIG = {
  baseUrl: 'https://provider.example/v1/chat/completions',
  apiKey: 'custom-test-key-never-return',
  model: 'auto',
  outputLimit: 4096,
};

describe('OpenAI-compatible DesignBuddy generation', () => {
  it('normalizes either a base URL or full chat-completions URL', () => {
    expect(normalizeOpenAiCompatibleBaseUrl('https://provider.example/v1/')).toBe(
      'https://provider.example/v1',
    );
    expect(normalizeOpenAiCompatibleBaseUrl(
      'https://provider.example/v1/chat/completions?ignored=true#fragment',
    )).toBe('https://provider.example/v1');
  });

  it('uses the selected provider config and constrains returned HTML', async () => {
    const fetchMock = vi.fn(async (
      _input: Parameters<typeof fetch>[0],
      _init?: Parameters<typeof fetch>[1],
    ) => new Response(
      JSON.stringify({
        choices: [{
          message: {
            content: '```html\n<!doctype html><html><head><title>Custom</title></head><body><main>Custom model output</main><script>fetch("https://bad.test")</script></body></html>\n```',
          },
        }],
        usage: {
          total_tokens: 84,
          provider_note: `do not return ${CONFIG.apiKey}`,
          private_metadata: { credential: CONFIG.apiKey },
        },
      }),
      { status: 200, headers: { 'content-type': 'application/json' } },
    ));

    const result = await generateOpenAiCompatibleDesign({
      config: CONFIG,
      prompt: 'Create a commercial landing page',
      locale: 'en',
      mode: 'Web prototype',
      projectName: 'Launch site',
      fetchImpl: fetchMock as typeof fetch,
    });

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(String(url)).toBe('https://provider.example/v1/chat/completions');
    expect(init?.method).toBe('POST');
    expect(init?.headers).toMatchObject({
      authorization: `Bearer ${CONFIG.apiKey}`,
      'content-type': 'application/json',
    });
    const body = JSON.parse(String(init?.body));
    expect(body.model).toBe('auto');
    expect(body.max_tokens).toBe(4096);
    expect(body.stream).toBe(false);
    expect(body.messages[1].content).toContain(
      'Current user request (authoritative):\nCreate a commercial landing page',
    );
    expect(result.model).toBe('auto');
    expect(result.html).toContain('Content-Security-Policy');
    expect(result.html).toContain('Custom model output');
    expect(result.html).not.toContain('<script');
    expect(result.html).not.toContain(CONFIG.apiKey);
    expect(result.usage).toEqual({ total_tokens: 84 });
    expect(JSON.stringify(result)).not.toContain(CONFIG.apiKey);
  });

  it('applies the same bounded HTML constraint to browser-fallback output', () => {
    const html = constrainOpenAiCompatibleDesignHtml(
      '```html\n<!doctype html><html><head><base href="https://evil.example/"><meta http-equiv="refresh" content="0;url=https://evil.example"></head><body><main>Browser fallback</main><script>window.top.location="https://evil.example"</script></body></html>\n```',
    );

    expect(html).toContain('Content-Security-Policy');
    expect(html).toContain('Browser fallback');
    expect(html).not.toMatch(/<script\b/i);
    expect(html).not.toMatch(/<base\b/i);
    expect(html).not.toMatch(/http-equiv=["']?refresh/i);

    const malformedScript = constrainOpenAiCompatibleDesignHtml(
      '<!doctype html><html><body><main>Still safe</main><script src="https://evil.example/payload.js"></body></html>',
    );
    expect(malformedScript).toContain('Still safe');
    expect(malformedScript).not.toMatch(/<\/?script\b/i);
  });

  it('rejects incomplete or oversized browser-fallback artifacts', () => {
    const cases = [
      {
        html: '<main>fragment only</main>',
        code: 'CUSTOM_MODEL_INVALID_HTML',
        status: 422,
      },
      {
        html: `<!doctype html><html><body>${'x'.repeat(330_000)}</body></html>`,
        code: 'CUSTOM_MODEL_HTML_TOO_LARGE',
        status: 413,
      },
    ];
    for (const item of cases) {
      let error: OpenAiCompatibleDesignError | null = null;
      try {
        constrainOpenAiCompatibleDesignHtml(item.html);
      } catch (reason) {
        error = reason as OpenAiCompatibleDesignError;
      }
      expect(error).toMatchObject({ code: item.code, status: item.status });
    }
  });

  it('returns an actionable authentication error without exposing the key', async () => {
    const fetchMock = vi.fn(async (
      _input: Parameters<typeof fetch>[0],
      _init?: Parameters<typeof fetch>[1],
    ) => new Response(
      JSON.stringify({ error: { message: `invalid key ${CONFIG.apiKey}` } }),
      { status: 401, headers: { 'content-type': 'application/json' } },
    ));

    let error: OpenAiCompatibleDesignError | null = null;
    try {
      await generateOpenAiCompatibleDesign({
        config: CONFIG,
        prompt: 'Create a page',
        fetchImpl: fetchMock as typeof fetch,
      });
    } catch (reason) {
      error = reason as OpenAiCompatibleDesignError;
    }
    expect(error).toMatchObject({
      code: 'CUSTOM_MODEL_AUTH_FAILED',
      status: 401,
    } satisfies Partial<OpenAiCompatibleDesignError>);
    expect(error?.message).toContain('Update its API key in Settings');
    expect(error?.message).not.toContain(CONFIG.apiKey);
  });

  it('never exposes an upstream HTML gateway page', async () => {
    const fetchMock = vi.fn(async (
      _input: Parameters<typeof fetch>[0],
      _init?: Parameters<typeof fetch>[1],
    ) => new Response(
      '<!DOCTYPE html><html><body>Cloudflare Ray ID private-detail</body></html>',
      { status: 502, headers: { 'content-type': 'text/html' } },
    ));

    let error: OpenAiCompatibleDesignError | null = null;
    try {
      await generateOpenAiCompatibleDesign({
        config: CONFIG,
        prompt: 'Create a page',
        fetchImpl: fetchMock as typeof fetch,
      });
    } catch (reason) {
      error = reason as OpenAiCompatibleDesignError;
    }
    expect(error).toMatchObject({
      code: 'CUSTOM_MODEL_UPSTREAM_ERROR',
      status: 502,
    } satisfies Partial<OpenAiCompatibleDesignError>);
    expect(error?.message).not.toMatch(/DOCTYPE|Cloudflare Ray ID|private-detail/i);
  });
});
