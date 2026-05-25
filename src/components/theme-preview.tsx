'use client';

import React, { useEffect, useMemo, useId } from 'react';
import { themeExtrasCSS, themeVariablesBlock, themeVariablesStyle } from '@/lib/theme-to-css';
import { loadFontFamilies } from '@/lib/report-fonts';
import type { ReportTheme } from '@/lib/report-themes';

type Variant = 'mini' | 'full';

/**
 * Extracto real del informe demo "Q3 Web App Pentest" (proj-1) para que el
 * preview muestre contenido auténtico en vez de texto ficticio.
 */
const DEMO = {
  kicker: 'Security Assessment Report',
  title: 'Q3 Web App Pentest',
  client: 'Hack The Box',
  summary: { total: 2, critical: 1, high: 1 },
  intro:
    'This report details the findings of the penetration test conducted on Q3 Web App Pentest for Hack The Box. The assessment identified 2 vulnerabilities, including 1 critical and 1 high-risk finding.',
  findings: [
    {
      title: 'SQL Injection on Login Form',
      severity: 'Critical' as const,
      body:
        "The 'username' parameter of the login POST request to /auth/login is vulnerable. By submitting a crafted payload like ' OR '1'='1' --, an attacker can manipulate the backend SQL query and log in as an administrator.",
      impact:
        'Successful exploitation grants unauthorized access to the application, leading to full compromise and data exfiltration.',
    },
    {
      title: 'Stored Cross-Site Scripting (XSS) in User Profile',
      severity: 'High' as const,
      body:
        "The 'bio' field in the user profile does not sanitize input before storing and rendering it. A malicious script set as a biography executes when another user views the profile.",
    },
  ],
} as const;

interface ThemePreviewProps {
  theme: ReportTheme;
  mode?: 'light' | 'dark';
  variant?: Variant;
  className?: string;
  /** Cuando es true, muestra una hoja A4 falsa con cover + 2 findings + sidebar. */
  showFull?: boolean;
}

/**
 * Renderiza un preview de un tema sin iframe, usando un contenedor con scope
 * `data-theme-scope` que aplica las variables CSS del tema mediante `style`
 * inline. Las reglas extra del tema se inyectan como un `<style>` local
 * delimitado por el atributo `data-scope-id` para no afectar al resto de la UI.
 */
export function ThemePreview({ theme, mode = 'light', variant = 'mini', className, showFull }: ThemePreviewProps) {
  const scopeId = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const styleVars = useMemo(() => themeVariablesStyle(mode, theme), [mode, theme]);

  useEffect(() => {
    loadFontFamilies([
      theme.typography.familyBody,
      theme.typography.familyHeadline,
      theme.typography.familyMono,
    ]);
  }, [theme]);

  // Generamos el CSS extra del tema y le añadimos el prefijo de scope a cada
  // selector para que solo afecte al preview, no al resto de la app.
  const scopedExtras = useMemo(() => {
    const raw = themeExtrasCSS(theme);
    // Anteponer el selector de scope a cada selector dentro del bloque.
    // Estrategia simple: dividir por `}` y a cada selector antes de `{` añadir
    // `[data-theme-scope="..."] `.
    const prefix = `[data-theme-scope="${scopeId}"]`;
    return raw
      .split('}')
      .map((chunk) => {
        const idx = chunk.indexOf('{');
        if (idx === -1) return chunk;
        const selectors = chunk.slice(0, idx).split(',').map((s) => s.trim()).filter(Boolean);
        const body = chunk.slice(idx);
        const scoped = selectors
          .map((sel) => {
            if (sel.startsWith(':root') || sel.startsWith('.light') || sel.startsWith('.dark')) {
              // Variables a nivel root: las aplicamos al wrapper.
              return prefix;
            }
            return `${prefix} ${sel}`;
          })
          .join(', ');
        return `${scoped}${body}`;
      })
      .join('}');
  }, [theme, scopeId]);

  const isFull = variant === 'full' || showFull;

  return (
    <div
      data-theme-scope={scopeId}
      className={['theme-preview', mode, className].filter(Boolean).join(' ')}
      style={{
        ...(styleVars as React.CSSProperties),
        background: 'hsl(var(--background))',
        color: 'hsl(var(--foreground))',
        borderRadius: 'var(--report-radius, 12px)',
        overflow: 'hidden',
        border: '1px solid hsl(var(--border))',
        fontFamily: 'var(--report-font-body, system-ui, sans-serif)',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: scopedExtras }} />
      {isFull ? <FullPreview theme={theme} /> : <MiniPreview theme={theme} />}
    </div>
  );
}

