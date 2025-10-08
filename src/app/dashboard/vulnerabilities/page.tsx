
'use client';

import React, { useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, PlusCircle, ArrowUpDown, Edit, Trash2 } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import type { Vulnerability } from '@/lib/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useData } from '@/context/data-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type SortKey = keyof Vulnerability | 'cvssScore';

const vulnerabilityCategories = [
    { value: 'All', label_en: 'All Categories', label_es: 'Todas las Categorías' },
    { value: 'Web', label_en: 'Web', label_es: 'Web' },
    { value: 'Mobile', label_en: 'Mobile', label_es: 'Móvil' },
    { value: 'Network', label_en: 'Network', label_es: 'Red' },
    { value: 'Infrastructure', label_en: 'Infrastructure', label_es: 'Infraestructura' },
    { value: 'Authentication', label_en: 'Authentication', label_es: 'Autenticación' },
    { value: 'Cryptography', label_en: 'Cryptography', label_es: 'Criptografía' },
];

const categoryMapping: { [key: string]: string[] } = {
    Web: ['OWASP Top 10', 'A03:2021-Injection', 'Injection', 'XSS', 'CSRF', 'SSRF', 'File Upload', 'RCE', 'A05:2021-Security_Misconfiguration', 'A01:2021-Broken_Access_Control', 'A10:2021-Server-Side_Request_Forgery', 'A02:2021-Cryptographic_Failures', 'A08:2021-Software_and_Data_Integrity_Failures', 'A07:2021-Identification_and_Authentication_Failures', 'A09:2021-Security_Logging_and_Monitoring_Failures', 'Deserialization', 'Path Traversal', 'Directory Traversal', 'Open Redirect', 'Clickjacking', 'UI Redressing', 'Template Injection', 'SSTI', 'DOM XSS', 'Mass Assignment', 'Request Smuggling', 'Cache Poisoning', 'ORM'],
    Mobile: ['Mobile', 'Android', 'iOS', 'Insecure Storage', 'MitM'],
    Network: ['Network', 'WiFi', 'WPA2', 'Cracking', 'Evil Twin', 'DNS'],
    Infrastructure: ['Infrastructure', 'Misconfiguration', 'Asset Management', 'Subdomain Takeover'],
    Authentication: ['Authentication', 'Passwords', 'Brute Force', 'Credential_stuffing', 'Enumeration', 'Session Management', 'Session Fixation'],
    Cryptography: ['Cryptography', 'A02:2021-Cryptographic_Failures', 'TLS/SSL'],
};


