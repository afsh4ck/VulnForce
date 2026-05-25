/**
 * Sistema de temas para reportes de VulnForce.
 *
 * Cada tema define dos paletas (light/dark), tipografía, forma, cover/hero,
 * sidebar y estilo de componentes. Las variables CSS se generan a partir de
 * estos valores mediante `src/lib/theme-to-css.ts` y se inyectan tanto en el
 * preview en vivo como en el HTML/PDF exportado, garantizando paridad pixel.
 *
 * Los valores de color son canales HSL en formato Tailwind: la cadena
 * "142 71% 45%" se usa como `hsl(var(--token))` en las hojas de estilo.
 */

export type HslChannels = string; // "142 71% 45%"

export type SpacingScale = 'compact' | 'cozy' | 'roomy';
export type HeadingScale = 'compact' | 'cozy' | 'roomy';
export type ShadowScale = 'none' | 'subtle' | 'soft' | 'strong';
export type LogoVariant = 'icon' | 'wide' | 'none';
export type SidebarHighlight = 'brand-bar' | 'underline' | 'plain';
export type BadgeShape = 'pill' | 'square' | 'flag';
export type CalloutStyle = 'soft' | 'outline' | 'solid';
export type ThemeModes = 'light' | 'dark' | 'both';

export interface ReportThemeColors {
  background: HslChannels;
  foreground: HslChannels;
  card: HslChannels;
  cardForeground: HslChannels;
  muted: HslChannels;
  mutedForeground: HslChannels;
  border: HslChannels;
  primary: HslChannels;
  primaryForeground: HslChannels;
  brand: HslChannels;
  brandForeground: HslChannels;
  severityCritical: HslChannels;
  severityCriticalForeground: HslChannels;
  severityHigh: HslChannels;
  severityHighForeground: HslChannels;
  severityMedium: HslChannels;
  severityMediumForeground: HslChannels;
  severityLow: HslChannels;
  severityLowForeground: HslChannels;
  severityInformational: HslChannels;
  severityInformationalForeground: HslChannels;
  todo: HslChannels;
  todoForeground: HslChannels;
  surfaceCover: HslChannels;
  surfaceCardStrong: HslChannels;
  surfaceCardStrongForeground: HslChannels;
  surfaceCardStrongBorder: HslChannels;
}

export interface ReportThemeTypography {
  /** Familia para titulares (`h1..h6`). */
  familyHeadline: string;
  /** Familia para el cuerpo de texto. */
  familyBody: string;
  /** Familia monoespaciada para código y metadatos. */
  familyMono: string;
  /** Tamaño base del cuerpo, en píxeles. Afecta a escala tipográfica. */
  baseSize: number;
  /** Altura de línea base. */
  lineHeight: number;
  /** Densidad vertical de la escala tipográfica. */
  headingScale: HeadingScale;
}

export interface ReportThemeShape {
  /** Radio base, en píxeles, para tarjetas, badges y botones. */
  radius: number;
  /** Grosor del borde, en píxeles. */
  borderWidth: number;
  /** Densidad de paddings y gaps. */
  spacing: SpacingScale;
  /** Intensidad de sombras. */
  shadow: ShadowScale;
}

export interface ReportThemeHero {
  /** Color inicial del degradado de la portada. */
  gradientFrom: HslChannels;
  /** Color final del degradado de la portada. */
  gradientTo: HslChannels;
  /** Acento adicional usado en glow / radial overlays. */
  accent: HslChannels;
  /** URL o dataURL opcional para una imagen de fondo en la portada. */
  backgroundImage?: string;
  /** Overlay aplicado encima de la imagen para mantener legibilidad. */
  overlay: { color: HslChannels; opacity: number };
  /** Variante de logo a mostrar en la portada. */
  logoVariant: LogoVariant;
}

export interface ReportThemeSidebarStyle {
  /** Estilo del marcador activo en el TOC. */
  highlight: SidebarHighlight;
  /** Indentación, en píxeles, por nivel del TOC. */
  tocIndent: number;
}

export interface ReportThemeBadge {
  shape: BadgeShape;
}

