/**
 * Bounded OpenAI-compatible text generation for DesignBuddy custom models.
 * Credentials are accepted only for the lifetime of one local daemon request
 * and are never returned in results or included in errors.
 */

import { buildOpenAIChatTokenParam } from './openai-chat-token-params.js';

const RESPONSE_LIMIT_BYTES = 1024 * 1024;
const HTML_LIMIT_BYTES = 320_000;
const REQUEST_TIMEOUT_MS = 120_000;
const DEFAULT_OUTPUT_TOKENS = 12_000;
const MAX_OUTPUT_TOKENS = 24_000;

const HTML_GATEWAY_RESPONSE_PATTERN = /(?:<!doctype\s+html\b|<html\b|<head\b|<body\b|<!--\s*\[if\s+[^\]]*\bie\b|&lt;!doctype\s+html\b|&lt;html\b|cf-error-details|cloudflare\s+ray\s+id)/i;

export interface OpenAiCompatibleDesignConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
  outputLimit?: number;
}

export interface OpenAiCompatibleDesignResult {
  html: string;
  content: string;
  model: string;
  usage: Record<string, unknown> | null;
}

export class OpenAiCompatibleDesignError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, message: string, status = 502) {
    super(message);
    this.name = 'OpenAiCompatibleDesignError';
    this.code = code;
    this.status = status;
  }
}

export function normalizeOpenAiCompatibleBaseUrl(value: string): string {
  if (typeof value !== 'string' || !value.trim() || value.length > 500) {
    throw new OpenAiCompatibleDesignError(
      'CUSTOM_MODEL_INVALID_CONFIG',
      'The custom model endpoint is missing or invalid. Edit it in Settings.',
      400,
    );
  }
  let parsed: URL;
  try {
    parsed = new URL(value.trim());
  } catch {
    throw new OpenAiCompatibleDesignError(
      'CUSTOM_MODEL_INVALID_CONFIG',
      'The custom model endpoint is not a valid URL. Edit it in Settings.',
      400,
    );
  }
  if (
    (parsed.protocol !== 'https:' && parsed.protocol !== 'http:')
    || !parsed.hostname
    || parsed.username
    || parsed.password
  ) {
    throw new OpenAiCompatibleDesignError(
      'CUSTOM_MODEL_INVALID_CONFIG',
      'The custom model endpoint must be an HTTP(S) URL without embedded credentials.',
      400,
    );
  }
  parsed.hash = '';
  parsed.search = '';
  parsed.pathname = parsed.pathname
    .replace(/\/+$/, '')
    .replace(/\/chat\/completions$/i, '') || '/';
  return parsed.toString().replace(/\/$/, '');
}

function validateConfig(config: OpenAiCompatibleDesignConfig): OpenAiCompatibleDesignConfig {
  const baseUrl = normalizeOpenAiCompatibleBaseUrl(config.baseUrl);
  const apiKey = typeof config.apiKey === 'string' ? config.apiKey.trim() : '';
  const model = typeof config.model === 'string' ? config.model.trim() : '';
  if (!apiKey || apiKey.length > 1000 || !model || model.length > 180) {
    throw new OpenAiCompatibleDesignError(
      'CUSTOM_MODEL_INVALID_CONFIG',
      'The custom model name or credential is incomplete. Fix it in Settings.',
      400,
    );
  }
  const requestedOutputLimit = Number(config.outputLimit);
  const outputLimit = Number.isFinite(requestedOutputLimit) && requestedOutputLimit > 0
    ? Math.min(MAX_OUTPUT_TOKENS, Math.round(requestedOutputLimit))
    : DEFAULT_OUTPUT_TOKENS;
  return { baseUrl, apiKey, model, outputLimit };
}

function responseTextPart(content: unknown): string {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';
  return content.map((part) => {
    if (typeof part === 'string') return part;
    if (!part || typeof part !== 'object') return '';
    const record = part as Record<string, unknown>;
    if (typeof record.text === 'string') return record.text;
    if (record.text && typeof record.text === 'object') {
      const value = (record.text as Record<string, unknown>).value;
      return typeof value === 'string' ? value : '';
    }
    return '';
  }).join('');
}

