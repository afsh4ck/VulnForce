import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import type * as Mdast from 'mdast';
import {
  AlignmentType,
  BorderStyle,
  Document,
  ExternalHyperlink,
  Footer,
  HeadingLevel,
  ImageRun,
  LevelFormat,
  PageNumber,
  Packer,
  Paragraph,
  SectionType,
  ShadingType,
  Table,
  TableCell,
  TableOfContents,
  TableRow,
  TextRun,
  WidthType,
  type IBorderOptions,
  type ParagraphChild,
  type FileChild,
} from 'docx';
import type { Finding, ImageAsset, PentesterProfile, Project, Client, Severity } from './types';
import type { VariableContext } from './markdown-utils';
import { buildReportMarkdown, type ReportTranslations } from './report-markdown';
import type { ReportThemeColors } from './report-themes';

// Convierte el mismo Markdown plano que alimenta la exportacion .md/.html/.pdf
// en un documento .docx editable en Word, con una estetica que se acerca a la
// del PDF: portada propia con los datos del proyecto, tabla de contenidos
// nativa de Word, colores del tema activo (marca + severidades), tablas y
// citas con bordes/sombreado, chips de severidad por hallazgo, y un salto de
// pagina antes de cada seccion de primer nivel (igual que `.prose h1` en el
// PDF). Se apoya en el AST de remark (ya presente via react-markdown) en vez
// de un parser propio, para heredar soporte GFM correcto.

// Helvetica en Mac / Arial en Windows: Word sustituye una por otra, asi que
// declarar "Arial" da el mismo resultado visual en ambas plataformas.
const FONT_BODY = 'Arial';
const FONT_MONO = 'Consolas';
const MAX_IMAGE_WIDTH_PX = 560;
const MAX_IMAGE_HEIGHT_PX = 760;

const MIME_TO_DOCX_TYPE: Record<string, 'png' | 'jpg' | 'gif' | 'bmp'> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/gif': 'gif',
  'image/bmp': 'bmp',
};

const NO_BORDER: IBorderOptions = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const NO_BORDERS = { top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER, insideHorizontal: NO_BORDER, insideVertical: NO_BORDER };

// ---------------------------------------------------------------------------
// Color del tema: el editor guarda los colores como canales HSL ("142 71% 45%",
// formato Tailwind); Word necesita hex. Se resuelve una vez por export.
// ---------------------------------------------------------------------------

function hslChannelsToHex(channels: string): string {
  const [h, sPct, lPct] = channels.trim().split(/\s+/).map(parseFloat);
  const s = sPct / 100;
  const l = lPct / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const toHex = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, '0');
  return (toHex(r) + toHex(g) + toHex(b)).toUpperCase();
}

/** Aclara un color hex hacia blanco. amount=0 -> igual, amount=1 -> blanco. */
function tintHex(hex: string, amount: number): string {
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * amount);
  const toHex = (v: number) => v.toString(16).padStart(2, '0');
  return (toHex(mix(r)) + toHex(mix(g)) + toHex(mix(b))).toUpperCase();
}

type DocxThemeColors = {
  brand: string;
  foreground: string;
  mutedForeground: string;
  border: string;
  cardTint: string;
  severity: Record<Severity, { bg: string; fg: string }>;
};

const FALLBACK_THEME: DocxThemeColors = {
  brand: '2E5BFF',
  foreground: '1A1F29',
  mutedForeground: '5E6A7C',
  border: 'D8DEE9',
  cardTint: 'EEF2FF',
  severity: {
    Critical: { bg: 'C42525', fg: 'FFFFFF' },
    High: { bg: 'FA7A07', fg: 'FFFFFF' },
    Medium: { bg: 'EBB408', fg: '3D2C00' },
    Low: { bg: '2E80F5', fg: 'FFFFFF' },
    Informational: { bg: '5E6A7C', fg: 'FFFFFF' },
  },
};

