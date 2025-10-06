'use client';

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Search, Pencil, PlusCircle } from "lucide-react";
import { vulnerabilities } from "@/lib/data";
import { useLanguage } from "@/context/language-context";
import type { Vulnerability } from "@/lib/types";
import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function VulnerabilitiesPage() {
  const { language } = useLanguage();
  
  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-500 hover:bg-red-500/80 text-white';
      case 'High': return 'bg-orange-500 hover:bg-orange-500/80 text-white';
      case 'Medium': return 'bg-yellow-500 hover:bg-yellow-500/80 text-black';
      case 'Low': return 'bg-green-500 hover:bg-green-500/80 text-white';
      default: return 'bg-gray-500 hover:bg-gray-500/80 text-white';
    }
  }


  const t = {
    en: {
      title: "Vulnerability Database",
      search: "Search...",
      filterSeverity: "Filter by severity",
      allSeverities: "All Severities",
      critical: "Critical",
      high: "High",
      medium: "Medium",
      low: "Low",
      tableTitle: "Title",
      tableSeverity: "Severity",
      tableCvss: "CVSS",
      tableReference: "Reference",
      tableActions: "Actions",
      edit: "Edit",
      newVulnerability: "New Vulnerability"
    },
    es: {
      title: "Base de Datos de Vulnerabilidades",
      search: "Buscar...",
      filterSeverity: "Filtrar por severidad",
      allSeverities: "Todas las Severidades",
      critical: "Crítica",
      high: "Alta",
      medium: "Media",
      low: "Baja",
      tableTitle: "Título",
      tableSeverity: "Severidad",
      tableCvss: "CVSS",
      tableReference: "Referencia",
      tableActions: "Acciones",
      edit: "Editar",
      newVulnerability: "Nueva Vulnerabilidad"
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold tracking-tight">{t[language].title}</h1>
      
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                type="search"
                placeholder={t[language].search}
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                />
            </div>
            <Select>
                <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t[language].filterSeverity} />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="all">{t[language].allSeverities}</SelectItem>
                <SelectItem value="critical">{t[language].critical}</SelectItem>
                <SelectItem value="high">{t[language].high}</SelectItem>
                <SelectItem value="medium">{t[language].medium}</SelectItem>
                <SelectItem value="low">{t[language].low}</SelectItem>
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
                <TableHead>{t[language].tableTitle}</TableHead>
                <TableHead>{t[language].tableSeverity}</TableHead>
                <TableHead>{t[language].tableCvss}</TableHead>
                <TableHead>{t[language].tableReference}</TableHead>
                <TableHead className="text-right">{t[language].tableActions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vulnerabilities.map((vuln) => (
                <TableRow key={vuln.id}>
                  <TableCell className="font-medium">{vuln.title_en}</TableCell>
                  <TableCell>
                    <Badge className={getSeverityClass(vuln.severity)}>{vuln.severity}</Badge>
                  </TableCell>
                  <TableCell>{vuln.cvss.toFixed(1)}</TableCell>
                  <TableCell className="font-code text-sm text-muted-foreground">{vuln.reference}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/vulnerabilities/${vuln.id}`}>
                        <Pencil className="mr-2 h-4 w-4" />
                        {t[language].edit}
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
