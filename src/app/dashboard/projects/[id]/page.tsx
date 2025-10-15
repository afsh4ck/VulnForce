'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, FileText, ArrowUpDown, Edit, Save, Trash2, CalendarIcon, Plus, GripVertical, Languages, ChevronLeft, CheckCircle, Heading2, Heading3, Code, File } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import type { Finding, Project } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useData } from '@/context/data-context';
import { DateRange } from 'react-day-picker';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

type SortKey = keyof Finding;
type SaveStatus = 'unsaved' | 'saving' | 'saved';

interface ContentBlock {
  id: string;
  tag: 'h2' | 'h3' | 'p' | 'pre' | 'ul' | 'ol';
  content: string;
  children?: ContentBlock[];
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

function parseHtmlToBlocks(html: string): ContentBlock[] {
  if (typeof document === 'undefined' || !html) {
    return [{ id: `block-${Date.now()}`, tag: 'p', content: '' }];
  }
  const el = document.createElement('div');
  el.innerHTML = html;
  const blocks: ContentBlock[] = [];
  el.childNodes.forEach((node) => {
    const id = `block-${Date.now()}-${Math.random()}`;
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      const tag = element.tagName.toLowerCase();
      if (['h2', 'h3', 'p'].includes(tag)) {
        blocks.push({ id, tag: tag as 'h2'|'h3'|'p', content: element.innerHTML || '' });
      } else if (tag === 'pre') {
         blocks.push({ id, tag: 'pre', content: element.querySelector('code')?.textContent || '' });
      } else if (['ul', 'ol'].includes(tag)) {
        const items = Array.from(element.querySelectorAll('li')).map(li => ({
          id: `block-${Date.now()}-${Math.random()}`,
          tag: 'p' as 'p', // Treat li content as paragraphs for simplicity
          content: li.innerHTML,
        }));
        blocks.push({ id, tag: tag as 'ul' | 'ol', content: '', children: items });
      }
    } else if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
      blocks.push({ id, tag: 'p', content: node.textContent.trim() });
    }
  });
  if (blocks.length === 0) return [{ id: `block-${Date.now()}`, tag: 'p', content: '' }];
  return blocks;
}

function blocksToHtml(blocks: ContentBlock[]): string {
  return blocks.map(block => {
    if (block.tag === 'pre') {
        const escapedContent = block.content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return `<pre><code>${escapedContent}</code></pre>`
    }
    if (block.tag === 'ul' || block.tag === 'ol') {
        const itemsHtml = block.children?.map(child => `<li>${child.content}</li>`).join('') || '';
        return `<${block.tag}>${itemsHtml}</${block.tag}>`;
    }
    // For empty p tags, use a non-breaking space to ensure they are rendered
    if (block.tag === 'p' && !block.content.trim()) {
        return '<p><br></p>';
    }
    return `<${block.tag}>${block.content}</${block.tag}>`
  }).join('');
}