export interface ReportThemeCallout {
  style: CalloutStyle;
}

export interface ReportTheme {
  id: string;
  name: string;
  description?: string;
  author?: string;
  modes: ThemeModes;
  version: string;
  light: ReportThemeColors;
  dark: ReportThemeColors;
  typography: ReportThemeTypography;
  shape: ReportThemeShape;
  hero: ReportThemeHero;
  sidebarStyle: ReportThemeSidebarStyle;
  badge: ReportThemeBadge;
  callout: ReportThemeCallout;
}

const sevCriticalLight: HslChannels = '0 72% 42%';
const sevCriticalDark: HslChannels = '0 72% 55%';
const sevHighLight: HslChannels = '22 96% 50%';
const sevHighDark: HslChannels = '22 96% 58%';
const sevMediumLight: HslChannels = '42 95% 48%';
const sevMediumDark: HslChannels = '42 95% 58%';
const sevLowLight: HslChannels = '217 90% 55%';
const sevLowDark: HslChannels = '217 90% 65%';
const sevInfoLight: HslChannels = '215 14% 45%';
const sevInfoDark: HslChannels = '215 12% 60%';

const sharedSeverityLight = {
  severityCritical: sevCriticalLight,
  severityCriticalForeground: '0 0% 100%',
  severityHigh: sevHighLight,
  severityHighForeground: '0 0% 100%',
  severityMedium: sevMediumLight,
  severityMediumForeground: '36 100% 12%',
  severityLow: sevLowLight,
  severityLowForeground: '0 0% 100%',
  severityInformational: sevInfoLight,
  severityInformationalForeground: '0 0% 100%',
} as const;

const sharedSeverityDark = {
  severityCritical: sevCriticalDark,
  severityCriticalForeground: '0 0% 100%',
  severityHigh: sevHighDark,
  severityHighForeground: '0 0% 100%',
  severityMedium: sevMediumDark,
  severityMediumForeground: '36 100% 12%',
  severityLow: sevLowDark,
  severityLowForeground: '0 0% 100%',
  severityInformational: sevInfoDark,
  severityInformationalForeground: '0 0% 100%',
} as const;

/**
 * Tema por defecto, equivalente al look original de VulnForce. Verde brillante,
 * tipografía moderna y degradado discreto en la portada.
 */
const VULNFORCE_CLASSIC: ReportTheme = {
  id: 'builtin-vulnforce-classic',
  name: 'VulnForce Classic',
  description: 'Identidad original: verde fosforescente, Inter y Space Grotesk.',
  author: 'VulnForce',
  modes: 'both',
  version: '1.0.0',
  light: {
    background: '0 0% 98%',
    foreground: '222 47% 11%',
    card: '0 0% 100%',
    cardForeground: '222 47% 11%',
    muted: '210 20% 96%',
    mutedForeground: '215 16% 47%',
    border: '214 32% 91%',
    primary: '142 71% 45%',
    primaryForeground: '0 0% 100%',
    brand: '142 71% 45%',
    brandForeground: '0 0% 100%',
    ...sharedSeverityLight,
    todo: '0 72% 50%',
    todoForeground: '0 0% 100%',
    surfaceCover: '0 0% 100%',
    surfaceCardStrong: '0 0% 100%',
    surfaceCardStrongForeground: '222 47% 11%',
    surfaceCardStrongBorder: '214 32% 88%',
  },
  dark: {
    background: '224 47% 6%',
    foreground: '210 40% 98%',
    card: '224 47% 9%',
    cardForeground: '210 40% 98%',
    muted: '220 15% 18%',
    mutedForeground: '215 18% 70%',
    border: '220 15% 22%',
    primary: '76 100% 50%',
    primaryForeground: '76 100% 5%',
    brand: '76 100% 50%',
    brandForeground: '76 100% 5%',
    ...sharedSeverityDark,
    todo: '0 75% 60%',
    todoForeground: '0 0% 100%',
    surfaceCover: '224 47% 4%',
    surfaceCardStrong: '0 0% 0%',
    surfaceCardStrongForeground: '0 0% 100%',
    surfaceCardStrongBorder: '0 0% 14%',
  },
  typography: {
    familyHeadline: 'Space Grotesk',
    familyBody: 'Inter',
    familyMono: 'Source Code Pro',
    baseSize: 16,
    lineHeight: 1.75,
    headingScale: 'cozy',
  },
  shape: { radius: 12, borderWidth: 1, spacing: 'cozy', shadow: 'soft' },
  hero: {
    gradientFrom: '142 71% 45%',
    gradientTo: '0 0% 100%',
    accent: '76 100% 50%',
    overlay: { color: '224 47% 6%', opacity: 0 },
    logoVariant: 'wide',
  },
  sidebarStyle: { highlight: 'brand-bar', tocIndent: 12 },
  badge: { shape: 'pill' },
  callout: { style: 'soft' },
};

