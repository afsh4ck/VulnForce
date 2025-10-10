
import type { Vulnerability } from './types';

export const initialVulnerabilities: Vulnerability[] = [
    // --- WEB VULNERABILITIES ---
    {
        id: "vuln-web-001",
        title_en: "SQL Injection",
        title_es: "Inyección SQL",
        overview_en: `### Overview
SQL Injection is a web security vulnerability that allows an attacker to interfere with the queries that an application makes to its database. It generally allows an attacker to view data that they are not normally able to retrieve, and sometimes modify or delete this data, causing persistent changes to the application's content or behavior.`,
        overview_es: `### Resumen
La inyección SQL es una vulnerabilidad de seguridad web que permite a un atacante interferir con las consultas que una aplicación hace a su base de datos. Generalmente, permite a un atacante ver datos que normalmente no podría recuperar, y a veces modificar o eliminar estos datos, causando cambios persistentes en el contenido o comportamiento de la aplicación.`,
        technicalDescription_en: `### Technical Description
The vulnerability occurs when user-supplied input is not properly sanitized or validated and is directly embedded into an SQL query. An attacker can supply crafted input that changes the structure of the original query. For example, by injecting logical SQL expressions like \`' OR '1'='1'\`, an attacker can bypass authentication or retrieve sensitive information.`,
        technicalDescription_es: `### Descripción Técnica
La vulnerabilidad ocurre cuando la entrada proporcionada por el usuario no se sanea o valida correctamente y se incrusta directamente en una consulta SQL. Un atacante puede proporcionar una entrada manipulada que cambia la estructura de la consulta original. Por ejemplo, al inyectar expresiones lógicas de SQL como \`' OR '1'='1'\`, un atacante puede eludir la autenticación o recuperar información sensible.`,
        impact_en: `### Impact
Successful exploitation can lead to unauthorized access to sensitive data, such as passwords, credit card details, or personal user information. In many cases, an attacker can modify or delete this data, causing data integrity issues. Depending on the database privileges, it could also allow the attacker to execute commands on the underlying operating system, leading to a full system compromise.`,
        impact_es: `### Impacto
La explotación exitosa puede conducir al acceso no autorizado a datos sensibles, como contraseñas, detalles de tarjetas de crédito o información personal de los usuarios. En muchos casos, un atacante puede modificar o eliminar estos datos, causando problemas de integridad. Dependiendo de los privilegios de la base de datos, también podría permitir al atacante ejecutar comandos en el sistema operativo subyacente, lo que llevaría a un compromiso total del sistema.`,
        remediation_en: {
            shortTerm: "Immediately implement a Web Application Firewall (WAF) with rules to block common SQLi patterns. Review and sanitize the most critical inputs of the application.",
            mediumTerm: "Refactor all database queries to use parameterized queries (also known as prepared statements). This is the most effective defense against SQLi as it separates the query logic from the data.",
            longTerm: "Conduct regular security training for developers on secure coding practices. Implement static (SAST) and dynamic (DAST) application security testing into the CI/CD pipeline to proactively identify and fix vulnerabilities."
        },
        remediation_es: {
            shortTerm: "Implementar de inmediato un Web Application Firewall (WAF) con reglas para bloquear patrones comunes de SQLi. Revisar y sanear las entradas más críticas de la aplicación.",
            mediumTerm: "Refactorizar todas las consultas a la base de datos para usar consultas parametrizadas (también conocidas como prepared statements). Esta es la defensa más efectiva contra SQLi ya que separa la lógica de la consulta de los datos.",
            longTerm: "Realizar capacitaciones de seguridad periódicas para los desarrolladores sobre prácticas de codificación segura. Implementar pruebas de seguridad de aplicaciones estáticas (SAST) y dinámicas (DAST) en el pipeline de CI/CD para identificar y corregir vulnerabilidades de forma proactiva."
        },
        cwe: "CWE-89",
        severity: "Critical",
        cvss: { score: 9.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        references: ["https://owasp.org/www-community/attacks/SQL_Injection"],
        tags: ["Web"],
        affectedComponents_en: `### Affected Components
- [TODO: List affected components, URLs, parameters, etc.]`,
        details_en: `### Proof of Concept
[TODO: Provide a detailed PoC, including steps, code snippets, and screenshots in English]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Listar componentes afectados, URLs, parámetros, etc.]`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar una PoC detallada, incluyendo pasos, fragmentos de código y capturas de pantalla en español]`,
    },
    {
        id: "vuln-web-002",
        title_en: "Cross-Site Scripting (XSS)",
        title_es: "Secuencias de Comandos en Sitios Cruzados (XSS)",
        overview_en: `### Overview
Cross-Site Scripting (XSS) allows attackers to inject malicious client-side scripts into web pages viewed by other users. This vulnerability can be used to bypass access controls, steal user sessions, or spread malware. It can be classified as Reflected (non-persistent), Stored (persistent), or DOM-based.`,
        overview_es: `### Resumen
Cross-Site Scripting (XSS) permite a los atacantes inyectar scripts maliciosos del lado del cliente en páginas web vistas por otros usuarios. Esta vulnerabilidad puede ser utilizada para eludir controles de acceso, robar sesiones de usuario o propagar malware. Se puede clasificar como Reflejado (no persistente), Almacenado (persistente) o basado en DOM.`,
        technicalDescription_en: `### Technical Description
The application does not properly sanitize user-supplied data before embedding it into HTML output. An attacker can inject a payload like \`<script>alert('XSS')</script>\`. When a victim's browser renders the page, it executes the script, which runs with the same permissions as the application itself. This can be Stored (persistent), Reflected (non-persistent), or DOM-based.`,
        technicalDescription_es: `### Descripción Técnica
La aplicación no sanea correctamente los datos proporcionados por el usuario antes de incrustarlos en la salida HTML. Un atacante puede inyectar una carga útil como \`<script>alert('XSS')</script>\`. Cuando el navegador de una víctima renderiza la página, ejecuta el script, que se ejecuta con los mismos permisos que la propia aplicación. Puede ser Almacenado (persistente), Reflejado (no persistente) o basado en DOM.`,
        impact_en: `### Impact
XSS can lead to session hijacking, account takeover, redirection to malicious sites, or unauthorized actions on behalf of the user. In the context of an administrator, it could lead to full control of the web application.`,
        impact_es: `### Impacto
El XSS puede conducir al secuestro de sesiones, la toma de control de cuentas, la redirección a sitios maliciosos o la realización de acciones no autorizadas en nombre del usuario. En el contexto de un administrador, podría llevar al control total de la aplicación web.`,
        remediation_en: {
            shortTerm: "Implement a strict Content Security Policy (CSP) to limit the sources from which scripts can be loaded. Apply context-aware output encoding to all user-supplied data before it is rendered in the browser.",
            mediumTerm: "Use modern web frameworks (like React, Angular, Vue) that have built-in protections against XSS. Avoid using dangerous functions like `innerHTML`.",
            longTerm: "Implement a security-focused design pattern where untrusted data is never mixed with executable code. Train developers to understand the different contexts of XSS and how to mitigate them."
        },
        remediation_es: {
            shortTerm: "Implementar una Política de Seguridad de Contenido (CSP) estricta para limitar las fuentes desde las que se pueden cargar scripts. Aplicar codificación de salida sensible al contexto a todos los datos proporcionados por el usuario antes de que se rendericen en el navegador.",
            mediumTerm: "Utilizar frameworks web modernos (como React, Angular, Vue) que tengan protecciones incorporadas contra XSS. Evitar el uso de funciones peligrosas como `innerHTML`.",
            longTerm: "Implementar un patrón de diseño centrado en la seguridad donde los datos no confiables nunca se mezclen con código ejecutable. Capacitar a los desarrolladores para que comprendan los diferentes contextos de XSS y cómo mitigarlos."
        },
        cwe: "CWE-79",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "C", confidentiality: "H", integrity: "N", availability: "N" },
        references: ["https://owasp.org/www-community/attacks/xss/"],
        tags: ["Web"],
        affectedComponents_en: `### Affected Components
- [TODO: List affected components, URLs, parameters, etc.]`,
        details_en: `### Proof of Concept
[TODO: Provide a detailed PoC, including steps, code snippets, and screenshots in English]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Listar componentes afectados, URLs, parámetros, etc.]`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar una PoC detallada, incluyendo pasos, fragmentos de código y capturas de pantalla en español]`,
    },
    {
        id: "vuln-web-003",
        title_en: "Broken Authentication",
        title_es: "Autenticación Rota",
        overview_en: `### Overview