function resolveDocxTheme(colors?: ReportThemeColors): DocxThemeColors {
  if (!colors) return FALLBACK_THEME;
  try {
    const brand = hslChannelsToHex(colors.brand);
    return {
      brand,
      foreground: hslChannelsToHex(colors.foreground),
      mutedForeground: hslChannelsToHex(colors.mutedForeground),
      border: hslChannelsToHex(colors.border),
      cardTint: tintHex(brand, 0.9),
      severity: {
        Critical: { bg: hslChannelsToHex(colors.severityCritical), fg: hslChannelsToHex(colors.severityCriticalForeground) },
        High: { bg: hslChannelsToHex(colors.severityHigh), fg: hslChannelsToHex(colors.severityHighForeground) },
        Medium: { bg: hslChannelsToHex(colors.severityMedium), fg: hslChannelsToHex(colors.severityMediumForeground) },
        Low: { bg: hslChannelsToHex(colors.severityLow), fg: hslChannelsToHex(colors.severityLowForeground) },
        Informational: { bg: hslChannelsToHex(colors.severityInformational), fg: hslChannelsToHex(colors.severityInformationalForeground) },
      },
    };
  } catch {
    return FALLBACK_THEME; // canal HSL con formato inesperado: mejor un doc con colores de reserva que uno roto
  }
}

// ---------------------------------------------------------------------------
// Imagenes
// ---------------------------------------------------------------------------

type ResolvedImage = { type: 'png' | 'jpg' | 'gif' | 'bmp'; data: Uint8Array; width: number; height: number };

function decodeDataUrl(dataUrl: string): { mime: string; bytes: Uint8Array } | null {
  const match = /^data:([^;]+);base64,([\s\S]*)$/.exec(dataUrl);
  if (!match) return null;
  const [, mime, base64] = match;
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return { mime, bytes };
}

function loadImageNaturalSize(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth || 1, height: img.naturalHeight || 1 });
    img.onerror = () => resolve({ width: MAX_IMAGE_WIDTH_PX, height: 320 });
    img.src = dataUrl;
  });
}

function scaleToFit(width: number, height: number): { width: number; height: number } {
  const scale = Math.min(MAX_IMAGE_WIDTH_PX / width, MAX_IMAGE_HEIGHT_PX / height, 1);
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) };
}

function collectImageIds(node: Mdast.Nodes, ids: Set<string>): void {
  if (node.type === 'image' && node.url?.startsWith('image://')) {
    ids.add(node.url.slice('image://'.length));
  }
  if ('children' in node && Array.isArray(node.children)) {
    node.children.forEach((child) => collectImageIds(child as Mdast.Nodes, ids));
  }
}

async function preloadImages(
  tree: Mdast.Root,
  getImage: (id: string) => ImageAsset | undefined
): Promise<Map<string, ResolvedImage>> {
  const ids = new Set<string>();
  collectImageIds(tree, ids);
  const result = new Map<string, ResolvedImage>();

  await Promise.all(Array.from(ids).map(async (id) => {
    const asset = getImage(id);
    if (!asset?.dataUrl) return;
    const decoded = decodeDataUrl(asset.dataUrl);
    const type = decoded ? MIME_TO_DOCX_TYPE[decoded.mime] : undefined;
    if (!decoded || !type) return; // formato no soportado por Word (p.ej. SVG/WebP): se omite, no se rompe el documento
    const natural = await loadImageNaturalSize(asset.dataUrl);
    const size = scaleToFit(natural.width, natural.height);
    result.set(id, { type, data: decoded.bytes, ...size });
  }));

  return result;
}

// El logo del cliente se guarda como data URL directa en `Client` (no como
// `image://id`), asi que se decodifica aparte para la portada. Se prefiere la
// version ancha si existe. Formatos que Word no entiende (SVG/WebP) se omiten.
const COVER_LOGO_MAX_WIDTH_PX = 300;
const COVER_LOGO_MAX_HEIGHT_PX = 96;

