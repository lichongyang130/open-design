import { execFile } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import JSZip from 'jszip';
import { kindFor } from './projects.js';

const execFileP = promisify(execFile);
const MAX_COMPRESSED_PREVIEW_BYTES = 10 * 1024 * 1024;
const MAX_UNCOMPRESSED_PREVIEW_BYTES = 50 * 1024 * 1024;
const MAX_XML_ENTRY_BYTES = 5 * 1024 * 1024;
const MAX_PDF_PREVIEW_CONCURRENCY = 2;
const pdfPreviewQueue = createLimiter(MAX_PDF_PREVIEW_CONCURRENCY);

type PreviewKind = 'pdf' | 'document' | 'presentation' | 'spreadsheet';
type PreviewSection = { title: string; lines: string[] };
type PreviewFile = { name: string; buffer: Buffer };
type XmlAttrs = Record<string, string>;
type WorkbookSheet = { name: string; path: string };
type ZipEntryWithSize = JSZip.JSZipObject & {
  _data?: { uncompressedSize?: number };
};

class PreviewHttpError extends Error {
  constructor(message: string, readonly statusCode: number) {
    super(message);
    this.name = 'PreviewHttpError';
  }
}

export async function buildDocumentPreview(file: PreviewFile) {
  const kind = kindFor(file.name);
  if (!['pdf', 'document', 'presentation', 'spreadsheet'].includes(kind)) {
    throw new PreviewHttpError('unsupported preview type', 415);
  }
  const previewKind = kind as PreviewKind;

  if (previewKind === 'pdf') {
    return {
      kind: previewKind,
      title: path.basename(file.name),
      sections: await pdfPreviewQueue(() => previewPdf(file.buffer)),
    };
  }

  assertPreviewInputSize(file.buffer.length);
  const zip = await JSZip.loadAsync(file.buffer);
  assertZipPreviewSize(zip);
  if (previewKind === 'document') {
    return {
      kind: previewKind,
      title: path.basename(file.name),
      sections: await previewDocx(zip),
    };
  }
  if (previewKind === 'presentation') {
    return {
      kind: previewKind,
      title: path.basename(file.name),
      sections: await previewPptx(zip),
    };
  }
  return {
    kind: previewKind,
    title: path.basename(file.name),
    sections: await previewXlsx(zip),
  };
}

async function previewPdf(buffer: Buffer): Promise<PreviewSection[]> {
  assertPreviewInputSize(buffer.length);
  const tmpDir = await mkdtemp(path.join(tmpdir(), 'od-preview-'));
  const tmpFile = path.join(tmpDir, 'input.pdf');
  await writeFile(tmpFile, buffer, { flag: 'wx' });
  try {
    const { stdout } = await execFileP('pdftotext', ['-layout', tmpFile, '-'], {
      timeout: 5000,
      maxBuffer: 2 * 1024 * 1024,
    });
    const lines = stdout
      .split(/\r?\n/)
      .map((line) => line.trimEnd())
      .filter((line) => line.trim().length > 0);
    return [
      {
        title: 'PDF',
        lines: lines.length > 0 ? lines : ['No readable text found.'],
      },
    ];
  } catch {
    return [
      {
        title: 'PDF',
        lines: ['Text preview is unavailable. Use Open or Download to inspect the PDF.'],
      },
    ];
  } finally {
    rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  }
}

async function previewDocx(zip: JSZip): Promise<PreviewSection[]> {
  const xml = await readZipText(zip, 'word/document.xml');
  const paragraphs = extractParagraphs(xml, /<w:p\b[\s\S]*?<\/w:p>/g);
  return [
    {
      title: 'Document',
      lines: paragraphs.length > 0 ? paragraphs : ['No readable text found.'],
    },
  ];
}

async function previewPptx(zip: JSZip): Promise<PreviewSection[]> {
  const slideNames = Object.keys(zip.files)
    .filter((name) => /^ppt\/slides\/slide\d+\.xml$/i.test(name))
    .sort(numericPathSort);
  const sections: PreviewSection[] = [];
  for (let i = 0; i < slideNames.length; i += 1) {
    const xml = await readZipText(zip, slideNames[i] ?? '');
    const lines = extractTextRuns(xml);
    sections.push({
      title: `Slide ${i + 1}`,
      lines: lines.length > 0 ? lines : ['No readable text found.'],
    });
  }
  return sections.length > 0
    ? sections
    : [{ title: 'Presentation', lines: ['No readable slides found.'] }];
}

async function previewXlsx(zip: JSZip): Promise<PreviewSection[]> {
  const sharedStrings = await readSharedStrings(zip);
  const dateFormats = await readCellDateFormats(zip);
  const workbook = await readWorkbook(zip);
  const sections: PreviewSection[] = [];
  for (const sheet of workbook) {
    const xml = await readZipText(zip, sheet.path).catch(() => '');
    const lines = extractWorksheetRows(xml, sharedStrings, dateFormats);
    sections.push({
      title: sheet.name,
      lines: lines.length > 0 ? lines : ['No readable cell values found.'],
    });
  }
  return sections.length > 0
    ? sections
    : [{ title: 'Spreadsheet', lines: ['No readable sheets found.'] }];
}

