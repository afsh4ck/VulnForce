'use client';

import React, { useEffect, useMemo, useId } from 'react';
import { themeExtrasCSS, themeVariablesBlock, themeVariablesStyle } from '@/lib/theme-to-css';
import { loadFontFamilies } from '@/lib/report-fonts';
import type { ReportTheme } from '@/lib/report-themes';

type Variant = 'mini' | 'full';

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

function MiniPreview({ theme }: { theme: ReportTheme }) {
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
          Security Report
        </p>
        <h2
          className="cover-title"
          style={{ fontFamily: 'var(--report-font-headline)', fontSize: '1.15rem', margin: '0.35rem 0 0.2rem', color: 'hsl(var(--foreground))', fontWeight: 700, letterSpacing: '-0.01em' }}
        >
          {theme.name}
        </h2>
        <p style={{ margin: 0, color: 'hsl(var(--muted-foreground))', fontSize: '0.7rem' }}>
          ACME Corp
        </p>
        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.7rem' }}>
          <SeverityChip label="Critical" kind="critical" />
          <SeverityChip label="High" kind="high" />
        </div>
      </div>
      <div style={{ padding: '0.75rem 1.2rem 1rem', display: 'grid', gap: '0.45rem' }}>
        <div
          style={{
            height: 6,
            background: 'hsl(var(--brand))',
            width: '40%',
            borderRadius: 3,
          }}
        />
        <div style={{ height: 4, background: 'hsl(var(--muted))', width: '90%', borderRadius: 2 }} />
        <div style={{ height: 4, background: 'hsl(var(--muted))', width: '78%', borderRadius: 2 }} />
        <div style={{ height: 4, background: 'hsl(var(--muted))', width: '85%', borderRadius: 2 }} />
      </div>
    </div>
  );
}

function FullPreview({ theme }: { theme: ReportTheme }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 200px', gap: '0.75rem', padding: '0.75rem', background: 'hsl(var(--background))' }}>
      <div className="report-main" style={{ background: 'hsl(var(--card))' }}>
        <div className="report-cover" style={{ padding: '1.4rem 1.5rem', minHeight: 0, borderBottom: '1px solid hsl(var(--border))', position: 'relative' }}>
          <p style={{ color: 'hsl(var(--brand))', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', margin: 0 }}>
            Security Assessment Report
          </p>
          <h1 className="cover-title" style={{ margin: '0.4rem 0 0.3rem' }}>{theme.name}</h1>
          <p style={{ color: 'hsl(var(--muted-foreground))', margin: 0, fontSize: '0.85rem' }}>ACME Corp</p>
          <div className="hero-summary-row" style={{ marginTop: '1rem' }}>
            <div className="hero-summary-cell is-total"><p className="hero-label">Total</p><p className="hero-value">12</p></div>
            <div className="hero-summary-cell sev-critical-cell"><p className="hero-label">Critical</p><p className="hero-value">2</p></div>
            <div className="hero-summary-cell sev-high-cell"><p className="hero-label">High</p><p className="hero-value">4</p></div>
          </div>
        </div>
        <div className="report-page prose" style={{ padding: '1rem 1.4rem' }}>
          <h2>SQL Injection in /login</h2>
          <p>
            The login endpoint concatenates user input directly into a query, allowing
            an attacker to bypass authentication and exfiltrate data.
          </p>
          <SeverityChip label="High" kind="high" />
          <blockquote>
            <strong>Recommendation:</strong> use parameterised queries and validate
            input on the server.
          </blockquote>
          <h2>Insecure CORS Policy</h2>
          <p>
            The API accepts any origin via a wildcard CORS header, exposing endpoints
            to cross-site requests.
          </p>
          <SeverityChip label="Medium" kind="medium" />
        </div>
      </div>
      <aside className="sidebar-panel" style={{ alignSelf: 'flex-start' }}>
        <h3 className="sidebar-heading">Contents</h3>
        <ul className="toc-list">
          <li className="toc-level-1"><a className="is-active" href="#a">Executive Summary</a></li>
          <li className="toc-level-2 toc-vuln"><a href="#b">SQL Injection</a></li>
          <li className="toc-level-2 toc-vuln"><a href="#c">Insecure CORS</a></li>
          <li className="toc-level-3"><a href="#d">Detail</a></li>
        </ul>
      </aside>
    </div>
  );
}