Flaws in authentication mechanisms can allow attackers to compromise user accounts, passwords, or session tokens. This can lead to unauthorized access and account takeover.`,
        overview_es: `### Resumen
Las fallas en los mecanismos de autenticación pueden permitir a los atacantes comprometer cuentas de usuario, contraseñas o tokens de sesión. Esto puede conducir a un acceso no autorizado y a la toma de control de cuentas.`,
        technicalDescription_en: `### Technical Description
Broken authentication can manifest in various ways, such as allowing credential stuffing, failing to properly invalidate session tokens on logout, exposing session IDs in URLs, or having weak password recovery processes that can be manipulated by an attacker.`,
        technicalDescription_es: `### Descripción Técnica
La autenticación rota puede manifestarse de varias maneras, como permitir el relleno de credenciales (credential stuffing), no invalidar correctamente los tokens de sesión al cerrar sesión, exponer los ID de sesión en las URL o tener procesos de recuperación de contraseña débiles que un atacante puede manipular.`,
        impact_en: `### Impact
Attackers can take over user accounts, potentially gaining access to sensitive data or functionality. If an administrative account is compromised, the attacker could gain full control over the application.`,
        impact_es: `### Impacto
Los atacantes pueden tomar el control de las cuentas de los usuarios, obteniendo potencialmente acceso a datos o funcionalidades sensibles. Si se compromete una cuenta administrativa, el atacante podría obtener el control total de la aplicación.`,
        remediation_en: {
            shortTerm: "Enforce strong password policies and implement rate limiting on login attempts. Ensure session tokens are invalidated on the server-side upon logout.",
            mediumTerm: "Implement Multi-Factor Authentication (MFA) for all users, especially for administrative accounts. Use a centralized and standardized session management mechanism.",
            longTerm: "Conduct a thorough review of the entire authentication and session management lifecycle. Use industry-standard frameworks and avoid creating custom authentication schemes."
        },
        remediation_es: {
            shortTerm: "Forzar políticas de contraseñas seguras e implementar limitación de velocidad en los intentos de inicio de sesión. Asegurarse de que los tokens de sesión se invaliden en el lado del servidor al cerrar la sesión.",
            mediumTerm: "Implementar la autenticación multifactor (MFA) para todos los usuarios, especialmente para las cuentas administrativas. Utilizar un mecanismo de gestión de sesiones centralizado y estandarizado.",
            longTerm: "Realizar una revisión exhaustiva de todo el ciclo de vida de la autenticación y la gestión de sesiones. Utilizar frameworks estándar de la industria y evitar la creación de esquemas de autenticación personalizados."
        },
        cwe: "CWE-287",
        severity: "High",
        cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        references: ["https://owasp.org/www-project-top-ten/2017/A2_2017-Broken_Authentication"],
        tags: ["Web", "Authentication"],
        affectedComponents_en: `### Affected Components
- [TODO: Specify the affected login forms, API endpoints, or session management components.]`,
        details_en: `### Proof of Concept
