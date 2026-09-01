'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { useLanguage } from '@/context/language-context';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlugsConnected, Copy, CheckCircle, AlertCircle } from '@/components/icons';
import { MCP_TOOLS, MCP_SKILLS } from '@/lib/mcp/tool-defs';
import { syntaxTheme } from '@/components/code-block';

const T = {
  en: {
    title: 'MCP Server',
    subtitle:
      'VulnForce exposes its own MCP server. Connect any AI client (Claude, Cursor, Codex, Gemini…) and let it create and edit your reports through tools.',
    endpoint: 'Server endpoint',
    test: 'Test connection',
    testing: 'Testing…',
    online: 'Online',
    offline: 'Unreachable',
    onlineDesc: (v: string, n: number) => `Protocol ${v} · ${n} tools available`,
    offlineDesc: 'No response from the MCP endpoint. Make sure VulnForce is running.',
    copy: 'Copy',
    copied: 'Copied',
    connectTitle: 'Connect a client',
    connectDesc: 'Add VulnForce to your AI client. Pick the snippet that matches it.',
    httpClients: 'Clients with native HTTP MCP (Cursor, VS Code, Claude Code)',
    stdioClients: 'Clients that only speak stdio (Claude Desktop) — bridge with mcp-remote',
    cliClients: 'Claude Code CLI (one command)',
    toolsTitle: 'Available tools',
    toolsDesc: 'These are the actions an AI client can perform on your reports.',
    skillsTitle: 'Report-generation skills',
    skillsDesc: 'On-connect, an AI client fetches these playbooks (get_skill / MCP prompts) to write professional reports with minimal token use.',
    usageTitle: 'How to use it',
    steps: [
      'Keep VulnForce running — this page is the live MCP endpoint.',
      'Copy the server URL above.',
      'Add it to your AI client using one of the snippets, then restart the client.',
      'Ask the AI, e.g. "list my VulnForce projects" or "append a Conclusions section to report proj-123".',
      'Reload VulnForce in the browser to see changes the AI wrote to your reports.',
    ],
    note: 'Note: the AI writes directly to the report store on disk. If the app is open, reload it to pull the changes (and avoid the open tab overwriting them).',
  },
  es: {
    title: 'Servidor MCP',
    subtitle:
      'VulnForce expone su propio servidor MCP. Conecta cualquier cliente de IA (Claude, Cursor, Codex, Gemini…) y deja que cree y edite tus informes mediante herramientas.',
    endpoint: 'Endpoint del servidor',
    test: 'Probar conexión',
    testing: 'Probando…',
    online: 'En línea',
    offline: 'Sin respuesta',
    onlineDesc: (v: string, n: number) => `Protocolo ${v} · ${n} herramientas disponibles`,
    offlineDesc: 'El endpoint MCP no responde. Asegúrate de que VulnForce está en marcha.',
    copy: 'Copiar',
    copied: 'Copiado',
    connectTitle: 'Conectar un cliente',
    connectDesc: 'Añade VulnForce a tu cliente de IA. Elige el snippet que le corresponda.',
    httpClients: 'Clientes con MCP por HTTP nativo (Cursor, VS Code, Claude Code)',
    stdioClients: 'Clientes que solo hablan stdio (Claude Desktop): puente con mcp-remote',
    cliClients: 'Claude Code CLI (un solo comando)',
    toolsTitle: 'Herramientas disponibles',
    toolsDesc: 'Estas son las acciones que un cliente de IA puede ejecutar sobre tus informes.',
    skillsTitle: 'Skills de generación de informes',
    skillsDesc: 'Al conectar, un cliente de IA descarga estos manuales (get_skill / prompts MCP) para redactar informes profesionales gastando el mínimo de tokens.',
    usageTitle: 'Cómo usarlo',
    steps: [
      'Mantén VulnForce en marcha: esta página es el endpoint MCP en vivo.',
      'Copia la URL del servidor de arriba.',
      'Añádela a tu cliente de IA con uno de los snippets y reinicia el cliente.',
      'Pídele a la IA, p. ej. "lista mis proyectos de VulnForce" o "añade una sección de Conclusiones al informe proj-123".',
      'Recarga VulnForce en el navegador para ver los cambios que la IA escribió en tus informes.',
    ],
    note: 'Nota: la IA escribe directamente en el almacén de informes en disco. Si la app está abierta, recárgala para traer los cambios (y evitar que la pestaña abierta los sobrescriba).',
  },
};

type Status = 'idle' | 'testing' | 'online' | 'error';