export default function VulnerabilitiesPage() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();
  const { vulnerabilities, deleteVulnerability } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>(null);
  const [vulnerabilityToDelete, setVulnerabilityToDelete] = useState<Vulnerability | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const getSeverityVariant = (severity: string): 'destructive' | 'high' | 'medium' | 'low' | 'secondary' => {
    switch (severity) {
      case 'Critical': return 'destructive';
      case 'High': return 'high';
      case 'Medium': return 'medium';
      case 'Low': return 'low';
      default: return 'secondary';
    }
  }

  const handleDeleteVulnerability = () => {
    if (!vulnerabilityToDelete) return;
    deleteVulnerability(vulnerabilityToDelete.id);
    toast({ title: t[language].vulnerabilityDeleted });
    setVulnerabilityToDelete(null);
  };

  const handleEditVulnerability = (vulnerabilityId: string) => {
    router.push(`/dashboard/vulnerabilities/${vulnerabilityId}`);
  };

  const sortedAndFilteredVulnerabilities = useMemo(() => {
    let filtered = vulnerabilities.filter(vuln => {
      const term = searchTerm.toLowerCase();
      
      let categoryMatch = selectedCategory === 'All';
      if (selectedCategory !== 'All' && categoryMapping[selectedCategory]) {
          categoryMatch = vuln.tags.some(tag => categoryMapping[selectedCategory].includes(tag));
      }

      const searchMatch = vuln.title_en.toLowerCase().includes(term) ||
                          (vuln.title_es && vuln.title_es.toLowerCase().includes(term)) ||
                          vuln.cwe.toLowerCase().includes(term) ||
                          vuln.tags.some(tag => tag.toLowerCase().includes(term));
      return categoryMatch && searchMatch;
    });

    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        let aValue, bValue;
        if (sortConfig.key === 'cvssScore') {
          aValue = a.cvss.score;
          bValue = b.cvss.score;
        } else if (sortConfig.key === 'title_en') {
            aValue = language === 'es' ? a.title_es : a.title_en;
            bValue = language === 'es' ? b.title_es : b.title_en;
        }
        else {
          aValue = a[sortConfig.key as keyof Vulnerability];
          bValue = b[sortConfig.key as keyof Vulnerability];
        }

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
  }, [searchTerm, sortConfig, vulnerabilities, language, selectedCategory]);

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

  const t = {
    en: {
      title: "Vulnerability Database",
      search: "Search...",
      tableTitle: "Title",
      tableSeverity: "Severity",
      tableCvss: "CVSS",
      tableReference: "CWE",
      tableActions: "Actions",
      edit: "Edit",
      delete: "Delete",
      newVulnerability: "New Vulnerability",
      confirmDeleteTitle: "Are you sure?",
      confirmDeleteDesc: "This action cannot be undone. This will permanently delete the vulnerability template.",
      cancel: "Cancel",
      vulnerabilityDeleted: "Vulnerability deleted successfully."
    },
    es: {
      title: "Base de Datos de Vulnerabilidades",
      search: "Buscar...",
      tableTitle: "Título",
      tableSeverity: "Severidad",
      tableCvss: "CVSS",
      tableReference: "CWE",
      tableActions: "Acciones",
      edit: "Editar",
      delete: "Eliminar",
      newVulnerability: "Nueva Vulnerabilidad",
      confirmDeleteTitle: "¿Estás seguro?",
      confirmDeleteDesc: "Esta acción no se puede deshacer. Esto eliminará permanentemente la plantilla de vulnerabilidad.",
      cancel: "Cancelar",
      vulnerabilityDeleted: "Vulnerabilidad eliminada correctamente."
    }
  }

  return (
    <>
    <div className="space-y-6">
       <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
         <h1 className="font-headline text-3xl font-bold tracking-tight">
            {t[language].title}
            <span className="ml-2 text-xl font-medium text-muted-foreground">({sortedAndFilteredVulnerabilities.length})</span>
         </h1>
      </div>
      
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                type="search"
                placeholder={t[language].search}
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                    {vulnerabilityCategories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                            {language === 'es' ? cat.label_es : cat.label_en}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
        <Button asChild>
            <Link href="/dashboard/vulnerabilities/new">
            <PlusCircle className="mr-2 h-4 w-4" /> {t[language].newVulnerability}
            </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => requestSort('title_en')} className="cursor-pointer hover:bg-muted/50">
                  <div className="flex flex-row items-center">{t[language].tableTitle} {getSortIcon('title_en')}</div>
                </TableHead>
                <TableHead onClick={() => requestSort('severity')} className="cursor-pointer hover:bg-muted/50">
                  <div className="flex flex-row items-center">{t[language].tableSeverity} {getSortIcon('severity')}</div>
                </TableHead>
                <TableHead onClick={() => requestSort('cvssScore')} className="cursor-pointer hover:bg-muted/50">
                  <div className="flex flex-row items-center">{t[language].tableCvss} {getSortIcon('cvssScore')}</div>
                </TableHead>
                <TableHead onClick={() => requestSort('cwe')} className="cursor-pointer hover:bg-muted/50">
                  <div className="flex flex-row items-center">{t[language].tableReference} {getSortIcon('cwe')}</div>
                </TableHead>
                <TableHead className="text-right">{t[language].tableActions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAndFilteredVulnerabilities.map((vuln) => (
                <TableRow key={vuln.id}>
                  <TableCell className="font-medium">
                     <Link href={`/dashboard/vulnerabilities/${vuln.id}`} className="hover:underline">
                        {language === 'es' ? vuln.title_es : vuln.title_en}
                     </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getSeverityVariant(vuln.severity)}>{vuln.severity}</Badge>
                  </TableCell>
                  <TableCell>{vuln.cvss.score.toFixed(1)}</TableCell>
                  <TableCell className="font-code text-sm text-muted-foreground">{vuln.cwe}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                         <Button variant="ghost" size="icon" onClick={() => handleEditVulnerability(vuln.id)}>
                           <Edit className="h-4 w-4" />
                           <span className="sr-only">{t[language].edit}</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setVulnerabilityToDelete(vuln)} className="text-destructive hover:bg-destructive hover:text-destructive-foreground">
                           <Trash2 className="h-4 w-4" />
                           <span className="sr-only">{t[language].delete}</span>
                        </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>

     <AlertDialog open={!!vulnerabilityToDelete} onOpenChange={() => setVulnerabilityToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>{t[language].confirmDeleteTitle}</AlertDialogTitle>
                <AlertDialogDescription>{t[language].confirmDeleteDesc}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>{t[language].cancel}</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteVulnerability} className="bg-destructive hover:bg-destructive/90">{t[language].delete}</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}

    
