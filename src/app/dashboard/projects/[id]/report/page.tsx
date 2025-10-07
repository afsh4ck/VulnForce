
'use client';

import { useParams, useRouter } from 'next/navigation';
import { MarkdownPreview } from '@/components/markdown-preview';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Logo } from '@/components/logo';
import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowRight, CheckCircle, Printer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useLanguage } from '@/context/language-context';
import { useData } from '@/context/data-context';
import type { Finding, Project, Client } from '@/lib/types';

interface TodoItem {
  location: string;
  context: string;
  link: string;
}

export default function ReportPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const { language } = useLanguage();
  const { id: projectId } = params;
  const { projects, clients, findings } = useData();

  const [project, setProject] = useState<Project | undefined>();
  const [client, setClient] = useState<Client | undefined>();
  const [projectFindings, setProjectFindings] = useState<Finding[]>([]);

  useEffect(() => {
    const currentProject = projects.find(p => p.id === projectId);
    if (currentProject) {
      setProject(currentProject);
      setClient(clients.find(c => c.id === currentProject.clientId));
      setProjectFindings(findings.filter(f => f.projectId === currentProject.id));
    } else {
      router.push('/dashboard/projects'); // Redirect if project not found
    }
  }, [projectId, projects, clients, findings, router]);
  

  const t = {
    en: {
      executiveSummary: 'Executive Summary',
      scopeAndMethodology: 'Scope & Methodology',
      detailedFindings: 'Detailed Findings',
      reportPreview: 'Report Preview',
      pendingItems: 'Pending Items',
      allChecksPassed: 'All checks passed!',
      readyToExport: 'This report is complete and ready to export.',
      goToItem: 'Go to Item',
      downloadPDF: 'Download as PDF',
      downloadHTML: 'Download as HTML',
      scope: 'Project Scope',
      finding: 'Finding',
    },
    es: {
      executiveSummary: 'Resumen Ejecutivo',
      scopeAndMethodology: 'Alcance y Metodología',
      detailedFindings: 'Hallazgos Detallados',
      reportPreview: 'Previsualización del Informe',
      pendingItems: 'Elementos Pendientes',
      allChecksPassed: '¡Todas las comprobaciones superadas!',
      readyToExport: 'Este informe está completo y listo para exportar.',
      goToItem: 'Ir al Elemento',
      downloadPDF: 'Descargar como PDF',
      downloadHTML: 'Descargar como HTML',
      scope: 'Alcance del Proyecto',
      finding: 'Hallazgo',
    },
  };

  const getSeverityVariant = (severity: string): 'destructive' | 'high' | 'medium' | 'low' | 'secondary' => {
    switch (severity) {
      case 'Critical': return 'destructive';
      case 'High': return 'high';
      case 'Medium': return 'medium';
      case 'Low': return 'low';
      default: return 'secondary';
    }
  };

  const todos = useMemo(() => {
    if (!project) return [];
    const foundTodos: TodoItem[] = [];
    const todoRegex = /TODO/g;

    // Check project scope
    if (project.scope.match(todoRegex)) {
      foundTodos.push({
        location: t[language].scope,
        context: project.scope.substring(0, 100) + '...',
        link: `/dashboard/projects/${projectId}`,
      });
    }

    // Check findings
    projectFindings.forEach(finding => {
      if (finding.markdown.match(todoRegex)) {
        foundTodos.push({
          location: `${t[language].finding}: ${finding.title}`,
          context: finding.markdown.substring(0, 100) + '...',
          link: `/dashboard/projects/${projectId}/findings/${finding.id}`,
        });
      }
    });

    return foundTodos;
  }, [project, projectFindings, language, projectId, t]);

  const handlePrint = () => {
    window.print();
  };
  
  if (!project) {
    return null; // or a loading spinner
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: A4;
            margin: 1.5cm;
          }
        }
      `}</style>
      
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
            <h1 className="font-headline text-2xl font-bold">{t[language].reportPreview}</h1>
             <div className="flex items-center gap-2">
                <Button variant="outline" disabled>
                    {t[language].downloadHTML}
                </Button>
                <Button onClick={handlePrint} disabled={todos.length > 0}>
                    <Printer className="mr-2 h-4 w-4" />
                    {t[language].downloadPDF}
                </Button>
            </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Report Content */}
        <div className="lg:col-span-2 space-y-12">
          <header className="flex justify-between items-start">
            <div>
              <h1 className="font-headline text-4xl font-bold text-primary">{project.name}</h1>
              <p className="text-xl text-muted-foreground">{client?.name}</p>
            </div>
            <Logo />
          </header>

          <section>
            <h2 className="font-headline text-2xl font-bold border-b-2 border-primary pb-2 mb-4">{t[language].executiveSummary}</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p>This report details the findings of the penetration test conducted on <strong>{project.name}</strong> for <strong>{client?.name}</strong> between {new Date(project.startDate).toLocaleDateString()} and {new Date(project.endDate).toLocaleDateString()}. The assessment identified <strong>{projectFindings.length}</strong> total vulnerabilities, including <strong>{projectFindings.filter(f => f.severity === 'Critical').length}</strong> critical and <strong>{projectFindings.filter(f => f.severity === 'High').length}</strong> high-risk findings. Urgent remediation is recommended for critical vulnerabilities to mitigate potential impact.</p>
            </div>
          </section>

          <section>
            <h2 className="font-headline text-2xl font-bold border-b-2 border-primary pb-2 mb-4">{t[language].scopeAndMethodology}</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <MarkdownPreview content={project.scope} />
            </div>
          </section>

          <section>
            <h2 className="font-headline text-2xl font-bold border-b-2 border-primary pb-2 mb-8">{t[language].detailedFindings}</h2>
            <div className="space-y-12">
              {projectFindings.map((finding, index) => (
                <div key={finding.id} className="break-after-page">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-headline text-xl font-bold">{index + 1}. {finding.title}</h3>
                    <Badge variant={getSeverityVariant(finding.severity)} className="text-base px-3 py-1">{finding.severity}</Badge>
                  </div>
                  <p className="font-code text-sm text-muted-foreground mb-6">CVSS: {finding.cvss.toFixed(1)}</p>
                  <Separator className="my-6" />
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <MarkdownPreview content={finding.markdown} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar for TODOs */}
        <aside className="lg:col-span-1 no-print">
          <div className="sticky top-20">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  {todos.length === 0 ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <AlertCircle className="h-6 w-6 text-destructive" />
                  )}
                  <CardTitle>{todos.length > 0 ? t[language].pendingItems : t[language].allChecksPassed}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {todos.length > 0 ? (
                  <ul className="space-y-4">
                    {todos.map((todo, index) => (
                      <li key={index} className="border-l-4 border-destructive pl-4">
                        <p className="font-semibold text-sm">{todo.location}</p>
                        <p className="text-xs text-muted-foreground font-code truncate my-1">"{todo.context.replace(/TODO/g, '')}"</p>
                        <Button variant="link" size="sm" asChild className="p-0 h-auto">
                            <Link href={todo.link}>
                                {t[language].goToItem} <ArrowRight className="ml-1 h-3 w-3" />
                            </Link>
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">{t[language].readyToExport}</p>
                )}
              </CardContent>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  );
}
