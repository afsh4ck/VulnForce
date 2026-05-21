/**
 * VulnForce design tokens — single source of truth.
 *
 * All colours are expressed in HSL channel form (H S% L%) to remain compatible
 * with the Tailwind `hsl(var(--token))` strategy used in `globals.css` and the
 * report exporter. If you swap these values you must also update the matching
 * CSS variables in `src/app/globals.css` and the report theme variables in
 * `src/lib/report-styles.ts` so preview/HTML/PDF stay in sync.
 */

export type HslChannels = string; // "142 71% 45%"

export type ColorScale = {
  light: HslChannels;
  dark: HslChannels;
};

export const designTokens = {
  brand: {
    /** Brand green (#22C55E) used as the primary brand colour in light mode. */
    primary: { light: '142 71% 45%', dark: '76 100% 50%' } satisfies ColorScale,
    primaryForeground: { light: '0 0% 100%', dark: '76 100% 5%' } satisfies ColorScale,
    /**
     * Phosphorescent neon yellow used historically on the sidebar/logo. We keep
     * it pinned even in light mode to preserve the brand identity.
     */
    neon: '76 100% 50%' as HslChannels,
    neonForeground: '76 100% 5%' as HslChannels,
  },
  surface: {
    background: { light: '0 0% 98%', dark: '224 47% 6%' } satisfies ColorScale,
    foreground: { light: '222 47% 11%', dark: '210 40% 98%' } satisfies ColorScale,
    card: { light: '0 0% 100%', dark: '224 47% 9%' } satisfies ColorScale,
    cardForeground: { light: '222 47% 11%', dark: '210 40% 98%' } satisfies ColorScale,
    muted: { light: '240 4.8% 95.9%', dark: '220 15% 18%' } satisfies ColorScale,
    mutedForeground: { light: '240 3.8% 46.1%', dark: '215 18% 70%' } satisfies ColorScale,
    border: { light: '214 32% 91%', dark: '220 15% 22%' } satisfies ColorScale,
  },
  severity: {
    critical: { light: '0 72% 42%', dark: '0 72% 55%' } satisfies ColorScale,
    high: { light: '22 96% 50%', dark: '22 96% 58%' } satisfies ColorScale,
    medium: { light: '42 95% 48%', dark: '42 95% 58%' } satisfies ColorScale,
    low: { light: '217 90% 55%', dark: '217 90% 65%' } satisfies ColorScale,
    informational: { light: '215 14% 45%', dark: '215 12% 60%' } satisfies ColorScale,
  },
  status: {
    /** Project status semantic colours, used for badges in cards/tables. */
    completed: { light: '142 71% 38%', dark: '142 71% 50%' } satisfies ColorScale,
    inProgress: { light: '42 95% 45%', dark: '42 95% 58%' } satisfies ColorScale,
    onHold: { light: '215 14% 45%', dark: '215 12% 55%' } satisfies ColorScale,
    blocked: { light: '0 72% 42%', dark: '0 72% 55%' } satisfies ColorScale,
    archived: { light: '224 30% 32%', dark: '224 30% 60%' } satisfies ColorScale,
  },
  todo: {
    color: { light: '0 72% 50%', dark: '0 75% 60%' } satisfies ColorScale,
    foreground: { light: '0 0% 100%', dark: '0 0% 100%' } satisfies ColorScale,
  },
  /** Sidebar always stays dark to preserve brand identity in both themes. */
  sidebar: {
    background: '224 71% 2%' as HslChannels,
    foreground: '0 0% 95%' as HslChannels,
    primary: '76 100% 50%' as HslChannels,
    primaryForeground: '76 100% 5%' as HslChannels,
    accent: '224 71% 10%' as HslChannels,
    accentForeground: '0 0% 98%' as HslChannels,
    border: '224 71% 6%' as HslChannels,
    ring: '76 100% 50%' as HslChannels,
  },
  radii: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px',
  },
  spacing: {
    /** 4pt scale used across the product. */
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
  },
  typography: {
    body: ['Inter', 'sans-serif'],
    headline: ['Space Grotesk', 'sans-serif'],
    mono: ['Source Code Pro', 'monospace'],
  },
  motion: {
    fast: '120ms',
    base: '180ms',
    slow: '260ms',
    easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  },
} as const;

export const STATUS_LABELS = {
  en: {
    'In Progress': 'In Progress',
    'Completed': 'Completed',
    'On Hold': 'On Hold',
    'Blocked': 'Blocked',
    'Archived': 'Archived',
  },
  es: {
    'In Progress': 'En progreso',
    'Completed': 'Completado',
    'On Hold': 'Pendiente',
    'Blocked': 'Bloqueado',
    'Archived': 'Archivado',
  },
} as const;

export const STATUS_VARIANTS = {
  'Completed': 'status-completed',
  'In Progress': 'status-in-progress',
  'On Hold': 'status-on-hold',
  'Blocked': 'status-blocked',
  'Archived': 'status-archived',
} as const;
