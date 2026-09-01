import { NextRequest, NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';
import { assertPublicHttpUrl, SsrfBlockedError } from '@/lib/server/ssrf-guard';

export const runtime = 'nodejs';

const FETCH_TIMEOUT_MS = 5000;
const MAX_REDIRECTS = 3;
const MAX_BODY_BYTES = 2 * 1024 * 1024; // 2MB: de sobra para <head>, evita agotar memoria con respuestas gigantes
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

// Descarga con limite de tamano: aborta la conexion en cuanto se supera
// MAX_BODY_BYTES en vez de acumular la respuesta completa en memoria.
async function readBodyCapped(response: Response): Promise<string> {
    const reader = response.body?.getReader();
    if (!reader) return response.text();
    const decoder = new TextDecoder();
    let received = 0;
    let out = '';
    for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        received += value.byteLength;
        if (received > MAX_BODY_BYTES) {
            await reader.cancel().catch(() => {});
            break;
        }
        out += decoder.decode(value, { stream: true });
    }
    out += decoder.decode();
    return out;
}

// Sigue redirecciones manualmente (en vez de dejar que fetch las siga solo)
// para poder validar cada destino contra IPs privadas antes de seguirlo: sin
// esto, una URL publica podria redirigir a 169.254.169.254 o a un servicio
// interno y saltarse la comprobacion inicial.
async function fetchWithGuardedRedirects(initialUrl: string): Promise<{ response: Response; finalUrl: URL }> {
    let currentUrl = await assertPublicHttpUrl(initialUrl);

    for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
        let response: Response;
        try {
            response = await fetch(currentUrl, {
                headers: { 'User-Agent': USER_AGENT },
                redirect: 'manual',
                signal: controller.signal,
            });
        } finally {
            clearTimeout(timeout);
        }

        if (response.status >= 300 && response.status < 400) {
            const location = response.headers.get('location');
            if (!location) {
                throw new Error(`Redireccion sin Location (status ${response.status})`);
            }
            if (hop === MAX_REDIRECTS) {
                throw new Error('Demasiadas redirecciones');
            }
            currentUrl = await assertPublicHttpUrl(new URL(location, currentUrl).href);
            continue;
        }

        return { response, finalUrl: currentUrl };
    }

    throw new Error('Demasiadas redirecciones');
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    try {
        const { response, finalUrl } = await fetchWithGuardedRedirects(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch URL, status: ${response.status}`);
        }

        const html = await readBodyCapped(response);
        const dom = new JSDOM(html);
        const doc = dom.window.document;

        const getMetaTag = (name: string) => {
            const el = doc.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
            return el?.getAttribute('content') || '';
        };

        const title = getMetaTag('og:title') || getMetaTag('twitter:title') || doc.querySelector('title')?.textContent || '';
        const description = getMetaTag('og:description') || getMetaTag('twitter:description') || getMetaTag('description') || '';
        const image = getMetaTag('og:image') || getMetaTag('twitter:image') || '';

        let favicon = doc.querySelector('link[rel="shortcut icon"]')?.getAttribute('href') ||
                      doc.querySelector('link[rel="icon"]')?.getAttribute('href') || '';

        if (favicon && !favicon.startsWith('http')) {
            favicon = new URL(favicon, finalUrl.origin).href;
        }

        return NextResponse.json({
            title,
            description,
            image,
            favicon,
            hostname: finalUrl.hostname,
        });

    } catch (error) {
        if (error instanceof SsrfBlockedError) {
            return NextResponse.json({ error: 'URL not allowed' }, { status: 400 });
        }
        let message = 'Unknown error';
        if (error instanceof Error) {
            message = error.name === 'AbortError' ? 'Request timed out' : error.message;
        }
        return NextResponse.json({ error: 'Failed to fetch link preview', details: message }, { status: 500 });
    }
}