async function readCellDateFormats(zip: JSZip): Promise<Map<number, string>> {
  const xml = await readZipText(zip, 'xl/styles.xml').catch(() => '');
  const formats = new Map<number, string>();
  if (!xml) return formats;
  const customFormats = new Map<number, string>();
  for (const match of xml.matchAll(/<numFmt\b([^>]*)\/?\s*>/g)) {
    const attrs = parseAttrs(match[1] ?? '');
    const id = Number(attrs.numFmtId);
    const code = attrs.formatCode ?? '';
    const normalized = code.replace(/"[^"]*"/g, '').replace(/\\./g, '');
    if (Number.isInteger(id) && /[ydhs]/i.test(normalized)) customFormats.set(id, code);
  }
  const builtInDateFormats = new Set([14, 15, 16, 17, 18, 19, 20, 21, 22, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 45, 46, 47, 50, 51, 52, 53, 54, 55, 56, 57, 58]);
  const xfs = extractFirst(xml, /<cellXfs\b[^>]*>([\s\S]*?)<\/cellXfs>/);
  let styleIndex = 0;
  for (const match of xfs.matchAll(/<xf\b([^>]*)\/?\s*>/g)) {
    const attrs = parseAttrs(match[1] ?? '');
    const numFmtId = Number(attrs.numFmtId ?? 0);
    const custom = customFormats.get(numFmtId);
    if (custom) formats.set(styleIndex, custom);
    else if (builtInDateFormats.has(numFmtId)) formats.set(styleIndex, 'built-in date/time format (numFmtId=' + numFmtId + ')');
    styleIndex += 1;
  }
  return formats;
}

async function readSharedStrings(zip: JSZip): Promise<string[]> {
  const xml = await readZipText(zip, 'xl/sharedStrings.xml').catch(() => '');
  if (!xml) return [];
  return Array.from(xml.matchAll(/<si\b[\s\S]*?<\/si>/g)).map((m) =>
    extractTextRuns(m[0]).join(''),
  );
}

async function readWorkbook(zip: JSZip): Promise<WorkbookSheet[]> {
  const workbookXml = await readZipText(zip, 'xl/workbook.xml').catch(() => '');
  const relsXml = await readZipText(zip, 'xl/_rels/workbook.xml.rels').catch(() => '');
  const rels = new Map<string, string>();
  for (const rel of relsXml.matchAll(/<Relationship\b([^>]*)\/?>/g)) {
    const attrs = parseAttrs(rel[1] ?? '');
    if (attrs.Id && attrs.Target) rels.set(attrs.Id, attrs.Target);
  }
  const sheets: WorkbookSheet[] = [];
  for (const sheet of workbookXml.matchAll(/<sheet\b([^>]*)\/?>/g)) {
    const attrs = parseAttrs(sheet[1] ?? '');
    const relId = attrs['r:id'];
    const target = relId ? rels.get(relId) : null;
    if (!target) continue;
    sheets.push({
      name: attrs.name || `Sheet ${sheets.length + 1}`,
      path: `xl/${target.replace(/^\/?xl\//, '')}`,
    });
  }
  if (sheets.length > 0) return sheets;
  return Object.keys(zip.files)
    .filter((name) => /^xl\/worksheets\/sheet\d+\.xml$/i.test(name))
    .sort(numericPathSort)
    .map((name, i) => ({ name: `Sheet ${i + 1}`, path: name }));
}