function CodeBlock({ code, copyLabel, copiedLabel, language }: { code: string; copyLabel: string; copiedLabel: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };
  return (
    <div className="relative">
      <div className="overflow-x-auto rounded-md border bg-muted/50 pr-20 text-xs leading-relaxed">
        {language ? (
          <SyntaxHighlighter
            language={language}
            style={syntaxTheme}
            customStyle={{
              margin: 0,
              padding: '0.75rem',
              backgroundColor: 'transparent',
              fontSize: '0.75rem',
              lineHeight: '1.625',
            }}
          >
            {code}
          </SyntaxHighlighter>
        ) : (
          <pre className="p-3 font-code"><code>{code}</code></pre>
        )}
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={onCopy}
        className="absolute right-2 top-2 h-7 gap-1.5 px-2 text-xs"
      >
        {copied ? <CheckCircle className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? copiedLabel : copyLabel}
      </Button>
    </div>
  );
}

export default function McpPage() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const t = T[language];

  const [origin, setOrigin] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [info, setInfo] = useState<{ version: string; tools: number } | null>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const endpoint = origin ? `${origin}/api/mcp` : '/api/mcp';

  const testConnection = async () => {
    setStatus('testing');
    setInfo(null);
    const headers = { 'content-type': 'application/json', accept: 'application/json, text/event-stream' };
    try {
      const initRes = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'initialize',
          params: {
            protocolVersion: '2025-06-18',
            capabilities: {},
            clientInfo: { name: 'vulnforce-web', version: '1.0.0' },
          },
        }),
      });
      const initJson = await initRes.json();
      const listRes = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/list' }),
      });
      const listJson = await listRes.json();
      const version = initJson?.result?.protocolVersion as string;
      const tools = (listJson?.result?.tools as unknown[])?.length ?? 0;
      if (!version) throw new Error('bad response');
      setInfo({ version, tools });
      setStatus('online');
    } catch {
      setStatus('error');
      toast({ variant: 'destructive', title: t.offline, description: t.offlineDesc });
    }
  };

  const snippetHttp = useMemo(
    () => `{
  "mcpServers": {
    "vulnforce": {
      "url": "${endpoint}"
    }
  }
}`,
    [endpoint]
  );

  const snippetStdio = useMemo(
    () => `{
  "mcpServers": {
    "vulnforce": {
      "command": "npx",
      "args": ["mcp-remote", "${endpoint}"]
    }
  }
}`,
    [endpoint]
  );

  const snippetCli = useMemo(() => `claude mcp add --transport http vulnforce ${endpoint}`, [endpoint]);

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <PlugsConnected className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold font-headline">{t.title}</h1>
        </div>
        <p className="text-muted-foreground text-sm max-w-3xl">{t.subtitle}</p>
      </div>

      <div className="mt-6 space-y-6">
        {/* Status */}
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg">{t.endpoint}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <code className="rounded-md border bg-muted/50 px-3 py-2 font-code text-sm break-all">{endpoint}</code>
              <Button onClick={testConnection} disabled={status === 'testing'}>
                {status === 'testing' ? t.testing : t.test}
              </Button>
              {status === 'online' && info && (
                <Badge className="gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5" />
                  {t.online}
                </Badge>
              )}
              {status === 'error' && (
                <Badge variant="destructive" className="gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {t.offline}
                </Badge>
              )}
            </div>
            {status === 'online' && info && (
              <p className="text-sm text-muted-foreground">{t.onlineDesc(info.version, info.tools)}</p>
            )}
          </CardContent>
        </Card>

        {/* Connect */}
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg">{t.connectTitle}</CardTitle>
            <CardDescription>{t.connectDesc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <p className="text-sm font-medium">{t.httpClients}</p>
              <CodeBlock code={snippetHttp} copyLabel={t.copy} copiedLabel={t.copied} language="json" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">{t.stdioClients}</p>
              <CodeBlock code={snippetStdio} copyLabel={t.copy} copiedLabel={t.copied} language="json" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">{t.cliClients}</p>
              <CodeBlock code={snippetCli} copyLabel={t.copy} copiedLabel={t.copied} />
            </div>
          </CardContent>
        </Card>

        {/* Tools */}
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg">{t.toolsTitle}</CardTitle>
            <CardDescription>{t.toolsDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {MCP_TOOLS.map((tool) => (
                <li key={tool.name} className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:items-baseline sm:gap-3">
                  <code className="font-code text-sm text-primary shrink-0">{tool.name}</code>
                  <span className="text-sm text-muted-foreground">{tool.description}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg">{t.skillsTitle}</CardTitle>
            <CardDescription>{t.skillsDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {MCP_SKILLS.map((skill) => (
                <li key={skill.id} className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:items-baseline sm:gap-3">
                  <code className="font-code text-sm text-primary shrink-0">{skill.id}</code>
                  <span className="text-sm text-muted-foreground">{skill.description}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg">{t.usageTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ol className="list-decimal space-y-1.5 pl-5 text-sm">
              {t.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
            <p className="rounded-md border border-dashed bg-muted/30 p-3 text-xs text-muted-foreground">{t.note}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