/**
 * Slate Pro: corporate, neutro y serio. Azul acero y tipografía DM Sans.
 */
const SLATE_PRO: ReportTheme = {
  id: 'builtin-slate-pro',
  name: 'Slate Pro',
  description: 'Look corporativo, azul acero y tipografía sobria para auditorías formales.',
  author: 'VulnForce',
  modes: 'both',
  version: '1.0.0',
  light: {
    background: '210 20% 98%',
    foreground: '215 28% 14%',
    card: '0 0% 100%',
    cardForeground: '215 28% 14%',
    muted: '215 20% 94%',
    mutedForeground: '215 16% 42%',
    border: '215 20% 86%',
    primary: '215 60% 38%',
    primaryForeground: '0 0% 100%',
    brand: '215 60% 38%',
    brandForeground: '0 0% 100%',
    ...sharedSeverityLight,
    todo: '14 86% 48%',
    todoForeground: '0 0% 100%',
    surfaceCover: '210 22% 96%',
    surfaceCardStrong: '0 0% 100%',
    surfaceCardStrongForeground: '215 28% 14%',
    surfaceCardStrongBorder: '215 22% 82%',
  },
  dark: {
    background: '218 30% 8%',
    foreground: '210 22% 96%',
    card: '218 28% 12%',
    cardForeground: '210 22% 96%',
    muted: '218 22% 18%',
    mutedForeground: '215 18% 68%',
    border: '218 22% 22%',
    primary: '210 95% 65%',
    primaryForeground: '218 40% 8%',
    brand: '210 95% 65%',
    brandForeground: '218 40% 8%',
    ...sharedSeverityDark,
    todo: '14 85% 60%',
    todoForeground: '0 0% 100%',
    surfaceCover: '218 30% 6%',
    surfaceCardStrong: '218 28% 10%',
    surfaceCardStrongForeground: '210 22% 96%',
    surfaceCardStrongBorder: '218 22% 22%',
  },
  typography: {
    familyHeadline: 'DM Sans',
    familyBody: 'DM Sans',
    familyMono: 'JetBrains Mono',
    baseSize: 15,
    lineHeight: 1.7,
    headingScale: 'cozy',
  },
  shape: { radius: 8, borderWidth: 1, spacing: 'cozy', shadow: 'subtle' },
  hero: {
    gradientFrom: '215 60% 38%',
    gradientTo: '210 22% 96%',
    accent: '210 95% 65%',
    overlay: { color: '218 30% 8%', opacity: 0 },
    logoVariant: 'wide',
  },
  sidebarStyle: { highlight: 'underline', tocIndent: 14 },
  badge: { shape: 'square' },
  callout: { style: 'outline' },
};

/**
 * Carbon: tema oscuro técnico, neutros profundos y un acento turquesa.
 */
