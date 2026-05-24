import { readState, writeState, type PersistedState } from '@/lib/server/state-file';
import type { Finding, Project, Severity } from '@/lib/types';

// Tool implementations. Each handler receives the parsed `arguments` object and
// returns a human/LLM readable string. Throwing marks the tool call as failed.

type Args = Record<string, unknown>;

const SEVERITIES: Severity[] = ['Critical', 'High', 'Medium', 'Low', 'Informational'];

function str(args: Args, key: string): string | undefined {
  const v = args[key];
  return typeof v === 'string' ? v : undefined;
}

function requireStr(args: Args, key: string): string {
  const v = str(args, key);
  if (!v) throw new Error(`Missing required string argument: ${key}`);
  return v;
}

function num(args: Args, key: string): number | undefined {
  const v = args[key];
  return typeof v === 'number' && Number.isFinite(v) ? v : undefined;
}

function parseSeverity(args: Args, key: string): Severity | undefined {
  const v = str(args, key);
  if (v === undefined) return undefined;
  if (!(SEVERITIES as string[]).includes(v)) {
    throw new Error(`Invalid severity "${v}". Allowed: ${SEVERITIES.join(', ')}.`);
  }
  return v as Severity;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

// Bump the project's updatedAt so the web app reflects finding changes, mirroring
// the data-context touchProject behavior.
function touchProject(state: PersistedState, projectId: string): void {
  const projects = state.projects ?? [];
  const idx = projects.findIndex((p) => p.id === projectId);
  if (idx !== -1) {
    projects[idx] = { ...projects[idx], updatedAt: new Date().toISOString() };
    state.projects = projects;
  }
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

  async get_finding(args) {
    const findingId = requireStr(args, 'findingId');
    const state = await readState();
    const finding = (state.findings ?? []).find((f) => f.id === findingId);
    if (!finding) throw new Error(`Finding not found: ${findingId}`);
    return JSON.stringify(finding, null, 2);
  },

  async create_finding(args) {
    const projectId = requireStr(args, 'projectId');
    const title = requireStr(args, 'title');
    const severity = parseSeverity(args, 'severity') ?? 'Informational';
    const state = await readState();
    const projects = state.projects ?? [];
    if (!projects.some((p) => p.id === projectId)) {
      throw new Error(`Project not found: ${projectId}`);
    }
    const now = new Date().toISOString();
    const finding: Finding = {
      id: `find-${Date.now()}`,
      projectId,
      title,
      severity,
      cvss: num(args, 'cvss') ?? 0,
      markdown: str(args, 'markdown') ?? '',
      vulnerabilityId: str(args, 'vulnerabilityId'),
      createdAt: now,
      updatedAt: now,
    };
    state.findings = [...(state.findings ?? []), finding];
    touchProject(state, projectId);
    await writeState(state);
    return `Created finding "${title}" (${severity}) with id ${finding.id} on ${projectId}.`;
  },

  async update_finding(args) {
    const findingId = requireStr(args, 'findingId');
    const state = await readState();
    const findings = state.findings ?? [];
    const idx = findings.findIndex((f) => f.id === findingId);
    if (idx === -1) throw new Error(`Finding not found: ${findingId}`);

    const severity = parseSeverity(args, 'severity');
    const title = str(args, 'title');
    const cvss = num(args, 'cvss');
    const markdown = str(args, 'markdown');
    const vulnerabilityId = str(args, 'vulnerabilityId');

    const updated: Finding = {
      ...findings[idx],
      ...(title !== undefined ? { title } : {}),
      ...(severity !== undefined ? { severity } : {}),
      ...(cvss !== undefined ? { cvss } : {}),
      ...(markdown !== undefined ? { markdown } : {}),
      ...(vulnerabilityId !== undefined ? { vulnerabilityId } : {}),
      updatedAt: new Date().toISOString(),
    };
    findings[idx] = updated;
    state.findings = findings;
    touchProject(state, updated.projectId);
    await writeState(state);
    return `Updated finding ${findingId}.`;
  },

  async delete_finding(args) {
    const findingId = requireStr(args, 'findingId');
    const state = await readState();
    const findings = state.findings ?? [];
    const finding = findings.find((f) => f.id === findingId);
    if (!finding) throw new Error(`Finding not found: ${findingId}`);
    state.findings = findings.filter((f) => f.id !== findingId);
    touchProject(state, finding.projectId);
    await writeState(state);
    return `Deleted finding ${findingId}.`;
  },

  async list_vulnerabilities() {
    const state = await readState();
    const vulns = state.vulnerabilities ?? [];
    if (vulns.length === 0) return 'No vulnerabilities found.';
    const rows = vulns.map((v) => ({
      id: v.id,
      title_en: v.title_en,
      title_es: v.title_es,
      severity: v.severity,
      cvss: v.cvss?.score,
      cwe: v.cwe,
      tags: v.tags,
    }));
    return JSON.stringify(rows, null, 2);
  },

  async get_vulnerability(args) {
    const vulnerabilityId = requireStr(args, 'vulnerabilityId');
    const state = await readState();
    const vuln = (state.vulnerabilities ?? []).find((v) => v.id === vulnerabilityId);
    if (!vuln) throw new Error(`Vulnerability not found: ${vulnerabilityId}`);
    return JSON.stringify(vuln, null, 2);
  },
};
