import type { ProjectTemplate } from './types';
import { format } from 'date-fns';

// Plantillas de proyecto.
// Convenciones:
//  - Markdown puro (sin <span style=...> ni <br>): react-markdown no admite
//    HTML inline y se vería como texto.
//  - Jerarquía: H1 secciones principales, H2 subsecciones, H3 detalles.
//  - Cada heading va seguido siempre de contenido (evita secciones vacías al
//    parsearse por el editor con maxHeadingLevel:2).
//  - Tablas de clasificación usan emojis para indicar severidad sin HTML.
//  - Variables disponibles: {{client.name}}, {{project.startDate}},
//    {{project.endDate}}, {{assessment.window}}, {{pentester.*}},
//    {{findings.count|critical|high|medium|low|informational}}.
//  - Marcador {{findings.table}} se reemplaza por la tabla viva de hallazgos
//    al renderizar el reporte.

const SEVERITY_TABLE_EN = `| Severity | CVSS v3.1 | Description |
|---|---|---|
| 🔴 Critical | 9.0 – 10.0 | Vulnerabilities that lead to immediate system compromise. |
| 🟠 High | 7.0 – 8.9 | Vulnerabilities that grant an attacker unauthorized access. |
| 🟡 Medium | 4.0 – 6.9 | Weaknesses that can expose sensitive information. |
| 🔵 Low | 0.1 – 3.9 | Minor issues that reduce the overall security posture. |
| ⚪ Informational | 0.0 | Observations and hardening recommendations. |`;

const SEVERITY_TABLE_ES = `| Severidad | CVSS v3.1 | Descripción |
|---|---|---|
| 🔴 Crítica | 9.0 – 10.0 | Vulnerabilidades que comprometen el sistema inmediatamente. |
| 🟠 Alta | 7.0 – 8.9 | Vulnerabilidades que permiten acceso no autorizado. |
| 🟡 Media | 4.0 – 6.9 | Debilidades que pueden exponer información sensible. |
| 🔵 Baja | 0.1 – 3.9 | Problemas menores que reducen la postura de seguridad. |
| ⚪ Informativa | 0.0 | Observaciones y recomendaciones de fortificación. |`;

