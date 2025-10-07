'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Search, ArrowUpDown } from "lucide-react";
import { clients as allClients } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/context/language-context";
import type { Client } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type SortKey = keyof Client;

export default function ClientsPage() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>(allClients);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>(null);
  
  // State for creating a client
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientContact, setNewClientContact] = useState('');

  // State for editing a client
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editClientName, setEditClientName] = useState('');
  const [editClientContact, setEditClientContact] = useState('');
  const [editClientLogo, setEditClientLogo] = useState('');
  const [editClientLanguage, setEditClientLanguage] = useState<'en' | 'es'>('en');

  useEffect(() => {
    if (editingClient) {
      setEditClientName(editingClient.name);
      setEditClientContact(editingClient.contact);
      setEditClientLogo(editingClient.logoUrl);
      setEditClientLanguage(editingClient.language);
    }
  }, [editingClient]);

  const handleEditClick = (client: Client) => {
    setEditingClient(client);
    setIsEditDialogOpen(true);
  };

  const handleUpdateClient = () => {
    if (!editingClient || !editClientName || !editClientContact) {
      toast({
        variant: 'destructive',
        title: language === 'es' ? 'Campos incompletos' : 'Incomplete fields',
        description: language === 'es' ? 'Por favor, rellena todos los campos.' : 'Please fill in all fields.',
      });
      return;
    }

    setClients(clients.map(c => 
      c.id === editingClient.id 
        ? { ...c, name: editClientName, contact: editClientContact, logoUrl: editClientLogo, language: editClientLanguage } 
        : c
    ));

    toast({
      title: language === 'es' ? 'Cliente Actualizado' : 'Client Updated',
      description: `${editClientName} ${language === 'es' ? 'ha sido actualizado.' : 'has been updated.'}`,
    });

    setEditingClient(null);
    setIsEditDialogOpen(false);
  };


  const handleCreateClient = () => {
    if (!newClientName || !newClientContact) {
      toast({
        variant: 'destructive',
        title: language === 'es' ? 'Campos incompletos' : 'Incomplete fields',
        description: language === 'es' ? 'Por favor, rellena todos los campos.' : 'Please fill in all fields.',
      });
      return;
    }

    const newClient: Client = {
      id: `cli-${Date.now()}`,
      name: newClientName,
      contact: newClientContact,
      logoUrl: `client-logo-${(clients.length % 4) + 1}`,
      language: 'en', 
    };

    setClients(prevClients => [...prevClients, newClient]);
    toast({
        title: language === 'es' ? 'Cliente Creado' : 'Client Created',
        description: `${newClient.name} ${language === 'es' ? 'ha sido añadido.' : 'has been added.'}`,
    });

    // Reset form and close dialog
    setNewClientName('');
    setNewClientContact('');
    setIsCreateDialogOpen(false);
  };


  const getLogo = (logoUrl: string) => {
    const image = PlaceHolderImages.find(img => img.id === logoUrl);
    return image ? image.imageUrl : `https://picsum.photos/seed/${logoUrl}/40/40`;
  }

  const sortedAndFilteredClients = useMemo(() => {
    let filteredClients = clients.filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contact.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig !== null) {
      filteredClients.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return filteredClients;
  }, [clients, searchTerm, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIcon = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
  }

  const t = {
    en: {
      title: "Clients",
      searchPlaceholder: "Search clients...",
      newClient: "New Client",
      newClientTitle: "Create New Client",
      newClientDescription: "Add a new client to manage their projects and findings.",
      editClientTitle: "Edit Client",
      editClientDescription: "Update the client's information.",
      nameLabel: "Name",
      namePlaceholder: "Client Company Name",
      contactLabel: "Contact",
      contactPlaceholder: "contact@email.com",
      createClient: "Create Client",
      updateClient: "Update Client",
      logoHeader: "Logo",
      nameHeader: "Name",
      contactHeader: "Contact",
      languageHeader: "Language",
      actionsHeader: "Actions",
      edit: "Edit",
      logoLabel: "Logo",
      selectLogo: "Select a logo",
      languageLabel: "Language",
      selectLanguage: "Select Language",
      english: "English",
      spanish: "Spanish"
    },
    es: {
      title: "Clientes",
      searchPlaceholder: "Buscar clientes...",
      newClient: "Nuevo Cliente",
      newClientTitle: "Crear Nuevo Cliente",
      newClientDescription: "Añade un nuevo cliente para gestionar sus proyectos y hallazgos.",
      editClientTitle: "Editar Cliente",
      editClientDescription: "Actualiza la información del cliente.",
      nameLabel: "Nombre",
      namePlaceholder: "Nombre de la Empresa Cliente",
      contactLabel: "Contacto",
      contactPlaceholder: "contacto@email.com",
      createClient: "Crear Cliente",
      updateClient: "Actualizar Cliente",
      logoHeader: "Logo",
      nameHeader: "Nombre",
      contactHeader: "Contacto",
      languageHeader: "Idioma",
      actionsHeader: "Acciones",
      edit: "Editar",
      logoLabel: "Logo",
      selectLogo: "Selecciona un logo",
      languageLabel: "Idioma",
      selectLanguage: "Selecciona un Idioma",
      english: "Inglés",
      spanish: "Español"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="font-headline text-3xl font-bold tracking-tight">{t[language].title}</h1>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder={t[language].searchPlaceholder} 
              className="pl-8" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> {t[language].newClient}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t[language].newClientTitle}</DialogTitle>
                <DialogDescription>
                  {t[language].newClientDescription}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">{t[language].nameLabel}</Label>
                  <Input id="name" placeholder={t[language].namePlaceholder} className="col-span-3" value={newClientName} onChange={(e) => setNewClientName(e.target.value)} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="contact" className="text-right">{t[language].contactLabel}</Label>
                  <Input id="contact" placeholder={t[language].contactPlaceholder} className="col-span-3" value={newClientContact} onChange={(e) => setNewClientContact(e.target.value)} />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateClient}>{t[language].createClient}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">{t[language].logoHeader}</TableHead>
                <TableHead onClick={() => requestSort('name')} className="cursor-pointer hover:bg-muted/50">
                  <div className="flex items-center">{t[language].nameHeader} {getSortIcon('name')}</div>
                </TableHead>
                <TableHead onClick={() => requestSort('contact')} className="cursor-pointer hover:bg-muted/50">
                   <div className="flex items-center">{t[language].contactHeader} {getSortIcon('contact')}</div>
                </TableHead>
                <TableHead onClick={() => requestSort('language')} className="cursor-pointer hover:bg-muted/50">
                  <div className="flex items-center">{t[language].languageHeader} {getSortIcon('language')}</div>
                </TableHead>
                <TableHead className="text-right">{t[language].actionsHeader}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAndFilteredClients.map(client => (
                <TableRow key={client.id}>
                  <TableCell>
                    <Avatar className="h-10 w-10">
                      <AvatarImage asChild src={getLogo(client.logoUrl)}>
                         <Image src={getLogo(client.logoUrl)} alt={client.name} width={40} height={40} data-ai-hint="abstract logo" />
                      </AvatarImage>
                      <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell className="text-muted-foreground">{client.contact}</TableCell>
                  <TableCell className="text-muted-foreground uppercase">{client.language}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleEditClick(client)}>{t[language].edit}</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Client Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t[language].editClientTitle}</DialogTitle>
            <DialogDescription>
              {t[language].editClientDescription}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">{t[language].nameLabel}</Label>
              <Input id="edit-name" placeholder={t[language].namePlaceholder} className="col-span-3" value={editClientName} onChange={(e) => setEditClientName(e.target.value)} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-contact" className="text-right">{t[language].contactLabel}</Label>
              <Input id="edit-contact" placeholder={t[language].contactPlaceholder} className="col-span-3" value={editClientContact} onChange={(e) => setEditClientContact(e.target.value)} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-language" className="text-right">{t[language].languageLabel}</Label>
              <Select value={editClientLanguage} onValueChange={(value) => setEditClientLanguage(value as 'en' | 'es')}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t[language].selectLanguage} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">{t[language].english}</SelectItem>
                  <SelectItem value="es">{t[language].spanish}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-logo" className="text-right">{t[language].logoLabel}</Label>
              <Select value={editClientLogo} onValueChange={setEditClientLogo}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t[language].selectLogo} />
                </SelectTrigger>
                <SelectContent>
                  {PlaceHolderImages.map(img => (
                    <SelectItem key={img.id} value={img.id}>
                      <div className='flex items-center gap-2'>
                        <Image src={img.imageUrl} alt={img.description} width={24} height={24} className='rounded-sm' />
                        <span>{img.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdateClient}>{t[language].updateClient}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
