'use client';

import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Search, ArrowUpDown, Edit, Trash2, Copy } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/context/language-context";
import type { Project } from '@/lib/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useData } from '@/context/data-context';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ProjectIcon, projectIconComponents } from '@/components/project-icon';
import { NewProjectDialog } from '@/components/new-project-dialog';
import { getProjectStatusLabel, getProjectStatusVariant } from '@/lib/project-status';

type SortKey = keyof Project | 'clientName';

export default function ProjectsPage() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();
  const { projects, clients, deleteProject, duplicateProject } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  
  const getStatusVariant = (status: string) => getProjectStatusVariant(status) as any;
  const getStatus = (status: string) => getProjectStatusLabel(status, language as 'en' | 'es');

  const handleDeleteProject = () => {
    if (!projectToDelete) return;
    deleteProject(projectToDelete.id);
    toast({ title: t[language].projectDeleted });
    setProjectToDelete(null);
  };
  
  const handleDuplicateProject = (projectId: string) => {
    duplicateProject(projectId);
    toast({ title: t[language].projectDuplicated });
  }

  const handleEditProject = (projectId: string) => {
    router.push(`/dashboard/projects/${projectId}`);
  };
  
  const enrichedProjects = useMemo(() => projects.map(p => ({
    ...p,
    clientName: clients.find(c => c.id === p.clientId)?.name || ''
  })), [projects, clients]);

  const sortedAndFilteredProjects = useMemo(() => {
    let filteredProjects = enrichedProjects.filter(project =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig !== null) {
      filteredProjects.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof typeof a] ?? '';
        const bValue = b[sortConfig.key as keyof typeof b] ?? '';
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return filteredProjects;
  }, [enrichedProjects, searchTerm, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
  }

  const t = {
    en: {
      title: "Projects",
      searchPlaceholder: "Search projects...",
      newProject: "New Project",
      projectNameHeader: "Project Name",
      clientHeader: "Client",
      statusHeader: "Status",
      endDateHeader: "End Date",
      actionsHeader: "Actions",
      edit: "Edit",
      duplicate: "Duplicate",
      delete: "Delete",
      confirmDeleteTitle: "Are you sure?",
      confirmDeleteDesc: "This action cannot be undone. This will permanently delete the project and all its findings.",
      cancel: "Cancel",
      projectDeleted: "Project deleted successfully.",
      projectDuplicated: "Project duplicated successfully.",
    },
    es: {
      title: "Proyectos",
      searchPlaceholder: "Buscar proyectos...",
      newProject: "Nuevo Proyecto",
      projectNameHeader: "Nombre del Proyecto",
      clientHeader: "Cliente",
      statusHeader: "Estado",
      endDateHeader: "Fecha de Fin",
      actionsHeader: "Acciones",
      edit: "Editar",
      duplicate: "Duplicar",
      delete: "Eliminar",
      confirmDeleteTitle: "¿Estás seguro?",
      confirmDeleteDesc: "Esta acción no se puede deshacer. Esto eliminará permanentemente el proyecto y todos sus hallazgos.",
      cancel: "Cancelar",
      projectDeleted: "Proyecto eliminado correctamente.",
      projectDuplicated: "Proyecto duplicado correctamente.",
    }
  }

  return (
    <>
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="font-headline text-3xl font-bold tracking-tight">{t[language].title}</h1>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder={t[language].searchPlaceholder} 
              className="pl-8" 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
           <Button onClick={() => setNewProjectOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> {t[language].newProject}
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <TooltipProvider>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead onClick={() => requestSort('name')} className="cursor-pointer hover:bg-muted/50">
                    <div className="flex flex-row items-center">{t[language].projectNameHeader} {getSortIcon('name')}</div>
                  </TableHead>
                  <TableHead onClick={() => requestSort('clientName')} className="cursor-pointer hover:bg-muted/50">
                    <div className="flex flex-row items-center">{t[language].clientHeader} {getSortIcon('clientName')}</div>
                  </TableHead>
                  <TableHead onClick={() => requestSort('status')} className="cursor-pointer hover:bg-muted/50">
                    <div className="flex flex-row items-center">{t[language].statusHeader} {getSortIcon('status')}</div>
                  </TableHead>
                  <TableHead onClick={() => requestSort('endDate')} className="cursor-pointer hover:bg-muted/50">
                    <div className="flex flex-row items-center">{t[language].endDateHeader} {getSortIcon('endDate')}</div>
                  </TableHead>
                  <TableHead className="text-right">{t[language].actionsHeader}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAndFilteredProjects.map(project => {
                  const Icon = projectIconComponents[project.icon] || ProjectIcon;
                  return (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">
                        <Link href={`/dashboard/projects/${project.id}`} className="hover:text-primary flex items-center gap-2">
                          <Icon className="h-5 w-5" />
                          {project.name}
                        </Link>
                      </TableCell>
                      <TableCell>{project.clientName}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(project.status) as any}>{getStatus(project.status)}</Badge>
                      </TableCell>
                      <TableCell>{new Date(project.endDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => handleEditProject(project.id)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{t[language].edit}</p>
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => handleDuplicateProject(project.id)}>
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{t[language].duplicate}</p>
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => setProjectToDelete(project)} className="text-destructive hover:bg-destructive hover:text-destructive-foreground">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{t[language].delete}</p>
                              </TooltipContent>
                            </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TooltipProvider>
        </CardContent>
      </Card>
    </div>

    <AlertDialog open={!!projectToDelete} onOpenChange={() => setProjectToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>{t[language].confirmDeleteTitle}</AlertDialogTitle>
                <AlertDialogDescription>{t[language].confirmDeleteDesc}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>{t[language].cancel}</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteProject} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">{t[language].delete}</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>

    <NewProjectDialog
      open={newProjectOpen}
      onOpenChange={setNewProjectOpen}
      onCreated={(id) => router.push(`/dashboard/projects/${id}`)}
    />
    </>
  )
}
