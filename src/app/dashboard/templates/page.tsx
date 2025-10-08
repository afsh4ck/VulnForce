'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/language-context';
import { FileText, Scan, Globe, Network, Smartphone, Wifi, Award, PlusCircle, Edit, Trash2, ArrowUpDown, FilePlus2 } from 'lucide-react';
import Link from 'next/link';
import { useData } from '@/context/data-context';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import type { ProjectTemplate } from '@/lib/types';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export const iconComponents: { [key: string]: React.ElementType } = {
  FileText,
  Scan,
  Globe,
  Network,
  Smartphone,
  Wifi,
  Award,
};

type SortKey = keyof ProjectTemplate;

export default function TemplatesPage() {
  const { language } = useLanguage();
  const { projectTemplates, deleteProjectTemplate } = useData();
  const { toast } = useToast();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>(null);
  const [templateToDelete, setTemplateToDelete] = useState<ProjectTemplate | null>(null);

  const t = {
    en: {
      title: 'Project Templates',
      description: 'Manage reusable project templates.',
      newTemplate: 'New Template',
      search: 'Search templates...',
      nameHeader: 'Name',
      descriptionHeader: 'Description',
      actionsHeader: 'Actions',
      edit: 'Edit',
      delete: 'Delete',
      createProject: 'Create Project',
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
      nameHeader: 'Nombre',
      descriptionHeader: 'Descripción',
      actionsHeader: 'Acciones',
      edit: 'Editar',
      delete: 'Eliminar',
      createProject: 'Crear Proyecto',
      confirmDeleteTitle: '¿Estás seguro?',
      confirmDeleteDesc: 'Esta acción no se puede deshacer. Esto eliminará permanentemente la plantilla de proyecto.',
      cancel: 'Cancelar',
      templateDeleted: 'Plantilla eliminada correctamente.',
    },
  };

  const sortedAndFilteredTemplates = useMemo(() => {
    let filtered = projectTemplates.filter(template => {
      const term = searchTerm.toLowerCase();
      return template.name_en.toLowerCase().includes(term) ||
             template.name_es.toLowerCase().includes(term) ||
             template.description_en.toLowerCase().includes(term) ||
             template.description_es.toLowerCase().includes(term);
    });

    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return filtered;
  }, [projectTemplates, searchTerm, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIcon = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
  };

  const handleDelete = () => {
    if (templateToDelete) {
      deleteProjectTemplate(templateToDelete.id);
      toast({ title: t[language].templateDeleted });
      setTemplateToDelete(null);
    }
  };

  return (
    <>
      <div className="space-y-6">
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
                <Button asChild>
                    <Link href="/dashboard/templates/edit/new">
                        <PlusCircle className="mr-2 h-4 w-4" /> {t[language].newTemplate}
                    </Link>
                </Button>
            </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Icon</TableHead>
                  <TableHead onClick={() => requestSort('name_en')} className="cursor-pointer">{t[language].nameHeader} {getSortIcon('name_en')}</TableHead>
                  <TableHead onClick={() => requestSort('description_en')} className="cursor-pointer">{t[language].descriptionHeader} {getSortIcon('description_en')}</TableHead>
                  <TableHead className="text-right">{t[language].actionsHeader}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAndFilteredTemplates.map((template) => {
                  const Icon = iconComponents[template.icon] || FileText;
                  return (
                    <TableRow key={template.id}>
                      <TableCell><Icon className="h-6 w-6 text-primary" /></TableCell>
                      <TableCell className="font-medium">
                        <Link href={`/dashboard/templates/edit/${template.id}`} className="hover:underline">
                          {language === 'es' ? template.name_es : template.name_en}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{language === 'es' ? template.description_es : template.description_en}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" asChild>
                                <Link href={`/dashboard/projects/new?template=${template.id}`}>
                                    <FilePlus2 className="mr-2 h-4 w-4" />
                                    {t[language].createProject}
                                </Link>
                            </Button>
                            <Button variant="ghost" size="icon" asChild>
                                <Link href={`/dashboard/templates/edit/${template.id}`}>
                                    <Edit className="h-4 w-4" />
                                </Link>
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={() => setTemplateToDelete(template)}>
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
                                        <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">{t[language].delete}</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