async function resolveCoverLogo(client: Client): Promise<ResolvedImage | null> {
  const src = client.logoWide || client.logoUrl;
  if (!src) return null;
  const decoded = decodeDataUrl(src);
  const type = decoded ? MIME_TO_DOCX_TYPE[decoded.mime] : undefined;
  if (!decoded || !type) return null;
  const natural = await loadImageNaturalSize(src);
  const scale = Math.min(
    COVER_LOGO_MAX_WIDTH_PX / natural.width,
    COVER_LOGO_MAX_HEIGHT_PX / natural.height,
    1,
  );
  return {
    type,
    data: decoded.bytes,
    width: Math.max(1, Math.round(natural.width * scale)),
    height: Math.max(1, Math.round(natural.height * scale)),
  };
}

// ---------------------------------------------------------------------------
// Contexto compartido por el recorrido del AST
// ---------------------------------------------------------------------------

type ConvertCtx = {
  images: Map<string, ResolvedImage>;
  theme: DocxThemeColors;
  translations: ReportTranslations;
  severityByLabel: Map<string, Severity>;
};

function buildSeverityByLabel(t: ReportTranslations): Map<string, Severity> {
  return new Map<string, Severity>([
    [t.critical, 'Critical'],
    [t.high, 'High'],
    [t.medium, 'Medium'],
    [t.low, 'Low'],
    [t.informational, 'Informational'],
  ]);
}

/** Concatena el texto plano de nodos inline (ignora formato, conserva el texto). */
function mdastPlainText(nodes: Mdast.PhrasingContent[]): string {
  return nodes.map((node) => {
    if (node.type === 'text' || node.type === 'inlineCode') return node.value;
    if ('children' in node && Array.isArray(node.children)) return mdastPlainText(node.children as Mdast.PhrasingContent[]);
    return '';
  }).join('');
}

// ---------------------------------------------------------------------------
// Inline
// ---------------------------------------------------------------------------

type Marks = { bold?: boolean; italic?: boolean; strike?: boolean; code?: boolean };

function inlineToRuns(nodes: Mdast.PhrasingContent[], marks: Marks, ctx: ConvertCtx): ParagraphChild[] {
  const runs: ParagraphChild[] = [];
  nodes.forEach((node) => {
    switch (node.type) {
      case 'text':
        runs.push(new TextRun({
          text: node.value,
          bold: marks.bold,
          italics: marks.italic,
          strike: marks.strike,
          font: marks.code ? FONT_MONO : FONT_BODY,
          shading: marks.code ? { type: ShadingType.CLEAR, fill: 'F1F1F1' } : undefined,
        }));
        break;
      case 'inlineCode':
        runs.push(new TextRun({ text: node.value, font: FONT_MONO, shading: { type: ShadingType.CLEAR, fill: 'F1F1F1' } }));
        break;
      case 'strong':
        runs.push(...inlineToRuns(node.children, { ...marks, bold: true }, ctx));
        break;
      case 'emphasis':
        runs.push(...inlineToRuns(node.children, { ...marks, italic: true }, ctx));
        break;
      case 'delete':
        runs.push(...inlineToRuns(node.children, { ...marks, strike: true }, ctx));
        break;
      case 'break':
        runs.push(new TextRun({ text: '', break: 1 }));
        break;
      case 'link': {
        const children = inlineToRuns(node.children, marks, ctx) as TextRun[];
        runs.push(new ExternalHyperlink({ link: node.url, children }));
        break;
      }
      case 'image': {
        const id = node.url?.startsWith('image://') ? node.url.slice('image://'.length) : null;
        const resolved = id ? ctx.images.get(id) : undefined;
        if (resolved) {
          runs.push(new ImageRun({
            type: resolved.type,
            data: resolved.data,
            transformation: { width: resolved.width, height: resolved.height },
            altText: { title: node.alt || 'image', description: node.alt || '', name: node.alt || 'image' },
          }));
        } else {
          runs.push(new TextRun({ text: `[${node.alt || 'imagen no incluida'}]`, italics: true, color: ctx.theme.mutedForeground }));
        }
        break;
      }
      default:
        if ('children' in node && Array.isArray((node as any).children)) {
          runs.push(...inlineToRuns((node as any).children, marks, ctx));
        }
    }
  });
  return runs;
}

