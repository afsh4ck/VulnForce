
'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { ChevronLeft, Save, Plus, Trash2 } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/language-context';
import type { Vulnerability, CVSS, ImageAsset, Severity } from '@/lib/types';
import { useRouter } from 'next/navigation';
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
import { cn } from '@/lib/utils';
import { SectionMarkdownEditor } from '@/components/section-markdown-editor';


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

const SectionEditor = ({ section, onContentChange, onDelete, dragHandleProps, dragListeners, getImage, t }: {
  section: FindingSection;
  onContentChange: (content: string) => void;
  onDelete: () => void;
  dragHandleProps: any;
  dragListeners: any;
  getImage: (id: string) => ImageAsset | undefined;
  t: any;
}) => {
    return (
      <SectionMarkdownEditor
        content={section.content}
        onChange={onContentChange}
        onDelete={onDelete}
        dragHandleProps={dragHandleProps}
        dragListeners={dragListeners}
        getImage={getImage}
        titleFallback={t.newSection}
        labels={{
          section: t.section || t.newSection,
          untitled: t.newSection,
          split: t.split,
          preview: t.preview,
          writeContent: t.writeContent,
          delete: t.deleteSection || t.newSection,
        }}
      />
    );
}

const emptyVulnerability: Omit<Vulnerability, 'id'> = {
  title_en: '',
  title_es: '',
  overview_en: '### Overview\n\n[TODO: Add summary in English]',
  overview_es: '### Resumen\n\n[TODO: Añadir resumen en español]',
  technicalDescription_en: '### Technical Description\n\n[TODO: Add technical description in English]',
  technicalDescription_es: '### Descripción Técnica\n\n[TODO: Añadir descripción técnica en español]',
  affectedComponents_en: '### Affected Components\n\n- [TODO: List affected components]',
  affectedComponents_es: '### Componentes Afectados\n\n- [TODO: Listar componentes afectados]',
  impact_en: '### Impact\n\n[TODO: Describe impact in English]',
  impact_es: '### Impacto\n\n[TODO: Describir impacto en español]',
  immediateActions_en: "### Immediate Actions\n[TODO: Add immediate actions in English]",
  immediateActions_es: "### Acciones Inmediatas\n[TODO: Añadir acciones inmediatas en español]",
  details_en: '### Proof of Concept\n\n[TODO: Add PoC in English]',
  details_es: '### Prueba de Concepto\n\n[TODO: Añadir PoC en español]',
  recommendations_en: `### Recommendations
#### Short-Term Recommendations
[TODO]
#### Medium-Term Recommendations
[TODO]
#### Long-Term Recommendations
[TODO]`,
  recommendations_es: `### Recomendaciones
#### Recomendaciones a Corto Plazo
[TODO]
#### Recomendaciones a Medio Plazo
[TODO]
#### Recomendaciones a Largo Plazo
[TODO]`,
  cwe: '',
  cvss: {
    score: 0,
    vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:N',
    attackVector: 'N',
    attackComplexity: 'L',
    privilegesRequired: 'N',
    userInteraction: 'N',
    scope: 'U',
    confidentiality: 'N',
    integrity: 'N',
    availability: 'N',
  },
  severity: 'Informational',
  references: [],
  tags: [],
};

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

