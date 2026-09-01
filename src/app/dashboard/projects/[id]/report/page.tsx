'use client';
/* eslint-disable @next/next/no-img-element */

import { useParams, useRouter } from 'next/navigation';
import { MarkdownPreview } from '@/components/markdown-preview';
import { Logo } from '@/components/logo';
import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Printer,
  Globe,
  X,
  PanelLeft,
  FileText,
  FileDown,
  Palette,
  Sun,
  Moon,
} from '@/components/icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemePreview } from '@/components/theme-preview';
import Link from 'next/link';
import { useLanguage } from '@/context/language-context';
import { useTheme } from '@/context/theme-context';
import { useData } from '@/context/data-context';
import { useUser } from '@/context/user-context';
import type { Finding, Project, Client, Severity, PentesterProfile } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  hasTodoMarker,
  linkifyTodosInMarkdown,
  replaceTodoMarkers,
  stripMarkdownText,
} from '@/lib/todo-utils';
import type { VariableContext } from '@/lib/markdown-utils';
import {
  REPORT_SHARED_CSS,
  REPORT_PRINT_CSS,
  buildReportHtmlStyles,
} from '@/lib/report-styles';
import { buildReportMarkdown } from '@/lib/report-markdown';
import { profileToSnapshot } from '@/components/pentester-data-fields';
import { themeExtrasCSS, themeFontsHref, themeVariablesBlock } from '@/lib/theme-to-css';
import { loadFontFamilies } from '@/lib/report-fonts';

interface TodoItem {
  location: string;
  context: string;
  link: string;
}

interface Heading {
  level: number;
  text: string;
  id: string;
  severity?: Severity;
}

type ReportTheme = 'light' | 'dark';

