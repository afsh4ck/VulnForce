import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import type * as Mdast from 'mdast';
import {
  AlignmentType,
  Document,
  ExternalHyperlink,
  Footer,
  HeadingLevel,
  ImageRun,
  LevelFormat,
  PageNumber,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  type ParagraphChild,
  type FileChild,
} from 'docx';
import type { Finding, ImageAsset, PentesterProfile, Project, Client } from './types';
import type { VariableContext } from './markdown-utils';
import { buildReportMarkdown, type ReportTranslations } from './report-markdown';

// Convierte el mismo Markdown plano que alimenta la exportacion .md/.html/.pdf
// en un documento .docx editable en Word. Se apoya en el AST de remark
// (ya presente en el proyecto via react-markdown) en vez de un parser propio,
// para heredar soporte GFM (tablas, tachado, listas de tareas) correcto.

const FONT_BODY = 'Calibri';
const FONT_MONO = 'Consolas';
const MAX_IMAGE_WIDTH_PX = 560;
const MAX_IMAGE_HEIGHT_PX = 760;

const MIME_TO_DOCX_TYPE: Record<string, 'png' | 'jpg' | 'gif' | 'bmp'> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/gif': 'gif',
  'image/bmp': 'bmp',
};

type ResolvedImage = {
  type: 'png' | 'jpg' | 'gif' | 'bmp';
  data: Uint8Array;
  width: number;
  height: number;
};

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

/** Recorre el AST y recolecta los ids de `image://<id>` referenciados. */
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

type Marks = { bold?: boolean; italic?: boolean; strike?: boolean; code?: boolean };

function inlineToRuns(nodes: Mdast.PhrasingContent[], marks: Marks, images: Map<string, ResolvedImage>): ParagraphChild[] {
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
        runs.push(...inlineToRuns(node.children, { ...marks, bold: true }, images));
        break;
      case 'emphasis':
        runs.push(...inlineToRuns(node.children, { ...marks, italic: true }, images));
        break;
      case 'delete':
        runs.push(...inlineToRuns(node.children, { ...marks, strike: true }, images));
        break;
      case 'break':
        runs.push(new TextRun({ text: '', break: 1 }));
        break;
      case 'link': {
        const children = inlineToRuns(node.children, marks, images) as TextRun[];
        runs.push(new ExternalHyperlink({ link: node.url, children }));
        break;
      }
      case 'image': {
        const id = node.url?.startsWith('image://') ? node.url.slice('image://'.length) : null;
        const resolved = id ? images.get(id) : undefined;
        if (resolved) {
          runs.push(new ImageRun({
            type: resolved.type,
            data: resolved.data,
            transformation: { width: resolved.width, height: resolved.height },
            altText: { title: node.alt || 'image', description: node.alt || '', name: node.alt || 'image' },
          }));
        } else {
          runs.push(new TextRun({ text: `[${node.alt || 'imagen no incluida'}]`, italics: true }));
        }
        break;
      }
      default:
        if ('children' in node && Array.isArray((node as any).children)) {
          runs.push(...inlineToRuns((node as any).children, marks, images));
        }
    }
  });
  return runs;
}

const HEADING_BY_DEPTH: Record<number, (typeof HeadingLevel)[keyof typeof HeadingLevel]> = {
  1: HeadingLevel.HEADING_1,
  2: HeadingLevel.HEADING_2,
  3: HeadingLevel.HEADING_3,
  4: HeadingLevel.HEADING_4,
  5: HeadingLevel.HEADING_5,
  6: HeadingLevel.HEADING_6,
};

function renderList(node: Mdast.List, images: Map<string, ResolvedImage>, level: number): Paragraph[] {
  const reference = node.ordered ? 'ordered-list' : 'bullet-list';
  const out: Paragraph[] = [];
  node.children.forEach((item, index) => {
    item.children.forEach((child, childIndex) => {
      if (child.type === 'list') {
        out.push(...renderList(child, images, level + 1));
        return;
      }
      if (child.type === 'paragraph') {
        const prefix = typeof item.checked === 'boolean' && childIndex === 0
          ? [new TextRun({ text: item.checked ? '☑ ' : '☐ ', font: FONT_BODY })]
          : [];
        out.push(new Paragraph({
          numbering: { reference, level },
          children: [...prefix, ...inlineToRuns(child.children, {}, images)],
        }));
        return;
      }
      // Otros bloques dentro de un item de lista (code, blockquote, etc.) se
      // aplanan como parrafo con la misma sangria, para no perder contenido.
      blockToParagraphs(child, images).forEach((p) => out.push(p));
    });
    void index;
  });
  return out;
}

