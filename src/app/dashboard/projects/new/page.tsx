

'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/context/language-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, FilePlus2, PlusCircle, Upload } from "@/components/icons";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/context/data-context";
import type { Project, Client } from "@/lib/types";
import { DateRange } from "react-day-picker";
import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProjectIconSelectItem, projectIconOptions } from "@/components/project-icon";

export default function NewProjectPage() {
  const { language: uiLanguage } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const { clients, addProject, projectTemplates, addClient } = useData();

  const [name, setName] = useState('');
  const [clientId, setClientId] = useState<string>('');
  const [scope, setScope] = useState('');
  const [date, setDate] = React.useState<DateRange | undefined>();
  const [templateId, setTemplateId] = useState<string | null>(searchParams.get('template'));
  const [projectLanguage, setProjectLanguage] = useState<Project['language']>('es');
  const [icon, setIcon] = useState('FileText');
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // States for the new client dialog
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientContact, setNewClientContact] = useState('');
  const [newClientLogo, setNewClientLogo] = useState<string | null>(null);
  const createFileInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    if (templateId) {
      const template = projectTemplates.find(t => t.id === templateId);
      if (template) {
        setName(projectLanguage === 'es' ? template.name_es : template.name_en);
        setScope(projectLanguage === 'es' ? template.scope_es : template.scope_en);
        setIcon(template.icon);
      }
    }
  }, [templateId, projectLanguage, projectTemplates]);

  const handleTemplateChange = (newTemplateId: string) => {
    const template = projectTemplates.find(t => t.id === newTemplateId);
    if (template) {
        setTemplateId(newTemplateId);
        setName(projectLanguage === 'es' ? template.name_es : template.name_en);
        setScope(projectLanguage === 'es' ? template.scope_es : template.scope_en);
        setIcon(template.icon);
    }
  }

  const validateFields = () => {
    const newErrors: Record<string, boolean> = {};
    if (!name) newErrors.name = true;
    if (!clientId) newErrors.clientId = true;
    if (!scope) newErrors.scope = true;
    if (!date?.from || !date?.to) newErrors.date = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFields()) {
      toast({
        variant: 'destructive',
        title: uiLanguage === 'es' ? 'Campos Incompletos' : 'Incomplete Fields',
        description: uiLanguage === 'es' ? 'Por favor, rellena todos los campos.' : 'Please fill in all fields.',
      });
      return;
    }

    const newProjectData = {
      clientId,
      name,
      scope,
      icon,
      startDate: date!.from!,
      endDate: date!.to!,
      status: 'In Progress' as const,
      language: projectLanguage,
    };

    const newProject = addProject(newProjectData);
    
    toast({
      title: uiLanguage === 'es' ? 'Proyecto Creado' : 'Project Created',
      description: `${name} ${uiLanguage === 'es' ? 'ha sido creado.' : 'has been created.'}`
    });

    router.push(`/dashboard/projects/${newProject.id}`);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>, setLogo: (logo: string | null) => void) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setLogo(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid file type',
          description: 'Please select an image file.',
        });
      }
    }
  };

  const handleCreateClient = () => {
    if (!newClientName || !newClientContact) {
      toast({
        variant: 'destructive',
        title: uiLanguage === 'es' ? 'Campos incompletos' : 'Incomplete fields',
        description: uiLanguage === 'es' ? 'Por favor, rellena todos los campos.' : 'Please fill in all fields.',
      });
      return;
    }

    const newClient: Omit<Client, 'id'> = {
      name: newClientName,
      contact: newClientContact,
      logoUrl: newClientLogo || '',
    };

    addClient(newClient);
    toast({
        title: uiLanguage === 'es' ? 'Cliente Creado' : 'Client Created',
        description: `${newClient.name} ${uiLanguage === 'es' ? 'ha sido añadido.' : 'has been added.'}`,
    });

    // Reset form and close dialog
    setNewClientName('');
    setNewClientContact('');
    setNewClientLogo(null);
    setIsClientDialogOpen(false);
  };


  const t = {
    en: {
        title: "Create New Project",
        description: "Start a new security assessment for a client.",
        projectNameLabel: "Project Name",
        projectNamePlaceholder: "e.g., Q4 Web App Pentest",
        clientLabel: "Client",
        selectClient: "Select a client",
        createNewClient: "Create New Client",
        scopeLabel: "Report Content",
        scopePlaceholder: "e.g., ## Executive Summary...",
        datesLabel: "Project Dates",
        createProject: "Create Project",
        cancel: "Cancel",
        importTemplate: "Import from Template",
        selectTemplate: "Select a template",
        languageLabel: "Project Language",
        selectLanguage: "Select Language",
        english: "English",
        spanish: "Spanish",
        iconLabel: "Icon",
        selectIcon: "Select an icon",
        newClientTitle: "Create New Client",
        newClientDescription: "Add a new client to manage their projects and findings.",
        nameLabel: "Name",
        namePlaceholder: "Client Company Name",
        contactLabel: "Contact",
        contactPlaceholder: "contact@email.com",
        createClient: "Create Client",
        logoLabel: "Logo",
        uploadLogo: "Upload Logo",
    },
    es: {
        title: "Crear Nuevo Proyecto",
        description: "Inicia una nueva evaluación de seguridad para un cliente.",
        projectNameLabel: "Nombre del Proyecto",
        projectNamePlaceholder: "p.ej., Pentest App Web Q4",
        clientLabel: "Cliente",
        selectClient: "Selecciona un cliente",
        createNewClient: "Crear Nuevo Cliente",
        scopeLabel: "Contenido del Informe",
        scopePlaceholder: "p.ej., ## Resumen Ejecutivo...",
        datesLabel: "Fechas del Proyecto",
        createProject: "Crear Proyecto",
        cancel: "Cancelar",
        importTemplate: "Importar desde Plantilla",
        selectTemplate: "Selecciona una plantilla",
        languageLabel: "Idioma del Proyecto",
        selectLanguage: "Seleccionar Idioma",
        english: "Inglés",
        spanish: "Español",
        iconLabel: "Icono",
        selectIcon: "Selecciona un icono",
        newClientTitle: "Crear Nuevo Cliente",
        newClientDescription: "Añade un nuevo cliente para gestionar sus proyectos y hallazgos.",
        nameLabel: "Nombre",
        namePlaceholder: "Nombre de la Empresa Cliente",
        contactLabel: "Contacto",
        contactPlaceholder: "contacto@email.com",
        createClient: "Crear Cliente",
        logoLabel: "Logo",
        uploadLogo: "Subir Logo",
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
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">{t[uiLanguage].projectNameLabel}</Label>
                    <Input id="name" placeholder={t[uiLanguage].projectNamePlaceholder} value={name} onChange={e => setName(e.target.value)} required 
                        className={cn(errors.name && 'border-destructive')}
                    />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="icon">{t[uiLanguage].iconLabel}</Label>
                    <Select onValueChange={setIcon} value={icon}>
                        <SelectTrigger id="icon">
                            <SelectValue placeholder={t[uiLanguage].selectIcon} />
                        </SelectTrigger>
                        <SelectContent>
                            {projectIconOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  <ProjectIconSelectItem value={option.value} label={option.label} />
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="client">{t[uiLanguage].clientLabel}</Label>
                <Dialog open={isClientDialogOpen} onOpenChange={setIsClientDialogOpen}>
                  <Select onValueChange={setClientId} value={clientId} required>
                      <SelectTrigger id="client" className={cn(errors.clientId && 'border-destructive')}>
                          <SelectValue placeholder={t[uiLanguage].selectClient} />
                      </SelectTrigger>
                      <SelectContent>
                          {clients.map(client => (
                              <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                          ))}
                          <DialogTrigger asChild>
                              <Button variant="ghost" className="w-full justify-start mt-1">
                                  <PlusCircle className="mr-2 h-4 w-4" />
                                  {t[uiLanguage].createNewClient}
                              </Button>
                          </DialogTrigger>
                      </SelectContent>
                  </Select>
                  <DialogContent>
                      <DialogHeader>
                          <DialogTitle>{t[uiLanguage].newClientTitle}</DialogTitle>
                          <DialogDescription>{t[uiLanguage].newClientDescription}</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="new-client-name" className="text-right">{t[uiLanguage].nameLabel}</Label>
                              <Input id="new-client-name" placeholder={t[uiLanguage].namePlaceholder} className="col-span-3" value={newClientName} onChange={(e) => setNewClientName(e.target.value)} />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="new-client-contact" className="text-right">{t[uiLanguage].contactLabel}</Label>
                              <Input id="new-client-contact" placeholder={t[uiLanguage].contactPlaceholder} className="col-span-3" value={newClientContact} onChange={(e) => setNewClientContact(e.target.value)} />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">{t[uiLanguage].logoLabel}</Label>
                              <div className="col-span-3 flex items-center gap-4">
                                  <Avatar className="h-10 w-10">
                                      {newClientLogo ? <AvatarImage src={newClientLogo} /> : <AvatarFallback>{newClientName ? newClientName.charAt(0) : '?'}</AvatarFallback>}
                                  </Avatar>
                                  <input type="file" ref={createFileInputRef} onChange={(e) => handleLogoChange(e, setNewClientLogo)} className="hidden" accept="image/*" />
                                  <Button variant="outline" type="button" onClick={() => createFileInputRef.current?.click()}>
                                      <Upload className="mr-2 h-4 w-4" />
                                      {t[uiLanguage].uploadLogo}
                                  </Button>
                              </div>
                          </div>
                      </div>
                      <DialogFooter>
                          <Button onClick={handleCreateClient} type="button">{t[uiLanguage].createClient}</Button>
                      </DialogFooter>
                  </DialogContent>
                </Dialog>
            </div>
            <div className="space-y-2">
                <Label htmlFor="scope">{t[uiLanguage].scopeLabel}</Label>
                <Textarea id="scope" placeholder={t[uiLanguage].scopePlaceholder} className={cn("font-code min-h-[120px]", errors.scope && 'border-destructive')} value={scope} onChange={e => setScope(e.target.value)} required />
            </div>
            <div className="space-y-2">
                <Label>{t[uiLanguage].datesLabel}</Label>
                 <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground",
                        errors.date && "border-destructive"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                        date.to ? (
                            <>
                            {format(date.from, "LLL dd, y", { locale: uiLanguage === 'es' ? es : undefined })} -{" "}
                            {format(date.to, "LLL dd, y", { locale: uiLanguage === 'es' ? es : undefined })}
                            </>
                        ) : (
                            format(date.from, "LLL dd, y", { locale: uiLanguage === 'es' ? es : undefined })
                        )
                        ) : (
                        <span>Pick a date</span>
                        )}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                        locale={uiLanguage === 'es' ? es : undefined}
                    />
                    </PopoverContent>
                </Popover>
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
