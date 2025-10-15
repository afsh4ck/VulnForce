'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { ChevronLeft, Save, Plus, GripVertical, Trash2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/language-context';
import type { Vulnerability, Finding, Project, ImageAsset, Severity } from '@/lib/types';
import { useData } from '@/context/data-context';
import { Combobox } from '@/components/ui/combobox';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Badge } from '@/components/ui/badge';
import { MarkdownPreview } from '@/components/markdown-preview';
import { Textarea } from '@/components/ui/textarea';

type SaveStatus = 'unsaved' | 'saving' | 'saved';

interface FindingSection {
  id: string;
  content: string;
}

const SectionEditor = ({ section, onContentChange }: {
  section: FindingSection;
  onContentChange: (content: string) => void;
}) => {
    const [isEditing, setIsEditing] = useState(false);

    if (isEditing) {
        return (
            <Textarea
                value={section.content}
                onChange={(e) => onContentChange(e.target.value)}
                onBlur={() => setIsEditing(false)}
                autoFocus
                className="w-full min-h-[150px] border-0 rounded-t-none font-code text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
            />
        )
    }
    
    return (
        <div className="py-2" onClick={() => setIsEditing(true)}>
            <MarkdownPreview content={section.content} getImage={() => undefined} />
        </div>
    );
}

const SortableSection = ({ section, index, onAddSection, onDelete, ...props }: { section: FindingSection, index: number, onAddSection: (index: number) => void, onDelete: () => void, isOrganizing: boolean, [key: string]: any }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 'auto',
  };
  
  return (
    <div ref={setNodeRef} style={style} className="relative group/section">
      <div className="absolute top-0 -left-12 h-full flex items-center gap-1 opacity-0 group-hover/section:opacity-100 transition-opacity">
         <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer" onClick={() => onAddSection(index + 1)}>
          <Plus className="h-4 w-4"/>
        </Button>
        <div {...attributes} {...listeners} className="cursor-grab p-1">
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>
       <div className="absolute top-0 -right-12 h-full flex items-center opacity-0 group-hover/section:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <SectionEditor section={section} {...props} />
    </div>
  );
};


export default function FindingEditorPage() {
  const params = useParams();
  const router = useRouter();
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
                description: uiLanguage === 'es'_es ? 'Por favor, rellena todos los detalles del hallazgo.' : 'Please fill in all finding details.',
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
      saveSuccessTitle: 'Finding Saved',
      saveSuccessNew: 'has been created.',
      saveSuccessUpdate: 'has been updated.',
      addNewSection: 'Add New Section',
      newSection: 'New Section',
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
      saveSuccessTitle: 'Hallazgo Guardado',
      saveSuccessNew: 'ha sido creado.',
      saveSuccessUpdate: 'ha sido actualizado.',
      addNewSection: 'Añadir Nueva Sección',
      newSection: 'Nueva Sección',
      searchVulnerability: 'Buscar vulnerabilidad...'
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
        vuln[`recommendations_${projectLanguage}`],
        vuln[`details_${projectLanguage}`],
      ];

      const newSections = newSectionsContent.map(content => ({
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

          <div className="space-y-4 mt-6">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
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
                            isOrganizing={false}
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
