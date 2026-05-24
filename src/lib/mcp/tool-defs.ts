// MCP tool metadata. Pure data (no Node imports) so it can be imported by both
// the server route and client components (the MCP page lists the tools here).

export const MCP_SERVER_INFO = { name: 'vulnforce', version: '1.1.0' } as const;

export const MCP_SUPPORTED_PROTOCOL_VERSIONS = ['2025-06-18', '2025-03-26', '2024-11-05'] as const;
export const MCP_DEFAULT_PROTOCOL_VERSION = '2025-06-18';

export const MCP_INSTRUCTIONS =
  'VulnForce exposes pentest projects as reports plus a structured findings database and a reusable vulnerability library. ' +
  'A report is the markdown body of a project. Use list_projects to find a project id, get_report to read it, and update_report / append_to_report / create_report to write it.\n\n' +
  'REPORT STRUCTURE — IMPORTANT: The editor turns every H1 (#) and H2 (##) heading in the body into a SEPARATE editable block; H3 (###) and deeper stay nested inside their parent block. ' +
  'To keep the report well-structured and avoid fragmenting it into a multitude of tiny editable sections, build the body as a SMALL set of top-level sections. ' +
  'Use H1 (#) only for the few main sections (e.g. Resumen Ejecutivo, Alcance y Metodología, Inventario de Activos, Narrativa del Ataque, Recomendaciones), ' +
  'use H2 (##) only for genuine major subsections, and use H3/H4 (###, ####) for everything deeper so each section stays self-contained and hierarchical. ' +
  'Do not emit a long flat list of H1/H2 headings.\n\n' +
  'FINDINGS: Do not write individual vulnerabilities into the report body. Create one finding per vulnerability with create_finding (title, severity, cvss, markdown). ' +
  'The report automatically renders every finding under a Findings section as an H2, so inside a finding\'s markdown use H3/H4 for its subsections (Descripción, Evidencia, Impacto, Remediación). ' +
  'Embed the live findings summary table in the body with the {{findings.table}} marker. ' +
  'Read findings with list_findings / get_finding and manage them with create_finding / update_finding / delete_finding. ' +
  'The vulnerability library (list_vulnerabilities / get_vulnerability) holds reusable, bilingual templates that a finding can reference via vulnerabilityId.';

export type McpToolDef = {
  name: string;
  title: string;
  description: string;
  inputSchema: Record<string, unknown>;
};

export const MCP_TOOLS: McpToolDef[] = [
  {
    name: 'list_projects',
    title: 'List projects',
    description: 'List every pentest project (report) with its id, name, client, status and language.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'get_report',
    title: 'Get report',
    description: 'Get the full markdown report body of a project by its id.',
    inputSchema: {
      type: 'object',
      properties: { projectId: { type: 'string', description: 'The project id (e.g. proj-123).' } },
      required: ['projectId'],
      additionalProperties: false,
    },
  },
  {
    name: 'create_report',
    title: 'Create report',
    description: 'Create a new project with an initial markdown report body.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Project / report name.' },
        clientId: { type: 'string', description: 'Optional client id. Defaults to the first client.' },
        language: { type: 'string', enum: ['en', 'es'], description: 'Report language. Default es.' },
        status: { type: 'string', enum: ['In Progress', 'Completed', 'On Hold'], description: 'Default In Progress.' },
        reportBody: { type: 'string', description: 'Initial markdown body. Optional.' },
      },
      required: ['name'],
      additionalProperties: false,
    },
  },
  {
    name: 'update_report',
    title: 'Update report',
    description: 'Replace the entire markdown report body of an existing project.',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: { type: 'string', description: 'The project id to update.' },
        reportBody: { type: 'string', description: 'The new full markdown body.' },
      },
      required: ['projectId', 'reportBody'],
      additionalProperties: false,
    },
  },
  {
    name: 'append_to_report',
    title: 'Append to report',
    description: 'Append markdown to the end of an existing project report body.',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: { type: 'string', description: 'The project id.' },
        markdown: { type: 'string', description: 'Markdown to append (a new section, etc.).' },
      },
      required: ['projectId', 'markdown'],
      additionalProperties: false,
    },
  },
  {
    name: 'list_clients',
    title: 'List clients',
    description: 'List clients (id and name) so a client can be assigned when creating a report.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'list_findings',
    title: 'List findings',
    description: 'List findings, optionally filtered by projectId, to give the report context.',
    inputSchema: {
      type: 'object',
      properties: { projectId: { type: 'string', description: 'Optional project id to filter by.' } },
      additionalProperties: false,
    },
  },
  {
    name: 'get_finding',
    title: 'Get finding',
    description: 'Get a single finding by its id, including its full markdown body.',
    inputSchema: {
      type: 'object',
      properties: { findingId: { type: 'string', description: 'The finding id (e.g. find-123).' } },
      required: ['findingId'],
      additionalProperties: false,
    },
  },
  {
    name: 'create_finding',
    title: 'Create finding',
    description: 'Create a structured finding (vulnerability record) attached to a project.',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: { type: 'string', description: 'The project the finding belongs to.' },
        title: { type: 'string', description: 'Finding title.' },
        severity: {
          type: 'string',
          enum: ['Critical', 'High', 'Medium', 'Low', 'Informational'],
          description: 'Finding severity.',
        },
        cvss: { type: 'number', description: 'CVSS base score 0-10. Default 0.' },
        markdown: { type: 'string', description: 'Markdown body of the finding (description, evidence, remediation).' },
        vulnerabilityId: { type: 'string', description: 'Optional id of a library vulnerability this finding is based on.' },
      },
      required: ['projectId', 'title', 'severity'],
      additionalProperties: false,
    },
  },
  {
    name: 'update_finding',
    title: 'Update finding',
    description: 'Update fields of an existing finding. Only provided fields are changed.',
    inputSchema: {
      type: 'object',
      properties: {
        findingId: { type: 'string', description: 'The finding id to update.' },
        title: { type: 'string', description: 'New title.' },
        severity: {
          type: 'string',
          enum: ['Critical', 'High', 'Medium', 'Low', 'Informational'],
          description: 'New severity.',
        },
        cvss: { type: 'number', description: 'New CVSS base score 0-10.' },
        markdown: { type: 'string', description: 'New markdown body.' },
        vulnerabilityId: { type: 'string', description: 'New library vulnerability reference.' },
      },
      required: ['findingId'],
      additionalProperties: false,
    },
  },
  {
    name: 'delete_finding',
    title: 'Delete finding',
    description: 'Delete a finding by its id.',
    inputSchema: {
      type: 'object',
      properties: { findingId: { type: 'string', description: 'The finding id to delete.' } },
      required: ['findingId'],
      additionalProperties: false,
    },
  },
  {
    name: 'list_vulnerabilities',
    title: 'List vulnerabilities',
    description: 'List the reusable vulnerability library (id, titles, severity, cvss, cwe, tags) that findings can reference.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'get_vulnerability',
    title: 'Get vulnerability',
    description: 'Get the full bilingual entry of a library vulnerability by its id.',
    inputSchema: {
      type: 'object',
      properties: { vulnerabilityId: { type: 'string', description: 'The vulnerability id (e.g. vuln-123).' } },
      required: ['vulnerabilityId'],
      additionalProperties: false,
    },
  },
];
