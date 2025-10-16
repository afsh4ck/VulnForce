
'use client';

import React from 'react';
import { Button } from './ui/button';
import { Bold, Italic, Strikethrough, Code, Link as LinkIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useLanguage } from '@/context/language-context';

interface FloatingToolbarProps {
  position: { top: number; left: number };
}

const formatText = (command: string, value?: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    if (!selectedText) return;

    document.execCommand(command, false, value);
};

export const FloatingToolbar = ({ position }: FloatingToolbarProps) => {
  const { language } = useLanguage();
  
  const t = {
    en: {
        bold: 'Bold',
        italic: 'Italic',
        strikethrough: 'Strikethrough',
        code: 'Code',
        link: 'Link',
    },
    es: {
        bold: 'Negrita',
        italic: 'Cursiva',
        strikethrough: 'Tachado',
        code: 'Código',
        link: 'Enlace',
    }
  }

  const handleMouseDown = (e: React.MouseEvent, action: () => void) => {
      e.preventDefault();
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      const range = selection.getRangeAt(0);
      
      action();
      
      // Re-apply the selection after the format is applied
      selection.removeAllRanges();
      selection.addRange(range);
  };


  const toolbarStyle: React.CSSProperties = {
    position: 'absolute',
    top: `${position.top}px`,
    left: `${position.left}px`,
    transform: 'translateX(-50%)',
    zIndex: 1000,
  };

  const toolbarOptions = [
    { name: t[language].bold, icon: Bold, action: () => formatText('bold') },
    { name: t[language].italic, icon: Italic, action: () => formatText('italic') },
    { name: t[language].strikethrough, icon: Strikethrough, action: () => formatText('strikeThrough') },
    { name: t[language].code, icon: Code, action: () => {
        const selection = window.getSelection();
        if (selection && !selection.isCollapsed) {
            const range = selection.getRangeAt(0);
            const existingCode = range.startContainer.parentElement?.closest('code');
            
            const tempDiv = document.createElement('div');
            tempDiv.appendChild(range.cloneContents());
            const containsCode = tempDiv.querySelector('code');

            if (existingCode || containsCode) {
                 document.execCommand('removeFormat');
            } else {
                const code = document.createElement('code');
                code.className = "font-code bg-muted text-muted-foreground px-1.5 py-1 rounded-md break-words";
                range.surroundContents(code);
            }
        }
    }},
    { name: t[language].link, icon: LinkIcon, action: () => {
        const url = prompt('Enter URL:');
        if (url) {
            formatText('createLink', url);
        }
    }},
  ];

  return (
    <div style={toolbarStyle} className="bg-background border rounded-md shadow-lg p-1 flex gap-1">
      <TooltipProvider>
        {toolbarOptions.map((option) => (
          <Tooltip key={option.name}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onMouseDown={(e) => handleMouseDown(e, option.action)}>
                <option.icon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{option.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
};
