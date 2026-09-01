// MCP tool metadata. Pure data (no Node imports) so it can be imported by both
// the server route and client components (the MCP page lists the tools here).

export const MCP_SERVER_INFO = { name: 'vulnforce', version: '1.1.0' } as const;

export const MCP_SUPPORTED_PROTOCOL_VERSIONS = ['2025-06-18', '2025-03-26', '2024-11-05'] as const;
export const MCP_DEFAULT_PROTOCOL_VERSION = '2025-06-18';

export const MCP_INSTRUCTIONS =
  'VulnForce exposes pentest projects as markdown reports plus a structured findings database. ' +
  'Before writing anything, call list_skills and get_skill("vulnforce-reports") (or the vulnforce-reports MCP prompt) ' +
  'for the report-generation playbook; load the other area skills only when you need them. ' +
  'Core rule: never paste vulnerabilities into the report body — create one finding per vulnerability with create_finding.';

export type McpSkillDef = {
  id: string;
  description: string;
};

// Discovery manifest for the skills served on demand via get_skill / prompts.
// Full content lives in src/lib/mcp/skills.ts.
export const MCP_SKILLS: McpSkillDef[] = [
  {
    id: 'vulnforce-reports',
    description: 'Router: load first. MCP tool map and the token-efficient report workflow.',
  },
  {
    id: 'vulnforce-report-structure',
    description: 'Report body shape: section hierarchy, project templates, the {{findings.table}} and {{findings.details}} markers, template variables.',
  },
  {
    id: 'vulnforce-findings-workflow',
    description: 'Creating and writing findings, finding markdown structure, reusing the vulnerability library.',
  },
  {
    id: 'vulnforce-cvss-scoring',
    description: 'CVSS v3.1 severity bands and scoring conventions for findings.',
  },
  {
    id: 'vulnforce-import',
    description: 'Importing Obsidian or GitBook markdown into a report, keeping images working (GitBook /files/ trap, Obsidian wikilinks).',
  },
];

export type McpToolDef = {
  name: string;
  title: string;
  description: string;
  inputSchema: Record<string, unknown>;
};

// Localized short descriptions for the dashboard MCP page. The MCP protocol
// keeps using the verbose English `description` above; this is display only.
export const MCP_TOOL_I18N: Record<string, { en: string; es: string }> = {
  list_skills: {
    en: 'List the report-generation skills (playbooks) this server provides.',
    es: 'Lista las skills (manuales) de generación de informes de este servidor.',
  },
  get_skill: {
    en: 'Download the full markdown of one skill by its id. Start with vulnforce-reports.',
    es: 'Descarga el Markdown completo de una skill por su id. Empieza por vulnforce-reports.',
  },
  list_projects: {
    en: 'List every project (report) with its id, name, client, status and language.',
    es: 'Lista los proyectos (informes) con id, nombre, cliente, estado e idioma.',
  },
  get_report: {
    en: 'Get the full markdown report body of a project by its id.',
    es: 'Obtiene el cuerpo Markdown completo del informe de un proyecto por su id.',
  },
  create_report: {
    en: 'Create a new project with an initial markdown report body.',
    es: 'Crea un proyecto nuevo con un cuerpo de informe Markdown inicial.',
  },
  update_report: {
    en: 'Replace the entire markdown report body of a project.',
    es: 'Reemplaza por completo el cuerpo Markdown del informe de un proyecto.',
  },
  append_to_report: {
    en: 'Append markdown to the end of a project report body.',
    es: 'Añade Markdown al final del cuerpo del informe de un proyecto.',
  },
  list_clients: {
    en: 'List clients (id and name) to assign one when creating a report.',
    es: 'Lista los clientes (id y nombre) para asignarlos al crear un informe.',
  },
  list_findings: {
    en: 'List findings, optionally filtered by project, as report context.',
    es: 'Lista hallazgos, opcionalmente filtrados por proyecto, como contexto del informe.',
  },
  get_finding: {
    en: 'Get a single finding by its id, including its full markdown body.',
    es: 'Obtiene un hallazgo por su id, con su cuerpo Markdown completo.',
  },
  create_finding: {
    en: 'Create a structured finding (vulnerability record) attached to a project.',
    es: 'Crea un hallazgo estructurado (registro de vulnerabilidad) asociado a un proyecto.',
  },
  update_finding: {
    en: 'Update fields of a finding. Only the fields you pass change.',
    es: 'Actualiza campos de un hallazgo. Solo cambia los que envías.',
  },
  delete_finding: {
    en: 'Delete a finding by its id.',
    es: 'Elimina un hallazgo por su id.',
  },
  list_vulnerabilities: {
    en: 'List the reusable vulnerability library that findings can reference.',
    es: 'Lista la biblioteca reutilizable de vulnerabilidades que los hallazgos pueden referenciar.',
  },
  get_vulnerability: {
    en: 'Get the full bilingual entry of a library vulnerability by its id.',
    es: 'Obtiene la entrada bilingüe completa de una vulnerabilidad de la biblioteca por su id.',
  },
};

export const MCP_SKILL_I18N: Record<string, { en: string; es: string }> = {
  'vulnforce-reports': {
    en: 'Router: load first. MCP tool map and the token-efficient report workflow.',
    es: 'Router: cárgala primero. Mapa de herramientas MCP y flujo de trabajo eficiente en tokens.',
  },
  'vulnforce-report-structure': {
    en: 'Report structure: section hierarchy, templates, the {{findings.table}} and {{findings.details}} markers, variables.',
    es: 'Estructura del informe: jerarquía de secciones, plantillas, marcadores {{findings.table}} y {{findings.details}}, variables.',
  },
  'vulnforce-findings-workflow': {
    en: 'Creating and writing findings, finding markdown structure, using the vulnerability library.',
    es: 'Creación y redacción de hallazgos, estructura Markdown del hallazgo, uso de la biblioteca de vulnerabilidades.',
  },
  'vulnforce-cvss-scoring': {
    en: 'CVSS v3.1 severity bands and finding scoring conventions.',
    es: 'Bandas de severidad CVSS v3.1 y convenciones de puntuación de hallazgos.',
  },
  'vulnforce-import': {
    en: 'Import Obsidian / GitBook markdown into a report, keeping images working.',
    es: 'Importar Markdown de Obsidian / GitBook a un informe manteniendo las imágenes.',
  },
};

export const MCP_TOOLS: McpToolDef[] = [
  {
    name: 'list_skills',
    title: 'List skills',
    description: 'List the report-generation skills (playbooks) available from this server, with their id and when to use each.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'get_skill',
    title: 'Get skill',
    description: 'Get the full markdown of one skill by its id (e.g. vulnforce-reports). Returned with frontmatter so it can be saved as a SKILL.md. Start with vulnforce-reports.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'string', description: 'Skill id, e.g. vulnforce-reports.' } },
      required: ['id'],
      additionalProperties: false,
    },
  },
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
