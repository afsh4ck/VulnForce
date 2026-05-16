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
  const md = looksLikeHtml ? htmlToMarkdown(input) : input;

  const lines = md.split('\n');
  const blocks: ContentBlock[] = [];

  let buffer: string[] = [];
  let currentTag: ContentBlock['tag'] = 'p';
  let inCode = false;

  function flush() {
    if (inCode) return; // shouldn't happen
    if (buffer.length === 0 && currentTag !== 'hr') return;
    const content = buffer.join('\n').trim();
    blocks.push({ id: `block-${Date.now()}-${Math.random()}`, tag: currentTag, content });
    buffer = [];
    currentTag = 'p';
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('```')) {
      if (inCode) {
        // closing
        inCode = false;
        flush();
      } else {
        // start code block
        flush();
        inCode = true;
        currentTag = 'pre';
        buffer.push(line.replace(/^```\s*/, ''));
      }
      continue;
    }

    if (inCode) {
      buffer.push(line);
      continue;
    }

    if (/^#{1,6}\s+/.test(line)) {
      flush();
      const level = line.match(/^(#{1,6})\s+/)![1].length;
      const tag = (`h${level}`) as ContentBlock['tag'];
      blocks.push({ id: `block-${Date.now()}-${Math.random()}`, tag, content: line.replace(/^#{1,6}\s+/, '').trim() });
      continue;
    }

    if (/^---\s*$/.test(line)) {
      flush();
      blocks.push({ id: `block-${Date.now()}-${Math.random()}`, tag: 'hr', content: '' });
      continue;
    }

    if (/^>\s?/.test(line)) {
      flush();
      blocks.push({ id: `block-${Date.now()}-${Math.random()}`, tag: 'blockquote', content: line.replace(/^>\s?/, '').trim() });
      continue;
    }

    if (/^(-|\*|\d+\.)\s+/.test(line)) {
      if (currentTag !== 'ul' && currentTag !== 'ol') {
        flush();
        currentTag = line.match(/^(\d+\.)/) ? 'ol' : 'ul';
        buffer = [];
      }
      buffer.push(line.replace(/^(-|\*|\d+\.)\s+/, ''));
      // If next line not a list item, flush
      const next = lines[i+1] || '';
      if (!/^(-|\*|\d+\.)\s+/.test(next)) {
        // convert buffer to markdown list
        const listMd = buffer.map(l => (currentTag === 'ol' ? `1. ${l}` : `- ${l}`)).join('\n');
        blocks.push({ id: `block-${Date.now()}-${Math.random()}`, tag: currentTag, content: listMd });
        buffer = [];
        currentTag = 'p';
      }
      continue;
    }

    // default paragraph accumulation
    buffer.push(line);
    const next = lines[i+1] || '';
    if (next.trim() === '') {
      flush();
    }
  }

  if (buffer.length > 0) flush();

  if (blocks.length === 0) return [{ id: `block-${Date.now()}`, tag: 'p', content: '' }];
  return blocks;
}

export function blocksToMarkdown(blocks: ContentBlock[]): string {
  return blocks.map(b => {
    switch (b.tag) {
      case 'hr': return '---';
      case 'pre': return `\n\n\`\`\`\n${b.content}\n\`\`\`\n\n`;
      case 'ul': return b.content.split('\n').map(l => l.startsWith('-') ? l : `- ${l}`).join('\n');
      case 'ol': return b.content.split('\n').map(l => l.startsWith('1.') ? l : `1. ${l}`).join('\n');
      case 'blockquote': return `> ${b.content}`;
      case 'table': return b.content; // assume markdown table already
      default:
        if (b.tag && b.tag.startsWith('h')) {
          const level = b.tag.replace('h', '');
          return `${'#'.repeat(Number(level))} ${b.content}`;
        }
        return b.content;
    }
  }).join('\n\n');
}
