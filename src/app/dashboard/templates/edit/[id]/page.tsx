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
import { ChevronLeft, Save, FileText, Scan, Globe, Network, Smartphone, Wifi, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/language-context';
import type { ProjectTemplate } from '@/lib/types';
import { useData } from '@/context/data-context';

const iconOptions = [
    { value: 'FileText', label: 'FileText' },
    { value: 'Scan', label: 'Scan' },
    { value: 'Globe', label: 'Globe' },
    { value: 'Network', label: 'Network' },
    { value: 'Smartphone', label: 'Smartphone' },
    { value: 'Wifi', label: 'Wifi' },
    { value: 'Award', label: 'Award' },
];

export default function TemplateEditorPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { toast } = useToast();
  const { language } = useLanguage();
  const { projectTemplates, addProjectTemplate, updateProjectTemplate } = useData();

  const [isNew, setIsNew] = useState(id === 'new');
  const [template, setTemplate] = useState<Omit<ProjectTemplate, 'id'> | ProjectTemplate | null>(null);

  useEffect(() => {
    if (isNew) {
      setTemplate({
        name_en: '',
        name_es: '',
        description_en: '',
        description_es: '',
        scope_en: '',
        scope_es: '',
        appendix_en: '',
        appendix_es: '',
        icon: 'FileText',
      });
    } else {
      const existingTemplate = projectTemplates.find(t => t.id === id);
      if (existingTemplate) {
        setTemplate(JSON.parse(JSON.stringify(existingTemplate)));
      } else {
        toast({ variant: 'destructive', title: 'Template not found' });
        router.push('/dashboard/templates');
      }
    }
  }, [id, isNew, projectTemplates, router, toast]);
  
  const handleInputChange = (field: keyof Omit<ProjectTemplate, 'id'>, value: string) => {
    if (template) {
        setTemplate(prev => prev ? { ...prev, [field]: value } : null);
    }
  };

  const handleSave = () => {
    if (!template) return;
    
    if (!template.name_en || !template.name_es) {
        toast({ variant: 'destructive', title: 'Missing required fields', description: 'Please provide a name for the template in both English and Spanish.' });
        return;
    }

    if (isNew) {
      addProjectTemplate(template as Omit<ProjectTemplate, 'id'>);
      toast({ title: 'Template Created', description: `The "${template.name_en}" template has been created.` });
    } else {
      updateProjectTemplate(template as ProjectTemplate);
      toast({ title: 'Template Updated', description: `The "${template.name_en}" template has been updated.` });
    }
    router.push('/dashboard/templates');
  };
  
  const t = {
    en: {
        back: 'Back to Templates',
        save: 'Save Template',
        create: 'Create Template',
        newTitle: 'New Project Template',
        editTitle: 'Edit Project Template',
        newDescription: 'Create a new reusable project template.',
        editDescription: 'Modify an existing project template.',
        nameEn: 'Name (English)',
        nameEs: 'Name (Spanish)',
        descEn: 'Description (English)',
        descEs: 'Description (Spanish)',
        scopeEn: 'Scope Content (English)',
        scopeEs: 'Scope Content (Spanish)',
        appendixEn: 'Appendix Content (English)',
        appendixEs: 'Appendix Content (Spanish)',
        icon: 'Icon',
        selectIcon: 'Select an icon',
    },
    es: {
        back: 'Volver a Plantillas',
        save: 'Guardar Plantilla',
        create: 'Crear Plantilla',
        newTitle: 'Nueva Plantilla de Proyecto',
        editTitle: 'Editar Plantilla de Proyecto',
        newDescription: 'Crea una nueva plantilla de proyecto reutilizable.',
        editDescription: 'Modifica una plantilla de proyecto existente.',
        nameEn: 'Nombre (Inglés)',
        nameEs: 'Nombre (Español)',
        descEn: 'Descripción (Inglés)',
        descEs: 'Descripción (Español)',
        scopeEn: 'Contenido del Alcance (Inglés)',
        scopeEs: 'Contenido del Alcance (Español)',
        appendixEn: 'Contenido del Apéndice (Inglés)',
        appendixEs: 'Contenido del Apéndice (Español)',
        icon: 'Icono',
        selectIcon: 'Selecciona un icono',
    },
  };

  if (!template) {
    return null; // or loading state
  }

  return (
    <div className="space-y-6">
       <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/templates">
              <ChevronLeft className="mr-2 h-4 w-4" />
              {t[language].back}
            </Link>
          </Button>
          <div>
            <h1 className="font-headline text-xl font-bold">{isNew ? t[language].newTitle : t[language].editTitle}</h1>
            <p className="text-sm text-muted-foreground">{isNew ? t[language].newDescription : t[language].editDescription}</p>
          </div>
        </div>
        <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" /> {isNew ? t[language].create : t[language].save}</Button>
      </header>

       <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="name_en">{t[language].nameEn}</Label>
                <Input id="name_en" value={template.name_en} onChange={e => handleInputChange('name_en', e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="name_es">{t[language].nameEs}</Label>
                <Input id="name_es" value={template.name_es} onChange={e => handleInputChange('name_es', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="description_en">{t[language].descEn}</Label>
                <Textarea id="description_en" value={template.description_en} onChange={e => handleInputChange('description_en', e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="description_es">{t[language].descEs}</Label>
                <Textarea id="description_es" value={template.description_es} onChange={e => handleInputChange('description_es', e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">{t[language].icon}</Label>
            <Select value={template.icon} onValueChange={value => handleInputChange('icon', value)}>
                <SelectTrigger id="icon">
                    <SelectValue placeholder={t[language].selectIcon} />
                </SelectTrigger>
                <SelectContent>
                    {iconOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="scope_en">{t[language].scopeEn}</Label>
                <Textarea id="scope_en" value={template.scope_en} onChange={e => handleInputChange('scope_en', e.target.value)} className="min-h-[200px] font-code" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="scope_es">{t[language].scopeEs}</Label>
                <Textarea id="scope_es" value={template.scope_es} onChange={e => handleInputChange('scope_es', e.target.value)} className="min-h-[200px] font-code" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="appendix_en">{t[language].appendixEn}</Label>
                <Textarea id="appendix_en" value={template.appendix_en || ''} onChange={e => handleInputChange('appendix_en', e.target.value)} className="min-h-[200px] font-code" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="appendix_es">{t[language].appendixEs}</Label>
                <Textarea id="appendix_es" value={template.appendix_es || ''} onChange={e => handleInputChange('appendix_es', e.target.value)} className="min-h-[200px] font-code" />
            </div>
          </div>
        </CardContent>
       </Card>
    </div>
  );
}
