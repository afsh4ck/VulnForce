import { describe, expect, it } from 'vitest';
import {
  blocksToMarkdown,
  htmlToMarkdown,
  joinMarkdownSections,
  parseMarkdownToBlocks,
  resolveVariables,
  splitMarkdownIntoSections,
} from './markdown-utils';
import type { ContentBlock } from './types';

describe('resolveVariables', () => {
  it('sustituye {{grupo.clave}} por el valor del contexto', () => {
    expect(resolveVariables('Cliente: {{client.name}}', { client: { name: 'Acme' } })).toBe('Cliente: Acme');
  });

  it('usa el fallback "—" cuando el grupo o la clave no existen', () => {
    expect(resolveVariables('{{client.name}}', {})).toBe('—');
    expect(resolveVariables('{{client.missing}}', { client: { name: 'Acme' } })).toBe('—');
  });

  it('deja intacto el texto sin variables', () => {
    expect(resolveVariables('sin variables aqui', {})).toBe('sin variables aqui');
  });
});

describe('htmlToMarkdown', () => {
  it('convierte HTML basico a Markdown', () => {
    expect(htmlToMarkdown('<strong>hola</strong>')).toBe('**hola**');
  });

  it('devuelve cadena vacia para entrada vacia', () => {
    expect(htmlToMarkdown('')).toBe('');
  });
});

describe('joinMarkdownSections', () => {
  it('une secciones no vacias con un separador horizontal', () => {
    expect(joinMarkdownSections(['# Uno', '', '# Dos'])).toBe('# Uno\n\n---\n\n# Dos');
  });

  it('ignora secciones nulas, vacias o solo con separadores', () => {
    expect(joinMarkdownSections([null, undefined, '   ', '---', '# Contenido'])).toBe('# Contenido');
  });
});

describe('splitMarkdownIntoSections', () => {
  it('parte por encabezados de nivel <= maxHeadingLevel', () => {
    const sections = splitMarkdownIntoSections('# Uno\ncontenido uno\n## Dos\ncontenido dos', { maxHeadingLevel: 2 });
    expect(sections).toEqual(['# Uno\ncontenido uno', '## Dos\ncontenido dos']);
  });

  it('no corta encabezados dentro de un bloque de codigo', () => {
    const md = '# Titulo\n```\n# esto no es un encabezado\n```\ntexto final';
    const sections = splitMarkdownIntoSections(md, { maxHeadingLevel: 2 });
    expect(sections).toHaveLength(1);
    expect(sections[0]).toContain('# esto no es un encabezado');
  });

  it('devuelve un array vacio para entrada vacia', () => {
    expect(splitMarkdownIntoSections('')).toEqual([]);
  });
});

describe('parseMarkdownToBlocks / blocksToMarkdown', () => {
  it('infiere "h1" cuando la seccion empieza con un encabezado de nivel 1', () => {
    const blocks = parseMarkdownToBlocks('# Titulo\ncontenido');
    expect(blocks.map((b) => b.tag)).toEqual(['h1']);
  });

  it('infiere "ul" para una lista sin encabezado', () => {
    const blocks = parseMarkdownToBlocks('- item uno\n- item dos');
    expect(blocks.map((b) => b.tag)).toEqual(['ul']);
  });

  it('infiere "ol" para una lista numerada sin encabezado', () => {
    const blocks = parseMarkdownToBlocks('1. paso uno\n2. paso dos');
    expect(blocks.map((b) => b.tag)).toEqual(['ol']);
  });

  it('produce un bloque de parrafo vacio para entrada vacia', () => {
    const blocks = parseMarkdownToBlocks('');
    expect(blocks).toHaveLength(1);
    expect(blocks[0].tag).toBe('p');
    expect(blocks[0].content).toBe('');
  });

  it('blocksToMarkdown antepone el marcador correcto por tag cuando falta', () => {
    const blocks: ContentBlock[] = [
      { id: '1', tag: 'ul', content: 'item suelto' },
      { id: '2', tag: 'ol', content: 'paso suelto' },
      { id: '3', tag: 'hr', content: '' },
    ];
    expect(blocksToMarkdown(blocks)).toBe('- item suelto\n\n1. paso suelto\n\n---');
  });
});
