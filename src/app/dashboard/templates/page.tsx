'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/language-context';
import { projectTemplates } from '@/lib/templates';
import { FileText, Import } from 'lucide-react';
import Link from 'next/link';

export default function TemplatesPage() {
  const { language } = useLanguage();

  const t = {
    en: {
      title: 'Project Templates',
      description: 'Use these templates to quickly start a new project with a predefined scope.',
      useTemplate: 'Use Template',
    },
    es: {
      title: 'Plantillas de Proyecto',
      description: 'Usa estas plantillas para iniciar rápidamente un nuevo proyecto con un alcance predefinido.',
      useTemplate: 'Usar Plantilla',
    },
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight">{t[language].title}</h1>
        <p className="text-muted-foreground">{t[language].description}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projectTemplates.map((template) => (
          <Card key={template.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-4">
                <FileText className="h-8 w-8 text-primary" />
                <CardTitle>{language === 'es' ? template.name_es : template.name_en}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <p className="text-sm text-muted-foreground">
                {language === 'es' ? template.description_es : template.description_en}
              </p>
              <div>
                <h4 className="mb-1 text-sm font-semibold">{language === 'es' ? 'Alcance de ejemplo:' : 'Example Scope:'}</h4>
                <pre className="font-code text-xs rounded-md bg-muted p-2 whitespace-pre-wrap">
                  {template.scope}
                </pre>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/dashboard/projects/new?template=${template.id}`}>
                  <Import className="mr-2 h-4 w-4" />
                  {t[language].useTemplate}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
