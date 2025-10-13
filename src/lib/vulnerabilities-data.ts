
import type { Vulnerability } from './types';

export const initialVulnerabilities: Vulnerability[] = [
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
        immediateActions_en: "### Immediate Actions\nDeploy a Web Application Firewall (WAF) with rules to block common SQLi patterns. Identify and temporarily disable the vulnerable functionality if possible.",
        immediateActions_es: "### Acciones Inmediatas\nDesplegar un Web Application Firewall (WAF) con reglas para bloquear patrones comunes de SQLi. Identificar y deshabilitar temporalmente la funcionalidad vulnerable si es posible.",
        remediation_en: {
            shortTerm: "Refactor all database queries to use parameterized queries (also known as prepared statements). This is the most effective defense against SQLi as it separates the query logic from the data.",
            mediumTerm: "Implement least privilege access for database users. The application's database user should only have the minimum necessary permissions.",
            longTerm: "Conduct regular security training for developers on secure coding practices. Implement static (SAST) and dynamic (DAST) application security testing into the CI/CD pipeline to proactively identify and fix vulnerabilities."
        },
        remediation_es: {
            shortTerm: "Refactorizar todas las consultas a la base de datos para usar consultas parametrizadas (también conocidas como prepared statements). Esta es la defensa más efectiva contra SQLi ya que separa la lógica de la consulta de los datos.",
            mediumTerm: "Implementar el principio de privilegio mínimo para los usuarios de la base de datos. El usuario de la base de datos de la aplicación solo debe tener los permisos mínimos necesarios.",
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
The application does not properly sanitize user-supplied data before embedding it into HTML output. An attacker can inject a payload like \`<script>alert('XSS')</script>\`. When a victim's browser renders the page, it executes the script, which runs with the same permissions as the application itself.`,
        technicalDescription_es: `### Descripción Técnica
La aplicación no sanea correctamente los datos proporcionados por el usuario antes de incrustarlos en la salida HTML. Un atacante puede inyectar una carga útil como \`<script>alert('XSS')</script>\`. Cuando el navegador de una víctima renderiza la página, ejecuta el script, que se ejecuta con los mismos permisos que la propia aplicación.`,
        impact_en: `### Impact
XSS can lead to session hijacking, account takeover, redirection to malicious sites, or unauthorized actions on behalf of the user. In the context of an administrator, it could lead to full control of the web application.`,
        impact_es: `### Impacto
El XSS puede conducir al secuestro de sesiones, la toma de control de cuentas, la redirección a sitios maliciosos o la realización de acciones no autorizadas en nombre del usuario. En el contexto de un administrador, podría llevar al control total de la aplicación web.`,
        immediateActions_en: "### Immediate Actions\nImplement a strict Content Security Policy (CSP) as a defense-in-depth measure. Identify the most critical vulnerable inputs and apply immediate hotfixes to encode the output.",
        immediateActions_es: "### Acciones Inmediatas\nImplementar una Política de Seguridad de Contenido (CSP) estricta como medida de defensa en profundidad. Identificar las entradas vulnerables más críticas y aplicar parches inmediatos para codificar la salida.",
        remediation_en: {
            shortTerm: "Apply context-aware output encoding to all user-supplied data before it is rendered in the browser. For example, use HTML entity encoding for data placed in HTML context, and JavaScript encoding for data in script contexts.",
            mediumTerm: "Use modern web frameworks (like React, Angular, Vue) that have built-in protections against XSS. Avoid using dangerous functions like `innerHTML`.",
            longTerm: "Implement a security-focused design pattern where untrusted data is never mixed with executable code. Train developers to understand the different contexts of XSS and how to mitigate them."
        },
        remediation_es: {
            shortTerm: "Aplicar codificación de salida sensible al contexto a todos los datos proporcionados por el usuario antes de que se rendericen en el navegador. Por ejemplo, usar codificación de entidades HTML para datos en contexto HTML, y codificación de JavaScript para datos en contextos de script.",
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
        immediateActions_en: "### Immediate Actions\nImmediately invalidate all active user sessions to force re-authentication. Review logs for any signs of account takeover.",
        immediateActions_es: "### Acciones Inmediatas\nInvalidar inmediatamente todas las sesiones de usuario activas para forzar la re-autenticación. Revisar los registros en busca de signos de toma de control de cuentas.",
        remediation_en: {
            shortTerm: "Enforce strong password policies and implement rate limiting and account lockout mechanisms on login attempts. Ensure session tokens are invalidated on the server-side upon logout.",
            mediumTerm: "Implement Multi-Factor Authentication (MFA) for all users, especially for administrative accounts. Use a centralized and standardized session management mechanism.",
            longTerm: "Conduct a thorough review of the entire authentication and session management lifecycle. Use industry-standard frameworks and avoid creating custom authentication schemes."
        },
        remediation_es: {
            shortTerm: "Forzar políticas de contraseñas seguras e implementar limitación de velocidad y mecanismos de bloqueo de cuentas en los intentos de inicio de sesión. Asegurarse de que los tokens de sesión se invaliden en el lado del servidor al cerrar la sesión.",
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
        immediateActions_en: "### Immediate Actions\nImmediately identify all locations where sensitive data is exposed and restrict access. Rotate any exposed credentials, API keys, or tokens.",
        immediateActions_es: "### Acciones Inmediatas\nIdentificar inmediatamente todas las ubicaciones donde se exponen datos sensibles y restringir el acceso. Rotar cualquier credencial, clave de API o token expuesto.",
        remediation_en: {
            shortTerm: "Identify all sensitive data and apply strong encryption both at rest and in transit (e.g., using TLS 1.2+). Disable caching for responses that contain sensitive data.",
            mediumTerm: "Implement a data classification policy. Use strong, industry-standard encryption algorithms and protocols. Ensure proper key management and rotation.",
            longTerm: "Minimize the collection and storage of sensitive data. Conduct regular data discovery and classification exercises to ensure no sensitive data is being stored improperly."
        },
        remediation_es: {
            shortTerm: "Identificar todos los datos sensibles y aplicar un cifrado fuerte tanto en reposo como en tránsito (p. ej., usando TLS 1.2+). Deshabilitar el almacenamiento en caché para las respuestas que contienen datos sensibles.",
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
        immediateActions_en: "### Immediate Actions\nIdentify all XML parsers in the application. If possible, temporarily disable any functionality that processes XML from untrusted sources.",
        immediateActions_es: "### Acciones Inmediatas\nIdentificar todos los analizadores XML en la aplicación. Si es posible, deshabilitar temporalmente cualquier funcionalidad que procese XML de fuentes no confiables.",
        remediation_en: {
            shortTerm: "Disable DTDs (Document Type Definitions) and external entities in all XML parsers in the application. This is the most effective and simplest way to prevent XXE.",
            mediumTerm: "Upgrade XML processors and libraries to their latest versions. Use less complex data formats like JSON where possible.",
            longTerm: "Implement server-side input validation and filtering to prevent hostile data within XML documents. Use a Web Application Firewall (WAF) with rules to detect and block XXE attacks."
        },
        remediation_es: {
            shortTerm: "Deshabilitar los DTDs (Definiciones de Tipo de Documento) y las entidades externas en todos los analizadores XML de la aplicación. Esta es la forma más efectiva y sencilla de prevenir XXE.",
            mediumTerm: "Actualizar los procesadores y bibliotecas XML a sus últimas versiones. Usar formatos de datos menos complejos como JSON cuando sea posible.",
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
        immediateActions_en: "### Immediate Actions\nReview and audit access control rules for the most critical functionalities. Log all access control failures and set up alerts for repeated failures.",
        immediateActions_es: "### Acciones Inmediatas\nRevisar y auditar las reglas de control de acceso para las funcionalidades más críticas. Registrar todas las fallas de control de acceso y configurar alertas para fallas repetidas.",
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
        immediateActions_en: "### Immediate Actions\nReview and disable any unnecessary features (e.g., debug modes, directory listing). Change all default credentials immediately.",
        immediateActions_es: "### Acciones Inmediatas\nRevisar y deshabilitar cualquier característica innecesaria (p. ej., modos de depuración, listado de directorios). Cambiar todas las credenciales predeterminadas de inmediato.",
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
        immediateActions_en: "### Immediate Actions\nReview all state-changing forms and API endpoints to identify which ones lack CSRF protection. Prioritize fixing critical functions like password changes or fund transfers.",
        immediateActions_es: "### Acciones Inmediatas\nRevisar todos los formularios y puntos de conexión de API que cambian el estado para identificar cuáles carecen de protección CSRF. Priorizar la corrección de funciones críticas como cambios de contraseña o transferencias de fondos.",
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
        immediateActions_en: "### Immediate Actions\nIdentify all endpoints that accept serialized objects. If possible, disable these endpoints until a proper fix can be implemented.",
        immediateActions_es: "### Acciones Inmediatas\nIdentificar todos los puntos de conexión que aceptan objetos serializados. Si es posible, deshabilitar estos puntos de conexión hasta que se pueda implementar una solución adecuada.",
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
        immediateActions_en: "### Immediate Actions\nAdd network-level controls (firewall rules) to block outbound traffic from the application server to internal network ranges.",
        immediateActions_es: "### Acciones Inmediatas\nAgregar controles a nivel de red (reglas de firewall) para bloquear el tráfico saliente desde el servidor de aplicaciones hacia los rangos de la red interna.",
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
        immediateActions_en: "### Immediate Actions\nReview the web server configuration to ensure it does not allow unexpected HTTP verbs for sensitive endpoints. Implement logging to detect unusual HTTP method usage.",
        immediateActions_es: "### Acciones Inmediatas\nRevisar la configuración del servidor web para asegurarse de que no permite verbos HTTP inesperados para puntos de conexión sensibles. Implementar registros para detectar el uso inusual de métodos HTTP.",
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
        immediateActions_en: "### Immediate Actions\nImplement input validation to strip out directory traversal characters (`../`, `..\\`). Disable PHP wrappers like `php://filter` if not explicitly needed.",
        immediateActions_es: "### Acciones Inmediatas\nImplementar la validación de entradas para eliminar los caracteres de salto de directorio (`../`, `..\\`). Deshabilitar los wrappers de PHP como `php://filter` si no se necesitan explícitamente.",
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
        immediateActions_en: "### Immediate Actions\nDeploy a WAF rule or application-level filter to specifically block any user-supplied URLs that contain the `file://` protocol handler.",
        immediateActions_es: "### Acciones Inmediatas\nImplementar una regla de WAF o un filtro a nivel de aplicación para bloquear específicamente cualquier URL proporcionada por el usuario que contenga el manejador de protocolo `file://`.",
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
    // --- MOBILE VULNERABILITIES ---
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
        immediateActions_en: "### Immediate Actions\nPush an immediate update that migrates sensitive data from insecure storage to a secure alternative (e.g., iOS Keychain, Android Keystore). Invalidate any exposed tokens or credentials.",
        immediateActions_es: "### Acciones Inmediatas\nLanzar una actualización inmediata que migre los datos sensibles del almacenamiento inseguro a una alternativa segura (p. ej., Llavero de iOS, Keystore de Android). Invalidar cualquier token o credencial expuesta.",
        remediation_en: {
            shortTerm: "Encrypt all sensitive data before storing it on the device. Use platform-provided secure storage mechanisms like Android's EncryptedSharedPreferences or iOS's Keychain.",
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
        references: ["https://owasp.org/www-project-mobile-top-10/2016-risks/m2-insecure-data-storage/"],
        tags: ["Mobile"],
        affectedComponents_en: `### Affected Components
- [TODO: List the files or databases where data is stored insecurely (e.g., SharedPreferences file, SQLite DB).]`,
        details_en: `### Proof of Concept
[TODO: Provide steps to extract the insecurely stored data from a test device (e.g., using ADB or file system explorers).]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Listar los archivos o bases de datos donde los datos se almacenan de forma insegura (p. ej., archivo SharedPreferences, BD SQLite).]`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar los pasos para extraer los datos almacenados de forma insegura de un dispositivo de prueba (p. ej., usando ADB o exploradores de sistema de archivos).]`,
    },
    {
        id: "vuln-mobile-002",
        title_en: "Weak Server-Side Controls",
        title_es: "Controles Débiles en el Servidor",
        overview_en: `### Overview
This category covers security issues that result from a mobile app's reliance on server-side components. These are not flaws in the mobile app itself but in the backend APIs it communicates with.`,
        overview_es: `### Resumen
Esta categoría cubre problemas de seguridad que resultan de la dependencia de una aplicación móvil de componentes del lado del servidor. No son fallas en la aplicación móvil en sí, sino en las API de backend con las que se comunica.`,
        technicalDescription_en: `### Technical Description
Mobile applications are often clients to backend services. Flaws in these backend services, such as broken access control (IDOR), SQL injection, or business logic flaws, can be exploited through the mobile app's API requests. The mobile app becomes the attack vector for compromising the server.`,
        technicalDescription_es: `### Descripción Técnica
Las aplicaciones móviles suelen ser clientes de servicios de backend. Las fallas en estos servicios de backend, como el control de acceso roto (IDOR), la inyección de SQL o las fallas en la lógica de negocio, pueden explotarse a través de las solicitudes de API de la aplicación móvil. La aplicación móvil se convierte en el vector de ataque para comprometer el servidor.`,
        impact_en: `### Impact
The impact is equivalent to the corresponding web vulnerability being exploited. This can range from data disclosure to full system compromise of the backend infrastructure.`,
        impact_es: `### Impacto
El impacto es equivalente a la explotación de la vulnerabilidad web correspondiente. Esto puede variar desde la divulgación de datos hasta el compromiso total del sistema de la infraestructura de backend.`,
        immediateActions_en: "### Immediate Actions\nImplement emergency firewall rules to block malicious requests identified during testing. Invalidate sessions of any users who may have been compromised.",
        immediateActions_es: "### Acciones Inmediatas\nImplementar reglas de firewall de emergencia para bloquear las solicitudes maliciosas identificadas durante las pruebas. Invalidar las sesiones de los usuarios que puedan haber sido comprometidos.",
        remediation_en: {
            shortTerm: "Apply the same security best practices to mobile backend APIs as you would for a standard web application. This includes input validation, parameterized queries, and strong access control.",
            mediumTerm: "Implement API-specific security measures, such as rate limiting, request throttling, and robust authentication/authorization for all endpoints.",
            longTerm: "Design the backend API with a 'zero trust' model, assuming that any request from a mobile client could be malicious. Do not rely on client-side controls for security."
        },
        remediation_es: {
            shortTerm: "Aplicar las mismas mejores prácticas de seguridad a las API de backend móvil que se aplicarían a una aplicación web estándar. Esto incluye validación de entradas, consultas parametrizadas y un fuerte control de acceso.",
            mediumTerm: "Implementar medidas de seguridad específicas para la API, como limitación de velocidad, regulación de solicitudes y autenticación/autorización robustas para todos los puntos de conexión.",
            longTerm: "Diseñar la API de backend con un modelo de 'confianza cero', asumiendo que cualquier solicitud de un cliente móvil podría ser maliciosa. No depender de los controles del lado del cliente para la seguridad."
        },
        cwe: "CWE-602",
        severity: "High",
        cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        references: ["https://owasp.org/www-project-mobile-top-10/2016-risks/m10-extraneous-functionality/"],
        tags: ["Mobile", "API"],
        affectedComponents_en: `### Affected Components
- [TODO: List the vulnerable backend API endpoints.]`,
        details_en: `### Proof of Concept
[TODO: Provide the API request and response that demonstrates the server-side vulnerability.]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Listar los endpoints de la API de backend vulnerables.]`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar la solicitud y respuesta de la API que demuestra la vulnerabilidad del lado del servidor.]`,
    },
    {
        id: "vuln-mobile-003",
        title_en: "Insufficient Transport Layer Protection",
        title_es: "Protección Insuficiente de la Capa de Transporte",
        overview_en: `### Overview
This vulnerability arises when a mobile application fails to properly implement SSL/TLS for network communications, exposing user data to interception.`,
        overview_es: `### Resumen
Esta vulnerabilidad surge cuando una aplicación móvil no implementa correctamente SSL/TLS para las comunicaciones de red, exponiendo los datos del usuario a la interceptación.`,
        technicalDescription_en: `### Technical Description
The app may communicate over unencrypted HTTP, use outdated and weak TLS protocols/ciphers, accept self-signed certificates, or fail to properly validate the server's certificate. This allows an attacker in a privileged network position (e.g., on the same Wi-Fi) to perform a Man-in-the-Middle (MitM) attack.`,
        technicalDescription_es: `### Descripción Técnica
La aplicación puede comunicarse a través de HTTP sin cifrar, usar protocolos/cifrados TLS obsoletos y débiles, aceptar certificados autofirmados o no validar correctamente el certificado del servidor. Esto permite a un atacante en una posición de red privilegiada (p. ej., en la misma red Wi-Fi) realizar un ataque de Hombre en el Medio (MitM).`,
        impact_en: `### Impact
An attacker can intercept, view, and modify all traffic between the mobile app and the server, including login credentials, session tokens, and personal data.`,
        impact_es: `### Impacto
Un atacante puede interceptar, ver y modificar todo el tráfico entre la aplicación móvil y el servidor, incluidas las credenciales de inicio de sesión, los tokens de sesión y los datos personales.`,
        immediateActions_en: "### Immediate Actions\nForce all network connections to use HTTPS. Release a patch that enables SSL pinning.",
        immediateActions_es: "### Acciones Inmediatas\nForzar todas las conexiones de red para que usen HTTPS. Lanzar un parche que habilite el anclaje de SSL (SSL pinning).",
        remediation_en: {
            shortTerm: "Ensure that TLS is used for all network communications. Configure the app to only support strong TLS protocols (TLS 1.2, TLS 1.3) and modern cipher suites.",
            mediumTerm: "Implement SSL/TLS certificate pinning to prevent MitM attacks even if the device's trust store is compromised. Disallow the use of self-signed certificates in production builds.",
            longTerm: "Regularly review and update the list of trusted certificates and cipher suites. Use automated tools to scan the application for insecure network configurations during the development cycle."
        },
        remediation_es: {
            shortTerm: "Asegurarse de que se utilice TLS para todas las comunicaciones de red. Configurar la aplicación para que solo admita protocolos TLS fuertes (TLS 1.2, TLS 1.3) y conjuntos de cifrado modernos.",
            mediumTerm: "Implementar el anclaje de certificados SSL/TLS (certificate pinning) para prevenir ataques MitM incluso si el almacén de confianza del dispositivo está comprometido. No permitir el uso de certificados autofirmados en las compilaciones de producción.",
            longTerm: "Revisar y actualizar regularmente la lista de certificados y conjuntos de cifrado de confianza. Utilizar herramientas automatizadas para escanear la aplicación en busca de configuraciones de red inseguras durante el ciclo de desarrollo."
        },
        cwe: "CWE-319",
        severity: "High",
        cvss: { score: 7.4, vectorString: "CVSS:3.1/AV:A/AC:L/PR:N/UI:N/S:U/C:H/I:L/A:N", attackVector: "A", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "L", availability: "N" },
        references: ["https://owasp.org/www-project-mobile-top-10/2016-risks/m3-insecure-communication/"],
        tags: ["Mobile", "Network"],
        affectedComponents_en: `### Affected Components
- [TODO: List the network requests or API endpoints using insecure communication.]`,
        details_en: `### Proof of Concept
[TODO: Provide screenshots from a proxy tool (e.g., Burp Suite) showing intercepted plaintext traffic or a successful TLS downgrade attack.]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Listar las solicitudes de red o puntos de conexión de API que utilizan comunicación insegura.]`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar capturas de pantalla de una herramienta de proxy (p. ej., Burp Suite) que muestren tráfico en texto plano interceptado o un ataque de degradación de TLS exitoso.]`,
    },
    {
        id: "vuln-mobile-004",
        title_en: "Unintended Data Leakage",
        title_es: "Filtración de Datos no Intencionada",
        overview_en: `### Overview
Unintended data leakage occurs when sensitive data is unintentionally exposed or written to an insecure location on the mobile device or sent to third parties.`,
        overview_es: `### Resumen
La filtración de datos no intencionada ocurre cuando datos sensibles se exponen o se escriben sin querer en una ubicación insegura en el dispositivo móvil o se envían a terceros.`,
        technicalDescription_en: `### Technical Description
This can happen in several ways, such as logging sensitive data to system logs (Logcat/ASL), data being placed in the clipboard, URLs caching sensitive information in the browser history, or keyboard press caching. It also includes sending data to third-party analytics or ad services without proper masking.`,
        technicalDescription_es: `### Descripción Técnica
Esto puede suceder de varias maneras, como registrar datos sensibles en los registros del sistema (Logcat/ASL), colocar datos en el portapapeles, almacenar en caché información sensible en el historial del navegador o en la caché de pulsaciones de teclas. También incluye el envío de datos a servicios de análisis o publicidad de terceros sin el enmascaramiento adecuado.`,
        impact_en: `### Impact
The impact depends on the sensitivity of the leaked data. It can range from privacy violations to the full compromise of user accounts if credentials or session tokens are leaked.`,
        impact_es: `### Impacto
El impacto depende de la sensibilidad de los datos filtrados. Puede variar desde violaciones de la privacidad hasta el compromiso total de las cuentas de usuario si se filtran credenciales o tokens de sesión.`,
        immediateActions_en: "### Immediate Actions\nReview the application's logging statements and disable any that output sensitive information. Disable keyboard caching on sensitive input fields.",
        immediateActions_es: "### Acciones Inmediatas\nRevisar las declaraciones de registro de la aplicación y deshabilitar cualquiera que genere información sensible. Deshabilitar el almacenamiento en caché del teclado en los campos de entrada sensibles.",
        remediation_en: {
            shortTerm: "Remove all logging of sensitive data. Disable keyboard caching for password fields. Clear the clipboard after a user copies sensitive information from the app.",
            mediumTerm: "Review and minimize the data sent to third-party services. Implement data masking or tokenization for any sensitive data that must be shared.",
            longTerm: "Establish a clear data flow diagram for the application and conduct a privacy impact assessment. Regularly review third-party SDKs for their data handling practices."
        },
        remediation_es: {
            shortTerm: "Eliminar todo el registro de datos sensibles. Deshabilitar el almacenamiento en caché del teclado para los campos de contraseña. Limpiar el portapapeles después de que un usuario copie información sensible de la aplicación.",
            mediumTerm: "Revisar y minimizar los datos enviados a servicios de terceros. Implementar enmascaramiento de datos o tokenización para cualquier dato sensible que deba compartirse.",
            longTerm: "Establecer un diagrama de flujo de datos claro para la aplicación y realizar una evaluación de impacto en la privacidad. Revisar regularmente los SDK de terceros por sus prácticas de manejo de datos."
        },
        cwe: "CWE-532",
        severity: "Medium",
        cvss: { score: 5.7, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        references: ["https://owasp.org/www-project-mobile-top-10/2016-risks/m4-unintended-data-leakage/"],
        tags: ["Mobile"],
        affectedComponents_en: `### Affected Components
- [TODO: Specify where data leakage occurs (e.g., Logcat output, clipboard, analytics data).]`,
        details_en: `### Proof of Concept
[TODO: Provide screenshots or log excerpts showing the sensitive data being leaked.]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Especificar dónde ocurre la filtración de datos (p. ej., salida de Logcat, portapapeles, datos de análisis).]`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar capturas de pantalla o extractos de registros que muestren la filtración de datos sensibles.]`,
    },
    {
        id: "vuln-mobile-005",
        title_en: "Poor Authorization",
        title_es: "Autorización Deficiente",
        overview_en: `### Overview
Poor authorization vulnerabilities occur when a user is able to access resources or perform actions that they should not be permitted to. This is a server-side flaw, but it is tested and exploited via the mobile app.`,
        overview_es: `### Resumen
Las vulnerabilidades de autorización deficiente ocurren cuando un usuario puede acceder a recursos o realizar acciones que no debería tener permitidas. Esta es una falla del lado del servidor, pero se prueba y explota a través de la aplicación móvil.`,
        technicalDescription_en: `### Technical Description
This is similar to Broken Access Control in web applications. An attacker, authenticated as a low-privilege user, can manipulate API requests to access data or functionality belonging to another user or a higher-privilege role. For example, changing a user ID in an API call from \`/api/users/123/profile\` to \`/api/users/456/profile\` to view another user's data.`,
        technicalDescription_es: `### Descripción Técnica
Esto es similar al Control de Acceso Roto en aplicaciones web. Un atacante, autenticado como un usuario de bajos privilegios, puede manipular las solicitudes de API para acceder a datos o funcionalidades que pertenecen a otro usuario o a un rol de mayor privilegio. Por ejemplo, cambiar un ID de usuario en una llamada a la API de \`/api/users/123/profile\` a \`/api/users/456/profile\` para ver los datos de otro usuario.`,
        impact_en: `### Impact
The impact can be severe, allowing attackers to view, modify, or delete any data accessible via the backend API, regardless of ownership or privilege level.`,
        impact_es: `### Impacto
El impacto puede ser severo, permitiendo a los atacantes ver, modificar o eliminar cualquier dato accesible a través de la API de backend, independientemente de la propiedad o el nivel de privilegio.`,
        immediateActions_en: "### Immediate Actions\nReview and audit the authorization logic for the most critical API endpoints. Implement temporary blocking rules for any user exhibiting suspicious access patterns.",
        immediateActions_es: "### Acciones Inmediatas\nRevisar y auditar la lógica de autorización para los puntos de conexión de API más críticos. Implementar reglas de bloqueo temporales para cualquier usuario que exhiba patrones de acceso sospechosos.",
        remediation_en: {
            shortTerm: "Enforce authorization checks on the server-side for every single API request. Do not rely on the client to control which UI elements are shown to the user.",
            mediumTerm: "Implement a robust, centralized role-based access control (RBAC) system for the backend API. Ensure that ownership is checked for all data access requests.",
            longTerm: "Conduct a thorough security review of the entire API surface. Unit and integration tests should be created to verify that authorization rules are correctly enforced."
        },
        remediation_es: {
            shortTerm: "Hacer cumplir las comprobaciones de autorización en el lado del servidor para cada solicitud de API individual. No depender del cliente para controlar qué elementos de la interfaz de usuario se muestran al usuario.",
            mediumTerm: "Implementar un sistema de control de acceso basado en roles (RBAC) robusto y centralizado para la API de backend. Asegurarse de que se compruebe la propiedad para todas las solicitudes de acceso a datos.",
            longTerm: "Realizar una revisión de seguridad exhaustiva de toda la superficie de la API. Se deben crear pruebas unitarias y de integración para verificar que las reglas de autorización se apliquen correctamente."
        },
        cwe: "CWE-863",
        severity: "High",
        cvss: { score: 8.1, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "N" },
        references: ["https://owasp.org/www-project-mobile-top-10/2016-risks/m5-poor-authorization-and-authentication/"],
        tags: ["Mobile", "API"],
        affectedComponents_en: `### Affected Components
- [TODO: List the API endpoints that fail to enforce proper authorization.]`,
        details_en: `### Proof of Concept
[TODO: Provide a sequence of API requests (e.g., from Burp Suite) showing how a low-privilege user can access or modify data they should not have access to.]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Listar los puntos de conexión de la API que no aplican la autorización adecuada.]`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar una secuencia de solicitudes de API (p. ej., desde Burp Suite) que muestre cómo un usuario con pocos privilegios puede acceder o modificar datos a los que no debería tener acceso.]`,
    },
    {
        id: "vuln-mobile-006",
        title_en: "Broken Cryptography",
        title_es: "Criptografía Rota",
        overview_en: `### Overview
This vulnerability arises from the incorrect use of cryptography in a mobile app, such as using weak or outdated algorithms, or implementing custom, insecure cryptographic protocols.`,
        overview_es: `### Resumen
Esta vulnerabilidad surge del uso incorrecto de la criptografía en una aplicación móvil, como el uso de algoritmos débiles u obsoletos, o la implementación de protocolos criptográficos personalizados e inseguros.`,
        technicalDescription_en: `### Technical Description
The app may use deprecated algorithms like MD5 or SHA1 for hashing passwords, use static keys for encryption, implement its own flawed encryption algorithm, or use predictable initialization vectors (IVs). This allows an attacker to decrypt sensitive data or bypass security controls.`,
        technicalDescription_es: `### Descripción Técnica
La aplicación puede usar algoritmos obsoletos como MD5 o SHA1 para hashear contraseñas, usar claves estáticas para el cifrado, implementar su propio algoritmo de cifrado defectuoso o usar vectores de inicialización (IV) predecibles. Esto permite a un atacante descifrar datos sensibles o eludir los controles de seguridad.`,
        impact_en: `### Impact
Broken cryptography can lead to the compromise of sensitive data stored on the device or transmitted over the network. It can completely undermine the security of authentication and data protection mechanisms.`,
        impact_es: `### Impacto
La criptografía rota puede llevar al compromiso de datos sensibles almacenados en el dispositivo o transmitidos por la red. Puede socavar por completo la seguridad de los mecanismos de autenticación y protección de datos.`,
        immediateActions_en: "### Immediate Actions\nIdentify and immediately cease the use of any custom or known-weak cryptographic algorithms (e.g., MD5, SHA1, DES).",
        immediateActions_es: "### Acciones Inmediatas\nIdentificar y cesar inmediatamente el uso de cualquier algoritmo criptográfico personalizado o conocido por ser débil (p. ej., MD5, SHA1, DES).",
        remediation_en: {
            shortTerm: "Replace all weak or custom cryptographic algorithms with modern, industry-standard algorithms (e.g., AES-256-GCM for encryption, PBKDF2 or Argon2 for password hashing).",
            mediumTerm: "Do not implement cryptography from scratch. Use well-vetted, platform-provided cryptographic libraries and APIs.",
            longTerm: "Establish a policy for cryptographic standards and regularly review the application to ensure compliance. This includes key management, algorithm choice, and protocol usage."
        },
        remediation_es: {
            shortTerm: "Reemplazar todos los algoritmos criptográficos débiles o personalizados con algoritmos modernos y estándar de la industria (p. ej., AES-256-GCM para el cifrado, PBKDF2 o Argon2 para el hasheo de contraseñas).",
            mediumTerm: "No implementar la criptografía desde cero. Utilizar bibliotecas y API criptográficas bien examinadas y proporcionadas por la plataforma.",
            longTerm: "Establecer una política para los estándares criptográficos y revisar regularmente la aplicación para asegurar el cumplimiento. Esto incluye la gestión de claves, la elección de algoritmos y el uso de protocolos."
        },
        cwe: "CWE-327",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        references: ["https://owasp.org/www-project-mobile-top-10/2016-risks/m6-insecure-authorization/"],
        tags: ["Mobile", "Cryptography"],
        affectedComponents_en: `### Affected Components
- [TODO: Specify the part of the code where broken cryptography is used.]`,
        details_en: `### Proof of Concept
[TODO: Provide evidence of the weak cryptography, such as decrypting data encrypted with a static key or cracking a password hash.]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Especificar la parte del código donde se utiliza la criptografía rota.]`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar evidencia de la criptografía débil, como el descifrado de datos cifrados con una clave estática o el craqueo de un hash de contraseña.]`,
    },
    {
        id: "vuln-mobile-007",
        title_en: "Client-Side Injection",
        title_es: "Inyección en el Lado del Cliente",
        overview_en: `### Overview
Client-side injection vulnerabilities in mobile apps occur when untrusted data is processed by a data interpreter on the client side, such as a SQLite database or a web view.`,
        overview_es: `### Resumen
Las vulnerabilidades de inyección en el lado del cliente en aplicaciones móviles ocurren cuando datos no confiables son procesados por un intérprete de datos en el lado del cliente, como una base de datos SQLite o una vista web.`,
        technicalDescription_en: `### Technical Description
This category includes vulnerabilities like SQL injection in local SQLite databases, or Cross-Site Scripting (XSS) in local web views (WebView/WKWebView). An attacker might be able to corrupt the local data, or execute malicious scripts in the context of the app's local web content.`,
        technicalDescription_es: `### Descripción Técnica
Esta categoría incluye vulnerabilidades como la inyección de SQL en bases de datos SQLite locales, o Cross-Site Scripting (XSS) en vistas web locales (WebView/WKWebView). Un atacante podría ser capaz de corromper los datos locales o ejecutar scripts maliciosos en el contexto del contenido web local de la aplicación.`,
        impact_en: `### Impact
The impact can range from data corruption and denial-of-service on the local app, to the execution of arbitrary code within a sandboxed web view, which could lead to session token theft if the token is exposed to the web view.`,
        impact_es: `### Impacto
El impacto puede variar desde la corrupción de datos y la denegación de servicio en la aplicación local, hasta la ejecución de código arbitrario dentro de una vista web aislada, lo que podría llevar al robo de tokens de sesión si el token está expuesto a la vista web.`,
        immediateActions_en: "### Immediate Actions\nIdentify all local data interpreters (SQLite, WebViews) and review the code to find where they process untrusted data. Apply input validation as a temporary fix.",
        immediateActions_es: "### Acciones Inmediatas\nIdentificar todos los intérpretes de datos locales (SQLite, WebViews) y revisar el código para encontrar dónde procesan datos no confiables. Aplicar la validación de entradas como una solución temporal.",
        remediation_en: {
            shortTerm: "Use parameterized queries (prepared statements) for all local SQLite database interactions. For WebViews, ensure JavaScript is disabled if not needed, and properly encode any data displayed in them.",
            mediumTerm: "Avoid processing untrusted data on the client side whenever possible. Perform validation and sanitization on the server side before sending data to the client.",
            longTerm: "Implement a secure coding standard for the mobile app that includes guidelines for handling untrusted data on the client side. Use automated scanning tools to detect client-side injection flaws."
        },
        remediation_es: {
            shortTerm: "Usar consultas parametrizadas (prepared statements) para todas las interacciones con la base de datos SQLite local. Para las WebViews, asegurarse de que JavaScript esté deshabilitado si no es necesario, y codificar correctamente cualquier dato que se muestre en ellas.",
            mediumTerm: "Evitar el procesamiento de datos no confiables en el lado del cliente siempre que sea posible. Realizar la validación y el saneamiento en el lado del servidor antes de enviar los datos al cliente.",
            longTerm: "Implementar un estándar de codificación segura para la aplicación móvil que incluya pautas para el manejo de datos no confiables en el lado del cliente. Usar herramientas de escaneo automatizadas para detectar fallas de inyección en el lado del cliente."
        },
        cwe: "CWE-74",
        severity: "Medium",
        cvss: { score: 6.5, vectorString: "CVSS:3.1/AV:L/AC:L/PR:N/UI:R/S:U/C:H/I:L/A:N", attackVector: "L", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "H", integrity: "L", availability: "N" },
        references: ["https://owasp.org/www-project-mobile-top-10/2016-risks/m7-client-side-injection/"],
        tags: ["Mobile"],
        affectedComponents_en: `### Affected Components
- [TODO: Specify the local database query or WebView that is vulnerable.]`,
        details_en: `### Proof of Concept
[TODO: Provide a PoC, such as a malicious SQL query that corrupts the local DB, or an XSS payload that executes in a WebView.]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Especificar la consulta de la base de datos local o la WebView que es vulnerable.]`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar una PoC, como una consulta SQL maliciosa que corrompe la BD local, o una carga útil de XSS que se ejecuta en una WebView.]`,
    },
    {
        id: "vuln-mobile-008",
        title_en: "Security Decisions Via Untrusted Inputs",
        title_es: "Decisiones de Seguridad a Través de Entradas no Confiables",
        overview_en: `### Overview