// ---------------------------------------------------------------------------
// Chips de severidad / CVSS: `report-markdown.ts` siempre emite, justo bajo
// cada titulo de hallazgo, una lista con "- **Severity:** X" y "- **CVSS:** Y"
// (usando exactamente `translations.severity`/`translations.cvss`). Se
// detectan por ese prefijo para reemplazar el bullet gris por un chip de
// color, igual que el badge de severidad del PDF.
// ---------------------------------------------------------------------------

function renderSeverityChip(value: string, severity: Severity | undefined, theme: DocxThemeColors): Table {
  const colors = severity ? theme.severity[severity] : { bg: theme.mutedForeground, fg: 'FFFFFF' };
  return new Table({
    width: { size: 0, type: WidthType.AUTO },
    borders: NO_BORDERS,
    rows: [new TableRow({ children: [
      new TableCell({
        width: { size: 0, type: WidthType.AUTO },
        shading: { type: ShadingType.CLEAR, fill: colors.bg },
        margins: { top: 60, bottom: 60, left: 160, right: 160 },
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: value.toUpperCase(), bold: true, color: colors.fg, size: 18, characterSpacing: 10, font: FONT_BODY })],
        })],
      }),
    ] })],
  });
}

function renderCvssLine(value: string, translations: ReportTranslations, theme: DocxThemeColors): Paragraph {
  return new Paragraph({
    spacing: { before: 100, after: 160 },
    children: [new TextRun({ text: `${translations.cvss}  ${value}`, bold: true, color: theme.mutedForeground, size: 20, characterSpacing: 6 })],
  });
}

// ---------------------------------------------------------------------------
// Listas
// ---------------------------------------------------------------------------

function renderList(node: Mdast.List, ctx: ConvertCtx, level: number): FileChild[] {
  const reference = node.ordered ? 'ordered-list' : 'bullet-list';
  const out: FileChild[] = [];
  node.children.forEach((item) => {
    item.children.forEach((child, childIndex) => {
      if (child.type === 'list') {
        out.push(...renderList(child, ctx, level + 1));
        return;
      }
      if (child.type === 'paragraph') {
        if (level === 0 && childIndex === 0) {
          const plain = mdastPlainText(child.children).trim();
          const severityPrefix = `${ctx.translations.severity}:`;
          const cvssPrefix = `${ctx.translations.cvss}:`;
          if (plain.startsWith(severityPrefix)) {
            const value = plain.slice(severityPrefix.length).trim();
            out.push(renderSeverityChip(value, ctx.severityByLabel.get(value), ctx.theme));
            return;
          }
          if (plain.startsWith(cvssPrefix)) {
            const value = plain.slice(cvssPrefix.length).trim();
            out.push(renderCvssLine(value, ctx.translations, ctx.theme));
            return;
          }
        }
        const prefix = typeof item.checked === 'boolean' && childIndex === 0
          ? [new TextRun({ text: item.checked ? '☑ ' : '☐ ', font: FONT_BODY })]
          : [];
        out.push(new Paragraph({
          numbering: { reference, level },
          children: [...prefix, ...inlineToRuns(child.children, {}, ctx)],
        }));
        return;
      }
      // Otros bloques dentro de un item de lista (code, blockquote, etc.) se
      // aplanan con la misma sangria, para no perder contenido.
      out.push(...blockToDocx(child, ctx));
    });
  });
  return out;
}

// ---------------------------------------------------------------------------
// Tablas
// ---------------------------------------------------------------------------

