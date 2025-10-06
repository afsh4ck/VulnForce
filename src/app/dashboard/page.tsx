'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { PlusCircle, Users, FolderKanban, ShieldCheck } from "lucide-react";
import { projects, clients, findings } from "@/lib/data";
import { useLanguage } from "@/context/language-context";

export default function DashboardPage() {
  const { language } = useLanguage();
  const criticalFindings = findings.filter(f => f.severity === 'Critical').length;

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
      recentProjects: "Recent Projects"
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
      recentProjects: "Proyectos Recientes"
    }
  }

  return (
    <div className="space-y-6">
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
        <Link href="/dashboard/projects">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t[language].totalProjects}</CardTitle>
              <FolderKanban className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
              <p className="text-xs text-muted-foreground">{t[language].acrossAllClients}</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/clients">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t[language].totalClients}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clients.length}</div>
              <p className="text-xs text-muted-foreground">{t[language].managedInSystem}</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/vulnerabilities">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t[language].totalFindings}</CardTitle>
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{findings.length}</div>
              <p className="text-xs text-muted-foreground">{t[language].inActiveProjects}</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/vulnerabilities">
          <Card className="border-destructive hover:bg-destructive/10 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t[language].criticalFindings}</CardTitle>
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
            <CardTitle>{t[language].recentProjects}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {projects.slice(0, 3).map(p => (
                <li key={p.id} className="flex items-center justify-between rounded-md p-2 hover:bg-muted">
                    <div>
                        <Link href={`/dashboard/projects/${p.id}`} className="font-medium hover:underline">{p.name}</Link>
                        <p className="text-sm text-muted-foreground">{clients.find(c => c.id === p.clientId)?.name}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{p.status}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