This vulnerability occurs when the mobile application makes security-related decisions based on data that comes from an untrusted source, such as user input or IPC messages.`,
        overview_es: `### Resumen
Esta vulnerabilidad ocurre cuando la aplicación móvil toma decisiones relacionadas con la seguridad basándose en datos que provienen de una fuente no confiable, como la entrada del usuario o mensajes IPC.`,
        technicalDescription_en: `### Technical Description
The application might trust a URL provided in an IPC message to load content into a WebView, or use a boolean flag from a configuration file that can be modified by the user to enable or disable security features (like SSL pinning).`,
        technicalDescription_es: `### Descripción Técnica
La aplicación puede confiar en una URL proporcionada en un mensaje IPC para cargar contenido en una WebView, o usar una bandera booleana de un archivo de configuración que puede ser modificado por el usuario para habilitar o deshabilitar características de seguridad (como el anclaje de SSL).`,
        impact_en: `### Impact
This can lead to a complete bypass of security controls. For example, an attacker could disable SSL pinning, bypass business logic, or trick the application into loading malicious content.`,
        impact_es: `### Impacto
Esto puede conducir a una omisión completa de los controles de seguridad. Por ejemplo, un atacante podría deshabilitar el anclaje de SSL, eludir la lógica de negocio o engañar a la aplicación para que cargue contenido malicioso.`,
        immediateActions_en: "### Immediate Actions\nIdentify all security decisions made by the app. Trace the data sources for these decisions and immediately implement server-side validation or use hardcoded, secure values.",
        immediateActions_es: "### Acciones Inmediatas\nIdentificar todas las decisiones de seguridad tomadas por la aplicación. Rastrear las fuentes de datos para estas decisiones e implementar inmediatamente la validación del lado del servidor o usar valores seguros y codificados de forma rígida.",
        remediation_en: {
            shortTerm: "Never make security decisions based on user-controlled or otherwise untrusted input. Security controls should be enforced by server-side logic or hardcoded in the application binary.",
            mediumTerm: "For any security-sensitive configurations, fetch them from a trusted server-side endpoint rather than storing them in a client-modifiable file.",
            longTerm: "Design the application so that the client is treated as a completely untrusted environment. All significant security checks and decisions must be made on the server."
        },
        remediation_es: {
            shortTerm: "Nunca tomar decisiones de seguridad basadas en entradas controladas por el usuario o de otra manera no confiables. Los controles de seguridad deben ser aplicados por la lógica del lado del servidor o codificados de forma rígida en el binario de la aplicación.",
            mediumTerm: "Para cualquier configuración sensible a la seguridad, obtenerla de un punto de conexión de confianza del lado del servidor en lugar de almacenarla en un archivo modificable por el cliente.",
            longTerm: "Diseñar la aplicación de modo que el cliente sea tratado como un entorno completamente no confiable. Todas las comprobaciones y decisiones de seguridad significativas deben realizarse en el servidor."
        },
        cwe: "CWE-807",
        severity: "High",
        cvss: { score: 8.1, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        references: ["https://owasp.org/www-project-mobile-top-10/2016-risks/m8-security-decisions-via-untrusted-inputs/"],
        tags: ["Mobile"],
        affectedComponents_en: `### Affected Components
