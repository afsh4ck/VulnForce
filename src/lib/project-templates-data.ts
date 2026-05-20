import type { ProjectTemplate } from './types';
import { format } from 'date-fns';

export const initialProjectTemplates: ProjectTemplate[] = [
  {
    id: 'ptpl-1',
    name_en: 'Standard Web App Pentest',
    name_es: 'Pentest Estándar de Aplicación Web',
    description_en: 'A comprehensive security assessment for web applications, covering OWASP Top 10 and other common vulnerabilities.',
    description_es: 'Una evaluación de seguridad completa para aplicaciones web, cubriendo el OWASP Top 10 y otras vulnerabilidades comunes.',
    icon: 'Scan',
    scope_en: `## Executive Summary
This report outlines the results of an external penetration test performed on the internet-facing assets of **{{client.name}}**. The assessment aimed to identify vulnerabilities that could be exploited by a remote attacker to compromise the security of the organization's perimeter. The assessment was conducted between **{{project.startDate}}** and **{{project.endDate}}** from the perspective of an external, unauthenticated attacker (black-box).

---
## Attack Narrative
[TODO: Provide a high-level summary of the attack path and key findings.]

---
## Findings Classification
| Severity | CVSS v3.1 Score | Description |
|:---|---|:---|
| <span style="color:red">Critical</span> | 9.0 - 10.0 | Vulnerabilities that could lead to immediate system compromise. |
| <span style="color:orange">High</span> | 7.0 - 8.9 | Vulnerabilities that could allow an attacker to gain unauthorized access. |
| <span style="color:yellow">Medium</span> | 4.0 - 6.9 | Weaknesses that could reveal sensitive information. |
| <span style="color:blue">Low</span> | 0.1 - 3.9 | Minor issues that reduce the overall security posture. |
| <span style="color:gray">Informational</span> | 0.0 | Observations about the external footprint. |
`,
    appendix_en: `---
## Appendix
A combination of automated tools and manual techniques were used to perform this assessment.
- **Proxy:** Burp Suite Professional
- **Scanners:** Nessus, Nuclei
- **Reconnaissance:** Amass, Subfinder`,
    scope_es: `## Resumen Ejecutivo
Este informe describe los resultados de una prueba de penetración externa realizada en los activos de **{{client.name}}** expuestos a Internet. La evaluación tuvo como objetivo identificar vulnerabilidades que un atacante remoto podría explotar para comprometer la seguridad del perímetro de la organización. La evaluación se realizó entre el **{{project.startDate}}** y el **{{project.endDate}}** desde la perspectiva de un atacante externo no autenticado (caja negra).

---
## Narrativa del Ataque
[TODO: Proporcionar un resumen de alto nivel de la ruta de ataque y los hallazgos clave.]

---
## Clasificación de Hallazgos

| Severidad | Puntuación CVSS v3.1 | Descripción |
|:---|---|:---|
| <span style="color:red">Crítica</span> | 9.0 - 10.0 | Vulnerabilidades que podrían llevar a un compromiso inmediato del sistema. |
| <span style="color:orange">Alta</span> | 7.0 - 8.9 | Vulnerabilidades que podrían permitir a un atacante obtener acceso no autorizado. |
| <span style="color:yellow">Media</span> | 4.0 - 6.9 | Debilidades que podrían revelar información sensible. |
| <span style="color:blue">Baja</span> | 0.1 - 3.9 | Problemas menores que reducen la postura de seguridad general. |
| <span style="color:gray">Informativa</span> | 0.0 | Observaciones sobre la huella externa. |`,
    appendix_es: `---
## Apéndice
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
- **Testing Period:** {{project.startDate}} to {{project.endDate}}
- **Assumptions:** The assessment is performed from the perspective of an attacker who has gained a foothold on the internal network (e.g., a compromised workstation).
- **Exclusions:** [TODO: Specify any out-of-scope systems]`,
    appendix_en: `---
## Appendix
- **Network Scanner:** Nmap, Masscan
- **Vulnerability Scanner:** Nessus
- **Active Directory:** BloodHound, Impacket
- **Manual Exploitation:** Metasploit Framework, CrackMapExec`,
    scope_es: `## Alcance
- **Rangos IP:** [TODO: Añadir rangos IP, p.ej., 192.168.1.0/24]
- **Periodo de Pruebas:** {{project.startDate}} a {{project.endDate}}
- **Supuestos:** La evaluación se realiza desde la perspectiva de un atacante que ha obtenido un punto de apoyo en la red interna (p.ej., una estación de trabajo comprometida).
- **Exclusiones:** [TODO: Especificar sistemas fuera de alcance]`,
    appendix_es: `---
## Apéndice
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
- **Testing Period:** {{project.startDate}} to {{project.endDate}}
- **Backend APIs:** [TODO: List backend API endpoints in scope]`,
    appendix_en: `---
## Appendix
- **Static Analysis:** MobSF, jadx
- **Dynamic Analysis:** Burp Suite, Frida, Objection
- **Test Devices:** Google Pixel 6 (Rooted), iPhone 12 (Jailbroken)`,
    scope_es: `## Alcance
- **Aplicación:** [TODO: Añadir nombre de la aplicación y ID del paquete/bundle]
- **Plataforma:** iOS / Android
- **Periodo de Pruebas:** {{project.startDate}} a {{project.endDate}}
- **APIs de Backend:** [TODO: Listar endpoints de API de backend en el alcance]`,
    appendix_es: `---
## Apéndice
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
- **Exam Duration:** {{project.startDate}} to {{project.endDate}}`,
    appendix_en: `---
## Appendix
| Hostname / IP | Location | Value |
|---|---|---|
| [TODO: Hostname/IP] | [TODO: e.g., /root/proof.txt] | [TODO: Flag Value] |
`,
    scope_es: `## Introducción
Este informe documenta los resultados de la prueba de penetración simulada realizada en el entorno del examen [TODO: Nombre de la Certificación].

## Objetivo
El objetivo fue realizar una prueba de penetración, identificando y explotando vulnerabilidades para obtener acceso no autorizado a los sistemas objetivo y cumplir los objetivos del examen.

## Alcance
- **Red Objetivo:** [TODO: p. ej., 10.10.10.0/24]
- **Duración del Examen:** {{project.startDate}} a {{project.endDate}}`,
    appendix_es: `---
## Apéndice
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
    appendix_en: `---
## Appendix
- **Network Scanner:** Nmap
- **Web Fuzzer:** ffuf, dirsearch
- **Exploitation:** [TODO: e.g., Metasploit, Python script]
- **Privilege Escalation:** linpeas.sh`,
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
    appendix_es: `---
## Apéndice
- **Escáner de Red:** Nmap
- **Fuzzer Web:** ffuf, dirsearch
- **Explotación:** [TODO: p. ej., Metasploit, script de Python]
- **Escalada de Privilegios:** linpeas.sh`
  },
];
