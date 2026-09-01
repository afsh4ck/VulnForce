import { NextResponse } from 'next/server';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { atomicWriteJson, readJsonWithFallback } from '@/lib/server/atomic-file';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const DATA_DIR = path.join(process.cwd(), 'data');
const STATE_FILE = path.join(DATA_DIR, 'vulnforce-state.json');

async function ensureDir() {
  try {
    await mkdir(DATA_DIR, { recursive: true });
  } catch {
    // ignore
  }
}

export async function GET() {
  await ensureDir();
  try {
    const result = await readJsonWithFallback(STATE_FILE);
    if (!result) {
      return NextResponse.json({});
    }
    return new NextResponse(result.raw, { headers: { 'content-type': 'application/json' } });
  } catch {
    return NextResponse.json({ error: 'read-failed' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  await ensureDir();
  const body = await req.text();
  try {
    JSON.parse(body);
  } catch {
    return NextResponse.json({ error: 'invalid-json' }, { status: 400 });
  }
  try {
    await atomicWriteJson(STATE_FILE, body);
  } catch {
    return NextResponse.json({ error: 'write-failed' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