- [TODO: Specify the security decision and the untrusted input that influences it.]`,
        details_en: `### Proof of Concept
[TODO: Provide a PoC demonstrating how to manipulate the untrusted input to bypass a security control.]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Especificar la decisión de seguridad y la entrada no confiable que la influye.]`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar una PoC que demuestre cómo manipular la entrada no confiable para eludir un control de seguridad.]`,
    },
    {
        id: "vuln-mobile-009",
        title_en: "Improper Session Handling",
        title_es: "Manejo Inapropiado de Sesiones",
        overview_en: `### Overview
This vulnerability occurs when a mobile application does not properly manage user sessions, particularly session timeouts and token invalidation.`,
        overview_es: `### Resumen
Esta vulnerabilidad ocurre cuando una aplicación móvil no gestiona adecuadamente las sesiones de usuario, en particular los tiempos de espera de sesión y la invalidación de tokens.`,
        technicalDescription_en: `### Technical Description
The application may issue session tokens that never expire, or fail to invalidate a session token on the server-side after the user logs out. An attacker who gains access to a session token can reuse it indefinitely to impersonate the user.`,
        technicalDescription_es: `### Descripción Técnica
La aplicación puede emitir tokens de sesión que nunca caducan, o no invalidar un token de sesión en el lado del servidor después de que el usuario cierre la sesión. Un atacante que obtenga acceso a un token de sesión puede reutilizarlo indefinidamente para hacerse pasar por el usuario.`,
        impact_en: `### Impact
Leads to session hijacking and account takeover. An attacker with a stolen session token can maintain persistent access to a user's account.`,
        impact_es: `### Impacto
Conduce al secuestro de sesiones y a la toma de control de cuentas. Un atacante con un token de sesión robado puede mantener un acceso persistente a la cuenta de un usuario.`,
        immediateActions_en: "### Immediate Actions\nForce the invalidation of all current session tokens on the server side. Implement a short-lived session timeout on the server.",
        immediateActions_es: "### Acciones Inmediatas\nForzar la invalidación de todos los tokens de sesión actuales en el lado del servidor. Implementar un tiempo de espera de sesión de corta duración en el servidor.",
        remediation_en: {
            shortTerm: "Implement server-side session timeouts. Session tokens must be invalidated on the server when a user logs out.",
            mediumTerm: "Use refresh tokens and short-lived access tokens. The access token provides access to resources, and the refresh token is used to obtain a new access token without requiring the user to re-authenticate.",
            longTerm: "Implement a mechanism to detect and alert on suspicious session activity, such as a session being used from multiple IP addresses or devices simultaneously."
        },
        remediation_es: {
            shortTerm: "Implementar tiempos de espera de sesión del lado del servidor. Los tokens de sesión deben invalidarse en el servidor cuando un usuario cierra la sesión.",
            mediumTerm: "Usar tokens de actualización y tokens de acceso de corta duración. El token de acceso proporciona acceso a los recursos, y el token de actualización se utiliza para obtener un nuevo token de acceso sin requerir que el usuario se vuelva a autenticar.",
            longTerm: "Implementar un mecanismo para detectar y alertar sobre actividades de sesión sospechosas, como una sesión que se utiliza desde múltiples direcciones IP o dispositivos simultáneamente."
        },
        cwe: "CWE-613",
        severity: "High",
        cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        references: ["https://owasp.org/www-project-mobile-top-10/2016-risks/m9-improper-session-handling/"],
        tags: ["Mobile", "Authentication"],
        affectedComponents_en: `### Affected Components
- [TODO: Specify the session management mechanism of the application.]`,
        details_en: `### Proof of Concept
[TODO: Provide a PoC demonstrating that a session token remains valid and can be reused after the user has logged out.]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Especificar el mecanismo de gestión de sesiones de la aplicación.]`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar una PoC que demuestre que un token de sesión sigue siendo válido y puede ser reutilizado después de que el usuario haya cerrado la sesión.]`,
    },
    {
        id: "vuln-mobile-010",
        title_en: "Lack of Binary Protections",
        title_es: "Falta de Protecciones del Binario",
        overview_en: `### Overview
This issue occurs when the mobile application's binary is not adequately protected against reverse engineering, tampering, and analysis.`,
        overview_es: `### Resumen
Este problema ocurre cuando el binario de la aplicación móvil no está adecuadamente protegido contra la ingeniería inversa, la manipulación y el análisis.`,
        technicalDescription_en: `### Technical Description
Mobile app binaries can be decompiled to reveal source code, hardcoded secrets, and business logic. An attacker can analyze this code to find other vulnerabilities, tamper with the app's logic (e.g., bypass security controls), or repackage the app with malicious code. Lack of protections includes no code obfuscation, no anti-tampering checks, and no root/jailbreak detection.`,
        technicalDescription_es: `### Descripción Técnica
Los binarios de las aplicaciones móviles pueden ser descompilados para revelar el código fuente, los secretos codificados de forma rígida y la lógica de negocio. Un atacante puede analizar este código para encontrar otras vulnerabilidades, manipular la lógica de la aplicación (p. ej., eludir los controles de seguridad) o reempaquetar la aplicación con código malicioso. La falta de protecciones incluye la no ofuscación del código, la falta de comprobaciones anti-manipulación y la no detección de root/jailbreak.`,
        impact_en: `### Impact
Reverse engineering can lead to the discovery of other severe vulnerabilities, theft of intellectual property, and reputational damage. Tampering can lead to fraud, security control bypasses, and the distribution of malicious versions of the app.`,
        impact_es: `### Impacto
La ingeniería inversa puede conducir al descubrimiento de otras vulnerabilidades graves, el robo de propiedad intelectual y el daño a la reputación. La manipulación puede conducir al fraude, a la omisión de controles de seguridad y a la distribución de versiones maliciosas de la aplicación.`,
        immediateActions_en: "### Immediate Actions\nImplement basic root/jailbreak detection to prevent the app from running in an insecure environment. Remove any hardcoded API keys or secrets from the binary.",
        immediateActions_es: "### Acciones Inmediatas\nImplementar la detección básica de root/jailbreak para evitar que la aplicación se ejecute en un entorno inseguro. Eliminar cualquier clave de API o secreto codificado de forma rígida del binario.",
        remediation_en: {
            shortTerm: "Apply code obfuscation to make the decompiled code harder to understand. Implement anti-tampering checks (e.g., checksum validation) to detect if the app has been modified.",
            mediumTerm: "Implement more robust root/jailbreak detection and anti-debugging techniques. Use tools that provide comprehensive binary protection, including string encryption and control flow obfuscation.",
            longTerm: "Adopt a defense-in-depth strategy for mobile security. Assume that a determined attacker can bypass client-side controls, and therefore, critical security logic must always be enforced on the server side."
        },
        remediation_es: {
            shortTerm: "Aplicar la ofuscación de código para dificultar la comprensión del código descompilado. Implementar comprobaciones anti-manipulación (p. ej., validación de checksum) para detectar si la aplicación ha sido modificada.",
            mediumTerm: "Implementar una detección de root/jailbreak más robusta y técnicas anti-depuración. Utilizar herramientas que proporcionen una protección binaria completa, incluido el cifrado de cadenas y la ofuscación del flujo de control.",
            longTerm: "Adoptar una estrategia de defensa en profundidad para la seguridad móvil. Asumir que un atacante determinado puede eludir los controles del lado del cliente y, por lo tanto, la lógica de seguridad crítica siempre debe aplicarse en el lado del servidor."
        },
        cwe: "CWE-657",
        severity: "Medium",
        cvss: { score: 5.9, vectorString: "CVSS:3.1/AV:L/AC:L/PR:N/UI:N/S:U/C:L/I:L/A:L", attackVector: "L", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "L", availability: "L" },
        references: ["https://owasp.org/www-project-mobile-top-10/2016-risks/m1-improper-platform-usage/"],
        tags: ["Mobile"],
        affectedComponents_en: `### Affected Components
- The application binary itself (APK/IPA).`,
        details_en: `### Proof of Concept
[TODO: Provide screenshots of decompiled code, or demonstrate bypassing a security control after patching the binary.]`,
        affectedComponents_es: `### Componentes Afectados
- El propio binario de la aplicación (APK/IPA).`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar capturas de pantalla del código descompilado, o demostrar cómo se elude un control de seguridad después de parchear el binario.]`,
    },
    // --- NETWORK VULNERABILITIES ---
    {
        id: "vuln-net-001",
        title_en: "Man-in-the-Middle (MitM)",
        title_es: "Ataque de Intermediario (MitM)",
        overview_en: `### Overview
A Man-in-the-Middle (MitM) attack occurs when an attacker secretly relays and possibly alters the communication between two parties who believe they are directly communicating with each other.`,
        overview_es: `### Resumen
Un ataque de intermediario (MitM) ocurre cuando un atacante retransmite y posiblemente altera en secreto la comunicación entre dos partes que creen que se están comunicando directamente entre sí.`,
        technicalDescription_en: `### Technical Description
This can be achieved by intercepting traffic on an unsecured Wi-Fi network, through ARP poisoning on a local network, or by compromising a router. Without proper transport layer security (TLS) and certificate validation, the attacker can decrypt, read, and modify the traffic at will.`,
        technicalDescription_es: `### Descripción Técnica
Esto se puede lograr interceptando el tráfico en una red Wi-Fi no segura, a través de envenenamiento ARP en una red local o comprometiendo un enrutador. Sin una seguridad de capa de transporte (TLS) adecuada y validación de certificados, el atacante puede descifrar, leer y modificar el tráfico a su antojo.`,
        impact_en: `### Impact
The attacker can steal sensitive information like credentials and session tokens, inject malicious content into legitimate communications, or hijack user sessions completely.`,
        impact_es: `### Impacto
El atacante puede robar información sensible como credenciales y tokens de sesión, inyectar contenido malicioso en comunicaciones legítimas o secuestrar sesiones de usuario por completo.`,
        immediateActions_en: "### Immediate Actions\nImmediately enforce the use of TLS for all communications. Educate users about the risks of connecting to untrusted public Wi-Fi networks.",
        immediateActions_es: "### Acciones Inmediatas\nForzar inmediatamente el uso de TLS para todas las comunicaciones. Educar a los usuarios sobre los riesgos de conectarse a redes Wi-Fi públicas no confiables.",
        remediation_en: {
            shortTerm: "Enforce TLS 1.2 or higher across all endpoints. Implement certificate pinning in mobile clients to ensure the app only communicates with the trusted server.",
            mediumTerm: "Use HTTP Strict Transport Security (HSTS) to ensure browsers only connect to your server over HTTPS.",
            longTerm: "Conduct regular network security audits. Deploy intrusion detection systems (IDS) to monitor for suspicious network activity like ARP poisoning."
        },
        remediation_es: {
            shortTerm: "Hacer cumplir TLS 1.2 o superior en todos los puntos de conexión. Implementar el anclaje de certificados (certificate pinning) en los clientes móviles para garantizar que la aplicación solo se comunique con el servidor de confianza.",
            mediumTerm: "Usar HTTP Strict Transport Security (HSTS) para garantizar que los navegadores solo se conecten a su servidor a través de HTTPS.",
            longTerm: "Realizar auditorías de seguridad de red periódicas. Desplegar sistemas de detección de intrusiones (IDS) para monitorear actividades de red sospechosas como el envenenamiento ARP."
        },
        cwe: "CWE-295",
        severity: "High",
        cvss: { score: 8.1, vectorString: "CVSS:3.1/AV:A/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N", attackVector: "A", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "N" },
        references: ["https://owasp.org/www-community/attacks/Man-in-the-middle_attack"],
        tags: ["Network"],
        affectedComponents_en: `### Affected Components
- [TODO: Specify the network communication channels that are vulnerable.]`,
        details_en: `### Proof of Concept
