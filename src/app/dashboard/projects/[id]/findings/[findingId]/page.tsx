

'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { ChevronLeft, Save, Plus, GripVertical, Rows, Bold, Italic, Code, List, ListOrdered, FileCode, Trash2, CheckCircle, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/language-context';
import type { Vulnerability, Finding, Project, ImageAsset, Severity } from '@/lib/types';
import { useData } from '@/context/data-context';
import { Combobox } from '@/components/ui/combobox';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { HighlightingTextarea } from '@/components/ui/highlighting-textarea';
import { MarkdownPreview } from '@/components/markdown-preview';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ImageUploadDialog } from '@/components/image-upload-dialog';

type ScopeView = 'edit' | 'split' | 'preview';
type SaveStatus = 'unsaved' | 'saving' | 'saved';

interface FindingSection {
  id: string;
  content: string;
}

const CodeBlockDialog = ({ onInsert, children }: { onInsert: (lang: string, code: string) => void, children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState('bash');
  const [code, setCode] = useState('');
  const { language } = useLanguage();

  const languageOptions = [
      { value: 'bash', label: 'Bash' },
      { value: 'c', label: 'C' },
      { value: 'cpp', label: 'C++' },
      { value: 'csharp', label: 'C#' },
      { value: 'css', label: 'CSS' },
      { value: 'diff', label: 'Diff' },
      { value: 'go', label: 'Go' },
      { value: 'graphql', label: 'GraphQL' },
      { value: 'ini', label: 'INI' },
      { value: 'java', label: 'Java' },
      { value: 'javascript', label: 'JavaScript' },
      { value: 'json', label: 'JSON' },
      { value: 'kotlin', label: 'Kotlin' },
      { value: 'less', label: 'Less' },
      { value: 'lua', label: 'Lua' },
      { value: 'makefile', label: 'Makefile' },
      { value: 'markdown', label: 'Markdown' },
      { value: 'objectivec', label: 'Objective-C' },
      { value: 'perl', label: 'Perl' },
      { value: 'php', label: 'PHP' },
      { value: 'python', label: 'Python' },
      { value: 'r', label: 'R' },
      { value: 'ruby', label: 'Ruby' },
      { value: 'rust', label: 'Rust' },
      { value: 'scss', label: 'SCSS' },
      { value: 'shell', label: 'Shell' },
      { value: 'sql', label: 'SQL' },
      { value: 'swift', label: 'Swift' },
      { value: 'typescript', label: 'TypeScript' },
      { value: 'vbnet', label: 'VB.Net' },
      { value: 'wasm', label: 'WebAssembly' },
      { value: 'xml', label: 'XML' },
      { value: 'yaml', label: 'YAML' },
  ];

  const t = {
    en: { title: 'Insert Code Block', langLabel: 'Language', codeLabel: 'Code', insertBtn: 'Insert', searchLanguage: 'Search language...' },
    es: { title: 'Insertar Bloque de Código', langLabel: 'Lenguaje', codeLabel: 'Código', insertBtn: 'Insertar', searchLanguage: 'Buscar lenguaje...' },
  }

  const handleInsert = () => {
    onInsert(lang, code);
    setOpen(false);
    setCode('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t[language].title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="lang-select">{t[language].langLabel}</Label>
            <Combobox
                options={languageOptions}
                selectedValue={lang}
                onSelect={setLang}
                placeholder={t[language].searchLanguage}
                searchPlaceholder={t[language].searchLanguage}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="code-input">{t[language].codeLabel}</Label>
            <Textarea id="code-input" value={code} onChange={e => setCode(e.target.value)} className="min-h-[200px] font-code" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleInsert}>{t[language].insertBtn}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


const SortableSection = ({ section, isOrganizing, ...props }: { section: FindingSection, isOrganizing: boolean, [key: string]: any }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  
  return (
    <div ref={setNodeRef} style={style}>
      <SectionEditor section={section} isOrganizing={isOrganizing} dragHandleProps={attributes} dragListeners={listeners} {...props} />
    </div>
  );
};

const SectionEditor = ({ section, onContentChange, onDelete, view, onViewChange, onTitleChange, isOrganizing, getImage, dragHandleProps, dragListeners }: {
  section: FindingSection;
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
  
  const headingMatch = section.content.match(/^(#{2,4}) (.*)/);
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
                        insertMarkdown(markdownImage);
                    }
                };
                reader.readAsDataURL(blob);
            }
            e.preventDefault();
        }
    }
  };
  
  const insertMarkdown = (markdown: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent =
      section.content.substring(0, start) +
      markdown +
      section.content.substring(end);
    onContentChange(newContent);

    setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + markdown.length, start + markdown.length);
    }, 0);
  };
  
  const applyMarkdownSyntax = (startSyntax: string, endSyntax = startSyntax) => {
    const selectedText = window.getSelection()?.toString() || '';
    insertMarkdown(startSyntax + selectedText + endSyntax);
  };

  const applyListSyntax = (type: 'bullet' | 'number') => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = section.content.substring(start, end);
      const lines = selectedText.split('\n');

      const newList = lines.map((line, index) => {
          if (type === 'bullet') return `- ${line}`;
          return `${index + 1}. ${line}`;
      }).join('\n');

      const newContent =
          section.content.substring(0, start) +
          newList +
          section.content.substring(end);
      onContentChange(newContent);
      setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start, start + newList.length);
      }, 0);
  };
  
  const handleInsertCode = (lang: string, code: string) => {
    const codeBlock = `\`\`\`${lang}\n${code}\n\`\`\``;
    insertMarkdown(codeBlock);
  };


  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between bg-muted/50 px-4 py-3">
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
             <div className="border-t">
                {view !== 'preview' && (
                  <div className="p-1 border-b flex gap-1">
                    <Button variant="ghost" size="icon" className="h-auto w-auto p-1" onClick={() => applyMarkdownSyntax('**')}><Bold className="h-3 w-3" /></Button>
                    <Button variant="ghost" size="icon" className="h-auto w-auto p-1" onClick={() => applyMarkdownSyntax('*')}><Italic className="h-3 w-3" /></Button>
                    <Button variant="ghost" size="icon" className="h-auto w-auto p-1" onClick={() => applyMarkdownSyntax('`')}><Code className="h-3 w-3" /></Button>
                    <Button variant="ghost" size="icon" className="h-auto w-auto p-1" onClick={() => applyListSyntax('bullet')}><List className="h-3 w-3" /></Button>
                    <Button variant="ghost" size="icon" className="h-auto w-auto p-1" onClick={() => applyListSyntax('number')}><ListOrdered className="h-3 w-3" /></Button>
                    <CodeBlockDialog onInsert={handleInsertCode}>
                      <Button variant="ghost" size="icon" className="h-auto w-auto p-1"><FileCode className="h-3 w-3" /></Button>
                    </CodeBlockDialog>
                    <ImageUploadDialog onInsert={insertMarkdown}>
                       <Button variant="ghost" size="icon" className="h-auto w-auto p-1"><Image className="h-3 w-3" /></Button>
                    </ImageUploadDialog>
                  </div>
                )}
                 <div className="p-0">
                    {view === 'split' ? (
                        <div className="relative">
                            <ResizablePanelGroup direction="horizontal" className="min-h-[300px] w-full rounded-lg border">
                                <ResizablePanel defaultSize={50}>
                                    <div className="h-full">
                                    <HighlightingTextarea
                                        ref={textareaRef}
                                        value={section.content}
                                        onValueChange={(newContent) => onContentChange(newContent)}
                                        onPaste={handlePaste}
                                    />
                                    </div>
                                </ResizablePanel>
                                <ResizableHandle withHandle />
                                <ResizablePanel defaultSize={50}>
                                <div className="h-full overflow-auto rounded-md p-4">
                                    <MarkdownPreview content={section.content} getImage={getImage} />
                                </div>
                                </ResizablePanel>
                            </ResizablePanelGroup>
                        </div>
                    ) : view === 'edit' ? (
                        <div>
                            <HighlightingTextarea
                                ref={textareaRef}
                                value={section.content}
                                onValueChange={(newContent) => onContentChange(newContent)}
                                onPaste={handlePaste}
                            />
                        </div>
                    ) : (
                        <div className="rounded-md p-4 min-h-[300px] overflow-auto">
                            <MarkdownPreview content={section.content} getImage={getImage} />
                        </div>
                    )}
                 </div>
            </div>
        )}
      </Card>
    </>
  )
}

