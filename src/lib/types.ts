

export type Severity = 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';

export interface Client {
  id: string;
  name: string;
  contact: string;
  phone?: string;
  logoUrl: string;
  logoWide?: string;
}

export interface PentesterProfile {
  name?: string;
  role?: string;
  company?: string;
  email?: string;
  phone?: string;
  website?: string;
  location?: string;
  avatar?: string;
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
  includePentesterData?: boolean;
  pentesterSnapshot?: PentesterProfile;
  /**
   * Tema de reporte aplicado a este proyecto. Si es `undefined` se usa el
   * `activeThemeId` global del usuario.
   */
  themeId?: string;
  createdAt: string;
  updatedAt: string;
}

export type ContentBlockTag =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'p'
  | 'ul'
  | 'ol'
  | 'hr'
  | 'blockquote'
  | 'pre'
  | 'table';

export interface ContentBlock {
  id: string;
  tag: ContentBlockTag;
  content: string;
  meta?: {
    viewMode?: 'split' | 'markdown' | 'preview';
  };
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
  immediateActions_en: string;
  immediateActions_es: string;
  details_en: string;
  details_es: string;
  recommendations_en: string;
  recommendations_es: string;
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
  appendix_en: string;
  appendix_es: string;
  icon: string;
}
