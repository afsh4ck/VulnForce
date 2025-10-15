'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, FileText, ArrowUpDown, Edit, Save, Trash2, CalendarIcon, Split, Eye, Plus, GripVertical, Rows, Languages, Bold, Italic, Code, List, ListOrdered, FileCode, Scan, Globe, Network, Smartphone, Wifi, Award, ChevronLeft, CheckCircle, Image } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/context/language-context";
import type { Finding, Project, ImageAsset } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { translateText } from '@/ai/flows/translate-text-flow';
import { Textarea } from '@/components/ui/textarea';

type SortKey = keyof Finding;
type SaveStatus = 'unsaved' | 'saving' | 'saved';

interface ScopeSection {
  id: string;
  content: string;
}

const iconOptions = [
    { value: 'FileText', label: 'FileText' },
    { value: 'Scan', label: 'Scan' },
    { value: 'Globe', label: 'Globe' },
    { value: 'Network', label: 'Network' },
    { value: 'Smartphone', label: 'Smartphone' },
    { value: 'Wifi', label: 'Wifi' },
    { value: 'Award', label: 'Award' },
];

const SortableScopeSection = ({ section, ...props }: { section: ScopeSection, [key: string]: any }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 'auto',
  };
  
  return (
    <div ref={setNodeRef} style={style}>
      <ScopeSectionEditor section={section} dragHandleProps={attributes} dragListeners={listeners} {...props} />
    </div>
  );
};

