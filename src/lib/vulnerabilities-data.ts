

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
        recommendations_en: `#### Short-Term Recommendations
Refactor all database queries to use parameterized queries (also known as prepared statements). This is the most effective defense against SQLi as it separates the query logic from the data.
#### Medium-Term Recommendations
Implement least privilege access for database users. The application's database user should only have the minimum necessary permissions.
#### Long-Term Recommendations
Conduct regular security training for developers on secure coding practices. Implement static (SAST) and dynamic (DAST) application security testing into the CI/CD pipeline to proactively identify and fix vulnerabilities.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Refactorizar todas las consultas a la base de datos para usar consultas parametrizadas (también conocidas como prepared statements). Esta es la defensa más efectiva contra SQLi ya que separa la lógica de la consulta de los datos.
#### Recomendaciones a Medio Plazo
Implementar el principio de privilegio mínimo para los usuarios de la base de datos. El usuario de la base de datos de la aplicación solo debe tener los permisos mínimos necesarios.
#### Recomendaciones a Largo Plazo
Realizar capacitaciones de seguridad periódicas para los desarrolladores sobre prácticas de codificación segura. Implementar pruebas de seguridad de aplicaciones estáticas (SAST) y dinámicas (DAST) en el pipeline de CI/CD para identificar y corregir vulnerabilidades de forma proactiva.`,
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
        immediateActions_en: "### Immediate Actions\nImplement parameterized queries (prepared statements) in the vulnerable forms to prevent SQL injection. Review logs for signs of past exploitation.",
        immediateActions_es: "### Acciones Inmediatas\nImplementar inmediatamente consultas parametrizadas (prepared statements) en los formularios vulnerables para prevenir la inyección de SQL. Revisar los registros en busca de signos de explotación pasada.",
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
        recommendations_en: `#### Short-Term Recommendations
Apply context-aware output encoding to all user-supplied data before it is rendered in the browser. For example, use HTML entity encoding for data placed in HTML context, and JavaScript encoding for data in script contexts.
#### Medium-Term Recommendations
Use modern web frameworks (like React, Angular, Vue) that have built-in protections against XSS. Avoid using dangerous functions like \`innerHTML\`.
#### Long-Term Recommendations
Implement a security-focused design pattern where untrusted data is never mixed with executable code. Train developers to understand the different contexts of XSS and how to mitigate them.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Aplicar codificación de salida sensible al contexto a todos los datos proporcionados por el usuario antes de que se rendericen en el navegador. Por ejemplo, usar codificación de entidades HTML para datos en contexto HTML, y codificación de JavaScript para datos en contextos de script.
#### Recomendaciones a Medio Plazo
Utilizar frameworks web modernos (como React, Angular, Vue) que tengan protecciones incorporadas contra XSS. Evitar el uso de funciones peligrosas como \`innerHTML\`.
#### Recomendaciones a Largo Plazo
Implementar un patrón de diseño centrado en la seguridad donde los datos no confiables nunca se mezclen con código ejecutable. Capacitar a los desarrolladores para que comprendan los diferentes contextos de XSS y cómo mitigarlos.`,
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
        immediateActions_en: "### Immediate Actions\nImmediately apply context-aware output encoding on the vulnerable fields to prevent script execution. Sanitize existing data to remove any stored malicious payloads.",
        immediateActions_es: "### Acciones Inmediatas\nAplicar inmediatamente codificación de salida sensible al contexto en los campos vulnerables para prevenir la ejecución de scripts. Sanear los datos existentes para eliminar cualquier carga maliciosa almacenada.",
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
        recommendations_en: `#### Short-Term Recommendations
Enforce strong password policies and implement rate limiting and account lockout mechanisms on login attempts. Ensure session tokens are invalidated on the server-side upon logout.
#### Medium-Term Recommendations
Implement Multi-Factor Authentication (MFA) for all users, especially for administrative accounts. Use a centralized and standardized session management mechanism.
#### Long-Term Recommendations
Conduct a thorough review of the entire authentication and session management lifecycle. Use industry-standard frameworks and avoid creating custom authentication schemes.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Forzar políticas de contraseñas seguras e implementar limitación de velocidad y mecanismos de bloqueo de cuentas en los intentos de inicio de sesión. Asegurarse de que los tokens de sesión se invaliden en el lado del servidor al cerrar la sesión.
#### Recomendaciones a Medio Plazo
Implementar la autenticación multifactor (MFA) para todos los usuarios, especialmente para las cuentas administrativas. Utilizar un mecanismo de gestión de sesiones centralizado y estandarizado.
#### Recomendaciones a Largo Plazo
Realizar una revisión exhaustiva de todo el ciclo de vida de la autenticación y la gestión de sesiones. Utilizar frameworks estándar de la industria y evitar la creación de esquemas de autenticación personalizados.`,
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
        immediateActions_en: "### Immediate Actions\nForce a logout of all users to invalidate all existing session tokens. Implement rate limiting on the login page.",
        immediateActions_es: "### Acciones Inmediatas\nForzar el cierre de sesión de todos los usuarios para invalidar todos los tokens de sesión existentes. Implementar limitación de velocidad en la página de inicio de sesión.",
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
        recommendations_en: `#### Short-Term Recommendations
Identify all sensitive data and apply strong encryption both at rest and in transit (e.g., using TLS 1.2+). Disable caching for responses that contain sensitive data.
#### Medium-Term Recommendations
Implement a data classification policy. Use strong, industry-standard encryption algorithms and protocols. Ensure proper key management and rotation.
#### Long-Term Recommendations
Minimize the collection and storage of sensitive data. Conduct regular data discovery and classification exercises to ensure no sensitive data is being stored improperly.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Identificar todos los datos sensibles y aplicar un cifrado fuerte tanto en reposo como en tránsito (p. ej., usando TLS 1.2+). Deshabilitar el almacenamiento en caché para las responses que contienen datos sensibles.
#### Recomendaciones a Medio Plazo
Implementar una política de clasificación de datos. Utilizar algoritmos y protocolos de cifrado fuertes y estándar de la industria. Asegurar una gestión y rotación de claves adecuadas.
#### Recomendaciones a Largo Plazo
Minimizar la recopilación y el almacenamiento de datos sensibles. Realizar ejercicios regulares de descubrimiento y clasificación de datos para garantizar que no se almacenen datos sensibles de forma incorrecta.`,
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
        immediateActions_en: "### Immediate Actions\nImmediately remove or encrypt the exposed sensitive data. Force password resets if credentials were exposed.",
        immediateActions_es: "### Acciones Inmediatas\nEliminar o cifrar inmediatamente los datos sensibles expuestos. Forzar el restablecimiento de contraseñas si se expusieron credenciales.",
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
        recommendations_en: `#### Short-Term Recommendations
Disable DTDs (Document Type Definitions) and external entities in all XML parsers in the application. This is the most effective and simplest way to prevent XXE.
#### Medium-Term Recommendations
Upgrade XML processors and libraries to their latest versions. Use less complex data formats like JSON where possible.
#### Long-Term Recommendations
Implement server-side input validation and filtering to prevent hostile data within XML documents. Use a Web Application Firewall (WAF) with rules to detect and block XXE attacks.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Deshabilitar los DTDs (Definiciones de Tipo de Documento) y las entidades externas en todos los analizadores XML de la aplicación. Esta es la forma más efectiva y sencilla de prevenir XXE.
#### Recomendaciones a Medio Plazo
Actualizar los procesadores y bibliotecas XML a sus últimas versiones. Usar formatos de datos menos complejos como JSON cuando sea posible.
#### Recomendaciones a Largo Plazo
Implementar validación y filtrado de entradas del lado del servidor para evitar datos hostiles dentro de los documentos XML. Usar un Web Application Firewall (WAF) con reglas para detectar y bloquear ataques XXE.`,
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
        immediateActions_en: "### Immediate Actions\nImmediately disable DTDs and external entity processing in all XML parsers.",
        immediateActions_es: "### Acciones Inmediatas\nDeshabilitar inmediatamente los DTDs y el procesamiento de entidades externas en todos los analizadores XML.",
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
        recommendations_en: `#### Short-Term Recommendations
Review and enforce access control on the server-side for every request. Use role-based access control (RBAC) mechanisms. Deny by default.
#### Medium-Term Recommendations
Implement a centralized access control mechanism that is used by all components of the application. Log access control failures and alert administrators.
#### Long-Term Recommendations
Conduct a full review of the access control logic. Implement the principle of least privilege, where users are only granted the minimum permissions necessary.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Revisar y aplicar el control de acceso en el lado del servidor para cada solicitud. Utilizar mecanismos de control de acceso basados en roles (RBAC). Denegar por defecto.
#### Recomendaciones a Medio Plazo
Implementar un mecanismo de control de acceso centralizado que sea utilizado por todos los componentes de la aplicación. Registrar las fallas de control de acceso y alertar a los administradores.
#### Recomendaciones a Largo Plazo
Realizar una revisión completa de la lógica de control de acceso. Implementar el principio de privilegio mínimo, donde a los usuarios solo se les otorgan los permisos mínimos necesarios.`,
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
        immediateActions_en: "### Immediate Actions\nReview and implement server-side authorization checks on all vulnerable endpoints.",
        immediateActions_es: "### Acciones Inmediatas\nRevisar e implementar comprobaciones de autorización del lado del servidor en todos los puntos finales vulnerables.",
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
        recommendations_en: `#### Short-Term Recommendations
Review and harden configurations for all parts of the application stack. Implement security headers like Content Security Policy (CSP). Disable unnecessary features and services.
#### Medium-Term Recommendations
Develop a repeatable hardening process that is fast and easy to deploy. Automate the process of verifying configurations in different environments.
#### Long-Term Recommendations
Implement a secure configuration lifecycle. Regularly scan and audit configurations for misconfigurations. Use automated tools to enforce secure baselines.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Revisar y fortalecer las configuraciones para todas las partes de la pila de aplicaciones. Implementar encabezados de seguridad como la Política de Seguridad de Contenido (CSP). Deshabilitar funciones y servicios innecesarios.
#### Recomendaciones a Medio Plazo
Desarrollar un proceso de fortalecimiento repetible que sea rápido y fácil de implementar. Automatizar el proceso de verificación de configuraciones en diferentes entornos.
#### Recomendaciones a Largo Plazo
Implementar un ciclo de vida de configuración seguro. Escanear y auditar regularmente las configuraciones en busca de errores. Usar herramientas automatizadas para hacer cumplir las líneas de base seguras.`,
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
        immediateActions_en: "### Immediate Actions\nImmediately correct the specific misconfiguration, such as disabling directory listing, changing default passwords, or restricting permissions.",
        immediateActions_es: "### Acciones Inmediatas\nCorregir inmediatamente la configuración incorrecta específica, como deshabilitar el listado de directorios, cambiar las contraseñas predeterminadas o restringir los permisos.",
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
        recommendations_en: `#### Short-Term Recommendations
Implement anti-CSRF tokens (synchronizer token pattern) for all state-changing requests. Verify the \`Origin\` or \`Referer\` header.
#### Medium-Term Recommendations
Use the SameSite cookie attribute, setting it to \`Strict\` or \`Lax\`.
#### Long-Term Recommendations
Ensure the application framework has built-in CSRF protection and that it is enabled and configured correctly. For APIs, consider using token-based authentication (e.g., JWT) instead of cookies.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Implementar tokens anti-CSRF (patrón de token sincronizador) para todas las solicitudes que cambian el estado. Verificar el encabezado \`Origin\` o \`Referer\`.
#### Recomendaciones a Medio Plazo
Usar el atributo de cookie SameSite, configurándolo en \`Strict\` o \`Lax\`.
#### Recomendaciones a Largo Plazo
Asegurarse de que el framework de la aplicación tenga protección CSRF incorporada y que esté habilitada y configurada correctamente. Para las API, considerar el uso de autenticación basada en tokens (p. ej., JWT) en lugar de cookies.`,
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
        immediateActions_en: "### Immediate Actions\nImplement anti-CSRF tokens on all state-changing forms and API endpoints.",
        immediateActions_es: "### Acciones Inmediatas\nImplementar tokens anti-CSRF en todos los formularios y puntos finales de API que cambian el estado.",
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
        recommendations_en: `#### Short-Term Recommendations
Avoid deserializing data from untrusted sources. If necessary, implement strict type checking and validation before deserialization.
#### Medium-Term Recommendations
Use data formats that are not vulnerable to deserialization attacks, such as JSON, and avoid using complex native serialization formats.
#### Long-Term Recommendations
Integrate integrity checks like digital signatures on any serialized data to prevent tampering. Isolate the deserialization code in a low-privilege environment.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Evitar deserializar datos de fuentes no confiables. Si es necesario, implementar una comprobación y validación de tipos estricta antes de la deserialización.
#### Recomendaciones a Medio Plazo
Utilizar formatos de datos que no sean vulnerables a ataques de deserialización, como JSON, y evitar el uso de formatos de serialización nativos complejos.
#### Recomendaciones a Largo Plazo
Integrar comprobaciones de integridad como firmas digitales en cualquier dato serializado para evitar la manipulación. Aislar el código de deserialización en un entorno de bajos privilegios.`,
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
        immediateActions_en: "### Immediate Actions\nDisable or restrict the functionality that deserializes user-supplied data. If that's not possible, implement strict validation of the incoming data.",
        immediateActions_es: "### Acciones Inmediatas\nDeshabilitar o restringir la funcionalidad que deserializa los datos proporcionados por el usuario. Si no es posible, implementar una validación estricta de los datos entrantes.",
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
        recommendations_en: `#### Short-Term Recommendations
Implement a strict allow-list of domains and protocols that the application is allowed to request. Deny all other requests.
#### Medium-Term Recommendations
Validate all user-supplied input to ensure it conforms to the expected format and values. Do not send raw responses from the server back to the client.
#### Long-Term Recommendations
Isolate the functionality that makes external requests in a separate, low-privilege network environment. This limits the impact of a potential SSRF vulnerability.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Implementar una lista blanca estricta de dominios y protocolos que la aplicación tiene permitido solicitar. Denegar todas las demás solicitudes.
#### Recomendaciones a Medio Plazo
Validar todas las entradas proporcionadas por el usuario para asegurarse de que se ajustan al formato y los valores esperados. No enviar responses sin procesar del servidor al cliente.
#### Recomendaciones a Largo Plazo
Aislar la funcionalidad que realiza solicitudes externas en un entorno de red separado y de bajos privilegios. Esto limita el impacto de una posible vulnerabilidad SSRF.`,
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
        immediateActions_en: "### Immediate Actions\nImplement a strict allow-list for domains that can be requested by the server. Block all internal and metadata IP addresses.",
        immediateActions_es: "### Acciones Inmediatas\nImplementar una lista blanca estricta para los dominios que el servidor puede solicitar. Bloquear todas las direcciones IP internas y de metadatos.",
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
        recommendations_en: `#### Short-Term Recommendations
Enforce strict, default-deny access control for all endpoints, regardless of the HTTP verb used.
#### Medium-Term Recommendations
Use a framework that correctly maps actions to specific HTTP verbs and enforces this mapping.
#### Long-Term Recommendations
Implement a centralized and robust access control mechanism that is verb-agnostic.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Aplicar un control de acceso estricto y de denegación por defecto para todos los puntos de conexión, independientemente del verbo HTTP utilizado.
#### Recomendaciones a Medio Plazo
Usar un framework que mapee correctamente las acciones a verbos HTTP específicos y haga cumplir este mapeo.
#### Recomendaciones a Largo Plazo
Implementar un mecanismo de control de acceso centralizado y robusto que sea independiente del verbo.`,
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
        immediateActions_en: "### Immediate Actions\nReview the server-side code to ensure authorization checks are applied consistently across all HTTP verbs for a given endpoint.",
        immediateActions_es: "### Acciones Inmediatas\nRevisar el código del lado del servidor para garantizar que las comprobaciones de autorización se apliquen de manera consistente a todos los verbos HTTP para un punto final determinado.",
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
        recommendations_en: `#### Short-Term Recommendations
Validate user input against a strict allow-list of acceptable file names and paths.
#### Medium-Term Recommendations
Avoid passing user-supplied input to filesystem APIs. If unavoidable, use a mapping to safe, pre-defined file paths.
#### Long-Term Recommendations
Run the application in a sandboxed or chrooted environment to limit the impact of a potential LFI.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Validar la entrada del usuario contra una lista blanca estricta de nombres y rutas de archivo aceptables.
#### Recomendaciones a Medio Plazo
Evitar pasar la entrada proporcionada por el usuario a las API del sistema de archivos. Si es inevitable, usar un mapeo a rutas de archivo seguras y predefinidas.
#### Recomendaciones a Largo Plazo
Ejecutar la aplicación en un entorno aislado o chroot para limitar el impacto de un posible LFI.`,
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
        immediateActions_en: "### Immediate Actions\nImplement strict input validation on the vulnerable parameter to prevent directory traversal characters.",
        immediateActions_es: "### Acciones Inmediatas\nImplementar una validación de entrada estricta en el parámetro vulnerable para prevenir los caracteres de salto de directorio.",
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
        recommendations_en: `#### Short-Term Recommendations
Strictly disallow the \`file://\` URI scheme in all functions that make server-side requests.
#### Medium-Term Recommendations
Implement a robust URI parser that validates and restricts protocols to an allow-list (e.g., only HTTP and HTTPS).
#### Long-Term Recommendations
Run the application with the minimum necessary file system permissions to limit the files it can access.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Desautorizar estrictamente el esquema URI \`file://\` en todas las funciones que realizan solicitudes del lado del servidor.
#### Recomendaciones a Medio Plazo
Implementar un analizador de URI robusto que valide y restrinja los protocolos a una lista de permitidos (p. ej., solo HTTP y HTTPS).
#### Recomendaciones a Largo Plazo
Ejecutar la aplicación con los permisos mínimos necesarios del sistema de archivos para limitar los archivos a los que puede acceder.`,
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
        immediateActions_en: "### Immediate Actions\nImmediately block the `file://` scheme in the application's request handler.",
        immediateActions_es: "### Acciones Inmediatas\nBloquear inmediatamente el esquema `file://` en el manejador de solicitudes de la aplicación.",
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
        recommendations_en: `#### Short-Term Recommendations
Encrypt all sensitive data before storing it on the device. Use platform-provided secure storage mechanisms like Android's EncryptedSharedPreferences or iOS's Keychain.
#### Medium-Term Recommendations
Develop a data classification policy for the mobile app to identify what data is sensitive and requires encryption. Avoid storing sensitive data on the device whenever possible.
#### Long-Term Recommendations
Implement a secure data management lifecycle for the mobile app, including secure storage, transmission, and deletion of data. Conduct regular security audits of the app's data storage practices.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Cifrar inmediatamente todos los datos sensibles antes de almacenarlos en el dispositivo. Utilizar los mecanismos de almacenamiento seguro proporcionados por la plataforma, como EncryptedSharedPreferences de Android o el Llavero (Keychain) de iOS.
#### Recomendaciones a Medio Plazo
Desarrollar una política de clasificación de datos para la aplicación móvil para identificar qué datos son sensibles y requieren cifrado. Evitar almacenar datos sensibles en el dispositivo siempre que sea posible.
#### Recomendaciones a Largo Plazo
Implementar un ciclo de vida de gestión de datos seguro para la aplicación móvil, que incluya almacenamiento, transmisión y eliminación seguros de los datos. Realizar auditorías de seguridad periódicas de las prácticas de almacenamiento de datos de la aplicación.`,
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
        immediateActions_en: "### Immediate Actions\nImmediately remove sensitive data from insecure storage. If the data must persist, re-implement storage using secure mechanisms like Android's EncryptedSharedPreferences or iOS's Keychain.",
        immediateActions_es: "### Acciones Inmediatas\nEliminar inmediatamente los datos sensibles del almacenamiento inseguro. Si los datos deben persistir, volver a implementar el almacenamiento utilizando mecanismos seguros como EncryptedSharedPreferences de Android o el Keychain de iOS.",
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
        recommendations_en: `#### Short-Term Recommendations
Apply the same security best practices to mobile backend APIs as you would for a standard web application. This includes input validation, parameterized queries, and strong access control.
#### Medium-Term Recommendations
Implement API-specific security measures, such as rate limiting, request throttling, and robust authentication/authorization for all endpoints.
#### Long-Term Recommendations
Design the backend API with a 'zero trust' model, assuming that any request from a mobile client could be malicious. Do not rely on client-side controls for security.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Aplicar las mesmas melhores práticas de segurança às APIs de backend móvel que se aplicariam a uma aplicação web padrão. Isso inclui validação de entradas, consultas parametrizadas e um forte controle de acesso.
#### Recomendaciones a Medio Plazo
Implementar medidas de segurança específicas para a API, como limitação de velocidade, regulação de solicitações e autenticação/autorização robustas para todos os pontos de conexão.
#### Recomendaciones a Largo Plazo
Projetar a API de backend com um modelo de 'confiança zero', assumindo que qualquer solicitação de um cliente móvel pode ser maliciosa. Não depender dos controles do lado do cliente para a segurança.`,
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
        immediateActions_en: "### Immediate Actions\nApply server-side validation and authorization checks to all API endpoints, treating all client-side input as untrusted.",
        immediateActions_es: "### Acciones Inmediatas\nAplicar validación y comprobaciones de autorización del lado del servidor a todos los puntos finales de la API, tratando todas las entradas del lado del cliente como no confiables.",
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
        recommendations_en: `#### Short-Term Recommendations
Ensure that TLS is used for all network communications. Configure the app to only support strong TLS protocols (TLS 1.2, TLS 1.3) and modern cipher suites.
#### Medium-Term Recommendations
Implement SSL/TLS certificate pinning to prevent MitM attacks even if the device's trust store is compromised. Disallow the use of self-signed certificates in production builds.
#### Long-Term Recommendations
Regularly review and update the list of trusted certificates and cipher suites. Use automated tools to scan the application for insecure network configurations during the development cycle.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Asegurarse de que se utilice TLS para todas las comunicaciones de red. Configurar la aplicación para que solo admita protocolos TLS fuertes (TLS 1.2, TLS 1.3) y conjuntos de cifrado modernos.
#### Recomendaciones a Medio Plazo
Implementar el anclaje de certificados SSL/TLS (certificate pinning) para prevenir ataques MitM incluso si el almacén de confianza del dispositivo está comprometido. No permitir el uso de certificados autofirmados en las compilaciones de producción.
#### Recomendaciones a Largo Plazo
Revisar y actualizar regularmente la lista de certificados y conjuntos de cifrado de confianza. Utilizar herramientas automatizadas para escanear la aplicación en busca de configuraciones de red inseguras durante el ciclo de desarrollo.`,
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
        immediateActions_en: "### Immediate Actions\nEnforce TLS for all application communications. Disable cleartext traffic in the app's configuration (e.g., Android's `network_security_config.xml`).",
        immediateActions_es: "### Acciones Inmediatas\nForzar el uso de TLS para todas las comunicaciones de la aplicación. Deshabilitar el tráfico de texto claro en la configuración de la aplicación (p. ej., `network_security_config.xml` en Android).",
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
        recommendations_en: `#### Short-Term Recommendations
Remove all logging of sensitive data. Disable keyboard caching for password fields. Clear the clipboard after a user copies sensitive information from the app.
#### Medium-Term Recommendations
Review and minimize the data sent to third-party services. Implement data masking or tokenization for any sensitive data that must be shared.
#### Long-Term Recommendations
Establish a clear data flow diagram for the application and conduct a privacy impact assessment. Regularly review third-party SDKs for their data handling practices.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Eliminar todo el registro de datos sensibles. Deshabilitar el almacenamiento en caché del teclado para los campos de contraseña. Limpiar el portapapeles después de que un usuario copie información sensible de la aplicación.
#### Recomendaciones a Medio Plazo
Revisar y minimizar los datos enviados a servicios de terceros. Implementar enmascaramiento de datos o tokenización para cualquier dato sensible que deba compartirse.
#### Recomendaciones a Largo Plazo
Establecer un diagrama de flujo de datos claro para la aplicación y realizar una evaluación de impacto en la privacidad. Revisar regularmente los SDK de terceros por sus prácticas de manejo de datos.`,
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
        immediateActions_en: "### Immediate Actions\nImmediately remove all logging of sensitive data from the application code. Disable keyboard caching for sensitive input fields.",
        immediateActions_es: "### Acciones Inmediatas\nEliminar inmediatamente todo el registro de datos sensibles del código de la aplicación. Deshabilitar el almacenamiento en caché del teclado para los campos de entrada sensibles.",
    },
    {
        id: "vuln-mobile-005",
        title_en: "Poor Authorization",
        title_es: "Autorización Deficiente",
        overview_en: `### Overview
Poor authorization vulnerabilities occur when a user is able to access resources or perform actions that they should not be permitted to. This is a server-side flaw, but it is tested and exploited via the mobile app.`,
        overview_es: `### Resumen
Las vulnerabilidades de autorización deficiente ocurren when un usuario puede acceder a recursos o realizar acciones que no debería tener permitidas. Esta es una falla del lado del servidor, pero se prueba y explota a través de la aplicación móvil.`,
        technicalDescription_en: `### Technical Description
This is similar to Broken Access Control in web applications. An attacker, authenticated as a low-privilege user, can manipulate API requests to access data or functionality belonging to another user or a higher-privilege role. For example, changing a user ID in an API call from \`/api/users/123/profile\` to \`/api/users/456/profile\` to view another user's data.`,
        technicalDescription_es: `### Descripción Técnica
Esto es similar al Control de Acceso Roto en aplicaciones web. Un atacante, autenticado como un usuario de bajos privilegios, puede manipular las solicitudes de API para acceder a datos o funcionalidades que pertenecen a otro usuario o a un rol de mayor privilegio. Por ejemplo, cambiar un ID de usuario en una llamada a la API de \`/api/users/123/profile\` a \`/api/users/456/profile\` para ver los datos de otro usuario.`,
        impact_en: `### Impact
The impact can be severe, allowing attackers to view, modify, or delete any data accessible via the backend API, regardless of ownership or privilege level.`,
        impact_es: `### Impacto
El impacto puede ser severo, permitiendo a los atacantes ver, modificar o eliminar cualquier dato accesible a través de la API de backend, independientemente de la propiedad o el nivel de privilegio.`,
        recommendations_en: `#### Short-Term Recommendations
Enforce authorization checks on the server-side for every single API request. Do not rely on the client to control which UI elements are shown to the user.
#### Medium-Term Recommendations
Implement a robust, centralized role-based access control (RBAC) system for the backend API. Ensure that ownership is checked for all data access requests.
#### Long-Term Recommendations
Conduct a thorough security review of the entire API surface. Unit and integration tests should be created to verify that authorization rules are correctly enforced.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Hacer cumplir las comprobaciones de autorización en el lado del servidor para cada solicitud de API individual. No depender del cliente para controlar qué elementos de la interfaz de usuario se muestran al usuario.
#### Recomendaciones a Medio Plazo
Implementar un sistema de control de acceso basado en roles (RBAC) robusto y centralizado para la API de backend. Asegurarse de que se compruebe la propiedad para todas las solicitudes de acceso a datos.
#### Recomendaciones a Largo Plazo
Realizar una revisión de seguridad exhaustiva de toda la superficie de la API. Se deben crear pruebas unitarias y de integración para verificar que las reglas de autorización se apliquen correctamente.`,
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
- [TODO: Listar los endpoints de la API de backend vulnerables.]`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar una secuencia de solicitudes de API (p. ej., desde Burp Suite) que muestre cómo un usuario con pocos privilegios puede acceder o modificar datos a los que no debería tener acceso.]`,
        immediateActions_en: "### Immediate Actions\nImmediately implement server-side checks on the vulnerable API endpoints to verify that the authenticated user is authorized to access the requested resource.",
        immediateActions_es: "### Acciones Inmediatas\nImplementar inmediatamente comprobaciones del lado del servidor en los puntos finales de la API vulnerables para verificar que el usuario autenticado está autorizado para acceder al recurso solicitado.",
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
        recommendations_en: `#### Short-Term Recommendations
Replace all weak or custom cryptographic algorithms with modern, industry-standard algorithms (e.g., AES-256-GCM for encryption, PBKDF2 or Argon2 for password hashing).
#### Medium-Term Recommendations
Do not implement cryptography from scratch. Use well-vetted, platform-provided cryptographic libraries and APIs.
#### Long-Term Recommendations
Establish a policy for cryptographic standards and regularly review the application to ensure compliance. This includes key management, algorithm choice, and protocol usage.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Reemplazar todos los algoritmos criptográficos débiles o personalizados con algoritmos modernos y estándar de la industria (p. ej., AES-256-GCM para el cifrado, PBKDF2 o Argon2 para el hasheo de contraseñas).
#### Recomendaciones a Medio Plazo
No implementar la criptografía desde cero. Utilizar bibliotecas y API criptográficas bien examinadas y proporcionadas por la plataforma.
#### Recomendaciones a Largo Plazo
Establecer una política para los estándares criptográficos y revisar regularmente la aplicación para asegurar el cumplimiento. Esto incluye la gestión de claves, la elección de algoritmos y el uso de protocolos.`,
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
        immediateActions_en: "### Immediate Actions\nReplace any hardcoded keys with securely generated and stored keys. Upgrade all cryptographic functions to use modern, recommended algorithms (e.g., AES-256-GCM).",
        immediateActions_es: "### Acciones Inmediatas\nReemplazar cualquier clave codificada de forma rígida con claves generadas y almacenadas de forma segura. Actualizar todas las funciones criptográficas para usar algoritmos modernos y recomendados (p. ej., AES-256-GCM).",
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
El impacto puede variar desde la corrupción de datos y la denegación de servicio en la aplicación local, hasta la ejecución de código arbitrario dentro de una vista web aislada, lo que podría llevar al robo de tokens de sesión si el token está exposed a la vista web.`,
        recommendations_en: `#### Short-Term Recommendations
Use parameterized queries (prepared statements) for all local SQLite database interactions. For WebViews, ensure JavaScript is disabled if not needed, and properly encode any data displayed in them.
#### Medium-Term Recommendations
Avoid processing untrusted data on the client side whenever possible. Perform validation and sanitization on the server side before sending data to the client.
#### Long-Term Recommendations
Implement a secure coding standard for the mobile app that includes guidelines for handling untrusted data on the client side. Use automated scanning tools to detect client-side injection flaws.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Usar consultas parametrizadas (prepared statements) para todas las interacciones con la base de datos SQLite local. Para las WebViews, asegurarse de que JavaScript esté deshabilitado si no es necesario, y codificar correctamente cualquier dato que se muestre en ellas.
#### Recomendaciones a Medio Plazo
Evitar el procesamiento de datos no confiables en el lado del cliente siempre que sea posible. Realizar la validación y el saneamiento en el lado del servidor antes de enviar los datos al cliente.
#### Recomendaciones a Largo Plazo
Implementar un estándar de codificación segura para la aplicación móvil que incluya pautas para el manejo de datos no confiables en el lado del cliente. Usar herramientas de escaneo automatizadas para detectar fallas de inyección en el lado del cliente.`,
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
        immediateActions_en: "### Immediate Actions\nImplement parameterized queries for local database interactions. Apply proper encoding for data rendered in WebViews.",
        immediateActions_es: "### Acciones Inmediatas\nImplementar consultas parametrizadas para las interacciones con la base de datos local. Aplicar la codificación adecuada para los datos renderizados en WebViews.",
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
        recommendations_en: `#### Short-Term Recommendations
Never make security decisions based on user-controlled or otherwise untrusted input. Security controls should be enforced by server-side logic or hardcoded in the application binary.
#### Medium-Term Recommendations
For any security-sensitive configurations, fetch them from a trusted server-side endpoint rather than storing them in a client-modifiable file.
#### Long-Term Recommendations
Design the application so that the client is treated as a completely untrusted environment. All significant security checks and decisions must be made on the server.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Nunca tomar decisiones de seguridad basadas en entradas controladas por el usuario o de otra manera no confiables. Los controles de seguridad deben ser aplicados por la lógica del lado del servidor o codificados de forma rígida en el binario de la aplicación.
#### Recomendaciones a Medio Plazo
Para cualquier configuración sensible a la seguridad, obtenerla de un punto de conexión de confianza del lado del servidor en lugar de almacenarla en un archivo modificable por el cliente.
#### Recomendaciones a Largo Plazo
Diseñar la aplicación de modo que el cliente sea tratado como un entorno completamente no confiable. Todas las comprobaciones y decisiones de seguridad significativas deben realizarse en el servidor.`,
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
        immediateActions_en: "### Immediate Actions\nRefactor the code to remove any security decisions based on untrusted inputs. Move security logic to the server-side where possible.",
        immediateActions_es: "### Acciones Inmediatas\nRefactorizar el código para eliminar cualquier decisión de seguridad basada en entradas no confiables. Mover la lógica de seguridad al lado del servidor siempre que sea posible.",
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
        recommendations_en: `#### Short-Term Recommendations
Implement server-side session timeouts. Session tokens must be invalidated on the server when a user logs out.
#### Medium-Term Recommendations
Use refresh tokens and short-lived access tokens. The access token provides access to resources, and the refresh token is used to obtain a new access token without requiring the user to re-authenticate.
#### Long-Term Recommendations
Implement a mechanism to detect and alert on suspicious session activity, such as a session being used from multiple IP addresses or devices simultaneously.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Implementar tiempos de espera de sesión del lado del servidor. Los tokens de sesión deben invalidarse en el servidor cuando un usuario cierra la sesión.
#### Recomendaciones a Medio Plazo
Usar tokens de actualización y tokens de acceso de corta duración. El token de acceso proporciona acceso a los recursos, y el token de actualización se utiliza para obtener un nuevo token de acceso sin requerir que el usuario se vuelva a autenticar.
#### Recomendaciones a Largo Plazo
Implementar un mecanismo para detectar y alertar sobre actividades de sesión sospechosas, como una sesión que se utiliza desde múltiples direcciones IP o dispositivos simultáneamente.`,
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
        immediateActions_en: "### Immediate Actions\nForce logout of all active sessions to invalidate all existing session tokens.",
        immediateActions_es: "### Acciones Inmediatas\nForzar el cierre de sesión de todas las sesiones activas para invalidar todos los tokens de sesión existentes.",
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
        recommendations_en: `#### Short-Term Recommendations
Apply code obfuscation to make the decompiled code harder to understand. Implement anti-tampering checks (e.g., checksum validation) to detect if the app has been modified.
#### Medium-Term Recommendations
Implement more robust root/jailbreak detection and anti-debugging techniques. Use tools that provide comprehensive binary protection, including string encryption and control flow obfuscation.
#### Long-Term Recommendations
Adopt a defense-in-depth strategy for mobile security. Assume that a determined attacker can bypass client-side controls, and therefore, critical security logic must always be enforced on the server side.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Aplicar la ofuscación de código para dificultar la comprensión del código descompilado. Implementar comprobaciones anti-manipulación (p. ej., validación de checksum) para detectar si la aplicación ha sido modificada.
#### Recomendaciones a Medio Plazo
Implementar una detección de root/jailbreak más robusta y técnicas anti-depuración. Utilizar herramientas que proporcionen una protección binaria completa, incluido el cifrado de cadenas y la ofuscación del flujo de control.
#### Recomendaciones a Largo Plazo
Adoptar una estrategia de defensa en profundidad para la seguridad móvil. Asumir que un atacante determinado puede eludir los controles del lado del cliente y, por lo tanto, la lógica de seguridad crítica siempre debe aplicarse en el lado del servidor.`,
        cwe: "CWE-657",
        severity: "Medium",
        cvss: { score: 5.9, vectorString: "CVSS:3.1/AV:L/AC:L/PR:N/UI:N/S:U/C:L/I:L/A:L", attackVector: "L", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "L", availability: "L" },
        references: ["https://owasp.org/www-project-mobile-top-10/2016-risks/m1-improper-platform-usage/"],
        tags: ["Mobile"],
        affectedComponents_en: `### Affected Components
- The application binary itself (APK/IPA).`,
        details_en: `### Proof of Concept
[TODO: Demonstrate patching the application binary to bypass a security control and re-signing it.]`,
        affectedComponents_es: `### Componentes Afectados
- El propio binario de la aplicación (APK/IPA).`,
        details_es: `### Prueba de Concepto
[TODO: Demostrar cómo parchear el binario de la aplicación para eludir un control de seguridad y volver a firmarlo.]`,
        immediateActions_en: "### Immediate Actions\nImplement basic code obfuscation and integrity checks (checksums) in the build process.",
        immediateActions_es: "### Acciones Inmediatas\nImplementar ofuscación de código básica y comprobaciones de integridad (checksums) en el proceso de compilación.",
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
        recommendations_en: `#### Short-Term Recommendations
Enforce TLS 1.2 or higher across all endpoints. Implement certificate pinning in mobile clients to ensure the app only communicates with the trusted server.
#### Medium-Term Recommendations
Use HTTP Strict Transport Security (HSTS) to ensure browsers only connect to your server over HTTPS.
#### Long-Term Recommendations
Conduct regular network security audits. Deploy intrusion detection systems (IDS) to monitor for suspicious network activity like ARP poisoning.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Hacer cumplir TLS 1.2 o superior en todos los puntos de conexión. Implementar el anclaje de certificados (certificate pinning) en los clientes móviles para garantizar que la aplicación solo se comunique con el servidor de confianza.
#### Recomendaciones a Medio Plazo
Usar HTTP Strict Transport Security (HSTS) para garantizar que los navegadores solo se conecten a su servidor a través de HTTPS.
#### Recomendaciones a Largo Plazo
Realizar auditorías de seguridad de red periódicas. Desplegar sistemas de detección de intrusiones (IDS) para monitorear actividades de red sospechosas como el envenenamiento ARP.`,
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
        immediateActions_en: "### Immediate Actions\nEnforce TLS for all communications. In mobile applications, implement certificate pinning to prevent interception.",
        immediateActions_es: "### Acciones Inmediatas\nForzar el uso de TLS para todas las comunicaciones. En aplicaciones móviles, implementar anclaje de certificados (certificate pinning) para prevenir la interceptación.",
    },
    { 
        id: "vuln-net-002", 
        title_en: "DNS Spoofing", 
        title_es: "Suplantación de DNS", 
        overview_en: "### Overview\nDNS spoofing or DNS cache poisoning is an attack where corrupted DNS data is introduced into the DNS resolver's cache, causing the name server to return an incorrect IP address.", 
        overview_es: "### Resumen\nLa suplantación de DNS o envenenamiento de caché de DNS es un ataque en el que se introducen datos DNS corruptos en la caché del resolutor de DNS, lo que hace que el servidor de nombres devuelva una dirección IP incorrecta.", 
        technicalDescription_en: "### Technical Description\nAn attacker can exploit vulnerabilities in the DNS protocol to redirect traffic intended for a legitimate server to a malicious server controlled by the attacker. This is often done by sending forged DNS responses to a DNS resolver.", 
        technicalDescription_es: "### Descripción Técnica\nUn atacante puede explotar vulnerabilidades en el protocolo DNS para redirigir el tráfico destinado a un servidor legítimo a un servidor malicioso controlado por el atacante. Esto se hace a menudo enviando responses DNS falsificadas a un resolutor de DNS.", 
        impact_en: "### Impact\nThis can be used for phishing attacks, where a user is tricked into entering credentials on a fake website, or for distributing malware. It can also facilitate man-in-the-middle attacks.", 
        impact_es: "### Impacto\nEsto puede usarse para ataques de phishing, donde se engaña a un usuario para que ingrese credenciales en un sitio web falso, o para distribuir malware. También puede facilitar ataques de intermediario (man-in-the-middle).", 
        recommendations_en: `#### Short-Term Recommendations
Implement DNSSEC (Domain Name System Security Extensions) to validate the authenticity of DNS responses.
#### Medium-Term Recommendations
Use end-to-end encryption (TLS) for all communications. This ensures that even if DNS is spoofed, the attacker cannot decrypt the traffic without the server's private key.
#### Long-Term Recommendations
Monitor DNS traffic for anomalies. Regularly audit DNS server configurations for security best practices.`, 
        recommendations_es: `#### Recomendaciones a Corto Plazo
Implementar DNSSEC (Extensiones de Seguridad del Sistema de Nombres de Dominio) para validar la autenticidad de las responses DNS.
#### Recomendaciones a Medio Plazo
Usar cifrado de extremo a extremo (TLS) para todas las comunicaciones. Esto asegura que incluso si se suplanta el DNS, el atacante no puede descifrar el tráfico sin la clave privada del servidor.
#### Recomendaciones a Largo Plazo
Monitorear el tráfico DNS en busca de anomalías. Auditar regularmente las configuraciones del servidor DNS para seguir las mejores prácticas de seguridad.`, 
        cwe: "CWE-290", 
        severity: "High", 
        cvss: { score: 8.1, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:C/C:H/I:L/A:N", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "C", confidentiality: "H", integrity: "L", availability: "N" }, 
        references: ["https://www.cloudflare.com/learning/dns/dns-cache-poisoning/"], 
        tags: ["Network"], 
        affectedComponents_en: "### Affected Components\n- DNS resolvers and clients within the network.", 
        details_en: "### Proof of Concept\n[TODO: Show evidence of a successful DNS spoofing attack, such as a client being redirected to a malicious IP address.]", 
        affectedComponents_es: "### Componentes Afectados\n- Resolutores y clientes DNS dentro de la red.", 
        details_es: "### Prueba de Concepto\n[TODO: Mostrar evidencia de un ataque de suplantación de DNS exitoso, como un cliente siendo redirigido a una dirección IP maliciosa.]",
        immediateActions_en: "### Immediate Actions\nFlush the DNS cache on affected resolvers and clients. Implement DNSSEC to prevent future spoofing.",
        immediateActions_es: "### Acciones Inmediatas\nLimpiar la caché de DNS en los resolutores y clientes afectados. Implementar DNSSEC para prevenir futuras suplantaciones.",
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
        recommendations_en: `#### Short-Term Recommendations
Use Dynamic ARP Inspection (DAI) on network switches to validate ARP packets.
#### Medium-Term Recommendations
Segment the network using VLANs to limit the broadcast domain and reduce the scope of a potential ARP poisoning attack.
#### Long-Term Recommendations
Encrypt all network traffic using protocols like TLS and SSH. This does not prevent ARP poisoning but mitigates the impact by preventing the attacker from reading or modifying the intercepted traffic.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Utilizar la Inspección Dinámica de ARP (DAI) en los switches de red para validar los paquetes ARP.
#### Recomendaciones a Medio Plazo
Segmentar la red utilizando VLAN para limitar el dominio de difusión y reducir el alcance de un posible ataque de envenenamiento ARP.
#### Recomendaciones a Largo Plazo
Cifrar todo el tráfico de red utilizando protocolos como TLS y SSH. Esto no previene el envenenamiento de ARP, pero mitiga el impacto al evitar que el atacante lea o modifique el tráfico interceptado.`,
        cwe: "CWE-942",
        severity: "Medium",
        cvss: { score: 6.8, vectorString: "CVSS:3.1/AV:A/AC:H/PR:N/UI:N/S:U/C:H/I:L/A:L", attackVector: "A", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "L", availability: "L" },
        references: ["https://www.veracode.com/security/arp-poisoning"],
        tags: ["Network"],
        affectedComponents_en: "### Affected Components\n- All devices on the local network segment.",
        details_en: "### Proof of Concept\n[TODO: Provide output from a tool like `arpspoof` and show intercepted traffic in a network analyzer like Wireshark.]",
        affectedComponents_es: "### Componentes Afectados\n- Todos los dispositivos en el segmento de red local.",
        details_es: "### Prueba de Concepto\n[TODO: Proporcionar la salida de una herramienta como `arpspoof` y mostrar el tráfico interceptado en un analizador de red como Wireshark.]",
        immediateActions_en: "### Immediate Actions\nEnable Dynamic ARP Inspection (DAI) on network switches to validate ARP packets and prevent spoofing.",
        immediateActions_es: "### Acciones Inmediatas\nHabilitar la Inspección Dinámica de ARP (DAI) en los conmutadores de red para validar los paquetes ARP y prevenir la suplantación.",
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
        recommendations_en: `#### Short-Term Recommendations
Use ingress filtering (BCP38) at the network edge to drop packets with source IPs from outside your network's allocated range.
#### Medium-Term Recommendations
Enable Reverse Path Forwarding (RPF) on routers, which ensures that the source address of a packet is reachable via the interface the packet came in on.
#### Long-Term Recommendations
Use cryptographic authentication protocols like IPsec, which provide data integrity and origin authentication for IP packets, making spoofing significantly more difficult.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Usar filtrado de entrada (BCP38) en el borde de la red para descartar paquetes con IPs de origen fuera del rango asignado a su red.
#### Recomendaciones a Medio Plazo
Habilitar el Reenvío de Ruta Inversa (RPF) en los enrutadores, lo que asegura que la dirección de origen de un paquete sea alcanzable a través de la interfaz por la que llegó el paquete.
#### Recomendaciones a Largo Plazo
Utilizar protocolos de autenticación criptográfica como IPsec, que proporcionan integridad de datos y autenticación de origen para los paquetes IP, lo que dificulta significativamente la suplantación.`,
        cwe: "CWE-290",
        severity: "Medium",
        cvss: { score: 6.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:L/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "L", availability: "N" },
        references: ["https://www.cloudflare.com/learning/ddos/ip-spoofing/"],
        tags: ["Network"],
        affectedComponents_en: "### Affected Components\n- Network routers, firewalls, and systems that use IP-based access controls.",
        details_en: "### Proof of Concept\n[TODO: Provide evidence of spoofed packets being accepted by a target system, using a tool like hping3 or Scapy.]",
        affectedComponents_es: "### Componentes Afectados\n- Enrutadores de red, cortafuegos y sistemas que utilizan controles de acceso basados en IP.",
        details_es: "### Prueba de Concepto\n[TODO: Proporcionar evidencia de que los paquetes suplantados son aceptados por un sistema objetivo, utilizando una herramienta como hping3 o Scapy.]",
        immediateActions_en: "### Immediate Actions\nImplement ingress filtering (BCP38/RFC 2827) at the network border to drop packets with forged source IP addresses.",
        immediateActions_es: "### Acciones Inmediatas\nImplementar el filtrado de entrada (BCP38/RFC 2827) en el borde de la red para descartar paquetes con direcciones IP de origen falsificadas.",
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
        recommendations_en: `#### Short-Term Recommendations
Use a cloud-based DDoS mitigation service that can absorb and filter malicious traffic before it reaches your network.
#### Medium-Term Recommendations
Configure network hardware (routers, firewalls) with anti-DoS settings, such as SYN cookie protection and ingress filtering. Load balance critical services across multiple servers.
#### Long-Term Recommendations
Design applications to be resilient to resource exhaustion. Implement caching and content delivery networks (CDNs) to reduce the load on origin servers.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Utilizar un servicio de mitigación de DDoS basado en la nube que pueda absorber y filtrar el tráfico malicioso antes de que llegue a su red.
#### Recomendaciones a Medio Plazo
Configurar el hardware de red (enrutadores, cortafuegos) con ajustes anti-DoS, como la protección de cookies SYN y el filtrado de entrada. Balancear la carga de los servicios críticos en varios servidores.
#### Recomendaciones a Largo Plazo
Diseñar aplicaciones para que sean resistentes al agotamiento de recursos. Implementar cachés y redes de entrega de contenido (CDN) para reducir la carga en los servidores de origen.`,
        cwe: "CWE-400",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "N", integrity: "N", availability: "H" },
        references: ["https://www.cisa.gov/news-events/news/understanding-denial-service-attacks"],
        tags: ["Network", "Infrastructure"],
        affectedComponents_en: `### Affected Components
- [TODO: Specify the targeted servers, services, or network resources.]`,
        details_en: "### Proof of Concept\n[TODO: Provide data showing the spike in traffic and corresponding resource exhaustion on the target system. Use tools like hping3 or Slowloris for demonstration.]",
        affectedComponents_es: "### Componentes Afectados\n- [TODO: Especificar los servidores, servicios o recursos de red objetivo.]",
        details_es: "### Prueba de Concepto\n[TODO: Proporcionar datos que muestren el pico de tráfico y el agotamiento de recursos correspondiente en el sistema objetivo. Usar herramientas como hping3 o Slowloris para la demostración.]",
        immediateActions_en: "### Immediate Actions\nEngage a DDoS mitigation service. Implement rate limiting and connection limits on edge devices and servers.",
        immediateActions_es: "### Acciones Inmediatas\nContratar un servicio de mitigación de DDoS. Implementar limitación de velocidad y límites de conexión en los dispositivos de borde y servidores.",
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
        recommendations_en: `#### Short-Term Recommendations
Disable Dynamic Trunking Protocol (DTP) on all end-user facing switch ports. Statically configure ports as either access or trunk ports.
#### Medium-Term Recommendations
Set the native VLAN on trunk ports to an unused VLAN ID. This prevents double-tagging attacks from reaching any active devices.
#### Long-Term Recommendations
Implement 802.1X port-based authentication to control which devices can connect to the network, preventing unauthorized devices from attempting these attacks.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Deshabilitar el Protocolo de Enlace Troncal Dinámico (DTP) en todos los puertos de switch que dan al usuario final. Configurar estáticamente los puertos como puertos de acceso o troncales.
#### Recomendaciones a Medio Plazo
Establecer la VLAN nativa en los puertos troncales a un ID de VLAN no utilizado. Esto evita que los ataques de doble etiquetado lleguen a cualquier dispositivo activo.
#### Recomendaciones a Largo Plazo
Implementar la autenticación basada en puertos 802.1X para controlar qué dispositivos pueden conectarse a la red, evitando que dispositivos no autorizados intenten estos ataques.`,
        cwe: "CWE-693",
        severity: "Medium",
        cvss: { score: 6.8, vectorString: "CVSS:3.1/AV:A/AC:H/PR:N/UI:N/S:U/C:H/I:L/A:L", attackVector: "A", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "L", availability: "L" },
        references: ["https://www.cisco.com/c/en/us/support/docs/lan-switching/vlan/10560-14.html"],
        tags: ["Network", "Infrastructure"],
        affectedComponents_en: "### Affected Components\n- Network switches with misconfigured ports.",
        details_en: "### Proof of Concept\n[TODO: Provide steps to perform a VLAN hopping attack using a tool like Yersinia and show access to a resource on a different VLAN.]",
        affectedComponents_es: "### Componentes Afectados\n- Switches de red con puertos mal configurados.",
        details_es: "### Prueba de Concepto\n[TODO: Proporcionar los pasos para realizar un ataque de salto de VLAN utilizando una herramienta como Yersinia y mostrar el acceso a un recurso en una VLAN diferente.]",
        immediateActions_en: "### Immediate Actions\nDisable Dynamic Trunking Protocol (DTP) on all user-facing switch ports and configure them as static access ports.",
        immediateActions_es: "### Acciones Inmediatas\nDeshabilitar el Protocolo de Enlace Troncal Dinámico (DTP) en todos los puertos de conmutador orientados al usuario y configurarlos como puertos de acceso estáticos.",
    },
    {
        id: "vuln-net-007",
        title_en: "Weak Network Encryption",
        title_es: "Cifrado Débil de Red",
        overview_en: `### Overview
Weak network encryption refers to the use of outdated or insecure protocols and cipher suites for protecting data in transit, making it susceptible to eavesdropping and decryption.`,
        overview_es: `### Resumen
El cifrado débil de red se refiere al uso de protocolos y conjuntos de cifrado obsoletos o inseguros para proteger los datos en tránsito, lo que los hace susceptibles a la escucha y el descifrado.`,
        technicalDescription_en: `### Technical Description
This vulnerability includes supporting weak protocols like SSLv2, SSLv3, or early TLS versions (1.0, 1.1), or using cipher suites with known vulnerabilities (e.g., those using RC4, 3DES, or having small key sizes). An attacker can exploit these weaknesses to decrypt intercepted traffic.`,
        technicalDescription_es: `### Descripción Técnica
Esta vulnerabilidad incluye el soporte de protocolos débiles como SSLv2, SSLv3 o versiones tempranas de TLS (1.0, 1.1), o el uso de conjuntos de cifrado con vulnerabilidades conocidas (p. ej., los que usan RC4, 3DES o tienen tamaños de clave pequeños). Un atacante puede explotar estas debilidades para descifrar el tráfico interceptado.`,
        impact_en: `### Impact
An attacker can decrypt sensitive data transmitted over the network, including credentials, session tokens, and personal information, leading to a loss of confidentiality and integrity.`,
        impact_es: `### Impacto
Un atacante puede descifrar datos sensibles transmitidos por la red, incluidas credenciales, tokens de sesión e información personal, lo que lleva a una pérdida de confidencialidad e integridad.`,
        recommendations_en: `#### Short-Term Recommendations
Configure servers to only support TLS 1.2 and TLS 1.3 with a strong, modern set of cipher suites that provide forward secrecy.
#### Medium-Term Recommendations
Implement HTTP Strict Transport Security (HSTS) to ensure that browsers always connect to the server over a secure connection.
#### Long-Term Recommendations
Establish a corporate policy for cryptographic standards for network communication. Regularly audit all external and internal services for compliance using tools like SSL Labs' SSL Test.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Configurar los servidores para que solo admitan TLS 1.2 y TLS 1.3 con un conjunto de cifrado fuerte y moderno que proporcione secreto hacia adelante (forward secrecy).
#### Recomendaciones a Medio Plazo
Implementar HTTP Strict Transport Security (HSTS) para garantizar que los navegadores siempre se conecten al servidor a través de una conexión segura.
#### Recomendaciones a Largo Plazo
Establecer una política corporativa para los estándares criptográficos para la comunicación de red. Auditar regularmente todos los servicios externos e internos para verificar el cumplimiento utilizando herramientas como la prueba SSL de SSL Labs.`,
        cwe: "CWE-326",
        severity: "High",
        cvss: { score: 7.4, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:N", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "N" },
        references: ["https://www.ssllabs.com/projects/best-practices/"],
        tags: ["Network", "Cryptography"],
        affectedComponents_en: `### Affected Components
- [TODO: List the servers or services that support weak encryption protocols or ciphers.]`,
        details_en: "### Proof of Concept\n[TODO: Provide a report from a tool like `nmap --script ssl-enum-ciphers` or a report from SSL Labs showing the support for weak protocols or ciphers.]",
        affectedComponents_es: `### Componentes Afectados
- [TODO: Listar los servidores o servicios que admiten protocolos o conjuntos de cifrado débiles.]`,
        details_es: "### Prueba de Concepto\n[TODO: Proporcionar un informe de una herramienta como `nmap --script ssl-enum-ciphers` o un informe de SSL Labs que muestre el soporte para protocolos o cifrados débiles.]",
        immediateActions_en: "### Immediate Actions\nImmediately disable support for all SSL versions and TLS 1.0/1.1 on the server. Disable all known weak cipher suites.",
        immediateActions_es: "### Acciones Inmediatas\nDeshabilitar inmediatamente el soporte para todas las versiones de SSL y TLS 1.0/1.1 en el servidor. Deshabilitar todos los conjuntos de cifrado débiles conocidos.",
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
        recommendations_en: `#### Short-Term Recommendations
Review and simplify the firewall rulebase to remove unused or redundant rules. Implement a 'deny-by-default' firewall policy.
#### Medium-Term Recommendations
Implement both ingress and egress filtering. Enable and monitor firewall logs to detect suspicious activity and policy violations.
#### Long-Term Recommendations
Automate the process of firewall rule review and validation. Use a network security policy management tool to maintain consistency and compliance.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Implementar una política de firewall de 'denegar por defecto'. Revisar y simplificar regularmente la base de reglas del firewall para eliminar reglas no utilizadas o redundantes.
#### Recomendaciones a Medio Plazo
Implementar tanto el filtrado de entrada como el de salida. Habilitar y monitorear los registros del firewall para detectar actividades sospechosas y violaciones de políticas.
#### Recomendaciones a Largo Plazo
Automatizar el proceso de revisión y validación de reglas de firewall. Usar una herramienta de gestión de políticas de seguridad de red para mantener la coherencia y el cumplimiento.`,
        cwe: "CWE-552",
        severity: "High",
        cvss: { score: 8.6, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:N/A:L", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "C", confidentiality: "H", integrity: "N", availability: "L" },
        references: ["https://www.cisa.gov/uscert/bsi/articles/best-practices/firewalls/securing-your-web-server"],
        tags: ["Network", "Infrastructure"],
        affectedComponents_en: `### Affected Components
- The corporate firewall(s).`,
        details_en: `### Proof of Concept
[TODO: Provide a screenshot of the firewall rulebase showing the permissive rule, or demonstrate access to a supposedly blocked port/service.]`,
        affectedComponents_es: `### Componentes Afectados
- El/los firewall(s) corporativo(s).`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar una captura de pantalla de la base de reglas del firewall que muestre la regla permisiva, o demostrar el acceso a un puerto/servicio supuestamente bloqueado.]`,
        immediateActions_en: "### Immediate Actions\nReview the firewall rulebase and immediately remove or restrict any overly permissive 'any/any' rules. Apply a 'deny-by-default' policy.",
        immediateActions_es: "### Acciones Inmediatas\nRevisar la base de reglas del firewall y eliminar o restringir inmediatamente cualquier regla 'cualquiera/cualquiera' demasiado permisiva. Aplicar una política de 'denegar por defecto'.",
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
        recommendations_en: `#### Short-Term Recommendations
Use WPA3 encryption for all Wi-Fi networks. If WPA3 is not available, use WPA2 with a strong, long, and complex pre-shared key.
#### Medium-Term Recommendations
Implement a guest network that is completely segregated from the internal corporate network for visitors and non-corporate devices.
#### Long-Term Recommendations
Implement enterprise-level Wi-Fi security using 802.1X, which authenticates each user individually (e.g., with a username and password) rather than using a shared key.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Utilizar cifrado WPA3 para todas las redes Wi-Fi. Si WPA3 no está disponible, usar WPA2 con una clave pre-compartida fuerte, larga y compleja.
#### Recomendaciones a Medio Plazo
Implementar una red de invitados que esté completamente segregada de la red corporativa interna para visitantes y dispositivos no corporativos.
#### Recomendaciones a Largo Plazo
Implementar seguridad Wi-Fi de nivel empresarial utilizando 802.1X, que autentica a cada usuario individualmente (p. ej., con un nombre de usuario y contraseña) en lugar de usar una clave compartida.`,
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
[TODO: Proporcionar evidencia de la conexión a la red no segura o del descifrado de una contraseña WPA2 débil utilizando una herramienta como Aircrack-ng.]`,
        immediateActions_en: "### Immediate Actions\nImmediately disable any open Wi-Fi networks. Change weak WPA2 passwords to strong, complex phrases and enable WPA3 if available.",
        immediateActions_es: "### Acciones Inmediatas\nDeshabilitar inmediatamente cualquier red Wi-Fi abierta. Cambiar las contraseñas WPA2 débiles por frases complejas y seguras, y habilitar WPA3 si está disponible.",
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
        recommendations_en: `#### Short-Term Recommendations
Enforce the use of strong, end-to-end encryption (e.g., TLS 1.2+) for all data in transit, both on internal and external networks.
#### Medium-Term Recommendations
Disable and decommission all legacy, unencrypted protocols within the environment.
#### Long-Term Recommendations
Implement network segmentation and a 'zero-trust' network model, where traffic between different network segments is also encrypted and inspected.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Hacer cumplir el uso de un cifrado fuerte de extremo a extremo (p. ej., TLS 1.2+) para todos los datos en tránsito, tanto en redes internas como externas.
#### Recomendaciones a Medio Plazo
Deshabilitar y dar de baja todos los protocolos heredados y no cifrados dentro del entorno.
#### Recomendaciones a Largo Plazo
Implementar la segmentación de la red y un modelo de red de 'confianza cero', donde el tráfico entre diferentes segmentos de red también se cifra e inspecciona.`,
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
[TODO: Proporcionar una captura de pantalla de Wireshark o una herramienta similar que muestre datos sensibles capturados en texto claro.]`,
        immediateActions_en: "### Immediate Actions\nImmediately disable any services that transmit sensitive data over unencrypted protocols. Enforce TLS across all applications.",
        immediateActions_es: "### Acciones Inmediatas\nDeshabilitar inmediatamente cualquier servicio que transmita datos sensibles a través de protocolos no cifrados. Forzar el uso de TLS en todas las aplicaciones.",
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
        recommendations_en: `#### Short-Term Recommendations
Establish a robust patch management policy and process. Subscribe to security advisories for all software used in the environment.
#### Medium-Term Recommendations
Implement an automated patch management system to ensure that patches are applied in a timely manner. Use a vulnerability scanner to regularly scan the infrastructure for unpatched software.
#### Long-Term Recommendations
Integrate vulnerability scanning into the CI/CD pipeline. Use software composition analysis (SCA) tools to identify and manage vulnerabilities in third-party libraries.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Establecer una política y un proceso de gestión de parches sólidos. Suscribirse a los avisos de seguridad de todo el software utilizado en el entorno.
#### Recomendaciones a Medio Plazo
Implementar un sistema de gestión de parches automatizado para garantizar que los parches se apliquen de manera oportuna. Usar un escáner de vulnerabilidades para escanear regularmente la infraestructura en busca de software sin parches.
#### Recomendaciones a Largo Plazo
Integrar el escaneo de vulnerabilidades en el pipeline de CI/CD. Usar herramientas de análisis de composición de software (SCA) para identificar y gestionar las vulnerabilidades en las bibliotecas de terceros.`,
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
[TODO: Proporcionar los pasos para explotar la vulnerabilidad, incluido cualquier código de explotación público utilizado y capturas de pantalla que muestren el compromiso.]`,
        immediateActions_en: "### Immediate Actions\nApply security patches to the vulnerable software immediately. If a patch is not available, isolate the system from the network or disable the service.",
        immediateActions_es: "### Acciones Inmediatas\nAplicar inmediatamente los parches de seguridad al software vulnerable. Si no hay un parche disponible, aislar el sistema de la red o deshabilitar el servicio.",
    },
    {
        id: "vuln-infra-002",
        title_en: "Default Credentials",
        title_es: "Credenciales por Defecto",
        overview_en: `### Overview
Many systems, devices, and applications are shipped with default usernames and passwords. Failure to change these credentials leaves an easy entry point for attackers.`,
        overview_es: `### Resumen
Muchos sistemas, dispositivos y aplicaciones se entregan con nombres de usuario y contraseñas predeterminados. No cambiar estas credenciales deja un punto de entrada fácil para los atacantes.`,
        technicalDescription_en: `### Technical Description
An administrator or user fails to change the default credentials for a piece of software or hardware (e.g., admin/admin on a router, administrator/password on a web application). Attackers can use automated scanners to find systems with these default credentials and gain immediate administrative access.`,
        technicalDescription_es: `### Descripción Técnica
Un administrador o usuario no cambia las credenciales predeterminadas de un software o hardware (p. ej., admin/admin en un enrutador, administrator/password en una aplicación web). Los atacantes pueden usar escáneres automatizados para encontrar sistemas con estas credenciales predeterminadas y obtener acceso administrativo inmediato.`,
        impact_en: `### Impact
An attacker can gain full administrative control of the affected system, leading to data theft, system compromise, and a pivot point to attack other systems on the network.`,
        impact_es: `### Impacto
Un atacante puede obtener el control administrativo total del sistema afectado, lo que conduce al robo de datos, el compromiso del sistema y un punto de pivote para atacar otros sistemas en la red.`,
        recommendations_en: `#### Short-Term Recommendations
Audit the entire infrastructure for any use of default credentials and change them to strong, unique passwords.
#### Medium-Term Recommendations
Incorporate checks for default credentials into the standard build and deployment process for all new systems.
#### Long-Term Recommendations
Automate scanning for default credentials across the environment. Implement a policy that prohibits the deployment of any system with default credentials active.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Auditar toda la infraestructura en busca de cualquier uso de credenciales predeterminadas y cambiarlas por contraseñas seguras y únicas.
#### Recomendaciones a Medio Plazo
Incorporar comprobaciones de credenciales predeterminadas en el proceso de compilación e implementación estándar para todos los sistemas nuevos.
#### Recomendaciones a Largo Plazo
Automatizar el escaneo en busca de credenciales predeterminadas en todo el entorno. Implementar una política que prohíba la implementación de cualquier sistema con credenciales predeterminadas activas.`,
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
[TODO: Proporcionar una captura de pantalla de un inicio de sesión exitoso utilizando las credenciales predeterminadas.]`,
        immediateActions_en: "### Immediate Actions\nImmediately change all default passwords on affected systems to strong, unique values. Disable the default accounts if they are not needed.",
        immediateActions_es: "### Acciones Inmediatas\nCambiar inmediatamente todas las contraseñas predeterminadas en los sistemas afectados por valores fuertes y únicos. Deshabilitar las cuentas predeterminadas si no son necesarias.",
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
The vulnerability occurs when the application uses user-supplied input to construct a file path for reading or writing without properly sanitizing it. By using \`../\` sequences, an attacker can navigate outside of the intended directory and access files elsewhere on the filesystem.`,
        technicalDescription_es: `### Descripción Técnica
La vulnerabilidad ocurre cuando la aplicación utiliza la entrada proporcionada por el usuario para construir una ruta de archivo para leer o escribir sin sanearla adecuadamente. Al usar secuencias \`../\`, un atacante puede navegar fuera del directorio previsto y acceder a archivos en otras partes del sistema de archivos.`,
        impact_en: `### Impact
Allows an attacker to read sensitive information from the server's filesystem, including application source code, configuration files with credentials, and OS files like \`/etc/passwd\`.`,
        impact_es: `### Impacto
Permite a un atacante leer información sensible del sistema de archivos del servidor, incluido el código fuente de la aplicación, archivos de configuración con credenciales y archivos del sistema operativo como \`/etc/passwd\`.`,
        recommendations_en: `#### Short-Term Recommendations
Validate user input against a strict allow-list of characters or file paths. Ideally, do not pass user input directly to filesystem APIs.
#### Medium-Term Recommendations
Use a mapping mechanism where user input corresponds to a predefined, safe file path on the server.
#### Long-Term Recommendations
Run the application with the minimum necessary filesystem permissions in a chrooted or sandboxed environment to limit the scope of a potential traversal attack.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Validar la entrada del usuario contra una lista blanca estricta de caracteres o rutas de archivo. Idealmente, no pasar la entrada del usuario directamente a las API del sistema de archivos.
#### Recomendaciones a Medio Plazo
Usar un mecanismo de mapeo donde la entrada del usuario corresponda a una ruta de archivo predefinida y segura en el servidor.
#### Recomendaciones a Largo Plazo
Ejecutar la aplicación con los permisos mínimos necesarios del sistema de archivos en un entorno chroot o sandbox para limitar el alcance de un posible ataque de salto.`,
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
[TODO: Proporcionar una solicitud con una carga útil de salto de ruta y mostrar el contenido de un archivo sensible en la respuesta.]`,
        immediateActions_en: "### Immediate Actions\nImplement strict input validation and sanitization on the affected parameters to filter out directory traversal characters like `../`.",
        immediateActions_es: "### Acciones Inmediatas\nImplementar una validación y saneamiento de entrada estrictos en los parámetros afectados para filtrar los caracteres de salto de directorio como `../`.",
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
        recommendations_en: `#### Short-Term Recommendations
Patch the underlying vulnerability that led to RCE. This could involve updating software, fixing an injection flaw, or disabling the vulnerable feature.
#### Medium-Term Recommendations
Implement the principle of least privilege. Run application processes with the minimum necessary permissions to limit the impact of a potential RCE.
#### Long-Term Recommendations
Use a Web Application Firewall (WAF) with rules to detect and block command injection attempts. Implement egress filtering to prevent compromised systems from communicating with attacker-controlled servers.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Parchear la vulnerabilidad subyacente que condujo a la RCE. Esto podría implicar la actualización del software, la corrección de una falla de inyección o la desactivación de la función vulnerable.
#### Recomendaciones a Medio Plazo
Implementar el principio de privilegio mínimo. Ejecutar los procesos de la aplicación con los permisos mínimos necesarios para limitar el impacto de una posible RCE.
#### Recomendaciones a Largo Plazo
Usar un Web Application Firewall (WAF) con rules para detectar y bloquear los patrones de ataque comunes. Implementar el filtrado de salida para evitar que los sistemas comprometidos se comuniquen con los servidores controlados por el atacante.`,
        cwe: "CWE-94",
        severity: "Critical",
        cvss: { score: 9.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        references: ["https://owasp.org/www-community/attacks/Code_Injection"],
        tags: ["Infrastructure", "Web"],
        affectedComponents_en: `### Affected Components
- [TODO: Specify the system and vulnerability that allows RCE.]`,
        details_en: "### Proof of Concept\n[TODO: Provide the steps taken to achieve remote code execution and show the output of a command (e.g., `whoami`, `id`) running on the target server.]",
        affectedComponents_es: `### Componentes Afectados
- [TODO: Especificar el sistema y la vulnerabilidad que permite la RCE.]`,
        details_es: "### Prueba de Concepto\n[TODO: Proporcionar los pasos seguidos para lograr la ejecución remota de código y mostrar la salida de un comando (p. ej., `whoami`, `id`) ejecutándose en el servidor objetivo.]",
        immediateActions_en: "### Immediate Actions\nIsolate the compromised system from the network. Patch the underlying vulnerability (e.g., update software, fix injection flaw) immediately.",
        immediateActions_es: "### Acciones Inmediatas\nAislar el sistema comprometido de la red. Parchear inmediatamente la vulnerabilidad subyacente (p. ej., actualizar el software, corregir la falla de inyección).",
    },
    {
        id: "vuln-infra-005",
        title_en: "Privilege Escalation",
        title_es: "Escalación de Privilegios",
        overview_en: `### Overview
Privilege escalation is the act of exploiting a bug, design flaw, or configuration oversight in an operating system or software application to gain elevated access to resources that are normally protected from an application or user.`,
        overview_es: `### Resumen
La escalada de privilegios es el acto de explotar un error, un defecto de diseño o una supervisión de configuración en un sistema operativo o una aplicación de software para obtener acceso elevado a recursos que normalmente están protegidos de una aplicación o usuario.`,
        technicalDescription_en: `### Technical Description
This can occur in two forms: Vertical privilege escalation, where a lower-privilege user gains higher-privilege access (e.g., user to root), and horizontal privilege escalation, where a user gains access to resources belonging to another user. Common vectors include misconfigured SUID binaries, kernel exploits, services running with excessive privileges, and weak file permissions.`,
        technicalDescription_es: `### Descripción Técnica
Esto puede ocurrir de dos formas: escalada de privilegios vertical, donde un usuario de bajos privilegios obtiene acceso de mayores privilegios (p. ej., de usuario a root), y escalada de privilegios horizontal, donde un usuario obtiene acceso a recursos que pertenecen a otro usuario. Los vectores comunes incluyen binarios SUID mal configurados, exploits del kernel, servicios que se ejecutan con privilegios excesivos y permisos de archivo débiles.`,
        impact_en: `### Impact
Successful privilege escalation can result in an attacker gaining full administrative control over a system, allowing them to install persistent backdoors, steal all data on the system, and use it as a launchpad for further attacks.`,
        impact_es: `### Impacto
Una escalada de privilegios exitosa puede resultar en que un atacante obtenga el control administrativo total sobre un sistema, lo que le permite instalar puertas traseras persistentes, robar todos los datos del sistema y usarlo como plataforma de lanzamiento para nuevos ataques.`,
        recommendations_en: `#### Short-Term Recommendations
Apply the principle of least privilege to all users, processes, and files. Regularly audit SUID/GUID binaries and file permissions.
#### Medium-Term Recommendations
Keep the operating system and all software fully patched to protect against kernel and software exploits.
#### Long-Term Recommendations
Use mandatory access control systems like SELinux or AppArmor to enforce strict boundaries on what processes can do, even if they are compromised.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Aplicar el principio de privilegio mínimo a todos los usuarios, procesos y archivos. Auditar regularmente los binarios SUID/GUID y los permisos de los archivos.
#### Recomendaciones a Medio Plazo
Mantener el sistema operativo y todo el software completamente parcheados para protegerse contra exploits del kernel y de software.
#### Recomendaciones a Largo Plazo
Utilizar sistemas de control de acceso obligatorio como SELinux o AppArmor para imponer límites estrictos sobre lo que pueden hacer los procesos, incluso si están comprometidos.`,
        cwe: "CWE-269",
        severity: "High",
        cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "L", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        references: ["https://attack.mitre.org/tactics/TA0004/"],
        tags: ["Infrastructure"],
        affectedComponents_en: `### Affected Components
- [TODO: Specify the operating system or application and the specific misconfiguration or vulnerability that allows privilege escalation.]`,
        details_en: "### Proof of Concept\n[TODO: Provide the sequence of commands used to escalate privileges and show the output of `whoami` or `id` as the high-privilege user.]",
        affectedComponents_es: `### Componentes Afectados
- [TODO: Especificar el sistema operativo o la aplicación y la configuración incorrecta o vulnerabilidad específica que permite la escalada de privilegios.]`,
        details_es: "### Prueba de Concepto\n[TODO: Proporcionar la secuencia de comandos utilizados para escalar privilegios y mostrar la salida de `whoami` o `id` como el usuario de altos privilegios.]",
        immediateActions_en: "### Immediate Actions\nImmediately patch the vulnerable component or correct the misconfiguration (e.g., remove SUID bit, fix permissions).",
        immediateActions_es: "### Acciones Inmediatas\nParchear inmediatamente el componente vulnerable o corregir la configuración incorrecta (p. ej., eliminar el bit SUID, corregir los permisos).",
    },
    {
        id: "vuln-infra-006",
        title_en: "Information Disclosure",
        title_es: "Divulgación de Información",
        overview_en: `### Overview
Information disclosure vulnerabilities allow an attacker to gain sensitive information about a system, its configuration, or its users, which can be used to facilitate other attacks.`,
        overview_es: `### Resumen
Las vulnerabilidades de divulgación de información permiten a un atacante obtener información sensible sobre un sistema, su configuración o sus usuarios, que puede ser utilizada para facilitar otros ataques.`,
        technicalDescription_en: `### Technical Description
This can happen through verbose error messages that reveal stack traces or database errors, software version banners that reveal unpatched components, exposed debugging endpoints, or publicly accessible configuration files and source code repositories (e.g., exposed \`.git\` directory).`,
        technicalDescription_es: `### Descripción Técnica
Esto puede suceder a través de mensajes de error detallados que revelan seguimientos de pila o errores de base de datos, banners de versión de software que revelan componentes sin parches, puntos finales de depuración expuestos o archivos de configuración y repositorios de código fuente de acceso público (p. ej., directorio \`.git\` exposed).`,
        impact_en: `### Impact
While often a lower-severity finding on its own, information disclosure provides attackers with valuable intelligence for planning more targeted and effective attacks. It can expose software versions, internal paths, and business logic.`,
        impact_es: `### Impacto
Aunque a menudo es un hallazgo de menor gravedad por sí solo, la divulgación de información proporciona a los atacantes una inteligencia valiosa para planificar ataques más dirigidos y efectivos. Puede exponer versiones de software, rutas internas y lógica de negocio.`,
        recommendations_en: `#### Short-Term Recommendations
Disable verbose error reporting in production environments. Configure web servers to suppress software version banners.
#### Medium-Term Recommendations
Ensure that sensitive files, configuration files, and source code repositories are not accessible from the web root.
#### Long-Term Recommendations
Implement a standardized logging mechanism that captures detailed errors for internal analysis but does not expose them to users. Regularly scan for information disclosure vulnerabilities.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Deshabilitar los informes de errores detallados en los entornos de producción. Configurar los servidores web para suprimir los banners de versión de software.
#### Recomendaciones a Medio Plazo
Asegurarse de que los archivos sensibles, los archivos de configuración y los repositorios de código fuente no sean accesibles desde la raíz web.
#### Recomendaciones a Largo Plazo
Implementar un mecanismo de registro estandarizado que capture errores detallados para el análisis interno pero no los exponga a los usuarios. Escanear regularmente en busca de vulnerabilidades de divulgación de información.`,
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
[TODO: Proporcionar una captura de pantalla o respuesta del servidor que muestre la información divulgada.]`,
        immediateActions_en: "### Immediate Actions\nImmediately disable verbose error messages in the production environment. Remove any exposed sensitive files or directories from the web root.",
        immediateActions_es: "### Acciones Inmediatas\nDeshabilitar inmediatamente los mensajes de error detallados en el entorno de producción. Eliminar cualquier archivo o directorio sensible expuesto de la raíz web.",
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
        recommendations_en: `#### Short-Term Recommendations
Never call system shell commands with user-supplied input. Use built-in language functions or libraries that provide the required functionality without invoking a shell.
#### Medium-Term Recommendations
If calling a system command is unavoidable, use structured APIs that accept a list of arguments rather than a single command string. This prevents the shell from interpreting metacharacters.
#### Long-Term Recommendations
Run the application with the minimum privileges necessary. Implement a Web Application Firewall (WAF) with rules to detect and block command injection attempts.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Nunca llamar a comandos de la shell del sistema con datos suministrados por el usuario. Usar funciones o bibliotecas integradas del lenguaje que proporcionen la funcionalidad requerida sin invocar una shell.
#### Recomendaciones a Medio Plazo
Si es inevitable llamar a un comando del sistema, usar API estructuradas que acepten una lista de argumentos en lugar de una sola cadena de comando. Esto evita que la shell interprete los metacaracteres.
#### Recomendaciones a Largo Plazo
Ejecutar la aplicación con los privilegios mínimos necesarios. Implementar un Web Application Firewall (WAF) con reglas para detectar y bloquear los patrones de ataque comunes. `,
        cwe: "CWE-77",
        severity: "Critical",
        cvss: { score: 9.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        references: ["https://owasp.org/www-community/attacks/Code_Injection"],
        tags: ["Infrastructure", "Web"],
        affectedComponents_en: `### Affected Components
- [TODO: Specify the vulnerable function, parameter, and URL.]`,
        details_en: `### Proof of Concept
[TODO: Provide a request with a command injection payload (e.g., \`; id\`) and show the output of the executed command.]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Especificar la función, el parámetro y la URL vulnerables.]`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar una solicitud con una carga útil de inyección de comandos (p. ej., \`; id\`) y mostrar la salida del comando ejecutado.]`,
        immediateActions_en: "### Immediate Actions\nImplement input sanitization to filter or escape shell metacharacters from user-supplied data in the vulnerable function.",
        immediateActions_es: "### Acciones Inmediatas\nImplementar inmediatamente el saneamiento de entradas para filtrar o escapar los metacaracteres de la shell de los datos proporcionados por el usuario en la función vulnerable.",
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
        recommendations_en: `#### Short-Term Recommendations
Avoid passing user-supplied input to filesystem APIs entirely. Use an allow-list of safe, known file identifiers instead.
#### Medium-Term Recommendations
If user input in file paths is unavoidable, ensure the application canonicalizes the path and verifies that it starts with the expected base directory before using it.
#### Long-Term Recommendations
Run the application in a sandboxed or chrooted jail with minimal filesystem access to limit the impact of a successful traversal attack.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Evitar por completo pasar la entrada proporcionada por el usuario a las API del sistema de archivos. En su lugar, utilizar una lista blanca de identificadores de archivo seguros y conocidos.
#### Recomendaciones a Medio Plazo
Si la entrada del usuario en las rutas de archivo es inevitable, asegurarse de que la aplicación canonicalice la ruta y verifique que comienza con el directorio base esperado antes de usarla.
#### Recomendaciones a Largo Plazo
Ejecutar la aplicación en una jaula (jail) chroot o sandbox con acceso mínimo al sistema de archivos para limitar el impacto de un ataque de salto exitoso.`,
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
[TODO: Proporcionar una solicitud con una carga útil de salto de ruta y mostrar el contenido de un archivo sensible (p. ej., /etc/passwd) en la respuesta.]`,
        immediateActions_en: "### Immediate Actions\nImplement strict input validation on the vulnerable parameter to filter directory traversal characters. Canonicalize all file paths before use.",
        immediateActions_es: "### Acciones Inmediatas\nImplementar una validación de entrada estricta en el parámetro vulnerable para filtrar los caracteres de salto de directorio. Canonicalizar todas las rutas de archivo antes de su uso.",
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
        recommendations_en: `#### Short-Term Recommendations
Do not use user-supplied input to determine the redirect destination. Use a server-side mapping of short names or IDs to full target URLs.
#### Medium-Term Recommendations
If dynamic redirects are necessary, maintain an allow-list of trusted domains and validate the redirect parameter against this list. Ensure the URL scheme is also validated (e.g., only allow \`http\` and \`https\` ).
#### Long-Term Recommendations
Display an intermediate page that clearly informs the user they are being redirected to another website, and require them to click a link to proceed.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
No utilizar la entrada proporcionada por el usuario para determinar el destino de la redirección. Utilizar un mapeo del lado del servidor de nombres cortos o ID a las URL de destino completas.
#### Recomendaciones a Medio Plazo
Si las redirecciones dinámicas son necesarias, mantener una lista blanca de dominios de confianza y validar el parámetro de redirección contra esta lista. Asegurarse de que también se valide el esquema de la URL (p. ej., solo permitir \`http\` y \`https\` ).
#### Recomendaciones a Largo Plazo
Mostrar una página intermedia que informe claramente al usuario que está siendo redirigido a otro sitio web, y requerir que haga clic en un enlace para continuar.`,
        cwe: "CWE-601",
        severity: "Medium",
        cvss: { score: 5.4, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "L", integrity: "L", availability: "N" },
        references: ["https://owasp.org/www-community/vulnerabilities/Unvalidated_Redirects_and_Forwards_Cheat_Sheet"],
        tags: ["Infrastructure", "Web"],
        affectedComponents_en: `### Affected Components
- [TODO: List the vulnerable URL and the ID parameter.]`,
        details_en: `### Proof of Concept
[TODO: Provide a URL that, when clicked, redirects the user to an external, attacker-controlled domain.]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Listar la URL vulnerable y el parámetro de ID.]`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar una URL que, al hacer clic, redirija al usuario a un dominio externo controlado por el atacante.]`,
        immediateActions_en: "### Immediate Actions\nImplement a server-side allow-list for all redirect URLs. Disallow any redirection to external domains.",
        immediateActions_es: "### Acciones Inmediatas\nImplementar una lista blanca del lado del servidor para todas las URL de redirección. No permitir ninguna redirección a dominios externos.",
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
        recommendations_en: `#### Short-Term Recommendations
Apply the principle of least privilege. Grant access only to the specific user groups that require it, with the minimum necessary permissions (e.g., read-only vs. read/write).
#### Medium-Term Recommendations
Implement a regular auditing process for file share permissions to identify and remediate overly permissive configurations.
#### Long-Term Recommendations
Consider migrating from traditional file shares to more modern, secure collaboration platforms that offer more granular access controls and better auditing capabilities.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Aplicar el principio de privilegio mínimo. Otorgar acceso solo a los grupos de usuarios específicos que lo requieran, con los permisos mínimos necesarios (p. ej., solo lectura frente a lectura/escritura).
#### Recomendaciones a Medio Plazo
Implementar un proceso de auditoría regular para los permisos de los recursos compartidos de archivos para identificar y remediar configuraciones demasiado permisivas.
#### Recomendaciones a Largo Plazo
Considerar la migración de los recursos compartidos de archivos tradicionales a plataformas de colaboración más modernas y seguras que ofrezcan controles de acceso más granulares y mejores capacidades de auditoría.`,
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
[TODO: Proporcionar una captura de pantalla que muestre el acceso al recurso compartido inseguro y una lista de su contenido.]`,
        immediateActions_en: "### Immediate Actions\nImmediately remove 'Everyone' or 'Anonymous' permissions from the file share. Apply access controls based on the principle of least privilege.",
        immediateActions_es: "### Acciones Inmediatas\nEliminar inmediatamente los permisos de 'Todos' o 'Anónimo' del recurso compartido de archivos. Aplicar controles de acceso basados en el principio de privilegio mínimo.",
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
        recommendations_en: `#### Short-Term Recommendations
Remove the sensitive data from the file share. Implement a secure secrets management solution for storing service account passwords and other credentials.
#### Medium-Term Recommendations
Implement a data loss prevention (DLP) solution to automatically scan file shares for sensitive information.
#### Long-Term Recommendations
Conduct regular security awareness training for all employees on the proper handling and storage of sensitive data. Establish a clear data classification policy.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Eliminar los datos sensibles del recurso compartido de archivos. Implementar una solución segura de gestión de secretos para almacenar contraseñas de cuentas de servicio y otras credenciales.
#### Recomendaciones a Medio Plazo
Implementar una solución de prevención de pérdida de datos (DLP) para escanear automáticamente los recursos compartidos de archivos en busca de información sensible.
#### Recomendaciones a Largo Plazo
Realizar capacitaciones periódicas de concienciación sobre seguridad para todos los empleados sobre el manejo y almacenamiento adecuados de datos sensibles. Establecer una política clara de clasificación de datos.`,
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
[TODO: Proporcionar una captura de pantalla del contenido del archivo, redactando cualquier información altamente sensible.]`,
        immediateActions_en: "### Immediate Actions\nImmediately remove the sensitive files from the share. Revoke and rotate any credentials found in the files.",
        immediateActions_es: "### Acciones Inmediatas\nEliminar inmediatamente los archivos sensibles del recurso compartido. Revocar y rotar cualquier credencial encontrada en los archivos.",
    },
    {
        id: "vuln-infra-012",
        title_en: "Unnecessary Exposed Services",
        title_es: "Servicios Expuestos Innecesariamente",
        overview_en: `### Overview
Services that are not intended for public access, such as databases, remote management interfaces (RDP, SSH), or internal applications, are exposed to the internet.`,
        overview_es: `### Resumen
Los servicios que no están destinados al acceso público, como bases de datos, interfaces de gestión remota (RDP, SSH) o aplicaciones internas, están expuestos a Internet.`,
        technicalDescription_en: `### Technical Description
Due to a misconfiguration in a firewall, cloud security group, or network routing, services that should only be accessible on the internal network are reachable from the public internet. This dramatically increases the attack surface of the organization.`,
        technicalDescription_es: `### Descripción Técnica
Debido a una configuración incorrecta en un firewall, un grupo de seguridad en la nube o el enrutamiento de la red, los servicios que solo deberían ser accesibles en la red interna son accesibles desde la Internet pública. Esto aumenta drásticamente la superficie de ataque de la organización.`,
        impact_en: `### Impact
Exposed services can be subjected to brute-force attacks, denial-of-service, or exploitation of known vulnerabilities, potentially leading to a full compromise of the system.`,
        impact_es: `### Impacto
Los servicios expuestos pueden ser objeto de ataques de fuerza bruta, denegación de servicio o explotación de vulnerabilidades conocidas, lo que puede llevar a un compromiso total del sistema.`,
        recommendations_en: `#### Short-Term Recommendations
Implement a 'deny-by-default' firewall policy. Only allow access to specific services from trusted IP ranges.
#### Medium-Term Recommendations
Conduct regular external network scans to identify any unintentionally exposed services. Use a VPN with multi-factor authentication for all remote management access.
#### Long-Term Recommendations
Implement a robust change management process for all firewall and network configuration changes to prevent accidental exposure.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Implementar una política de firewall de 'denegar por defecto'. Solo permitir el acceso a servicios específicos desde rangos de IP de confianza.
#### Recomendaciones a Medio Plazo
Realizar escaneos de red externos regulares para identificar cualquier servicio expuesto involuntariamente. Usar una VPN con autenticación multifactor para todo el acceso de gestión remota.
#### Recomendaciones a Largo Plazo
Implementar un proceso de gestión de cambios robusto para todos los cambios de configuración de firewall y red para evitar la exposición accidental.`,
        cwe: "CWE-489",
        severity: "High",
        cvss: { score: 8.6, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:N/A:L", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "C", confidentiality: "H", integrity: "N", availability: "L" },
        references: ["https://www.shodan.io/"],
        tags: ["Infrastructure", "Network"],
        affectedComponents_en: `### Affected Components
- [TODO: Specify the IP addresses and ports of the unnecessarily exposed services.]`,
        details_en: `### Proof of Concept
[TODO: Provide a screenshot from a tool like nmap or Shodan showing the exposed port and service banner.]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Listar las direcciones IP y los puertos de los servicios expuestos innecesariamente.]`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar una captura de pantalla de una herramienta como nmap o Shodan que muestre el puerto expuesto y el banner del servicio.]`,
        immediateActions_en: "### Immediate Actions\nImmediately block public access to the exposed services at the network firewall or cloud security group level.",
        immediateActions_es: "### Acciones Inmediatas\nBloquear inmediatamente el acceso público a los servicios expuestos a nivel de firewall de red o grupo de seguridad en la nube.",
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
        recommendations_en: `#### Short-Term Recommendations
Apply the specific remediation for the identified misconfiguration, such as enabling authentication, changing default credentials, or implementing proper access controls.
#### Medium-Term Recommendations
Develop a secure baseline configuration (hardening guide) for all critical applications deployed in the environment.
#### Long-Term Recommendations
Automate the deployment and configuration of applications using infrastructure-as-code tools to ensure consistency and enforce secure baselines.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Aplicar la remediación específica para la configuración incorrecta identificada, como habilitar la autenticación, cambiar las credenciales predeterminadas o implementar controles de acceso adecuados.
#### Recomendaciones a Medio Plazo
Desarrollar una configuración de línea de base segura (guía de fortalecimiento) para todas las aplicaciones críticas implementadas en el entorno.
#### Recomendaciones a Largo Plazo
Automatizar la implementación y configuración de aplicaciones utilizando herramientas de infraestructura como código para garantizar la coherencia y hacer cumplir las líneas de base seguras.`,
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
[TODO: Proporcionar evidencia de la configuración incorrecta, como una captura de pantalla que muestre el acceso no autenticado a un panel o datos sensibles.]`,
        immediateActions_en: "### Immediate Actions\nApply the correct security configuration, such as enabling authentication or restricting network access to the service.",
        immediateActions_es: "### Acciones Inmediatas\nAplicar inmediatamente la configuración de seguridad correcta, como habilitar la autenticación o restringir el acceso de red al servicio.",
    },
    {
        id: "vuln-auth-001",
        title_en: "Weak Passwords",
        title_es: "Contraseñas Débiles",
        overview_en: `### Overview
Weak passwords are easy for attackers to guess or crack, often using automated tools. This vulnerability arises when the application fails to enforce a strong password policy.`,
        overview_es: `### Resumen
Las contraseñas débiles son fáciles de adivinar o descifrar para los atacantes, a menudo utilizando herramientas automatizadas. Esta vulnerabilidad surge cuando la aplicación no impone una política de contraseñas segura.`,
        technicalDescription_en: `### Technical Description
The application allows users to set passwords that are short, common, or lack complexity (e.g., no mix of uppercase, lowercase, numbers, and symbols). An attacker can perform dictionary attacks or brute-force attacks to guess these weak passwords and gain unauthorized access.`,
        technicalDescription_es: `### Descripción Técnica
La aplicación permite a los usuarios establecer contraseñas que son cortas, comunes o carecen de complejidad (p. ej., sin mezcla de mayúsculas, minúsculas, números y símbolos). Un atacante puede realizar ataques de diccionario o de fuerza bruta para adivinar estas contraseñas débiles y obtener acceso no autorizado.`,
        impact_en: `### Impact
Account takeover, leading to unauthorized access to sensitive data and functionality. If an administrative account is compromised, it could lead to full application control.`,
        impact_es: `### Impacto
Toma de control de la cuenta, lo que conduce a un acceso no autorizado a datos y funcionalidades sensibles. Si se compromete una cuenta administrativa, podría llevar al control total de la aplicación.`,
        recommendations_en: `#### Short-Term Recommendations
Force a password reset for all users and enforce a new, strong password policy upon their next login.
#### Medium-Term Recommendations
Implement Multi-Factor Authentication (MFA) as the most effective control to mitigate the risk of weak passwords.
#### Long-Term Recommendations
Educate users on the importance of strong, unique passwords and provide tools like password managers to help them manage their credentials securely.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Forzar un restablecimiento de contraseña para todos los usuarios y hacer cumplir una nueva política de contraseñas seguras en su próximo inicio de sesión.
#### Recomendaciones a Medio Plazo
Implementar la Autenticación Multifactor (MFA) como el control más efectivo para mitigar el riesgo de contraseñas débiles.
#### Recomendaciones a Largo Plazo
Educar a los usuarios sobre la importancia de usar contraseñas seguras y únicas y proporcionar herramientas como gestores de contraseñas para ayudarles a gestionar sus credenciales de forma segura.`,
        cwe: "CWE-521",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "N" },
        references: ["https://owasp.org/www-project-top-ten/2017/A2_2017-Broken_Authentication"],
        tags: ["Authentication"],
        affectedComponents_en: `### Affected Components
- User registration and password change functionality.`,
        details_en: `### Proof of Concept
[TODO: Provide evidence of being able to set a weak password (e.g., 'password123') and successfully authenticating with it.]`,
        affectedComponents_es: `### Componentes Afectados
- Funcionalidad de registro de usuarios y cambio de contraseña.`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar evidencia de poder establecer una contraseña débil (p. ej., 'password123') y autenticarse con éxito con ella.]`,
        immediateActions_en: "### Immediate Actions\nForce a password reset for all users and enforce a new, strong password policy upon their next login.",
        immediateActions_es: "### Acciones Inmediatas\nForzar un restablecimiento de contraseña para todos los usuarios y hacer cumplir una nueva política de contraseñas seguras en su próximo inicio de sesión.",
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
        recommendations_en: `#### Short-Term Recommendations
Implement rate limiting and account lockout mechanisms to slow down credential stuffing attacks. Check new passwords against a database of known breached passwords.
#### Medium-Term Recommendations
Implement Multi-Factor Authentication (MFA). This is the single most effective control against password reuse and credential stuffing.
#### Long-Term Recommendations
Educate users about the importance of using unique passwords for every service. Provide a password manager as a corporate tool to facilitate this.`, 
        recommendations_es: `#### Recomendaciones a Corto Plazo
Implementar limitación de velocidad y mecanismos de bloqueo de cuentas para ralentizar los ataques de credential stuffing. Comprobar las nuevas contraseñas con una base de datos de contraseñas filtradas conocidas.
#### Recomendaciones a Medio Plazo
Implementar la Autenticación Multifactor (MFA). Este es el control más efectivo contra la reutilización de contraseñas y el credential stuffing.
#### Recomendaciones a Largo Plazo
Educar a los usuarios sobre la importancia de usar contraseñas únicas para cada servicio. Proporcionar un gestor de contraseñas como herramienta corporativa para facilitar esto.`, 
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
[TODO: Proporcionar evidencia de un inicio de sesión exitoso utilizando credenciales que se sabe que provienen de una brecha de datos pública.]`,
        immediateActions_en: "### Immediate Actions\nForce a password reset for any identified compromised accounts. Communicate to users the risk of password reuse.",
        immediateActions_es: "### Acciones Inmediatas\nForzar un restablecimiento de contraseña para cualquier cuenta comprometida identificada. Comunicar a los usuarios el riesgo de la reutilización de contraseñas.",
    },
    {
        id: "vuln-auth-003",
        title_en: "Missing Multi-Factor Authentication (MFA)",
        title_es: "Falta de Autenticación Multifactor (MFA)",
        overview_en: `### Overview
The application does not provide the option for multi-factor authentication, which is a critical security layer that helps protect user accounts even if passwords are stolen.`,
        overview_es: `### Resumen
La aplicación no proporciona la opción de autenticación multifactor, que es una capa de seguridad crítica que ayuda a proteger las cuentas de usuario even si se roban las contraseñas.`,
        technicalDescription_en: `### Technical Description
The authentication process relies solely on a single factor (something the user knows, i.e., the password). There is no mechanism to require a second factor, such as something the user has (e.g., a code from an authenticator app) or something the user is (e.g., a fingerprint).`,
        technicalDescription_es: `### Descripción Técnica
El proceso de autenticación se basa únicamente en un solo factor (algo que el usuario sabe, es decir, la contraseña). No existe un mecanismo para requerir un segundo factor, como algo que el usuario tiene (p. ej., un código de una aplicación de autenticación) o algo que el usuario es (p. ej., una huella dactilar).`,
        impact_en: `### Impact
Without MFA, compromised credentials (e.g., from phishing, password reuse, or brute-force attacks) directly lead to unauthorized account access.`,
        impact_es: `### Impacto
Sin MFA, las credenciales comprometidas (p. ej., por phishing, reutilización de contraseñas o ataques de fuerza bruta) conducen directamente a un acceso no autorizado a la cuenta.`,
        recommendations_en: `#### Short-Term Recommendations
Implement support for Time-Based One-Time Password (TOTP) authenticator apps (like Google Authenticator or Authy) as a second factor.
#### Medium-Term Recommendations
Make MFA mandatory for all administrative and privileged users. Provide options for users to enable MFA for their own accounts.
#### Long-Term Recommendations
Explore and implement stronger, phishing-resistant MFA methods such as FIDO2/WebAuthn.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Implementar soporte para aplicaciones de autenticación de contraseña de un solo uso basada en tiempo (TOTP) (como Google Authenticator o Authy) como segundo factor.
#### Recomendaciones a Medio Plazo
Hacer que la MFA sea obligatoria para todos los usuarios administrativos y con privilegios. Proporcionar opciones para que los usuarios habiliten la MFA para sus propias cuentas.
#### Recomendaciones a Largo Plazo
Explorar e implementar métodos de MFA más fuertes y resistentes al phishing, como FIDO2/WebAuthn.`,
        cwe: "CWE-308",
        severity: "High",
        cvss: { score: 7.4, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "H", integrity: "H", availability: "N" },
        references: ["https://owasp.org/Top10/A02_2021-Cryptographic_Failures/"],
        tags: ["Authentication"],
        affectedComponents_en: `### Affected Components
- The entire user authentication flow.`,
        details_en: `### Proof of Concept
[TODO: Document that after a successful password-only login, no second factor is requested, granting full access.]`,
        affectedComponents_es: `### Componentes Afectados
- Todo el flujo de autenticación de usuarios.`,
        details_es: `### Prueba de Concepto
[TODO: Documentar que después de un inicio de sesión exitoso solo con contraseña, no se solicita un segundo factor, otorgando acceso completo.]`,
        immediateActions_en: "### Immediate Actions\nPrioritize the implementation of MFA, especially for administrative or privileged accounts.",
        immediateActions_es: "### Acciones Inmediatas\nPriorizar la implementación de MFA, especialmente para cuentas administrativas o con privilegios.",
    },
    {
        id: "vuln-auth-004",
        title_en: "Session Hijacking",
        title_es: "Secuestro de Sesión",
        overview_en: `### Overview
Session hijacking is an attack where an attacker takes over a valid user session to gain unauthorized access to an application.`,
        overview_es: `### Resumen
El secuestro de sesión es un ataque en el que un atacante se apodera de una sesión de usuario válida para obtener acceso no autorizado a una aplicación.`,
        technicalDescription_en: `### Technical Description
This can be achieved by stealing or predicting a valid session token (cookie). Common vectors include intercepting unencrypted traffic, XSS vulnerabilities that allow an attacker to steal cookies via JavaScript, or session tokens being exposed in URLs. The attacker then uses this token to impersonate the legitimate user.`,
        technicalDescription_es: `### Descripción Técnica
Esto se puede lograr robando o prediciendo un token de sesión válido (cookie). Los vectores comunes incluyen la interceptación de tráfico no cifrado, vulnerabilidades XSS que permiten a un atacante robar cookies a través de JavaScript, o tokens de sesión expuestos en las URL. Luego, el atacante usa este token para hacerse pasar por el usuario legítimo.`,
        impact_en: `### Impact
The attacker gains full access to the compromised user's account and can perform any action that the user is authorized to perform.`,
        impact_es: `### Impacto
El atacante obtiene acceso completo a la cuenta del usuario comprometido y puede realizar any acción que el usuario esté autorizado a realizar.`,
        recommendations_en: `#### Short-Term Recommendations
Set the \`HttpOnly\` and \`Secure\` flags on all session cookies to prevent them from being accessed by client-side scripts or transmitted over unencrypted connections.
#### Medium-Term Recommendations
Implement a mechanism to regenerate the session ID after any privilege level change, such as login. Bind the session token to other user properties, like their IP address or User-Agent, to make hijacking more difficult.
#### Long-Term Recommendations
Use a robust, centralized session management framework that handles token generation, validation, and expiration securely.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Establecer las banderas \`HttpOnly\` y \`Secure\` en todas las cookies de sesión para evitar que sean accedidas por scripts del lado del cliente o transmitidas a través de conexiones no cifradas.
#### Recomendaciones a Medio Plazo
Implementar un mecanismo para regenerar el ID de sesión después de cualquier cambio de nivel de privilegio, como el inicio de sesión. Vincular el token de sesión a otras propiedades del usuario, como su dirección IP o User-Agent, para dificultar el secuestro.
#### Recomendaciones a Largo Plazo
Utilizar un framework de gestión de sesiones robusto y centralizado que maneje la generación, validación y expiración de tokens de forma segura.`,
        cwe: "CWE-384",
        severity: "High",
        cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        references: ["https://owasp.org/www-community/attacks/Session_hijacking_attack"],
        tags: ["Authentication"],
        affectedComponents_en: `### Affected Components
- The application's session management mechanism.`,
        details_en: `### Proof of Concept
[TODO: Provide a PoC demonstrating the theft of a session cookie (e.g., via XSS or network sniffing) and its reuse in a different browser to access the application as the victim user.]`,
        affectedComponents_es: `### Componentes Afectados
- El mecanismo de gestión de sesiones de la aplicación.`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar una PoC que demuestre el robo de una cookie de sesión (p. ej., a través de XSS o sniffing de red) y su reutilización en un navegador diferente para acceder a la aplicación como el usuario víctima.]`,
        immediateActions_en: "### Immediate Actions\nForce logout of all active sessions to invalidate all existing session tokens.",
        immediateActions_es: "### Acciones Inmediatas\nForzar el cierre de sesión de todas las sesiones activas para invalidar todos los tokens de sesión existentes.",
    },
    {
        id: "vuln-auth-005",
        title_en: "Session Fixation",
        title_es: "Fijación de Sesión",
        overview_en: "### Overview\nSession fixation is an attack that permits an attacker to hijack a valid user session by fixing the session identifier (SID) before the user logs in.",
        overview_es: "### Resumen\nLa fijación de sesión es un ataque que permite a un atacante secuestrar una sesión de usuario válida fijando el identificador de sesión (SID) antes de que el usuario inicie sesión.",
        technicalDescription_en: "### Technical Description\nThe attacker visits the website to obtain a valid session ID. They then trick the victim into authenticating with that same session ID (e.g., by sending them a link with the session ID in the URL: `http://example.com/login?SID=...`). Once the victim logs in, the session becomes authenticated, and the attacker can use the fixed session ID to access the victim's session.",
        technicalDescription_es: "### Descripción Técnica\nEl atacante visita el sitio web para obtener un ID de sesión válido. Luego, engaña a la víctima para que se autentique con ese mismo ID de sesión (p. ej., enviándole un enlace con el ID de sesión en la URL: `http://ejemplo.com/login?SID=...`). Una vez que la víctima inicia sesión, la sesión se autentica y el atacante puede usar el ID de sesión fijado para acceder a la sesión autenticada de la víctima.",
        impact_en: "### Impact\nAllows an attacker to take over the victim's authenticated session, leading to unauthorized access and actions.",
        impact_es: "### Impacto\nPermite a un atacante apoderarse de la sesión autenticada de la víctima, lo que conduce a accesos y acciones no autorizadas.",
        recommendations_en: `#### Short-Term Recommendations
Regenerate the session ID immediately after a user successfully authenticates. Do not accept session identifiers from URL parameters.
#### Medium-Term Recommendations
Ensure the session management system creates a completely new session object, with a new ID, upon login.
#### Long-Term Recommendations
Review the entire session lifecycle to ensure session identifiers are never accepted from untrusted sources and are properly renewed at changes in privilege level.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Regenerar el ID de sesión inmediatamente después de que un usuario se autentique con éxito. No aceptar identificadores de sesión de los parámetros de la URL.
#### Recomendaciones a Medio Plazo
Asegurarse de que el sistema de gestión de sesiones cree un objeto de sesión completamente nuevo, con un nuevo ID, al iniciar sesión.
#### Recomendaciones a Largo Plazo
Revisar todo el ciclo de vida de la sesión para garantizar que los identificadores de sesión nunca se acepten de fuentes no confiables y se renueven correctamente en los cambios de nivel de privilegio.`,
        cwe: "CWE-384",
        severity: "High",
        cvss: { score: 8.1, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:R/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        references: ["https://owasp.org/www-community/attacks/Session_fixation"],
        tags: ["Authentication"],
        affectedComponents_en: `### Affected Components
- The login process and session initialization logic.`,
        details_en: `### Proof of Concept
1. Attacker visits site and gets a session ID.
2. Attacker tricks victim into clicking a link with that session ID.
3. Victim logs in.
4. Attacker uses the same session ID to access the victim's authenticated session.`,
        affectedComponents_es: `### Componentes Afectados
- El proceso de inicio de sesión y la lógica de inicialización de la sesión.`,
        details_es: `### Prueba de Concepto
1. El atacante visita el sitio y obtiene un ID de sesión.
2. El atacante engaña a la víctima para que haga clic en un enlace con ese ID de sesión.
3. La víctima inicia sesión.
4. El atacante usa el mismo ID de sesión para acceder a la sesión autenticada de la víctima.`,
        immediateActions_en: "### Immediate Actions\nForce logout of all active sessions to invalidate all existing session tokens.",
        immediateActions_es: "### Acciones Inmediatas\nForzar el cierre de sesión de todas las sesiones activas para invalidar todos los tokens de sesión existentes.",
    },
    {
        id: "vuln-auth-006",
        title_en: "Credential Stuffing",
        title_es: "Relleno de Credenciales",
        overview_en: "### Overview\nCredential stuffing is an attack where an attacker uses lists of compromised user credentials (typically username/password pairs) from data breaches to gain unauthorized access to other systems.",
        overview_es: "### Resumen\nEl relleno de credenciales es un ataque en el que un atacante utiliza listas de credenciales de usuario comprometidas (generalmente pares de nombre de usuario/contraseña) de brechas de datos para obtener acceso no autorizado a otros sistemas.",
        technicalDescription_en: "### Technical Description\nAttackers use automated bots to try large numbers of stolen credentials against the application's login page. The attack's success relies on the high probability that users reuse the same password across multiple online services.",
        technicalDescription_es: "### Descripción Técnica\nLos atacantes utilizan bots automatizados para probar una gran cantidad de credenciales robadas contra la página de inicio de sesión de la aplicación. El éxito del ataque se basa en la alta probabilidad de que los usuarios reutilicen la misma contraseña en múltiples servicios en línea.",
        impact_en: "### Impact\nSuccessful attacks lead to account takeovers, potentially on a massive scale, resulting in data breaches and fraudulent activity.",
        impact_es: "### Impacto\nLos ataques exitosos conducen a la toma de control de cuentas, potencialmente a gran escala, lo que resulta en brechas de datos y actividad fraudulenta.",
        recommendations_en: `#### Short-Term Recommendations
Implement rate limiting and account lockout mechanisms to slow down credential stuffing attacks. Check new passwords against a database of known breached passwords.
#### Medium-Term Recommendations
Implement Multi-Factor Authentication (MFA). This is the single most effective control against password reuse and credential stuffing.
#### Long-Term Recommendations
Educate users about the importance of using unique passwords for every service. Provide a password manager as a corporate tool to facilitate this.`, 
        recommendations_es: `#### Recomendaciones a Corto Plazo
Implementar limitación de velocidad y mecanismos de bloqueo de cuentas para ralentizar los ataques de credential stuffing. Comprobar las nuevas contraseñas con una base de datos de contraseñas filtradas conocidas.
#### Recomendaciones a Medio Plazo
Implementar la Autenticación Multifactor (MFA). Este es el control más efectivo contra la reutilización de contraseñas y el credential stuffing.
#### Recomendaciones a Largo Plazo
Educar a los usuarios sobre la importancia de usar contraseñas únicas para cada servicio. Proporcionar un gestor de contraseñas como herramienta corporativa para facilitar esto.`, 
        cwe: "CWE-307", 
        severity: "High", 
        cvss: { score: 8.1, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:N", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "N" }, 
        references: ["https://owasp.org/www-community/attacks/Credential_stuffing"], 
        tags: ["Authentication"], 
        affectedComponents_en: `### Affected Components
- The application's login endpoint.`, 
        details_en: `### Proof of Concept
[TODO: Provide logs or metrics showing a high volume of failed login attempts from specific IP addresses, indicating a credential stuffing attack.]`, 
        affectedComponents_es: `### Componentes Afectados
- El punto de conexión de inicio de sesión de la aplicación.`, 
        details_es: `### Prueba de Concepto
[TODO: Proporcionar registros o métricas que muestren un alto volumen de intentos de inicio de sesión fallidos desde direcciones IP específicas, lo que indica un ataque de relleno de credenciales.]`,
        immediateActions_en: "### Immediate Actions\nImplement temporary IP-based blocking for addresses that generate a high rate of failed login attempts. Force a password reset for any accounts that were successfully compromised.",
        immediateActions_es: "### Acciones Inmediatas\nBloquear temporalmente las direcciones IP con una alta tasa de intentos de inicio de sesión fallidos. Forzar un restablecimiento de contraseña para cualquier cuenta comprometida identificada.",
    },
    {
        id: "vuln-auth-007",
        title_en: "Insecure Password Recovery",
        title_es: "Recuperación Insegura de Contraseñas",
        overview_en: `### Overview
The password recovery mechanism is weak, allowing an attacker to gain unauthorized access to a user's account by subverting the recovery process.`,
        overview_es: `### Resumen
El mecanismo de recuperación de contraseña es débil, lo que permite a un atacante obtener acceso no autorizado a la cuenta de un usuario al subvertir el proceso de recuperación.`,
        technicalDescription_en: `### Technical Description
This can happen in several ways: the recovery link/token sent to the user is easily guessable or has no expiry; the 'secret questions' used for recovery are weak and based on publicly available information; or the application leaks the recovery token to an attacker (e.g., in the \`Referer\` header).`,
        technicalDescription_es: `### Descripción Técnica
Esto puede ocurrir de varias maneras: el enlace/token de recuperación enviado al usuario es fácil de adivinar o no tiene caducidad; las 'preguntas secretas' utilizadas para la recuperación son débiles y se basan en información públicamente disponible; o la aplicación filtra el token de recuperación a un atacante (p. ej., en el encabezado \`Referer\`).`,
        impact_en: `### Impact
An attacker can reset a victim's password and take over their account.`,
        impact_es: `### Impacto
Un atacante puede restablecer la contraseña de una víctima y tomar el control de su cuenta.`,
        recommendations_en: `#### Short-Term Recommendations
Ensure that password recovery tokens are long, random, single-use, and have a short expiration time. Send tokens via a secure channel (e.g., email) and do not leak them in URLs or headers.
#### Medium-Term Recommendations
Avoid using knowledge-based authentication (secret questions) as the sole recovery mechanism. Require users to verify their identity through a second factor (like a code to their phone) before allowing a password reset.
#### Long-Term Recommendations
Implement a robust password recovery workflow that logs all attempts and notifies the user of any password reset activity on their account.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Asegurarse de que los tokens de recuperación de contraseña sean largos, aleatorios, de un solo uso y tengan un tiempo de expiración corto. Enviar tokens a través de un canal seguro (p. ej., correo electrónico) y no filtrarlos en URL o encabezados.
#### Recomendaciones a Medio Plazo
Evitar el uso de la autenticación basada en conocimientos (preguntas secretas) como único mecanismo de recuperación. Requerir que los usuarios verifiquen su identidad a través de un segundo factor (como un código a su teléfono) antes de permitir un restablecimiento de contraseña.
#### Recomendaciones a Largo Plazo
Implementar un flujo de trabajo de recuperación de contraseña robusto que registre todos los intentos y notifique al usuario de cualquier actividad de restablecimiento de contraseña en su cuenta.`,
        cwe: "CWE-640",
        severity: "Medium",
        cvss: { score: 6.8, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:R/S:U/C:H/I:H/A:N", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "R", scope: "U", confidentiality: "H", integrity: "H", availability: "N" },
        references: ["https://owasp.org/www-project-top-ten/2017/A2_2017-Broken_Authentication"],
        tags: ["Authentication"],
        affectedComponents_en: `### Affected Components
- The password recovery/reset functionality.`,
        details_en: `### Proof of Concept
[TODO: Provide a PoC demonstrating the weakness, such as guessing a recovery token, answering weak secret questions, or showing a token leak.]`,
        affectedComponents_es: `### Componentes Afectados
- La funcionalidad de recuperación/restablecimiento de contraseña.`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar una PoC que demuestre la debilidad, como adivinar un token de recuperación, responder preguntas secretas débiles o mostrar una fuga de token.]`,
        immediateActions_en: "### Immediate Actions\nDisable the password recovery feature until it can be secured. Manually assist users who need to recover their accounts.",
        immediateActions_es: "### Acciones Inmediatas\nDeshabilitar la función de recuperación de contraseña hasta que pueda ser asegurada. Ayudar manualmente a los usuarios que necesiten recuperar sus cuentas.",
    },
    {
        id: "vuln-auth-008",
        title_en: "User Enumeration",
        title_es: "Enumeración de Usuarios",
        overview_en: `### Overview
User enumeration is a vulnerability where an attacker can use the application's responses to determine whether a given username is valid or not.`,
        overview_es: `### Resumen
La enumeración de usuarios es una vulnerabilidad en la que un atacante puede usar las responses de la aplicación para determinar si un nombre de usuario dado es válido o no.`,
        technicalDescription_en: `### Technical Description
The application provides different responses for valid and invalid usernames on pages like login, password reset, or registration. For example, a login page might respond with "Invalid password" for a valid user and "User not found" for an invalid one. This allows an attacker to build a list of valid usernames.`,
        technicalDescription_es: `### Descripción Técnica
La aplicación proporciona diferentes responses para nombres de usuario válidos e inválidos en páginas como inicio de sesión, restablecimiento de contraseña o registro. Por ejemplo, una página de inicio de sesión podría responder con "Contraseña inválida" para un usuario válido y "Usuario no encontrado" para uno inválido. Esto permite a un atacante construir una lista de nombres de usuario válidos.`,
        impact_en: `### Impact
This information leak aids attackers by providing them with a list of valid targets for brute-force, phishing, or other account takeover attacks.`,
        impact_es: `### Impacto
Esta fuga de información ayuda a los atacantes al proporcionarles una lista de objetivos válidos para ataques de fuerza bruta, phishing u otros ataques de toma de control de cuentas.`,
        recommendations_en: `#### Short-Term Recommendations
Ensure that all responses for login, password reset, and registration attempts are generic and identical, regardless of whether the username is valid or invalid (e.g., 'Invalid username or password').
#### Medium-Term Recommendations
Review all application endpoints to identify and remediate any other potential user enumeration vectors.
#### Long-Term Recommendations
Implement rate limiting and monitoring to detect and block automated user enumeration attempts.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Asegurarse de que todas las responses para los intentos de inicio de sesión, restablecimiento de contraseña y registro sean genéricas e idénticas, independientemente de si el nombre de usuario es válido o no (p. ej., 'Nombre de usuario o contraseña inválidos').
#### Recomendaciones a Medio Plazo
Revisar todos los puntos de conexión de la aplicación para identificar y remediar cualquier otro posible vector de enumeración de usuarios.
#### Recomendaciones a Largo Plazo
Implementar limitación de velocidad y monitoreo para detectar y bloquear los intentos automatizados de enumeración de usuarios.`,
        cwe: "CWE-203",
        severity: "Low",
        cvss: { score: 5.3, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "N", availability: "N" },
        references: ["https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/03-Identity_Management_Testing/04-Testing_for_Account_Enumeration_and_Guessable_User_Account"],
        tags: ["Authentication"],
        affectedComponents_en: `### Affected Components
- Login, password reset, and user registration pages.`,
        details_en: `### Proof of Concept
[TODO: Provide screenshots showing the different application responses for a valid username vs. an invalid username.]`,
        affectedComponents_es: `### Componentes Afectados
- Páginas de inicio de sesión, restablecimiento de contraseña y registro de usuarios.`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar capturas de pantalla que muestren las diferentes responses de la aplicación para un nombre de usuario válido frente a un nombre de usuario inválido.]`,
        immediateActions_en: "### Immediate Actions\nImmediately change the response messages to be generic for all relevant functionalities.",
        immediateActions_es: "### Acciones Inmediatas\nCambiar inmediatamente los mensajes de respuesta para que sean genéricos para todas las funcionalidades relevantes.",
    },
    {
        id: "vuln-auth-009",
        title_en: "Weak Session Management",
        title_es: "Gestión Débil de Sesiones",
        overview_en: `### Overview
The application's session management is weak, leading to vulnerabilities such as predictable session tokens or tokens that are not properly invalidated.`,
        overview_es: `### Resumen
La gestión de sesiones de la aplicación es débil, lo que conduce aulnerabilidades como tokens de sesión predecibles o tokens que no se invalidan correctamente.`,
        technicalDescription_en: `### Technical Description
The application may generate session tokens using non-random or easily predictable algorithms. It might also fail to invalidate session tokens on the server-side after logout or a password change, or allow tokens to persist for an excessively long time.`,
        technicalDescription_es: `### Descripción Técnica
La aplicación puede generar tokens de sesión utilizando algoritmos no aleatorios o fácilmente predecibles. También podría no invalidar los tokens de sesión en el lado del servidor después del cierre de sesión o un cambio de contraseña, o permitir que los tokens persistan durante un tiempo excesivamente largo.`,
        impact_en: `### Impact
Weak session management can lead to session hijacking, allowing an attacker to impersonate a legitimate user and gain unauthorized access.`,
        impact_es: `### Impacto
Una gestión de sesiones débil puede conducir al secuestro de sesiones, permitiendo a un atacante hacerse pasar por un usuario legítimo y obtener acceso no autorizado.`,
        recommendations_en: `#### Short-Term Recommendations
Use long, random, and unpredictable session identifiers. Ensure all session tokens are invalidated on the server upon logout and password reset.
#### Medium-Term Recommendations
Implement reasonable session timeout periods (both for inactivity and absolute duration). Regenerate session tokens upon any change in privilege level (e.g., authentication).
#### Long-Term Recommendations
Use a proven, industry-standard library or framework for session management rather than building a custom solution.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Usar identificadores de sesión largos, aleatorios e impredecibles. Asegurarse de que todos los tokens de sesión se invaliden en el servidor al cerrar la sesión y al restablecer la contraseña.
#### Recomendaciones a Medio Plazo
Implementar períodos de tiempo de espera de sesión razonables (tanto para inactividad como para duración absoluta). Regenerar los tokens de sesión ante cualquier cambio en el nivel de privilegio (p. ej., autenticación).
#### Recomendaciones a Largo Plazo
Utilizar una biblioteca o un framework probado y estándar de la industria para la gestión de sesiones en lugar de construir una solución personalizada.`,
        cwe: "CWE-613",
        severity: "High",
        cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        references: ["https://owasp.org/www-project-top-ten/2017/A2_2017-Broken_Authentication"],
        tags: ["Authentication"],
        affectedComponents_en: `### Affected Components
- The entire session management lifecycle of the application.`,
        details_en: `### Proof of Concept
[TODO: Provide a PoC, such as showing that a session token is predictable, or that it remains valid after logging out and can be reused.]`,
        affectedComponents_es: `### Componentes Afectados
- Todo el ciclo de vida de la gestión de sesiones de la aplicación.`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar una PoC, como demostrar que un token de sesión es predecible, o que sigue siendo válido después de cerrar la sesión y puede ser reutilizado.]`,
        immediateActions_en: "### Immediate Actions\nForce a logout of all users to invalidate all existing session tokens.",
        immediateActions_es: "### Acciones Inmediatas\nForzar el cierre de sesión de todas las sesiones activas para invalidar todos los tokens de sesión existentes.",
    },
    {
        id: "vuln-auth-010",
        title_en: "Brute Force Attacks",
        title_es: "Ataques de Fuerza Bruta",
        overview_en: `### Overview
The application is vulnerable to brute-force attacks, where an attacker can make an unlimited number of attempts to guess a user's password.`,
        overview_es: `### Resumen
La aplicación es vulnerable a ataques de fuerza bruta, donde un atacante puede realizar un número ilimitado de intentos para adivinar la contraseña de un usuario.`,
        technicalDescription_en: `### Technical Description
The login functionality lacks mechanisms to prevent automated, high-volume guessing attempts. There is no rate limiting (to slow down attempts) or account lockout policy (to temporarily disable an account after too many failed attempts).`,
        technicalDescription_es: `### Descripción Técnica
La funcionalidad de inicio de sesión carece de mecanismos para prevenir intentos de adivinación automatizados y de alto volumen. No hay limitación de velocidad (para ralentizar los intentos) ni una política de bloqueo de cuenta (para deshabilitar temporalmente una cuenta después de demasiados intentos fallidos).`,
        impact_en: `### Impact
A successful brute-force attack results in account takeover. Even if unsuccessful, it can lead to a denial of service by locking out legitimate users.`,
        impact_es: `### Impacto
Un ataque de fuerza bruta exitoso resulta en la toma de control de la cuenta. Incluso si no tiene éxito, puede provocar una denegación de servicio al bloquear a los usuarios legítimos.`,
        recommendations_en: `#### Short-Term Recommendations
Implement strong rate limiting on login attempts per IP address and per user account.
#### Medium-Term Recommendations
Implement an account lockout policy that temporarily disables an account after a small number of consecutive failed login attempts (e.g., 5-10 attempts).
#### Long-Term Recommendations
Use CAPTCHA or other bot-detection mechanisms after a few failed attempts to prevent automated attacks. Monitor and alert on high volumes of failed logins.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Implementar una estricta limitación de velocidad en los intentos de inicio de sesión por dirección IP y por cuenta de usuario.
#### Recomendaciones a Medio Plazo
Implementar una política de bloqueo de cuenta que deshabilite temporalmente una cuenta después de un pequeño número de intentos de inicio de sesión fallidos consecutivos (p. ej., 5-10 intentos).
#### Recomendaciones a Largo Plazo
Usar CAPTCHA u otros mecanismos de detección de bots después de algunos intentos fallidos para prevenir ataques automatizados. Monitorear y alertar sobre altos volúmenes de inicios de sesión fallidos.`,
        cwe: "CWE-307",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "N" },
        references: ["https://owasp.org/www-community/attacks/Brute_force_attack"],
        tags: ["Authentication"],
        affectedComponents_en: `### Affected Components
- The login functionality.`,
        details_en: `### Proof of Concept
[TODO: Provide evidence of a brute-force attack using a tool like Hydra or Burp Intruder, showing that a large number of password guesses can be attempted without being blocked.]`,
        affectedComponents_es: `### Componentes Afectados
- La funcionalidad de inicio de sesión.`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar evidencia de un ataque de fuerza bruta utilizando una herramienta como Hydra o Burp Intruder, demostrando que se puede intentar un gran número de contraseñas sin ser bloqueado.]`,
        immediateActions_en: "### Immediate Actions\nImplement temporary IP-based blocking for addresses that generate a high rate of failed login attempts.",
        immediateActions_es: "### Acciones Inmediatas\nImplementar un bloqueo temporal basado en IP para las direcciones que generan una alta tasa de intentos de inicio de sesión fallidos.",
    },
    {
        id: "vuln-auth-011",
        title_en: "Weak <APPLICATION> Admin Credentials",
        title_es: "Credenciales Débiles de Administrador en <APPLICATION>",
        overview_en: "### Overview\nThe administrative interface of a specific application (e.g., Jenkins, Grafana, a CMS) is protected by weak or default credentials.",
        overview_es: "### Resumen\nLa interfaz administrativa de una aplicación específica (p. ej., Jenkins, Grafana, un CMS) está protegida por credenciales débiles o predeterminadas.",
        technicalDescription_en: "### Technical Description\nThe administrative account for <APPLICATION> is using a default, common, or easily guessable password (e.g., 'admin', 'password', 'root'). This allows an attacker who discovers the administrative interface to easily gain full control of the application.",
        technicalDescription_es: "### Descripción Técnica\nLa cuenta administrativa para <APPLICATION> está utilizando una contraseña predeterminada, común o fácil de adivinar (p. ej., 'admin', 'password', 'root'). Esto permite a un atacante que descubre la interfaz administrativa obtener fácilmente el control total de la aplicación.",
        impact_en: "### Impact\nFull compromise of the <APPLICATION> instance, which could lead to code execution on the server, data theft, or a pivot point into the internal network.",
        impact_es: "### Impacto\nCompromiso total de la instancia de <APPLICATION>, lo que podría conducir a la ejecución de código en el servidor, robo de datos o un punto de pivote hacia la red interna.",
        recommendations_en: `#### Short-Term Recommendations
Change the default administrative password to a strong, randomly generated password.
#### Medium-Term Recommendations
Restrict access to the administrative interface to trusted IP addresses or a VPN. Implement Multi-Factor Authentication (MFA) for the administrative account if supported.
#### Long-Term Recommendations
Establish a policy that requires changing all default credentials during the deployment process of any new software or hardware.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Cambiar la contraseña administrativa predeterminada por una contraseña segura y generada aleatoriamente.
#### Recomendaciones a Medio Plazo
Restringir el acceso a la interfaz administrativa a direcciones IP de confianza o una VPN. Implementar la Autenticación Multifactor (MFA) para la cuenta administrativa si es compatible.
#### Recomendaciones a Largo Plazo
Establecer una política que requiera cambiar todas las credenciales predeterminadas durante el proceso de implementación de cualquier nuevo software o hardware.`,
        cwe: "CWE-1393",
        severity: "Critical",
        cvss: { score: 9.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        references: ["https://cwe.mitre.org/data/definitions/1393.html"],
        tags: ["Authentication", "Infrastructure"],
        affectedComponents_en: `### Affected Components
- The administrative login page for <APPLICATION>.`,
        details_en: `### Proof of Concept
[TODO: Provide a screenshot showing a successful login to the <APPLICATION> admin panel using the weak or default credentials.]`,
        affectedComponents_es: `### Componentes Afectados
- La página de inicio de sesión administrativa para <APPLICATION>.`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar una captura de pantalla que muestre un inicio de sesión exitoso en el panel de administración de <APPLICATION> utilizando las credenciales débiles o predeterminadas.]`,
        immediateActions_en: "### Immediate Actions\nImmediately change the default or weak password for the administrative account of <APPLICATION>.",
        immediateActions_es: "### Acciones Inmediatas\nCambiar inmediatamente la contraseña predeterminada o débil de la cuenta administrativa de <APPLICATION>.",
    },
    {
        id: "vuln-auth-012",
        title_en: "Excessive Active Directory Group Privileges",
        title_es: "Privilegios Excesivos en Grupos de Active Directory",
        overview_en: `### Overview
User or service accounts in Active Directory are members of groups that grant them more privileges than necessary to perform their intended function.`,
        overview_es: `### Resumen
Las cuentas de usuario o de servicio en Active Directory son miembros de grupos que les otorgan más privilegios de los necesarios para realizar su función prevista.`,
        technicalDescription_en: `### Technical Description
An account (e.g., a service account for a web application) is a member of a high-privilege group like 'Domain Admins' or 'Enterprise Admins' when it only requires local administrator rights on a specific server, or even less. If this account is compromised, the attacker immediately gains high-level privileges across the domain.`,
        technicalDescription_es: `### Descripción Técnica
Una cuenta (p. ej., una cuenta de servicio para una aplicación web) es miembro de un grupo de altos privilegios como 'Domain Admins' o 'Enterprise Admins' cuando solo requiere derechos de administrador local en un servidor específico, o incluso menos. Si esta cuenta se compromete, el atacante obtiene inmediatamente privilegios de alto nivel en todo el dominio.`,
        impact_en: `### Impact
The compromise of a single over-privileged account can lead to the full compromise of the entire Active Directory domain.`,
        impact_es: `### Impacto
El compromiso de una única cuenta con privilegios excesivos puede llevar al compromiso total de todo el dominio de Active Directory.`,
        recommendations_en: `#### Short-Term Recommendations
Review the membership of all high-privilege Active Directory groups (e.g., Domain Admins, Enterprise Admins, Schema Admins) and remove any accounts that do not strictly require those privileges.
#### Medium-Term Recommendations
Implement the principle of least privilege for all user and service accounts. Grant permissions based on specific roles and responsibilities.
#### Long-Term Recommendations
Implement a Privileged Access Management (PAM) solution to control and monitor access to privileged accounts. Regularly audit group memberships and permissions.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Revisar la membresía de todos los grupos de altos privilegios de Active Directory (p. ej., Domain Admins, Enterprise Admins, Schema Admins) y eliminar cualquier cuenta que no requiera estrictamente esos privilegios.
#### Recomendaciones a Medio Plazo
Implementar el principio de privilegio mínimo para todas las cuentas de usuario y de servicio. Otorgar permisos basados en roles y responsabilidades específicas.
#### Recomendaciones a Largo Plazo
Implementar una solución de Gestión de Acceso Privilegiado (PAM) para controlar y monitorear el acceso a cuentas privilegiadas. Auditar regularmente las membresías de grupo y los permisos.`,
        cwe: "CWE-266",
        severity: "Critical",
        cvss: { score: 9.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        references: ["https://adsecurity.org/?p=3658"],
        tags: ["Authentication", "Infrastructure"],
        affectedComponents_en: `### Affected Components
- [TODO: Specify the user/service account and the high-privilege AD group.]`,
        details_en: `### Proof of Concept
[TODO: Provide a screenshot from a tool like BloodHound or Active Directory Users and Computers showing the over-privileged group membership.]`,
        affectedComponents_es: `### Componentes Afectados
- La cuenta de usuario/servicio especificada y el grupo de AD de altos privilegios.`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar una captura de pantalla de una herramienta como BloodHound o Usuarios y equipos de Active Directory que muestre la membresía de grupo con privilegios excesivos.]`,
        immediateActions_en: "### Immediate Actions\nImmediately remove the compromised or over-privileged account from the high-privilege group.",
        immediateActions_es: "### Acciones Inmediatas\nEliminar inmediatamente la cuenta comprometida o con privilegios excesivos del grupo de altos privilegios.",
    },
    {
        id: "vuln-auth-013",
        title_en: "Passwords in AD User Description Field",
        title_es: "Contraseñas en Campo de Descripción de Usuario de AD",
        overview_en: "### Overview\nPasswords or sensitive information are stored in cleartext in the 'Description' field of user or computer accounts in Active Directory.",
        overview_es: "### Resumen\nLas contraseñas o información sensible se almacenan en texto claro en el campo 'Descripción' de las cuentas de usuario o de equipo en Active Directory.",
        technicalDescription_en: "### Technical Description\nAdministrators sometimes store passwords or notes in the Description field for convenience. This field is readable by any authenticated user in the domain, making it a common place for attackers to look for credentials during post-exploitation.",
        technicalDescription_es: "### Descripción Técnica\nLos administradores a veces almacenan contraseñas o notas en el campo Descripción por conveniencia. Este campo es legible por cualquier usuario autenticado en el dominio, lo que lo convierte en un lugar común para que los atacantes busquen credenciales durante la post-explotación.",
        impact_en: "### Impact\nThis leads to the direct compromise of credentials, which can be used to escalate privileges or move laterally within the network.",
        impact_es: "### Impacto\nEsto conduce al compromiso directo de credenciales, que pueden ser utilizadas para escalar privilegios o moverse lateralmente dentro de la red.",
        recommendations_en: `#### Short-Term Recommendations
Scan all user and computer account Description fields in Active Directory for passwords and other sensitive information and remove them.
#### Medium-Term Recommendations
Implement a secure secrets management solution (like a password vault) for storing service account passwords and other credentials.
#### Long-Term Recommendations
Educate all IT staff and administrators on the dangers of storing sensitive information in insecure locations. Implement regular audits to scan for this issue.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Escanear todos los campos de Descripción de las cuentas de usuario y equipo en Active Directory en busca de contraseñas y otra información sensible y eliminarlos.
#### Recomendaciones a Medio Plazo
Implementar una solución segura de gestión de secretos (como una bóveda de contraseñas) para almacenar contraseñas de cuentas de servicio y otras credenciales.
#### Recomendaciones a Largo Plazo
Educar a todo el personal de TI y a los administradores sobre los peligros de almacenar información sensible en ubicaciones inseguras. Implementar auditorías regulares para escanear en busca de este problema.`,
        cwe: "CWE-312",
        severity: "High",
        cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        references: ["https://adsecurity.org/?p=268"],
        tags: ["Authentication", "Infrastructure"],
        affectedComponents_en: `### Affected Components
- [TODO: Specify the Active Directory user/computer account.]`,
        details_en: `### Proof of Concept
[TODO: Provide a screenshot of the Active Directory user/computer properties window showing the password in the Description field.]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Especificar la cuenta de usuario/equipo de Active Directory.]`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar una captura de pantalla de la ventana de propiedades del usuario/equipo de Active Directory que muestra la contraseña en el campo Descripción.]`,
        immediateActions_en: "### Immediate Actions\nImmediately remove the password from the Description field and reset the password for the associated account.",
        immediateActions_es: "### Acciones Inmediatas\nEliminar inmediatamente la contraseña del campo Descripción y restablecer la contraseña de la cuenta asociada.",
    },
    // --- CRYPTOGRAPHY VULNERABILITIES ---
    {
        id: "vuln-crypto-001",
        title_en: "Weak Encryption Algorithms",
        title_es: "Algoritmos de Cifrado Débiles",
        overview_en: `### Overview
The application uses weak or outdated cryptographic algorithms that are known to be vulnerable to attack.`,
        overview_es: `### Resumen
La aplicación utiliza algoritmos criptográficos débiles u obsoletos que se sabe que son vulnerables a ataques.`,
        technicalDescription_en: `### Technical Description
The application relies on algorithms like DES, 3DES, RC4, or hashing algorithms like MD5 or SHA1 for security purposes. These algorithms have known mathematical weaknesses or are susceptible to collision attacks, and can be broken with modern computing power.`,
        technicalDescription_es: `### Descripción Técnica
La aplicación se basa en algoritmos como DES, 3DES, RC4, o algoritmos de hash como MD5 o SHA1 para fines de seguridad. Estos algoritmos tienen debilidades matemáticas conocidas o son susceptibles a ataques de colisión, y pueden ser rotos con la potencia informática moderna.`,
        impact_en: `### Impact
An attacker can decrypt sensitive data, forge digital signatures, or crack password hashes, leading to a loss of confidentiality and integrity.`,
        impact_es: `### Impacto
Un atacante puede descifrar datos sensibles, falsificar firmas digitales o descifrar hashes de contraseñas, lo que conduce a una pérdida de confidencialidad e integridad.`,
        recommendations_en: `#### Short-Term Recommendations
Replace all weak algorithms with strong, industry-standard alternatives. For symmetric encryption, use AES-256 (GCM mode is recommended). For hashing, use SHA-256 or stronger.
#### Medium-Term Recommendations
Establish a corporate policy defining approved cryptographic standards and algorithms. Create a centralized crypto library for developers to use.
#### Long-Term Recommendations
Implement a process for regularly reviewing and updating cryptographic standards as new research emerges. Use code scanning tools to detect the use of deprecated cryptographic functions.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Reemplazar los algoritmos débiles con alternativas fuertes y estándar de la industria. Para el cifrado simétrico, usar AES-256 (se recomienda el modo GCM). Para el hashing, usar SHA-256 o más fuerte.
#### Recomendaciones a Medio Plazo
Establecer una política corporativa que defina los estándares y algoritmos criptográficos aprobados. Crear una biblioteca de criptografía centralizada para que la usen los desarrolladores.
#### Recomendaciones a Largo Plazo
Implementar un proceso para revisar y actualizar regularmente los estándares criptográficos a medida que surja nueva investigación. Usar herramientas de escaneo de código para detectar el uso de funciones criptográficas obsoletas.`,
        cwe: "CWE-327",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "N" },
        references: ["https://www.nist.gov/itl/applied-cryptography"],
        tags: ["Cryptography"],
        affectedComponents_en: `### Affected Components
- [TODO: Specify the component or code section using the weak algorithm.]`,
        details_en: `### Proof of Concept
[TODO: Provide code snippets or configuration files that show the use of a weak algorithm (e.g., 'Cipher.getInstance("DES")').]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Especificar el componente o la sección de código que utiliza el algoritmo débil.]`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar fragmentos de código o archivos de configuración que muestren el uso de un algoritmo débil (p. ej., 'Cipher.getInstance("DES")').]`,
        immediateActions_en: "### Immediate Actions\nPrioritize the replacement of the weak cryptographic algorithms with modern, strong alternatives.",
        immediateActions_es: "### Acciones Inmediatas\nPriorizar la sustitución de los algoritmos criptográficos débiles por alternativas modernas y fuertes.",
    },
    {
        id: "vuln-crypto-002",
        title_en: "Insecure Key Management",
        title_es: "Gestión Insegura de Claves",
        overview_en: `### Overview
