
'use client';

import { useState, useEffect, useCallback, useMemo, useRef, type SetStateAction } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { ChevronLeft, Save, Plus, Trash2, CheckCircle } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/language-context';
import type { Vulnerability, CVSS, ImageAsset, Severity } from '@/lib/types';
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
import { getCVSS, getScore, getSeverity } from '@/lib/cvss';
import { SectionMarkdownEditor } from '@/components/section-markdown-editor';
import { joinMarkdownSections, splitMarkdownIntoSections } from '@/lib/markdown-utils';
import { useUndoableState } from '@/hooks/use-undoable-state';


type SaveStatus = 'unsaved' | 'saving' | 'saved';

interface FindingSection {
  id: string;
  content: string;
}

type SortableSectionProps = {
  section: FindingSection;
  onContentChange: (content: string) => void;
  onDelete: () => void;
  getImage: (id: string) => ImageAsset | undefined;
  t: any;
  splitLayout: number[];
  onSplitLayoutChange: (layout: number[]) => void;
  collapsed: boolean;
  onCollapseAll: () => void;
  onCollapsedChange: (sectionId: string, collapsed: boolean) => void;
  dragging?: boolean;
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
      <SectionEditor section={section} dragHandleProps={attributes} dragListeners={listeners} dragging={isDragging} {...props} />
    </div>
  );
};

