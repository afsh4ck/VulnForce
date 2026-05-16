'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bold, Code, GripVertical, Italic, List, Trash2 } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { MarkdownPreview } from '@/components/markdown-preview';
import { cn } from '@/lib/utils';
import { stripMarkdownText } from '@/lib/todo-utils';
import type { ImageAsset } from '@/lib/types';

type SectionEditorMode = 'split' | 'markdown' | 'preview';

type SectionEditorLabels = {
  section?: string;
  untitled?: string;
  split?: string;
  markdown?: string;
  preview?: string;
  writeContent?: string;
  bold?: string;
  italic?: string;
  code?: string;
  bullets?: string;
  delete?: string;
};

type SectionMarkdownEditorProps = {
  id?: string;
  content: string;
  previewContent?: string;
  onChange: (content: string) => void;
  onFocus?: () => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  titleFallback?: string;
  mode?: SectionEditorMode;
  defaultMode?: SectionEditorMode;
  onModeChange?: (mode: SectionEditorMode) => void;
  getImage?: (id: string) => ImageAsset | undefined;
  onDelete?: () => void;
  dragHandleProps?: any;
  dragListeners?: any;
  labels?: SectionEditorLabels;
  className?: string;
  minHeightClassName?: string;
  textareaRef?: React.RefObject<HTMLTextAreaElement>;
};

type HighlightedMarkdownTextareaProps = {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  textareaRef?: React.RefObject<HTMLTextAreaElement>;
  className?: string;
  minHeightClassName?: string;
};

const TODO_MARKER_REGEX = /\[TODO(?::?\s*([^\]]*))?\]|\bTODO\b/g;

const defaultLabels: Required<SectionEditorLabels> = {
  section: 'Section',
  untitled: 'Untitled section',
  split: 'Split',
  markdown: 'MD',
  preview: 'Preview',
  writeContent: 'Write Markdown content...',
  bold: 'Bold',
  italic: 'Italic',
  code: 'Code',
  bullets: 'Bulleted list',
  delete: 'Delete section',
};