The application's process for generating, storing, distributing, and rotating cryptographic keys is insecure.`,
        overview_es: `### Resumen
El proceso de la aplicación para generar, almacenar, distribuir y rotar claves criptográficas es inseguro.`,
        technicalDescription_en: `### Technical Description
This includes issues such as hardcoding encryption keys in source code, storing keys in insecure configuration files, failing to rotate keys regularly, or using weak keys that are not sufficiently random.`,
        technicalDescription_es: `### Descripción Técnica
Esto incluye problemas como codificar claves de cifrado en el código fuente, almacenar claves en archivos de configuración inseguros, no rotar las claves regularmente o usar claves débiles que no son suficientemente aleatorias.`,
        impact_en: `### Impact
If an attacker can obtain the cryptographic keys, they can decrypt all data protected by those keys, defeating the purpose of encryption entirely.`,
        impact_es: `### Impacto
Si un atacante puede obtener las claves criptográficas, puede descifrar todos los datos protegidos por esas claves, anulando por completo el propósito del cifrado.`,
        recommendations_en: `#### Short-Term Recommendations
Store all cryptographic keys in a secure secrets management system, such as a hardware security module (HSM) or a cloud-based key vault (e.g., AWS KMS, Azure Key Vault, Google Cloud KMS).
#### Medium-Term Recommendations
Establish a key management policy that defines key generation standards, rotation periods, and access control procedures.
#### Long-Term Recommendations
Automate the key rotation process. Implement monitoring and alerting for any unauthorized access attempts to the key management system.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Almacenar todas las claves criptográficas en un sistema de gestión de secretos seguro, como un módulo de seguridad de hardware (HSM) o una bóveda de claves basada en la nube (p. ej., AWS KMS, Azure Key Vault, Google Cloud KMS).
#### Recomendaciones a Medio Plazo
Establecer una política de gestión de claves que defina los estándares de generación de claves, los períodos de rotación y los procedimientos de control de acceso.
#### Recomendaciones a Largo Plazo
Automatizar el proceso de rotación de claves. Implementar monitoreo y alertas para cualquier intento de acceso no autorizado al sistema de gestión de claves.`,
        cwe: "CWE-320",
        severity: "Critical",
        cvss: { score: 9.1, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "N" },
        references: ["https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-57pt1r5.pdf"],
        tags: ["Cryptography"],
        affectedComponents_en: `### Affected Components
- [TODO: Specify where the key is insecurely stored or managed.]`,
        details_en: `### Proof of Concept
[TODO: Provide a code snippet showing a hardcoded key, or a screenshot of a configuration file containing a key.]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Especificar dónde se almacena o gestiona la clave de forma insegura.]`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar un fragmento de código que muestre una clave codificada, o una captura de pantalla de un archivo de configuración que contenga una clave.]`,
        immediateActions_en: "### Immediate Actions\nImmediately rotate any compromised or insecurely stored keys. Remove keys from source code or configuration files.",
        immediateActions_es: "### Acciones Inmediatas\nRotar inmediatamente cualquier clave comprometida o almacenada de forma insegura. Eliminar las claves del código fuente o de los archivos de configuración.",
    },
    {
        id: "vuln-crypto-003",
        title_en: "Use of Hardcoded Secrets",
        title_es: "Uso de Secretos Embebidos",
        overview_en: `### Overview