const SectionEditor = ({ section, onContentChange, onDelete, dragHandleProps, dragListeners, getImage, t, splitLayout, onSplitLayoutChange, collapsed, onCollapseAll, onCollapsedChange, dragging }: {
  section: FindingSection;
  onContentChange: (content: string) => void;
  onDelete: () => void;
  dragHandleProps: any;
  dragListeners: any;
  getImage: (id: string) => ImageAsset | undefined;
  t: any;
  splitLayout: number[];
  onSplitLayoutChange: (layout: number[]) => void;
  collapsed: boolean;
  onCollapseAll: () => void;
  onCollapsedChange: (sectionId: string, collapsed: boolean) => void;
  dragging?: boolean;
}) => {
    return (
      <SectionMarkdownEditor
        content={section.content}
        onChange={onContentChange}
        onDelete={onDelete}
        dragHandleProps={dragHandleProps}
        dragListeners={dragListeners}
        getImage={getImage}
        splitLayout={splitLayout}
        onSplitLayoutChange={onSplitLayoutChange}
        collapsed={collapsed}
        onDragHandleClick={onCollapseAll}
        dragging={dragging}
        onCollapsedChange={(nextCollapsed) => onCollapsedChange(section.id, nextCollapsed)}
        titleFallback={t.newSection}
        labels={{
          section: t.section || t.newSection,
          untitled: t.newSection,
          split: t.split,
          preview: t.preview,
          writeContent: t.writeContent,
          delete: t.deleteSection || t.newSection,
          confirmDeleteTitle: t.confirmDeleteTitle,
          confirmDeleteDescription: t.confirmDeleteDescription,
          cancel: t.cancel,
          confirmDelete: t.confirmDelete,
          expand: t.expand,
          collapse: t.collapse,
        }}
      />
    );
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

const cvssOptions = {
    attackVector: [ { value: 'N', label: 'Network' }, { value: 'A', label: 'Adjacent' }, { value: 'L', label: 'Local' }, { value: 'P', label: 'Physical' } ],
    attackComplexity: [ { value: 'L', label: 'Low' }, { value: 'H', label: 'High' } ],
    privilegesRequired: [ { value: 'N', label: 'None' }, { value: 'L', label: 'Low' }, { value: 'H', label: 'High' } ],
    userInteraction: [ { value: 'N', label: 'None' }, { value: 'R', label: 'Required' } ],
    scope: [ { value: 'U', label: 'Unchanged' }, { value: 'C', label: 'Changed' } ],
    confidentiality: [ { value: 'N', label: 'None' }, { value: 'L', label: 'Low' }, { value: 'H', label: 'High' } ],
    integrity: [ { value: 'N', label: 'None' }, { value: 'L', label: 'Low' }, { value: 'H', label: 'High' } ],
    availability: [ { value: 'N', label: 'None' }, { value: 'L', label: 'Low' }, { value: 'H', label: 'High' } ],
}

export default function VulnerabilityEditorPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { toast } = useToast();
  const { language } = useLanguage();
  const { vulnerabilities, updateVulnerability, getImage } = useData();
  const sensors = useSensors( useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }) );

  const [vuln, setVuln] = useState<Vulnerability | null>(null);
  const [references, setReferences] = useState<string[]>([]);
  const [activeAccordion, setActiveAccordion] = useState<string[]>(['details']);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const initializedIdRef = useRef<string | null>(null);

  const {
    state: sectionState,
    setState: setSectionState,
    resetState: resetSectionState,
    undo: undoSections,
    redo: redoSections,
  } = useUndoableState<{ en: FindingSection[]; es: FindingSection[] }>({ en: [], es: [] });
  const enSections = sectionState.en;
  const esSections = sectionState.es;
  const setEnSections = useCallback((action: SetStateAction<FindingSection[]>) => {
    setSectionState(prev => ({
      ...prev,
      en: typeof action === 'function' ? (action as (items: FindingSection[]) => FindingSection[])(prev.en) : action,
    }));
  }, [setSectionState]);
  const setEsSections = useCallback((action: SetStateAction<FindingSection[]>) => {
    setSectionState(prev => ({
      ...prev,
      es: typeof action === 'function' ? (action as (items: FindingSection[]) => FindingSection[])(prev.es) : action,
    }));
  }, [setSectionState]);
  const [sectionSplitLayout, setSectionSplitLayout] = useState<number[]>([52, 48]);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  
  const t = {
    en: {
      back: 'Back to Vulnerabilities',
      save: 'Save Changes',
      saving: 'Saving...',
      saved: 'Saved',
      detailsTitle: 'Description',
      titleEnLabel: 'Title (English)',
      titleEsLabel: 'Title (Spanish)',
      cweLabel: 'CWE',
      categoryLabel: 'Category',
      selectCategory: 'Select a category',
      referencesLabel: 'References',
      addReference: 'Add Reference',
      saveSuccessTitle: 'Vulnerability Saved',
      saveSuccessDescription: 'The template has been updated successfully.',
      englishContent: 'English Content',
      spanishContent: 'Spanish Content',
      cvssTitle: 'CVSS Calculator',
      cvssDescription: 'The score and severity are automatically updated based on the selected vectors.',
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
      deleteSection: 'Delete section',
      confirmDeleteTitle: 'Delete section?',
      confirmDeleteDescription: 'This section will be removed from the editor. You can undo the change with Control+Z.',
      cancel: 'Cancel',
      confirmDelete: 'Delete',
      expand: 'Expand section',
      collapse: 'Collapse sections',
      overview: 'Overview',
      technicalDescription: 'Technical Description',
      affectedComponents: 'Affected Components',
      impact: 'Impact',
      immediateActions: 'Immediate Actions',
      details: 'Proof of Concept',
      recommendations: 'Recommendations',
      edit: "Edit",
      split: "Split",
      preview: "Preview",
      writeContent: "Write your content here...",
    },
    es: {
      back: 'Volver a Vulnerabilidades',
      save: 'Guardar Cambios',
      saving: 'Guardando...',
      saved: 'Guardado',
      detailsTitle: 'Descripción',
      titleEnLabel: 'Título (Inglés)',
      titleEsLabel: 'Título (Español)',
      cweLabel: 'CWE',
      categoryLabel: 'Categoría',
      selectCategory: 'Selecciona una categoría',
      referencesLabel: 'Referencias',
      addReference: 'Añadir Referencia',
      saveSuccessTitle: 'Vulnerabilidad Guardada',
      saveSuccessDescription: 'La plantilla se ha actualizado correctamente.',
      englishContent: 'Contenido en Inglés',
      spanishContent: 'Contenido en Español',
      cvssTitle: 'Calculadora de CVSS',
      cvssDescription: 'La puntuación y la severidad se actualizan automáticamente según los vectores seleccionados.',
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
      deleteSection: 'Eliminar sección',
      confirmDeleteTitle: '¿Eliminar sección?',
      confirmDeleteDescription: 'Esta sección se eliminará del editor. Puedes deshacer el cambio con Control+Z.',
      cancel: 'Cancelar',
      confirmDelete: 'Eliminar',
      expand: 'Expandir sección',
      collapse: 'Colapsar secciones',
      overview: 'Resumen',
      technicalDescription: 'Descripción Técnica',
      affectedComponents: 'Componentes Afectados',
      impact: 'Impacto',
      immediateActions: 'Acciones Inmediatas',
      details: 'Prueba de Concepto',
      recommendations: 'Recomendaciones',
      edit: "Edición",
      split: "Dividida",
      preview: "Previsualización",
      writeContent: "Escribe tu contenido aquí...",
    }
  };

  const getFullContent = useCallback((vuln: Vulnerability, lang: 'en' | 'es'): string => {
    const sections = [
      vuln[`overview_${lang}`],
      vuln[`technicalDescription_${lang}`],
      vuln[`affectedComponents_${lang}`],
      vuln[`impact_${lang}`],
      vuln[`immediateActions_${lang}`],
      vuln[`details_${lang}`],
      vuln[`recommendations_${lang}`]
    ];
    return joinMarkdownSections(sections);
  }, []);

  const parseMarkdownToSections = useCallback((markdown: string): FindingSection[] => {
    if (!markdown || typeof markdown !== 'string') return [];
    const parts = splitMarkdownIntoSections(markdown, { maxHeadingLevel: 3 });
    return parts.map((part, index) => ({
        id: `section-${index}-${Date.now()}-${Math.random()}`,
        content: part.trim()
    })).filter(p => p.content.trim() !== '');
  }, []);

  useEffect(() => {
    const currentId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : '';
    // Inicializar el editor una sola vez por id. Sin este guard, cada autosave
    // crea una nueva referencia en `vulnerabilities` (data-context hace
    // prev.map(...)), el effect se vuelve a disparar y regenera los IDs de
    // sección, lo que desmonta los <SortableSection> y hace perder el foco
    // del cursor en plena edición.
    if (initializedIdRef.current === currentId) return;

    const vulnerability = vulnerabilities.find(v => v.id === currentId);
    if (vulnerability) {
      const vulnCopy = JSON.parse(JSON.stringify(vulnerability));
      setVuln(vulnCopy);
      setReferences(vulnCopy.references || []);

      const fullEnContent = getFullContent(vulnCopy, 'en');
      const fullEsContent = getFullContent(vulnCopy, 'es');

      const initialEnSections = parseMarkdownToSections(fullEnContent);
      const initialEsSections = parseMarkdownToSections(fullEsContent);

      resetSectionState({ en: initialEnSections, es: initialEsSections });
      initializedIdRef.current = currentId;

    } else if (vulnerabilities.length > 0) {
      // Solo redirigimos cuando el store ya ha cargado y la vuln no existe;
      // si está vacío puede ser hidratación inicial.
      router.push('/dashboard/vulnerabilities');
    }
  }, [id, vulnerabilities, router, parseMarkdownToSections, getFullContent, resetSectionState]);

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
  }, [vuln, references, enSections, esSections, saveStatus]);


  const handleInputChange = useCallback(<T extends keyof Vulnerability>(field: T, value: Vulnerability[T]) => {
    setVuln(prev => prev ? { ...prev, [field]: value } : null);
    setSaveStatus('unsaved');
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    setVuln(prev => prev ? ({ ...prev, tags: [value] }) : null);
    setSaveStatus('unsaved');
  }, []);

  const handleCvssChange = useCallback((field: keyof CVSS, value: string | number) => {
    setVuln(prevVuln => {
        if (!prevVuln) return null;
        const newCvss = { ...prevVuln.cvss, [field]: value };
        const vectorString = getCVSS(newCvss);
        const score = getScore(vectorString);
        const severity = getSeverity(score) as Severity;
        
        const updatedVuln = {
            ...prevVuln,
            cvss: { ...newCvss, vectorString, score },
            severity,
        };
        return updatedVuln;
    });
    setSaveStatus('unsaved');
  }, []);
  
  const handleSave = (showToast = true) => {
    if (vuln) {
        setSaveStatus('saving');
        const extractContent = (sections: FindingSection[], titleKey: string) => {
            const searchTitleEn = t.en[titleKey as keyof typeof t.en];
            const searchTitleEs = t.es[titleKey as keyof typeof t.es];
            const section = sections.find(s => {
                const headingMatch = s.content.match(/^(#{2,4}) (.*)/);
                const title = headingMatch ? headingMatch[2].trim() : '';
                return title === searchTitleEn || title === searchTitleEs;
            });
            return section ? section.content : '';
        }

        const updatedVuln: Vulnerability = {
            ...vuln,
            overview_en: extractContent(enSections, 'overview'),
            technicalDescription_en: extractContent(enSections, 'technicalDescription'),
            affectedComponents_en: extractContent(enSections, 'affectedComponents'),
            impact_en: extractContent(enSections, 'impact'),
            immediateActions_en: extractContent(enSections, 'immediateActions'),
            details_en: extractContent(enSections, 'details'),
            recommendations_en: extractContent(enSections, 'recommendations'),

            overview_es: extractContent(esSections, 'overview'),
            technicalDescription_es: extractContent(esSections, 'technicalDescription'),
            affectedComponents_es: extractContent(esSections, 'affectedComponents'),
            impact_es: extractContent(esSections, 'impact'),
            immediateActions_es: extractContent(esSections, 'immediateActions'),
            details_es: extractContent(esSections, 'details'),
            recommendations_es: extractContent(esSections, 'recommendations'),

            references: references.filter(ref => ref.trim() !== ''),
        };
        
        updateVulnerability(updatedVuln);
        if (showToast) {
            toast({
            title: t[language].saveSuccessTitle,
            description: t[language].saveSuccessDescription,
            });
        }
        setTimeout(() => setSaveStatus('saved'), 500);
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
    setSaveStatus('unsaved');
  };
  

  const handleAddSection = (lang: 'en' | 'es') => {
    const newSection: FindingSection = { id: `new-${lang}-${Date.now()}`, content: `### ${t[language].newSection}` };
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

  const expandAllSections = useCallback(() => {
    setCollapsedSections({});
  }, []);

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
    expandAllSections();
  };

  const handleReferenceChange = (index: number, value: string) => {
    const newReferences = [...references];
    newReferences[index] = value;
    setReferences(newReferences);
    setSaveStatus('unsaved');
  };

  const handleAddReference = () => {
    setReferences([...references, '']);
    setSaveStatus('unsaved');
  };

  const handleRemoveReference = (index: number) => {
    const newReferences = references.filter((_, i) => i !== index);
    setReferences(newReferences);
    setSaveStatus('unsaved');
  };

  if (!vuln) {
    return null;
  }

  return (
    <div className="space-y-6 w-full">
      <header className="flex items-center justify-between px-4 sm:px-6">
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
        <Button onClick={() => handleSave(true)} disabled={saveStatus === 'saving' || saveStatus === 'saved'}>
            {saveStatus === 'saving' ? (<><Save className="mr-2 h-4 w-4 animate-spin" />{t[language].saving}</>) : 
             saveStatus === 'saved' ? (<><CheckCircle className="mr-2 h-4 w-4" />{t[language].saved}</>) : 
             (<><Save className="mr-2 h-4 w-4" />{t[language].save}</>)}
        </Button>
      </header>
      
        <div className="space-y-6 px-4 sm:px-6">
          <Accordion type="multiple" className="w-full space-y-6" defaultValue={['details']} value={activeAccordion} onValueChange={setActiveAccordion}>
            <AccordionItem value="details" className="border bg-card rounded-lg data-[state=closed]:border">
              <AccordionTrigger className="p-4 hover:no-underline">
                <span className="font-semibold text-base">{t[language].detailsTitle}</span>
              </AccordionTrigger>
              <AccordionContent className="p-4 pt-0">
                <div className="space-y-4 pt-4 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                          <Label htmlFor="title_en">{t[language].titleEnLabel}</Label>
                          <Input id="title_en" value={vuln.title_en} onChange={e => handleInputChange('title_en', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="title_es">{t[language].titleEsLabel}</Label>
                          <Input id="title_es" value={vuln.title_es} onChange={e => handleInputChange('title_es', e.target.value)} />
                      </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                          <Label htmlFor="cwe">{t[language].cweLabel}</Label>
                          <Input id="cwe" value={vuln.cwe} onChange={e => handleInputChange('cwe', e.target.value)} />
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
                      <Label>{t[language].referencesLabel}</Label>
                      <div className="space-y-2 mt-4">
                      {references.length === 0 ? (
                          <Button variant="outline" onClick={handleAddReference} className="w-auto">
                              <Plus className="mr-2 h-4 w-4" />
                              {t[language].addReference}
                          </Button>
                      ) : (
                        references.map((ref, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Input
                                value={ref}
                                onChange={(e) => handleReferenceChange(index, e.target.value)}
                                placeholder="https://example.com"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveReference(index)}
                                className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={handleAddReference}>
                                  <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          ))
                      )}
                      </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="cvss" className="border bg-card rounded-lg data-[state=closed]:border">
              <AccordionTrigger className="p-4 hover:no-underline">
                 <div className="flex w-full items-center justify-between">
                    <div className="flex flex-col text-left">
                      <span className="font-semibold text-base">{t[language].cvssTitle}</span>
                      <span className="text-sm text-muted-foreground font-normal">{t[language].cvssDescription}</span>
                    </div>
                    {vuln.severity && <Badge variant={getSeverityVariant(vuln.severity)}>{vuln.severity}</Badge>}
                  </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 pt-0">
                  <div className="space-y-4 pt-4 border-t">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                          <Label htmlFor="cvss_score">{t[language].score}</Label>
                          <Input id="cvss_score" type="number" step="0.1" value={vuln.cvss.score} readOnly className="font-bold text-lg" />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="cvss_vector">{t[language].vectorString}</Label>
                          <Input id="cvss_vector" value={vuln.cvss.vectorString} readOnly />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        {(Object.keys(cvssOptions) as Array<keyof typeof cvssOptions>).slice(0,4).map(key => (
                             <div className="space-y-2" key={key}>
                                <Label htmlFor={`cvss-${key}`}>{t[language][key as keyof typeof t['en']]}</Label>
                                <Select onValueChange={(value) => handleCvssChange(key, value)} value={vuln.cvss[key]}>
                                    <SelectTrigger id={`cvss-${key}`}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {cvssOptions[key].map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        ))}
                    </div>
                     <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        {(Object.keys(cvssOptions) as Array<keyof typeof cvssOptions>).slice(4).map(key => (
                             <div className="space-y-2" key={key}>
                                <Label htmlFor={`cvss-${key}`}>{t[language][key as keyof typeof t['en']]}</Label>
                                <Select onValueChange={(value) => handleCvssChange(key, value)} value={vuln.cvss[key]}>
                                    <SelectTrigger id={`cvss-${key}`}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {cvssOptions[key].map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        ))}
                    </div>
                  </div>
              </AccordionContent>
            </AccordionItem>
              <AccordionItem value="en-content" className="border bg-card rounded-lg data-[state=closed]:border data-[state=open]:border-b-0">
                <AccordionTrigger className="p-4 hover:no-underline flex-1" onClick={(e) => { e.stopPropagation(); setActiveAccordion(prev => prev.includes('en-content') ? prev.filter(item => item !== 'en-content') : [...prev, 'en-content'])}}>
                    <div className="flex w-full items-center justify-between">
                      <span className="font-semibold text-base flex-1 text-left">{t[language].englishContent}</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-0">
                  <div className="space-y-4 pt-4 border-t">
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragStart={collapseAllSections}
                      onDragCancel={expandAllSections}
                      onDragEnd={(e) => handleDragEnd(e, 'en')}
                    >
                      <SortableContext items={enSections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-4">
                          {enSections.map(section => (
                            <SortableSection
                              key={section.id}
                              section={section}
                              onContentChange={(newContent: string) => handleSectionChange('en', section.id, newContent)}
                              onDelete={() => handleDeleteSection('en', section.id)}
                              getImage={getImage}
                              t={t[language]}
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
              
              <AccordionItem value="es-content" className="border bg-card rounded-lg data-[state=closed]:border data-[state=open]:border-b-0">
                  <AccordionTrigger className="p-4 hover:no-underline flex-1" onClick={(e) => { e.stopPropagation(); setActiveAccordion(prev => prev.includes('es-content') ? prev.filter(item => item !== 'es-content') : [...prev, 'es-content'])}}>
                    <div className="flex w-full items-center justify-between">
                       <span className="font-semibold text-base flex-1 text-left">{t[language].spanishContent}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-4 pt-0">
                    <div className="space-y-4 pt-4 border-t">
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={collapseAllSections}
                        onDragCancel={expandAllSections}
                        onDragEnd={(e) => handleDragEnd(e, 'es')}
                      >
                        <SortableContext items={esSections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                          <div className="space-y-4">
                            {esSections.map(section => (
                              <SortableSection
                                key={section.id}
                                section={section}
                                onContentChange={(newContent: string) => handleSectionChange('es', section.id, newContent)}
                                onDelete={() => handleDeleteSection('es', section.id)}
                                getImage={getImage}
                                t={t[language]}
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
    </div>
  );
}