[TODO: Provide a detailed PoC, demonstrating credential stuffing, session hijacking, or password recovery bypass.]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Especificar los formularios de inicio de sesión, endpoints de API o componentes de gestión de sesión afectados.]`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar una PoC detallada, demostrando el relleno de credenciales, el secuestro de sesión o el bypass de la recuperación de contraseña.]`,
    },
    {
        id: "vuln-web-004",
        title_en: "Sensitive Data Exposure",
        title_es: "Exposición de Datos Sensibles",
        overview_en: `### Overview
This vulnerability occurs when an application fails to adequately protect sensitive information such as financial data, healthcare records, or Personally Identifiable Information (PII). Attackers may steal or modify such weakly protected data to conduct credit card fraud, identity theft, or other crimes.`,
        overview_es: `### Resumen
Esta vulnerabilidad ocurre cuando una aplicación no protege adecuadamente la información sensible como datos financieros, registros de salud o Información de Identificación Personal (PII). Los atacantes pueden robar o modificar dichos datos débilmente protegidos para cometer fraudes con tarjetas de crédito, robo de identidad u otros delitos.`,
        technicalDescription_en: `### Technical Description
Sensitive data can be exposed in transit or at rest. This often happens due to the lack of encryption, weak cryptographic algorithms, flawed key management, or insecure data storage. For example, storing passwords in plaintext, transmitting data over unencrypted HTTP, or using outdated TLS protocols.`,
        technicalDescription_es: `### Descripción Técnica
Los datos sensibles pueden exponerse en tránsito o en reposo. Esto a menudo sucede debido a la falta de cifrado, algoritmos criptográficos débiles, gestión de claves defectuosa o almacenamiento de datos inseguro. Por ejemplo, almacenar contraseñas en texto plano, transmitir datos a través de HTTP sin cifrar o usar protocolos TLS obsoletos.`,
        impact_en: `### Impact
The impact of sensitive data exposure can be severe, leading to significant financial losses, reputational damage, and regulatory fines (e.g., under GDPR, CCPA). It can compromise the privacy of users and expose the organization to legal liability.`,
        impact_es: `### Impacto
El impacto de la exposición de datos sensibles puede ser severo, lo que lleva a pérdidas financieras significativas, daño a la reputación y multas regulatorias (por ejemplo, bajo GDPR, CCPA). Puede comprometer la privacidad de los usuarios y exponer a la organización a responsabilidad legal.`,
        remediation_en: {
            shortTerm: "Identify all sensitive data and apply strong encryption both at rest and in transit (e.g., TLS 1.2+). Disable caching for responses that contain sensitive data.",
            mediumTerm: "Implement a data classification policy. Use strong, industry-standard encryption algorithms and protocols. Ensure proper key management and rotation.",
            longTerm: "Minimize the collection and storage of sensitive data. Conduct regular data discovery and classification exercises to ensure no sensitive data is being stored improperly."
        },
        remediation_es: {
            shortTerm: "Identificar todos los datos sensibles y aplicar un cifrado fuerte tanto en reposo como en tránsito (p. ej., TLS 1.2+). Deshabilitar el almacenamiento en caché para las respuestas que contienen datos sensibles.",
            mediumTerm: "Implementar una política de clasificación de datos. Utilizar algoritmos y protocolos de cifrado fuertes y estándar de la industria. Asegurar una gestión y rotación de claves adecuadas.",
            longTerm: "Minimizar la recopilación y el almacenamiento de datos sensibles. Realizar ejercicios regulares de descubrimiento y clasificación de datos para garantizar que no se almacenen datos sensibles de forma incorrecta."
        },
        cwe: "CWE-312",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        references: ["https://owasp.org/Top10/A02_2021-Cryptographic_Failures/"],
        tags: ["Web", "Cryptography"],
        affectedComponents_en: `### Affected Components
- [TODO: Specify where sensitive data is stored or transmitted insecurely.]`,
        details_en: `### Proof of Concept
[TODO: Provide evidence of the exposed data, e.g., screenshots of plaintext passwords in the database or unencrypted traffic.]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Especificar dónde se almacenan o transmiten los datos sensibles de forma insegura.]`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar evidencia de los datos expuestos, p. ej., capturas de pantalla de contraseñas en texto plano en la base de datos o tráfico sin cifrar.]`,
    },
     {
        id: "vuln-web-005",
        title_en: "XML External Entities (XXE)",
        title_es: "Entidades Externas XML (XXE)",
        overview_en: `### Overview
An XML External Entity (XXE) attack is a type of attack against an application that parses XML input. This attack occurs when XML input containing a reference to an external entity is processed by a weakly configured XML parser.`,
        overview_es: `### Resumen
Un ataque de Entidad Externa XML (XXE) es un tipo de ataque contra una aplicación que procesa entradas XML. Este ataque ocurre cuando una entrada XML que contiene una referencia a una entidad externa es procesada por un analizador XML débilmente configurado.`,
        technicalDescription_en: `### Technical Description
Many older XML processors allow the specification of external entities in the XML document's DTD. An attacker can craft a malicious XML file that defines an external entity pointing to a local file on the server (e.g., \`/etc/passwd\`) or an internal network resource. When the parser processes this XML, it includes the content of the external entity, which can then be exfiltrated.`,
        technicalDescription_es: `### Descripción Técnica
Muchos procesadores XML antiguos permiten la especificación de entidades externas en el DTD del documento XML. Un atacante puede crear un archivo XML malicioso que define una entidad externa que apunta a un archivo local en el servidor (p. ej., \`/etc/passwd\`) o a un recurso de red interno. Cuando el analizador procesa este XML, incluye el contenido de la entidad externa, que luego puede ser exfiltrado.`,
        impact_en: `### Impact
XXE can lead to the disclosure of confidential data, denial of service (DoS), server-side request forgery (SSRF), and port scanning from the perspective of the machine where the parser is located.`,
        impact_es: `### Impacto
XXE puede llevar a la divulgación de datos confidenciales, denegación de servicio (DoS), falsificación de solicitudes del lado del servidor (SSRF) y escaneo de puertos desde la perspectiva de la máquina donde se encuentra el analizador.`,
        remediation_en: {
            shortTerm: "Disable DTDs (Document Type Definitions) and external entities in all XML parsers in the application. This is the most effective and simplest way to prevent XXE.",
            mediumTerm: "Upgrade XML processors and libraries to the latest versions. Use less complex data formats like JSON where possible.",
            longTerm: "Implement server-side input validation and filtering to prevent hostile data within XML documents. Use a Web Application Firewall (WAF) with rules to detect and block XXE attacks."
        },
        remediation_es: {
            shortTerm: "Deshabilitar los DTDs (Definiciones de Tipo de Documento) y las entidades externas en todos los analizadores XML de la aplicación. Esta es la forma más efectiva y sencilla de prevenir XXE.",
            mediumTerm: "Actualizar los procesadores y bibliotecas XML a las últimas versiones. Usar formatos de datos menos complejos como JSON cuando sea posible.",
            longTerm: "Implementar validación y filtrado de entradas del lado del servidor para evitar datos hostiles dentro de los documentos XML. Usar un Web Application Firewall (WAF) con reglas para detectar y bloquear ataques XXE."
        },
        cwe: "CWE-611",
        severity: "High",
        cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        references: ["https://owasp.org/www-community/vulnerabilities/XML_External_Entity_(XXE)_Processing"],
        tags: ["Web"],
        affectedComponents_en: `### Affected Components
- [TODO: Specify the functionality that processes XML input, e.g., file upload features.]`,
        details_en: `### Proof of Concept
[TODO: Provide a malicious XML file and show the resulting information disclosure or DoS.]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Especificar la funcionalidad que procesa entradas XML, p. ej., funciones de carga de archivos.]`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar un archivo XML malicioso y mostrar la divulgación de información o el DoS resultante.]`,
    },
    {
        id: "vuln-web-006",
        title_en: "Broken Access Control",
        title_es: "Control de Acceso Roto",
        overview_en: `### Overview