The application source code or configuration files contain hardcoded secrets, such as passwords, API keys, or encryption keys.`,
        overview_es: `### Resumen
El código fuente de la aplicación o los archivos de configuración contienen secretos codificados, como contraseñas, claves de API o claves de cifrado.`,
        technicalDescription_en: `### Technical Description
Secrets are directly embedded as string literals in the source code, binaries, or configuration files. Anyone with access to the code repository or the compiled application can easily extract these secrets.`,
        technicalDescription_es: `### Descripción Técnica
Los secretos se incrustan directamente como literales de cadena en el código fuente, los binarios o los archivos de configuración. Cualquiera con acceso al repositorio de código o a la aplicación compilada puede extraer fácilmente estos secretos.`,
        impact_en: `### Impact
Leads to the compromise of the hardcoded secret, which can grant an attacker access to databases, third-party services, or other sensitive systems.`,
        impact_es: `### Impacto
Conduce al compromiso del secreto codificado, lo que puede otorgar a un atacante acceso a bases de datos, servicios de terceros u otros sistemas sensibles.`,
        recommendations_en: `#### Short-Term Recommendations
Remove all hardcoded secrets from the code and configuration files. Store them securely in a secrets management system (e.g., HashiCorp Vault, AWS Secrets Manager).
#### Medium-Term Recommendations
Use environment variables or a secure configuration service to inject secrets into the application at runtime. Never commit secrets to source control.
#### Long-Term Recommendations
Implement pre-commit hooks and CI/CD pipeline checks to automatically scan for and block any commits that contain hardcoded secrets.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Eliminar todos los secretos codificados del código y los archivos de configuración. Almacenarlos de forma segura en un sistema de gestión de secretos (p. ej., HashiCorp Vault, AWS Secrets Manager).
#### Recomendaciones a Medio Plazo
Usar variables de entorno o un servicio de configuración seguro para inyectar secretos en la aplicación en tiempo de ejecución. Nunca cometer secretos en el control de fuentes.
#### Recomendaciones a Largo Plazo
Implementar ganchos pre-commit y comprobaciones en el pipeline de CI/CD para escanear y bloquear automáticamente cualquier commit que contenga secretos codificados.`,
        cwe: "CWE-798",
        severity: "High",
        cvss: { score: 8.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "L", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        references: ["https://owasp.org/www-project-top-ten/2017/A3_2017-Sensitive_Data_Exposure"],
        tags: ["Cryptography", "Infrastructure"],
        affectedComponents_en: `### Affected Components