export const initialProjectTemplates: ProjectTemplate[] = [
  {
    id: 'ptpl-1',
    name_en: 'Standard Web App Pentest',
    name_es: 'Pentest Estándar de Aplicación Web',
    description_en: 'A comprehensive security assessment for web applications, covering OWASP Top 10 and other common vulnerabilities.',
    description_es: 'Una evaluación de seguridad completa para aplicaciones web, cubriendo el OWASP Top 10 y otras vulnerabilidades comunes.',
    icon: 'Scan',
    scope_en: `# Executive Summary

This report outlines the results of a penetration test performed on the internet-facing assets of **{{client.name}}**. The assessment aimed to identify vulnerabilities that could be exploited by a remote attacker to compromise the security of the organization's perimeter.

The engagement ran from **{{project.startDate}}** to **{{project.endDate}}** and was conducted from the perspective of an unauthenticated external attacker (black-box).

# Scope

The following assets were in-scope for the assessment:

- **Web applications:** [TODO: Add target hostnames or URLs]
- **External network:** [TODO: Add IP ranges in scope]
- **Out of scope:** [TODO: Add anything that must not be tested]

# Methodology

The engagement followed a standard offensive workflow:

1. **Reconnaissance.** Subdomains, exposed services and technologies were enumerated.
2. **Vulnerability identification.** Automated scanners and manual review were combined to detect weaknesses.
3. **Exploitation.** Every relevant finding was validated manually to confirm impact and avoid false positives.
4. **Post-exploitation.** Where applicable, paths for lateral movement and data exfiltration were explored.
5. **Reporting.** Findings were documented with reproducible evidence and remediation guidance.

# Findings Summary

The following table is generated automatically from the findings registered in the project. Add, edit or remove findings to update it.

{{findings.table}}

# Findings Classification

${SEVERITY_TABLE_EN}

# Attack Narrative

[TODO: High level summary of the attack path and key findings.]
`,
    appendix_en: `# Appendix

A combination of automated tools and manual techniques was used:

- **Proxy:** Burp Suite Professional
- **Scanners:** Nessus, Nuclei
- **Reconnaissance:** Amass, Subfinder, Httpx
`,
    scope_es: `# Resumen Ejecutivo

Este informe describe los resultados de una prueba de penetración realizada sobre los activos de **{{client.name}}** expuestos a Internet. La evaluación tuvo como objetivo identificar vulnerabilidades que un atacante remoto podría explotar para comprometer el perímetro de la organización.

La evaluación se realizó entre el **{{project.startDate}}** y el **{{project.endDate}}** desde la perspectiva de un atacante externo no autenticado (caja negra).

# Alcance

Los siguientes activos forman parte del alcance del proyecto:

- **Aplicaciones web:** [TODO: Añadir hostnames o URLs objetivo]
- **Red externa:** [TODO: Añadir rangos IP en alcance]
- **Fuera de alcance:** [TODO: Añadir lo que no debe probarse]

# Metodología

La evaluación siguió un flujo ofensivo estándar:

1. **Reconocimiento.** Se enumeraron subdominios, servicios expuestos y tecnologías.
2. **Identificación de vulnerabilidades.** Se combinaron escáneres automáticos y revisión manual.
3. **Explotación.** Cada hallazgo relevante se validó manualmente para confirmar impacto y evitar falsos positivos.
4. **Post-explotación.** Cuando aplica, se exploraron vías de movimiento lateral y exfiltración.
5. **Reporte.** Los hallazgos se documentan con evidencias reproducibles y guía de remediación.

# Resumen de Hallazgos

La siguiente tabla se genera automáticamente con los hallazgos registrados en el proyecto. Añade, edita o elimina hallazgos para actualizarla.

{{findings.table}}

# Clasificación de Hallazgos

${SEVERITY_TABLE_ES}

# Narrativa del Ataque

[TODO: Resumen de alto nivel de la ruta de ataque y los hallazgos clave.]
`,
    appendix_es: `# Apéndice

Se utilizó una combinación de herramientas automatizadas y técnicas manuales:

- **Proxy:** Burp Suite Professional
- **Escáneres:** Nessus, Nuclei
- **Reconocimiento:** Amass, Subfinder, Httpx
`,
  },
  {
    id: 'ptpl-2',
    name_en: 'Internal Network Assessment',
    name_es: 'Evaluación de Red Interna',
    description_en: 'An assessment of the internal network to identify misconfigurations, vulnerable services, and pathways for lateral movement.',
    description_es: 'Una evaluación de la red interna para identificar configuraciones incorrectas, servicios vulnerables y vías para el movimiento lateral.',
    icon: 'Network',
    scope_en: `# Executive Summary

This report summarises the internal network assessment performed for **{{client.name}}** between **{{project.startDate}}** and **{{project.endDate}}**. The assessment simulates an attacker who has gained an initial foothold inside the corporate network.

# Scope

- **IP ranges:** [TODO: Add IP ranges, e.g. 10.0.0.0/8]
- **Active Directory domains:** [TODO: Add domain FQDNs]
- **Assumptions:** Compromised standard workstation, no domain credentials.
- **Out of scope:** [TODO: Systems or segments that must be excluded]

# Methodology

1. **Network discovery** with Nmap and Masscan.
2. **Service enumeration** of SMB, LDAP, Kerberos and management protocols.
3. **Active Directory mapping** using BloodHound and SharpHound collectors.
4. **Credential access** through relay, password spraying and ticket attacks.
5. **Lateral movement** with Impacket and CrackMapExec.
6. **Reporting** of findings, paths and remediation actions.

# Findings Summary

{{findings.table}}
`,
    appendix_en: `# Appendix

- **Network scanners:** Nmap, Masscan
- **Vulnerability scanners:** Nessus
- **Active Directory tooling:** BloodHound, SharpHound, Impacket, Kerbrute
- **Manual exploitation:** Metasploit, CrackMapExec, NetExec
`,
    scope_es: `# Resumen Ejecutivo

Este informe resume la evaluación de red interna realizada para **{{client.name}}** entre el **{{project.startDate}}** y el **{{project.endDate}}**. La evaluación simula a un atacante con un punto de apoyo inicial dentro de la red corporativa.

# Alcance

- **Rangos IP:** [TODO: Añadir rangos IP, p.ej. 10.0.0.0/8]
- **Dominios Active Directory:** [TODO: Añadir FQDNs]
- **Supuestos:** Estación de trabajo comprometida sin credenciales de dominio.
- **Fuera de alcance:** [TODO: Sistemas o segmentos excluidos]

# Metodología

1. **Descubrimiento de red** con Nmap y Masscan.
2. **Enumeración de servicios** SMB, LDAP, Kerberos y protocolos de gestión.
3. **Mapeo de Active Directory** con BloodHound y SharpHound.
4. **Obtención de credenciales** mediante relay, password spraying y ataques sobre tickets.
5. **Movimiento lateral** con Impacket y CrackMapExec.
6. **Reporte** de hallazgos, rutas y acciones de remediación.

# Resumen de Hallazgos

{{findings.table}}
`,
    appendix_es: `# Apéndice

- **Escáneres de red:** Nmap, Masscan
- **Escáneres de vulnerabilidades:** Nessus
- **Herramientas Active Directory:** BloodHound, SharpHound, Impacket, Kerbrute
- **Explotación manual:** Metasploit, CrackMapExec, NetExec
`,
  },
  {
    id: 'ptpl-3',
    name_en: 'Mobile App Pentest (iOS/Android)',
    name_es: 'Pentest de Aplicación Móvil (iOS/Android)',
    description_en: 'A security assessment of an iOS or Android mobile application, focusing on client-side vulnerabilities and backend API security.',
    description_es: 'Una evaluación de seguridad de una aplicación móvil de iOS o Android, centrada en vulnerabilidades del lado del cliente y seguridad de la API de backend.',
    icon: 'Smartphone',
    scope_en: `# Executive Summary

This report documents the security assessment of the mobile application of **{{client.name}}**. The evaluation covered the client-side application, local data storage and the backend APIs consumed by the app.

The assessment was performed between **{{project.startDate}}** and **{{project.endDate}}**.

# Scope

- **Application:** [TODO: Add application name and package/bundle ID]
- **Platform:** iOS / Android
- **Backend APIs:** [TODO: List backend endpoints in scope]
- **Out of scope:** [TODO: Third-party SDKs, external integrations, etc.]

# Methodology

1. **Static analysis** of the application package (MobSF, jadx, Hopper).
2. **Dynamic analysis** with a rooted/jailbroken device, Frida and Objection.
3. **Network analysis** with Burp Suite to inspect API traffic.
4. **Local storage review** (keychain, shared preferences, SQLite, files).
5. **Authentication & authorization tests** on the backend.
6. **Reporting** with proof of concept and remediation guidance.

# Findings Summary

{{findings.table}}
`,
    appendix_en: `# Appendix

- **Static analysis:** MobSF, jadx, Hopper
- **Dynamic analysis:** Burp Suite, Frida, Objection
- **Test devices:** Google Pixel 6 (rooted), iPhone 12 (jailbroken)
`,
    scope_es: `# Resumen Ejecutivo

Este informe documenta la evaluación de seguridad de la aplicación móvil de **{{client.name}}**. La revisión cubrió la aplicación cliente, el almacenamiento local de datos y las APIs de backend consumidas.

La evaluación se realizó entre el **{{project.startDate}}** y el **{{project.endDate}}**.

# Alcance

- **Aplicación:** [TODO: Añadir nombre de la aplicación y package/bundle ID]
- **Plataforma:** iOS / Android
- **APIs de backend:** [TODO: Listar endpoints en alcance]
- **Fuera de alcance:** [TODO: SDKs de terceros, integraciones externas, etc.]

# Metodología

1. **Análisis estático** del paquete de la aplicación (MobSF, jadx, Hopper).
2. **Análisis dinámico** con dispositivo rooteado/jailbroken, Frida y Objection.
3. **Análisis de red** con Burp Suite para inspeccionar el tráfico de la API.
4. **Revisión del almacenamiento local** (keychain, shared preferences, SQLite, ficheros).
5. **Pruebas de autenticación y autorización** sobre el backend.
6. **Reporte** con pruebas de concepto y guía de remediación.

# Resumen de Hallazgos

{{findings.table}}
`,
    appendix_es: `# Apéndice

- **Análisis estático:** MobSF, jadx, Hopper
- **Análisis dinámico:** Burp Suite, Frida, Objection
- **Dispositivos de prueba:** Google Pixel 6 (rooteado), iPhone 12 (con jailbreak)
`,
  },
  {
    id: 'ptpl-4',
    name_en: 'Certification Report',
    name_es: 'Informe de Certificación',
    description_en: 'Certification exam report mirroring the official HTB CPTS SysReptor design: executive summary, approach, scope, assessment overview, network pentest summary, compromise walkthrough, remediation summary and appendices (host/service discovery, exploited hosts, compromised users, flags).',
    description_es: 'Informe de examen de certificación que replica el design oficial HTB CPTS de SysReptor: resumen ejecutivo, enfoque, alcance, visión general, resumen del pentest de red, walkthrough de compromiso, resumen de remediación y apéndices (descubrimiento de hosts/servicios, hosts explotados, usuarios comprometidos, flags).',
    icon: 'Award',
    scope_en: `# Executive Summary

{{client.name}} contracted {{pentester.name}} to perform a penetration test of {{client.name}}'s network to identify security weaknesses, determine the impact to {{client.name}}, document all findings in a clear and repeatable manner, and provide remediation recommendations.

This report is submitted as part of the **[TODO: Certification Name]** certification exam and documents the assessment methodology, the attack path taken to compromise the target environment, and the findings identified along the way.

# Approach

{{pentester.name}} performed testing under a **[TODO: Black Box / Grey Box / White Box]** approach from {{project.startDate}} to {{project.endDate}} without advance knowledge of {{client.name}}'s environment, with the goal of identifying unknown weaknesses. Testing was performed from a non-evasive standpoint with the goal of uncovering as many misconfigurations and vulnerabilities as possible.

Each weakness identified was documented and manually investigated to determine exploitation possibilities and escalation potential. {{pentester.name}} sought to demonstrate the full impact of every vulnerability, up to and including full domain compromise. Where a foothold was obtained, further testing including lateral movement and horizontal and vertical privilege escalation was performed to demonstrate the impact of an internal network compromise.

# Scope

The scope of this assessment was the target network range(s) assigned for the exam and any hosts or Active Directory domains discovered to be in scope during testing.

## In Scope Assets

| Host / URL / IP Address | Description |
|:---|:---|
| [TODO: 10.129.X.X] | [TODO: External target] |
| [TODO: 172.16.X.0/24] | [TODO: Internal network range] |
| [TODO: domain.local] | [TODO: Active Directory domain] |

# Assessment Overview and Recommendations

During the penetration test against {{client.name}}, {{pentester.name}} identified {{vulnerabilities.count}} findings that threaten the confidentiality, integrity, and availability of {{client.name}}'s information systems. The findings were categorized by severity level: {{vulnerabilities.critical}} critical, {{vulnerabilities.high}} high, {{vulnerabilities.medium}} medium, {{vulnerabilities.low}} low, and {{vulnerabilities.informational}} informational.

[TODO: Executive-level narrative summarizing the overall security posture, the most significant risks, and their business impact.]

{{client.name}} should create a remediation plan based on the Remediation Summary section of this report, addressing all critical and high findings as soon as possible according to the needs of the business. {{client.name}} should also consider performing periodic vulnerability assessments if they are not already being performed.

# Network Penetration Test Assessment Summary

This section summarizes the testing perspective and the findings identified during the network penetration test.

## Network Summary

{{pentester.name}} began all testing activities from the perspective of an unauthenticated user on the network. {{client.name}} provided network ranges but did not provide additional information such as operating system, credentials, or configuration details.

## Summary of Findings

During the course of testing, {{pentester.name}} uncovered a total of {{vulnerabilities.count}} findings that pose a material risk to {{client.name}}'s information systems. Informational findings are observations for areas of improvement and do not represent security vulnerabilities on their own. The table below summarizes the findings; full technical details for each are provided in the Findings section.

{{findings.table}}

# Internal Network Compromise Walkthrough

This section describes the end-to-end attack path used to compromise the environment.

## Walkthrough Summary

During the assessment {{pentester.name}} was able to gain a foothold, move laterally, and compromise the environment, leading to full administrative control over the [TODO: domain.local] domain. The steps below demonstrate the path taken from initial access to compromise and do not include every vulnerability discovered. Issues not used as part of the path to compromise are listed as standalone findings in the Findings section, ranked by severity.

## Detailed Walkthrough

{{pentester.name}} performed the following to fully compromise the [TODO: domain.local] domain:

1. [TODO: High-level step 1]
2. [TODO: High-level step 2]
3. [TODO: High-level step 3]

**Detailed reproduction steps:**

[TODO: Fill in the detailed attack chain with commands, screenshots, and evidence for each step above.]

# Remediation Summary

As a result of this assessment there are several opportunities for {{client.name}} to strengthen its network security. Remediation efforts are prioritized below, starting with those that will likely take the least amount of time and effort to complete. All remediation steps should be carefully planned and tested to prevent service disruption or data loss.

## Short Term

- [TODO: Finding reference] - [TODO: Short-term remediation action]
- [TODO: Finding reference] - [TODO: Short-term remediation action]

## Medium Term

- [TODO: Finding reference] - [TODO: Medium-term remediation action]
- [TODO: Finding reference] - [TODO: Medium-term remediation action]

## Long Term

- Perform ongoing internal network vulnerability assessments and password audits.
- Perform periodic Active Directory security assessments.
- Educate systems, network administrators, and developers on security hardening best practices.
- Enhance network segmentation to isolate critical hosts and limit the effect of an internal compromise.
- [TODO: Additional long-term recommendation]
`,
    appendix_en: `# Appendix

The following supporting information was collected during the assessment.

## Finding Severities

Each finding is assigned a severity rating of critical, high, medium, low, or informational. The rating is based on the priority with which each finding should be addressed and the potential impact each has on the confidentiality, integrity, and availability of {{client.name}}'s data.

| Rating | CVSS Score Range |
|:---|:---|
| Critical | 9.0 – 10.0 |
| High | 7.0 – 8.9 |
| Medium | 4.0 – 6.9 |
| Low | 0.1 – 3.9 |
| Informational | 0.0 |

## Host and Service Discovery

| IP Address | Port | Service | Notes |
|:---|:---|:---|:---|
| [TODO: IP] | [TODO: Port] | [TODO: Service] | [TODO: Notes] |

## Subdomain Discovery

| URL | Description | Discovery Method |
|:---|:---|:---|
| [TODO: Subdomain or VHost] | [TODO: Description] | [TODO: Method] |

## Exploited Hosts

| Host | Scope | Method | Notes |
|:---|:---|:---|:---|
| [TODO: Host] | [TODO: Scope] | [TODO: Method] | [TODO: Notes] |

## Compromised Users

| Username | Type | Method | Notes |
|:---|:---|:---|:---|
| [TODO: Username] | [TODO: Type] | [TODO: Method] | [TODO: Notes] |

## Changes and Host Cleanup

| Host | Scope | Change or Cleanup Needed |
|:---|:---|:---|
| [TODO: Host] | [TODO: Scope] | [TODO: Change or cleanup performed] |

## Flags Discovered

| Flag # | Host | Flag Value | Flag Location | Method Used |
|:---|:---|:---|:---|:---|
| 1 | [TODO: Hostname] | [TODO: Flag value] | [TODO: Location] | [TODO: Method] |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |
| 5 | | | | |
| 6 | | | | |
| 7 | | | | |
| 8 | | | | |
| 9 | | | | |
| 10 | | | | |
| 11 | | | | |
| 12 | | | | |
| 13 | | | | |
`,
    scope_es: `# Resumen Ejecutivo

{{client.name}} contrató a {{pentester.name}} para realizar una prueba de penetración sobre la red de {{client.name}} con el fin de identificar debilidades de seguridad, determinar su impacto para {{client.name}}, documentar todos los hallazgos de forma clara y reproducible, y proporcionar recomendaciones de remediación.

Este informe se presenta como parte del examen de certificación **[TODO: Nombre de la Certificación]** y documenta la metodología de la evaluación, la cadena de ataque utilizada para comprometer el entorno objetivo y los hallazgos identificados durante el proceso.

# Enfoque

{{pentester.name}} realizó las pruebas bajo un enfoque **[TODO: Caja Negra / Caja Gris / Caja Blanca]** desde {{project.startDate}} hasta {{project.endDate}}, sin conocimiento previo del entorno de {{client.name}}, con el objetivo de identificar debilidades desconocidas. Las pruebas se realizaron de forma no evasiva, buscando descubrir el mayor número posible de configuraciones incorrectas y vulnerabilidades.

Cada debilidad identificada fue documentada e investigada manualmente para determinar las posibilidades de explotación y el potencial de escalada. {{pentester.name}} buscó demostrar el impacto completo de cada vulnerabilidad, hasta el compromiso total del dominio. Cuando se obtuvo un punto de apoyo, se realizaron pruebas adicionales de movimiento lateral y escalada de privilegios horizontal y vertical para demostrar el impacto de un compromiso de la red interna.

# Alcance

El alcance de esta evaluación fueron los rangos de red objetivo asignados para el examen y cualquier host o dominio de Active Directory que se determinara dentro del alcance durante las pruebas.

## Activos en Alcance

| Host / URL / Dirección IP | Descripción |
|:---|:---|
| [TODO: 10.129.X.X] | [TODO: Objetivo externo] |
| [TODO: 172.16.X.0/24] | [TODO: Rango de red interna] |
| [TODO: domain.local] | [TODO: Dominio de Active Directory] |

# Visión General y Recomendaciones

Durante la prueba de penetración contra {{client.name}}, {{pentester.name}} identificó {{vulnerabilities.count}} hallazgos que amenazan la confidencialidad, integridad y disponibilidad de los sistemas de información de {{client.name}}. Los hallazgos se clasificaron por nivel de severidad: {{vulnerabilities.critical}} críticos, {{vulnerabilities.high}} altos, {{vulnerabilities.medium}} medios, {{vulnerabilities.low}} bajos y {{vulnerabilities.informational}} informativos.

[TODO: Narrativa a nivel ejecutivo que resuma la postura de seguridad general, los riesgos más significativos y su impacto de negocio.]

{{client.name}} debería elaborar un plan de remediación basado en la sección Resumen de Remediación de este informe, abordando todos los hallazgos críticos y altos lo antes posible según las necesidades del negocio. {{client.name}} también debería considerar la realización de evaluaciones de vulnerabilidades periódicas si aún no se llevan a cabo.

# Resumen del Pentest de Red

Esta sección resume la perspectiva de las pruebas y los hallazgos identificados durante la prueba de penetración de red.

## Resumen de Red

{{pentester.name}} inició todas las actividades de prueba desde la perspectiva de un usuario no autenticado en la red. {{client.name}} proporcionó los rangos de red pero no información adicional como sistema operativo, credenciales o detalles de configuración.

## Resumen de Hallazgos

Durante las pruebas, {{pentester.name}} descubrió un total de {{vulnerabilities.count}} hallazgos que suponen un riesgo material para los sistemas de información de {{client.name}}. Los hallazgos informativos son observaciones sobre áreas de mejora y no representan vulnerabilidades de seguridad por sí mismos. La siguiente tabla resume los hallazgos; los detalles técnicos completos de cada uno se encuentran en la sección Hallazgos.

{{findings.table}}

# Walkthrough del Compromiso de la Red Interna

Esta sección describe la cadena de ataque completa utilizada para comprometer el entorno.

## Resumen del Walkthrough

Durante la evaluación, {{pentester.name}} logró obtener un punto de apoyo, moverse lateralmente y comprometer el entorno, alcanzando el control administrativo total sobre el dominio [TODO: domain.local]. Los pasos siguientes muestran la ruta seguida desde el acceso inicial hasta el compromiso y no incluyen todas las vulnerabilidades descubiertas. Los problemas no utilizados en la ruta de compromiso se listan como hallazgos independientes en la sección Hallazgos, ordenados por severidad.

## Walkthrough Detallado

{{pentester.name}} realizó lo siguiente para comprometer por completo el dominio [TODO: domain.local]:

1. [TODO: Paso de alto nivel 1]
2. [TODO: Paso de alto nivel 2]
3. [TODO: Paso de alto nivel 3]

**Pasos de reproducción detallados:**

[TODO: Completar la cadena de ataque detallada con comandos, capturas y evidencias de cada paso anterior.]

# Resumen de Remediación

Como resultado de esta evaluación, existen varias oportunidades para que {{client.name}} refuerce la seguridad de su red. Los esfuerzos de remediación se priorizan a continuación, empezando por los que probablemente requieran menos tiempo y esfuerzo. Todos los pasos de remediación deben planificarse y probarse cuidadosamente para evitar interrupciones del servicio o pérdida de datos.

## Corto Plazo

- [TODO: Referencia al hallazgo] - [TODO: Acción de remediación a corto plazo]
- [TODO: Referencia al hallazgo] - [TODO: Acción de remediación a corto plazo]

## Medio Plazo

- [TODO: Referencia al hallazgo] - [TODO: Acción de remediación a medio plazo]
- [TODO: Referencia al hallazgo] - [TODO: Acción de remediación a medio plazo]

## Largo Plazo

- Realizar evaluaciones de vulnerabilidades y auditorías de contraseñas de la red interna de forma continua.
- Realizar evaluaciones periódicas de seguridad de Active Directory.
- Formar a administradores de sistemas y red y a desarrolladores en buenas prácticas de fortificación.
- Mejorar la segmentación de red para aislar hosts críticos y limitar el efecto de un compromiso interno.
- [TODO: Recomendación adicional a largo plazo]
`,
    appendix_es: `# Apéndice

La siguiente información de soporte se recopiló durante la evaluación.

## Severidad de los Hallazgos

A cada hallazgo se le asigna una severidad de crítica, alta, media, baja o informativa. La valoración se basa en la prioridad con la que debe abordarse cada hallazgo y en el impacto potencial sobre la confidencialidad, integridad y disponibilidad de los datos de {{client.name}}.

| Severidad | Rango CVSS |
|:---|:---|
| Crítica | 9.0 – 10.0 |
| Alta | 7.0 – 8.9 |
| Media | 4.0 – 6.9 |
| Baja | 0.1 – 3.9 |
| Informativa | 0.0 |

## Descubrimiento de Hosts y Servicios

| Dirección IP | Puerto | Servicio | Notas |
|:---|:---|:---|:---|
| [TODO: IP] | [TODO: Puerto] | [TODO: Servicio] | [TODO: Notas] |

## Descubrimiento de Subdominios

| URL | Descripción | Método de Descubrimiento |
|:---|:---|:---|
| [TODO: Subdominio o VHost] | [TODO: Descripción] | [TODO: Método] |

## Hosts Explotados

| Host | Alcance | Método | Notas |
|:---|:---|:---|:---|
| [TODO: Host] | [TODO: Alcance] | [TODO: Método] | [TODO: Notas] |

## Usuarios Comprometidos

| Usuario | Tipo | Método | Notas |
|:---|:---|:---|:---|
| [TODO: Usuario] | [TODO: Tipo] | [TODO: Método] | [TODO: Notas] |

## Cambios y Limpieza de Hosts

| Host | Alcance | Cambio o Limpieza Necesaria |
|:---|:---|:---|
| [TODO: Host] | [TODO: Alcance] | [TODO: Cambio o limpieza realizada] |

## Flags Descubiertas

| Flag # | Host | Valor de la Flag | Ubicación de la Flag | Método Utilizado |
|:---|:---|:---|:---|:---|
| 1 | [TODO: Hostname] | [TODO: Valor de la flag] | [TODO: Ubicación] | [TODO: Método] |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |
| 5 | | | | |
| 6 | | | | |
| 7 | | | | |
| 8 | | | | |
| 9 | | | | |
| 10 | | | | |
| 11 | | | | |
| 12 | | | | |
| 13 | | | | |
`,
  },
  {
    id: 'ptpl-5',
    name_en: 'Machine Writeup',
    name_es: 'Writeup de Máquina',
    description_en: 'A template for documenting the process of solving a CTF machine, such as those on Hack The Box.',
    description_es: 'Una plantilla para documentar el proceso de resolución de una máquina CTF, como las de Hack The Box.',
    icon: 'FileText',
    scope_en: `# General Information

In this writeup we solve the [TODO: machine name] machine from Hack The Box, a Linux box rated [TODO: Easy / Medium / Hard].

- **Machine name:** [TODO: machine name]
- **IP address:** [TODO: IP address]
- **Operating system:** Linux
- **Difficulty:** 🟢 Easy | 🟡 Medium | 🔴 Hard [TODO: select difficulty]
- **Date:** ${format(new Date(), 'dd-MM-yyyy')}

# Initial Reconnaissance

Map the target attack surface: host resolution, open ports and running services.

## Add IP to /etc/hosts

Add the machine IP to /etc/hosts:

\`\`\`bash
sudo echo "[TODO: IP address] [TODO: machine.htb]" | sudo tee -a /etc/hosts
\`\`\`

## Port Scanning

Identify exposed ports and services with Nmap.

### Simple Scan

\`\`\`bash
sudo nmap -v -sV -T5 [TODO: IP address]
\`\`\`

\`\`\`
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.12 (Ubuntu Linux; protocol 2.0)
80/tcp open  http    Apache httpd 2.4.41 ((Ubuntu))
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
\`\`\`

Only common ports (22 and 80) were found open. We focus on the web service.

## Web Access

We browse to \`http://[TODO: machine.htb]\` and observe what looks like [TODO: site description, e.g. an online learning platform].

[TODO: add screenshots or useful commands from the initial web access]

# Web Enumeration

Discover endpoints, technologies and hidden content on the exposed web stack.

## WSTG Scan

This tool automatically performs:

- Web technology enumeration
- Port and service scanning with Nmap
- Vulnerability analysis with Nuclei
- Subdomain fuzzing with ffuf
- Directory fuzzing with ffuf
- Spidering / full site mapping
- Form detection and injection testing
- API testing (OWASP API Top 10)
- User enumeration and bruteforce with hydra

\`\`\`bash
git clone https://github.com/afsh4ck/WSTG-Scan.git
cd WSTG-Scan
python3 wstg-scan.py
\`\`\`

## Relevant Findings

[TODO: summarise the most relevant findings from the enumeration]

### Subdomain Enumeration (VHosts)

Check the base Content-Length and fuzz VHosts with FFUF:

\`\`\`bash
ffuf -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt:FUZZ \\
     -u http://[TODO: machine.htb]/ \\
     -H 'Host: FUZZ.[TODO: machine.htb]' \\
     -fs [TODO: base_response_size]
\`\`\`

We find the subdomain: [TODO: e.g. grafana.planning.htb]. We add it to /etc/hosts and reach a [TODO: technology and version, e.g. Grafana v11.0.0] panel.

# Exploitation

Identify the vulnerable surface, weaponise a known exploit and gain a first foothold.

## XSS Test

We try the following script in the form fields to check whether it is vulnerable to Cross Site Scripting (XSS):

\`\`\`html
[TODO: XSS payload, e.g. <img src=x onerror="fetch('http://[TODO: your IP]:9000')">]
\`\`\`

We replace the IP with ours and start a Netcat listener on port 9000:

\`\`\`bash
nc -lvnp 9000
\`\`\`

We click the Send button and check whether the listener receives a call to confirm the vulnerability.

## CVE / Exploit Research

We look for CVEs related to [TODO: service and version, e.g. Grafana 11.0.0] on sources such as:

- https://sploitus.com
- https://exploit-db.com
- https://github.com

**Selected exploit:** [TODO: describe the exploit used and its reference URL]

## Exploit Execution

[TODO: step-by-step description of how remote execution or the initial access was achieved]

## Stabilise the Session

We use Penelope to stabilise our session and gain persistence. We use the bash payload from the tun0 section, since we are connected through the VPN.

[TODO: Penelope bash payload (tun0 section)]

We run it on the target machine and automatically receive a PTY shell with persistence. With F12 we can detach the session to interact with it later.

# Initial Access

Once we have access, we verify the user and system context.

- Current user: \`whoami\`
- Environment: \`uname -a\`, \`id\`, \`sudo -l\`

## User Flag

Locate and obtain the user flag:

\`\`\`bash
cat /home/[TODO: user]/user.txt
\`\`\`

[TODO: paste the user flag value]

# Privilege Escalation

Enumerate the local environment and abuse misconfigurations to escalate to root.

## Privilege Enumeration

We do not have sudo as the user [TODO: user, e.g. Oliver]:

\`\`\`bash
sudo -l
\`\`\`

### SUDO Version

[TODO: state the sudo version]. This version is vulnerable to [TODO: CVE, e.g. CVE-2025-32463] and we find several PoCs to exploit it.

### Files with Special Permissions

Searching for files with special permissions we find a suspicious binary [TODO: e.g. ndsudo]:

\`\`\`bash
find / -perm -4000 2>/dev/null
\`\`\`

### Internal Running Services

\`\`\`bash
ss -tuln
\`\`\`

Tools used: \`sudo -l\`, \`find / -perm -4000 2>/dev/null\`, \`linpeas.sh\`, \`pspy\`.

## Applied Technique

[TODO: describe the technique used: SUID binary, misconfigured cronjob, hardcoded credentials, etc.]

# 👑 Root Flag

Obtain the root flag:

\`\`\`bash
cat /root/root.txt
\`\`\`

[TODO: paste the root flag value]
`,
    appendix_en: `# Appendix

- **Network scanner:** Nmap
- **Web enumeration:** WSTG-Scan, ffuf, whatweb
- **Exploitation:** [TODO: exploit/PoC used], Netcat
- **Shell stabilisation:** Penelope
- **Privilege escalation:** linpeas.sh, pspy
`,
    scope_es: `# Información General

En esta ocasión vamos a hacer el writeup de la máquina [TODO: nombre de la máquina] de Hack The Box, una máquina Linux de dificultad [TODO: Fácil / Media / Difícil].

- **Nombre de la máquina:** [TODO: nombre de la máquina]
- **IP:** [TODO: dirección IP]
- **Sistema operativo:** Linux
- **Dificultad:** 🟢 Fácil | 🟡 Media | 🔴 Difícil [TODO: seleccionar dificultad]
- **Fecha:** ${format(new Date(), 'dd-MM-yyyy')}

# Reconocimiento Inicial

Mapeamos la superficie de ataque: resolución del host, puertos abiertos y servicios en ejecución.

## Añadir IP a /etc/hosts

Añadimos la IP de la máquina al archivo /etc/hosts:

\`\`\`bash
sudo echo "[TODO: dirección IP] [TODO: maquina.htb]" | sudo tee -a /etc/hosts
\`\`\`

## Escaneo de Puertos

Identificamos los puertos y servicios expuestos con Nmap.

### Escaneo Simple

\`\`\`bash
sudo nmap -v -sV -T5 [TODO: dirección IP]
\`\`\`

\`\`\`
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.12 (Ubuntu Linux; protocol 2.0)
80/tcp open  http    Apache httpd 2.4.41 ((Ubuntu))
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
\`\`\`

Solo encontramos puertos comunes (22 y 80) abiertos. Nos centraremos en el servicio web.

## Acceso Web

Accedemos a \`http://[TODO: maquina.htb]\` y observamos que parece ser [TODO: descripción del sitio, p. ej. una plataforma de cursos en línea].

[TODO: añadir capturas o comandos útiles del acceso web inicial]

# Enumeración Web

Descubrimos endpoints, tecnologías y contenido oculto del stack web expuesto.

## WSTG Scan

Este programa realiza automáticamente:

- Enumeración de tecnologías web
- Escaneo de puertos y servicios con Nmap
- Análisis de vulnerabilidades con Nuclei
- Fuzzing de subdominios con ffuf
- Fuzzing de directorios con ffuf
- Spidering / mapeo completo del site
- Detección de formularios y pruebas de inyección
- Pruebas de API (OWASP API Top 10)
- Enumeración de usuarios y bruteforce con hydra

\`\`\`bash
git clone https://github.com/afsh4ck/WSTG-Scan.git
cd WSTG-Scan
python3 wstg-scan.py
\`\`\`

## Hallazgos relevantes

[TODO: resumir los hallazgos más relevantes de la enumeración]

### Enumeración de Subdominios (VHosts)

Comprobamos el Content-Length base y hacemos fuzzing de VHosts con FFUF:

\`\`\`bash
ffuf -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt:FUZZ \\
     -u http://[TODO: maquina.htb]/ \\
     -H 'Host: FUZZ.[TODO: maquina.htb]' \\
     -fs [TODO: tamaño_respuesta_base]
\`\`\`

Encontramos el subdominio: [TODO: p. ej. grafana.planning.htb]. Lo añadimos a /etc/hosts y accedemos a un panel de [TODO: tecnología y versión, p. ej. Grafana v11.0.0].

# Explotación

Identificamos la superficie vulnerable, preparamos un exploit conocido y conseguimos un primer punto de apoyo.

## Prueba de XSS

Probamos el siguiente script en los campos del formulario para ver si es vulnerable a Cross Site Scripting (XSS):

\`\`\`html
[TODO: payload XSS, p. ej. <img src=x onerror="fetch('http://[TODO: tu IP]:9000')">]
\`\`\`

Cambiamos la IP por la nuestra e iniciamos un listener con Netcat en el puerto 9000:

\`\`\`bash
nc -lvnp 9000
\`\`\`

Hacemos clic en el botón Send y comprobamos si el listener recibe una llamada para confirmar la vulnerabilidad.

## Investigación de CVEs / Exploits

Exploramos CVEs relacionados con [TODO: servicio y versión, p. ej. Grafana 11.0.0] en fuentes como:

- https://sploitus.com
- https://exploit-db.com
- https://github.com

**Exploit seleccionado:** [TODO: describir qué exploit se usó y su URL de referencia]

## Ejecución del Exploit

[TODO: describir paso a paso cómo se logró la ejecución remota o el primer acceso]

## Estabilizar sesión

Usaremos Penelope para estabilizar nuestra sesión y tener persistencia. Usamos el payload en bash de la sección tun0, ya que estamos conectados por VPN.

[TODO: payload bash de Penelope (sección tun0)]

Lo ejecutamos en la máquina objetivo y automáticamente recibimos la shell PTY con persistencia. Con F12 podemos cerrar la sesión para interactuar con ella más tarde.

# Acceso Inicial

Una vez obtenido acceso, verificamos el contexto del usuario y del sistema.

- Usuario actual: \`whoami\`
- Entorno: \`uname -a\`, \`id\`, \`sudo -l\`

## User Flag

Localizamos y obtenemos la flag del usuario:

\`\`\`bash
cat /home/[TODO: usuario]/user.txt
\`\`\`

[TODO: pegar el valor de la user flag]

# Escalada de Privilegios

Enumeramos el entorno local y abusamos de configuraciones erróneas para escalar a root.

## Enumeración de Privilegios

No tenemos sudo como el usuario [TODO: usuario, p. ej. Oliver]:

\`\`\`bash
sudo -l
\`\`\`

### Versión de SUDO

[TODO: indicar la versión de sudo]. Esta versión es vulnerable al [TODO: CVE, p. ej. CVE-2025-32463] y encontramos varios PoC para explotarla.

### Enumeración de archivos con permisos especiales

Buscando archivos con permisos especiales encontramos un binario sospechoso [TODO: p. ej. ndsudo]:

\`\`\`bash
find / -perm -4000 2>/dev/null
\`\`\`

### Ver servicios internos corriendo

\`\`\`bash
ss -tuln
\`\`\`

Herramientas usadas: \`sudo -l\`, \`find / -perm -4000 2>/dev/null\`, \`linpeas.sh\`, \`pspy\`.

## Técnica Aplicada

[TODO: describir la técnica usada: binario con SUID, cronjob mal configurado, credenciales hardcoded, etc.]

# 👑 Root Flag

Obtenemos la flag de root:

\`\`\`bash
cat /root/root.txt
\`\`\`

[TODO: pegar el valor de la root flag]
`,
    appendix_es: `# Apéndice

- **Escáner de red:** Nmap
- **Enumeración web:** WSTG-Scan, ffuf, whatweb
- **Explotación:** [TODO: exploit/PoC usado], Netcat
- **Estabilización de shell:** Penelope
- **Escalada de privilegios:** linpeas.sh, pspy
`,
  },
];
