
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { PlusCircle, Users, FolderKanban, ShieldCheck, ChevronLeft, ChevronRight, Bomb, ArrowUpDown } from "@/components/icons";
import { useLanguage } from "@/context/language-context";
import { useData } from "@/context/data-context";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { ProjectIcon, projectIconComponents } from "@/components/project-icon";
import { getProjectStatusLabel, getProjectStatusVariant } from "@/lib/project-status";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type SortKey = 'name' | 'clientName' | 'findingCount' | 'status' | 'updatedAt';

export default function DashboardPage() {
  const { language } = useLanguage();
  const { projects, clients, findings } = useData();
  const criticalFindings = findings.filter(f => f.severity === 'Critical').length;
  
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' }>({ key: 'updatedAt', direction: 'descending' });
  const projectsPerPage = 10;
  
  const enrichedProjects = useMemo(() => {
    return projects.map(p => ({
        ...p,
        clientName: clients.find(c => c.id === p.clientId)?.name || '',
        findingCount: findings.filter(f => f.projectId === p.id).length
    }))
  }, [projects, clients, findings]);

  const sortedProjects = useMemo(() => {
    return [...enrichedProjects].sort((a, b) => {
      const aValue = sortConfig.key === 'updatedAt'
        ? new Date(a.updatedAt).getTime()
        : a[sortConfig.key];
      const bValue = sortConfig.key === 'updatedAt'
        ? new Date(b.updatedAt).getTime()
        : b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
      return 0;
    });
  }, [enrichedProjects, sortConfig]);

  const recentProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * projectsPerPage;
    const endIndex = startIndex + projectsPerPage;
    return sortedProjects.slice(startIndex, endIndex);
  }, [sortedProjects, currentPage, projectsPerPage]);

  const totalPages = Math.ceil(sortedProjects.length / projectsPerPage);

  const requestSort = (key: SortKey) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const getSortIcon = (key: SortKey) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
  };

  const getStatusVariant = (status: string) => getProjectStatusVariant(status) as any;
  const getStatus = (status: string) => getProjectStatusLabel(status, language as 'en' | 'es');

  const t = {
    en: {
      dashboard: "Dashboard",
      newProject: "New Project",
      totalProjects: "Total Projects",
      acrossAllClients: "Across all clients",
      totalClients: "Total Clients",
      managedInSystem: "Managed in the system",
      totalFindings: "Total Findings",
      inActiveProjects: "In active projects",
      criticalFindings: "Critical Findings",
      immediateAttention: "Requiring immediate attention",
      recentProjects: "Recent Projects",
      project: "Project",
      client: "Client",
      status: "Status",
      previous: "Previous",
      next: "Next",
      page: "Page",
      of: "of",
      findings: "findings",
      lastUpdated: "Last updated"
    },
    es: {
      dashboard: "Dashboard",
      newProject: "Nuevo Proyecto",
      totalProjects: "Proyectos Totales",
      acrossAllClients: "En todos los clientes",
      totalClients: "Clientes Totales",
      managedInSystem: "Gestionados en el sistema",
      totalFindings: "Hallazgos Totales",
      inActiveProjects: "En proyectos activos",
      criticalFindings: "Hallazgos Críticos",
      immediateAttention: "Requieren atención inmediata",
      recentProjects: "Proyectos Recientes",
      project: "Proyecto",
      client: "Cliente",
      status: "Estado",
      previous: "Anterior",
      next: "Siguiente",
      page: "Página",
      of: "de",
      findings: "hallazgos",
      lastUpdated: "Última actualización"
    }
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="font-headline text-3xl font-bold tracking-tight">{t[language].dashboard}</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/dashboard/projects/new">
              <PlusCircle className="mr-2 h-4 w-4" /> {t[language].newProject}
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/dashboard/projects" className="group">
          <Card className="hover:border-primary hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">{t[language].totalProjects}</CardTitle>
              <FolderKanban className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
              <p className="text-xs text-muted-foreground">{t[language].acrossAllClients}</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/clients" className="group">
          <Card className="hover:border-primary hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">{t[language].totalClients}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clients.length}</div>
              <p className="text-xs text-muted-foreground">{t[language].managedInSystem}</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/findings" className="group">
          <Card className="hover:border-primary hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">{t[language].totalFindings}</CardTitle>
              <Bomb className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{findings.length}</div>
              <p className="text-xs text-muted-foreground">{t[language].inActiveProjects}</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/findings?severity=Critical" className="group">
          <Card className="border-destructive hover:border-destructive hover:bg-destructive/10 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium group-hover:text-destructive transition-colors">{t[language].criticalFindings}</CardTitle>
                  <ShieldCheck className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold text-destructive">{criticalFindings}</div>
                  <p className="text-xs text-muted-foreground">{t[language].immediateAttention}</p>
              </CardContent>
          </Card>
        </Link>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">{t[language].recentProjects}</CardTitle>
          </CardHeader>
          <CardContent>
            {recentProjects.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead onClick={() => requestSort('name')} className="cursor-pointer hover:bg-muted/50">
                      <div className="flex items-center">{t[language].project}{getSortIcon('name')}</div>
                    </TableHead>
                    <TableHead onClick={() => requestSort('clientName')} className="cursor-pointer hover:bg-muted/50">
                      <div className="flex items-center">{t[language].client}{getSortIcon('clientName')}</div>
                    </TableHead>
                    <TableHead onClick={() => requestSort('findingCount')} className="cursor-pointer hover:bg-muted/50">
                      <div className="flex items-center">{t[language].findings}{getSortIcon('findingCount')}</div>
                    </TableHead>
                    <TableHead onClick={() => requestSort('status')} className="cursor-pointer hover:bg-muted/50">
                      <div className="flex items-center">{t[language].status}{getSortIcon('status')}</div>
                    </TableHead>
                    <TableHead onClick={() => requestSort('updatedAt')} className="cursor-pointer hover:bg-muted/50">
                      <div className="flex items-center">{t[language].lastUpdated}{getSortIcon('updatedAt')}</div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentProjects.map(p => {
                    const Icon = projectIconComponents[p.icon] || ProjectIcon;
                    return (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">
                          <Link href={`/dashboard/projects/${p.id}`} className="flex items-center gap-2 hover:text-primary">
                            <Icon className="h-5 w-5 text-primary" />
                            {p.name}
                          </Link>
                        </TableCell>
                        <TableCell>{p.clientName}</TableCell>
                        <TableCell>{p.findingCount}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(p.status)}>{getStatus(p.status)}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDistanceToNow(new Date(p.updatedAt), { addSuffix: true, locale: language === 'es' ? es : undefined })}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground">No projects found.</p>
            )}
             {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  {t[language].previous}
                </Button>
                <span className="text-sm text-muted-foreground">
                  {t[language].page} {currentPage} {t[language].of} {totalPages}
                </span>
                <Button 
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  {t[language].next}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
