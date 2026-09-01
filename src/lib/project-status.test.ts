import { describe, expect, it } from 'vitest';
import { getProjectStatusLabel, getProjectStatusVariant } from './project-status';

describe('getProjectStatusVariant', () => {
  it('mapea cada estado conocido a su variante', () => {
    expect(getProjectStatusVariant('Completed')).toBe('status-completed');
    expect(getProjectStatusVariant('In Progress')).toBe('status-in-progress');
    expect(getProjectStatusVariant('On Hold')).toBe('status-on-hold');
  });

  it('devuelve "secondary" para un estado desconocido', () => {
    expect(getProjectStatusVariant('Cancelled')).toBe('secondary');
  });
});

describe('getProjectStatusLabel', () => {
  it('traduce el estado al idioma pedido', () => {
    expect(getProjectStatusLabel('In Progress', 'es')).toBe('En progreso');
    expect(getProjectStatusLabel('In Progress', 'en')).toBe('In Progress');
  });

  it('devuelve el propio estado si no esta en el diccionario', () => {
    expect(getProjectStatusLabel('Cancelled', 'es')).toBe('Cancelled');
  });
});
