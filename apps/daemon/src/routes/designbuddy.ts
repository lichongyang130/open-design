// DesignBuddy demo-layer API. The static pages in apps/web/public call these
// with same-origin relative URLs; the web dev server (and the packaged sidecar)
// proxy /api/* to this daemon, so no CORS setup is needed on the client.
//
//   GET  /api/db/profile           -> persisted local-workspace display name
//   PUT  /api/db/profile           <- { displayName }
//   GET  /api/db/role              -> { role }
//   PUT  /api/db/role              <- { role }  (designer | pm | dev | admin)
//   GET  /api/db/reviews           -> { reviews: [...] }
//   POST /api/db/reviews           <- { title, author?, note? } -> 201 { review }
//   POST /api/db/reviews/:id/status <- { status: 'pass' | 'reject' } -> { review }
//   GET  /api/db/stats             -> { projects, promptsThisMonth, ... trend }
//   GET  /api/db/starter-projects/status -> persisted starter initialization marker
//   POST /api/db/starter-projects/initialize <- { role } -> materialized starter projects
//   GET  /api/db/projects/gen-summaries -> latest generation state and artifact per project
//   GET  /api/db/projects/:id/gen  -> { events: [...] }   (AI 生成过程事件流)
//   POST /api/db/projects/:id/gen  <- { type, payload } -> 201 { event }
//   GET  /api/db/agnes/config      -> public fixed-model metadata (never the key)
//   POST /api/db/agnes/test        -> daemon-side Agnes connectivity check
//   POST /api/db/agnes/generation-jobs -> start proxy-safe background HTML generation
//   GET/DELETE /api/db/agnes/generation-jobs/:id -> poll or cancel generation
//   POST /api/db/custom-model/generation-jobs -> generate through the selected custom config
//   GET/DELETE /api/db/custom-model/generation-jobs/:id -> poll or cancel custom generation
//   POST /api/db/custom-model/constrain-html -> harden browser-fallback model output
//   POST /api/db/agnes/generate    -> bounded synchronous compatibility endpoint

import type { Express } from 'express';
import type { RouteDeps } from '../server-context.js';
import { sendApiError } from '../http/api-errors.js';
import {
  persistDesignBuddyHtmlArtifact,
  reconcileDesignBuddyProjectArtifacts,
} from '../designbuddy-artifacts.js';
import {
  proxyDispatcherRequestInit,
  validateUserProviderBaseUrl,
} from '../connectionTest.js';
import {
  AGNES_BASE_URL,
  AGNES_IMAGE_MODEL,
  AGNES_TEXT_MODEL,
  AGNES_VIDEO_MODEL,
  AgnesIntegrationError,
  generateAgnesDesign,
  isAgnesConfigured,
  testAgnesConnection,
} from '../integrations/agnes.js';
import {
  OpenAiCompatibleDesignError,
  constrainOpenAiCompatibleDesignHtml,
  generateOpenAiCompatibleDesign,
  type OpenAiCompatibleDesignConfig,
} from '../integrations/openai-compatible-design.js';
import {
  DESIGNBUDDY_GEN_EVENT_TYPES,
  DESIGNBUDDY_GEN_PAYLOAD_LIMIT,
  DESIGNBUDDY_REVIEW_STATUS_TRANSITIONS,
  DESIGNBUDDY_ROLES,
  appendDesignBuddyGenEvent,
  cancelDesignBuddyGenerationJob,
  completeDesignBuddyGenerationJob,
  countRunningDesignBuddyGenerationJobs,
  createDesignBuddyGenerationJob,
  createDesignBuddyReview,
  designBuddyStats,
  failDesignBuddyGenerationJob,
  getDesignBuddyGenerationJob,
  initializeDesignBuddyStarterProjects,
  listDesignBuddyGenerationJobs,
  listDesignBuddyGenEvents,
  listDesignBuddyGenSummaries,
  listDesignBuddyReviews,
  pruneDesignBuddyGenerationJobs,
  readDesignBuddyProfile,
  readDesignBuddyRole,
  readDesignBuddyStarterStatus,
  reconcileInterruptedDesignBuddyGenerationJobs,
  setDesignBuddyProfile,
  setDesignBuddyReviewStatus,
  setDesignBuddyRole,
  type DesignBuddyGenerationJob,
  type DesignBuddyGenerationProvider,
} from '../designbuddy-store.js';

export interface RegisterDesignBuddyRoutesDeps extends RouteDeps<'db'> {
  paths: Pick<RouteDeps<'paths'>['paths'], 'PROJECTS_DIR'>;
}

const AGNES_GENERATION_JOB_LIMIT = 4;
const CUSTOM_MODEL_GENERATION_JOB_LIMIT = 4;
const generationJobControllers = new Map<string, AbortController>();

function normalizeAgnesError(error: unknown): AgnesIntegrationError {
  return error instanceof AgnesIntegrationError
    ? error
    : new AgnesIntegrationError('AGNES_UNAVAILABLE', 'Agnes is currently unavailable.');
}

