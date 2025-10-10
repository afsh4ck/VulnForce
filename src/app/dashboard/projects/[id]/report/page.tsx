
'use client';

import { useParams, useRouter } from 'next/navigation';
import { MarkdownPreview } from '@/components/markdown-preview';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Logo } from '@/components/logo';
import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowRight, CheckCircle, ChevronLeft, Printer, Globe, Sun, Moon, PanelLeft, Menu, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useLanguage } from '@/context/language-context';
import { useData } from '@/context/data-context';
import type { Finding, Project, Client } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/theme-context';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

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
  const { theme } = useTheme();

  const [project, setProject] = useState<Project | undefined>();
  const [client, setClient] = useState<Client | undefined>();
  const [projectFindings, setProjectFindings] = useState<Finding[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [showTodos, setShowTodos] = useState(true);
  
  const reportContentRef = useRef<HTMLDivElement>(null);

  const t = {
    en: {
      executiveSummary: 'Executive Summary',
      findingsSummary: 'Findings Summary',
      tableOfContents: 'Table of Contents',
      scopeAndMethodology: 'Scope & Methodology',
      findings: 'Findings',
      reportPreview: 'Report Preview',
      pending: 'Pending',
      noPendingItems: 'No pending items',
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
      tableOfContents: 'Índice de Contenidos',
      scopeAndMethodology: 'Alcance y Metodología',
      findings: 'Hallazgos',
      reportPreview: 'Previsualización del Informe',
      pending: 'Pendiente',
      noPendingItems: 'No quedan elementos pendientes',
      readyToExport: 'Este informe está completo y listo para exportar.',
      goToItem: 'Ir al Elemento',
      downloadPDF: 'Descargar PDF',
      downloadHTML: 'Descargar HTML',
      scope: 'Alcance del Proyecto',
      finding: 'Hallazgo',
      backToProject: 'Volver al Proyecto',
      vulnerability: 'Vulnerabilidad',
      severidad: 'Severidad',
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
  
  const fullReportContent = useMemo(() => {
    if (!project || !client) return '';

    const reportLang = project.language;
    const langT = t[reportLang];
    const criticalCount = projectFindings.filter(f => f.severity === 'Critical').length;
    const highCount = projectFindings.filter(f => f.severity === 'High').length;
    
    // Separate main content from findings
    const mainContent = `
# ${langT.executiveSummary}
${langT.executiveSummaryContent(project.name, client?.name || '', project.startDate, project.endDate, projectFindings.length, criticalCount, highCount)}

# ${langT.scopeAndMethodology}
${project.reportBody || ''}
`;

    // Combine findings content
    const findingsContent = projectFindings
      .map((f, i) => `## 3.${i+1} ${f.title}\n${f.markdown}`)
      .join('\n\n');
      
    const findingsSection = `# ${langT.findingsSummary}\n${findingsContent}`;

    return `${mainContent}\n${findingsSection}`;
  }, [project, client, projectFindings, t]);
  
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
    if (fullReportContent) {
        const headingRegex = /^(#{1,3}) (.*)/gm;
        let matches = Array.from(fullReportContent.matchAll(headingRegex));
        
        let idCounter = 0;
        const seen = new Set<string>();
        const generateId = (text: string) => {
            idCounter++;
            let baseSlug = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') || `section-${idCounter}`;
            let finalSlug = baseSlug;
            let counter = 1;
            while (seen.has(finalSlug)) {
                finalSlug = `${baseSlug}-${counter}`;
                counter++;
            }
            seen.add(finalSlug);
            return finalSlug;
        };

        const newHeadings = matches.map(match => ({
            level: match[1].length,
            text: match[2],
            id: generateId(match[2]),
        }));
        setHeadings(newHeadings);
    }
  }, [fullReportContent]);


  const todos = useMemo(() => {
    if (!project) return [];
    
    const reportLang = project.language;
    const langT = t[reportLang];
    
    const foundTodos: TodoItem[] = [];
    const todoRegex = /\[TODO:?.*?\]?/gi;
    let idCounter = 0;
    const seen = new Set<string>();
    const generateId = (text: string) => {
        idCounter++;
        let baseSlug = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') || `section-${idCounter}`;
        let finalSlug = baseSlug;
        let counter = 1;
        while (seen.has(finalSlug)) {
            finalSlug = `${baseSlug}-${counter}`;
            counter++;
        }
        seen.add(finalSlug);
        return finalSlug;
    };
  
    if (project.reportBody) {
        const sections = project.reportBody.split(/\n\s*---\s*\n/);
        sections.forEach((sectionContent) => {
            const headingMatch = sectionContent.match(/^(?:#+)\s(.*)/m);
            const sectionTitle = headingMatch ? headingMatch[1].trim() : langT.scope;
            const sectionId = generateId(sectionTitle);
            
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
            const sectionId = generateId(locationName);
            
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
  
  const handlePrint = (printTheme: 'light' | 'dark') => {
    const originalTheme = document.documentElement.className;
    document.documentElement.className = printTheme;
    setTimeout(() => {
      window.print();
      document.documentElement.className = originalTheme;
    }, 500); 
  };
  
  const handleDownloadHTML = () => {
    if (reportContentRef.current && project) {
      const reportLang = project.language;
      const tocHtml = headings.map(h => `<li class="toc-level-${h.level}"><a href="#${h.id}">${h.text}</a></li>`).join('');

      const fullHtml = `
<!DOCTYPE html>
<html lang="${reportLang}" class="dark scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.name}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    :root { --background: 0 0% 94.1%; --foreground: 240 10% 3.9%; --card: 0 0% 100%; --card-foreground: 240 10% 3.9%; --popover: 0 0% 100%; --popover-foreground: 240 10% 3.9%; --primary: 275 100% 25%; --primary-foreground: 0 0% 98%; --secondary: 240 4.8% 95.9%; --secondary-foreground: 240 5.9% 10%; --muted: 240 4.8% 95.9%; --muted-foreground: 240 3.8% 46.1%; --accent: 180 100% 25%; --accent-foreground: 0 0% 98%; --destructive: 0 84.2% 60.2%; --destructive-foreground: 0 0% 98%; --border: 240 5.9% 90%; --input: 240 5.9% 90%; --ring: 275 100% 25%; --radius: 0.5rem; }
    .dark { --background: 240 10% 3.9%; --foreground: 0 0% 98%; --card: 240 10% 3.9%; --card-foreground: 0 0% 98%; --popover: 240 10% 3.9%; --popover-foreground: 0 0% 98%; --primary: 275 100% 25%; --primary-foreground: 0 0% 98%; --secondary: 240 3.7% 15.9%; --secondary-foreground: 0 0% 98%; --muted: 240 3.7% 15.9%; --muted-foreground: 240 5% 64.9%; --accent: 180 100% 25%; --accent-foreground: 0 0% 98%; --destructive: 0 62.8% 30.6%; --destructive-foreground: 0 0% 98%; --border: 240 3.7% 15.9%; --input: 240 3.7% 15.9%; --ring: 275 100% 25%; }
    body { background-color: hsl(var(--background)); color: hsl(var(--foreground)); font-family: sans-serif; }
    .prose { color: hsl(var(--foreground)); max-width: 100% !important; } .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 { color: hsl(var(--foreground)); } .prose a { color: hsl(var(--primary)); } .prose strong { color: hsl(var(--foreground)); } .prose blockquote { color: hsl(var(--muted-foreground)); border-left-color: hsl(var(--border)); } .prose code:not(pre code) { color: hsl(var(--accent-foreground)); background-color: hsl(var(--accent)); padding: 2px 4px; border-radius: 4px; } .prose pre { background-color: #282c34; color: #abb2bf; padding: 1em; border-radius: 8px; overflow-x: auto; } .prose table { width: 100%; } .prose th { background-color: hsl(var(--muted)); } .prose td, .prose th { border: 1px solid hsl(var(--border)); padding: 8px; } hr { border-top-color: hsl(var(--border)); }
    [id] { scroll-margin-top: 80px; }
    #toc-sidebar { transition: right 0.3s ease-in-out; }
    .toc-level-1 { font-weight: bold; } .toc-level-2 { padding-left: 1rem; } .toc-level-3 { padding-left: 2rem; }
  </style>
</head>
<body class="bg-background text-foreground">
  <header class="sticky top-0 z-30 w-full bg-background/80 backdrop-blur-sm border-b">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center h-16">
      <div class="flex items-center gap-2 font-bold text-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-half h-7 w-7"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="M12 22V2"/></svg>
          <span>VulnForce</span>
      </div>
      <div class="flex items-center gap-4">
        <button id="theme-switcher" class="p-2 rounded-md hover:bg-muted">
          <svg id="sun-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
          <svg id="moon-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: none;"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/></svg>
        </button>
        <button id="toc-toggler" class="p-2 rounded-md hover:bg-muted">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </button>
      </div>
    </div>
  </header>
  
  <div class="max-w-7xl mx-auto p-4 md:p-8 flex">
    <main class="flex-1 max-w-4xl">${reportContentRef.current.innerHTML}</main>
    <aside id="toc-sidebar" class="w-72 pl-8 shrink-0 fixed top-20 right-8 h-[calc(100vh-6rem)] transition-all">
      <div class="h-full overflow-y-auto">
        <h3 class="text-lg font-semibold mb-4">Table of Contents</h3>
        <ul class="space-y-2">${tocHtml}</ul>
      </div>
    </aside>
  </div>

  <script>
    const switcher = document.getElementById('theme-switcher');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    const tocToggler = document.getElementById('toc-toggler');
    const tocSidebar = document.getElementById('toc-sidebar');
    const html = document.documentElement;

    switcher.addEventListener('click', () => {
      html.classList.toggle('dark');
      updateIcons();
    });

    let tocOpen = true;
    tocToggler.addEventListener('click', () => {
        tocOpen = !tocOpen;
        tocSidebar.style.display = tocOpen ? 'block' : 'none';
    });

    function updateIcons() {
      if (html.classList.contains('dark')) {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
      } else {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
      }
    }
    updateIcons();
  </script>
</body>
</html>`;
        const blob = new Blob([fullHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${project.name.replace(/ /g, '_')}_report.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
  };
  
  const getSeverityVariant = (severity: string): 'destructive' | 'high' | 'medium' | 'low' | 'secondary' => {
    switch (severity) {
      case 'Critical': return 'destructive';
      case 'High': return 'high';
      case 'Medium': return 'medium';
      case 'Low': return 'low';
      default: return 'secondary';
    }
  }

  if (!project || !client) {
    return null; // or a loading spinner
  }

  const reportLang = project.language;
  const langT = t[reportLang];
  const severityCounts = { Critical: 0, High: 0, Medium: 0, Low: 0, Informational: 0 };
  projectFindings.forEach(f => {
    if (f.severity in severityCounts) {
      severityCounts[f.severity]++;
    }
  });

  return (
    <div className={cn("bg-background text-foreground min-h-screen", theme)}>
      <style jsx global>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          main, .printable-content { scroll-behavior: auto !important; }
          [id] { scroll-margin-top: 0 !important; }
          @page { size: A4; margin: 1.5cm; }
          .break-after-page { page-break-after: always; }
          .print-toc a::after { content: leader('.') target-counter(attr(href), page); }
        }
        html { scroll-behavior: smooth; }
        [id] { scroll-margin-top: 80px; }
        @keyframes flash { 0% { background-color: transparent; } 25% { background-color: hsl(var(--primary) / 0.3); } 100% { background-color: transparent; } }
        .flash-highlight { animation: flash 2s ease-out; }
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

      <div className="max-w-7xl mx-auto p-4 md:p-8 flex flex-row-reverse">
        <aside className={cn("no-print w-72 pl-8 shrink-0 transition-all duration-300", isSidebarOpen ? "block" : "hidden")}>
          <div className="sticky top-20 h-[calc(100vh-6rem)] overflow-y-auto space-y-6">
            {showTodos && (
                <Card>
                  <CardHeader className="flex-row items-center justify-between p-4">
                    <div className="flex items-center gap-2">
                      {todos.length === 0 ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-destructive" />
                      )}
                      <CardTitle className="text-sm font-semibold">{todos.length > 0 ? `${todos.length} ${t[uiLanguage].pending}` : t[uiLanguage].noPendingItems}</CardTitle>
                    </div>
                    {todos.length === 0 && (
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowTodos(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    {todos.length > 0 ? (
                      <ul className="space-y-2 text-sm">
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
            )}
            
            <nav className="space-y-2">
              <p className="font-semibold text-sm px-2">{langT.tableOfContents}</p>
              <ul className="space-y-1">
                {headings.map((heading) => (
                  <li key={heading.id}>
                    <a href={`#${heading.id}`} className={cn("block text-sm rounded-md py-1 hover:text-primary", {
                      'pl-2 font-semibold': heading.level === 1,
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
        
        <main ref={reportContentRef} className={cn("flex-1 transition-all duration-300 printable-content")}>
          <div className="space-y-12">
            <header className="flex justify-between items-start">
              <div>
                <h1 className="font-headline text-4xl font-bold text-primary">{project.name}</h1>
                <p className="text-xl text-muted-foreground">{client?.name}</p>
              </div>
              <Logo />
            </header>

            <section className="print-only">
              <h2 className="font-headline text-2xl font-bold border-b-2 border-primary pb-2 mb-4 mt-12">{langT.tableOfContents}</h2>
              <ul className="list-none space-y-2 print-toc">
                {headings.map((h) => (
                  <li key={`toc-print-${h.id}`} className={cn({
                    'font-bold': h.level === 1,
                    'pl-4': h.level === 2,
                    'pl-8': h.level === 3,
                  })}>
                    <a href={`#${h.id}`}>{h.text}</a>
                  </li>
                ))}
              </ul>
            </section>
            
            <MarkdownPreview content={fullReportContent} getImage={getImage} isReport />

          </div>
        </main>
      </div>
    </div>
  );
}
