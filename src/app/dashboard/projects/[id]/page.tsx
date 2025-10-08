
'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, FileText, ArrowUpDown, Edit, Save, Trash2, CalendarIcon, Split, Eye, Plus, GripVertical, Rows } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/context/language-context";
import type { Finding, Project, ImageAsset } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from '@/components/ui/textarea';
import { MarkdownPreview } from '@/components/markdown-preview';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';


type SortKey = keyof Finding;
type ScopeView = 'edit' | 'split' | 'preview';

interface ScopeSection {
  id: string;
  content: string;
}

const SortableScopeSection = ({ section, isOrganizing, ...props }: { section: ScopeSection, isOrganizing: boolean, [key: string]: any }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  
  return (
    <div ref={setNodeRef} style={style}>
      <ScopeSectionEditor section={section} isOrganizing={isOrganizing} dragHandleProps={attributes} dragListeners={listeners} {...props} />
    </div>
  );
};

const ScopeSectionEditor = ({ section, onContentChange, onDelete, view, onViewChange, onTitleChange, isOrganizing, getImage, dragHandleProps, dragListeners }: {
  section: ScopeSection;
  onContentChange: (content: string) => void;
  onDelete: () => void;
  view: ScopeView;
  onViewChange: (view: ScopeView) => void;
  onTitleChange: (newTitle: string) => void;
  isOrganizing: boolean;
  getImage: (id: string) => ImageAsset | undefined;
  dragHandleProps: any;
  dragListeners: any;
}) => {
  const { language } = useLanguage();
  const { addImage } = useData();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const t = {
    en: {
      viewEdit: 'Write',
      viewSplit: 'Split',
      viewPreview: 'Preview',
      deleteSection: 'Delete Section',
      newSection: 'New Section',
      confirmDeleteTitle: "Are you sure?",
      confirmDeleteDesc: "This will permanently delete this report section.",
      cancel: "Cancel",
      delete: "Delete",
    },
    es: {
      viewEdit: 'Edición',
      viewSplit: 'Dividida',
      viewPreview: 'Previsualización',
      deleteSection: 'Eliminar Sección',
      newSection: 'Nueva Sección',
      confirmDeleteTitle: "¿Estás seguro?",
      confirmDeleteDesc: "Esta acción eliminará permanentemente esta sección del informe.",
      cancel: "Cancelar",
      delete: "Eliminar",
    }
  };
  
  const headingMatch = section.content.match(/^(##) (.*)/);
  const sectionTitle = headingMatch ? headingMatch[2].trim() : t[language].newSection;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onTitleChange(e.target.value);
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
            const blob = items[i].getAsFile();
            if (blob) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const dataUrl = event.target?.result as string;
                    if (dataUrl) {
                        const newImage = addImage(dataUrl);
                        const markdownImage = `![Pasted Image](image://${newImage.id})`;
                        const textarea = e.target as HTMLTextAreaElement;
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const newContent =
                            section.content.substring(0, start) +
                            markdownImage +
                            section.content.substring(end);
                        onContentChange(newContent);
                    }
                };
                reader.readAsDataURL(blob);
            }
            e.preventDefault();
        }
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between bg-muted/50 py-3 px-4">
            <div className="flex items-center gap-2 w-full">
              {isOrganizing && <div {...dragHandleProps} {...dragListeners} className="cursor-grab"><GripVertical className="h-5 w-5 text-muted-foreground" /></div>}
              <Input 
                value={sectionTitle}
                onChange={handleTitleChange}
                className="font-semibold text-base border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent h-auto p-0"
              />
          </div>
          <div className="flex items-center gap-2">
              {!isOrganizing && (
                  <Tabs value={view} onValueChange={(value) => onViewChange(value as ScopeView)}>
                      <TabsList className="h-8">
                          <TabsTrigger value="edit" className="h-6 text-xs px-2">{t[language].viewEdit}</TabsTrigger>
                          <TabsTrigger value="split" className="h-6 text-xs px-2">{t[language].viewSplit}</TabsTrigger>
                          <TabsTrigger value="preview" className="h-6 text-xs px-2">{t[language].viewPreview}</TabsTrigger>
                      </TabsList>
                  </Tabs>
              )}
               <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive hover:text-destructive-foreground">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">{t[language].deleteSection}</span>
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t[language].confirmDeleteTitle}</AlertDialogTitle>
                        <AlertDialogDescription>{t[language].confirmDeleteDesc}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t[language].cancel}</AlertDialogCancel>
                        <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">{t[language].delete}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
          </div>
        </CardHeader>
        {!isOrganizing && (
            <CardContent className="p-4">
              <div className={cn("grid gap-4", view === 'split' ? "grid-cols-2" : "grid-cols-1")}>
                  <div className={cn(view === 'preview' && 'hidden')}>
                      <Textarea
                          value={section.content}
                          onChange={(e) => onContentChange(e.target.value)}
                          onPaste={handlePaste}
                          className="font-code min-h-[300px] text-base"
                      />
                  </div>
                  <div className={cn(view === 'edit' && 'hidden', "rounded-md border p-4 min-h-[300px]")}>
                      <MarkdownPreview content={section.content} getImage={getImage} />
                  </div>
              </div>
            </CardContent>
        )}
      </Card>
    </>
  )
}


