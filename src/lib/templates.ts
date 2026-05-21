// This file is deprecated and will be removed in a future update.
// Project templates are now managed through the DataContext.
// See `src/lib/project-templates-data.ts` for the live catalogue.
import type { ProjectTemplate } from './types';

export const projectTemplates: ProjectTemplate[] = [
  {
    id: 'ptpl-1',
    name_en: 'Standard Web App Pentest',
    name_es: 'Pentest Estándar de Aplicación Web',
    description_en: 'A comprehensive security assessment for web applications, covering OWASP Top 10 and other common vulnerabilities.',
    description_es: 'Una evaluación de seguridad completa para aplicaciones web, cubriendo el OWASP Top 10 y otras vulnerabilidades comunes.',
    icon: 'Scan',
    scope_en: `# Executive Summary

This report outlines the results of a penetration test performed on the internet-facing assets of **{{client.name}}**. The engagement ran from **{{project.startDate}}** to **{{project.endDate}}** from the perspective of an unauthenticated external attacker (black-box).

# Scope

- **Web applications:** [TODO: hostnames or URLs]
- **External network:** [TODO: IP ranges]

# Methodology

1. Reconnaissance.
2. Vulnerability identification.
3. Manual validation and exploitation.
4. Post-exploitation.
5. Reporting.

# Findings Summary

{{findings.table}}
`,
    appendix_en: `# Appendix

A combination of automated tools and manual techniques was used:

- **Proxy:** Burp Suite Professional
- **Scanners:** Nessus, Nuclei
- **Reconnaissance:** Amass, Subfinder
`,
    scope_es: `# Resumen Ejecutivo

Este informe describe los resultados de una prueba de penetración realizada sobre los activos de **{{client.name}}** expuestos a Internet. La evaluación se realizó entre el **{{project.startDate}}** y el **{{project.endDate}}** desde la perspectiva de un atacante externo no autenticado (caja negra).

# Alcance

- **Aplicaciones web:** [TODO: hostnames o URLs]
- **Red externa:** [TODO: rangos IP]

# Metodología

1. Reconocimiento.
2. Identificación de vulnerabilidades.
3. Validación y explotación manual.
4. Post-explotación.
5. Reporte.

# Resumen de Hallazgos

{{findings.table}}
`,
    appendix_es: `# Apéndice

Se utilizó una combinación de herramientas automatizadas y técnicas manuales:

- **Proxy:** Burp Suite Professional
- **Escáneres:** Nessus, Nuclei
- **Reconocimiento:** Amass, Subfinder
`,
  },
];
