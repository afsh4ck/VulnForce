'use client';

import { useEffect } from 'react';

// Marca <html> con la clase `scrolling` mientras el usuario hace scroll en
// cualquier contenedor de la app y la retira tras un breve periodo de inactividad.
// El CSS de globals.css usa esa clase para mostrar los scrollbars solo entonces.
const IDLE_MS = 700;

export function ScrollbarActivity() {
  useEffect(() => {
    const root = document.documentElement;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const onScroll = () => {
      root.classList.add('scrolling');
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => root.classList.remove('scrolling'), IDLE_MS);
    };

    // Captura para detectar scroll en cualquier elemento anidado (los eventos
    // `scroll` no burbujean).
    window.addEventListener('scroll', onScroll, { capture: true, passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll, { capture: true } as EventListenerOptions);
      if (timer) clearTimeout(timer);
      root.classList.remove('scrolling');
    };
  }, []);

  return null;
}