export default function NewVulnerabilityPage() {
  const { toast } = useToast();
  const { language } = useLanguage();
  const router = useRouter();
  const { addVulnerability, getImage } = useData();
  const [vuln, setVuln] = useState<Omit<Vulnerability, 'id'>>(emptyVulnerability);
  const [references, setReferences] = useState<string[]>([]);
  const sensors = useSensors( useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }) );
  
  const [enSections, setEnSections] = useState<FindingSection[]>([]);
  const [esSections, setEsSections] = useState<FindingSection[]>([]);
  const [activeAccordion, setActiveAccordion] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const t = {
    en: {
      back: 'Back to Vulnerabilities',
      save: 'Create Vulnerability',
      title: 'New Vulnerability Template',
      description: 'Create a new reusable vulnerability template for the database.',
      detailsTitle: 'Description',
      titleEnLabel: 'Title (English)',
      titleEsLabel: 'Title (Spanish)',
      cweLabel: 'CWE',
      categoryLabel: 'Category',
      selectCategory: 'Select a category',
      referencesLabel: 'References',
      addReference: 'Add Reference',
      saveSuccessTitle: 'Vulnerability Created',
      saveSuccessDescription: 'The new template has been added to the database.',
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
      validationErrorTitle: 'Required Fields Missing',
      validationErrorDescription: 'Please fill in the English title, Spanish title, and category.',
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
      save: 'Crear Vulnerabilidad',
      title: 'Nueva Plantilla de Vulnerabilidad',
      description: 'Crea una nueva plantilla de vulnerabilidad reutilizable para la base de datos.',
      detailsTitle: 'Descripción',
      titleEnLabel: 'Título (Inglés)',
      titleEsLabel: 'Título (Español)',
      cweLabel: 'CWE',
      categoryLabel: 'Categoría',
      selectCategory: 'Selecciona una categoría',
      referencesLabel: 'Referencias',
      addReference: 'Añadir Referencia',
      saveSuccessTitle: 'Vulnerabilidad Creada',
      saveSuccessDescription: 'La nueva plantilla ha sido añadida a la base de datos.',
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
      validationErrorTitle: 'Faltan Campos Obligatorios',
      validationErrorDescription: 'Por favor, rellena el título en inglés, el título en español y la categoría.',
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

  const getFullContent = useCallback((vuln: Omit<Vulnerability, 'id'>, lang: 'en' | 'es'): string => {
    const sections = [
        vuln[`overview_${lang}`],
        vuln[`technicalDescription_${lang}`],
        vuln[`affectedComponents_${lang}`],
        vuln[`impact_${lang}`],
        vuln[`immediateActions_${lang}`],
        vuln[`details_${lang}`],
        vuln[`recommendations_${lang}`]
    ];
    return sections.filter(Boolean).join('\n\n---\n\n');
  }, []);

  const parseMarkdownToSections = useCallback((markdown: string): FindingSection[] => {
    if (!markdown) return [];
    const parts = markdown.split(/\n\s*---\s*\n/);
    return parts.map((part, index) => ({
        id: `section-${index}-${Date.now()}-${Math.random()}`,
        content: part.trim()
    })).filter(p => p.content.trim() !== '');
  }, []);
  
  const handleInputChange = useCallback(<T extends keyof Omit<Vulnerability, 'id'>>(field: T, value: Omit<Vulnerability, 'id'>[T]) => {
    setVuln(prev => ({ ...prev, [field]: value }));
  }, []);
  
  const handleCategoryChange = useCallback((value: string) => {
    setVuln(prev => ({ ...prev, tags: [value] }));
  }, []);

  const handleCvssChange = useCallback((field: keyof CVSS, value: string | number) => {
    setVuln(prevVuln => {
        const newCvss = { ...prevVuln.cvss, [field]: value };
        const vectorString = getCVSS(newCvss);
        const score = getScore(vectorString);
        const severity = getSeverity(score) as Severity;
        return {
            ...prevVuln,
            cvss: { ...newCvss, vectorString, score },
            severity,
        };
    });
  }, []);
  
  const validateFields = () => {
    const newErrors: Record<string, boolean> = {};
    if (!vuln.title_en) newErrors.title_en = true;
    if (!vuln.title_es) newErrors.title_es = true;
    if (!vuln.tags || vuln.tags.length === 0 || !vuln.tags[0]) newErrors.category = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSave = () => {
    if (!validateFields()) {
      toast({
        variant: 'destructive',
        title: t[language].validationErrorTitle,
        description: t[language].validationErrorDescription,
      });
      return;
    }

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

    const newVuln: Omit<Vulnerability, 'id'> = {
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

    addVulnerability(newVuln);
    toast({
      title: t[language].saveSuccessTitle,
      description: t[language].saveSuccessDescription,
    });
    router.push('/dashboard/vulnerabilities');
  };
  
  const handleSectionChange = (lang: 'en' | 'es', sectionId: string, newContent: string) => {
    const updater = lang === 'en' ? setEnSections : setEsSections;
    updater(prev => prev.map(s => s.id === sectionId ? { ...s, content: newContent } : s));
  };
  

  const handleAddSection = (lang: 'en' | 'es') => {
    const newSection: FindingSection = { id: `new-${lang}-${Date.now()}`, content: `### ${t[language].newSection}` };
    if (lang === 'en') {
        setEnSections(prev => [...prev, newSection]);
    } else {
        setEsSections(prev => [...prev, newSection]);
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

  const handleReferenceChange = (index: number, value: string) => {
    const newReferences = [...references];
    newReferences[index] = value;
    setReferences(newReferences);
  };

  const handleAddReference = () => {
    setReferences([...references, '']);
  };

  const handleRemoveReference = (index: number) => {
    const newReferences = references.filter((_, i) => i !== index);
    setReferences(newReferences);
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

  useEffect(() => {
    const initialEnSections = parseMarkdownToSections(getFullContent(emptyVulnerability, 'en'));
    const initialEsSections = parseMarkdownToSections(getFullContent(emptyVulnerability, 'es'));
    setEnSections(initialEnSections);
    setEsSections(initialEsSections);
  }, [parseMarkdownToSections, getFullContent]);

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
                <h1 className="font-headline text-xl font-bold">{t[language].title}</h1>
                {vuln.severity && <Badge variant={getSeverityVariant(vuln.severity)}>{vuln.severity}</Badge>}
            </div>
        </div>
        <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" /> {t[language].save}</Button>
      </header>
      
        <div className="space-y-6 px-4 sm:px-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t[language].detailsTitle}</CardTitle>
                    <CardDescription>{t[language].description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="title_en">{t[language].titleEnLabel}</Label>
                            <Input id="title_en" value={vuln.title_en} onChange={e => handleInputChange('title_en', e.target.value)} className={cn(errors.title_en && 'border-destructive')} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="title_es">{t[language].titleEsLabel}</Label>
                            <Input id="title_es" value={vuln.title_es} onChange={e => handleInputChange('title_es', e.target.value)} className={cn(errors.title_es && 'border-destructive')} />
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
                                <SelectTrigger id="category" className={cn(errors.category && 'border-destructive')}>
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
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1.5">
                        <CardTitle>{t[language].cvssTitle}</CardTitle>
                        <CardDescription>{t[language].cvssDescription}</CardDescription>
                      </div>
                      {vuln.severity && <Badge variant={getSeverityVariant(vuln.severity)}>{vuln.severity}</Badge>}
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
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
                </CardContent>
            </Card>

            <Accordion type="multiple" className="w-full space-y-6" value={activeAccordion} onValueChange={setActiveAccordion}>
              <AccordionItem value="en-content" className="border bg-card rounded-lg data-[state=closed]:border data-[state=open]:border-b-0">
                <AccordionTrigger className="p-4 hover:no-underline flex-1" onClick={(e) => { e.stopPropagation(); setActiveAccordion(prev => prev.includes('en-content') ? prev.filter(item => item !== 'en-content') : [...prev, 'en-content'])}}>
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
                              getImage={getImage}
                              t={t[language]}
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
                      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'es')}>
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
