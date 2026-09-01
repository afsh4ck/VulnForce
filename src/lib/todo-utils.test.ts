import { describe, expect, it } from 'vitest';
import { hasTodoMarker, linkifyTodosInMarkdown, parseTodoMarker, replaceTodoMarkers, stripMarkdownText } from './todo-utils';

describe('stripMarkdownText', () => {
  it('quita enlaces, enfasis y encabezados dejando solo el texto', () => {
    expect(stripMarkdownText('## [Ver **detalle**](https://x.test)')).toBe('Ver detalle');
  });
});

describe('parseTodoMarker', () => {
  it('usa "TODO" generico cuando no hay detalle', () => {
    expect(parseTodoMarker('TODO')).toEqual({ raw: 'TODO', detail: 'TODO', display: 'TO DO' });
  });

  it('incluye el detalle en el texto mostrado', () => {
    expect(parseTodoMarker('[TODO: revisar CVSS]', 'revisar CVSS')).toEqual({
      raw: '[TODO: revisar CVSS]',
      detail: 'revisar CVSS',
      display: 'TO DO: revisar CVSS',
    });
  });
});

describe('hasTodoMarker / replaceTodoMarkers', () => {
  it('detecta tanto TODO suelto como [TODO: detalle]', () => {
    expect(hasTodoMarker('pendiente TODO aqui')).toBe(true);
    expect(hasTodoMarker('[TODO: agregar evidencia]')).toBe(true);
    expect(hasTodoMarker('sin pendientes')).toBe(false);
  });

  it('la deteccion es repetible (el regex global no arrastra estado entre llamadas)', () => {
    const text = '[TODO: primero]';
    expect(hasTodoMarker(text)).toBe(true);
    expect(hasTodoMarker(text)).toBe(true);
    expect(hasTodoMarker(text)).toBe(true);
  });

  it('reemplaza todos los marcadores de una linea', () => {
    const out = replaceTodoMarkers('a [TODO: uno] b TODO c', (m) => `<<${m.detail}>>`);
    expect(out).toBe('a <<uno>> b <<TODO>> c');
  });
});

describe('linkifyTodosInMarkdown', () => {
  it('enlaza cada TODO usando el titulo de la seccion mas reciente', () => {
    const md = [
      '# Intro',
      'TODO',
      '## Hallazgo X',
      '[TODO: agregar PoC]',
    ].join('\n');

    const out = linkifyTodosInMarkdown(
      md,
      (marker, section) => `#/${encodeURIComponent(section)}/${encodeURIComponent(marker.detail)}`,
      'Sin seccion'
    );

    expect(out).toContain('[TO DO](#/Intro/TODO)');
    expect(out).toContain('[TO DO: agregar PoC](#/Hallazgo%20X/agregar%20PoC)');
  });

  it('usa el titulo de fallback cuando el TODO aparece antes de cualquier encabezado', () => {
    const out = linkifyTodosInMarkdown('TODO', (m, section) => section, 'Fallback');
    expect(out).toBe('[TO DO](Fallback)');
  });
});