const EditableBlock = ({ block, onUpdate, onKeyDown, onFocus, isFocused, placeholder }: { 
  block: ContentBlock, 
  onUpdate: (content: string) => void, 
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void, 
  onFocus: () => void,
  isFocused: boolean,
  placeholder: string
}) => {
    const blockRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (blockRef.current && isFocused) {
            blockRef.current.focus();
            // Move cursor to the end
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(blockRef.current);
            range.collapse(false);
            sel?.removeAllRanges();
            sel?.addRange(range);
        }
    }, [isFocused]);

    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        onUpdate(e.currentTarget.innerHTML);
    };

    const Tag = block.tag === 'pre' ? 'div' : (['ul', 'ol'].includes(block.tag) ? 'div' : block.tag);
    const isCode = block.tag === 'pre';
    const isList = ['ul', 'ol'].includes(block.tag);
    const isPlaceholder = !block.content && !isList && !isCode;

    if (isList) {
      const ListTag = block.tag as 'ul' | 'ol';
      return (
        <ListTag className="my-2 ml-6 list-outside">
          {block.children?.map((child, index) => (
            <li key={child.id}>
              <div
                onInput={(e) => {
                  onUpdate(e.currentTarget.innerHTML); // This needs to be smarter
                }}
                onKeyDown={onKeyDown}
                contentEditable
                suppressContentEditableWarning
                dangerouslySetInnerHTML={{ __html: child.content }}
                 className={cn(
                  "w-full outline-none p-1 rounded-md"
                )}
              />
            </li>
          ))}
        </ListTag>
      )
    }
    
    return (
        <div 
          className="relative"
          onFocus={onFocus}
        >
          <Tag
              ref={blockRef}
              onBlur={handleBlur}
              onInput={(e) => onUpdate(e.currentTarget.innerHTML)}
              onKeyDown={onKeyDown}
              contentEditable
              suppressContentEditableWarning
              className={cn(
                "w-full outline-none p-1 rounded-md",
                {
                  'text-2xl font-semibold mb-3 border-b pb-2 mt-8 font-headline': block.tag === 'h2',
                  'text-xl font-semibold mb-3 mt-6 font-headline': block.tag === 'h3',
                  'my-2 leading-relaxed': block.tag === 'p',
                  'bg-muted font-code text-sm p-4 rounded-md overflow-x-auto my-4 whitespace-pre-wrap': isCode,
                }
              )}
              dangerouslySetInnerHTML={{ __html: block.content }}
          />
           {isPlaceholder && (
              <div className="absolute top-1 left-1 text-muted-foreground/50 pointer-events-none">{placeholder}</div>
            )}
        </div>
    );
};

const SortableBlock = ({ block, ...props }: { block: ContentBlock, [key: string]: any }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group/block">
      <div className="absolute top-0 -left-12 h-full flex items-center gap-1 opacity-0 group-hover/block:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer" onClick={() => props.onAdd(block.id)}>
          <Plus className="h-4 w-4"/>
        </Button>
        <div {...attributes} {...listeners} className="cursor-grab p-1">
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>
      <EditableBlock 
        block={block}
        {...props}
      />
    </div>
  );
};


