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
    description_en: 'A generic and professional template for offensive security certification reports (e.g., OSCP, CPTS). Includes all necessary sections for a complete report.',
    description_es: 'Una plantilla genérica y profesional para informes de certificaciones de seguridad ofensiva (p. ej., OSCP, CPTS). Incluye todas las secciones necesarias para un informe completo.',
    icon: 'Award',
    scope_en: `# Introduction

This report documents the practical examination performed during the **[TODO: Certification Name]** exam. The objective was to assess the security posture of the provided lab environment by identifying and exploiting vulnerabilities to gain unauthorized access to target systems.

# Objective

Perform a full-scope penetration test, demonstrating exploitation, privilege escalation and post-exploitation in the exam lab. Capture and document every flag required by the certification.

# Scope

- **Target network:** [TODO: e.g. 10.10.10.0/24]
- **Exam window:** {{project.startDate}} → {{project.endDate}}
- **Out of scope:** Exam infrastructure and any system outside the assigned range.

# Methodology

1. Enumeration and information gathering.
2. Vulnerability research and exploitation.
3. Local enumeration and privilege escalation.
4. Lateral movement when applicable.
5. Proof of access (flag collection) and screenshots.

# Findings Summary

{{findings.table}}
`,
    appendix_en: `# Appendix

## Flag Collection

| Hostname / IP | Location | Value |
|---|---|---|
| [TODO: Hostname/IP] | [TODO: e.g. /root/proof.txt] | [TODO: Flag value] |
`,
    scope_es: `# Introducción

Este informe documenta el examen práctico realizado durante la certificación **[TODO: Nombre de la Certificación]**. El objetivo fue evaluar la postura de seguridad del entorno de laboratorio identificando y explotando vulnerabilidades para obtener acceso no autorizado a los sistemas objetivo.

# Objetivo

Realizar una prueba de penetración completa, demostrando explotación, escalada de privilegios y post-explotación en el laboratorio. Capturar y documentar todas las flags requeridas por la certificación.

# Alcance

- **Red objetivo:** [TODO: p. ej. 10.10.10.0/24]
- **Ventana del examen:** {{project.startDate}} → {{project.endDate}}
- **Fuera de alcance:** Infraestructura del examen y cualquier sistema fuera del rango asignado.

# Metodología

1. Enumeración y recopilación de información.
2. Investigación y explotación de vulnerabilidades.
3. Enumeración local y escalada de privilegios.
4. Movimiento lateral cuando aplique.
5. Pruebas de acceso (recogida de flags) y capturas.

# Resumen de Hallazgos

{{findings.table}}
`,
    appendix_es: `# Apéndice

## Recopilación de Flags

| Hostname / IP | Ubicación | Valor |
|---|---|---|
| [TODO: Hostname/IP] | [TODO: p. ej. /root/proof.txt] | [TODO: Valor de la flag] |
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

- **Machine name:** [TODO: Machine name]
- **IP address:** [TODO: IP address]
- **Operating system:** Linux
- **Difficulty:** [TODO: Easy / Medium / Hard / Insane]
- **Date:** ${format(new Date(), 'dd-MM-yyyy')}

# Initial Reconnaissance

Map the target attack surface: host resolution, open ports and running services.

## Add IP to /etc/hosts

\`\`\`bash
echo "[TODO: IP address] [TODO: machine.htb]" | sudo tee -a /etc/hosts
\`\`\`

## Port Scanning (Nmap)

First an aggressive full-port discovery, then a targeted enumeration on the interesting ports.

\`\`\`bash
# Discovery scan
sudo nmap -p- -sS --min-rate 5000 -v -n -Pn [TODO: IP address] -oN ports

# Targeted scan
sudo nmap -sCV -p22,80 [TODO: IP address] -oN targeted
\`\`\`

Result: ports **22 (SSH)** and **80 (HTTP)** were found open.

# Web Enumeration

Discover endpoints, technologies and hidden content on the exposed web stack.

## Initial Access & Analysis

- **URL:** \`http://[TODO: machine.htb]\`
- Useful initial checks:

\`\`\`bash
# DNS / headers / fingerprint
host [TODO: machine.htb]
curl -I http://[TODO: machine.htb]
whatweb -a3 -v http://[TODO: machine.htb]
\`\`\`

## Directory Fuzzing

\`\`\`bash
dirsearch -u http://[TODO: machine.htb] -x 403,404
gobuster dir -u http://[TODO: machine.htb] -w /usr/share/wordlists/dirb/common.txt
ffuf -u http://[TODO: machine.htb]/FUZZ -w /usr/share/seclists/Discovery/Web-Content/common.txt
\`\`\`

Found directories: [TODO: e.g. /about.php, /contact.php].

## Subdomain Enumeration (VHosts)

\`\`\`bash
ffuf -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt:FUZZ \\
     -u http://[TODO: machine.htb]/ \\
     -H 'Host: FUZZ.[TODO: machine.htb]' \\
     -fs [TODO: base_response_size]
\`\`\`

Found subdomain: [TODO: e.g. grafana.planning.htb]. Added to /etc/hosts.

# Exploitation

Identify the vulnerable surface, weaponise a known exploit and gain a first foothold.

## Vulnerability Research

Identified service/version: [TODO: e.g. Grafana v11.0.0]. Searched for exploits on Exploit-DB, sploitus and GitHub.

**Selected exploit:** [TODO: Describe the exploit and reference URL].

## Exploit Execution

[TODO: Step-by-step description of how the exploit was executed to gain initial access.]

# Initial Access

- **User:** \`whoami\` → [TODO: user]
- **Environment:** \`uname -a\`, \`id\`, \`sudo -l\`

## User Flag

\`\`\`bash
cat /home/[TODO: user]/user.txt
\`\`\`

# Privilege Escalation

Enumerate the local environment and abuse misconfigurations to escalate to root.

## Enumeration

- Check sudo permissions: \`sudo -l\`
- Find SUID/GUID files:

\`\`\`bash
find / -user root -perm -4000 -print 2>/dev/null
\`\`\`

- Check running services: \`ss -tuln\`
- Automated enumeration: \`linpeas.sh\`, \`pspy\`.

## Applied Technique

[TODO: Describe the technique used: SUID binary, misconfigured cronjob, hardcoded credentials, etc.]

# Root Flag

\`\`\`bash
cat /root/root.txt
\`\`\`
`,
    appendix_en: `# Appendix

- **Network scanner:** Nmap
- **Web fuzzers:** ffuf, dirsearch, gobuster
- **Exploitation:** [TODO: e.g. Metasploit, Python script]
- **Privilege escalation:** linpeas.sh, pspy
`,
    scope_es: `# Información General

- **Nombre de la máquina:** [TODO: Nombre de la máquina]
- **Dirección IP:** [TODO: Dirección IP]
- **Sistema operativo:** Linux
- **Dificultad:** [TODO: Fácil / Media / Difícil / Insana]
- **Fecha:** ${format(new Date(), 'dd-MM-yyyy')}

# Reconocimiento Inicial

Mapeo de la superficie de ataque: resolución del host, puertos abiertos y servicios en ejecución.

## Añadir IP a /etc/hosts

\`\`\`bash
echo "[TODO: Dirección IP] [TODO: maquina.htb]" | sudo tee -a /etc/hosts
\`\`\`

## Escaneo de Puertos (Nmap)

Primero un descubrimiento agresivo de todos los puertos y después una enumeración dirigida a los interesantes.

\`\`\`bash
# Escaneo de descubrimiento
sudo nmap -p- -sS --min-rate 5000 -v -n -Pn [TODO: Dirección IP] -oN ports

# Escaneo dirigido
sudo nmap -sCV -p22,80 [TODO: Dirección IP] -oN targeted
\`\`\`

Resultado: se encontraron los puertos **22 (SSH)** y **80 (HTTP)** abiertos.

# Enumeración Web

Descubre endpoints, tecnologías y contenido oculto del stack web expuesto.

## Acceso y Análisis Inicial

- **URL:** \`http://[TODO: maquina.htb]\`
- Comprobaciones iniciales útiles:

\`\`\`bash
# DNS / cabeceras / fingerprint
host [TODO: maquina.htb]
curl -I http://[TODO: maquina.htb]
whatweb -a3 -v http://[TODO: maquina.htb]
\`\`\`

## Fuzzing de Directorios

\`\`\`bash
dirsearch -u http://[TODO: maquina.htb] -x 403,404
gobuster dir -u http://[TODO: maquina.htb] -w /usr/share/wordlists/dirb/common.txt
ffuf -u http://[TODO: maquina.htb]/FUZZ -w /usr/share/seclists/Discovery/Web-Content/common.txt
\`\`\`

Directorios encontrados: [TODO: p.ej. /about.php, /contact.php].

## Enumeración de Subdominios (VHosts)

\`\`\`bash
ffuf -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt:FUZZ \\
     -u http://[TODO: maquina.htb]/ \\
     -H 'Host: FUZZ.[TODO: maquina.htb]' \\
     -fs [TODO: tamaño_respuesta_base]
\`\`\`

Subdominio encontrado: [TODO: p.ej. grafana.planning.htb]. Añadido a /etc/hosts.

# Explotación

Identifica la superficie vulnerable, prepara un exploit conocido y consigue un primer punto de apoyo.

## Investigación de Vulnerabilidades

Servicio/versión identificado: [TODO: p.ej. Grafana v11.0.0]. Búsqueda de exploits en Exploit-DB, sploitus y GitHub.

**Exploit seleccionado:** [TODO: Describir el exploit y la URL de referencia].

## Ejecución del Exploit

[TODO: Descripción paso a paso de cómo se ejecutó el exploit para obtener acceso inicial.]

# Acceso Inicial

- **Usuario:** \`whoami\` → [TODO: usuario]
- **Entorno:** \`uname -a\`, \`id\`, \`sudo -l\`

## User Flag

\`\`\`bash
cat /home/[TODO: usuario]/user.txt
\`\`\`

# Escalada de Privilegios

Enumera el entorno local y abusa de configuraciones erróneas para escalar a root.

## Enumeración

- Permisos de sudo: \`sudo -l\`
- Buscar binarios SUID/GUID:

\`\`\`bash
find / -user root -perm -4000 -print 2>/dev/null
\`\`\`

- Servicios en ejecución: \`ss -tuln\`
- Enumeración automatizada: \`linpeas.sh\`, \`pspy\`.

## Técnica Aplicada

[TODO: Describir la técnica usada: binario SUID, cronjob mal configurado, credenciales hardcoded, etc.]

# Root Flag

\`\`\`bash
cat /root/root.txt
\`\`\`
`,
    appendix_es: `# Apéndice

- **Escáner de red:** Nmap
- **Fuzzers web:** ffuf, dirsearch, gobuster
- **Explotación:** [TODO: p. ej. Metasploit, script de Python]
- **Escalada de privilegios:** linpeas.sh, pspy
`,
  },
];