function renderTable(node: Mdast.Table, ctx: ConvertCtx): Table {
  const border: IBorderOptions = { style: BorderStyle.SINGLE, size: 4, color: ctx.theme.border };
  const rows = node.children.map((row, rowIndex) => new TableRow({
    tableHeader: rowIndex === 0,
    children: row.children.map((cell) => new TableCell({
      width: { size: 100 / Math.max(1, row.children.length), type: WidthType.PERCENTAGE },
      shading: rowIndex === 0 ? { type: ShadingType.CLEAR, fill: ctx.theme.cardTint } : undefined,
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({
        children: inlineToRuns(cell.children, rowIndex === 0 ? { bold: true } : {}, ctx),
      })],
    })),
  }));
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: { top: border, bottom: border, left: border, right: border, insideHorizontal: border, insideVertical: border },
    rows,
  });
}

// ---------------------------------------------------------------------------
// Bloques
// ---------------------------------------------------------------------------

const HEADING_BY_DEPTH: Record<number, (typeof HeadingLevel)[keyof typeof HeadingLevel]> = {
  1: HeadingLevel.HEADING_1,
  2: HeadingLevel.HEADING_2,
  3: HeadingLevel.HEADING_3,
  4: HeadingLevel.HEADING_4,
  5: HeadingLevel.HEADING_5,
  6: HeadingLevel.HEADING_6,
};

function renderBlockquote(node: Mdast.Blockquote, ctx: ConvertCtx): FileChild[] {
  const out: FileChild[] = [];
  node.children.forEach((child) => {
    if (child.type === 'paragraph') {
      out.push(new Paragraph({
        indent: { left: 480 },
        border: { left: { style: BorderStyle.SINGLE, size: 24, color: ctx.theme.brand, space: 12 } },
        shading: { type: ShadingType.CLEAR, fill: ctx.theme.cardTint },
        spacing: { before: 40, after: 40 },
        children: inlineToRuns(child.children, { italic: true }, ctx),
      }));
    } else {
      out.push(...blockToDocx(child, ctx));
    }
  });
  if (out.length > 0) {
    // Espacio de cierre tras el bloque de cita completo.
    out.push(new Paragraph({ spacing: { after: 120 }, children: [] }));
  }
  return out;
}

function blockToDocx(node: Mdast.RootContent, ctx: ConvertCtx, isFirst = false): FileChild[] {
  switch (node.type) {
    case 'heading': {
      const depth = node.depth;
      return [new Paragraph({
        heading: HEADING_BY_DEPTH[depth] ?? HeadingLevel.HEADING_4,
        // El primer bloque del cuerpo ya empieza en pagina propia (corte de
        // seccion tras el indice): un salto extra dejaria una hoja en blanco.
        pageBreakBefore: depth === 1 && !isFirst,
        spacing: { before: depth === 1 ? 0 : 280, after: 140 },
        children: inlineToRuns(node.children, {}, ctx),
      })];
    }
    case 'paragraph':
      return [new Paragraph({
        spacing: { after: 160 },
        children: inlineToRuns(node.children, {}, ctx),
      })];
    case 'blockquote':
      return renderBlockquote(node, ctx);
    case 'code': {
      const lines = (node.value || '').split('\n');
      return [new Paragraph({
        shading: { type: ShadingType.CLEAR, fill: 'F5F5F5' },
        border: {
          top: { style: BorderStyle.SINGLE, size: 4, color: ctx.theme.border },
          bottom: { style: BorderStyle.SINGLE, size: 4, color: ctx.theme.border },
          left: { style: BorderStyle.SINGLE, size: 4, color: ctx.theme.border },
          right: { style: BorderStyle.SINGLE, size: 4, color: ctx.theme.border },
        },
        spacing: { before: 80, after: 200 },
        children: lines.map((line, i) => new TextRun({
          text: line.length ? line : ' ',
          font: FONT_MONO,
          size: 18,
          break: i > 0 ? 1 : 0,
        })),
      })];
    }
    case 'thematicBreak':
      return [new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: ctx.theme.border, space: 1 } }, spacing: { after: 160 } })];
    case 'list':
      return renderList(node, ctx, 0);
    case 'table':
      return [renderTable(node, ctx), new Paragraph({ text: '', spacing: { after: 160 } })];
    default:
      if ('children' in node && Array.isArray((node as any).children)) {
        return (node as any).children.flatMap((child: Mdast.RootContent) => blockToDocx(child, ctx));
      }
      return [];
  }
}