const CARBON: ReportTheme = {
  id: 'builtin-carbon',
  name: 'Carbon',
  description: 'Negros profundos, IBM Plex y acento turquesa para reports tipo SRE.',
  author: 'VulnForce',
  modes: 'both',
  version: '1.0.0',
  light: {
    background: '220 14% 96%',
    foreground: '220 30% 12%',
    card: '0 0% 100%',
    cardForeground: '220 30% 12%',
    muted: '220 14% 92%',
    mutedForeground: '220 12% 40%',
    border: '220 14% 84%',
    primary: '186 80% 32%',
    primaryForeground: '0 0% 100%',
    brand: '186 80% 32%',
    brandForeground: '0 0% 100%',
    ...sharedSeverityLight,
    todo: '0 70% 48%',
    todoForeground: '0 0% 100%',
    surfaceCover: '220 14% 92%',
    surfaceCardStrong: '0 0% 100%',
    surfaceCardStrongForeground: '220 30% 12%',
    surfaceCardStrongBorder: '220 14% 80%',
  },
  dark: {
    background: '220 14% 5%',
    foreground: '220 14% 96%',
    card: '220 14% 8%',
    cardForeground: '220 14% 96%',
    muted: '220 14% 14%',
    mutedForeground: '220 10% 70%',
    border: '220 14% 18%',
    primary: '186 90% 55%',
    primaryForeground: '220 30% 6%',
    brand: '186 90% 55%',
    brandForeground: '220 30% 6%',
    ...sharedSeverityDark,
    todo: '0 78% 62%',
    todoForeground: '0 0% 100%',
    surfaceCover: '220 14% 3%',
    surfaceCardStrong: '220 14% 6%',
    surfaceCardStrongForeground: '220 14% 96%',
    surfaceCardStrongBorder: '220 14% 18%',
  },
  typography: {
    familyHeadline: 'IBM Plex Sans',
    familyBody: 'IBM Plex Sans',
    familyMono: 'IBM Plex Mono',
    baseSize: 15,
    lineHeight: 1.7,
    headingScale: 'compact',
  },
  shape: { radius: 4, borderWidth: 1, spacing: 'compact', shadow: 'strong' },
  hero: {
    gradientFrom: '186 80% 32%',
    gradientTo: '220 14% 5%',
    accent: '186 90% 55%',
    overlay: { color: '220 14% 0%', opacity: 0.2 },
    logoVariant: 'icon',
  },
  sidebarStyle: { highlight: 'brand-bar', tocIndent: 10 },
  badge: { shape: 'square' },
  callout: { style: 'solid' },
};

/**
 * Sunrise: cálido y editorial, naranjas y serifa para reportes ejecutivos.
 */
const SUNRISE: ReportTheme = {
  id: 'builtin-sunrise',
  name: 'Sunrise',
  description: 'Paleta cálida con titulares DM Serif Display. Ideal para informes ejecutivos.',
  author: 'VulnForce',
  modes: 'both',
  version: '1.0.0',
  light: {
    background: '36 38% 97%',
    foreground: '24 30% 14%',
    card: '0 0% 100%',
    cardForeground: '24 30% 14%',
    muted: '36 35% 92%',
    mutedForeground: '24 15% 38%',
    border: '32 28% 84%',
    primary: '18 88% 50%',
    primaryForeground: '0 0% 100%',
    brand: '18 88% 50%',
    brandForeground: '0 0% 100%',
    ...sharedSeverityLight,
    todo: '0 72% 50%',
    todoForeground: '0 0% 100%',
    surfaceCover: '36 50% 94%',
    surfaceCardStrong: '0 0% 100%',
    surfaceCardStrongForeground: '24 30% 14%',
    surfaceCardStrongBorder: '32 28% 80%',
  },
  dark: {
    background: '24 22% 10%',
    foreground: '36 30% 94%',
    card: '24 22% 13%',
    cardForeground: '36 30% 94%',
    muted: '24 18% 20%',
    mutedForeground: '32 18% 70%',
    border: '24 18% 24%',
    primary: '28 95% 60%',
    primaryForeground: '24 32% 10%',
    brand: '28 95% 60%',
    brandForeground: '24 32% 10%',
    ...sharedSeverityDark,
    todo: '0 78% 62%',
    todoForeground: '0 0% 100%',
    surfaceCover: '24 22% 8%',
    surfaceCardStrong: '24 22% 11%',
    surfaceCardStrongForeground: '36 30% 94%',
    surfaceCardStrongBorder: '24 18% 24%',
  },
  typography: {
    familyHeadline: 'DM Serif Display',
    familyBody: 'Source Sans 3',
    familyMono: 'Source Code Pro',
    baseSize: 16,
    lineHeight: 1.8,
    headingScale: 'roomy',
  },
  shape: { radius: 14, borderWidth: 1, spacing: 'roomy', shadow: 'soft' },
  hero: {
    gradientFrom: '18 88% 50%',
    gradientTo: '36 50% 94%',
    accent: '46 95% 58%',
    overlay: { color: '24 30% 14%', opacity: 0 },
    logoVariant: 'wide',
  },
  sidebarStyle: { highlight: 'underline', tocIndent: 16 },
  badge: { shape: 'pill' },
  callout: { style: 'soft' },
};

