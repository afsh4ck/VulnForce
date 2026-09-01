



'use client';

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import type { Client, Project, Finding, Vulnerability, ImageAsset, ProjectTemplate } from '@/lib/types';
import { initialClients } from '@/lib/clients-data';
import { initialProjects } from '@/lib/projects-data';
import { initialImages } from '@/lib/images-data';
import { initialFindings } from '@/lib/findings-data';
import { initialVulnerabilities } from '@/lib/vulnerabilities-data';
import { initialProjectTemplates } from '@/lib/project-templates-data';
import {
    BUILTIN_THEMES,
    DEFAULT_THEME_ID,
    cloneTheme,
    isBuiltinThemeId,
    type ReportTheme,
} from '@/lib/report-themes';
import { format } from 'date-fns';

const STATE_ENDPOINT = '/api/state';
const STATE_DEBOUNCE_MS = 500;

// Sube este número cuando cambie el contenido de las plantillas integradas del
// seed y quieras que llegue a instalaciones con estado ya persistido.
const TEMPLATES_MIGRATION_VERSION = 1;

// Refresca las plantillas integradas (las que existen en el seed) con el
// contenido actual del seed, conservando las plantillas creadas por el usuario
// (ids ausentes del seed).
function refreshBuiltInTemplates(current: ProjectTemplate[]): ProjectTemplate[] {
    const seedIds = new Set(initialProjectTemplates.map(t => t.id));
    const userTemplates = current.filter(t => !seedIds.has(t.id));
    return [...initialProjectTemplates, ...userTemplates];
}

// Sube este número cuando cambien los proyectos/clientes de muestra del seed y
// quieras que lleguen a instalaciones con estado ya persistido.
const SEED_MIGRATION_VERSION = 3;

// Proyectos de muestra retirados del seed que deben eliminarse del estado.
const RETIRED_SAMPLE_PROJECT_IDS = ['proj-htb-imagery'];

// Añade una entrada del seed a `current` si no existe ya un elemento con su id.
function withSeedItems<T extends { id: string }>(current: T[], seed: T[]): T[] {
    const known = new Set(current.map(item => item.id));
    const missing = seed.filter(item => !known.has(item.id));
    return missing.length ? [...current, ...missing] : current;
}

// Actualiza exclusivamente los logos de los clientes de demostración. Así las
// instalaciones ya existentes reciben los nuevos PNG sin alterar sus clientes.
function refreshSampleClientLogos(current: Client[]): Client[] {
    const logos = new Map(
        initialClients
            .filter(client => client.id === 'cli-h4ck' || client.id === 'cli-trilocor')
            .map(client => [client.id, client.logoUrl]),
    );
    return current.map(client => {
        const logoUrl = logos.get(client.id);
        return logoUrl ? { ...client, logoUrl } : client;
    });
}
type PersistedStateShape = {
    clients?: Client[];
    projects?: Project[];
    findings?: Finding[];
    vulnerabilities?: Vulnerability[];
    images?: ImageAsset[];
    projectTemplates?: ProjectTemplate[];
    themes?: ReportTheme[];
    activeThemeId?: string;
};


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
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'reportBody' | 'startDate' | 'endDate'> & { scope: string; startDate: Date, endDate: Date }) => Project;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
  duplicateProject: (projectId: string) => void;
  addFinding: (finding: Omit<Finding, 'id' | 'createdAt' | 'updatedAt'>) => Finding;
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
  themes: ReportTheme[];
  activeThemeId: string;
  setActiveThemeId: (id: string) => void;
  getAllThemes: () => ReportTheme[];
  getThemeById: (id: string | undefined | null) => ReportTheme;
  addTheme: (theme: ReportTheme) => ReportTheme;
  updateTheme: (theme: ReportTheme) => void;
  deleteTheme: (themeId: string) => void;
  duplicateTheme: (themeId: string) => ReportTheme | undefined;
  exportData: () => void;
  importData: (jsonData: string) => void;
  wipeAllData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

