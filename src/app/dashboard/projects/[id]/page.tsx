'use client';

import React, { useState, useMemo } from 'react';
import { projects, clients, findings as allFindings } from "@/lib/data";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, FileText, ArrowUpDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/context/language-context";
import type { Finding } from '@/lib/types';

type SortKey = keyof Finding;

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const project = projects.find(p => p.id === params.id);
  const { language } = useLanguage();
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>(null);

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
      scope: "Scope",
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
    },
    es: {
      status: "Estado",
      scope: "Alcance",
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

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{client?.name}</p>
        <h1 className="font-headline text-3xl font-bold tracking-tight">{project.name}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{t[language].status}: <Badge variant={project.status === 'Completed' ? 'secondary' : 'default'}>{getStatus(project.status)}</Badge></span>
          <span>{t[language].scope}: <span className="font-code">{project.scope}</span></span>
          <span>{new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}</span>
        </div>
      </div>
      
      <Separator />

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t[language].findings}</CardTitle>
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
        
        <Card>
          <CardHeader>
            <CardTitle>{t[language].projectDetails}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t[language].client}</span>
              <span>{client?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t[language].projectName}</span>
              <span>{project.name}</span>
            </div>
             <div className="flex flex-col">
              <span className="text-muted-foreground">{t[language].scope}</span>
              <span className="font-code text-right">{project.scope}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t[language].startDate}</span>
              <span>{new Date(project.startDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t[language].endDate}</span>
              <span>{new Date(project.endDate).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
