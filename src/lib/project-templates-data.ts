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
