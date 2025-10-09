
'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { ChevronLeft, Save, GripVertical, Plus, Trash2, Rows, Bold, Italic, Code, List, ListOrdered, FileCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/language-context';
import type { Vulnerability, CVSS, Remediation, ImageAsset } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useData } from '@/context/data-context';
import { Badge } from '@/components/ui/badge';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { HighlightingTextarea } from '@/components/ui/highlighting-textarea';
import { MarkdownPreview } from '@/components/markdown-preview';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Combobox } from '@/components/ui/combobox';

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


type ScopeView = 'edit' | 'split' | 'preview';
interface FindingSection {
  id: string;
  content: string;
}

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
    const codeBlock = `\`\`\`${lang}\n${code}\n\`\`\``;
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
    </>
  )
}

const vulnerabilityCategories = [
    { value: 'Web', label_en: 'Web', label_es: 'Web' },
    { value: 'Mobile', label_en: 'Mobile', label_es: 'Móvil' },
    { value: 'Network', label_en: 'Network', label_es: 'Red' },
    { value: 'Infrastructure', label_en: 'Infrastructure', label_es: 'Infraestructura' },
    { value: 'Authentication', label_en: 'Authentication', label_es: 'Autenticación' },
    { value: 'Cryptography', label_en: 'Cryptography', label_es: 'Criptografía' },
    { value: 'Additional', label_en: 'Additional', label_es: 'Adicionales' },
];

