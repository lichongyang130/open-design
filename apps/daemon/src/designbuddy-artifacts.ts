import type Database from 'better-sqlite3';
import type { ArtifactLintFinding, ProjectFileVersion } from '@open-design/contracts';

import { lintArtifact, renderFindingsForAgent } from './lint-artifact.js';
import { withProjectFileVersionLock } from './project-file-versions.js';
import { readProjectFile, writeProjectFile } from './projects.js';

type SqliteDb = Database.Database;
type DbRow = Record<string, unknown>;

export type DesignBuddyArtifactQualityStatus = 'passed' | 'advisory' | 'needs-attention';

export interface DesignBuddyArtifactQuality {
  status: DesignBuddyArtifactQualityStatus;
  counts: { p0: number; p1: number; p2: number };
  findings: ArtifactLintFinding[];
  agentMessage: string;
  checkedAt: number;
}

export interface PersistDesignBuddyHtmlArtifactInput {
  projectId: string;
  html: string;
  prompt?: string | null | undefined;
  kind?: string | null | undefined;
  title?: string | null | undefined;
  model?: string | null | undefined;
  provider?: string | null | undefined;
  jobId?: string | null | undefined;
  version?: number | null | undefined;
  fileName?: string | null | undefined;
  transport?: string | null | undefined;
}

export interface PersistedDesignBuddyHtmlArtifact {
  html: string;
  name: string;
  version: number;
  kind: string;
  surface: 'text';
  model: string | null;
  provider: string | null;
  jobId: string | null;
  transport: string | null;
  fileName: string;
  projectFile: Record<string, unknown>;
  fileVersion: ProjectFileVersion | null;
  quality: DesignBuddyArtifactQuality;
}

const GENERATED_HTML_FILE_RE = /^generated\/[A-Za-z0-9][A-Za-z0-9._ -]{0,119}\.html?$/u;

function projectMetadata(row: DbRow): Record<string, unknown> {
  try {
    const parsed = JSON.parse(String(row.metadata_json ?? '{}')) as unknown;
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? parsed as Record<string, unknown>
      : {};
  } catch {
    return {};
  }
}

function boundedText(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  return normalized ? normalized.slice(0, max) : null;
}

export function designBuddyGeneratedFileName(kind: unknown, requested: unknown): string {
  const candidate = typeof requested === 'string'
    ? requested.trim().replace(/\\/g, '/')
    : '';
  if (GENERATED_HTML_FILE_RE.test(candidate) && !candidate.includes('..')) return candidate;
  return String(kind || '').toLowerCase() === 'deck'
    ? 'generated/slides.html'
    : 'generated/design.html';
}

function manifestKind(kind: unknown): 'deck' | 'html' {
  return String(kind || '').toLowerCase() === 'deck' ? 'deck' : 'html';
}

export function designBuddyArtifactQuality(html: string, checkedAt = Date.now()): DesignBuddyArtifactQuality {
  const findings = lintArtifact(html);
  const counts = { p0: 0, p1: 0, p2: 0 };
  for (const finding of findings) {
    if (finding.severity === 'P0') counts.p0 += 1;
    else if (finding.severity === 'P1') counts.p1 += 1;
    else counts.p2 += 1;
  }
  return {
    status: counts.p0 + counts.p1 > 0
      ? 'needs-attention'
      : counts.p2 > 0
        ? 'advisory'
        : 'passed',
    counts,
    findings,
    agentMessage: renderFindingsForAgent(findings),
    checkedAt,
  };
}

/**
 * Persist a DesignBuddy text-model result through the production project-file
 * boundary. The HTML, its explicit artifact manifest, and its immutable version
 * snapshot are written under one per-file lock; lint runs against the bytes that
 * were actually committed rather than the model response before normalization.
 */
