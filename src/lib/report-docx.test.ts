import { describe, expect, it } from 'vitest';
import { buildReportDocx } from './report-docx';
import type { Client, Finding, Project } from './types';
import type { ReportTranslations } from './report-markdown';

// Prueba de humo del exportador .docx: construye un informe con la variedad
// real de Markdown que produce el editor (encabezados, listas, tabla, cita,
// codigo, enlace, negrita/cursiva, y una imagen rota) y verifica que
// `buildReportDocx` no lanza y produce un .docx con contenido real. No abre
// el archivo en Word (no disponible en CI); es la mejor verificacion
// automatizada posible sin esa dependencia.

const translations: ReportTranslations = {
  reportType: 'Pentest Report',
  generatedOn: 'Generated on',
  client: 'Client',
  assessmentWindow: 'Assessment window',
  totalFindings: 'Total findings',
  findingsSummary: 'Findings summary',
  findings: 'Findings',
  pentesterTitle: 'Pentester',
  severity: 'Severity',
  cvss: 'CVSS',
  count: 'Count',
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  informational: 'Informational',
};

const client: Client = {
  id: 'client-1',
  name: 'Acme Corp',
  contact: 'contact@acme.test',
  logoUrl: '',
};

const project: Project = {
  id: 'proj-1',
  clientId: client.id,
  name: 'Acme Web Assessment',
  icon: 'shield',
  language: 'en',
  status: 'In Progress',
  startDate: '2026-01-01',
  endDate: '2026-01-15',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  reportBody: [
    '## Scope',
    '',
    'This assessment covers **acme.test** and its *staging* environment.',
    '',
    '> Testing was performed under a signed authorization letter.',
    '',
    '### Methodology',
    '',
    '1. Reconnaissance',
    '2. Exploitation',
    '3. Reporting',
    '',
    '- No `nmap` scans were out of scope',
    '- See [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)',
    '',
    '| Severity | Count |',
    '| --- | --- |',
    '| Critical | 1 |',
    '| Low | 1 |',
    '',
    '```bash',
    'nmap -sV acme.test',
    '```',
    '',
    '![Broken reference](image://does-not-exist)',
    '',
    '{{findings.details}}',
  ].join('\n'),
};

const findings: Finding[] = [
  {
    id: 'f1',
    projectId: project.id,
    title: 'SQL Injection in login form',
    severity: 'Critical',
    cvss: 9.8,
    markdown: '### Description\n\nUnsanitized input reaches the query builder.',
    createdAt: '2026-01-02T00:00:00.000Z',
    updatedAt: '2026-01-02T00:00:00.000Z',
  },
  {
    id: 'f2',
    projectId: project.id,
    title: 'Missing security headers',
    severity: 'Low',
    cvss: 3.1,
    markdown: '### Description\n\n`X-Frame-Options` is not set.',
    createdAt: '2026-01-02T00:00:00.000Z',
    updatedAt: '2026-01-02T00:00:00.000Z',
  },
];

describe('buildReportDocx', () => {
  it('genera un .docx no vacio a partir de un informe completo, sin lanzar', async () => {
    const blob = await buildReportDocx({
      project,
      client,
      findings,
      variables: {},
      generatedDate: 'January 1, 2026',
      translations,
      footerLabel: `${project.name} · ${client.name}`,
      getImage: () => undefined, // fuerza el camino de "imagen no incluida"
    });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(1000);
    expect(blob.type).toBe('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  });
});

describe('buildReportDocx output shape', () => {
  it('produce un zip OOXML valido (firma PK, contiene word/document.xml)', async () => {
    const blob = await buildReportDocx({
      project,
      client,
      findings,
      variables: {},
      generatedDate: 'January 1, 2026',
      translations,
      footerLabel: 'Acme Web Assessment',
      getImage: () => undefined,
    });
    // jsdom no implementa Blob.arrayBuffer(); FileReader si esta soportado.
    const buf: Uint8Array = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer));
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(blob);
    });
    expect(buf[0]).toBe(0x50); // 'P'
    expect(buf[1]).toBe(0x4b); // 'K'
    const text = new TextDecoder('latin1').decode(buf);
    expect(text).toContain('word/document.xml');
  });
});