function blocksToDocx(nodes: Mdast.RootContent[], ctx: ConvertCtx): FileChild[] {
  return nodes.flatMap((node, index) => blockToDocx(node, ctx, index === 0));
}

/** Texto plano de un nodo heading (para localizar el marcador "Findings Summary"). */
function headingText(node: Mdast.Heading): string {
  return mdastPlainText(node.children).trim();
}

/**
 * `buildReportMarkdown` antepone una portada de texto plano (titulo H1, tipo de
 * informe, metadatos y "Prepared by") pensada para el .md descargable. Aqui se
 * sustituye por una portada disenada a partir de los mismos datos, asi que se
 * recorta todo lo anterior a "## Findings Summary". Esa seccion y su tabla si se
 * conservan: el resumen de hallazgos debe verse tambien en el Word.
 */
function stripCoverContent(children: Mdast.RootContent[], translations: ReportTranslations): Mdast.RootContent[] {
  const idx = children.findIndex((n) => n.type === 'heading' && n.depth === 2 && headingText(n) === translations.findingsSummary);
  if (idx === -1) return children; // formato inesperado: no se recorta nada, mejor de mas que perder contenido
  return children.slice(idx);
}

// ---------------------------------------------------------------------------
// Portada
// ---------------------------------------------------------------------------

const SEV_ORDER: Severity[] = ['Critical', 'High', 'Medium', 'Low', 'Informational'];

function severityLabel(sev: Severity, t: ReportTranslations): string {
  return { Critical: t.critical, High: t.high, Medium: t.medium, Low: t.low, Informational: t.informational }[sev];
}

function buildSeverityCountRow(findings: Finding[], t: ReportTranslations, theme: DocxThemeColors): Table {
  const counts: Record<Severity, number> = { Critical: 0, High: 0, Medium: 0, Low: 0, Informational: 0 };
  findings.forEach((f) => { if (f.severity in counts) counts[f.severity] += 1; });

  const cells = SEV_ORDER.map((sev) => {
    const c = theme.severity[sev];
    return new TableCell({
      width: { size: 20, type: WidthType.PERCENTAGE },
      shading: { type: ShadingType.CLEAR, fill: c.bg },
      margins: { top: 160, bottom: 160, left: 80, right: 80 },
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 20 }, children: [new TextRun({ text: String(counts[sev]), bold: true, size: 36, color: c.fg })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: severityLabel(sev, t).toUpperCase(), bold: true, size: 14, color: c.fg, characterSpacing: 8 })] }),
      ],
    });
  });

  return new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, borders: NO_BORDERS, rows: [new TableRow({ children: cells })] });
}

function buildMetaTable(rows: Array<[string, string]>, theme: DocxThemeColors): Table {
  const divider: IBorderOptions = { style: BorderStyle.SINGLE, size: 4, color: theme.border };
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: { ...NO_BORDERS, insideHorizontal: divider },
    rows: rows.map(([label, value]) => new TableRow({ children: [
      new TableCell({
        width: { size: 32, type: WidthType.PERCENTAGE },
        margins: { top: 100, bottom: 100, left: 0, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, color: theme.mutedForeground, size: 20 })] })],
      }),
      new TableCell({
        width: { size: 68, type: WidthType.PERCENTAGE },
        margins: { top: 100, bottom: 100, left: 0, right: 0 },
        children: [new Paragraph({ children: [new TextRun({ text: value, color: theme.foreground, size: 20 })] })],
      }),
    ] })),
  });
}

