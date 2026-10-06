/**
 * Agnes is intentionally a fixed, daemon-side integration for DesignBuddy.
 * The public endpoint and model IDs are product configuration; the credential
 * must stay in OD_AGNES_API_KEY and is never returned to the browser.
 */
export const AGNES_BASE_URL = 'https://apihub.agnes-ai.com/v1';
export const AGNES_TEXT_MODEL = 'agnes-3.0-flash';
export const AGNES_IMAGE_MODEL = 'agnes-image-2.5-flash';
export const AGNES_VIDEO_MODEL = 'agnes-video-2.5-flash';

const AGNES_RESPONSE_LIMIT_BYTES = 1024 * 1024;
const AGNES_HTML_LIMIT_BYTES = 320_000;
const AGNES_TIMEOUT_MS = 120_000;

export class AgnesIntegrationError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, message: string, status = 502) {
    super(message);
    this.name = 'AgnesIntegrationError';
    this.code = code;
    this.status = status;
  }
}

export function getAgnesApiKey(): string {
  return process.env.OD_AGNES_API_KEY?.trim() || '';
}

export function isAgnesConfigured(): boolean {
  return getAgnesApiKey().length > 0;
}

function responseTextPart(content: unknown): string {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';
  return content
    .map((part) => {
      if (typeof part === 'string') return part;
      if (!part || typeof part !== 'object') return '';
      const record = part as Record<string, unknown>;
      if (typeof record.text === 'string') return record.text;
      if (record.text && typeof record.text === 'object') {
        const value = (record.text as Record<string, unknown>).value;
        if (typeof value === 'string') return value;
      }
      return '';
    })
    .join('');
}

