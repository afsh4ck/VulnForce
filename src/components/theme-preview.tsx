'use client';

import React, { useEffect, useMemo, useId } from 'react';
import { themeExtrasCSS, themeVariablesStyle } from '@/lib/theme-to-css';
import { buildThemePreviewDoc } from '@/lib/theme-preview-doc';
import { loadFontFamilies } from '@/lib/report-fonts';
import type { ReportTheme } from '@/lib/report-themes';

type Variant = 'mini' | 'full';

// Portada del informe demo "Q3 Web App Pentest" para la miniatura del tema.
const DEMO = {
  kicker: 'Security Assessment Report',
  title: 'Q3 Web App Pentest',
  client: 'Hack The Box',
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

  if (isFull) {
    return <FullPreview theme={theme} mode={mode} className={className} />;
  }

  return (
    <div
      data-theme-scope={scopeId}
      className={['theme-preview', mode, className].filter(Boolean).join(' ')}
      style={{
        ...(styleVars as React.CSSProperties),
        background: 'hsl(var(--background))',
        color: 'hsl(var(--foreground))',
        overflow: 'hidden',
        fontFamily: 'var(--report-font-body, system-ui, sans-serif)',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: scopedExtras }} />
      <MiniPreview theme={theme} />
    </div>
  );
}

function MiniPreview({ theme: _theme }: { theme: ReportTheme }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div
        className="report-cover"
        style={{
          padding: '1.3rem 1.2rem',
          minHeight: 0,
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
      </div>
    </div>
  );
}

function FullPreview({ theme, mode, className }: { theme: ReportTheme; mode: 'light' | 'dark'; className?: string }) {
  const doc = useMemo(() => buildThemePreviewDoc(theme, mode), [theme, mode]);
  return (
    <iframe
      title="Theme preview"
      srcDoc={doc}
      sandbox="allow-same-origin"
      className={['w-full rounded-lg border bg-background', className].filter(Boolean).join(' ')}
      style={{ height: '70vh', display: 'block' }}
    />
  );
}