function resolveCustomModelGenerationConfig(value: unknown): OpenAiCompatibleDesignConfig {
  const provider = value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
  if (provider.protocol !== 'openai') {
    throw new OpenAiCompatibleDesignError(
      'CUSTOM_MODEL_PROTOCOL_UNSUPPORTED',
      'Custom-model generation currently requires the OpenAI-compatible protocol. Change it in Settings.',
      422,
    );
  }
  const serverManaged = provider.credentialSource === 'designbuddy_custom_model';
  if (serverManaged) {
    // Keep Open Design's existing OD_* names authoritative, while accepting
    // DesignBuddy's original server-side model settings as compatible aliases.
    // This lets the DesignBuddy custom-model option reuse the daemon proxy
    // without exposing a server-owned API key to browser storage or requests.
    const baseUrl =
      process.env.OD_CUSTOM_MODEL_BASE_URL?.trim()
      || process.env.DESIGNBUDDY_MODEL_BASE_URL?.trim()
      || '';
    const apiKey =
      process.env.OD_CUSTOM_MODEL_API_KEY?.trim()
      || process.env.DESIGNBUDDY_MODEL_API_KEY?.trim()
      || '';
    const model =
      process.env.OD_CUSTOM_MODEL_NAME?.trim()
      || process.env.DESIGNBUDDY_MODEL_ID?.trim()
      || '';
    let isLoopback = false;
    try {
      const hostname = new URL(baseUrl).hostname.toLowerCase();
      isLoopback = ['localhost', '127.0.0.1', '::1', '[::1]'].includes(hostname);
    } catch {
      // The shared provider validation below will return the actionable URL error.
    }
    if (!baseUrl || !model || (!apiKey && !isLoopback)) {
      throw new OpenAiCompatibleDesignError(
        'CUSTOM_MODEL_NOT_CONFIGURED',
        'The server-managed custom model is not configured. Set OD_CUSTOM_MODEL_BASE_URL / OD_CUSTOM_MODEL_NAME (and OD_CUSTOM_MODEL_API_KEY for remote endpoints), or the compatible DESIGNBUDDY_MODEL_BASE_URL / DESIGNBUDDY_MODEL_ID / DESIGNBUDDY_MODEL_API_KEY variables, then restart the daemon.',
        503,
      );
    }
    return {
      baseUrl,
      apiKey,
      model,
      ...(typeof provider.outputLimit === 'number'
        ? { outputLimit: provider.outputLimit }
        : {}),
    };
  }
  return {
    baseUrl: typeof provider.baseUrl === 'string' ? provider.baseUrl : '',
    apiKey: typeof provider.apiKey === 'string' ? provider.apiKey : '',
    model: typeof provider.model === 'string' ? provider.model : '',
    ...(typeof provider.outputLimit === 'number'
      ? { outputLimit: provider.outputLimit }
      : {}),
  };
}

function normalizeCustomModelError(error: unknown): OpenAiCompatibleDesignError {
  return error instanceof OpenAiCompatibleDesignError
    ? error
    : new OpenAiCompatibleDesignError(
        'CUSTOM_MODEL_UNAVAILABLE',
        'The custom model is currently unavailable. Check its connection in Settings.',
      );
}

class DesignBuddyArtifactPersistError extends Error {
  readonly code = 'ARTIFACT_PERSIST_FAILED';
  readonly status = 500;

  constructor() {
    super('The design was generated, but its project file could not be saved. Retry the request.');
    this.name = 'DesignBuddyArtifactPersistError';
  }
}

function optionalProjectId(db: any, value: unknown): string | null | undefined {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string' || value.length > 160) return undefined;
  const project = db.prepare(`SELECT 1 AS ok FROM projects WHERE id = ?`).get(value);
  return project ? value : undefined;
}

function generationJobEnvelope(job: DesignBuddyGenerationJob): Record<string, unknown> {
  const base = {
    id: job.id,
    jobId: job.id,
    provider: job.provider,
    projectId: job.projectId,
    status: job.status,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
  };
  if (job.status === 'succeeded') return { ...base, result: job.result };
  if (job.status !== 'running') {
    return {
      ...base,
      error: job.error ?? {
        code: 'GENERATION_FAILED',
        message: 'Generation did not complete.',
        status: 500,
      },
    };
  }
  return base;
}

function boundedRequestText(value: unknown, max: number): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim().slice(0, max) : undefined;
}

