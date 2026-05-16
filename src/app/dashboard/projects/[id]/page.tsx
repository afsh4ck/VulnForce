

'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, FileText, ArrowUpDown, Edit, Save, Trash2, CalendarIcon, Plus, GripVertical, Languages, ChevronLeft, CheckCircle, Heading1, Heading2, Heading3, Code, File, List, ListOrdered, Copy, Bold, Italic } from "@/components/icons";
import { useLanguage } from "@/context/language-context";
import type { Finding, Project, ContentBlock } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useData } from '@/context/data-context';
import { Combobox } from '@/components/ui/combobox';
import { DateRange } from 'react-day-picker';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CommandMenu } from '@/components/command-menu';
import { MarkdownPreview } from '@/components/markdown-preview';
import { useLeavePage } from '@/app/dashboard/layout';
// AddBlockMenu removed: editing is done directly in markdown per-section
import { BlockOptionsMenu } from '@/components/block-options-menu';
import { FloatingToolbar } from '@/components/floating-toolbar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { hasTodoMarker, stripMarkdownText } from '@/lib/todo-utils';
import { ProjectIconSelectItem, projectIconOptions } from '@/components/project-icon';
import { HighlightedMarkdownTextarea } from '@/components/section-markdown-editor';


type SortKey = keyof Finding;
type SaveStatus = 'unsaved' | 'saving' | 'saved';

const compareValues = (aValue: string | number | undefined, bValue: string | number | undefined) => {
  const aComparable = aValue ?? '';
  const bComparable = bValue ?? '';
  if (aComparable < bComparable) return -1;
  if (aComparable > bComparable) return 1;
  return 0;
};

import { parseMarkdownToBlocks, blocksToMarkdown } from '@/lib/markdown-utils';

const blockToMarkdown = (block: ContentBlock, content = block.content) => {
  if (/^#{1,6}\s+/m.test((content || '').trim())) {
    return content || '';
  }

  switch (block.tag) {
    case 'hr':
      return '---';
    case 'pre':
      return `\`\`\`\n${content || ''}\n\`\`\``;
    case 'ul':
      return (content || '').split('\n').map(line => line.trim().startsWith('-') ? line : `- ${line}`).join('\n');
    case 'ol':
      return (content || '').split('\n').map(line => /^\d+\.\s/.test(line.trim()) ? line : `1. ${line}`).join('\n');
    case 'blockquote':
      return (content || '').split('\n').map(line => `> ${line}`).join('\n');
    case 'table':
      return content || '';
    default:
      if (block.tag.startsWith('h')) {
        const level = Number(block.tag.replace('h', ''));
        return `${'#'.repeat(level)} ${content || ''}`;
      }
      return content || '';
  }
};

