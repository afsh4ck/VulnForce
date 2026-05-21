// This file is deprecated and will be removed in a future update.
// Project templates are now managed through the DataContext.
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
This report outlines the results of an external penetration test performed on the internet-facing assets of **[TODO: Client Name]**. The assessment aimed to identify vulnerabilities that could be exploited by a remote attacker to compromise the security of the organization's perimeter. The assessment was conducted between **[TODO: Start Date]** and **[TODO: End Date]** from the perspective of an external, unauthenticated attacker (black-box).

---
# Scope
- **Web Applications:** *.example.com, api.example.com
- **External Network:** 198.51.100.0/24

---
# Methodology
1. **Reconnaissance:** Discovering subdomains, open ports, and services.
2. **Vulnerability Scanning:** Using automated tools to identify common vulnerabilities.
3. **Manual Verification & Exploitation:** Manually validating findings and attempting to exploit identified weaknesses.
4. **Reporting:** Documenting vulnerabilities and providing remediation guidance.

---
# Attack Narrative
[TODO: Provide a high-level summary of the attack path and key findings.]

---
# Findings Classification

| Severity | CVSS v3.1 Score | Description |
|:---|---|:---|
| <span style="color:red">Critical</span> | 9.0 - 10.0 | Vulnerabilities that could lead to immediate system compromise. |
| <span style="color:orange">High</span> | 7.0 - 8.9 | Vulnerabilities that could allow an attacker to gain unauthorized access. |
| <span style="color:yellow">Medium</span> | 4.0 - 6.9 | Weaknesses that could reveal sensitive information. |
| <span style="color:blue">Low</span> | 0.1 - 3.9 | Minor issues that reduce the overall security posture. |
| <span style="color:gray">Informational</span> | 0.0 | Observations about the external footprint. |`,
    appendix_en: `---
# Appendix
A combination of automated tools and manual techniques were used to perform this assessment.
- **Proxy:** Burp Suite Professional
- **Scanners:** Nessus, Nuclei
- **Reconnaissance:** Amass, Subfinder`,
    scope_es: `# Resumen Ejecutivo
Este informe describe los resultados de una prueba de penetración externa realizada en los activos de **[TODO: Nombre del Cliente]** expuestos a Internet. La evaluación tuvo como objetivo identificar vulnerabilidades que un atacante remoto podría explotar para comprometer la seguridad del perímetro de la organización. La evaluación se realizó entre el **[TODO: Fecha de Inicio]** y el **[TODO: Fecha de Fin]** desde la perspectiva de un atacante externo no autenticado (caja negra).

---
# Alcance
- **Aplicaciones Web:** *.ejemplo.com, api.ejemplo.com
- **Red Externa:** 198.51.100.0/24

---
# Metodología
1. **Reconocimiento:** Descubrimiento de subdominios, puertos abiertos y servicios.
2. **Escaneo de Vulnerabilidades:** Uso de herramientas automatizadas para identificar vulnerabilidades comunes.
3. **Verificación y Explotación Manual:** Validación manual de hallazgos e intento de explotar debilidades identificadas.
4. **Informe:** Documentación de vulnerabilidades y guía de remediación.

---
# Narrativa del Ataque
[TODO: Proporcionar un resumen de alto nivel de la ruta de ataque y los hallazgos clave.]

---
# Clasificación de Hallazgos

| Severidad | Puntuación CVSS v3.1 | Descripción |
|:---|---|:---|
| <span style="color:red">Crítica</span> | 9.0 - 10.0 | Vulnerabilidades que podrían llevar a un compromiso inmediato del sistema. |
| <span style="color:orange">Alta</span> | 7.0 - 8.9 | Vulnerabilidades que podrían permitir a un atacante obtener acceso no autorizado. |
| <span style="color:yellow">Media</span> | 4.0 - 6.9 | Debilidades que podrían revelar información sensible. |
| <span style="color:blue">Baja</span> | 0.1 - 3.9 | Problemas menores que reducen la postura de seguridad general. |
| <span style="color:gray">Informativa</span> | 0.0 | Observaciones sobre la huella externa. |`,
    appendix_es: `---
# Apéndice
Se utilizó una combinación de herramientas automatizadas y técnicas manuales para realizar esta evaluación.
- **Proxy:** Burp Suite Professional
- **Escáneres:** Nessus, Nuclei
- **Reconocimiento:** Amass, Subfinder`
  },
];
