import { describe, expect, it } from 'vitest';

import { API_ERROR_CODES, type ApiErrorCode } from '../src/errors';

describe('shared API error codes', () => {
  it('exposes every public workspace project-creation failure code', () => {
    expect(API_ERROR_CODES).toEqual(expect.arrayContaining([
      'WORKSPACE_CONTEXT_INCOMPLETE',
      'WORKSPACE_PROJECT_PERMISSION_DENIED',
      'WORKSPACE_AUTHORITY_UNAVAILABLE',
    ]));
  });

  it('exposes AGENT_RUNTIME_DEF_INVALID for runtime-def validation failures', () => {
    // Chat-run startup emits this code through the shared SSE/status error
    // envelopes when a checked-in runtime def is invalid. Keeping the
    // assertion in the contracts package ensures contract-only refactors
    // cannot drop the literal without this package's own test lane failing.
    expect(API_ERROR_CODES).toContain('AGENT_RUNTIME_DEF_INVALID');
  });

  it('keeps AGENT_RUNTIME_DEF_INVALID assignable to ApiErrorCode', () => {
    const code: ApiErrorCode = 'AGENT_RUNTIME_DEF_INVALID';
    expect(code).toBe('AGENT_RUNTIME_DEF_INVALID');
  });

  it('exposes provider-specific custom-model failures for localized clients', () => {
    const codes: ApiErrorCode[] = [
      'CUSTOM_MODEL_NETWORK_ERROR',
      'CUSTOM_MODEL_NOT_CONFIGURED',
      'CUSTOM_MODEL_INVALID_HTML',
      'CUSTOM_MODEL_HTML_TOO_LARGE',
    ];
    expect(API_ERROR_CODES).toEqual(expect.arrayContaining(codes));
  });
});
