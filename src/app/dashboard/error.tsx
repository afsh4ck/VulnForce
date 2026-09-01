'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/language-context';
import { ArrowLeft, Bomb } from '@/components/icons';
import Link from 'next/link';

// Boundary de segmento: si un render dentro de /dashboard lanza (por ejemplo
// un estado corrupto en un editor), esto evita la pantalla en blanco y ofrece
// volver al listado sin perder el resto de la app (el layout raiz sigue vivo,
// asi que los datos en memoria no se pierden).
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { language } = useLanguage();

  useEffect(() => {
    console.error(error);
  }, [error]);

  const t = {
    en: {
      title: 'Something went wrong',
      description: 'This section failed to load. Your data is safe; try again or go back to the dashboard.',
      retry: 'Try again',
      back: 'Back to dashboard',
    },
    es: {
      title: 'Algo salió mal',
      description: 'Esta sección no pudo cargarse. Tus datos están a salvo; reintenta o vuelve al panel.',
      retry: 'Reintentar',
      back: 'Volver al panel',
    },
  }[language];

  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <Bomb className="h-7 w-7" />
      </div>
      <div className="space-y-1">
        <h1 className="font-headline text-xl font-bold">{t.title}</h1>
        <p className="max-w-md text-sm text-muted-foreground">{t.description}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.back}
          </Link>
        </Button>
        <Button onClick={reset}>{t.retry}</Button>
      </div>
    </div>
  );
}
