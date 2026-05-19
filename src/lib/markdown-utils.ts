import TurndownService from 'turndown';
import type { ContentBlock } from './types';

const turndown = new TurndownService({ codeBlockStyle: 'fenced' });
const horizontalRulePattern = /^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/;

type SplitMarkdownIntoSectionsOptions = {
  maxHeadingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  fallbackToHorizontalRules?: boolean;
};

export function htmlToMarkdown(html: string): string {
  if (!html) return '';
  return turndown.turndown(html);
}

function normalizeMarkdownInput(input: string): string {
  const hasHtmlTags = /<\/?[a-z][\s\S]*>/i.test(input);
  const hasMarkdownStructure = /(^|\n)\s{0,3}#{1,6}\s+/.test(input)
    || /(^|\n)\s*[-*]\s+/.test(input)
    || /(^|\n)\s*\|.+\|\s*$/.test(input)
    || /```/.test(input);

  return (hasHtmlTags && !hasMarkdownStructure ? htmlToMarkdown(input) : input).replace(/\r\n/g, '\n');
}

function trimBoundarySeparators(lines: string[]) {
  const nextLines = [...lines];

  while (nextLines.length > 0 && (!nextLines[0].trim() || horizontalRulePattern.test(nextLines[0]))) {
    nextLines.shift();
  }

  while (nextLines.length > 0 && (!nextLines[nextLines.length - 1].trim() || horizontalRulePattern.test(nextLines[nextLines.length - 1]))) {
    nextLines.pop();
  }

  return nextLines;
}

function hasSectionContent(lines: string[]) {
  return trimBoundarySeparators(lines).some(line => line.trim());
}

function cleanMarkdownSection(content: string) {
  return trimBoundarySeparators(content.replace(/\r\n/g, '\n').split('\n')).join('\n').trim();
}

export function joinMarkdownSections(sections: Array<string | null | undefined>): string {
  return sections
    .map(section => cleanMarkdownSection(section || ''))
    .filter(Boolean)
    .join('\n\n---\n\n');
}

export function splitMarkdownIntoSections(input: string, options: SplitMarkdownIntoSectionsOptions = {}): string[] {
  if (!input || typeof input !== 'string') return [];

  const md = normalizeMarkdownInput(input);
  if (!md.trim()) return [];

  const maxHeadingLevel = options.maxHeadingLevel ?? 2;
  const fallbackToHorizontalRules = options.fallbackToHorizontalRules ?? true;
  const headingPattern = new RegExp(`^\\s{0,3}#{1,${maxHeadingLevel}}\\s+`);
  const lines = md.split('\n');
  const sections: string[] = [];
  let buffer: string[] = [];
  let inCode = false;

  const flush = () => {
    const content = cleanMarkdownSection(buffer.join('\n'));
    if (content) {
      sections.push(content);
    }
    buffer = [];
  };

  for (const line of lines) {
    const isSectionHeading = !inCode && headingPattern.test(line);

    if (isSectionHeading && hasSectionContent(buffer)) {
      flush();
    }

    buffer.push(line);

    if (line.startsWith('```')) {
      inCode = !inCode;
    }
  }

  if (hasSectionContent(buffer)) {
    flush();
  }

  if (fallbackToHorizontalRules && sections.length <= 1) {
    const horizontalRuleSections = md
      .split(/\n\s*(?:-{3,}|\*{3,}|_{3,})\s*\n/g)
      .map(cleanMarkdownSection)
      .filter(Boolean);

    if (horizontalRuleSections.length > sections.length) {
      return horizontalRuleSections;
    }
  }

  return sections;
}

export function parseMarkdownToBlocks(input: string): ContentBlock[] {
  if (!input) return [{ id: `block-${Date.now()}`, tag: 'p', content: '' }];

  function inferTag(content: string): ContentBlock['tag'] {
    const headingMatch = content.match(/^\s{0,3}(#{1,6})\s+/m);
    if (headingMatch) {
      const level = Math.min(headingMatch[1].length, 4);
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

  const blocks: ContentBlock[] = splitMarkdownIntoSections(input, { maxHeadingLevel: 2 })
    .map((content): ContentBlock => ({
      id: `block-${Date.now()}-${Math.random()}`,
      tag: inferTag(content),
      content,
      meta: { viewMode: 'split' },
    }));

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
