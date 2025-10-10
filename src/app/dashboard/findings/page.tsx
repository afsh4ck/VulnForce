
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown, Bomb } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import type { Finding } from '@/lib/types';
import { useData } from '@/context/data-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

type SortKey = keyof EnrichedFinding;
type EnrichedFinding = Finding & { projectName: string, clientName: string };

export default function AllFindingsPage() {
  const { language } = useLanguage();
  const { findings, projects, clients } = useData();
  const searchParams = useSearchParams();

  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>({ key: 'updatedAt', direction: 'descending' });
  const [severityFilter, setSeverityFilter] = useState<string>(searchParams.get('severity') || 'All');

  const getSeverityVariant = (severity: string): 'destructive' | 'high' | 'medium' | 'low' | 'secondary' => {
    switch (severity) {
      case 'Critical': return 'destructive';
      case 'High': return 'high';
      case 'Medium': return 'medium';
      case 'Low': return 'low';
      default: return 'secondary';
    }
  }
  
  const enrichedFindings = useMemo(() => {
    return findings.map(f => {
      const project = projects.find(p => p.id === f.projectId);
      const client = clients.find(c => c.id === project?.clientId);
      return {
        ...f,
        projectName: project?.name || 'N/A',
        clientName: client?.name || 'N/A'
      };
    });
  }, [findings, projects, clients]);


  const sortedAndFilteredFindings = useMemo(() => {
    let filtered = [...enrichedFindings];

    if (severityFilter !== 'All') {
      filtered = filtered.filter(f => f.severity === severityFilter);
    }
    
    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [sortConfig, enrichedFindings, severityFilter]);

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
      title: "All Findings",
      filterBySeverity: "Filter by severity...",
      all: "All",
      findingTitle: "Finding Title",
      severity: "Severity",
      project: "Project",
      client: "Client",
      cvss: "CVSS",
      lastUpdated: "Last Updated",
    },
    es: {
      title: "Todos los Hallazgos",
      filterBySeverity: "Filtrar por severidad...",
      all: "Todo",
      findingTitle: "Título del Hallazgo",
      severity: "Severidad",
      project: "Proyecto",
      client: "Cliente",
      cvss: "CVSS",
      lastUpdated: "Última Actualización",
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          {t[language].title}
          <span className="ml-2 text-xl font-medium text-muted-foreground">({sortedAndFilteredFindings.length})</span>
        </h1>
        <div className="flex items-center gap-2">
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t[language].filterBySeverity} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="All">{t[language].all}</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Informational">Informational</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => requestSort('title')} className="cursor-pointer hover:bg-muted/50">
                  <div className="flex flex-row items-center">{t[language].findingTitle} {getSortIcon('title')}</div>
                </TableHead>
                <TableHead onClick={() => requestSort('severity')} className="cursor-pointer hover:bg-muted/50">
                  <div className="flex flex-row items-center">{t[language].severity} {getSortIcon('severity')}</div>
                </TableHead>
                <TableHead onClick={() => requestSort('cvss')} className="cursor-pointer hover:bg-muted/50">
                   <div className="flex items-center">{t[language].cvss} {getSortIcon('cvss')}</div>
                </TableHead>
                <TableHead onClick={() => requestSort('projectName')} className="cursor-pointer hover:bg-muted/50">
                  <div className="flex flex-row items-center">{t[language].project} {getSortIcon('projectName')}</div>
                </TableHead>
                 <TableHead onClick={() => requestSort('clientName')} className="cursor-pointer hover:bg-muted/50">
                  <div className="flex flex-row items-center">{t[language].client} {getSortIcon('clientName')}</div>
                </TableHead>
                <TableHead onClick={() => requestSort('updatedAt')} className="cursor-pointer hover:bg-muted/50">
                  <div className="flex flex-row items-center">{t[language].lastUpdated} {getSortIcon('updatedAt')}</div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAndFilteredFindings.map((finding) => (
                <TableRow key={finding.id}>
                  <TableCell className="font-medium">
                     <Link href={`/dashboard/projects/${finding.projectId}/findings/${finding.id}`} className="hover:text-primary flex items-center gap-2">
                        <Bomb className="h-4 w-4" />
                        {finding.title}
                     </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getSeverityVariant(finding.severity)}>{finding.severity}</Badge>
                  </TableCell>
                  <TableCell className="font-code">{finding.cvss.toFixed(1)}</TableCell>
                  <TableCell>
                    <Link href={`/dashboard/projects/${finding.projectId}`} className="hover:text-primary">
                      {finding.projectName}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{finding.clientName}</TableCell>
                   <TableCell>{format(new Date(finding.updatedAt), 'PP', { locale: language === 'es' ? es : undefined })}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
    )
}