const ScopeSectionEditor = ({ section, onContentChange, onDelete, onTitleChange, dragHandleProps, dragListeners }: {
  section: ScopeSection;
  onContentChange: (content: string) => void;
  onDelete: () => void;
  onTitleChange: (newTitle: string) => void;
  dragHandleProps: any;
  dragListeners: any;
}) => {
    const headingMatch = section.content.match(/^(#{2,4}) (.*)/);
    const sectionTitle = headingMatch ? headingMatch[2].trim() : 'New Section';
    const contentWithoutTitle = section.content.replace(/^(#{2,4}) .*\n?/, '');

    return (
        <Card className="mb-4">
            <CardHeader className="flex flex-row items-center gap-2 p-2 border-b">
                <div {...dragHandleProps} {...dragListeners} className="cursor-grab p-2">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input 
                  value={sectionTitle}
                  onChange={(e) => onTitleChange(e.target.value)}
                  className="font-semibold text-base border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent h-auto p-0 flex-1"
                />
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={onDelete}>
                  <Trash2 className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="p-0">
                <Textarea 
                  value={contentWithoutTitle}
                  onChange={(e) => onContentChange(e.target.value)}
                  className="w-full min-h-[150px] border-0 rounded-t-none font-code text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="Write your content here..."
                />
            </CardContent>
        </Card>
    )
}

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { projects, clients, findings, updateProject, deleteProject: removeProject, getImage } = useData();
  const { language } = useLanguage();
  
  const [project, setProject] = useState<Project | undefined>();
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>(null);
  
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'scope');
  
  const [scopeSections, setScopeSections] = useState<ScopeSection[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);

  // Edit Dialog State
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editClientId, setEditClientId] = useState('');
  const [editDate, setEditDate] = useState<DateRange | undefined>();
  const [editStatus, setEditStatus] = useState<Project['status']>('In Progress');
  const [editLanguage, setEditLanguage] = useState<Project['language']>('en');
  const [editIcon, setEditIcon] = useState('FileText');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const projectFindings = useMemo(() => findings.filter(f => f.projectId === params.id), [findings, params.id]);
  const client = useMemo(() => clients.find(c => c.id === project?.clientId), [clients, project]);
  
  const parseSections = useCallback((markdown: string): ScopeSection[] => {
    if (!markdown) return [];
    
    const parts = markdown.split(/\n\s*---\s*\n/);
    
    return parts
      .map((part, index) => {
        return {
          id: `section-${index}-${Math.random()}`,
          content: part.trim()
        };
      })
      .filter(p => p.content.trim() !== '');
  }, []);

  useEffect(() => {
    const currentProject = projects.find(p => p.id === params.id);
    if (!currentProject) {
        router.push('/dashboard/projects');
        return;
    }
    setProject(currentProject);
    
    if (currentProject.reportBody) {
      const sections = parseSections(currentProject.reportBody);
      setScopeSections(sections);
    }

    setEditName(currentProject.name);
    setEditClientId(currentProject.clientId);
    setEditDate({ from: new Date(currentProject.startDate), to: new Date(currentProject.endDate) });
    setEditStatus(currentProject.status);
    setEditLanguage(currentProject.language);
    setEditIcon(currentProject.icon || 'FileText');
    setSaveStatus('saved');
  }, [params.id, projects, router, parseSections]);
  
  useEffect(() => {
    if (saveStatus === 'unsaved') {
        const handler = setTimeout(() => {
            handleSaveScope(false);
        }, 2000); 

        return () => {
            clearTimeout(handler);
        };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scopeSections, saveStatus]);


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
        icon: editIcon,
        startDate: format(editDate.from, 'yyyy-MM-dd'),
        endDate: format(editDate.to, 'yyyy-MM-dd'),
        status: editStatus,
        language: editLanguage,
    };
    
    updateProject(updatedProjectData);
    setProject(updatedProjectData); 

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

  const handleSaveScope = (showToast = true) => {
    if (project) {
        setSaveStatus('saving');
        const newReportBody = scopeSections.map(s => s.content).join('\n\n---\n\n');
        updateProject({...project, reportBody: newReportBody});
        if (showToast) {
            toast({ title: language === 'es' ? 'Informe guardado' : 'Report saved' });
        }
        setTimeout(() => setSaveStatus('saved'), 500);
    }
  }

  const handleSectionContentChange = (sectionId: string, newContent: string) => {
    setScopeSections(prevSections =>
      prevSections.map(sec => {
        if (sec.id === sectionId) {
            const headingMatch = sec.content.match(/^(#{2,4}) .*\n?/);
            const title = headingMatch ? headingMatch[0] : '';
            return { ...sec, content: title + newContent };
        }
        return sec;
      })
    );
    setSaveStatus('unsaved');
  };
  
  const handleSectionTitleChange = (sectionId: string, newTitle: string) => {
    setScopeSections(prevSections =>
      prevSections.map(sec => {
        if (sec.id === sectionId) {
            const contentWithoutTitle = sec.content.replace(/^(#{2,4}) .*\n?/, '');
            return { ...sec, content: `## ${newTitle}\n${contentWithoutTitle}` };
        }
        return sec;
      })
    );
    setSaveStatus('unsaved');
  }

  const handleAddSection = () => {
      const newSection: ScopeSection = {
          id: `section-${Date.now()}-${Math.random()}`,
          content: '## ' + t[language].newSection
      };
      setScopeSections(prev => [...prev, newSection]);
      setSaveStatus('unsaved');
  };

  const handleDeleteSection = (sectionId: string) => {
      setScopeSections(prev => prev.filter(sec => sec.id !== sectionId));
      setSaveStatus('unsaved');
  };
  
  const handleLanguageChange = async (newLang: 'en' | 'es') => {
    setEditLanguage(newLang);
    if (!project || newLang === project.language) return;

    setIsTranslating(true);
    toast({ title: t[language].translatingTitle, description: t[language].translatingDesc });

    try {
        const { translatedText } = await translateText({
            text: project.reportBody,
            targetLanguage: newLang,
        });
        
        let newReportBody = translatedText;
        
        const updatedProject = { ...project, reportBody: newReportBody, language: newLang };
        updateProject(updatedProject);
        setProject(updatedProject);

        const sections = parseSections(newReportBody);
        setScopeSections(sections);
        setSaveStatus('unsaved');
        
        toast({ title: t[language].translationSuccess });

    } catch (error) {
        console.error("Translation failed", error);
        toast({ variant: "destructive", title: t[language].translationError });
    } finally {
        setIsTranslating(false);
    }
  };


  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setScopeSections((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        setSaveStatus('unsaved');
        return newItems;
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
      saveScope: "Save Report",
      saving: "Saving...",
      saved: "Saved",
      editProject: "Edit Project",
      deleteProject: "Delete Project",
      updateProject: "Update Project",
      confirmDeleteTitle: "Are you sure?",
      confirmDeleteDesc: "This action cannot be undone. This will permanently delete the project and all its findings.",
      cancel: "Cancel",
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
      translatingTitle: 'Translating...',
      translatingDesc: 'AI is translating the report content. Please wait.',
      translationSuccess: 'Report translated successfully!',
      translationError: 'Could not translate the report.',
      iconLabel: "Icon",
      selectIcon: "Select an icon",
      backToProjects: "Back to Projects",
      upload: "Upload",
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
      saveScope: "Guardar Informe",
      saving: "Guardando...",
      saved: "Guardado",
      editProject: "Editar Proyecto",
      deleteProject: "Eliminar Proyecto",
      updateProject: "Actualizar Proyecto",
      confirmDeleteTitle: "¿Estás seguro?",
      confirmDeleteDesc: "Esta acción no se puede deshacer. Esto eliminará permanentemente el proyecto y todos sus hallazgos.",
      cancel: "Cancelar",
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
      translatingTitle: 'Traduciendo...',
      translatingDesc: 'La IA está traduciendo el contenido del informe. Por favor, espera.',
      translationSuccess: '¡Informe traducido correctamente!',
      translationError: 'No se pudo traducir el informe.',
      iconLabel: "Icono",
      selectIcon: "Selecciona un icono",
      backToProjects: "Volver a Proyectos",
      upload: "Subir",
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
    <div className="w-full grid grid-cols-1 gap-6 pt-6">
       <div className="flex justify-between items-start px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="h-10 w-10" asChild>
                <Link href="/dashboard/projects">
                    <ChevronLeft className="h-5 w-5" />
                    <span className="sr-only">{t[language].backToProjects}</span>
                </Link>
            </Button>
            <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{client?.name}</p>
                <h1 className="font-headline text-3xl font-bold tracking-tight">{project.name}</h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{t[language].status}: <Badge variant={project.status === 'Completed' ? 'secondary' : project.status === 'On Hold' ? 'outline' : 'default'}>{getStatus(project.status)}</Badge></span>
                <span>{new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}</span>
                </div>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                              <Label htmlFor="language">{t[language].language}</Label>
                              <Select value={editLanguage} onValueChange={(value) => handleLanguageChange(value as 'en' | 'es')}>
                                  <SelectTrigger id="language" disabled={isTranslating}>
                                      <SelectValue placeholder={t[language].selectLanguage} />
                                  </SelectTrigger>
                                  <SelectContent>
                                      <SelectItem value="en">{t[language].english}</SelectItem>
                                      <SelectItem value="es">{t[language].spanish}</SelectItem>
                                  </SelectContent>
                              </Select>
                              {isTranslating && <p className="text-sm text-muted-foreground">{t[language].translatingDesc}</p>}
                          </div>
                           <div className="space-y-2">
                              <Label htmlFor="icon">{t[language].iconLabel}</Label>
                              <Select onValueChange={setEditIcon} value={editIcon}>
                                  <SelectTrigger id="icon">
                                      <SelectValue placeholder={t[language].selectIcon} />
                                  </SelectTrigger>
                                  <SelectContent>
                                      {iconOptions.map(option => (
                                          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                      ))}
                                  </SelectContent>
                              </Select>
                          </div>
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
                        <Button onClick={handleUpdateProject} disabled={isTranslating}>{t[language].updateProject}</Button>
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
                        <AlertDialogAction onClick={handleDeleteProject} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">{t[language].delete}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
      </div>
      
      <Separator />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="scope">{t[language].scopeAndDetails}</TabsTrigger>
            <TabsTrigger value="findings">{t[language].findings} ({projectFindings.length})</TabsTrigger>
          </TabsList>
          {activeTab === 'scope' && (
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={() => handleSaveScope(true)} disabled={saveStatus === 'saving' || saveStatus === 'saved'}>
                {saveStatus === 'saving' ? (<><Save className="mr-2 h-4 w-4 animate-spin" />{t[language].saving}</>) : 
                 saveStatus === 'saved' ? (<><CheckCircle className="mr-2 h-4 w-4" />{t[language].saved}</>) : 
                 (<><Save className="mr-2 h-4 w-4" />{t[language].saveScope}</>)}
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
        <TabsContent value="scope" className="mt-4">
             <div className="w-full">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={scopeSections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-4">
                      {scopeSections.map(section => {
                        return (
                          <SortableScopeSection
                            key={section.id}
                            section={section}
                            onContentChange={(newContent: string) => handleSectionContentChange(section.id, newContent)}
                            onTitleChange={(newTitle: string) => handleSectionTitleChange(section.id, newTitle)}
                            onDelete={() => handleDeleteSection(section.id)}
                          />
                        )
                      })}
                    </div>
                  </SortableContext>
                </DndContext>

                <div className="flex justify-center pt-4">
                    <Button variant="outline" onClick={handleAddSection}>
                        <Plus className="mr-2 h-4 w-4" />
                        {t[language].addNewSection}
                    </Button>
                </div>
            </div>
        </TabsContent>
        <TabsContent value="findings" className="mt-4">
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
                        <div className="flex flex-row items-center">{t[language].title} {getSortIcon('title')}</div>
                    </TableHead>
                    <TableHead onClick={() => requestSort('severity')} className="cursor-pointer hover:bg-muted/50">
                        <div className="flex flex-row items-center">{t[language].severity} {getSortIcon('severity')}</div>
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
                        <Badge variant={getSeverityVariant(finding.severity) as any}>{finding.severity}</Badge>
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
