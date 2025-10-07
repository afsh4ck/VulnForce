
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { ChevronLeft, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/language-context';
import type { Vulnerability, Finding, Project } from '@/lib/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useData } from '@/context/data-context';

// A simple representation of finding content, can be expanded later
interface FindingContent {
  overview: string;
  technicalDescription: string;
  affectedComponents: string;
  impact: string;
  recommendations: string;
  details: string;
}

export default function FindingEditorPage() {
  const params = useParams();
  const router = useRouter();
  const { id: projectId, findingId } = params;
  const { toast } = useToast();
  const { language: uiLanguage } = useLanguage();
  const { projects, clients, findings, vulnerabilities, addFinding, updateFinding } = useData();

  const [title, setTitle] = useState('');
  const [severity, setSeverity] = useState<string>('');
  const [cvss, setCvss] = useState<string>('');
  
  const [project, setProject] = useState<Project | undefined>();
  const [projectLanguage, setProjectLanguage] = useState<Project['language']>('en');

  // State for bilingual content
  const [contentEn, setContentEn] = useState<FindingContent>({ overview: '', technicalDescription: '', affectedComponents: '', impact: '', recommendations: '', details: '' });
  const [contentEs, setContentEs] = useState<FindingContent>({ overview: '', technicalDescription: '', affectedComponents: '', impact: '', recommendations: '', details: '' });

  const client = clients.find(c => c.id === project?.clientId);

  useEffect(() => {
    const currentProject = projects.find(p => p.id === projectId);
    setProject(currentProject);
    if(currentProject){
      setProjectLanguage(currentProject.language)
    }
    
    if (findingId !== 'new') {
      const finding = findings.find(f => f.id === findingId && f.projectId === projectId);
      if (finding) {
        setTitle(finding.title);
        setSeverity(finding.severity);
        setCvss(finding.cvss.toString());
        // This is a simplified parsing logic.
        // A real implementation would need a more robust markdown parser
        // to split the content back into the respective fields.
        // For now, we'll just show the full markdown in the overview for both.
        setContentEn(prev => ({ ...prev, overview: finding.markdown }));
        setContentEs(prev => ({ ...prev, overview: finding.markdown }));
      } else {
        router.push(`/dashboard/projects/${projectId}`);
      }
    } else {
      setTitle(projectLanguage === 'es' ? 'Nuevo Hallazgo' : 'New Finding');
    }
  }, [findingId, projectId, projectLanguage, findings, router, projects]);


  const handleSave = () => {
    if (!title || !severity || !cvss) {
      toast({
        variant: 'destructive',
        title: uiLanguage === 'es' ? 'Campos Incompletos' : 'Incomplete Fields',
        description: uiLanguage === 'es' ? 'Por favor, rellena todos los detalles del hallazgo.' : 'Please fill in all finding details.',
      });
      return;
    }

    const createMarkdown = (content: FindingContent, langT: any) => {
      return `### ${langT.overview}\n${content.overview}\n\n### ${langT.technicalDescription}\n${content.technicalDescription}\n\n### ${langT.affectedComponents}\n${content.affectedComponents}\n\n### ${langT.impact}\n${content.impact}\n\n### ${langT.recommendations}\n${content.recommendations}\n\n### ${langT.details}\n${content.details}`;
    };

    const combinedMarkdown = projectLanguage === 'es'
        ? `## Contenido en Español\n\n${createMarkdown(contentEs, t.es)}`
        : `## English Content\n\n${createMarkdown(contentEn, t.en)}`;


    const findingData = {
      title,
      severity,
      cvss: parseFloat(cvss) || 0,
      projectId: Array.isArray(projectId) ? projectId[0] : projectId,
      markdown: combinedMarkdown,
    };

    if (findingId === 'new') {
      addFinding(findingData);
      toast({ title: t[uiLanguage].saveSuccessTitle, description: `${title} ${t[uiLanguage].saveSuccessNew}` });
    } else {
      updateFinding({
        id: Array.isArray(findingId) ? findingId[0] : findingId,
        ...findingData,
      });
      toast({ title: t[uiLanguage].saveSuccessTitle, description: `${title} ${t[uiLanguage].saveSuccessUpdate}` });
    }
    
    router.push(`/dashboard/projects/${projectId}`);
  };


  const handleContentChange = (lang: 'en' | 'es', field: keyof FindingContent, value: string) => {
    if (lang === 'en') {
      setContentEn(prev => ({ ...prev, [field]: value }));
    } else {
      setContentEs(prev => ({ ...prev, [field]: value }));
    }
  }

  const t = {
    en: {
      backToProject: 'Back to Project',
      saveFinding: 'Save Finding',
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
      englishContent: 'English Content',
      spanishContent: 'Spanish Content',
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
    },
    es: {
      backToProject: 'Volver al Proyecto',
      saveFinding: 'Guardar Hallazgo',
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
      englishContent: 'Contenido en Inglés',
      spanishContent: 'Contenido en Español',
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
    }
  }

  const getVulnTitle = (vuln: Vulnerability) => {
    return projectLanguage === 'es' ? vuln.title_es : vuln.title_en;
  }

  const handleImport = (vulnId: string) => {
    const vuln = vulnerabilities.find(v => v.id === vulnId);
    if (vuln) {
      setTitle(getVulnTitle(vuln));
      setSeverity(vuln.severity);
      setCvss(vuln.cvss.score.toString());
      
      const contentToSet = {
        overview: projectLanguage === 'es' ? vuln.overview_es : vuln.overview_en,
        technicalDescription: projectLanguage === 'es' ? vuln.technicalDescription_es : vuln.technicalDescription_en,
        affectedComponents: projectLanguage === 'es' ? vuln.affectedComponents_es : vuln.affectedComponents_en,
        impact: projectLanguage === 'es' ? vuln.impact_es : vuln.impact_en,
        recommendations: projectLanguage === 'es' ? vuln.recommendations_es : vuln.recommendations_en,
        details: projectLanguage === 'es' ? vuln.details_es : vuln.details_en,
      }

      if (projectLanguage === 'es') {
          setContentEs(contentToSet);
      } else {
          setContentEn(contentToSet);
      }
    }
  }

  const renderContentFields = (lang: 'en' | 'es') => {
    const content = lang === 'en' ? contentEn : contentEs;
    const langT = t[lang];
    
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>{langT.overview}</Label>
                <Textarea value={content.overview} onChange={e => handleContentChange(lang, 'overview', e.target.value)} className="min-h-[100px] font-code" />
            </div>
            <div className="space-y-2">
                <Label>{langT.technicalDescription}</Label>
                <Textarea value={content.technicalDescription} onChange={e => handleContentChange(lang, 'technicalDescription', e.target.value)} className="min-h-[150px] font-code" />
            </div>
            <div className="space-y-2">
                <Label>{langT.affectedComponents}</Label>
                <Textarea value={content.affectedComponents} onChange={e => handleContentChange(lang, 'affectedComponents', e.target.value)} className="min-h-[80px] font-code" />
            </div>
            <div className="space-y-2">
                <Label>{langT.impact}</Label>
                <Textarea value={content.impact} onChange={e => handleContentChange(lang, 'impact', e.target.value)} className="min-h-[100px] font-code" />
            </div>
            <div className="space-y-2">
                <Label>{langT.recommendations}</Label>
                <Textarea value={content.recommendations} onChange={e => handleContentChange(lang, 'recommendations', e.target.value)} className="min-h-[100px] font-code" />
            </div>
             <div className="space-y-2">
                <Label>{langT.details}</Label>
                <Textarea value={content.details} onChange={e => handleContentChange(lang, 'details', e.target.value)} className="min-h-[150px] font-code" />
            </div>
        </div>
    )
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/projects/${projectId}`}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              {t[uiLanguage].backToProject}
            </Link>
          </Button>
          <div>
            <h1 className="font-headline text-xl font-bold">{title || (projectLanguage === 'es' ? 'Nuevo Hallazgo' : 'New Finding')}</h1>
            <p className="text-sm text-muted-foreground">{project?.name} / {client?.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" /> {t[uiLanguage].saveFinding}</Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t[uiLanguage].findingDetails}</CardTitle>
              <CardDescription>{t[uiLanguage].importFromDB}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">{t[uiLanguage].titleLabel}</Label>
                    <Input id="title" value={title} onChange={e => setTitle(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t[uiLanguage].importFromDB}</Label>
                     <Select onValueChange={handleImport}>
                        <SelectTrigger>
                          <SelectValue placeholder={t[uiLanguage].selectTemplate} />
                        </SelectTrigger>
                        <SelectContent>
                          {vulnerabilities.map(v => (
                            <SelectItem key={v.id} value={v.id}>{getVulnTitle(v)}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                  </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="severity">{t[uiLanguage].severityLabel}</Label>
                  <Select value={severity} onValueChange={setSeverity}>
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
                  <Input id="cvss" type="number" step="0.1" value={cvss} onChange={e => setCvss(e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle>{t[uiLanguage].content}</CardTitle>
                <CardDescription>
                  {projectLanguage === 'es' ? 'Rellena el contenido del hallazgo en español.' : 'Fill in the finding content in English.'}
                </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" defaultValue={`${projectLanguage}-content`} collapsible className="w-full">
                <AccordionItem value="en-content" style={{ display: projectLanguage === 'en' ? 'block' : 'none' }}>
                  <AccordionTrigger className="text-lg font-semibold">{t[uiLanguage].englishContent}</AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    {renderContentFields('en')}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="es-content" style={{ display: projectLanguage === 'es' ? 'block' : 'none' }}>
                  <AccordionTrigger className="text-lg font-semibold">{t[uiLanguage].spanishContent}</AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    {renderContentFields('es')}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

      </div>
    </div>
  );
}