function extractWorksheetRows(
  xml: string,
  sharedStrings: string[],
  dateFormats: Map<number, string>,
): string[] {
  const rows: string[] = [];
  for (const row of xml.matchAll(/<row\b([^>]*)>([\s\S]*?)<\/row>/g)) {
    const rowAttrs = parseAttrs(row[1] ?? '');
    const rowNumber = rowAttrs.r || String(rows.length + 1);
    const rowBody = row[2] ?? '';
    const cells: string[] = [];
    for (const cell of rowBody.matchAll(/<c\b([^>]*)>([\s\S]*?)<\/c>|<c\b([^>]*)\/>/g)) {
      const attrs = parseAttrs(cell[1] ?? cell[3] ?? '');
      const body = cell[2] ?? '';
      const ref = attrs.r || ('row ' + rowNumber + ' cell ' + (cells.length + 1));
      const formulaMatch = body.match(/<f\b([^>]*)>([\s\S]*?)<\/f>|<f\b([^>]*)\/>/);
      const formulaAttrs = parseAttrs(formulaMatch?.[1] ?? formulaMatch?.[3] ?? '');
      const formulaText = decodeXml(formulaMatch?.[2] ?? '').trim();
      const formula = formulaMatch
        ? (formulaText || ('shared formula' + (formulaAttrs.si ? ' si=' + formulaAttrs.si : '') + (formulaAttrs.ref ? ' ref=' + formulaAttrs.ref : '')))
        : '';
      const rawValue = extractFirst(body, /<v>([\s\S]*?)<\/v>/);
      let value = '';
      let textValue = false;
      if (attrs.t === 's') {
        const index = Number(rawValue);
        value = Number.isInteger(index) ? sharedStrings[index] ?? '' : '';
        textValue = true;
      } else if (attrs.t === 'inlineStr') {
        value = extractTextRuns(body).join('');
        textValue = true;
      } else {
        value = decodeXml(rawValue);
        textValue = attrs.t === 'str';
      }
      const displayValue = value.length === 0 ? '(blank)' : textValue ? JSON.stringify(value) : value;
      const styleIndex = Number(attrs.s);
      const dateFormat = attrs.s !== undefined && Number.isInteger(styleIndex)
        ? dateFormats.get(styleIndex)
        : undefined;
      const styleHint = dateFormat ? ' format=' + JSON.stringify(dateFormat) : '';
      if (formula && attrs.t === 'e') {
        cells.push(ref + ' formula=' + formula + ' error=' + displayValue + styleHint);
      } else if (formula) {
        cells.push(ref + ' formula=' + formula + (rawValue.length > 0 ? ' cached=' + displayValue : ' cached=(none)') + styleHint);
      } else if (attrs.t === 'e') {
        cells.push(ref + ' error=' + displayValue + styleHint);
      } else {
        cells.push(ref + '=' + displayValue + styleHint);
      }
    }
    if (cells.length > 0) rows.push('Row ' + rowNumber + ': ' + cells.join(' | '));
  }
  return rows;
}
function extractParagraphs(xml: string, paragraphPattern: RegExp): string[] {
  return Array.from(xml.matchAll(paragraphPattern))
    .map((m) => extractTextRuns(m[0]).join(' ').replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

function extractTextRuns(xml: string): string[] {
  return Array.from(xml.matchAll(/<a:t[^>]*>([\s\S]*?)<\/a:t>|<w:t[^>]*>([\s\S]*?)<\/w:t>|<t[^>]*>([\s\S]*?)<\/t>/g))
    .map((m) => decodeXml(m[1] ?? m[2] ?? m[3] ?? '').trim())
    .filter(Boolean);
}

async function readZipText(zip: JSZip, name: string): Promise<string> {
  const entry = zip.file(name);
  if (!entry) throw new Error(`missing ${name}`);
  const size = (entry as ZipEntryWithSize)._data?.uncompressedSize ?? 0;
  if (size > MAX_XML_ENTRY_BYTES) {
    throw new PreviewHttpError('document section too large to preview', 413);
  }
  const xml = await entry.async('text');
  assertSafeXml(xml);
  return xml;
}

function parseAttrs(raw: string): XmlAttrs {
  const attrs: XmlAttrs = {};
  for (const m of raw.matchAll(/([\w:-]+)="([^"]*)"/g)) {
    const name = m[1];
    if (!name) throw new Error('XML attribute match invariant violated');
    attrs[name] = decodeXml(m[2] ?? '');
  }
  return attrs;
}

function extractFirst(raw: string, pattern: RegExp): string {
  const m = raw.match(pattern);
  return m ? m[1] ?? '' : '';
}

function decodeXml(raw: unknown): string {
  return String(raw)
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');
}

function assertPreviewInputSize(size: number): void {
  if (size > MAX_COMPRESSED_PREVIEW_BYTES) {
    throw new PreviewHttpError('document too large to preview', 413);
  }
}

function assertZipPreviewSize(zip: JSZip): void {
  let total = 0;
  for (const entry of Object.values(zip.files)) {
    total += (entry as ZipEntryWithSize)._data?.uncompressedSize ?? 0;
    if (total > MAX_UNCOMPRESSED_PREVIEW_BYTES) {
      throw new PreviewHttpError('document too large to preview', 413);
    }
  }
}

function assertSafeXml(xml: string): void {
  if (/<!DOCTYPE\b|<!ENTITY\b/i.test(xml)) {
    throw new PreviewHttpError('unsupported XML entities', 415);
  }
}

function createLimiter<T>(limit: number): (task: () => Promise<T>) => Promise<T> {
  let active = 0;
  const pending: Array<{
    task: () => Promise<T>;
    resolve: (value: T) => void;
    reject: (reason?: unknown) => void;
  }> = [];
  const runNext = () => {
    if (active >= limit || pending.length === 0) return;
    active += 1;
    const next = pending.shift();
    if (!next) throw new Error('preview limiter queue invariant violated');
    const { task, resolve, reject } = next;
    Promise.resolve()
      .then(task)
      .then(resolve, reject)
      .finally(() => {
        active -= 1;
        runNext();
      });
  };
  return (task) =>
    new Promise((resolve, reject) => {
      pending.push({ task, resolve, reject });
      runNext();
    });
}

function numericPathSort(a: string, b: string): number {
  const an = Number(a.match(/(\d+)(?=\.xml$)/)?.[1] ?? 0);
  const bn = Number(b.match(/(\d+)(?=\.xml$)/)?.[1] ?? 0);
  return an - bn || a.localeCompare(b);
}