[TODO: Provide evidence of a MitM attack, such as screenshots from a proxy tool showing intercepted or modified traffic.]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Especificar los canales de comunicación de red que son vulnerables.]`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar evidencia de un ataque MitM, como capturas de pantalla de una herramienta de proxy que muestren tráfico interceptado o modificado.]`,
    },
    { 
        id: "vuln-net-002", 
        title_en: "DNS Spoofing", 
        title_es: "Suplantación de DNS", 
        overview_en: "### Overview\nDNS spoofing or DNS cache poisoning is an attack where corrupted DNS data is introduced into the DNS resolver's cache, causing the name server to return an incorrect IP address.", 
        overview_es: "### Resumen\nLa suplantación de DNS o envenenamiento de caché de DNS es un ataque en el que se introducen datos DNS corruptos en la caché del resolutor de DNS, lo que hace que el servidor de nombres devuelva una dirección IP incorrecta.", 
        technicalDescription_en: "### Technical Description\nAn attacker can exploit vulnerabilities in the DNS protocol to redirect traffic intended for a legitimate server to a malicious server controlled by the attacker. This is often done by sending forged DNS responses to a DNS resolver.", 
        technicalDescription_es: "### Descripción Técnica\nUn atacante puede explotar vulnerabilidades en el protocolo DNS para redirigir el tráfico destinado a un servidor legítimo a un servidor malicioso controlado por el atacante. Esto se hace a menudo enviando respuestas DNS falsificadas a un resolutor de DNS.", 
        impact_en: "### Impact\nThis can be used for phishing attacks, where a user is tricked into entering credentials on a fake website, or for distributing malware. It can also facilitate man-in-the-middle attacks.", 
        impact_es: "### Impacto\nEsto puede usarse para ataques de phishing, donde se engaña a un usuario para que ingrese credenciales en un sitio web falso, o para distribuir malware. También puede facilitar ataques de intermediario (man-in-the-middle).", 
        immediateActions_en: "### Immediate Actions\nFlush the DNS cache on affected clients and servers. Use a trusted, public DNS resolver that implements DNSSEC.", 
        immediateActions_es: "### Acciones Inmediatas\nVaciar la caché de DNS en los clientes y servidores afectados. Usar un resolutor de DNS público y de confianza que implemente DNSSEC.", 
        remediation_en: { shortTerm: "Implement DNSSEC (Domain Name System Security Extensions) to validate the authenticity of DNS responses.", mediumTerm: "Use end-to-end encryption (TLS) for all communications. This ensures that even if DNS is spoofed, the attacker cannot decrypt the traffic without the server's private key.", longTerm: "Monitor DNS traffic for anomalies. Regularly audit DNS server configurations for security best practices." }, 
        remediation_es: { shortTerm: "Implementar DNSSEC (Extensiones de Seguridad del Sistema de Nombres de Dominio) para validar la autenticidad de las respuestas DNS.", mediumTerm: "Usar cifrado de extremo a extremo (TLS) para todas las comunicaciones. Esto asegura que incluso si se suplanta el DNS, el atacante no puede descifrar el tráfico sin la clave privada del servidor.", longTerm: "Monitorear el tráfico DNS en busca de anomalías. Auditar regularmente las configuraciones del servidor DNS para seguir las mejores prácticas de seguridad." }, 
        cwe: "CWE-290", 
        severity: "High", 
        cvss: { score: 8.1, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:C/C:H/I:L/A:N", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "C", confidentiality: "H", integrity: "L", availability: "N" }, 
        references: ["https://www.cloudflare.com/learning/dns/dns-cache-poisoning/"], 
        tags: ["Network"], 
        affectedComponents_en: "### Affected Components\n- DNS resolvers and clients within the network.", 
        details_en: "### Proof of Concept\n[TODO: Show evidence of a successful DNS spoofing attack, such as a client being redirected to a malicious IP address.]", 
        affectedComponents_es: "### Componentes Afectados\n- Resolutores y clientes DNS dentro de la red.", 
        details_es: "### Prueba de Concepto\n[TODO: Mostrar evidencia de un ataque de suplantación de DNS exitoso, como un cliente siendo redirigido a una dirección IP maliciosa.]" 
    },
    {
        id: "vuln-net-003",
        title_en: "ARP Poisoning",
        title_es: "Envenenamiento ARP",
        overview_en: `### Overview
ARP poisoning is a technique whereby an attacker sends falsified ARP (Address Resolution Protocol) messages over a local area network. This results in the linking of an attacker's MAC address with the IP address of a legitimate computer or server on the network.`,
        overview_es: `### Resumen
El envenenamiento ARP es una técnica mediante la cual un atacante envía mensajes ARP (Protocolo de Resolución de Direcciones) falsificados a través de una red de área local. Esto resulta en la vinculación de la dirección MAC de un atacante con la dirección IP de una computadora o servidor legítimo en la red.`,
        technicalDescription_en: `### Technical Description
Since ARP is a stateless protocol, an attacker can send a forged ARP response to a host on the LAN. This response associates the attacker's MAC address with the IP address of the default gateway. Any traffic the host sends to the gateway is instead sent to the attacker, allowing them to intercept or modify it before forwarding it to the actual gateway.`,
        technicalDescription_es: `### Descripción Técnica
Dado que ARP es un protocolo sin estado, un atacante puede enviar una respuesta ARP falsificada a un host en la LAN. Esta respuesta asocia la dirección MAC del atacante con la dirección IP de la puerta de enlace predeterminada. Cualquier tráfico que el host envíe a la puerta de enlace se envía en su lugar al atacante, lo que le permite interceptarlo o modificarlo antes de reenviarlo a la puerta de enlace real.`,
        impact_en: `### Impact
ARP poisoning can lead to man-in-the-middle attacks, denial-of-service attacks, and session hijacking within the local network.`,
        impact_es: `### Impacto
El envenenamiento de ARP puede conducir a ataques de intermediario (man-in-the-middle), ataques de denegación de servicio y secuestro de sesiones dentro de la red local.`,
        immediateActions_en: "### Immediate Actions\nUse static ARP entries for critical servers and the default gateway. Deploy an Intrusion Detection System (IDS) capable of detecting ARP poisoning.",
        immediateActions_es: "### Acciones Inmediatas\nUtilizar entradas ARP estáticas para los servidores críticos y la puerta de enlace predeterminada. Desplegar un Sistema de Detección de Intrusiones (IDS) capaz de detectar el envenenamiento de ARP.",
        remediation_en: {
            shortTerm: "Use Dynamic ARP Inspection (DAI) on network switches to validate ARP packets.",
            mediumTerm: "Segment the network using VLANs to limit the broadcast domain and reduce the scope of a potential ARP poisoning attack.",
            longTerm: "Encrypt all network traffic using protocols like TLS and SSH. This does not prevent ARP poisoning but mitigates the impact by preventing the attacker from reading or modifying the intercepted traffic."
        },
        remediation_es: {
            shortTerm: "Utilizar la Inspección Dinámica de ARP (DAI) en los switches de red para validar los paquetes ARP.",
            mediumTerm: "Segmentar la red utilizando VLAN para limitar el dominio de difusión y reducir el alcance de un posible ataque de envenenamiento ARP.",
            longTerm: "Cifrar todo el tráfico de red utilizando protocolos como TLS y SSH. Esto no previene el envenenamiento de ARP, pero mitiga el impacto al evitar que el atacante lea o modifique el tráfico interceptado."
        },
        cwe: "CWE-942",
        severity: "Medium",
        cvss: { score: 6.8, vectorString: "CVSS:3.1/AV:A/AC:H/PR:N/UI:N/S:U/C:H/I:L/A:L", attackVector: "A", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "L", availability: "L" },
        references: ["https://www.veracode.com/security/arp-poisoning"],
        tags: ["Network"],
        affectedComponents_en: "### Affected Components\n- All devices on the local network segment.",
        details_en: "### Proof of Concept\n[TODO: Provide output from a tool like `arpspoof` and show intercepted traffic in a network analyzer like Wireshark.]",
        affectedComponents_es: "### Componentes Afectados\n- Todos los dispositivos en el segmento de red local.",
        details_es: "### Prueba de Concepto\n[TODO: Proporcionar la salida de una herramienta como `arpspoof` y mostrar el tráfico interceptado en un analizador de red como Wireshark.]"
    },
    {
        id: "vuln-net-004",
        title_en: "IP Spoofing",
        title_es: "Suplantación de IP",
        overview_en: "### Overview\nIP spoofing is the creation of Internet Protocol (IP) packets with a forged source IP address, for the purpose of concealing the identity of the sender or impersonating another computing system.",
        overview_es: "### Resumen\nLa suplantación de IP es la creación de paquetes de Protocolo de Internet (IP) con una dirección IP de origen falsificada, con el fin de ocultar la identidad del remitente o hacerse pasar por otro sistema informático.",
        technicalDescription_en: "### Technical Description\nThe attacker crafts IP packets with a modified source address. This technique can be used to bypass IP-based access controls or to conduct reflection and amplification attacks in DoS scenarios, where the response from a server is sent to the spoofed (victim's) IP address.",
        technicalDescription_es: "### Descripción Técnica\nEl atacante crea paquetes IP con una dirección de origen modificada. Esta técnica se puede utilizar para eludir los controles de acceso basados en IP o para realizar ataques de reflexión y amplificación en escenarios de DoS, donde la respuesta de un servidor se envía a la dirección IP suplantada (de la víctima).",
        impact_en: "### Impact\nCan lead to bypassing network access controls, session hijacking if combined with other techniques, and participation in Denial-of-Service attacks.",
        impact_es: "### Impacto\nPuede conducir a la omisión de los controles de acceso a la red, el secuestro de sesiones si se combina con otras técnicas y la participación en ataques de denegación de servicio.",
        immediateActions_en: "### Immediate Actions\nImplement ingress and egress filtering on network routers and firewalls to block packets with source addresses that are not within the expected range for the network segment.",
        immediateActions_es: "### Acciones Inmediatas\nImplementar filtrado de entrada y salida en los enrutadores y firewalls de la red para bloquear paquetes con direcciones de origen que no están dentro del rango esperado para el segmento de red.",
        remediation_en: {
            shortTerm: "Use ingress filtering (BCP38) at the network edge to drop packets with source IPs from outside your network's allocated range.",
            mediumTerm: "Enable Reverse Path Forwarding (RPF) on routers, which ensures that the source address of a packet is reachable via the interface the packet came in on.",
            longTerm: "Use cryptographic authentication protocols like IPsec, which provide data integrity and origin authentication for IP packets, making spoofing significantly more difficult."
        },
        remediation_es: {
            shortTerm: "Usar filtrado de entrada (BCP38) en el borde de la red para descartar paquetes con IPs de origen fuera del rango asignado a su red.",
            mediumTerm: "Habilitar el Reenvío de Ruta Inversa (RPF) en los enrutadores, lo que asegura que la dirección de origen de un paquete sea alcanzable a través de la interfaz por la que llegó el paquete.",
            longTerm: "Utilizar protocolos de autenticación criptográfica como IPsec, que proporcionan integridad de datos y autenticación de origen para los paquetes IP, lo que dificulta significativamente la suplantación."
        },
        cwe: "CWE-290",
        severity: "Medium",
        cvss: { score: 6.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:L/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "L", availability: "N" },
        references: ["https://www.cloudflare.com/learning/ddos/ip-spoofing/"],
        tags: ["Network"],
        affectedComponents_en: "### Affected Components\n- Network routers, firewalls, and systems that use IP-based access controls.",
        details_en: "### Proof of Concept\n[TODO: Provide evidence of spoofed packets being accepted by a target system, using a tool like hping3 or Scapy.]",
        affectedComponents_es: "### Componentes Afectados\n- Enrutadores de red, cortafuegos y sistemas que utilizan controles de acceso basados en IP.",
        details_es: "### Prueba de Concepto\n[TODO: Proporcionar evidencia de que los paquetes suplantados son aceptados por un sistema objetivo, utilizando una herramienta como hping3 o Scapy.]"
    },
    {
        id: "vuln-net-005",
        title_en: "Denial of Service (DoS)",
        title_es: "Denegación de Servicio (DoS)",
        overview_en: `### Overview
A Denial-of-Service (DoS) attack is an attempt to make a machine or network resource unavailable to its intended users, such as to temporarily or indefinitely interrupt or suspend services of a host connected to the Internet.`,
        overview_es: `### Resumen
Un ataque de denegación de servicio (DoS) es un intento de hacer que una máquina o un recurso de red no esté disponible para sus usuarios previstos, como interrumpir o suspender temporal o indefinidamente los servicios de un host conectado a Internet.`,
        technicalDescription_en: `### Technical Description
DoS attacks are accomplished by flooding the targeted machine or resource with superfluous requests in an attempt to overload systems and prevent some or all legitimate requests from being fulfilled. Common types include SYN floods, UDP floods, and application-layer floods (e.g., HTTP GET floods).`,
        technicalDescription_es: `### Descripción Técnica
Los ataques DoS se logran inundando la máquina o el recurso objetivo con solicitudes superfluas en un intento de sobrecargar los sistemas e impedir que se cumplan algunas o todas las solicitudes legítimas. Los tipos comunes incluyen inundaciones SYN, inundaciones UDP e inundaciones de la capa de aplicación (p. ej., inundaciones HTTP GET).`,
        impact_en: `### Impact
The primary impact is service unavailability, leading to business disruption, financial loss, and reputational damage.`,
        impact_es: `### Impacto
El impacto principal es la falta de disponibilidad del servicio, lo que conduce a la interrupción del negocio, pérdidas financieras y daño a la reputación.`,
        immediateActions_en: "### Immediate Actions\nImplement rate limiting on firewalls and load balancers. Block the source IP addresses identified as part of the attack. Contact your ISP or a DDoS mitigation service for assistance.",
        immediateActions_es: "### Acciones Inmediatas\nImplementar limitación de velocidad en cortafuegos y balanceadores de carga. Bloquear las direcciones IP de origen identificadas como parte del ataque. Ponerse en contacto con su ISP o un servicio de mitigación de DDoS para obtener ayuda.",
        remediation_en: {
            shortTerm: "Use a cloud-based DDoS mitigation service that can absorb and filter malicious traffic before it reaches your network.",
            mediumTerm: "Configure network hardware (routers, firewalls) with anti-DoS settings, such as SYN cookie protection and ingress filtering. Load balance critical services across multiple servers.",
            longTerm: "Design applications to be resilient to resource exhaustion. Implement caching and content delivery networks (CDNs) to reduce the load on origin servers."
        },
        remediation_es: {
            shortTerm: "Utilizar un servicio de mitigación de DDoS basado en la nube que pueda absorber y filtrar el tráfico malicioso antes de que llegue a su red.",
            mediumTerm: "Configurar el hardware de red (enrutadores, cortafuegos) con ajustes anti-DoS, como la protección de cookies SYN y el filtrado de entrada. Balancear la carga de los servicios críticos en varios servidores.",
            longTerm: "Diseñar aplicaciones para que sean resistentes al agotamiento de recursos. Implementar cachés y redes de entrega de contenido (CDN) para reducir la carga en los servidores de origen."
        },
        cwe: "CWE-400",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "N", integrity: "N", availability: "H" },
        references: ["https://www.cisa.gov/news-events/news/understanding-denial-service-attacks"],
        tags: ["Network", "Infrastructure"],
        affectedComponents_en: "### Affected Components\n- [TODO: Specify the targeted servers, services, or network resources.]",
        details_en: "### Proof of Concept\n[TODO: Provide data showing the spike in traffic and corresponding resource exhaustion on the target system. Use tools like hping3 or Slowloris for demonstration.]",
        affectedComponents_es: "### Componentes Afectados\n- [TODO: Especificar los servidores, servicios o recursos de red objetivo.]",
        details_es: "### Prueba de Concepto\n[TODO: Proporcionar datos que muestren el pico de tráfico y el agotamiento de recursos correspondiente en el sistema objetivo. Usar herramientas como hping3 o Slowloris para la demostración.]"
    },
    {
        id: "vuln-net-006",
        title_en: "VLAN Hopping",
        title_es: "Salto entre VLAN",
        overview_en: "### Overview\nVLAN hopping is a computer security attack, which consists of sending packets to a port that is not normally accessible from an end system.",
        overview_es: "### Resumen\nEl salto de VLAN es un ataque de seguridad informática que consiste en enviar paquetes a un puerto que normalmente no es accesible desde un sistema final.",
        technicalDescription_en: "### Technical Description\nThere are two main methods: switch spoofing and double tagging. In switch spoofing, an attacker's machine emulates a switch and uses a trunking protocol like DTP (Dynamic Trunking Protocol) to create a trunk link, giving them access to all VLANs. In double tagging, the attacker adds two VLAN tags to a packet, allowing it to traverse the native VLAN of a trunk and be delivered to a target on a different VLAN.",
        technicalDescription_es: "### Descripción Técnica\nExisten dos métodos principales: suplantación de switch y doble etiquetado. En la suplantación de switch, la máquina de un atacante emula un switch y utiliza un protocolo de enlace troncal como DTP (Protocolo de Enlace Troncal Dinámico) para crear un enlace troncal, lo que le da acceso a todas las VLAN. En el doble etiquetado, el atacante agrega dos etiquetas VLAN a un paquete, lo que le permite atravesar la VLAN nativa de un enlace troncal y ser entregado a un objetivo en una VLAN diferente.",
        impact_en: "### Impact\nSuccessful VLAN hopping allows an attacker on one VLAN to gain unauthorized access to resources on another VLAN, bypassing network segmentation controls.",
        impact_es: "### Impacto\nUn salto de VLAN exitoso permite a un atacante en una VLAN obtener acceso no autorizado a los recursos de otra VLAN, eludiendo los controles de segmentación de la red.",
        immediateActions_en: "### Immediate Actions\nDisable DTP on all user-facing switch ports. Set all unused ports to a disabled state and assign them to an unused, blackhole VLAN.",
        immediateActions_es: "### Acciones Inmediatas\nDeshabilitar DTP en todos los puertos de switch orientados al usuario. Establecer todos los puertos no utilizados en un estado deshabilitado y asignarlos a una VLAN de agujero negro no utilizada.",
        remediation_en: {
            shortTerm: "Explicitly configure user-facing ports as access ports (`switchport mode access`). Avoid using the native VLAN (VLAN 1) for any traffic.",
            mediumTerm: "Implement port security on switches to limit the number of MAC addresses allowed per port.",
            longTerm: "Use private VLANs to further isolate hosts within the same VLAN. Implement 802.1X network access control to authenticate devices before granting network access."
        },
        remediation_es: {
            shortTerm: "Configurar explícitamente los puertos orientados al usuario como puertos de acceso (`switchport mode access`). Evitar el uso de la VLAN nativa (VLAN 1) para cualquier tráfico.",
            mediumTerm: "Implementar seguridad de puertos en los switches para limitar el número de direcciones MAC permitidas por puerto.",
            longTerm: "Usar VLAN privadas para aislar aún más los hosts dentro de la misma VLAN. Implementar el control de acceso a la red 802.1X para autenticar los dispositivos antes de otorgar acceso a la red."
        },
        cwe: "CWE-693",
        severity: "Medium",
        cvss: { score: 6.8, vectorString: "CVSS:3.1/AV:A/AC:H/PR:N/UI:N/S:U/C:H/I:L/A:L", attackVector: "A", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "L", availability: "L" },
        references: ["https://www.cisco.com/c/en/us/support/docs/lan-switching/vlan/10560-14.html"],
        tags: ["Network", "Infrastructure"],
        affectedComponents_en: "### Affected Components\n- Network switches with misconfigured ports.",
        details_en: "### Proof of Concept\n[TODO: Provide steps to perform a VLAN hopping attack using a tool like Yersinia and show access to a resource on a different VLAN.]",
        affectedComponents_es: "### Componentes Afectados\n- Switches de red con puertos mal configurados.",
        details_es: "### Prueba de Concepto\n[TODO: Proporcionar los pasos para realizar un ataque de salto de VLAN utilizando una herramienta como Yersinia y mostrar el acceso a un recurso en una VLAN diferente.]"
    },
    {
        id: "vuln-net-007",
        title_en: "Weak Network Encryption",
        title_es: "Cifrado Débil de Red",
        overview_en: "### Overview\nWeak network encryption refers to the use of outdated or insecure protocols and cipher suites for protecting data in transit, making it susceptible to eavesdropping and decryption.",
        overview_es: "### Resumen\nEl cifrado débil de red se refiere al uso de protocolos y conjuntos de cifrado obsoletos o inseguros para proteger los datos en tránsito, lo que los hace susceptibles a la escucha y el descifrado.",
        technicalDescription_en: "### Technical Description\nThis vulnerability includes supporting weak protocols like SSLv2, SSLv3, or early TLS versions (1.0, 1.1), or using cipher suites with known vulnerabilities (e.g., those using RC4, 3DES, or having small key sizes). An attacker can exploit these weaknesses to decrypt intercepted traffic.",
        technicalDescription_es: "### Descripción Técnica\nEsta vulnerabilidad incluye el soporte de protocolos débiles como SSLv2, SSLv3 o versiones tempranas de TLS (1.0, 1.1), o el uso de conjuntos de cifrado con vulnerabilidades conocidas (p. ej., los que usan RC4, 3DES o tienen tamaños de clave pequeños). Un atacante puede explotar estas debilidades para descifrar el tráfico interceptado.",
        impact_en: "### Impact\nAn attacker can decrypt sensitive data transmitted over the network, including credentials, session tokens, and personal information, leading to a loss of confidentiality and integrity.",
        impact_es: "### Impacto\nUn atacante puede descifrar datos sensibles transmitidos por la red, incluidas credenciales, tokens de sesión e información personal, lo que lleva a una pérdida de confidencialidad e integridad.",
        immediateActions_en: "### Immediate Actions\nImmediately disable support for all known weak protocols (SSLv2, SSLv3, TLS 1.0, TLS 1.1) and insecure cipher suites on all servers and network devices.",
        immediateActions_es: "### Acciones Inmediatas\nDeshabilitar inmediatamente el soporte para todos los protocolos débiles conocidos (SSLv2, SSLv3, TLS 1.0, TLS 1.1) y los conjuntos de cifrado inseguros en todos los servidores y dispositivos de red.",
        remediation_en: {
            shortTerm: "Configure servers to only support strong protocols (TLS 1.2, TLS 1.3) and modern, secure cipher suites with forward secrecy.",
            mediumTerm: "Implement HTTP Strict Transport Security (HSTS) to ensure that browsers always connect using a secure protocol.",
            longTerm: "Establish a corporate policy for cryptographic standards for network communication. Regularly audit all external and internal services for compliance using tools like SSL Labs' SSL Test."
        },
        remediation_es: {
            shortTerm: "Configurar los servidores para que solo admitan protocolos fuertes (TLS 1.2, TLS 1.3) y conjuntos de cifrado modernos y seguros con secreto hacia adelante (forward secrecy).",
            mediumTerm: "Implementar HTTP Strict Transport Security (HSTS) para garantizar que los navegadores siempre se conecten utilizando un protocolo seguro.",
            longTerm: "Establecer una política corporativa para los estándares criptográficos para la comunicación de red. Auditar regularmente todos los servicios externos e internos para verificar el cumplimiento utilizando herramientas como la prueba SSL de SSL Labs."
        },
        cwe: "CWE-326",
        severity: "High",
        cvss: { score: 7.4, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:N", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "N" },
        references: ["https://www.ssllabs.com/projects/best-practices/"],
        tags: ["Network", "Cryptography"],
        affectedComponents_en: "### Affected Components\n- [TODO: List the servers or services that support weak encryption protocols or ciphers.]",
        details_en: "### Proof of Concept\n[TODO: Provide the output of a tool like `nmap --script ssl-enum-ciphers` or a report from SSL Labs showing the weak configurations.]",
        affectedComponents_es: "### Componentes Afectados\n- [TODO: Listar los servidores o servicios que admiten protocolos o conjuntos de cifrado débiles.]",
        details_es: "### Prueba de Concepto\n[TODO: Proporcionar la salida de una herramienta como `nmap --script ssl-enum-ciphers` o un informe de SSL Labs que muestre las configuraciones débiles.]"
    },
    {
        id: "vuln-net-008",
        title_en: "Firewall Misconfiguration",
        title_es: "Configuración Incorrecta del Firewall",
        overview_en: "### Overview\nFirewall misconfigurations, such as overly permissive rules, can expose internal services to the internet or fail to block malicious traffic, undermining the network's perimeter defense.",
        overview_es: "### Resumen\nLas configuraciones incorrectas del firewall, como reglas demasiado permisivas, pueden exponer servicios internos a Internet o no bloquear el tráfico malicioso, socavando la defensa del perímetro de la red.",
        technicalDescription_en: "### Technical Description\nThis can include 'allow any/any' rules, failing to apply egress filtering to prevent data exfiltration, leaving unnecessary ports open to the internet, or not properly logging traffic. Such misconfigurations can render the firewall ineffective.",
        technicalDescription_es: "### Descripción Técnica\nEsto puede incluir reglas de 'permitir cualquiera/cualquiera', no aplicar filtrado de salida para prevenir la exfiltración de datos, dejar puertos innecesarios abiertos a Internet o no registrar el tráfico correctamente. Tales configuraciones incorrectas pueden hacer que el firewall sea ineficaz.",
        impact_en: "### Impact\nAn attacker can bypass the firewall to access internal network resources, exfiltrate data, or launch attacks against other systems. It effectively removes a critical layer of network security.",
        impact_es: "### Impacto\nUn atacante puede eludir el firewall para acceder a los recursos de la red interna, exfiltrar datos o lanzar ataques contra otros sistemas. Elimina eficazmente una capa crítica de seguridad de la red.",
        immediateActions_en: "### Immediate Actions\nConduct an emergency audit of the firewall rulebase. Immediately remove or disable any overly permissive 'allow' rules. Block all traffic by default and only allow what is explicitly required.",
        immediateActions_es: "### Acciones Inmediatas\nRealizar una auditoría de emergencia de la base de reglas del firewall. Eliminar o deshabilitar inmediatamente cualquier regla de 'permitir' demasiado permisiva. Bloquear todo el tráfico por defecto y solo permitir lo que se requiere explícitamente.",
        remediation_en: {
            shortTerm: "Implement a 'deny-by-default' firewall policy. Regularly review and simplify the firewall rulebase to remove unused or redundant rules.",
            mediumTerm: "Implement both ingress and egress filtering. Enable and monitor firewall logs to detect suspicious activity and policy violations.",
            longTerm: "Automate the process of firewall rule review and validation. Use a network security policy management tool to maintain consistency and compliance."
        },
        remediation_es: {
            shortTerm: "Implementar una política de firewall de 'denegar por defecto'. Revisar y simplificar regularmente la base de reglas del firewall para eliminar reglas no utilizadas o redundantes.",
            mediumTerm: "Implementar tanto el filtrado de entrada como el de salida. Habilitar y monitorear los registros del firewall para detectar actividades sospechosas y violaciones de políticas.",
            longTerm: "Automatizar el proceso de revisión y validación de reglas de firewall. Usar una herramienta de gestión de políticas de seguridad de red para mantener la coherencia y el cumplimiento."
        },
        cwe: "CWE-552",
        severity: "High",
        cvss: { score: 8.6, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:N/A:L", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "C", confidentiality: "H", integrity: "N", availability: "L" },
        references: ["https://www.cisa.gov/uscert/bsi/articles/best-practices/firewalls/securing-your-web-server"],
        tags: ["Network", "Infrastructure"],
        affectedComponents_en: "### Affected Components\n- The corporate firewall(s).",
        details_en: "### Proof of Concept\n[TODO: Provide a screenshot of the firewall rulebase showing the permissive rule, or demonstrate access to a supposedly blocked port/service.]",
        affectedComponents_es: "### Componentes Afectados\n- El/los firewall(s) corporativo(s).",
        details_es: "### Prueba de Concepto\n[TODO: Proporcionar una captura de pantalla de la base de reglas del firewall que muestre la regla permisiva, o demostrar el acceso a un puerto/servicio supuestamente bloqueado.]"
    },
    {
        id: "vuln-net-009",
        title_en: "Unsecured Wi-Fi",
        title_es: "Wi-Fi no Segura",
        overview_en: "### Overview\nUnsecured or weakly secured Wi-Fi networks allow unauthorized users to connect to the network and can enable attackers to eavesdrop on all network traffic.",
        overview_es: "### Resumen\nLas redes Wi-Fi no seguras o débilmente seguras permiten a usuarios no autorizados conectarse a la red y pueden permitir a los atacantes escuchar todo el tráfico de la red.",
        technicalDescription_en: "### Technical Description\nThis includes open Wi-Fi networks with no password, or networks using outdated and broken encryption protocols like WEP or WPA. Even WPA2 networks with weak, easily guessable pre-shared keys are vulnerable to offline dictionary attacks.",
        technicalDescription_es: "### Descripción Técnica\nEsto incluye redes Wi-Fi abiertas sin contraseña, o redes que utilizan protocolos de cifrado obsoletos y rotos como WEP o WPA. Incluso las redes WPA2 con claves pre-compartidas débiles y fáciles de adivinar son vulnerables a ataques de diccionario sin conexión.",
        impact_en: "### Impact\nAn attacker can gain unauthorized access to the internal network, intercept sensitive data transmitted by legitimate users, and launch further attacks against internal systems.",
        impact_es: "### Impacto\nUn atacante puede obtener acceso no autorizado a la red interna, interceptar datos sensibles transmitidos por usuarios legítimos y lanzar más ataques contra los sistemas internos.",
        immediateActions_en: "### Immediate Actions\nImmediately secure all open Wi-Fi networks. Change the pre-shared key on any network using a weak password. Disable outdated protocols like WEP and WPA.",
        immediateActions_es: "### Acciones Inmediatas\nAsegurar inmediatamente todas las redes Wi-Fi abiertas. Cambiar la clave pre-compartida en cualquier red que utilice una contraseña débil. Deshabilitar protocolos obsoletos como WEP y WPA.",
        remediation_en: {
            shortTerm: "Use WPA3 encryption for all Wi-Fi networks. If WPA3 is not available, use WPA2 with a strong, long, and complex pre-shared key.",
            mediumTerm: "Implement a guest network that is completely segregated from the internal corporate network for visitors and non-corporate devices.",
            longTerm: "Implement enterprise-level Wi-Fi security using 802.1X, which authenticates each user individually (e.g., with a username and password) rather than using a shared key."
        },
        remediation_es: {
            shortTerm: "Utilizar cifrado WPA3 para todas las redes Wi-Fi. Si WPA3 no está disponible, usar WPA2 con una clave pre-compartida fuerte, larga y compleja.",
            mediumTerm: "Implementar una red de invitados que esté completamente segregada de la red corporativa interna para visitantes y dispositivos no corporativos.",
            longTerm: "Implementar seguridad Wi-Fi de nivel empresarial utilizando 802.1X, que autentica a cada usuario individualmente (p. ej., con un nombre de usuario y contraseña) en lugar de usar una clave compartida."
        },
        cwe: "CWE-311",
        severity: "High",
        cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:A/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "A", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        references: ["https://www.cisa.gov/news-events/news/securing-wireless-networks"],
        tags: ["Network"],
        affectedComponents_en: `### Affected Components
- [TODO: Specify the SSID of the insecure Wi-Fi network.]`,
        details_en: `### Proof of Concept
[TODO: Provide evidence of connecting to the unsecured network or cracking a weak WPA2 password using a tool like Aircrack-ng.]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Especificar el SSID de la red Wi-Fi insegura.]`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar evidencia de la conexión a la red no segura o del descifrado de una contraseña WPA2 débil utilizando una herramienta como Aircrack-ng.]`
    },
    {
        id: "vuln-net-010",
        title_en: "Packet Sniffing",
        title_es: "Análisis de Paquetes",
        overview_en: "### Overview\nPacket sniffing is the act of capturing and inspecting data packets as they travel across a network. When traffic is unencrypted, an attacker can read sensitive information.",
        overview_es: "### Resumen\nEl análisis de paquetes es el acto de capturar e inspeccionar paquetes de datos mientras viajan a través de una red. Cuando el tráfico no está cifrado, un atacante puede leer información sensible.",
        technicalDescription_en: "### Technical Description\nAn attacker in a privileged network position (e.g., on the same LAN or Wi-Fi, or having compromised a network device) can use a network protocol analyzer (like Wireshark) to capture all traffic. If applications use unencrypted protocols like HTTP, FTP, or Telnet, any transmitted data, including usernames and passwords, is visible in cleartext.",
        technicalDescription_es: "### Descripción Técnica\nUn atacante en una posición de red privilegiada (p. ej., en la misma LAN o Wi-Fi, o habiendo comprometido un dispositivo de red) puede usar un analizador de protocolos de red (como Wireshark) para capturar todo el tráfico. Si las aplicaciones utilizan protocolos no cifrados como HTTP, FTP o Telnet, cualquier dato transmitido, incluidos los nombres de usuario y las contraseñas, es visible en texto claro.",
        impact_en: "### Impact\nThis leads to a complete loss of confidentiality for any data transmitted over unencrypted channels. It can result in the compromise of credentials, session tokens, and sensitive business or personal information.",
        impact_es: "### Impacto\nEsto conduce a una pérdida total de la confidencialidad de cualquier dato transmitido a través de canales no cifrados. Puede resultar en el compromiso de credenciales, tokens de sesión e información comercial o personal sensible.",
        immediateActions_en: "### Immediate Actions\nIdentify all services using unencrypted protocols and prioritize migrating them to secure alternatives (e.g., HTTP to HTTPS, FTP to SFTP).",
        immediateActions_es: "### Acciones Inmediatas\nIdentificar todos los servicios que utilizan protocolos no cifrados y priorizar su migración a alternativas seguras (p. ej., HTTP a HTTPS, FTP a SFTP).",
        remediation_en: {
            shortTerm: "Enforce the use of strong, end-to-end encryption (e.g., TLS 1.2+) for all data in transit, both on internal and external networks.",
            mediumTerm: "Disable and decommission all legacy, unencrypted protocols within the environment.",
            longTerm: "Implement network segmentation and a 'zero-trust' network model, where traffic between different network segments is also encrypted and inspected."
        },
        remediation_es: {
            shortTerm: "Hacer cumplir el uso de un cifrado fuerte de extremo a extremo (p. ej., TLS 1.2+) para todos los datos en tránsito, tanto en redes internas como externas.",
            mediumTerm: "Deshabilitar y dar de baja todos los protocolos heredados y no cifrados dentro del entorno.",
            longTerm: "Implementar la segmentación de la red y un modelo de red de 'confianza cero', donde el tráfico entre diferentes segmentos de red también se cifra e inspecciona."
        },
        cwe: "CWE-311",
        severity: "Medium",
        cvss: { score: 6.8, vectorString: "CVSS:3.1/AV:A/AC:L/PR:N/UI:N/S:U/C:H/I:L/A:N", attackVector: "A", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "L", availability: "N" },
        references: ["https://www.wireshark.org/"],
        tags: ["Network"],
        affectedComponents_en: `### Affected Components
- [TODO: List the applications or services that use unencrypted protocols.]`,
        details_en: `### Proof of Concept
[TODO: Provide a screenshot from Wireshark or a similar tool showing captured sensitive data in cleartext.]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Listar las aplicaciones o servicios que utilizan protocolos no cifrados.]`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar una captura de pantalla de Wireshark o una herramienta similar que muestre datos sensibles capturados en texto claro.]`
    },
    // --- INFRASTRUCTURE VULNERABILITIES ---
    {
        id: "vuln-infra-001",
        title_en: "Unpatched Software",
        title_es: "Software sin Parches",
        overview_en: `### Overview
Running outdated software with known vulnerabilities is one of the most common and critical security risks. Attackers can exploit these known flaws to compromise systems.`,
        overview_es: `### Resumen
Ejecutar software desactualizado con vulnerabilidades conocidas es uno de los riesgos de seguridad más comunes y críticos. Los atacantes pueden explotar estas fallas conocidas para comprometer los sistemas.`,
        technicalDescription_en: `### Technical Description
The infrastructure relies on a version of a service (e.g., Apache, OpenSSH, a specific library) that has publicly disclosed vulnerabilities. An attacker can use automated tools to scan for these vulnerable versions and then use publicly available exploit code to gain access.`,
        technicalDescription_es: `### Descripción Técnica
La infraestructura se basa en una versión de un servicio (p. ej., Apache, OpenSSH, una biblioteca específica) que tiene vulnerabilidades divulgadas públicamente. Un atacante puede usar herramientas automatizadas para escanear estas versiones vulnerables y luego usar código de explotación disponible públicamente para obtener acceso.`,
        impact_en: `### Impact
The impact can range from denial-of-service to full remote code execution, depending on the nature of the vulnerability in the unpatched software. This can lead to a complete compromise of the affected server and potentially the entire network.`,
        impact_es: `### Impacto
El impacto puede variar desde la denegación de servicio hasta la ejecución remota de código completa, dependiendo de la naturaleza de la vulnerabilidad en el software sin parches. Esto puede llevar a un compromiso completo del servidor afectado y potencialmente de toda la red.`,
        immediateActions_en: "### Immediate Actions\nImmediately apply the latest security patches to the vulnerable software. If a patch is not available, restrict access to the vulnerable service or take it offline until it can be patched.",
        immediateActions_es: "### Acciones Inmediatas\nAplicar inmediatamente los últimos parches de seguridad al software vulnerable. Si no hay un parche disponible, restringir el acceso al servicio vulnerable o desconectarlo hasta que pueda ser parcheado.",
        remediation_en: {
            shortTerm: "Establish a robust patch management policy and process. Subscribe to security advisories for all software used in the environment.",
            mediumTerm: "Implement an automated patch management system to ensure that patches are applied in a timely manner. Use a vulnerability scanner to regularly scan the infrastructure for unpatched software.",
            longTerm: "Integrate vulnerability scanning into the CI/CD pipeline. Use software composition analysis (SCA) tools to identify and manage vulnerabilities in third-party libraries."
        },
        remediation_es: {
            shortTerm: "Establecer una política y un proceso de gestión de parches sólidos. Suscribirse a los avisos de seguridad de todo el software utilizado en el entorno.",
            mediumTerm: "Implementar un sistema de gestión de parches automatizado para garantizar que los parches se apliquen de manera oportuna. Usar un escáner de vulnerabilidades para escanear regularmente la infraestructura en busca de software sin parches.",
            longTerm: "Integrar el escaneo deulnerabilidades en el pipeline de CI/CD. Usar herramientas de análisis de composición de software (SCA) para identificar y gestionar las vulnerabilidades en las bibliotecas de terceros."
        },
        cwe: "CWE-937",
        severity: "Critical",
        cvss: { score: 9.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        references: ["https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/"],
        tags: ["Infrastructure"],
        affectedComponents_en: `### Affected Components
- [TODO: List the unpatched software, its version, and the server(s) it is running on.]`,
        details_en: `### Proof of Concept
[TODO: Provide the steps to exploit the vulnerability, including any public exploit code used and screenshots showing the compromise.]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Listar el software sin parches, su versión y el/los servidor(es) en el/los que se está ejecutando.]`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar los pasos para explotar la vulnerabilidad, incluido cualquier código de explotación público utilizado y capturas de pantalla que muestren el compromiso.]`
    },
    {
        id: "vuln-infra-002",
        title_en: "Default Credentials",
        title_es: "Credenciales por Defecto",
        overview_en: "### Overview\nMany systems, devices, and applications are shipped with default usernames and passwords. Failure to change these credentials leaves an easy entry point for attackers.",
        overview_es: "### Resumen\nMuchos sistemas, dispositivos y aplicaciones se entregan con nombres de usuario y contraseñas predeterminados. No cambiar estas credenciales deja un punto de entrada fácil para los atacantes.",
        technicalDescription_en: "### Technical Description\nAn administrator or user fails to change the default credentials for a piece of software or hardware (e.g., admin/admin on a router, administrator/password on a web application). Attackers can use automated scanners to find systems with these default credentials and gain immediate administrative access.",
        technicalDescription_es: "### Descripción Técnica\nUn administrador o usuario no cambia las credenciales predeterminadas de un software o hardware (p. ej., admin/admin en un enrutador, administrator/password en una aplicación web). Los atacantes pueden usar escáneres automatizados para encontrar sistemas con estas credenciales predeterminadas y obtener acceso administrativo inmediato.",
        impact_en: "### Impact\nAn attacker can gain full administrative control of the affected system, leading to data theft, system compromise, and a pivot point to attack other systems on the network.",
        impact_es: "### Impacto\nUn atacante puede obtener el control administrativo total del sistema afectado, lo que conduce al robo de datos, el compromiso del sistema y un punto de pivote para atacar otros sistemas en la red.",
        immediateActions_en: "### Immediate Actions\nImmediately change all default credentials on all systems. If the credentials cannot be changed, restrict network access to the device or take it offline.",
        immediateActions_es: "### Acciones Inmediatas\nCambiar inmediatamente todas las credenciales predeterminadas en todos los sistemas. Si las credenciales no se pueden cambiar, restringir el acceso a la red del dispositivo o desconectarlo.",
        remediation_en: {
            shortTerm: "Audit the entire infrastructure for any use of default credentials and change them to strong, unique passwords.",
            mediumTerm: "Incorporate checks for default credentials into the standard build and deployment process for all new systems.",
            longTerm: "Automate scanning for default credentials across the environment. Implement a policy that prohibits the deployment of any system with default credentials active."
        },
        remediation_es: {
            shortTerm: "Auditar toda la infraestructura en busca de cualquier uso de credenciales predeterminadas y cambiarlas por contraseñas seguras y únicas.",
            mediumTerm: "Incorporar comprobaciones de credenciales predeterminadas en el proceso de compilación e implementación estándar para todos los sistemas nuevos.",
            longTerm: "Automatizar el escaneo en busca de credenciales predeterminadas en todo el entorno. Implementar una política que prohíba la implementación de cualquier sistema con credenciales predeterminadas activas."
        },
        cwe: "CWE-1393",
        severity: "Critical",
        cvss: { score: 9.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        references: ["https://cwe.mitre.org/data/definitions/1393.html"],
        tags: ["Infrastructure", "Authentication"],
        affectedComponents_en: `### Affected Components
- [TODO: List the systems or devices using default credentials.]`,
        details_en: `### Proof of Concept
[TODO: Provide a screenshot of a successful login using the default credentials.]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Listar los sistemas o dispositivos que utilizan credenciales predeterminadas.]`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar una captura de pantalla de un inicio de sesión exitoso utilizando las credenciales predeterminadas.]`
    },
    {
        id: "vuln-infra-003",
        title_en: "Directory Traversal",
        title_es: "Salto de Directorio",
        overview_en: `### Overview
Directory traversal (or path traversal) is a web security vulnerability that allows an attacker to read arbitrary files on the server that is running an application. This might include application code and data, credentials for back-end systems, and sensitive operating system files.`,
        overview_es: `### Resumen
El salto de directorio (o path traversal) es una vulnerabilidad de seguridad web que permite a un atacante leer archivos arbitrarios en el servidor que ejecuta una aplicación. Esto puede incluir código y datos de la aplicación, credenciales para sistemas de backend y archivos sensibles del sistema operativo.`,
        technicalDescription_en: `### Technical Description
The vulnerability occurs when the application uses user-supplied input to construct a file path without properly sanitizing it. By using \`../\` sequences, an attacker can navigate outside of the intended directory and access files elsewhere on the filesystem.`,
        technicalDescription_es: `### Descripción Técnica
La vulnerabilidad ocurre cuando la aplicación utiliza la entrada proporcionada por el usuario para construir una ruta de archivo sin sanearla adecuadamente. Al usar secuencias \`../\`, un atacante puede navegar fuera del directorio previsto y acceder a archivos en otras partes del sistema de archivos.`,
        impact_en: `### Impact
Allows an attacker to read sensitive information from the server's filesystem, including application source code, configuration files with credentials, and OS files like \`/etc/passwd\`.`,
        impact_es: `### Impacto
Permite a un atacante leer información sensible del sistema de archivos del servidor, incluido el código fuente de la aplicación, archivos de configuración con credenciales y archivos del sistema operativo como \`/etc/passwd\`.`,
        immediateActions_en: "### Immediate Actions\nImplement input validation to strip or block directory traversal sequences (`../`, `..\\`).",
        immediateActions_es: "### Acciones Inmediatas\nImplementar la validación de entradas para eliminar o bloquear las secuencias de salto de directorio (`../`, `..\\`).",
        remediation_en: {
            shortTerm: "Validate user input against a strict allow-list of characters or file paths. Ideally, do not pass user input directly to filesystem APIs.",
            mediumTerm: "Use a mapping mechanism where user input corresponds to a predefined, safe file path on the server.",
            longTerm: "Run the application with the minimum necessary filesystem permissions in a chrooted or sandboxed environment to limit the scope of a potential traversal attack."
        },
        remediation_es: {
            shortTerm: "Validar la entrada del usuario contra una lista blanca estricta de caracteres o rutas de archivo. Idealmente, no pasar la entrada del usuario directamente a las API del sistema de archivos.",
            mediumTerm: "Usar un mecanismo de mapeo donde la entrada del usuario corresponda a una ruta de archivo predefinida y segura en el servidor.",
            longTerm: "Ejecutar la aplicación con los permisos mínimos necesarios del sistema de archivos en un entorno chroot o sandbox para limitar el alcance de un posible ataque de salto."
        },
        cwe: "CWE-22",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        references: ["https://owasp.org/www-community/attacks/Path_Traversal"],
        tags: ["Infrastructure", "Web"],
        affectedComponents_en: `### Affected Components
- [TODO: List the vulnerable URL and parameter.]`,
        details_en: `### Proof of Concept
[TODO: Provide a request with a path traversal payload and show the contents of a sensitive file in the response.]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Listar la URL y el parámetro vulnerables.]`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar una solicitud con una carga útil de salto de ruta y mostrar el contenido de un archivo sensible en la respuesta.]`
    },
    {
        id: "vuln-infra-004",
        title_en: "Remote Code Execution (RCE)",
        title_es: "Ejecución Remota de Código (RCE)",
        overview_en: `### Overview
