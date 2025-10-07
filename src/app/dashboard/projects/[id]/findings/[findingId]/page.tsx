'use client';

import { useState, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import { findings as allFindings, projects, vulnerabilities, clients } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { Bot, ChevronLeft, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateFindingTemplates } from '@/ai/flows/generate-finding-templates';
import { useLanguage } from '@/context/language-context';
import type { Vulnerability } from '@/lib/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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
  const { id: projectId, findingId } = params;
  const { toast } = useToast();
  const { language } = useLanguage();

  const [title, setTitle] = useState('');
  const [severity, setSeverity] = useState<string>('');
  const [cvss, setCvss] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // State for bilingual content
  const [contentEn, setContentEn] = useState<FindingContent>({ overview: '', technicalDescription: '', affectedComponents: '', impact: '', recommendations: '', details: '' });
  const [contentEs, setContentEs] = useState<FindingContent>({ overview: '', technicalDescription: '', affectedComponents: '', impact: '', recommendations: '', details: '' });

  const project = projects.find(p => p.id === projectId);
  const client = clients.find(c => c.id === project?.clientId);

  useEffect(() => {
    if (findingId !== 'new') {
      const finding = allFindings.find(f => f.id === findingId && f.projectId === projectId);
      if (finding) {
        setTitle(finding.title);
        setSeverity(finding.severity);
        setCvss(finding.cvss.toString());
        // For now, we'll just put the whole markdown in the overview.
        // A proper migration would be needed for existing data.
        setContentEn(prev => ({ ...prev, overview: finding.markdown }));
        setContentEs(prev => ({ ...prev, overview: finding.markdown }));
      } else {
        notFound();
      }
    } else {
      setTitle(language === 'es' ? 'Nuevo Hallazgo' : 'New Finding');
    }
  }, [findingId, projectId, language]);


  const handleGenerate = async () => {
    // This function would need to be updated to populate the new structured fields
    setIsGenerating(true);
    toast({ title: "AI Generation is not implemented for the new structure yet." });
    setIsGenerating(false);
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
      generateWithAI: 'Generate with AI',
      generating: 'Generating...',
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
    },
    es: {
      backToProject: 'Volver al Proyecto',
      generateWithAI: 'Generar con IA',
      generating: 'Generando...',
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
    }
  }

  const getVulnTitle = (vuln: Vulnerability) => {
    return language === 'es' ? vuln.title_es : vuln.title_en;
  }

  const handleImport = (vulnId: string) => {
    const vuln = vulnerabilities.find(v => v.id === vulnId);
    if (vuln) {
      setTitle(getVulnTitle(vuln));
      setSeverity(vuln.severity);
      setCvss(vuln.cvss.score.toString());
      setContentEn({
        overview: vuln.overview_en,
        technicalDescription: vuln.technicalDescription_en,
        affectedComponents: vuln.affectedComponents_en,
        impact: vuln.impact_en,
        recommendations: vuln.recommendations_en,
        details: vuln.details_en,
      });
      setContentEs({
        overview: vuln.overview_es,
        technicalDescription: vuln.technicalDescription_es,
        affectedComponents: vuln.affectedComponents_es,
        impact: vuln.impact_es,
        recommendations: vuln.recommendations_es,
        details: vuln.details_es,
      });
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
              {t[language].backToProject}
            </Link>
          </Button>
          <div>
            <h1 className="font-headline text-xl font-bold">{title || (language === 'es' ? 'Nuevo Hallazgo' : 'New Finding')}</h1>
            <p className="text-sm text-muted-foreground">{project?.name} / {client?.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleGenerate} disabled={isGenerating}>
            <Bot className="mr-2 h-4 w-4" /> {isGenerating ? t[language].generating : t[language].generateWithAI}
          </Button>
          <Button><Save className="mr-2 h-4 w-4" /> {t[language].saveFinding}</Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t[language].findingDetails}</CardTitle>
              <CardDescription>{t[language].importFromDB}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">{t[language].titleLabel}</Label>
                    <Input id="title" value={title} onChange={e => setTitle(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t[language].importFromDB}</Label>
                     <Select onValueChange={handleImport}>
                        <SelectTrigger>
                          <SelectValue placeholder={t[language].selectTemplate} />
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
                  <Label htmlFor="severity">{t[language].severityLabel}</Label>
                  <Select value={severity} onValueChange={setSeverity}>
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
                  <Label htmlFor="cvss">{t[language].cvssScore}</Label>
                  <Input id="cvss" type="number" step="0.1" value={cvss} onChange={e => setCvss(e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle>{t[language].content}</CardTitle>
                <CardDescription>
                  {language === 'es' ? 'Rellena el contenido del hallazgo en ambos idiomas.' : 'Fill in the finding content in both languages.'}
                </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" defaultValue={['en-content', 'es-content']} className="w-full">
                <AccordionItem value="en-content">
                  <AccordionTrigger className="text-lg font-semibold">{t[language].englishContent}</AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    {renderContentFields('en')}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="es-content">
                  <AccordionTrigger className="text-lg font-semibold">{t[language].spanishContent}</AccordionTrigger>
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