export default function VulnerabilityEditorPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { toast } = useToast();
  const { language } = useLanguage();
  const { vulnerabilities, updateVulnerability, getImage, addImage } = useData();
  const sensors = useSensors( useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }) );

  const [vuln, setVuln] = useState<Vulnerability | null>(null);

  const [enSections, setEnSections] = useState<FindingSection[]>([]);
  const [esSections, setEsSections] = useState<FindingSection[]>([]);
  const [enSectionViews, setEnSectionViews] = useState<Record<string, ScopeView>>({});
  const [esSectionViews, setEsSectionViews] = useState<Record<string, ScopeView>>({});
  const [isEnOrganizing, setIsEnOrganizing] = useState(false);
  const [isEsOrganizing, setIsEsOrganizing] = useState(false);

  const parseMarkdownToSections = useCallback((markdown: string): FindingSection[] => {
    if (!markdown) return [];
    const parts = markdown.split(/\n\s*---\s*\n/);
    return parts.map((part, index) => ({
        id: `section-${index}-${Date.now()}-${Math.random()}`,
        content: part.trim()
    })).filter(p => p.content.trim() !== '');
  }, []);

  useEffect(() => {
    const vulnerability = vulnerabilities.find(v => v.id === id);
    if (vulnerability) {
      setVuln(JSON.parse(JSON.stringify(vulnerability)));
      const initialEnSections = parseMarkdownToSections(vulnerability.overview_en);
      const initialEsSections = parseMarkdownToSections(vulnerability.overview_es);
      setEnSections(initialEnSections);
      setEsSections(initialEsSections);
      setEnSectionViews(initialEnSections.reduce((acc, sec) => ({ ...acc, [sec.id]: 'split' }), {}));
      setEsSectionViews(initialEsSections.reduce((acc, sec) => ({ ...acc, [sec.id]: 'split' }), {}));
    } else {
      router.push('/dashboard/vulnerabilities');
    }
  }, [id, vulnerabilities, router, parseMarkdownToSections]);

  const handleInputChange = <T extends keyof Vulnerability>(field: T, value: Vulnerability[T]) => {
    if (vuln) {
      setVuln({ ...vuln, [field]: value });
    }
  };

  const handleCategoryChange = (value: string) => {
    if (vuln) {
      setVuln({ ...vuln, tags: [value] });
    }
  };

  const handleCvssChange = (field: keyof CVSS, value: string | number) => {
    if (vuln) {
      const newCvss = { ...vuln.cvss, [field]: value };
      setVuln({ ...vuln, cvss: newCvss });
    }
  };
  
  const handleSave = () => {
    if (vuln) {
        const fullEnContent = enSections.map(s => s.content).join('\n\n---\n\n');
        const fullEsContent = esSections.map(s => s.content).join('\n\n---\n\n');
        
        const updatedVuln = {
            ...vuln,
            overview_en: fullEnContent,
            overview_es: fullEsContent,
        };
        
        updateVulnerability(updatedVuln);
        toast({
        title: t[language].saveSuccessTitle,
        description: t[language].saveSuccessDescription,
        });
    }
  };

  const getSeverityVariant = (severity?: string): 'destructive' | 'high' | 'medium' | 'low' | 'secondary' => {
    switch (severity) {
      case 'Critical': return 'destructive';
      case 'High': return 'high';
      case 'Medium': return 'medium';
      case 'Low': return 'low';
      default: return 'secondary';
    }
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
            const contentWithoutTitle = oldContent.replace(/^(#{1,4}) .*\n?/, '');
            const newContent = `### ${newTitle}\n${contentWithoutTitle}`;
            return { ...sec, content: newContent };
        }
        return sec;
    }));
  }

  const handleAddSection = (lang: 'en' | 'es') => {
    const newSection: FindingSection = { id: `new-${lang}-${Date.now()}`, content: `### ${t[language].newSection}` };
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

  const t = {
    en: {
      back: 'Back to Vulnerabilities',
      save: 'Save Changes',
      detailsTitle: 'Description',
      titleEnLabel: 'Title (English)',
      titleEsLabel: 'Title (Spanish)',
      cweLabel: 'CWE',
      categoryLabel: 'Category',
      selectCategory: 'Select a category',
      referencesLabel: 'References (comma-separated URLs)',
      saveSuccessTitle: 'Vulnerability Saved',
      saveSuccessDescription: 'The template has been updated successfully.',
      englishContent: 'English Content',
      spanishContent: 'Spanish Content',
      cvssTitle: 'CVSS Details',
      score: 'Score',
      vectorString: 'Vector String',
      attackVector: 'Attack Vector',
      attackComplexity: 'Attack Complexity',
      privilegesRequired: 'Privileges Required',
      userInteraction: 'User Interaction',
      scope: 'Scope',
      confidentiality: 'Confidentiality',
      integrity: 'Integrity',
      availability: 'Availability',
      severity: 'Severity',
      selectSeverity: 'Select severity',
      critical: 'Critical',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      informational: 'Informational',
      newSection: 'New Section',
      addNewSection: 'Add New Section',
      organizeSections: 'Organize Sections',
      finishOrganizing: 'Finish Organizing',
    },
    es: {
      back: 'Back to Vulnerabilities',
      save: 'Guardar Cambios',
      detailsTitle: 'Descripción',
      titleEnLabel: 'Título (Inglés)',
      titleEsLabel: 'Título (Español)',
      cweLabel: 'CWE',
      categoryLabel: 'Categoría',
      selectCategory: 'Selecciona una categoría',
      referencesLabel: 'Referencias (URLs separadas por comas)',
      saveSuccessTitle: 'Vulnerabilidad Guardada',
      saveSuccessDescription: 'La plantilla se ha actualizado correctamente.',
      englishContent: 'Contenido en Inglés',
      spanishContent: 'Contenido en Español',
      cvssTitle: 'Detalles CVSS',
      score: 'Puntuación',
      vectorString: 'Cadena del Vector',
      attackVector: 'Vector de Ataque',
      attackComplexity: 'Complejidad del Ataque',
      privilegesRequired: 'Privilegios Requeridos',
      userInteraction: 'Interacción del Usuario',
      scope: 'Scope',
      confidentiality: 'Confidencialidad',
      integrity: 'Integridad',
      availability: 'Disponibilidad',
      severity: 'Severidad',
      selectSeverity: 'Seleccionar severidad',
      critical: 'Crítica',
      high: 'Alta',
      medium: 'Media',
      low: 'Baja',
      informational: 'Informativa',
      newSection: 'Nueva Sección',
      addNewSection: 'Añadir Nueva Sección',
      organizeSections: 'Organizar Secciones',
      finishOrganizing: 'Finalizar Organización',
    }
  };

  const renderSectionEditors = (lang: 'en' | 'es', sections: FindingSection[], isOrganizing: boolean, setIsOrganizing: (val: boolean) => void) => (
    <AccordionItem value={`${lang}-content`}>
        <AccordionTrigger className="text-lg font-semibold">
            <div className="flex w-full items-center justify-between pr-4">
                <span>{lang === 'en' ? t[language].englishContent : t[language].spanishContent}</span>
                <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setIsOrganizing(!isOrganizing); }}>
                    <Rows className="mr-2 h-4 w-4" />
                    {isOrganizing ? t[language].finishOrganizing : t[language].organizeSections}
                </Button>
            </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-4">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, lang)}>
                <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-4">
                        {sections.map(section => (
                            <SortableSection
                                key={section.id}
                                section={section}
                                isOrganizing={isOrganizing}
                                onContentChange={(newContent: string) => handleSectionChange(lang, section.id, newContent)}
                                onTitleChange={(newTitle: string) => handleTitleChange(lang, section.id, newTitle)}
                                onDelete={() => handleDeleteSection(lang, section.id)}
                                view={(lang === 'en' ? enSectionViews : esSectionViews)[section.id] || 'split'}
                                onViewChange={(newView: ScopeView) => {
                                    const updater = lang === 'en' ? setEnSectionViews : setEsSectionViews;
                                    updater(prev => ({ ...prev, [section.id]: newView }));
                                }}
                                getImage={getImage}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
            {!isOrganizing && (
                <div className="flex justify-center pt-4">
                    <Button variant="outline" onClick={() => handleAddSection(lang)}>
                        <Plus className="mr-2 h-4 w-4" />
                        {t[language].addNewSection}
                    </Button>
                </div>
            )}
        </AccordionContent>
    </AccordionItem>
  );


  if (!vuln) {
    return null;
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
                <Link href="/dashboard/vulnerabilities">
                    <ChevronLeft className="h-4 w-4" />
                </Link>
            </Button>
            <div className="flex items-center gap-2">
                <h1 className="font-headline text-xl font-bold">{vuln.title_en}</h1>
                {vuln.severity && <Badge variant={getSeverityVariant(vuln.severity)}>{vuln.severity}</Badge>}
            </div>
        </div>
        <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" /> {t[language].save}</Button>
      </header>
      
      <div className="space-y-6">
          <Card>
              <CardHeader>
                  <CardTitle>{t[language].detailsTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                          <Label htmlFor="title_en">{t[language].titleEnLabel}</Label>
                          <Input id="title_en" value={vuln.title_en} onChange={e => handleInputChange('title_en', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="title_es">{t[language].titleEsLabel}</Label>
                          <Input id="title_es" value={vuln.title_es} onChange={e => handleInputChange('title_es', e.target.value)} />
                      </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                          <Label htmlFor="cwe">{t[language].cweLabel}</Label>
                          <Input id="cwe" value={vuln.cwe} onChange={e => handleInputChange('cwe', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="severity">{t[language].severity}</Label>
                          <Select value={vuln.severity} onValueChange={value => handleInputChange('severity', value as Vulnerability['severity'])}>
                              <SelectTrigger id="severity">
                                  <SelectValue placeholder={t[language].selectSeverity} />
                              </SelectTrigger>
                              <SelectContent>
                                  <SelectItem value="Critical">{t[language].critical}</SelectItem>
                                  <SelectItem value="High">{t[language].high}</SelectItem>
                                  <SelectItem value="Medium">{t[language].medium}</SelectItem>
                                  <SelectItem value="Low">{t[language].low}</SelectItem>
                                  <SelectItem value="Informational">{t[language].informational}</SelectItem>
                              </SelectContent>
                          </Select>
                      </div>
                        <div className="space-y-2">
                          <Label htmlFor="category">{t[language].categoryLabel}</Label>
                            <Select value={vuln.tags[0] || ''} onValueChange={handleCategoryChange}>
                              <SelectTrigger id="category">
                                  <SelectValue placeholder={t[language].selectCategory} />
                              </SelectTrigger>
                              <SelectContent>
                                  {vulnerabilityCategories.map(cat => (
                                      <SelectItem key={cat.value} value={cat.value}>
                                          {language === 'es' ? cat.label_es : cat.label_en}
                                      </SelectItem>
                                  ))}
                              </SelectContent>
                          </Select>
                      </div>
                  </div>
                    <div className="space-y-2">
                      <Label htmlFor="references">{t[language].referencesLabel}</Label>
                      <Input id="references" value={vuln.references.join(', ')} onChange={e => handleInputChange('references', e.target.value.split(',').map(r => r.trim()))} />
                  </div>
              </CardContent>
          </Card>
          
          <Card>
              <CardHeader>
                  <CardTitle>{t[language].cvssTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="cvss_score">{t[language].score}</Label>
                        <Input id="cvss_score" type="number" step="0.1" value={vuln.cvss.score} onChange={e => handleCvssChange('score', parseFloat(e.target.value))} />
                    </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvss_vector">{t[language].vectorString}</Label>
                        <Input id="cvss_vector" value={vuln.cvss.vectorString} onChange={e => handleCvssChange('vectorString', e.target.value)} />
                    </div>
                  </div>
                   <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label htmlFor="cvss_av">{t[language].attackVector}</Label>
                        <Input id="cvss_av" value={vuln.cvss.attackVector} onChange={e => handleCvssChange('attackVector', e.target.value)} />
                    </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvss_ac">{t[language].attackComplexity}</Label>
                        <Input id="cvss_ac" value={vuln.cvss.attackComplexity} onChange={e => handleCvssChange('attackComplexity', e.target.value)} />
                    </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvss_pr">{t[language].privilegesRequired}</Label>
                        <Input id="cvss_pr" value={vuln.cvss.privilegesRequired} onChange={e => handleCvssChange('privilegesRequired', e.target.value)} />
                    </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvss_ui">{t[language].userInteraction}</Label>
                        <Input id="cvss_ui" value={vuln.cvss.userInteraction} onChange={e => handleCvssChange('userInteraction', e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label htmlFor="cvss_s">{t[language].scope}</Label>
                        <Input id="cvss_s" value={vuln.cvss.scope} onChange={e => handleCvssChange('scope', e.target.value)} />
                    </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvss_c">{t[language].confidentiality}</Label>
                        <Input id="cvss_c" value={vuln.cvss.confidentiality} onChange={e => handleCvssChange('confidentiality', e.target.value)} />
                    </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvss_i">{t[language].integrity}</Label>
                        <Input id="cvss_i" value={vuln.cvss.integrity} onChange={e => handleCvssChange('integrity', e.target.value)} />
                    </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvss_a">{t[language].availability}</Label>
                        <Input id="cvss_a" value={vuln.cvss.availability} onChange={e => handleCvssChange('availability', e.target.value)} />
                    </div>
                  </div>
              </CardContent>
          </Card>

          <Accordion type="multiple" className="w-full">
            {renderSectionEditors('en', enSections, isEnOrganizing, setIsEnOrganizing)}
            {renderSectionEditors('es', esSections, isEsOrganizing, setIsEsOrganizing)}
          </Accordion>
      </div>
    </div>
  );
}
