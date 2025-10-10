import type { Vulnerability } from './types';

const emptyVulnBoilerplate = {
  technicalDescription_en: `### Technical Description
  
  [TODO: Add detailed technical description of the vulnerability in English]`,
  affectedComponents_en: `### Affected Components
  
  - [TODO: List affected components, URLs, parameters, etc.]`,
  impact_en: `### Impact
  
  [TODO: Describe the business and technical impact of the vulnerability in English]`,
  details_en: `### Proof of Concept
  
  [TODO: Provide a detailed PoC, including steps, code snippets, and screenshots in English]`,
  technicalDescription_es: `### Descripción Técnica
  
  [TODO: Añadir descripción técnica detallada de la vulnerabilidad en español]`,
  affectedComponents_es: `### Componentes Afectados
  
  - [TODO: Listar componentes afectados, URLs, parámetros, etc.]`,
  impact_es: `### Impacto
  
  [TODO: Describir el impacto técnico y de negocio de la vulnerabilidad en español]`,
  details_es: `### Prueba de Concepto
  
  [TODO: Proporcionar una PoC detallada, incluyendo pasos, fragmentos de código y capturas de pantalla en español]`,
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

export const initialVulnerabilities: Vulnerability[] = [
    // --- WEB VULNERABILITIES ---
    {
        id: "vuln-web-001",
        title_en: "SQL Injection",
        title_es: "Inyección SQL",
        overview_en: "### Overview\nSQL Injection is a web security vulnerability that allows an attacker to interfere with the queries that an application makes to its database. It generally allows an attacker to view data that they are not normally able to retrieve, and sometimes modify or delete this data, causing persistent changes to the application's content or behavior.",
        overview_es: "### Resumen\nLa inyección SQL es una vulnerabilidad de seguridad web que permite a un atacante interferir con las consultas que una aplicación hace a su base de datos. Generalmente, permite a un atacante ver datos que normalmente no podría recuperar, y a veces modificar o eliminar estos datos, causando cambios persistentes en el contenido o comportamiento de la aplicación.",
        cwe: "CWE-89",
        severity: "Critical",
        cvss: { score: 9.8, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "N", scope: "U", confidentiality: "H", integrity: "H", availability: "H" },
        references: ["https://owasp.org/www-community/attacks/SQL_Injection"],
        tags: ["Web"],
        technicalDescription_en: `### Technical Description
The vulnerability occurs when user-supplied input is not properly sanitized or validated and is directly embedded into an SQL query. An attacker can supply crafted input that changes the structure of the original query. For example, by injecting logical SQL expressions like \`' OR '1'='1'\`, an attacker can bypass authentication or retrieve sensitive information.`,
        technicalDescription_es: `### Descripción Técnica
La vulnerabilidad ocurre cuando la entrada proporcionada por el usuario no se sanea o valida correctamente y se incrusta directamente en una consulta SQL. Un atacante puede proporcionar una entrada manipulada que cambia la estructura de la consulta original. Por ejemplo, al inyectar expresiones lógicas de SQL como \`' OR '1'='1'\`, un atacante puede eludir la autenticación o recuperar información sensible.`,
        impact_en: `### Impact
Successful exploitation can lead to unauthorized access to sensitive data, such as passwords, credit card details, or personal user information. In many cases, an attacker can modify or delete this data, causing data integrity issues. Depending on the database privileges, it could also allow the attacker to execute commands on the underlying operating system, leading to a full system compromise.`,
        impact_es: `### Impacto
La explotación exitosa puede conducir al acceso no autorizado a datos sensibles, como contraseñas, detalles de tarjetas de crédito o información personal de los usuarios. En muchos casos, un atacante puede modificar o eliminar estos datos, causando problemas de integridad. Dependiendo de los privilegios de la base de datos, también podría permitir al atacante ejecutar comandos en el sistema operativo subyacente, lo que llevaría a un compromiso total del sistema.`,
        remediation_en: {
            shortTerm: "Implement input validation and sanitization on all user-supplied data as an immediate, temporary fix. Use a Web Application Firewall (WAF) with rules to detect and block common SQLi patterns.",
            mediumTerm: "Refactor all database queries to use parameterized queries (also known as prepared statements). This is the most effective defense against SQLi as it separates the query logic from the data.",
            longTerm: "Conduct regular security training for developers on secure coding practices. Implement static (SAST) and dynamic (DAST) application security testing into the CI/CD pipeline to proactively identify and fix vulnerabilities."
        },
        remediation_es: {
            shortTerm: "Implementar validación y saneamiento de entradas en todos los datos proporcionados por el usuario como una solución inmediata y temporal. Usar un Web Application Firewall (WAF) con reglas para detectar y bloquear patrones comunes de SQLi.",
            mediumTerm: "Refactorizar todas las consultas a la base de datos para usar consultas parametrizadas (también conocidas como prepared statements). Esta es la defensa más efectiva contra SQLi ya que separa la lógica de la consulta de los datos.",
            longTerm: "Realizar capacitaciones de seguridad periódicas para los desarrolladores sobre prácticas de codificación segura. Implementar pruebas de seguridad de aplicaciones estáticas (SAST) y dinámicas (DAST) en el pipeline de CI/CD para identificar y corregir vulnerabilidades de forma proactiva."
        },
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
        title_es: "Cross-Site Scripting (XSS)",
        overview_en: "### Overview\nCross-Site Scripting (XSS) allows attackers to inject malicious client-side scripts into web pages viewed by other users. This vulnerability can be used to bypass access controls, steal user sessions, or spread malware.",
        overview_es: "### Resumen\nCross-Site Scripting (XSS) permite a los atacantes inyectar scripts maliciosos del lado del cliente en páginas web vistas por otros usuarios. Esta vulnerabilidad puede ser utilizada para eludir controles de acceso, robar sesiones de usuario o propagar malware.",
        cwe: "CWE-79",
        severity: "High",
        cvss: { score: 7.5, vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:H/I:N/A:N", attackVector: "N", attackComplexity: "L", privilegesRequired: "N", userInteraction: "R", scope: "C", confidentiality: "H", integrity: "N", availability: "N" },
        references: ["https://owasp.org/www-community/attacks/xss/"],
        tags: ["Web"],
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
        affectedComponents_en: `### Affected Components
- [TODO: List affected components, URLs, parameters, etc.]`,
        details_en: `### Proof of Concept
[TODO: Provide a detailed PoC, including steps, code snippets, and screenshots in English]`,
        affectedComponents_es: `### Componentes Afectados
- [TODO: Listar componentes afectados, URLs, parámetros, etc.]`,
        details_es: `### Prueba de Concepto
[TODO: Proporcionar una PoC detallada, incluyendo pasos, fragmentos de código y capturas de pantalla en español]`,
    },
    // ... more vulnerabilities will be added here
];