function renderTable(node: Mdast.Table, images: Map<string, ResolvedImage>): Table {
  const rows = node.children.map((row, rowIndex) => new TableRow({
    tableHeader: rowIndex === 0,
    children: row.children.map((cell) => new TableCell({
      width: { size: 100 / Math.max(1, row.children.length), type: WidthType.PERCENTAGE },
      shading: rowIndex === 0 ? { type: ShadingType.CLEAR, fill: 'E7EAF0' } : undefined,
      margins: { top: 60, bottom: 60, left: 100, right: 100 },
      children: [new Paragraph({
        children: inlineToRuns(cell.children, rowIndex === 0 ? { bold: true } : {}, images),
      })],
    })),
  }));
  return new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows });
}

/** Convierte un nodo de bloque a una lista plana de Paragraph (usado dentro de list items). */
function blockToParagraphs(node: Mdast.RootContent, images: Map<string, ResolvedImage>): Paragraph[] {
  const nodes = blockToDocx(node, images);
  return nodes.filter((n): n is Paragraph => n instanceof Paragraph);
}

function blockToDocx(node: Mdast.RootContent, images: Map<string, ResolvedImage>): FileChild[] {
  switch (node.type) {
    case 'heading':
      return [new Paragraph({
        heading: HEADING_BY_DEPTH[node.depth] ?? HeadingLevel.HEADING_4,
        spacing: { before: 240, after: 120 },
        children: inlineToRuns(node.children, {}, images),
      })];
    case 'paragraph':
      return [new Paragraph({
        spacing: { after: 160 },
        children: inlineToRuns(node.children, {}, images),
      })];
    case 'blockquote':
      return renderBlockquote(node, images);
    case 'code': {
      const lines = (node.value || '').split('\n');
      return [new Paragraph({
        shading: { type: ShadingType.CLEAR, fill: 'F5F5F5' },
        spacing: { after: 160 },
        children: lines.map((line, i) => new TextRun({
          text: line.length ? line : ' ',
          font: FONT_MONO,
          size: 18,
          break: i > 0 ? 1 : 0,
        })),
      })];
    }
    case 'thematicBreak':
      return [new Paragraph({ border: { bottom: { style: 'single', size: 6, color: 'CCCCCC', space: 1 } }, spacing: { after: 160 } })];
    case 'list':
      return renderList(node, images, 0);
    case 'table':
      return [renderTable(node, images), new Paragraph({ text: '', spacing: { after: 160 } })];
    default:
      if ('children' in node && Array.isArray((node as any).children)) {
        return (node as any).children.flatMap((child: Mdast.RootContent) => blockToDocx(child, images));
      }
      return [];
  }
}

// blockquote necesita reconstruirse desde el nodo original (docx no clona
// Paragraphs), asi que se resuelve aparte con acceso a los children reales.
function renderBlockquote(node: Mdast.Blockquote, images: Map<string, ResolvedImage>): FileChild[] {
  const out: FileChild[] = [];
  node.children.forEach((child) => {
    if (child.type === 'paragraph') {
      out.push(new Paragraph({
        indent: { left: 480 },
        border: { left: { style: 'single', size: 12, color: 'B8C2D6', space: 8 } },
        spacing: { after: 160 },
        children: inlineToRuns(child.children, { italic: true }, images),
      }));
    } else {
      out.push(...blockToDocx(child, images));
    }
  });
  return out;
}

function blocksToDocx(nodes: Mdast.RootContent[], images: Map<string, ResolvedImage>): FileChild[] {
  return nodes.flatMap((node) => blockToDocx(node, images));
}

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
};

export async function buildReportDocx(params: BuildReportDocxParams): Promise<Blob> {
  const { project, client, findings, pentester, variables, generatedDate, translations, footerLabel, getImage } = params;

  const markdown = buildReportMarkdown({ project, client, findings, pentester, variables, generatedDate, translations });
  const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown) as Mdast.Root;
  const images = await preloadImages(tree, getImage);
  const body = blocksToDocx(tree.children, images);

  const doc = new Document({
    creator: 'VulnForce',
    title: project.name,
    description: `${translations.reportType} - ${client.name}`,
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
    sections: [{
      properties: {
        page: {
          margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 }, // ~2cm en twips
        },
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: `${footerLabel}  ·  `, size: 16, color: '888888' }),
              new TextRun({ children: [PageNumber.CURRENT], size: 16, color: '888888' }),
            ],
          })],
        }),
      },
      children: [
        new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun({ text: project.name })] }),
        new Paragraph({ spacing: { after: 240 }, children: [new TextRun({ text: `${translations.client}: ${client.name}`, size: 22 })] }),
        ...body,
      ],
    }],
  });

  return Packer.toBlob(doc);
}