export default function ProjectDetailsPage() {
  const { language: uiLanguage } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { id } = params;

  const { projects, clients, findings, deleteFinding, updateProject } = useData();

  const [project, setProject] = useState<Project | undefined>();
  const [projectFindings, setProjectFindings] = useState<Finding[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>(null);
  const [findingToDelete, setFindingToDelete] = useState<Finding | null>(null);
  
  const [name, setName] = useState('');
  const [clientId, setClientId] = useState('');
  const [status, setStatus] = useState<Project['status']>('In Progress');
  const [date, setDate] = useState<DateRange | undefined>();
  const [icon, setIcon] = useState<string>('FileText');
  const [projectLanguage, setProjectLanguage] = useState<Project['language']>('en');
  
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);
  
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const client = clients.find(c => c.id === project?.clientId);

  const t = {
    en: {
      back: 'Back to Projects',
      projectDetails: 'Details',
      findings: 'Findings',
      report: 'Report',
      content: 'Content',
      projectName: 'Project Name',
      client: 'Client',
      status: 'Status',
      dates: 'Project Dates',
      language: 'Language',
      icon: 'Icon',
      save: 'Save Changes',
      saving: 'Saving...',
      saved: 'Saved',
      inProgress: 'In Progress',
      completed: 'Completed',
      onHold: 'On Hold',
      english: 'English',
      spanish: 'Spanish',
      newFinding: 'New Finding',
      findingTitle: 'Finding Title',
      severity: 'Severity',
      cvss: 'CVSS',
      lastUpdated: 'Last Updated',
      actions: 'Actions',
      edit: 'Edit',
      delete: 'Delete',
      confirmDeleteFindingTitle: "Are you sure?",
      confirmDeleteFindingDesc: "This action cannot be undone. This will permanently delete the finding.",
      cancel: "Cancel",
      findingDeleted: "Finding deleted successfully.",
      selectClient: "Select a client",
      selectStatus: "Select status",
      selectLanguage: "Select language",
      selectIcon: "Select an icon",
      deleteProject: "Delete Project",
      confirmDeleteProjectTitle: "Delete Project?",
      confirmDeleteProjectDesc: "This will permanently delete the project and all its findings. This action cannot be undone.",
      changesSaved: "Changes Saved",
      changesSavedDesc: "Your project details have been updated.",
      translateScope: "Translate Scope",
      translating: "Translating...",
      commandPlaceholder: "Type '/' for commands",
    },
    es: {
      back: 'Volver a Proyectos',
      projectDetails: 'Detalles',
      findings: 'Hallazgos',
      report: 'Informe',
      content: 'Contenido',
      projectName: 'Nombre del Proyecto',
      client: 'Cliente',
      status: 'Estado',
      dates: 'Fechas',
      language: 'Idioma',
      icon: 'Icono',
      save: 'Guardar Cambios',
      saving: 'Guardando...',
      saved: 'Guardado',
      inProgress: 'En Progreso',
      completed: 'Completado',
      onHold: 'En Espera',
      english: 'Inglés',
      spanish: 'Español',
      newFinding: 'Nuevo Hallazgo',
      findingTitle: 'Título del Hallazgo',
      severity: 'Severidad',
      cvss: 'CVSS',
      lastUpdated: 'Última Actualización',
      actions: 'Acciones',
      edit: 'Editar',
      delete: 'Eliminar',
      confirmDeleteFindingTitle: "¿Estás seguro?",
      confirmDeleteFindingDesc: "Esta acción no se puede deshacer. Esto eliminará permanentemente el hallazgo.",
      cancel: "Cancelar",
      findingDeleted: "Hallazgo eliminado correctamente.",
      selectClient: "Seleccionar un cliente",
      selectStatus: "Seleccionar estado",
      selectLanguage: "Seleccionar idioma",
      selectIcon: "Seleccionar un icono",
      deleteProject: "Eliminar Proyecto",
      confirmDeleteProjectTitle: "¿Eliminar Proyecto?",
      confirmDeleteProjectDesc: "Esto eliminará permanentemente el proyecto y todos sus hallazgos. Esta acción no puede deshacerse.",
      changesSaved: "Cambios Guardados",
      changesSavedDesc: "Los detalles de tu proyecto han sido actualizados.",
      translateScope: "Traducir Alcance",
      translating: "Traduciendo...",
      commandPlaceholder: "Escribe '/' para ver comandos",
    }
  }

  const sortedFindings = useMemo(() => {
    const findingsCopy = [...projectFindings];
    if (sortConfig !== null) {
      findingsCopy.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return findingsCopy;
  }, [projectFindings, sortConfig]);

  useEffect(() => {
    const currentProject = projects.find(p => p.id === id);
    if (currentProject) {
      setProject(currentProject);
      setName(currentProject.name);
      setClientId(currentProject.clientId);
      setStatus(currentProject.status);
      setDate({ from: new Date(currentProject.startDate), to: new Date(currentProject.endDate) });
      setIcon(currentProject.icon);
      setProjectLanguage(currentProject.language);
      const filteredFindings = findings.filter(f => f.projectId === currentProject.id);
      setProjectFindings(filteredFindings);
      setBlocks(parseHtmlToBlocks(currentProject.reportBody));
      if (currentProject.reportBody) {
          setActiveBlockId(parseHtmlToBlocks(currentProject.reportBody)[0]?.id);
      }
    } else {
      router.push('/dashboard/projects');
    }
  }, [id, projects, findings, router]);
  
  useEffect(() => {
    if (saveStatus === 'unsaved') {
      const handler = setTimeout(() => {
        handleSave(false);
      }, 2000);
      return () => clearTimeout(handler);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocks, saveStatus]);


  const handleSave = (showToast = true) => {
    if (!project || !name || !clientId || !status || !date?.from || !date?.to) {
      if(showToast){
        toast({ variant: "destructive", title: "Incomplete fields", description: "Please fill in all project details." });
      }
      return;
    }

    setSaveStatus('saving');
    
    const updatedProjectData: Project = {
      ...project,
      name,
      clientId,
      status,
      icon,
      language: projectLanguage,
      startDate: format(date.from, 'yyyy-MM-dd'),
      endDate: format(date.to, 'yyyy-MM-dd'),
      reportBody: blocksToHtml(blocks),
    };

    updateProject(updatedProjectData);
    if (showToast) {
        toast({ title: t[uiLanguage].changesSaved, description: t[uiLanguage].changesSavedDesc });
    }

    setTimeout(() => setSaveStatus('saved'), 500);
  };
  
  const handleFieldChange = (setter: React.Dispatch<React.SetStateAction<any>>, value: any) => {
    setter(value);
    setSaveStatus('unsaved');
  };
  
  const handleDeleteFinding = () => {
    if (findingToDelete) {
      deleteFinding(findingToDelete.id);
      toast({ title: t[uiLanguage].findingDeleted });
      setFindingToDelete(null);
    }
  };

  const getSeverityVariant = (severity: string): 'destructive' | 'high' | 'medium' | 'low' | 'secondary' => {
    switch (severity) {
      case 'Critical': return 'destructive';
      case 'High': return 'high';
      case 'Medium': return 'medium';
      case 'Low': return 'low';
      default: return 'secondary';
    }
  };

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
  
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  
  const handleBlockUpdate = (id: string, content: string) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, content } : b));
    setSaveStatus('unsaved');
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        setSaveStatus('unsaved');
        return newItems;
      });
    }
  };
  
  const handleAddBlock = (currentBlockId: string) => {
    const newBlock: ContentBlock = { id: `block-new-${Date.now()}`, tag: 'p', content: '' };
    const currentIndex = blocks.findIndex(b => b.id === currentBlockId);
    const newBlocks = [...blocks];
    newBlocks.splice(currentIndex + 1, 0, newBlock);
    setBlocks(newBlocks);
    setActiveBlockId(newBlock.id);
    setSaveStatus('unsaved');
  };

  const updateBlockTag = (id: string, newTag: ContentBlock['tag']) => {
    setBlocks(blocks => {
      const newBlocks = blocks.map(b => b.id === id ? { ...b, tag: newTag, content: '' } : b);
      return newBlocks;
    });
    setSaveStatus('unsaved');
    // We need to re-focus after the state update
    setTimeout(() => setActiveBlockId(id), 0);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, id: string) => {
      const currentBlockIndex = blocks.findIndex(b => b.id === id);
      const currentBlock = blocks[currentBlockIndex];
      const target = e.target as HTMLDivElement;

      if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleAddBlock(id);
      } else if (e.key === 'Backspace' && target.innerHTML === '' && blocks.length > 1) {
          e.preventDefault();
          const newBlocks = blocks.filter(b => b.id !== id);
          setBlocks(newBlocks);
          if (currentBlockIndex > 0) {
              setActiveBlockId(blocks[currentBlockIndex - 1].id);
          }
          setSaveStatus('unsaved');
      } else if (e.key === ' ' && target.innerHTML.match(/^##\s*$/)) {
          e.preventDefault();
          updateBlockTag(id, 'h2');
      } else if (e.key === ' ' && target.innerHTML.match(/^###\s*$/)) {
          e.preventDefault();
          updateBlockTag(id, 'h3');
      } else if (e.key === '/') {
          const selection = window.getSelection();
          if (selection && selection.anchorOffset === 1 && target.innerHTML === '/') {
              setCommandMenuOpen(true);
          }
      }
  };

  const handleCommandSelect = (command: 'h2' | 'h3' | 'pre') => {
    if (!activeBlockId) return;
    updateBlockTag(activeBlockId, command);
    setCommandMenuOpen(false);
  };

  if (!project || !client) {
    return null;
  }

  return (
    <>
      <div className="w-full grid grid-cols-1 gap-6 pt-6">
        <header className="flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="h-10 w-10" asChild>
              <Link href="/dashboard/projects">
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="font-headline text-xl font-bold">{project.name}</h1>
              <p className="text-sm text-muted-foreground">{client.name}</p>
            </div>
             <div className="flex items-center gap-2">
                <Button onClick={() => router.push(`/dashboard/projects/${id}/report`)} variant="outline">
                  <File className="mr-2 h-4 w-4" /> {t[uiLanguage].report}
                </Button>
                 <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t[uiLanguage].confirmDeleteProjectTitle}</AlertDialogTitle>
                        <AlertDialogDescription>{t[uiLanguage].confirmDeleteProjectDesc}</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t[uiLanguage].cancel}</AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive hover:bg-destructive/90">{t[uiLanguage].delete}</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
          </div>
        </header>

        <div className="w-full px-4 sm:px-6">
          <Tabs defaultValue={searchParams.get('tab') || 'content'} className="w-full">
            <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="content">{t[uiLanguage].content}</TabsTrigger>
                  <TabsTrigger value="findings">{t[uiLanguage].findings}</TabsTrigger>
                  <TabsTrigger value="details">{t[uiLanguage].projectDetails}</TabsTrigger>
                </TabsList>
                 <Button onClick={() => handleSave(true)} disabled={saveStatus === 'saving' || saveStatus === 'saved'} variant="ghost" size="sm">
                    {saveStatus === 'saving' ? (<>{t[uiLanguage].saving}</>) : 
                     saveStatus === 'saved' ? (<><CheckCircle className="mr-2 h-4 w-4 text-green-500" />{t[uiLanguage].saved}</>) : 
                     (<>{t[uiLanguage].save}</>)}
                </Button>
            </div>
            
            <TabsContent value="findings" className="pt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{t[uiLanguage].findings}</CardTitle>
                    <Button asChild>
                      <Link href={`/dashboard/projects/${id}/findings/new`}>
                        <PlusCircle className="mr-2 h-4 w-4" /> {t[uiLanguage].newFinding}
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead onClick={() => requestSort('title')} className="cursor-pointer hover:bg-muted/50"><div className="flex items-center">{t[uiLanguage].findingTitle}{getSortIcon('title')}</div></TableHead>
                        <TableHead onClick={() => requestSort('severity')} className="cursor-pointer hover:bg-muted/50"><div className="flex items-center">{t[uiLanguage].severity}{getSortIcon('severity')}</div></TableHead>
                        <TableHead onClick={() => requestSort('cvss')} className="cursor-pointer hover:bg-muted/50"><div className="flex items-center">{t[uiLanguage].cvss}{getSortIcon('cvss')}</div></TableHead>
                        <TableHead onClick={() => requestSort('updatedAt')} className="cursor-pointer hover:bg-muted/50"><div className="flex items-center">{t[uiLanguage].lastUpdated}{getSortIcon('updatedAt')}</div></TableHead>
                        <TableHead className="text-right">{t[uiLanguage].actions}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedFindings.map(finding => (
                        <TableRow key={finding.id}>
                          <TableCell className="font-medium">
                             <Link href={`/dashboard/projects/${id}/findings/${finding.id}`} className="hover:text-primary">
                                {finding.title}
                             </Link>
                          </TableCell>
                          <TableCell><Badge variant={getSeverityVariant(finding.severity)}>{finding.severity}</Badge></TableCell>
                          <TableCell className="font-code">{finding.cvss.toFixed(1)}</TableCell>
                          <TableCell>{format(new Date(finding.updatedAt), 'PP', { locale: uiLanguage === 'es' ? es : undefined })}</TableCell>
                          <TableCell className="text-right">
                             <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" asChild>
                                    <Link href={`/dashboard/projects/${id}/findings/${finding.id}`}><Edit className="h-4 w-4" /></Link>
                                </Button>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive-foreground hover:bg-destructive" onClick={() => setFindingToDelete(finding)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                             </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="content" className="pt-6">
               <Card>
                  <CardHeader>
                     <CardTitle>{t[uiLanguage].content}</CardTitle>
                  </CardHeader>
                  <CardContent className="max-w-4xl mx-auto">
                     <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                            {blocks.map(block => (
                                <SortableBlock 
                                    key={block.id}
                                    block={block}
                                    onUpdate={(content) => handleBlockUpdate(block.id, content)}
                                    onKeyDown={(e) => handleKeyDown(e, block.id)}
                                    onAdd={handleAddBlock}
                                    onFocus={() => setActiveBlockId(block.id)}
                                    isFocused={activeBlockId === block.id}
                                    placeholder={t[projectLanguage as 'en' | 'es'].commandPlaceholder}
                                />
                            ))}
                        </SortableContext>
                     </DndContext>
                     <Popover open={commandMenuOpen} onOpenChange={setCommandMenuOpen}>
                            <PopoverTrigger asChild>
                                <div />
                            </PopoverTrigger>
                            <PopoverContent className="w-48 p-0">
                                <Command>
                                    <CommandInput placeholder="Search commands..." />
                                    <CommandList>
                                        <CommandEmpty>No commands found.</CommandEmpty>
                                        <CommandGroup heading="Elements">
                                            <CommandItem onSelect={() => handleCommandSelect('h2')}><Heading2 className="mr-2 h-4 w-4" />Title 2</CommandItem>
                                            <CommandItem onSelect={() => handleCommandSelect('h3')}><Heading3 className="mr-2 h-4 w-4" />Title 3</CommandItem>
                                            <CommandItem onSelect={() => handleCommandSelect('pre')}><Code className="mr-2 h-4 w-4" />Code Block</CommandItem>
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                  </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="details" className="pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t[uiLanguage].projectDetails}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t[uiLanguage].projectName}</Label>
                      <Input id="name" value={name} onChange={e => handleFieldChange(setName, e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="client">{t[uiLanguage].client}</Label>
                      <Select value={clientId} onValueChange={value => handleFieldChange(setClientId, value)}>
                        <SelectTrigger id="client"><SelectValue placeholder={t[uiLanguage].selectClient} /></SelectTrigger>
                        <SelectContent>
                          {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="status">{t[uiLanguage].status}</Label>
                      <Select value={status} onValueChange={(value: Project['status']) => handleFieldChange(setStatus, value)}>
                        <SelectTrigger id="status"><SelectValue placeholder={t[uiLanguage].selectStatus} /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="In Progress">{t[uiLanguage].inProgress}</SelectItem>
                          <SelectItem value="Completed">{t[uiLanguage].completed}</SelectItem>
                          <SelectItem value="On Hold">{t[uiLanguage].onHold}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>{t[uiLanguage].dates}</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                            <Button id="date" variant={"outline"} className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date?.from ? ( date.to ? (
                                    <>{format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}</>
                                ) : (format(date.from, "LLL dd, y"))
                                ) : (<span>Pick a date</span>)}
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar initialFocus mode="range" defaultMonth={date?.from} selected={date} onSelect={(newDate) => handleFieldChange(setDate, newDate)} numberOfMonths={2} />
                            </PopoverContent>
                        </Popover>
                    </div>
                  </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                      <Label htmlFor="language">{t[uiLanguage].language}</Label>
                      <Select value={projectLanguage} onValueChange={(value: 'en' | 'es') => handleFieldChange(setProjectLanguage, value)}>
                        <SelectTrigger id="language"><SelectValue placeholder={t[uiLanguage].selectLanguage} /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">{t[uiLanguage].english}</SelectItem>
                          <SelectItem value="es">{t[uiLanguage].spanish}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="icon">{t[uiLanguage].icon}</Label>
                      <Select value={icon} onValueChange={value => handleFieldChange(setIcon, value)}>
                        <SelectTrigger id="icon"><SelectValue placeholder={t[uiLanguage].selectIcon} /></SelectTrigger>
                        <SelectContent>
                           {iconOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <AlertDialog open={!!findingToDelete} onOpenChange={() => setFindingToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t[uiLanguage].confirmDeleteFindingTitle}</AlertDialogTitle>
            <AlertDialogDescription>{t[uiLanguage].confirmDeleteFindingDesc}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t[uiLanguage].cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteFinding} className="bg-destructive hover:bg-destructive/90">{t[uiLanguage].delete}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
