'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { ChevronLeft, Save, FileText, Scan, Globe, Network, Smartphone, Wifi, Award, Plus, Trash2, Rows, Bold, Italic, Code, List, ListOrdered, FileCode, GripVertical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/language-context';
import type { ProjectTemplate, ImageAsset } from '@/lib/types';
import { useData } from '@/context/data-context';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { HighlightingTextarea } from '@/components/ui/highlighting-textarea';
import { MarkdownPreview } from '@/components/markdown-preview';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Combobox } from '@/components/ui/combobox';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';


type ScopeView = 'edit' | 'split' | 'preview';

interface TemplateSection {
  id: string;
  content: string;
}

const languageOptions = [
    { value: 'bash', label: 'Bash' }, { value: 'c', label: 'C' }, { value: 'cpp', label: 'C++' }, { value: 'csharp', label: 'C#' }, { value: 'css', label: 'CSS' }, { value: 'diff', label: 'Diff' }, { value: 'go', label: 'Go' }, { value: 'graphql', label: 'GraphQL' }, { value: 'ini', label: 'INI' }, { value: 'java', label: 'Java' }, { value: 'javascript', label: 'JavaScript' }, { value: 'json', label: 'JSON' }, { value: 'kotlin', label: 'Kotlin' }, { value: 'less', label: 'Less' }, { value: 'lua', label: 'Lua' }, { value: 'makefile', label: 'Makefile' }, { value: 'markdown', label: 'Markdown' }, { value: 'objectivec', label: 'Objective-C' }, { value: 'perl', label: 'Perl' }, { value: 'php', label: 'PHP' }, { value: 'python', label: 'Python' }, { value: 'r', label: 'R' }, { value: 'ruby', label: 'Ruby' }, { value: 'rust', label: 'Rust' }, { value: 'scss', label: 'SCSS' }, { value: 'shell', label: 'Shell' }, { value: 'sql', label: 'SQL' }, { value: 'swift', label: 'Swift' }, { value: 'typescript', label: 'TypeScript' }, { value: 'vbnet', label: 'VB.Net' }, { value: 'wasm', label: 'WebAssembly' }, { value: 'xml', label: 'XML' }, { value: 'yaml', label: 'YAML' },
];

const CodeBlockDialog = ({ onInsert, children }: { onInsert: (lang: string, code: string) => void, children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState('bash');
  const [code, setCode] = useState('');
  const { language } = useLanguage();

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


const SortableSection = ({ section, isOrganizing, ...props }: { section: TemplateSection, isOrganizing: boolean, [key: string]: any }) => {
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
  section: TemplateSection;
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
  
  const applyMarkdownSyntax = (startSyntax: string, endSyntax = startSyntax) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = section.content.substring(start, end);
    const newContent =
      section.content.substring(0, start) +
      startSyntax +
      selectedText +
      endSyntax +
      section.content.substring(end);
    onContentChange(newContent);

    setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + startSyntax.length, end + startSyntax.length);
    }, 0);
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
    const codeBlock = '```' + lang + '\n' + code + '\n' + '```';
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent =
      section.content.substring(0, start) +
      codeBlock +
      section.content.substring(end);
    onContentChange(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + codeBlock.length, start + codeBlock.length);
    }, 0);
  };


  return (
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
                </div>
              )}
               <div className="p-0">
                  {view === 'split' && (
                      <div className="relative">
                          <ResizablePanelGroup direction="horizontal" className="min-h-[300px] rounded-lg">
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
                  )}
                  {view === 'edit' && (
                      <div>
                          <HighlightingTextarea
                              ref={textareaRef}
                              value={section.content}
                              onValueChange={(newContent) => onContentChange(newContent)}
                              onPaste={handlePaste}
                          />
                      </div>
                  )}
                  {view === 'preview' && (
                      <div className="rounded-md p-4 min-h-[300px] overflow-auto">
                          <MarkdownPreview content={section.content} getImage={getImage} />
                      </div>
                  )}
               </div>
          </div>
      )}
    </Card>
  )
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

