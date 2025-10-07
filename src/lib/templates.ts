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
- [TODO: Specify web application domains]

External Infrastructure:
- [TODO: Specify external IP ranges]

Internal Network:
- [TODO: Specify internal IP ranges]`,
  },
  {
    id: 'template-2',
    name_en: 'External Audit',
    name_es: 'Auditoría Externa',
    description_en: 'Focuses on the publicly accessible assets of the organization to identify vulnerabilities.',
    description_es: 'Se enfoca en los activos públicamente accesibles de la organización para identificar vulnerabilidades.',
    scope:
`Web Applications:
- [TODO: Specify web application domains]

External Infrastructure:
- [TODO: Specify external IP ranges]`,
  },
  {
    id: 'template-3',
    name_en: 'Internal Audit',
    name_es: 'Auditoría Interna',
    description_en: 'An assessment of the internal network to find security weaknesses from within the perimeter.',
    description_es: 'Una evaluación de la red interna para encontrar debilidades de seguridad desde dentro del perímetro.',
    scope:
`Internal Corporate Network:
- [TODO: Specify internal IP ranges]

Specific Servers:
- [TODO: Specify specific servers]`,
  },
  {
    id: 'cpts-template',
    name_en: 'Certification Report',
    name_es: 'Informe de Certificación',
    description_en: 'A generic and professional template for offensive security certification reports (e.g., OSCP, CPTS). It includes all the necessary sections for a comprehensive report.',
    description_es: 'Una plantilla genérica y profesional para informes de certificaciones de seguridad ofensiva (p. ej., OSCP, CPTS). Incluye todas las secciones necesarias para un informe completo.',
    scope: 
`## Introduction
A penetration test was performed against the [Name of the Organization, e.g., Hack The Box] enterprise network for the [Certification Name, e.g., CPTS] certification exam. The objective of this assessment was to identify and report on security vulnerabilities that could be exploited by an external attacker to compromise the internal network and gain access to sensitive data or systems, simulating a real-world attack scenario. This report details the findings of the assessment and provides recommendations for remediation.

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
5.  **Domain/Network Compromise:** ...

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
[TODO: List all the flags or proof of compromise obtained during the assessment.]
- **user.txt (Host1):** \`[flag_value]\`
- **root.txt (Host1):** \`[flag_value]\`
- **user.txt (Host2):** \`[flag_value]\`
- **root.txt (Host2):** \`[flag_value]\`
- **Domain flag:** \`[flag_value]\`

### D. Tools Used
[TODO: List the primary tools used during the assessment.]
- Nmap
- Metasploit Framework
- Mimikatz
- BloodHound
- Impacket Suite
- Burp Suite
`
  }
];
