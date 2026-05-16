import TurndownService from 'turndown';
import type { ContentBlock } from './types';

const turndown = new TurndownService({ codeBlockStyle: 'fenced' });

export function htmlToMarkdown(html: string): string {
  if (!html) return '';
  return turndown.turndown(html);
}

export function parseMarkdownToBlocks(input: string): ContentBlock[] {
  if (!input) return [{ id: `block-${Date.now()}`, tag: 'p', content: '' }];

  // If input looks like HTML, convert to markdown first
  const looksLikeHtml = /<[^>]+>/g.test(input);
  const md = (looksLikeHtml ? htmlToMarkdown(input) : input).replace(/\r\n/g, '\n');

  const lines = md.split('\n');
  const blocks: ContentBlock[] = [];
  let buffer: string[] = [];
  let inCode = false;

  function inferTag(content: string): ContentBlock['tag'] {
    const headingMatch = content.match(/^#{1,6}\s+/m);
    if (headingMatch) {
      const level = headingMatch[0].trim().length;
      return (`h${level}`) as ContentBlock['tag'];
    }

    if (/^\s*---\s*$/.test(content)) return 'hr';
    if (/^\s*\|.+\|\s*$/m.test(content)) return 'table';
    if (/^```/m.test(content)) return 'pre';
    if (/^>\s?/m.test(content)) return 'blockquote';
    if (/^\s*\d+\.\s+/m.test(content)) return 'ol';
    if (/^\s*[-*]\s+/m.test(content)) return 'ul';
    return 'p';
  }

  function flush() {
    const content = buffer.join('\n').trim();
    if (!content) {
      buffer = [];
      return;
    }

    blocks.push({
      id: `block-${Date.now()}-${Math.random()}`,
      tag: inferTag(content),
      content,
      meta: { viewMode: 'split' },
    });
    buffer = [];
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('```')) {
      inCode = !inCode;
      buffer.push(line);
      continue;
    }

    if (!inCode && /^#{1,2}\s+/.test(line) && buffer.length > 0) {
      flush();
    }

    buffer.push(line);
  }

  if (buffer.length > 0) flush();

  if (blocks.length === 0) return [{ id: `block-${Date.now()}`, tag: 'p', content: '', meta: { viewMode: 'split' } }];
  return blocks;
}

export function blocksToMarkdown(blocks: ContentBlock[]): string {
  return blocks.map(b => {
    const content = (b.content || '').trim();
    if (/^#{1,6}\s+/m.test(content)) return content;

    switch (b.tag) {
      case 'hr': return '---';
      case 'pre': return /^```/m.test(content) ? content : `\n\n\`\`\`\n${content}\n\`\`\`\n\n`;
      case 'ul': return content.split('\n').map(l => l.startsWith('-') ? l : `- ${l}`).join('\n');
      case 'ol': return content.split('\n').map(l => /^\d+\.\s/.test(l) ? l : `1. ${l}`).join('\n');
      case 'blockquote': return content.split('\n').map(l => l.startsWith('>') ? l : `> ${l}`).join('\n');
      case 'table': return content; // assume markdown table already
      default:
        if (b.tag && b.tag.startsWith('h')) {
          const level = b.tag.replace('h', '');
          return `${'#'.repeat(Number(level))} ${content}`;
        }
        return content;
    }
  }).join('\n\n');
}
