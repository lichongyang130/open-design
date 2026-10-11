import { DEFAULT_MODEL_OPTION } from './shared.js';
import type { RuntimeAgentDef } from '../types.js';

// DesignBuddy's Gemini adapter uses the official Gemini CLI in non-interactive
// mode. Keep this as a native Open Design runtime rather than introducing a
// second process manager: executable detection, environment isolation, stream
// handling, cancellation, and workspace scoping remain owned by the daemon.
export const geminiCliAgentDef = {
  id: 'gemini-cli',
  name: 'Gemini CLI',
  bin: 'gemini',
  versionArgs: ['--version'],
  fallbackModels: [DEFAULT_MODEL_OPTION],
  // Gemini CLI's documented print mode accepts the prompt as a positional
  // argument. Keep a conservative argv budget because this adapter does not
  // use stdin for the prompt.
  buildArgs: (prompt: string) => ['--yolo', '-p', prompt],
  maxPromptArgBytes: 30_000,
  streamFormat: 'plain',
  installUrl: 'https://github.com/google-gemini/gemini-cli',
  docsUrl: 'https://github.com/google-gemini/gemini-cli',
} satisfies RuntimeAgentDef;