async function readResponseTextLimited(response: Response): Promise<string> {
  const announced = Number(response.headers.get('content-length'));
  if (Number.isFinite(announced) && announced > RESPONSE_LIMIT_BYTES) {
    throw new OpenAiCompatibleDesignError(
      'CUSTOM_MODEL_RESPONSE_TOO_LARGE',
      'The custom model returned a response that is too large.',
    );
  }
  if (!response.body) return '';
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const chunk = await reader.read();
    if (chunk.done) break;
    total += chunk.value.byteLength;
    if (total > RESPONSE_LIMIT_BYTES) {
      await reader.cancel().catch(() => undefined);
      throw new OpenAiCompatibleDesignError(
        'CUSTOM_MODEL_RESPONSE_TOO_LARGE',
        'The custom model returned a response that is too large.',
      );
    }
    chunks.push(chunk.value);
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(bytes);
}

function sanitizedUsage(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const source = value as Record<string, unknown>;
  const usage: Record<string, number> = {};
  for (const key of [
    'prompt_tokens',
    'completion_tokens',
    'total_tokens',
    'input_tokens',
    'output_tokens',
  ]) {
    const amount = source[key];
    if (typeof amount === 'number' && Number.isFinite(amount) && amount >= 0) {
      usage[key] = amount;
    }
  }
  return Object.keys(usage).length > 0 ? usage : null;
}

function sanitizedProviderMessage(
  payload: Record<string, unknown> | null,
  raw: string,
  apiKey: string,
): string {
  let message = '';
  const error = payload?.error;
  if (typeof error === 'string') message = error;
  else if (error && typeof error === 'object') {
    const candidate = (error as Record<string, unknown>).message;
    if (typeof candidate === 'string') message = candidate;
  }
  if (!message && typeof payload?.message === 'string') message = payload.message;
  if (!message && raw && !HTML_GATEWAY_RESPONSE_PATTERN.test(raw)) message = raw;
  if (!message || HTML_GATEWAY_RESPONSE_PATTERN.test(message)) {
    return 'The custom-model gateway returned an invalid response. Check the endpoint and try again.';
  }
  return message
    .split(apiKey).join('[redacted]')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 300)
    || 'The custom-model gateway rejected the request.';
}

function upstreamError(
  status: number,
  payload: Record<string, unknown> | null,
  raw: string,
  apiKey: string,
): OpenAiCompatibleDesignError {
  const detail = sanitizedProviderMessage(payload, raw, apiKey);
  if (status === 401) {
    return new OpenAiCompatibleDesignError(
      'CUSTOM_MODEL_AUTH_FAILED',
      `Custom model authentication failed. Update its API key in Settings. ${detail}`,
      401,
    );
  }
  if (status === 403) {
    return new OpenAiCompatibleDesignError(
      'CUSTOM_MODEL_FORBIDDEN',
      `The custom-model provider denied access. Check the key and model permissions. ${detail}`,
      403,
    );
  }
  if (status === 404) {
    return new OpenAiCompatibleDesignError(
      'CUSTOM_MODEL_NOT_FOUND',
      `The custom-model endpoint or model was not found. Check both values in Settings. ${detail}`,
      404,
    );
  }
  if (status === 429) {
    return new OpenAiCompatibleDesignError(
      'CUSTOM_MODEL_RATE_LIMITED',
      'The custom-model provider is rate limited. Wait briefly and try again.',
      429,
    );
  }
  return new OpenAiCompatibleDesignError(
    'CUSTOM_MODEL_UPSTREAM_ERROR',
    `The custom-model provider rejected the request. ${detail}`,
    502,
  );
}