- [TODO: Specify the file and line number where the secret is hardcoded.]`,
        details_en: `### Proof of Concept
[TODO: Provide a screenshot or code snippet showing the hardcoded secret.]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Especificar el archivo y el número de línea donde está codificado el secreto.]`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar una captura de pantalla o un fragmento de código que muestre el secreto codificado.]`,
        immediateActions_en: "### Immediate Actions\nImmediately revoke the hardcoded secret and generate a new one. Remove the secret from the source code and commit history.",
        immediateActions_es: "### Acciones Inmediatas\nRevocar inmediatamente el secreto codificado y generar uno nuevo. Eliminar el secreto del código fuente y del historial de commits.",
    },
    {
        id: "vuln-crypto-004",
        title_en: "Insufficient Entropy",
        title_es: "Entropía Insuficiente",
        overview_en: `### Overview
The application uses values that are intended to be random (e.g., for session tokens, CSRF tokens, or cryptographic keys) but have insufficient entropy, making them predictable.`,
        overview_es: `### Resumen
La aplicación utiliza valores que se supone que son aleatorios (p. ej., para tokens de sesión, tokens CSRF o claves criptográficas) pero tienen una entropía insuficiente, lo que los hace predecibles.`,
        technicalDescription_en: `### Technical Description
The random number generator used by the application is not cryptographically secure. It might be based on predictable seeds like the current time, process ID, or a weak pseudo-random number generator (PRNG). An attacker can analyze a sequence of generated values to predict future values.`,
        technicalDescription_es: `### Descripción Técnica
El generador de números aleatorios utilizado por la aplicación no es criptográficamente seguro. Podría basarse en semillas predecibles como la hora actual, el ID del proceso o un generador de números pseudoaleatorios (PRNG) débil. Un atacante puede analizar una secuencia de valores generados para predecir valores futuros.`,
        impact_en: `### Impact
Allows an attacker to predict supposedly random values, which can lead to session hijacking, CSRF token bypass, or the compromise of cryptographic keys.`,
        impact_es: `### Impacto
Permite a un atacante predecir valores supuestamente aleatorios, lo que puede conducir al secuestro de sesiones, la omisión de tokens CSRF o el compromiso de claves criptográficas.`,
        recommendations_en: `#### Short-Term Recommendations
Use a cryptographically secure pseudo-random number generator (CSPRNG) provided by the operating system or a trusted library for all security-sensitive values (e.g., \`/dev/urandom\` on Linux, \`crypto.randomBytes\` in Node.js).
#### Medium-Term Recommendations
Review all code to ensure that no weak PRNGs (like \`Math.random()\` or \`rand()\`) are used for generating session tokens, keys, salts, or other cryptographic material.
#### Long-Term Recommendations
Establish a coding standard that mandates the use of approved CSPRNGs for all security contexts.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Utilizar un generador de números pseudoaleatorios criptográficamente seguro (CSPRNG) proporcionado por el sistema operativo o una biblioteca de confianza para todos los valores sensibles a la seguridad (p. ej., \`/dev/urandom\` en Linux, \`crypto.randomBytes\` en Node.js).
#### Recomendaciones a Medio Plazo
Revisar todo el código para asegurarse de que no se utilicen PRNG débiles (como \`Math.random()\` o \`rand()\`) para generar tokens de sesión, claves, sales o IVs.
#### Recomendaciones a Largo Plazo
Establecer un estándar de codificación que exija el uso de CSPRNG aprobados para todos los contextos de seguridad.`,
        cwe: "CWE-331",
        severity: "Medium",
        cvss: { score: 6.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "L", availability: "N" },
        references: ["https://cwe.mitre.org/data/definitions/331.html"],
        tags: ["Cryptography"],
        affectedComponents_en: `### Affected Components
- [TODO: Specify the functionality that uses a weak random number generator.]`,
        details_en: `### Proof of Concept
[TODO: Provide a sequence of generated tokens and demonstrate their predictability, or show the code using a weak PRNG function.]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Especificar la funcionalidad que utiliza un generador de números aleatorios débil.]`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar una secuencia de tokens generados y demostrar su previsibilidad, o mostrar el código que utiliza una función PRNG débil.]`,
        immediateActions_en: "### Immediate Actions\nReplace all uses of weak random number generators with cryptographically secure ones.",
        immediateActions_es: "### Acciones Inmediatas\nReemplazar todos los usos de generadores de números aleatorios débiles por otros criptográficamente seguros.",
    },
    {
        id: "vuln-crypto-005",
        title_en: "Padding Oracle Attacks",
        title_es: "Ataques de Oráculo de Relleno",
        overview_en: `### Overview