export default function TemplateEditorPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { toast } = useToast();
  const { language } = useLanguage();
  const { projectTemplates, addProjectTemplate, updateProjectTemplate, getImage } = useData();
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const [isNew, setIsNew] = useState(id === 'new');
  const [template, setTemplate] = useState<Omit<ProjectTemplate, 'id'> | ProjectTemplate | null>(null);

  const [enSections, setEnSections] = useState<TemplateSection[]>([]);
  const [esSections, setEsSections] = useState<TemplateSection[]>([]);
  const [enSectionViews, setEnSectionViews] = useState<Record<string, ScopeView>>({});
  const [esSectionViews, setEsSectionViews] = useState<Record<string, ScopeView>>({});
  const [isEnOrganizing, setIsEnOrganizing] = useState(false);
  const [isEsOrganizing, setIsEsOrganizing] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string[]>(['details', 'en-content']);

  const parseContentToSections = useCallback((content: string): TemplateSection[] => {
    if (!content || typeof content !== 'string') return [];
    const parts = content.split(/\n\s*---\s*\n/);
    return parts.map((part, index) => ({
      id: `section-${index}-${Date.now()}-${Math.random()}`,
      content: part.trim()
    })).filter(p => p.content.trim() !== '');
  }, []);

  useEffect(() => {
    if (isNew) {
      const newTemplate = {
        name_en: '', name_es: '', description_en: '', description_es: '',
        scope_en: '## Scope\n\n[TODO: Define scope]', 
        scope_es: '## Alcance\n\n[TODO: Definir alcance]', 
        appendix_en: '### Appendix A\n\n[TODO: Add appendix]', 
        appendix_es: '### Apéndice A\n\n[TODO: Añadir apéndice]', 
        icon: 'FileText'
      };
      setTemplate(newTemplate);
      const initialEnSections = [...parseContentToSections(newTemplate.scope_en), ...parseContentToSections(newTemplate.appendix_en)];
      const initialEsSections = [...parseContentToSections(newTemplate.scope_es), ...parseContentToSections(newTemplate.appendix_es)];
      setEnSections(initialEnSections);
      setEsSections(initialEsSections);
    } else {
      const existingTemplate = projectTemplates.find(t => t.id === id);
      if (existingTemplate) {
        setTemplate(JSON.parse(JSON.stringify(existingTemplate)));
        const fullEnContent = `${existingTemplate.scope_en}\n\n---\n\n${existingTemplate.appendix_en || ''}`;
        const fullEsContent = `${existingTemplate.scope_es}\n\n---\n\n${existingTemplate.appendix_es || ''}`;
        setEnSections(parseContentToSections(fullEnContent));
        setEsSections(parseContentToSections(fullEsContent));
      } else {
        toast({ variant: 'destructive', title: 'Template not found' });
        router.push('/dashboard/templates');
      }
    }
  }, [id, isNew, projectTemplates, router, toast, parseContentToSections]);

  const handleInputChange = (field: keyof Omit<ProjectTemplate, 'id'>, value: string) => {
    setTemplate(prev => prev ? { ...prev, [field]: value } : null);
  };
  
  const handleSave = () => {
    if (!template) return;
    
    if (!template.name_en || !template.name_es) {
        toast({ variant: 'destructive', title: 'Missing required fields', description: 'Please provide a name for the template in both English and Spanish.' });
        return;
    }

    const [scope_en, ...appendix_en_parts] = enSections.map(s => s.content).join('\n\n---\n\n').split('### A. ');
    const appendix_en = appendix_en_parts.length > 0 ? '### A. ' + appendix_en_parts.join('### A. ') : '';

    const [scope_es, ...appendix_es_parts] = esSections.map(s => s.content).join('\n\n---\n\n').split('### A. ');
    const appendix_es = appendix_es_parts.length > 0 ? '### A. ' + appendix_es_parts.join('### A. ') : '';

    const finalTemplate = { ...template, scope_en, appendix_en, scope_es, appendix_es };

    if (isNew) {
      addProjectTemplate(finalTemplate as Omit<ProjectTemplate, 'id'>);
      toast({ title: 'Template Created', description: `The "${template.name_en}" template has been created.` });
    } else {
      updateProjectTemplate(finalTemplate as ProjectTemplate);
      toast({ title: 'Template Updated', description: `The "${template.name_en}" template has been updated.` });
    }
    router.push('/dashboard/templates');
  };

  const t = {
    en: {
        back: 'Back to Templates',
        save: 'Save Template',
        create: 'Create Template',
        newTitle: 'New Project Template',
        editTitle: 'Edit Project Template',
        newDescription: 'Create a new reusable project template.',
        editDescription: 'Modify an existing project template.',
        nameEn: 'Name (English)',
        nameEs: 'Name (Spanish)',
        descEn: 'Description (English)',
        descEs: 'Description (Spanish)',
        icon: 'Icon',
        selectIcon: 'Select an icon',
        englishContent: 'English Content',
        spanishContent: 'Spanish Content',
        newSection: 'New Section',
        addNewSection: 'Add New Section',
        organizeSections: 'Organize Sections',
        finishOrganizing: 'Finish Organizing',
    },
    es: {
        back: 'Volver a Plantillas',
        save: 'Guardar Plantilla',
        create: 'Crear Plantilla',
        newTitle: 'Nueva Plantilla de Proyecto',
        editTitle: 'Editar Plantilla de Proyecto',
        newDescription: 'Crea una nueva plantilla de proyecto reutilizable.',
        editDescription: 'Modifica una plantilla de proyecto existente.',
        nameEn: 'Nombre (Inglés)',
        nameEs: 'Nombre (Español)',
        descEn: 'Descripción (Inglés)',
        descEs: 'Descripción (Español)',
        icon: 'Icono',
        selectIcon: 'Selecciona un icono',
        englishContent: 'Contenido en Inglés',
        spanishContent: 'Contenido en Español',
        newSection: 'Nueva Sección',
        addNewSection: 'Añadir Nueva Sección',
        organizeSections: 'Organizar Secciones',
        finishOrganizing: 'Finalizar Organización',
    },
  };

  const handleSectionChange = (lang: 'en' | 'es', sectionId: string, newContent: string) => {
    const updater = lang === 'en' ? setEnSections : setEsSections;
    updater(prev => prev.map(s => s.id === sectionId ? { ...s, content: newContent } : s));
  };

  const handleTitleChange = (lang: 'en' | 'es', sectionId: string, newTitle: string) => {
    const updater = lang === 'en' ? setEnSections : setEsSections;
    updater(prev => prev.map(sec => {
        if (sec.id === sectionId) {
            const oldContent = sec.content;
            const contentWithoutTitle = oldContent.replace(/^(#{2,4}) .*\n?/, '');
            const newContent = `### ${newTitle}\n${contentWithoutTitle}`;
            return { ...sec, content: newContent };
        }
        return sec;
    }));
  }

  const handleAddSection = (lang: 'en' | 'es') => {
    const newSection: TemplateSection = { id: `new-${lang}-${Date.now()}`, content: `### ${t[language].newSection}` };
    if (lang === 'en') {
        setEnSections(prev => [...prev, newSection]);
        setEnSectionViews(prev => ({ ...prev, [newSection.id]: 'edit' }));
    } else {
        setEsSections(prev => [...prev, newSection]);
        setEsSectionViews(prev => ({ ...prev, [newSection.id]: 'edit' }));
    }
  };

  const handleDeleteSection = (lang: 'en' | 'es', sectionId: string) => {
    if (lang === 'en') {
        setEnSections(prev => prev.filter(s => s.id !== sectionId));
    } else {
        setEsSections(prev => prev.filter(s => s.id !== sectionId));
    }
  };

  const handleDragEnd = (event: DragEndEvent, lang: 'en' | 'es') => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
        const updater = lang === 'en' ? setEnSections : setEsSections;
        updater((items) => {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);
            return arrayMove(items, oldIndex, newIndex);
        });
    }
  };
  
    const handleOrganizeClick = (lang: 'en' | 'es') => {
    const accordionValue = lang === 'en' ? 'en-content' : 'es-content';
    if (!activeAccordion.includes(accordionValue)) {
      setActiveAccordion(prev => [...prev, accordionValue]);
    }

    if (lang === 'en') {
      setIsEnOrganizing(!isEnOrganizing);
    } else {
      setIsEsOrganizing(!isEsOrganizing);
    }
  };

  if (!template) {
    return null; // or loading state
  }

  return (
    <div className="space-y-6">
       <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/templates">
              <ChevronLeft className="mr-2 h-4 w-4" />
              {t[language].back}
            </Link>
          </Button>
          <div>
            <h1 className="font-headline text-xl font-bold">{isNew ? t[language].newTitle : t[language].editTitle}</h1>
            <p className="text-sm text-muted-foreground">{isNew ? t[language].newDescription : t[language].editDescription}</p>
          </div>
        </div>
        <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" /> {isNew ? t[language].create : t[language].save}</Button>
      </header>
       <Accordion type="multiple" className="w-full space-y-6" defaultValue={['details']} value={activeAccordion} onValueChange={setActiveAccordion}>
          <AccordionItem value="details" className="border bg-card rounded-lg">
            <AccordionTrigger className="p-4 hover:no-underline"><span className="font-semibold text-base">Details</span></AccordionTrigger>
            <AccordionContent className="p-4 pt-0">
               <div className="space-y-4 pt-4 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name_en">{t[language].nameEn}</Label>
                        <Input id="name_en" value={template.name_en} onChange={e => handleInputChange('name_en', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="name_es">{t[language].nameEs}</Label>
                        <Input id="name_es" value={template.name_es} onChange={e => handleInputChange('name_es', e.target.value)} />
                    </div>
                  </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="description_en">{t[language].descEn}</Label>
                        <Textarea id="description_en" value={template.description_en} onChange={e => handleInputChange('description_en', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description_es">{t[language].descEs}</Label>
                        <Textarea id="description_es" value={template.description_es} onChange={e => handleInputChange('description_es', e.target.value)} />
                    </div>
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="icon">{t[language].icon}</Label>
                    <Select value={template.icon} onValueChange={value => handleInputChange('icon', value)}>
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
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="en-content" className="border bg-card rounded-lg">
            <AccordionTrigger className="p-4 hover:no-underline" onClick={(e) => { e.stopPropagation(); setActiveAccordion(prev => prev.includes('en-content') ? prev.filter(item => item !== 'en-content') : [...prev, 'en-content'])}}>
                <div className="flex w-full items-center justify-between">
                    <span className="font-semibold text-base flex-1 text-left">{t[language].englishContent}</span>
                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleOrganizeClick('en'); }} className="mr-2">
                      <Rows className="mr-2 h-4 w-4" />
                      {isEnOrganizing ? t[language].finishOrganizing : t[language].organizeSections}
                    </Button>
                </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 pt-0">
               <div className="space-y-4 pt-4 border-t">
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'en')}>
                    <SortableContext items={enSections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-4">
                        {enSections.map(section => (
                          <SortableSection
                            key={section.id}
                            section={section}
                            isOrganizing={isEnOrganizing}
                            onContentChange={(newContent: string) => handleSectionChange('en', section.id, newContent)}
                            onTitleChange={(newTitle: string) => handleTitleChange('en', section.id, newTitle)}
                            onDelete={() => handleDeleteSection('en', section.id)}
                            view={enSectionViews[section.id] || 'split'}
                            onViewChange={(newView: ScopeView) => setEnSectionViews(prev => ({ ...prev, [section.id]: newView }))}
                            getImage={getImage}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                  {!isEnOrganizing && (
                    <div className="flex justify-center pt-4">
                      <Button variant="outline" onClick={() => handleAddSection('en')}>
                        <Plus className="mr-2 h-4 w-4" />
                        {t[language].addNewSection}
                      </Button>
                    </div>
                  )}
                </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="es-content" className="border bg-card rounded-lg">
            <AccordionTrigger className="p-4 hover:no-underline" onClick={(e) => { e.stopPropagation(); setActiveAccordion(prev => prev.includes('es-content') ? prev.filter(item => item !== 'es-content') : [...prev, 'es-content'])}}>
               <div className="flex w-full items-center justify-between">
                  <span className="font-semibold text-base flex-1 text-left">{t[language].spanishContent}</span>
                  <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleOrganizeClick('es'); }} className="mr-2">
                      <Rows className="mr-2 h-4 w-4" />
                      {isEsOrganizing ? t[language].finishOrganizing : t[language].organizeSections}
                  </Button>
                </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 pt-0">
               <div className="space-y-4 pt-4 border-t">
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'es')}>
                    <SortableContext items={esSections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-4">
                        {esSections.map(section => (
                          <SortableSection
                            key={section.id}
                            section={section}
                            isOrganizing={isEsOrganizing}
                            onContentChange={(newContent: string) => handleSectionChange('es', section.id, newContent)}
                            onTitleChange={(newTitle: string) => handleTitleChange('es', section.id, newTitle)}
                            onDelete={() => handleDeleteSection('es', section.id)}
                            view={esSectionViews[section.id] || 'split'}
                            onViewChange={(newView: ScopeView) => setEsSectionViews(prev => ({ ...prev, [section.id]: newView }))}
                            getImage={getImage}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                  {!isEsOrganizing && (
                    <div className="flex justify-center pt-4">
                      <Button variant="outline" onClick={() => handleAddSection('es')}>
                        <Plus className="mr-2 h-4 w-4" />
                        {t[language].addNewSection}
                      </Button>
                    </div>
                  )}
                </div>
            </AccordionContent>
          </AccordionItem>
       </Accordion>
    </div>
  );
}
