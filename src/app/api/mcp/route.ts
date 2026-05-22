import { NextResponse } from 'next/server';
import {
  MCP_DEFAULT_PROTOCOL_VERSION,
  MCP_INSTRUCTIONS,
  MCP_SERVER_INFO,
  MCP_SUPPORTED_PROTOCOL_VERSIONS,
  MCP_TOOLS,
} from '@/lib/mcp/tool-defs';
import { toolHandlers } from '@/lib/mcp/handlers';

// VulnForce MCP server (Streamable HTTP transport, stateless).
// Spec: https://modelcontextprotocol.io/specification/2025-06-18/basic/transports
// Any MCP client (Claude, Cursor, etc.) can connect to POST /api/mcp.

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type JsonRpcId = string | number | null;
type JsonRpcMessage = {
  jsonrpc?: string;
  id?: JsonRpcId;
  method?: string;
  params?: Record<string, unknown>;
};

function result(id: JsonRpcId, value: unknown) {
  return { jsonrpc: '2.0', id, result: value };
}

function error(id: JsonRpcId, code: number, message: string) {
  return { jsonrpc: '2.0', id, error: { code, message } };
}

function negotiateVersion(requested: unknown): string {
  if (typeof requested === 'string' && (MCP_SUPPORTED_PROTOCOL_VERSIONS as readonly string[]).includes(requested)) {
    return requested;
  }
  return MCP_DEFAULT_PROTOCOL_VERSION;
}

async function handleMessage(msg: JsonRpcMessage): Promise<object | null> {
  const { id, method, params } = msg;
  const isNotification = id === undefined || id === null;

  switch (method) {
    case 'initialize':
      return result(id ?? null, {
        protocolVersion: negotiateVersion(params?.protocolVersion),
        capabilities: { tools: { listChanged: false } },
        serverInfo: MCP_SERVER_INFO,
        instructions: MCP_INSTRUCTIONS,
      });

    case 'ping':
      return result(id ?? null, {});

    case 'notifications/initialized':
    case 'notifications/cancelled':
      // Notifications: no response body.
      return null;

    case 'tools/list':
      return result(id ?? null, { tools: MCP_TOOLS });

    case 'tools/call': {
      const name = typeof params?.name === 'string' ? params.name : '';
      const args = (params?.arguments as Record<string, unknown>) ?? {};
      const handler = toolHandlers[name];
      if (!handler) {
        return error(id ?? null, -32602, `Unknown tool: ${name}`);
      }
      try {
        const text = await handler(args);
        return result(id ?? null, { content: [{ type: 'text', text }], isError: false });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Tool execution failed';
        return result(id ?? null, { content: [{ type: 'text', text: message }], isError: true });
      }
    }

    default:
      if (isNotification) return null;
      return error(id ?? null, -32601, `Method not found: ${method ?? ''}`);
  }
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(error(null, -32700, 'Parse error'), { status: 400 });
  }

  // Batches were removed in 2025-06-18 but we tolerate arrays for older clients.
  if (Array.isArray(body)) {
    const responses: object[] = [];
    for (const msg of body as JsonRpcMessage[]) {
      const res = await handleMessage(msg);
      if (res) responses.push(res);
    }
    if (responses.length === 0) return new NextResponse(null, { status: 202 });
    return NextResponse.json(responses);
  }

  const msg = body as JsonRpcMessage;
  const res = await handleMessage(msg);
  if (res === null) {
    // Notification / response accepted, no body.
    return new NextResponse(null, { status: 202 });
  }
  return NextResponse.json(res);
}

export function GET() {
  // We do not offer a server-initiated SSE stream at this endpoint.
  return new NextResponse('Method Not Allowed', { status: 405 });
}
