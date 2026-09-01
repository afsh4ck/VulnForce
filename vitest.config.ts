import { defineConfig } from 'vitest/config';
import path from 'node:path';

// Suite minima para la logica pura del proyecto (calculo CVSS, utilidades de
// Markdown/TODO, estado de proyecto): sin esto, un cambio en estos modulos
// solo se detecta manualmente en la UI. No cubre componentes React ni rutas.
export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
