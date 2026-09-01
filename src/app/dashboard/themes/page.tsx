'use client';

import React, { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useData } from '@/context/data-context';
import { useLanguage } from '@/context/language-context';
import { useTheme } from '@/context/theme-context';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Upload, Copy, Trash2, Edit, FileDown, Search, CheckCircle, Eye } from '@/components/icons';
import { ThemePreviewDialog } from '@/components/theme-preview-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ThemePreview } from '@/components/theme-preview';
import { BUILTIN_THEMES, isBuiltinThemeId, cloneTheme, type ReportTheme } from '@/lib/report-themes';

const T = {
  en: {
    title: 'Report themes',
    subtitle: 'Visual identity for every exported report. Built-in themes are read-only; create or duplicate one to customise it.',
    search: 'Search themes',
    newTheme: 'New theme',
    importJson: 'Import JSON',
    apply: 'Apply',
    applied: 'Active',
    duplicate: 'Duplicate',
    edit: 'Edit',
    delete: 'Delete',
    exportJson: 'Export JSON',
    builtin: 'Built-in',
    custom: 'Custom',
    confirmDeleteTitle: 'Delete theme?',
    confirmDeleteDesc: 'This action cannot be undone. Projects using this theme will fall back to the global default.',
    cancel: 'Cancel',
    light: 'Light',
    dark: 'Dark',
    both: 'Both',
    activeNow: 'Active theme',
    by: 'By',
    invalidFile: 'Invalid theme file.',
    imported: 'Theme imported.',
    duplicated: 'Theme duplicated.',
    deleted: 'Theme deleted.',
    applyOk: 'Theme applied.',
    preview: 'Preview',
  },
  es: {
    title: 'Temas de reporte',
    subtitle: 'Identidad visual de cada reporte exportado. Los temas built-in son de solo lectura; crea o duplica uno para personalizarlo.',
    search: 'Buscar temas',
    newTheme: 'Nuevo tema',
    importJson: 'Importar JSON',
    apply: 'Aplicar',
    applied: 'Activo',
    duplicate: 'Duplicar',
    edit: 'Editar',
    delete: 'Eliminar',
    exportJson: 'Exportar JSON',
    builtin: 'Built-in',
    custom: 'Custom',
    confirmDeleteTitle: '¿Eliminar tema?',
    confirmDeleteDesc: 'Esta acción no se puede deshacer. Los proyectos que lo usaban volverán al tema global por defecto.',
    cancel: 'Cancelar',
    light: 'Claro',
    dark: 'Oscuro',
    both: 'Ambos',
    activeNow: 'Tema activo',
    by: 'Por',
    invalidFile: 'Archivo de tema inválido.',
    imported: 'Tema importado.',
    duplicated: 'Tema duplicado.',
    deleted: 'Tema eliminado.',
    applyOk: 'Tema aplicado.',
    preview: 'Previsualizar',
  },
} as const;