Remote Code Execution (RCE) is a class of vulnerability that allows an attacker to execute arbitrary commands or code on a target machine or in a target process. It is one of the most critical vulnerabilities.`,
        overview_es: `### Resumen
La Ejecución Remota de Código (RCE) es una clase de vulnerabilidad que permite a un atacante ejecutar comandos o código arbitrario en una máquina objetivo o en un proceso objetivo. Es una de las vulnerabilidades más críticas.`,
        technicalDescription_en: `### Technical Description
RCE vulnerabilities can arise from various sources, including command injection, insecure deserialization, memory corruption bugs (like buffer overflows), or unrestricted file uploads that allow an attacker to upload and execute a web shell.`,
        technicalDescription_es: `### Descripción Técnica
Las vulnerabilidades de RCE pueden surgir de varias fuentes, incluida la inyección de comandos, la deserialización insegura, los errores de corrupción de memoria (como los desbordamientos de búfer) o las cargas de archivos sin restricciones que permiten a un atacante cargar y ejecutar una shell web.`,
        impact_en: `### Impact
A successful RCE attack provides an attacker with complete control over the affected system, allowing them to steal data, install malware, pivot to other systems on the network, or cause a denial of service.`,
        impact_es: `### Impacto
Un ataque RCE exitoso proporciona a un atacante el control total sobre el sistema afectado, lo que le permite robar datos, instalar malware, pivotar hacia otros sistemas en la red o causar una denegación de servicio.`,
        immediateActions_en: "### Immediate Actions\nImmediately take the compromised system offline to contain the breach. Isolate it from the rest of the network. Begin forensic analysis to determine the scope of the compromise.",
        immediateActions_es: "### Acciones Inmediatas\nDesconectar inmediatamente el sistema comprometido para contener la brecha. Aislarlo del resto de la red. Comenzar el análisis forense para determinar el alcance del compromiso.",
        remediation_en: {
            shortTerm: "Patch the underlying vulnerability that led to RCE. This could involve updating software, fixing an injection flaw, or disabling the vulnerable feature.",
            mediumTerm: "Implement the principle of least privilege. Run application processes with the minimum necessary permissions to limit the impact of a potential RCE.",
            longTerm: "Use a Web Application Firewall (WAF) to block common attack patterns. Implement egress filtering to prevent compromised systems from communicating with attacker-controlled servers."
        },
        remediation_es: {
            shortTerm: "Parchear la vulnerabilidad subyacente que condujo a la RCE. Esto podría implicar la actualización del software, la corrección de una falla de inyección o la desactivación de la función vulnerable.",
            mediumTerm: "Implementar el principio de privilegio mínimo. Ejecutar los procesos de la aplicación con los permisos mínimos necesarios para limitar el impacto de una posible RCE.",
            longTerm: "Usar un Web Application Firewall (WAF) para bloquear los patrones de ataque comunes. Implementar el filtrado de salida para evitar que los sistemas comprometidos se comuniquen con los servidores controlados por el atacante."
        },
        cwe: "CWE-94",
        severity: "Critical",
        cvss: { score: 9.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        references: ["https://owasp.org/www-community/attacks/Code_Injection"],
        tags: ["Infrastructure", "Web"],
        affectedComponents_en: `### Affected Components
