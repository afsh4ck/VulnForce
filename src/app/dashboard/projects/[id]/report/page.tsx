

'use client';
/* eslint-disable @next/next/no-img-element */

import { useParams, useRouter } from 'next/navigation';
import { MarkdownPreview } from '@/components/markdown-preview';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Logo } from '@/components/logo';
import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowRight, CheckCircle, ChevronLeft, Printer, Globe, X, PanelLeft } from '@/components/icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useLanguage } from '@/context/language-context';
import { useData } from '@/context/data-context';
import type { Finding, Project, Client } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { hasTodoMarker, linkifyTodosInMarkdown, replaceTodoMarkers, stripMarkdownText } from '@/lib/todo-utils';

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

  const [project, setProject] = useState<Project | undefined>();
  const [client, setClient] = useState<Client | undefined>();
  const [projectFindings, setProjectFindings] = useState<Finding[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [showTodos, setShowTodos] = useState(true);
  const [activeHeading, setActiveHeading] = useState<string>('');
  
  const reportContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const originalClassName = root.className;
    root.className = 'light';

    return () => {
      root.className = originalClassName;
    };
  }, []);

  const t = {
    en: {
      findingsSummary: 'Findings Summary',
      tableOfContents: 'Table of Contents',
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
      reportType: 'Security Assessment Report',
      generatedOn: 'Generated on',
      assessmentWindow: 'Assessment window',
      client: 'Client',
      totalFindings: 'Total findings',
    },
    es: {
      findingsSummary: 'Resumen de Hallazgos',
      tableOfContents: 'Índice de Contenidos',
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
      reportType: 'Informe de Evaluación de Seguridad',
      generatedOn: 'Generado el',
      assessmentWindow: 'Ventana de evaluación',
      client: 'Cliente',
      totalFindings: 'Hallazgos totales',
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

  const fullReportContent = useMemo(() => {
    if (!project || !client) return '';

    const reportLang = project.language;
    const langT = t[reportLang];
    const projectTodoHref = (_todoText: string, sectionTitle: string) => {
      const params = new URLSearchParams({
        tab: 'content',
        todo: 'TODO',
        section: sectionTitle,
      });
      return `/dashboard/projects/${projectId}?${params.toString()}`;
    };

    const findingTodoHref = (findingId: string, sectionTitle: string) => {
      const params = new URLSearchParams({
        todo: 'TODO',
        section: sectionTitle,
      });
      return `/dashboard/projects/${projectId}/findings/${findingId}?${params.toString()}`;
    };

    const mainContent = linkifyTodosInMarkdown(
      project.reportBody || '',
      (marker, sectionTitle) => projectTodoHref(marker.detail, sectionTitle),
      langT.scope
    );

    const findingsContent = projectFindings
      .sort((a, b) => b.cvss - a.cvss)
      .map(f => {
        const findingMarkdown = linkifyTodosInMarkdown(
          f.markdown,
          (_marker, sectionTitle) => findingTodoHref(f.id, sectionTitle),
          f.title
        );
        return `## ${f.title} [SEVERITY:${f.severity},CVSS:${f.cvss.toFixed(1)}] {#finding-${f.id}}\n${findingMarkdown}`;
      })
      .join('\n\n');

    const findingsSection = `\n\n# ${langT.findings}\n\n${findingsContent}`;

    return `${mainContent}${findingsSection}`;
  }, [project, client, projectFindings, projectId, t]);

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
    if (reportContentRef.current) {
        const headingElements = reportContentRef.current.querySelectorAll('h1, h2, h3');
        const newHeadings: Heading[] = [];
        headingElements.forEach(heading => {
            if (heading.id) {
                newHeadings.push({
                    level: parseInt(heading.tagName.substring(1)),
                    text: heading.textContent || '',
                    id: heading.id
                });
            }
        });
        setHeadings(newHeadings);
    }
    
    const handleScroll = () => {
      if (!reportContentRef.current) return;
      
      const headingElements = Array.from(
        reportContentRef.current.querySelectorAll('h1, h2, h3')
      ) as HTMLElement[];
      
      let currentActiveHeadingId = '';
      
      for (let i = headingElements.length - 1; i >= 0; i--) {
        const heading = headingElements[i];
        const rect = heading.getBoundingClientRect();
        
        if (rect.top <= 100) { // 100px offset from the top
          currentActiveHeadingId = heading.id;
          break;
        }
      }
      
      setActiveHeading(currentActiveHeadingId);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [fullReportContent]); 


  const todos = useMemo(() => {
    if (!project) return [];
    
    const reportLang = project.language;
    const langT = t[reportLang];
    
    const foundTodos: TodoItem[] = [];
    const todoContext = (line: string) => replaceTodoMarkers(line, marker => marker.display).trim();
    const projectTodoLink = (sectionTitle: string) => {
      const params = new URLSearchParams({ tab: 'content', todo: 'TODO', section: sectionTitle });
      return `/dashboard/projects/${projectId}?${params.toString()}`;
    };
    const findingTodoLink = (findingId: string, sectionTitle: string) => {
      const params = new URLSearchParams({ todo: 'TODO', section: sectionTitle });
      return `/dashboard/projects/${projectId}/findings/${findingId}?${params.toString()}`;
    };
  
    if (project.reportBody) {
      let currentSectionTitle = langT.scope;
      project.reportBody.split('\n').forEach((line) => {
        const headingMatch = line.match(/^#{1,6}\s+(.+)$/);
        if (headingMatch) {
          currentSectionTitle = stripMarkdownText(headingMatch[1]) || currentSectionTitle;
        }

        if (hasTodoMarker(line)) {
          foundTodos.push({
            location: currentSectionTitle,
            context: todoContext(line),
            link: projectTodoLink(currentSectionTitle),
          });
        }
      });
    }

    projectFindings.forEach(finding => {
      let currentSectionTitle = finding.title;
      finding.markdown.split('\n').forEach((line) => {
        const headingMatch = line.match(/^#{1,6}\s+(.+)$/);
        if (headingMatch) {
          currentSectionTitle = stripMarkdownText(headingMatch[1]) || currentSectionTitle;
        }

        if (hasTodoMarker(line)) {
          foundTodos.push({
            location: `${langT.finding}: ${currentSectionTitle}`,
            context: todoContext(line),
            link: findingTodoLink(finding.id, currentSectionTitle),
          });
        }
      });
    });
  
    return foundTodos;
  }, [project, projectFindings, projectId, t]);
  
  const handlePrint = () => {
    const originalTheme = document.documentElement.className;
    document.documentElement.className = 'light';
    setTimeout(() => {
      window.print();
      document.documentElement.className = originalTheme;
    }, 250);
  };
  
  const handleDownloadHTML = () => {
    if (reportContentRef.current && project && client) {
      const currentClient = client;
      const reportLang = project.language;
      const tocHtml = headings.map(h => `<li class="toc-level-${h.level}"><a href="#${h.id}">${h.text}</a></li>`).join('');

      const fullHtml = `
<!DOCTYPE html>
<html lang="${reportLang}" class="dark scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.name}</title>
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500&display=swap');
    :root { --background: 0 0% 98%; --foreground: 222 47% 11%; --card: 0 0% 100%; --card-foreground: 222 47% 11%; --popover: 0 0% 100%; --popover-foreground: 222 47% 11%; --primary: 76 100% 40%; --primary-foreground: 76 100% 5%; --secondary: 210 20% 96%; --secondary-foreground: 222 47% 11%; --muted: 210 20% 96%; --muted-foreground: 215 16% 47%; --accent: 76 100% 55%; --accent-foreground: 76 100% 10%; --destructive: 0 84% 60%; --destructive-foreground: 0 0% 98%; --border: 214 32% 91%; --input: 214 32% 91%; --ring: 76 100% 40%; }
    .dark { --background: 0 0% 98%; --foreground: 222 47% 11%; --card: 0 0% 100%; --card-foreground: 222 47% 11%; --popover: 0 0% 100%; --popover-foreground: 222 47% 11%; --primary: 76 100% 40%; --primary-foreground: 76 100% 5%; --secondary: 210 20% 96%; --secondary-foreground: 222 47% 11%; --muted: 210 20% 96%; --muted-foreground: 215 16% 47%; --accent: 76 100% 55%; --accent-foreground: 76 100% 10%; --destructive: 0 84% 60%; --destructive-foreground: 0 0% 98%; --border: 214 32% 91%; --input: 214 32% 91%; --ring: 76 100% 40%; }
    html { scroll-behavior: smooth; }
    body { background: #f8fafc; color: #0f172a; font-family: 'Inter', sans-serif; }
    h1, h2, h3, h4, h5, h6 { font-family: 'Space Grotesk', sans-serif; }
    pre, code { font-family: 'Source Code Pro', monospace; }
    .report-main { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 16px 40px rgb(15 23 42 / 0.08); overflow: hidden; }
    .report-page { padding: 2.25rem 2.5rem; }
    .report-cover { min-height: 620px; background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%); border-bottom: 1px solid #e2e8f0; }
    .prose { color: #0f172a; max-width: 100% !important; font-size: 1rem; line-height: 1.75; }
    .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 { color: #0f172a; scroll-margin-top: 90px; }
    .prose a { color: hsl(var(--primary)); text-decoration-thickness: 1px; text-underline-offset: 3px; }
    .prose a[href*="todo=TODO"], .text-red-500 { color: #ef4444 !important; font-weight: 700; }
    .prose strong { color: #0f172a; }
    .prose blockquote { color: #475569; border-left-color: hsl(var(--primary)); background: #f8fafc; padding: 0.5rem 1rem; border-radius: 6px; }
    .prose code:not(pre code) { background-color: #e2e8f0 !important; color: #0f172a !important; padding: 2px 5px; border-radius: 4px; }
    .prose pre { background-color: #f8fafc !important; color: #0f172a !important; padding: 1em; border-radius: 8px; overflow-x: auto; border: 1px solid #e2e8f0; }
    .prose table { width: 100%; display: table; }
    .prose th { background-color: #f8fafc; color: #0f172a; }
    .prose td, .prose th { border: 1px solid #e2e8f0; padding: 10px 12px; vertical-align: top; }
    hr { border-top-color: #e2e8f0; }
    .prose img { max-width: 100%; height: auto; border-radius: 8px; border: 1px solid #e2e8f0; }
    [id] { scroll-margin-top: 80px; }
    #toc-sidebar { transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out; }
    .toc-level-1 { font-weight: bold; } .toc-level-2 { padding-left: 1rem; } .toc-level-3 { padding-left: 2rem; }
    #toc-sidebar a { display: block; padding: 4px 8px; border-radius: 4px; transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out; } #toc-sidebar a:hover { background-color: #f1f5f9; color: hsl(var(--primary)); }
    @media print {
      html, body { background: white !important; }
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      header, #toc-sidebar, #theme-switcher, #toc-toggler, #sidebar-toggle { display: none !important; }
      @page { size: A4; margin: 0; }
      .report-main { max-width: none !important; border: 0 !important; border-radius: 0 !important; box-shadow: none !important; }
      .report-page { padding: 1.6cm !important; page-break-inside: avoid; }
      .report-cover { min-height: 100vh; border-radius: 0 !important; margin: 0 !important; }
      .break-after-page { page-break-after: always; }
      .print-header { display: flex !important; position: fixed; top: 0; left: 0; right: 0; z-index: 50; align-items: center; justify-content: space-between; gap: 1rem; padding: 0.9cm 1.4cm; background: white; border-bottom: 1px solid #e2e8f0; }
      .print-header-spacer { display: block !important; height: 2.2cm; }
      .print-toc a::after { content: leader('.') target-counter(attr(href), page); }
    }
  </style>
</head>
<body class="bg-slate-50 text-slate-900">
  <header class="sticky top-0 z-30 w-full bg-white/90 backdrop-blur-sm border-b border-border">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center h-16">
      <div class="flex items-center gap-2 font-bold text-lg" style="font-family: 'Space Grotesk', sans-serif;">
          ${currentClient.logoUrl ? `<img src="${currentClient.logoUrl}" alt="${currentClient.name} logo" class="h-7 w-auto object-contain" />` : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="hsl(var(--primary))" viewBox="0 0 256 256"><path d="M216,44.45l-80-29.09a23.94,23.94,0,0,0-16,0L40,44.45A24,24,0,0,0,24,67V116.7c0,82,69.41,117.81,90.69,126.74a23.85,23.85,0,0,0,18.62,0C154.59,234.51,224,198.7,224,116.7V67A24,24,0,0,0,216,44.45ZM168,136H136v32a8,8,0,0,1-16,0V136H88a8,8,0,0,1,0-16h32V88a8,8,0,0,1,16,0v32h32a8,8,0,0,1,0,16Z"/></svg>`}
          <span>${currentClient.name}</span>
      </div>
      <div class="flex items-center gap-2">
        <button id="sidebar-toggle" class="inline-flex items-center gap-2 rounded-md border border-border bg-white px-3 py-2 text-sm hover:bg-muted md:hidden">
          <span>${t[reportLang].tableOfContents}</span>
        </button>
      </div>
    </div>
  </header>
  <div class="print-header hidden">
    <div class="flex items-center gap-3">
      ${currentClient.logoUrl ? `<img src="${currentClient.logoUrl}" alt="${currentClient.name} logo" class="h-8 w-auto object-contain" />` : `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="hsl(var(--primary))" viewBox="0 0 256 256"><path d="M216,44.45l-80-29.09a23.94,23.94,0,0,0-16,0L40,44.45A24,24,0,0,0,24,67V116.7c0,82,69.41,117.81,90.69,126.74a23.85,23.85,0,0,0,18.62,0C154.59,234.51,224,198.7,224,116.7V67A24,24,0,0,0,216,44.45ZM168,136H136v32a8,8,0,0,1-16,0V136H88a8,8,0,0,1,0-16h32V88a8,8,0,0,1,16,0v32h32a8,8,0,0,1,0,16Z"/></svg>`}
      <div>
        <div class="text-sm font-semibold">VulnForce</div>
        <div class="text-xs text-slate-500">${project.name}</div>
      </div>
    </div>
  </div>
  <div class="print-header-spacer hidden"></div>
  <div class="max-w-7xl mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8 relative">
    <aside id="toc-sidebar" class="no-print ${isSidebarOpen ? 'lg:block' : 'hidden'} w-full lg:w-72 lg:shrink-0 lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)]">
      <div class="rounded-xl border border-border bg-white p-4 shadow-sm h-full overflow-y-auto">
        <div class="flex items-center justify-between gap-3 mb-4">
          <h3 class="text-sm font-semibold uppercase tracking-wide text-slate-500">${t[reportLang].tableOfContents}</h3>
        </div>
        <ul class="space-y-2 text-sm">${tocHtml}</ul>
      </div>
    </aside>
    <main class="report-main flex-1 min-w-0 p-6 md:p-8 lg:p-10">${reportContentRef.current.innerHTML}</main>
  </div>

  <script>
    const tocToggler = document.getElementById('sidebar-toggle');
    const tocSidebar = document.getElementById('toc-sidebar');

    let tocOpen = false;
    tocToggler.addEventListener('click', () => {
        tocOpen = !tocOpen;
        if (tocSidebar) {
          tocSidebar.style.display = tocOpen ? 'block' : 'none';
      }
    });
  </script>
</body>
</html>`;
        const blob = new Blob([fullHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report-${project.name.replace(/\s+/g, '_')}-${new Date().toISOString().split('T')[0]}.html`;
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
  const severityCounts = { Critical: 0, High: 0, Medium: 0, Low: 0, Informational: 0 };
  projectFindings.forEach(f => {
    if (f.severity in severityCounts) {
      severityCounts[f.severity]++;
    }
  });
  const severityOrder = ['Critical', 'High', 'Medium', 'Low', 'Informational'] as const;
  const generatedDate = new Date().toLocaleDateString(reportLang === 'es' ? 'es-ES' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const assessmentWindow = `${project.startDate} - ${project.endDate}`;
  const clientLogo = client.logoUrl ? (
    <img src={client.logoUrl} alt={`${client.name} logo`} className="h-16 max-w-[220px] rounded-md object-contain" />
  ) : (
    <Logo />
  );

  return (
    <div className="report-shell bg-slate-50 text-slate-900 min-h-screen">
      <style jsx global>{`
        @media print {
          html, body { background: white !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          main, .printable-content { scroll-behavior: auto !important; max-width: none !important; border: 0 !important; border-radius: 0 !important; box-shadow: none !important; }
          [id] { scroll-margin-top: 0 !important; }
          @page { size: A4; margin: 0; }
          .report-page { padding: 1.6cm !important; page-break-inside: avoid; }
          .report-cover { min-height: 100vh; border-radius: 0 !important; margin: 0 !important; }
          .break-after-page { page-break-after: always; }
          .print-toc a::after { content: leader('.') target-counter(attr(href), page); }
        }
        html { scroll-behavior: smooth; }
        [id] { scroll-margin-top: 80px; }
        @keyframes flash { 0% { background-color: transparent; } 25% { background-color: hsl(var(--primary) / 0.3); } 100% { background-color: transparent; } }
        .flash-highlight { animation: flash 2s ease-out; }
        .prose { line-height: 1.75; }
        .prose a[href*="todo=TODO"] { color: #ef4444 !important; font-weight: 700; }
        .prose code:not(pre code) { color: hsl(var(--foreground)) !important; }
        .prose blockquote { background: hsl(var(--muted) / 0.4); border-left-color: hsl(var(--primary)); border-radius: 6px; padding: 0.5rem 1rem; }
        .prose th { color: hsl(var(--foreground)); }
        .report-shell { background: #f8fafc; }
        .report-cover { background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%); }
      `}</style>
      
      <header className="sticky top-0 z-30 w-full bg-white/90 backdrop-blur-sm border-b no-print">
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
                <Button variant="outline" size="icon" onClick={() => setIsSidebarOpen((value) => !value)} className="hidden md:inline-flex">
                  <PanelLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={handleDownloadHTML}>
                    <Globe className="mr-2 h-4 w-4" />
                    {t[uiLanguage].downloadHTML}
                </Button>
                <Button disabled={todos.length > 0} onClick={handlePrint}>
                  <Printer className="mr-2 h-4 w-4" />
                  {t[uiLanguage].downloadPDF}
                </Button>
            </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8">
        <aside className={cn("no-print w-full lg:w-72 lg:shrink-0", isSidebarOpen ? "block" : "hidden")}>
          <div className="h-full overflow-y-auto space-y-6 rounded-xl border border-border bg-white p-4 shadow-sm lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)]">
            {showTodos && todos.length > 0 && (
                <Card>
                  <CardHeader className="flex-row items-center justify-between p-4">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-destructive" />
                        <CardTitle className="text-sm font-semibold">{todos.length} {t[uiLanguage].pending}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
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
                  </CardContent>
                </Card>
            )}
             {showTodos && todos.length === 0 && (
                <Card>
                    <CardHeader className="flex-row items-center justify-between p-4">
                        <div className="flex items-center gap-2">
                           <CheckCircle className="h-5 w-5 text-green-500" />
                           <CardTitle className="text-sm font-semibold">{t[uiLanguage].noPendingItems}</CardTitle>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowTodos(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                     <CardContent className="p-4 pt-0">
                         <p className="text-sm text-muted-foreground">{t[uiLanguage].readyToExport}</p>
                    </CardContent>
                </Card>
             )}
            
            <nav className="space-y-2">
              <p className="font-normal text-xs text-muted-foreground px-2 mb-2">{langT.tableOfContents}</p>
              <ul className="space-y-1">
                {headings.map((heading) => (
                  <li key={heading.id}>
                    <a 
                      href={`#${heading.id}`} 
                      className={cn("block text-sm rounded-md py-1 px-2 hover:bg-muted hover:text-primary transition-colors", {
                      'font-semibold': heading.level <= 2,
                      'text-primary': heading.id === activeHeading,
                      'pl-4': heading.level === 2,
                      'pl-8 text-xs': heading.level === 3,
                    })}>
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>
        
        <main className="report-main flex-1 min-w-0 transition-all duration-300 printable-content overflow-hidden rounded-xl">
          <div className="space-y-12" ref={reportContentRef}>
            <header className="report-cover report-page break-after-page flex min-h-[620px] flex-col justify-between border-b p-8 md:p-12">
              <div className="flex items-start justify-between gap-8">
                <div className="space-y-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{langT.reportType}</p>
                  <div>
                    <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground md:text-6xl">{project.name}</h1>
                    <p className="mt-3 text-xl text-muted-foreground">{client.name}</p>
                  </div>
                </div>
                <div className="flex min-w-[160px] justify-end">{clientLogo}</div>
              </div>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-lg border bg-background/70 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{langT.client}</p>
                  <p className="mt-1 font-semibold">{client.name}</p>
                </div>
                <div className="rounded-lg border bg-background/70 p-4 md:col-span-2">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{langT.assessmentWindow}</p>
                  <p className="mt-1 font-semibold">{assessmentWindow}</p>
                </div>
                <div className="rounded-lg border bg-background/70 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{langT.generatedOn}</p>
                  <p className="mt-1 font-semibold">{generatedDate}</p>
                </div>
              </div>
            </header>

            <section className="report-page px-8 md:px-12">
              <div className="grid gap-4 md:grid-cols-6">
                <div className="rounded-lg border bg-muted/30 p-5 md:col-span-2">
                  <p className="text-sm text-muted-foreground">{langT.totalFindings}</p>
                  <p className="mt-2 text-4xl font-bold text-primary">{projectFindings.length}</p>
                </div>
                {severityOrder.map(severity => (
                  <div key={severity} className="rounded-lg border bg-background p-5">
                    <p className="text-sm text-muted-foreground">{langT[severity.toLowerCase() as keyof typeof langT]}</p>
                    <p className="mt-2 text-3xl font-semibold">{severityCounts[severity]}</p>
                  </div>
                ))}
              </div>
            </section>
            
            <section className="report-page hidden break-after-page print:block">
              <h1 className="font-headline text-2xl font-bold border-b-2 border-primary pb-2 mb-4 mt-12">{langT.tableOfContents}</h1>
              <ul className="list-none space-y-2 print-toc">
                {headings.map((h) => (
                  <li key={`toc-print-${h.id}`} className={cn({
                    'font-bold text-lg': h.level === 1,
                    'pl-4': h.level === 2,
                    'pl-8 text-sm': h.level === 3,
                  })}>
                    <a href={`#${h.id}`}>{h.text}</a>
                  </li>
                ))}
              </ul>
            </section>
            
            <section className="report-page px-8 pb-10 md:px-12">
              <MarkdownPreview content={fullReportContent} getImage={getImage} isReport />
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}