async function persistGenerationResult(
  db: any,
  projectsRoot: string,
  job: DesignBuddyGenerationJob,
  generated: {
    html: string;
    model: string;
    usage: Record<string, unknown> | null;
    latencyMs: number;
  },
): Promise<Record<string, unknown>> {
  const request = job.request;
  if (!job.projectId) {
    return {
      html: generated.html,
      model: generated.model,
      usage: generated.usage,
      latencyMs: generated.latencyMs,
      jobId: job.id,
      provider: job.provider,
    };
  }
  try {
    const artifact = await persistDesignBuddyHtmlArtifact(db, projectsRoot, {
      projectId: job.projectId,
      html: generated.html,
      prompt: boundedRequestText(request.prompt, 12_000),
      kind: boundedRequestText(request.kind, 64),
      title: boundedRequestText(request.projectName, 200),
      model: generated.model,
      provider: job.provider,
      jobId: job.id,
      version: Number(request.version) || 1,
      fileName: boundedRequestText(request.artifactFileName, 160),
      transport: 'daemon',
    });
    return {
      ...artifact,
      usage: generated.usage,
      latencyMs: generated.latencyMs,
    };
  } catch (error) {
    console.warn('[designbuddy] failed to persist generated project artifact:', error);
    throw new DesignBuddyArtifactPersistError();
  }
}

function failDurableGenerationJob(
  db: any,
  jobId: string,
  error: unknown,
  normalize: (error: unknown) => { code: string; message: string; status: number },
): void {
  const normalized = error instanceof DesignBuddyArtifactPersistError
    ? error
    : normalize(error);
  failDesignBuddyGenerationJob(db, jobId, {
    code: normalized.code,
    message: normalized.message,
    status: normalized.status,
  });
}

