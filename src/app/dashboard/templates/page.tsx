'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/context/language-context';
import { PlusCircle, Edit, Trash2, ArrowUpDown, FilePlus2 } from '@/components/icons';
import Link from 'next/link';
import { useData } from '@/context/data-context';
import { Input } from '@/components/ui/input';
import type { ProjectTemplate } from '@/lib/types';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { ProjectIcon, projectIconComponents } from '@/components/project-icon';

export default function TemplatesPage() {
  const { language } = useLanguage();
  const { projectTemplates, deleteProjectTemplate } = useData();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortDirection, setSortDirection] = useState<'ascending' | 'descending'>('ascending');
  const [templateToDelete, setTemplateToDelete] = useState<ProjectTemplate | null>(null);

  const t = {
    en: {
      title: 'Project Templates',
      description: 'Manage reusable project templates.',
      newTemplate: 'New Template',
      search: 'Search templates...',
      sortName: 'Sort by name',
      edit: 'Edit',
      delete: 'Delete',
      createProject: 'Use Template',
      builtin: 'Built-in',
      custom: 'Custom',
      empty: 'No templates found.',
      confirmDeleteTitle: 'Are you sure?',
      confirmDeleteDesc: 'This action cannot be undone. This will permanently delete the project template.',
      cancel: 'Cancel',
      templateDeleted: 'Template deleted successfully.',
    },
    es: {
      title: 'Plantillas de Proyecto',
      description: 'Gestiona plantillas de proyecto reutilizables.',
      newTemplate: 'Nueva Plantilla',
      search: 'Buscar plantillas...',
      sortName: 'Ordenar por nombre',
      edit: 'Editar',
      delete: 'Eliminar',
      createProject: 'Usar Plantilla',
      builtin: 'Predefinida',
      custom: 'Personalizada',
      empty: 'No se encontraron plantillas.',
      confirmDeleteTitle: '¿Estás seguro?',
      confirmDeleteDesc: 'Esta acción no se puede deshacer. Esto eliminará permanentemente la plantilla de proyecto.',
      cancel: 'Cancelar',
      templateDeleted: 'Plantilla eliminada correctamente.',
    },
  };

  const name = (tpl: ProjectTemplate) => (language === 'es' ? tpl.name_es : tpl.name_en);
  const desc = (tpl: ProjectTemplate) => (language === 'es' ? tpl.description_es : tpl.description_en);

  const sortedAndFilteredTemplates = useMemo(() => {
    const term = searchTerm.toLowerCase();
    const filtered = projectTemplates.filter(template =>
      template.name_en.toLowerCase().includes(term) ||
      template.name_es.toLowerCase().includes(term) ||
      template.description_en.toLowerCase().includes(term) ||
      template.description_es.toLowerCase().includes(term)
    );

    filtered.sort((a, b) => {
      const cmp = name(a).localeCompare(name(b));
      return sortDirection === 'ascending' ? cmp : -cmp;
    });
    return filtered;
  }, [projectTemplates, searchTerm, sortDirection, language]);

  const handleDelete = () => {
    if (templateToDelete) {
      deleteProjectTemplate(templateToDelete.id);
      toast({ title: t[language].templateDeleted });
      setTemplateToDelete(null);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="font-headline text-3xl font-bold tracking-tight">{t[language].title}</h1>
          <p className="text-muted-foreground">{t[language].description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder={t[language].search}
            className="max-w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            variant="outline"
            size="icon"
            title={t[language].sortName}
            onClick={() => setSortDirection((d) => (d === 'ascending' ? 'descending' : 'ascending'))}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
          <Button asChild>
            <Link href="/dashboard/templates/edit/new">
              <PlusCircle className="mr-2 h-4 w-4" /> {t[language].newTemplate}
            </Link>
          </Button>
        </div>
      </div>

      {sortedAndFilteredTemplates.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t[language].empty}</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedAndFilteredTemplates.map((template) => {
            const Icon = projectIconComponents[template.icon] || ProjectIcon;
            const isDeletable = template.id.startsWith('ptpl-');
            return (
              <Card key={template.id} className="flex flex-col rounded-xl">
                <CardContent className="flex flex-1 flex-col gap-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="outline" className="shrink-0">
                      {isDeletable ? t[language].custom : t[language].builtin}
                    </Badge>
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/dashboard/templates/edit/${template.id}`}
                      className="font-medium hover:underline line-clamp-1"
                    >
                      {name(template)}
                    </Link>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-3">{desc(template)}</p>
                  </div>
                  <div className="mt-auto flex items-center gap-2 border-t pt-3">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href={`/dashboard/projects/new?template=${template.id}`}>
                        <FilePlus2 className="mr-2 h-4 w-4" />
                        {t[language].createProject}
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" title={t[language].edit} asChild>
                      <Link href={`/dashboard/templates/edit/${template.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    {isDeletable && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            title={t[language].delete}
                            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => setTemplateToDelete(template)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t[language].confirmDeleteTitle}</AlertDialogTitle>
                            <AlertDialogDescription>{t[language].confirmDeleteDesc}</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setTemplateToDelete(null)}>{t[language].cancel}</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">{t[language].delete}</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