A padding oracle attack is an attack which uses the padding validation of a cryptographic message to decrypt the ciphertext.`,
        overview_es: `### Resumen
Un ataque de oráculo de relleno es un ataque que utiliza la validación del relleno de un mensaje criptográfico para descifrar el texto cifrado.`,
        technicalDescription_en: `### Technical Description
When a server decrypts ciphertext, it first checks the padding. If the padding is invalid, it often returns a specific error message. An attacker can repeatedly send modified ciphertext to the server and observe whether the server's response indicates a padding error. By analyzing these responses, the attacker can decrypt the message byte by byte without knowing the encryption key.`,
        technicalDescription_es: `### Descripción Técnica
Cuando un servidor descifra un texto cifrado, primero comprueba el relleno. Si el relleno no es válido, a menudo devuelve un mensaje de error específico. Un atacante puede enviar repetidamente texto cifrado modificado al servidor y observar si la respuesta del servidor indica un error de relleno. Al analizar estas responses, el atacante puede descifrar el mensaje byte por byte sin conocer la clave de cifrado.`,
        impact_en: `### Impact
Allows an attacker to decrypt sensitive data that was encrypted, such as session cookies or other confidential information.`,
        impact_es: `### Impacto
Permite a un atacante descifrar datos sensibles que fueron cifrados, como cookies de sesión u otra información confidencial.`,
        recommendations_en: `#### Short-Term Recommendations
Ensure that the application returns a generic error message regardless of whether the failure was due to invalid padding, incorrect MAC, or other decryption errors. Do not leak information through error messages.
#### Medium-Term Recommendations
Use an authenticated encryption mode (AEAD) such as AES-GCM or ChaCha20-Poly1305. These modes combine encryption and authentication, which inherently protects against padding oracle attacks.
#### Long-Term Recommendations
Review all cryptographic implementations to ensure that they are not vulnerable to side-channel attacks based on error messages or timing differences.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Asegurarse de que la aplicación devuelva un mensaje de error genérico independientemente de si el fallo se debió a un relleno no válido, una MAC incorrecta u otros errores de descifrado. No filtrar información a través de los mensajes de error.
#### Recomendaciones a Medio Plazo
Utilizar un modo de cifrado autenticado (AEAD) como AES-GCM o ChaCha20-Poly1305. Estos modos combinan cifrado y autenticación, lo que protege inherentemente contra los ataques de oráculo de relleno.
#### Recomendaciones a Largo Plazo
Revisar todas las implementaciones criptográficas para asegurarse de que no sean vulnerables a ataques de canal lateral basados en mensajes de error o diferencias de tiempo.`,
        cwe: "CWE-209",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        references: ["https://owasp.org/www-community/attacks/Padding_Oracle_Attack"],
        tags: ["Cryptography"],
        affectedComponents_en: `### Affected Components
- [TODO: Specify the functionality that decrypts user-supplied data.]`,
        details_en: `### Proof of Concept
[TODO: Provide a demonstration using a tool like PadBuster to decrypt an encrypted cookie or parameter.]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Especificar la funcionalidad que descifra los datos proporcionados por el usuario.]`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar una demostración utilizando una herramienta como PadBuster para descifrar una cookie o un parámetro cifrado.]`,
        immediateActions_en: "### Immediate Actions\nSwitch from a vulnerable cipher mode like CBC to an authenticated encryption mode like GCM or CCM.",
        immediateActions_es: "### Acciones Inmediatas\nCambiar de un modo de cifrado vulnerable como CBC a un modo de cifrado autenticado como GCM o CCM.",
    },
    {
        id: "vuln-crypto-006",
        title_en: "Weak Random Number Generation",
        title_es: "Generación Débil de Números Aleatorios",
        overview_en: `### Overview
