

'use client';

import { useParams, useRouter } from 'next/navigation';
import { MarkdownPreview } from '@/components/markdown-preview';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Logo } from '@/components/logo';
import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowRight, CheckCircle, ChevronLeft, Printer, Globe, Sun, Moon, PanelLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useLanguage } from '@/context/language-context';
import { useData } from '@/context/data-context';
import type { Finding, Project, Client } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/theme-context';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface TodoItem {
  location: string;
  context: string;
  link: string;
}

interface Heading {
  level: number;
  text: string;
  id: string;
}

export default function ReportPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const { language: uiLanguage } = useLanguage();
  const { id: projectId } = params;
  const { projects, clients, findings, getImage } = useData();
  const { theme, setTheme } = useTheme();

  const [project, setProject] = useState<Project | undefined>();
  const [client, setClient] = useState<Client | undefined>();
  const [projectFindings, setProjectFindings] = useState<Finding[]>([]);
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const reportContentRef = useRef<HTMLDivElement>(null);

  const generateSlug = useMemo(() => {
    const seen = new Set<string>();
    return (text: string) => {
      const baseSlug = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
      let finalSlug = baseSlug;
      let counter = 0;
      while (seen.has(finalSlug)) {
        counter++;
        finalSlug = `${baseSlug}-${counter}`;
      }
      seen.add(finalSlug);
      return finalSlug;
    };
  }, []);

  const getSeverityVariant = (severity: string): 'destructive' | 'high' | 'medium' | 'low' | 'secondary' => {
    switch (severity) {
      case 'Critical': return 'destructive';
      case 'High': return 'high';
      case 'Medium': return 'medium';
      case 'Low': return 'low';
      default: return 'secondary';
    }
  }

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
      lightMode: 'Light Mode',
      darkMode: 'Dark Mode',
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
      lightMode: 'Modo Claro',
      darkMode: 'Modo Oscuro',
      executiveSummaryContent: (projectName: string, clientName: string, startDate: string, endDate: string, totalFindings: number, criticalFindings: number, highFindings: number) =>
        `Este informe detalla los hallazgos de la prueba de penetración realizada en **${projectName}** para **${clientName}** entre el ${new Date(startDate).toLocaleDateString()} y el ${new Date(endDate).toLocaleDateString()}. La evaluación identificó un total de **${totalFindings}** vulnerabilidades, incluyendo **${criticalFindings}** hallazgos críticos y **${highFindings}** de alto riesgo. Se recomienda la remediación urgente de las vulnerabilidades críticas para mitigar el impacto potencial.`,
    },
  };
  
  const [scopeContent, appendixContent] = useMemo(() => {
    if (!project?.reportBody) return ['', ''];
    const parts = project.reportBody.split('### A. ');
    if (parts.length > 1) {
        return [parts[0], '### A. ' + parts.slice(1).join('### A. ')];
    }
    return [project.reportBody, ''];
  }, [project?.reportBody]);

  const extractHeadings = useCallback(() => {
    if (!project || !client) return [];
    
    const reportLang = project.language;
    const langT = t[reportLang];

    const criticalCount = projectFindings.filter(f => f.severity === 'Critical').length;
    const highCount = projectFindings.filter(f => f.severity === 'High').length;

    const allContent = `
# 1. ${langT.executiveSummary}
${langT.executiveSummaryContent(project.name, client?.name || '', project.startDate, project.endDate, projectFindings.length, criticalCount, highCount)}
# 2. ${langT.scopeAndMethodology}
${scopeContent}
# 3. ${langT.findingsSummary}
${projectFindings.map((f, i) => `## 3.${i+1} ${f.title}\n${f.markdown}`).join('\n\n')}
${appendixContent ? `# 4. ${langT.appendix}` : ''}
${appendixContent}
`;

    const headingRegex = /^(#{1,3}) (.*)/gm;
    const matches = [...allContent.matchAll(headingRegex)];
    return matches.map(match => ({
      level: match[1].length,
      text: match[2],
      id: generateSlug(match[2]),
    }));
  }, [project, client, projectFindings, scopeContent, appendixContent, t, generateSlug]);


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
      router.push('/dashboard/projects');
    }
  }, [projectId, projects, clients, findings, router]);
  
  useEffect(() => {
    if(project && client) {
      setHeadings(extractHeadings());
    }
  }, [project, client, projectFindings, extractHeadings]);

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
            const sectionId = generateSlug(sectionTitle);
            
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
            const sectionId = generateSlug(locationName);
            
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
  }, [project, projectFindings, projectId, t, generateSlug]);
  
  const handlePrint = (printTheme: 'light' | 'dark') => {
    const originalTheme = theme;
    // Temporarily set the theme for printing without causing a state update loop
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(printTheme);

    setTimeout(() => {
      window.print();
      // Restore original theme
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(originalTheme);
    }, 500); 
  };
  
  const handleDownloadHTML = () => {
    if (reportContentRef.current) {
        const fullHtml = `
<!DOCTYPE html>
<html lang="${project?.language || 'en'}" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project?.name}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    :root { --background: 0 0% 100%; --foreground: 240 10% 3.9%; --card: 0 0% 100%; --card-foreground: 240 10% 3.9%; --popover: 0 0% 100%; --popover-foreground: 240 10% 3.9%; --primary: 76 100% 50%; --primary-foreground: 76 100% 5%; --secondary: 240 4.8% 95.9%; --secondary-foreground: 240 5.9% 10%; --muted: 240 4.8% 95.9%; --muted-foreground: 240 3.8% 46.1%; --accent: 76 100% 60%; --accent-foreground: 76 100% 10%; --destructive: 0 80% 50%; --destructive-foreground: 0 0% 98%; --border: 240 5.9% 90%; --input: 240 5.9% 90%; --ring: 76 100% 50%; }
    .dark { --background: 224 71% 4%; --foreground: 210 40% 98%; --card: 224 71% 6%; --card-foreground: 210 40% 98%; --popover: 224 71% 4%; --popover-foreground: 210 40% 98%; --primary: 76 100% 50%; --primary-foreground: 76 100% 5%; --secondary: 220 15% 15%; --secondary-foreground: 210 40% 98%; --muted: 220 15% 15%; --muted-foreground: 215 20% 65%; --accent: 76 100% 60%; --accent-foreground: 76 100% 10%; --destructive: 0 72% 51%; --destructive-foreground: 210 40% 98%; --border: 220 15% 15%; --input: 220 15% 15%; --ring: 76 100% 50%; }
    body { background-color: hsl(var(--background)); color: hsl(var(--foreground)); font-family: sans-serif; }
    .prose { color: hsl(var(--foreground)); } .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 { color: hsl(var(--foreground)); } .prose a { color: hsl(var(--primary)); } .prose strong { color: hsl(var(--foreground)); } .prose blockquote { color: hsl(var(--muted-foreground)); border-left-color: hsl(var(--border)); } .prose code:not(pre code) { color: hsl(var(--accent-foreground)); background-color: hsl(var(--accent)); padding: 2px 4px; border-radius: 4px; } .prose pre { background-color: #282c34; color: #abb2bf; padding: 1em; border-radius: 8px; overflow-x: auto; } .prose table { width: 100%; } .prose th { background-color: hsl(var(--muted)); } .prose td, .prose th { border: 1px solid hsl(var(--border)); padding: 8px; } hr { border-top-color: hsl(var(--border)); }
  </style>
</head>
<body class="p-8">
  <div style="position: fixed; top: 1rem; right: 1rem;">
    <button id="theme-switcher" style="background: hsl(var(--muted)); color: hsl(var(--foreground)); padding: 0.5rem; border-radius: 9999px; border: 1px solid hsl(var(--border));">
        <svg id="sun-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>
        <svg id="moon-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon" style="display: none;"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>
    </button>
  </div>
  ${reportContentRef.current.innerHTML}
  <script>
    const switcher = document.getElementById('theme-switcher');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    const html = document.documentElement;

    switcher.addEventListener('click', () => {
      if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        html.classList.add('light');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
      } else {
        html.classList.remove('light');
        html.classList.add('dark');
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
      }
    });

    // Initial state based on class
    if (html.classList.contains('dark')) {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    } else {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    }
  </script>
</body>
</html>`;
        const blob = new Blob([fullHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${project?.name.replace(/ /g, '_')}_report.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
  };

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
          main {
             scroll-behavior: auto !important;
          }
          @page {
            size: A4;
            margin: 1.5cm;
          }
        }
        @keyframes flash {
            0% { background-color: transparent; }
            25% { background-color: hsl(var(--primary) / 0.3); }
            100% { background-color: transparent; }
        }
        .flash-highlight {
            animation: flash 2s ease-out;
        }
        main { scroll-behavior: smooth; }
      `}</style>
      
      <header className="sticky top-0 z-30 w-full bg-background/80 backdrop-blur-sm border-b no-print">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" asChild>
                  <Link href={`/dashboard/projects/${projectId}`}>
                      <ChevronLeft className="h-4 w-4" />
                      <span className="sr-only">{t[uiLanguage].backToProject}</span>
                  </Link>
              </Button>
              <h1 className="font-headline text-xl md:text-2xl font-bold">{t[uiLanguage].reportPreview}</h1>
            </div>
             <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleDownloadHTML}>
                    <Globe className="mr-2 h-4 w-4" />
                    {t[uiLanguage].downloadHTML}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button disabled={todos.length > 0}>
                      <Printer className="mr-2 h-4 w-4" />
                      {t[uiLanguage].downloadPDF}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handlePrint('light')}>{langT.lightMode}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handlePrint('dark')}>{langT.darkMode}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <PanelLeft className="h-5 w-5" />
                </Button>
            </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-8 flex">
        <aside className={cn("no-print w-64 pr-8 shrink-0 transition-all duration-300", isSidebarOpen ? "block" : "hidden")}>
          <div className="sticky top-20 h-[calc(100vh-6rem)] overflow-y-auto">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center gap-2">
                  {todos.length === 0 ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-destructive" />
                  )}
                  <CardTitle className="text-base font-semibold">{todos.length > 0 ? t[uiLanguage].pending : t[uiLanguage].allChecksPassed}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {todos.length > 0 ? (
                  <ul className="space-y-2">
                    {todos.map((todo, index) => (
                      <li key={index}>
                        <Link href={todo.link} className="block border-l-4 border-accent p-3 rounded-r-md hover:bg-muted/50 transition-colors group">
                           <div className="flex justify-between items-center">
                              <div className="flex-1 overflow-hidden">
                                <p className="font-semibold text-sm truncate">{todo.location}</p>
                                <p className="text-xs text-muted-foreground font-code truncate my-1">"{todo.context.replace(/\[|\]/g, '')}"</p>
                              </div>
                              <ArrowRight className="h-5 w-5 text-primary ml-4 shrink-0" />
                           </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">{t[uiLanguage].readyToExport}</p>
                )}
              </CardContent>
            </Card>
            
            <nav className="space-y-2">
              <p className="font-semibold text-sm px-2">Contents</p>
              <ul className="space-y-1">
                {headings.map((heading) => (
                  <li key={heading.id}>
                    <a href={`#${heading.id}`} className={cn("block text-sm rounded-md py-1 hover:bg-muted", {
                      'pl-2': heading.level === 1,
                      'pl-6': heading.level === 2,
                      'pl-10': heading.level === 3,
                    })}>
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

          </div>
        </aside>

        <main ref={reportContentRef} className={cn("flex-1 transition-all duration-300", isSidebarOpen ? "lg:pl-8" : "lg:pl-0")}>
          <div className="space-y-12">
            <header className="flex justify-between items-start">
              <div>
                <h1 className="font-headline text-4xl font-bold text-primary">{project.name}</h1>
                <p className="text-xl text-muted-foreground">{client?.name}</p>
              </div>
              <Logo />
            </header>

            <section id={headings.find(h => h.level === 1 && h.text.includes(langT.executiveSummary))?.id}>
              <h2 className="font-headline text-2xl font-bold border-b-2 border-primary pb-2 mb-4 mt-12">{`1. ${langT.executiveSummary}`}</h2>
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

            <section id={headings.find(h => h.level === 1 && h.text.includes(langT.scopeAndMethodology))?.id}>
              <h2 className="font-headline text-2xl font-bold border-b-2 border-primary pb-2 mb-4 mt-12">{`2. ${langT.scopeAndMethodology}`}</h2>
              <div className="prose dark:prose-invert max-w-none">
                <MarkdownPreview content={scopeContent} getImage={getImage} isReport />
              </div>
            </section>

            <section id={headings.find(h => h.level === 1 && h.text.includes(langT.findingsSummary))?.id}>
              <h2 className="font-headline text-2xl font-bold border-b-2 border-primary pb-2 mb-4 mt-12">{`3. ${langT.findingsSummary}`}</h2>
              <div className="space-y-12">
                {projectFindings.map((finding, index) => {
                  const headingId = headings.find(h => h.level === 2 && h.text.includes(finding.title))?.id;
                  return (
                  <div key={finding.id} id={headingId} className="break-after-page">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-headline text-xl font-bold mt-8">{`3.${index + 1} ${finding.title}`}</h3>
                      <Badge variant={getSeverityVariant(finding.severity)} className="text-base px-3 py-1">{finding.severity}</Badge>
                    </div>
                    <p className="font-code text-sm text-muted-foreground mb-6">CVSS: {finding.cvss.toFixed(1)}</p>
                    <Separator className="my-6" />
                    <div className="prose dark:prose-invert max-w-none">
                      <MarkdownPreview content={finding.markdown} getImage={getImage} isReport />
                    </div>
                  </div>
                )})}
              </div>
            </section>

            {appendixContent && (
              <section id={headings.find(h => h.level === 1 && h.text.includes(langT.appendix))?.id}>
                <h2 className="font-headline text-2xl font-bold border-b-2 border-primary pb-2 mb-4 mt-12">{`4. ${langT.appendix}`}</h2>
                <div className="prose dark:prose-invert max-w-none">
                  <MarkdownPreview content={appendixContent} getImage={getImage} isReport />
                </div>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
