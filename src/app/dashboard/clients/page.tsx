'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Search } from "lucide-react";
import { clients } from "@/lib/data";
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


export default function ClientsPage() {
  const { language } = useLanguage();
  const getLogo = (logoUrl: string) => {
    const image = PlaceHolderImages.find(img => img.id === logoUrl);
    return image ? image.imageUrl : `https://picsum.photos/seed/${logoUrl}/40/40`;
  }

  const t = {
    en: {
      title: "Clients",
      searchPlaceholder: "Search clients...",
      newClient: "New Client",
      newClientTitle: "Create New Client",
      newClientDescription: "Add a new client to manage their projects and findings.",
      nameLabel: "Name",
      namePlaceholder: "Client Company Name",
      contactLabel: "Contact",
      contactPlaceholder: "contact@email.com",
      createClient: "Create Client",
      logoHeader: "Logo",
      nameHeader: "Name",
      contactHeader: "Contact",
      languageHeader: "Language",
      actionsHeader: "Actions",
      edit: "Edit"
    },
    es: {
      title: "Clientes",
      searchPlaceholder: "Buscar clientes...",
      newClient: "Nuevo Cliente",
      newClientTitle: "Crear Nuevo Cliente",
      newClientDescription: "Añade un nuevo cliente para gestionar sus proyectos y hallazgos.",
      nameLabel: "Nombre",
      namePlaceholder: "Nombre de la Empresa Cliente",
      contactLabel: "Contacto",
      contactPlaceholder: "contacto@email.com",
      createClient: "Crear Cliente",
      logoHeader: "Logo",
      nameHeader: "Nombre",
      contactHeader: "Contacto",
      languageHeader: "Idioma",
      actionsHeader: "Acciones",
      edit: "Editar"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="font-headline text-3xl font-bold tracking-tight">{t[language].title}</h1>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t[language].searchPlaceholder} className="pl-8" />
          </div>
          <Dialog>
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
                  <Input id="name" placeholder={t[language].namePlaceholder} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="contact" className="text-right">{t[language].contactLabel}</Label>
                  <Input id="contact" placeholder={t[language].contactPlaceholder} className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{t[language].createClient}</Button>
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
                <TableHead>{t[language].nameHeader}</TableHead>
                <TableHead>{t[language].contactHeader}</TableHead>
                <TableHead>{t[language].languageHeader}</TableHead>
                <TableHead className="text-right">{t[language].actionsHeader}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map(client => (
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
                    <Button variant="ghost" size="sm">{t[language].edit}</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}