Access control enforces policy such that users cannot act outside of their intended permissions. Failures typically lead to unauthorized information disclosure, modification, or destruction of all data or performing a business function outside the user's limits.`,
        overview_es: `### Resumen
El control de acceso impone políticas para que los usuarios no puedan actuar fuera de sus permisos previstos. Las fallas generalmente conducen a la divulgación, modificación o destrucción no autorizada de todos los datos o a la realización de una función comercial fuera de los límites del usuario.`,
        technicalDescription_en: `### Technical Description
This vulnerability arises when restrictions on what authenticated users are allowed to do are not properly enforced. Attackers can exploit these flaws to access other users' accounts, view sensitive files, or use privileged functions. Examples include insecure direct object references (IDOR), path traversal, and privilege escalation.`,
        technicalDescription_es: `### Descripción Técnica
Esta vulnerabilidad surge cuando las restricciones sobre lo que los usuarios autenticados pueden hacer no se aplican correctamente. Los atacantes pueden explotar estas fallas para acceder a las cuentas de otros usuarios, ver archivos sensibles o usar funciones privilegiadas. Los ejemplos incluyen referencias directas a objetos inseguras (IDOR), salto de directorios y escalada de privilegios.`,
        impact_en: `### Impact
Broken access control can lead to unauthorized access to data and functionality, potentially allowing attackers to take over a site, modify critical data, or perform unauthorized actions as other users.`,
        impact_es: `### Impacto
El control de acceso roto puede conducir al acceso no autorizado a datos y funcionalidades, permitiendo potencialmente a los atacantes tomar el control de un sitio, modificar datos críticos o realizar acciones no autorizadas como otros usuarios.`,
        remediation_en: {
            shortTerm: "Review and enforce access control on the server-side for every request. Use role-based access control (RBAC) mechanisms. Deny by default.",
            mediumTerm: "Implement a centralized access control mechanism that is used by all components of the application. Log access control failures and alert administrators.",
            longTerm: "Conduct a full review of access control logic. Implement the principle of least privilege, where users are only granted the minimum permissions necessary."
        },
        remediation_es: {
            shortTerm: "Revisar y aplicar el control de acceso en el lado del servidor para cada solicitud. Utilizar mecanismos de control de acceso basados en roles (RBAC). Denegar por defecto.",
            mediumTerm: "Implementar un mecanismo de control de acceso centralizado que sea utilizado por todos los componentes de la aplicación. Registrar las fallas de control de acceso y alertar a los administradores.",
            longTerm: "Realizar una revisión completa de la lógica de control de acceso. Implementar el principio de privilegio mínimo, donde a los usuarios solo se les otorgan los permisos mínimos necesarios."
        },
        cwe: "CWE-284",
        severity: "High",
        cvss: { score: 8.1, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "N" },
        references: ["https://owasp.org/Top10/A01_2021-Broken_Access_Control/"],
        tags: ["Web", "Authentication"],
        affectedComponents_en: `### Affected Components
- [TODO: Specify the functions or API endpoints with broken access control.]`,
        details_en: `### Proof of Concept
[TODO: Provide steps to reproduce, showing how a low-privileged user can access high-privilege resources.]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Especificar las funciones o endpoints de API con control de acceso roto.]`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar los pasos para reproducir, mostrando cómo un usuario con pocos privilegios puede acceder a recursos de altos privilegios.]`,
    },
    {
        id: "vuln-web-007",
        title_en: "Security Misconfiguration",
        title_es: "Configuración de Seguridad Incorrecta",
        overview_en: `### Overview
Security misconfiguration is the most commonly seen issue. This is commonly a result of insecure default configurations, incomplete or ad hoc configurations, open cloud storage, misconfigured HTTP headers, and verbose error messages containing sensitive information.`,
        overview_es: `### Resumen
La configuración de seguridad incorrecta es el problema más comúnmente visto. Esto es comúnmente el resultado de configuraciones predeterminadas inseguras, configuraciones incompletas o ad hoc, almacenamiento en la nube abierto, encabezados HTTP mal configurados y mensajes de error detallados que contienen información sensible.`,
        technicalDescription_en: `### Technical Description
This vulnerability can occur at any level of the application stack, including the network services, platform, web server, application server, database, and custom code. Examples include running software with unnecessary features enabled (e.g., directory listing on a web server), not changing default credentials, or having overly permissive cloud storage permissions.`,
        technicalDescription_es: `### Descripción Técnica
Esta vulnerabilidad puede ocurrir en cualquier nivel de la pila de aplicaciones, incluidos los servicios de red, la plataforma, el servidor web, el servidor de aplicaciones, la base de datos y el código personalizado. Los ejemplos incluyen la ejecución de software con funciones innecesarias habilitadas (p. ej., listado de directorios en un servidor web), no cambiar las credenciales predeterminadas o tener permisos de almacenamiento en la nube demasiado permisivos.`,
        impact_en: `### Impact
Security misconfiguration can lead to a wide range of impacts, from information disclosure to a full system compromise, depending on the nature of the misconfiguration.`,
        impact_es: `### Impacto
