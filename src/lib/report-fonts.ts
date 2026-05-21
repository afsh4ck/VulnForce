/**
 * Catálogo curado de Google Fonts disponibles para los temas de reportes.
 *
 * El campo `css` se usa en `font-family` (con fallback) y `googleSpec` en la
 * URL `fonts.googleapis.com/css2?family=...`. La función `loadFontFamily` se
 * llama desde el cliente para inyectar el <link> una sola vez por familia.
 */

export type FontCategory = 'sans' | 'serif' | 'mono';

export interface CuratedFont {
  family: string;
  css: string;
  googleSpec: string;
  category: FontCategory;
}

const sansFallback = "system-ui, -apple-system, 'Segoe UI', sans-serif";
const serifFallback = "Georgia, 'Times New Roman', serif";
const monoFallback = "ui-monospace, SFMono-Regular, Menlo, monospace";

const sans = (family: string, spec = `${family.replace(/ /g, '+')}:wght@400;500;600;700`): CuratedFont => ({
  family,
  css: `'${family}', ${sansFallback}`,
  googleSpec: spec,
  category: 'sans',
});
const serif = (family: string, spec = `${family.replace(/ /g, '+')}:wght@400;500;600;700`): CuratedFont => ({
  family,
  css: `'${family}', ${serifFallback}`,
  googleSpec: spec,
  category: 'serif',
});
const mono = (family: string, spec = `${family.replace(/ /g, '+')}:wght@400;500;700`): CuratedFont => ({
  family,
  css: `'${family}', ${monoFallback}`,
  googleSpec: spec,
  category: 'mono',
});

export const CURATED_FONTS: CuratedFont[] = [
  // Sans
  sans('Inter'),
  sans('Roboto', 'Roboto:wght@400;500;700'),
  sans('Open Sans'),
  sans('Source Sans 3'),
  sans('IBM Plex Sans'),
  sans('Lato', 'Lato:wght@400;700;900'),
  sans('Nunito'),
  sans('Manrope'),
  sans('DM Sans'),
  sans('Plus Jakarta Sans'),
  sans('Work Sans'),
  sans('Space Grotesk'),
  sans('Albert Sans'),
  sans('Outfit'),
  sans('Sora'),
  sans('Bricolage Grotesk'),
  sans('Archivo'),
  sans('Public Sans'),
  sans('Karla'),
  sans('Geist'),
  // Serif
  serif('Spectral'),
  serif('Merriweather', 'Merriweather:wght@400;700;900'),
  serif('Lora'),
  serif('Source Serif 4'),
  serif('Playfair Display'),
  serif('EB Garamond'),
  serif('Crimson Pro'),
  // Mono
  mono('JetBrains Mono'),
  mono('IBM Plex Mono'),
  mono('Fira Code'),
  mono('Source Code Pro', 'Source+Code+Pro:wght@400;500;700'),
  mono('Roboto Mono'),
  mono('DM Mono', 'DM+Mono:wght@400;500'),
  mono('Geist Mono'),
];

/** Devuelve la URL Google Fonts para una lista de familias del catálogo. */
export function googleFontsHref(families: string[]): string {
  const specs = new Set<string>();
  families.forEach((family) => {
    const entry = CURATED_FONTS.find((f) => f.family === family);
    if (entry) {
      specs.add(entry.googleSpec);
    }
  });
  if (specs.size === 0) return '';
  const params = Array.from(specs)
    .map((spec) => `family=${spec}`)
    .join('&');
  return `https://fonts.googleapis.com/css2?${params}&display=swap`;
}

/** Resuelve el `font-family` con fallback para usarse en CSS. */
export function fontFamilyCss(family: string, fallbackCategory: FontCategory = 'sans'): string {
  const entry = CURATED_FONTS.find((f) => f.family === family);
  if (entry) return entry.css;
  if (fallbackCategory === 'serif') return `'${family}', ${serifFallback}`;
  if (fallbackCategory === 'mono') return `'${family}', ${monoFallback}`;
  return `'${family}', ${sansFallback}`;
}

const LINK_ID_PREFIX = 'vulnforce-font-';

/**
 * Inyecta de forma idempotente el `<link>` de Google Fonts para una familia.
 * No hace nada en SSR ni si la familia no está en el catálogo.
 */
export function loadFontFamily(family: string): void {
  if (typeof document === 'undefined') return;
  const entry = CURATED_FONTS.find((f) => f.family === family);
  if (!entry) return;
  const id = `${LINK_ID_PREFIX}${entry.family.replace(/\s+/g, '-').toLowerCase()}`;
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${entry.googleSpec}&display=swap`;
  document.head.appendChild(link);
}

/** Inyecta varias familias en una sola operación. */
export function loadFontFamilies(families: string[]): void {
  if (typeof document === 'undefined') return;
  const unique = Array.from(new Set(families));
  unique.forEach(loadFontFamily);
}
