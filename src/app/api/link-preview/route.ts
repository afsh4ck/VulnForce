
import { NextRequest, NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch URL, status: ${response.status}`);
        }

        const html = await response.text();
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
            const urlObj = new URL(url);
            favicon = new URL(favicon, urlObj.origin).href;
        }

        const hostname = new URL(url).hostname;
        
        return NextResponse.json({
            title,
            description,
            image,
            favicon,
            hostname,
        });

    } catch (error) {
        let message = 'Unknown error';
        if (error instanceof Error) {
            message = error.message;
        }
        return NextResponse.json({ error: 'Failed to fetch link preview', details: message }, { status: 500 });
    }
}
