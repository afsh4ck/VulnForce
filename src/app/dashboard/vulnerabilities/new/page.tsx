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
import type { Vulnerability } from '@/lib/types';
import { useRouter } from 'next/navigation';

const emptyVulnerability: Omit<Vulnerability, 'id'> = {
  title_en: '',
  title_es: '',
  cvss: 0,
  severity: 'Informational',
  description_en: '',
  description_es: '',
  mitigation_en: '',
  mitigation_es: '',
  tags: [],
  reference: '',
};

export default function NewVulnerabilityPage() {
  const { toast } = useToast();
  const { language } = useLanguage();
  const router = useRouter();
  const [vuln, setVuln] = useState<Omit<Vulnerability, 'id'>>(emptyVulnerability);

  const handleInputChange = (field: keyof Omit<Vulnerability, 'id'>, value: string | number | string[]) => {
    setVuln({ ...vuln, [field]: value });
  };
  
  const handleSeverityChange = (value: string) => {
    setVuln({ ...vuln, severity: value as Vulnerability['severity'] });
  }

  const handleSave = () => {
    // Here you would typically save the data to a backend.
    const newId = `vuln-${Date.now()}`;
    const newVulnerability: Vulnerability = { id: newId, ...vuln };
    console.log("Saving new vulnerability:", newVulnerability);
    toast({
      title: t[language].saveSuccessTitle,
      description: t[language].saveSuccessDescription,
    });
    // In a real app, you'd add the new vuln to your state and redirect.
    // For now, we just redirect.
    router.push('/dashboard/vulnerabilities');
  };

  const t = {
    en: {
      back: 'Back to Vulnerabilities',
      save: 'Create Vulnerability',
      title: 'New Vulnerability Template',
      description: 'Create a new reusable vulnerability template for the database.',
      titleEnLabel: 'Title (English)',
      titleEsLabel: 'Title (Spanish)',
      cvssLabel: 'CVSS Score',
      severityLabel: 'Severity',
      selectSeverity: 'Select severity',
      critical: 'Critical',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      informational: 'Informational',
      referenceLabel: 'Reference (e.g., CWE-ID)',
      tagsLabel: 'Tags (comma-separated)',
      descriptionEnLabel: 'Description (English)',
      descriptionEsLabel: 'Description (Spanish)',
      mitigationEnLabel: 'Mitigation (English)',
      mitigationEsLabel: 'Mitigation (Spanish)',
      saveSuccessTitle: 'Vulnerability Created',
      saveSuccessDescription: 'The new template has been added to the database.',
    },
    es: {
      back: 'Volver a Vulnerabilidades',
      save: 'Crear Vulnerabilidad',
      title: 'Nueva Plantilla de Vulnerabilidad',
      description: 'Crea una nueva plantilla de vulnerabilidad reutilizable para la base de datos.',
      titleEnLabel: 'Título (Inglés)',
      titleEsLabel: 'Título (Español)',
      cvssLabel: 'Puntuación CVSS',
      severityLabel: 'Severidad',
      selectSeverity: 'Seleccionar severidad',
      critical: 'Crítica',
      high: 'Alta',
      medium: 'Media',
      low: 'Baja',
      informational: 'Informativa',
      referenceLabel: 'Referencia (ej., CWE-ID)',
      tagsLabel: 'Etiquetas (separadas por coma)',
      descriptionEnLabel: 'Descripción (Inglés)',
      descriptionEsLabel: 'Descripción (Español)',
      mitigationEnLabel: 'Mitigación (Inglés)',
      mitigationEsLabel: 'Mitigación (Español)',
      saveSuccessTitle: 'Vulnerabilidad Creada',
      saveSuccessDescription: 'La nueva plantilla ha sido añadida a la base de datos.',
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
      
      <Card>
        <CardHeader>
          <CardTitle>{t[language].title}</CardTitle>
          <CardDescription>{t[language].description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title_en">{t[language].titleEnLabel}</Label>
              <Input id="title_en" value={vuln.title_en} onChange={e => handleInputChange('title_en', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title_es">{t[language].titleEsLabel}</Label>
              <Input id="title_es" value={vuln.title_es} onChange={e => handleInputChange('title_es', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
             <div className="space-y-2">
                <Label htmlFor="cvss">{t[language].cvssLabel}</Label>
                <Input id="cvss" type="number" step="0.1" value={vuln.cvss} onChange={e => handleInputChange('cvss', parseFloat(e.target.value) || 0)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="severity">{t[language].severityLabel}</Label>
                <Select value={vuln.severity} onValueChange={handleSeverityChange}>
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
                <Label htmlFor="reference">{t[language].referenceLabel}</Label>
                <Input id="reference" value={vuln.reference} onChange={e => handleInputChange('reference', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">{t[language].tagsLabel}</Label>
                <Input id="tags" value={vuln.tags.join(', ')} onChange={e => handleInputChange('tags', e.target.value.split(',').map(t => t.trim()))} />
              </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
                <Label htmlFor="description_en">{t[language].descriptionEnLabel}</Label>
                <Textarea id="description_en" value={vuln.description_en} onChange={e => handleInputChange('description_en', e.target.value)} className="min-h-[150px] font-code" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="description_es">{t[language].descriptionEsLabel}</Label>
                <Textarea id="description_es" value={vuln.description_es} onChange={e => handleInputChange('description_es', e.target.value)} className="min-h-[150px] font-code" />
            </div>
          </div>
          
           <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
                <Label htmlFor="mitigation_en">{t[language].mitigationEnLabel}</Label>
                <Textarea id="mitigation_en" value={vuln.mitigation_en} onChange={e => handleInputChange('mitigation_en', e.target.value)} className="min-h-[150px] font-code" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="mitigation_es">{t[language].mitigationEsLabel}</Label>
                <Textarea id="mitigation_es" value={vuln.mitigation_es} onChange={e => handleInputChange('mitigation_es', e.target.value)} className="min-h-[150px] font-code" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