function stripModelWrappers(value: string): string {
  let html = value.replace(/\u0000/g, '').replace(/<think\b[^>]*>[\s\S]*?<\/think\s*>/gi, '').trim();
  const fenced = html.match(/```(?:html)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) html = fenced[1].trim();
  const starts = [html.search(/<!doctype\s+html\b/i), html.search(/<html\b/i)]
    .filter((index) => index >= 0);
  if (starts.length > 0) html = html.slice(Math.min(...starts));
  const end = html.toLowerCase().lastIndexOf('</html>');
  if (end >= 0) html = html.slice(0, end + '</html>'.length);
  return html.trim();
}

export function constrainOpenAiCompatibleDesignHtml(value: string): string {
  let html = stripModelWrappers(value);
  if (!/<html\b/i.test(html) && /<body\b/i.test(html)) {
    html = `<!doctype html><html><head></head>${html}</html>`;
  }
  if (!/<html\b/i.test(html) || !/<body\b/i.test(html)) {
    throw new OpenAiCompatibleDesignError(
      'CUSTOM_MODEL_INVALID_HTML',
      'The custom model did not return a complete HTML artifact. Ask it to return one standalone HTML document.',
      422,
    );
  }
  html = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, '')
    .replace(/<script\b[^>]*>/gi, '')
    .replace(/<\/script\s*>/gi, '')
    .replace(/<base\b[^>]*>/gi, '')
    .replace(/<meta\b[^>]*http-equiv\s*=\s*(["'])?refresh\1?[^>]*>/gi, '');
  const csp = '<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; img-src data: blob:; media-src data: blob:; font-src data:; style-src \'unsafe-inline\'; script-src \'none\'; connect-src \'none\'; frame-src \'none\'; form-action \'none\'; base-uri \'none\'">';
  if (/<head\b[^>]*>/i.test(html)) {
    html = html.replace(/<head\b[^>]*>/i, (head) => `${head}${csp}`);
  } else {
    html = html.replace(/<html\b[^>]*>/i, (root) => `${root}<head>${csp}</head>`);
  }
  if (
    Buffer.byteLength(html, 'utf8') > HTML_LIMIT_BYTES
    || Buffer.byteLength(JSON.stringify({ html }), 'utf8') > 360_000
  ) {
    throw new OpenAiCompatibleDesignError(
      'CUSTOM_MODEL_HTML_TOO_LARGE',
      'The generated artifact is too large to save safely.',
      413,
    );
  }
  return html;
}

const DESIGN_SYSTEM_PROMPT = `You are the design generation engine inside DesignBuddy.
Create one polished, production-quality visual artifact as a complete standalone HTML document.
Return HTML only: no Markdown fence, explanation, preamble, or trailing commentary.
Use semantic HTML and embedded CSS. Do not use scripts, remote URLs, iframes, forms that submit, or external assets.
The artifact must work as a static preview, be responsive, and fit both desktop and mobile viewports.
Use a distinctive visual hierarchy, intentional spacing, accessible contrast, and realistic Chinese or English copy matching the user's language.
Do not mention that you are an AI. Never include secrets or API configuration.`;

function buildUserPrompt(options: {
  prompt: string;
  locale?: 'zh' | 'en';
  mode?: string;
  projectName?: string;
  previousHtml?: string;
}): string {
  const previous = typeof options.previousHtml === 'string'
    ? options.previousHtml.slice(0, 80_000)
    : '';
  return [
    `User language: ${options.locale === 'en' ? 'English' : 'Simplified Chinese'}.`,
    options.mode ? `Artifact type: ${options.mode.slice(0, 80)}.` : '',
    options.projectName
      ? `Existing project label (context only; never substitute it for the current request): ${options.projectName.slice(0, 120)}.`
      : '',
    `Current user request (authoritative):\n${options.prompt}`,
    previous
      ? `Revise the following existing artifact instead of starting over. Preserve good decisions while applying the current request:\n${previous}`
      : '',
  ].filter(Boolean).join('\n\n');
}

export async function generateOpenAiCompatibleDesign(options: {
  config: OpenAiCompatibleDesignConfig;
  prompt: string;
  locale?: 'zh' | 'en';
  mode?: string;
  projectName?: string;
  previousHtml?: string;
  signal?: AbortSignal;
  fetchImpl?: typeof fetch;
  requestInit?: RequestInit;
}): Promise<OpenAiCompatibleDesignResult> {
  const config = validateConfig(options.config);
  const prompt = typeof options.prompt === 'string' ? options.prompt.trim() : '';
  if (!prompt) {
    throw new OpenAiCompatibleDesignError('INVALID_PROMPT', 'A prompt is required.', 400);
  }
  if (prompt.length > 12_000) {
    throw new OpenAiCompatibleDesignError('PROMPT_TOO_LARGE', 'The prompt is too long.', 413);
  }
  if (options.previousHtml !== undefined && typeof options.previousHtml !== 'string') {
    throw new OpenAiCompatibleDesignError('INVALID_PREVIOUS_HTML', 'previousHtml must be a string.', 400);
  }

  const fetchImpl = options.fetchImpl ?? fetch;
  const timeoutSignal = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  const signal = options.signal
    ? AbortSignal.any([options.signal, timeoutSignal])
    : timeoutSignal;
  let response: Response;
  try {
    response = await fetchImpl(`${config.baseUrl}/chat/completions`, {
      ...(options.requestInit ?? {}),
      method: 'POST',
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${config.apiKey}`,
        'content-type': 'application/json',
      },
      redirect: 'error',
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: 'system', content: DESIGN_SYSTEM_PROMPT },
          {
            role: 'user',
            content: buildUserPrompt({
              prompt,
              ...(options.locale ? { locale: options.locale } : {}),
              ...(options.mode ? { mode: options.mode } : {}),
              ...(options.projectName ? { projectName: options.projectName } : {}),
              ...(typeof options.previousHtml === 'string'
                ? { previousHtml: options.previousHtml }
                : {}),
            }),
          },
        ],
        ...buildOpenAIChatTokenParam(config.model, config.outputLimit ?? DEFAULT_OUTPUT_TOKENS),
        stream: false,
      }),
      signal,
    } as RequestInit);
  } catch (error) {
    if (error instanceof OpenAiCompatibleDesignError) throw error;
    const aborted = error instanceof Error
      && (error.name === 'AbortError' || error.name === 'TimeoutError');
    throw new OpenAiCompatibleDesignError(
      aborted ? 'CUSTOM_MODEL_TIMEOUT' : 'CUSTOM_MODEL_NETWORK_ERROR',
      aborted
        ? 'The custom model did not respond before the request timed out. Check the endpoint, then try again.'
        : 'The daemon could not establish a secure connection to the custom-model endpoint. Check its URL, network access policy, or HTTPS proxy.',
      aborted ? 504 : 502,
    );
  }

  const raw = await readResponseTextLimited(response);
  let payload: Record<string, unknown> | null = null;
  try {
    payload = raw ? JSON.parse(raw) as Record<string, unknown> : null;
  } catch {
    payload = null;
  }
  if (!response.ok) throw upstreamError(response.status, payload, raw, config.apiKey);
  if (!payload) {
    throw new OpenAiCompatibleDesignError(
      'CUSTOM_MODEL_INVALID_RESPONSE',
      HTML_GATEWAY_RESPONSE_PATTERN.test(raw)
        ? 'The custom-model gateway returned an HTML page instead of JSON. Check the endpoint in Settings.'
        : 'The custom-model gateway returned invalid JSON. Check that it supports OpenAI chat completions.',
    );
  }

  const choices = Array.isArray(payload.choices) ? payload.choices : [];
  const first = choices[0];
  const message = first && typeof first === 'object'
    ? (first as Record<string, unknown>).message
    : null;
  const content = message && typeof message === 'object'
    ? responseTextPart((message as Record<string, unknown>).content)
    : '';
  if (!content.trim()) {
    throw new OpenAiCompatibleDesignError(
      'CUSTOM_MODEL_EMPTY_RESPONSE',
      'The custom model returned an empty response. Verify the model name and try again.',
    );
  }
  const usage = sanitizedUsage(payload.usage);
  const redactedContent = content.split(config.apiKey).join('[redacted]');
  return {
    html: constrainOpenAiCompatibleDesignHtml(redactedContent),
    content: redactedContent,
    model: config.model,
    usage,
  };
}