export function registerDesignBuddyRoutes(app: Express, ctx: RegisterDesignBuddyRoutesDeps): void {
  const { db } = ctx;
  const { PROJECTS_DIR } = ctx.paths;
  reconcileInterruptedDesignBuddyGenerationJobs(db);
  pruneDesignBuddyGenerationJobs(db);

  app.get('/api/db/agnes/config', (_req, res) => {
    res.json({
      provider: 'Agnes AI',
      baseUrl: AGNES_BASE_URL,
      configured: isAgnesConfigured(),
      models: {
        text: AGNES_TEXT_MODEL,
        image: AGNES_IMAGE_MODEL,
        video: AGNES_VIDEO_MODEL,
      },
    });
  });

  app.post('/api/db/agnes/test', async (req, res) => {
    const controller = new AbortController();
    const proxyDispatcher = proxyDispatcherRequestInit(process.env);
    const abort = () => controller.abort();
    req.once('aborted', abort);
    try {
      const startedAt = Date.now();
      await testAgnesConnection({
        signal: controller.signal,
        requestInit: proxyDispatcher.requestInit,
      });
      res.json({ ok: true, model: AGNES_TEXT_MODEL, latencyMs: Date.now() - startedAt });
    } catch (error) {
      if (res.headersSent) return;
      const normalized = error instanceof AgnesIntegrationError
        ? error
        : new AgnesIntegrationError('AGNES_UNAVAILABLE', 'Agnes is currently unavailable.');
      res.status(normalized.status).json({
        error: { code: normalized.code, message: normalized.message },
      });
    } finally {
      await proxyDispatcher.close();
      req.off('aborted', abort);
    }
  });

  // Text generation can outlive browser/CDN request deadlines. Jobs are owned
  // by SQLite, while only the AbortController remains process-local. A daemon
  // restart reconciles any still-running row to `interrupted` instead of making
  // the poll URL disappear or falsely reporting success.
  app.post('/api/db/agnes/generation-jobs', (req, res) => {
    const prompt = req.body?.prompt;
    const previousHtml = req.body?.previousHtml;
    if (typeof prompt !== 'string' || !prompt.trim()) {
      return sendApiError(res, 400, 'BAD_REQUEST', 'prompt is required');
    }
    if (prompt.length > 12_000) {
      return sendApiError(res, 413, 'PAYLOAD_TOO_LARGE', 'prompt is too long');
    }
    if (previousHtml !== undefined && typeof previousHtml !== 'string') {
      return sendApiError(res, 400, 'BAD_REQUEST', 'previousHtml must be a string');
    }
    if (typeof previousHtml === 'string' && previousHtml.length > 120_000) {
      return sendApiError(res, 413, 'PAYLOAD_TOO_LARGE', 'previousHtml is too large');
    }
    const projectId = optionalProjectId(db, req.body?.projectId);
    if (projectId === undefined) {
      return sendApiError(res, 404, 'PROJECT_NOT_FOUND', 'project not found');
    }
    if (countRunningDesignBuddyGenerationJobs(db, 'agnes') >= AGNES_GENERATION_JOB_LIMIT) {
      return sendApiError(res, 429, 'RATE_LIMITED', 'Too many Agnes generations are already running');
    }

    const locale = req.body?.locale === 'en' ? 'en' : 'zh';
    const mode = boundedRequestText(req.body?.mode, 160);
    const projectName = boundedRequestText(req.body?.projectName, 200);
    const job = createDesignBuddyGenerationJob(db, {
      provider: 'agnes',
      projectId,
      request: {
        prompt: prompt.trim(),
        locale,
        ...(mode ? { mode } : {}),
        ...(projectName ? { projectName } : {}),
        kind: boundedRequestText(req.body?.kind, 64) ?? 'page',
        version: Math.max(1, Number(req.body?.version) || 1),
        ...(boundedRequestText(req.body?.artifactFileName, 160)
          ? { artifactFileName: boundedRequestText(req.body?.artifactFileName, 160) }
          : {}),
      },
    });
    const controller = new AbortController();
    generationJobControllers.set(job.id, controller);
    res.status(202).json({ jobId: job.id, status: job.status, provider: job.provider });

    const proxyDispatcher = proxyDispatcherRequestInit(process.env);
    void (async () => {
      const startedAt = Date.now();
      try {
        const result = await generateAgnesDesign({
          prompt,
          locale,
          ...(mode ? { mode } : {}),
          ...(projectName ? { projectName } : {}),
          ...(typeof previousHtml === 'string' ? { previousHtml } : {}),
          signal: controller.signal,
          requestInit: proxyDispatcher.requestInit,
        });
        const current = getDesignBuddyGenerationJob(db, job.id);
        if (!current || current.status !== 'running') return;
        const persisted = await persistGenerationResult(db, PROJECTS_DIR, current, {
          html: result.html,
          model: AGNES_TEXT_MODEL,
          usage: result.usage,
          latencyMs: Date.now() - startedAt,
        });
        completeDesignBuddyGenerationJob(db, job.id, persisted);
      } catch (error) {
        const current = getDesignBuddyGenerationJob(db, job.id);
        if (!current || current.status !== 'running') return;
        failDurableGenerationJob(db, job.id, error, normalizeAgnesError);
      } finally {
        generationJobControllers.delete(job.id);
        await proxyDispatcher.close();
      }
    })();
  });

  app.get('/api/db/agnes/generation-jobs/:jobId', (req, res) => {
    const job = getDesignBuddyGenerationJob(db, req.params.jobId);
    if (!job || job.provider !== 'agnes') {
      return sendApiError(res, 404, 'NOT_FOUND', 'Agnes generation job not found');
    }
    res.setHeader('Cache-Control', 'no-store');
    return res.json(generationJobEnvelope(job));
  });

  app.delete('/api/db/agnes/generation-jobs/:jobId', (req, res) => {
    const job = getDesignBuddyGenerationJob(db, req.params.jobId);
    if (!job || job.provider !== 'agnes') return res.status(204).end();
    if (job.status === 'running') {
      cancelDesignBuddyGenerationJob(db, job.id);
      generationJobControllers.get(job.id)?.abort();
    }
    return res.status(204).end();
  });

  // Browser fallback is allowed only when the user already holds a manual key.
  // Keep model output untrusted: send it back through the daemon's exact same
  // HTML constraint before Studio renders it in an artifact frame.
  app.post('/api/db/custom-model/constrain-html', (req, res) => {
    const content = req.body?.content;
    if (typeof content !== 'string' || !content.trim()) {
      return sendApiError(res, 400, 'BAD_REQUEST', 'content is required');
    }
    if (Buffer.byteLength(content, 'utf8') > 1024 * 1024) {
      return sendApiError(res, 413, 'PAYLOAD_TOO_LARGE', 'content is too large');
    }
    try {
      return res.json({ html: constrainOpenAiCompatibleDesignHtml(content) });
    } catch (error) {
      const normalized = normalizeCustomModelError(error);
      const code = normalized.code === 'CUSTOM_MODEL_HTML_TOO_LARGE'
        ? 'CUSTOM_MODEL_HTML_TOO_LARGE'
        : 'CUSTOM_MODEL_INVALID_HTML';
      return sendApiError(
        res,
        normalized.status === 413 ? 413 : 422,
        code,
        normalized.message,
      );
    }
  });

  app.post('/api/db/custom-model/generation-jobs', async (req, res) => {
    const prompt = req.body?.prompt;
    const previousHtml = req.body?.previousHtml;
    if (typeof prompt !== 'string' || !prompt.trim()) {
      return sendApiError(res, 400, 'BAD_REQUEST', 'prompt is required');
    }
    if (prompt.length > 12_000) {
      return sendApiError(res, 413, 'PAYLOAD_TOO_LARGE', 'prompt is too long');
    }
    if (previousHtml !== undefined && typeof previousHtml !== 'string') {
      return sendApiError(res, 400, 'BAD_REQUEST', 'previousHtml must be a string');
    }
    if (typeof previousHtml === 'string' && previousHtml.length > 120_000) {
      return sendApiError(res, 413, 'PAYLOAD_TOO_LARGE', 'previousHtml is too large');
    }
    const projectId = optionalProjectId(db, req.body?.projectId);
    if (projectId === undefined) {
      return sendApiError(res, 404, 'PROJECT_NOT_FOUND', 'project not found');
    }
    let config: OpenAiCompatibleDesignConfig;
    try {
      config = resolveCustomModelGenerationConfig(req.body?.provider);
    } catch (error) {
      const normalized = normalizeCustomModelError(error);
      const code = normalized.code === 'CUSTOM_MODEL_NOT_CONFIGURED'
        ? 'CUSTOM_MODEL_NOT_CONFIGURED'
        : normalized.code === 'CUSTOM_MODEL_PROTOCOL_UNSUPPORTED'
          ? 'CUSTOM_MODEL_PROTOCOL_UNSUPPORTED'
          : 'CUSTOM_MODEL_INVALID_CONFIG';
      return sendApiError(res, normalized.status, code, normalized.message);
    }
    const validatedEndpoint = await validateUserProviderBaseUrl(config.baseUrl);
    if (validatedEndpoint.error || !validatedEndpoint.parsed) {
      return sendApiError(
        res,
        validatedEndpoint.forbidden ? 403 : 400,
        validatedEndpoint.forbidden ? 'FORBIDDEN' : 'BAD_REQUEST',
        validatedEndpoint.forbidden
          ? 'The custom model endpoint is blocked by the daemon network policy.'
          : 'The custom model endpoint is invalid. Fix it in Settings.',
      );
    }
    if (countRunningDesignBuddyGenerationJobs(db, 'custom-model') >= CUSTOM_MODEL_GENERATION_JOB_LIMIT) {
      return sendApiError(
        res,
        429,
        'RATE_LIMITED',
        'Too many custom-model generations are already running',
      );
    }

    const locale = req.body?.locale === 'en' ? 'en' : 'zh';
    const mode = boundedRequestText(req.body?.mode, 160);
    const projectName = boundedRequestText(req.body?.projectName, 200);
    const rawProvider = req.body?.provider && typeof req.body.provider === 'object'
      ? req.body.provider as Record<string, unknown>
      : {};
    const job = createDesignBuddyGenerationJob(db, {
      provider: 'custom-model',
      projectId,
      request: {
        prompt: prompt.trim(),
        locale,
        ...(mode ? { mode } : {}),
        ...(projectName ? { projectName } : {}),
        kind: boundedRequestText(req.body?.kind, 64) ?? 'page',
        version: Math.max(1, Number(req.body?.version) || 1),
        ...(boundedRequestText(req.body?.artifactFileName, 160)
          ? { artifactFileName: boundedRequestText(req.body?.artifactFileName, 160) }
          : {}),
        provider: {
          protocol: 'openai',
          baseUrl: config.baseUrl,
          model: config.model,
          credentialSource: rawProvider.credentialSource === 'designbuddy_custom_model'
            ? 'designbuddy_custom_model'
            : 'manual',
        },
      },
    });
    const controller = new AbortController();
    generationJobControllers.set(job.id, controller);
    res.status(202).json({ jobId: job.id, status: job.status, provider: job.provider });

    const proxyDispatcher = proxyDispatcherRequestInit(process.env);
    void (async () => {
      const startedAt = Date.now();
      try {
        const result = await generateOpenAiCompatibleDesign({
          config,
          prompt,
          locale,
          ...(mode ? { mode } : {}),
          ...(projectName ? { projectName } : {}),
          ...(typeof previousHtml === 'string' ? { previousHtml } : {}),
          signal: controller.signal,
          requestInit: proxyDispatcher.requestInit,
        });
        const current = getDesignBuddyGenerationJob(db, job.id);
        if (!current || current.status !== 'running') return;
        const persisted = await persistGenerationResult(db, PROJECTS_DIR, current, {
          html: result.html,
          model: result.model,
          usage: result.usage,
          latencyMs: Date.now() - startedAt,
        });
        completeDesignBuddyGenerationJob(db, job.id, persisted);
      } catch (error) {
        const current = getDesignBuddyGenerationJob(db, job.id);
        if (!current || current.status !== 'running') return;
        failDurableGenerationJob(db, job.id, error, normalizeCustomModelError);
      } finally {
        generationJobControllers.delete(job.id);
        await proxyDispatcher.close();
      }
    })();
  });

  app.get('/api/db/custom-model/generation-jobs/:jobId', (req, res) => {
    const job = getDesignBuddyGenerationJob(db, req.params.jobId);
    if (!job || job.provider !== 'custom-model') {
      return sendApiError(res, 404, 'NOT_FOUND', 'Custom-model generation job not found');
    }
    res.setHeader('Cache-Control', 'no-store');
    return res.json(generationJobEnvelope(job));
  });

  app.delete('/api/db/custom-model/generation-jobs/:jobId', (req, res) => {
    const job = getDesignBuddyGenerationJob(db, req.params.jobId);
    if (!job || job.provider !== 'custom-model') return res.status(204).end();
    if (job.status === 'running') {
      cancelDesignBuddyGenerationJob(db, job.id);
      generationJobControllers.get(job.id)?.abort();
    }
    return res.status(204).end();
  });

  app.get('/api/db/projects/:id/generation-jobs', (req, res) => {
    const project = db.prepare(`SELECT 1 AS ok FROM projects WHERE id = ?`).get(req.params.id);
    if (!project) return sendApiError(res, 404, 'PROJECT_NOT_FOUND', 'project not found');
    const provider = typeof req.query.provider === 'string'
      && (req.query.provider === 'agnes' || req.query.provider === 'custom-model')
      ? req.query.provider as DesignBuddyGenerationProvider
      : undefined;
    const jobs = listDesignBuddyGenerationJobs(db, {
      projectId: req.params.id,
      ...(provider ? { provider } : {}),
      limit: Number(req.query.limit) || 10,
    });
    res.setHeader('Cache-Control', 'no-store');
    res.json({ jobs: jobs.map(generationJobEnvelope) });
  });

  app.get('/api/db/generation-jobs/:jobId', (req, res) => {
    const job = getDesignBuddyGenerationJob(db, req.params.jobId);
    if (!job) return sendApiError(res, 404, 'NOT_FOUND', 'generation job not found');
    res.setHeader('Cache-Control', 'no-store');
    res.json(generationJobEnvelope(job));
  });

  app.delete('/api/db/generation-jobs/:jobId', (req, res) => {
    const job = getDesignBuddyGenerationJob(db, req.params.jobId);
    if (!job) return res.status(204).end();
    if (job.status === 'running') {
      cancelDesignBuddyGenerationJob(db, job.id);
      generationJobControllers.get(job.id)?.abort();
    }
    return res.status(204).end();
  });

  // Browser-side custom-model fallback still crosses the same trusted save
  // boundary: constrain once more, write a project file + manifest + immutable
  // version, then lint the committed bytes before returning it to Studio.
  app.post('/api/db/projects/:id/generated-artifacts', async (req, res) => {
    const html = req.body?.html;
    if (typeof html !== 'string' || !html.trim()) {
      return sendApiError(res, 400, 'BAD_REQUEST', 'html is required');
    }
    if (Buffer.byteLength(html, 'utf8') > 1024 * 1024) {
      return sendApiError(res, 413, 'PAYLOAD_TOO_LARGE', 'html is too large');
    }
    try {
      const constrained = constrainOpenAiCompatibleDesignHtml(html);
      const artifact = await persistDesignBuddyHtmlArtifact(db, PROJECTS_DIR, {
        projectId: req.params.id,
        html: constrained,
        prompt: boundedRequestText(req.body?.prompt, 12_000),
        kind: boundedRequestText(req.body?.kind, 64),
        title: boundedRequestText(req.body?.title, 200),
        model: boundedRequestText(req.body?.model, 160),
        provider: boundedRequestText(req.body?.provider, 80) ?? 'browser-fallback',
        jobId: boundedRequestText(req.body?.jobId, 128),
        version: Number(req.body?.version) || 1,
        fileName: boundedRequestText(req.body?.fileName, 160),
        transport: 'browser',
      });
      res.status(201).json({ artifact });
    } catch (error: any) {
      if (error?.code === 'PROJECT_NOT_FOUND') {
        return sendApiError(res, 404, 'PROJECT_NOT_FOUND', 'project not found');
      }
      if (error instanceof OpenAiCompatibleDesignError) {
        return res.status(error.status === 413 ? 413 : 422).json({
          error: { code: error.code, message: error.message },
        });
      }
      console.warn('[designbuddy] browser-generated artifact persistence failed:', error);
      return sendApiError(
        res,
        422,
        'LIVE_ARTIFACT_STORAGE_FAILED',
        'The generated design could not be saved as a project artifact. Review placeholder content and retry.',
      );
    }
  });

  // Keep the synchronous endpoint for API compatibility. Studio uses the job
  // endpoint above so a CDN timeout can never replace a model result with HTML.
  app.post('/api/db/agnes/generate', async (req, res) => {
    const prompt = req.body?.prompt;
    const previousHtml = req.body?.previousHtml;
    if (typeof prompt !== 'string' || !prompt.trim()) {
      return sendApiError(res, 400, 'BAD_REQUEST', 'prompt is required');
    }
    if (previousHtml !== undefined && typeof previousHtml !== 'string') {
      return sendApiError(res, 400, 'BAD_REQUEST', 'previousHtml must be a string');
    }
    if (typeof previousHtml === 'string' && previousHtml.length > 120_000) {
      return sendApiError(res, 413, 'PAYLOAD_TOO_LARGE', 'previousHtml is too large');
    }

    const controller = new AbortController();
    const proxyDispatcher = proxyDispatcherRequestInit(process.env);
    const abort = () => controller.abort();
    req.once('aborted', abort);
    try {
      const startedAt = Date.now();
      const result = await generateAgnesDesign({
        prompt,
        locale: req.body?.locale === 'en' ? 'en' : 'zh',
        mode: typeof req.body?.mode === 'string' ? req.body.mode : undefined,
        projectName: typeof req.body?.projectName === 'string' ? req.body.projectName : undefined,
        previousHtml,
        signal: controller.signal,
        requestInit: proxyDispatcher.requestInit,
      });
      res.json({
        html: result.html,
        model: AGNES_TEXT_MODEL,
        usage: result.usage,
        latencyMs: Date.now() - startedAt,
      });
    } catch (error) {
      if (res.headersSent) return;
      const normalized = error instanceof AgnesIntegrationError
        ? error
        : new AgnesIntegrationError('AGNES_UNAVAILABLE', 'Agnes is currently unavailable.');
      res.status(normalized.status).json({
        error: { code: normalized.code, message: normalized.message },
      });
    } finally {
      await proxyDispatcher.close();
      req.off('aborted', abort);
    }
  });

  app.get('/api/db/profile', (_req, res) => {
    res.json(readDesignBuddyProfile(db));
  });

  app.put('/api/db/profile', (req, res) => {
    const displayName = typeof req.body?.displayName === 'string'
      ? req.body.displayName.trim().replace(/\s+/g, ' ')
      : '';
    if (!displayName || displayName.length > 60) {
      return sendApiError(res, 400, 'BAD_REQUEST', 'displayName required (max 60 chars)');
    }
    res.json(setDesignBuddyProfile(db, displayName));
  });

  app.get('/api/db/role', (_req, res) => {
    // hasRole=false means this local workspace has not completed onboarding.
    res.json(readDesignBuddyRole(db));
  });

  app.put('/api/db/role', (req, res) => {
    const role = req.body?.role;
    if (typeof role !== 'string' || !(DESIGNBUDDY_ROLES as readonly string[]).includes(role)) {
      return sendApiError(res, 400, 'BAD_REQUEST', 'role must be one of designer|pm|dev|admin');
    }
    const selectedRole = role as (typeof DESIGNBUDDY_ROLES)[number];
    setDesignBuddyRole(db, selectedRole);
    const starterProjects = initializeDesignBuddyStarterProjects(db, selectedRole);
    res.json({ role, hasRole: true, starterProjects });
  });

  app.get('/api/db/starter-projects/status', (req, res) => {
    const role = typeof req.query.role === 'string' ? req.query.role : '';
    if (!(DESIGNBUDDY_ROLES as readonly string[]).includes(role)) {
      return sendApiError(res, 400, 'BAD_REQUEST', 'role must be one of designer|pm|dev|admin');
    }
    res.json(readDesignBuddyStarterStatus(db, role as (typeof DESIGNBUDDY_ROLES)[number]));
  });

  app.post('/api/db/starter-projects/initialize', (req, res) => {
    const role = req.body?.role;
    if (typeof role !== 'string' || !(DESIGNBUDDY_ROLES as readonly string[]).includes(role)) {
      return sendApiError(res, 400, 'BAD_REQUEST', 'role must be one of designer|pm|dev|admin');
    }
    const result = initializeDesignBuddyStarterProjects(db, role as (typeof DESIGNBUDDY_ROLES)[number]);
    res.status(result.createdProjectIds.length > 0 ? 201 : 200).json(result);
  });

  app.get('/api/db/projects/gen-summaries', (_req, res) => {
    res.json({ summaries: listDesignBuddyGenSummaries(db) });
  });

  app.get('/api/db/reviews', (_req, res) => {
    res.json({ reviews: listDesignBuddyReviews(db) });
  });

  app.post('/api/db/reviews', (req, res) => {
    const title = typeof req.body?.title === 'string' ? req.body.title.trim() : '';
    if (!title || title.length > 200) {
      return sendApiError(res, 400, 'BAD_REQUEST', 'title required (max 200 chars)');
    }
    const author =
      typeof req.body?.author === 'string' && req.body.author.trim() ? req.body.author.trim().slice(0, 60) : '设计师';
    const note = typeof req.body?.note === 'string' ? req.body.note.slice(0, 2000) : null;
    res.status(201).json({ review: createDesignBuddyReview(db, { title, author, note }) });
  });

  app.post('/api/db/reviews/:id/status', (req, res) => {
    const status = req.body?.status;
    if (
      typeof status !== 'string' ||
      !(DESIGNBUDDY_REVIEW_STATUS_TRANSITIONS as readonly string[]).includes(status)
    ) {
      return sendApiError(res, 400, 'BAD_REQUEST', "status must be 'pass' or 'reject'");
    }
    const review = setDesignBuddyReviewStatus(db, req.params.id, status as 'pass' | 'reject');
    if (!review) {
      return sendApiError(res, 404, 'NOT_FOUND', 'review not found');
    }
    res.json({ review });
  });

  app.get('/api/db/stats', (_req, res) => {
    res.json(designBuddyStats(db));
  });

  // ── AI 生成过程事件流（studio 生成视图）──
  //   GET  /api/db/projects/:id/gen  -> { events: [...] }
  //   POST /api/db/projects/:id/gen  <- { type, payload } -> 201 { event }

  app.get('/api/db/projects/:id/gen', async (req, res) => {
    const project = db.prepare(`SELECT 1 AS ok FROM projects WHERE id = ?`).get(req.params.id);
    if (!project) return sendApiError(res, 404, 'NOT_FOUND', 'project not found');
    try {
      await reconcileDesignBuddyProjectArtifacts(db, PROJECTS_DIR, req.params.id);
    } catch (error) {
      // Legacy replay must remain available even if an old artifact no longer
      // passes today's publication guard. New generations still use the strict
      // save boundary before their job can succeed.
      console.warn('[designbuddy] legacy artifact reconciliation failed:', error);
    }
    res.setHeader('Cache-Control', 'no-store');
    res.json({ events: listDesignBuddyGenEvents(db, req.params.id) });
  });

  app.post('/api/db/projects/:id/gen', async (req, res) => {
    const type = req.body?.type;
    if (
      typeof type !== 'string' ||
      !(DESIGNBUDDY_GEN_EVENT_TYPES as readonly string[]).includes(type)
    ) {
      return sendApiError(
        res,
        400,
        'BAD_REQUEST',
        `type must be one of ${DESIGNBUDDY_GEN_EVENT_TYPES.join('|')}`,
      );
    }
    let payload = req.body?.payload ?? null;
    if (payload !== null && (typeof payload !== 'object' || Array.isArray(payload))) {
      return sendApiError(res, 400, 'BAD_REQUEST', 'payload must be an object or null');
    }
    // Reject oversized legacy/browser payloads before publication guards,
    // linting, or project-file writes perform work on attacker-controlled data.
    if (Buffer.byteLength(JSON.stringify(payload), 'utf8') > DESIGNBUDDY_GEN_PAYLOAD_LIMIT) {
      return sendApiError(res, 413, 'PAYLOAD_TOO_LARGE', 'payload too large');
    }
    // 只允许绑定到真实存在的项目行，避免生成日志脱离项目。
    const project = db
      .prepare(`SELECT name FROM projects WHERE id = ?`)
      .get(req.params.id) as { name: string } | undefined;
    if (!project) {
      return sendApiError(res, 404, 'NOT_FOUND', 'project not found');
    }

    const payloadObject = payload as Record<string, any> | null;
    const jobId = typeof payloadObject?.jobId === 'string' ? payloadObject.jobId : null;
    if (jobId && (type === 'artifact' || type === 'done')) {
      const existing = listDesignBuddyGenEvents(db, req.params.id).find((event) =>
        event.type === type && event.payload?.jobId === jobId,
      );
      if (existing) return res.status(200).json({ event: existing, deduplicated: true });
    }

    if (
      type === 'artifact'
      && payloadObject
      && typeof payloadObject.html === 'string'
      && (!payloadObject.fileName || !payloadObject.fileVersion || !payloadObject.quality)
    ) {
      const priorEvents = listDesignBuddyGenEvents(db, req.params.id);
      let prompt: string | null = null;
      for (let index = priorEvents.length - 1; index >= 0; index -= 1) {
        const prior = priorEvents[index];
        if (prior?.type === 'user' && typeof prior.payload?.text === 'string') {
          prompt = prior.payload.text;
          break;
        }
      }
      try {
        const persisted = await persistDesignBuddyHtmlArtifact(db, PROJECTS_DIR, {
          projectId: req.params.id,
          html: payloadObject.html,
          prompt,
          kind: boundedRequestText(payloadObject.kind, 64),
          title: boundedRequestText(payloadObject.name, 200) ?? project.name,
          model: boundedRequestText(payloadObject.model, 160),
          provider: boundedRequestText(payloadObject.provider, 80) ?? 'studio-event',
          jobId,
          version: Number(payloadObject.version) || 1,
          fileName: boundedRequestText(payloadObject.fileName, 160),
          transport: boundedRequestText(payloadObject.transport, 40),
        });
        payload = { ...payloadObject, ...persisted };
      } catch (error) {
        console.warn('[designbuddy] artifact event persistence failed:', error);
        return sendApiError(
          res,
          422,
          'LIVE_ARTIFACT_STORAGE_FAILED',
          'The generated design could not be saved as a versioned project file.',
        );
      }
    }

    if (Buffer.byteLength(JSON.stringify(payload), 'utf8') > DESIGNBUDDY_GEN_PAYLOAD_LIMIT) {
      return sendApiError(res, 413, 'PAYLOAD_TOO_LARGE', 'payload too large');
    }
    const event = appendDesignBuddyGenEvent(
      db,
      req.params.id,
      type as (typeof DESIGNBUDDY_GEN_EVENT_TYPES)[number],
      payload as Record<string, any> | null,
    );
    res.status(201).json({ event });
  });
}
