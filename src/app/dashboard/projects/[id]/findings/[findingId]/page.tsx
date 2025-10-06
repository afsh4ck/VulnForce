'use client';

import { useState, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import { findings as allFindings, projects, vulnerabilities, clients } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { Bot, ChevronLeft, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateFindingTemplates } from '@/ai/flows/generate-finding-templates';
import { useLanguage } from '@/context/language-context';
import type { Vulnerability } from '@/lib/types';
import { MarkdownPreview } from '@/components/markdown-preview';

export default function FindingEditorPage() {
  const params = useParams();
  const { id: projectId, findingId } = params;
  const { toast } = useToast();
  const { language } = useLanguage();

  const [markdown, setMarkdown] = useState('');
  const [title, setTitle] = useState('');
  const [severity, setSeverity] = useState<string>('');
  const [cvss, setCvss] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (findingId !== 'new') {
      const finding = allFindings.find(f => f.id === findingId && f.projectId === projectId);
      if (finding) {
        setTitle(finding.title);
        setSeverity(finding.severity);
        setCvss(finding.cvss.toString());
        setMarkdown(finding.markdown);
      } else {
        notFound();
      }
    } else {
      setTitle(language === 'es' ? 'Nuevo Hallazgo' : 'New Finding');
    }
  }, [findingId, projectId, language]);

  const project = projects.find(p => p.id === projectId);
  const client = clients.find(c => c.id === project?.clientId);

  const handleGenerate = async () => {
    setIsGenerating(true);
    toast({ title: language === 'es' ? 'La IA está pensando...' : 'AI is thinking...', description: language === 'es' ? 'Generando sugerencias para tu hallazgo.' : 'Generating suggestions for your finding.' });

    try {
      const currentFindingDetails = `Title: ${title}\nSeverity: ${severity}\nCVSS: ${cvss}\n\n${markdown}`;
      const previousFindings = allFindings
        .filter(f => f.projectId === projectId && f.id !== findingId)
        .map(f => `Title: ${f.title}\n${f.markdown}`)
        .join('\n\n---\n\n');

      const result = await generateFindingTemplates({
        previousFindings,
        currentFindingDetails,
      });

      const newMarkdown = `### Description\n${result.descriptionSuggestion}\n\n### Risk\n${result.riskSuggestion}\n\n### Mitigation\n${result.mitigationSuggestion}`;
      setMarkdown(newMarkdown);

      toast({ title: language === 'es' ? '¡Sugerencias generadas!' : 'Suggestions generated!', description: language === 'es' ? 'El contenido generado por IA se ha añadido al editor.' : 'AI-powered content has been added to the editor.' });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: language === 'es' ? 'Falló la generación de IA' : 'AI Generation Failed', description: language === 'es' ? 'No se pudieron generar sugerencias. Por favor, inténtalo de nuevo.' : 'Could not generate suggestions. Please try again.' });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const quickAdd = (section: string) => {
    const template = `\n### ${section}\n\n`;
    setMarkdown(markdown + template);
  };

  const t = {
    en: {
      backToProject: 'Back to Project',
      generateWithAI: 'Generate with AI',
      generating: 'Generating...',
      saveFinding: 'Save Finding',
      markdownEditor: 'Markdown Editor',
      placeholder: 'Start writing your finding details here...',
      addDescription: '+ Description',
      addRisk: '+ Risk',
      addEvidence: '+ Evidence',
      addMitigation: '+ Mitigation',
      livePreview: 'Live Preview',
      previewAppear: 'Preview will appear here.',
      findingDetails: 'Finding Details',
      titleLabel: 'Title',
      severityLabel: 'Severity',
      selectSeverity: 'Select severity',
      critical: 'Critical',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      informational: 'Informational',
      cvssScore: 'CVSS Score',
      importFromDB: 'Import from Database',
      selectTemplate: 'Select a vulnerability template',
    },
    es: {
      backToProject: 'Volver al Proyecto',
      generateWithAI: 'Generar con IA',
      generating: 'Generando...',
      saveFinding: 'Guardar Hallazgo',
      markdownEditor: 'Editor Markdown',
      placeholder: 'Empieza a escribir los detalles de tu hallazgo aquí...',
      addDescription: '+ Descripción',
      addRisk: '+ Riesgo',
      addEvidence: '+ Evidencia',
      addMitigation: '+ Mitigación',
      livePreview: 'Vista Previa',
      previewAppear: 'La vista previa aparecerá aquí.',
      findingDetails: 'Detalles del Hallazgo',
      titleLabel: 'Título',
      severityLabel: 'Severidad',
      selectSeverity: 'Seleccionar severidad',
      critical: 'Crítica',
      high: 'Alta',
      medium: 'Media',
      low: 'Baja',
      informational: 'Informativa',
      cvssScore: 'Puntuación CVSS',
      importFromDB: 'Importar desde Base de Datos',
      selectTemplate: 'Seleccionar una plantilla de vulnerabilidad',
    }
  }

  const getVulnTitle = (vuln: Vulnerability) => {
    return language === 'es' ? vuln.title_es : vuln.title_en;
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      <header className="flex items-center justify-between border-b bg-background p-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/projects/${projectId}`}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              {t[language].backToProject}
            </Link>
          </Button>
          <div>
            <h1 className="font-headline text-xl font-bold">{title}</h1>
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
      <div className="grid flex-1 grid-cols-1 overflow-hidden md:grid-cols-3">
        {/* Left column: Editor and details */}
        <div className="flex flex-col overflow-y-auto border-r p-4 md:col-span-2">
          <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="flex flex-col space-y-4">
              <Label htmlFor="markdown-editor">{t[language].markdownEditor}</Label>
              <Textarea
                id="markdown-editor"
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="font-code h-full min-h-[400px] flex-1 resize-none"
                placeholder={t[language].placeholder}
              />
               <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" size="sm" onClick={() => quickAdd('Description')}>{t[language].addDescription}</Button>
                  <Button variant="secondary" size="sm" onClick={() => quickAdd('Risk')}>{t[language].addRisk}</Button>
                  <Button variant="secondary" size="sm" onClick={() => quickAdd('Evidence')}>{t[language].addEvidence}</Button>
                  <Button variant="secondary" size="sm" onClick={() => quickAdd('Mitigation')}>{t[language].addMitigation}</Button>
                </div>
            </div>
            <div className="flex flex-col space-y-4">
              <Label>{t[language].livePreview}</Label>
              <div className="prose prose-sm dark:prose-invert h-full min-h-[400px] w-full max-w-none rounded-md border bg-muted p-4">
                 <MarkdownPreview content={markdown || t[language].previewAppear} />
              </div>
            </div>
          </div>
        </div>
        {/* Right column: Finding details */}
        <aside className="hidden flex-col gap-6 overflow-y-auto p-4 md:flex">
          <Card>
            <CardHeader>
              <CardTitle>{t[language].findingDetails}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">{t[language].titleLabel}</Label>
                <Input id="title" value={title} onChange={e => setTitle(e.target.value)} />
              </div>
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
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t[language].importFromDB}</CardTitle>
            </CardHeader>
            <CardContent>
              <Select onValueChange={(vulnId) => {
                  const vuln = vulnerabilities.find(v => v.id === vulnId);
                  if (vuln) {
                      const isSpanish = language === 'es';
                      setTitle(isSpanish ? vuln.title_es : vuln.title_en);
                      setSeverity(vuln.severity);
                      setCvss(vuln.cvss.score.toString());
                      const md = `
### Overview
${isSpanish ? vuln.overview_es : vuln.overview_en}

### Technical Description
${isSpanish ? vuln.technicalDescription_es : vuln.technicalDescription_en}

### Affected Components
${isSpanish ? vuln.affectedComponents_es : vuln.affectedComponents_en}

### Impact
${isSpanish ? vuln.impact_es : vuln.impact_en}

### Recommendations
${isSpanish ? vuln.recommendations_es : vuln.recommendations_en}

### Remediation
**Short Term:** ${isSpanish ? vuln.remediation_es.shortTerm : vuln.remediation_en.shortTerm}
**Medium Term:** ${isSpanish ? vuln.remediation_es.mediumTerm : vuln.remediation_en.mediumTerm}
**Long Term:** ${isSpanish ? vuln.remediation_es.longTerm : vuln.remediation_en.longTerm}

### References
${vuln.references.map(ref => `- ${ref}`).join('\n')}
                      `;
                      setMarkdown(md.trim());
                  }
              }}>
                <SelectTrigger>
                  <SelectValue placeholder={t[language].selectTemplate} />
                </SelectTrigger>
                <SelectContent>
                  {vulnerabilities.map(v => (
                    <SelectItem key={v.id} value={v.id}>{getVulnTitle(v)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