The application uses a weak or predictable random number generator for security-sensitive purposes.`,
        overview_es: `### Resumen
La aplicación utiliza un generador de números aleatorios débil o predecible para fines sensibles a la seguridad.`,
        technicalDescription_en: `### Technical Description
The application uses non-cryptographically secure pseudo-random number generators (PRNGs), such as \`Math.random()\` in JavaScript or \`rand()\` in C/C++. These are often seeded with predictable values like the current time, making their output predictable to an attacker who can observe a few outputs.`,
        technicalDescription_es: `### Descripción Técnica
La aplicación utiliza generadores de números pseudoaleatorios (PRNG) no criptográficamente seguros, como \`Math.random()\` en JavaScript o \`rand()\` en C/C++. Estos a menudo se siembran con valores predecibles como la hora actual, lo que hace que su salida sea predecible para un atacante que puede observar algunas salidas.`,
        impact_en: `### Impact
Allows an attacker to predict supposedly random values, which can lead to session hijacking, CSRF token bypass, or the compromise of cryptographic keys.`,
        impact_es: `### Impacto
Permite a un atacante predecir valores supuestamente aleatorios, lo que puede conducir al secuestro de sesiones, la omisión de tokens CSRF o el compromiso de claves criptográficas.`,
        recommendations_en: `#### Short-Term Recommendations
Use a cryptographically secure pseudo-random number generator (CSPRNG) provided by the operating system or a trusted library for all security-sensitive values (e.g., \`/dev/urandom\` on Linux, \`crypto.randomBytes\` in Node.js).
#### Medium-Term Recommendations
Review all code to ensure that no weak PRNGs (like \`Math.random()\` or \`rand()\`) are used for generating session tokens, keys, salts, or other cryptographic material.
#### Long-Term Recommendations
Establish a coding standard that mandates the use of approved CSPRNGs for all security contexts.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Utilizar un generador de números pseudoaleatorios criptográficamente seguro (CSPRNG) proporcionado por el sistema operativo o una biblioteca de confianza para todos los valores sensibles a la seguridad (p. ej., \`/dev/urandom\` en Linux, \`crypto.randomBytes\` en Node.js).
#### Recomendaciones a Medio Plazo
Revisar todo el código para asegurarse de que no se utilicen PRNG débiles (como \`Math.random()\` o \`rand()\`) para generar tokens de sesión, claves, sales o IVs.
#### Recomendaciones a Largo Plazo
Establecer un estándar de codificación que exija el uso de CSPRNG aprobados para todos los contextos de seguridad.`,
        cwe: "CWE-338",
        severity: "Medium",
        cvss: { score: 6.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:L/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "L", integrity: "L", availability: "N" },
        references: ["https://cwe.mitre.org/data/definitions/338.html"],
        tags: ["Cryptography"],
        affectedComponents_en: `### Affected Components
- [TODO: Specify the functionality that uses a weak random number generator.]`,
        details_en: `### Proof of Concept
[TODO: Show the code using a weak PRNG function (e.g., Math.random()) for a security-sensitive purpose.]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Especificar la funcionalidad que utiliza un generador de números aleatorios débil.]`,
        details_es: `### Prueba de Concepto
[TODO: Mostrar el código que utiliza una función PRNG débil (p. ej., Math.random()) para un propósito sensible a la seguridad.]`,
        immediateActions_en: "### Immediate Actions\nReplace all instances of weak random number generators with their cryptographically secure counterparts.",
        immediateActions_es: "### Acciones Inmediatas\nReemplazar todas las instancias de generadores de números aleatorios débiles por sus contrapartes criptográficamente seguras.",
    },
    {
        id: "vuln-crypto-007",
        title_en: "Cryptographic Flaws in Design",
        title_es: "Defectos Criptográficos en el Diseño",
        overview_en: `### Overview
The application uses cryptography correctly in terms of algorithms, but the overall design of the security feature is flawed, rendering it insecure.`,
        overview_es: `### Resumen
La aplicación utiliza la criptografía correctamente en términos de algoritmos, pero el diseño general de la característica de seguridad es defectuoso, lo que la hace insegura.`,
        technicalDescription_en: `### Technical Description
This is a broad category that includes issues like using encryption without authentication (MAC), creating a password reset mechanism where the token can be brute-forced, or designing a multi-step process where an attacker can skip a critical step. The individual cryptographic primitives are strong, but the way they are combined is not.`,
        technicalDescription_es: `### Descripción Técnica
Esta es una categoría amplia que incluye problemas como usar cifrado sin autenticación (MAC), crear un mecanismo de restablecimiento de contraseña donde el token puede ser forzado por fuerza bruta, o diseñar un proceso de varios pasos donde un atacante puede omitir un paso crítico. Las primitivas criptográficas individuales son fuertes, pero la forma en que se combinan no lo es.`,
        impact_en: `### Impact
The entire security feature can be bypassed, leading to the same impact as if no cryptography was used at all. This can result in data compromise, authentication bypass, and other critical failures.`,
        impact_es: `### Impacto
La característica de seguridad completa puede ser eludida, lo que conduce al mismo impacto que si no se hubiera utilizado criptografía en absoluto. Esto puede resultar en el compromiso de datos, la omisión de la autenticación y otros fallos críticos.`,
        recommendations_en: `#### Short-Term Recommendations
Redesign the flawed security feature based on well-vetted, standard security patterns. For example, use HMAC to add authentication to encrypted data.
#### Medium-Term Recommendations
Avoid designing custom cryptographic protocols. Rely on established standards like TLS, JWT, and SAML.
#### Long-Term Recommendations
Incorporate threat modeling and security design reviews into the software development lifecycle to identify and eliminate design flaws before implementation.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Rediseñar la característica de seguridad defectuosa basándose en patrones de seguridad estándar y bien examinados. Por ejemplo, usar HMAC para agregar autenticación a los datos cifrados.
#### Recomendaciones a Medio Plazo
Evitar el diseño de protocolos criptográficos personalizados. Confiar en estándares establecidos como TLS, JWT y SAML.
#### Recomendaciones a Largo Plazo
Incorporar el modelado de amenazas y las revisiones de diseño de seguridad en el ciclo de vida del desarrollo de software para identificar y eliminar los defectos de diseño antes de la implementación.`,
        cwe: "CWE-311",
        severity: "Critical",
        cvss: { score: 9.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        references: ["https://www.schneier.com/blog/archives/2011/04/schneiers_law.html"],
        tags: ["Cryptography"],
        affectedComponents_en: `### Affected Components
- [TODO: Describe the security feature with the design flaw.]`,
        details_en: `### Proof of Concept
[TODO: Provide a step-by-step demonstration of how to bypass the flawed security feature.]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Describir la característica de seguridad con el defecto de diseño.]`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar una demostración paso a paso de cómo eludir la característica de seguridad defectuosa.]`,
        immediateActions_en: "### Immediate Actions\nConduct a thorough design review of the flawed security feature with a cryptography expert.",
        immediateActions_es: "### Acciones Inmediatas\nRealizar una revisión de diseño exhaustiva de la característica de seguridad defectuosa con un experto en criptografía.",
    },
    {
        id: "vuln-crypto-008",
        title_en: "Side-Channel Attacks",
        title_es: "Ataques de Canal Lateral",
        overview_en: `### Overview
A side-channel attack is any attack based on information gained from the physical implementation of a cryptosystem, rather than brute force or theoretical weaknesses in the algorithms.`,
        overview_es: `### Resumen
Un ataque de canal lateral es cualquier ataque basado en la información obtenida de la implementación física de un criptosistema, en lugar de la fuerza bruta o las debilidades teóricas en los algoritmos.`,
        technicalDescription_en: `### Technical Description
Information can be leaked through timing information, power consumption, electromagnetic leaks, or even sound. For example, a padding oracle attack is a type of side-channel attack where the different error messages (or response times) for padding errors leak information.`,
        technicalDescription_es: `### Descripción Técnica
La información puede filtrarse a través de la información de tiempo, el consumo de energía, las fugas electromagnéticas o incluso el sonido. Por ejemplo, un ataque de oráculo de relleno es un tipo de ataque de canal lateral donde los diferentes mensajes de error (o tiempos de respuesta) para los errores de relleno filtran información.`,
        impact_en: `### Impact
Side-channel attacks can be used to extract cryptographic keys or decrypt data, completely undermining the security of the cryptographic system.`,
        impact_es: `### Impacto
Los ataques de canal lateral se pueden utilizar para extraer claves criptográficas o descifrar datos, socavando por completo la seguridad del sistema criptográfico.`,
        recommendations_en: `#### Short-Term Recommendations
Ensure that all cryptographic operations are performed in constant time, meaning they take the same amount of time regardless of the input data. Use safe string comparison functions instead of \`==\` for secrets.
#### Medium-Term Recommendations
Use cryptographic libraries that are specifically designed to be resistant to side-channel attacks.
#### Long-Term Recommendations
For highly sensitive applications, consider physical security measures to protect against power analysis and electromagnetic leak attacks.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Asegurarse de que todas las operaciones criptográficas se realicen en tiempo constante, lo que significa que tardan la misma cantidad de tiempo independientemente de los datos de entrada. Usar funciones de comparación de cadenas seguras en lugar de \`==\` para los secretos.
#### Recomendaciones a Medio Plazo
Utilizar bibliotecas criptográficas que estén diseñadas específicamente para ser resistentes a los ataques de canal lateral.
#### Recomendaciones a Largo Plazo
Para aplicaciones altamente sensibles, considerar medidas de seguridad física para proteger contra el análisis de energía y los ataques de fuga electromagnética.`,
        cwe: "CWE-208",
        severity: "Medium",
        cvss: { score: 5.9, vectorString: "CVSS:3.1/AV:P/AC:H/PR:N/UI:N/S:U/C:H/I:N/A:N", attackVector: "P", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "N", availability: "N" },
        references: ["https://en.wikipedia.org/wiki/Side-channel_attack"],
        tags: ["Cryptography"],
        affectedComponents_en: `### Affected Components
- [TODO: Specify the cryptographic operation that is vulnerable to a side-channel attack.]`,
        details_en: `### Proof of Concept
[TODO: Provide data showing the timing differences or other leaked information that allows an attacker to infer secret data.]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Especificar la operación criptográfica que es vulnerable a un ataque de canal lateral.]`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar datos que muestren las diferencias de tiempo u otra información filtrada que permita a un atacante inferir datos secretos.]`,
        immediateActions_en: "### Immediate Actions\nImplement constant-time operations for all cryptographic comparisons and processing to prevent timing-based side channels.",
        immediateActions_es: "### Acciones Inmediatas\nImplementar operaciones de tiempo constante para todas las comparaciones y procesamientos criptográficos para prevenir los canales laterales basados en el tiempo.",
    },
    {
        id: "vuln-crypto-009",
        title_en: "Certificate Validation Bypass",
        title_es: "Omisión de Validación de Certificados",
        overview_en: `### Overview
