'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { ChevronLeft, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/language-context';
import type { Vulnerability, CVSS, Remediation } from '@/lib/types';
import { useRouter } from 'next/navigation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const emptyVulnerability: Omit<Vulnerability, 'id'> = {
  title_en: '',
  title_es: '',
  overview_en: '',
  overview_es: '',
  technicalDescription_en: '',
  technicalDescription_es: '',
  affectedComponents_en: '',
  affectedComponents_es: '',
  impact_en: '',
  impact_es: '',
  recommendations_en: '',
  recommendations_es: '',
  details_en: '',
  details_es: '',
  remediation_en: { shortTerm: '', mediumTerm: '', longTerm: '' },
  remediation_es: { shortTerm: '', mediumTerm: '', longTerm: '' },
  cwe: '',
  cvss: {
    score: 0,
    vectorString: '',
    attackVector: '',
    attackComplexity: '',
    privilegesRequired: '',
    userInteraction: '',
    scope: '',
    confidentiality: '',
    integrity: '',
    availability: '',
  },
  severity: 'Informational',
  references: [],
  tags: [],
};

export default function NewVulnerabilityPage() {
  const { toast } = useToast();
  const { language } = useLanguage();
  const router = useRouter();
  const [vuln, setVuln] = useState<Omit<Vulnerability, 'id'>>(emptyVulnerability);

  const handleInputChange = <T extends keyof Omit<Vulnerability, 'id'>>(field: T, value: Omit<Vulnerability, 'id'>[T]) => {
    setVuln({ ...vuln, [field]: value });
  };

  const handleCvssChange = (field: keyof CVSS, value: string | number) => {
    const newCvss = { ...vuln.cvss, [field]: value };
    setVuln({ ...vuln, cvss: newCvss });
  };
  
  const handleRemediationChange = (lang: 'en' | 'es', field: keyof Remediation, value: string) => {
    const remediationLang = lang === 'en' ? 'remediation_en' : 'remediation_es';
    const newRemediation = { ...vuln[remediationLang], [field]: value };
    setVuln({ ...vuln, [remediationLang]: newRemediation });
  }

  const handleSave = () => {
    const newId = `vuln-${Date.now()}`;
    const newVulnerability: Vulnerability = { id: newId, ...vuln };
    console.log("Saving new vulnerability:", newVulnerability);
    toast({
      title: t[language].saveSuccessTitle,
      description: t[language].saveSuccessDescription,
    });
    router.push('/dashboard/vulnerabilities');
  };

   const t = {
    en: {
      back: 'Back to Vulnerabilities',
      save: 'Create Vulnerability',
      title: 'New Vulnerability Template',
      description: 'Create a new reusable vulnerability template for the database.',
      detailsTitle: 'Vulnerability Template Details',
      titleEnLabel: 'Title (English)',
      titleEsLabel: 'Title (Spanish)',
      cweLabel: 'CWE',
      tagsLabel: 'Tags (comma-separated)',
      referencesLabel: 'References (comma-separated URLs)',
      saveSuccessTitle: 'Vulnerability Created',
      saveSuccessDescription: 'The new template has been added to the database.',
      overview: 'Overview',
      technicalDescription: 'Technical Description',
      affectedComponents: 'Affected Components',
      impact: 'Impact',
      recommendations: 'Recommendations',
      details: 'Details (Examples, Context)',
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
      remediationTitle: 'Remediation Summary',
      shortTerm: 'Short Term Mitigation',
      mediumTerm: 'Medium Term Mitigation',
      longTerm: 'Long Term Mitigation',
      severity: 'Severity',
      selectSeverity: 'Select severity',
      critical: 'Critical',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      informational: 'Informational',
    },
    es: {
      back: 'Volver a Vulnerabilidades',
      save: 'Crear Vulnerabilidad',
      title: 'Nueva Plantilla de Vulnerabilidad',
      description: 'Crea una nueva plantilla de vulnerabilidad reutilizable para la base de datos.',
      detailsTitle: 'Detalles de la Plantilla de Vulnerabilidad',
      titleEnLabel: 'Título (Inglés)',
      titleEsLabel: 'Título (Español)',
      cweLabel: 'CWE',
      tagsLabel: 'Etiquetas (separadas por comas)',
      referencesLabel: 'Referencias (URLs separadas por comas)',
      saveSuccessTitle: 'Vulnerabilidad Creada',
      saveSuccessDescription: 'La nueva plantilla ha sido añadida a la base de datos.',
      overview: 'Resumen',
      technicalDescription: 'Descripción Técnica',
      affectedComponents: 'Componentes Afectados',
      impact: 'Impacto',
      recommendations: 'Recomendaciones',
      details: 'Detalles (Ejemplos, Contexto)',
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
      remediationTitle: 'Resumen de Remediación',
      shortTerm: 'Mitigación a Corto Plazo',
      mediumTerm: 'Mitigación a Mediano Plazo',
      longTerm: 'Mitigación a Largo Plazo',
      severity: 'Severidad',
      selectSeverity: 'Seleccionar severidad',
      critical: 'Crítica',
      high: 'Alta',
      medium: 'Media',
      low: 'Baja',
      informational: 'Informativa',
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/vulnerabilities">
              <ChevronLeft className="mr-2 h-4 w-4" />
              {t[language].back}
            </Link>
          </Button>
          <h1 className="font-headline text-xl font-bold">{t[language].title}</h1>
        </div>
        <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" /> {t[language].save}</Button>
      </header>
      
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>{t[language].detailsTitle}</CardTitle>
                        <CardDescription>{t[language].description}</CardDescription>
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
                                <Label htmlFor="tags">{t[language].tagsLabel}</Label>
                                <Input id="tags" value={vuln.tags.join(', ')} onChange={e => handleInputChange('tags', e.target.value.split(',').map(t => t.trim()))} />
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="references">{t[language].referencesLabel}</Label>
                            <Input id="references" value={vuln.references.join(', ')} onChange={e => handleInputChange('references', e.target.value.split(',').map(r => r.trim()))} />
                        </div>
                    </CardContent>
                </Card>

                <Accordion type="multiple" defaultValue={['en-content', 'es-content']} className="w-full">
                    <AccordionItem value="en-content">
                        <AccordionTrigger className="text-lg font-semibold">{t[language].englishContent}</AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-2">
                            <Card>
                                <CardHeader><CardTitle>{t[language].overview}</CardTitle></CardHeader>
                                <CardContent><Textarea value={vuln.overview_en} onChange={e => handleInputChange('overview_en', e.target.value)} className="min-h-[100px] font-code" /></CardContent>
                            </Card>
                            <Card>
                                <CardHeader><CardTitle>{t[language].technicalDescription}</CardTitle></CardHeader>
                                <CardContent><Textarea value={vuln.technicalDescription_en} onChange={e => handleInputChange('technicalDescription_en', e.target.value)} className="min-h-[150px] font-code" /></CardContent>
                            </Card>
                            <Card>
                                <CardHeader><CardTitle>{t[language].affectedComponents}</CardTitle></CardHeader>
                                <CardContent><Textarea value={vuln.affectedComponents_en} onChange={e => handleInputChange('affectedComponents_en', e.target.value)} className="min-h-[80px] font-code" /></CardContent>
                            </Card>
                            <Card>
                                <CardHeader><CardTitle>{t[language].impact}</CardTitle></CardHeader>
                                <CardContent><Textarea value={vuln.impact_en} onChange={e => handleInputChange('impact_en', e.target.value)} className="min-h-[100px] font-code" /></CardContent>
                            </Card>
                            <Card>
                                <CardHeader><CardTitle>{t[language].recommendations}</CardTitle></CardHeader>
                                <CardContent><Textarea value={vuln.recommendations_en} onChange={e => handleInputChange('recommendations_en', e.target.value)} className="min-h-[100px] font-code" /></CardContent>
                            </Card>
                            <Card>
                                <CardHeader><CardTitle>{t[language].details}</CardTitle></CardHeader>
                                <CardContent><Textarea value={vuln.details_en} onChange={e => handleInputChange('details_en', e.target.value)} className="min-h-[150px] font-code" /></CardContent>
                            </Card>
                            <Card>
                                <CardHeader><CardTitle>{t[language].remediationTitle}</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>{t[language].shortTerm}</Label>
                                        <Textarea value={vuln.remediation_en.shortTerm} onChange={e => handleRemediationChange('en', 'shortTerm', e.target.value)} className="min-h-[80px] font-code" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>{t[language].mediumTerm}</Label>
                                        <Textarea value={vuln.remediation_en.mediumTerm} onChange={e => handleRemediationChange('en', 'mediumTerm', e.target.value)} className="min-h-[80px] font-code" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>{t[language].longTerm}</Label>
                                        <Textarea value={vuln.remediation_en.longTerm} onChange={e => handleRemediationChange('en', 'longTerm', e.target.value)} className="min-h-[80px] font-code" />
                                    </div>
                                </CardContent>
                            </Card>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="es-content">
                        <AccordionTrigger className="text-lg font-semibold">{t[language].spanishContent}</AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-2">
                            <Card>
                                <CardHeader><CardTitle>{t[language].overview}</CardTitle></CardHeader>
                                <CardContent><Textarea value={vuln.overview_es} onChange={e => handleInputChange('overview_es', e.target.value)} className="min-h-[100px] font-code" /></CardContent>
                            </Card>
                            <Card>
                                <CardHeader><CardTitle>{t[language].technicalDescription}</CardTitle></CardHeader>
                                <CardContent><Textarea value={vuln.technicalDescription_es} onChange={e => handleInputChange('technicalDescription_es', e.target.value)} className="min-h-[150px] font-code" /></CardContent>
                            </Card>
                            <Card>
                                <CardHeader><CardTitle>{t[language].affectedComponents}</CardTitle></CardHeader>
                                <CardContent><Textarea value={vuln.affectedComponents_es} onChange={e => handleInputChange('affectedComponents_es', e.target.value)} className="min-h-[80px] font-code" /></CardContent>
                            </Card>
                             <Card>
                                <CardHeader><CardTitle>{t[language].impact}</CardTitle></CardHeader>
                                <CardContent><Textarea value={vuln.impact_es} onChange={e => handleInputChange('impact_es', e.target.value)} className="min-h-[100px] font-code" /></CardContent>
                            </Card>
                            <Card>
                                <CardHeader><CardTitle>{t[language].recommendations}</CardTitle></CardHeader>
                                <CardContent><Textarea value={vuln.recommendations_es} onChange={e => handleInputChange('recommendations_es', e.target.value)} className="min-h-[100px] font-code" /></CardContent>
                            </Card>
                            <Card>
                                <CardHeader><CardTitle>{t[language].details}</CardTitle></CardHeader>
                                <CardContent><Textarea value={vuln.details_es} onChange={e => handleInputChange('details_es', e.target.value)} className="min-h-[150px] font-code" /></CardContent>
                            </Card>
                            <Card>
                                <CardHeader><CardTitle>{t[language].remediationTitle}</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>{t[language].shortTerm}</Label>
                                        <Textarea value={vuln.remediation_es.shortTerm} onChange={e => handleRemediationChange('es', 'shortTerm', e.target.value)} className="min-h-[80px] font-code" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>{t[language].mediumTerm}</Label>
                                        <Textarea value={vuln.remediation_es.mediumTerm} onChange={e => handleRemediationChange('es', 'mediumTerm', e.target.value)} className="min-h-[80px] font-code" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>{t[language].longTerm}</Label>
                                        <Textarea value={vuln.remediation_es.longTerm} onChange={e => handleRemediationChange('es', 'longTerm', e.target.value)} className="min-h-[80px] font-code" />
                                    </div>
                                </CardContent>
                            </Card>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
            <div className="space-y-6 lg:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle>{t[language].cvssTitle}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="cvss_score">{t[language].score}</Label>
                            <Input id="cvss_score" type="number" step="0.1" value={vuln.cvss.score} onChange={e => handleCvssChange('score', parseFloat(e.target.value) || 0)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cvss_vector">{t[language].vectorString}</Label>
                            <Input id="cvss_vector" value={vuln.cvss.vectorString} onChange={e => handleCvssChange('vectorString', e.target.value)} />
                        </div>
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
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