function usePersistedState<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [state, setState] = useState<T>(() => {
        const storage = typeof window !== 'undefined' && typeof window.localStorage?.getItem === 'function'
            ? window.localStorage
            : null;

        if (!storage) {
            return initialValue;
        }
        try {
            const item = storage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key “${key}”:`, error);
            return initialValue;
        }
    });

    useEffect(() => {
        const storage = typeof window !== 'undefined' && typeof window.localStorage?.setItem === 'function'
            ? window.localStorage
            : null;

        if (!storage) return;

        try {
            storage.setItem(key, JSON.stringify(state));
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
    const [images, setImages] = usePersistedState<ImageAsset[]>('vulnforce-images-v4', initialImages);
    const [projectTemplates, setProjectTemplates] = usePersistedState<ProjectTemplate[]>('vulnforce-project-templates-v4', initialProjectTemplates);
    const [themes, setThemes] = usePersistedState<ReportTheme[]>('vulnforce-themes-v1', []);
    const [activeThemeId, setActiveThemeIdState] = usePersistedState<string>('vulnforce-active-theme-v1', DEFAULT_THEME_ID);
    const [templatesMigration, setTemplatesMigration] = usePersistedState<number>('vulnforce-templates-migration', 0);
    const [seedMigration, setSeedMigration] = usePersistedState<number>('vulnforce-seed-migration', 0);

    const [remoteHydrated, setRemoteHydrated] = useState(false);
    const writeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // On mount, hydrate from server-side state file if available.
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch(STATE_ENDPOINT, { cache: 'no-store' });
                if (!res.ok) return;
                const remote = (await res.json()) as PersistedStateShape | null;
                if (cancelled || !remote || typeof remote !== 'object') return;

                if (Array.isArray(remote.clients)) setClients(remote.clients);
                if (Array.isArray(remote.projects)) setProjects(remote.projects);
                if (Array.isArray(remote.findings)) setFindings(remote.findings);
                if (Array.isArray(remote.vulnerabilities)) setVulnerabilities(remote.vulnerabilities);
                if (Array.isArray(remote.images)) setImages(remote.images);
                if (Array.isArray(remote.projectTemplates)) setProjectTemplates(remote.projectTemplates);
                if (Array.isArray(remote.themes)) setThemes(remote.themes);
                if (typeof remote.activeThemeId === 'string' && remote.activeThemeId) setActiveThemeIdState(remote.activeThemeId);
            } catch {
                // Network or server error - keep using localStorage values.
            } finally {
                if (!cancelled) {
                    setRemoteHydrated(true);
                }
            }
        })();
        return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Una sola vez por navegador: sincroniza las plantillas integradas con el
    // seed. Se ejecuta tras la hidratación remota para no competir con ella.
    // Las plantillas creadas por el usuario no se tocan.
    useEffect(() => {
        if (!remoteHydrated) return;
        if (templatesMigration >= TEMPLATES_MIGRATION_VERSION) return;
        setProjectTemplates(prev => refreshBuiltInTemplates(prev));
        setTemplatesMigration(TEMPLATES_MIGRATION_VERSION);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [remoteHydrated, templatesMigration]);

    // Una sola vez por navegador: retira los proyectos de muestra obsoletos y
    // añade los nuevos de muestra (Haze, CPTS), el cliente Trilocor y las
    // imágenes del writeup de Haze si aún no están. No toca datos del usuario.
    useEffect(() => {
        if (!remoteHydrated) return;
        if (seedMigration >= SEED_MIGRATION_VERSION) return;
        const retired = new Set(RETIRED_SAMPLE_PROJECT_IDS);
        const seedSampleProjects = initialProjects.filter(p => p.id.startsWith('proj-htb-'));
        const seedSampleIds = new Set(seedSampleProjects.map(p => p.id));
        const seedSampleNames = new Set(seedSampleProjects.map(p => p.name));
        setProjects(prev => {
            // Retira los proyectos de muestra obsoletos y las copias del usuario
            // de los proyectos de muestra (mismo nombre, otro id), luego añade
            // los canónicos del seed.
            const cleaned = prev.filter(p =>
                !retired.has(p.id) &&
                !(seedSampleNames.has(p.name) && !seedSampleIds.has(p.id))
            );
            return withSeedItems(cleaned, seedSampleProjects);
        });
        setClients(prev => refreshSampleClientLogos(withSeedItems(prev, initialClients)));
        setImages(prev => withSeedItems(prev, initialImages));
        setSeedMigration(SEED_MIGRATION_VERSION);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [remoteHydrated, seedMigration]);

    // Debounced sync of all collections to the server-side state file.
    // remoteHydrated is included so the first sync fires on mount even if no
    // data changed (e.g. state file missing but localStorage has data).
    useEffect(() => {
        if (!remoteHydrated) return;
        if (writeTimerRef.current) clearTimeout(writeTimerRef.current);
        writeTimerRef.current = setTimeout(() => {
            const payload: PersistedStateShape = {
                clients, projects, findings, vulnerabilities, images, projectTemplates, themes, activeThemeId,
            };
            fetch(STATE_ENDPOINT, {
                method: 'PUT',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(payload),
            }).catch(() => {
                // Best-effort sync; localStorage still holds the data.
            });
        }, STATE_DEBOUNCE_MS);
        return () => {
            if (writeTimerRef.current) clearTimeout(writeTimerRef.current);
        };
    }, [remoteHydrated, clients, projects, findings, vulnerabilities, images, projectTemplates, themes, activeThemeId]);

    const wipeAllData = () => {
        // This function will clear the data from localStorage,
        // so the next time the app loads, it will use the initial data.
        localStorage.removeItem('vulnforce-clients-v4');
        localStorage.removeItem('vulnforce-projects-v4');
        localStorage.removeItem('vulnforce-findings-v4');
        localStorage.removeItem('vulnforce-vulnerabilities-v4');
        localStorage.removeItem('vulnforce-images-v4');
        localStorage.removeItem('vulnforce-project-templates-v4');
        localStorage.removeItem('vulnforce-themes-v1');
        localStorage.removeItem('vulnforce-active-theme-v1');
        // The user context will handle clearing user data
    };

    // Theme functions
    const getAllThemes = (): ReportTheme[] => {
        // Built-in primero, luego custom; built-in no se pueden sobreescribir.
        return [...BUILTIN_THEMES, ...themes.filter((t) => !isBuiltinThemeId(t.id))];
    };

    const getThemeById = (id: string | undefined | null): ReportTheme => {
        const all = getAllThemes();
        if (id) {
            const found = all.find((t) => t.id === id);
            if (found) return found;
        }
        const active = all.find((t) => t.id === activeThemeId);
        return active ?? BUILTIN_THEMES[0];
    };

    const setActiveThemeId = (id: string) => {
        setActiveThemeIdState(id);
    };

    const addTheme = (theme: ReportTheme): ReportTheme => {
        const safe: ReportTheme = isBuiltinThemeId(theme.id)
            ? { ...cloneTheme(theme), id: `custom-${Date.now()}` }
            : cloneTheme(theme);
        setThemes((prev) => [...prev, safe]);
        return safe;
    };

    const updateTheme = (theme: ReportTheme) => {
        if (isBuiltinThemeId(theme.id)) return;
        setThemes((prev) => prev.map((t) => (t.id === theme.id ? cloneTheme(theme) : t)));
    };

    const deleteTheme = (themeId: string) => {
        if (isBuiltinThemeId(themeId)) return;
        setThemes((prev) => prev.filter((t) => t.id !== themeId));
        if (activeThemeId === themeId) {
            setActiveThemeIdState(DEFAULT_THEME_ID);
        }
    };

    const duplicateTheme = (themeId: string): ReportTheme | undefined => {
        const source = getAllThemes().find((t) => t.id === themeId);
        if (!source) return undefined;
        const copy: ReportTheme = {
            ...cloneTheme(source),
            id: `custom-${Date.now()}`,
            name: `${source.name} (copy)`,
        };
        setThemes((prev) => [...prev, copy]);
        return copy;
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
    const addProject = (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'reportBody' | 'startDate' | 'endDate'> & { scope: string; startDate: Date, endDate: Date }): Project => {
        const now = new Date().toISOString();
        let reportBody = project.scope;

        if (project.scope) {
          reportBody = reportBody.replace(/\[TODO Start Date\]/g, format(project.startDate, 'yyyy-MM-dd'));
          reportBody = reportBody.replace(/\[TODO End Date\]/g, format(project.endDate, 'yyyy-MM-dd'));
        }

        const { scope: _scope, ...projectRest } = project;
        const newProject: Project = {
            ...projectRest,
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
    
    const duplicateProject = (projectId: string) => {
      const projectToDuplicate = projects.find(p => p.id === projectId);
      if (projectToDuplicate) {
        const now = new Date().toISOString();
        const newProject = {
          ...projectToDuplicate,
          id: `proj-${Date.now()}`,
          name: `${projectToDuplicate.name} (Copia)`,
          createdAt: now,
          updatedAt: now,
        };
        setProjects(prev => [...prev, newProject]);
      }
    }

    // Finding functions
    const addFinding = (finding: Omit<Finding, 'id' | 'createdAt' | 'updatedAt'>): Finding => {
        const now = new Date().toISOString();
        const newFinding = {
            ...finding,
            id: `find-${Date.now()}`,
            createdAt: now,
            updatedAt: now,
        }
        setFindings(prev => [...prev, newFinding]);
        touchProject(finding.projectId);
        return newFinding;
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
          version: '1.0.2',
          createdAt: new Date().toISOString(),
          data: { clients, projects, findings, vulnerabilities, images, projectTemplates, themes, activeThemeId },
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
            if (Array.isArray(parsedData.data.themes)) {
                setThemes(parsedData.data.themes.filter((t: ReportTheme) => t && !isBuiltinThemeId(t.id)));
            }
            if (typeof parsedData.data.activeThemeId === 'string' && parsedData.data.activeThemeId) {
                setActiveThemeIdState(parsedData.data.activeThemeId);
            }
        } else {
            throw new Error("Invalid backup file format");
        }
    };

    return (
        <DataContext.Provider value={{
            clients, projects, findings, vulnerabilities, images, projectTemplates,
            addClient, updateClient, deleteClient,
            addProject, updateProject, deleteProject, duplicateProject,
            addFinding, updateFinding, deleteFinding,
            addVulnerability, updateVulnerability, deleteVulnerability,
            addImage, getImage,
            addProjectTemplate, updateProjectTemplate, deleteProjectTemplate,
            themes, activeThemeId,
            setActiveThemeId,
            getAllThemes, getThemeById,
            addTheme, updateTheme, deleteTheme, duplicateTheme,
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