La configuración de seguridad incorrecta puede tener una amplia gama de impactos, desde la divulgación de información hasta el compromiso total del sistema, dependiendo de la naturaleza de la configuración incorrecta.`,
        remediation_en: {
            shortTerm: "Review and harden configurations for all parts of the application stack. Implement security headers like Content Security Policy (CSP). Disable unnecessary features and services.",
            mediumTerm: "Develop a repeatable hardening process that is fast and easy to deploy. Automate the process of verifying configurations in different environments.",
            longTerm: "Implement a secure configuration lifecycle. Regularly scan and audit configurations for misconfigurations. Use automated tools to enforce secure baselines."
        },
        remediation_es: {
            shortTerm: "Revisar y fortalecer las configuraciones para todas las partes de la pila de aplicaciones. Implementar encabezados de seguridad como la Política de Seguridad de Contenido (CSP). Deshabilitar funciones y servicios innecesarios.",
            mediumTerm: "Desarrollar un proceso de fortalecimiento repetible que sea rápido y fácil de implementar. Automatizar el proceso de verificación de configuraciones en diferentes entornos.",
            longTerm: "Implementar un ciclo de vida de configuración seguro. Escanear y auditar regularmente las configuraciones en busca de errores. Usar herramientas automatizadas para hacer cumplir las líneas de base seguras."
        },
        cwe: "CWE-16",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        references: ["https://owasp.org/Top10/A05_2021-Security_Misconfiguration/"],
        tags: ["Web", "Infrastructure"],
        affectedComponents_en: `### Affected Components
- [TODO: List the misconfigured components, services, or servers.]`,
        details_en: `### Proof of Concept
[TODO: Provide evidence of the misconfiguration, e.g., screenshot of directory listing, default admin page, or verbose error message.]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Listar los componentes, servicios o servidores mal configurados.]`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar evidencia de la configuración incorrecta, p. ej., captura de pantalla del listado de directorios, página de administración predeterminada o mensaje de error detallado.]`,
    },
    {
        id: "vuln-web-008",
        title_en: "Cross-Site Request Forgery (CSRF)",
        title_es: "Falsificación de Solicitudes en Sitios Cruzados (CSRF)",
        overview_en: `### Overview
Cross-Site Request Forgery (CSRF) is an attack that forces an end user to execute unwanted actions on a web application in which they're currently authenticated.`,
        overview_es: `### Resumen
La Falsificación de Solicitudes en Sitios Cruzados (CSRF) es un ataque que obliga a un usuario final a ejecutar acciones no deseadas en una aplicación web en la que está autenticado actualmente.`,
        technicalDescription_en: `### Technical Description
The attack works by including a link or script in a page that accesses a site to which the user is known to have been authenticated. For example, an attacker can embed a malicious image tag \`<img src="http://bank.com/transfer?to=attacker&amount=1000">\`. If the user is logged into bank.com, their browser will automatically include their session cookie, and the transfer will be executed without their knowledge.`,
        technicalDescription_es: `### Descripción Técnica
El ataque funciona incluyendo un enlace o script en una página que accede a un sitio en el que se sabe que el usuario ha sido autenticado. Por ejemplo, un atacante puede incrustar una etiqueta de imagen maliciosa \`<img src="http://banco.com/transferir?a=atacante&cantidad=1000">\`. Si el usuario ha iniciado sesión en banco.com, su navegador incluirá automáticamente su cookie de sesión y la transferencia se ejecutará sin su conocimiento.`,
        impact_en: `### Impact
A successful CSRF attack can force the user to perform state-changing requests like transferring funds, changing their email address, or purchasing an item.`,
        impact_es: `### Impacto
Un ataque CSRF exitoso puede obligar al usuario a realizar solicitudes que cambian el estado, como transferir fondos, cambiar su dirección de correo electrónico o comprar un artículo.`,
        remediation_en: {
            shortTerm: "Implement anti-CSRF tokens (synchronizer token pattern) for all state-changing requests. Verify the `Origin` or `Referer` header.",
            mediumTerm: "Use the SameSite cookie attribute, setting it to `Strict` or `Lax`.",
            longTerm: "Ensure the application framework has built-in CSRF protection and that it is enabled and configured correctly. For APIs, consider using token-based authentication (e.g., JWT) instead of cookies."
        },
        remediation_es: {
            shortTerm: "Implementar tokens anti-CSRF (patrón de token sincronizador) para todas las solicitudes que cambian el estado. Verificar el encabezado `Origin` o `Referer`.",
            mediumTerm: "Usar el atributo de cookie SameSite, configurándolo en `Strict` o `Lax`.",
            longTerm: "Asegurarse de que el framework de la aplicación tenga protección CSRF incorporada y que esté habilitada y configurada correctamente. Para las API, considerar el uso de autenticación basada en tokens (p. ej., JWT) en lugar de cookies."
        },
        cwe: "CWE-352",
        severity: "High",
        cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        references: ["https://owasp.org/www-community/attacks/csrf"],
        tags: ["Web"],
        affectedComponents_en: `### Affected Components
- [TODO: List the forms or actions vulnerable to CSRF.]`,
        details_en: `### Proof of Concept
[TODO: Provide a CSRF HTML PoC file and demonstrate the unauthorized action being performed.]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Listar los formularios o acciones vulnerables a CSRF.]`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar un archivo HTML de PoC de CSRF y demostrar que se realiza la acción no autorizada.]`,
    },
    {
        id: "vuln-web-009",
        title_en: "Insecure Deserialization",
        title_es: "Deserialización Insegura",
        overview_en: `### Overview
Insecure deserialization is a vulnerability which occurs when untrusted data is used to abuse the logic of an application, inflict a denial-of-service (DoS) attack, or even execute arbitrary code upon it being deserialized.`,
        overview_es: `### Resumen
La deserialización insegura es una vulnerabilidad que ocurre cuando se utilizan datos no confiables para abusar de la lógica de una aplicación, infligir un ataque de denegación de servicio (DoS) o incluso ejecutar código arbitrario al ser deserializados.`,
        technicalDescription_en: `### Technical Description