- [TODO: Specify the system and vulnerability that allows RCE.]`,
        details_en: "### Proof of Concept\n[TODO: Provide the steps taken to achieve remote code execution and show the output of a command (e.g., \\`whoami\\`, \\`id\\`) running on the target server.]",
        affectedComponents_es: `### Componentes Afectados
- [TODO: Especificar el sistema y la vulnerabilidad que permite la RCE.]`,
        details_es: "### Prueba de Concepto\n[TODO: Proporcionar los pasos seguidos para lograr la ejecución remota de código y mostrar la salida de un comando (p. ej., \\`whoami\\`, \\`id\\`) ejecutándose en el servidor objetivo.]"
    },
    {
        id: "vuln-infra-005",
        title_en: "Privilege Escalation",
        title_es: "Escalación de Privilegios",
        overview_en: "### Overview\nPrivilege escalation is the act of exploiting a bug, design flaw, or configuration oversight in an operating system or software application to gain elevated access to resources that are normally protected from an application or user.",
        overview_es: "### Resumen\nLa escalada de privilegios es el acto de explotar un error, un defecto de diseño o una supervisión de configuración en un sistema operativo o una aplicación de software para obtener acceso elevado a recursos que normalmente están protegidos de una aplicación o usuario.",
        technicalDescription_en: "### Technical Description\nThis can occur in two forms: Vertical privilege escalation, where a lower-privilege user gains higher-privilege access (e.g., user to root), and horizontal privilege escalation, where a user gains access to resources belonging to another user. Common vectors include misconfigured SUID binaries, kernel exploits, services running with excessive privileges, and weak file permissions.",
        technicalDescription_es: "### Descripción Técnica\nEsto puede ocurrir de dos formas: escalada de privilegios vertical, donde un usuario de bajos privilegios obtiene acceso de mayores privilegios (p. ej., de usuario a root), y escalada de privilegios horizontal, donde un usuario obtiene acceso a recursos que pertenecen a otro usuario. Los vectores comunes incluyen binarios SUID mal configurados, exploits del kernel, servicios que se ejecutan con privilegios excesivos y permisos de archivo débiles.",
        impact_en: "### Impact\nSuccessful privilege escalation can result in an attacker gaining full administrative control over a system, allowing them to install persistent backdoors, steal all data on the system, and use it as a launchpad for further attacks.",
        impact_es: "### Impacto\nUna escalada de privilegios exitosa puede resultar en que un atacante obtenga el control administrativo total sobre un sistema, lo que le permite instalar puertas traseras persistentes, robar todos los datos del sistema y usarlo como plataforma de lanzamiento para nuevos ataques.",
        immediateActions_en: "### Immediate Actions\nIdentify the escalation vector. If it's a misconfigured service or file, correct the permissions immediately. If it's a kernel vulnerability, isolate the machine and prepare to apply patches.",
        immediateActions_es: "### Acciones Inmediatas\nIdentificar el vector de escalada. Si se trata de un servicio o archivo mal configurado, corregir los permisos de inmediato. Si es una vulnerabilidad del kernel, aislar la máquina y prepararse para aplicar parches.",
        remediation_en: {
            shortTerm: "Apply the principle of least privilege to all users, processes, and files. Regularly audit SUID/GUID binaries and file permissions.",
            mediumTerm: "Keep the operating system and all software fully patched to protect against kernel and software exploits.",
            longTerm: "Use mandatory access control systems like SELinux or AppArmor to enforce strict boundaries on what processes can do, even if they are compromised."
        },
        remediation_es: {
            shortTerm: "Aplicar el principio de privilegio mínimo a todos los usuarios, procesos y archivos. Auditar regularmente los binarios SUID/GUID y los permisos de los archivos.",
            mediumTerm: "Mantener el sistema operativo y todo el software completamente parcheados para protegerse contra exploits del kernel y de software.",
            longTerm: "Utilizar sistemas de control de acceso obligatorio como SELinux o AppArmor para imponer límites estrictos sobre lo que pueden hacer los procesos, incluso si están comprometidos."
        },
        cwe: "CWE-269",
        severity: "High",
        cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "L", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        references: ["https://attack.mitre.org/tactics/TA0004/"],
        tags: ["Infrastructure"],
        affectedComponents_en: `### Affected Components
- [TODO: Specify the operating system or application and the specific misconfiguration or vulnerability that allows privilege escalation.]`,
        details_en: `### Proof of Concept
