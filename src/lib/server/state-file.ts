import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import type { Client, Finding, Project, ProjectTemplate, Vulnerability } from '@/lib/types';

// Server-side access to the same JSON file used by /api/state. The MCP server
// reads and writes here so that changes made by an AI client land in the same
// store the web app hydrates from on load.

const DATA_DIR = path.join(process.cwd(), 'data');
const STATE_FILE = path.join(DATA_DIR, 'vulnforce-state.json');

export type PersistedState = {
  clients?: Client[];
  projects?: Project[];
  findings?: Finding[];
  vulnerabilities?: Vulnerability[];
  images?: unknown[];
  projectTemplates?: ProjectTemplate[];
  themes?: unknown[];
  activeThemeId?: string;
};

async function ensureDir() {
  try {
    await mkdir(DATA_DIR, { recursive: true });
  } catch {
    // ignore
  }
}

export async function readState(): Promise<PersistedState> {
  await ensureDir();
  try {
    const raw = await readFile(STATE_FILE, 'utf8');
    return JSON.parse(raw) as PersistedState;
  } catch (err: unknown) {
    if (err && typeof err === 'object' && (err as { code?: string }).code === 'ENOENT') {
      return {};
    }
    if (err instanceof SyntaxError) {
      return {};
    }
    throw err;
  }
}

export async function writeState(state: PersistedState): Promise<void> {
  await ensureDir();
  await writeFile(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
}