The vulnerability happens when an application deserializes data from an untrusted source (e.g., a cookie or a user-submitted form) without proper validation. An attacker can manipulate the serialized object to inject malicious code or trigger unexpected behavior in the application's logic, a practice known as a 'property-oriented programming' (POP) attack.`,
        technicalDescription_es: `### Descripción Técnica
La vulnerabilidad ocurre cuando una aplicación deserializa datos de una fuente no confiable (p. ej., una cookie o un formulario enviado por el usuario) sin una validación adecuada. Un atacante puede manipular el objeto serializado para inyectar código malicioso o desencadenar un comportamiento inesperado en la lógica de la aplicación, una práctica conocida como ataque de 'programación orientada a propiedades' (POP).`,
        impact_en: `### Impact
The impact can range from denial-of-service to arbitrary code execution, which can lead to a full system compromise. It can also be used to bypass authentication and access controls.`,
        impact_es: `### Impacto
El impacto puede variar desde la denegación de servicio hasta la ejecución de código arbitrario, lo que puede llevar a un compromiso total del sistema. También se puede utilizar para eludir la autenticación y los controles de acceso.`,
        remediation_en: {
            shortTerm: "Avoid deserializing data from untrusted sources. If necessary, implement strict type checking and validation before deserialization.",
            mediumTerm: "Use data formats that are not vulnerable to deserialization attacks, such as JSON, and avoid using complex native serialization formats.",
            longTerm: "Integrate integrity checks like digital signatures on any serialized data to prevent tampering. Isolate the deserialization code in a low-privilege environment."
        },
        remediation_es: {
            shortTerm: "Evitar deserializar datos de fuentes no confiables. Si es necesario, implementar una comprobación y validación de tipos estricta antes de la deserialización.",
            mediumTerm: "Utilizar formatos de datos que no sean vulnerables a ataques de deserialización, como JSON, y evitar el uso de formatos de serialización nativos complejos.",
            longTerm: "Integrar comprobaciones de integridad como firmas digitales en cualquier dato serializado para evitar la manipulación. Aislar el código de deserialización en un entorno de bajos privilegios."
        },
        cwe: "CWE-502",
        severity: "Critical",
        cvss: { score: 9.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        references: ["https://owasp.org/Top10/A08_2021-Software_and_Data_Integrity_Failures/"],
        tags: ["Web"],
        affectedComponents_en: `### Affected Components
- [TODO: Specify the function or parameter that accepts serialized data.]`,
        details_en: `### Proof of Concept
[TODO: Provide a serialized payload that, when processed, leads to code execution or another malicious outcome.]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Especificar la función o el parámetro que acepta datos serializados.]`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar una carga útil serializada que, cuando se procesa, conduce a la ejecución de código u otro resultado malicioso.]`,
    },
    {
        id: "vuln-web-010",
        title_en: "Server-Side Request Forgery (SSRF)",
        title_es: "Falsificación de Solicitudes del Lado del Servidor (SSRF)",
        overview_en: `### Overview
Server-Side Request Forgery (SSRF) is a web security vulnerability that allows an attacker to induce the server-side application to make HTTP requests to an arbitrary domain of the attacker's choosing.`,
        overview_es: `### Resumen
La Falsificación de Solicitudes del Lado del Servidor (SSRF) es una vulnerabilidad de seguridad web que permite a un atacante inducir a la aplicación del lado del servidor a realizar solicitudes HTTP a un dominio arbitrario elegido por el atacante.`,
        technicalDescription_en: `### Technical Description
The vulnerability occurs when an application fetches a remote resource based on user-supplied input without proper validation. An attacker can supply URLs pointing to internal services within the organization's infrastructure (e.g., \`http://127.0.0.1/admin\`) or to cloud provider metadata endpoints (e.g., \`http://169.254.169.254/\`).`,
        technicalDescription_es: `### Descripción Técnica
La vulnerabilidad ocurre cuando una aplicación obtiene un recurso remoto basado en una entrada proporcionada por el usuario sin la validación adecuada. Un atacante puede proporcionar URL que apuntan a servicios internos dentro de la infraestructura de la organización (p. ej., \`http://127.0.0.1/admin\`) o a puntos de conexión de metadatos de proveedores de la nube (p. ej., \`http://169.254.169.254/\`).`,
        impact_en: `### Impact
A successful SSRF attack can lead to the scanning of internal networks, unauthorized access to internal services, information disclosure, and remote code execution on internal systems.`,
        impact_es: `### Impacto
Un ataque SSRF exitoso puede llevar al escaneo de redes internas, acceso no autorizado a servicios internos, divulgación de información y ejecución remota de código en sistemas internos.`,
        remediation_en: {
            shortTerm: "Implement a strict allow-list of domains and protocols that the application is allowed to request. Deny all other requests.",
            mediumTerm: "Validate all user-supplied input to ensure it conforms to the expected format and values. Do not send raw responses from the server back to the client.",
            longTerm: "Isolate the functionality that makes external requests in a separate, low-privilege network environment. This limits the impact of a potential SSRF vulnerability."
        },
        remediation_es: {
            shortTerm: "Implementar una lista blanca estricta de dominios y protocolos que la aplicación tiene permitido solicitar. Denegar todas las demás solicitudes.",
            mediumTerm: "Validar todas las entradas proporcionadas por el usuario para asegurarse de que se ajustan al formato y los valores esperados. No enviar respuestas sin procesar del servidor al cliente.",
            longTerm: "Aislar la funcionalidad que realiza solicitudes externas en un entorno de red separado y de bajos privilegios. Esto limita el impacto de una posible vulnerabilidad SSRF."
        },
        cwe: "CWE-918",
        severity: "High",
        cvss: { score: 9.0, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:C/C:H/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "C", confidentiality: "H", integrity: "L", availability: "N" },
        references: ["https://owasp.org/Top10/A10_2021-Server-Side_Request_Forgery_(SSRF)/"],
        tags: ["Web"],
        affectedComponents_en: `### Affected Components
- [TODO: Specify the functionality that makes server-side requests based on user input, e.g., a URL preview generator.]`,
        details_en: `### Proof of Concept
[TODO: Provide a payload that demonstrates making a request to an internal or restricted resource, and show the server's response.]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Especificar la funcionalidad que realiza solicitudes del lado del servidor basadas en la entrada del usuario, p. ej., un generador de vista previa de URL.]`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar una carga útil que demuestre cómo realizar una solicitud a un recurso interno o restringido y mostrar la respuesta del servidor.]`,
    },
    // ... More vulnerabilities will be added here
    // The following is a placeholder for the rest of the 100 vulnerabilities.
    // The full list will be generated in the final response.
     {
        id: "vuln-web-011",
        title_en: "HTTP Verb Tampering",
        title_es: "Manipulación de Verbos HTTP",
        overview_en: `### Overview
