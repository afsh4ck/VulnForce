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
import { ChevronLeft, Save, FileText, Scan, Globe, Network, Smartphone, Wifi, Award, Plus, Trash2, Rows, Bold, Italic, Code, List, ListOrdered, FileCode, GripVertical, CheckCircle, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/language-context';
import type { ProjectTemplate } from '@/lib/types';
import { useData } from '@/context/data-context';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type SaveStatus = 'unsaved' | 'saving' | 'saved';

interface TemplateSection {
  id: string;
  content: string;
}

const SortableSection = ({ section, ...props }: { section: TemplateSection, [key: string]: any }) => {
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

const SectionEditor = ({ section, onContentChange, onDelete, onTitleChange, dragHandleProps, dragListeners }: {
  section: TemplateSection;
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
  const { projectTemplates, addProjectTemplate, updateProjectTemplate } = useData();
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const [isNew, setIsNew] = useState(id === 'new');
  const [template, setTemplate] = useState<Omit<ProjectTemplate, 'id'> | ProjectTemplate | null>(null);

  const [enSections, setEnSections] = useState<TemplateSection[]>([]);
  const [esSections, setEsSections] = useState<TemplateSection[]>([]);
  const [activeAccordion, setActiveAccordion] = useState<string[]>(['details', 'en-content']);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');

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
        appendix_en: '### Appendix\n\n[TODO: Add appendix]', 
        appendix_es: '### Apéndice\n\n[TODO: Añadir apéndice]', 
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

    const [scope_en, ...appendix_en_parts] = enSections.map(s => s.content).join('\n\n---\n\n').split('### Appendix');
    const appendix_en = appendix_en_parts.length > 0 ? '### Appendix' + appendix_en_parts.join('### Appendix') : '';

    const [scope_es, ...appendix_es_parts] = esSections.map(s => s.content).join('\n\n---\n\n').split('### Apéndice');
    const appendix_es = appendix_es_parts.length > 0 ? '### Apéndice' + appendix_es_parts.join('### Apéndice') : '';

    const finalTemplate = { ...template, scope_en, appendix_en, scope_es, appendix_es };

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
    updater(prev => prev.map(s => {
      if (s.id === sectionId) {
          const headingMatch = s.content.match(/^(#{2,4}) .*\n?/);
          const title = headingMatch ? headingMatch[0] : '';
          return { ...s, content: title + newContent };
      }
      return s;
    }));
    setSaveStatus('unsaved');
  };

  const handleTitleChange = (lang: 'en' | 'es', sectionId: string, newTitle: string) => {
    const updater = lang === 'en' ? setEnSections : setEsSections;
    updater(prev => prev.map(sec => {
        if (sec.id === sectionId) {
            const contentWithoutTitle = sec.content.replace(/^(#{1,4}) .*\n?/, '');
            return { ...sec, content: `### ${newTitle}\n${contentWithoutTitle}` };
        }
        return sec;
    }));
    setSaveStatus('unsaved');
  }

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
    setSaveStatus('unsaved');
  };

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
                            onTitleChange={(newTitle: string) => handleTitleChange('en', section.id, newContent)}
                            onDelete={() => handleDeleteSection('en', section.id)}
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
                            onTitleChange={(newTitle: string) => handleTitleChange('es', section.id, newContent)}
                            onDelete={() => handleDeleteSection('es', section.id)}
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