export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { projects, clients, findings, updateProject, deleteProject: removeProject, getImage, addImage } = useData();
  const { language } = useLanguage();
  
  const [project, setProject] = useState<Project | undefined>();
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>(null);
  
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'scope');
  
  // State for scope sections
  const [scopeSections, setScopeSections] = useState<ScopeSection[]>([]);
  const [sectionViews, setSectionViews] = useState<Record<string, ScopeView>>({});
  const [isOrganizing, setIsOrganizing] = useState(false);

  // Edit Dialog State
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editClientId, setEditClientId] = useState('');
  const [editDate, setEditDate] = useState<DateRange | undefined>();
  const [editStatus, setEditStatus] = useState<Project['status']>('In Progress');
  const [editLanguage, setEditLanguage] = useState<Project['language']>('en');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const projectFindings = useMemo(() => findings.filter(f => f.projectId === params.id), [findings, params.id]);
  const client = useMemo(() => clients.find(c => c.id === project?.clientId), [clients, project]);
  
  useEffect(() => {
    const currentProject = projects.find(p => p.id === params.id);
    if (!currentProject) {
        router.push('/dashboard/projects');
        return;
    }
    setProject(currentProject);
    
    // Parse scope into sections
    const sections = currentProject.scope.split(/\n---\n/).map((content, index) => ({
      id: `section-${index}-${Date.now()}`,
      content: content.trim()
    }));
    setScopeSections(sections);
    const initialViews = sections.reduce((acc, section) => {
        acc[section.id] = 'split';
        return acc;
    }, {} as Record<string, ScopeView>);
    setSectionViews(initialViews);

    // Set edit dialog fields
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
    setIsDeleteDialogOpen(false);
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

  const handleSaveScope = () => {
    if (project) {
        const newScope = scopeSections.map(s => s.content).join('\n\n---\n\n');
        updateProject({...project, scope: newScope});
        toast({ title: language === 'es' ? 'Alcance guardado' : 'Scope saved' });
        setIsOrganizing(false);
    }
  }

  const handleSectionContentChange = (sectionId: string, newContent: string) => {
    setScopeSections(prevSections =>
      prevSections.map(sec => sec.id === sectionId ? { ...sec, content: newContent } : sec)
    );
  };
  
  const handleSectionTitleChange = (sectionId: string, newTitle: string) => {
    setScopeSections(prevSections =>
      prevSections.map(sec => {
        if (sec.id === sectionId) {
            const oldContent = sec.content;
            const contentWithoutTitle = oldContent.replace(/^## .*\n?/, '');
            const newContent = `## ${newTitle}\n${contentWithoutTitle}`;
            return { ...sec, content: newContent };
        }
        return sec;
      })
    );
  }

  const handleAddSection = () => {
      const newSection: ScopeSection = {
          id: `section-new-${Date.now()}`,
          content: '## ' + t[language].newSection
      };
      setScopeSections(prev => [...prev, newSection]);
      setSectionViews(prev => ({ ...prev, [newSection.id]: 'edit' }));
  };

  const handleDeleteSection = (sectionId: string) => {
      setScopeSections(prev => prev.filter(sec => sec.id !== sectionId));
      setSectionViews(prev => {
          const newViews = { ...prev };
          delete newViews[sectionId];
          return newViews;
      });
  };

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

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setScopeSections((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

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
      addNewSection: 'Add New Section',
      newSection: 'New Section',
      organizeSections: 'Organize Sections',
      finishOrganizing: 'Finish Organizing',
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
      saveScope: "Guardar Alcance",
      editProject: "Editar Proyecto",
      eliminarProyecto: "Eliminar Proyecto",
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
      addNewSection: 'Añadir Nueva Sección',
      newSection: 'Nueva Sección',
      organizeSections: 'Organizar Secciones',
      finishOrganizing: 'Finalizar Organización',
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
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
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
                        <AlertDialogAction onClick={handleDeleteProject} className="bg-destructive hover:bg-destructive/90">{t[language].delete}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
      </div>
      
      <Separator />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="scope">{t[language].scopeAndDetails}</TabsTrigger>
            <TabsTrigger value="findings">{t[language].findings} ({projectFindings.length})</TabsTrigger>
          </TabsList>
          {activeTab === 'scope' && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsOrganizing(!isOrganizing)}>
                {isOrganizing ? <><Save className="mr-2 h-4 w-4" /> {t[language].finishOrganizing}</> : <><Rows className="mr-2 h-4 w-4" /> {t[language].organizeSections}</>}
              </Button>
              <Button size="sm" onClick={handleSaveScope}>
                <Save className="mr-2 h-4 w-4" />
                {t[language].saveScope}
              </Button>
            </div>
          )}
          {activeTab === 'findings' && (
             <Button size="sm" asChild>
                <Link href={`/dashboard/projects/${project.id}/findings/new`}>
                <PlusCircle className="mr-2 h-4 w-4" /> {t[language].addFinding}
                </Link>
            </Button>
          )}
        </div>
        <TabsContent value="scope">
             <div className="space-y-4">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={scopeSections} strategy={verticalListSortingStrategy}>
                    <div className="space-y-4">
                      {scopeSections.map(section => (
                        <SortableScopeSection
                          key={section.id}
                          id={section.id}
                          section={section}
                          isOrganizing={isOrganizing}
                          onContentChange={(newContent: string) => handleSectionContentChange(section.id, newContent)}
                          onTitleChange={(newTitle: string) => handleSectionTitleChange(section.id, newTitle)}
                          onDelete={() => handleDeleteSection(section.id)}
                          view={sectionViews[section.id] || 'split'}
                          onViewChange={(newView: ScopeView) => setSectionViews(prev => ({ ...prev, [section.id]: newView }))}
                          getImage={getImage}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>

                <div className="flex justify-center">
                    <Button variant="outline" onClick={handleAddSection}>
                        <Plus className="mr-2 h-4 w-4" />
                        {t[language].addNewSection}
                    </Button>
                </div>
            </div>
        </TabsContent>
        <TabsContent value="findings">
           <Card>
            <CardHeader>
                <div>
                    <CardTitle>{t[language].findings}</CardTitle>
                    <CardDescription>{projectFindings.length} {t[language].findings.toLowerCase()} {language === 'es' ? 'encontrados' : 'found'}</CardDescription>
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

    