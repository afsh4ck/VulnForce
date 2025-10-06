export type Severity = 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';

export interface Client {
  id: string;
  name: string;
  contact: string;
  logoUrl: string;
  language: 'en' | 'es';
}

export interface Project {
  id: string;
  clientId: string;
  name: string;
  scope: string;
  startDate: string;
  endDate: string;
  status: 'In Progress' | 'Completed' | 'On Hold';
}

export interface Finding {
  id:string;
  projectId: string;
  vulnerabilityId?: string;
  title: string;
  severity: Severity;
  cvss: number;
  markdown: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vulnerability {
  id: string;
  title_es: string;
  title_en: string;
  cvss: number;
  severity: Severity;
  description_es: string;
  description_en: string;
  mitigation_es: string;
  mitigation_en: string;
  tags: string[];
  reference: string;
}

export interface Report {
  id: string;
  projectId: string;
  generatedHtml: string;
  pdfUrl?: string;
  options: Record<string, any>;
  createdAt: string;
}