function SeverityChip({ label, kind }: { label: string; kind: 'critical' | 'high' | 'medium' | 'low' | 'informational' }) {
  return <span className={`badge-sev ${kind}`}>{label}</span>;
}

function MiniPreview({ theme: _theme }: { theme: ReportTheme }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div
        className="report-cover"
        style={{
          padding: '1.1rem 1.2rem 1.4rem',
          minHeight: 0,
          borderBottom: '1px solid hsl(var(--border))',
          position: 'relative',
        }}
      >
        <p style={{ color: 'hsl(var(--brand))', fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', margin: 0 }}>
          {DEMO.kicker}
        </p>
        <h2
          className="cover-title"
          style={{ fontFamily: 'var(--report-font-headline)', fontSize: '1.15rem', margin: '0.35rem 0 0.2rem', color: 'hsl(var(--foreground))', fontWeight: 700, letterSpacing: '-0.01em' }}
        >
          {DEMO.title}
        </h2>
        <p style={{ margin: 0, color: 'hsl(var(--muted-foreground))', fontSize: '0.7rem' }}>
          {DEMO.client}
        </p>
        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.7rem' }}>
          <SeverityChip label="Critical" kind="critical" />
          <SeverityChip label="High" kind="high" />
        </div>
      </div>
      <div style={{ padding: '0.8rem 1.2rem 1rem' }}>
        <h3
          style={{ fontFamily: 'var(--report-font-headline)', fontSize: '0.8rem', margin: 0, color: 'hsl(var(--foreground))', fontWeight: 700 }}
        >
          {DEMO.findings[0].title}
        </h3>
        <p
          style={{
            margin: '0.35rem 0 0',
            color: 'hsl(var(--muted-foreground))',
            fontSize: '0.62rem',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {DEMO.findings[0].body}
        </p>
      </div>
    </div>
  );
}

function FullPreview({ theme: _theme }: { theme: ReportTheme }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 200px', gap: '0.75rem', padding: '0.75rem', background: 'hsl(var(--background))' }}>
      <div className="report-main" style={{ background: 'hsl(var(--card))' }}>
        <div className="report-cover" style={{ padding: '1.4rem 1.5rem', minHeight: 0, borderBottom: '1px solid hsl(var(--border))', position: 'relative' }}>
          <p style={{ color: 'hsl(var(--brand))', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', margin: 0 }}>
            {DEMO.kicker}
          </p>
          <h1 className="cover-title" style={{ margin: '0.4rem 0 0.3rem' }}>{DEMO.title}</h1>
          <p style={{ color: 'hsl(var(--muted-foreground))', margin: 0, fontSize: '0.85rem' }}>{DEMO.client}</p>
          <div className="hero-summary-row" style={{ marginTop: '1rem' }}>
            <div className="hero-summary-cell is-total"><p className="hero-label">Total</p><p className="hero-value">{DEMO.summary.total}</p></div>
            <div className="hero-summary-cell sev-critical-cell"><p className="hero-label">Critical</p><p className="hero-value">{DEMO.summary.critical}</p></div>
            <div className="hero-summary-cell sev-high-cell"><p className="hero-label">High</p><p className="hero-value">{DEMO.summary.high}</p></div>
          </div>
        </div>
        <div className="report-page prose" style={{ padding: '1rem 1.4rem' }}>
          <h2>Executive Summary</h2>
          <p>{DEMO.intro}</p>
          <h2>{DEMO.findings[0].title}</h2>
          <p>{DEMO.findings[0].body}</p>
          <SeverityChip label="Critical" kind="critical" />
          <blockquote>
            <strong>Impact:</strong> {DEMO.findings[0].impact}
          </blockquote>
          <h2>{DEMO.findings[1].title}</h2>
          <p>{DEMO.findings[1].body}</p>
          <SeverityChip label="High" kind="high" />
        </div>
      </div>
      <aside className="sidebar-panel" style={{ alignSelf: 'flex-start' }}>
        <h3 className="sidebar-heading">Contents</h3>
        <ul className="toc-list">
          <li className="toc-level-1"><a className="is-active" href="#a">Executive Summary</a></li>
          <li className="toc-level-2 toc-vuln"><a href="#b">SQL Injection on Login Form</a></li>
          <li className="toc-level-2 toc-vuln"><a href="#c">Stored XSS in User Profile</a></li>
          <li className="toc-level-3"><a href="#d">Technical Description</a></li>
        </ul>
      </aside>
    </div>
  );
}