const getHeading = (content: string) => {
  const match = content.match(/^(\s*)(#{1,6})\s+(.+)$/m);
  if (!match || match.index === undefined) return null;

  return {
    index: match.index,
    full: match[0],
    indent: match[1],
    hashes: match[2],
    title: stripMarkdownText(match[3]),
  };
};

const getSectionTitle = (content: string, fallback: string) => {
  const heading = getHeading(content);
  return heading?.title || fallback;
};

const replaceSectionTitle = (content: string, title: string) => {
  const trimmedTitle = title.trim() || defaultLabels.untitled;
  const heading = getHeading(content);

  if (!heading) {
    return `### ${trimmedTitle}${content.trim() ? `\n\n${content}` : ''}`;
  }

  const nextHeading = `${heading.indent}${heading.hashes} ${trimmedTitle}`;
  return `${content.slice(0, heading.index)}${nextHeading}${content.slice(heading.index + heading.full.length)}`;
};

const renderHighlightedMarkdown = (value: string) => {
  const parts: React.ReactNode[] = [];
  let cursor = 0;

  value.replace(TODO_MARKER_REGEX, (raw, _detail, offset: number) => {
    if (offset > cursor) {
      parts.push(value.slice(cursor, offset));
    }
    parts.push(
      <span key={`${offset}-${raw}`} className="font-semibold text-red-500">
        {raw}
      </span>
    );
    cursor = offset + raw.length;
    return raw;
  });

  if (cursor < value.length) {
    parts.push(value.slice(cursor));
  }

  return parts.length > 0 ? parts : '\u200b';
};

export const HighlightedMarkdownTextarea = React.forwardRef<HTMLTextAreaElement, HighlightedMarkdownTextareaProps>(
  ({ value, onChange, onFocus, onKeyDown, placeholder, textareaRef, className, minHeightClassName = 'min-h-[420px]' }, forwardedRef) => {
    const highlightRef = useRef<HTMLPreElement | null>(null);

    const setTextareaRef = (node: HTMLTextAreaElement | null) => {
      if (textareaRef) {
        (textareaRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
      }
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        (forwardedRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
      }
    };

    const handleScroll = (event: React.UIEvent<HTMLTextAreaElement>) => {
      if (!highlightRef.current) return;
      highlightRef.current.scrollTop = event.currentTarget.scrollTop;
      highlightRef.current.scrollLeft = event.currentTarget.scrollLeft;
    };

    return (
      <div className={cn('relative h-full overflow-hidden bg-background', minHeightClassName)}>
        <pre
          ref={highlightRef}
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-0 m-0 h-full w-full overflow-hidden whitespace-pre-wrap break-words border-0 p-4 font-code text-sm leading-6 text-foreground',
            minHeightClassName,
            className
          )}
        >
          {renderHighlightedMarkdown(value)}
          {'\n'}
        </pre>
        <textarea
          ref={setTextareaRef}
          value={value}
          placeholder={placeholder}
          spellCheck={false}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          onScroll={handleScroll}
          onChange={(event) => onChange(event.target.value)}
          className={cn(
            'relative z-10 h-full w-full resize-none border-0 bg-transparent p-4 font-code text-sm leading-6 text-transparent caret-foreground outline-none',
            'placeholder:text-muted-foreground selection:bg-primary/30 focus-visible:ring-0',
            minHeightClassName,
            className
          )}
        />
      </div>
    );
  }
);
HighlightedMarkdownTextarea.displayName = 'HighlightedMarkdownTextarea';

export function SectionMarkdownEditor({
  id,
  content,
  previewContent,
  onChange,
  onFocus,
  onKeyDown,
  titleFallback,
  mode,
  defaultMode = 'split',
  onModeChange,
  getImage,
  onDelete,
  dragHandleProps,
  dragListeners,
  labels,
  className,
  minHeightClassName = 'min-h-[520px]',
  textareaRef: externalTextareaRef,
}: SectionMarkdownEditorProps) {
  const localTextareaRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = externalTextareaRef || localTextareaRef;
  const mergedLabels = { ...defaultLabels, ...labels };
  const [localMode, setLocalMode] = useState<SectionEditorMode>(defaultMode);
  const currentMode = mode || localMode;

  useEffect(() => {
    if (!mode) {
      setLocalMode(defaultMode);
    }
  }, [defaultMode, mode]);

  const sectionTitle = useMemo(
    () => getSectionTitle(content, titleFallback || mergedLabels.untitled),
    [content, titleFallback, mergedLabels.untitled]
  );

  const setMode = (nextMode: SectionEditorMode) => {
    if (!mode) setLocalMode(nextMode);
    onModeChange?.(nextMode);
  };

  const updateTitle = (title: string) => {
    onChange(replaceSectionTitle(content, title));
  };

  const applyMarkdownFormat = (formatType: 'bold' | 'italic' | 'code' | 'bullets') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.slice(start, end);
    let replacement = selected;

    if (formatType === 'bold') {
      replacement = `**${selected || 'bold'}**`;
    } else if (formatType === 'italic') {
      replacement = `*${selected || 'italic'}*`;
    } else if (formatType === 'code') {
      replacement = selected.includes('\n')
        ? `\`\`\`\n${selected || 'code'}\n\`\`\``
        : `\`${selected || 'code'}\``;
    } else {
      replacement = selected
        ? selected.split('\n').map(line => line.trim().startsWith('- ') ? line : `- ${line}`).join('\n')
        : '- ';
    }

    textarea.setRangeText(replacement, start, end, 'end');
    onChange(textarea.value);
    textarea.focus();

    window.setTimeout(() => {
      if (!textarea.isConnected) return;
      if (!selected && formatType !== 'bullets') {
        const innerStart = start + (formatType === 'bold' ? 2 : 1);
        const fallbackLength = formatType === 'bold' ? 4 : formatType === 'italic' ? 6 : 4;
        textarea.setSelectionRange(innerStart, innerStart + fallbackLength);
      } else {
        textarea.setSelectionRange(start, start + replacement.length);
      }
    }, 0);
  };

  const editor = (extraClassName?: string) => (
    <HighlightedMarkdownTextarea
      value={content}
      onChange={onChange}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      placeholder={mergedLabels.writeContent}
      textareaRef={textareaRef}
      minHeightClassName={minHeightClassName}
      className={extraClassName}
    />
  );

  const renderedPreviewContent = previewContent ?? content;

  return (
    <section
      id={id}
      data-section-title={sectionTitle}
      className={cn('w-full scroll-mt-24', className)}
      onFocus={onFocus}
      dir="ltr"
    >
      <div className="mb-2 flex flex-col gap-3 border-b border-border pb-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {dragHandleProps && dragListeners && (
            <div {...dragHandleProps} {...dragListeners} className="cursor-grab rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
              <GripVertical className="h-5 w-5" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{mergedLabels.section}</p>
            <Input
              value={sectionTitle}
              onChange={(event) => updateTitle(event.target.value)}
              className="h-auto truncate border-0 bg-transparent p-0 font-headline text-lg font-semibold text-foreground shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-md border bg-background p-1">
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8" title={mergedLabels.bold} onMouseDown={(e) => e.preventDefault()} onClick={() => applyMarkdownFormat('bold')}>
              <Bold className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8" title={mergedLabels.italic} onMouseDown={(e) => e.preventDefault()} onClick={() => applyMarkdownFormat('italic')}>
              <Italic className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8" title={mergedLabels.code} onMouseDown={(e) => e.preventDefault()} onClick={() => applyMarkdownFormat('code')}>
              <Code className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8" title={mergedLabels.bullets} onMouseDown={(e) => e.preventDefault()} onClick={() => applyMarkdownFormat('bullets')}>
              <List className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center rounded-md border bg-background p-1">
            <Button type="button" variant={currentMode === 'split' ? 'default' : 'ghost'} size="sm" className="h-8" onClick={() => setMode('split')}>
              {mergedLabels.split}
            </Button>
            <Button type="button" variant={currentMode === 'markdown' ? 'default' : 'ghost'} size="sm" className="h-8" onClick={() => setMode('markdown')}>
              {mergedLabels.markdown}
            </Button>
            <Button type="button" variant={currentMode === 'preview' ? 'default' : 'ghost'} size="sm" className="h-8" onClick={() => setMode('preview')}>
              {mergedLabels.preview}
            </Button>
          </div>

          {onDelete && (
            <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-destructive" title={mergedLabels.delete} onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-md border bg-background">
        {currentMode === 'split' ? (
          <ResizablePanelGroup direction="horizontal" className={minHeightClassName}>
            <ResizablePanel defaultSize={52} minSize={25}>
              {editor('border-0')}
            </ResizablePanel>
            <ResizableHandle className="w-1 bg-border transition-colors hover:bg-yellow-400 data-[resize-handle-state=drag]:bg-yellow-400" />
            <ResizablePanel defaultSize={48} minSize={25}>
              <div className={cn('h-full overflow-auto p-5', minHeightClassName)}>
                <MarkdownPreview content={renderedPreviewContent} getImage={getImage} />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : currentMode === 'preview' ? (
          <div className={cn('overflow-auto p-5', minHeightClassName)}>
            <MarkdownPreview content={renderedPreviewContent} getImage={getImage} />
          </div>
        ) : (
          editor()
        )}
      </div>
    </section>
  );
}