The application fails to properly validate SSL/TLS certificates, allowing an attacker to perform a Man-in-the-Middle (MitM) attack.`,
        overview_es: `### Resumen
La aplicación no valida correctamente los certificados SSL/TLS, lo que permite a un atacante realizar un ataque de intermediario (Man-in-the-Middle o MitM).`,
        technicalDescription_en: `### Technical Description
The client application is configured to trust any SSL/TLS certificate, or it fails to check the hostname in the certificate against the server it is connecting to. This allows an attacker to present a self-signed or otherwise invalid certificate and intercept the encrypted communication.`,
        technicalDescription_es: `### Descripción Técnica
La aplicación cliente está configurada para confiar en cualquier certificado SSL/TLS, o no comprueba que el nombre de host en el certificado coincida con el servidor al que se está conectando. Esto permite a un atacante presentar un certificado autofirmado o inválido de otro modo e interceptar la comunicación cifrada.`,
        impact_en: `### Impact
An attacker can intercept, read, and modify all data transmitted between the client and the server, including credentials and sensitive information.`,
        impact_es: `### Impacto
Un atacante puede interceptar, leer y modificar todos los datos transmitidos entre el cliente y el servidor, incluidas las credenciales y la información sensible.`,
        recommendations_en: `#### Short-Term Recommendations
Ensure that the client application always validates the server's certificate against the device's trusted root CAs and checks that the certificate's hostname matches the server's domain.
#### Medium-Term Recommendations
Implement SSL/TLS certificate pinning, where the application is hardcoded to only trust a specific server certificate or public key. This provides protection even if the device's trust store is compromised.
#### Long-Term Recommendations
Use a centralized and secure networking library for all network communications that enforces these security controls by default.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Asegurarse de que la aplicación cliente siempre valide el certificado del servidor con las CA raíz de confianza del dispositivo y compruebe que el nombre de host del certificado coincida con el servidor al que se está conectando.
#### Recomendaciones a Medio Plazo
Implementar el anclaje de certificados SSL/TLS (certificate pinning), donde la aplicación está codificada para confiar únicamente en un certificado de servidor o clave pública específicos. Esto proporciona protección incluso si el almacén de confianza del dispositivo está comprometido.
#### Recomendaciones a Largo Plazo
Utilizar una biblioteca de red centralizada y segura para todas las comunicaciones de red que aplique estos controles de seguridad por defecto.`,
        cwe: "CWE-295",
        severity: "High",
        cvss: { score: 8.1, vectorString: "CVSS:3.1/AV:A/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:N", attackVector: "A", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "N" },
        references: ["https://owasp.org/www-project-mobile-top-10/2016-risks/m3-insecure-communication/"],
        tags: ["Cryptography", "Mobile", "Network"],
        affectedComponents_en: `### Affected Components
- The client application's TLS/SSL handling code.`,
        details_en: `### Proof of Concept
[TODO: Provide a PoC using a proxy tool like Burp or mitmproxy to intercept the application's traffic by presenting a self-signed certificate.]`,
        affectedComponents_es: `### Componentes Afectados
- El código de manejo de TLS/SSL de la aplicación cliente.`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar una PoC utilizando una herramienta de proxy como Burp o mitmproxy para interceptar el tráfico de la aplicación presentando un certificado autofirmado.]`,
        immediateActions_en: "### Immediate Actions\nEnforce strict TLS certificate validation in the client application immediately.",
        immediateActions_es: "### Acciones Inmediatas\nHacer cumplir inmediatamente la validación estricta de certificados TLS en la aplicación cliente.",
    },
    {
        id: "vuln-crypto-010",
        title_en: "Insecure SSL/TLS Configuration",
        title_es: "Configuración Insegura de SSL/TLS",
        overview_en: `### Overview
The server is configured to use weak or outdated SSL/TLS protocols and cipher suites, making encrypted communication vulnerable to decryption.`,
        overview_es: `### Resumen
El servidor está configurado para usar protocolos y conjuntos de cifrado SSL/TLS débiles u obsoletos, lo que hace que la comunicación cifrada sea vulnerable al descifrado.`,
        technicalDescription_en: `### Technical Description
The server supports weak protocols like SSLv2, SSLv3, or early TLS (1.0, 1.1). It may also support weak cipher suites that use algorithms like RC4, 3DES, or have small key sizes. These configurations are vulnerable to known attacks like POODLE, BEAST, or FREAK.`,
        technicalDescription_es: `### Descripción Técnica
El servidor admite protocolos débiles como SSLv2, SSLv3 o TLS temprano (1.0, 1.1). También puede admitir conjuntos de cifrado débiles que usan algoritmos como RC4, 3DES o tienen tamaños de clave pequeños. Estas configuraciones son vulnerables a ataques conocidos como POODLE, BEAST o FREAK.`,
        impact_en: `### Impact
An attacker can perform a man-in-the-middle attack to downgrade the connection to a weak protocol/cipher and then decrypt the intercepted traffic, compromising sensitive data.`,
        impact_es: `### Impacto
Un atacante puede realizar un ataque de intermediario (man-in-the-middle) para degradar la conexión a un protocolo/cifrado débil y luego descifrar el tráfico interceptado, comprometiendo datos sensibles.`,
        recommendations_en: `#### Short-Term Recommendations
Configure the server to only support TLS 1.2 and TLS 1.3 with a strong, modern set of cipher suites that provide forward secrecy.
#### Medium-Term Recommendations
Implement HTTP Strict Transport Security (HSTS) to ensure that browsers always connect to the server over a secure connection.
#### Long-Term Recommendations
Regularly audit the server's SSL/TLS configuration using automated tools like SSL Labs' SSL Test and keep the configuration updated with current best practices.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Configurar los servidores para que solo admitan TLS 1.2 y TLS 1.3 con un conjunto de cifrado fuerte y moderno que proporcione secreto hacia adelante (forward secrecy).
#### Recomendaciones a Medio Plazo
Implementar HTTP Strict Transport Security (HSTS) para garantizar que los navegadores siempre se conecten al servidor a través de una conexión segura.
#### Recomendaciones a Largo Plazo
Auditar regularmente la configuración SSL/TLS del servidor utilizando herramientas automatizadas como la prueba SSL de SSL Labs y mantener la configuración actualizada con las mejores prácticas actuales.`,
        cwe: "CWE-326",
        severity: "High",
        cvss: { score: 7.4, vectorString: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:N", attackVector: "N", attackComplexity: "H", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "N" },
        references: ["https://www.ssllabs.com/projects/best-practices/"],
        tags: ["Cryptography", "Network", "Infrastructure"],
        affectedComponents_en: `### Affected Components
- The SSL/TLS configuration of the web server or other network services.`,
        details_en: "### Proof of Concept\n[TODO: Provide a report from a tool like `nmap --script ssl-enum-ciphers` or a report from SSL Labs showing the support for weak protocols or ciphers.]",
        affectedComponents_es: `### Componentes Afectados
- La configuración SSL/TLS del servidor web u otros servicios de red.`,
        details_es: "### Prueba de Concepto\n[TODO: Proporcionar un informe de una herramienta como `nmap --script ssl-enum-ciphers` o un informe de SSL Labs que muestre el soporte para protocolos o cifrados débiles.]",
        immediateActions_en: "### Immediate Actions\nImmediately disable support for all SSL versions and TLS 1.0/1.1 on the server. Disable all known weak cipher suites.",
        immediateActions_es: "### Acciones Inmediatas\nDeshabilitar inmediatamente el soporte para todas las versiones de SSL y TLS 1.0/1.1 en el servidor. Deshabilitar todos los conjuntos de cifrado débiles conocidos.",
    },
    {
        id: 'vuln-add-001',
        title_en: 'Buffer Overflow',
        title_es: 'Desbordamiento de Búfer',
        overview_en: '### Overview\nA buffer overflow is an anomaly where a program, while writing data to a buffer, overruns the buffer\'s boundary and overwrites adjacent memory locations.',
        overview_es: '### Resumen\nUn desbordamiento de búfer es una anomalía en la que un programa, al escribir datos en un búfer, sobrepasa el límite del búfer y sobrescribe las ubicaciones de memoria adyacentes.',
        technicalDescription_en: '### Technical Description\nThis vulnerability is caused by functions that do not perform bounds checking, such as `gets()`, `strcpy()`, and `sprintf()`. An attacker can provide an input string that is larger than the buffer, overwriting the stack. This can be used to overwrite the return address of a function, allowing the attacker to redirect execution to their own malicious code (shellcode).',
        technicalDescription_es: '### Descripción Técnica\nEsta vulnerabilidad es causada por funciones que no realizan comprobación de límites, como `gets()`, `strcpy()` y `sprintf()`. Un atacante puede proporcionar una cadena de entrada que es más grande que el búfer, sobrescribiendo la pila. Esto se puede utilizar para sobrescribir la dirección de retorno de una función, permitiendo al atacante redirigir la ejecución a su propio código malicioso (shellcode).',
        impact_en: '### Impact\nA successful buffer overflow attack can lead to arbitrary code execution with the privileges of the vulnerable program, or a denial-of-service by crashing the application.',
        impact_es: '### Impacto\nUn ataque de desbordamiento de búfer exitoso puede conducir a la ejecución de código arbitrario con los privilegios del programa vulnerable, o a una denegación de servicio al hacer que la aplicación se bloquee.',
        recommendations_en: `#### Short-Term Recommendations
