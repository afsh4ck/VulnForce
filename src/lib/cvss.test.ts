import { describe, expect, it } from 'vitest';
import { getCVSS, getScore, getSeverity } from './cvss';

describe('getCVSS', () => {
  it('construye el vector string en el orden de la especificacion 3.1', () => {
    const vector = getCVSS({
      attackVector: 'N',
      attackComplexity: 'L',
      privilegesRequired: 'N',
      userInteraction: 'N',
      scope: 'U',
      confidentiality: 'H',
      integrity: 'H',
      availability: 'H',
    });
    expect(vector).toBe('CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H');
  });
});

describe('getScore', () => {
  it('calcula 9.8 para el vector critico canonico (scope sin cambios)', () => {
    expect(getScore('CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H')).toBeCloseTo(9.8, 5);
  });

  it('calcula 10.0 para el vector critico con scope cambiado', () => {
    expect(getScore('CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H')).toBeCloseTo(10.0, 5);
  });

  it('devuelve 0 cuando no hay impacto (todas las metricas de impacto en None)', () => {
    expect(getScore('CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:N')).toBe(0);
  });

  it('devuelve 0 para un vector incompleto', () => {
    expect(getScore('CVSS:3.1/AV:N/AC:L')).toBe(0);
  });

  it('nunca da un score con mas de un decimal (redondeado con ceil)', () => {
    const score = getScore('CVSS:3.1/AV:A/AC:H/PR:H/UI:R/S:U/C:L/I:N/A:N');
    expect(score).toBeCloseTo(Math.round(score * 10) / 10, 10);
  });

  it('subir el impacto de N a H nunca reduce el score (monotonia)', () => {
    const low = getScore('CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:N');
    const high = getScore('CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N');
    expect(high).toBeGreaterThan(low);
  });
});

describe('getSeverity', () => {
  it.each([
    [10.0, 'Critical'],
    [9.0, 'Critical'],
    [8.9, 'High'],
    [7.0, 'High'],
    [6.9, 'Medium'],
    [4.0, 'Medium'],
    [3.9, 'Low'],
    [0.1, 'Low'],
    [0.0, 'Informational'],
  ] as const)('%s -> %s', (score, expected) => {
    expect(getSeverity(score)).toBe(expected);
  });
});
