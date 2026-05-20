

'use client';
/* eslint-disable @next/next/no-img-element */

import { useParams, useRouter } from 'next/navigation';
import { MarkdownPreview } from '@/components/markdown-preview';
import { Logo } from '@/components/logo';
import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowRight, CheckCircle, ChevronLeft, ChevronRight, Printer, Globe, X, PanelLeft, Sun, Moon } from '@/components/icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useLanguage } from '@/context/language-context';
import { useData } from '@/context/data-context';
import { useUser } from '@/context/user-context';
import type { Finding, Project, Client } from '@/lib/types';
import { cn } from '@/lib/utils';
import { hasTodoMarker, linkifyTodosInMarkdown, replaceTodoMarkers, stripMarkdownText } from '@/lib/todo-utils';
import type { VariableContext } from '@/lib/markdown-utils';

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

type ReportTheme = 'light' | 'dark';

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export default function ReportPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const { language: uiLanguage } = useLanguage();
  const { id: projectId } = params;
  const { projects, clients, findings, getImage } = useData();
  const { user } = useUser();

  const [project, setProject] = useState<Project | undefined>();
  const [client, setClient] = useState<Client | undefined>();
  const [projectFindings, setProjectFindings] = useState<Finding[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [reportTheme, setReportTheme] = useState<ReportTheme>('dark');
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [showTodos, setShowTodos] = useState(true);
  const [activeHeading, setActiveHeading] = useState<string>('');
  
  const reportContentRef = useRef<HTMLDivElement>(null);
  const originalRootClassName = useRef<string | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    originalRootClassName.current = root.className;

    return () => {
      if (originalRootClassName.current !== null) {
        root.className = originalRootClassName.current;
      }
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(reportTheme);
  }, [reportTheme]);

  const t = useMemo(() => ({
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
      showSidebar: 'Show sidebar',
      hideSidebar: 'Hide sidebar',
      downloadDisabledTitle: 'Resolve all pending TODOs to download the report',
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
      showSidebar: 'Mostrar panel',
      hideSidebar: 'Ocultar panel',
      downloadDisabledTitle: 'Resuelve todos los TODO pendientes para descargar el informe',
    },
  }), []);

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
      const initialSidebarOpen = isSidebarOpen ? 'true' : 'false';
      const initialTheme = reportTheme;
      const tocHtml = headings.map(h => `<li class="toc-level-${h.level}"><a href="#${escapeHtml(h.id)}">${escapeHtml(h.text)}</a></li>`).join('');
      const pendingItemsHtml = todos.length > 0
        ? `<section class="sidebar-card pending-card">
            <div class="sidebar-card-title">
              <span class="status-dot status-dot-warning"></span>
              <span>${todos.length} ${escapeHtml(t[reportLang].pending)}</span>
            </div>
            <ul class="pending-list">
              ${todos.map(todo => `
                <li>
                  <a class="pending-link" href="${escapeHtml(todo.link)}">
                    <span class="pending-location">${escapeHtml(todo.location)}</span>
                    <span class="pending-context">"${escapeHtml(todo.context.replace(/\[|\]/g, ''))}"</span>
                  </a>
                </li>
              `).join('')}
            </ul>
          </section>`
        : '';

      const fullHtml = `
<!DOCTYPE html>
<html lang="${reportLang}" class="${initialTheme} scroll-smooth" data-sidebar-open="${initialSidebarOpen}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(project.name)}</title>
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <script>
    tailwind = {
      config: {
        theme: {
          extend: {
            colors: {
              background: 'hsl(var(--background))',
              foreground: 'hsl(var(--foreground))',
              card: 'hsl(var(--card))',
              'card-foreground': 'hsl(var(--card-foreground))',
              border: 'hsl(var(--border))',
              muted: 'hsl(var(--muted))',
              'muted-foreground': 'hsl(var(--muted-foreground))',
              primary: 'hsl(var(--primary))',
              destructive: 'hsl(var(--destructive))'
            },
            fontFamily: {
              body: ['Inter', 'sans-serif'],
              headline: ['Space Grotesk', 'sans-serif'],
              code: ['Source Code Pro', 'monospace']
            }
          }
        }
      }
    };
  </script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500&display=swap');
    :root, .light { --background: 0 0% 98%; --foreground: 222 47% 11%; --card: 0 0% 100%; --card-foreground: 222 47% 11%; --popover: 0 0% 100%; --popover-foreground: 222 47% 11%; --primary: 86 95% 22%; --primary-foreground: 76 100% 5%; --secondary: 210 20% 96%; --secondary-foreground: 222 47% 11%; --muted: 210 20% 96%; --muted-foreground: 215 16% 47%; --accent: 76 100% 55%; --accent-foreground: 76 100% 10%; --destructive: 0 84% 60%; --destructive-foreground: 0 0% 98%; --border: 214 32% 91%; --input: 214 32% 91%; --ring: 86 95% 22%; --code-background: 220 28% 96%; --code-foreground: 222 47% 11%; --code-comment: 215 16% 47%; --code-punctuation: 215 20% 35%; --code-keyword: 258 70% 42%; --code-string: 150 72% 26%; --code-function: 221 83% 40%; --code-number: 24 95% 39%; --code-attr: 197 95% 32%; --code-tag: 0 72% 42%; --code-operator: 222 47% 25%; --code-regex: 330 80% 38%; --code-selection: 220 14% 86%; }
    .dark { --background: 224 71% 4%; --foreground: 210 40% 98%; --card: 224 71% 6%; --card-foreground: 210 40% 98%; --popover: 224 71% 4%; --popover-foreground: 210 40% 98%; --primary: 76 100% 50%; --primary-foreground: 76 100% 5%; --secondary: 220 15% 15%; --secondary-foreground: 210 40% 98%; --muted: 220 15% 15%; --muted-foreground: 215 20% 65%; --accent: 76 100% 55%; --accent-foreground: 76 100% 10%; --destructive: 0 72% 51%; --destructive-foreground: 210 40% 98%; --border: 220 15% 15%; --input: 220 15% 15%; --ring: 76 100% 50%; --code-background: 222 47% 8%; --code-foreground: 210 40% 96%; --code-comment: 215 20% 68%; --code-punctuation: 210 30% 84%; --code-keyword: 272 90% 80%; --code-string: 142 76% 72%; --code-function: 199 89% 76%; --code-number: 36 100% 72%; --code-attr: 185 85% 72%; --code-tag: 0 90% 76%; --code-operator: 210 40% 90%; --code-regex: 330 86% 78%; --code-selection: 224 40% 22%; }
    html { scroll-behavior: smooth; }
    body { background: hsl(var(--background)); color: hsl(var(--foreground)); font-family: 'Inter', sans-serif; }
    h1, h2, h3, h4, h5, h6 { font-family: 'Space Grotesk', sans-serif; }
    pre, code { font-family: 'Source Code Pro', monospace; }
    .app-header { background: hsl(var(--background) / 0.92); border-bottom: 1px solid hsl(var(--border)); backdrop-filter: blur(12px); }
    .app-header-inner { display: flex; align-items: center; justify-content: space-between; gap: 1rem; width: 100%; padding: 0.75rem 1rem; min-height: 4rem; }
    .header-button, .rail-button { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; border: 1px solid hsl(var(--border)); background: hsl(var(--card)); color: hsl(var(--foreground)); border-radius: 0.5rem; min-height: 2.5rem; padding: 0 0.75rem; font-size: 0.875rem; transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease; }
    .header-button:hover, .rail-button:hover { background: hsl(var(--muted)); color: hsl(var(--primary)); }
    .sidebar-mobile-toggle { display: none; }
    .report-layout { display: flex; gap: 1rem; width: 100%; padding: 0.75rem; position: relative; }
    .report-main { flex: 1 1 auto; min-width: 0; background: hsl(var(--card)); border: 1px solid hsl(var(--border)); border-radius: 16px; box-shadow: 0 16px 40px rgb(0 0 0 / 0.14); overflow: hidden; }
    .report-page { padding: 2.25rem 2.5rem; }
    .report-cover { min-height: 620px; background: linear-gradient(180deg, hsl(var(--card)) 0%, hsl(var(--background)) 100%); border-bottom: 1px solid hsl(var(--border)); }
    .prose { color: hsl(var(--foreground)); max-width: 100% !important; font-size: 1rem; line-height: 1.75; }
    .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 { color: hsl(var(--foreground)); scroll-margin-top: 90px; }
    .prose a { color: hsl(var(--primary)); text-decoration-thickness: 1px; text-underline-offset: 3px; }
    .prose a[href*="todo=TODO"], .text-red-500 { color: #ef4444 !important; font-weight: 700; }
    .prose strong { color: hsl(var(--foreground)); }
    .prose blockquote { color: hsl(var(--muted-foreground)); border-left-color: hsl(var(--primary)); background: hsl(var(--muted) / 0.45); padding: 0.5rem 1rem; border-radius: 6px; }
    .prose code:not(pre code) { background-color: hsl(var(--muted)) !important; color: hsl(var(--foreground)) !important; padding: 2px 5px; border-radius: 4px; }
    .prose pre { background-color: hsl(var(--code-background)) !important; color: hsl(var(--code-foreground)) !important; padding: 1em; border-radius: 8px; overflow-x: auto; border: 1px solid hsl(var(--border)); }
    .prose pre[class*="language-"] { background: transparent !important; color: hsl(var(--code-foreground)) !important; border: 0 !important; margin: 0 !important; }
    .prose code[class*="language-"] { color: hsl(var(--code-foreground)) !important; background: transparent !important; }
    .prose table { width: 100%; display: table; }
    .prose th { background-color: hsl(var(--muted)); color: hsl(var(--foreground)); }
    .prose td, .prose th { border: 1px solid hsl(var(--border)); padding: 10px 12px; vertical-align: top; }
    hr { border-top-color: hsl(var(--border)); }
    .prose img { max-width: 100%; height: auto; border-radius: 8px; border: 1px solid hsl(var(--border)); }
    [id] { scroll-margin-top: 80px; }
    #toc-sidebar { width: 19rem; flex: 0 0 19rem; position: sticky; top: 5rem; height: calc(100vh - 6rem); transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out; }
    .sidebar-panel { height: 100%; overflow-y: auto; border: 1px solid hsl(var(--border)); background: hsl(var(--card)); border-radius: 0.75rem; padding: 1rem; box-shadow: 0 8px 30px rgb(0 0 0 / 0.12); }
    html[data-sidebar-open="false"] #toc-sidebar { display: none; }
    html[data-sidebar-open="true"] #sidebar-open-rail { display: none; }
    .sidebar-rail { position: absolute; top: 0.8rem; left: -1rem; z-index: 30; }
    .sidebar-open-rail { position: sticky; top: 5.8rem; align-self: flex-end; z-index: 20; margin-left: -0.25rem; }
    .rail-button { width: 2rem; min-height: 2rem; height: 2rem; padding: 0; border-radius: 999px; box-shadow: 0 8px 20px rgb(0 0 0 / 0.18); }
    .sidebar-heading { margin-bottom: 0.75rem; color: hsl(var(--muted-foreground)); font-size: 0.75rem; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 700; }
    .sidebar-card { border: 1px solid hsl(var(--border)); background: hsl(var(--background) / 0.55); border-radius: 0.75rem; padding: 0.85rem; margin-bottom: 1rem; }
    .sidebar-card-title { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; font-weight: 700; }
    .sidebar-card-copy { margin-top: 0.5rem; color: hsl(var(--muted-foreground)); font-size: 0.875rem; }
    .status-dot { width: 0.55rem; height: 0.55rem; border-radius: 999px; display: inline-block; }
    .status-dot-warning { background: hsl(var(--destructive)); }
    .status-dot-success { background: #22c55e; }
    .pending-list { margin-top: 0.75rem; display: grid; gap: 0.5rem; }
    .pending-link { display: block; border-left: 3px solid hsl(var(--primary)); border-radius: 0 0.45rem 0.45rem 0; padding: 0.65rem 0.75rem; background: hsl(var(--card)); color: inherit; text-decoration: none; }
    .pending-link:hover { background: hsl(var(--muted)); }
    .pending-location { display: block; font-size: 0.85rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .pending-context { display: block; margin-top: 0.2rem; color: hsl(var(--muted-foreground)); font-family: 'Source Code Pro', monospace; font-size: 0.72rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .toc-level-1 { font-weight: bold; } .toc-level-2 { padding-left: 1rem; } .toc-level-3 { padding-left: 2rem; }
    #toc-sidebar a { display: block; padding: 4px 8px; border-radius: 4px; color: inherit; text-decoration: none; transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out; } #toc-sidebar a:hover { background-color: hsl(var(--muted)); color: hsl(var(--primary)); }
    @media (max-width: 1023px) {
      .report-layout { flex-direction: column; padding: 0.75rem; }
      #toc-sidebar { width: 100%; flex-basis: auto; position: static; height: auto; }
      .sidebar-rail, .sidebar-open-rail { display: none; }
      .sidebar-mobile-toggle { display: inline-flex; }
    }
    @media (max-width: 640px) {
      .header-button span { display: none; }
      .report-page { padding: 1.5rem; }
    }
    .hero-summary-row { display: flex; flex-direction: row; flex-wrap: nowrap; gap: 1rem; }
    .hero-summary-cell { flex: 1 1 0; min-width: 0; }
    @media print {
      :root, .light, .dark { --background: 0 0% 100%; --foreground: 222 47% 11%; --card: 0 0% 100%; --card-foreground: 222 47% 11%; --muted: 210 20% 96%; --muted-foreground: 215 16% 47%; --border: 214 32% 91%; --primary: 86 95% 22%; --destructive: 0 84% 60%; --code-background: 220 28% 96%; --code-foreground: 222 47% 11%; --code-comment: 215 16% 47%; --code-punctuation: 215 20% 35%; --code-keyword: 258 70% 42%; --code-string: 150 72% 26%; --code-function: 221 83% 40%; --code-number: 24 95% 39%; --code-attr: 197 95% 32%; --code-tag: 0 72% 42%; --code-operator: 222 47% 25%; --code-regex: 330 80% 38%; --code-selection: 220 14% 86%; }
      html, body { background: white !important; }
      body { color: #0f172a !important; }
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      header, #toc-sidebar, #theme-switcher, #toc-toggler, #sidebar-toggle, #sidebar-rail { display: none !important; }
      @page { size: A4; margin: 0; }
      .report-main { max-width: none !important; border: 0 !important; border-radius: 0 !important; box-shadow: none !important; }
      .report-page { padding: 1.6cm !important; page-break-inside: avoid; break-inside: avoid; }
      .report-cover { min-height: 100vh; border-radius: 0 !important; margin: 0 !important; page-break-before: avoid !important; break-before: avoid !important; }
      .break-after-page { page-break-after: always; }
      .print-toc a::after { content: leader('.') target-counter(attr(href), page); }
      .prose h1, .prose h2, .prose h3, .prose h4 { page-break-after: avoid; break-after: avoid; }
      .prose p, .prose ul, .prose ol, .prose blockquote, .prose pre, .prose table, .prose img, .prose li { page-break-inside: avoid; break-inside: avoid; }
      .report-page, .report-page > section, .report-page > div { page-break-inside: avoid; break-inside: avoid; }
      .hero-summary-row { display: flex !important; flex-direction: row !important; flex-wrap: nowrap !important; gap: 0.5rem !important; }
      .hero-summary-cell { flex: 1 1 0 !important; min-width: 0 !important; }
    }
  </style>
</head>
<body>
  <header class="app-header sticky top-0 z-30 w-full">
    <div class="app-header-inner">
      <div class="flex items-center gap-2 font-bold text-lg" style="font-family: 'Space Grotesk', sans-serif;">
          ${currentClient.logoUrl
            ? `<img src="${currentClient.logoUrl}" alt="${escapeHtml(currentClient.name)} logo" class="h-7 w-auto object-contain" /><span>${escapeHtml(currentClient.name)}</span>`
            : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="hsl(var(--primary))" viewBox="0 0 256 256"><path d="M216,44.45l-80-29.09a23.94,23.94,0,0,0-16,0L40,44.45A24,24,0,0,0,24,67V116.7c0,82,69.41,117.81,90.69,126.74a23.85,23.85,0,0,0,18.62,0C154.59,234.51,224,198.7,224,116.7V67A24,24,0,0,0,216,44.45ZM168,136H136v32a8,8,0,0,1-16,0V136H88a8,8,0,0,1,0-16h32V88a8,8,0,0,1,16,0v32h32a8,8,0,0,1,0,16Z"/></svg><span>VulnForce</span>`}
      </div>
      <div class="flex items-center gap-2">
        <button id="theme-switcher" class="header-button" type="button" aria-label="${initialTheme === 'dark' ? escapeHtml(t[reportLang].lightMode) : escapeHtml(t[reportLang].darkMode)}">
          <svg id="theme-icon-sun" xmlns="http://www.w3.org/2000/svg" class="${initialTheme === 'dark' ? '' : 'hidden'}" width="18" height="18" fill="currentColor" viewBox="0 0 256 256"><path d="M120,40V16a8,8,0,0,1,16,0V40a8,8,0,0,1-16,0Zm72,88a64,64,0,1,1-64-64A64.07,64.07,0,0,1,192,128Zm-16,0a48,48,0,1,0-48,48A48.05,48.05,0,0,0,176,128ZM58.34,69.66A8,8,0,0,0,69.66,58.34l-16-16A8,8,0,0,0,42.34,53.66Zm0,116.68-16,16a8,8,0,0,0,11.32,11.32l16-16a8,8,0,0,0-11.32-11.32ZM192,72a8,8,0,0,0,5.66-2.34l16-16a8,8,0,0,0-11.32-11.32l-16,16A8,8,0,0,0,192,72Zm5.66,114.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32-11.32ZM48,128a8,8,0,0,0-8-8H16a8,8,0,0,0,0,16H40A8,8,0,0,0,48,128Zm80,80a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V216A8,8,0,0,0,128,208Zm112-88H216a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16Z"/></svg>
          <svg id="theme-icon-moon" xmlns="http://www.w3.org/2000/svg" class="${initialTheme === 'dark' ? 'hidden' : ''}" width="18" height="18" fill="currentColor" viewBox="0 0 256 256"><path d="M233.54,142.23a8,8,0,0,0-8-2,88.08,88.08,0,0,1-109.8-109.8,8,8,0,0,0-10-10,104.84,104.84,0,0,0-52.91,37A104,104,0,0,0,136,224a104.84,104.84,0,0,0,83.09-41.18,104.47,104.47,0,0,0,16.45-32.59A8,8,0,0,0,233.54,142.23ZM206.85,173.4A88,88,0,1,1,82.6,49.15,104.09,104.09,0,0,0,206.85,173.4Z"/></svg>
          <span id="theme-label">${initialTheme === 'dark' ? escapeHtml(t[reportLang].lightMode) : escapeHtml(t[reportLang].darkMode)}</span>
        </button>
        <button id="sidebar-toggle" class="header-button sidebar-mobile-toggle" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM40,56H88V200H40ZM216,200H104V56H216V200Z"/></svg>
          <span>${escapeHtml(t[reportLang].tableOfContents)}</span>
        </button>
      </div>
    </div>
  </header>
  <div class="report-layout">
    <main class="report-main">${reportContentRef.current.innerHTML}</main>
    <aside id="toc-sidebar" class="no-print">
      <div id="sidebar-rail" class="sidebar-rail no-print">
        <button id="sidebar-rail-toggle" class="rail-button" type="button" aria-label="${escapeHtml(t[reportLang].hideSidebar)}">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 256 256"><path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"/></svg>
        </button>
      </div>
      <div class="sidebar-panel">
        ${pendingItemsHtml}
        <h3 class="sidebar-heading">${escapeHtml(t[reportLang].tableOfContents)}</h3>
        <ul class="space-y-2 text-sm">${tocHtml}</ul>
      </div>
    </aside>
    <div id="sidebar-open-rail" class="sidebar-open-rail no-print">
      <button id="sidebar-open-toggle" class="rail-button" type="button" aria-label="${escapeHtml(t[reportLang].showSidebar)}">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 256 256"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM40,56H88V200H40ZM216,200H104V56H216V200Z"/></svg>
      </button>
    </div>
  </div>

  <script>
    const root = document.documentElement;
    const sidebarToggles = [document.getElementById('sidebar-toggle'), document.getElementById('sidebar-rail-toggle'), document.getElementById('sidebar-open-toggle')].filter(Boolean);
    const themeSwitcher = document.getElementById('theme-switcher');
    const themeLabel = document.getElementById('theme-label');
    const themeSun = document.getElementById('theme-icon-sun');
    const themeMoon = document.getElementById('theme-icon-moon');
    const lightLabel = ${JSON.stringify(t[reportLang].lightMode)};
    const darkLabel = ${JSON.stringify(t[reportLang].darkMode)};
    const showSidebarLabel = ${JSON.stringify(t[reportLang].showSidebar)};
    const hideSidebarLabel = ${JSON.stringify(t[reportLang].hideSidebar)};

    function setSidebarOpen(open) {
      root.dataset.sidebarOpen = open ? 'true' : 'false';
      sidebarToggles.forEach((button) => button.setAttribute('aria-label', open ? hideSidebarLabel : showSidebarLabel));
    }

    function setTheme(theme) {
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
      const isDark = theme === 'dark';
      themeSun?.classList.toggle('hidden', !isDark);
      themeMoon?.classList.toggle('hidden', isDark);
      if (themeLabel) themeLabel.textContent = isDark ? lightLabel : darkLabel;
      themeSwitcher?.setAttribute('aria-label', isDark ? lightLabel : darkLabel);
    }

    sidebarToggles.forEach((button) => {
      button.addEventListener('click', () => setSidebarOpen(root.dataset.sidebarOpen !== 'true'));
    });

    themeSwitcher?.addEventListener('click', () => {
      setTheme(root.classList.contains('dark') ? 'light' : 'dark');
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
  const themeToggleLabel = reportTheme === 'dark' ? t[uiLanguage].lightMode : t[uiLanguage].darkMode;
  const sidebarToggleLabel = isSidebarOpen ? t[uiLanguage].hideSidebar : t[uiLanguage].showSidebar;
  const clientLogo = client.logoUrl ? (
    <img src={client.logoUrl} alt={`${client.name} logo`} className="h-16 max-w-[220px] rounded-md object-contain" />
  ) : (
    <Logo />
  );

  return (
    <div className="report-shell bg-slate-50 text-slate-900 min-h-screen">
      <style jsx global>{`
        @media print {
          :root, .light, .dark {
            --background: 0 0% 100%;
            --foreground: 222 47% 11%;
            --card: 0 0% 100%;
            --card-foreground: 222 47% 11%;
            --muted: 210 20% 96%;
            --muted-foreground: 215 16% 47%;
            --border: 214 32% 91%;
            --primary: 76 100% 40%;
            --code-background: 220 28% 96%;
            --code-foreground: 222 47% 11%;
            --code-comment: 215 16% 47%;
            --code-punctuation: 215 20% 35%;
            --code-keyword: 258 70% 42%;
            --code-string: 150 72% 26%;
            --code-function: 221 83% 40%;
            --code-number: 24 95% 39%;
            --code-attr: 197 95% 32%;
            --code-tag: 0 72% 42%;
            --code-operator: 222 47% 25%;
            --code-regex: 330 80% 38%;
            --code-selection: 220 14% 86%;
          }
          html, body { background: white !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          main, .printable-content { scroll-behavior: auto !important; max-width: none !important; border: 0 !important; border-radius: 0 !important; box-shadow: none !important; }
          [id] { scroll-margin-top: 0 !important; }
          @page { size: A4; margin: 0; }
          .report-page { padding: 1.6cm !important; page-break-inside: avoid; break-inside: avoid; }
          .report-cover { min-height: 100vh; border-radius: 0 !important; margin: 0 !important; page-break-before: avoid !important; break-before: avoid !important; }
          .break-after-page { page-break-after: always; }
          .print-toc a::after { content: leader('.') target-counter(attr(href), page); }
          .prose h1, .prose h2, .prose h3, .prose h4 { page-break-after: avoid; break-after: avoid; }
          .prose p, .prose ul, .prose ol, .prose blockquote, .prose pre, .prose table, .prose img, .prose li { page-break-inside: avoid; break-inside: avoid; }
          .report-page, .report-page > section, .report-page > div { page-break-inside: avoid; break-inside: avoid; }
          .hero-summary-row { display: flex !important; flex-direction: row !important; flex-wrap: nowrap !important; gap: 0.5rem !important; }
          .hero-summary-cell { flex: 1 1 0 !important; min-width: 0 !important; }
        }
        .hero-summary-row { display: flex; flex-direction: row; flex-wrap: nowrap; }
        .hero-summary-cell { flex: 1 1 0; min-width: 0; }
        html { scroll-behavior: smooth; }
        [id] { scroll-margin-top: 80px; }
        @keyframes flash { 0% { background-color: transparent; } 25% { background-color: hsl(var(--primary) / 0.3); } 100% { background-color: transparent; } }
        .flash-highlight { animation: flash 2s ease-out; }
        .prose { line-height: 1.75; }
        .prose a[href*="todo=TODO"] { color: #ef4444 !important; font-weight: 700; }
        .prose code:not(pre code) { color: hsl(var(--foreground)) !important; }
        .prose pre[class*="language-"] { background: transparent !important; color: hsl(var(--code-foreground)) !important; border: 0 !important; margin: 0 !important; }
        .prose code[class*="language-"] { color: hsl(var(--code-foreground)) !important; background: transparent !important; }
        .prose blockquote { background: hsl(var(--muted) / 0.4); border-left-color: hsl(var(--primary)); border-radius: 6px; padding: 0.5rem 1rem; }
        .prose th { color: hsl(var(--foreground)); }
        .report-shell { background: hsl(var(--background)); color: hsl(var(--foreground)); }
        .report-main { background: hsl(var(--card)); border: 1px solid hsl(var(--border)); box-shadow: 0 16px 40px rgb(0 0 0 / 0.14); }
        .report-cover { background: linear-gradient(180deg, hsl(var(--card)) 0%, hsl(var(--background)) 100%); }
      `}</style>
      
      <header className="sticky top-0 z-30 w-full bg-background/90 backdrop-blur-sm border-b no-print">
        <div className="w-full px-3 sm:px-4 lg:px-5 py-3 flex justify-between items-center min-h-16 gap-3">
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
                <Button variant="outline" size="icon" onClick={() => setReportTheme((value) => value === 'dark' ? 'light' : 'dark')} aria-label={themeToggleLabel} title={themeToggleLabel}>
                  {reportTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="icon" onClick={() => setIsSidebarOpen((value) => !value)} aria-label={sidebarToggleLabel} title={sidebarToggleLabel} className="lg:hidden">
                  <PanelLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDownloadHTML}
                  disabled={todos.length > 0}
                  title={todos.length > 0 ? t[uiLanguage].downloadDisabledTitle : undefined}
                >
                    <Globe className="mr-2 h-4 w-4" />
                    {t[uiLanguage].downloadHTML}
                </Button>
                <Button
                  disabled={todos.length > 0}
                  onClick={handlePrint}
                  title={todos.length > 0 ? t[uiLanguage].downloadDisabledTitle : undefined}
                >
                  <Printer className="mr-2 h-4 w-4" />
                  {t[uiLanguage].downloadPDF}
                </Button>
            </div>
        </div>
      </header>

      <div className="w-full max-w-none px-2 py-3 sm:px-3 lg:px-4 flex flex-col lg:flex-row gap-3 lg:gap-4">
        <main className="report-main flex-1 min-w-0 transition-all duration-300 printable-content overflow-hidden rounded-xl order-1">
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

            <section className="report-page hero-summary px-8 md:px-12">
              <div className="hero-summary-row flex flex-row flex-nowrap gap-4">
                <div className="hero-summary-cell flex-1 min-w-0 rounded-lg border bg-muted/30 p-5">
                  <p className="text-sm text-muted-foreground truncate">{langT.totalFindings}</p>
                  <p className="mt-2 text-4xl font-bold text-primary">{projectFindings.length}</p>
                </div>
                {severityOrder.map(severity => (
                  <div key={severity} className="hero-summary-cell flex-1 min-w-0 rounded-lg border bg-background p-5">
                    <p className="text-sm text-muted-foreground truncate">{langT[severity.toLowerCase() as keyof typeof langT]}</p>
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
              <MarkdownPreview
                content={fullReportContent}
                getImage={getImage}
                isReport
                variables={{
                  client: { name: client?.name, contact: client?.contact, phone: client?.phone },
                  project: { name: project.name, startDate: project.startDate, endDate: project.endDate, language: project.language },
                  pentester: { name: user.name, email: user.email, phone: user.phone },
                } as VariableContext}
              />
            </section>

          </div>
        </main>
        {!isSidebarOpen && (
        <div className="no-print hidden lg:block lg:sticky lg:top-20 lg:z-20 lg:h-8 lg:shrink-0 -ml-1 order-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
            aria-label={sidebarToggleLabel}
            title={sidebarToggleLabel}
            className="h-8 w-8 rounded-full bg-background/95 shadow-md"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
        </div>
        )}
        <aside className={cn("no-print relative w-full lg:w-80 lg:shrink-0 transition-all order-3", isSidebarOpen ? "block" : "hidden")}>
          <div className="relative lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)]">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsSidebarOpen(false)}
              aria-label={sidebarToggleLabel}
              title={sidebarToggleLabel}
              className="absolute -left-4 top-3 z-30 hidden h-8 w-8 rounded-full bg-background/95 shadow-md lg:inline-flex"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          <div className="h-full overflow-y-auto space-y-6 rounded-xl border border-border bg-card p-4 shadow-sm">
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
          </div>
        </aside>
      </div>
    </div>
  );
}
