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
- *.example.com

External Infrastructure:
- 192.0.2.0/24

Internal Network:
- 10.0.0.0/8`,
  },
  {
    id: 'template-2',
    name_en: 'External Audit',
    name_es: 'Auditoría Externa',
    description_en: 'Focuses on the publicly accessible assets of the organization to identify vulnerabilities.',
    description_es: 'Se enfoca en los activos públicamente accesibles de la organización para identificar vulnerabilidades.',
    scope:
`Web Applications:
- www.example.com
- api.example.com

External Infrastructure:
- 198.51.100.0/28
- 203.0.113.10`,
  },
  {
    id: 'template-3',
    name_en: 'Internal Audit',
    name_es: 'Auditoría Interna',
    description_en: 'An assessment of the internal network to find security weaknesses from within the perimeter.',
    description_es: 'Una evaluación de la red interna para encontrar debilidades de seguridad desde dentro del perímetro.',
    scope:
`Internal Corporate Network:
- 192.168.1.0/24
- 172.16.0.0/16

Specific Servers:
- FILESERV01 (192.168.1.10)
- AD-DC01 (192.168.1.5)`,
  },
];
