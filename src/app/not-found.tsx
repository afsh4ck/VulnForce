'use client';

import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/language-context';
import { Home, Search } from '@/components/icons';
import Link from 'next/link';

export default function NotFound() {
  const { language } = useLanguage();

  const t = {
    en: {
      title: 'Page not found',
      description: "The page you're looking for doesn't exist or was moved.",
      home: 'Go to dashboard',
    },
    es: {
      title: 'Página no encontrada',
      description: 'La página que buscas no existe o fue movida.',
      home: 'Ir al panel',
    },
  }[language];

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Search className="h-7 w-7" />
      </div>
      <div className="space-y-1">
        <h1 className="font-headline text-xl font-bold">{t.title}</h1>
        <p className="max-w-md text-sm text-muted-foreground">{t.description}</p>
      </div>
      <Button asChild>
        <Link href="/dashboard">
          <Home className="mr-2 h-4 w-4" />
          {t.home}
        </Link>
      </Button>
    </div>
  );
}