async function readResponseTextLimited(response: Response): Promise<string> {
  const announced = Number(response.headers.get('content-length'));
  if (Number.isFinite(announced) && announced > AGNES_RESPONSE_LIMIT_BYTES) {
    throw new AgnesIntegrationError(
      'AGNES_RESPONSE_TOO_LARGE',
      'Agnes returned a response that is too large.',
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
    if (total > AGNES_RESPONSE_LIMIT_BYTES) {
      await reader.cancel().catch(() => undefined);
      throw new AgnesIntegrationError(
        'AGNES_RESPONSE_TOO_LARGE',
        'Agnes returned a response that is too large.',
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

function sanitizedUpstreamMessage(payload: unknown, apiKey: string): string {
  let value = '';
  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    const error = record.error;
    if (typeof error === 'string') value = error;
    else if (error && typeof error === 'object') {
      const message = (error as Record<string, unknown>).message;
      if (typeof message === 'string') value = message;
    }
    if (!value && typeof record.message === 'string') value = record.message;
  }
  if (!value) return 'The Agnes service rejected the request.';
  if (apiKey) value = value.split(apiKey).join('[redacted]');
  return value.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 300)
    || 'The Agnes service rejected the request.';
}

function mergeSignals(signal?: AbortSignal): AbortSignal {
  const timeout = AbortSignal.timeout(AGNES_TIMEOUT_MS);
  return signal ? AbortSignal.any([signal, timeout]) : timeout;
}

export interface AgnesChatResult {
  content: string;
  usage: Record<string, unknown> | null;
}

export async function callAgnesChat(options: {
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  maxTokens?: number;
  temperature?: number;
  signal?: AbortSignal;
  fetchImpl?: typeof fetch;
  requestInit?: RequestInit;
}): Promise<AgnesChatResult> {
  const apiKey = getAgnesApiKey();
  if (!apiKey) {
    throw new AgnesIntegrationError(
      'AGNES_NOT_CONFIGURED',
      'Agnes is not configured on the local daemon.',
      503,
    );
  }
  const fetchImpl = options.fetchImpl ?? fetch;
  let response: Response;
  try {
    response = await fetchImpl(`${AGNES_BASE_URL}/chat/completions`, {
      ...(options.requestInit ?? {}),
      method: 'POST',
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: AGNES_TEXT_MODEL,
        messages: options.messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 12_000,
        stream: false,
      }),
      signal: mergeSignals(options.signal),
    } as RequestInit);
  } catch (error) {
    if (error instanceof AgnesIntegrationError) throw error;
    const timedOut = error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError');
    throw new AgnesIntegrationError(
      timedOut ? 'AGNES_TIMEOUT' : 'AGNES_NETWORK_ERROR',
      timedOut
        ? 'Agnes did not respond before the request timed out.'
        : 'The daemon could not establish a secure connection to Agnes. Check outbound TLS access or HTTPS_PROXY.',
      timedOut ? 504 : 502,
    );
  }

  const raw = await readResponseTextLimited(response);
  let payload: Record<string, unknown> | null = null;
  try {
    payload = raw ? JSON.parse(raw) as Record<string, unknown> : null;
  } catch {
    payload = null;
  }
  if (!response.ok) {
    throw new AgnesIntegrationError(
      'AGNES_UPSTREAM_ERROR',
      sanitizedUpstreamMessage(payload, apiKey),
      response.status === 429 ? 429 : response.status === 401 || response.status === 403 ? 502 : 502,
    );
  }
  const choices = Array.isArray(payload?.choices) ? payload.choices : [];
  const first = choices[0];
  const message = first && typeof first === 'object'
    ? (first as Record<string, unknown>).message
    : null;
  const content = message && typeof message === 'object'
    ? responseTextPart((message as Record<string, unknown>).content)
    : '';
  if (!content.trim()) {
    throw new AgnesIntegrationError(
      'AGNES_EMPTY_RESPONSE',
      'Agnes returned an empty response.',
    );
  }
  const usage = payload?.usage && typeof payload.usage === 'object'
    ? payload.usage as Record<string, unknown>
    : null;
  return { content, usage };
}

const DESIGN_SYSTEM_PROMPT = `You are the design generation engine inside DesignBuddy.
Create one polished, production-quality visual artifact as a complete standalone HTML document.
Return HTML only: no Markdown fence, explanation, preamble, or trailing commentary.
Use semantic HTML and embedded CSS. Do not use scripts, remote URLs, iframes, forms that submit, or external assets.
The artifact must work as a static preview, be responsive, and fit both desktop and mobile viewports.
Use a distinctive visual hierarchy, intentional spacing, accessible contrast, and realistic Chinese or English copy matching the user's language.
Do not mention that you are an AI. Never include secrets or API configuration.`;

function stripModelWrappers(value: string): string {
  let html = value.replace(/\u0000/g, '').replace(/<think\b[^>]*>[\s\S]*?<\/think\s*>/gi, '').trim();
  const fenced = html.match(/```(?:html)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) html = fenced[1].trim();
  const starts = [html.search(/<!doctype\s+html\b/i), html.search(/<html\b/i)].filter((n) => n >= 0);
  if (starts.length > 0) html = html.slice(Math.min(...starts));
  const end = html.toLowerCase().lastIndexOf('</html>');
  if (end >= 0) html = html.slice(0, end + '</html>'.length);
  return html.trim();
}

function constrainGeneratedHtml(value: string): string {
  let html = stripModelWrappers(value);
  if (!/<html\b/i.test(html) && /<body\b/i.test(html)) {
    html = `<!doctype html><html><head></head>${html}</html>`;
  }
  if (!/<html\b/i.test(html) || !/<body\b/i.test(html)) {
    throw new AgnesIntegrationError(
      'AGNES_INVALID_HTML',
      'Agnes did not return a complete HTML artifact.',
    );
  }

  // A sandbox is also enforced by Studio. These transformations add defense in
  // depth and stop model output from making network requests in static previews.
  html = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, '')
    .replace(/<base\b[^>]*>/gi, '')
    .replace(/<meta\b[^>]*http-equiv\s*=\s*(["'])?refresh\1?[^>]*>/gi, '');
  const csp = '<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; img-src data: blob:; media-src data: blob:; font-src data:; style-src \'unsafe-inline\'; script-src \'none\'; connect-src \'none\'; frame-src \'none\'; form-action \'none\'; base-uri \'none\'">';
  if (/<head\b[^>]*>/i.test(html)) html = html.replace(/<head\b[^>]*>/i, (head) => `${head}${csp}`);
  else html = html.replace(/<html\b[^>]*>/i, (root) => `${root}<head>${csp}</head>`);

  if (
    Buffer.byteLength(html, 'utf8') > AGNES_HTML_LIMIT_BYTES
    || Buffer.byteLength(JSON.stringify({ html }), 'utf8') > 360_000
  ) {
    throw new AgnesIntegrationError(
      'AGNES_HTML_TOO_LARGE',
      'The generated artifact is too large to save safely.',
    );
  }
  return html;
}

export async function generateAgnesDesign(options: {
  prompt: string;
  locale?: 'zh' | 'en';
  mode?: string;
  projectName?: string;
  previousHtml?: string;
  signal?: AbortSignal;
  fetchImpl?: typeof fetch;
  requestInit?: RequestInit;
}): Promise<AgnesChatResult & { html: string }> {
  const prompt = options.prompt.trim();
  if (!prompt) {
    throw new AgnesIntegrationError('INVALID_PROMPT', 'A prompt is required.', 400);
  }
  if (prompt.length > 12_000) {
    throw new AgnesIntegrationError('PROMPT_TOO_LARGE', 'The prompt is too long.', 413);
  }
  const previous = typeof options.previousHtml === 'string'
    ? options.previousHtml.slice(0, 80_000)
    : '';
  const context = [
    `User language: ${options.locale === 'en' ? 'English' : 'Simplified Chinese'}.`,
    options.mode ? `Artifact type: ${options.mode.slice(0, 80)}.` : '',
    options.projectName ? `Project name: ${options.projectName.slice(0, 120)}.` : '',
    `Request:\n${prompt}`,
    previous ? `Revise the following existing artifact instead of starting over. Preserve good decisions while applying the request:\n${previous}` : '',
  ].filter(Boolean).join('\n\n');
  const result = await callAgnesChat({
    messages: [
      { role: 'system', content: DESIGN_SYSTEM_PROMPT },
      { role: 'user', content: context },
    ],
    ...(options.signal ? { signal: options.signal } : {}),
    ...(options.fetchImpl ? { fetchImpl: options.fetchImpl } : {}),
    ...(options.requestInit ? { requestInit: options.requestInit } : {}),
  });
  return { ...result, html: constrainGeneratedHtml(result.content) };
}

export async function testAgnesConnection(options: {
  signal?: AbortSignal;
  fetchImpl?: typeof fetch;
  requestInit?: RequestInit;
} = {}): Promise<void> {
  const result = await callAgnesChat({
    messages: [
      { role: 'system', content: 'Reply with the single word OK.' },
      { role: 'user', content: 'Connection test.' },
    ],
    maxTokens: 8,
    temperature: 0,
    ...(options.signal ? { signal: options.signal } : {}),
    ...(options.fetchImpl ? { fetchImpl: options.fetchImpl } : {}),
    ...(options.requestInit ? { requestInit: options.requestInit } : {}),
  });
  if (!result.content.trim()) {
    throw new AgnesIntegrationError('AGNES_EMPTY_RESPONSE', 'Agnes returned an empty response.');
  }
}
