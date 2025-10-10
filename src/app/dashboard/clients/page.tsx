'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Search, ArrowUpDown, Upload, Edit, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useData } from '@/context/data-context';


type SortKey = keyof Client;

export default function ClientsPage() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { clients, addClient, updateClient, deleteClient } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>(null);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  
  // State for creating a client
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientContact, setNewClientContact] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientLogo, setNewClientLogo] = useState<string | null>(null);
  const createFileInputRef = useRef<HTMLInputElement>(null);


  // State for editing a client
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editClientName, setEditClientName] = useState('');
  const [editClientContact, setEditClientContact] = useState('');
  const [editClientPhone, setEditClientPhone] = useState('');
  const [editClientLogo, setEditClientLogo] = useState<string | null>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingClient) {
      setEditClientName(editingClient.name);
      setEditClientContact(editingClient.contact);
      setEditClientPhone(editingClient.phone || '');
      setEditClientLogo(editingClient.logoUrl || null);
    }
  }, [editingClient]);
  
  const handleDeleteClient = () => {
    if (!clientToDelete) return;
    deleteClient(clientToDelete.id);
    toast({ title: t[language].clientDeleted });
    setClientToDelete(null);
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

    updateClient({ 
      ...editingClient, 
      name: editClientName, 
      contact: editClientContact, 
      phone: editClientPhone,
      logoUrl: editClientLogo || '', 
    });

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

    const newClient: Omit<Client, 'id'> = {
      name: newClientName,
      contact: newClientContact,
      phone: newClientPhone,
      logoUrl: newClientLogo || '',
    };

    addClient(newClient);
    toast({
        title: language === 'es' ? 'Cliente Creado' : 'Client Created',
        description: `${newClient.name} ${language === 'es' ? 'ha sido añadido.' : 'has been added.'}`,
    });

    // Reset form and close dialog
    setNewClientName('');
    setNewClientContact('');
    setNewClientPhone('');
    setNewClientLogo(null);
    setIsCreateDialogOpen(false);
  };

  const sortedAndFilteredClients = useMemo(() => {
    let filteredClients = clients.filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.phone && client.phone.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (sortConfig !== null && sortConfig.key) {
      filteredClients.sort((a, b) => {
        const aValue = a[sortConfig.key] || '';
        const bValue = b[sortConfig.key] || '';

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
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
      phoneLabel: "Phone",
      phonePlaceholder: "+1 (555) 123-4567",
      createClient: "Create Client",
      updateClient: "Update Client",
      logoHeader: "Logo",
      nameHeader: "Name",
      contactHeader: "Contact",
      phoneHeader: "Phone",
      actionsHeader: "Actions",
      edit: "Edit",
      delete: "Delete",
      logoLabel: "Logo",
      uploadLogo: "Upload Logo",
      confirmDeleteTitle: "Are you sure?",
      confirmDeleteDesc: "This action cannot be undone. This will permanently delete the client.",
      cancel: "Cancel",
      clientDeleted: "Client deleted successfully."
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
      phoneLabel: "Teléfono",
      phonePlaceholder: "+34 91 123 45 67",
      createClient: "Crear Cliente",
      updateClient: "Actualizar Cliente",
      logoHeader: "Logo",
      nameHeader: "Nombre",
      contactHeader: "Contacto",
      phoneHeader: "Teléfono",
      actionsHeader: "Acciones",
      edit: "Editar",
      delete: "Eliminar",
      logoLabel: "Logo",
      uploadLogo: "Subir Logo",
      confirmDeleteTitle: "¿Estás seguro?",
      confirmDeleteDesc: "Esta acción no se puede deshacer. Esto eliminará permanentemente el cliente.",
      cancel: "Cancelar",
      clientDeleted: "Cliente eliminado correctamente."
    }
  }

  return (
    <>
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
            <DialogContent className="sm:max-w-[480px]">
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
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">{t[language].phoneLabel}</Label>
                  <Input id="phone" placeholder={t[language].phonePlaceholder} className="col-span-3" value={newClientPhone} onChange={(e) => setNewClientPhone(e.target.value)} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="new-logo" className="text-right">{t[language].logoLabel}</Label>
                   <div className="col-span-3 flex items-center gap-4">
                     <Avatar className="h-10 w-10">
                        {newClientLogo ? <AvatarImage src={newClientLogo} /> : <AvatarFallback>{newClientName ? newClientName.charAt(0) : '?'}</AvatarFallback>}
                      </Avatar>
                    <input
                        type="file"
                        ref={createFileInputRef}
                        onChange={(e) => handleLogoChange(e, setNewClientLogo)}
                        className="hidden"
                        accept="image/*"
                    />
                    <Button variant="outline" type="button" onClick={() => createFileInputRef.current?.click()}>
                        <Upload className="mr-2 h-4 w-4" />
                        {t[language].uploadLogo}
                    </Button>
                  </div>
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
                  <div className="flex flex-row items-center">{t[language].nameHeader} {getSortIcon('name')}</div>
                </TableHead>
                <TableHead onClick={() => requestSort('contact')} className="cursor-pointer hover:bg-muted/50">
                   <div className="flex flex-row items-center">{t[language].contactHeader} {getSortIcon('contact')}</div>
                </TableHead>
                <TableHead onClick={() => requestSort('phone')} className="cursor-pointer hover:bg-muted/50">
                   <div className="flex flex-row items-center">{t[language].phoneHeader} {getSortIcon('phone')}</div>
                </TableHead>
                <TableHead className="text-right">{t[language].actionsHeader}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAndFilteredClients.map(client => (
                <TableRow key={client.id}>
                  <TableCell>
                    <Avatar className="h-10 w-10">
                       {client.logoUrl ? 
                        <AvatarImage src={client.logoUrl} alt={client.name} />
                       : <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                       }
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell className="text-muted-foreground">{client.contact}</TableCell>
                  <TableCell className="text-muted-foreground">{client.phone}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditClick(client)}>
                           <Edit className="h-4 w-4" />
                           <span className="sr-only">{t[language].edit}</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setClientToDelete(client)} className="text-destructive hover:bg-destructive hover:text-destructive-foreground">
                           <Trash2 className="h-4 w-4" />
                           <span className="sr-only">{t[language].delete}</span>
                        </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Client Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
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
              <Label htmlFor="edit-phone" className="text-right">{t[language].phoneLabel}</Label>
              <Input id="edit-phone" placeholder={t[language].phonePlaceholder} className="col-span-3" value={editClientPhone} onChange={(e) => setEditClientPhone(e.target.value)} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-logo" className="text-right">{t[language].logoLabel}</Label>
              <div className="col-span-3 flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    {editClientLogo ? <AvatarImage src={editClientLogo} /> : <AvatarFallback>{editClientName ? editClientName.charAt(0) : '?'}</AvatarFallback>}
                  </Avatar>
                  <input
                    type="file"
                    ref={editFileInputRef}
                    onChange={(e) => handleLogoChange(e, setEditClientLogo)}
                    className="hidden"
                    accept="image/*"
                  />
                  <Button variant="outline" type="button" onClick={() => editFileInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" />
                    {t[language].uploadLogo}
                  </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdateClient}>{t[language].updateClient}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    
    <AlertDialog open={!!clientToDelete} onOpenChange={() => setClientToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>{t[language].confirmDeleteTitle}</AlertDialogTitle>
                <AlertDialogDescription>{t[language].confirmDeleteDesc}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>{t[language].cancel}</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteClient} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">{t[language].delete}</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  )
}
