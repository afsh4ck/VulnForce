'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/context/language-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { clients } from "@/lib/data";
import { projectTemplates } from "@/lib/templates";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, FilePlus2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";


export default function NewProjectPage() {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const [name, setName] = useState('');
  const [scope, setScope] = useState('');
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();

  useEffect(() => {
    const templateId = searchParams.get('template');
    if (templateId) {
      const template = projectTemplates.find(t => t.id === templateId);
      if (template) {
        setName(language === 'es' ? template.name_es : template.name_en);
        setScope(template.scope);
      }
    }
  }, [searchParams, language]);

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
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tight">{t[language].title}</h1>
        <p className="text-muted-foreground">{t[language].description}</p>
      </div>
      <Card>
        <CardContent className="pt-6 space-y-4">
             <div className="space-y-2">
                <Label>{t[language].importTemplate}</Label>
                <Select onValueChange={(templateId) => {
                    const template = projectTemplates.find(t => t.id === templateId);
                    if (template) {
                        setName(language === 'es' ? template.name_es : template.name_en);
                        setScope(template.scope);
                    }
                }}>
                    <SelectTrigger>
                        <SelectValue placeholder={t[language].selectTemplate} />
                    </SelectTrigger>
                    <SelectContent>
                        {projectTemplates.map(template => (
                            <SelectItem key={template.id} value={template.id}>
                                {language === 'es' ? template.name_es : template.name_en}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="name">{t[language].projectNameLabel}</Label>
                <Input id="name" placeholder={t[language].projectNamePlaceholder} value={name} onChange={e => setName(e.target.value)} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="client">{t[language].clientLabel}</Label>
                <Select>
                    <SelectTrigger id="client">
                        <SelectValue placeholder={t[language].selectClient} />
                    </SelectTrigger>
                    <SelectContent>
                        {clients.map(client => (
                            <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="scope">{t[language].scopeLabel}</Label>
                <Textarea id="scope" placeholder={t[language].scopePlaceholder} className="font-code" value={scope} onChange={e => setScope(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>{t[language].startDateLabel}</Label>
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
                            {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                </div>
                 <div className="space-y-2">
                    <Label>{t[language].endDateLabel}</Label>
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
                            {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
             <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" asChild><Link href="/dashboard/projects">{t[language].cancel}</Link></Button>
                <Button><FilePlus2 className="mr-2 h-4 w-4" />{t[language].createProject}</Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
