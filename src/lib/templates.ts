
import type { ProjectTemplate } from './types';

export const projectTemplates: ProjectTemplate[] = [
  {
    id: 'template-1',
    name_en: 'Full Audit',
    name_es: 'Auditoría Completa',
    icon: 'Scan',
    description_en: 'A comprehensive security audit covering external, internal, and web application testing.',
    description_es: 'Una auditoría de seguridad completa que cubre pruebas externas, internas y de aplicaciones web.',
    scope_en:
`## Web Applications:
- [TODO: Specify web application domains]

---

## External Infrastructure:
- [TODO: Specify external IP ranges]

---

## Internal Network:
- [TODO: Specify internal IP ranges]`,
    scope_es:
`## Aplicaciones Web:
- [TODO: Especificar dominios de aplicaciones web]

---

## Infraestructura Externa:
- [TODO: Especificar rangos de IP externos]

---

## Red Interna:
- [TODO: Especificar rangos de IP internos]`,
  },
  {
    id: 'template-2',
    name_en: 'External Audit',
    name_es: 'Auditoría Externa',
    icon: 'Globe',
    description_en: 'Focuses on the publicly accessible assets of the organization to identify vulnerabilities.',
    description_es: 'Se enfoca en los activos públicamente accesibles de la organización para identificar vulnerabilidades.',
    scope_en:
`## Web Applications:
- [TODO: Specify web application domains]

---

## External Infrastructure:
- [TODO: Specify external IP ranges]`,
    scope_es:
`## Aplicaciones Web:
- [TODO: Especificar dominios de aplicaciones web]

---

## Infraestructura Externa:
- [TODO: Especificar rangos de IP externos]`,
  },
  {
    id: 'template-3',
    name_en: 'Internal Audit',
    name_es: 'Auditoría Interna',
    icon: 'Network',
    description_en: 'An assessment of the internal network to find security weaknesses from within the perimeter.',
    description_es: 'Una evaluación de la red interna para encontrar debilidades de seguridad desde dentro del perímetro.',
    scope_en:
`## Internal Corporate Network:
- [TODO: Specify internal IP ranges]

---

## Specific Servers:
- [TODO: Specify specific servers]`,
    scope_es:
`## Red Corporativa Interna:
- [TODO: Especificar rangos de IP internos]

---

## Servidores Específicos:
- [TODO: Especificar servidores específicos]`,
  },
  {
    id: 'template-wifi',
    name_en: 'WiFi Audit',
    name_es: 'Auditoría WiFi',
    icon: 'Wifi',
    description_en: 'Assesses the security of wireless networks, including password cracking and client isolation tests.',
    description_es: 'Evalúa la seguridad de las redes inalámbricas, incluyendo pruebas de cracking de contraseñas y aislamiento de clientes.',
    scope_en:
`## Corporate WiFi Network:
- SSID: [TODO: Specify SSID]
- Authentication: [TODO: WPA2/WPA3, etc.]

---

## Guest WiFi Network:
- SSID: [TODO: Specify Guest SSID]
- Authentication: [TODO: Captive Portal, etc.]
`,
    scope_es:
`## Red WiFi Corporativa:
- SSID: [TODO: Especificar SSID]
- Autenticación: [TODO: WPA2/WPA3, etc.]

---

## Red WiFi de Invitados:
- SSID: [TODO: Especificar SSID de invitados]
- Autenticación: [TODO: Portal Cautivo, etc.]
`,
  },
   {
    id: 'template-mobile',
    name_en: 'Mobile App Audit',
    name_es: 'Auditoría de App Móvil',
    icon: 'Smartphone',
    description_en: 'A security assessment of Android and/or iOS mobile applications, including static and dynamic analysis.',
    description_es: 'Una evaluación de seguridad de aplicaciones móviles Android y/o iOS, incluyendo análisis estático y dinámico.',
    scope_en:
`## Android Application:
- Package Name: [TODO: com.example.app]
- [TODO: Link to APK or Play Store]

---

## iOS Application:
- Bundle ID: [TODO: com.example.app]
- [TODO: Link to IPA or App Store]
`,
    scope_es:
`## Aplicación Android:
- Nombre del Paquete: [TODO: com.ejemplo.app]
- [TODO: Enlace al APK o Play Store]

---

## Aplicación iOS:
- Bundle ID: [TODO: com.ejemplo.app]
- [TODO: Enlace al IPA o App Store]
`,
  },
  {
    id: 'cpts-template',
    name_en: 'Certification Report',
    name_es: 'Informe de Certificación',
    icon: 'Award',
    description_en: 'A generic and professional template for offensive security certification reports (e.g., OSCP, CPTS). It includes all the necessary sections for a comprehensive report.',
    description_es: 'Una plantilla genérica y profesional para informes de certificaciones de seguridad ofensiva (p. ej., OSCP, CPTS). Incluye todas las secciones necesarias para un informe completo.',
    scope_en: 
`## Introduction
A penetration test was performed against the [Name of the Organization, e.g., Hack The Box] enterprise network for the [Certification Name, e.g., CPTS] certification exam. The objective of this assessment was to identify and report on security vulnerabilities that could be exploited by an external attacker to compromise the internal network and gain access to sensitive data or systems, simulating a real-world attack scenario. This report details the findings of the assessment and provides recommendations for remediation.

---

## Scope
The scope of this penetration test was limited to the hosts and networks provided within the [Exam Environment Name] environment. The assessment was conducted from an external attacker's perspective, with no prior knowledge of the internal network architecture.

**Included in scope:**
- External IP addresses provided in the exam.
- Any hosts discovered and accessible from the initial foothold within the specified subnets.

**Excluded from scope:**
- Any hosts or networks outside of the designated exam infrastructure.
- Denial of Service (DoS) attacks.
- Social engineering attacks.
- Any actions that could disrupt the stability of the exam environment for other users.

---

## Timeline
- **Start Date:** [TODO: DD/MM/YYYY]
- **End Date:** [TODO: DD/MM/YYYY]

---

## Methodology
The penetration test followed a structured methodology aligned with industry best practices:
1.  **Information Gathering:** Passive and active reconnaissance to map the external attack surface.
2.  **Threat Modeling & Vulnerability Identification:** Identifying potential weaknesses and entry points.
3.  **Exploitation:** Gaining an initial foothold and escalating privileges.
4.  **Post-Exploitation:** Pivoting through the internal network, identifying high-value targets, and exfiltrating data (flags).
5.  **Reporting:** Documenting all findings, exploitation paths, and recommendations.

---

## Attack Path
[TODO: Provide a step-by-step narrative of the attack path, from initial reconnaissance to the final flag capture. This should be detailed and easy to follow.]

1.  **Initial Reconnaissance:** ...
2.  **Gaining a Foothold:** ...
3.  **Internal Enumeration:** ...
4.  **Lateral Movement & Privilege Escalation:** ...
5.  **Domain/Network Compromise:** ...
`,
    scope_es:
`## Introducción
Se realizó una prueba de penetración contra la red empresarial de [Nombre de la Organización, p. ej., Hack The Box] para el examen de certificación [Nombre de la Certificación, p. ej., CPTS]. El objetivo de esta evaluación fue identificar e informar sobre las vulnerabilidades de seguridad que podrían ser explotadas por un atacante externo para comprometer la red interna y obtener acceso a datos o sistemas sensibles, simulando un escenario de ataque del mundo real. Este informe detalla los hallazgos de la evaluación y proporciona recomendaciones para su remediación.

---

## Alcance
El alcance de esta prueba de penetración se limitó a los hosts y redes proporcionados dentro del entorno [Nombre del Entorno del Examen]. La evaluación se realizó desde la perspectiva de un atacante externo, sin conocimiento previo de la arquitectura de la red interna.

**Incluido en el alcance:**
- Direcciones IP externas proporcionadas en el examen.
- Cualquier host descubierto y accesible desde el punto de apoyo inicial dentro de las subredes especificadas.

**Excluido del alcance:**
- Cualquier host o red fuera de la infraestructura designada para el examen.
- Ataques de Denegación de Servicio (DoS).
- Ataques de ingeniería social.
- Cualquier acción que pudiera perturbar la estabilidad del entorno del examen para otros usuarios.

---

## Cronología
- **Fecha de Inicio:** [TODO: DD/MM/YYYY]
- **Fecha de Fin:** [TODO: DD/MM/YYYY]

---

## Metodología
La prueba de penetración siguió una metodología estructurada alineada con las mejores prácticas de la industria:
1.  **Recopilación de Información:** Reconocimiento pasivo y activo para mapear la superficie de ataque externa.
2.  **Modelado de Amenazas e Identificación de Vulnerabilidades:** Identificación de posibles debilidades y puntos de entrada.
3.  **Explotación:** Obtención de un punto de apoyo inicial y escalada de privilegios.
4.  **Post-Explotación:** Pivotar a través de la red interna, identificando objetivos de alto valor y exfiltrando datos (banderas).
5.  **Elaboración de Informes:** Documentación de todos los hallazgos, rutas de explotación y recomendaciones.

---

## Ruta de Ataque
[TODO: Proporcione una narrativa paso a paso de la ruta de ataque, desde el reconocimiento inicial hasta la captura de la bandera final. Debe ser detallada y fácil de seguir.]

1.  **Reconocimiento Inicial:** ...
2.  **Obtención de un Punto de Apoyo:** ...
3.  **Enumeración Interna:** ...
4.  **Movimiento Lateral y Escalada de Privilegios:** ...
5.  **Compromiso del Dominio/Red:** ...
`,
    appendix_en:
`
### A. Compromised Users
| Username | Domain | Password |
|---|---|---|
| [TODO: user1] | [TODO: domain.local] | [TODO: Password123] |

### B. Exploited Hosts
| Hostname | IP Address | Operating System |
|---|---|---|
| [TODO: WEB01] | [TODO: 192.168.X.X] | [TODO: Windows Server 2019] |

### C. Flags Captured
| Host | Flag Type | Flag Value |
|---|---|---|
| [TODO: WEB01] | user.txt | [TODO: flag_value] |

### D. Host & Service Discovery
| IP Address | Port | Service | Notes |
|---|---|---|---|
| [TODO: FILL IN AS APPROPRIATE] | | | |

### E. Subdomain Discovery
| URL | Description | Discovery Method |
|---|---|---|
| [TODO: FILL IN DISCOVERED VHOSTS/SUBDOMAINS] | | |

### F. Tools Used
[TODO: List the primary tools used during the assessment.]
- Nmap
- Metasploit Framework
- Mimikatz
- BloodHound
- Impacket Suite
- Burp Suite
`,
    appendix_es:
`
### A. Usuarios Comprometidos
| Usuario | Dominio | Contraseña |
|---|---|---|
| [TODO: user1] | [TODO: domain.local] | [TODO: Password123] |

### B. Hosts Explotados
| Hostname | Dirección IP | Sistema Operativo |
|---|---|---|
| [TODO: WEB01] | [TODO: 192.168.X.X] | [TODO: Windows Server 2019] |

### C. Banderas Capturadas
| Host | Tipo de Bandera | Valor de la Bandera |
|---|---|---|
| [TODO: WEB01] | user.txt | [TODO: flag_value] |

### D. Descubrimiento de Hosts y Servicios
| Dirección IP | Puerto | Servicio | Notas |
|---|---|---|---|
| [TODO: RELLENAR SEGÚN CORRESPONDA] | | | |

### E. Descubrimiento de Subdominios
| URL | Descripción | Método de Descubrimiento |
|---|---|---|
| [TODO: RELLENAR VHOSTS/SUBDOMINIOS DESCUBIERTOS] | | |

### F. Herramientas Utilizadas
[TODO: Enumere las principales herramientas utilizadas durante la evaluación.]
- Nmap
- Metasploit Framework
- Mimikatz
- BloodHound
- Impacket Suite
- Burp Suite
`
  }
];
