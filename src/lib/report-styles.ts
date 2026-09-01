// CSS centralizado para el reporte: se reutiliza tanto en el preview (vía
// <style jsx global>) como en el HTML exportado y en el PDF generado por
// window.print. Mantener todo el styling aquí evita divergencias entre los
// tres pipelines.

export const REPORT_THEME_VARIABLES = {
  light: `
    --background: 0 0% 98%;
    --foreground: 222 47% 11%;
    --card: 0 0% 100%;
    --card-foreground: 222 47% 11%;
    --popover: 0 0% 100%;
    --popover-foreground: 222 47% 11%;
    --primary: 142 71% 45%;
    --primary-foreground: 0 0% 100%;
    --brand: 142 71% 45%;
    --brand-foreground: 0 0% 100%;
    --secondary: 210 20% 96%;
    --secondary-foreground: 222 47% 11%;
    --muted: 210 20% 96%;
    --muted-foreground: 215 16% 47%;
    --accent: 142 71% 45%;
    --accent-foreground: 0 0% 100%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 98%;
    --border: 214 32% 91%;
    --input: 214 32% 91%;
    --ring: 142 71% 45%;
    --severity-critical: 0 72% 42%;
    --severity-critical-foreground: 0 0% 100%;
    --severity-high: 22 96% 50%;
    --severity-high-foreground: 0 0% 100%;
    --severity-medium: 42 95% 48%;
    --severity-medium-foreground: 36 100% 12%;
    --severity-low: 217 90% 55%;
    --severity-low-foreground: 0 0% 100%;
    --severity-informational: 215 14% 45%;
    --severity-informational-foreground: 0 0% 100%;
    --todo: 0 72% 50%;
    --todo-foreground: 0 0% 100%;
    --surface-cover: 0 0% 100%;
    /* Pastillas hero: blanco en light mode */
    --surface-card-strong: 0 0% 100%;
    --surface-card-strong-foreground: 222 47% 11%;
    --surface-card-strong-border: 214 32% 88%;
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
  `,
  dark: `
    --background: 224 47% 6%;
    --foreground: 210 40% 98%;
    --card: 224 47% 9%;
    --card-foreground: 210 40% 98%;
    --popover: 224 47% 6%;
    --popover-foreground: 210 40% 98%;
    --primary: 76 100% 50%;
    --primary-foreground: 76 100% 5%;
    --brand: 76 100% 50%;
    --brand-foreground: 76 100% 5%;
    --secondary: 220 15% 18%;
    --secondary-foreground: 210 40% 98%;
    --muted: 220 15% 18%;
    --muted-foreground: 215 18% 70%;
    --accent: 76 100% 55%;
    --accent-foreground: 76 100% 10%;
    --destructive: 0 72% 55%;
    --destructive-foreground: 210 40% 98%;
    --border: 220 15% 22%;
    --input: 220 15% 22%;
    --ring: 76 100% 50%;
    --severity-critical: 0 72% 55%;
    --severity-critical-foreground: 0 0% 100%;
    --severity-high: 22 96% 58%;
    --severity-high-foreground: 0 0% 100%;
    --severity-medium: 42 95% 58%;
    --severity-medium-foreground: 36 100% 12%;
    --severity-low: 217 90% 65%;
    --severity-low-foreground: 0 0% 100%;
    --severity-informational: 215 12% 60%;
    --severity-informational-foreground: 0 0% 100%;
    --todo: 0 75% 60%;
    --todo-foreground: 0 0% 100%;
    --surface-cover: 224 47% 4%;
    /* Pastillas hero: negro en dark mode */
    --surface-card-strong: 0 0% 0%;
    --surface-card-strong-foreground: 0 0% 100%;
    --surface-card-strong-border: 0 0% 14%;
    --code-background: 222 47% 8%;
    --code-foreground: 210 40% 96%;
    --code-comment: 215 20% 68%;
    --code-punctuation: 210 30% 84%;
    --code-keyword: 272 90% 80%;
    --code-string: 142 76% 72%;
    --code-function: 199 89% 76%;
    --code-number: 36 100% 72%;
    --code-attr: 185 85% 72%;
    --code-tag: 0 90% 76%;
    --code-operator: 210 40% 90%;
    --code-regex: 330 86% 78%;
    --code-selection: 224 40% 22%;
  `,
};