/** Franja de color de marca a todo el ancho: da a la portada un aire de reporte. */
function brandBand(theme: DocxThemeColors): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: NO_BORDERS,
    rows: [new TableRow({
      children: [new TableCell({
        shading: { type: ShadingType.CLEAR, fill: theme.brand },
        margins: { top: 0, bottom: 0, left: 0, right: 0 },
        children: [new Paragraph({ spacing: { before: 0, after: 0, line: 120 }, children: [new TextRun({ text: '', size: 6 })] })],
      })],
    })],
  });
}

function buildCover(params: {
  project: Project;
  client: Client;
  findings: Finding[];
  pentester?: PentesterProfile;
  generatedDate: string;
  translations: ReportTranslations;
  logo?: ResolvedImage | null;
}, theme: DocxThemeColors): FileChild[] {
  const { project, client, findings, pentester, generatedDate, translations: t, logo } = params;
  const out: FileChild[] = [];

  out.push(brandBand(theme));

  if (logo) {
    out.push(new Paragraph({
      spacing: { before: 320, after: 120 },
      children: [new ImageRun({
        type: logo.type,
        data: logo.data,
        transformation: { width: logo.width, height: logo.height },
        altText: { title: `${client.name} logo`, description: `${client.name} logo`, name: 'client-logo' },
      })],
    }));
  }

  out.push(new Paragraph({
    spacing: { before: logo ? 280 : 520, after: 120 },
    children: [new TextRun({ text: t.reportType, bold: true, allCaps: true, characterSpacing: 28, color: theme.brand, size: 22 })],
  }));
  out.push(new Paragraph({
    spacing: { after: 60 },
    children: [new TextRun({ text: project.name, bold: true, size: 60, color: theme.foreground })],
  }));
  out.push(new Paragraph({
    spacing: { after: 240 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 18, color: theme.brand, space: 8 } },
    children: [new TextRun({ text: client.name, size: 28, color: theme.mutedForeground })],
  }));

  out.push(new Paragraph({ spacing: { after: 200 }, children: [] }));
  out.push(buildSeverityCountRow(findings, t, theme));
  out.push(new Paragraph({ spacing: { after: 360 }, children: [] }));

  const metaRows: Array<[string, string]> = [
    [t.client, client.name],
    [t.assessmentWindow, `${project.startDate} – ${project.endDate}`],
    [t.generatedOn, generatedDate],
    [t.totalFindings, String(findings.length)],
  ];
  out.push(buildMetaTable(metaRows, theme));

  if (pentester && (pentester.name || pentester.email || pentester.company)) {
    out.push(new Paragraph({ spacing: { before: 420, after: 120 }, children: [new TextRun({ text: t.pentesterTitle, bold: true, allCaps: true, characterSpacing: 16, color: theme.brand, size: 18 })] }));
    const pentesterRows: Array<[string, string]> = [];
    if (pentester.name) pentesterRows.push(['Name', pentester.name]);
    if (pentester.role) pentesterRows.push(['Role', pentester.role]);
    if (pentester.company) pentesterRows.push(['Company', pentester.company]);
    if (pentester.email) pentesterRows.push(['Email', pentester.email]);
    if (pentester.phone) pentesterRows.push(['Phone', pentester.phone]);
    if (pentesterRows.length > 0) out.push(buildMetaTable(pentesterRows, theme));
  }

  // El salto a la pagina siguiente lo da el corte de seccion, no un PageBreak
  // manual (que podia dejar una hoja en blanco tras la portada).
  return out;
}

// ---------------------------------------------------------------------------
// Documento
// ---------------------------------------------------------------------------

export type BuildReportDocxParams = {
  project: Project;
  client: Client;
  findings: Finding[];
  pentester?: PentesterProfile;
  variables: VariableContext;
  generatedDate: string;
  translations: ReportTranslations;
  footerLabel: string;
  getImage: (id: string) => ImageAsset | undefined;
  /** Paleta del tema activo del proyecto (modo claro). Si se omite, usa una paleta neutra de reserva. */
  theme?: ReportThemeColors;
};