HTTP Verb Tampering exploits relaxed parsing of HTTP methods to bypass access controls. For example, an application might enforce strict controls for POST requests but be permissive for GET requests to the same endpoint.`,
        overview_es: `### Resumen
La manipulación de verbos HTTP explota el análisis relajado de los métodos HTTP para eludir los controles de acceso. Por ejemplo, una aplicación puede aplicar controles estrictos para las solicitudes POST pero ser permisiva para las solicitudes GET en el mismo punto de conexión.`,
        technicalDescription_en: `### Technical Description
An attacker can switch the HTTP method (e.g., from POST to GET) to access resources or perform actions that would otherwise be restricted. This is often possible when access control logic is only tied to a specific HTTP verb.`,
        technicalDescription_es: `### Descripción Técnica
Un atacante puede cambiar el método HTTP (p. ej., de POST a GET) para acceder a recursos o realizar acciones que de otro modo estarían restringidas. Esto suele ser posible cuando la lógica de control de acceso solo está vinculada a un verbo HTTP específico.`,
        impact_en: `### Impact
This can lead to bypassing authentication, privilege escalation, or unauthorized execution of sensitive operations.`,
        impact_es: `### Impacto
Esto puede conducir a la omisión de la autenticación, la escalada de privilegios o la ejecución no autorizada de operaciones sensibles.`,
        remediation_en: {
            shortTerm: "Enforce strict, default-deny access control for all endpoints, regardless of the HTTP verb used.",
            mediumTerm: "Use a framework that correctly maps actions to specific HTTP verbs and enforces this mapping.",
            longTerm: "Implement a centralized and robust access control mechanism that is verb-agnostic."
        },
        remediation_es: {
            shortTerm: "Aplicar un control de acceso estricto y de denegación por defecto para todos los puntos de conexión, independientemente del verbo HTTP utilizado.",
            mediumTerm: "Usar un framework que mapee correctamente las acciones a verbos HTTP específicos y haga cumplir este mapeo.",
            longTerm: "Implementar un mecanismo de control de acceso centralizado y robusto que sea independiente del verbo."
        },
        cwe: "CWE-346",
        severity: "Medium",
        cvss: { score: 6.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:L/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "L", availability: "N" },
        references: ["https://owasp.org/www-project-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/01-Testing_for_HTTP_Verb_Tampering"],
        tags: ["Web"],
        affectedComponents_en: `### Affected Components
- [TODO: List endpoints vulnerable to verb tampering.]`,
        details_en: `### Proof of Concept
[TODO: Show a request with a tampered verb (e.g., GET instead of POST) that successfully bypasses access controls.]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Listar los puntos de conexión vulnerables a la manipulación de verbos.]`,
        details_es: `### Prueba de Concepto
[TODO: Mostrar una solicitud con un verbo manipulado (p. ej., GET en lugar de POST) que elude con éxito los controles de acceso.]`,
    },
    {
        id: "vuln-web-012",
        title_en: "Local File Inclusion (LFI)",
        title_es: "Inclusión de Archivos Locales (LFI)",
        overview_en: `### Overview
Local File Inclusion (LFI) is a vulnerability where an attacker is able to include a file, usually exploiting a "dynamic file inclusion" mechanisms implemented in the web application.`,
        overview_es: `### Resumen
La Inclusión de Archivos Locales (LFI) es una vulnerabilidad en la que un atacante puede incluir un archivo, generalmente explotando un mecanismo de "inclusión dinámica de archivos" implementado en la aplicación web.`,
        technicalDescription_en: `### Technical Description