// CSS principal del reporte. Funciona tanto dentro de la app (vía <style jsx
// global>) como inyectado en el HTML exportado. Las únicas reglas específicas
// del export viven en `REPORT_EXPORT_CSS`.
export const REPORT_SHARED_CSS = `
  :root, .light { ${REPORT_THEME_VARIABLES.light} }
  .dark { ${REPORT_THEME_VARIABLES.dark} }

  *, *::before, *::after { box-sizing: border-box; }
  /* overflow-x: clip evita scroll horizontal sin crear contexto de scroll
     (necesario para que position:sticky siga funcionando en descendientes). */
  html { scroll-behavior: smooth; overflow-x: clip; }
  body {
    background: hsl(var(--background));
    color: hsl(var(--foreground));
    font-family: 'Inter', sans-serif;
    margin: 0;
    overflow-x: clip;
    max-width: 100vw;
  }
  img, svg, video, canvas, iframe { max-width: 100%; height: auto; }
  pre, code { max-width: 100%; }
  .report-shell { overflow-x: clip; max-width: 100vw; }
  h1, h2, h3, h4, h5, h6 { font-family: 'Space Grotesk', sans-serif; }
  pre, code { font-family: 'Source Code Pro', monospace; }

  /* Shell layout */
  .report-shell { background: hsl(var(--background)); color: hsl(var(--foreground)); }
  .report-layout {
    display: flex;
    gap: 1.25rem;
    width: 100%;
    margin: 0;
    padding: 1rem 24px;
    align-items: stretch;
    position: relative;
  }
  .report-main {
    flex: 1 1 auto;
    min-width: 0;
    max-width: 100%;
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: 16px;
    box-shadow: 0 16px 40px rgb(0 0 0 / 0.10);
    overflow: hidden;
  }
  .report-page { padding: 2.25rem 2.5rem; }

  /* Header degradado sutil con color de marca */
  .report-cover {
    position: relative;
    min-height: 620px;
    padding: 3rem 2.5rem;
    border-bottom: 1px solid hsl(var(--border));
    background:
      linear-gradient(180deg, hsl(var(--brand) / 0.10) 0%, hsl(var(--surface-cover)) 75%);
  }
  .report-cover::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 90% -20%, hsl(var(--brand) / 0.10), transparent 55%);
    pointer-events: none;
  }
  .report-cover > * { position: relative; }
  .report-cover .cover-type {
    color: hsl(var(--brand));
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }
  .report-cover .cover-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 700;
    margin: 0.75rem 0 0.5rem;
    color: hsl(var(--foreground));
    letter-spacing: -0.01em;
  }
  .report-cover .cover-client {
    color: hsl(var(--muted-foreground));
    font-size: 1.15rem;
    margin: 0;
  }
  .cover-meta {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    margin-top: 2.5rem;
  }
  .cover-meta-card {
    background: hsl(var(--card) / 0.5);
    color: hsl(var(--card-foreground));
    border-radius: 0.75rem;
    padding: 1rem 1.15rem;
    border: 1px solid hsl(var(--border) / 0.6);
    box-shadow: 0 6px 16px rgb(0 0 0 / 0.06);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }
  .cover-meta-label {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    opacity: 0.7;
    margin: 0 0 0.4rem 0;
  }
  .cover-meta-value {
    font-size: 0.95rem;
    font-weight: 600;
    margin: 0;
    line-height: 1.35;
    word-break: break-word;
  }

  /* Severity hero summary */
  .hero-summary-row {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 0.75rem;
  }
  .hero-summary-cell {
    flex: 1 1 0;
    min-width: 0;
    background: hsl(var(--card) / 0.5);
    border: 1px solid hsl(var(--border) / 0.6);
    border-radius: 0.75rem;
    padding: 1.1rem 1rem;
    text-align: left;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }
  .hero-summary-cell.is-total {
    border-color: hsl(var(--brand) / 0.7);
    background: linear-gradient(180deg, hsl(var(--brand) / 0.12), hsl(var(--card) / 0.5));
  }
  .hero-summary-cell.is-total .hero-value { color: hsl(var(--brand)); }
  .hero-label { color: hsl(var(--muted-foreground)); font-size: 0.85rem; margin: 0; }
  .hero-value { font-family: 'Space Grotesk', sans-serif; font-size: 1.85rem; font-weight: 700; margin-top: 0.4rem; }
  .hero-summary-cell.sev-critical-cell { border-color: hsl(var(--severity-critical) / 0.45); }
  .hero-summary-cell.sev-critical-cell .hero-value { color: hsl(var(--severity-critical)); }
  .hero-summary-cell.sev-high-cell { border-color: hsl(var(--severity-high) / 0.45); }
  .hero-summary-cell.sev-high-cell .hero-value { color: hsl(var(--severity-high)); }
  .hero-summary-cell.sev-medium-cell { border-color: hsl(var(--severity-medium) / 0.55); }
  .hero-summary-cell.sev-medium-cell .hero-value { color: hsl(var(--severity-medium)); }
  .hero-summary-cell.sev-low-cell { border-color: hsl(var(--severity-low) / 0.45); }
  .hero-summary-cell.sev-low-cell .hero-value { color: hsl(var(--severity-low)); }
  .hero-summary-cell.sev-informational-cell { border-color: hsl(var(--severity-informational) / 0.45); }
  .hero-summary-cell.sev-informational-cell .hero-value { color: hsl(var(--severity-informational)); }

  /* Prose */
  .prose {
    color: hsl(var(--foreground));
    max-width: 100% !important;
    font-size: 1rem;
    line-height: 1.75;
  }
  .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
    color: hsl(var(--foreground));
    scroll-margin-top: 90px;
  }
  .prose h1 { border-bottom: 2px solid hsl(var(--brand)); padding-bottom: 0.35rem; }
  .prose h2 { border-bottom: 1px solid hsl(var(--border)); padding-bottom: 0.3rem; }
  .prose a { color: hsl(var(--brand)); text-decoration-thickness: 1px; text-underline-offset: 3px; }
  .prose a[href*="todo=TODO"], .text-red-500 { color: hsl(var(--todo)) !important; font-weight: 700; }
  .prose strong { color: hsl(var(--foreground)); }
  .prose blockquote {
    color: hsl(var(--muted-foreground));
    border-left: 4px solid hsl(var(--brand));
    background: hsl(var(--muted) / 0.45);
    padding: 0.6rem 1rem;
    border-radius: 6px;
  }
  .prose code:not(pre code) {
    background-color: hsl(var(--muted)) !important;
    color: hsl(var(--foreground)) !important;
    padding: 2px 5px;
    border-radius: 4px;
  }
  .prose pre {
    background-color: hsl(var(--code-background)) !important;
    color: hsl(var(--code-foreground)) !important;
    padding: 1em;
    border-radius: 8px;
    overflow-x: auto;
    border: 1px solid hsl(var(--border));
  }
  .prose pre[class*="language-"] { background: transparent !important; color: hsl(var(--code-foreground)) !important; border: 0 !important; margin: 0 !important; }
  .prose code[class*="language-"] { color: hsl(var(--code-foreground)) !important; background: transparent !important; }
  .prose table { width: 100%; display: table; border-collapse: collapse; table-layout: auto; max-width: 100%; overflow-x: auto; word-break: break-word; }
  .prose th { background-color: hsl(var(--muted)); color: hsl(var(--foreground)); }
  .prose td, .prose th { border: 1px solid hsl(var(--border)); padding: 10px 12px; vertical-align: top; }
  .prose img { max-width: 100%; height: auto; border-radius: 8px; border: 1px solid hsl(var(--border)); }
  hr { border-top-color: hsl(var(--border)); }
  [id] { scroll-margin-top: 96px; }

  /* TODO block: solo línea izq roja, sin padding/hover */
  .todo-block {
    border-left: 4px solid hsl(var(--todo));
    padding-left: 0.6rem;
  }

  /* Severity badges */
  .badge-sev {
    display: inline-flex;
    align-items: center;
    border-radius: 9999px;
    padding: 0.25rem 0.75rem;
    font-size: 0.78rem;
    font-weight: 600;
    line-height: 1;
  }
  .badge-sev.critical { background: hsl(var(--severity-critical)); color: hsl(var(--severity-critical-foreground)); }
  .badge-sev.high { background: hsl(var(--severity-high)); color: hsl(var(--severity-high-foreground)); }
  .badge-sev.medium { background: hsl(var(--severity-medium)); color: hsl(var(--severity-medium-foreground)); }
  .badge-sev.low { background: hsl(var(--severity-low)); color: hsl(var(--severity-low-foreground)); }
  .badge-sev.informational { background: hsl(var(--severity-informational)); color: hsl(var(--severity-informational-foreground)); }

  /* Pentester card: en una sola línea horizontal con scroll/compactación si no entra */
  .pentester-card {
    margin-top: 2rem;
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: 0.75rem;
    padding: 0.9rem 1.1rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.65rem 1.4rem;
  }
  .pentester-card .header {
    display: flex;
    align-items: baseline;
    gap: 0.55rem;
    min-width: 0;
    padding-right: 0.75rem;
    border-right: 1px solid hsl(var(--border));
  }
  .pentester-card .header h3 { margin: 0; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: hsl(var(--muted-foreground)); }
  .pentester-card .header .role { color: hsl(var(--foreground)); font-weight: 600; font-size: 0.92rem; }
  .pentester-card .item { display: inline-flex; align-items: baseline; gap: 0.35rem; min-width: 0; }
  .pentester-card .item .label {
    font-size: 0.65rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: hsl(var(--muted-foreground));
    white-space: nowrap;
  }
  .pentester-card .item .value {
    font-size: 0.85rem;
    font-weight: 600;
    color: hsl(var(--foreground));
    max-width: 22ch;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  @media (max-width: 720px) {
    .pentester-card { flex-direction: column; align-items: flex-start; }
    .pentester-card .header { border-right: 0; padding-right: 0; }
    .pentester-card .item .value { max-width: 100%; }
  }

  /* Sidebar (web only) */
  .report-sidebar {
    width: 19rem;
    flex: 0 0 19rem;
    position: sticky;
    top: 5rem;
    height: calc(100vh - 6rem);
    align-self: flex-start;
  }
  .sidebar-panel {
    height: 100%;
    overflow-y: auto;
    border: 1px solid hsl(var(--border));
    background: hsl(var(--card));
    border-radius: 0.75rem;
    padding: 1rem;
    box-shadow: 0 8px 30px rgb(0 0 0 / 0.10);
  }
  .sidebar-heading {
    margin-bottom: 0.75rem;
    color: hsl(var(--muted-foreground));
    font-size: 0.72rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-weight: 700;
  }
  .sidebar-card {
    border: 1px solid hsl(var(--border));
    background: hsl(var(--background) / 0.55);
    border-radius: 0.75rem;
    padding: 0.85rem;
    margin-bottom: 1rem;
  }
  .sidebar-card-title { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; font-weight: 700; }
  .pending-list { margin-top: 0.75rem; display: grid; gap: 0.5rem; padding: 0; list-style: none; max-width: 100%; }
  .pending-list li { list-style: none; max-width: 100%; min-width: 0; }
  .pending-link {
    display: block;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    border-left: 4px solid hsl(var(--todo));
    border-radius: 0 0.4rem 0.4rem 0;
    padding: 0.6rem 0.75rem;
    background: hsl(var(--card));
    color: inherit;
    text-decoration: none;
    transition: background-color 150ms ease, border-color 150ms ease;
    overflow: hidden;
  }
  .pending-link:hover {
    background: hsl(var(--todo) / 0.08);
  }
  .pending-location { display: block; font-size: 0.85rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .pending-context { display: block; margin-top: 0.2rem; color: hsl(var(--muted-foreground)); font-family: 'Source Code Pro', monospace; font-size: 0.72rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  /* TOC: sin bullets, sin padding por defecto del UA */
  .toc-list {
    display: flex;
    flex-direction: column;
    gap: 0.04rem;
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .toc-list li { list-style: none; margin: 0; padding: 0; }
  .toc-list a {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
    padding: 2px 8px;
    border-radius: 4px;
    color: inherit;
    text-decoration: none;
    font-size: 0.85rem;
    transition: background-color 0.15s ease-in-out, color 0.15s ease-in-out;
  }
  .toc-list a:hover { background-color: hsl(var(--primary) / 0.10); color: hsl(var(--brand)); }
  .toc-list a.is-active { color: hsl(var(--brand)); background: hsl(var(--brand) / 0.08); font-weight: 600; }
  .report-toc > h1 {
    margin: 0 0 1rem;
    padding-bottom: 0.45rem;
    border-bottom: 2px solid hsl(var(--brand));
    color: hsl(var(--foreground));
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.8rem;
    font-weight: 700;
    line-height: 1.2;
  }
  /* H1 (secciones principales): siempre indentado al borde izquierdo, sin barra de marca */
  .toc-level-1 a {
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    font-size: 0.78rem;
    opacity: 0.85;
    padding-left: 8px;
  }
  .toc-level-1 { margin-top: 0.2rem; }
  .toc-level-2 a { padding-left: 48px; font-weight: 400; }
  .toc-level-3 a { padding-left: 68px; font-size: 0.78rem; font-weight: 400; color: hsl(var(--muted-foreground)); }
  .toc-page-number { margin-left: auto; flex: 0 0 auto; font-variant-numeric: tabular-nums; color: hsl(var(--muted-foreground)); }
  /* Solo H2 marcadas como vulnerabilidad llevan la barra verde */
  .toc-vuln {
    margin-top: 0.35rem;
    border-left: 3px solid hsl(var(--brand));
    background: hsl(var(--brand) / 0.05);
    border-radius: 0 0.3rem 0.3rem 0;
  }
  .toc-vuln a { font-weight: 700; padding-left: 12px; }
  /* Los hallazgos del índice son hijos de la sección técnica: sin el bloque
     amarillo/verde de severidad, solo el título con sangría editorial. */
  .toc-finding { margin-top: 0.1rem; }
  .toc-finding a { padding-left: 68px; font-weight: 400; color: hsl(var(--foreground)); background: transparent; }
  /* El TOC del documento no depende de la indentación configurable del
     sidebar: todas sus subsecciones comparten exactamente el mismo nivel. */
  .report-toc .toc-level-2 a,
  .report-toc .toc-finding a { padding-left: 3rem !important; font-weight: 400 !important; }
  .report-toc .toc-level-3 a { padding-left: 4.25rem !important; font-weight: 400 !important; }
  /* El índice lateral necesita reglas específicas porque su estado activo
     tiene mayor especificidad que el estilo general del enlace. */
  .report-sidebar .toc-level-2 a { padding-left: 1.75rem !important; font-weight: 400; }
  .report-sidebar .toc-level-3 a,
  .report-sidebar .toc-finding a { padding-left: 2.75rem !important; font-weight: 400; }
  .report-sidebar .toc-level-2 a.is-active,
  .report-sidebar .toc-level-3 a.is-active,
  .report-sidebar .toc-finding a.is-active { font-weight: 400; }
  .pdf-page-background, .report-print-page-footers, .report-print-footer { display: none; }

  /* Sidebar colapsable en HTML exportado */
  .sidebar-rail-btn {
    position: absolute;
    top: 0.75rem;
    left: -14px;
    z-index: 40;
    width: 28px;
    height: 28px;
    border-radius: 9999px;
    border: 1px solid hsl(var(--border));
    background: hsl(var(--background));
    color: hsl(var(--foreground));
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 6px 16px rgb(0 0 0 / 0.18);
    padding: 0;
  }
  .sidebar-rail-btn:hover { color: hsl(var(--brand)); }
  .sidebar-rail-btn-floating {
    position: sticky;
    top: 5.5rem;
    align-self: flex-start;
    margin-left: -10px;
    height: 28px;
    display: none;
  }
  html[data-sidebar="closed"] #report-sidebar { display: none; }
  html[data-sidebar="closed"] .sidebar-rail-btn-floating { display: inline-flex; }
  html[data-sidebar="closed"] .report-main { flex: 1 1 100%; }

  @media (max-width: 1023px) {
    .report-layout { flex-direction: column; padding: 0.75rem 24px; }
    .report-sidebar { width: 100%; flex-basis: auto; position: static; height: auto; }
    .sidebar-rail-btn, .sidebar-rail-btn-floating { display: none !important; }
  }
  @media (max-width: 640px) {
    .report-page { padding: 1.4rem 1.2rem; }
    .cover-meta { grid-template-columns: 1fr; }
    .pentester-card { grid-template-columns: 1fr; }
  }
`;

