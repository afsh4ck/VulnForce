import type { Finding, PentesterProfile, Project, Client, Severity } from './types';
import { resolveVariables, type VariableContext } from './markdown-utils';

const SEV_ORDER: Severity[] = ['Critical', 'High', 'Medium', 'Low', 'Informational'];

export type ReportTranslations = {
  reportType: string;
  generatedOn: string;
  client: string;
  assessmentWindow: string;
  totalFindings: string;
  findingsSummary: string;
  findings: string;
  pentesterTitle: string;
  severity: string;
  cvss: string;
  count: string;
  critical: string;
  high: string;
  medium: string;
  low: string;
  informational: string;
};

const severityLabel = (sev: Severity, t: ReportTranslations) => ({
  Critical: t.critical,
  High: t.high,
  Medium: t.medium,
  Low: t.low,
  Informational: t.informational,
}[sev]);

// Construye el reporte completo como Markdown plano (sin HTML, listo para
// GitBook, Notion, Obsidian o repos Git).
export function buildReportMarkdown(params: {
  project: Project;
  client: Client;
  findings: Finding[];
  pentester?: PentesterProfile;
  variables: VariableContext;
  generatedDate: string;
  translations: ReportTranslations;
}): string {
  const { project, client, findings, pentester, variables, generatedDate, translations: t } = params;

  const sortedFindings = [...findings].sort((a, b) => b.cvss - a.cvss);
  const counts: Record<Severity, number> = {
    Critical: 0, High: 0, Medium: 0, Low: 0, Informational: 0,
  };
  sortedFindings.forEach((f) => {
    if (f.severity in counts) counts[f.severity] += 1;
  });

  const headerLines = [
    `# ${project.name}`,
    '',
    `> ${t.reportType}`,
    '',
    `- **${t.client}:** ${client.name}`,
    `- **${t.assessmentWindow}:** ${project.startDate} – ${project.endDate}`,
    `- **${t.generatedOn}:** ${generatedDate}`,
    `- **${t.totalFindings}:** ${sortedFindings.length}`,
    '',
  ];

  if (pentester) {
    headerLines.push(`## ${t.pentesterTitle}`, '');
    if (pentester.name) headerLines.push(`- **Name:** ${pentester.name}`);
    if (pentester.role) headerLines.push(`- **Role:** ${pentester.role}`);
    if (pentester.company) headerLines.push(`- **Company:** ${pentester.company}`);
    if (pentester.email) headerLines.push(`- **Email:** ${pentester.email}`);
    if (pentester.phone) headerLines.push(`- **Phone:** ${pentester.phone}`);
    if (pentester.website) headerLines.push(`- **Website:** ${pentester.website}`);
    if (pentester.location) headerLines.push(`- **Location:** ${pentester.location}`);
    headerLines.push('');
  }

  headerLines.push(`## ${t.findingsSummary}`, '');
  headerLines.push(`| ${t.severity} | ${t.count} |`);
  headerLines.push('| --- | --- |');
  SEV_ORDER.forEach((sev) => {
    headerLines.push(`| ${severityLabel(sev, t)} | ${counts[sev]} |`);
  });
  headerLines.push('');

  const reportBody = resolveVariables(project.reportBody || '', variables);
  if (reportBody.trim()) {
    headerLines.push(reportBody.trim(), '');
  }

  if (sortedFindings.length > 0) {
    headerLines.push(`# ${t.findings}`, '');
    sortedFindings.forEach((finding) => {
      headerLines.push(
        `## ${finding.title}`,
        '',
        `- **${t.severity}:** ${severityLabel(finding.severity, t)}`,
        `- **${t.cvss}:** ${finding.cvss.toFixed(1)}`,
        '',
        resolveVariables(finding.markdown || '', variables).trim(),
        '',
      );
    });
  }

  return headerLines.join('\n');
}
