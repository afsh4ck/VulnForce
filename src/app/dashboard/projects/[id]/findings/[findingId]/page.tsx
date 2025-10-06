'use client';

import { useState, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import { findings as allFindings, projects, vulnerabilities, clients } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { Bot, ChevronLeft, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateFindingTemplates } from '@/ai/flows/generate-finding-templates';

export default function FindingEditorPage() {
  const params = useParams();
  const { id: projectId, findingId } = params;
  const { toast } = useToast();

  const [markdown, setMarkdown] = useState('');
  const [title, setTitle] = useState('');
  const [severity, setSeverity] = useState<string>('');
  const [cvss, setCvss] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (findingId !== 'new') {
      const finding = allFindings.find(f => f.id === findingId && f.projectId === projectId);
      if (finding) {
        setTitle(finding.title);
        setSeverity(finding.severity);
        setCvss(finding.cvss.toString());
        setMarkdown(finding.markdown);
      } else {
        notFound();
      }
    } else {
      setTitle('New Finding');
    }
  }, [findingId, projectId]);

  const project = projects.find(p => p.id === projectId);
  const client = clients.find(c => c.id === project?.clientId);

  const handleGenerate = async () => {
    setIsGenerating(true);
    toast({ title: 'AI is thinking...', description: 'Generating suggestions for your finding.' });

    try {
      const currentFindingDetails = `Title: ${title}\nSeverity: ${severity}\nCVSS: ${cvss}\n\n${markdown}`;
      const previousFindings = allFindings
        .filter(f => f.projectId === projectId && f.id !== findingId)
        .map(f => `Title: ${f.title}\n${f.markdown}`)
        .join('\n\n---\n\n');

      const result = await generateFindingTemplates({
        previousFindings,
        currentFindingDetails,
      });

      const newMarkdown = `### Description\n${result.descriptionSuggestion}\n\n### Risk\n${result.riskSuggestion}\n\n### Mitigation\n${result.mitigationSuggestion}`;
      setMarkdown(newMarkdown);

      toast({ title: 'Suggestions generated!', description: 'AI-powered content has been added to the editor.' });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'AI Generation Failed', description: 'Could not generate suggestions. Please try again.' });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const quickAdd = (section: string) => {
    const template = `\n### ${section}\n\n`;
    setMarkdown(markdown + template);
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      <header className="flex items-center justify-between border-b bg-background p-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/projects/${projectId}`}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Project
            </Link>
          </Button>
          <div>
            <h1 className="font-headline text-xl font-bold">{title}</h1>
            <p className="text-sm text-muted-foreground">{project?.name} / {client?.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleGenerate} disabled={isGenerating}>
            <Bot className="mr-2 h-4 w-4" /> {isGenerating ? 'Generating...' : 'Generate with AI'}
          </Button>
          <Button><Save className="mr-2 h-4 w-4" /> Save Finding</Button>
        </div>
      </header>
      <div className="grid flex-1 grid-cols-1 overflow-hidden md:grid-cols-3">
        {/* Left column: Editor and details */}
        <div className="flex flex-col overflow-y-auto border-r p-4 md:col-span-2">
          <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="flex flex-col space-y-4">
              <Label htmlFor="markdown-editor">Markdown Editor</Label>
              <Textarea
                id="markdown-editor"
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="font-code h-full min-h-[400px] flex-1 resize-none"
                placeholder="Start writing your finding details here..."
              />
               <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" size="sm" onClick={() => quickAdd('Description')}>+ Description</Button>
                  <Button variant="secondary" size="sm" onClick={() => quickAdd('Risk')}>+ Risk</Button>
                  <Button variant="secondary" size="sm" onClick={() => quickAdd('Evidence')}>+ Evidence</Button>
                  <Button variant="secondary" size="sm" onClick={() => quickAdd('Mitigation')}>+ Mitigation</Button>
                </div>
            </div>
            <div className="flex flex-col space-y-4">
              <Label>Live Preview</Label>
              <div className="prose prose-sm dark:prose-invert h-full min-h-[400px] w-full max-w-none rounded-md border bg-muted p-4">
                 <pre className="whitespace-pre-wrap font-sans text-sm">{markdown || "Preview will appear here."}</pre>
              </div>
            </div>
          </div>
        </div>
        {/* Right column: Finding details */}
        <aside className="hidden flex-col gap-6 overflow-y-auto p-4 md:flex">
          <Card>
            <CardHeader>
              <CardTitle>Finding Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="severity">Severity</Label>
                <Select value={severity} onValueChange={setSeverity}>
                  <SelectTrigger id="severity">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Informational">Informational</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvss">CVSS Score</Label>
                <Input id="cvss" type="number" step="0.1" value={cvss} onChange={e => setCvss(e.target.value)} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Import from Database</CardTitle>
            </CardHeader>
            <CardContent>
              <Select onValueChange={(vulnId) => {
                  const vuln = vulnerabilities.find(v => v.id === vulnId);
                  if (vuln) {
                      setTitle(vuln.title_en);
                      setSeverity(vuln.severity);
                      setCvss(vuln.cvss.toString());
                      setMarkdown(`### Description\n\n${vuln.description_en}\n\n### Mitigation\n\n${vuln.mitigation_en}`);
                  }
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a vulnerability template" />
                </SelectTrigger>
                <SelectContent>
                  {vulnerabilities.map(v => (
                    <SelectItem key={v.id} value={v.id}>{v.title_en}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
