import type { ProjectTemplate } from './types';

export const projectTemplates: ProjectTemplate[] = [
  {
    id: 'template-1',
    name_en: 'Full Audit',
    name_es: 'Auditoría Completa',
    description_en: 'A comprehensive security audit covering external, internal, and web application testing.',
    description_es: 'Una auditoría de seguridad completa que cubre pruebas externas, internas y de aplicaciones web.',
    scope:
`Web Applications:
- [TODO: Specify web application domains, e.g., *.example.com]

External Infrastructure:
- [TODO: Specify external IP ranges, e.g., 192.0.2.0/24]

Internal Network:
- [TODO: Specify internal IP ranges, e.g., 10.0.0.0/8]`,
  },
  {
    id: 'template-2',
    name_en: 'External Audit',
    name_es: 'Auditoría Externa',
    description_en: 'Focuses on the publicly accessible assets of the organization to identify vulnerabilities.',
    description_es: 'Se enfoca en los activos públicamente accesibles de la organización para identificar vulnerabilidades.',
    scope:
`Web Applications:
- [TODO: Specify web application domains, e.g., www.example.com, api.example.com]

External Infrastructure:
- [TODO: Specify external IP ranges, e.g., 198.51.100.0/28, 203.0.113.10]`,
  },
  {
    id: 'template-3',
    name_en: 'Internal Audit',
    name_es: 'Auditoría Interna',
    description_en: 'An assessment of the internal network to find security weaknesses from within the perimeter.',
    description_es: 'Una evaluación de la red interna para encontrar debilidades de seguridad desde dentro del perímetro.',
    scope:
`Internal Corporate Network:
- [TODO: Specify internal IP ranges, e.g., 192.168.1.0/24, 172.16.0.0/16]

Specific Servers:
- [TODO: Specify specific servers, e.g., FILESERV01 (192.168.1.10), AD-DC01 (192.168.1.5)]`,
  },
  {
    id: 'cpts-template',
    name_en: 'CPTS Certification Report by Hack The Box',
    name_es: 'Informe de Certificación CPTS por Hack The Box',
    description_en: 'A detailed template for the Certified Penetration Testing Specialist (CPTS) certification report. It includes all necessary sections to pass the exam.',
    description_es: 'Una plantilla detallada para el informe de la certificación Certified Penetration Testing Specialist (CPTS). Incluye todas las secciones necesarias para aprobar el examen.',
    scope: 
`## Introduction
A penetration test was performed against the Hack The Box enterprise network. The objective of this assessment was to identify and report on security vulnerabilities that could be exploited by an external attacker to compromise the internal network and gain access to sensitive data or systems, simulating a real-world attack scenario. This report details the findings of the assessment and provides recommendations for remediation.

## Scope
The scope of this penetration test was limited to the hosts and networks provided within the CPTS exam environment. The assessment was conducted from an external attacker's perspective, with no prior knowledge of the internal network architecture.

**Included in scope:**
- External IP addresses provided in the exam.
- Any hosts discovered and accessible from the initial foothold within the specified subnets.

**Excluded from scope:**
- Any hosts or networks outside of the designated exam infrastructure.
- Denial of Service (DoS) attacks.
- Social engineering attacks against Hack The Box staff.
- Any actions that could disrupt the stability of the exam environment for other users.

## Timeline
- **Start Date:** [TODO: DD/MM/YYYY]
- **End Date:** [TODO: DD/MM/YYYY]

## Summary of Findings
[TODO: Provide a high-level executive summary of the key findings and the overall security posture of the network. Mention the most critical vulnerabilities discovered and the potential impact.]

---

## Methodology
The penetration test followed a structured methodology aligned with industry best practices:
1.  **Information Gathering:** Passive and active reconnaissance to map the external attack surface.
2.  **Threat Modeling & Vulnerability Identification:** Identifying potential weaknesses and entry points.
3.  **Exploitation:** Gaining an initial foothold and escalating privileges.
4.  **Post-Exploitation:** Pivoting through the internal network, identifying high-value targets, and exfiltrating data (flags).
5.  **Reporting:** Documenting all findings, exploitation paths, and recommendations.

---

## Attack Narrative
[TODO: Provide a step-by-step narrative of the attack path, from initial reconnaissance to the final flag capture. This should be detailed and easy to follow.]

1.  **Initial Reconnaissance:** ...
2.  **Gaining a Foothold:** ...
3.  **Internal Enumeration:** ...
4.  **Lateral Movement & Privilege Escalation:** ...
5.  **Domain Compromise:** ...

---

## Findings
[TODO: List all the individual findings here. Each finding should be a separate section. Use the findings editor to detail each one.]

---

## Appendix

### A. Compromised Users
[TODO: List all user accounts that were compromised during the assessment.]
- \`user1@domain.local\`
- \`admin_user\`
- \`local_admin\`

### B. Exploited Hosts
[TODO: List all hosts that were successfully exploited.]
- WEB01 (192.168.X.X) - Initial Foothold
- DC01 (192.168.Y.Y) - Domain Controller Compromise
- FILESRV (192.168.Z.Z) - Sensitive Data Exposure

### C. Flags Captured
[TODO: List all the flags obtained during the assessment.]
- **user.txt (Host1):** \`[flag_value]\`
- **root.txt (Host1):** \`[flag_value]\`
- **user.txt (Host2):** \`[flag_value]\`
- **root.txt (Host2):** \`[flag_value]\`
- **dcorp.local flag:** \`[flag_value]\`

### D. Tools Used
List the primary tools used during the assessment.
- Nmap
- Metasploit Framework
- Mimikatz
- BloodHound
- Impacket Suite
- Burp Suite
`
  }
];
