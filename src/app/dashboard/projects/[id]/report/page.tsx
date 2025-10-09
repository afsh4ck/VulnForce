

'use client';

import { useParams, useRouter } from 'next/navigation';
import { MarkdownPreview } from '@/components/markdown-preview';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Logo } from '@/components/logo';
import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowRight, CheckCircle, ChevronLeft, Printer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useLanguage } from '@/context/language-context';
import { useData } from '@/context/data-context';
import type { Finding, Project, Client, ProjectTemplate } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { projectTemplates } from '@/lib/data';
import { cn } from '@/lib/utils';

interface TodoItem {
  location: string;
  context: string;
  link: string;
}

export default function ReportPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const { language: uiLanguage } = useLanguage();
  const { id: projectId } = params;
  const { projects, clients, findings, getImage } = useData();

  const [project, setProject] = useState<Project | undefined>();
  const [client, setClient] = useState<Client | undefined>();
  const [projectFindings, setProjectFindings] = useState<Finding[]>([]);
  const [template, setTemplate] = useState<ProjectTemplate | undefined>();

  useEffect(() => {
    const currentProject = projects.find(p => p.id === projectId);
    if (currentProject) {
      setProject(currentProject);
      setClient(clients.find(c => c.id === currentProject.clientId));
      const filteredFindings = findings
        .filter(f => f.projectId === currentProject.id)
        .sort((a, b) => b.cvss - a.cvss);
      setProjectFindings(filteredFindings);

    } else {
      router.push('/dashboard/projects'); // Redirect if project not found
    }
  }, [projectId, projects, clients, findings, router]);
  

  const t = {
    en: {
      executiveSummary: 'Executive Summary',
      findingsSummary: 'Findings Summary',
      scopeAndMethodology: 'Scope & Methodology',
      findings: 'Findings',
      reportPreview: 'Report Preview',
      pending: 'Pending',
      allChecksPassed: 'All checks passed!',
      readyToExport: 'This report is complete and ready to export.',
      goToItem: 'Go to Item',
      downloadPDF: 'Download PDF',
      downloadHTML: 'Download HTML',
      scope: 'Project Scope',
      finding: 'Finding',
      backToProject: 'Back to Project',
      vulnerability: 'Vulnerability',
      severity: 'Severity',
      cvss: 'CVSS',
      appendix: 'Appendix',
      severityTableTitle: 'Findings by Severity',
      count: 'Count',
      cvssRange: 'CVSS Range',
      critical: 'Critical',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      informational: 'Informational',
      executiveSummaryContent: (projectName: string, clientName: string, startDate: string, endDate: string, totalFindings: number, criticalFindings: number, highFindings: number) => 
        `This report details the findings of the penetration test conducted on **${projectName}** for **${clientName}** between ${new Date(startDate).toLocaleDateString()} and ${new Date(endDate).toLocaleDateString()}. The assessment identified **${totalFindings}** total vulnerabilities, including **${criticalFindings}** critical and **${highFindings}** high-risk findings. Urgent remediation is recommended for critical vulnerabilities to mitigate potential impact.`,
    },
    es: {
      executiveSummary: 'Resumen Ejecutivo',
      findingsSummary: 'Resumen de Hallazgos',
      scopeAndMethodology: 'Alcance y Metodología',
      findings: 'Hallazgos',
      reportPreview: 'Previsualización del Informe',
      pending: 'Pendiente',
      allChecksPassed: '¡Todas las comprobaciones superadas!',
      readyToExport: 'Este informe está completo y listo para exportar.',
      goToItem: 'Ir al Elemento',
      downloadPDF: 'Descargar PDF',
      downloadHTML: 'Descargar HTML',
      scope: 'Alcance del Proyecto',
      finding: 'Hallazgo',
      backToProject: 'Volver al Proyecto',
      vulnerability: 'Vulnerabilidad',
      severity: 'Severidad',
      cvss: 'CVSS',
      appendix: 'Apéndice',
      severityTableTitle: 'Hallazgos por Severidad',
      count: 'Cantidad',
      cvssRange: 'Rango CVSS',
      critical: 'Crítico',
      high: 'Alto',
      medium: 'Medio',
      low: 'Bajo',
      informational: 'Informativo',
      executiveSummaryContent: (projectName: string, clientName: string, startDate: string, endDate: string, totalFindings: number, criticalFindings: number, highFindings: number) =>
        `Este informe detalla los hallazgos de la prueba de penetración realizada en **${projectName}** para **${clientName}** entre el ${new Date(startDate).toLocaleDateString()} y el ${new Date(endDate).toLocaleDateString()}. La evaluación identificó un total de **${totalFindings}** vulnerabilidades, incluyendo **${criticalFindings}** hallazgos críticos y **${highFindings}** de alto riesgo. Se recomienda la remediación urgente de las vulnerabilidades críticas para mitigar el impacto potencial.`,
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
    
    const reportLang = project.language;
    const langT = t[reportLang];

    const foundTodos: TodoItem[] = [];
    const todoRegex = /\[TODO:?.*?\]?/gi;
  
    if (project.reportBody) {
        const sections = project.reportBody.split(/\n\s*---\s*\n/);
        sections.forEach((sectionContent) => {
            const headingMatch = sectionContent.match(/^(?:#+)\s(.*)/m);
            const sectionTitle = headingMatch ? headingMatch[1].trim() : langT.scope;
            const sectionId = sectionTitle.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
            
            const scopeMatches = sectionContent.match(todoRegex);
            if (scopeMatches) {
                scopeMatches.forEach(match => {
                    foundTodos.push({
                        location: sectionTitle,
                        context: match,
                        link: `/dashboard/projects/${projectId}?tab=scope#${sectionId}`,
                    });
                });
            }
        });
    }

    projectFindings.forEach(finding => {
      const findingSections = finding.markdown.split(/(?=^###\s)/gm);
      findingSections.forEach((sectionContent) => {
        const findingMatches = sectionContent.match(todoRegex);
        if (findingMatches) {
          findingMatches.forEach(match => {
            const sectionTitleMatch = sectionContent.match(/^###\s(.*)/);
            const locationName = sectionTitleMatch ? sectionTitleMatch[1].trim() : finding.title;
            const sectionId = locationName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
            
            foundTodos.push({
              location: `${langT.finding}: ${locationName}`,
              context: match,
              link: `/dashboard/projects/${projectId}/findings/${finding.id}#${sectionId}`,
            });
          });
        }
      });
    });
  
    return foundTodos;
  }, [project, projectFindings, projectId, t]);

  const handlePrint = () => {
    window.print();
  };
  
  const [scopeContent, appendixContent] = useMemo(() => {
    if (!project?.reportBody) return ['', ''];
    const parts = project.reportBody.split('### A. ');
    if (parts.length > 1) {
        return [parts[0], '### A. ' + parts.slice(1).join('### A. ')];
    }
    return [project.reportBody, ''];
  }, [project?.reportBody]);

  if (!project || !client) {
    return null; // or a loading spinner
  }

  const reportLang = project.language;
  const langT = t[reportLang];

  const criticalCount = projectFindings.filter(f => f.severity === 'Critical').length;
  const highCount = projectFindings.filter(f => f.severity === 'High').length;
  const mediumCount = projectFindings.filter(f => f.severity === 'Medium').length;
  const lowCount = projectFindings.filter(f => f.severity === 'Low').length;
  const informationalCount = projectFindings.filter(f => f.severity === 'Informational').length;
  
  const severitySummaryData = [
    { severity: langT.critical, variant: 'destructive', count: criticalCount, range: '9.0 - 10.0' },
    { severity: langT.high, variant: 'high', count: highCount, range: '7.0 - 8.9' },
    { severity: langT.medium, variant: 'medium', count: mediumCount, range: '4.0 - 6.9' },
    { severity: langT.low, variant: 'low', count: lowCount, range: '0.1 - 3.9' },
    { severity: langT.informational, variant: 'secondary', count: informationalCount, range: '0.0' },
  ];

  const executiveSummaryContent = langT.executiveSummaryContent(
    project.name,
    client.name,
    project.startDate,
    project.endDate,
    projectFindings.length,
    criticalCount,
    highCount
  );

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
        @keyframes flash {
            0% { background-color: transparent; }
            25% { background-color: rgba(255, 255, 0, 0.3); }
            100% { background-color: transparent; }
        }
        .flash-highlight {
            animation: flash 2s ease-out;
        }
      `}</style>
      
      <header className="sticky top-0 z-10 w-full bg-background/80 backdrop-blur-sm border-b no-print">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center h-14">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" asChild>
                  <Link href={`/dashboard/projects/${projectId}`}>
                      <ChevronLeft className="h-4 w-4" />
                      <span className="sr-only">{t[uiLanguage].backToProject}</span>
                  </Link>
              </Button>
              <h1 className="font-headline text-2xl font-bold">{t[uiLanguage].reportPreview}</h1>
            </div>
             <div className="flex items-center gap-2">
                <Button variant="outline" disabled>
                    {t[uiLanguage].downloadHTML}
                </Button>
                <Button onClick={handlePrint} disabled={todos.length > 0}>
                    <Printer className="mr-2 h-4 w-4" />
                    {t[uiLanguage].downloadPDF}
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
            <h2 className="font-headline text-2xl font-bold border-b-2 border-primary pb-2 mb-4 mt-12">{langT.executiveSummary}</h2>
            <div className="prose dark:prose-invert max-w-none">
              <MarkdownPreview content={executiveSummaryContent} getImage={getImage} isReport />
            </div>
            <div className="prose dark:prose-invert max-w-none mt-8">
                <h3 className="font-headline text-xl font-bold">{langT.severityTableTitle}</h3>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{langT.severity}</TableHead>
                            <TableHead className="text-center">{langT.count}</TableHead>
                            <TableHead className="text-right">{langT.cvssRange}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {severitySummaryData.map(item => (
                            <TableRow key={item.severity}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className={cn("h-3 w-3 rounded-full", {
                                            'bg-destructive': item.variant === 'destructive',
                                            'bg-orange-500': item.variant === 'high',
                                            'bg-yellow-500': item.variant === 'medium',
                                            'bg-blue-500': item.variant === 'low',
                                            'bg-gray-500': item.variant === 'secondary',
                                        })}></div>
                                        <span className="font-medium">{item.severity}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center font-code">{item.count}</TableCell>
                                <TableCell className="text-right font-code">{item.range}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
          </section>

          <section>
            <h2 className="font-headline text-2xl font-bold border-b-2 border-primary pb-2 mb-4 mt-12">{langT.scopeAndMethodology}</h2>
            <div className="prose dark:prose-invert max-w-none">
              <MarkdownPreview content={scopeContent} getImage={getImage} isReport />
            </div>
          </section>

          <section>
            <h2 className="font-headline text-2xl font-bold border-b-2 border-primary pb-2 mb-4 mt-12">{langT.findingsSummary}</h2>
             <div className="prose dark:prose-invert max-w-none">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>{langT.vulnerability}</TableHead>
                        <TableHead>{langT.severity}</TableHead>
                        <TableHead className="text-right">{langT.cvss}</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {projectFindings.map(finding => (
                        <TableRow key={finding.id}>
                        <TableCell className="font-medium">{finding.title}</TableCell>
                        <TableCell>
                            <Badge variant={getSeverityVariant(finding.severity)}>{finding.severity}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-code">{finding.cvss.toFixed(1)}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </div>
          </section>

          <section>
            <h2 className="font-headline text-2xl font-bold border-b-2 border-primary pb-2 mb-8 mt-12">{langT.findings}</h2>
            <div className="space-y-12">
              {projectFindings.map((finding, index) => (
                <div key={finding.id} className="break-after-page">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-headline text-xl font-bold mt-8">{index + 1}. {finding.title}</h3>
                    <Badge variant={getSeverityVariant(finding.severity)} className="text-base px-3 py-1">{finding.severity}</Badge>
                  </div>
                  <p className="font-code text-sm text-muted-foreground mb-6">CVSS: {finding.cvss.toFixed(1)}</p>
                  <Separator className="my-6" />
                  <div className="prose dark:prose-invert max-w-none">
                    <MarkdownPreview content={finding.markdown} getImage={getImage} isReport />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {appendixContent && (
             <section>
              <h2 className="font-headline text-2xl font-bold border-b-2 border-primary pb-2 mb-4 mt-12">{langT.appendix}</h2>
              <div className="prose dark:prose-invert max-w-none">
                <MarkdownPreview content={appendixContent} getImage={getImage} isReport />
              </div>
            </section>
          )}

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
                  <CardTitle>{todos.length > 0 ? t[uiLanguage].pending : t[uiLanguage].allChecksPassed}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {todos.length > 0 ? (
                  <ul className="space-y-4">
                    {todos.map((todo, index) => (
                      <li key={index} className="border-l-4 border-destructive pl-4">
                        <p className="font-semibold text-sm">{todo.location}</p>
                        <p className="text-xs text-muted-foreground font-code truncate my-1">"{todo.context.replace(/\[|\]/g, '')}"</p>
                        <Button variant="link" size="sm" asChild className="p-0 h-auto">
                            <Link href={todo.link}>
                                {t[uiLanguage].goToItem} <ArrowRight className="ml-1 h-3 w-3" />
                            </Link>
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">{t[uiLanguage].readyToExport}</p>
                )}
              </CardContent>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  );
}
