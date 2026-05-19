'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { ImperativePanelGroupHandle } from 'react-resizable-panels';
import { Bold, ChevronRight, Code, GripVertical, ImageIcon, Italic, List, Trash2 } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MarkdownPreview } from '@/components/markdown-preview';
import { cn } from '@/lib/utils';
import { stripMarkdownText } from '@/lib/todo-utils';
import type { ImageAsset } from '@/lib/types';
import { ImageUploadDialog } from '@/components/image-upload-dialog';
import { useData } from '@/context/data-context';

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
  image?: string;
  delete?: string;
  confirmDeleteTitle?: string;
  confirmDeleteDescription?: string;
  cancel?: string;
  confirmDelete?: string;
  expand?: string;
  collapse?: string;
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
  splitLayout?: number[];
  onSplitLayoutChange?: (layout: number[]) => void;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  onDragHandleClick?: () => void;
};

type HighlightedMarkdownTextareaProps = {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onPaste?: (event: React.ClipboardEvent<HTMLTextAreaElement>) => void;
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
  image: 'Insert image',
  delete: 'Delete section',
  confirmDeleteTitle: 'Delete section?',
  confirmDeleteDescription: 'This section will be removed from the editor. You can undo the change with Control+Z.',
  cancel: 'Cancel',
  confirmDelete: 'Delete',
  expand: 'Expand section',
  collapse: 'Collapse sections',
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
  ({ value, onChange, onFocus, onKeyDown, onPaste, placeholder, textareaRef, className, minHeightClassName = 'min-h-[420px]' }, forwardedRef) => {
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
          onPaste={onPaste}
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
  splitLayout,
  onSplitLayoutChange,
  collapsed = false,
  onCollapsedChange,
  onDragHandleClick,
}: SectionMarkdownEditorProps) {
  const { addImage, getImage: getStoredImage } = useData();
  const localTextareaRef = useRef<HTMLTextAreaElement>(null);
  const panelGroupRef = useRef<ImperativePanelGroupHandle | null>(null);
  const textareaRef = externalTextareaRef || localTextareaRef;
  const mergedLabels = { ...defaultLabels, ...labels };
  const [localMode, setLocalMode] = useState<SectionEditorMode>(defaultMode);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const currentMode = mode || localMode;
  const normalizedSplitLayout = splitLayout && splitLayout.length >= 2 ? splitLayout : [52, 48];

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

  useEffect(() => {
    if (currentMode !== 'split' || !panelGroupRef.current || !splitLayout || splitLayout.length < 2) return;
    const currentLayout = panelGroupRef.current.getLayout();
    const changed = currentLayout.length !== splitLayout.length
      || currentLayout.some((size, index) => Math.abs(size - splitLayout[index]) > 0.5);

    if (changed) {
      panelGroupRef.current.setLayout(splitLayout);
    }
  }, [currentMode, splitLayout]);

  const updateTitle = (title: string) => {
    onChange(replaceSectionTitle(content, title));
  };

  const insertMarkdownAtCursor = (markdown: string) => {
    const textarea = textareaRef.current;
    const currentValue = textarea?.value ?? content;
    const start = textarea?.selectionStart ?? currentValue.length;
    const end = textarea?.selectionEnd ?? currentValue.length;
    const before = currentValue.slice(0, start);
    const after = currentValue.slice(end);
    const trimmedMarkdown = markdown.trim();
    const prefix = before.trim() && !before.endsWith('\n\n') ? (before.endsWith('\n') ? '\n' : '\n\n') : '';
    const suffix = after.trim() && !after.startsWith('\n\n') ? (after.startsWith('\n') ? '\n' : '\n\n') : '';
    const nextValue = `${before}${prefix}${trimmedMarkdown}${suffix}${after}`;
    const nextCursor = before.length + prefix.length + trimmedMarkdown.length;

    onChange(nextValue);
    window.setTimeout(() => {
      textarea?.focus();
      textarea?.setSelectionRange(nextCursor, nextCursor);
    }, 0);
  };

  const readFileAsDataUrl = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  };

  const handlePaste = async (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const files = Array.from(event.clipboardData.items)
      .filter(item => item.kind === 'file' && item.type.startsWith('image/'))
      .map(item => item.getAsFile())
      .filter((file): file is File => Boolean(file));

    if (files.length === 0) return;

    event.preventDefault();

    const markdownImages = await Promise.all(files.map(async (file, index) => {
      const dataUrl = await readFileAsDataUrl(file);
      const image = addImage(dataUrl);
      const alt = file.name || `Pasted image ${index + 1}`;
      return `![${alt}](image://${image.id})`;
    }));

    insertMarkdownAtCursor(markdownImages.join('\n\n'));
  };

  const applyMarkdownFormat = (formatType: 'bold' | 'italic' | 'code' | 'bullets') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.slice(start, end);
    const value = textarea.value;

    const applyReplacement = (
      replacement: string,
      replaceStart = start,
      replaceEnd = end,
      selectionStart = replaceStart,
      selectionEnd = replaceStart + replacement.length
    ) => {
      textarea.setRangeText(replacement, replaceStart, replaceEnd, 'end');
      onChange(textarea.value);
      textarea.focus();
      window.setTimeout(() => {
        if (!textarea.isConnected) return;
        textarea.setSelectionRange(selectionStart, selectionEnd);
      }, 0);
    };

    const wrapOrUnwrap = (prefix: string, suffix: string, fallback: string) => {
      const isSingleAsterisk = prefix === '*' && suffix === '*';
      const selectedHasOwnWrapper = selected.startsWith(prefix)
        && selected.endsWith(suffix)
        && selected.length >= prefix.length + suffix.length
        && (!isSingleAsterisk || !(selected.startsWith('**') && selected.endsWith('**')));

      if (selectedHasOwnWrapper) {
        const inner = selected.slice(prefix.length, selected.length - suffix.length);
        applyReplacement(inner, start, end, start, start + inner.length);
        return;
      }

      const hasWrappedSelection = start >= prefix.length
        && value.slice(start - prefix.length, start) === prefix
        && value.slice(end, end + suffix.length) === suffix
        && (!isSingleAsterisk || (value.slice(start - 2, start) !== '**' && value.slice(end, end + 2) !== '**'));

      if (hasWrappedSelection) {
        applyReplacement(selected, start - prefix.length, end + suffix.length, start - prefix.length, start - prefix.length + selected.length);
        return;
      }

      const inner = selected || fallback;
      const replacement = `${prefix}${inner}${suffix}`;
      const innerStart = start + prefix.length;
      applyReplacement(replacement, start, end, innerStart, innerStart + inner.length);
    };

    if (formatType === 'bold') {
      wrapOrUnwrap('**', '**', 'bold');
      return;
    } else if (formatType === 'italic') {
      wrapOrUnwrap('*', '*', 'italic');
      return;
    } else if (formatType === 'code') {
      if (selected.includes('\n')) {
        wrapOrUnwrap('```\n', '\n```', 'code');
      } else {
        wrapOrUnwrap('`', '`', 'code');
      }
      return;
    }

    if (!selected) {
      applyReplacement('- ', start, end, start + 2, start + 2);
      return;
    }

    const lines = selected.split('\n');
    const allListItems = lines.filter(line => line.trim()).every(line => /^\s*[-*]\s+/.test(line));
    const replacement = allListItems
      ? lines.map(line => line.replace(/^(\s*)[-*]\s+/, '$1')).join('\n')
      : lines.map(line => (line.trim() ? (line.trim().startsWith('- ') ? line : `- ${line}`) : line)).join('\n');
    applyReplacement(replacement, start, end, start, start + replacement.length);
  };

  const editor = (extraClassName?: string) => (
    <HighlightedMarkdownTextarea
      value={content}
      onChange={onChange}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      onPaste={handlePaste}
      placeholder={mergedLabels.writeContent}
      textareaRef={textareaRef}
      minHeightClassName={minHeightClassName}
      className={extraClassName}
    />
  );

  const renderedPreviewContent = previewContent ?? content;
  const collapseForDrag = () => {
    onDragHandleClick?.();
    onCollapsedChange?.(true);
  };
  const dragListenerProps = dragListeners || {};

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
            <button
              type="button"
              {...dragHandleProps}
              {...dragListenerProps}
              className="cursor-grab rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              title={mergedLabels.collapse}
              onPointerDown={(event) => {
                dragListenerProps.onPointerDown?.(event);
                collapseForDrag();
              }}
            >
              <GripVertical className="h-5 w-5" />
            </button>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{mergedLabels.section}</p>
            {collapsed ? (
              <button
                type="button"
                className="block max-w-full truncate text-left font-headline text-lg font-semibold text-foreground"
                onClick={() => onCollapsedChange?.(false)}
                title={mergedLabels.expand}
              >
                {sectionTitle}
              </button>
            ) : (
              <Input
                value={sectionTitle}
                onChange={(event) => updateTitle(event.target.value)}
                className="h-auto truncate border-0 bg-transparent p-0 font-headline text-lg font-semibold text-foreground shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            )}
          </div>
        </div>

        {collapsed ? (
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8" title={mergedLabels.expand} onClick={() => onCollapsedChange?.(false)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
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
            <ImageUploadDialog onInsert={insertMarkdownAtCursor}>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8" title={mergedLabels.image} onMouseDown={(e) => e.preventDefault()}>
                <ImageIcon className="h-4 w-4" />
              </Button>
            </ImageUploadDialog>
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
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                title={mergedLabels.delete}
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{mergedLabels.confirmDeleteTitle}</AlertDialogTitle>
                  <AlertDialogDescription>{mergedLabels.confirmDeleteDescription}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{mergedLabels.cancel}</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={onDelete}>
                    {mergedLabels.confirmDelete}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
        )}
      </div>

      {!collapsed && (
      <div className="overflow-hidden rounded-md border bg-background">
        {currentMode === 'split' ? (
          <ResizablePanelGroup
            ref={panelGroupRef}
            direction="horizontal"
            className={minHeightClassName}
            onLayout={(layout) => onSplitLayoutChange?.(layout)}
          >
            <ResizablePanel defaultSize={normalizedSplitLayout[0]} minSize={25}>
              {editor('border-0')}
            </ResizablePanel>
            <ResizableHandle className="w-1 bg-border transition-colors hover:bg-yellow-400 data-[resize-handle-state=drag]:bg-yellow-400" />
            <ResizablePanel defaultSize={normalizedSplitLayout[1]} minSize={25}>
              <div className={cn('h-full overflow-auto p-5', minHeightClassName)}>
                <MarkdownPreview content={renderedPreviewContent} getImage={getImage ?? getStoredImage} />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : currentMode === 'preview' ? (
          <div className={cn('overflow-auto p-5', minHeightClassName)}>
            <MarkdownPreview content={renderedPreviewContent} getImage={getImage ?? getStoredImage} />
          </div>
        ) : (
          editor()
        )}
      </div>
      )}
    </section>
  );
}
