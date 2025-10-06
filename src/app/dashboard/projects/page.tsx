'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Search } from "lucide-react";
import { projects, clients } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/context/language-context";

export default function ProjectsPage() {
  const { language } = useLanguage();

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'In Progress': return 'default';
      case 'Completed': return 'secondary';
      case 'On Hold': return 'outline';
      default: return 'secondary';
    }
  }

  const getStatus = (status: string) => {
    if (language === 'es') {
      if (status === 'In Progress') return 'En Progreso';
      if (status === 'Completed') return 'Completado';
      if (status === 'On Hold') return 'En Espera';
    }
    return status;
  }

  const t = {
    en: {
      title: "Projects",
      searchPlaceholder: "Search projects...",
      newProject: "New Project",
      projectNameHeader: "Project Name",
      clientHeader: "Client",
      statusHeader: "Status",
      endDateHeader: "End Date"
    },
    es: {
      title: "Proyectos",
      searchPlaceholder: "Buscar proyectos...",
      newProject: "Nuevo Proyecto",
      projectNameHeader: "Nombre del Proyecto",
      clientHeader: "Cliente",
      statusHeader: "Estado",
      endDateHeader: "Fecha de Fin"
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
           <Button asChild>
            <Link href="/dashboard/projects/new">
                <PlusCircle className="mr-2 h-4 w-4" /> {t[language].newProject}
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t[language].projectNameHeader}</TableHead>
                <TableHead>{t[language].clientHeader}</TableHead>
                <TableHead>{t[language].statusHeader}</TableHead>
                <TableHead>{t[language].endDateHeader}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map(project => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">
                    <Link href={`/dashboard/projects/${project.id}`} className="hover:underline">{project.name}</Link>
                  </TableCell>
                  <TableCell>{clients.find(c => c.id === project.clientId)?.name}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(project.status) as any}>{getStatus(project.status)}</Badge>
                  </TableCell>
                  <TableCell>{new Date(project.endDate).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