The vulnerability occurs when a page receives as input the path to the file that has to be included and the input is not properly sanitized, allowing directory traversal characters (e.g., \`../\`) to be injected.`,
        technicalDescription_es: `### Descripción Técnica
La vulnerabilidad ocurre cuando una página recibe como entrada la ruta del archivo que se debe incluir y la entrada no se sanea correctamente, lo que permite inyectar caracteres de salto de directorio (p. ej., \`../\`).`,
        impact_en: `### Impact
LFI can lead to information disclosure, remote code execution, and denial of service. Attackers can read sensitive files like \`/etc/passwd\` or application source code.`,
        impact_es: `### Impacto
LFI puede conducir a la divulgación de información, ejecución remota de código y denegación de servicio. Los atacantes pueden leer archivos sensibles como \`/etc/passwd\` o el código fuente de la aplicación.`,
        remediation_en: {
            shortTerm: "Validate user input against a strict allow-list of acceptable file names and paths.",
            mediumTerm: "Avoid passing user-supplied input to filesystem APIs. If unavoidable, use a mapping to safe, pre-defined file paths.",
            longTerm: "Run the application in a sandboxed or chrooted environment to limit the impact of a potential LFI."
        },
        remediation_es: {
            shortTerm: "Validar la entrada del usuario contra una lista blanca estricta de nombres y rutas de archivo aceptables.",
            mediumTerm: "Evitar pasar la entrada proporcionada por el usuario a las API del sistema de archivos. Si es inevitable, usar un mapeo a rutas de archivo seguras y predefinidas.",
            longTerm: "Ejecutar la aplicación en un entorno aislado o chroot para limitar el impacto de un posible LFI."
        },
        cwe: "CWE-98",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        references: ["https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/11.1-Testing_for_Local_File_Inclusion"],
        tags: ["Web"],
        affectedComponents_en: `### Affected Components
- [TODO: Specify the parameter and URL vulnerable to LFI.]`,
        details_en: `### Proof of Concept
[TODO: Show a request with a payload like \`../../../../etc/passwd\` and the resulting file content being displayed.]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Especificar el parámetro y la URL vulnerables a LFI.]`,
        details_es: `### Prueba de Concepto
[TODO: Mostrar una solicitud con una carga útil como \`../../../../etc/passwd\` y el contenido del archivo resultante que se muestra.]`,
    },
    {
        id: "vuln-web-013",
        title_en: "SSRF to Local File Read",
        title_es: "SSRF para Lectura de Archivos Locales",
        overview_en: `### Overview
A specific type of SSRF attack where the vulnerability can be leveraged to read arbitrary local files on the server by using the \`file://\` URI scheme.`,
        overview_es: `### Resumen
Un tipo específico de ataque SSRF donde la vulnerabilidad se puede aprovechar para leer archivos locales arbitrarios en el servidor mediante el uso del esquema URI \`file://\`.`,
        technicalDescription_en: `### Technical Description
If an application performs requests based on user input and allows the \`file://\` scheme, an attacker can provide a payload like \`file:///etc/passwd\` to trick the application into reading and returning the content of that local file.`,
        technicalDescription_es: `### Descripción Técnica
Si una aplicación realiza solicitudes basadas en la entrada del usuario y permite el esquema \`file://\`, un atacante puede proporcionar una carga útil como \`file:///etc/passwd\` para engañar a la aplicación para que lea y devuelva el contenido de ese archivo local.`,
        impact_en: `### Impact
This leads to the disclosure of sensitive files on the server, including configuration files, source code, and system files.`,
        impact_es: `### Impacto
Esto conduce a la divulgación de archivos sensibles en el servidor, incluidos archivos de configuración, código fuente y archivos del sistema.`,
        remediation_en: {
            shortTerm: "Strictly disallow the `file://` URI scheme in all functions that make server-side requests.",
            mediumTerm: "Implement a robust URI parser that validates and restricts protocols to an allow-list (e.g., only HTTP and HTTPS).",
            longTerm: "Run the application with the minimum necessary file system permissions to limit the files it can access."
        },
        remediation_es: {
            shortTerm: "Desautorizar estrictamente el esquema URI `file://` en todas las funciones que realizan solicitudes del lado del servidor.",
            mediumTerm: "Implementar un analizador de URI robusto que valide y restrinja los protocolos a una lista de permitidos (p. ej., solo HTTP y HTTPS).",
            longTerm: "Ejecutar la aplicación con los permisos mínimos necesarios del sistema de archivos para limitar los archivos a los que puede acceder."
        },
        cwe: "CWE-918",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        references: ["https://owasp.org/Top10/A10_2021-Server-Side_Request_Forgery_(SSRF)/"],
        tags: ["Web", "SSRF"],
        affectedComponents_en: `### Affected Components
- [TODO: Specify the functionality vulnerable to SSRF with file:// scheme.]`,
        details_en: `### Proof of Concept
[TODO: Provide a request using a \`file://\` payload and show the content of a local file in the response.]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Especificar la funcionalidad vulnerable a SSRF con el esquema file://.]`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar una solicitud utilizando una carga útil \`file://\` y mostrar el contenido de un archivo local en la respuesta.]`,
    },
     {
        id: "vuln-mobile-001",
        title_en: "Insecure Data Storage",
        title_es: "Almacenamiento Inseguro de Datos",
        overview_en: `### Overview
This vulnerability occurs when sensitive data is stored on the mobile device without adequate protection, making it accessible to other applications or to an attacker with physical access to the device.`,
        overview_es: `### Resumen
Esta vulnerabilidad ocurre cuando se almacenan datos sensibles en el dispositivo móvil sin la protección adecuada, haciéndolos accesibles para otras aplicaciones o para un atacante con acceso físico al dispositivo.`,
        technicalDescription_en: `### Technical Description
Sensitive information such as passwords, API keys, or personal user data is stored in insecure locations like SharedPreferences, plist files, SQLite databases, or external storage without encryption. An attacker on a rooted or jailbroken device can easily extract this data.`,
        technicalDescription_es: `### Descripción Técnica
Información sensible como contraseñas, claves de API o datos personales del usuario se almacena en ubicaciones inseguras como SharedPreferences, archivos plist, bases de datos SQLite o almacenamiento externo sin cifrar. Un atacante en un dispositivo rooteado o con jailbreak puede extraer fácilmente estos datos.`,
        impact_en: `### Impact
Leads to the compromise of user credentials, session tokens, and other sensitive data, which can result in account takeover, identity theft, and other fraudulent activities.`,
        impact_es: `### Impacto
Conduce al compromiso de credenciales de usuario, tokens de sesión y otros datos sensibles, lo que puede resultar en la toma de control de cuentas, robo de identidad y otras actividades fraudulentas.`,
        remediation_en: {
            shortTerm: "Immediately encrypt all sensitive data before storing it on the device. Use platform-provided secure storage mechanisms like Android's EncryptedSharedPreferences or iOS's Keychain.",
            mediumTerm: "Develop a data classification policy for the mobile app to identify what data is sensitive and requires encryption. Avoid storing sensitive data on the device whenever possible.",
            longTerm: "Implement a secure data management lifecycle for the mobile app, including secure storage, transmission, and deletion of data. Conduct regular security audits of the app's data storage practices."
        },
        remediation_es: {
            shortTerm: "Cifrar inmediatamente todos los datos sensibles antes de almacenarlos en el dispositivo. Utilizar los mecanismos de almacenamiento seguro proporcionados por la plataforma, como EncryptedSharedPreferences de Android o el Llavero (Keychain) de iOS.",
            mediumTerm: "Desarrollar una política de clasificación de datos para la aplicación móvil para identificar qué datos son sensibles y requieren cifrado. Evitar almacenar datos sensibles en el dispositivo siempre que sea posible.",
            longTerm: "Implementar un ciclo de vida de gestión de datos seguro para la aplicación móvil, que incluya almacenamiento, transmisión y eliminación seguros de los datos. Realizar auditorías de seguridad periódicas de las prácticas de almacenamiento de datos de la aplicación."
        },
        cwe: "CWE-922",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N", attackVector: "L", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        references: ["https://owasp.org/www-project-mobile-top-10/2024-risks/m10-insecure-data-storage"],
        tags: ["Mobile"],
        affectedComponents_en: `### Affected Components
- [TODO: List the files or databases where data is stored insecurely (e.g., SharedPreferences file, SQLite DB).]`,
        details_en: `### Proof of Concept
[TODO: Provide steps to extract the insecurely stored data from a test device (e.g., using ADB or file system explorers).]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Listar los archivos o bases de datos donde los datos se almacenan de forma insegura (p. ej., archivo SharedPreferences, BD SQLite).]`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar los pasos para extraer los datos almacenados de forma insegura de un dispositivo de prueba (p. ej., usando ADB o exploradores de sistema de archivos).]`,
    }
];
