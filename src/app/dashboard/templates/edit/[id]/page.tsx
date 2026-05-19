'use client';

import { useState, useEffect, useCallback, type SetStateAction } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { ChevronLeft, Save, Plus, CheckCircle } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/language-context';
import type { ProjectTemplate } from '@/lib/types';
import { useData } from '@/context/data-context';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ProjectIconSelectItem, projectIconOptions } from '@/components/project-icon';
import { SectionMarkdownEditor } from '@/components/section-markdown-editor';
import { joinMarkdownSections, splitMarkdownIntoSections } from '@/lib/markdown-utils';
import { stripMarkdownText } from '@/lib/todo-utils';
import { useUndoableState } from '@/hooks/use-undoable-state';

type SaveStatus = 'unsaved' | 'saving' | 'saved';

interface TemplateSection {
  id: string;
  content: string;
}

const getSectionHeadingTitle = (content: string) => {
  const headingMatch = content.match(/^\s{0,3}#{1,6}\s+(.+)$/m);
  return headingMatch ? stripMarkdownText(headingMatch[1]).toLocaleLowerCase() : '';
};

const splitTemplateSectionsForStorage = (sections: TemplateSection[], appendixTitles: string[]) => {
  const appendixIndex = sections.findIndex(section => appendixTitles.includes(getSectionHeadingTitle(section.content)));
  const scopeSections = appendixIndex >= 0 ? sections.slice(0, appendixIndex) : sections;
  const appendixSections = appendixIndex >= 0 ? sections.slice(appendixIndex) : [];

  return {
    scope: joinMarkdownSections(scopeSections.map(section => section.content)),
    appendix: joinMarkdownSections(appendixSections.map(section => section.content)),
  };
};

type SortableSectionProps = {
  section: TemplateSection;
  onContentChange: (content: string) => void;
  onDelete: () => void;
  splitLayout: number[];
  onSplitLayoutChange: (layout: number[]) => void;
  collapsed: boolean;
  onCollapseAll: () => void;
  onCollapsedChange: (sectionId: string, collapsed: boolean) => void;
};

const SortableSection = ({ section, ...props }: SortableSectionProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 'auto',
  };
  
  return (
    <div ref={setNodeRef} style={style}>
      <SectionEditor section={section} dragHandleProps={attributes} dragListeners={listeners} {...props} />
    </div>
  );
};

const SectionEditor = ({ section, onContentChange, onDelete, dragHandleProps, dragListeners, splitLayout, onSplitLayoutChange, collapsed, onCollapseAll, onCollapsedChange }: {
  section: TemplateSection;
  onContentChange: (content: string) => void;
  onDelete: () => void;
  dragHandleProps: any;
  dragListeners: any;
  splitLayout: number[];
  onSplitLayoutChange: (layout: number[]) => void;
  collapsed: boolean;
  onCollapseAll: () => void;
  onCollapsedChange: (sectionId: string, collapsed: boolean) => void;
}) => {
    return (
      <SectionMarkdownEditor
        content={section.content}
        onChange={onContentChange}
        onDelete={onDelete}
        dragHandleProps={dragHandleProps}
        dragListeners={dragListeners}
        splitLayout={splitLayout}
        onSplitLayoutChange={onSplitLayoutChange}
        collapsed={collapsed}
        onDragHandleClick={onCollapseAll}
        onCollapsedChange={(nextCollapsed) => onCollapsedChange(section.id, nextCollapsed)}
        titleFallback="New Section"
        labels={{
          section: 'Template section',
          untitled: 'New Section',
          writeContent: 'Write reusable project template content...',
          delete: 'Delete section',
        }}
      />
    );
}

