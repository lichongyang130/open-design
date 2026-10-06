import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { generateMedia } from '../../src/media/index.js';
import {
  AGNES_BASE_URL,
  AGNES_IMAGE_MODEL,
  AGNES_VIDEO_MODEL,
} from '../../src/integrations/agnes.js';

const PNG_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+X2uoAAAAASUVORK5CYII=';
const VIDEO_BYTES = Buffer.from([0, 0, 0, 24, 102, 116, 121, 112, 105, 115, 111, 109]);

describe('Agnes media provider', () => {
  let root: string;
  let projectRoot: string;
  let projectsRoot: string;
  const realFetch = globalThis.fetch;
  const originalKey = process.env.OD_AGNES_API_KEY;
  const originalPoll = process.env.OD_AGNES_VIDEO_POLL_INTERVAL_MS;
  const originalTimeout = process.env.OD_AGNES_VIDEO_TIMEOUT_MS;
  const originalAliases = process.env.OD_MEDIA_MODEL_ALIASES;
  const originalStubs = process.env.OD_MEDIA_ALLOW_STUBS;

  beforeEach(async () => {
    root = await mkdtemp(path.join(os.tmpdir(), 'od-agnes-media-'));
    projectRoot = path.join(root, 'repo');
    projectsRoot = path.join(projectRoot, '.od', 'projects');
    await mkdir(path.join(projectsRoot, 'project-1'), { recursive: true });
    process.env.OD_AGNES_API_KEY = 'agnes-media-test-key';
    process.env.OD_AGNES_VIDEO_POLL_INTERVAL_MS = '1';
    process.env.OD_AGNES_VIDEO_TIMEOUT_MS = '1000';
    delete process.env.OD_MEDIA_MODEL_ALIASES;
    delete process.env.OD_MEDIA_ALLOW_STUBS;
  });

  afterEach(async () => {
    globalThis.fetch = realFetch;
    vi.unstubAllGlobals();
    if (originalKey === undefined) delete process.env.OD_AGNES_API_KEY;
    else process.env.OD_AGNES_API_KEY = originalKey;
    if (originalPoll === undefined) delete process.env.OD_AGNES_VIDEO_POLL_INTERVAL_MS;
    else process.env.OD_AGNES_VIDEO_POLL_INTERVAL_MS = originalPoll;
    if (originalTimeout === undefined) delete process.env.OD_AGNES_VIDEO_TIMEOUT_MS;
    else process.env.OD_AGNES_VIDEO_TIMEOUT_MS = originalTimeout;
    if (originalAliases === undefined) delete process.env.OD_MEDIA_MODEL_ALIASES;
    else process.env.OD_MEDIA_MODEL_ALIASES = originalAliases;
    if (originalStubs === undefined) delete process.env.OD_MEDIA_ALLOW_STUBS;
    else process.env.OD_MEDIA_ALLOW_STUBS = originalStubs;
    await rm(root, { recursive: true, force: true });
  });

  function baseArgs() {
    return {
      projectRoot,
      projectsRoot,
      projectId: 'project-1',
      prompt: 'A refined editorial product campaign',
    };
  }

  it('invokes the fixed Agnes image endpoint with response_format nested in extra_body', async () => {
    const fetchMock = vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
      expect(String(input)).toBe(`${AGNES_BASE_URL}/images/generations`);
      expect(init?.method).toBe('POST');
      expect(init?.headers).toMatchObject({
        authorization: 'Bearer agnes-media-test-key',
        'content-type': 'application/json',
      });
      const body = JSON.parse(String(init?.body));
      expect(body).toEqual({
        model: AGNES_IMAGE_MODEL,
        prompt: 'A refined editorial product campaign',
        size: '1K',
        ratio: '3:4',
        extra_body: { response_format: 'url' },
      });
      expect(body).not.toHaveProperty('aspect_ratio');
      expect(body).not.toHaveProperty('response_format');
      return new Response(JSON.stringify({ data: [{ b64_json: PNG_BASE64 }] }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await generateMedia({
      ...baseArgs(),
      surface: 'image',
      model: AGNES_IMAGE_MODEL,
      output: 'campaign.png',
      aspect: '3:4',
    });

    expect(result.providerId).toBe('agnes');
    expect(result.usedStubFallback).toBe(false);
    expect(result.providerNote).toContain(`agnes/${AGNES_IMAGE_MODEL}`);
    expect(fetchMock).toHaveBeenCalledOnce();
    const bytes = await readFile(path.join(projectsRoot, 'project-1', result.name));
    expect(bytes.length).toBeGreaterThan(16);
  });

  it('requires the shared daemon environment credential instead of a stored browser-configured key', async () => {
    delete process.env.OD_AGNES_API_KEY;
    await mkdir(path.join(projectRoot, '.od'), { recursive: true });
    await writeFile(
      path.join(projectRoot, '.od', 'media-config.json'),
      JSON.stringify({ providers: { agnes: { apiKey: 'stored-key-must-not-be-used' } } }),
      'utf8',
    );
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(generateMedia({
      ...baseArgs(),
      surface: 'image',
      model: AGNES_IMAGE_MODEL,
      output: 'blocked.png',
      aspect: '1:1',
    })).rejects.toMatchObject({
      code: 'AGNES_NOT_CONFIGURED',
      status: 503,
      retryable: false,
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('classifies an Agnes TLS transport failure instead of exposing a generic HTTP 502', async () => {
    const cause = Object.assign(new Error('socket closed before TLS negotiation'), { code: 'ECONNRESET' });
    const fetchMock = vi.fn().mockRejectedValue(Object.assign(new TypeError('fetch failed'), { cause }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(generateMedia({
      ...baseArgs(),
      surface: 'image',
      model: AGNES_IMAGE_MODEL,
      output: 'network-error.png',
      aspect: '1:1',
    })).rejects.toMatchObject({
      code: 'AGNES_NETWORK_ERROR',
      status: 502,
      retryable: true,
    });
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it.each([
    ['{"error":{"message":"provider gateway overloaded"}}', 'provider gateway overloaded'],
    ['upstream connect error: connection reset', 'upstream connect error: connection reset'],
    ['<html><title>Bad Gateway</title><body>edge route unavailable</body></html>', 'Bad Gateway edge route unavailable'],
    ['', 'empty response body'],
  ])('preserves actionable detail from a final Agnes HTTP 502 response (%s)', async (body, expectedDetail) => {
    const fetchMock = vi.fn(async () => new Response(body, {
      status: 502,
      headers: {
        'content-type': body.startsWith('{') ? 'application/json' : 'text/plain',
        'retry-after': '0',
      },
    }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(generateMedia({
      ...baseArgs(),
      surface: 'image',
      model: AGNES_IMAGE_MODEL,
      output: 'upstream-error.png',
      aspect: '1:1',
    })).rejects.toMatchObject({
      code: 'AGNES_UPSTREAM_ERROR',
      status: 502,
      retryable: true,
      message: expect.stringContaining(expectedDetail),
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('submits, polls at the origin-level agnesapi endpoint, and downloads Agnes video', async () => {
    let pollCount = 0;
    const assetUrl = 'https://93.184.216.34/agnes-result.mp4';
    const fetchMock = vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
      const url = String(input);
      if (url === `${AGNES_BASE_URL}/videos`) {
        expect(init?.method).toBe('POST');
        const body = JSON.parse(String(init?.body));
        expect(body).toEqual({
          model: AGNES_VIDEO_MODEL,
          prompt: 'A refined editorial product campaign',
          mode: 'text',
          seconds: '5',
          size: '720P',
          aspect_ratio: '16:9',
          n: 1,
        });
        return new Response(JSON.stringify({ video_id: 'video_123' }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        });
      }
      if (url.startsWith('https://apihub.agnes-ai.com/agnesapi?')) {
        const parsed = new URL(url);
        expect(parsed.pathname).toBe('/agnesapi');
        expect(parsed.searchParams.get('video_id')).toBe('video_123');
        expect(parsed.searchParams.get('model_name')).toBe(AGNES_VIDEO_MODEL);
        pollCount += 1;
        return new Response(JSON.stringify(pollCount === 1
          ? { status: 'processing', progress: 37 }
          : { status: 'completed', progress: 100, url: assetUrl }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        });
      }
      if (url === assetUrl) {
        expect(init?.headers).not.toMatchObject({ authorization: expect.anything() });
        expect(init?.redirect).toBe('error');
        return new Response(VIDEO_BYTES, {
          status: 200,
          headers: { 'content-type': 'video/mp4' },
        });
      }
      throw new Error(`unexpected fetch: ${url}`);
    });
    vi.stubGlobal('fetch', fetchMock);
    const onProgress = vi.fn();

    const result = await generateMedia({
      ...baseArgs(),
      surface: 'video',
      model: AGNES_VIDEO_MODEL,
      output: 'campaign.mp4',
      aspect: '16:9',
      length: 5,
      onProgress,
    });

    expect(result.providerId).toBe('agnes');
    expect(result.usedStubFallback).toBe(false);
    expect(result.providerNote).toContain('720P · 5s');
    expect(pollCount).toBe(2);
    expect(onProgress).toHaveBeenCalledWith(expect.stringContaining('37%'));
    await expect(readFile(path.join(projectsRoot, 'project-1', result.name))).resolves.toEqual(VIDEO_BYTES);
  });
});
