import { projects, clients, findings } from "@/lib/data";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, FileText } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const project = projects.find(p => p.id === params.id);
  
  if (!project) {
    notFound();
  }

  const client = clients.find(c => c.id === project.clientId);
  const projectFindings = findings.filter(f => f.projectId === project.id);

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'destructive';
      case 'High': return 'destructive';
      case 'Medium': return 'default';
      case 'Low': return 'secondary';
      default: return 'outline';
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{client?.name}</p>
        <h1 className="font-headline text-3xl font-bold tracking-tight">{project.name}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Status: <Badge variant={project.status === 'Completed' ? 'secondary' : 'default'}>{project.status}</Badge></span>
          <span>Scope: <span className="font-code">{project.scope}</span></span>
          <span>{new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}</span>
        </div>
      </div>
      
      <Separator />

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Findings</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm"><FileText className="mr-2 h-4 w-4" /> Export Report</Button>
              <Button size="sm" asChild>
                <Link href={`/dashboard/projects/${project.id}/findings/new`}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Finding
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>CVSS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectFindings.map(finding => (
                  <TableRow key={finding.id}>
                    <TableCell className="font-medium">
                      <Link href={`/dashboard/projects/${project.id}/findings/${finding.id}`} className="hover:underline">{finding.title}</Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getSeverityVariant(finding.severity) as any}>{finding.severity}</Badge>
                    </TableCell>
                    <TableCell>{finding.cvss.toFixed(1)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Client</span>
              <span>{client?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Project Name</span>
              <span>{project.name}</span>
            </div>
             <div className="flex flex-col">
              <span className="text-muted-foreground">Scope</span>
              <span className="font-code text-right">{project.scope}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Start Date</span>
              <span>{new Date(project.startDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">End Date</span>
              <span>{new Date(project.endDate).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
