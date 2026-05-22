import { readState, writeState } from '@/lib/server/state-file';
import type { Project } from '@/lib/types';

// Tool implementations. Each handler receives the parsed `arguments` object and
// returns a human/LLM readable string. Throwing marks the tool call as failed.

type Args = Record<string, unknown>;

function str(args: Args, key: string): string | undefined {
  const v = args[key];
  return typeof v === 'string' ? v : undefined;
}

function requireStr(args: Args, key: string): string {
  const v = str(args, key);
  if (!v) throw new Error(`Missing required string argument: ${key}`);
  return v;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export type ToolHandler = (args: Args) => Promise<string>;

export const toolHandlers: Record<string, ToolHandler> = {
  async list_projects() {
    const state = await readState();
    const clients = state.clients ?? [];
    const projects = state.projects ?? [];
    if (projects.length === 0) return 'No projects found.';
    const rows = projects.map((p) => {
      const client = clients.find((c) => c.id === p.clientId);
      return {
        id: p.id,
        name: p.name,
        client: client?.name ?? null,
        status: p.status,
        language: p.language,
        reportChars: (p.reportBody ?? '').length,
        updatedAt: p.updatedAt,
      };
    });
    return JSON.stringify(rows, null, 2);
  },

  async get_report(args) {
    const projectId = requireStr(args, 'projectId');
    const state = await readState();
    const project = (state.projects ?? []).find((p) => p.id === projectId);
    if (!project) throw new Error(`Project not found: ${projectId}`);
    return project.reportBody ?? '';
  },

  async create_report(args) {
    const name = requireStr(args, 'name');
    const state = await readState();
    const projects = state.projects ?? [];
    const clients = state.clients ?? [];

    const clientId = str(args, 'clientId') ?? clients[0]?.id ?? '';
    const language = str(args, 'language') === 'en' ? 'en' : 'es';
    const statusArg = str(args, 'status');
    const status: Project['status'] =
      statusArg === 'Completed' || statusArg === 'On Hold' ? statusArg : 'In Progress';
    const now = new Date().toISOString();

    const project: Project = {
      id: `proj-${Date.now()}`,
      clientId,
      name,
      icon: 'FileText',
      reportBody: str(args, 'reportBody') ?? `# ${name}\n\n`,
      startDate: today(),
      endDate: today(),
      status,
      language,
      createdAt: now,
      updatedAt: now,
    };

    state.projects = [...projects, project];
    await writeState(state);
    return `Created project "${name}" with id ${project.id}.`;
  },

  async update_report(args) {
    const projectId = requireStr(args, 'projectId');
    const reportBody = requireStr(args, 'reportBody');
    const state = await readState();
    const projects = state.projects ?? [];
    const idx = projects.findIndex((p) => p.id === projectId);
    if (idx === -1) throw new Error(`Project not found: ${projectId}`);
    projects[idx] = { ...projects[idx], reportBody, updatedAt: new Date().toISOString() };
    state.projects = projects;
    await writeState(state);
    return `Updated report of ${projectId} (${reportBody.length} chars).`;
  },

  async append_to_report(args) {
    const projectId = requireStr(args, 'projectId');
    const markdown = requireStr(args, 'markdown');
    const state = await readState();
    const projects = state.projects ?? [];
    const idx = projects.findIndex((p) => p.id === projectId);
    if (idx === -1) throw new Error(`Project not found: ${projectId}`);
    const current = projects[idx].reportBody ?? '';
    const joined = current.trimEnd() + '\n\n' + markdown.trimStart() + '\n';
    projects[idx] = { ...projects[idx], reportBody: joined, updatedAt: new Date().toISOString() };
    state.projects = projects;
    await writeState(state);
    return `Appended ${markdown.length} chars to ${projectId}.`;
  },

  async list_clients() {
    const state = await readState();
    const clients = (state.clients ?? []).map((c) => ({ id: c.id, name: c.name }));
    if (clients.length === 0) return 'No clients found.';
    return JSON.stringify(clients, null, 2);
  },

  async list_findings(args) {
    const projectId = str(args, 'projectId');
    const state = await readState();
    let findings = state.findings ?? [];
    if (projectId) findings = findings.filter((f) => f.projectId === projectId);
    const rows = findings.map((f) => ({
      id: f.id,
      projectId: f.projectId,
      title: f.title,
      severity: f.severity,
      cvss: f.cvss,
    }));
    if (rows.length === 0) return 'No findings found.';
    return JSON.stringify(rows, null, 2);
  },
};
