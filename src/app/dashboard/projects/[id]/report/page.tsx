
'use client';

import { notFound, useParams } from 'next/navigation';
import { projects, clients, findings as allFindings, vulnerabilities as allVulnerabilities } from '@/lib/data';
import { MarkdownPreview } from '@/components/markdown-preview';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Logo } from '@/components/logo';

export default function ReportPage() {
  const params = useParams();
  const { id: projectId } = params;

  const project = projects.find(p => p.id === projectId);
  if (!project) {
    notFound();
  }

  const client = clients.find(c => c.id === project.clientId);
  const projectFindings = allFindings.filter(f => f.projectId === project.id);

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'destructive';
      case 'High': return 'destructive';
      case 'Medium': return 'default';
      case 'Low': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen report-container">
        <style jsx global>{`
            @media print {
                body {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                .report-container {
                    background-color: white !important;
                    color: black !important;
                }
                .no-print {
                    display: none;
                }
                @page {
                    size: A4;
                    margin: 1.5cm;
                }
            }
        `}</style>
      <main className="max-w-4xl mx-auto p-8 md:p-12">
        <header className="flex justify-between items-start mb-12">
          <div>
            <h1 className="font-headline text-4xl font-bold text-primary">{project.name}</h1>
            <p className="text-xl text-muted-foreground">{client?.name}</p>
          </div>
          <Logo />
        </header>

        <section className="mb-12">
          <h2 className="font-headline text-2xl font-bold border-b-2 border-primary pb-2 mb-4">Executive Summary</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {/* TODO: Add an executive summary section to the project data model and render here */}
            <p>This report details the findings of the penetration test conducted on <strong>{project.name}</strong> for <strong>{client?.name}</strong> between {new Date(project.startDate).toLocaleDateString()} and {new Date(project.endDate).toLocaleDateString()}. The assessment identified <strong>{projectFindings.length}</strong> total vulnerabilities, including <strong>{projectFindings.filter(f => f.severity === 'Critical').length}</strong> critical and <strong>{projectFindings.filter(f => f.severity === 'High').length}</strong> high-risk findings. Urgent remediation is recommended for critical vulnerabilities to mitigate potential impact.</p>
          </div>
        </section>

        <section className="mb-12">
            <h2 className="font-headline text-2xl font-bold border-b-2 border-primary pb-2 mb-4">Scope & Methodology</h2>
             <div className="prose prose-lg dark:prose-invert max-w-none">
                <MarkdownPreview content={project.scope} />
             </div>
        </section>

        <section>
          <h2 className="font-headline text-2xl font-bold border-b-2 border-primary pb-2 mb-8">Detailed Findings</h2>
          <div className="space-y-12">
            {projectFindings.map((finding, index) => {
               const vulnerability = allVulnerabilities.find(v => v.id === finding.vulnerabilityId);
              return (
                <div key={finding.id} className="break-after-page">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-headline text-xl font-bold">{index + 1}. {finding.title}</h3>
                    <Badge variant={getSeverityVariant(finding.severity) as any} className="text-base px-3 py-1">{finding.severity}</Badge>
                  </div>
                  <p className="font-code text-sm text-muted-foreground mb-6">CVSS: {finding.cvss.toFixed(1)}</p>
                  
                  <Separator className="my-6" />

                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <MarkdownPreview content={finding.markdown} />
                  </div>
                  
                  {vulnerability && (
                     <div className="prose prose-lg dark:prose-invert max-w-none mt-6">
                        <h4 className='font-bold'>Recommendations</h4>
                        <p>{vulnerability.recommendations_en}</p>
                     </div>
                  )}

                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

    