// CSS extra solo para impresión / PDF. Aplica el modo elegido como light/dark
// y oculta cualquier elemento marcado como `.no-print`.
export const REPORT_PRINT_CSS = `
  @media print {
    @page { size: A4; margin: 0; }
    html, body {
      background: hsl(var(--background)) !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    /* Ocultar TODO lo que no sea contenido del reporte */
    .no-print,
    header.app-header,
    .sidebar-rail-btn,
    .sidebar-rail-btn-floating,
    #report-sidebar,
    aside.report-sidebar {
      display: none !important;
    }
    /* El sidebar global del dashboard tiene un "gap" hermano que conserva
       19rem incluso cuando se oculta el sidebar visual. Ocultamos el
       contenedor completo para que nunca reserve una franja al imprimir. */
    [class~="group/sidebar-wrapper"] > div[data-side][data-variant][data-state] {
      display: none !important;
    }
    [class~="group/sidebar-wrapper"] > main {
      width: 100% !important;
      min-width: 0 !important;
      flex: 1 1 100% !important;
    }
    .report-shell { position: relative !important; background: hsl(var(--card)) !important; isolation: isolate; }
    /* Capa fija repetida por Chromium en cada hoja. Evita que el fragmento
       final de una sección oscura herede el blanco del visor PDF. */
    .pdf-page-background {
      display: block !important;
      position: fixed !important;
      inset: 0 !important;
      z-index: 0 !important;
      background: hsl(var(--card)) !important;
      pointer-events: none !important;
    }
    .report-layout {
      padding: 0 !important;
      gap: 0 !important;
      max-width: none !important;
      margin: 0 !important;
      display: block !important;
    }
    .report-main {
      position: relative !important;
      z-index: 1 !important;
      display: block !important;
      flex: none !important;
      max-width: none !important;
      width: 100% !important;
      min-width: 0 !important;
      border: 0 !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      margin: 0 !important;
      overflow: visible !important;
    }
    .report-page {
      /* Se replica al fragmentarse: margen seguro superior e inferior en
         cada página interior, no solo en el inicio del documento. */
      padding: 1.2cm 0.9cm !important;
      background: hsl(var(--card)) !important;
      -webkit-box-decoration-break: clone;
      box-decoration-break: clone;
      page-break-inside: auto;
      break-inside: auto;
    }
    .report-cover { background: hsl(var(--background)) !important; }
    .report-toc { page-break-after: always; break-after: page; }
    .report-toc h1 {
      margin-top: 0 !important;
      padding-bottom: 0.45rem !important;
      border-bottom: 2px solid hsl(var(--brand)) !important;
      color: hsl(var(--foreground)) !important;
      font-size: 1.6rem !important;
      font-weight: 700 !important;
    }
    .report-toc .toc-list { gap: 0.05rem; }
    .report-toc .toc-list a,
    .report-toc .toc-list a.is-active,
    .report-toc .toc-list a:hover {
      padding: 0.1rem 0.5rem;
      background: transparent !important;
      color: hsl(var(--foreground)) !important;
    }
    .report-toc .toc-level-2 a,
    .report-toc .toc-finding a { padding-left: 3rem !important; font-weight: 400 !important; }
    .report-toc .toc-level-3 a { padding-left: 4.25rem !important; font-weight: 400 !important; }
    .report-print-page-footers {
      display: block !important;
      position: absolute !important;
      inset: 0 auto auto 0 !important;
      width: 100% !important;
      z-index: 2 !important;
      pointer-events: none !important;
    }
    .report-print-footer {
      position: absolute !important;
      left: 0.9cm !important;
      right: 0.9cm !important;
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      color: hsl(var(--muted-foreground)) !important;
      font-size: 0.68rem !important;
      line-height: 1 !important;
      letter-spacing: 0.02em !important;
    }
    /* Tipografía más compacta para que entre más contenido por página */
    .prose { font-size: 0.82rem !important; line-height: 1.55 !important; }
    .prose h1 { font-size: 1.6rem !important; page-break-before: always; break-before: page; }
    .report-toc + .report-page .prose > h1:first-child { page-break-before: auto; break-before: auto; }
    .prose h2 { font-size: 1.25rem !important; margin-top: 1.1rem !important; }
    .prose h3 { font-size: 1.05rem !important; margin-top: 0.8rem !important; }
    .prose h4 { font-size: 0.95rem !important; }
    .prose p, .prose li { margin: 0.35em 0 !important; }
    .prose table { font-size: 0.78rem !important; table-layout: auto !important; }
    .prose td, .prose th { padding: 5px 7px !important; }
    .prose td:has(.inline-flex) { width: 1% !important; white-space: nowrap !important; }
    .prose td .inline-flex { white-space: nowrap !important; }
    .prose pre, .prose code { font-size: 0.74rem !important; }
    /* En PDF el código siempre va en wrap para que no se corte por el ancho. */
    [data-code-root] { overflow: visible !important; }
    [data-code-toolbar] { display: none !important; }
    [data-code-root] pre, [data-code-root] code,
    .prose pre, .prose pre code {
      white-space: pre-wrap !important;
      word-break: break-word !important;
      overflow-wrap: anywhere !important;
      overflow: visible !important;
      width: auto !important;
      min-width: 0 !important;
    }
    .badge-sev { font-size: 0.68rem !important; padding: 0.18rem 0.55rem !important; }
    .pentester-card { padding: 0.55rem 0.75rem !important; gap: 0.4rem 1rem !important; font-size: 0.78rem !important; }
    .pentester-card .item .value { font-size: 0.78rem !important; }
    .cover-meta-card { padding: 0.7rem 0.85rem !important; }
    .cover-meta-value { font-size: 0.85rem !important; }
    .hero-value { font-size: 1.5rem !important; }
    /* Portada: ocupa exactamente UNA página y NO añade página en blanco después */
    .report-cover {
      height: 297mm;
      min-height: 297mm;
      max-height: 297mm;
      padding: 2.4cm 1.6cm 1.6cm !important;
      border-radius: 0 !important;
      border: 0 !important;
      margin: 0 !important;
      box-sizing: border-box;
      page-break-after: always;
      break-after: page;
      page-break-before: avoid;
      break-before: avoid;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .hero-summary-row { display: flex !important; flex-direction: row !important; gap: 0.5rem !important; }
    .hero-summary-cell { flex: 1 1 0 !important; min-width: 0 !important; }
    .pentester-card { page-break-inside: avoid; break-inside: avoid; }
    .prose h1, .prose h2, .prose h3, .prose h4 {
      page-break-after: avoid;
      break-after: avoid;
    }
    .prose p, .prose ul, .prose ol, .prose blockquote, .prose pre,
    .prose table, .prose img, .prose li,
    .todo-block, .badge-sev, .cover-meta-card {
      page-break-inside: avoid;
      break-inside: avoid;
    }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
`;

