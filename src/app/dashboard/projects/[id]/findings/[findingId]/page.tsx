
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { ChevronLeft, Save, Plus, CheckCircle } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/language-context';
import type { Vulnerability, Finding, Project, ImageAsset, Severity } from '@/lib/types';
import { useData } from '@/context/data-context';
import { useUser } from '@/context/user-context';
import { Combobox } from '@/components/ui/combobox';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Badge } from '@/components/ui/badge';
import { hasTodoMarker, stripMarkdownText } from '@/lib/todo-utils';
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
  index: number;
  onAddSection: (index: number) => void;
  onDelete: () => void;
  onContentChange: (content: string) => void;
  getImage: (id: string) => ImageAsset | undefined;
  splitLayout: number[];
  onSplitLayoutChange: (layout: number[]) => void;
  collapsed: boolean;
  onCollapseAll: () => void;
  onCollapsedChange: (sectionId: string, collapsed: boolean) => void;
  variables?: import('@/lib/markdown-utils').VariableContext;
  labels: {
    section: string;
    untitled: string;
    writeContent: string;
    deleteSection: string;
    confirmDeleteTitle: string;
    confirmDeleteDescription: string;
    cancel: string;
    confirmDelete: string;
    expand: string;
    collapse: string;
  };
};

const SortableSection = ({ section, index, onAddSection, onDelete, labels, ...props }: SortableSectionProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 'auto',
  };
  
  return (
    <div ref={setNodeRef} style={style} data-finding-section-id={section.id} className="relative group/section scroll-mt-24">
      <div className="absolute top-0 -left-12 h-full flex items-center gap-1 opacity-0 group-hover/section:opacity-100 transition-opacity">
         <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer" onClick={() => onAddSection(index + 1)}>
          <Plus className="h-4 w-4"/>
        </Button>
      </div>
      <SectionMarkdownEditor
        id={`finding-section-${section.id}`}
        content={section.content}
        onChange={props.onContentChange}
        onDelete={onDelete}
        dragHandleProps={attributes}
        dragListeners={listeners}
        getImage={props.getImage}
        splitLayout={props.splitLayout}
        onSplitLayoutChange={props.onSplitLayoutChange}
        collapsed={props.collapsed}
        onDragHandleClick={props.onCollapseAll}
        dragging={isDragging}
        onCollapsedChange={(collapsed) => props.onCollapsedChange(section.id, collapsed)}
        variables={props.variables}
        titleFallback="Finding section"
        labels={{
          section: labels.section,
          untitled: labels.untitled,
          writeContent: labels.writeContent,
          delete: labels.deleteSection,
          confirmDeleteTitle: labels.confirmDeleteTitle,
          confirmDeleteDescription: labels.confirmDeleteDescription,
          cancel: labels.cancel,
          confirmDelete: labels.confirmDelete,
          expand: labels.expand,
          collapse: labels.collapse,
        }}
      />
    </div>
  );
};


