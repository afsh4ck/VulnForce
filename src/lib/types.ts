

export type Severity = 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';

export interface Client {
  id: string;
  name: string;
  contact: string;
  logoUrl: string;
}

export interface Project {
  id: string;
  clientId: string;
  name: string;
  icon: string;
  reportBody: string;
  startDate: string;
  endDate: string;
  status: 'In Progress' | 'Completed' | 'On Hold';
  language: 'en' | 'es';
  createdAt: string;
  updatedAt: string;
  appendix?: string; // Kept for backwards compatibility during transition
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

export interface ImageAsset {
  id: string;
  dataUrl: string;
}

export interface CVSS {
  score: number;
  vectorString: string;
  attackVector: string;
  attackComplexity: string;
  privilegesRequired: string;
  userInteraction: string;
  scope: string;
  confidentiality: string;
  integrity: string;
  availability: string;
}

export interface Remediation {
  shortTerm?: string;
  mediumTerm?: string;
  longTerm?: string;
}

export interface Vulnerability {
  id: string;
  title_en: string;
  title_es: string;
  overview_en: string;
  overview_es: string;
  technicalDescription_en: string;
  technicalDescription_es: string;
  affectedComponents_en: string;
  affectedComponents_es: string;
  impact_en: string;
  impact_es: string;
  recommendations_en: string;
  recommendations_es: string;
  details_en: string;
  details_es: string;
  remediation_en: Remediation;
  remediation_es: Remediation;
  cwe: string;
  cvss: CVSS;
  severity: Severity;
  references: string[];
  tags: string[];
}

export interface Report {
  id: string;
  projectId: string;
  generatedHtml: string;
  pdfUrl?: string;
  options: Record<string, any>;
  createdAt: string;
}

export interface ProjectTemplate {
  id: string;
  name_en: string;
  name_es: string;
  description_en: string;
  description_es: string;
  scope_en: string;
  scope_es: string;
  icon: string;
  appendix_en?: string;
  appendix_es?: string;
}
