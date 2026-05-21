'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/context/theme-context';
import { useLanguage } from '@/context/language-context';
import { Globe, Moon, Sun } from '@/components/icons';
import { cn } from '@/lib/utils';

type Variant = 'app' | 'report';

export function ThemeToggleButton({ className, variant = 'app' }: { className?: string; variant?: Variant }) {
  const { theme, setTheme } = useTheme();
  const { language } = useLanguage();
  const t = {
    en: { light: 'Light mode', dark: 'Dark mode' },
    es: { light: 'Modo claro', dark: 'Modo oscuro' },
  };
  const label = theme === 'dark' ? t[language].light : t[language].dark;
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label={label}
      title={label}
      className={cn('h-9 w-9 rounded-full', variant === 'report' && 'h-9 w-9', className)}
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}

export function LanguageToggleButton({ className }: { className?: string }) {
  const { language, setLanguage } = useLanguage();
  const t = {
    en: { language: 'Language', english: 'English', spanish: 'Español' },
    es: { language: 'Idioma', english: 'Inglés', spanish: 'Español' },
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label={t[language].language}
          title={t[language].language}
          className={cn('h-9 w-9 rounded-full', className)}
        >
          <Globe className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem
          onClick={() => setLanguage('en')}
          className={cn(language === 'en' && 'bg-muted')}
        >
          {t[language].english}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage('es')}
          className={cn(language === 'es' && 'bg-muted')}
        >
          {t[language].spanish}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