[TODO: Provide the sequence of commands used to escalate privileges and show the output of \`whoami\` or \`id\` as the high-privilege user.]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Especificar el sistema operativo o la aplicación y la configuración incorrecta o vulnerabilidad específica que permite la escalada de privilegios.]`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar la secuencia de comandos utilizados para escalar privilegios y mostrar la salida de \`whoami\` o \`id\` como el usuario de altos privilegios.]`
    },
    {
        id: "vuln-infra-006",
        title_en: "Information Disclosure",
        title_es: "Divulgación de Información",
        overview_en: "### Overview\nInformation disclosure vulnerabilities allow an attacker to gain sensitive information about a system, its configuration, or its users, which can be used to facilitate other attacks.",
        overview_es: "### Resumen\nLas vulnerabilidades de divulgación de información permiten a un atacante obtener información sensible sobre un sistema, su configuración o sus usuarios, que puede ser utilizada para facilitar otros ataques.",
        technicalDescription_en: "### Technical Description\nThis can happen through verbose error messages that reveal stack traces or database errors, software version banners that reveal unpatched components, exposed debugging endpoints, or publicly accessible configuration files and source code repositories (e.g., exposed `.git` directory).",
        technicalDescription_es: "### Descripción Técnica\nEsto puede suceder a través de mensajes de error detallados que revelan seguimientos de pila o errores de base de datos, banners de versión de software que revelan componentes sin parches, puntos finales de depuración expuestos o archivos de configuración y repositorios de código fuente de acceso público (p. ej., directorio `.git` expuesto).",
        impact_en: "### Impact\nWhile often a lower-severity finding on its own, information disclosure provides attackers with valuable intelligence for planning more targeted and effective attacks. It can expose software versions, internal paths, and business logic.",
        impact_es: "### Impacto\nAunque a menudo es un hallazgo de menor gravedad por sí solo, la divulgación de información proporciona a los atacantes una inteligencia valiosa para planificar ataques más dirigidos y efectivos. Puede exponer versiones de software, rutas internas y lógica de negocio.",
        immediateActions_en: "### Immediate Actions\nConfigure the application and web server to return generic, non-detailed error messages. Remove or restrict access to any exposed sensitive files or directories.",
        immediateActions_es: "### Acciones Inmediatas\nConfigurar la aplicación y el servidor web para que devuelvan mensajes de error genéricos y no detallados. Eliminar o restringir el acceso a cualquier archivo o directorio sensible expuesto.",
        remediation_en: {
            shortTerm: "Disable verbose error reporting in production environments. Configure web servers to suppress software version banners.",
            mediumTerm: "Ensure that sensitive files, configuration files, and source code repositories are not accessible from the web root.",
            longTerm: "Implement a standardized logging mechanism that captures detailed errors for internal analysis but does not expose them to users. Regularly scan for information disclosure vulnerabilities."
        },
        remediation_es: {
            shortTerm: "Deshabilitar los informes de errores detallados en los entornos de producción. Configurar los servidores web para suprimir los banners de versión de software.",
            mediumTerm: "Asegurarse de que los archivos sensibles, los archivos de configuración y los repositorios de código fuente no sean accesibles desde la raíz web.",
            longTerm: "Implementar un mecanismo de registro estandarizado que capture errores detallados para el análisis interno pero no los exponga a los usuarios. Escanear regularmente en busca de vulnerabilidades de divulgación de información."
        },
        cwe: "CWE-200",
        severity: "Medium",
        cvss: { score: 5.3, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "N", availability: "N" },
        references: ["https://owasp.org/Top10/A01_2021-Broken_Access_Control/"],
        tags: ["Infrastructure", "Web"],
        affectedComponents_en: `### Affected Components
- [TODO: Specify what information is being disclosed and where (e.g., error page, server header, .git directory).]`,
        details_en: `### Proof of Concept
[TODO: Provide a screenshot or server response that shows the disclosed information.]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Especificar qué información se está divulgando y dónde (p. ej., página de error, encabezado del servidor, directorio .git).]`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar una captura de pantalla o respuesta del servidor que muestre la información divulgada.]`
    },
    {
        id: "vuln-infra-007",
        title_en: "Command Injection",
        title_es: "Inyección de Comandos",
        overview_en: "### Overview\nCommand injection is an attack in which the goal is the execution of arbitrary commands on the host operating system via a vulnerable application. Command injection attacks are possible when an application passes unsafe user-supplied data (forms, cookies, HTTP headers, etc.) to a system shell.",
        overview_es: "### Resumen\nLa inyección de comandos es un ataque en el que el objetivo es la ejecución de comandos arbitrarios en el sistema operativo anfitrión a través de una aplicación vulnerable. Los ataques de inyección de comandos son posibles cuando una aplicación pasa datos no seguros suministrados por el usuario (formularios, cookies, encabezados HTTP, etc.) a una shell del sistema.",
        technicalDescription_en: "### Technical Description\nThe application code contains a call to a system command and incorporates user-supplied data into the command string without proper sanitization. An attacker can use shell metacharacters like `;`, `|`, `&&`, or `||` to append new commands to the original one.",
        technicalDescription_es: "### Descripción Técnica\nEl código de la aplicación contiene una llamada a un comando del sistema e incorpora datos suministrados por el usuario en la cadena del comando sin una sanitización adecuada. Un atacante puede usar metacaracteres de la shell como `;`, `|`, `&&` o `||` para agregar nuevos comandos al original.",
        impact_en: "### Impact\nThis vulnerability can lead to full remote code execution on the server, with the privileges of the application process. This allows an attacker to compromise the server, steal data, and pivot to other systems on the network.",
        impact_es: "### Impacto\nEsta vulnerabilidad puede conducir a la ejecución remota completa de código en el servidor, con los privilegios del proceso de la aplicación. Esto permite a un atacante comprometer el servidor, robar datos y pivotar hacia otros sistemas en la red.",
        immediateActions_en: "### Immediate Actions\nIdentify the vulnerable parameter and implement strict input validation to block shell metacharacters. If possible, temporarily disable the vulnerable functionality.",
        immediateActions_es: "### Acciones Inmediatas\nIdentificar el parámetro vulnerable e implementar una validación de entrada estricta para bloquear los metacaracteres de la shell. Si es posible, deshabilitar temporalmente la funcionalidad vulnerable.",
        remediation_en: {
            shortTerm: "Never call system shell commands with user-supplied input. Use built-in language functions or libraries that provide the required functionality without invoking a shell.",
            mediumTerm: "If calling a system command is unavoidable, use structured APIs that accept a list of arguments rather than a single command string. This prevents the shell from interpreting metacharacters.",
            longTerm: "Run the application with the minimum privileges necessary. Implement a Web Application Firewall (WAF) with rules to detect and block command injection attempts."
        },
        remediation_es: {
            shortTerm: "Nunca llamar a comandos de la shell del sistema con datos suministrados por el usuario. Usar funciones o bibliotecas integradas del lenguaje que proporcionen la funcionalidad requerida sin invocar una shell.",
            mediumTerm: "Si es inevitable llamar a un comando del sistema, usar API estructuradas que acepten una lista de argumentos en lugar de una sola cadena de comando. Esto evita que la shell interprete los metacaracteres.",
            longTerm: "Ejecutar la aplicación con los privilegios mínimos necesarios. Implementar un Web Application Firewall (WAF) con reglas para detectar y bloquear intentos de inyección de comandos."
        },
        cwe: "CWE-77",
        severity: "Critical",
        cvss: { score: 9.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        references: ["https://owasp.org/www-community/attacks/Command_Injection"],
        tags: ["Infrastructure", "Web"],
        affectedComponents_en: `### Affected Components
- [TODO: Specify the vulnerable function, parameter, and URL.]`,
        details_en: `### Proof of Concept
[TODO: Provide a request with a command injection payload (e.g., \`; id\`) and show the command output in the response.]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Especificar la función, el parámetro y la URL vulnerables.]`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar una solicitud con una carga útil de inyección de comandos (p. ej., \`; id\`) y mostrar la salida del comando en la respuesta.]`
    },
    {
        id: "vuln-infra-008",
        title_en: "Path Traversal",
        title_es: "Salto de Ruta",
        overview_en: "### Overview\nPath Traversal (also known as Directory Traversal) is a web security vulnerability that allows an attacker to read arbitrary files on the server that is running an application.",
        overview_es: "### Resumen\nEl Salto de Ruta (o Salto de Directorio) es una vulnerabilidad de seguridad web que permite a un atacante leer archivos arbitrarios en el servidor que ejecuta una aplicación.",
        technicalDescription_en: "### Technical Description\nThe vulnerability occurs when an application uses user-supplied input to construct a file path for reading or writing without proper sanitization. By using `../` sequences and other special characters, an attacker can navigate out of the intended directory and access sensitive files elsewhere on the filesystem.",
        technicalDescription_es: "### Descripción Técnica\nLa vulnerabilidad ocurre cuando una aplicación utiliza la entrada proporcionada por el usuario para construir una ruta de archivo para leer o escribir sin una sanitización adecuada. Al usar secuencias `../` y otros caracteres especiales, un atacante puede navegar fuera del directorio previsto y acceder a archivos sensibles en otras partes del sistema de archivos.",
        impact_en: "### Impact\nAllows an attacker to read sensitive information, such as application source code, configuration files containing credentials, and operating system files. In some cases, it may also allow writing to arbitrary files, leading to remote code execution.",
        impact_es: "### Impacto\nPermite a un atacante leer información sensible, como el código fuente de la aplicación, archivos de configuración que contienen credenciales y archivos del sistema operativo. En algunos casos, también puede permitir escribir en archivos arbitrarios, lo que conduce a la ejecución remota de código.",
        immediateActions_en: "### Immediate Actions\nImplement strong input validation to strip or block directory traversal sequences (`../`, `..\\`) and null byte characters (`%00`).",
        immediateActions_es: "### Acciones Inmediatas\nImplementar una validación de entrada estricta para eliminar o bloquear las secuencias de salto de directorio (`../`, `..\\`) y los caracteres de byte nulo (`%00`).",
        remediation_en: {
            shortTerm: "Avoid passing user-supplied input to filesystem APIs entirely. Use an allow-list of safe, known file identifiers instead.",
            mediumTerm: "If user input in file paths is unavoidable, ensure the application canonicalizes the path and verifies that it starts with the expected base directory before using it.",
            longTerm: "Run the application in a sandboxed or chrooted jail with minimal filesystem access to limit the impact of a successful traversal attack."
        },
        remediation_es: {
            shortTerm: "Evitar por completo pasar la entrada proporcionada por el usuario a las API del sistema de archivos. En su lugar, utilizar una lista blanca de identificadores de archivo seguros y conocidos.",
            mediumTerm: "Si la entrada del usuario en las rutas de archivo es inevitable, asegurarse de que la aplicación canonicalice la ruta y verifique que comienza con el directorio base esperado antes de usarla.",
            longTerm: "Ejecutar la aplicación en una jaula (jail) chroot o sandbox con acceso mínimo al sistema de archivos para limitar el impacto de un ataque de salto exitoso."
        },
        cwe: "CWE-22",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        references: ["https://owasp.org/www-community/attacks/Path_Traversal"],
        tags: ["Infrastructure", "Web"],
        affectedComponents_en: `### Affected Components
- [TODO: List the vulnerable URL and parameter.]`,
        details_en: `### Proof of Concept
[TODO: Provide a request with a path traversal payload and show the contents of a sensitive file (e.g., /etc/passwd) in the response.]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Listar la URL y el parámetro vulnerables.]`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar una solicitud con una carga útil de salto de ruta y mostrar el contenido de un archivo sensible (p. ej., /etc/passwd) en la respuesta.]`
    },
    {
        id: "vuln-infra-009",
        title_en: "Open Redirects",
        title_es: "Redirecciones Abiertas",
        overview_en: "### Overview\nAn open redirect is an application that takes a parameter and redirects a user to that parameter value without any validation. This vulnerability is used in phishing attacks to get users to trust a link that appears to be from a legitimate domain.",
        overview_es: "### Resumen\nUna redirección abierta es una aplicación que toma un parámetro y redirige a un usuario al valor de ese parámetro sin ninguna validación. Esta vulnerabilidad se utiliza en ataques de phishing para que los usuarios confíen en un enlace que parece ser de un dominio legítimo.",
        technicalDescription_en: "### Technical Description\nThe application uses a parameter, often `redirect`, `url`, or `next`, to specify the destination after an action (like login). If this parameter is not validated, an attacker can craft a URL like `http://trusted-site.com/login?redirect=http://malicious-site.com`. A user, seeing the trusted domain, may click the link and be redirected to the malicious site after logging in.",
        technicalDescription_es: "### Descripción Técnica\nLa aplicación utiliza un parámetro, a menudo `redirect`, `url` o `next`, para especificar el destino después de una acción (como iniciar sesión). Si este parámetro no se valida, un atacante puede crear una URL como `http://sitio-confiable.com/login?redirect=http://sitio-malicioso.com`. Un usuario, al ver el dominio de confianza, puede hacer clic en el enlace y ser redirigido al sitio malicioso después de iniciar sesión.",
        impact_en: "### Impact\nFacilitates phishing attacks, increasing their credibility and success rate. It can be used to trick users into disclosing credentials or downloading malware from a site they are redirected to.",
        impact_es: "### Impacto\nFacilita los ataques de phishing, aumentando su credibilidad y tasa de éxito. Se puede utilizar para engañar a los usuarios para que divulguen credenciales o descarguen malware de un sitio al que son redirigidos.",
        immediateActions_en: "### Immediate Actions\nReview all redirect functionality. If redirects to external domains are not a required feature, disable them immediately.",
        immediateActions_es: "### Acciones Inmediatas\nRevisar toda la funcionalidad de redirección. Si las redirecciones a dominios externos no son una característica requerida, deshabilitarlas de inmediato.",
        remediation_en: {
            shortTerm: "Do not use user-supplied input to determine the redirect destination. Use a server-side mapping of short names or IDs to full target URLs.",
            mediumTerm: "If dynamic redirects are necessary, maintain an allow-list of trusted domains and validate the redirect parameter against this list. Ensure the URL scheme is also validated (e.g., only allow `http` and `https` ).",
            longTerm: "Display an intermediate page that clearly informs the user they are being redirected to another website, and require them to click a link to proceed."
        },
        remediation_es: {
            shortTerm: "No utilizar la entrada proporcionada por el usuario para determinar el destino de la redirección. Utilizar un mapeo del lado del servidor de nombres cortos o ID a las URL de destino completas.",
            mediumTerm: "Si las redirecciones dinámicas son necesarias, mantener una lista blanca de dominios de confianza y validar el parámetro de redirección contra esta lista. Asegurarse de que también se valide el esquema de la URL (p. ej., solo permitir `http` y `https` ).",
            longTerm: "Mostrar una página intermedia que informe claramente al usuario que está siendo redirigido a otro sitio web, y requerir que haga clic en un enlace para continuar."
        },
        cwe: "CWE-601",
        severity: "Medium",
        cvss: { score: 5.4, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "L", integrity: "L", availability: "N" },
        references: ["https://owasp.org/www-community/vulnerabilities/Unvalidated_Redirects_and_Forwards_Cheat_Sheet"],
        tags: ["Infrastructure", "Web"],
        affectedComponents_en: `### Affected Components
- [TODO: List the URL and parameter vulnerable to open redirection.]`,
        details_en: `### Proof of Concept
[TODO: Provide a URL that, when clicked, redirects the user to an external, attacker-controlled domain.]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Listar la URL y el parámetro vulnerables a la redirección abierta.]`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar una URL que, al hacer clic, redirija al usuario a un dominio externo controlado por el atacante.]`
    },
    {
        id: "vuln-infra-010",
        title_en: "Insecure File Shares",
        title_es: "Recursos Compartidos de Archivos Inseguros",
        overview_en: "### Overview\nInsecure file shares, such as SMB or NFS shares with weak or no access controls, can expose sensitive data and provide an entry point for attackers into the network.",
        overview_es: "### Resumen\nLos recursos compartidos de archivos inseguros, como los recursos compartidos de SMB o NFS con controles de acceso débiles o nulos, pueden exponer datos sensibles y proporcionar un punto de entrada para los atacantes en la red.",
        technicalDescription_en: "### Technical Description\nFile shares are configured with overly permissive permissions, such as 'Everyone' or 'Anonymous' access with read/write privileges. This allows any user on the network to access, modify, or delete files on the share, or upload malicious files.",
        technicalDescription_es: "### Descripción Técnica\nLos recursos compartidos de archivos se configuran con permisos demasiado permisivos, como acceso de 'Todos' o 'Anónimo' con privilegios de lectura/escritura. Esto permite a cualquier usuario de la red acceder, modificar o eliminar archivos en el recurso compartido, o cargar archivos maliciosos.",
        impact_en: "### Impact\nThis can lead to sensitive data exposure, data loss, or the spread of malware (like ransomware) throughout the network. An attacker can use a writable share to host malicious tools for lateral movement.",
        impact_es: "### Impacto\nEsto puede conducir a la exposición de datos sensibles, la pérdida de datos o la propagación de malware (como ransomware) por toda la red. Un atacante puede usar un recurso compartido con permisos de escritura para alojar herramientas maliciosas para el movimiento lateral.",
        immediateActions_en: "### Immediate Actions\nImmediately remove anonymous or 'Everyone' permissions from all file shares. If possible, take the insecure share offline until permissions can be properly configured.",
        immediateActions_es: "### Acciones Inmediatas\nEliminar inmediatamente los permisos anónimos o de 'Todos' de todos los recursos compartidos de archivos. Si es posible, desconectar el recurso compartido inseguro hasta que los permisos se puedan configurar correctamente.",
        remediation_en: {
            shortTerm: "Apply the principle of least privilege. Grant access only to the specific user groups that require it, with the minimum necessary permissions (e.g., read-only vs. read/write).",
            mediumTerm: "Implement a regular auditing process for file share permissions to identify and remediate overly permissive configurations.",
            longTerm: "Consider migrating from traditional file shares to more modern, secure collaboration platforms that offer more granular access controls and better auditing capabilities."
        },
        remediation_es: {
            shortTerm: "Aplicar el principio de privilegio mínimo. Otorgar acceso solo a los grupos de usuarios específicos que lo requieran, con los permisos mínimos necesarios (p. ej., solo lectura frente a lectura/escritura).",
            mediumTerm: "Implementar un proceso de auditoría regular para los permisos de los recursos compartidos de archivos para identificar y remediar configuraciones demasiado permisivas.",
            longTerm: "Considerar la migración de los recursos compartidos de archivos tradicionales a plataformas de colaboración más modernas y seguras que ofrezcan controles de acceso más granulares y mejores capacidades de auditoría."
        },
        cwe: "CWE-732",
        severity: "High",
        cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:A/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "A", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        references: ["https://www.cisa.gov/news-events/news/understanding-file-and-print-sharing"],
        tags: ["Infrastructure", "Network"],
        affectedComponents_en: `### Affected Components
- [TODO: List the server name and share name (e.g., \\\\SERVER\\share).]`,
        details_en: `### Proof of Concept
[TODO: Provide a screenshot showing access to the insecure share and a listing of its contents.]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Listar el nombre del servidor y el nombre del recurso compartido (p. ej., \\\\SERVIDOR\\recurso).]`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar una captura de pantalla que muestre el acceso al recurso compartido inseguro y una lista de su contenido.]`
    },
    {
        id: "vuln-infra-011",
        title_en: "Sensitive Data on File Shares",
        title_es: "Datos Sensibles en Recursos Compartidos",
        overview_en: "### Overview\nSensitive data, such as documents containing passwords, connection strings, or personal information, is found on a network file share that is accessible to a wide range of users.",
        overview_es: "### Resumen\nSe encuentran datos sensibles, como documentos que contienen contraseñas, cadenas de conexión o información personal, en un recurso compartido de archivos de red que es accesible para una amplia gama de usuarios.",
        technicalDescription_en: "### Technical Description\nDuring a review of accessible network shares, files containing sensitive information were discovered. Even if the share itself is not open to 'Everyone', the data may be accessible to a larger group of employees than necessary, violating the principle of least privilege.",
        technicalDescription_es: "### Descripción Técnica\nDurante una revisión de los recursos compartidos de red accesibles, se descubrieron archivos que contienen información sensible. Incluso si el recurso compartido en sí no está abierto a 'Todos', los datos pueden ser accesibles para un grupo de empleados más grande de lo necesario, violando el principio de privilegio mínimo.",
        impact_en: "### Impact\nThis can lead to the compromise of credentials, providing attackers with access to other systems. It also constitutes a data breach if personal or customer information is exposed.",
        impact_es: "### Impacto\nEsto puede conducir al compromiso de credenciales, proporcionando a los atacantes acceso a otros sistemas. También constituye una brecha de datos si se expone información personal o de clientes.",
        immediateActions_en: "### Immediate Actions\nImmediately restrict access to the files containing sensitive data to only the authorized individuals. If the data is credentials, rotate them immediately.",
        immediateActions_es: "### Acciones Inmediatas\nRestringir inmediatamente el acceso a los archivos que contienen datos sensibles solo a las personas autorizadas. Si los datos son credenciales, rotarlas de inmediato.",
        remediation_en: {
            shortTerm: "Remove the sensitive data from the file share. Implement a secure secrets management solution for storing credentials and API keys.",
            mediumTerm: "Implement a data loss prevention (DLP) solution to automatically scan file shares for sensitive information.",
            longTerm: "Conduct regular security awareness training for all employees on the proper handling and storage of sensitive data. Establish a clear data classification policy."
        },
        remediation_es: {
            shortTerm: "Eliminar los datos sensibles del recurso compartido de archivos. Implementar una solución segura de gestión de secretos para almacenar credenciales y claves de API.",
            mediumTerm: "Implementar una solución de prevención de pérdida de datos (DLP) para escanear automáticamente los recursos compartidos de archivos en busca de información sensible.",
            longTerm: "Realizar capacitaciones periódicas de concienciación sobre seguridad para todos los empleados sobre el manejo y almacenamiento adecuados de datos sensibles. Establecer una política clara de clasificación de datos."
        },
        cwe: "CWE-200",
        severity: "High",
        cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:A/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "A", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        references: ["https://www.cisa.gov/news-events/news/understanding-file-and-print-sharing"],
        tags: ["Infrastructure", "Network"],
        affectedComponents_en: `### Affected Components
- [TODO: List the server, share, and full path to the file containing sensitive data.]`,
        details_en: `### Proof of Concept
[TODO: Provide a screenshot of the file's contents, redacting any highly sensitive information.]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Listar el servidor, el recurso compartido y la ruta completa al archivo que contiene datos sensibles.]`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar una captura de pantalla del contenido del archivo, redactando cualquier información altamente sensible.]`
    },
    {
        id: "vuln-infra-012",
        title_en: "Unnecessary Exposed Services",
        title_es: "Servicios Expuestos Innecesariamente",
        overview_en: "### Overview\nServices that are not intended for public access, such as databases, remote management interfaces (RDP, SSH), or internal applications, are exposed to the internet.",
        overview_es: "### Resumen\nLos servicios que no están destinados al acceso público, como bases de datos, interfaces de gestión remota (RDP, SSH) o aplicaciones internas, están expuestos a Internet.",
        technicalDescription_en: "### Technical Description\nDue to a misconfiguration in a firewall, cloud security group, or network routing, services that should only be accessible on the internal network are reachable from the public internet. This dramatically increases the attack surface of the organization.",
        technicalDescription_es: "### Descripción Técnica\nDebido a una configuración incorrecta en un firewall, un grupo de seguridad en la nube o el enrutamiento de la red, los servicios que solo deberían ser accesibles en la red interna son accesibles desde la Internet pública. Esto aumenta drásticamente la superficie de ataque de la organización.",
        impact_en: "### Impact\nExposed services can be subjected to brute-force attacks, denial-of-service, or exploitation of known vulnerabilities, potentially leading to a full compromise of the system.",
        impact_es: "### Impacto\nLos servicios expuestos pueden ser objeto de ataques de fuerza bruta, denegación de servicio o explotación de vulnerabilidades conocidas, lo que puede llevar a un compromiso total del sistema.",
        immediateActions_en: "### Immediate Actions\nImmediately block public access to the exposed services at the network perimeter (firewall or cloud security group).",
        immediateActions_es: "### Acciones Inmediatas\nBloquear inmediatamente el acceso público a los servicios expuestos en el perímetro de la red (firewall o grupo de seguridad en la nube).",
        remediation_en: {
            shortTerm: "Implement a 'deny-by-default' firewall policy. Only allow access to specific services from trusted IP ranges.",
            mediumTerm: "Conduct regular external network scans to identify any unintentionally exposed services. Use a VPN with multi-factor authentication for all remote management access.",
            longTerm: "Implement a robust change management process for all firewall and network configuration changes to prevent accidental exposure."
        },
        remediation_es: {
            shortTerm: "Implementar una política de firewall de 'denegar por defecto'. Solo permitir el acceso a servicios específicos desde rangos de IP de confianza.",
            mediumTerm: "Realizar escaneos de red externos regulares para identificar cualquier servicio expuesto involuntariamente. Usar una VPN con autenticación multifactor para todo el acceso de gestión remota.",
            longTerm: "Implementar un proceso de gestión de cambios robusto para todos los cambios de configuración de firewall y red para evitar la exposición accidental."
        },
        cwe: "CWE-489",
        severity: "High",
        cvss: { score: 8.6, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:N/A:L", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "C", confidentiality: "H", integrity: "N", availability: "L" },
        references: ["https://www.shodan.io/"],
        tags: ["Infrastructure", "Network"],
        affectedComponents_en: `### Affected Components