export async function persistDesignBuddyHtmlArtifact(
  db: SqliteDb,
  projectsRoot: string,
  input: PersistDesignBuddyHtmlArtifactInput,
): Promise<PersistedDesignBuddyHtmlArtifact> {
  if (!input.projectId) throw new Error('projectId is required');
  if (typeof input.html !== 'string' || input.html.length < 40) {
    throw new Error('generated HTML is required');
  }

  const row = db.prepare(
    `SELECT id, name, metadata_json FROM projects WHERE id = ?`,
  ).get(input.projectId) as DbRow | undefined;
  if (!row) {
    const error = new Error('project not found') as Error & { code?: string };
    error.code = 'PROJECT_NOT_FOUND';
    throw error;
  }

  const metadata = projectMetadata(row);
  const fileName = designBuddyGeneratedFileName(input.kind, input.fileName);
  const title = boundedText(input.title, 200) ?? boundedText(row.name, 200) ?? 'DesignBuddy artifact';
  const kind = boundedText(input.kind, 64) ?? 'page';
  const model = boundedText(input.model, 160);
  const provider = boundedText(input.provider, 80);
  const jobId = boundedText(input.jobId, 128);
  const transport = boundedText(input.transport, 40);
  const requestedVersion = Number(input.version);
  const eventVersion = Number.isSafeInteger(requestedVersion) && requestedVersion > 0
    ? requestedVersion
    : 1;
  const artifactKind = manifestKind(kind);
  const now = Date.now();
  const artifactManifest = {
    version: 1,
    kind: artifactKind,
    title,
    entry: fileName,
    renderer: artifactKind === 'deck' ? 'deck-html' : 'html',
    status: 'complete',
    exports: ['html', 'pdf', 'zip'],
    primary: true,
    metadata: {
      source: 'designbuddy-generation',
      ...(jobId ? { generationJobId: jobId } : {}),
      ...(provider ? { provider } : {}),
      ...(model ? { model } : {}),
      ...(transport ? { transport } : {}),
      generationVersion: eventVersion,
    },
  };

  const persisted = await withProjectFileVersionLock(
    projectsRoot,
    input.projectId,
    fileName,
    metadata,
    async (versionLock) => {
      const projectFile = await (writeProjectFile as any)(
        projectsRoot,
        input.projectId,
        fileName,
        Buffer.from(input.html, 'utf8'),
        { overwrite: true, artifactManifest },
        metadata,
      ) as Record<string, unknown>;
      const committed = await readProjectFile(
        projectsRoot,
        input.projectId,
        fileName,
        metadata,
      );
      const html = committed.buffer.toString('utf8');
      const fileVersion = await versionLock.ensureCurrentVersion(html, {
        source: 'ai',
        prompt: boundedText(input.prompt, 12_000),
        promptSource: 'message',
        label: `DesignBuddy v${eventVersion}`,
        origin: {
          entrySurface: 'open_design_ui',
          ...(jobId ? { runId: jobId } : {}),
        },
      });
      return { projectFile, html, fileVersion };
    },
  );

  const nextMetadata = {
    ...metadata,
    designBuddyArtifactFile: fileName,
    designBuddyArtifactUpdatedAt: now,
    ...(
      typeof metadata.entryFile !== 'string'
      || metadata.entryFile.startsWith('generated/')
      || metadata.source === 'user'
      || metadata.source === 'starter-project'
        ? { entryFile: fileName }
        : {}
    ),
  };
  db.prepare(
    `UPDATE projects SET metadata_json = ?, updated_at = ? WHERE id = ?`,
  ).run(JSON.stringify(nextMetadata), now, input.projectId);

  return {
    html: persisted.html,
    name: title,
    version: eventVersion,
    kind,
    surface: 'text',
    model,
    provider,
    jobId,
    transport,
    fileName,
    projectFile: persisted.projectFile,
    fileVersion: persisted.fileVersion,
    quality: designBuddyArtifactQuality(persisted.html, now),
  };
}

/**
 * One-time/lazy bridge for Studio projects created before real project files
 * were introduced. It keeps historical event payloads for replay, but enriches
 * them with the committed file/version/quality references. Re-running is safe:
 * events already carrying these references are skipped and version capture is
 * content-deduplicated by the project-file version store.
 */
export async function reconcileDesignBuddyProjectArtifacts(
  db: SqliteDb,
  projectsRoot: string,
  projectId: string,
): Promise<{ reconciled: number }> {
  const project = db.prepare(`SELECT 1 AS ok FROM projects WHERE id = ?`).get(projectId) as DbRow | undefined;
  if (!project) return { reconciled: 0 };

  const rows = db.prepare(
    `SELECT id, type, payload FROM designbuddy_gen
      WHERE project_id = ? ORDER BY seq ASC, created_at ASC`,
  ).all(projectId) as DbRow[];
  let prompt: string | null = null;
  let reconciled = 0;
  const update = db.prepare(`UPDATE designbuddy_gen SET payload = ? WHERE id = ?`);

  for (const row of rows) {
    let payload: Record<string, unknown>;
    try {
      const parsed = JSON.parse(String(row.payload ?? 'null')) as unknown;
      payload = parsed && typeof parsed === 'object' && !Array.isArray(parsed)
        ? parsed as Record<string, unknown>
        : {};
    } catch {
      continue;
    }
    if (row.type === 'user') {
      prompt = boundedText(payload.text, 12_000);
      continue;
    }
    if (row.type !== 'artifact' || typeof payload.html !== 'string') continue;
    if (
      typeof payload.fileName === 'string'
      && payload.fileVersion
      && payload.quality
    ) continue;

    try {
      const persisted = await persistDesignBuddyHtmlArtifact(db, projectsRoot, {
        projectId,
        html: payload.html,
        prompt,
        kind: boundedText(payload.kind, 64),
        title: boundedText(payload.name, 200),
        model: boundedText(payload.model, 160),
        provider: boundedText(payload.provider, 80) ?? 'legacy-event',
        jobId: boundedText(payload.jobId, 128),
        version: Number(payload.version) || 1,
        fileName: boundedText(payload.fileName, 160),
        transport: boundedText(payload.transport, 40),
      });
      update.run(JSON.stringify({ ...payload, ...persisted }), String(row.id));
      reconciled += 1;
    } catch (error) {
      // Some legacy starter/demo artifacts predate current publication guards.
      // Keep replaying them from their event payload and continue reconciling
      // the rest of the project instead of turning one old file into a blocker.
      console.warn(`[designbuddy] skipped legacy artifact ${String(row.id)}:`, error);
    }
  }

  return { reconciled };
}
