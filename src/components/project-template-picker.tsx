'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search } from '@/components/icons';
import { useData } from '@/context/data-context';
import { ProjectIcon } from '@/components/project-icon';
import { cn } from '@/lib/utils';
import type { ProjectTemplate } from '@/lib/types';

interface ProjectTemplatePickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: 'en' | 'es';
  onPick: (template: ProjectTemplate) => void;
  title?: string;
  description?: string;
}

export function ProjectTemplatePicker({
  open,
  onOpenChange,
  language,
  onPick,
  title,
  description,
}: ProjectTemplatePickerProps) {
  const { projectTemplates } = useData();
  const [query, setQuery] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!open) {
      setQuery('');
    } else {
      const id = window.setTimeout(() => inputRef.current?.focus(), 60);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  const t = {
    en: {
      title: 'Load project template',
      description: 'Pick a starting structure for your report.',
      placeholder: 'Search project templates…',
      empty: 'No templates match your search.',
    },
    es: {
      title: 'Cargar plantilla de proyecto',
      description: 'Elige una estructura inicial para tu informe.',
      placeholder: 'Buscar plantillas de proyecto…',
      empty: 'Ninguna plantilla coincide con la búsqueda.',
    },
  };

  const localizedName = (tpl: ProjectTemplate) =>
    (language === 'es' ? tpl.name_es : tpl.name_en) || tpl.name_en || tpl.name_es;
  const localizedDesc = (tpl: ProjectTemplate) =>
    (language === 'es' ? tpl.description_es : tpl.description_en) || '';

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projectTemplates;
    return projectTemplates.filter((tpl) => {
      const hay = [localizedName(tpl), localizedDesc(tpl)].filter(Boolean).join(' · ').toLowerCase();
      return hay.includes(q);
    });
  }, [projectTemplates, query, language]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>{title ?? t[language].title}</DialogTitle>
          <DialogDescription>{description ?? t[language].description}</DialogDescription>
        </DialogHeader>

        <div className="px-6">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t[language].placeholder}
              className="h-10 pl-9"
            />
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-6 py-4">
          {filtered.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">{t[language].empty}</p>
          ) : (
            <ul className="grid gap-2 sm:grid-cols-2">
              {filtered.map((tpl) => (
                <li key={tpl.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onPick(tpl);
                      onOpenChange(false);
                    }}
                    className={cn(
                      'group flex w-full items-start gap-3 rounded-md border bg-card p-4 text-left transition-colors',
                      'hover:border-primary hover:bg-primary/5',
                    )}
                  >
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-background text-muted-foreground group-hover:text-primary">
                      <ProjectIcon name={tpl.icon || 'LayoutTemplate'} className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium text-foreground">{localizedName(tpl)}</div>
                      {localizedDesc(tpl) && (
                        <p className="mt-1 line-clamp-3 text-xs text-muted-foreground">{localizedDesc(tpl)}</p>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
