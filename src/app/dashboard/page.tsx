import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { PlusCircle, Users, FolderKanban, ShieldCheck } from "lucide-react";
import { projects, clients, findings } from "@/lib/data";

export default function DashboardPage() {
  const criticalFindings = findings.filter(f => f.severity === 'Critical').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/dashboard/projects">
              <PlusCircle className="mr-2 h-4 w-4" /> New Project
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">Across all clients</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
            <p className="text-xs text-muted-foreground">Managed in the system</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Findings</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{findings.length}</div>
            <p className="text-xs text-muted-foreground">In active projects</p>
          </CardContent>
        </Card>
        <Card className="border-destructive">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Critical Findings</CardTitle>
                <ShieldCheck className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-destructive">{criticalFindings}</div>
                <p className="text-xs text-muted-foreground">Requiring immediate attention</p>
            </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {projects.slice(0, 3).map(p => (
                <li key={p.id} className="flex items-center justify-between rounded-md p-2 hover:bg-muted">
                    <div>
                        <Link href={`/dashboard/projects/${p.id}`} className="font-medium hover:underline">{p.name}</Link>
                        <p className="text-sm text-muted-foreground">{clients.find(c => c.id === p.clientId)?.name}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{p.status}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