- [TODO: List the IP addresses and ports of the unnecessarily exposed services.]`,
        details_en: `### Proof of Concept
[TODO: Provide a screenshot from a tool like nmap or Shodan showing the exposed port and service banner.]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Listar las direcciones IP y los puertos de los servicios expuestos innecesariamente.]`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar una captura de pantalla de una herramienta como nmap o Shodan que muestre el puerto expuesto y el banner del servicio.]`
    },
    {
        id: "vuln-infra-013",
        title_en: "Misconfigured <APPLICATION> Instance",
        title_es: "Instancia de <APPLICATION> Mal Configurada",
        overview_en: "### Overview\nA specific application or service (e.g., Jenkins, Elasticsearch, Docker) is misconfigured, leading to a security vulnerability.",
        overview_es: "### Resumen\nUna aplicación o servicio específico (p. ej., Jenkins, Elasticsearch, Docker) está mal configurado, lo que conduce a una vulnerabilidad de seguridad.",
        technicalDescription_en: "### Technical Description\nThis is a general category for misconfigurations specific to a particular technology. Examples include an Elasticsearch instance open to the public, a Jenkins server allowing unauthenticated access to script consoles, or a Docker daemon socket exposed to the network.",
        technicalDescription_es: "### Descripción Técnica\nEsta es una categoría general para configuraciones incorrectas específicas de una tecnología en particular. Los ejemplos incluyen una instancia de Elasticsearch abierta al público, un servidor Jenkins que permite el acceso no autenticado a las consolas de script, o un socket del demonio de Docker expuesto a la red.",
        impact_en: "### Impact\nThe impact is highly dependent on the specific application and misconfiguration, but it often leads to information disclosure, unauthorized access, or remote code execution.",
        impact_es: "### Impacto\nEl impacto depende en gran medida de la aplicación y la configuración incorrecta específicas, pero a menudo conduce a la divulgación de información, el acceso no autorizado o la ejecución remota de código.",
        immediateActions_en: "### Immediate Actions\nRestrict network access to the misconfigured instance. Consult the vendor's security best practices for the specific application.",
        immediateActions_es: "### Acciones Inmediatas\nRestringir el acceso de red a la instancia mal configurada. Consultar las mejores prácticas de seguridad del proveedor para la aplicación específica.",
        remediation_en: {
            shortTerm: "Apply the specific remediation for the identified misconfiguration, such as enabling authentication, changing default credentials, or implementing proper access controls.",
            mediumTerm: "Develop a secure baseline configuration (hardening guide) for all critical applications deployed in the environment.",
            longTerm: "Automate the deployment and configuration of applications using infrastructure-as-code tools to ensure consistency and enforce secure baselines."
        },
        remediation_es: {
            shortTerm: "Aplicar la remediación específica para la configuración incorrecta identificada, como habilitar la autenticación, cambiar las credenciales predeterminadas o implementar controles de acceso adecuados.",
            mediumTerm: "Desarrollar una configuración de línea de base segura (guía de fortalecimiento) para todas las aplicaciones críticas implementadas en el entorno.",
            longTerm: "Automatizar la implementación y configuración de aplicaciones utilizando herramientas de infraestructura como código para garantizar la coherencia y hacer cumplir las líneas de base seguras."
        },
        cwe: "CWE-16",
        severity: "High",
        cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        references: ["https://www.cisecurity.org/cis-benchmarks/"],
        tags: ["Infrastructure"],
        affectedComponents_en: `### Affected Components
- [TODO: Specify the application (e.g., Elasticsearch) and the location (IP address/URL) of the misconfigured instance.]`,
        details_en: `### Proof of Concept
[TODO: Provide evidence of the misconfiguration, such as a screenshot showing unauthenticated access to a sensitive panel or data.]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Especificar la aplicación (p. ej., Elasticsearch) y la ubicación (dirección IP/URL) de la instancia mal configurada.]`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar evidencia de la configuración incorrecta, como una captura de pantalla que muestre el acceso no autenticado a un panel o datos sensibles.]`
    },
    // --- AUTHENTICATION VULNERABILITIES ---
    {
        id: "vuln-auth-001",
        title_en: "Weak Passwords",
        title_es: "Contraseñas Débiles",
        overview_en: `### Overview
Weak passwords are easy for attackers to guess or crack, often using automated tools. This allows unauthorized access to user accounts and systems.`,
        overview_es: `### Resumen
Las contraseñas débiles son fáciles de adivinar o descifrar para los atacantes, a menudo utilizando herramientas automatizadas. Esto permite el acceso no autorizado a las cuentas y sistemas de los usuarios.`,
        technicalDescription_en: `### Technical Description
The application fails to enforce a strong password policy, allowing users to set short, simple, or common passwords (e.g., "password123", "123456"). Attackers can use brute-force or dictionary attacks to quickly compromise these accounts.`,
        technicalDescription_es: `### Descripción Técnica
La aplicación no impone una política de contraseñas segura, lo que permite a los usuarios establecer contraseñas cortas, simples o comunes (p. ej., "password123", "123456"). Los atacantes pueden usar ataques de fuerza bruta o de diccionario para comprometer rápidamente estas cuentas.`,
        impact_en: `### Impact
Account takeover, leading to unauthorized access to sensitive data and functionality. If an administrator account is compromised, it can lead to a full system compromise.`,
        impact_es: `### Impacto
Toma de control de la cuenta, lo que conduce a un acceso no autorizado a datos y funcionalidades sensibles. Si se compromete una cuenta de administrador, puede llevar a un compromiso total del sistema.`,
        immediateActions_en: "### Immediate Actions\nForce a password reset for all users. Temporarily implement account lockout measures after a small number of failed login attempts.",
        immediateActions_es: "### Acciones Inmediatas\nForzar un restablecimiento de contraseña para todos los usuarios. Implementar temporalmente medidas de bloqueo de cuenta después de un pequeño número de intentos de inicio de sesión fallidos.",
        remediation_en: {
            shortTerm: "Enforce a strong password policy (e.g., minimum length, complexity requirements). Check new passwords against a list of common and breached passwords.",
            mediumTerm: "Implement Multi-Factor Authentication (MFA) as the most effective defense against password-based attacks.",
            longTerm: "Educate users on the importance of strong, unique passwords. Consider implementing passwordless authentication options."
        },
        remediation_es: {
            shortTerm: "Hacer cumplir una política de contraseñas segura (p. ej., longitud mínima, requisitos de complejidad). Comprobar las nuevas contraseñas con una lista de contraseñas comunes y filtradas.",
            mediumTerm: "Implementar la autenticación multifactor (MFA) como la defensa más eficaz contra los ataques basados en contraseñas.",
            longTerm: "Educar a los usuarios sobre la importancia de contraseñas seguras y únicas. Considerar la implementación de opciones de autenticación sin contraseña."
        },
        cwe: "CWE-521",
        severity: "High",
        cvss: { score: 8.1, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "N" },
        references: ["https://owasp.org/www-project-top-ten/2017/A2_2017-Broken_Authentication"],
        tags: ["Authentication"],
        affectedComponents_en: `### Affected Components
- The application's login and password change functionality.`,
        details_en: `### Proof of Concept
[TODO: Provide an example of a weak password that was set and then cracked, or demonstrate a successful brute-force attack.]`,
        affectedComponents_es: `### Componentes Afectados
- La funcionalidad de inicio de sesión y cambio de contraseña de la aplicación.`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar un ejemplo de una contraseña débil que se estableció y luego se descifró, o demostrar un ataque de fuerza bruta exitoso.]`
    },
    {
        id: "vuln-auth-002",
        title_en: "Password Reuse",
        title_es: "Reutilización de Contraseñas",
        overview_en: "### Overview\nPassword reuse involves an attacker using a password that was compromised from one system to gain unauthorized access to another system where the user has used the same password.",
        overview_es: "### Resumen\nLa reutilización de contraseñas implica que un atacante utilice una contraseña que fue comprometida en un sistema para obtener acceso no autorizado a otro sistema donde el usuario ha utilizado la misma contraseña.",
        technicalDescription_en: "### Technical Description\nUsers often reuse the same password across multiple services. If one of those services suffers a data breach and credentials are leaked, an attacker can try those same credentials (an attack known as credential stuffing) on other services, including the target application.",
        technicalDescription_es: "### Descripción Técnica\nLos usuarios a menudo reutilizan la misma contraseña en múltiples servicios. Si uno de esos servicios sufre una brecha de datos y se filtran las credenciales, un atacante puede probar esas mismas credenciales (un ataque conocido como credential stuffing) en otros servicios, incluida la aplicación objetivo.",
        impact_en: "### Impact\nAn attacker can gain unauthorized access to user accounts without directly attacking the target application, leveraging breaches from entirely separate services.",
        impact_es: "### Impacto\nUn atacante puede obtener acceso no autorizado a las cuentas de los usuarios sin atacar directamente la aplicación objetivo, aprovechando las brechas de servicios completamente separados.",
        immediateActions_en: "### Immediate Actions\nForce a password reset for any identified compromised accounts. Communicate to users the risk of password reuse.",
        immediateActions_es: "### Acciones Inmediatas\nForzar un restablecimiento de contraseña para cualquier cuenta comprometida identificada. Comunicar a los usuarios el riesgo de la reutilización de contraseñas.",
        remediation_en: {
            shortTerm: "Implement rate limiting and account lockout mechanisms to slow down credential stuffing attacks. Check new passwords against a database of known breached passwords.",
            mediumTerm: "Implement Multi-Factor Authentication (MFA). This is the single most effective control against password reuse and credential stuffing.",
            longTerm: "Educate users about the importance of using unique passwords for every service. Provide a password manager as a corporate tool to facilitate this."
        },
        remediation_es: {
            shortTerm: "Implementar limitación de velocidad y mecanismos de bloqueo de cuentas para ralentizar los ataques de credential stuffing. Comprobar las nuevas contraseñas con una base de datos de contraseñas filtradas conocidas.",
            mediumTerm: "Implementar la Autenticación Multifactor (MFA). Este es el control más efectivo contra la reutilización de contraseñas y el credential stuffing.",
            longTerm: "Educar a los usuarios sobre la importancia de usar contraseñas únicas para cada servicio. Proporcionar un gestor de contraseñas como herramienta corporativa para facilitar esto."
        },
        cwe: "CWE-693",
        severity: "High",
        cvss: { score: 8.1, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:N", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "N" },
        references: ["https://haveibeenpwned.com/Passwords"],
        tags: ["Authentication"],
        affectedComponents_en: `### Affected Components
- All user accounts within the application.`,
        details_en: `### Proof of Concept
[TODO: Provide evidence of a successful login using credentials known to be from a public data breach.]`,
        affectedComponents_es: `### Componentes Afectados
- Todas las cuentas de usuario dentro de la aplicación.`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar evidencia de un inicio de sesión exitoso utilizando credenciales que se sabe que provienen de una brecha de datos pública.]`
    }
]

    