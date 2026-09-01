import type { ReportTheme } from './report-themes';
import { REPORT_SHARED_CSS } from './report-styles';
import { themeExtrasCSS, themeVariablesBlock } from './theme-to-css';

// Documento HTML completo para el iframe de previsualización de un tema. Usa
// exactamente la misma hoja de estilos que el informe real (REPORT_SHARED_CSS)
// mas las variables y extras del tema, de modo que el popup se ve idéntico al
// preview / HTML exportado del informe.

const FONT_IMPORTS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500&display=swap');
`;

const DEMO_BODY = `
<div class="report-layout" style="padding:1.25rem">
  <main class="report-main">
    <header class="report-cover report-page">
      <p class="cover-type">Security Assessment Report</p>
      <h1 class="cover-title">Q3 Web App Pentest</h1>
      <p class="cover-client">Hack The Box</p>
      <div class="cover-meta">
        <div class="cover-meta-card"><p class="cover-meta-label">Client</p><p class="cover-meta-value">Hack The Box</p></div>
        <div class="cover-meta-card"><p class="cover-meta-label">Assessment window</p><p class="cover-meta-value">2026-07-01 &ndash; 2026-07-15</p></div>
        <div class="cover-meta-card"><p class="cover-meta-label">Generated on</p><p class="cover-meta-value">July 20, 2026</p></div>
      </div>
      <section class="hero-summary-row" style="margin-top:2.5rem">
        <div class="hero-summary-cell is-total"><p class="hero-label">Total findings</p><p class="hero-value">2</p></div>
        <div class="hero-summary-cell sev-critical-cell"><p class="hero-label">Critical</p><p class="hero-value">1</p></div>
        <div class="hero-summary-cell sev-high-cell"><p class="hero-label">High</p><p class="hero-value">1</p></div>
        <div class="hero-summary-cell sev-medium-cell"><p class="hero-label">Medium</p><p class="hero-value">0</p></div>
        <div class="hero-summary-cell sev-low-cell"><p class="hero-label">Low</p><p class="hero-value">0</p></div>
        <div class="hero-summary-cell sev-informational-cell"><p class="hero-label">Info</p><p class="hero-value">0</p></div>
      </section>
    </header>
    <section class="report-page">
      <div class="prose">
        <h1>Executive Summary</h1>
        <p>This report details the results of the penetration test performed against the internet-facing assets of Hack The Box. The assessment identified two findings that pose a material risk to the confidentiality and integrity of the environment.</p>
        <h1>Findings</h1>
        <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;margin-bottom:0.5rem">
          <h2 style="margin:0;border:0;padding:0">SQL Injection on Login Form</h2>
          <span class="badge-sev critical">Critical</span>
        </div>
        <p style="font-family:'Source Code Pro',monospace;font-size:0.85rem;color:hsl(var(--muted-foreground));margin-top:0">CVSS: 9.8</p>
        <hr />
        <h3>Description</h3>
        <p>The <code>username</code> parameter of the authentication endpoint is concatenated into a SQL query without parameterisation, allowing an unauthenticated attacker to bypass the login and enumerate the users table.</p>
        <h3>Remediation</h3>
        <p>Use parameterised queries / prepared statements for every database interaction and apply least-privilege to the application database account.</p>
        <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;margin:1.5rem 0 0.5rem">
          <h2 style="margin:0;border:0;padding:0">Stored Cross-Site Scripting in User Profile</h2>
          <span class="badge-sev high">High</span>
        </div>
        <p style="font-family:'Source Code Pro',monospace;font-size:0.85rem;color:hsl(var(--muted-foreground));margin-top:0">CVSS: 7.4</p>
        <hr />
        <h3>Description</h3>
        <p>The profile biography field is rendered without output encoding, so a stored payload executes in the browser of any user who views the profile.</p>
        <table>
          <thead><tr><th>Severity</th><th>CVSS v3.1</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td>Critical</td><td>9.0 &ndash; 10.0</td><td>Immediate system compromise.</td></tr>
            <tr><td>High</td><td>7.0 &ndash; 8.9</td><td>Unauthorised access.</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
  <aside class="report-sidebar">
    <div class="sidebar-panel">
      <h3 class="sidebar-heading">Table of contents</h3>
      <ul class="toc-list">
        <li class="toc-level-1"><a class="is-active" href="#">Executive Summary</a></li>
        <li class="toc-level-1"><a href="#">Findings</a></li>
        <li class="toc-level-2 toc-vuln"><a href="#">SQL Injection on Login Form</a></li>
        <li class="toc-level-2 toc-vuln"><a href="#">Stored Cross-Site Scripting in User Profile</a></li>
      </ul>
    </div>
  </aside>
</div>
`;

export function buildThemePreviewDoc(theme: ReportTheme, mode: 'light' | 'dark'): string {
  const vars = themeVariablesBlock(mode, theme);
  const extras = themeExtrasCSS(theme);
  return `<!doctype html>
<html lang="en" class="${mode}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
${FONT_IMPORTS}
${REPORT_SHARED_CSS}
:root { ${vars} }
${extras}
html, body { background: hsl(var(--background)); }
.report-layout { min-height: 100%; }
</style>
</head>
<body class="report-shell ${mode}">
${DEMO_BODY}
</body>
</html>`;
}
