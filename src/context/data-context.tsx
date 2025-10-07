'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Client, Project, Finding, Vulnerability } from '@/lib/types';
import { 
    clients as initialClients, 
    projects as initialProjects, 
    findings as initialFindings, 
    vulnerabilities as initialVulnerabilities 
} from '@/lib/data';

interface DataContextType {
  clients: Client[];
  projects: Project[];
  findings: Finding[];
  vulnerabilities: Vulnerability[];
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClient: (client: Client) => void;
  deleteClient: (clientId: string) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
  addFinding: (finding: Omit<Finding, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateFinding: (finding: Omit<Finding, 'createdAt' | 'updatedAt'>) => void;
  deleteFinding: (findingId: string) => void;
  addVulnerability: (vulnerability: Omit<Vulnerability, 'id'>) => void;
  updateVulnerability: (vulnerability: Vulnerability) => void;
  deleteVulnerability: (vulnerabilityId: string) => void;
  exportData: () => void;
  importData: (jsonData: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const useLocalStorage = <T,>(key: string, initialValue: T) => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            const valueToStore = JSON.stringify(storedValue);
            window.localStorage.setItem(key, valueToStore);
        } catch (error) {
            console.error(error);
        }
    }, [key, storedValue]);

    return [storedValue, setStoredValue] as const;
};

export function DataProvider({ children }: { children: ReactNode }) {
    const [clients, setClients] = useLocalStorage<Client[]>('vulnforce-clients', initialClients);
    const [projects, setProjects] = useLocalStorage<Project[]>('vulnforce-projects', initialProjects);
    const [findings, setFindings] = useLocalStorage<Finding[]>('vulnforce-findings', initialFindings);
    const [vulnerabilities, setVulnerabilities] = useLocalStorage<Vulnerability[]>('vulnforce-vulnerabilities', initialVulnerabilities);

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

    // Project functions
    const addProject = (project: Omit<Project, 'id'>) => {
        setProjects(prev => [...prev, { ...project, id: `proj-${Date.now()}` }]);
    };
    const updateProject = (project: Project) => {
        setProjects(prev => prev.map(p => p.id === project.id ? project : p));
    };
    const deleteProject = (projectId: string) => {
        setProjects(prev => prev.filter(p => p.id !== projectId));
        // Also delete associated findings
        setFindings(prev => prev.filter(f => f.projectId !== projectId));
    };

    // Finding functions
    const addFinding = (finding: Omit<Finding, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newFinding = {
            ...finding,
            id: `find-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
        setFindings(prev => [...prev, newFinding]);
    };
    const updateFinding = (finding: Omit<Finding, 'createdAt' | 'updatedAt'>) => {
        setFindings(prev => prev.map(f => f.id === finding.id ? { ...f, ...finding, updatedAt: new Date().toISOString() } : f));
    };
    const deleteFinding = (findingId: string) => {
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

    // Backup & Import
    const exportData = () => {
        const backupData = {
          version: '1.0.0',
          createdAt: new Date().toISOString(),
          data: { clients, projects, findings, vulnerabilities },
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
        } else {
            throw new Error("Invalid backup file format");
        }
    };

    return (
        <DataContext.Provider value={{
            clients, projects, findings, vulnerabilities,
            addClient, updateClient, deleteClient,
            addProject, updateProject, deleteProject,
            addFinding, updateFinding, deleteFinding,
            addVulnerability, updateVulnerability, deleteVulnerability,
            exportData, importData
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