const getBlockHeadingTitle = (block: ContentBlock) => {
  const headingMatch = block.content.match(/^#{1,2}\s+(.+)$/m);
  if (headingMatch) {
    return stripMarkdownText(headingMatch[1]);
  }

  if ((block.tag === 'h1' || block.tag === 'h2') && block.content.trim()) {
    return stripMarkdownText(block.content.split('\n')[0]);
  }
  return '';
};

const getSectionTitleForBlock = (blocks: ContentBlock[], index: number) => {
  for (let i = index; i >= 0; i--) {
    const title = getBlockHeadingTitle(blocks[i]);
    if (title) return title;
  }

  return stripMarkdownText(blocks[index]?.content || '') || 'Untitled section';
};

type EditableBlockProps = {
  block: ContentBlock, 
  onUpdate: (content: string) => void, 
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void, 
  onFocus: () => void,
  isFocused: boolean,
  placeholder: string,
  t_editor: any
};

type EditableBlockExtra = {
  viewMode?: 'split' | 'markdown' | 'preview';
  onToggleSplit?: (id: string, mode: 'split' | 'markdown' | 'preview') => void;
  sectionTitle?: string;
};

const EditableBlock = React.forwardRef(({ block, onUpdate, onKeyDown, onFocus, isFocused, placeholder, t_editor, viewMode, onToggleSplit }: EditableBlockProps & EditableBlockExtra, ref: React.Ref<HTMLDivElement>) => {
    const blockRef = useRef<HTMLDivElement>(null);
    const [markdownValue, setMarkdownValue] = React.useState<string>('');
    const [splitActive, setSplitActive] = React.useState<boolean>(viewMode === 'split');
    const [viewModeState, setViewModeState] = React.useState<'split' | 'markdown' | 'preview'>(() => viewMode || 'split');
    useEffect(() => { setSplitActive(viewMode === 'split'); setViewModeState(viewMode || 'split'); }, [viewMode]);
    useEffect(() => {
      setMarkdownValue(block.content || '');
    }, [block.id]);
    
     useEffect(() => {
        if (isFocused && blockRef.current) {
            const el = blockRef.current;
            el.focus();
            
            const selection = window.getSelection();
            if (selection) {
                const range = document.createRange();
                
                if (el.firstChild) {
                    range.selectNodeContents(el);
                    range.collapse(false); // false to collapse to the end
                } else {
                    range.setStart(el, 0);
                    range.collapse(true);
                }
                
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    }, [isFocused, block.id]);


    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        onUpdate(e.currentTarget.innerHTML);
      };

    if (block.tag === 'hr') {
      return <hr className="my-4" />;
    }
    
    if (block.tag === 'table') {
      return (
        <div className="w-full border rounded-md overflow-hidden">
          <div style={{ display: 'flex', alignItems: 'stretch', height: '280px' }}>
            <textarea
              value={markdownValue}
              onChange={(e) => {
                setMarkdownValue(e.target.value);
                // pass markdown back to parent
                onUpdate(e.target.value);
              }}
              className="p-3 resize-none outline-none w-full"
              style={{ width: `50%`, borderRight: '1px solid rgba(0,0,0,0.06)' }}
            />
            <div style={{ width: `50%`, padding: '12px', overflow: 'auto' }}>
              <MarkdownPreview content={markdownValue || block.content || ''} getImage={() => undefined} />
            </div>
          </div>
        </div>
      );
    }
    
    const isList = block.tag === 'ul' || block.tag === 'ol';
    const isCode = block.tag === 'pre';
    const isEmpty = !block.content || (typeof block.content === 'string' && block.content.trim() === '') || (isList && block.content.trim() === '<li><br></li>');

        const getPlaceholderText = () => {
          if (placeholder) return placeholder;
          if (t_editor && t_editor.headings && t_editor.headings['1']) return t_editor.headings['1'];
          return '';
        };

    const placeholderText = getPlaceholderText();
    const showPlaceholder = isEmpty && isFocused;
    const showSplitEditor = splitActive && viewModeState === 'split' && block.tag !== 'pre';
    const showPreview = viewModeState === 'preview';

    return (
        <div 
          ref={ref}
          className="relative"
          onFocus={onFocus}
          dir="ltr"
        >
          <div className="absolute right-0 top-0 mr-2 mt-1 flex gap-1">
            <div className="flex items-center gap-1 bg-panel p-1 rounded-md">
              {/* Formatting controls: bold, italic, code, bullets */}
              <button type="button" title="Bold" className="text-xs px-2 py-1 rounded" onClick={() => {
                if (typeof window === 'undefined') return;
                const ta = blockRef.current?.querySelector('textarea') as HTMLTextAreaElement | null;
                if (ta) {
                  const start = ta.selectionStart;
                  const end = ta.selectionEnd;
                  const sel = ta.value.slice(start, end) || '';
                  const wrapped = `**${sel}**`;
                  ta.setRangeText(wrapped, start, end, 'end');
                  setMarkdownValue(ta.value);
                  onUpdate(ta.value);
                  ta.focus();
                  return;
                }
                document.execCommand('bold');
              }}>B</button>
              <button type="button" title="Italic" className="text-xs px-2 py-1 rounded" onClick={() => {
                if (typeof window === 'undefined') return;
                const ta = blockRef.current?.querySelector('textarea') as HTMLTextAreaElement | null;
                if (ta) {
                  const start = ta.selectionStart;
                  const end = ta.selectionEnd;
                  const sel = ta.value.slice(start, end) || '';
                  const wrapped = `*${sel}*`;
                  ta.setRangeText(wrapped, start, end, 'end');
                  setMarkdownValue(ta.value);
                  onUpdate(ta.value);
                  ta.focus();
                  return;
                }
                document.execCommand('italic');
              }}>I</button>
              <button type="button" title="Code" className="text-xs px-2 py-1 rounded" onClick={() => {
                if (typeof window === 'undefined') return;
                const ta = blockRef.current?.querySelector('textarea') as HTMLTextAreaElement | null;
                if (ta) {
                  const start = ta.selectionStart;
                  const end = ta.selectionEnd;
                  const sel = ta.value.slice(start, end) || '';
                  const wrapped = `\`${sel}\``;
                  ta.setRangeText(wrapped, start, end, 'end');
                  setMarkdownValue(ta.value);
                  onUpdate(ta.value);
                  ta.focus();
                  return;
                }
                const sel = window.getSelection();
                if (sel && !sel.isCollapsed) {
                  const range = sel.getRangeAt(0);
                  const code = document.createElement('code');
                  code.appendChild(range.extractContents());
                  range.insertNode(code);
                }
              }}>{"</>"}</button>
              <button type="button" title="Bulleted list" className="text-xs px-2 py-1 rounded" onClick={() => {
                if (typeof window === 'undefined') return;
                const ta = blockRef.current?.querySelector('textarea') as HTMLTextAreaElement | null;
                if (ta) {
                  const start = ta.selectionStart;
                  const end = ta.selectionEnd;
                  const sel = ta.value.slice(start, end) || '';
                  const lines = sel.split(/\n/).map(l => (l.trim() ? `- ${l}` : l)).join('\n');
                  ta.setRangeText(lines, start, end, 'end');
                  setMarkdownValue(ta.value);
                  onUpdate(ta.value);
                  ta.focus();
                  return;
                }
                document.execCommand('insertUnorderedList');
              }}>•</button>
              <div className="w-px bg-muted/30 mx-1" />
              <button type="button" title="Vista dividida" className={cn('text-xs px-2 py-1 rounded', viewModeState === 'split' ? 'bg-muted/80 text-white' : 'text-muted-foreground')} onClick={() => { setViewModeState('split'); setSplitActive(true); onToggleSplit?.(block.id, 'split'); }}>Split</button>
              <button type="button" title="Editor Markdown" className={cn('text-xs px-2 py-1 rounded', viewModeState === 'markdown' ? 'bg-muted/80 text-white' : 'text-muted-foreground')} onClick={() => { setViewModeState('markdown'); setSplitActive(false); onToggleSplit?.(block.id, 'markdown'); }}>MD</button>
              <button type="button" title="Preview HTML" className={cn('text-xs px-2 py-1 rounded', viewModeState === 'preview' ? 'bg-muted/80 text-white' : 'text-muted-foreground')} onClick={() => { setViewModeState('preview'); setSplitActive(false); onToggleSplit?.(block.id, 'preview'); }}>Preview</button>
            </div>
          </div>

          {showSplitEditor ? (
            // render split editor
            <div className="my-2">
              {/* lazy load split editor to avoid SSR issues */}
              <div className="">
                {typeof window !== 'undefined' && (
                  // dynamic import-like usage without adding bundling complexity
                  <div>
                    {/* Inline simple split editor to avoid imports in SSR */}
                    <div className="w-full border rounded-md overflow-hidden">
                      <div style={{ display: 'flex', alignItems: 'stretch', height: '280px' }}>
                        <textarea
                          value={markdownValue}
                          onChange={(e) => {
                            setMarkdownValue(e.target.value);
                            // convert simple markdown to html: very basic
                            const lines = e.target.value.split('\n');
                            const html = lines.map(l => {
                              if (/^#{1}\s/.test(l)) return `<h1>${l.replace(/^#\s/, '')}</h1>`;
                              if (/^##\s/.test(l)) return `<h2>${l.replace(/^##\s/, '')}</h2>`;
                              if (/^###\s/.test(l)) return `<h3>${l.replace(/^###\s/, '')}</h3>`;
                              if (/^-\s/.test(l)) return `<li>${l.replace(/^-\s/, '')}</li>`;
                              return l.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                            }).join('\n');
                            // if list items exist wrap
                            const final = /<li>/.test(html) ? `<ul>${html}</ul>` : `<p>${html.replace(/\n/g, '<br>')}</p>`;
                            onUpdate(final);
                          }}
                          className="p-3 resize-none outline-none w-full bg-white dark:bg-black text-black dark:text-white"
                          style={{ width: `50%`, borderRight: '1px solid rgba(0,0,0,0.06)' }}
                        />
                        <div style={{ width: `50%`, padding: '12px', overflow: 'auto' }}>
                          <div className="prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: markdownValue ? markdownValue.split('\n').map(l => l.replace(/</g,'&lt;').replace(/>/g,'&gt;')).join('<br>') : block.content }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : showPreview ? (
            <div className="my-2">
              <div className="w-full border rounded-md p-4 prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: markdownValue || block.content || '' }} />
            </div>
          ) : (
            <div className="my-2">
              <textarea
                value={markdownValue}
                onChange={(e) => {
                  setMarkdownValue(e.target.value);
                  onUpdate(e.target.value);
                }}
                className="p-3 resize-none outline-none w-full h-64 bg-white dark:bg-black text-black dark:text-white"
              />
            </div>
          )}

           {showPlaceholder && (
                <div className={cn("absolute top-1 left-1 text-muted-foreground pointer-events-none select-none", {
                    'text-3xl font-bold': block.tag === 'h1',
                    'text-2xl font-semibold': block.tag === 'h2',
                    'text-xl font-semibold': block.tag === 'h3',
                    'text-lg font-semibold': block.tag === 'h4',
                })}>
                    {placeholderText}
                </div>
            )}
        </div>
    );
});
EditableBlock.displayName = "EditableBlock";

const SectionEditableBlock = React.forwardRef(({ block, onUpdate, onKeyDown, onFocus, isFocused, placeholder, t_editor, viewMode, onToggleSplit, sectionTitle }: EditableBlockProps & EditableBlockExtra, ref: React.Ref<HTMLDivElement>) => {
  const blockRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [markdownValue, setMarkdownValue] = React.useState<string>(block.content || '');
  const [viewModeState, setViewModeState] = React.useState<'split' | 'markdown' | 'preview'>(() => viewMode || 'split');

  const setRootRef = useCallback((node: HTMLDivElement | null) => {
    blockRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    }
  }, [ref]);

  useEffect(() => {
    setViewModeState(viewMode || 'split');
  }, [viewMode]);

  useEffect(() => {
    setMarkdownValue(block.content || '');
  }, [block.id, block.content]);

  useEffect(() => {
    if (isFocused) {
      textareaRef.current?.focus();
    }
  }, [isFocused, block.id]);

  const placeholderText = placeholder || t_editor?.headings?.['1'] || '';
  const previewMarkdown = blockToMarkdown(block, markdownValue);
  const showSplitEditor = viewModeState === 'split' && block.tag !== 'pre';
  const showPreview = viewModeState === 'preview';

  const updateMarkdown = (value: string) => {
    setMarkdownValue(value);
    onUpdate(value);
  };

  const setViewMode = (mode: 'split' | 'markdown' | 'preview') => {
    setViewModeState(mode);
    onToggleSplit?.(block.id, mode);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    onKeyDown(e as unknown as React.KeyboardEvent<HTMLDivElement>);
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
    updateMarkdown(textarea.value);
    textarea.focus();

    if (!selected && formatType !== 'bullets') {
      const innerStart = start + (formatType === 'bold' ? 2 : 1);
      const innerEnd = innerStart + (formatType === 'bold' ? 4 : formatType === 'italic' ? 6 : 4);
      textarea.setSelectionRange(innerStart, innerEnd);
    }
  };

  const editorTextarea = (className?: string) => (
    <HighlightedMarkdownTextarea
      textareaRef={textareaRef}
      value={markdownValue}
      placeholder={placeholderText}
      onFocus={onFocus}
      onKeyDown={handleKeyDown}
      onChange={updateMarkdown}
      minHeightClassName="min-h-[520px]"
      className={className}
    />
  );

  return (
    <section
      ref={setRootRef}
      id={`section-${block.id}`}
      data-section-title={sectionTitle}
      className="w-full scroll-mt-24"
      onFocus={onFocus}
      dir="ltr"
    >
      <div className="mb-2 flex flex-col gap-3 border-b border-border pb-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Section</p>
          <h2 className="truncate font-headline text-lg font-semibold text-foreground">{sectionTitle || 'Untitled section'}</h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-md border bg-background p-1">
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8" title="Bold" onMouseDown={(e) => e.preventDefault()} onClick={() => applyMarkdownFormat('bold')}>
              <Bold className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8" title="Italic" onMouseDown={(e) => e.preventDefault()} onClick={() => applyMarkdownFormat('italic')}>
              <Italic className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8" title="Code" onMouseDown={(e) => e.preventDefault()} onClick={() => applyMarkdownFormat('code')}>
              <Code className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8" title="Bulleted list" onMouseDown={(e) => e.preventDefault()} onClick={() => applyMarkdownFormat('bullets')}>
              <List className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center rounded-md border bg-background p-1">
            <Button type="button" variant={viewModeState === 'split' ? 'default' : 'ghost'} size="sm" className="h-8" onClick={() => setViewMode('split')}>Split</Button>
            <Button type="button" variant={viewModeState === 'markdown' ? 'default' : 'ghost'} size="sm" className="h-8" onClick={() => setViewMode('markdown')}>MD</Button>
            <Button type="button" variant={viewModeState === 'preview' ? 'default' : 'ghost'} size="sm" className="h-8" onClick={() => setViewMode('preview')}>Preview</Button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border bg-background">
        {showSplitEditor ? (
          <ResizablePanelGroup direction="horizontal" className="min-h-[520px]">
            <ResizablePanel defaultSize={52} minSize={25}>
              {editorTextarea("border-0")}
            </ResizablePanel>
            <ResizableHandle className="w-1 bg-border transition-colors hover:bg-yellow-400 data-[resize-handle-state=drag]:bg-yellow-400" />
            <ResizablePanel defaultSize={48} minSize={25}>
              <div className="h-full min-h-[520px] overflow-auto p-5">
                <MarkdownPreview content={previewMarkdown} getImage={() => undefined} />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : showPreview ? (
          <div className="min-h-[520px] overflow-auto p-5">
            <MarkdownPreview content={previewMarkdown} getImage={() => undefined} />
          </div>
        ) : (
          editorTextarea("min-h-[520px]")
        )}
      </div>
    </section>
  );
});
SectionEditableBlock.displayName = "SectionEditableBlock";

type SortableBlockProps = EditableBlockProps & EditableBlockExtra & {
  index: number;
  onAdd: (index: number, tag: ContentBlock['tag']) => void;
  onAction: (action: string, blockId: string, value?: any) => void;
};

const SortableBlock = React.forwardRef(({ block, index, onAdd, onAction, ...editableProps }: SortableBlockProps, ref: React.Ref<HTMLDivElement>) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
  const [optionsMenuOpen, setOptionsMenuOpen] = useState(false);


  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group/block">
        <div className="absolute top-0 -left-16 h-full flex items-center gap-1 opacity-0 group-hover/block:opacity-100 transition-opacity">
        <BlockOptionsMenu 
          onSelect={(action, value) => onAction(action, block.id, value)}
          open={optionsMenuOpen}
          onOpenChange={setOptionsMenuOpen}
          blockTag={block.tag}
        >
          <div {...attributes} {...listeners} className="p-1 cursor-grab">
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
        </BlockOptionsMenu>
        </div>
      <SectionEditableBlock
        ref={ref}
        block={block}
        {...editableProps}
      />
    </div>
  );
});
SortableBlock.displayName = "SortableBlock";


export default function ProjectDetailsPage() {
  const { language: uiLanguage } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { id } = params;

  const { projects, clients, findings, deleteFinding, updateProject, deleteProject, duplicateProject, projectTemplates, vulnerabilities } = useData();

  const [project, setProject] = useState<Project | undefined>();
  const [projectFindings, setProjectFindings] = useState<Finding[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>(null);
  const [findingToDelete, setFindingToDelete] = useState<Finding | null>(null);
  
  const [name, setName] = useState('');
  const [clientId, setClientId] = useState('');
  const [status, setStatus] = useState<Project['status']>('In Progress');
  const [date, setDate] = useState<DateRange | undefined>();
  const [icon, setIcon] = useState<string>('FileText');
  const [projectLanguage, setProjectLanguage] = useState<Project['language']>('en');
  
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [splitBlocks, setSplitBlocks] = useState<Record<string, 'split' | 'markdown' | 'preview'>>({});
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);
  const [isToolbarOpen, setIsToolbarOpen] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });

  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [templateComboboxValue, setTemplateComboboxValue] = useState<string>('');
  const [templatePreview, setTemplatePreview] = useState<string>('');

  // Persist per-block view modes in localStorage per project
  useEffect(() => {
    if (typeof window === 'undefined' || !project) return;
    const key = `vulnforce-viewmode-${project.id}`;
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item) as Record<string, 'split' | 'markdown' | 'preview'>;
        setSplitBlocks(parsed || {});
      }
    } catch (e) {
      console.error('Failed to load view modes', e);
    }
  }, [project?.id]);

  useEffect(() => {
    if (typeof window === 'undefined' || !project) return;
    const key = `vulnforce-viewmode-${project.id}`;
    try {
      window.localStorage.setItem(key, JSON.stringify(splitBlocks || {}));
    } catch (e) {
      console.error('Failed to save view modes', e);
    }
  }, [splitBlocks, project?.id]);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [nextPath, setNextPath] = useState('');
  
  const setHasUnsavedChanges = useLeavePage();
  
  const history = useRef<ContentBlock[][]>([]);
  const historyIndex = useRef(-1);


  const blockRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const client = clients.find(c => c.id === project?.clientId);
  
  const pushToHistory = useCallback((newBlocks: ContentBlock[]) => {
      if (historyIndex.current < history.current.length - 1) {
          history.current = history.current.slice(0, historyIndex.current + 1);
      }
      history.current.push(newBlocks);
      historyIndex.current++;
  }, []);

  const updateBlocks = useCallback((newBlocks: ContentBlock[], saveToHistory = true) => {
    setBlocks(newBlocks);
    setSaveStatus('unsaved');
    if (saveToHistory) {
      pushToHistory(newBlocks);
    }
  }, [pushToHistory]);

  const undo = useCallback(() => {
      if (historyIndex.current > 0) {
          historyIndex.current--;
          const previousBlocks = history.current[historyIndex.current];
          updateBlocks(previousBlocks, false);
      }
  }, [updateBlocks]);

  const redo = useCallback(() => {
      if (historyIndex.current < history.current.length - 1) {
          historyIndex.current++;
          const nextBlocks = history.current[historyIndex.current];
          updateBlocks(nextBlocks, false);
      }
  }, [updateBlocks]);
  
  useEffect(() => {
    setHasUnsavedChanges(saveStatus === 'unsaved');
    const handler = (e: BeforeUnloadEvent) => {
      if (saveStatus === 'unsaved') {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => {
      window.removeEventListener('beforeunload', handler);
      setHasUnsavedChanges(false);
    };
  }, [saveStatus, setHasUnsavedChanges]);

  useEffect(() => {
    const handleRequestLeave = (e: CustomEvent) => {
        if (saveStatus === 'unsaved') {
            setNextPath(e.detail);
            setIsLeaveDialogOpen(true);
        }
    };
    window.addEventListener('requestLeave', handleRequestLeave as EventListener);
    return () => {
        window.removeEventListener('requestLeave', handleRequestLeave as EventListener);
    };
  }, [saveStatus]);

  const handleLeaveConfirm = () => {
    setSaveStatus('saved'); 
    setTimeout(() => {
        if (nextPath) {
            router.push(nextPath);
        }
    }, 100);
  };

  const t = {
    en: {
      back: 'Back to Projects',
      projectDetails: 'Details',
      findings: 'Findings',
      previewReport: 'Preview Report',
      content: 'Content',
      projectName: 'Project Name',
      client: 'Client',
      status: 'Status',
      dates: 'Project Dates',
      language: 'Language',
      icon: 'Icon',
      save: 'Save Changes',
      saving: 'Saving...',
      saved: 'Saved',
      inProgress: 'In Progress',
      completed: 'Completed',
      onHold: 'On Hold',
      english: 'English',
      spanish: 'Spanish',
      newFinding: 'New Finding',
      findingTitle: 'Finding Title',
      severity: 'Severity',
      cvss: 'CVSS',
      lastUpdated: 'Last Updated',
      actions: 'Actions',
      edit: 'Edit',
      delete: 'Delete',
      confirmDeleteFindingTitle: "Are you sure?",
      confirmDeleteFindingDesc: "This action cannot be undone. This will permanently delete the finding.",
      cancel: "Cancel",
      findingDeleted: "Finding deleted successfully.",
      selectClient: "Select a client",
      selectStatus: "Select status",
      selectLanguage: "Select language",
      selectIcon: "Select an icon",
      deleteProject: "Delete Project",
      confirmDeleteProjectTitle: "Delete Project?",
      confirmDeleteProjectDesc: "This will permanently delete the project and all its findings. This action cannot be undone.",
      changesSaved: "Changes Saved",
      changesSavedDesc: "Your project details have been updated.",
      translateScope: "Translate Scope",
      translating: "Traduciendo...",
      commandPlaceholder: "Type / to add a block",
      selectTemplate: 'Select a template',
      headings: {
        '1': 'Heading 1',
        '2': 'Heading 2',
        '3': 'Heading 3',
        '4': 'Heading 4',
      },
      unsavedChangesTitle: "Unsaved Changes",
      unsavedChangesDesc: "You have unsaved changes. Are you sure you want to leave?",
      leave: "Leave",
    },
    es: {
      back: 'Volver a Proyectos',
      projectDetails: 'Detalles',
      findings: 'Hallazgos',
      previewReport: 'Previsualizar Informe',
      content: 'Contenido',
      projectName: 'Nombre del Proyecto',
      client: 'Cliente',
      status: 'Estado',
      dates: 'Fechas',
      language: 'Idioma',
      icon: 'Icono',
      save: 'Guardar Cambios',
      saving: 'Guardando...',
      saved: 'Guardado',
      inProgress: 'En Progreso',
      completed: 'Completado',
      onHold: 'En Espera',
      english: 'Inglés',
      spanish: 'Español',
      newFinding: 'Nuevo Hallazgo',
      findingTitle: 'Título del Hallazgo',
      severity: 'Severidad',
      cvss: 'CVSS',
      lastUpdated: 'Última Actualización',
      actions: 'Acciones',
      edit: 'Editar',
      delete: 'Eliminar',
      confirmDeleteFindingTitle: "¿Estás seguro?",
      confirmDeleteFindingDesc: "Esta acción no se puede deshacer. Esto eliminará permanentemente el hallazgo.",
      cancel: "Cancelar",
      findingDeleted: "Hallazgo eliminado correctamente.",
      selectClient: "Seleccionar un cliente",
      selectStatus: "Seleccionar estado",
      selectLanguage: "Seleccionar idioma",
      selectIcon: "Seleccionar un icono",
      deleteProject: "Eliminar Proyecto",
      confirmDeleteProjectTitle: "¿Eliminar Proyecto?",
      confirmDeleteProjectDesc: "Esto eliminará permanentemente el proyecto y todos sus hallazgos. Esta acción no puede deshacerse.",
      changesSaved: "Cambios Guardados",
      changesSavedDesc: "Los detalles de tu proyecto han sido actualizados.",
      translateScope: "Traducir Alcance",
      translating: "Traduciendo...",
      commandPlaceholder: "Escribe / para añadir un bloque",
      selectTemplate: 'Seleccionar plantilla',
      headings: {
        '1': 'Título 1',
        '2': 'Título 2',
        '3': 'Título 3',
        '4': 'Título 4',
      },
      unsavedChangesTitle: "Cambios sin Guardar",
      unsavedChangesDesc: "¿Tienes cambios sin guardar. Estás seguro que quieres salir?",
      leave: "Salir",
    }
  }

  const sortedFindings = useMemo(() => {
    const findingsCopy = [...projectFindings];
    if (sortConfig !== null) {
      findingsCopy.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        const comparison = compareValues(aValue, bValue);
        return sortConfig.direction === 'ascending' ? comparison : -comparison;
      });
    }
    return findingsCopy;
  }, [projectFindings, sortConfig]);

  useEffect(() => {
    const currentProject = projects.find(p => p.id === id);
    if (currentProject) {
      setProject(currentProject);
      setName(currentProject.name);
      setClientId(currentProject.clientId);
      setStatus(currentProject.status);
      setDate({ from: new Date(currentProject.startDate), to: new Date(currentProject.endDate) });
      setIcon(currentProject.icon);
      setProjectLanguage(currentProject.language);
      const filteredFindings = findings.filter(f => f.projectId === currentProject.id);
      setProjectFindings(filteredFindings);
      const initialBlocks = parseMarkdownToBlocks(currentProject.reportBody);
      setBlocks(initialBlocks);
      if (initialBlocks.length > 0) {
        setActiveBlockId(initialBlocks[0].id);
        pushToHistory(initialBlocks);
      }
    } else {
      router.push('/dashboard/projects');
    }
  }, [id, projects, findings, router, pushToHistory]);

  // If navigated from report with a TODO param, focus the block that contains the TODO text
  useEffect(() => {
    const todo = searchParams.get('todo');
    const section = searchParams.get('section');
    if (!todo) return;
    const foundIndex = blocks.findIndex((block, index) => {
      const content = block.content || '';
      const matchesTodo = content.includes(todo) || (todo === 'TODO' && hasTodoMarker(content));
      if (!matchesTodo) return false;
      if (!section) return true;
      return getSectionTitleForBlock(blocks, index) === section;
    });
    const found = foundIndex >= 0 ? blocks[foundIndex] : blocks.find(b => (b.content || '').includes(todo) || (todo === 'TODO' && hasTodoMarker(b.content || '')));
    if (found) {
      setActiveBlockId(found.id);
      setTimeout(() => {
        const el = blockRefs.current[found.id]?.querySelector('textarea') as HTMLElement | null;
        if (el) {
          el.focus();
          blockRefs.current[found.id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          const wrapper = blockRefs.current[found.id] as HTMLElement | null;
          wrapper?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 200);
    }
  }, [searchParams, blocks]);
  
  const handleSave = useCallback((showToast = true) => {
    if (!project || !name || !clientId || !status || !date?.from || !date?.to) {
      if(showToast){
        toast({ variant: "destructive", title: "Incomplete fields", description: "Please fill in all project details." });
      }
      return;
    }

    setSaveStatus('saving');
    
    const updatedProjectData: Project = {
      ...project,
      name,
      clientId,
      status,
      icon,
      language: projectLanguage,
      startDate: format(date.from, 'yyyy-MM-dd'),
      endDate: format(date.to, 'yyyy-MM-dd'),
      reportBody: blocksToMarkdown(blocks),
    };

    updateProject(updatedProjectData);
    if (showToast) {
        toast({ title: t[uiLanguage].changesSaved, description: t[uiLanguage].changesSavedDesc });
    }

    setTimeout(() => setSaveStatus('saved'), 500);
  }, [project, name, clientId, status, date, icon, projectLanguage, blocks, updateProject, toast, t, uiLanguage]);

  const handleFieldChange = (setter: React.Dispatch<React.SetStateAction<any>>, value: any) => {
    setter(value);
    setSaveStatus('unsaved');
  };
  
  const handleDeleteFinding = () => {
    if (findingToDelete) {
      deleteFinding(findingToDelete.id);
      toast({ title: t[uiLanguage].findingDeleted });
      setFindingToDelete(null);
    }
  };

  const getSeverityVariant = (severity: string): 'destructive' | 'high' | 'medium' | 'low' | 'secondary' => {
    switch (severity) {
      case 'Critical': return 'destructive';
      case 'High': return 'high';
      case 'Medium': return 'medium';
      case 'Low': return 'low';
      default: return 'secondary';
    }
  };

  const requestSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIcon = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
  };
  
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const handleDeleteBlock = useCallback((id: string) => {
      const indexToDelete = blocks.findIndex(b => b.id === id);
      if (indexToDelete === -1) return;

      const newBlocks = blocks.filter(b => b.id !== id);
      
      updateBlocks(newBlocks);
       if (newBlocks.length === 0) {
        const newBlock = { id: `block-${Date.now()}`, tag: 'p' as const, content: '' };
        updateBlocks([newBlock]);
        setActiveBlockId(newBlock.id);
      } else if (indexToDelete > 0) {
        setActiveBlockId(newBlocks[indexToDelete - 1].id);
      } else {
        setActiveBlockId(newBlocks[0].id);
      }
  }, [blocks, updateBlocks]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
        const oldIndex = blocks.findIndex((item) => item.id === active.id);
        const newIndex = blocks.findIndex((item) => item.id === over.id);
        updateBlocks(arrayMove(blocks, oldIndex, newIndex));
    }
  }, [blocks, updateBlocks]);
  
  const handleAddBlock = useCallback((index: number, tag: ContentBlock['tag'], content: string = '') => {
    let newBlock: ContentBlock;
    
    switch(tag) {
        case 'h1': newBlock = { id: `block-new-${Date.now()}`, tag: 'h1', content: content }; break;
        case 'h2': newBlock = { id: `block-new-${Date.now()}`, tag: 'h2', content: content }; break;
        case 'h3': newBlock = { id: `block-new-${Date.now()}`, tag: 'h3', content: content }; break;
        case 'h4': newBlock = { id: `block-new-${Date.now()}`, tag: 'h4', content: content }; break;
        case 'ul': newBlock = { id: `block-new-${Date.now()}`, tag: 'ul', content: `<li>${content}</li>` }; break;
        case 'ol': newBlock = { id: `block-new-${Date.now()}`, tag: 'ol', content: `<li>${content}</li>` }; break;
        case 'hr': newBlock = { id: `block-new-${Date.now()}`, tag: 'hr', content: '' }; break;
        case 'blockquote': newBlock = { id: `block-new-${Date.now()}`, tag: 'blockquote', content: content }; break;
        case 'pre': newBlock = { id: `block-new-${Date.now()}`, tag: 'pre', content: '// Your code here' }; break;
        case 'table': newBlock = { id: `block-new-${Date.now()}`, tag: 'table', content: '<thead><tr><th>Header 1</th><th>Header 2</th></tr></thead><tbody><tr><td>Data 1</td><td>Data 2</td></tr></tbody>' }; break;
        default: newBlock = { id: `block-new-${Date.now()}`, tag: 'p', content: content };
    }

    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    updateBlocks(newBlocks);
    setActiveBlockId(newBlock.id);
    setSplitBlocks(prev => ({ ...prev, [newBlock.id]: 'split' }));
  }, [blocks, updateBlocks]);

  const updateBlockTag = useCallback((id: string, newTag: ContentBlock['tag']) => {
    const newBlocks = blocks.map(b => {
      if (b.id === id) {
        const newBlock = { ...b, tag: newTag };
        if((newTag === 'ul' || newTag === 'ol') && (b.tag !== 'ul' && b.tag !== 'ol')) {
          const contentAsText = document.createElement('div');
          contentAsText.innerHTML = b.content;
          newBlock.content = `<li>${contentAsText.textContent || '<br>'}</li>`;
        } else if(newTag !== 'ul' && newTag !== 'ol' && (b.tag === 'ul' || b.tag === 'ol')) {
           const tempEl = document.createElement('div');
           tempEl.innerHTML = b.content;
           newBlock.content = tempEl.textContent || '';
        } else if (newTag === 'hr') {
            newBlock.content = '';
        }
        return newBlock;
      }
      return b;
    });
    updateBlocks(newBlocks);
    setActiveBlockId(id);
  }, [blocks, updateBlocks]);
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>, id: string) => {
      const currentIndex = blocks.findIndex(b => b.id === id);
      const currentBlock = blocks[currentIndex];
      const target = e.target as HTMLDivElement;

      // Handle slash command menu opening
      if (e.key === '/') {
        if (target.textContent === '') {
            e.preventDefault();
            setCommandMenuOpen(true);
            return;
        }
      }

      if (e.key === ' ' || e.key === 'Escape') {
          if (commandMenuOpen) {
              setCommandMenuOpen(false);
          }
      }
      
      if (e.ctrlKey || e.metaKey) {
        if (e.key.toLowerCase() === 'z') {
            e.preventDefault();
            if (e.shiftKey) {
                redo();
            } else {
                undo();
            }
            return;
        }
        if (e.key.toLowerCase() === 'y') {
            e.preventDefault();
            redo();
            return;
        }
      }

      const moveCursor = (index: number, position: 'start' | 'end') => {
        if (index >= 0 && index < blocks.length) {
            e.preventDefault();
            const nextBlockId = blocks[index].id;
            setActiveBlockId(nextBlockId);
             setTimeout(() => {
                const nextBlockRef = blockRefs.current[nextBlockId]?.querySelector('[contenteditable="true"]') as HTMLElement;
                if(nextBlockRef) {
                    nextBlockRef.focus();
                    const selection = window.getSelection();
                    const range = document.createRange();
                    range.selectNodeContents(nextBlockRef);
                    range.collapse(position === 'start');
                    selection?.removeAllRanges();
                    selection?.addRange(range);
                }
            }, 0);
        }
      }

      if (e.key === 'ArrowUp') {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getClientRects()[0];
            if (!rect || rect.top > target.getBoundingClientRect().top + 5) {
               moveCursor(currentIndex - 1, 'end');
            }
        }
      } else if (e.key === 'ArrowDown') {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const targetRect = target.getBoundingClientRect();
            const clientRects = target.getClientRects();
            const lastLineRect = clientRects[clientRects.length -1];
            if (!range.getClientRects()[0] || range.getClientRects()[0].bottom < lastLineRect.bottom - 5) {
                moveCursor(currentIndex + 1, 'start');
            }
        }
      } else if (e.key === 'ArrowLeft') {
          const selection = window.getSelection();
          if (selection?.anchorOffset === 0) {
            moveCursor(currentIndex - 1, 'end');
          }
      } else if (e.key === 'ArrowRight') {
          const selection = window.getSelection();
          if (selection && target.textContent && selection.anchorOffset === target.textContent.length) {
            moveCursor(currentIndex + 1, 'start');
          }
      }
      else if (e.key === 'Enter') {
          if (e.shiftKey) return;
          
          if (currentBlock.tag === 'ul' || currentBlock.tag === 'ol') {
            e.preventDefault();
            const currentLi = window.getSelection()?.anchorNode?.parentElement?.closest('li');
            if (currentLi && currentLi.textContent?.trim() === '') {
                // Exit list
                const newBlocks = [...blocks];
                const listBlock = newBlocks[currentIndex];
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = listBlock.content;
                
                // Remove the empty li
                const listItems = Array.from(tempDiv.querySelectorAll('li'));
                const emptyLiIndex = listItems.findIndex(li => li === currentLi);
                if (emptyLiIndex !== -1) {
                  listItems.splice(emptyLiIndex, 1);
                }

                listBlock.content = listItems.map(li => li.outerHTML).join('');

                if(listBlock.content.trim() === '') {
                   newBlocks.splice(currentIndex, 1);
                }
                
                updateBlocks(newBlocks);
                handleAddBlock(currentIndex - 1, 'p');

            } else {
              // Add new list item
              document.execCommand('insertHTML', false, '</li><li><br>');
            }
            return;
          }

          e.preventDefault();
          handleAddBlock(currentIndex, 'p', '');

      } else if (e.key === 'Backspace' && (target.innerHTML === '' || target.innerHTML === '<br>' || (currentBlock.tag.match(/^(ul|ol)$/) && target.innerHTML === '<li><br></li>'))) {
           e.preventDefault();
            if (blocks.length > 1) {
                handleDeleteBlock(id);
            }
      } else if (e.key === ' ' && target.textContent?.match(/^#$/)) {
          e.preventDefault();
          updateBlockTag(id, 'h1');
      } else if (e.key === ' ' && target.textContent?.match(/^##$/)) {
          e.preventDefault();
          updateBlockTag(id, 'h2');
      } else if (e.key === ' ' && target.textContent?.match(/^###$/)) {
          e.preventDefault();
          updateBlockTag(id, 'h3');
      } else if (e.key === ' ' && target.textContent?.match(/^####$/)) {
          e.preventDefault();
          updateBlockTag(id, 'h4');
      } else if (e.key === ' ' && target.textContent?.match(/^-$/)) {
          e.preventDefault();
          updateBlockTag(id, 'ul');
      } else if (e.key === ' ' && target.textContent?.match(/^1\.$/)) {
          e.preventDefault();
          updateBlockTag(id, 'ol');
      } else if (e.key === ' ' && target.textContent?.match(/^>$/)) {
          e.preventDefault();
          updateBlockTag(id, 'blockquote');
      } else if (e.key === ' ' && target.textContent?.match(/^---$/)) {
          e.preventDefault();
          updateBlockTag(id, 'hr');
      } 
  }, [blocks, handleAddBlock, updateBlockTag, handleDeleteBlock, updateBlocks, undo, redo, commandMenuOpen]);
  
  const handleCommandSelect = (command: ContentBlock['tag']) => {
    if (!activeBlockId) return;

    const currentIndex = blocks.findIndex(b => b.id === activeBlockId);
    
    // Replace the '/' with the new block
    const newBlocks = [...blocks];
    newBlocks[currentIndex] = { ...newBlocks[currentIndex], tag: command, content: '' };
    updateBlocks(newBlocks);

    // Focus the new block
    setActiveBlockId(newBlocks[currentIndex].id);
    setCommandMenuOpen(false);
  };

  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setToolbarPosition({
            top: rect.top + window.scrollY - 50,
            left: rect.left + window.scrollX + (rect.width / 2),
        });
        setIsToolbarOpen(true);
    } else {
        setIsToolbarOpen(false);
    }
  }, []);

  useEffect(() => {
      document.addEventListener("selectionchange", handleSelectionChange);
      return () => {
          document.removeEventListener("selectionchange", handleSelectionChange);
      };
  }, [handleSelectionChange]);

  
  const handleDeleteProjectAndRedirect = () => {
    if(project) {
      deleteProject(project.id);
      router.push('/dashboard/projects');
      toast({ title: "Project deleted", description: `${project.name} has been deleted.` });
    }
    setIsDeleteDialogOpen(false);
  }

  const handleDuplicateBlock = useCallback((blockId: string) => {
    const blockToDuplicate = blocks.find(b => b.id === blockId);
    if (!blockToDuplicate) return;
    
    const index = blocks.findIndex(b => b.id === blockId);
    const newBlock = { ...blockToDuplicate, id: `block-new-${Date.now()}` };
    
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    updateBlocks(newBlocks);
    setActiveBlockId(newBlock.id);
  }, [blocks, updateBlocks]);

  const handleBlockAction = useCallback((action: string, blockId: string, value?: any) => {
    if (action === 'delete') {
      handleDeleteBlock(blockId);
    } else if (action === 'duplicate') {
      handleDuplicateBlock(blockId);
    } else if (action === 'turnInto') {
      updateBlockTag(blockId, value);
    } else if (action === 'split') {
      setSplitBlocks(prev => {
        const cur = prev[blockId] || blocks.find(b => b.id === blockId)?.meta?.viewMode || 'split';
        const next = cur === 'split' ? 'markdown' : cur === 'markdown' ? 'preview' : 'split';
        return { ...prev, [blockId]: next };
      });
    }
  }, [handleDeleteBlock, handleDuplicateBlock, updateBlockTag]);


  if (!project || !client) {
    return null;
  }

  return (
    <>
      <div className="w-full grid grid-cols-1 gap-6 pt-6">
        <header className="flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="h-10 w-10" asChild>
              <Link href="/dashboard/projects">
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="font-headline text-xl font-bold">{project.name}</h1>
              <p className="text-sm text-muted-foreground">{client.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
              <Button onClick={() => router.push(`/dashboard/projects/${id}/report`)} variant="outline">
                <FileText className="mr-2 h-4 w-4" /> {t[uiLanguage].previewReport}
              </Button>
               <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t[uiLanguage].confirmDeleteProjectTitle}</AlertDialogTitle>
                      <AlertDialogDescription>{t[uiLanguage].confirmDeleteProjectDesc}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t[uiLanguage].cancel}</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteProjectAndRedirect} className="bg-destructive hover:bg-destructive/90">{t[uiLanguage].delete}</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
              </AlertDialog>
          </div>
        </header>

        <div className="w-full px-4 sm:px-6">
          <Tabs defaultValue={searchParams.get('tab') || 'content'} className="w-full">
            <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="content">{t[uiLanguage].content}</TabsTrigger>
                  <TabsTrigger value="findings">{t[uiLanguage].findings}</TabsTrigger>
                  <TabsTrigger value="details">{t[uiLanguage].projectDetails}</TabsTrigger>
                </TabsList>
                 <Button onClick={() => handleSave(true)} disabled={saveStatus === 'saving'} variant={saveStatus === 'unsaved' ? 'default' : 'ghost'} size="sm">
                    {saveStatus === 'saving' ? (<>{t[uiLanguage].saving}</>) : 
                     saveStatus === 'saved' ? (<><CheckCircle className="mr-2 h-4 w-4 text-green-500" />{t[uiLanguage].saved}</>) : 
                     (<>{t[uiLanguage].save}</>)}
                </Button>
            </div>
            
            <TabsContent value="content" className="pt-6">
               <div className="w-full" dir="ltr">
                     {isToolbarOpen && <FloatingToolbar position={toolbarPosition} />}
                     <div className="mb-4 flex items-center gap-3">
                        <Label className="mr-2">Importar plantilla:</Label>
                        <div className="flex items-start gap-3">
                          <div>
                            <Combobox
                              options={[
                                ...projectTemplates.map(pt => ({ label: projectLanguage === 'es' ? pt.name_es : pt.name_en, value: `tpl:${pt.id}` })),
                                ...vulnerabilities.map(v => ({ label: projectLanguage === 'es' ? (v.title_es || v.title_en) : v.title_en, value: `vul:${v.id}` })),
                              ]}
                              selectedValue={templateComboboxValue}
                              onSelect={(val) => {
                                setTemplateComboboxValue(val);
                                if (!val) {
                                  setTemplatePreview('');
                                  return;
                                }
                                if (val.startsWith('tpl:')) {
                                  const id = val.replace('tpl:', '');
                                  const tpl = projectTemplates.find(p => p.id === id);
                                  if (tpl) {
                                    const md = projectLanguage === 'es' ? (tpl.scope_es || tpl.scope_en) : (tpl.scope_en || tpl.scope_es);
                                    setTemplatePreview(md || '');
                                  }
                                } else if (val.startsWith('vul:')) {
                                  const id = val.replace('vul:', '');
                                  const vul = vulnerabilities.find(v => v.id === id);
                                  if (vul) {
                                    const title = projectLanguage === 'es' ? (vul.title_es || vul.title_en) : vul.title_en;
                                    const overview = projectLanguage === 'es' ? (vul.overview_es || vul.overview_en) : (vul.overview_en || vul.overview_es);
                                    const tech = projectLanguage === 'es' ? (vul.technicalDescription_es || vul.technicalDescription_en) : (vul.technicalDescription_en || vul.technicalDescription_es);
                                    const actions = projectLanguage === 'es' ? (vul.immediateActions_es || vul.immediateActions_en) : (vul.immediateActions_en || vul.immediateActions_es);
                                    const md = [`# ${title}`, overview || '', tech ? `## Technical Details\n${tech}` : '', actions ? `## Immediate Actions\n${actions}` : ''].filter(Boolean).join('\n\n');
                                    setTemplatePreview(md);
                                  }
                                }
                              }}
                              placeholder={t[projectLanguage as 'en'|'es'].selectTemplate}
                              searchPlaceholder="Buscar plantillas..."
                            />
                          </div>
                          <div className="self-center">
                            <Button onClick={() => {
                              if (!templateComboboxValue) return toast({ variant: 'destructive', title: 'Seleccione una plantilla' });
                              if (templateComboboxValue.startsWith('tpl:')) {
                                const id = templateComboboxValue.replace('tpl:', '');
                                const tpl = projectTemplates.find(p => p.id === id);
                                if (!tpl) return toast({ variant: 'destructive', title: 'Plantilla no encontrada' });
                                const md = projectLanguage === 'es' ? (tpl.scope_es || tpl.scope_en) : (tpl.scope_en || tpl.scope_es);
                                const newBlocks = parseMarkdownToBlocks(md || '');
                                updateBlocks(newBlocks);
                                const mapping: Record<string, 'split'|'markdown'|'preview'> = {};
                                newBlocks.forEach(b => mapping[b.id] = 'split');
                                setSplitBlocks(prev => ({ ...prev, ...mapping }));
                                setTemplateComboboxValue('');
                                setTemplatePreview('');
                              } else if (templateComboboxValue.startsWith('vul:')) {
                                const id = templateComboboxValue.replace('vul:', '');
                                const vul = vulnerabilities.find(v => v.id === id);
                                if (!vul) return toast({ variant: 'destructive', title: 'Vulnerability not found' });
                                const title = projectLanguage === 'es' ? (vul.title_es || vul.title_en) : vul.title_en;
                                const overview = projectLanguage === 'es' ? (vul.overview_es || vul.overview_en) : (vul.overview_en || vul.overview_es);
                                const tech = projectLanguage === 'es' ? (vul.technicalDescription_es || vul.technicalDescription_en) : (vul.technicalDescription_en || vul.technicalDescription_es);
                                const actions = projectLanguage === 'es' ? (vul.immediateActions_es || vul.immediateActions_en) : (vul.immediateActions_en || vul.immediateActions_es);
                                const md = [`# ${title}`, overview || '', tech ? `## Technical Details\n${tech}` : '', actions ? `## Immediate Actions\n${actions}` : ''].filter(Boolean).join('\n\n');
                                const newBlocks = parseMarkdownToBlocks(md || '');
                                updateBlocks(newBlocks);
                                const mapping: Record<string, 'split'|'markdown'|'preview'> = {};
                                newBlocks.forEach(b => mapping[b.id] = 'split');
                                setSplitBlocks(prev => ({ ...prev, ...mapping }));
                                setTemplateComboboxValue('');
                                setTemplatePreview('');
                              }
                            }}><Plus className="mr-2 h-4 w-4"/>Importar</Button>
                          </div>
                        </div>
                     </div>
                     <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                            {blocks.map((block, index) => (
                              <div key={block.id} className="mb-5 rounded-md border bg-card p-4 shadow-sm">
                                  <SortableBlock
                                    ref={(el: any) => (blockRefs.current[block.id] = el)}
                                    block={block}
                                    index={index}
                                    onUpdate={(newContent: string) => {
                                        if (commandMenuOpen) {
                                            return;
                                        }
                                        updateBlocks(blocks.map(b => b.id === block.id ? { ...b, content: newContent } : b));
                                    }}
                                    onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => handleKeyDown(e, block.id)}
                                    onAdd={handleAddBlock}
                                    onAction={handleBlockAction}
                                    viewMode={splitBlocks[block.id] || block.meta?.viewMode || 'split'}
                                    onToggleSplit={(id: string, mode: 'split' | 'markdown' | 'preview') => setSplitBlocks(prev => ({ ...prev, [id]: mode }))}
                                    sectionTitle={getSectionTitleForBlock(blocks, index)}
                                    onFocus={() => setActiveBlockId(block.id)}
                                    isFocused={activeBlockId === block.id}
                                    placeholder={t[projectLanguage as 'en' | 'es'].commandPlaceholder}
                                    t_editor={t[projectLanguage as 'en' | 'es']}
                                  />
                              </div>
                            ))}
                        </SortableContext>
                     </DndContext>
                     <CommandMenu
                        open={commandMenuOpen}
                        onOpenChange={setCommandMenuOpen}
                        onSelect={handleCommandSelect}
                        triggerRef={activeBlockId ? blockRefs.current[activeBlockId] : null}
                     />
                    <div className="mt-4 flex gap-2">
                      <Button onClick={() => handleAddBlock(blocks.length - 1, 'h2', 'New Section') }><Plus className="mr-2 h-4 w-4"/>Añadir sección</Button>
                      <Button variant="destructive" onClick={() => activeBlockId && handleDeleteBlock(activeBlockId)}>Eliminar sección</Button>
                    </div>
               </div>
            </TabsContent>

            <TabsContent value="findings" className="pt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{t[uiLanguage].findings}</CardTitle>
                    <Button asChild>
                      <Link href={`/dashboard/projects/${id}/findings/new`}>
                        <PlusCircle className="mr-2 h-4 w-4" /> {t[uiLanguage].newFinding}
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                   <TooltipProvider>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead onClick={() => requestSort('title')} className="cursor-pointer hover:bg-muted/50"><div className="flex items-center">{t[uiLanguage].findingTitle}{getSortIcon('title')}</div></TableHead>
                          <TableHead onClick={() => requestSort('severity')} className="cursor-pointer hover:bg-muted/50"><div className="flex items-center">{t[uiLanguage].severity}{getSortIcon('severity')}</div></TableHead>
                          <TableHead onClick={() => requestSort('cvss')} className="cursor-pointer hover:bg-muted/50"><div className="flex items-center">{t[uiLanguage].cvss}{getSortIcon('cvss')}</div></TableHead>
                          <TableHead onClick={() => requestSort('updatedAt')} className="cursor-pointer hover:bg-muted/50"><div className="flex items-center">{t[uiLanguage].lastUpdated}{getSortIcon('updatedAt')}</div></TableHead>
                          <TableHead className="text-right">{t[uiLanguage].actions}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedFindings.map(finding => (
                          <TableRow key={finding.id}>
                            <TableCell className="font-medium">
                               <Link href={`/dashboard/projects/${id}/findings/${finding.id}`} className="hover:text-primary">
                                  {finding.title}
                               </Link>
                            </TableCell>
                            <TableCell><Badge variant={getSeverityVariant(finding.severity)}>{finding.severity}</Badge></TableCell>
                            <TableCell className="font-code">{finding.cvss.toFixed(1)}</TableCell>
                            <TableCell>{format(new Date(finding.updatedAt), 'PP', { locale: uiLanguage === 'es' ? es : undefined })}</TableCell>
                            <TableCell className="text-right">
                               <div className="flex justify-end gap-2">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon" asChild>
                                          <Link href={`/dashboard/projects/${id}/findings/${finding.id}`}><Edit className="h-4 w-4" /></Link>
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>{t[uiLanguage].edit}</p></TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive-foreground hover:bg-destructive" onClick={() => setFindingToDelete(finding)}>
                                          <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>{t[uiLanguage].delete}</p></TooltipContent>
                                  </Tooltip>
                               </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TooltipProvider>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="details" className="pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t[uiLanguage].projectDetails}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t[uiLanguage].projectName}</Label>
                      <Input id="name" value={name} onChange={e => handleFieldChange(setName, e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="client">{t[uiLanguage].client}</Label>
                      <Select value={clientId} onValueChange={value => handleFieldChange(setClientId, value)}>
                        <SelectTrigger id="client"><SelectValue placeholder={t[uiLanguage].selectClient} /></SelectTrigger>
                        <SelectContent>
                          {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="status">{t[uiLanguage].status}</Label>
                      <Select value={status} onValueChange={(value: Project['status']) => handleFieldChange(setStatus, value)}>
                        <SelectTrigger id="status"><SelectValue placeholder={t[uiLanguage].selectStatus} /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="In Progress">{t[uiLanguage].inProgress}</SelectItem>
                          <SelectItem value="Completed">{t[uiLanguage].completed}</SelectItem>
                          <SelectItem value="On Hold">{t[uiLanguage].onHold}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>{t[uiLanguage].dates}</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                            <Button id="date" variant={"outline"} className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date?.from ? ( date.to ? (
                                    <>{format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}</>
                                ) : (format(date.from, "LLL dd, y"))
                                ) : (<span>Pick a date</span>)}
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar initialFocus mode="range" defaultMonth={date?.from} selected={date} onSelect={(newDate) => handleFieldChange(setDate, newDate)} numberOfMonths={2} />
                            </PopoverContent>
                        </Popover>
                    </div>
                  </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                      <Label htmlFor="language">{t[uiLanguage].language}</Label>
                      <Select value={projectLanguage} onValueChange={(value: 'en' | 'es') => handleFieldChange(setProjectLanguage, value)}>
                        <SelectTrigger id="language"><SelectValue placeholder={t[uiLanguage].selectLanguage} /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">{t[uiLanguage].english}</SelectItem>
                          <SelectItem value="es">{t[uiLanguage].spanish}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="icon">{t[uiLanguage].icon}</Label>
                      <Select value={icon} onValueChange={value => handleFieldChange(setIcon, value)}>
                        <SelectTrigger id="icon"><SelectValue placeholder={t[uiLanguage].selectIcon} /></SelectTrigger>
                        <SelectContent>
                           {projectIconOptions.map(o => (
                            <SelectItem key={o.value} value={o.value}>
                              <ProjectIconSelectItem value={o.value} label={o.label} />
                            </SelectItem>
                           ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <AlertDialog open={!!findingToDelete} onOpenChange={() => setFindingToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t[uiLanguage].confirmDeleteFindingTitle}</AlertDialogTitle>
            <AlertDialogDescription>{t[uiLanguage].confirmDeleteFindingDesc}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t[uiLanguage].cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteFinding} className="bg-destructive hover:bg-destructive/90">{t[uiLanguage].delete}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t[uiLanguage].unsavedChangesTitle}</AlertDialogTitle>
            <AlertDialogDescription>{t[uiLanguage].unsavedChangesDesc}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setNextPath('')}>{t[uiLanguage].cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleLeaveConfirm}>{t[uiLanguage].leave}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
    

    







