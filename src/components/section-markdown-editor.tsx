'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { ImperativePanelGroupHandle } from 'react-resizable-panels';
import { Bold, ChevronRight, Code, GripVertical, ImageIcon, Italic, List, ListOrdered, Table, Trash2 } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
import type { VariableContext } from '@/lib/markdown-utils';
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
  numbered?: string;
  table?: string;
  tableRows?: string;
  tableCols?: string;
  tableInsert?: string;
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
  dragging?: boolean;
  variables?: VariableContext;
  isReportPreview?: boolean;
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
  numbered: 'Numbered list',
  table: 'Insert table',
  tableRows: 'Rows',
  tableCols: 'Columns',
  tableInsert: 'Insert',
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
  dragging = false,
  variables,
  isReportPreview = false,
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

  const [tableOpen, setTableOpen] = useState(false);
  const [tableRows, setTableRows] = useState(2);
  const [tableCols, setTableCols] = useState(2);

  const buildTableMarkdown = (rows: number, cols: number) => {
    const safeRows = Math.max(1, Math.floor(rows) || 1);
    const safeCols = Math.max(1, Math.floor(cols) || 1);
    const header = `| ${Array.from({ length: safeCols }, (_, i) => `Col ${i + 1}`).join(' | ')} |`;
    const separator = `| ${Array.from({ length: safeCols }, () => '---').join(' | ')} |`;
    const body = Array.from({ length: safeRows }, () => `| ${Array.from({ length: safeCols }, () => '   ').join(' | ')} |`).join('\n');
    return `${header}\n${separator}\n${body}`;
  };

  const insertTable = () => {
    insertMarkdownAtCursor(buildTableMarkdown(tableRows, tableCols));
    setTableOpen(false);
  };

  const handleListKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = event.currentTarget;
    if (event.defaultPrevented) return;
    if (event.metaKey || event.ctrlKey || event.altKey) return;

    const value = textarea.value;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const lineEndIdx = value.indexOf('\n', start);
    const lineEnd = lineEndIdx === -1 ? value.length : lineEndIdx;
    const currentLine = value.slice(lineStart, lineEnd);
    const beforeCursorOnLine = value.slice(lineStart, start);

    const emptyBulletMatch = /^(\s*)([-*])\s*$/.exec(currentLine);
    const emptyNumberedMatch = /^(\s*)(\d+)\.\s*$/.exec(currentLine);
    const bulletMatch = /^(\s*)([-*])\s+(.*)$/.exec(currentLine);
    const numberedMatch = /^(\s*)(\d+)\.\s+(.*)$/.exec(currentLine);

    if (event.key === 'Enter' && !event.shiftKey && start === end) {
      if (emptyBulletMatch || emptyNumberedMatch) {
        event.preventDefault();
        textarea.setRangeText('', lineStart, lineEnd, 'end');
        onChange(textarea.value);
        return;
      }
      if (bulletMatch && bulletMatch[3].length > 0) {
        event.preventDefault();
        const insertion = `\n${bulletMatch[1]}${bulletMatch[2]} `;
        textarea.setRangeText(insertion, start, end, 'end');
        onChange(textarea.value);
        return;
      }
      if (numberedMatch && numberedMatch[3].length > 0) {
        event.preventDefault();
        const next = parseInt(numberedMatch[2], 10) + 1;
        const insertion = `\n${numberedMatch[1]}${next}. `;
        textarea.setRangeText(insertion, start, end, 'end');
        onChange(textarea.value);
        return;
      }
    }

    if (event.key === 'Tab' && !event.shiftKey) {
      const selectionStartLine = value.lastIndexOf('\n', start - 1) + 1;
      const selectionEndLineIdxRaw = value.indexOf('\n', end === start ? end : Math.max(end - 1, start));
      const selectionEndLine = selectionEndLineIdxRaw === -1 ? value.length : selectionEndLineIdxRaw;
      const block = value.slice(selectionStartLine, selectionEndLine);
      const lines = block.split('\n');
      const allListItems = lines.length > 0 && lines.every((line) => /^\s*([-*]|\d+\.)\s+/.test(line) || /^\s*([-*]|\d+\.)\s*$/.test(line));
      if (!allListItems) return;
      event.preventDefault();
      const replacement = lines.map((line) => `  ${line}`).join('\n');
      textarea.setRangeText(replacement, selectionStartLine, selectionEndLine, 'preserve');
      const newStart = start + 2;
      const newEnd = end + 2 * lines.length;
      textarea.setSelectionRange(newStart, newEnd);
      onChange(textarea.value);
      return;
    }

    if (event.key === 'Tab' && event.shiftKey) {
      const selectionStartLine = value.lastIndexOf('\n', start - 1) + 1;
      const selectionEndLineIdxRaw = value.indexOf('\n', end === start ? end : Math.max(end - 1, start));
      const selectionEndLine = selectionEndLineIdxRaw === -1 ? value.length : selectionEndLineIdxRaw;
      const block = value.slice(selectionStartLine, selectionEndLine);
      const lines = block.split('\n');
      if (!lines.some((line) => line.startsWith('  '))) return;
      event.preventDefault();
      let removedFirst = 0;
      let removedTotal = 0;
      const replacement = lines.map((line, idx) => {
        if (line.startsWith('  ')) {
          if (idx === 0) removedFirst = 2;
          removedTotal += 2;
          return line.slice(2);
        }
        return line;
      }).join('\n');
      textarea.setRangeText(replacement, selectionStartLine, selectionEndLine, 'preserve');
      const newStart = Math.max(selectionStartLine, start - removedFirst);
      const newEnd = Math.max(newStart, end - removedTotal);
      textarea.setSelectionRange(newStart, newEnd);
      onChange(textarea.value);
      return;
    }

    if (event.key === 'Backspace' && start === end) {
      const isEmptyBullet = emptyBulletMatch && beforeCursorOnLine.length === currentLine.length;
      const isEmptyNumbered = emptyNumberedMatch && beforeCursorOnLine.length === currentLine.length;
      if (isEmptyBullet || isEmptyNumbered) {
        event.preventDefault();
        textarea.setRangeText('', lineStart, lineEnd, 'end');
        textarea.setSelectionRange(lineStart, lineStart);
        onChange(textarea.value);
        return;
      }
    }
  };

  const composedKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    handleListKeyDown(event);
    if (event.defaultPrevented) return;
    onKeyDown?.(event);
  };

  const applyMarkdownFormat = (formatType: 'bold' | 'italic' | 'code' | 'bullets' | 'numbered' | 'table') => {
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
      // Recortar newlines de los bordes (p.ej. cuando el browser amplía la
      // selección con \n por triple-click) para decidir bien si es inline o block.
      const trimmedSelection = selected.replace(/^\n+/, '').replace(/\n+$/, '');
      const hasInnerNewline = trimmedSelection.includes('\n');

      if (trimmedSelection && !hasInnerNewline) {
        // Inline `code` — siempre que quepa en una línea, aunque el browser
        // haya añadido un \n trailing a la selección.
        const leadingNewlines = selected.length - selected.replace(/^\n+/, '').length;
        const trailingNewlines = selected.length - selected.replace(/\n+$/, '').length;
        const wrapStart = start + leadingNewlines;
        const wrapEnd = end - trailingNewlines;
        const wrappedValue = value.slice(0, wrapStart) + '`' + trimmedSelection + '`' + value.slice(wrapEnd);
        const cursorEnd = wrapStart + 1 + trimmedSelection.length + 1;
        textarea.value = wrappedValue;
        onChange(wrappedValue);
        textarea.focus();
        window.setTimeout(() => {
          if (textarea.isConnected) textarea.setSelectionRange(wrapStart + 1, cursorEnd - 1);
        }, 0);
        return;
      }

      if (trimmedSelection && hasInnerNewline) {
        // Selección multilínea real → fenced code block.
        const replacement = `\n\n\`\`\`\n${trimmedSelection}\n\`\`\`\n\n`;
        applyReplacement(replacement, start, end, start + 5, start + 5 + trimmedSelection.length);
        return;
      }

      // Sin selección: si la línea está vacía, fence block; si tiene texto,
      // inserta `code` inline en el cursor.
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      const lineEnd = value.indexOf('\n', start);
      const currentLine = value.slice(lineStart, lineEnd === -1 ? value.length : lineEnd);
      if (!currentLine.trim()) {
        const blockReplacement = '```\ncode\n```';
        applyReplacement(blockReplacement, lineStart, lineEnd === -1 ? value.length : lineEnd, lineStart + 4, lineStart + 8);
      } else {
        wrapOrUnwrap('`', '`', 'code');
      }
      return;
    }

    if (formatType === 'numbered') {
      if (!selected) {
        applyReplacement('1. ', start, end, start + 3, start + 3);
        return;
      }
      const numberedLines = selected.split('\n');
      const allNumbered = numberedLines.filter((line) => line.trim()).every((line) => /^\s*\d+\.\s+/.test(line));
      const numberedReplacement = allNumbered
        ? numberedLines.map((line) => line.replace(/^(\s*)\d+\.\s+/, '$1')).join('\n')
        : (() => {
            let counter = 0;
            return numberedLines
              .map((line) => {
                if (!line.trim()) return line;
                counter += 1;
                return `${counter}. ${line.replace(/^\s*\d+\.\s+/, '')}`;
              })
              .join('\n');
          })();
      applyReplacement(numberedReplacement, start, end, start, start + numberedReplacement.length);
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
      onKeyDown={composedKeyDown}
      onPaste={handlePaste}
      placeholder={mergedLabels.writeContent}
      textareaRef={textareaRef}
      minHeightClassName={minHeightClassName}
      className={extraClassName}
    />
  );

  const renderedPreviewContent = previewContent ?? content;
  const isCompact = collapsed || dragging;
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
      <div className={cn('flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between', isCompact ? 'mb-0' : 'mb-2 border-b border-border pb-3')}>
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
            {isCompact ? (
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

        {collapsed && !dragging ? (
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8" title={mergedLabels.expand} onClick={() => onCollapsedChange?.(false)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : !isCompact ? (
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
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8" title={mergedLabels.numbered} onMouseDown={(e) => e.preventDefault()} onClick={() => applyMarkdownFormat('numbered')}>
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Popover open={tableOpen} onOpenChange={setTableOpen}>
              <PopoverTrigger asChild>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8" title={mergedLabels.table} onMouseDown={(e) => e.preventDefault()}>
                  <Table className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 space-y-3" align="start">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">{mergedLabels.tableRows}</label>
                  <Input
                    type="number"
                    min={1}
                    value={tableRows}
                    onChange={(event) => setTableRows(Math.max(1, parseInt(event.target.value, 10) || 1))}
                    className="h-8"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">{mergedLabels.tableCols}</label>
                  <Input
                    type="number"
                    min={1}
                    value={tableCols}
                    onChange={(event) => setTableCols(Math.max(1, parseInt(event.target.value, 10) || 1))}
                    className="h-8"
                  />
                </div>
                <Button type="button" size="sm" className="w-full" onClick={insertTable}>
                  {mergedLabels.tableInsert}
                </Button>
              </PopoverContent>
            </Popover>
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
        ) : null}
      </div>

      {!isCompact && (
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
                <MarkdownPreview content={renderedPreviewContent} getImage={getImage ?? getStoredImage} variables={variables} isReport={isReportPreview} />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : currentMode === 'preview' ? (
          <div className={cn('overflow-auto p-5', minHeightClassName)}>
            <MarkdownPreview content={renderedPreviewContent} getImage={getImage ?? getStoredImage} variables={variables} isReport={isReportPreview} />
          </div>
        ) : (
          editor()
        )}
      </div>
      )}
    </section>
  );
}
