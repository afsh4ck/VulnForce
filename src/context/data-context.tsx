


'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Client, Project, Finding, Vulnerability, ImageAsset, ProjectTemplate } from '@/lib/types';
import { initialClients } from '@/lib/clients-data';
import { initialProjects } from '@/lib/projects-data';
import { initialFindings } from '@/lib/findings-data';
import { initialVulnerabilities } from '@/lib/vulnerabilities-data';
import { initialProjectTemplates } from '@/lib/project-templates-data';
import { format } from 'date-fns';


interface DataContextType {
  clients: Client[];
  projects: Project[];
  findings: Finding[];
  vulnerabilities: Vulnerability[];
  images: ImageAsset[];
  projectTemplates: ProjectTemplate[];
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClient: (client: Client) => void;
  deleteClient: (clientId: string) => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'reportBody'> & { scope: string; startDate: Date, endDate: Date }) => Project;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
  addFinding: (finding: Omit<Finding, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateFinding: (finding: Omit<Finding, 'createdAt' | 'updatedAt'>) => void;
  deleteFinding: (findingId: string) => void;
  addVulnerability: (vulnerability: Omit<Vulnerability, 'id'>) => void;
  updateVulnerability: (vulnerability: Vulnerability) => void;
  deleteVulnerability: (vulnerabilityId: string) => void;
  addImage: (dataUrl: string) => ImageAsset;
  getImage: (id: string) => ImageAsset | undefined;
  addProjectTemplate: (template: Omit<ProjectTemplate, 'id'>) => void;
  updateProjectTemplate: (template: ProjectTemplate) => void;
  deleteProjectTemplate: (templateId: string) => void;
  exportData: () => void;
  importData: (jsonData: string) => void;
  wipeAllData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

function usePersistedState<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [state, setState] = useState<T>(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key “${key}”:`, error);
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            console.error(`Error setting localStorage key “${key}”:`, error);
        }
    }, [key, state]);

    return [state, setState];
}


export function DataProvider({ children }: { children: ReactNode }) {
    const [clients, setClients] = usePersistedState<Client[]>('vulnforce-clients-v4', initialClients);
    const [projects, setProjects] = usePersistedState<Project[]>('vulnforce-projects-v4', initialProjects);
    const [findings, setFindings] = usePersistedState<Finding[]>('vulnforce-findings-v4', initialFindings);
    const [vulnerabilities, setVulnerabilities] = usePersistedState<Vulnerability[]>('vulnforce-vulnerabilities-v4', initialVulnerabilities);
    const [images, setImages] = usePersistedState<ImageAsset[]>('vulnforce-images-v4', []);
    const [projectTemplates, setProjectTemplates] = usePersistedState<ProjectTemplate[]>('vulnforce-project-templates-v4', initialProjectTemplates);

    const wipeAllData = () => {
        // This function will clear the data from localStorage,
        // so the next time the app loads, it will use the initial data.
        localStorage.removeItem('vulnforce-clients-v4');
        localStorage.removeItem('vulnforce-projects-v4');
        localStorage.removeItem('vulnforce-findings-v4');
        localStorage.removeItem('vulnforce-vulnerabilities-v4');
        localStorage.removeItem('vulnforce-images-v4');
        localStorage.removeItem('vulnforce-project-templates-v4');
        // The user context will handle clearing user data
    };

    // Client functions
    const addClient = (client: Omit<Client, 'id'>) => {
        setClients(prev => [...prev, { ...client, id: `cli-${Date.now()}` }]);
    };
    const updateClient = (client: Client) => {
        setClients(prev => prev.map(c => c.id === client.id ? client : c));
    };
    const deleteClient = (clientId: string) => {
        setClients(prev => prev.filter(c => c.id !== clientId));
    };

    const touchProject = (projectId: string) => {
      setProjects(prevProjects => 
        prevProjects.map(p => 
          p.id === projectId ? { ...p, updatedAt: new Date().toISOString() } : p
        )
      );
    }

    // Project functions
    const addProject = (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'reportBody'> & { scope: string; startDate: Date, endDate: Date }): Project => {
        const now = new Date().toISOString();
        let reportBody = project.scope;

        if (project.scope) {
          reportBody = reportBody.replace(/\[TODO Start Date\]/g, format(project.startDate, 'yyyy-MM-dd'));
          reportBody = reportBody.replace(/\[TODO End Date\]/g, format(project.endDate, 'yyyy-MM-dd'));
        }
        
        const newProject: Project = {
            ...project,
            id: `proj-${Date.now()}`,
            icon: project.icon || 'FileText',
            reportBody,
            startDate: format(project.startDate, 'yyyy-MM-dd'),
            endDate: format(project.endDate, 'yyyy-MM-dd'),
            createdAt: now,
            updatedAt: now,
        };
        setProjects(prev => [...prev, newProject]);
        return newProject;
    };
    const updateProject = (project: Project) => {
        const now = new Date().toISOString();
        setProjects(prev => prev.map(p => p.id === project.id ? { ...project, updatedAt: now } : p));
    };
    const deleteProject = (projectId: string) => {
        setProjects(prev => prev.filter(p => p.id !== projectId));
        // Also delete associated findings
        setFindings(prev => prev.filter(f => f.projectId !== projectId));
    };

    // Finding functions
    const addFinding = (finding: Omit<Finding, 'id' | 'createdAt' | 'updatedAt'>) => {
        const now = new Date().toISOString();
        const newFinding = {
            ...finding,
            id: `find-${Date.now()}`,
            createdAt: now,
            updatedAt: now,
        }
        setFindings(prev => [...prev, newFinding]);
        touchProject(finding.projectId);
    };
    const updateFinding = (finding: Omit<Finding, 'createdAt' | 'updatedAt'>) => {
        const now = new Date().toISOString();
        setFindings(prev => prev.map(f => f.id === finding.id ? { ...f, ...finding, updatedAt: now } : f));
        touchProject(finding.projectId);
    };
    const deleteFinding = (findingId: string) => {
        const finding = findings.find(f => f.id === findingId);
        if(finding){
          touchProject(finding.projectId);
        }
        setFindings(prev => prev.filter(f => f.id !== findingId));
    };

    // Vulnerability functions
    const addVulnerability = (vulnerability: Omit<Vulnerability, 'id'>) => {
        setVulnerabilities(prev => [...prev, { ...vulnerability, id: `vuln-${Date.now()}` }]);
    };
    const updateVulnerability = (vulnerability: Vulnerability) => {
        setVulnerabilities(prev => prev.map(v => v.id === vulnerability.id ? vulnerability : v));
    };
    const deleteVulnerability = (vulnerabilityId: string) => {
        setVulnerabilities(prev => prev.filter(v => v.id !== vulnerabilityId));
    };
    
    // Image Asset functions
    const addImage = (dataUrl: string): ImageAsset => {
      const newImage: ImageAsset = {
        id: `img-${Date.now()}`,
        dataUrl,
      };
      setImages(prev => [...prev, newImage]);
      return newImage;
    };
  
    const getImage = (id: string): ImageAsset | undefined => {
      return images.find(img => img.id === id);
    };

    // Project Template functions
    const addProjectTemplate = (template: Omit<ProjectTemplate, 'id'>) => {
        const newTemplate = { ...template, id: `ptpl-${Date.now()}` };
        setProjectTemplates(prev => [...prev, newTemplate]);
        return newTemplate;
    };
    const updateProjectTemplate = (template: ProjectTemplate) => {
        setProjectTemplates(prev => prev.map(t => t.id === template.id ? template : t));
    };
    const deleteProjectTemplate = (templateId: string) => {
        setProjectTemplates(prev => prev.filter(t => t.id !== templateId));
    };

    // Backup & Import
    const exportData = () => {
        const backupData = {
          version: '1.0.1',
          createdAt: new Date().toISOString(),
          data: { clients, projects, findings, vulnerabilities, images, projectTemplates },
        };
        const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vulnforce-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const importData = (jsonData: string) => {
        const parsedData = JSON.parse(jsonData);
        if (parsedData.data) {
            setClients(parsedData.data.clients || []);
            setProjects(parsedData.data.projects || []);
            setFindings(parsedData.data.findings || []);
            setVulnerabilities(parsedData.data.vulnerabilities || []);
            setImages(parsedData.data.images || []);
            setProjectTemplates(parsedData.data.projectTemplates || []);
        } else {
            throw new Error("Invalid backup file format");
        }
    };

    return (
        <DataContext.Provider value={{
            clients, projects, findings, vulnerabilities, images, projectTemplates,
            addClient, updateClient, deleteClient,
            addProject, updateProject, deleteProject,
            addFinding, updateFinding, deleteFinding,
            addVulnerability, updateVulnerability, deleteVulnerability,
            addImage, getImage,
            addProjectTemplate, updateProjectTemplate, deleteProjectTemplate,
            exportData, importData,
            wipeAllData
        }}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}