export default function FindingEditorPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id: projectId, findingId } = params;
  const { toast } = useToast();
  const { language: uiLanguage } = useLanguage();
  const { projects, clients, findings, vulnerabilities, addFinding, updateFinding, getImage } = useData();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const [finding, setFinding] = useState<Omit<Finding, 'id' | 'createdAt' | 'updatedAt'> | null>(null);

  const [project, setProject] = useState<Project | undefined>();
  const [projectLanguage, setProjectLanguage] = useState<Project['language']>('en');
  
  const [sections, setSections] = useState<FindingSection[]>([]);
  const [sectionViews, setSectionViews] = useState<Record<string, ScopeView>>({});
  const [isOrganizing, setIsOrganizing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');

  const client = clients.find(c => c.id === project?.clientId);

  const parseMarkdownToSections = useCallback((markdown: string): FindingSection[] => {
    if (!markdown) return [];
    
    const parts = markdown.split(/\n\s*---\s*\n/);
    
    return parts
      .map((part, index) => {
        return {
          id: `section-${index}-${Date.now()}`,
          content: part.trim()
        };
      })
      .filter(p => p.content.trim() !== '');
  }, []);

  useEffect(() => {
    const currentProject = projects.find(p => p.id === projectId);
    setProject(currentProject);
    if(currentProject){
      setProjectLanguage(currentProject.language)
    }
    
    if (findingId !== 'new') {
      const currentFinding = findings.find(f => f.id === findingId && f.projectId === projectId);
      if (currentFinding) {
        setFinding({
          title: currentFinding.title,
          severity: currentFinding.severity,
          cvss: currentFinding.cvss,
          markdown: currentFinding.markdown,
          projectId: currentFinding.projectId
        });
        const initialSections = parseMarkdownToSections(currentFinding.markdown);
        setSections(initialSections);
        setSectionViews(initialSections.reduce((acc, sec) => ({ ...acc, [sec.id]: 'split' }), {}));
      } else {
        router.push(`/dashboard/projects/${projectId}`);
      }
    } else {
        setFinding({
            title: projectLanguage === 'es' ? 'Nuevo Hallazgo' : 'New Finding',
            severity: 'Informational',
            cvss: 0,
            markdown: '',
            projectId: Array.isArray(projectId) ? projectId[0] : projectId,
        });
      setSections([]);
    }
  }, [findingId, projectId, projectLanguage, findings, router, projects, parseMarkdownToSections]);

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      const decodedHash = decodeURIComponent(hash);
      setTimeout(() => {
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        const targetHeading = headings.find(h => {
          const id = h.textContent?.trim().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '') || '';
          return id === decodedHash;
        });

        if (targetHeading) {
          targetHeading.scrollIntoView({ behavior: 'smooth', block: 'start' });
          const card = targetHeading.closest('.flashable-card');
          if (card) {
            card.classList.add('flash-highlight');
            setTimeout(() => card.classList.remove('flash-highlight'), 2000);
          }
        }
      }, 500); 
    }
  }, [sections]);

  useEffect(() => {
    if (saveStatus === 'unsaved') {
      const handler = setTimeout(() => {
        handleSave(false);
      }, 2000);
      return () => clearTimeout(handler);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finding, sections, saveStatus]);


  const handleSave = (showToast = true) => {
    if (!finding || !finding.title || !finding.severity) {
        if (showToast) {
            toast({
                variant: 'destructive',
                title: uiLanguage === 'es' ? 'Campos Incompletos' : 'Incomplete Fields',
                description: uiLanguage === 'es' ? 'Por favor, rellena todos los detalles del hallazgo.' : 'Please fill in all finding details.',
            });
        }
      return;
    }
    
    setSaveStatus('saving');
    const markdownContent = sections.map(s => s.content).join('\n\n---\n\n');

    const findingData = {
      ...finding,
      markdown: markdownContent,
    };

    if (findingId === 'new') {
      addFinding(findingData);
      if (showToast) toast({ title: t[uiLanguage].saveSuccessTitle, description: `${finding.title} ${t[uiLanguage].saveSuccessNew}` });
      router.push(`/dashboard/projects/${projectId}`);
    } else {
      updateFinding({
        id: Array.isArray(findingId) ? findingId[0] : findingId,
        ...findingData,
      });
      if (showToast) toast({ title: t[uiLanguage].saveSuccessTitle, description: `${finding.title} ${t[uiLanguage].saveSuccessUpdate}` });
    }
    
    setTimeout(() => setSaveStatus('saved'), 500);
  };
  
  const handleFieldChange = (field: keyof Omit<Finding, 'id'|'createdAt'|'updatedAt'>, value: any) => {
    setFinding(prev => prev ? {...prev, [field]: value} : null);
    setSaveStatus('unsaved');
  }

  const handleSectionContentChange = (sectionId: string, newContent: string) => {
    setSections(prevSections =>
      prevSections.map(sec => sec.id === sectionId ? { ...sec, content: newContent } : sec)
    );
    setSaveStatus('unsaved');
  };
  
  const handleSectionTitleChange = (sectionId: string, newTitle: string) => {
    setSections(prevSections =>
      prevSections.map(sec => {
        if (sec.id === sectionId) {
            const oldContent = sec.content;
            const contentWithoutTitle = oldContent.replace(/^(#{2,4}) .*\n?/, '');
            const newContent = `### ${newTitle}\n${contentWithoutTitle}`;
            return { ...sec, content: newContent };
        }
        return sec;
      })
    );
    setSaveStatus('unsaved');
  }

  const handleAddSection = () => {
    const newSection: FindingSection = {
        id: `section-new-${Date.now()}`,
        content: '### ' + t[uiLanguage].newSection
    };
    setSections(prev => [...prev, newSection]);
    setSectionViews(prev => ({ ...prev, [newSection.id]: 'edit' }));
    setSaveStatus('unsaved');
  };

  const handleDeleteSection = (sectionId: string) => {
      setSections(prev => prev.filter(sec => sec.id !== sectionId));
      setSectionViews(prev => {
          const newViews = { ...prev };
          delete newViews[sectionId];
          return newViews;
      });
      setSaveStatus('unsaved');
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        setSaveStatus('unsaved');
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  const handleSeverityChange = (newSeverity: Severity) => {
    handleFieldChange('severity', newSeverity);
    let newCvss = 0.0;
    switch (newSeverity) {
        case 'Critical': newCvss = 9.5; break;
        case 'High': newCvss = 8.5; break;
        case 'Medium': newCvss = 5.5; break;
        case 'Low': newCvss = 2.5; break;
        case 'Informational': newCvss = 0.0; break;
    }
    handleFieldChange('cvss', newCvss);
  }

  const getSeverityVariant = (severity: string): 'destructive' | 'high' | 'medium' | 'low' | 'secondary' => {
    switch (severity) {
      case 'Critical': return 'destructive';
      case 'High': return 'high';
      case 'Medium': return 'medium';
      case 'Low': return 'low';
      default: return 'secondary';
    }
  }


  const t = {
    en: {
      backToProject: 'Back to Project',
      saveFinding: 'Save Finding',
      saving: 'Saving...',
      saved: 'Saved',
      findingDetails: 'Finding Details',
      importFromDB: 'Import from Database',
      selectTemplate: 'Select a vulnerability template',
      titleLabel: 'Title',
      severityLabel: 'Severity',
      selectSeverity: 'Select severity',
      critical: 'Critical',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      informational: 'Informational',
      cvssScore: 'CVSS Score',
      overview: 'Overview',
      technicalDescription: 'Technical Description',
      affectedComponents: 'Affected Components',
      impact: 'Impact',
      recommendations: 'Recommendations',
      details: 'Details (PoC, Evidence)',
      content: 'Content',
      saveSuccessTitle: 'Finding Saved',
      saveSuccessNew: 'has been created.',
      saveSuccessUpdate: 'has been updated.',
      addNewSection: 'Add New Section',
      newSection: 'New Section',
      organizeSections: 'Organize Sections',
      finishOrganizing: 'Finish Organizing',
      searchVulnerability: 'Search vulnerability...'
    },
    es: {
      backToProject: 'Volver al Proyecto',
      saveFinding: 'Guardar Hallazgo',
      saving: 'Guardando...',
      saved: 'Guardado',
      findingDetails: 'Detalles del Hallazgo',
      importFromDB: 'Importar desde Base de Datos',
      selectTemplate: 'Seleccionar una plantilla de vulnerabilidad',
      titleLabel: 'Título',
      severityLabel: 'Severidad',
      selectSeverity: 'Seleccionar severidad',
      critical: 'Crítica',
      high: 'Alta',
      medium: 'Media',
      low: 'Baja',
      informational: 'Informativa',
      cvssScore: 'Puntuación CVSS',
      overview: 'Resumen',
      technicalDescription: 'Descripción Técnica',
      affectedComponents: 'Componentes Afectados',
      impact: 'Impacto',
      recommendations: 'Recomendaciones',
      details: 'Detalles (PoC, Evidencia)',
      content: 'Contenido',
      saveSuccessTitle: 'Hallazgo Guardado',
      saveSuccessNew: 'ha sido creado.',
      saveSuccessUpdate: 'ha sido actualizado.',
      addNewSection: 'Añadir Nueva Sección',
      newSection: 'Nueva Sección',
      organizeSections: 'Organizar Secciones',
      finishOrganizing: 'Finalizar Organización',
      searchVulnerability: 'Buscar vulnerabilidad...'
    }
  }

  const getVulnTitle = (vuln: Vulnerability) => {
    return projectLanguage === 'es' ? vuln.title_es : vuln.title_en;
  }
  
  const vulnerabilityOptions = useMemo(() => vulnerabilities.map(v => ({
      value: v.id,
      label: getVulnTitle(v),
  })), [vulnerabilities, projectLanguage, getVulnTitle]);


  const handleImport = (vulnId: string) => {
    const vuln = vulnerabilities.find(v => v.id === vulnId);
    if (vuln) {
      handleFieldChange('title', getVulnTitle(vuln));
      handleSeverityChange(vuln.severity);
      
      const langT = t[projectLanguage];
      const newSections: FindingSection[] = [
        { id: `sec-overview-${Date.now()}`, content: `${projectLanguage === 'es' ? vuln.overview_es : vuln.overview_en}` },
        { id: `sec-tech-${Date.now()}`, content: `${projectLanguage === 'es' ? vuln.technicalDescription_es : vuln.technicalDescription_en}` },
        { id: `sec-affected-${Date.now()}`, content: `${projectLanguage === 'es' ? vuln.affectedComponents_es : vuln.affectedComponents_en}` },
        { id: `sec-impact-${Date.now()}`, content: `${projectLanguage === 'es' ? vuln.impact_es : vuln.impact_en}` },
        { id: `sec-recom-${Date.now()}`, content: `${projectLanguage === 'es' ? vuln.recommendations_es : vuln.recommendations_en}` },
        { id: `sec-details-${Date.now()}`, content: `${projectLanguage === 'es' ? vuln.details_es : vuln.details_en}` },
      ];
      
      setSections(newSections);
      setSectionViews(newSections.reduce((acc, sec) => ({ ...acc, [sec.id]: 'split' }), {}));
      setSaveStatus('unsaved');
    }
  }


  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="h-10 w-10" asChild>
            <Link href={`/dashboard/projects/${projectId}`}>
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="font-headline text-xl font-bold">{finding?.title || (projectLanguage === 'es' ? 'Nuevo Hallazgo' : 'New Finding')}</h1>
            <p className="text-sm text-muted-foreground">{project?.name} / {client?.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsOrganizing(!isOrganizing)}>
                <Rows className="mr-2 h-4 w-4" />
                {isOrganizing ? t[uiLanguage].finishOrganizing : t[uiLanguage].organizeSections}
            </Button>
          <Button onClick={() => handleSave(true)} disabled={saveStatus === 'saving' || saveStatus === 'saved'}>
            {saveStatus === 'saving' ? (<><Save className="mr-2 h-4 w-4 animate-spin" />{t[uiLanguage].saving}</>) : 
             saveStatus === 'saved' ? (<><CheckCircle className="mr-2 h-4 w-4" />{t[uiLanguage].saved}</>) : 
             (<><Save className="mr-2 h-4 w-4" />{t[uiLanguage].saveFinding}</>)}
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 w-full max-w-full overflow-x-hidden flex-shrink-0">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t[uiLanguage].findingDetails}</CardTitle>
              {finding?.severity && <Badge variant={getSeverityVariant(finding.severity)}>{finding.severity}</Badge>}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">{t[uiLanguage].titleLabel}</Label>
                    <Input id="title" value={finding?.title || ''} onChange={e => handleFieldChange('title', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t[uiLanguage].importFromDB}</Label>
                    <Combobox
                        options={vulnerabilityOptions}
                        selectedValue=""
                        onSelect={handleImport}
                        placeholder={t[uiLanguage].selectTemplate}
                        searchPlaceholder={t[uiLanguage].searchVulnerability}
                    />
                  </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="severity">{t[uiLanguage].severityLabel}</Label>
                  <Select value={finding?.severity} onValueChange={(value) => handleSeverityChange(value as Severity)}>
                    <SelectTrigger id="severity">
                      <SelectValue placeholder={t[uiLanguage].selectSeverity} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Critical">{t[uiLanguage].critical}</SelectItem>
                      <SelectItem value="High">{t[uiLanguage].high}</SelectItem>
                      <SelectItem value="Medium">{t[uiLanguage].medium}</SelectItem>
                      <SelectItem value="Low">{t[uiLanguage].low}</SelectItem>
                      <SelectItem value="Informational">{t[uiLanguage].informational}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvss">{t[uiLanguage].cvssScore}</Label>
                  <Input id="cvss" type="number" step="0.1" value={finding?.cvss || 0} onChange={e => handleFieldChange('cvss', parseFloat(e.target.value))} />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-4">
                    {sections.map(section => {
                       return (
                          <div key={section.id} className="flashable-card">
                              <SortableSection
                                section={section}
                                isOrganizing={isOrganizing}
                                onContentChange={(newContent: string) => handleSectionContentChange(section.id, newContent)}
                                onTitleChange={(newTitle: string) => handleSectionTitleChange(section.id, newTitle)}
                                onDelete={() => handleDeleteSection(section.id)}
                                view={sectionViews[section.id] || 'split'}
                                onViewChange={(newView: ScopeView) => setSectionViews(prev => ({ ...prev, [section.id]: newView }))}
                                getImage={getImage}
                              />
                          </div>
                       );
                    })}
                  </div>
                </SortableContext>
              </DndContext>

              {!isOrganizing && (
                <div className="flex justify-center pt-4">
                    <Button variant="outline" onClick={handleAddSection}>
                        <Plus className="mr-2 h-4 w-4" />
                        {t[uiLanguage].addNewSection}
                    </Button>
                </div>
              )}
          </div>
      </div>
    </div>
  );
}
