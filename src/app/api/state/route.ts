import { NextResponse } from 'next/server';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

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
    const raw = await readFile(STATE_FILE, 'utf8');
    return new NextResponse(raw, { headers: { 'content-type': 'application/json' } });
  } catch (err: any) {
    if (err && err.code === 'ENOENT') {
      return NextResponse.json({});
    }
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
    await writeFile(STATE_FILE, body, 'utf8');
  } catch {
    return NextResponse.json({ error: 'write-failed' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