Replace all unsafe functions (like \`strcpy\`) with their safer, bounds-checking counterparts (like \`strncpy\`). Recompile the application with modern compiler protections like Stack Canaries, ASLR, and DEP/NX.
#### Medium-Term Recommendations
Conduct a full source code review to identify and eliminate all potential buffer overflow vulnerabilities.
#### Long-Term Recommendations
Train developers in secure coding practices, specifically focusing on memory management and input validation. Use static analysis (SAST) tools to automatically detect these flaws during development.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Reemplazar todas las funciones inseguras (como \`strcpy\`) por sus contrapartes más seguras que comprueban los límites (como \`strncpy\`). Recompilar la aplicación con protecciones de compilador modernas como Stack Canaries, ASLR y DEP/NX.
#### Recomendaciones a Medio Plazo
Realizar una revisión completa del código fuente para identificar y eliminar todas las posibles vulnerabilidades de desbordamiento de búfer.
#### Recomendaciones a Largo Plazo
Capacitar a los desarrolladores en prácticas de codificación segura, centrándose específicamente en la gestión de la memoria y la validación de entradas. Usar herramientas de análisis estático (SAST) para detectar automáticamente estos fallos durante el desarrollo.`,
        cwe: 'CWE-120',
        severity: 'Critical',
        cvss: { score: 9.8, vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H', attackVector: 'N', attackComplexity: 'L', privilegesRequired: 'N', userInteraction: 'N', scope: 'U', confidentiality: 'H', integrity: 'H', availability: 'H' },
        references: ['https://owasp.org/www-community/vulnerabilities/Buffer_Overflow'],
        tags: ['Additional'],
        affectedComponents_en: '### Affected Components\n- [TODO: Specify the vulnerable function and the input parameter that can be overflowed.]',
        details_en: '### Proof of Concept\n[TODO: Provide a script or payload that causes the buffer overflow and demonstrates code execution or a crash.]',
        affectedComponents_es: '### Componentes Afectados\n- [TODO: Especificar la función vulnerable y el parámetro de entrada que se puede desbordar.]',
        details_es: '### Prueba de Concepto\n[TODO: Proporcionar un script o una carga útil que cause el desbordamiento del búfer y demuestre la ejecución de código o un bloqueo.]',
        immediateActions_en: "### Immediate Actions\nIf possible, immediately disable the vulnerable functionality or apply a temporary filter to block overly long inputs.",
        immediateActions_es: "### Acciones Inmediatas\nSi es posible, deshabilitar inmediatamente la funcionalidad vulnerable o aplicar un filtro temporal para bloquear las entradas demasiado largas.",
    },
    {
        id: 'vuln-add-002',
        title_en: 'Format String Vulnerabilities',
        title_es: 'Vulnerabilidades de Cadena de Formato',
        overview_en: '### Overview\nFormat string vulnerabilities occur when user-supplied input is evaluated as a command by the formatting function of a programming language.',
        overview_es: '### Resumen\nLas vulnerabilidades de cadena de formato ocurren cuando la entrada proporcionada por el usuario es evaluada como un comando por la función de formato de un lenguaje de programación.',
        technicalDescription_en: '### Technical Description\nIn languages like C, functions like `printf()` can interpret format specifiers (e.g., `%x`, `%s`, `%n`) from user input. An attacker can use these specifiers to read from the stack, write to arbitrary memory locations, and potentially execute arbitrary code.',
        technicalDescription_es: '### Descripción Técnica\nEn lenguajes como C, funciones como `printf()` pueden interpretar especificadores de formato (p. ej., `%x`, `%s`, `%n`) de la entrada del usuario. Un atacante puede usar estos especificadores para leer de la pila, escribir en ubicaciones de memoria arbitrarias y potencialmente ejecutar código arbitrario.',
        impact_en: '### Impact\nCan lead to information disclosure, denial-of-service, or arbitrary code execution.',
        impact_es: '### Impacto\nPuede conducir a la divulgación de información, denegación de servicio o ejecución de código arbitrario.',
        recommendations_en: `#### Short-Term Recommendations
Always specify a format string as a constant in functions like \`printf\`. For example, use \`printf("%s", userInput)\` instead of \`printf(userInput)\`.
#### Medium-Term Recommendations
Use compiler flags that warn about potential format string vulnerabilities (e.g., \`-Wformat\` in GCC).
#### Long-Term Recommendations
Use static analysis tools to automatically detect format string bugs in the codebase.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Siempre especificar una cadena de formato como una constante en funciones como \`printf\`. Por ejemplo, usar \`printf("%s", userInput)\` en lugar de \`printf(userInput)\`.
#### Recomendaciones a Medio Plazo
Usar banderas de compilador que adviertan sobre posiblesulnerabilidades de cadena de formato (p. ej., \`-Wformat\` en GCC).
#### Recomendaciones a Largo Plazo
Usar herramientas de análisis estático para detectar automáticamente errores de cadena de formato en el código base.`,
        cwe: 'CWE-134',
        severity: 'High',
        cvss: { score: 8.8, vectorString: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H', attackVector: 'N', attackComplexity: 'L', privilegesRequired: 'L', userInteraction: 'N', scope: 'U', confidentiality: 'H', integrity: 'H', availability: 'H' },
        references: ['https://owasp.org/www-community/vulnerabilities/Format_string_attack'],
        tags: ['Additional'],
        affectedComponents_en: '### Affected Components\n- [TODO: Specify the function and user input that is vulnerable.]',
        details_en: '### Proof of Concept\n[TODO: Provide an input string with format specifiers that demonstrates reading from the stack or writing to memory.]',
        affectedComponents_es: '### Componentes Afectados\n- [TODO: Especificar la función y la entrada de usuario que es vulnerable.]',
        details_es: '### Prueba de Concepto\n[TODO: Proporcionar una cadena de entrada con especificadores de formato que demuestre la lectura de la pila o la escritura en la memoria.]',
        immediateActions_en: "### Immediate Actions\nReview and fix all instances where user input is passed directly to formatting functions.",
        immediateActions_es: "### Acciones Inmediatas\nRevisar y corregir todas las instancias donde la entrada del usuario se pasa directamente a las funciones de formato.",
    },
    {
        id: 'vuln-add-003',
        title_en: 'Race Conditions',
        title_es: 'Condiciones de Carrera',
        overview_en: '### Overview\nA race condition is a flaw where the output of an event depends on the sequence or timing of other uncontrollable events.',
        overview_es: '### Resumen\nUna condición de carrera es una falla donde el resultado de un evento depende de la secuencia o el tiempo de otros eventos incontrolables.',
        technicalDescription_en: '### Technical Description\nThis vulnerability occurs in multi-threaded applications where shared resources are not properly synchronized. A common example is a "Time-of-check to time-of-use" (TOCTOU) bug, where an application checks for a security condition (e.g., file permissions) and then performs an action, but an attacker can change the condition between the check and the action.',
        technicalDescription_es: '### Descripción Técnica\nEsta vulnerabilidad ocurre en aplicaciones multihilo donde los recursos compartidos no se sincronizan correctamente. Un ejemplo común es un error de "Time-of-check to time-of-use" (TOCTOU), donde una aplicación comprueba una condición de seguridad (p. ej., permisos de archivo) y luego realiza una acción, pero un atacante puede cambiar la condición entre la comprobación y la acción.',
        impact_en: '### Impact\nCan lead to privilege escalation, denial-of-service, or data corruption.',
        impact_es: '### Impacto\nPuede conducir a la escalada de privilegios, denegación de servicio o corrupción de datos.',
        recommendations_en: `#### Short-Term Recommendations
Implement proper synchronization mechanisms like mutexes, semaphores, or locks when accessing shared resources.
#### Medium-Term Recommendations
Design atomic operations for critical sections of code. Avoid TOCTOU flaws by performing the action immediately after the check within a locked section.
#### Long-Term Recommendations
Use thread-safe libraries and frameworks. Conduct thorough code reviews and use static/dynamic analysis tools to identify potential race conditions.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Implementar mecanismos de sincronización adecuados como mutex, semáforos o bloqueos al acceder a recursos compartidos.
#### Recomendaciones a Medio Plazo
Diseñar operaciones atómicas para secciones críticas del código. Evitar fallas TOCTOU realizando la acción inmediatamente después de la verificación dentro de una sección bloqueada.
#### Recomendaciones a Largo Plazo
Usar bibliotecas y frameworks seguros para hilos. Realizar revisiones de código exhaustivas y usar herramientas de análisis estático/dinámico para identificar posibles condiciones de carrera.`,
        cwe: 'CWE-362',
        severity: 'High',
        cvss: { score: 8.1, vectorString: 'CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:H', attackVector: 'N', attackComplexity: 'H', privilegesRequired: 'N', userInteraction: 'N', scope: 'U', confidentiality: 'H', integrity: 'H', availability: 'H' },
        references: ['https://owasp.org/www-community/vulnerabilities/Race_Conditions'],
        tags: ['Additional'],
        affectedComponents_en: '### Affected Components\n- [TODO: Specify the multi-threaded functionality and the shared resource.]',
        details_en: '### Proof of Concept\n[TODO: Provide a PoC that demonstrates the race condition, for example, by rapidly sending concurrent requests that lead to an inconsistent state.]',
        affectedComponents_es: '### Componentes Afectados\n- [TODO: Especificar la funcionalidad multihilo y el recurso compartido.]',
        details_es: '### Prueba de Concepto\n[TODO: Proporcionar una PoC que demuestre la condición de carrera, por ejemplo, enviando rápidamente solicitudes concurrentes que conduzcan a un estado inconsistente.]',
        immediateActions_en: "### Immediate Actions\nReview the logic for handling shared resources and implement proper locking mechanisms.",
        immediateActions_es: "### Acciones Inmediatas\nRevisar la lógica para manejar recursos compartidos e implementar mecanismos de bloqueo adecuados.",
    },
    {
        id: 'vuln-add-004',
        title_en: 'LDAP Injection',
        title_es: 'Inyección LDAP',
        overview_en: '### Overview\nLDAP injection is an attack technique used to exploit web applications that construct LDAP statements from user-supplied input.',
        overview_es: '### Resumen\nLa inyección LDAP es una técnica de ataque utilizada para explotar aplicaciones web que construyen sentencias LDAP a partir de la entrada proporcionada por el usuario.',
        technicalDescription_en: '### Technical Description\nWhen an application fails to properly sanitize user input before placing it into an LDAP query, an attacker can inject LDAP metacharacters (like `*`, `(`, `)`, `&`, `|`) to modify the query. This can be used to bypass authentication or view/modify information in the LDAP directory.',
        technicalDescription_es: '### Descripción Técnica\nCuando una aplicación no sanea correctamente la entrada del usuario antes de colocarla en una consulta LDAP, un atacante puede inyectar metacaracteres LDAP (como `*`, `(`, `)`, `&`, `|`) para modificar la consulta. Esto se puede utilizar para eludir la autenticación o ver/modificar información en el directorio LDAP.',
        impact_en: '### Impact\nCan lead to authentication bypass, privilege escalation, and disclosure of sensitive information stored in the LDAP directory.',
        impact_es: '### Impacto\nPuede conducir a la omisión de la autenticación, la escalada de privilegios y la divulgación de información sensible almacenada en el directorio LDAP.',
        recommendations_en: `#### Short-Term Recommendations
Use a framework-provided LDAP encoding function to sanitize all user-supplied input before it is placed in an LDAP query.
#### Medium-Term Recommendations
Avoid constructing LDAP queries from user input. Use a mapping to predefined queries where possible.
#### Long-Term Recommendations
Implement the principle of least privilege for the LDAP user account, so it can only access the necessary parts of the directory.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Utilizar una función de codificación LDAP proporcionada por el framework para sanear toda la entrada proporcionada por el usuario antes de que se coloque en una consulta LDAP.
#### Recomendaciones a Medio Plazo
Evitar la construcción de consultas LDAP a partir de la entrada del usuario. Usar un mapeo a consultas predefinidas cuando sea posible.
#### Recomendaciones a Largo Plazo
Implementar el principio de privilegio mínimo para la cuenta de usuario LDAP, de modo que solo pueda acceder a las partes necesarias del directorio.`,
        cwe: 'CWE-90',
        severity: 'High',
        cvss: { score: 8.8, vectorString: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H', attackVector: 'N', attackComplexity: 'L', privilegesRequired: 'L', userInteraction: 'N', scope: 'U', confidentiality: 'H', integrity: 'H', availability: 'H' },
        references: ['https://owasp.org/www-community/attacks/Ldap_Injection'],
        tags: ['Additional'],
        affectedComponents_en: '### Affected Components\n- [TODO: Specify the function and parameter vulnerable to LDAP injection.]',
        details_en: '### Proof of Concept\n[TODO: Provide a payload with LDAP metacharacters that bypasses authentication or extracts information.]',
        affectedComponents_es: '### Componentes Afectados\n- [TODO: Especificar la función y el parámetro vulnerables a la inyección LDAP.]',
        details_es: '### Prueba de Concepto\n[TODO: Proporcionar una carga útil con metacaracteres LDAP que eluda la autenticación o extraiga información.]',
        immediateActions_en: "### Immediate Actions\nImplement input sanitization on all parameters used in LDAP queries.",
        immediateActions_es: "### Acciones Inmediatas\nImplementar la sanitización de entradas en todos los parámetros utilizados en las consultas LDAP.",
    },
    {
        id: 'vuln-add-005',
        title_en: 'XPath Injection',
        title_es: 'Inyección XPath',
        overview_en: '### Overview\nXPath Injection is an attack technique used to exploit applications that construct XPath queries from user-supplied input.',
        overview_es: '### Resumen\nLa inyección de XPath es una técnica de ataque utilizada para explotar aplicaciones que construyen consultas XPath a partir de la entrada proporcionada por el usuario.',
        technicalDescription_en: '### Technical Description\nSimilar to SQL injection, an attacker can manipulate an XPath query by injecting malicious characters. This can allow them to bypass authentication, or access or modify parts of the XML document they should not have access to.',
        technicalDescription_es: '### Descripción Técnica\nDe forma similar a la inyección SQL, un atacante puede manipular una consulta XPath inyectando caracteres maliciosos. Esto puede permitirles eludir la autenticación, o acceder o modificar partes del documento XML a las que no deberían tener acceso.',
        impact_en: '### Impact\nCan lead to authentication bypass, information disclosure, and data corruption within the XML data store.',
        impact_es: '### Impacto\nPuede conducir a la omisión de la autenticación, la divulgación de información y la corrupción de datos dentro del almacén de datos XML.',
        recommendations_en: `#### Short-Term Recommendations
Use parameterized XPath queries or libraries that automatically handle the escaping of special characters.
#### Medium-Term Recommendations
Validate all user input against a strict allow-list of expected values.
#### Long-Term Recommendations
Avoid building XPath queries from user input. Use predefined queries where possible.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Utilizar consultas XPath parametrizadas o bibliotecas que manejen automáticamente el escape de caracteres especiales.
#### Recomendaciones a Medio Plazo
Validar toda la entrada del usuario con una lista blanca estricta de valores esperados.
#### Recomendaciones a Largo Plazo
Evitar construir consultas XPath a partir de la entrada del usuario. Usar consultas predefinidas cuando sea posible.`,
        cwe: 'CWE-643',
        severity: 'High',
        cvss: { score: 8.8, vectorString: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H', attackVector: 'N', attackComplexity: 'L', privilegesRequired: 'L', userInteraction: 'N', scope: 'U', confidentiality: 'H', integrity: 'H', availability: 'H' },
        references: ['https://owasp.org/www-community/attacks/XPATH_Injection'],
        tags: ['Additional'],
        affectedComponents_en: '### Affected Components\n- [TODO: Specify the function and parameter vulnerable to XPath injection.]',
        details_en: '### Proof of Concept\n[TODO: Provide a payload with XPath syntax that bypasses authentication or extracts sensitive information from the XML document.]',
        affectedComponents_es: '### Componentes Afectados\n- [TODO: Especificar la función y el parámetro vulnerables a la inyección XPath.]',
        details_es: '### Prueba de Concepto\n[TODO: Proporcionar una carga útil con sintaxis XPath que eluda la autenticación o extraiga información sensible del documento XML.]',
        immediateActions_en: "### Immediate Actions\nImplement input sanitization on all parameters used in XPath queries.",
        immediateActions_es: "### Acciones Inmediatas\nImplementar la sanitización de entradas en todos los parámetros utilizados en las consultas XPath.",
    },
    {
        id: 'vuln-add-006',
        title_en: 'Server-Side Template Injection',
        title_es: 'Inyección de Plantillas del Servidor',
        overview_en: '### Overview\nServer-Side Template Injection (SSTI) occurs when user input is unsafely embedded into a template on the server side, allowing an attacker to execute commands on the server.',
        overview_es: '### Resumen\nLa inyección de plantillas del servidor (SSTI) ocurre cuando la entrada del usuario se incrusta de forma no segura en una plantilla en el lado del servidor, lo que permite a un atacante ejecutar comandos en el servidor.',
        technicalDescription_en: '### Technical Description\nMany web frameworks use templates to generate dynamic HTML. If user input is concatenated directly into a template rather than being passed as data, an attacker can inject template syntax. This can often be escalated to execute arbitrary commands on the underlying server.',
        technicalDescription_es: '### Descripción Técnica\nMuchos frameworks web utilizan plantillas para generar HTML dinámico. Si la entrada del usuario se concatena directamente en una plantilla en lugar de pasarse como datos, un atacante puede inyectar sintaxis de plantilla. Esto a menudo se puede escalar para ejecutar comandos arbitrarios en el servidor subyacente.',
        impact_en: '### Impact\nCan lead to full Remote Code Execution (RCE) on the server.',
        impact_es: '### Impacto\nPuede conducir a la Ejecución Remota de Código (RCE) completa en el servidor.',
        recommendations_en: `#### Short-Term Recommendations
Always pass user input as data to the template engine, never concatenate it into the template string itself.
#### Medium-Term Recommendations
Use logic-less templates where possible to reduce the attack surface.
#### Long-Term Recommendations
Run the application in a sandboxed environment to limit the impact of a potential RCE.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Siempre pasar la entrada del usuario como datos al motor de plantillas, nunca concatenarla en la propia cadena de la plantilla.
#### Recomendaciones a Medio Plazo
Usar plantillas sin lógica cuando sea posible para reducir la superficie de ataque.
#### Recomendaciones a Largo Plazo
Ejecutar la aplicación en un entorno sandbox para limitar el impacto de una posible RCE.`,
        cwe: 'CWE-94',
        severity: 'Critical',
        cvss: { score: 9.8, vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H', attackVector: 'N', attackComplexity: 'L', privilegesRequired: 'N', userInteraction: 'N', scope: 'U', confidentiality: 'H', integrity: 'H', availability: 'H' },
        references: ['https://portswigger.net/web-security/server-side-template-injection'],
        tags: ['Additional', 'Web'],
        affectedComponents_en: '### Affected Components\n- [TODO: Specify the template and input vulnerable to SSTI.]',
        details_en: '### Proof of Concept\n[TODO: Provide a payload (e.g., `{{7*7}}`) that demonstrates template syntax is being evaluated, and escalate it to RCE if possible.]',
        affectedComponents_es: '### Componentes Afectados\n- [TODO: Especificar la plantilla y la entrada vulnerables a SSTI.]',
        details_es: '### Prueba de Concepto\n[TODO: Proporcionar una carga útil (p. ej., `{{7*7}}`) que demuestre que se está evaluando la sintaxis de la plantilla, y escalarla a RCE si es posible.]',
        immediateActions_en: "### Immediate Actions\nIdentify and sanitize all user inputs that are used within server-side templates.",
        immediateActions_es: "### Acciones Inmediatas\nIdentificar y sanear todas las entradas de usuario que se utilizan dentro de las plantillas del lado del servidor.",
    },
    {
        id: 'vuln-add-007',
        title_en: 'Open-Source Vulnerabilities',
        title_es: 'Vulnerabilidades en Código Abierto',
        overview_en: '### Overview\nThe application uses open-source libraries or components with known, publicly disclosed vulnerabilities.',
        overview_es: '### Resumen\nLa aplicación utiliza bibliotecas o componentes de código abierto con vulnerabilidades conocidas y divulgadas públicamente.',
        technicalDescription_en: '### Technical Description\nModern applications are built using a large number of third-party dependencies. If these dependencies are not regularly updated, the application can inherit their vulnerabilities. An attacker can exploit these known vulnerabilities to compromise the application.',
        technicalDescription_es: '### Descripción Técnica\nLas aplicaciones modernas se construyen utilizando una gran cantidad de dependencias de terceros. Si estas dependencias no se actualizan regularmente, la aplicación puede heredar sus vulnerabilidades. Un atacante puede explotar estasulnerabilidades conocidas para comprometer la aplicación.',
        impact_en: '### Impact\nThe impact depends on the specific vulnerability in the open-source component, but it can range from information disclosure to full Remote Code Execution.',
        impact_es: '### Impacto\nEl impacto depende de la vulnerabilidad específica en el componente de código abierto, pero puede variar desde la divulgación de información hasta la Ejecución Remota de Código completa.',
        recommendations_en: `#### Short-Term Recommendations
Update all vulnerable dependencies to the latest secure version.
#### Medium-Term Recommendations
Implement a Software Composition Analysis (SCA) tool (like \`npm audit\`, Snyk, or Dependabot) to automatically scan for and alert on vulnerable dependencies.
#### Long-Term Recommendations
Establish a process for regularly reviewing and updating all third-party libraries. Have a plan in place for responding to newly disclosed vulnerabilities in your dependencies.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Actualizar todas las dependencias vulnerables a la última versión segura.
#### Recomendaciones a Medio Plazo
Implementar una herramienta de Análisis de Composición de Software (SCA) (como \`npm audit\`, Snyk, o Dependabot) para escanear y alertar automáticamente sobre dependencias vulnerables.
#### Recomendaciones a Largo Plazo
Establecer un proceso para revisar y actualizar regularmente todas las bibliotecas de terceros. Tener un plan para responder a las vulnerabilidades recién divulgadas en sus dependencias.`,
        cwe: 'CWE-1104',
        severity: 'High',
        cvss: { score: 8.8, vectorString: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H', attackVector: 'N', attackComplexity: 'L', privilegesRequired: 'L', userInteraction: 'N', scope: 'U', confidentiality: 'H', integrity: 'H', availability: 'H' },
        references: ['https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/'],
        tags: ['Additional'],
        affectedComponents_en: '### Affected Components\n- [TODO: List the vulnerable library and its version.]',
        details_en: '### Proof of Concept\n[TODO: Provide a link to the public CVE and, if possible, demonstrate the exploit.]',
        affectedComponents_es: '### Componentes Afectados\n- [TODO: Listar la biblioteca vulnerable y su versión.]',
        details_es: '### Prueba de Concepto\n[TODO: Proporcionar un enlace al CVE público y, si es posible, demostrar el exploit.]',
        immediateActions_en: "### Immediate Actions\nUpdate the vulnerable components to a patched version immediately.",
        immediateActions_es: "### Acciones Inmediatas\nActualizar inmediatamente los componentes vulnerables a una versión parcheada.",
    },
    {
        id: 'vuln-add-008',
        title_en: 'Insecure Direct Object References (IDOR)',
        title_es: 'Referencias Directas a Objetos Inseguras (IDOR)',
        overview_en: '### Overview\nIDOR is a type of access control vulnerability where an attacker can simply change a parameter value that directly refers to a system object (like a database key) to access unauthorized data.',
        overview_es: '### Resumen\nIDOR es un tipo de vulnerabilidad de control de acceso donde un atacante puede simplemente cambiar el valor de un parámetro que se refiere directamente a un objeto del sistema (como una clave de base de datos) para acceder a datos no autorizados.',
        technicalDescription_en: '### Technical Description\nThe application uses a user-supplied identifier to retrieve an object (e.g., `.../invoices?id=123`). The application fails to verify that the logged-in user is authorized to access object `123`. An attacker can change the `id` parameter to `124` to access another user\'s invoice.',
        technicalDescription_es: '### Descripción Técnica\nLa aplicación utiliza un identificador proporcionado por el usuario para recuperar un objeto (p. ej., `.../facturas?id=123`). La aplicación no verifica que el usuario que ha iniciado sesión esté autorizado para acceder al objeto `123`. Un atacante puede cambiar el parámetro `id` a `124` para acceder a la factura de otro usuario.',
        impact_en: '### Impact\nAllows attackers to bypass authorization and access or modify data belonging to other users.',
        impact_es: '### Impacto\nPermite a los atacantes eludir la autorización y acceder o modificar datos pertenecientes a otros usuarios.',
        recommendations_en: `#### Short-Term Recommendations
For every request that accesses a private object, verify that the logged-in user is authorized to access that specific object.
#### Medium-Term Recommendations
Avoid using direct object references in URLs. Use indirect references per user or session, or use unpredictable, random identifiers (GUIDs).
#### Long-Term Recommendations
Implement a centralized access control mechanism that performs these checks automatically.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Para cada solicitud que acceda a un objeto privado, verificar que el usuario que ha iniciado sesión esté autorizado para acceder a ese objeto específico.
#### Recomendaciones a Medio Plazo
Evitar el uso de referencias directas a objetos en las URL. Usar referencias indirectas por usuario o sesión, o usar identificadores impredecibles y aleatorios (GUID).
#### Recomendaciones a Largo Plazo
Implementar un mecanismo de control de acceso centralizado que realice estas comprobaciones automáticamente.`,
        cwe: 'CWE-639',
        severity: 'High',
        cvss: { score: 8.1, vectorString: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N', attackVector: 'N', attackComplexity: 'L', privilegesRequired: 'L', userInteraction: 'N', scope: 'U', confidentiality: 'H', integrity: 'H', availability: 'N' },
        references: ['https://owasp.org/Top10/A01_2021-Broken_Access_Control/'],
        tags: ['Additional'],
        affectedComponents_en: '### Affected Components\n- [TODO: Specify the vulnerable URL and the ID parameter.]',
        details_en: '### Proof of Concept\n[TODO: Provide two sets of credentials. Log in as user A, access their resource, then change the ID in the URL to one belonging to user B and show that access is granted.]',
        affectedComponents_es: '### Componentes Afectados\n- [TODO: Especificar la URL vulnerable y el parámetro de ID.]',
        details_es: '### Prueba de Concepto\n[TODO: Proporcionar dos conjuntos de credenciales. Iniciar sesión como usuario A, acceder a su recurso, luego cambiar el ID en la URL por uno que pertenezca al usuario B y mostrar que se concede el acceso.]',
        immediateActions_en: "### Immediate Actions\nImplement server-side authorization checks for all functions that access objects based on user input.",
        immediateActions_es: "### Acciones Inmediatas\nImplementar comprobaciones de autorización del lado del servidor para todas las funciones que acceden a objetos basados en la entrada del usuario.",
    },
    {
        id: 'vuln-add-009',
        title_en: 'Missing Security Headers',
        title_es: 'Cabeceras de Seguridad Faltantes',
        overview_en: '### Overview\nThe application is missing key HTTP security headers, which leaves it vulnerable to a variety of attacks, such as clickjacking and cross-site scripting.',
        overview_es: '### Resumen\nLa aplicación carece de encabezados de seguridad HTTP clave, lo que la deja vulnerable a una variedad de ataques, como el secuestro de clics y el cross-site scripting.',
        technicalDescription_en: '### Technical Description\nThe server\'s HTTP responses do not include important security headers like `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`, or `Referrer-Policy`.',
        technicalDescription_es: '### Descripción Técnica\nLas responses HTTP del servidor no incluyen encabezados de seguridad importantes como `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options` o `Referrer-Policy`.',
        impact_en: '### Impact\nThe absence of these headers makes the application more susceptible to various client-side attacks, reduces the overall security posture, and may fail compliance checks.',
        impact_es: '### Impacto\nLa ausencia de estos encabezados hace que la aplicación sea más susceptible a varios ataques del lado del cliente, reduce la postura de seguridad general y puede no pasar las comprobaciones de cumplimiento.',
        recommendations_en: `#### Short-Term Recommendations
Set the \`X-Frame-Options\` HTTP header to \`DENY\` or \`SAMEORIGIN\`.
#### Medium-Term Recommendations
Implement a strong \`Content-Security-Policy\` (CSP) with the \`frame-ancestors\` directive (e.g., \`frame-ancestors 'self';\`).
#### Long-Term Recommendations
In addition to headers, use "frame-busting" scripts as a defense-in-depth measure, although this is less reliable than headers.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Establecer el encabezado HTTP \`X-Frame-Options\` en \`DENY\` o \`SAMEORIGIN\`.
#### Recomendaciones a Medio Plazo
Implementar una política de seguridad de contenido (CSP) sólida con la directiva \`frame-ancestors\` (p. ej., \`frame-ancestors 'self';\`).
#### Recomendaciones a Largo Plazo
Además de los encabezados, usar scripts "frame-busting" como una medida de defensa en profundidad, aunque esto es menos fiable que los encabezados.`,
        cwe: 'CWE-693',
        severity: 'Medium',
        cvss: { score: 6.1, vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N', attackVector: 'N', attackComplexity: 'L', privilegesRequired: 'N', userInteraction: 'R', scope: 'C', confidentiality: 'L', integrity: 'L', availability: 'N' },
        references: ['https://owasp.org/www-project-secure-headers/'],
        tags: ['Additional'],
        affectedComponents_en: '### Affected Components\n- All HTTP responses from the application server.',
        details_en: '### Proof of Concept\n[TODO: Provide a screenshot of the HTTP response headers showing the absence of recommended security headers.]',
        affectedComponents_es: '### Componentes Afectados\n- Todas las responses HTTP del servidor de aplicaciones.]',
        details_es: '### Prueba de Concepto\n[TODO: Proporcionar una captura de pantalla de las herramientas de desarrollador del navegador que muestre los atributos de la cookie, o la falta de ellos.]',
        immediateActions_en: "### Immediate Actions\nAdd the recommended security headers to all HTTP responses from the server.",
        immediateActions_es: "### Acciones Inmediatas\nAñadir los encabezados de seguridad recomendados a todas las responses HTTP del servidor.",
    },
    {
        id: 'vuln-add-010',
        title_en: 'Clickjacking',
        title_es: 'Secuestro de Clics',
        overview_en: '### Overview\nClickjacking is an attack where an attacker tricks a user into clicking on something different from what the user perceives, potentially revealing confidential information or taking control of their computer while clicking on seemingly innocuous web pages.',
        overview_es: '### Resumen\nEl secuestro de clics es un ataque en el que un atacante engaña a un usuario para que haga clic en algo diferente de lo que el usuario percibe, revelando potencialmente información confidencial o tomando el control de su computadora mientras hace clic en páginas web aparentemente inocuas.',
        technicalDescription_en: '### Technical Description\nThe attacker uses a transparent `<iframe>` to overlay a legitimate, invisible webpage on top of a visible, decoy webpage. When the user clicks on the decoy page (e.g., a "Win a prize" button), they are actually clicking on a button on the invisible page (e.g., a "Delete account" button).',
        technicalDescription_es: '### Descripción Técnica\nEl atacante utiliza un `<iframe>` transparente para superponer una página web legítima e invisible sobre una página web visible de señuelo. Cuando el usuario hace clic en la página de señuelo (p. ej., un botón de "Gana un premio"), en realidad está haciendo clic en un botón de la página invisible (p. ej., un botón de "Eliminar cuenta").',
        impact_en: '### Impact\nCan be used to perform unauthorized actions on behalf of the user, such as changing permissions, deleting data, or making purchases.',
        impact_es: '### Impacto\nPuede ser utilizado para realizar acciones no autorizadas en nombre del usuario, como cambiar permisos, eliminar datos o realizar compras.',
        recommendations_en: `#### Short-Term Recommendations
Set the \`X-Frame-Options\` HTTP header to \`DENY\` or \`SAMEORIGIN\`.
#### Medium-Term Recommendations
Implement a strong \`Content-Security-Policy\` (CSP) with the \`frame-ancestors\` directive (e.g., \`frame-ancestors 'self';\`).
#### Long-Term Recommendations
In addition to headers, use "frame-busting" scripts as a defense-in-depth measure, although this is less reliable than headers.`,
        recommendations_es: `#### Recomendaciones a Corto Plazo
Establecer el encabezado HTTP \`X-Frame-Options\` en \`DENY\` o \`SAMEORIGIN\`.
#### Recomendaciones a Medio Plazo
Implementar una política de seguridad de contenido (CSP) sólida con la directiva \`frame-ancestors\` (p. ej., \`frame-ancestors 'self';\`).
#### Recomendaciones a Largo Plazo
Además de los encabezados, usar scripts "frame-busting" como una medida de defensa en profundidad, aunque esto es menos fiable que los encabezados.`,
        cwe: 'CWE-1021',
        severity: 'Medium',
        cvss: { score: 5.4, vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:N', attackVector: 'N', attackComplexity: 'L', privilegesRequired: 'N', userInteraction: 'R', scope: 'U', confidentiality: 'L', integrity: 'L', availability: 'N' },
        references: ['https://owasp.org/www-community/attacks/Clickjacking'],
        tags: ['Additional'],
        affectedComponents_en: '### Affected Components\n- All pages on the web application that do not have framing protection.',
        details_en: '### Proof of Concept\n[TODO: Provide an HTML page with an `<iframe>` that loads the vulnerable application and demonstrates a clickjacking attack.]',
        affectedComponents_es: '### Componentes Afectados\n- Todas las páginas de la aplicación web que no tienen protección contra enmarcado.]',
        details_es: '### Prueba de Concepto\n[TODO: Proporcionar una página HTML con un `<iframe>` que cargue la aplicación vulnerable y demuestre un ataque de secuestro de clics.]',
        immediateActions_en: "### Immediate Actions\nImplement the `X-Frame-Options` or `Content-Security-Policy: frame-ancestors` header to prevent the site from being framed.",
        immediateActions_es: "### Acciones Inmediatas\nImplementar el encabezado `X-Frame-Options` o `Content-Security-Policy: frame-ancestors` para evitar que el sitio sea enmarcado.",
    }
]
    

    

    

