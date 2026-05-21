/**
 * Traductor de `ReportTheme` a CSS. Genera el bloque de variables (compatible
 * con `REPORT_THEME_VARIABLES`), las reglas extra que dependen del tema
 * (fuentes, radios, sombras, hero) y la URL de Google Fonts a precargar.
 *
 * Cualquier consumidor (preview, HTML exportado, PDF) debe usar las mismas
 * tres salidas para garantizar identidad pixel-perfect.
 */

import {
  fontFamilyCss,
  googleFontsHref,
  type CuratedFont,
} from './report-fonts';
import type {
  HslChannels,
  ReportTheme,
  ReportThemeColors,
  ShadowScale,
  SpacingScale,
} from './report-themes';

type Mode = 'light' | 'dark';

const codeTokens = {
  light: `
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

function colorsToVars(c: ReportThemeColors, mode: Mode): string {
  return `
    --background: ${c.background};
    --foreground: ${c.foreground};
    --card: ${c.card};
    --card-foreground: ${c.cardForeground};
    --popover: ${c.card};
    --popover-foreground: ${c.cardForeground};
    --primary: ${c.primary};
    --primary-foreground: ${c.primaryForeground};
    --brand: ${c.brand};
    --brand-foreground: ${c.brandForeground};
    --secondary: ${c.muted};
    --secondary-foreground: ${c.foreground};
    --muted: ${c.muted};
    --muted-foreground: ${c.mutedForeground};
    --accent: ${c.primary};
    --accent-foreground: ${c.primaryForeground};
    --destructive: ${c.severityCritical};
    --destructive-foreground: ${c.severityCriticalForeground};
    --border: ${c.border};
    --input: ${c.border};
    --ring: ${c.primary};
    --severity-critical: ${c.severityCritical};
    --severity-critical-foreground: ${c.severityCriticalForeground};
    --severity-high: ${c.severityHigh};
    --severity-high-foreground: ${c.severityHighForeground};
    --severity-medium: ${c.severityMedium};
    --severity-medium-foreground: ${c.severityMediumForeground};
    --severity-low: ${c.severityLow};
    --severity-low-foreground: ${c.severityLowForeground};
    --severity-informational: ${c.severityInformational};
    --severity-informational-foreground: ${c.severityInformationalForeground};
    --todo: ${c.todo};
    --todo-foreground: ${c.todoForeground};
    --surface-cover: ${c.surfaceCover};
    --surface-card-strong: ${c.surfaceCardStrong};
    --surface-card-strong-foreground: ${c.surfaceCardStrongForeground};
    --surface-card-strong-border: ${c.surfaceCardStrongBorder};
    ${codeTokens[mode]}
  `;
}

/**
 * Bloque CSS de variables para el modo indicado. Reemplaza al obsoleto
 * `REPORT_THEME_VARIABLES.light/.dark`.
 */
export function themeVariablesBlock(mode: Mode, theme: ReportTheme): string {
  const palette = mode === 'dark' ? theme.dark : theme.light;
  return colorsToVars(palette, mode);
}

/** Estilo inline equivalente, para aplicar variables CSS desde React. */
export function themeVariablesStyle(mode: Mode, theme: ReportTheme): Record<string, string> {
  const block = themeVariablesBlock(mode, theme);
  const result: Record<string, string> = {};
  block
    .split(';')
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      const [rawKey, ...rest] = line.split(':');
      const key = rawKey.trim();
      const value = rest.join(':').trim();
      if (key.startsWith('--') && value) {
        result[key] = value;
      }
    });
  return result;
}

function spacingToCss(spacing: SpacingScale): { page: string; cover: string; gap: string } {
  switch (spacing) {
    case 'compact':
      return { page: '1.65rem 1.9rem', cover: '2.25rem 1.9rem', gap: '0.5rem' };
    case 'roomy':
      return { page: '2.75rem 3rem', cover: '3.5rem 3rem', gap: '1rem' };
    default:
      return { page: '2.25rem 2.5rem', cover: '3rem 2.5rem', gap: '0.75rem' };
  }
}

function headingScaleToCss(scale: 'compact' | 'cozy' | 'roomy'): {
  h1: string;
  h2: string;
  h3: string;
  cover: string;
} {
  switch (scale) {
    case 'compact':
      return {
        h1: '1.75rem',
        h2: '1.3rem',
        h3: '1.05rem',
        cover: 'clamp(1.75rem, 4vw, 2.75rem)',
      };
    case 'roomy':
      return {
        h1: '2.5rem',
        h2: '1.75rem',
        h3: '1.35rem',
        cover: 'clamp(2.25rem, 6vw, 4rem)',
      };
    default:
      return {
        h1: '2.1rem',
        h2: '1.5rem',
        h3: '1.18rem',
        cover: 'clamp(2rem, 5vw, 3.5rem)',
      };
  }
}

function shadowToCss(shadow: ShadowScale): { main: string; card: string; sidebar: string } {
  switch (shadow) {
    case 'none':
      return { main: 'none', card: 'none', sidebar: 'none' };
    case 'subtle':
      return {
        main: '0 4px 12px rgb(0 0 0 / 0.05)',
        card: '0 2px 6px rgb(0 0 0 / 0.04)',
        sidebar: '0 4px 12px rgb(0 0 0 / 0.06)',
      };
    case 'strong':
      return {
        main: '0 30px 60px rgb(0 0 0 / 0.18)',
        card: '0 14px 30px rgb(0 0 0 / 0.14)',
        sidebar: '0 18px 40px rgb(0 0 0 / 0.20)',
      };
    default:
      return {
        main: '0 16px 40px rgb(0 0 0 / 0.10)',
        card: '0 6px 16px rgb(0 0 0 / 0.06)',
        sidebar: '0 8px 30px rgb(0 0 0 / 0.10)',
      };
  }
}

function badgeRadius(shape: 'pill' | 'square' | 'flag', baseRadius: number): string {
  if (shape === 'pill') return '9999px';
  if (shape === 'square') return `${Math.min(baseRadius, 4)}px`;
  // flag: redondeo asimétrico
  const r = `${Math.min(baseRadius, 6)}px`;
  return `0 ${r} ${r} 0`;
}

function calloutCss(style: 'soft' | 'outline' | 'solid'): string {
  switch (style) {
    case 'outline':
      return `
        background: transparent;
        border: 1px solid hsl(var(--brand));
        color: hsl(var(--foreground));
      `;
    case 'solid':
      return `
        background: hsl(var(--brand));
        border: 1px solid hsl(var(--brand));
        color: hsl(var(--brand-foreground));
      `;
    default:
      return `
        background: hsl(var(--muted) / 0.55);
        border-left: 4px solid hsl(var(--brand));
        color: hsl(var(--foreground));
      `;
  }
}

function tocHighlightCss(style: 'brand-bar' | 'underline' | 'plain'): string {
  switch (style) {
    case 'underline':
      return `
        .toc-list a.is-active {
          color: hsl(var(--brand));
          background: transparent;
          border-bottom: 2px solid hsl(var(--brand));
          border-radius: 0;
          font-weight: 600;
        }
        .toc-vuln {
          border-left: 0 !important;
          background: transparent !important;
          border-bottom: 1px dashed hsl(var(--brand) / 0.4);
          border-radius: 0 !important;
        }
      `;
    case 'plain':
      return `
        .toc-list a.is-active {
          color: hsl(var(--brand));
          background: transparent;
          font-weight: 700;
        }
        .toc-vuln {
          border-left: 0 !important;
          background: transparent !important;
        }
      `;
    default:
      return '';
  }
}

function heroBackground(theme: ReportTheme, mode: Mode): string {
  const { hero } = theme;
  const layers: string[] = [];
  layers.push(
    `linear-gradient(180deg, hsl(${hero.gradientFrom} / 0.18) 0%, hsl(${hero.gradientTo} / ${mode === 'dark' ? 0.05 : 0.4}) 70%, hsl(var(--surface-cover)) 100%)`,
  );
  if (hero.backgroundImage) {
    const overlay = hero.overlay;
    layers.unshift(
      `linear-gradient(hsl(${overlay.color} / ${overlay.opacity}), hsl(${overlay.color} / ${overlay.opacity})), url("${hero.backgroundImage}") center/cover no-repeat`,
    );
  }
  return layers.join(', ');
}

/**
 * Reglas extra que dependen del tema (fuentes, formas, hero...). Se inyectan
 * después de `REPORT_SHARED_CSS` para ganar especificidad sin reescribirlo.
 */
export function themeExtrasCSS(theme: ReportTheme): string {
  const body = fontFamilyCss(theme.typography.familyBody, 'sans');
  const head = fontFamilyCss(theme.typography.familyHeadline, 'sans');
  const monoFamily = fontFamilyCss(theme.typography.familyMono, 'mono');
  const radius = `${theme.shape.radius}px`;
  const radiusSm = `${Math.max(2, theme.shape.radius - 4)}px`;
  const border = `${theme.shape.borderWidth}px`;
  const sp = spacingToCss(theme.shape.spacing);
  const sh = shadowToCss(theme.shape.shadow);
  const hs = headingScaleToCss(theme.typography.headingScale);
  const badgeR = badgeRadius(theme.badge.shape, theme.shape.radius);
  const heroLight = heroBackground(theme, 'light');
  const heroDark = heroBackground(theme, 'dark');

  return `
    body, .report-shell { font-family: ${body}; font-size: ${theme.typography.baseSize}px; line-height: ${theme.typography.lineHeight}; }
    .prose { font-size: 1rem; line-height: ${theme.typography.lineHeight}; }
    h1, h2, h3, h4, h5, h6,
    .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6,
    .report-cover .cover-title { font-family: ${head}; }
    pre, code, .prose pre, .prose code, .pending-context { font-family: ${monoFamily}; }

    .report-main { border-radius: ${radius}; border-width: ${border}; box-shadow: ${sh.main}; }
    .report-page { padding: ${sp.page}; }
    .report-cover { padding: ${sp.cover}; }
    .report-cover .cover-title { font-size: ${hs.cover}; }
    .prose h1 { font-size: ${hs.h1}; }
    .prose h2 { font-size: ${hs.h2}; }
    .prose h3 { font-size: ${hs.h3}; }

    .cover-meta-card,
    .hero-summary-cell,
    .pentester-card,
    .sidebar-card,
    .sidebar-panel,
    .pending-link { border-radius: ${radius}; border-width: ${border}; }
    .cover-meta-card, .pentester-card { box-shadow: ${sh.card}; }
    .sidebar-panel { box-shadow: ${sh.sidebar}; }
    .hero-summary-row { gap: ${sp.gap}; }

    .badge-sev { border-radius: ${badgeR}; padding: 0.25rem ${theme.badge.shape === 'flag' ? '0.9rem' : '0.75rem'}; }

    .prose blockquote { ${calloutCss(theme.callout.style)} border-radius: ${radiusSm}; }

    :root, .light {
      --report-radius: ${radius};
      --report-radius-sm: ${radiusSm};
      --report-font-body: ${body};
      --report-font-headline: ${head};
      --report-font-mono: ${monoFamily};
    }
    .dark { --report-radius: ${radius}; --report-radius-sm: ${radiusSm}; }

    .toc-level-2 a { padding-left: ${theme.sidebarStyle.tocIndent}px; }
    .toc-level-3 a { padding-left: ${theme.sidebarStyle.tocIndent * 2}px; }
    ${tocHighlightCss(theme.sidebarStyle.highlight)}

    :root, .light { --hero-bg: ${heroLight}; }
    .dark { --hero-bg: ${heroDark}; }
    .report-cover { background: var(--hero-bg); }
    .report-cover::after {
      background: radial-gradient(ellipse at 90% -20%, hsl(${theme.hero.accent} / 0.18), transparent 60%);
    }
  `;
}

/** URL Google Fonts con todas las familias del tema. */
export function themeFontsHref(theme: ReportTheme): string {
  return googleFontsHref([
    theme.typography.familyBody,
    theme.typography.familyHeadline,
    theme.typography.familyMono,
  ]);
}

/** Lista de objetos `CuratedFont` usados por el tema. */
export function themeFonts(theme: ReportTheme): CuratedFont[] {
  return [
    theme.typography.familyBody,
    theme.typography.familyHeadline,
    theme.typography.familyMono,
  ]
    .map((family) => ({ family }))
    .filter(Boolean) as unknown as CuratedFont[];
}
