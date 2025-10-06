import type { Client, Project, Finding, Vulnerability } from './types';

export const clients: Client[] = [
  { id: 'cli-1', name: 'Innovatech Solutions', contact: 'contact@innovatech.com', logoUrl: 'client-logo-1', language: 'en' },
  { id: 'cli-2', name: 'Quantum Dynamics', contact: 'security@quantum.com', logoUrl: 'client-logo-2', language: 'en' },
  { id: 'cli-3', name: 'SecureBank Corp', contact: 'audit@securebank.com', logoUrl: 'client-logo-3', language: 'es' },
  { id: 'cli-4', name: 'HealthFirst Providers', contact: 'compliance@healthfirst.com', logoUrl: 'client-logo-4', language: 'en' },
];

export const projects: Project[] = [
  { id: 'proj-1', clientId: 'cli-1', name: 'Q3 Web App Pentest', scope: '*.innovatech.com', startDate: '2023-07-01', endDate: '2023-07-15', status: 'Completed' },
  { id: 'proj-2', clientId: 'cli-2', name: 'API Security Audit', scope: 'api.quantum.com', startDate: '2023-08-10', endDate: '2023-08-25', status: 'Completed' },
  { id: 'proj-3', clientId: 'cli-3', name: 'Auditoría Red Interna', scope: '10.0.0.0/8', startDate: '2023-09-01', endDate: '2023-09-30', status: 'In Progress' },
  { id: 'proj-4', clientId: 'cli-1', name: 'Mobile App Assessment', scope: 'Innovatech iOS App', startDate: '2023-10-05', endDate: '2023-10-20', status: 'In Progress' },
];

export const findings: Finding[] = [
  {
    id: 'find-1',
    projectId: 'proj-1',
    vulnerabilityId: 'vuln-001',
    title: 'SQL Injection in Login Form',
    severity: 'Critical',
    cvss: 9.8,
    markdown: `### Description\n\nThe login form at /login is vulnerable to SQL injection. By providing a crafted payload in the username field, an attacker can bypass authentication.\n\n### Evidence\n\nPayload: \`' OR 1=1 -- \`\n\n### Mitigation\n\nUse parameterized queries.`,
    createdAt: '2023-07-05',
    updatedAt: '2023-07-06',
  },
  {
    id: 'find-2',
    projectId: 'proj-1',
    vulnerabilityId: 'vuln-002',
    title: 'Cross-Site Scripting (XSS) in Search Results',
    severity: 'High',
    cvss: 8.8,
    markdown: `### Description\n\nThe search functionality is vulnerable to reflected XSS. Malicious scripts can be injected via the search query parameter.\n\n### Evidence\n\nURL: \`/search?q=<script>alert('XSS')</script>\`\n\n### Mitigation\n\nEncode output and validate input.`,
    createdAt: '2023-07-08',
    updatedAt: '2023-07-08',
  },
  {
    id: 'find-3',
    projectId: 'proj-3',
    title: 'Exposición de servicio SMB sin protección',
    severity: 'Medium',
    cvss: 6.5,
    markdown: `### Descripción\n\nSe ha identificado un servicio SMB en la red interna que permite el acceso anónimo, exponiendo archivos sensibles de la compañía.\n\n### Evidencia\n\n- Host: 10.1.5.22\n- Acceso como invitado habilitado.\n\n### Mitigación\n\nDeshabilitar el acceso anónimo y aplicar autenticación en el recurso compartido SMB.`,
    createdAt: '2023-09-10',
    updatedAt: '2023-09-11',
  }
];

export const vulnerabilities: Vulnerability[] = [
    { 
        id: 'vuln-001',
        title_es: 'Inyección SQL (SQLi)',
        title_en: 'SQL Injection (SQLi)',
        cvss: 9.8,
        severity: 'Critical',
        description_es: 'Permite a un atacante interferir con las consultas que una aplicación hace a su base de datos.',
        description_en: 'Allows an attacker to interfere with the queries that an application makes to its database.',
        mitigation_es: 'Utilizar consultas parametrizadas y escapar todas las entradas del usuario.',
        mitigation_en: 'Use parameterized queries and escape all user input.',
        tags: ['OWASP Top 10', 'A03:2021-Injection'],
        reference: 'CWE-89'
    },
    { 
        id: 'vuln-002',
        title_es: 'Cross-Site Scripting (XSS) Reflejado',
        title_en: 'Reflected Cross-Site Scripting (XSS)',
        cvss: 6.1,
        severity: 'Medium',
        description_es: 'Ocurre cuando un script malicioso es reflejado desde una aplicación web al navegador de la víctima.',
        description_en: 'Occurs when a malicious script is reflected off a web application to the victim\'s browser.',
        mitigation_es: 'Validar y codificar las entradas y salidas para prevenir la ejecución de scripts.',
        mitigation_en: 'Validate and encode inputs and outputs to prevent script execution.',
        tags: ['OWASP Top 10', 'A03:2021-Injection'],
        reference: 'CWE-79'
    },
    { 
        id: 'vuln-003',
        title_es: 'Componentes con Vulnerabilidades Conocidas',
        title_en: 'Vulnerable and Outdated Components',
        cvss: 9.8,
        severity: 'Critical',
        description_es: 'El uso de componentes de software con vulnerabilidades conocidas puede comprometer la seguridad de la aplicación.',
        description_en: 'Using software components with known vulnerabilities can compromise the application\'s security.',
        mitigation_es: 'Mantener un inventario de componentes y actualizarlos regularmente a versiones seguras.',
        mitigation_en: 'Maintain an inventory of components and regularly update them to secure versions.',
        tags: ['OWASP Top 10', 'A06:2021-Vulnerable and Outdated Components'],
        reference: 'CWE-1104'
    },
    { 
        id: 'vuln-004',
        title_es: 'Pérdida de Control de Acceso',
        title_en: 'Broken Access Control',
        cvss: 8.8,
        severity: 'High',
        description_es: 'Permite a los atacantes eludir la autorización y realizar tareas como si fueran usuarios privilegiados.',
        description_en: 'Allows attackers to bypass authorization and perform tasks as if they were privileged users.',
        mitigation_es: 'Implementar un modelo de control de acceso robusto y denegar por defecto.',
        mitigation_en: 'Implement a robust access control model and deny by default.',
        tags: ['OWASP Top 10', 'A01:2021-Broken Access Control'],
        reference: 'CWE-284'
    },
    { 
        id: 'vuln-005',
        title_es: 'Fallo de Configuración de Seguridad',
        title_en: 'Security Misconfiguration',
        cvss: 7.5,
        severity: 'High',
        description_es: 'Configuraciones inseguras en el framework, servidor de aplicaciones, o servidor web.',
        description_en: 'Insecure settings in the framework, application server, or web server.',
        mitigation_es: 'Aplicar un proceso de hardening y revisar las configuraciones de seguridad de forma periódica.',
        mitigation_en: 'Apply a hardening process and periodically review security configurations.',
        tags: ['OWASP Top 10', 'A05:2021-Security Misconfiguration'],
        reference: 'CWE-16'
    }
];