/**
 * Forensic Mono: estilo terminal, todo monoespaciado y alto contraste.
 */
const FORENSIC_MONO: ReportTheme = {
  id: 'builtin-forensic-mono',
  name: 'Forensic Mono',
  description: 'Tipografía monoespaciada y alto contraste, estética CTF.',
  author: 'VulnForce',
  modes: 'both',
  version: '1.0.0',
  light: {
    background: '0 0% 100%',
    foreground: '0 0% 8%',
    card: '0 0% 100%',
    cardForeground: '0 0% 8%',
    muted: '0 0% 94%',
    mutedForeground: '0 0% 30%',
    border: '0 0% 80%',
    primary: '142 76% 34%',
    primaryForeground: '0 0% 100%',
    brand: '142 76% 34%',
    brandForeground: '0 0% 100%',
    ...sharedSeverityLight,
    todo: '0 80% 42%',
    todoForeground: '0 0% 100%',
    surfaceCover: '0 0% 96%',
    surfaceCardStrong: '0 0% 100%',
    surfaceCardStrongForeground: '0 0% 8%',
    surfaceCardStrongBorder: '0 0% 75%',
  },
  dark: {
    background: '120 8% 5%',
    foreground: '120 30% 88%',
    card: '120 8% 8%',
    cardForeground: '120 30% 88%',
    muted: '120 8% 14%',
    mutedForeground: '120 10% 60%',
    border: '120 8% 18%',
    primary: '120 100% 55%',
    primaryForeground: '120 8% 5%',
    brand: '120 100% 55%',
    brandForeground: '120 8% 5%',
    ...sharedSeverityDark,
    todo: '0 90% 60%',
    todoForeground: '0 0% 100%',
    surfaceCover: '120 8% 4%',
    surfaceCardStrong: '120 8% 6%',
    surfaceCardStrongForeground: '120 30% 88%',
    surfaceCardStrongBorder: '120 8% 18%',
  },
  typography: {
    familyHeadline: 'JetBrains Mono',
    familyBody: 'JetBrains Mono',
    familyMono: 'JetBrains Mono',
    baseSize: 14,
    lineHeight: 1.7,
    headingScale: 'compact',
  },
  shape: { radius: 2, borderWidth: 1, spacing: 'compact', shadow: 'none' },
  hero: {
    gradientFrom: '142 76% 34%',
    gradientTo: '0 0% 100%',
    accent: '120 100% 55%',
    overlay: { color: '0 0% 0%', opacity: 0 },
    logoVariant: 'icon',
  },
  sidebarStyle: { highlight: 'plain', tocIndent: 8 },
  badge: { shape: 'flag' },
  callout: { style: 'outline' },
};

export const BUILTIN_THEMES: ReportTheme[] = [
  VULNFORCE_CLASSIC,
  SLATE_PRO,
  CARBON,
  SUNRISE,
  FORENSIC_MONO,
];

export const DEFAULT_THEME_ID = VULNFORCE_CLASSIC.id;

/** Determina si el id corresponde a un tema built-in. */
export function isBuiltinThemeId(id: string): boolean {
  return BUILTIN_THEMES.some((t) => t.id === id);
}

/** Clona profundamente un tema (estructura plana, sin funciones). */
export function cloneTheme(theme: ReportTheme): ReportTheme {
  return JSON.parse(JSON.stringify(theme)) as ReportTheme;
}
