'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/context/language-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { projectTemplates } from "@/lib/templates";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, FilePlus2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/context/data-context";
import type { Project } from "@/lib/types";


export default function NewProjectPage() {
  const { language: uiLanguage } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const { clients, addProject } = useData();

  const [name, setName] = useState('');
  const [clientId, setClientId] = useState<string>('');
  const [scope, setScope] = useState('');
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();
  const [templateId, setTemplateId] = useState<string | null>(searchParams.get('template'));
  const [projectLanguage, setProjectLanguage] = useState<Project['language']>('es');

  useEffect(() => {
    if (templateId) {
      const template = projectTemplates.find(t => t.id === templateId);
      if (template) {
        setName(projectLanguage === 'es' ? template.name_es : template.name_en);
        setScope(template.scope);
      }
    }
  }, [templateId, projectLanguage]);

  const handleTemplateChange = (newTemplateId: string) => {
    const template = projectTemplates.find(t => t.id === newTemplateId);
    if (template) {
        setTemplateId(newTemplateId);
        setName(projectLanguage === 'es' ? template.name_es : template.name_en);
        setScope(template.scope);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !clientId || !scope || !startDate || !endDate) {
      toast({
        variant: 'destructive',
        title: uiLanguage === 'es' ? 'Campos Incompletos' : 'Incomplete Fields',
        description: uiLanguage === 'es' ? 'Por favor, rellena todos los campos.' : 'Please fill in all fields.',
      });
      return;
    }

    const newProject: Omit<Project, 'id'> = {
      clientId,
      name,
      scope,
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      status: 'In Progress' as const,
      language: projectLanguage,
    };

    addProject(newProject);
    
    toast({
      title: uiLanguage === 'es' ? 'Proyecto Creado' : 'Project Created',
      description: `${name} ${uiLanguage === 'es' ? 'ha sido creado.' : 'has been created.'}`
    });

    router.push('/dashboard/projects');
  };

  const t = {
    en: {
        title: "Create New Project",
        description: "Start a new security assessment for a client.",
        projectNameLabel: "Project Name",
        projectNamePlaceholder: "e.g., Q4 Web App Pentest",
        clientLabel: "Client",
        selectClient: "Select a client",
        scopeLabel: "Scope",
        scopePlaceholder: "e.g., *.example.com, 192.168.1.0/24",
        startDateLabel: "Start Date",
        endDateLabel: "End Date",
        createProject: "Create Project",
        cancel: "Cancel",
        importTemplate: "Import from Template",
        selectTemplate: "Select a template",
        languageLabel: "Project Language",
        selectLanguage: "Select Language",
        english: "English",
        spanish: "Spanish",
    },
    es: {
        title: "Crear Nuevo Proyecto",
        description: "Inicia una nueva evaluación de seguridad para un cliente.",
        projectNameLabel: "Nombre del Proyecto",
        projectNamePlaceholder: "p.ej., Pentest App Web Q4",
        clientLabel: "Cliente",
        selectClient: "Selecciona un cliente",
        scopeLabel: "Alcance",
        scopePlaceholder: "p.ej., *.ejemplo.com, 192.168.1.0/24",
        startDateLabel: "Fecha de Inicio",
        endDateLabel: "Fecha de Fin",
        createProject: "Crear Proyecto",
        cancel: "Cancelar",
        importTemplate: "Importar desde Plantilla",
        selectTemplate: "Selecciona una plantilla",
        languageLabel: "Idioma del Proyecto",
        selectLanguage: "Seleccionar Idioma",
        english: "Inglés",
        spanish: "Español",
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tight">{t[uiLanguage].title}</h1>
        <p className="text-muted-foreground">{t[uiLanguage].description}</p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>{t[uiLanguage].importTemplate}</Label>
                    <Select onValueChange={handleTemplateChange} value={templateId || ''}>
                        <SelectTrigger>
                            <SelectValue placeholder={t[uiLanguage].selectTemplate} />
                        </SelectTrigger>
                        <SelectContent>
                            {projectTemplates.map(template => (
                                <SelectItem key={template.id} value={template.id}>
                                    {projectLanguage === 'es' ? template.name_es : template.name_en}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="language">{t[uiLanguage].languageLabel}</Label>
                    <Select onValueChange={(value) => setProjectLanguage(value as 'en' | 'es')} value={projectLanguage}>
                        <SelectTrigger id="language">
                            <SelectValue placeholder={t[uiLanguage].selectLanguage} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="en">{t[uiLanguage].english}</SelectItem>
                            <SelectItem value="es">{t[uiLanguage].spanish}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="name">{t[uiLanguage].projectNameLabel}</Label>
                <Input id="name" placeholder={t[uiLanguage].projectNamePlaceholder} value={name} onChange={e => setName(e.target.value)} required />
            </div>
             <div className="space-y-2">
                <Label htmlFor="client">{t[uiLanguage].clientLabel}</Label>
                <Select onValueChange={setClientId} value={clientId} required>
                    <SelectTrigger id="client">
                        <SelectValue placeholder={t[uiLanguage].selectClient} />
                    </SelectTrigger>
                    <SelectContent>
                        {clients.map(client => (
                            <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="scope">{t[uiLanguage].scopeLabel}</Label>
                <Textarea id="scope" placeholder={t[uiLanguage].scopePlaceholder} className="font-code min-h-[120px]" value={scope} onChange={e => setScope(e.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>{t[uiLanguage].startDateLabel}</Label>
                     <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                            "w-full justify-start text-left font-normal",
                            !startDate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP", { locale: uiLanguage === 'es' ? es : undefined }) : <span>Pick a date</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            initialFocus
                            locale={uiLanguage === 'es' ? es : undefined}
                        />
                        </PopoverContent>
                    </Popover>
                </div>
                 <div className="space-y-2">
                    <Label>{t[uiLanguage].endDateLabel}</Label>
                     <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                            "w-full justify-start text-left font-normal",
                            !endDate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP", { locale: uiLanguage === 'es' ? es : undefined }) : <span>Pick a date</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            initialFocus
                            locale={uiLanguage === 'es' ? es : undefined}
                        />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
             <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" asChild><Link href="/dashboard/projects">{t[uiLanguage].cancel}</Link></Button>
                <Button type="submit"><FilePlus2 className="mr-2 h-4 w-4" />{t[uiLanguage].createProject}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