export default function FindingEditorPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawProjectId = params.id;
  const rawFindingId = params.findingId;
  const projectId = (Array.isArray(rawProjectId) ? rawProjectId[0] : rawProjectId) ?? '';
  const findingId = (Array.isArray(rawFindingId) ? rawFindingId[0] : rawFindingId) ?? 'new';
  const { toast } = useToast();
  const { language: uiLanguage } = useLanguage();
  const { projects, clients, findings, vulnerabilities, addFinding, updateFinding, getImage } = useData();
  const { user } = useUser();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const [finding, setFinding] = useState<Omit<Finding, 'id' | 'createdAt' | 'updatedAt'> | null>(null);

  const [project, setProject] = useState<Project | undefined>();
  const [projectLanguage, setProjectLanguage] = useState<Project['language']>('en');
  
  const {
    state: sections,
    setState: setSections,
    resetState: resetSections,
    undo: undoSections,
    redo: redoSections,
  } = useUndoableState<FindingSection[]>([]);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [sectionSplitLayout, setSectionSplitLayout] = useState<number[]>([52, 48]);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const initializedFindingRef = useRef<string | null>(null);

  const client = clients.find(c => c.id === project?.clientId);

  const getFindingSectionTitle = useCallback((content: string) => {
    const headingMatch = content.match(/^#{1,6}\s+(.+)$/m);
    return headingMatch ? stripMarkdownText(headingMatch[1]) : '';
  }, []);

  const parseMarkdownToSections = useCallback((markdown: string): FindingSection[] => {
    if (!markdown) return [];
    
    const parts = splitMarkdownIntoSections(markdown, { maxHeadingLevel: 3 });
    
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

    // Inicializar el editor una sola vez por findingId. Cada autosave crea
    // una nueva referencia en `findings` (prev.map), lo que volvería a
    // ejecutar este effect y regeneraría los IDs de las secciones (perdiendo
    // el foco del textarea durante la edición).
    const initKey = `${projectId}::${findingId}`;
    if (initializedFindingRef.current === initKey) return;

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
        resetSections(initialSections);
        initializedFindingRef.current = initKey;
      } else if (findings.length > 0) {
        router.push(`/dashboard/projects/${projectId}`);
      }
    } else {
        setFinding({
            title: projectLanguage === 'es' ? 'Nuevo Hallazgo' : 'New Finding',
            severity: 'Informational',
            cvss: 0,
            markdown: '',
            projectId,
        });
      resetSections([]);
      initializedFindingRef.current = initKey;
    }
  }, [findingId, projectId, projectLanguage, findings, router, projects, parseMarkdownToSections, resetSections]);

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
  }, [finding, sections, saveStatus]);

  useEffect(() => {
    const todo = searchParams.get('todo');
    const section = searchParams.get('section');
    if (!todo || sections.length === 0) return;

    const found = sections.find((item) => {
      const matchesTodo = item.content.includes(todo) || (todo === 'TODO' && hasTodoMarker(item.content));
      if (!matchesTodo) return false;
      if (!section) return true;
      return getFindingSectionTitle(item.content) === section;
    }) || sections.find(item => item.content.includes(todo) || (todo === 'TODO' && hasTodoMarker(item.content)));

    if (!found) return;

    setTimeout(() => {
      const target = document.querySelector(`[data-finding-section-id="${found.id}"]`) as HTMLElement | null;
      target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const textarea = target?.querySelector('textarea') as HTMLTextAreaElement | null;
      textarea?.focus();
    }, 200);
  }, [searchParams, sections, getFindingSectionTitle]);


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
    const markdownContent = joinMarkdownSections(sections.map(s => s.content));

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
        id: findingId,
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

  const handleSectionChange = (sectionId: string, newContent: string) => {
    setSections(prevSections =>
      prevSections.map(sec => 
        sec.id === sectionId ? { ...sec, content: newContent } : sec
      )
    );
    setSaveStatus('unsaved');
  };
  
  const handleAddSection = (index?: number) => {
    const newSection: FindingSection = {
        id: `section-new-${Date.now()}`,
        content: `### ${t[uiLanguage].newSection}`
    };
    if (index !== undefined) {
      const newSections = [...sections];
      newSections.splice(index, 0, newSection);
      setSections(newSections);
    } else {
      setSections(prev => [...prev, newSection]);
    }
    setSaveStatus('unsaved');
  };

  const handleDeleteSection = (sectionId: string) => {
      setSections(prev => prev.filter(sec => sec.id !== sectionId));
      setCollapsedSections(prev => {
        const next = { ...prev };
        delete next[sectionId];
        return next;
      });
      setSaveStatus('unsaved');
  };

  const collapseAllSections = useCallback(() => {
    setCollapsedSections(Object.fromEntries(sections.map(section => [section.id, true])));
  }, [sections]);

  const expandAllSections = useCallback(() => {
    setCollapsedSections({});
  }, []);

  const setSectionCollapsed = useCallback((sectionId: string, collapsed: boolean) => {
    setCollapsedSections(prev => ({ ...prev, [sectionId]: collapsed }));
  }, []);

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
    expandAllSections();
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
      saveSuccessTitle: 'Finding Saved',
      saveSuccessNew: 'has been created.',
      saveSuccessUpdate: 'has been updated.',
      addNewSection: 'Add New Section',
      newSection: 'New Section',
      searchVulnerability: 'Search vulnerability...',
      deleteSection: 'Delete section',
      confirmDeleteTitle: 'Delete section?',
      confirmDeleteDescription: 'This section will be removed from the editor. You can undo the change with Control+Z.',
      cancel: 'Cancel',
      confirmDelete: 'Delete',
      expand: 'Expand section',
      collapse: 'Collapse sections',
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
      saveSuccessTitle: 'Hallazgo Guardado',
      saveSuccessNew: 'ha sido creado.',
      saveSuccessUpdate: 'ha sido actualizado.',
      addNewSection: 'Añadir Nueva Sección',
      newSection: 'Nueva Sección',
      searchVulnerability: 'Buscar vulnerabilidad...',
      deleteSection: 'Eliminar sección',
      confirmDeleteTitle: '¿Eliminar sección?',
      confirmDeleteDescription: 'Esta sección se eliminará del editor. Puedes deshacer el cambio con Control+Z.',
      cancel: 'Cancelar',
      confirmDelete: 'Eliminar',
      expand: 'Expandir sección',
      collapse: 'Colapsar secciones',
    }
  }

  const getVulnTitle = (vuln: Vulnerability) => {
    return projectLanguage === 'es' ? vuln.title_es : vuln.title_en;
  }
  
  const vulnerabilityOptions = React.useMemo(() => vulnerabilities.map(v => ({
      value: v.id,
      label: getVulnTitle(v),
  })), [vulnerabilities, projectLanguage, getVulnTitle]);


  const handleImport = (vulnId: string) => {
    const vuln = vulnerabilities.find(v => v.id === vulnId);
    if (vuln) {
      handleFieldChange('title', getVulnTitle(vuln));
      handleSeverityChange(vuln.severity);
      
      const newSectionsContent = [
        vuln[`overview_${projectLanguage}`],
        vuln[`technicalDescription_${projectLanguage}`],
        vuln[`affectedComponents_${projectLanguage}`],
        vuln[`impact_${projectLanguage}`],
        vuln[`immediateActions_${projectLanguage}`],
        vuln[`details_${projectLanguage}`],
        vuln[`recommendations_${projectLanguage}`],
      ];

      const newSections = splitMarkdownIntoSections(joinMarkdownSections(newSectionsContent), { maxHeadingLevel: 3 }).map(content => ({
        id: `section-imported-${Date.now()}-${Math.random()}`,
        content: content || ''
      }));

      setSections(newSections);
      setSaveStatus('unsaved');
    }
  }


  return (
    <div className="w-full grid grid-cols-1 gap-6 pt-6">
      <header className="flex items-center justify-between px-4 sm:px-6">
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
          <Button onClick={() => handleSave(true)} disabled={saveStatus === 'saving' || saveStatus === 'saved'}>
            {saveStatus === 'saving' ? (<><Save className="mr-2 h-4 w-4 animate-spin" />{t[uiLanguage].saving}</>) : 
             saveStatus === 'saved' ? (<><CheckCircle className="mr-2 h-4 w-4" />{t[uiLanguage].saved}</>) : 
             (<><Save className="mr-2 h-4 w-4" />{t[uiLanguage].saveFinding}</>)}
          </Button>
        </div>
      </header>

      <div className="w-full px-4 sm:px-6">
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
                    <Label htmlFor="vuln-template">{t[uiLanguage].importFromDB}</Label>
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

          <div className="space-y-4 mt-6">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={collapseAllSections}
                onDragCancel={expandAllSections}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-4">
                        {sections.map((section, index) => {
                           return (
                              <SortableSection
                            key={section.id}
                            section={section}
                            index={index}
                            onAddSection={handleAddSection}
                            onContentChange={(newContent: string) => handleSectionChange(section.id, newContent)}
                            onDelete={() => handleDeleteSection(section.id)}
                            getImage={getImage}
                            splitLayout={sectionSplitLayout}
                            onSplitLayoutChange={setSectionSplitLayout}
                            collapsed={Boolean(collapsedSections[section.id])}
                            onCollapseAll={collapseAllSections}
                            onCollapsedChange={setSectionCollapsed}
                            variables={{
                              client: { name: client?.name, contact: client?.contact, phone: client?.phone },
                              project: project ? { name: project.name, startDate: project.startDate, endDate: project.endDate, language: project.language } : undefined,
                              pentester: { name: user.name, email: user.email, phone: user.phone },
                            }}
                            labels={{
                              section: 'Finding section',
                              untitled: 'Finding section',
                              writeContent: 'Write finding evidence, impact, remediation or notes...',
                              deleteSection: t[uiLanguage].deleteSection,
                              confirmDeleteTitle: t[uiLanguage].confirmDeleteTitle,
                              confirmDeleteDescription: t[uiLanguage].confirmDeleteDescription,
                              cancel: t[uiLanguage].cancel,
                              confirmDelete: t[uiLanguage].confirmDelete,
                              expand: t[uiLanguage].expand,
                              collapse: t[uiLanguage].collapse,
                            }}
                          />
                       );
                    })}
                  </div>
                </SortableContext>
              </DndContext>

              <div className="flex justify-center pt-4">
                  <Button variant="outline" onClick={() => handleAddSection()}>
                      <Plus className="mr-2 h-4 w-4" />
                      {t[uiLanguage].addNewSection}
                  </Button>
              </div>
          </div>
      </div>
    </div>
  );
}