// Construye el bloque <style> del HTML exportado. Recibe el tema preferido
// para que el archivo descargado abra con esa apariencia.
export function buildReportHtmlStyles(initialTheme: 'light' | 'dark') {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500&display=swap');
    ${REPORT_SHARED_CSS}
    ${REPORT_PRINT_CSS}
    .app-header {
      background: hsl(var(--background) / 0.92);
      border-bottom: 1px solid hsl(var(--border));
      backdrop-filter: blur(12px);
      position: sticky;
      top: 0;
      z-index: 30;
    }
    .app-header-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.65rem 24px;
      min-height: 3.5rem;
      width: 100%;
    }
    .app-header-brand {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 700;
      min-width: 0;
    }
    .app-header-logo {
      height: 1.8rem;
      width: auto;
      max-width: 200px;
      object-fit: contain;
      object-position: left center;
    }
    .app-header-mark {
      display: inline-flex;
      align-items: center;
      color: hsl(var(--brand));
    }
    .app-header-mark svg { height: 1.6rem; width: 1.6rem; }
    .app-header-title-brand {
      color: hsl(var(--foreground));
      font-family: 'Space Grotesk', sans-serif;
    }
    .app-header-title {
      font-size: 0.95rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .app-header-actions { display: flex; align-items: center; gap: 0.5rem; }
    .header-icon-btn {
      width: 36px;
      height: 36px;
      border-radius: 9999px;
      border: 1px solid hsl(var(--border));
      background: hsl(var(--card));
      color: hsl(var(--foreground));
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      cursor: pointer;
      transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
    }
    .header-icon-btn:hover { background: hsl(var(--primary) / 0.10); color: hsl(var(--brand)); border-color: hsl(var(--brand)); }
    .theme-icon { display: none; }
    html.dark .theme-icon-sun { display: inline-flex; }
    html.light .theme-icon-moon { display: inline-flex; }
    .header-icon-btn-mobile { display: none; }
    @media (max-width: 1023px) {
      .header-icon-btn-mobile { display: inline-flex; }
    }

    /* Bloques de código en el HTML exportado: Tailwind no existe aquí, así que
       replicamos la posición y los estilos del botón de copiar del preview
       (arriba a la derecha, dentro de la caja; visible al hover del bloque). */
    [data-code-root] { position: relative; }
    [data-code-toolbar] {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      z-index: 10;
      display: flex;
      align-items: center;
      gap: 0.25rem;
      opacity: 0;
      transition: opacity 0.2s ease;
    }
    [data-code-root]:hover [data-code-toolbar] { opacity: 1; }
    [data-code-copy] {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 2rem;
      width: 2rem;
      padding: 0;
      border: 0;
      border-radius: 0.375rem;
      background: transparent;
      color: hsl(var(--foreground));
      cursor: pointer;
      transition: background-color 0.2s ease, color 0.2s ease;
    }
    [data-code-copy]:hover {
      background: hsl(var(--primary) / 0.2);
      color: hsl(var(--primary));
    }
    [data-code-copy] svg { height: 1rem; width: 1rem; }

    html { color-scheme: ${initialTheme}; }
  `;
}
