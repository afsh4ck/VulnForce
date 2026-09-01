'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from '@/components/icons';
import { useLanguage } from '@/context/language-context';
import { ThemePreview } from '@/components/theme-preview';
import type { ReportTheme } from '@/lib/report-themes';

interface ThemePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  theme: ReportTheme | null;
}

export function ThemePreviewDialog({ open, onOpenChange, theme }: ThemePreviewDialogProps) {
  const { language } = useLanguage();
  const t = {
    en: { title: 'Theme preview', description: 'Realistic preview of how the report will look with this theme.', light: 'Light', dark: 'Dark' },
    es: { title: 'Previsualización del tema', description: 'Previsualización realista del aspecto del reporte con este tema.', light: 'Claro', dark: 'Oscuro' },
  };
  const supportsBoth = theme?.modes !== 'light' && theme?.modes !== 'dark';
  const initialMode: 'light' | 'dark' = theme?.modes === 'light' ? 'light' : 'dark';
  const [mode, setMode] = React.useState<'light' | 'dark'>(initialMode);
  React.useEffect(() => {
    if (theme) setMode(theme.modes === 'light' ? 'light' : 'dark');
  }, [theme]);

  if (!theme) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden">
        <DialogHeader className="p-5 pb-2">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <DialogTitle className="truncate">{theme.name}</DialogTitle>
              <DialogDescription className="line-clamp-2">{theme.description || t[language].description}</DialogDescription>
            </div>
            {supportsBoth && (
              <div className="flex shrink-0 items-center gap-1 rounded-md border bg-muted p-1">
                <Button
                  type="button"
                  size="sm"
                  variant={mode === 'light' ? 'default' : 'ghost'}
                  onClick={() => setMode('light')}
                  className="h-7 px-3"
                >
                  <Sun className="mr-1.5 h-3.5 w-3.5" />{t[language].light}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={mode === 'dark' ? 'default' : 'ghost'}
                  onClick={() => setMode('dark')}
                  className="h-7 px-3"
                >
                  <Moon className="mr-1.5 h-3.5 w-3.5" />{t[language].dark}
                </Button>
              </div>
            )}
          </div>
        </DialogHeader>
        <div className="px-5 pb-5">
          <ThemePreview theme={theme} mode={mode} variant="full" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
