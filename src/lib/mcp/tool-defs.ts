// MCP tool metadata. Pure data (no Node imports) so it can be imported by both
// the server route and client components (the MCP page lists the tools here).

export const MCP_SERVER_INFO = { name: 'vulnforce', version: '1.0.0' } as const;

export const MCP_SUPPORTED_PROTOCOL_VERSIONS = ['2025-06-18', '2025-03-26', '2024-11-05'] as const;
export const MCP_DEFAULT_PROTOCOL_VERSION = '2025-06-18';

export const MCP_INSTRUCTIONS =
  'VulnForce exposes pentest projects as reports. A report is the markdown body of a project. ' +
  'Use list_projects to find a project id, get_report to read it, and update_report / append_to_report / create_report to write it. ' +
  'Reports use H1 (#) for sections and H2/H3 for subsections.';

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
];
