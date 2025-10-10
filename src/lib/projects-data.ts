import type { Project } from './types';

export const initialProjects: Project[] = [
  {
    id: 'proj-1',
    clientId: 'cli-htb',
    name: 'Q3 Web App Pentest',
    reportBody: `## Executive Summary
This report details the findings of the penetration test conducted on **Q3 Web App Pentest** for **Hack The Box** between 2023-07-01 and 2023-07-15. The assessment identified **2** total vulnerabilities, including **1** critical and **1** high-risk findings. Urgent remediation is recommended for critical vulnerabilities to mitigate potential impact.

---
## Scope & Methodology
The assessment was conducted from the perspective of an external, unauthenticated attacker (black-box).

### Scope
- **Web Applications:** *.hackthebox.eu, api.hackthebox.eu
- **External Network:** 138.68.128.0/24

### Methodology
1. **Reconnaissance:** Discovering subdomains, open ports, and services.
2. **Vulnerability Scanning:** Using automated tools to identify common vulnerabilities.
3. **Manual Verification & Exploitation:** Manually validating findings and attempting to exploit identified weaknesses.
4. **Reporting:** Documenting vulnerabilities and providing remediation guidance.

---
## Attack Narrative
The engagement began with reconnaissance against the *.hackthebox.eu domain, which revealed the existence of an outdated blog and a development server with directory listing enabled. An SQL Injection vulnerability was discovered and exploited on the main web application's login form, allowing for authentication bypass. This access was leveraged to uncover a Stored XSS vulnerability in the user profile section, which could be used to target other users, including administrators.

---
## Findings Classification
| Severity | CVSS v3.1 Score | Description |
|:---|---|:---|
| <span style="color:red">Critical</span> | 9.0 - 10.0 | Vulnerabilities that could lead to immediate system compromise. |
| <span style="color:orange">High</span> | 7.0 - 8.9 | Vulnerabilities that could allow an attacker to gain unauthorized access. |
| <span style="color:yellow">Medium</span> | 4.0 - 6.9 | Weaknesses that could reveal sensitive information. |
| <span style="color:blue">Low</span> | 0.1 - 3.9 | Minor issues that reduce the overall security posture. |
| <span style="color:gray">Informational</span> | 0.0 | Observations about the external footprint. |
`,
    startDate: '2023-07-01',
    endDate: '2023-07-15',
    status: 'Completed',
    language: 'en',
    createdAt: '2023-07-01T10:00:00Z',
    updatedAt: '2023-07-15T18:00:00Z',
    icon: 'Scan'
  },
  {
    id: 'proj-2',
    clientId: 'cli-ine',
    name: 'Análisis de Red Interna',
    reportBody: `## Resumen Ejecutivo
Este informe detalla los hallazgos de la evaluación de seguridad de la red interna para **INE Security**, realizada entre el 10-08-2023 y el 20-08-2023. El objetivo era identificar vulnerabilidades explotables desde la perspectiva de un actor malicioso con acceso a la red corporativa. Se descubrieron múltiples debilidades, incluyendo el uso de credenciales por defecto en servicios críticos y software sin parches que permitieron la escalada de privilegios hasta el nivel de Administrador de Dominio. Se recomienda la remediación inmediata de los hallazgos críticos.

---
## Alcance y Metodología

### Alcance
- **Rangos IP:** 10.10.0.0/16
- **Supuestos:** La evaluación se realiza desde la perspectiva de un atacante que ha obtenido un punto de apoyo en la red interna (p.ej., una estación de trabajo comprometida).
- **Exclusiones:** No se realizaron pruebas que pudieran causar una denegación de servicio en sistemas de producción críticos.

### Metodología
1. **Descubrimiento de Activos:** Identificación de hosts activos, puertos y servicios en la red.
2. **Enumeración de Servicios:** Análisis de servicios para identificar versiones, configuraciones y posibles vulnerabilidades.
3. **Explotación y Movimiento Lateral:** Intento de explotar vulnerabilidades para ganar acceso y moverse a través de la red.
4. **Escalada de Privilegios:** Búsqueda de vías para elevar los privilegios en los sistemas comprometidos y en el dominio de Active Directory.
`,
    startDate: '2023-08-10',
    endDate: '2023-08-20',
    status: 'In Progress',
    language: 'es',
    createdAt: '2023-08-10T09:00:00Z',
    updatedAt: '2023-08-15T14:30:00Z',
    icon: 'Network'
  },
];