function exportThemeFile(theme: ReportTheme) {
  const payload = JSON.stringify({ version: 1, kind: 'vulnforce-report-theme', theme }, null, 2);
  const blob = new Blob([payload], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${theme.name.replace(/\s+/g, '-').toLowerCase()}.vftheme.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function ThemesPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const { theme: appMode } = useTheme();
  const { toast } = useToast();
  const t = T[language];
  const {
    getAllThemes,
    activeThemeId,
    setActiveThemeId,
    addTheme,
    deleteTheme,
    duplicateTheme,
  } = useData();

  const [query, setQuery] = useState('');
  const [toDelete, setToDelete] = useState<ReportTheme | null>(null);
  const [preview, setPreview] = useState<ReportTheme | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const themes = useMemo(() => {
    const all = getAllThemes();
    if (!query) return all;
    const q = query.toLowerCase();
    return all.filter((t) => t.name.toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q));
  }, [getAllThemes, query]);

  const handleApply = (theme: ReportTheme) => {
    setActiveThemeId(theme.id);
    toast({ title: t.applyOk, description: theme.name });
  };

  const handleDuplicate = (theme: ReportTheme) => {
    const copy = duplicateTheme(theme.id);
    if (copy) {
      toast({ title: t.duplicated, description: copy.name });
      router.push(`/dashboard/themes/edit/${copy.id}`);
    }
  };

  const handleDelete = (theme: ReportTheme) => {
    deleteTheme(theme.id);
    toast({ title: t.deleted, description: theme.name });
    setToDelete(null);
  };

  const handleNew = () => {
    const base = BUILTIN_THEMES[0];
    const next = cloneTheme(base);
    next.id = `custom-${Date.now()}`;
    next.name = language === 'es' ? 'Nuevo tema' : 'New theme';
    next.description = '';
    next.author = '';
    const saved = addTheme(next);
    router.push(`/dashboard/themes/edit/${saved.id}`);
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!parsed || parsed.kind !== 'vulnforce-report-theme' || !parsed.theme) {
        throw new Error('Invalid kind');
      }
      const incoming = parsed.theme as ReportTheme;
      const existing = getAllThemes().some((t) => t.id === incoming.id);
      const safe: ReportTheme = {
        ...cloneTheme(incoming),
        id: existing ? `custom-${Date.now()}` : incoming.id,
      };
      const saved = addTheme(safe);
      toast({ title: t.imported, description: saved.name });
    } catch {
      toast({ variant: 'destructive', title: t.invalidFile });
    }
  };

  const modeLabel = (modes: ReportTheme['modes']) => {
    if (modes === 'light') return t.light;
    if (modes === 'dark') return t.dark;
    return t.both;
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold font-headline">{t.title}</h1>
          <p className="text-muted-foreground text-sm mt-1 max-w-2xl">{t.subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.search}
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
            />
          </div>
          <Button variant="outline" onClick={handleImportClick}>
            <Upload className="h-4 w-4 mr-2" />{t.importJson}
          </Button>
          <Button onClick={handleNew}>
            <Plus className="h-4 w-4 mr-2" />{t.newTheme}
          </Button>
        </div>
      </div>
      <input ref={fileInputRef} type="file" accept="application/json,.json,.vftheme.json" className="hidden" onChange={handleImport} />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
        {themes.map((theme) => {
          const builtin = isBuiltinThemeId(theme.id);
          const isActive = theme.id === activeThemeId;
          const miniMode: 'light' | 'dark' =
            theme.modes === 'light' ? 'light' : theme.modes === 'dark' ? 'dark' : appMode;
          return (
            <Card key={theme.id} className="overflow-hidden flex flex-col rounded-xl">
              <button
                type="button"
                onClick={() => setPreview(theme)}
                className="group/preview block border-b text-left focus:outline-none"
                aria-label={t.preview}
              >
                <div className="overflow-hidden rounded-t-xl">
                  <ThemePreview theme={theme} mode={miniMode} variant="mini" />
                </div>
              </button>
              <CardContent className="p-4 flex flex-col gap-3 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold truncate">{theme.name}</h3>
                      {isActive && (
                        <Badge variant="default" className="gap-1 text-[10px]">
                          <CheckCircle className="h-3 w-3" />{t.applied}
                        </Badge>
                      )}
                    </div>
                    {theme.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{theme.description}</p>
                    )}
                    <p className="text-[11px] text-muted-foreground mt-1">
                      {theme.author ? `${t.by} ${theme.author} · ` : ''}{modeLabel(theme.modes)}
                    </p>
                  </div>
                  <Badge variant="outline" className="shrink-0">{builtin ? t.builtin : t.custom}</Badge>
                </div>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {!isActive ? (
                    <Button size="sm" onClick={() => handleApply(theme)}>{t.apply}</Button>
                  ) : (
                    <Button size="sm" variant="secondary" disabled>{t.applied}</Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => setPreview(theme)} title={t.preview}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDuplicate(theme)} title={t.duplicate}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  {!builtin && (
                    <Button asChild size="sm" variant="outline" title={t.edit}>
                      <Link href={`/dashboard/themes/edit/${theme.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => exportThemeFile(theme)} title={t.exportJson}>
                    <FileDown className="h-4 w-4" />
                  </Button>
                  {!builtin && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setToDelete(theme)}
                      title={t.delete}
                      className="border-destructive/40 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <AlertDialog open={!!toDelete} onOpenChange={(open) => !open && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.confirmDeleteTitle}</AlertDialogTitle>
            <AlertDialogDescription>{t.confirmDeleteDesc}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => toDelete && handleDelete(toDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ThemePreviewDialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)} theme={preview} />
    </div>
  );
}
