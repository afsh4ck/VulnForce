
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useData } from '@/context/data-context';
import { Badge } from '@/components/ui/badge';

const vulnerabilityCategories = [
    { value: 'Web', label_en: 'Web', label_es: 'Web' },
    { value: 'Mobile', label_en: 'Mobile', label_es: 'Móvil' },
    { value: 'Network', label_en: 'Network', label_es: 'Red' },
    { value: 'Infrastructure', label_en: 'Infrastructure', label_es: 'Infraestructura' },
    { value: 'Authentication', label_en: 'Authentication', label_es: 'Autenticación' },
    { value: 'Cryptography', label_en: 'Cryptography', label_es: 'Criptografía' },
    { value: 'Additional', label_en: 'Additional', label_es: 'Adicionales' },
];

export default function VulnerabilityEditorPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { toast } = useToast();
  const { language } = useLanguage();
  const { vulnerabilities, updateVulnerability } = useData();

  const [vuln, setVuln] = useState<Vulnerability | null>(null);

  useEffect(() => {
    const vulnerability = vulnerabilities.find(v => v.id === id);
    if (vulnerability) {
      setVuln(JSON.parse(JSON.stringify(vulnerability))); // Deep copy to avoid direct state mutation
    } else {
      router.push('/dashboard/vulnerabilities');
    }
  }, [id, vulnerabilities, router]);

  const handleInputChange = <T extends keyof Vulnerability>(field: T, value: Vulnerability[T]) => {
    if (vuln) {
      setVuln({ ...vuln, [field]: value });
    }
  };

  const handleCategoryChange = (value: string) => {
    if (vuln) {
      setVuln({ ...vuln, tags: [value] });
    }
  };

  const handleCvssChange = (field: keyof CVSS, value: string | number) => {
    if (vuln) {
      const newCvss = { ...vuln.cvss, [field]: value };
      setVuln({ ...vuln, cvss: newCvss });
    }
  };
  
  const handleRemediationChange = (lang: 'en' | 'es', field: keyof Remediation, value: string) => {
     if (vuln) {
        const remediationLang = lang === 'en' ? 'remediation_en' : 'remediation_es';
        const newRemediation = { ...vuln[remediationLang], [field]: value };
        setVuln({ ...vuln, [remediationLang]: newRemediation });
     }
  }

  const handleSave = () => {
    if (vuln) {
        updateVulnerability(vuln);
        toast({
        title: t[language].saveSuccessTitle,
        description: t[language].saveSuccessDescription,
        });
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

  const t = {
    en: {
      back: 'Back to Vulnerabilities',
      save: 'Save Changes',
      detailsTitle: 'Description',
      titleEnLabel: 'Title (English)',
      titleEsLabel: 'Title (Spanish)',
      cweLabel: 'CWE',
      categoryLabel: 'Category',
      selectCategory: 'Select a category',
      referencesLabel: 'References (comma-separated URLs)',
      saveSuccessTitle: 'Vulnerability Saved',
      saveSuccessDescription: 'The template has been updated successfully.',
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
      back: 'Back to Vulnerabilities',
      save: 'Guardar Cambios',
      detailsTitle: 'Descripción',
      titleEnLabel: 'Título (Inglés)',
      titleEsLabel: 'Título (Español)',
      cweLabel: 'CWE',
      categoryLabel: 'Categoría',
      selectCategory: 'Selecciona una categoría',
      referencesLabel: 'Referencias (URLs separadas por comas)',
      saveSuccessTitle: 'Vulnerabilidad Guardada',
      saveSuccessDescription: 'La plantilla se ha actualizado correctamente.',
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
  
  const renderContentFields = (lang: 'en' | 'es') => {
    const content = lang === 'en' ? vuln : vuln;
    const overviewField = lang === 'en' ? 'overview_en' : 'overview_es';
    const techDescField = lang === 'en' ? 'technicalDescription_en' : 'technicalDescription_es';
    const affectedCompField = lang === 'en' ? 'affectedComponents_en' : 'affectedComponents_es';
    const impactField = lang === 'en' ? 'impact_en' : 'impact_es';
    const recField = lang === 'en' ? 'recommendations_en' : 'recommendations_es';
    const detailsField = lang === 'en' ? 'details_en' : 'details_es';
    const remediation = lang === 'en' ? vuln?.remediation_en : vuln?.remediation_es;
    const langT = t[language];

    return (
         <div className="space-y-4">
            <div className="space-y-2">
                <Label>{langT.overview}</Label>
                <Textarea value={content?.[overviewField] || ''} onChange={e => handleInputChange(overviewField, e.target.value)} className="min-h-[100px] font-code" />
            </div>
            <div className="space-y-2">
                <Label>{langT.technicalDescription}</Label>
                <Textarea value={content?.[techDescField] || ''} onChange={e => handleInputChange(techDescField, e.target.value)} className="min-h-[150px] font-code" />
            </div>
            <div className="space-y-2">
                <Label>{langT.affectedComponents}</Label>
                <Textarea value={content?.[affectedCompField] || ''} onChange={e => handleInputChange(affectedCompField, e.target.value)} className="min-h-[80px] font-code" />
            </div>
            <div className="space-y-2">
                <Label>{langT.impact}</Label>
                <Textarea value={content?.[impactField] || ''} onChange={e => handleInputChange(impactField, e.target.value)} className="min-h-[100px] font-code" />
            </div>
            <div className="space-y-2">
                <Label>{langT.recommendations}</Label>
                <Textarea value={content?.[recField] || ''} onChange={e => handleInputChange(recField, e.target.value)} className="min-h-[100px] font-code" />
            </div>
             <div className="space-y-2">
                <Label>{langT.details}</Label>
                <Textarea value={content?.[detailsField] || ''} onChange={e => handleInputChange(detailsField, e.target.value)} className="min-h-[150px] font-code" />
            </div>
            <Card>
                <CardHeader><CardTitle>{langT.remediationTitle}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label>{langT.shortTerm}</Label>
                        <Textarea value={remediation?.shortTerm || ''} onChange={e => handleRemediationChange(lang, 'shortTerm', e.target.value)} className="min-h-[80px] font-code" />
                    </div>
                     <div className="space-y-2">
                        <Label>{langT.mediumTerm}</Label>
                        <Textarea value={remediation?.mediumTerm || ''} onChange={e => handleRemediationChange(lang, 'mediumTerm', e.target.value)} className="min-h-[80px] font-code" />
                    </div>
                     <div className="space-y-2">
                        <Label>{langT.longTerm}</Label>
                        <Textarea value={remediation?.longTerm || ''} onChange={e => handleRemediationChange(lang, 'longTerm', e.target.value)} className="min-h-[80px] font-code" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
  }


  if (!vuln) {
    return null; // Or a loading spinner
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
                <Link href="/dashboard/vulnerabilities">
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">{t[language].back}</span>
                </Link>
            </Button>
            <div className="flex items-center gap-2">
                <h1 className="font-headline text-xl font-bold">{vuln.title_en}</h1>
                {vuln.severity && <Badge variant={getSeverityVariant(vuln.severity)}>{vuln.severity}</Badge>}
            </div>
        </div>
        <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" /> {t[language].save}</Button>
      </header>
      
      <div className="space-y-6">
          <Card>
              <CardHeader>
                  <CardTitle>{t[language].detailsTitle}</CardTitle>
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
                      <Label htmlFor="references">{t[language].referencesLabel}</Label>
                      <Input id="references" value={vuln.references.join(', ')} onChange={e => handleInputChange('references', e.target.value.split(',').map(r => r.trim()))} />
                  </div>
              </CardContent>
          </Card>
          
          <Card>
              <CardHeader>
                  <CardTitle>{t[language].cvssTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="cvss_score">{t[language].score}</Label>
                        <Input id="cvss_score" type="number" step="0.1" value={vuln.cvss.score} onChange={e => handleCvssChange('score', parseFloat(e.target.value))} />
                    </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvss_vector">{t[language].vectorString}</Label>
                        <Input id="cvss_vector" value={vuln.cvss.vectorString} onChange={e => handleCvssChange('vectorString', e.target.value)} />
                    </div>
                  </div>
                   <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
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
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
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
                  </div>
              </CardContent>
          </Card>

          <Accordion type="multiple" className="w-full" defaultValue={['en-content']}>
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
      </div>
    </div>
  );
}