const SEV_ORDER: Severity[] = ['Critical', 'High', 'Medium', 'Low', 'Informational'];

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
  const { theme: appTheme } = useTheme();
  const { id: projectId } = params;
  const { projects, clients, findings, getImage, getThemeById, getAllThemes, updateProject, activeThemeId } = useData();
  const { user } = useUser();

  const [project, setProject] = useState<Project | undefined>();
  const [client, setClient] = useState<Client | undefined>();
  const [projectFindings, setProjectFindings] = useState<Finding[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [showTodos, setShowTodos] = useState(true);
  const [activeHeading, setActiveHeading] = useState<string>('');
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
  const [pdfTheme, setPdfTheme] = useState<ReportTheme>((appTheme as ReportTheme) || 'dark');
  const [themeDialogOpen, setThemeDialogOpen] = useState(false);

  const reportContentRef = useRef<HTMLDivElement>(null);

  const t = useMemo(
    () => ({
      en: {
        findingsSummary: 'Findings Summary',
        tableOfContents: 'Table of Contents',
        findings: 'Findings',
        reportPreview: 'Report Preview',
        pending: 'Pending',
        noPendingItems: 'No pending items',
        readyToExport: 'This report is complete and ready to export.',
        downloadPDF: 'Download PDF',
        downloadHTML: 'Download HTML',
        downloadMD: 'Download Markdown',
        download: 'Download',
        themeButton: 'Theme',
        themeDialogTitle: 'Report theme',
        themeDialogDesc: 'Choose the visual style for this report.',
        current: 'Current',
        finding: 'Finding',
        backToProject: 'Back to Project',
        severity: 'Severity',
        cvss: 'CVSS',
        critical: 'Critical',
        high: 'High',
        medium: 'Medium',
        low: 'Low',
        informational: 'Informational',
        lightMode: 'Light',
        darkMode: 'Dark',
        reportType: 'Security Assessment Report',
        generatedOn: 'Generated on',
        assessmentWindow: 'Assessment window',
        client: 'Client',
        totalFindings: 'Total findings',
        showSidebar: 'Show sidebar',
        hideSidebar: 'Hide sidebar',
        downloadDisabledTitle: 'Resolve all pending TODOs to download the report',
        pdfDialogTitle: 'Export PDF',
        pdfDialogDescription: 'Choose the theme that will be used in the PDF.',
        cancel: 'Cancel',
        export: 'Export',
        pentesterTitle: 'Prepared by',
        count: 'Count',
        role: 'Role',
        company: 'Company',
        email: 'Email',
        phone: 'Phone',
        website: 'Website',
        location: 'Location',
        execSummary: 'Findings overview',
        execEmpty: 'No findings yet.',
        section: 'Section',
        status: 'Status',
        statusOpen: 'Open',
      },
      es: {
        findingsSummary: 'Resumen de Hallazgos',
        tableOfContents: 'Índice de Contenidos',
        findings: 'Hallazgos',
        reportPreview: 'Previsualización del Informe',
        pending: 'Pendiente',
        noPendingItems: 'Sin elementos pendientes',
        readyToExport: 'Este informe está completo y listo para exportar.',
        downloadPDF: 'Descargar PDF',
        downloadHTML: 'Descargar HTML',
        downloadMD: 'Descargar Markdown',
        download: 'Descargar',
        themeButton: 'Tema',
        themeDialogTitle: 'Tema del informe',
        themeDialogDesc: 'Elige el estilo visual de este informe.',
        current: 'Actual',
        finding: 'Hallazgo',
        backToProject: 'Volver al Proyecto',
        severity: 'Severidad',
        cvss: 'CVSS',
        critical: 'Crítico',
        high: 'Alto',
        medium: 'Medio',
        low: 'Bajo',
        informational: 'Informativo',
        lightMode: 'Claro',
        darkMode: 'Oscuro',
        reportType: 'Informe de Evaluación de Seguridad',
        generatedOn: 'Generado el',
        assessmentWindow: 'Ventana de evaluación',
        client: 'Cliente',
        totalFindings: 'Hallazgos totales',
        showSidebar: 'Mostrar índice',
        hideSidebar: 'Ocultar índice',
        downloadDisabledTitle: 'Resuelve todos los TODO pendientes para descargar el informe',
        pdfDialogTitle: 'Exportar PDF',
        pdfDialogDescription: 'Elige el tema visual del PDF.',
        cancel: 'Cancelar',
        export: 'Exportar',
        pentesterTitle: 'Preparado por',
        count: 'Cantidad',
        role: 'Cargo',
        company: 'Empresa',
        email: 'Email',
        phone: 'Teléfono',
        website: 'Web',
        location: 'Ubicación',
        execSummary: 'Resumen de hallazgos',
        execEmpty: 'Aún no hay hallazgos.',
        section: 'Sección',
        status: 'Estado',
        statusOpen: 'Abierto',
      },
    }),
    [],
  );

  const activeTheme = useMemo(() => getThemeById(project?.themeId), [getThemeById, project?.themeId]);

  const themeCss = useMemo(() => {
    const lightVars = themeVariablesBlock('light', activeTheme);
    const darkVars = themeVariablesBlock('dark', activeTheme);
    const extras = themeExtrasCSS(activeTheme);
    return `:root, .light { ${lightVars} } .dark { ${darkVars} } ${extras}`;
  }, [activeTheme]);

  useEffect(() => {
    loadFontFamilies([
      activeTheme.typography.familyBody,
      activeTheme.typography.familyHeadline,
      activeTheme.typography.familyMono,
    ]);
  }, [activeTheme]);

  useEffect(() => {
    const currentProject = projects.find((p) => p.id === projectId);
    if (currentProject) {
      setProject(currentProject);
      setClient(clients.find((c) => c.id === currentProject.clientId));
      const filteredFindings = findings
        .filter((f) => f.projectId === currentProject.id)
        .sort((a, b) => b.cvss - a.cvss);
      setProjectFindings(filteredFindings);
    } else {
      router.push('/dashboard/projects');
    }
  }, [projectId, projects, clients, findings, router]);

  const pentesterSnapshot: PentesterProfile | undefined = useMemo(() => {
    if (!project) return undefined;
    if (project.includePentesterData === false) return undefined;
    return project.pentesterSnapshot ?? profileToSnapshot(user);
  }, [project, user]);

  const severityCounts = useMemo(() => {
    const counts: Record<Severity, number> = {
      Critical: 0, High: 0, Medium: 0, Low: 0, Informational: 0,
    };
    projectFindings.forEach((f) => {
      if (f.severity in counts) counts[f.severity] += 1;
    });
    return counts;
  }, [projectFindings]);

  const variables: VariableContext = useMemo(() => {
    return {
      client: client
        ? { name: client.name, contact: client.contact, phone: client.phone, logoUrl: client.logoUrl }
        : undefined,
      project: project
        ? {
            name: project.name,
            startDate: project.startDate,
            endDate: project.endDate,
            language: project.language,
            date: new Date().toISOString().slice(0, 10),
          }
        : undefined,
      assessment: project
        ? {
            window: `${project.startDate} – ${project.endDate}`,
            startDate: project.startDate,
            endDate: project.endDate,
          }
        : undefined,
      pentester: pentesterSnapshot
        ? {
            name: pentesterSnapshot.name,
            role: pentesterSnapshot.role,
            company: pentesterSnapshot.company,
            email: pentesterSnapshot.email,
            phone: pentesterSnapshot.phone,
            website: pentesterSnapshot.website,
            location: pentesterSnapshot.location,
          }
        : undefined,
      vulnerabilities: {
        count: projectFindings.length,
        critical: severityCounts.Critical,
        high: severityCounts.High,
        medium: severityCounts.Medium,
        low: severityCounts.Low,
        informational: severityCounts.Informational,
      },
    };
  }, [client, project, pentesterSnapshot, projectFindings.length, severityCounts]);

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

    // Tabla dinámica de hallazgos: detecta el marcador {{findings.table}} en
    // el contenido del proyecto y lo sustituye por una tabla markdown viva
    // con el listado actual de hallazgos.
    const findingsTable = () => {
      if (projectFindings.length === 0) {
        return `> ${langT.execEmpty}`;
      }
      const head = `| ${langT.finding} | ${langT.severity} | ${langT.cvss} | ${langT.status} | ${langT.section} |`;
      const sep = '| --- | --- | --- | --- | --- |';
      const rows = projectFindings
        .slice()
        .sort((a, b) => b.cvss - a.cvss)
        .map((f) => {
          const sev = langT[f.severity.toLowerCase() as 'critical' | 'high' | 'medium' | 'low' | 'informational'] || f.severity;
          const link = `[${f.title}](#finding-${f.id})`;
          const detailsLabel = reportLang === 'es' ? 'Ver detalle' : 'View details';
          return `| ${link} | ${sev} | ${f.cvss.toFixed(1)} | ${langT.statusOpen} | [${detailsLabel}](#finding-${f.id}) |`;
        })
        .join('\n');
      return `${head}\n${sep}\n${rows}`;
    };

    const reportBodyResolved = (project.reportBody || '').replace(/\{\{\s*findings\.table\s*\}\}/g, findingsTable());

    // Marcador {{findings.details}}: si la plantilla lo incluye, los hallazgos
    // detallados se renderizan en esa posición (p. ej. una sección "Technical
    // Findings Details") en lugar de añadirse al final del informe.
    const hasDetailsMarker = /\{\{\s*findings\.details\s*\}\}/.test(project.reportBody || '');

    let mainContent = linkifyTodosInMarkdown(
      reportBodyResolved,
      (marker, sectionTitle) => projectTodoHref(marker.detail, sectionTitle),
      langT.reportPreview,
    );

    const findingsContent = projectFindings
      .sort((a, b) => b.cvss - a.cvss)
      .map((f) => {
        const findingMarkdown = linkifyTodosInMarkdown(
          f.markdown,
          (_marker, sectionTitle) => findingTodoHref(f.id, sectionTitle),
          f.title,
        );
        return `## ${f.title} [SEVERITY:${f.severity},CVSS:${f.cvss.toFixed(1)}] {#finding-${f.id}}\n${findingMarkdown}`;
      })
      .join('\n\n');

    const findingsBlock = projectFindings.length ? findingsContent : `> ${langT.execEmpty}`;

    if (hasDetailsMarker) {
      mainContent = mainContent.replace(/\{\{\s*findings\.details\s*\}\}/g, () => findingsBlock);
    }

    const findingsSection = !hasDetailsMarker && projectFindings.length
      ? `\n\n# ${langT.findings}\n\n${findingsContent}`
      : '';

    return `${mainContent}${findingsSection}`;
  }, [project, client, projectFindings, projectId, t]);

  // El índice de impresión debe mostrar la jerarquía editorial, no cada campo
  // interno de una vulnerabilidad. Conservamos los títulos de los hallazgos
  // dentro de "Technical Findings Details" y omitimos sus subsecciones.
  const documentToc = useMemo(() => {
    let isInsideFindingsDetails = false;

    return headings.reduce<Array<Heading & { tocLevel: number; isFinding: boolean }>>((items, heading) => {
      const isFindingsDetails = /technical findings details|detalles t[eé]cnicos|hallazgos t[eé]cnicos/i.test(heading.text);
      if (heading.level === 1) {
        isInsideFindingsDetails = isFindingsDetails;
      } else if (isFindingsDetails) {
        isInsideFindingsDetails = true;
      }

      if (isInsideFindingsDetails && !isFindingsDetails && !heading.severity) {
        return items;
      }

      items.push({
        ...heading,
        tocLevel: heading.severity ? 2 : heading.level,
        isFinding: Boolean(heading.severity),
      });
      return items;
    }, []);
  }, [headings]);

  useEffect(() => {
    if (!reportContentRef.current) return;
    const headingElements = Array.from(
      reportContentRef.current.querySelectorAll('h1, h2, h3'),
    ).filter((heading) =>
      !heading.closest('.report-cover') &&
      !heading.closest('.report-toc') &&
      !heading.hasAttribute('data-toc-heading'),
    ) as HTMLElement[];

    // Garantiza IDs únicos: cuando varias vulnerabilidades tienen secciones con
    // el mismo título (ej. "Recommendations"), ReactMarkdown les asigna el mismo
    // id slug. Renombramos los duplicados con sufijo numérico para evitar que el
    // scrollspy ilumine varios items a la vez.
    const seen = new Map<string, number>();
    headingElements.forEach((heading) => {
      let id = heading.id;
      if (!id) return;
      const count = seen.get(id);
      if (count !== undefined) {
        const next = count + 1;
        seen.set(id, next);
        const uniqueId = `${id}-${next}`;
        heading.id = uniqueId;
        id = uniqueId;
      } else {
        seen.set(id, 0);
      }
    });

    const newHeadings: Heading[] = [];
    headingElements.forEach((heading) => {
      if (!heading.id) return;
      const sevAttr = heading.dataset.severity as Severity | undefined;
      newHeadings.push({
        level: parseInt(heading.tagName.substring(1)),
        text: heading.textContent || '',
        id: heading.id,
        severity: sevAttr,
      });
    });
    setHeadings(newHeadings);

    const handleScroll = () => {
      if (!reportContentRef.current) return;
      const elements = Array.from(
        reportContentRef.current.querySelectorAll('h1, h2, h3'),
      ) as HTMLElement[];
      let currentActiveHeadingId = '';
      for (let i = elements.length - 1; i >= 0; i--) {
        const heading = elements[i];
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 120) {
          currentActiveHeadingId = heading.id;
          break;
        }
      }
      setActiveHeading(currentActiveHeadingId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fullReportContent]);

  // Auto-scroll del sidebar SOLO dentro del propio panel (no del window).
  // scrollIntoView por defecto desplaza también el documento, lo que "empujaba"
  // al usuario hacia arriba mientras leía. Calculamos el scroll del panel a mano.
  useEffect(() => {
    if (!activeHeading) return;
    const item = document.querySelector(`[data-toc-id="${CSS.escape(activeHeading)}"]`) as HTMLElement | null;
    const panel = item?.closest('.sidebar-panel') as HTMLElement | null;
    if (!item || !panel) return;
    const itemRect = item.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    const delta = (itemRect.top - panelRect.top) - panel.clientHeight / 2 + itemRect.height / 2;
    const target = panel.scrollTop + delta;
    // Solo aplicamos si el item NO está ya cómodamente visible (evita micro
    // ajustes constantes que se notan como "tirones").
    const fullyVisible = itemRect.top >= panelRect.top + 24 && itemRect.bottom <= panelRect.bottom - 24;
    if (!fullyVisible) {
      panel.scrollTo({ top: target, behavior: 'smooth' });
    }
  }, [activeHeading]);

  const todos = useMemo(() => {
    if (!project) return [];

    const reportLang = project.language;
    const foundTodos: TodoItem[] = [];
    const todoContext = (line: string) => replaceTodoMarkers(line, (marker) => marker.display).trim();
    const projectTodoLink = (sectionTitle: string) => {
      const params = new URLSearchParams({ tab: 'content', todo: 'TODO', section: sectionTitle });
      return `/dashboard/projects/${projectId}?${params.toString()}`;
    };
    const findingTodoLink = (findingId: string, sectionTitle: string) => {
      const params = new URLSearchParams({ todo: 'TODO', section: sectionTitle });
      return `/dashboard/projects/${projectId}/findings/${findingId}?${params.toString()}`;
    };

    if (project.reportBody) {
      let currentSectionTitle = t[reportLang].reportPreview;
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

    projectFindings.forEach((finding) => {
      let currentSectionTitle = finding.title;
      finding.markdown.split('\n').forEach((line) => {
        const headingMatch = line.match(/^#{1,6}\s+(.+)$/);
        if (headingMatch) {
          currentSectionTitle = stripMarkdownText(headingMatch[1]) || currentSectionTitle;
        }
        if (hasTodoMarker(line)) {
          foundTodos.push({
            location: `${t[reportLang].finding}: ${currentSectionTitle}`,
            context: todoContext(line),
            link: findingTodoLink(finding.id, currentSectionTitle),
          });
        }
      });
    });

    return foundTodos;
  }, [project, projectFindings, projectId, t]);

  const printWithTheme = useCallback((theme: ReportTheme) => {
    const root = document.documentElement;
    const prev = root.className;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    document.body.classList.add('printing');

    // Chrome activa los estilos de impresión antes de beforeprint. Con el
    // layout final, el alto físico A4 es 1122.52 CSS px (a 96 dpi), por lo que
    // podemos escribir los números reales en el índice antes de la captura.
    const updatePrintPagination = () => {
      const reportRoot = reportContentRef.current;
      if (!reportRoot) return;
      const pageHeight = 1122.52;
      const reportTop = reportRoot.getBoundingClientRect().top + window.scrollY;
      reportRoot.querySelectorAll<HTMLElement>('[data-toc-page-for]').forEach((pageNumber) => {
        const targetId = pageNumber.dataset.tocPageFor;
        const target = targetId ? document.getElementById(targetId) : null;
        if (!target) return;
        const targetTop = target.getBoundingClientRect().top + window.scrollY;
        pageNumber.textContent = String(Math.max(1, Math.floor(targetTop / pageHeight) + 1));
      });

      // Chromium no calcula counter(page) en elementos fixed (lo resolvía como
      // 0). Generamos un pie absoluto por hoja antes de abrir el diálogo de
      // impresión para que cada uno tenga su número real.
      const shell = document.querySelector<HTMLElement>('.report-shell');
      const footerHost = document.querySelector<HTMLElement>('.report-print-page-footers');
      if (!shell || !footerHost) return;

      const shellTop = shell.getBoundingClientRect().top + window.scrollY;
      const reportHeight = Math.max(reportRoot.getBoundingClientRect().height, reportRoot.scrollHeight);
      const firstPage = Math.max(0, Math.floor(reportTop / pageHeight));
      const lastPage = Math.max(firstPage, Math.ceil((reportTop + reportHeight) / pageHeight) - 1);
      const label = footerHost.dataset.reportLabel || '';
      footerHost.replaceChildren();

      for (let page = firstPage; page <= lastPage; page += 1) {
        const footer = document.createElement('div');
        footer.className = 'report-print-footer';
        footer.style.top = `${page * pageHeight + pageHeight - 28 - shellTop}px`;
        const name = document.createElement('span');
        name.textContent = label;
        const number = document.createElement('span');
        number.textContent = String(page + 1);
        footer.append(name, number);
        footerHost.appendChild(footer);
      }
    };
    window.addEventListener('beforeprint', updatePrintPagination, { once: true });
    window.setTimeout(() => {
      updatePrintPagination();
      window.print();
      window.setTimeout(() => {
        root.className = prev;
        document.body.classList.remove('printing');
      }, 100);
    }, 300);
  }, []);

  const openPdfDialog = () => {
    setPdfTheme((appTheme as ReportTheme) || pdfTheme);
    setPdfDialogOpen(true);
  };

  const confirmPdfExport = () => {
    setPdfDialogOpen(false);
    window.setTimeout(() => printWithTheme(pdfTheme), 100);
  };

  const applyReportTheme = (themeId: string) => {
    if (!project) return;
    updateProject({ ...project, themeId });
    setThemeDialogOpen(false);
  };

  const handleDownloadHTML = useCallback(() => {
    if (!reportContentRef.current || !project || !client) return;
    const currentClient = client;
    const reportLang = project.language;
    const initialTheme = (appTheme as ReportTheme) || 'dark';
    const themeForExport = activeTheme;
    const themeStyleBlock = `:root, .light { ${themeVariablesBlock('light', themeForExport)} } .dark { ${themeVariablesBlock('dark', themeForExport)} } ${themeExtrasCSS(themeForExport)}`;
    const fontsHref = themeFontsHref(themeForExport);
    const fontsLink = fontsHref ? `<link rel="stylesheet" href="${fontsHref}" />` : '';

    // Capturamos el HTML del reporte y eliminamos el logo del hero (ya está en
    // la cabecera del HTML exportado). Trabajamos sobre un clon para no tocar
    // el preview en pantalla.
    const exportRoot = reportContentRef.current.cloneNode(true) as HTMLElement;
    exportRoot.querySelectorAll('[data-cover-logo="true"]').forEach((node) => node.remove());
    // En el HTML exportado los bloques de código solo conservan el botón de
    // copiar: el selector de lenguaje y el wrap son interactivos del preview.
    exportRoot.querySelectorAll('[data-code-lang], [data-code-wrap]').forEach((node) => node.remove());
    const reportInnerHtml = exportRoot.innerHTML;
    const tocHtml = documentToc
      .map((h) => {
        const classes = [
          `toc-level-${h.tocLevel}`,
          h.isFinding ? 'toc-finding' : '',
        ].filter(Boolean).join(' ');
        return `<li class="${classes}"><a href="#${escapeHtml(h.id)}">${escapeHtml(h.text)}</a></li>`;
      })
      .join('');

    const pendingItemsHtml = todos.length
      ? `<section class="sidebar-card">
          <div class="sidebar-card-title">
            <span style="color:hsl(var(--todo));">●</span>
            <span>${todos.length} ${escapeHtml(t[reportLang].pending)}</span>
          </div>
          <ul class="pending-list">
            ${todos
              .map(
                (todo) => `
              <li>
                <a class="pending-link" href="${escapeHtml(todo.link)}">
                  <span class="pending-location">${escapeHtml(todo.location)}</span>
                  <span class="pending-context">${escapeHtml(todo.context.replace(/\[|\]/g, ''))}</span>
                </a>
              </li>`,
              )
              .join('')}
          </ul>
        </section>`
      : '';

    const sunSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>';
    // Favicon: SVG con color de marca según tema inicial del HTML descargado.
    const faviconColor = initialTheme === 'dark' ? 'CEFF00' : '22C55E';
    const faviconSvg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256' width='28' height='28'><path fill='%23${faviconColor}' d='M216 44.45 136 15.36a23.94 23.94 0 0 0-16 0L40 44.45A24 24 0 0 0 24 67v49.7C24 198.7 93.41 234.51 114.69 243.45a23.85 23.85 0 0 0 18.62 0C154.59 234.51 224 198.7 224 116.7V67a24 24 0 0 0-8-22.55ZM168 136h-32v32a8 8 0 0 1-16 0v-32H88a8 8 0 0 1 0-16h32V88a8 8 0 0 1 16 0v32h32a8 8 0 0 1 0 16Z'/></svg>`;
    const faviconDataUri = `data:image/svg+xml;utf8,${faviconSvg}`;
    // Shield inline para el header: usa currentColor → adaptativo al tema en runtime.
    const shieldSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M216 44.45 136 15.36a23.94 23.94 0 0 0-16 0L40 44.45A24 24 0 0 0 24 67v49.7C24 198.7 93.41 234.51 114.69 243.45a23.85 23.85 0 0 0 18.62 0C154.59 234.51 224 198.7 224 116.7V67a24 24 0 0 0-8-22.55ZM168 136h-32v32a8 8 0 0 1-16 0v-32H88a8 8 0 0 1 0-16h32V88a8 8 0 0 1 16 0v32h32a8 8 0 0 1 0 16Z"/></svg>`;
    const headerLogoSrc = currentClient.logoWide || currentClient.logoUrl || '';
    const moonSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    const panelSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/></svg>';
    const chevronLeftSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>';
    const chevronRightSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';

    const fullHtml = `<!DOCTYPE html>
<html lang="${reportLang}" class="${initialTheme} scroll-smooth" data-sidebar="open">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(project.name)}</title>
  <link rel="icon" href="${faviconDataUri}" type="image/svg+xml" />
  ${fontsLink}
  <style>${buildReportHtmlStyles(initialTheme)}
${themeStyleBlock}</style>
</head>
<body>
  <header class="app-header no-print">
    <div class="app-header-inner">
      <div class="app-header-brand">
        ${
          headerLogoSrc
            ? `<img src="${headerLogoSrc}" alt="${escapeHtml(currentClient.name)} logo" class="app-header-logo" /><span class="app-header-title">${escapeHtml(currentClient.name)}</span>`
            : `<span class="app-header-mark">${shieldSvg}</span><span class="app-header-title app-header-title-brand">VulnForce</span>`
        }
      </div>
      <div class="app-header-actions">
        <button id="theme-switcher" class="header-icon-btn" type="button" aria-label="Theme">
          <span class="theme-icon theme-icon-sun">${sunSvg}</span>
          <span class="theme-icon theme-icon-moon">${moonSvg}</span>
        </button>
        <button id="sidebar-toggle-mobile" class="header-icon-btn header-icon-btn-mobile" type="button" aria-label="Toggle sidebar">${panelSvg}</button>
      </div>
    </div>
  </header>
  <div class="report-shell">
    <div class="report-layout">
      <main class="report-main">${reportInnerHtml}</main>
      <aside id="report-sidebar" class="report-sidebar no-print">
        <button id="sidebar-toggle-close" class="sidebar-rail-btn" type="button" aria-label="Hide sidebar">${chevronRightSvg}</button>
        <div class="sidebar-panel">
          ${pendingItemsHtml}
          <h3 class="sidebar-heading">${escapeHtml(t[reportLang].tableOfContents)}</h3>
          <ul class="toc-list">${tocHtml}</ul>
        </div>
      </aside>
      <button id="sidebar-toggle-open" class="sidebar-rail-btn sidebar-rail-btn-floating no-print" type="button" aria-label="Show sidebar">${chevronLeftSvg}</button>
    </div>
  </div>
  <script>
    (function () {
      var root = document.documentElement;
      var switcher = document.getElementById('theme-switcher');
      if (switcher) {
        switcher.addEventListener('click', function () {
          var isDark = root.classList.contains('dark');
          root.classList.remove('light', 'dark');
          root.classList.add(isDark ? 'light' : 'dark');
        });
      }
      // Sidebar toggle
      var toggles = [
        document.getElementById('sidebar-toggle-mobile'),
        document.getElementById('sidebar-toggle-close'),
        document.getElementById('sidebar-toggle-open')
      ].filter(Boolean);
      toggles.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var open = root.dataset.sidebar === 'open';
          root.dataset.sidebar = open ? 'closed' : 'open';
        });
      });
      // Scrollspy (solo ilumina el heading exacto actual)
      var tocLinks = Array.prototype.slice.call(document.querySelectorAll('.toc-list a'));
      var hashIndex = {};
      tocLinks.forEach(function (link) {
        var href = link.getAttribute('href') || '';
        if (!hashIndex[href]) hashIndex[href] = [];
        hashIndex[href].push(link);
      });
      function updateActive() {
        var headings = document.querySelectorAll('.report-main h1, .report-main h2, .report-main h3');
        var activeId = '';
        for (var i = headings.length - 1; i >= 0; i--) {
          if (headings[i].getBoundingClientRect().top <= 120) {
            activeId = headings[i].id;
            break;
          }
        }
        var activeHref = activeId ? '#' + activeId : '';
        tocLinks.forEach(function (link) { link.classList.remove('is-active'); });
        if (activeHref && hashIndex[activeHref]) {
          // Solo el primer link que coincida exactamente con el id activo
          hashIndex[activeHref][0].classList.add('is-active');
        }
      }
      window.addEventListener('scroll', updateActive, { passive: true });
      window.addEventListener('resize', updateActive, { passive: true });
      updateActive();
      // Copiar código: el botón ya está en el DOM; reconectamos el click.
      document.querySelectorAll('[data-code-copy]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var root = btn.closest('[data-code-root]');
          var pre = root && root.querySelector('pre');
          if (pre && navigator.clipboard) navigator.clipboard.writeText(pre.innerText);
        });
      });
    })();
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
  }, [activeTheme, appTheme, client, documentToc, project, t, todos]);

  const handleDownloadMarkdown = useCallback(() => {
    if (!project || !client) return;
    const reportLang = project.language;
    const langT = t[reportLang];
    const generatedDate = new Date().toLocaleDateString(reportLang === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
    const markdown = buildReportMarkdown({
      project,
      client,
      findings: projectFindings,
      pentester: pentesterSnapshot,
      variables,
      generatedDate,
      translations: {
        reportType: langT.reportType,
        generatedOn: langT.generatedOn,
        client: langT.client,
        assessmentWindow: langT.assessmentWindow,
        totalFindings: langT.totalFindings,
        findingsSummary: langT.findingsSummary,
        findings: langT.findings,
        pentesterTitle: langT.pentesterTitle,
        severity: langT.severity,
        cvss: langT.cvss,
        count: langT.count,
        critical: langT.critical,
        high: langT.high,
        medium: langT.medium,
        low: langT.low,
        informational: langT.informational,
      },
    });
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${project.name.replace(/\s+/g, '_')}-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [client, pentesterSnapshot, project, projectFindings, t, variables]);

  if (!project || !client) {
    return null;
  }

  const reportLang = project.language;
  const langT = t[reportLang];

  const generatedDate = new Date().toLocaleDateString(reportLang === 'es' ? 'es-ES' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const assessmentWindow = `${project.startDate} — ${project.endDate}`;
  const sidebarToggleLabel = isSidebarOpen ? t[uiLanguage].hideSidebar : t[uiLanguage].showSidebar;
  const downloadDisabled = todos.length > 0;
  const customLogoSrc = client.logoWide || client.logoUrl || '';
  const clientLogo = customLogoSrc ? (
    <img
      src={customLogoSrc}
      alt={`${client.name} logo`}
      className="h-16 max-h-16 max-w-[260px] w-auto object-contain"
    />
  ) : (
    <div className="flex items-center gap-2.5 font-headline text-2xl font-bold tracking-tight" style={{ color: 'hsl(var(--brand))' }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="36" height="36" fill="currentColor" aria-hidden="true">
        <path d="M216 44.45 136 15.36a23.94 23.94 0 0 0-16 0L40 44.45A24 24 0 0 0 24 67v49.7C24 198.7 93.41 234.51 114.69 243.45a23.85 23.85 0 0 0 18.62 0C154.59 234.51 224 198.7 224 116.7V67a24 24 0 0 0-8-22.55ZM168 136h-32v32a8 8 0 0 1-16 0v-32H88a8 8 0 0 1 0-16h32V88a8 8 0 0 1 16 0v32h32a8 8 0 0 1 0 16Z" />
      </svg>
      <span className="text-foreground">VulnForce</span>
    </div>
  );

  return (
    <div className="report-shell min-h-screen">
      <style jsx global>{`
        ${REPORT_SHARED_CSS}
        ${REPORT_PRINT_CSS}
        ${themeCss}
      `}</style>

      <header className="sticky top-0 z-30 w-full bg-background/95 backdrop-blur-sm border-b no-print">
        <div className="w-full px-4 sm:px-6 py-3 flex flex-wrap justify-between items-center gap-3 min-h-16">
          <div className="flex items-center gap-3 min-w-0">
            <Button variant="outline" size="icon" asChild className="h-9 w-9">
              <Link href={`/dashboard/projects/${projectId}`}>
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">{t[uiLanguage].backToProject}</span>
              </Link>
            </Button>
            <h1 className="truncate font-headline text-lg md:text-xl font-bold">
              {t[uiLanguage].reportPreview}
            </h1>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              onClick={() => setIsSidebarOpen((value) => !value)}
              aria-label={sidebarToggleLabel}
              title={sidebarToggleLabel}
              className="h-9 px-3 lg:hidden"
            >
              <PanelLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => setThemeDialogOpen(true)}
              className="h-9 px-3"
            >
              <Palette className="mr-2 h-4 w-4" />
              {t[uiLanguage].themeButton}
            </Button>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  disabled={downloadDisabled}
                  title={downloadDisabled ? t[uiLanguage].downloadDisabledTitle : undefined}
                  className="h-9 px-3"
                >
                  <FileDown className="mr-2 h-4 w-4" />
                  {t[uiLanguage].download}
                  <ChevronDown className="ml-2 h-4 w-4 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={openPdfDialog}>
                  <Printer className="mr-2 h-4 w-4" /> PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownloadHTML}>
                  <Globe className="mr-2 h-4 w-4" /> HTML
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownloadMarkdown}>
                  <FileText className="mr-2 h-4 w-4" /> Markdown
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="pdf-page-background" aria-hidden="true" />
      <div className="report-layout">
        <main className="report-main flex-1 min-w-0 order-1 printable-content">
          <div ref={reportContentRef}>
            <header className="report-cover report-page">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div className="space-y-3 min-w-0">
                  <p className="cover-type">{langT.reportType}</p>
                  <h1 className="cover-title">{project.name}</h1>
                  <p className="cover-client">{client.name}</p>
                </div>
                <div className="cover-logo flex shrink-0 items-center" data-cover-logo="true">{clientLogo}</div>
              </div>
              <div className="cover-meta">
                <div className="cover-meta-card">
                  <p className="cover-meta-label">{langT.client}</p>
                  <p className="cover-meta-value">{client.name}</p>
                </div>
                <div className="cover-meta-card">
                  <p className="cover-meta-label">{langT.assessmentWindow}</p>
                  <p className="cover-meta-value">{assessmentWindow}</p>
                </div>
                <div className="cover-meta-card">
                  <p className="cover-meta-label">{langT.generatedOn}</p>
                  <p className="cover-meta-value">{generatedDate}</p>
                </div>
              </div>

              <section className="hero-summary-row" style={{ marginTop: '2.5rem' }}>
                <div className="hero-summary-cell is-total">
                  <p className="hero-label">{langT.totalFindings}</p>
                  <p className="hero-value">{projectFindings.length}</p>
                </div>
                {SEV_ORDER.map((sev) => (
                  <div
                    key={sev}
                    className={cn('hero-summary-cell', `sev-${sev.toLowerCase()}-cell`)}
                  >
                    <p className="hero-label">{langT[sev.toLowerCase() as keyof typeof langT]}</p>
                    <p className="hero-value">{severityCounts[sev]}</p>
                  </div>
                ))}
              </section>

              {pentesterSnapshot && (
                <section className="pentester-card">
                  <div className="header">
                    <h3>{langT.pentesterTitle}</h3>
                    {pentesterSnapshot.name && <span className="role">{pentesterSnapshot.name}</span>}
                  </div>
                  {pentesterSnapshot.role && (
                    <div className="item" title={pentesterSnapshot.role}>
                      <span className="label">{langT.role}</span>
                      <span className="value">{pentesterSnapshot.role}</span>
                    </div>
                  )}
                  {pentesterSnapshot.company && (
                    <div className="item" title={pentesterSnapshot.company}>
                      <span className="label">{langT.company}</span>
                      <span className="value">{pentesterSnapshot.company}</span>
                    </div>
                  )}
                  {pentesterSnapshot.email && (
                    <div className="item" title={pentesterSnapshot.email}>
                      <span className="label">{langT.email}</span>
                      <span className="value">{pentesterSnapshot.email}</span>
                    </div>
                  )}
                  {pentesterSnapshot.phone && (
                    <div className="item" title={pentesterSnapshot.phone}>
                      <span className="label">{langT.phone}</span>
                      <span className="value">{pentesterSnapshot.phone}</span>
                    </div>
                  )}
                  {pentesterSnapshot.website && (
                    <div className="item" title={pentesterSnapshot.website}>
                      <span className="label">{langT.website}</span>
                      <span className="value">{pentesterSnapshot.website}</span>
                    </div>
                  )}
                  {pentesterSnapshot.location && (
                    <div className="item" title={pentesterSnapshot.location}>
                      <span className="label">{langT.location}</span>
                      <span className="value">{pentesterSnapshot.location}</span>
                    </div>
                  )}
                </section>
              )}
            </header>

            <section className="report-toc report-page" aria-label={langT.tableOfContents}>
              <h1 data-toc-heading>{langT.tableOfContents}</h1>
              <ul className="toc-list">
                {documentToc.map((heading) => (
                  <li
                    key={heading.id}
                    className={cn(`toc-level-${heading.tocLevel}`, heading.isFinding && 'toc-finding')}
                  >
                    <a href={`#${heading.id}`}>
                      <span>{heading.text}</span>
                      <span className="toc-page-number" data-toc-page-for={heading.id} aria-label="page number" />
                    </a>
                  </li>
                ))}
              </ul>
            </section>

            <section className="report-page">
              <MarkdownPreview
                content={fullReportContent}
                getImage={getImage}
                isReport
                variables={variables}
              />
            </section>
          </div>
        </main>

        <aside
          className={cn(
            'report-sidebar no-print order-3 relative',
            !isSidebarOpen && 'hidden lg:hidden',
          )}
        >
          {/* Toggle flotante (fuera del overflow del panel para que no se corte) */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsSidebarOpen(false)}
            aria-label={sidebarToggleLabel}
            title={sidebarToggleLabel}
            className="absolute -left-4 top-3 z-30 hidden h-8 w-8 rounded-full bg-background shadow-md border lg:inline-flex"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
          <div className="sidebar-panel">
            {showTodos && todos.length > 0 && (
              <section className="sidebar-card">
                <div className="sidebar-card-title">
                  <AlertCircle className="h-4 w-4" style={{ color: 'hsl(var(--todo))' }} />
                  <span>{todos.length} {langT.pending}</span>
                </div>
                <ul className="pending-list">
                  {todos.map((todo, idx) => (
                    <li key={idx}>
                      <Link
                        href={todo.link}
                        className="pending-link"
                        title={`${todo.location} — ${todo.context.replace(/\[|\]/g, '')}`}
                      >
                        <span className="pending-location">{todo.location}</span>
                        <span className="pending-context">{todo.context.replace(/\[|\]/g, '')}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {showTodos && todos.length === 0 && (
              <section className="sidebar-card">
                <div className="sidebar-card-title" style={{ justifyContent: 'space-between' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle className="h-4 w-4" style={{ color: 'hsl(var(--brand))' }} />
                    {langT.noPendingItems}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowTodos(false)}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="dismiss"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p style={{ marginTop: '0.4rem', color: 'hsl(var(--muted-foreground))', fontSize: '0.85rem' }}>
                  {langT.readyToExport}
                </p>
              </section>
            )}

            <h3 className="sidebar-heading">{langT.tableOfContents}</h3>
            <ul className="toc-list">
              {documentToc.map((heading) => (
                <li
                  key={heading.id}
                  data-toc-id={heading.id}
                  className={cn(
                    `toc-level-${heading.tocLevel}`,
                    heading.isFinding && 'toc-finding',
                  )}
                >
                  <a
                    href={`#${heading.id}`}
                    className={cn(activeHeading === heading.id && 'is-active')}
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {!isSidebarOpen && (
          <div className="no-print hidden lg:flex lg:sticky lg:top-20 lg:h-8 lg:shrink-0 order-2">
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
      </div>
      <div
        className="report-print-page-footers"
        data-report-label={`${project.name} · ${client.name}`}
        aria-hidden="true"
      />

      <Dialog open={pdfDialogOpen} onOpenChange={setPdfDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{langT.pdfDialogTitle}</DialogTitle>
            <DialogDescription>{langT.pdfDialogDescription}</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => setPdfTheme('light')}
              className={cn(
                'rounded-lg border-2 p-4 text-left transition-colors',
                pdfTheme === 'light'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/40',
              )}
            >
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4" />
                <span className="font-semibold">{langT.lightMode}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {langT.lightMode === 'Claro' ? 'Fondo blanco, contraste alto' : 'White background, high contrast'}
              </p>
            </button>
            <button
              type="button"
              onClick={() => setPdfTheme('dark')}
              className={cn(
                'rounded-lg border-2 p-4 text-left transition-colors',
                pdfTheme === 'dark'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/40',
              )}
            >
              <div className="flex items-center gap-2">
                <Moon className="h-4 w-4" />
                <span className="font-semibold">{langT.darkMode}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {langT.darkMode === 'Oscuro' ? 'Fondo oscuro elegante' : 'Elegant dark background'}
              </p>
            </button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPdfDialogOpen(false)}>
              {langT.cancel}
            </Button>
            <Button onClick={confirmPdfExport}>
              <Printer className="mr-2 h-4 w-4" />
              {langT.export}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={themeDialogOpen} onOpenChange={setThemeDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{langT.themeDialogTitle}</DialogTitle>
            <DialogDescription>{langT.themeDialogDesc}</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {getAllThemes().map((th) => {
              const selected = (project.themeId || activeThemeId) === th.id;
              return (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => applyReportTheme(th.id)}
                  className={cn(
                    'rounded-lg border-2 p-2 text-left transition-colors',
                    selected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40',
                  )}
                >
                  <ThemePreview theme={th} mode={(appTheme as 'light' | 'dark') || 'dark'} variant="mini" />
                  <div className="mt-2 flex items-center justify-between gap-2 px-1">
                    <span className="font-medium truncate">{th.name}</span>
                    {selected && <span className="text-xs font-semibold text-primary">{langT.current}</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