export default function TemplateEditorPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { toast } = useToast();
  const { language } = useLanguage();
  const { projectTemplates, addProjectTemplate, updateProjectTemplate } = useData();
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const [isNew, setIsNew] = useState(id === 'new');
  const [template, setTemplate] = useState<Omit<ProjectTemplate, 'id'> | ProjectTemplate | null>(null);

  const {
    state: sectionState,
    setState: setSectionState,
    resetState: resetSectionState,
    undo: undoSections,
    redo: redoSections,
  } = useUndoableState<{ en: TemplateSection[]; es: TemplateSection[] }>({ en: [], es: [] });
  const enSections = sectionState.en;
  const esSections = sectionState.es;
  const setEnSections = useCallback((action: SetStateAction<TemplateSection[]>) => {
    setSectionState(prev => ({
      ...prev,
      en: typeof action === 'function' ? (action as (items: TemplateSection[]) => TemplateSection[])(prev.en) : action,
    }));
  }, [setSectionState]);
  const setEsSections = useCallback((action: SetStateAction<TemplateSection[]>) => {
    setSectionState(prev => ({
      ...prev,
      es: typeof action === 'function' ? (action as (items: TemplateSection[]) => TemplateSection[])(prev.es) : action,
    }));
  }, [setSectionState]);
  const [activeAccordion, setActiveAccordion] = useState<string[]>(['details', 'en-content']);
  const [sectionSplitLayout, setSectionSplitLayout] = useState<number[]>([52, 48]);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');

  const parseContentToSections = useCallback((content: string): TemplateSection[] => {
    if (!content || typeof content !== 'string') return [];
    const parts = splitMarkdownIntoSections(content, { maxHeadingLevel: 2 });
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
        appendix_en: '## Appendix\n\n[TODO: Add appendix]',
        appendix_es: '## Apéndice\n\n[TODO: Añadir apéndice]',
        icon: 'FileText'
      };
      setTemplate(newTemplate);
      const initialEnSections = [...parseContentToSections(newTemplate.scope_en), ...parseContentToSections(newTemplate.appendix_en)];
      const initialEsSections = [...parseContentToSections(newTemplate.scope_es), ...parseContentToSections(newTemplate.appendix_es)];
      resetSectionState({ en: initialEnSections, es: initialEsSections });
    } else {
      const existingTemplate = projectTemplates.find(t => t.id === id);
      if (existingTemplate) {
        setTemplate(JSON.parse(JSON.stringify(existingTemplate)));
        const fullEnContent = joinMarkdownSections([existingTemplate.scope_en, existingTemplate.appendix_en]);
        const fullEsContent = joinMarkdownSections([existingTemplate.scope_es, existingTemplate.appendix_es]);
        resetSectionState({ en: parseContentToSections(fullEnContent), es: parseContentToSections(fullEsContent) });
      } else {
        toast({ variant: 'destructive', title: 'Template not found' });
        router.push('/dashboard/templates');
      }
    }
  }, [id, isNew, projectTemplates, router, toast, parseContentToSections, resetSectionState]);

  useEffect(() => {
    const handleGlobalUndoRedo = (event: KeyboardEvent) => {
      if (event.defaultPrevented || (!event.ctrlKey && !event.metaKey)) return;
      const key = event.key.toLowerCase();

      if (key === 'z') {
        event.preventDefault();
        const changed = event.shiftKey ? redoSections() : undoSections();
        if (changed) setSaveStatus('unsaved');
      } else if (key === 'y') {
        event.preventDefault();
        if (redoSections()) setSaveStatus('unsaved');
      }
    };

    window.addEventListener('keydown', handleGlobalUndoRedo);
    return () => window.removeEventListener('keydown', handleGlobalUndoRedo);
  }, [redoSections, undoSections]);

  useEffect(() => {
    if (saveStatus === 'unsaved') {
      const handler = setTimeout(() => {
        handleSave(false);
      }, 2000);
      return () => clearTimeout(handler);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template, enSections, esSections, saveStatus]);


  const handleInputChange = (field: keyof Omit<ProjectTemplate, 'id'>, value: string) => {
    setTemplate(prev => prev ? { ...prev, [field]: value } : null);
    setSaveStatus('unsaved');
  };
  
  const handleSave = (showToast = true) => {
    if (!template) return;
    
    if (!template.name_en || !template.name_es) {
        if(showToast) {
            toast({ variant: 'destructive', title: 'Missing required fields', description: 'Please provide a name for the template in both English and Spanish.' });
        }
        return;
    }
    
    setSaveStatus('saving');

    const enContent = splitTemplateSectionsForStorage(enSections, ['appendix']);
    const esContent = splitTemplateSectionsForStorage(esSections, ['apéndice', 'apendice']);

    const finalTemplate = {
      ...template,
      scope_en: enContent.scope,
      appendix_en: enContent.appendix,
      scope_es: esContent.scope,
      appendix_es: esContent.appendix,
    };

    if (isNew) {
      addProjectTemplate(finalTemplate as Omit<ProjectTemplate, 'id'>);
      if(showToast) toast({ title: 'Template Created', description: `The "${template.name_en}" template has been created.` });
      router.push('/dashboard/templates');
    } else {
      updateProjectTemplate(finalTemplate as ProjectTemplate);
      if(showToast) toast({ title: 'Template Updated', description: `The "${template.name_en}" template has been updated.` });
    }
    setTimeout(() => setSaveStatus('saved'), 500);
  };

  const t = {
    en: {
        back: 'Back to Templates',
        save: 'Save Template',
        saving: 'Saving...',
        saved: 'Saved',
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
    },
    es: {
        back: 'Volver a Plantillas',
        save: 'Guardar Plantilla',
        saving: 'Guardando...',
        saved: 'Guardado',
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
    },
  };

  const handleSectionChange = (lang: 'en' | 'es', sectionId: string, newContent: string) => {
    const updater = lang === 'en' ? setEnSections : setEsSections;
    updater(prev => prev.map(s => s.id === sectionId ? { ...s, content: newContent } : s));
    setSaveStatus('unsaved');
  };

  const handleAddSection = (lang: 'en' | 'es') => {
    const newSection: TemplateSection = { id: `new-${lang}-${Date.now()}`, content: `### ${t[language].newSection}` };
    if (lang === 'en') {
        setEnSections(prev => [...prev, newSection]);
    } else {
        setEsSections(prev => [...prev, newSection]);
    }
    setSaveStatus('unsaved');
  };

  const handleDeleteSection = (lang: 'en' | 'es', sectionId: string) => {
    if (lang === 'en') {
        setEnSections(prev => prev.filter(s => s.id !== sectionId));
    } else {
        setEsSections(prev => prev.filter(s => s.id !== sectionId));
    }
    setCollapsedSections(prev => {
      const next = { ...prev };
      delete next[sectionId];
      return next;
    });
    setSaveStatus('unsaved');
  };

  const collapseAllSections = useCallback(() => {
    setCollapsedSections(Object.fromEntries([...enSections, ...esSections].map(section => [section.id, true])));
  }, [enSections, esSections]);

  const setSectionCollapsed = useCallback((sectionId: string, collapsed: boolean) => {
    setCollapsedSections(prev => ({ ...prev, [sectionId]: collapsed }));
  }, []);

  const handleDragEnd = (event: DragEndEvent, lang: 'en' | 'es') => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
        const updater = lang === 'en' ? setEnSections : setEsSections;
        updater((items) => {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);
            setSaveStatus('unsaved');
            return arrayMove(items, oldIndex, newIndex);
        });
    }
  };

  if (!template) {
    return null; 
  }

  return (
    <div className="w-full space-y-6">
       <header className="flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/templates">
              <ChevronLeft className="mr-2 h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="font-headline text-xl font-bold">{isNew ? t[language].newTitle : t[language].editTitle}</h1>
            <p className="text-sm text-muted-foreground">{isNew ? t[language].newDescription : t[language].editDescription}</p>
          </div>
        </div>
        <Button onClick={() => handleSave(true)} disabled={saveStatus === 'saving' || saveStatus === 'saved'}>
            {saveStatus === 'saving' ? (<><Save className="mr-2 h-4 w-4 animate-spin" />{t[language].saving}</>) : 
             saveStatus === 'saved' ? (<><CheckCircle className="mr-2 h-4 w-4" />{t[language].saved}</>) : 
             (<><Save className="mr-2 h-4 w-4" /> {isNew ? t[language].create : t[language].save}</>)}
        </Button>
      </header>
       <Accordion type="multiple" className="w-full space-y-6 px-4 sm:px-6" defaultValue={['details']} value={activeAccordion} onValueChange={setActiveAccordion}>
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
                            {projectIconOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  <ProjectIconSelectItem value={option.value} label={option.label} />
                                </SelectItem>
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
                            onContentChange={(newContent: string) => handleSectionChange('en', section.id, newContent)}
                            onDelete={() => handleDeleteSection('en', section.id)}
                            splitLayout={sectionSplitLayout}
                            onSplitLayoutChange={setSectionSplitLayout}
                            collapsed={Boolean(collapsedSections[section.id])}
                            onCollapseAll={collapseAllSections}
                            onCollapsedChange={setSectionCollapsed}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                    <div className="flex justify-center pt-4">
                      <Button variant="outline" onClick={() => handleAddSection('en')}>
                        <Plus className="mr-2 h-4 w-4" />
                        {t[language].addNewSection}
                      </Button>
                    </div>
                </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="es-content" className="border bg-card rounded-lg">
            <AccordionTrigger className="p-4 hover:no-underline" onClick={(e) => { e.stopPropagation(); setActiveAccordion(prev => prev.includes('es-content') ? prev.filter(item => item !== 'es-content') : [...prev, 'es-content'])}}>
               <div className="flex w-full items-center justify-between">
                  <span className="font-semibold text-base flex-1 text-left">{t[language].spanishContent}</span>
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
                            onContentChange={(newContent: string) => handleSectionChange('es', section.id, newContent)}
                            onDelete={() => handleDeleteSection('es', section.id)}
                            splitLayout={sectionSplitLayout}
                            onSplitLayoutChange={setSectionSplitLayout}
                            collapsed={Boolean(collapsedSections[section.id])}
                            onCollapseAll={collapseAllSections}
                            onCollapsedChange={setSectionCollapsed}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                    <div className="flex justify-center pt-4">
                      <Button variant="outline" onClick={() => handleAddSection('es')}>
                        <Plus className="mr-2 h-4 w-4" />
                        {t[language].addNewSection}
                      </Button>
                    </div>
                </div>
            </AccordionContent>
          </AccordionItem>
       </Accordion>
    </div>
  );
}
