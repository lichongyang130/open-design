import { afterEach, describe, expect, it, vi } from 'vitest';

import { submitArtifactLintFeedback } from '../../src/providers/daemon';

describe('submitArtifactLintFeedback', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('submits the current HTML snapshot and target path to its live run', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ok: true, steered: true, attempts: 1, messageId: 'message-1' }),
    }));

    const result = await submitArtifactLintFeedback({
      runId: 'run-1',
      artifactPath: 'src/index.html',
      html: '<html><body><h1>Draft</h1></body></html>',
    });

    expect(fetch).toHaveBeenCalledWith('/api/runs/run-1/artifact-lint-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        html: '<html><body><h1>Draft</h1></body></html>',
        artifactPath: 'src/index.html',
      }),
    });
    expect(result).toMatchObject({ ok: true, steered: true, attempts: 1, messageId: 'message-1' });
  });

  it('does not turn a refused steer into a success', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 409,
      json: async () => ({ ok: false, error: 'RUN_STEERING_CLOSED' }),
    }));

    const result = await submitArtifactLintFeedback({
      runId: 'run-1',
      artifactPath: 'index.html',
      html: '<main>Draft</main>',
    });

    expect(result).toMatchObject({ ok: false, error: 'RUN_STEERING_CLOSED' });
  });
});
