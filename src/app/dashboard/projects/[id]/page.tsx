'use client';

import React, { useState, useMemo } from 'react';
import { projects, clients, findings as allFindings } from "@/lib/data";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, FileText, ArrowUpDown, Edit, Save } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/context/language-context";
import type { Finding } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from '@/components/ui/textarea';
import { MarkdownPreview } from '@/components/markdown-preview';

type SortKey = keyof Finding;

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const project = projects.find(p => p.id === params.id);
  const { language } = useLanguage();
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>(null);
  const [isEditingScope, setIsEditingScope] = useState(false);
  const [scopeContent, setScopeContent] = useState(project?.scope || '');

  if (!project) {
    notFound();
  }

  const client = clients.find(c => c.id === project.clientId);
  const projectFindings = allFindings.filter(f => f.projectId === project.id);

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'destructive';
      case 'High': return 'destructive';
      case 'Medium': return 'default';
      case 'Low': return 'secondary';
      default: return 'outline';
    }
  }

  const sortedFindings = useMemo(() => {
    let sortableFindings = [...projectFindings];
    if (sortConfig !== null) {
      sortableFindings.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableFindings;
  }, [projectFindings, sortConfig]);

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
  };

  const t = {
    en: {
      status: "Status",
      scopeAndDetails: "Scope & Details",
      findings: "Findings",
      exportReport: "Export Report",
      addFinding: "Add Finding",
      title: "Title",
      severity: "Severity",
      cvss: "CVSS",
      projectDetails: "Project Details",
      client: "Client",
      projectName: "Project Name",
      startDate: "Start Date",
      endDate: "End Date",
      inProgress: "In Progress",
      completed: "Completed",
      onHold: "On Hold",
      editScope: "Edit Scope",
      saveScope: "Save Scope"
    },
    es: {
      status: "Estado",
      scopeAndDetails: "Alcance y Detalles",
      findings: "Hallazgos",
      exportReport: "Exportar Informe",
      addFinding: "Añadir Hallazgo",
      title: "Título",
      severity: "Severidad",
      cvss: "CVSS",
      projectDetails: "Detalles del Proyecto",
      client: "Cliente",
      projectName: "Nombre del Proyecto",
      startDate: "Fecha de Inicio",
      endDate: "Fecha de Fin",
      inProgress: "En Progreso",
      completed: "Completado",
      onHold: "En Espera",
      editScope: "Editar Alcance",
      saveScope: "Guardar Alcance"
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
  
  const handleSaveScope = () => {
    // Here you would save the scopeContent to your data source
    console.log("Saving scope:", scopeContent);
    setIsEditingScope(false);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{client?.name}</p>
        <h1 className="font-headline text-3xl font-bold tracking-tight">{project.name}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{t[language].status}: <Badge variant={project.status === 'Completed' ? 'secondary' : 'default'}>{getStatus(project.status)}</Badge></span>
          <span>{new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}</span>
        </div>
      </div>
      
      <Separator />
      
      <Tabs defaultValue="scope">
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
          <TabsTrigger value="scope">{t[language].scopeAndDetails}</TabsTrigger>
          <TabsTrigger value="findings">{t[language].findings} ({projectFindings.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="scope" className="mt-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{t[language].scopeAndDetails}</CardTitle>
                    {isEditingScope ? (
                        <Button size="sm" onClick={handleSaveScope}>
                            <Save className="mr-2 h-4 w-4" />
                            {t[language].saveScope}
                        </Button>
                    ) : (
                        <Button size="sm" variant="outline" onClick={() => setIsEditingScope(true)}>
                            <Edit className="mr-2 h-4 w-4" />
                            {t[language].editScope}
                        </Button>
                    )}
                </CardHeader>
                <CardContent>
                    {isEditingScope ? (
                        <Textarea 
                            className="font-code min-h-[500px] w-full"
                            value={scopeContent}
                            onChange={(e) => setScopeContent(e.target.value)}
                        />
                    ) : (
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                            <MarkdownPreview content={scopeContent} />
                        </div>
                    )}
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="findings" className="mt-4">
           <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>{t[language].findings}</CardTitle>
                    <CardDescription>{projectFindings.length} {t[language].findings.toLowerCase()} {language === 'es' ? 'encontrados' : 'found'}</CardDescription>
                </div>
                <div className="flex gap-2">
                <Button variant="outline" size="sm"><FileText className="mr-2 h-4 w-4" /> {t[language].exportReport}</Button>
                <Button size="sm" asChild>
                    <Link href={`/dashboard/projects/${project.id}/findings/new`}>
                    <PlusCircle className="mr-2 h-4 w-4" /> {t[language].addFinding}
                    </Link>
                </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead onClick={() => requestSort('title')} className="cursor-pointer hover:bg-muted/50">
                        <div className="flex items-center">{t[language].title} {getSortIcon('title')}</div>
                    </TableHead>
                    <TableHead onClick={() => requestSort('severity')} className="cursor-pointer hover:bg-muted/50">
                        <div className="flex items-center">{t[language].severity} {getSortIcon('severity')}</div>
                    </TableHead>
                    <TableHead onClick={() => requestSort('cvss')} className="cursor-pointer hover:bg-muted/50">
                        <div className="flex items-center">{t[language].cvss} {getSortIcon('cvss')}</div>
                    </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedFindings.map(finding => (
                    <TableRow key={finding.id}>
                        <TableCell className="font-medium">
                        <Link href={`/dashboard/projects/${project.id}/findings/${finding.id}`} className="hover:underline">{finding.title}</Link>
                        </TableCell>
                        <TableCell>
                        <Badge variant={getSeverityVariant(finding.severity) as any}>{finding.severity}</Badge>
                        </TableCell>
                        <TableCell>{finding.cvss.toFixed(1)}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