export async function buildReportDocx(params: BuildReportDocxParams): Promise<Blob> {
  const { project, client, findings, pentester, variables, generatedDate, translations, footerLabel, getImage } = params;
  const docxTheme = resolveDocxTheme(params.theme);

  const markdown = buildReportMarkdown({ project, client, findings, pentester, variables, generatedDate, translations });
  const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown) as Mdast.Root;
  const [images, coverLogo] = await Promise.all([
    preloadImages(tree, getImage),
    resolveCoverLogo(client),
  ]);
  const ctx: ConvertCtx = { images, theme: docxTheme, translations, severityByLabel: buildSeverityByLabel(translations) };

  const cover = buildCover({ project, client, findings, pentester, generatedDate, translations, logo: coverLogo }, docxTheme);
  const tocTitle = project.language === 'es' ? 'Índice de Contenidos' : 'Table of Contents';
  const toc: FileChild[] = [
    new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 0, after: 200 }, children: [new TextRun({ text: tocTitle })] }),
    new TableOfContents(tocTitle, { hyperlink: true, headingStyleRange: '1-2' }),
  ];
  const body = blocksToDocx(stripCoverContent(tree.children, translations), ctx);

  const headingBase = { run: { font: FONT_BODY, bold: true, color: docxTheme.foreground } };
  const doc = new Document({
    creator: 'VulnForce',
    title: project.name,
    description: `${translations.reportType} - ${client.name}`,
    features: { updateFields: true },
    styles: {
      default: {
        document: {
          run: { font: FONT_BODY, size: 22, color: docxTheme.foreground },
          paragraph: { spacing: { line: 276 } },
        },
        title: { run: { font: FONT_BODY, bold: true, size: 64, color: docxTheme.foreground } },
        heading1: {
          ...headingBase,
          run: { ...headingBase.run, size: 32, color: docxTheme.brand },
          paragraph: { spacing: { before: 0, after: 200 }, border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: docxTheme.brand, space: 6 } } },
        },
        heading2: { ...headingBase, run: { ...headingBase.run, size: 26 } },
        heading3: { ...headingBase, run: { ...headingBase.run, size: 22, color: docxTheme.mutedForeground } },
        heading4: { ...headingBase, run: { ...headingBase.run, size: 20 } },
      },
    },
    numbering: {
      config: [
        {
          reference: 'bullet-list',
          levels: [0, 1, 2].map((level) => ({
            level,
            format: LevelFormat.BULLET,
            text: '•',
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 480 + level * 360, hanging: 240 } } },
          })),
        },
        {
          reference: 'ordered-list',
          levels: [0, 1, 2].map((level) => ({
            level,
            format: LevelFormat.DECIMAL,
            text: `%${level + 1}.`,
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 480 + level * 360, hanging: 240 } } },
          })),
        },
      ],
    },
    sections: (() => {
      const page = { margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } }; // ~2cm en twips
      const makeFooter = () => new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: `${footerLabel}  ·  `, size: 16, color: docxTheme.mutedForeground }),
            new TextRun({ children: [PageNumber.CURRENT], size: 16, color: docxTheme.mutedForeground }),
          ],
        })],
      });
      // Tres secciones con corte "pagina siguiente": portada, indice y cuerpo
      // caen cada uno en su propia hoja sin saltos manuales que dejen paginas
      // en blanco. El pie con numero de pagina solo aparece a partir del indice.
      return [
        { properties: { page }, children: [...cover] },
        { properties: { page, type: SectionType.NEXT_PAGE }, footers: { default: makeFooter() }, children: [...toc] },
        { properties: { page, type: SectionType.NEXT_PAGE }, footers: { default: makeFooter() }, children: [...body] },
      ];
    })(),
  });

  return Packer.toBlob(doc);
}
