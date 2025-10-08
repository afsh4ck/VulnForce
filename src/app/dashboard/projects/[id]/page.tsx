
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, FileText, ArrowUpDown, Edit, Save, Trash2, CalendarIcon, Split, Eye } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/context/language-context";
import type { Finding, Project } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from '@/components/ui/textarea';
import { MarkdownPreview } from '@/components/markdown-preview';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useData } from '@/context/data-context';
import { DateRange } from 'react-day-picker';
import { projectTemplates } from '@/lib/templates';


type SortKey = keyof Finding;

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { projects, clients, findings, updateProject, deleteProject: removeProject } = useData();
  const { language } = useLanguage();
  
  const [project, setProject] = useState<Project | undefined>();
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>(null);
  
  const [scopeContent, setScopeContent] = useState('');
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'scope');
  const [scopeView, setScopeView] = useState('split');
  
  // Edit Dialog State
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editClientId, setEditClientId] = useState('');
  const [editDate, setEditDate] = useState<DateRange | undefined>();
  const [editStatus, setEditStatus] = useState<Project['status']>('In Progress');
  const [editLanguage, setEditLanguage] = useState<Project['language']>('en');

  const projectFindings = useMemo(() => findings.filter(f => f.projectId === params.id), [findings, params.id]);
  const client = useMemo(() => clients.find(c => c.id === project?.clientId), [clients, project]);
  
  useEffect(() => {
    const currentProject = projects.find(p => p.id === params.id);
    if (!currentProject) {
        router.push('/dashboard/projects');
        return;
    }
    setProject(currentProject);
    setScopeContent(currentProject.scope);
    setEditName(currentProject.name);
    setEditClientId(currentProject.clientId);
    setEditDate({ from: new Date(currentProject.startDate), to: new Date(currentProject.endDate) });
    setEditStatus(currentProject.status);
    setEditLanguage(currentProject.language);
  }, [params.id, projects, router]);
  
  const handleUpdateProject = () => {
    if (!project || !editName || !editClientId || !editDate?.from || !editDate?.to) {
        toast({
            variant: "destructive",
            title: t[language].incompleteFields,
            description: t[language].fillAllFields
        });
        return;
    }

    const updatedProjectData = {
        ...project,
        name: editName,
        clientId: editClientId,
        startDate: format(editDate.from, 'yyyy-MM-dd'),
        endDate: format(editDate.to, 'yyyy-MM-dd'),
        status: editStatus,
        language: editLanguage,
    };
    
    updateProject(updatedProjectData);

    toast({ title: t[language].projectUpdated });
    setIsEditDialogOpen(false);
  };

  const handleDeleteProject = () => {
    if (!project) return;
    removeProject(project.id);
    toast({ title: t[language].projectDeleted });
    router.push('/dashboard/projects');
  };

  const getSeverityVariant = (severity: string): 'destructive' | 'high' | 'medium' | 'low' | 'secondary' => {
    switch (severity) {
      case 'Critical': return 'destructive';
      case 'High': return 'high';
      case 'Medium': return 'medium';
      case 'Low': return 'low';
      default: return 'secondary';
    }
  }

  const sortedFindings = useMemo(() => {
    let sortableFindings = [...projectFindings];
    if (sortConfig !== null) {
      sortableFindings.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableFindings;
  }, [projectFindings, sortConfig]);

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
  };

  const t = {
    en: {
      status: "Status",
      scopeAndDetails: "Scope & Details",
      findings: "Findings",
      exportReport: "Export Report",
      addFinding: "Add Finding",
      title: "Title",
      severity: "Severity",
      cvss: "CVSS",
      projectDetails: "Project Details",
      client: "Client",
      projectName: "Project Name",
      dates: "Dates",
      inProgress: "In Progress",
      completed: "Completed",
      onHold: "On Hold",
      editScope: "Edit",
      saveScope: "Save Scope",
      editProject: "Edit Project",
      deleteProject: "Delete Project",
      updateProject: "Update Project",
      confirmDeleteTitle: "Are you sure?",
      confirmDeleteDesc: "This action cannot be undone. This will permanently delete the project and all its findings.",
      cancel: "Cancel",
      delete: "Delete",
      projectUpdated: "Project updated successfully.",
      projectDeleted: "Project deleted successfully.",
      incompleteFields: "Incomplete Fields",
      fillAllFields: "Please fill in all fields.",
      language: 'Language',
      selectLanguage: 'Select Language',
      english: 'English',
      spanish: 'Spanish',
      viewEdit: 'Edit',
      viewSplit: 'Split',
      viewPreview: 'Preview',
    },
    es: {
      status: "Estado",
      scopeAndDetails: "Alcance y Detalles",
      findings: "Hallazgos",
      exportReport: "Exportar Informe",
      addFinding: "Añadir Hallazgo",
      title: "Título",
      severity: "Severidad",
      cvss: "CVSS",
      projectDetails: "Detalles del Proyecto",
      client: "Cliente",
      projectName: "Nombre del Proyecto",
      dates: "Fechas",
      inProgress: "En Progreso",
      completed: "Completado",
      onHold: "En Espera",
      editScope: "Editar",
      saveScope: "Guardar Alcance",
      editProject: "Editar Proyecto",
      deleteProject: "Eliminar Proyecto",
      updateProject: "Actualizar Proyecto",
      confirmDeleteTitle: "¿Estás seguro?",
      confirmDeleteDesc: "Esta acción no se puede deshacer. Esto eliminará permanentemente el proyecto y todos sus hallazgos.",
      cancel: "Cancelar",
      delete: "Eliminar",
      projectUpdated: "Proyecto actualizado correctamente.",
      projectDeleted: "Proyecto eliminado correctamente.",
      incompleteFields: "Campos Incompletos",
      fillAllFields: "Por favor, rellena todos los campos.",
      language: 'Idioma',
      selectLanguage: 'Seleccionar Idioma',
      english: 'Inglés',
      spanish: 'Español',
      viewEdit: 'Edición',
      viewSplit: 'Dividida',
      viewPreview: 'Previsualización',
    }
  }

  const getStatus = (status: string) => {
    if (language === 'es') {
      if (status === 'In Progress') return 'En Progreso';
      if (status === 'Completed') return 'Completado';
      if (status === 'On Hold') return 'En Espera';
    }
    return status;
  }
  
  const handleSaveScope = () => {
    if (project) {
        updateProject({...project, scope: scopeContent});
        toast({ title: language === 'es' ? 'Alcance guardado' : 'Scope saved' });
    }
  }
  
  useEffect(() => {
    if (!project || !isEditDialogOpen) return;
  
    const matchingTemplate = projectTemplates.find(
      t => t.scope_en.trim() === project.scope.trim() || t.scope_es.trim() === project.scope.trim()
    );
  
    if (matchingTemplate) {
      const newScope = editLanguage === 'es' ? matchingTemplate.scope_es : matchingTemplate.scope_en;
      if (project.scope !== newScope) {
        updateProject({ ...project, scope: newScope, language: editLanguage });
      }
    } else {
        updateProject({ ...project, language: editLanguage });
    }
  }, [editLanguage, project, isEditDialogOpen, updateProject]);


  if (!project) {
    return null;
  }


  return (
    <div className="space-y-6">
       <div className="flex justify-between items-start">
        <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{client?.name}</p>
            <h1 className="font-headline text-3xl font-bold tracking-tight">{project.name}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{t[language].status}: <Badge variant={project.status === 'Completed' ? 'secondary' : project.status === 'On Hold' ? 'outline' : 'default'}>{getStatus(project.status)}</Badge></span>
            <span>{new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}</span>
            </div>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" asChild>
                <Link href={`/dashboard/projects/${project.id}/report`}>
                    <FileText className="mr-2 h-4 w-4" />{t[language].exportReport}
                </Link>
            </Button>
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="icon"><Edit className="h-4 w-4" /></Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t[language].editProject}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="projectName">{t[language].projectName}</Label>
                            <Input id="projectName" value={editName} onChange={(e) => setEditName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="client">{t[language].client}</Label>
                            <Select value={editClientId} onValueChange={setEditClientId}>
                                <SelectTrigger id="client">
                                    <SelectValue placeholder={t[language].client} />
                                </SelectTrigger>
                                <SelectContent>
                                    {clients.map(c => (
                                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="language">{t[language].language}</Label>
                            <Select value={editLanguage} onValueChange={(value) => setEditLanguage(value as 'en' | 'es')}>
                                <SelectTrigger id="language">
                                    <SelectValue placeholder={t[language].selectLanguage} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="en">{t[language].english}</SelectItem>
                                    <SelectItem value="es">{t[language].spanish}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label>{t[language].dates}</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                <Button
                                    id="date"
                                    variant={"outline"}
                                    className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !editDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {editDate?.from ? (
                                    editDate.to ? (
                                        <>
                                        {format(editDate.from, "LLL dd, y", { locale: language === 'es' ? es : undefined })} -{" "}
                                        {format(editDate.to, "LLL dd, y", { locale: language === 'es' ? es : undefined })}
                                        </>
                                    ) : (
                                        format(editDate.from, "LLL dd, y", { locale: language === 'es' ? es : undefined })
                                    )
                                    ) : (
                                    <span>Pick a date</span>
                                    )}
                                </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={editDate?.from}
                                    selected={editDate}
                                    onSelect={setEditDate}
                                    numberOfMonths={2}
                                    locale={language === 'es' ? es : undefined}
                                />
                                </PopoverContent>
                            </Popover>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="status">{t[language].status}</Label>
                            <Select value={editStatus} onValueChange={(value) => setEditStatus(value as Project['status'])}>
                                <SelectTrigger id="status">
                                    <SelectValue placeholder={t[language].status} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="In Progress">{t[language].inProgress}</SelectItem>
                                    <SelectItem value="Completed">{t[language].completed}</SelectItem>
                                    <SelectItem value="On Hold">{t[language].onHold}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleUpdateProject}>{t[language].updateProject}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /></Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t[language].confirmDeleteTitle}</AlertDialogTitle>
                        <AlertDialogDescription>{t[language].confirmDeleteDesc}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t[language].cancel}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteProject}>{t[language].delete}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
      </div>
      
      <Separator />
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
          <TabsTrigger value="scope">{t[language].scopeAndDetails}</TabsTrigger>
          <TabsTrigger value="findings">{t[language].findings} ({projectFindings.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="scope" className="mt-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{t[language].scopeAndDetails}</CardTitle>
                    <div className="flex items-center gap-2">
                         <Tabs value={scopeView} onValueChange={setScopeView}>
                            <TabsList>
                                <TabsTrigger value="edit"><Edit className="h-4 w-4 mr-2"/>{t[language].viewEdit}</TabsTrigger>
                                <TabsTrigger value="split"><Split className="h-4 w-4 mr-2"/>{t[language].viewSplit}</TabsTrigger>
                                <TabsTrigger value="preview"><Eye className="h-4 w-4 mr-2"/>{t[language].viewPreview}</TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <Button size="sm" onClick={handleSaveScope}>
                            <Save className="mr-2 h-4 w-4" />
                            {t[language].saveScope}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className={cn(
                        "grid gap-4",
                        scopeView === 'split' ? "grid-cols-2" : "grid-cols-1"
                    )}>
                        <div className={cn(scopeView === 'preview' && 'hidden')}>
                            <Textarea 
                                value={scopeContent}
                                onChange={(e) => setScopeContent(e.target.value)}
                                className="font-code min-h-[600px] text-base"
                            />
                        </div>
                        <div className={cn("prose prose-sm dark:prose-invert max-w-none rounded-md border p-4 min-h-[600px]", scopeView === 'edit' && 'hidden')}>
                           <MarkdownPreview content={scopeContent} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="findings" className="mt-4">
           <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>{t[language].findings}</CardTitle>
                    <CardDescription>{projectFindings.length} {t[language].findings.toLowerCase()} {language === 'es' ? 'encontrados' : 'found'}</CardDescription>
                </div>
                <div className="flex gap-2">
                <Button size="sm" asChild>
                    <Link href={`/dashboard/projects/${project.id}/findings/new`}>
                    <PlusCircle className="mr-2 h-4 w-4" /> {t[language].addFinding}
                    </Link>
                </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead onClick={() => requestSort('title')} className="cursor-pointer hover:bg-muted/50">
                        <div className="flex items-center">{t[language].title} {getSortIcon('title')}</div>
                    </TableHead>
                    <TableHead onClick={() => requestSort('severity')} className="cursor-pointer hover:bg-muted/50">
                        <div className="flex items-center">{t[language].severity} {getSortIcon('severity')}</div>
                    </TableHead>
                    <TableHead onClick={() => requestSort('cvss')} className="cursor-pointer hover:bg-muted/50">
                        <div className="flex items-center">{t[language].cvss} {getSortIcon('cvss')}</div>
                    </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedFindings.map(finding => (
                    <TableRow key={finding.id}>
                        <TableCell className="font-medium">
                        <Link href={`/dashboard/projects/${project.id}/findings/${finding.id}`} className="hover:underline">{finding.title}</Link>
                        </TableCell>
                        <TableCell>
                        <Badge variant={getSeverityVariant(finding.severity)}>{finding.severity}</Badge>
                        </TableCell>
                        <TableCell>{finding.cvss.toFixed(1)}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
