#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';

const root = resolve(import.meta.dirname, '..');
const daemonPort = Number(process.env.OD_PORT || 7456);
const webPort = Number(process.env.PORT || 3000);
const sandboxId = String(process.env.E2B_SANDBOX_ID || '').trim();
const previewOrigin = String(
  process.env.ARENA_PREVIEW_ORIGIN
    || (sandboxId ? `https://${webPort}-${sandboxId}.e2b.app` : `http://127.0.0.1:${webPort}`),
).replace(/\/$/, '');
const previewHost = new URL(previewOrigin).host;
const apiToken = process.env.OD_API_TOKEN || randomBytes(32).toString('hex');
const skipBuild = process.argv.includes('--skip-build');
const printConfig = process.argv.includes('--print-config');
const allowedOrigins = Array.from(new Set([
  previewOrigin,
  `http://127.0.0.1:${webPort}`,
  `http://localhost:${webPort}`,
  ...(process.env.OD_ALLOWED_ORIGINS || '').split(',').map((value) => value.trim()).filter(Boolean),
]));
const allowedDevOrigins = Array.from(new Set([
  previewHost,
  ...(process.env.OD_ALLOWED_DEV_ORIGINS || '').split(',').map((value) => value.trim()).filter(Boolean),
]));

const sharedEnv = {
  ...process.env,
  OD_PORT: String(daemonPort),
  OD_BIND_HOST: '0.0.0.0',
  OD_HOST: '0.0.0.0',
  OD_API_TOKEN: apiToken,
  OD_ALLOWED_ORIGINS: allowedOrigins.join(','),
  OD_ALLOWED_DEV_ORIGINS: allowedDevOrigins.join(','),
};

if (printConfig) {
  process.stdout.write(`${JSON.stringify({
    daemonPort,
    webPort,
    previewOrigin,
    previewHost,
    bind: { daemon: sharedEnv.OD_BIND_HOST, web: sharedEnv.OD_HOST },
    allowedOrigins,
    allowedDevOrigins,
    agnesConfigured: Boolean(process.env.OD_AGNES_API_KEY),
  }, null, 2)}\n`);
  process.exit(0);
}

if (!existsSync(resolve(root, 'node_modules'))) {
  process.stderr.write('Dependencies are missing. Run `corepack pnpm install --frozen-lockfile` first.\n');
  process.exit(1);
}

const children = new Set();
let stopping = false;

function run(command, args, options = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, {
      cwd: root,
      env: sharedEnv,
      stdio: 'inherit',
      ...options,
    });
    child.once('error', reject);
    child.once('exit', (code, signal) => {
      if (code === 0) resolvePromise();
      else reject(new Error(`${command} exited with ${code ?? signal ?? 'unknown'}`));
    });
  });
}

function start(name, command, args) {
  const child = spawn(command, args, { cwd: root, env: sharedEnv, stdio: 'inherit' });
  children.add(child);
  child.once('error', (error) => {
    process.stderr.write(`${name} failed to start: ${error.message}\n`);
    void stopAll(1);
  });
  child.once('exit', (code, signal) => {
    children.delete(child);
    if (!stopping) {
      process.stderr.write(`${name} stopped unexpectedly (${code ?? signal ?? 'unknown'}).\n`);
      void stopAll(code || 1);
    }
  });
  return child;
}

async function stopAll(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  if (children.size === 0) process.exit(exitCode);
  for (const child of children) {
    if (child.exitCode == null && child.signalCode == null) child.kill('SIGTERM');
  }
  setTimeout(() => {
    for (const child of children) {
      if (child.exitCode == null && child.signalCode == null) child.kill('SIGKILL');
    }
  }, 3_000);
  setTimeout(() => process.exit(exitCode), 3_100);
}

process.on('SIGINT', () => void stopAll(0));
process.on('SIGTERM', () => void stopAll(0));

async function waitFor(url, { timeoutMs = 120_000, headers = {}, accept } = {}) {
  const deadline = Date.now() + timeoutMs;
  let lastError = null;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url, { headers, redirect: 'manual' });
      if (accept ? accept(response) : response.ok) return response;
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 500));
  }
  throw new Error(`Timed out waiting for ${url}: ${lastError instanceof Error ? lastError.message : lastError}`);
}

async function initializeStarters() {
  const endpoint = `http://127.0.0.1:${daemonPort}/api/db/starter-projects/initialize`;
  for (const role of ['designer', 'pm', 'dev', 'admin']) {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
        Origin: previewOrigin,
      },
      body: JSON.stringify({ role }),
    });
    if (!response.ok) throw new Error(`Starter initialization for ${role} failed with HTTP ${response.status}`);
    const payload = await response.json();
    if (!payload?.initialized) throw new Error(`Starter initialization for ${role} did not complete`);
  }
}

try {
  if (!skipBuild) {
    process.stdout.write('Building daemon prerequisites…\n');
    await run('corepack', [
      'pnpm',
      '--filter',
      '@open-design/daemon^...',
      '--workspace-concurrency=4',
      '--if-present',
      'run',
      'build',
    ]);
    await run('corepack', ['pnpm', '--filter', '@open-design/daemon', 'run', 'build']);
  }

  const daemonEntry = resolve(root, 'apps/daemon/dist/cli.js');
  if (!existsSync(daemonEntry)) throw new Error('Daemon build output is missing. Run without --skip-build.');

  process.stdout.write(`Starting daemon on 0.0.0.0:${daemonPort}…\n`);
  start('Daemon', process.execPath, [daemonEntry, '--no-open', '--host', '0.0.0.0', '--port', String(daemonPort)]);
  await waitFor(`http://127.0.0.1:${daemonPort}/api/health`, {
    headers: { Authorization: `Bearer ${apiToken}` },
  });
  await initializeStarters();

  process.stdout.write(`Starting web preview on 0.0.0.0:${webPort}…\n`);
  start('Web preview', 'corepack', [
    'pnpm',
    '--filter',
    '@open-design/web',
    'exec',
    'next',
    'dev',
    '--hostname',
    '0.0.0.0',
    '--port',
    String(webPort),
  ]);
  await waitFor(`http://127.0.0.1:${webPort}/studio.html`, {
    timeoutMs: 180_000,
    headers: { Host: previewHost, Origin: previewOrigin },
    accept: (response) => response.status === 200,
  });

  process.stdout.write(`\nDesignBuddy preview is ready: ${previewOrigin}/login.html\n`);
  process.stdout.write('Health gate passed: daemon, web, and all four role starter libraries are ready.\n');
  if (!process.env.OD_AGNES_API_KEY) {
    process.stdout.write('Agnes generation is disabled until OD_AGNES_API_KEY is set in the daemon environment.\n');
  }
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.stack || error.message : String(error)}\n`);
  await stopAll(1);
}
