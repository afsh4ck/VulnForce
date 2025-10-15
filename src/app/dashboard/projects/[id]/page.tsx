'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, FileText, ArrowUpDown, Edit, Save, Trash2, CalendarIcon, Plus, GripVertical, Languages, ChevronLeft, CheckCircle, Heading2, Heading3, Code } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/context/language-context";
import type { Finding, Project } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useData } from '@/context/data-context';
import { DateRange } from 'react-day-picker';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { translateText } from '@/ai/flows/translate-text-flow';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

type SortKey = keyof Finding;
type SaveStatus = 'unsaved' | 'saving' | 'saved';

interface ContentBlock {
  id: string;
  tag: 'h2' | 'h3' | 'p' | 'pre';
  content: string;
}

const iconOptions = [
    { value: 'FileText', label: 'FileText' },
    { value: 'Scan', label: 'Scan' },
    { value: 'Globe', label: 'Globe' },
    { value: 'Network', label: 'Network' },
    { value: 'Smartphone', label: 'Smartphone' },
    { value: 'Wifi', label: 'Wifi' },
    { value: 'Award', label: 'Award' },
];

function parseHtmlToBlocks(html: string): ContentBlock[] {
  if (typeof document === 'undefined' || !html) {
    return [{ id: `block-${Date.now()}`, tag: 'p', content: '' }];
  }
  const el = document.createElement('div');
  el.innerHTML = html;
  const blocks: ContentBlock[] = [];
  el.childNodes.forEach((node, index) => {
    const id = `block-${index}-${Date.now()}-${Math.random()}`;
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      const tag = element.tagName.toLowerCase();
      if (['h2', 'h3', 'p'].includes(tag)) {
        blocks.push({ id, tag: tag as 'h2'|'h3'|'p', content: element.innerHTML });
      } else if (tag === 'pre') {
         blocks.push({ id, tag: 'pre', content: element.querySelector('code')?.textContent || '' });
      }
    } else if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
      blocks.push({ id, tag: 'p', content: node.textContent.trim() });
    }
  });
  if (blocks.length === 0) return [{ id: `block-${Date.now()}`, tag: 'p', content: '' }];
  return blocks;
}

function blocksToHtml(blocks: ContentBlock[]): string {
  return blocks.map(block => {
    if (block.tag === 'pre') {
        const escapedContent = block.content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return `<pre><code>${escapedContent}</code></pre>`
    }
    return `<${block.tag}>${block.content}</${block.tag}>`
  }).join('');
}

const EditableBlock = ({ block, onUpdate, onKeyDown, onFocus, isFocused }: { 
  block: ContentBlock, 
  onUpdate: (content: string) => void, 
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void, 
  onFocus: () => void,
  isFocused: boolean
}) => {
    const blockRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (blockRef.current && isFocused) {
        blockRef.current.focus();
      }
    }, [isFocused]);

    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        onUpdate(e.currentTarget.innerHTML);
    };

    const Tag = block.tag === 'pre' ? 'div' : block.tag;
    const isCode = block.tag === 'pre';
    const isPlaceholder = !block.content;
    const placeholderText = "Type '/' for commands";
    
    return (
        <div 
          className="relative"
          onFocus={onFocus}
        >
          <Tag
              ref={blockRef}
              onBlur={handleBlur}
              onInput={(e) => onUpdate(e.currentTarget.innerHTML)}
              onKeyDown={onKeyDown}
              contentEditable
              suppressContentEditableWarning
              className={cn(
                "w-full outline-none p-1 rounded-md",
                {
                  'text-2xl font-semibold mb-3 border-b pb-2 mt-8 font-headline': block.tag === 'h2',
                  'text-xl font-semibold mb-3 mt-6 font-headline': block.tag === 'h3',
                  'my-2 leading-relaxed': block.tag === 'p',
                  'bg-muted font-code text-sm p-4 rounded-md overflow-x-auto my-4 whitespace-pre-wrap': isCode,
                }
              )}
              dangerouslySetInnerHTML={{ __html: block.content }}
          />
           {isPlaceholder && !isCode && (
              <div className="absolute top-1 left-1 text-muted-foreground/50 pointer-events-none">{placeholderText}</div>
            )}
        </div>
    );
};


const SortableBlock = ({ block, onUpdate, onKeyDown, onDelete, onAdd, onFocus, isFocused }: { 
    block: ContentBlock, 
    onUpdate: (id: string, content: string) => void, 
    onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>, id: string, tag: ContentBlock['tag']) => void,
    onDelete: (id: string) => void,
    onAdd: (id: string) => void,
    onFocus: (id: string) => void,
    isFocused: boolean,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group/block">
      <div className="absolute top-0 -left-12 h-full flex items-center gap-1 opacity-0 group-hover/block:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer" onClick={() => onAdd(block.id)}>
          <Plus className="h-4 w-4"/>
        </Button>
        <div {...attributes} {...listeners} className="cursor-grab p-1">
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>
      <EditableBlock 
        block={block} 
        onUpdate={(content) => onUpdate(block.id, content)} 
        onKeyDown={(e) => onKeyDown(e, block.id, block.tag)} 
        onFocus={() => onFocus(block.id)}
        isFocused={isFocused}
      />
    </div>
  );
};


export default function ProjectDetailsPage()