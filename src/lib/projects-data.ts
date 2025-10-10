import type { Project } from './types';

export const initialProjects: Project[] = [
  {
    id: 'proj-1',
    clientId: 'cli-htb',
    name: 'Q3 Web App Pentest',
    reportBody: ``,
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
    clientId: 'cli-ine',
    name: 'Análisis de Red Interna',
    reportBody: ``,
    startDate: '2023-08-10',
    endDate: '2023-08-20',
    status: 'In Progress',
    language: 'es',
    createdAt: '2023-08-10T09:00:00Z',
    updatedAt: '2023-08-15T14:30:00Z',
    icon: 'Network'
  },
];
