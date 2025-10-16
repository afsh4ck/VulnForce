
'use client';

import React from 'react';
import { Button } from './ui/button';
import { Bold, Italic, Strikethrough, Code, Link as LinkIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useLanguage } from '@/context/language-context';

interface FloatingToolbarProps {
  position: { top: number; left: number };
}

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

  const handleFormatAction = (e: React.MouseEvent, command: string) => {
    e.preventDefault(); 
    if (command === 'createLink') {
        const url = prompt('Enter URL:');
        if (url) {
            document.execCommand(command, false, url);
        }
    } else if(command === 'formatBlock' && e.currentTarget.textContent === 'Code'){
        const selection = window.getSelection();
        if (selection && !selection.isCollapsed) {
            const range = selection.getRangeAt(0);
            const existingCode = range.startContainer.parentElement?.closest('code');
            
            if (existingCode) {
                 document.execCommand('removeFormat');
            } else {
                const code = document.createElement('code');
                code.className = "font-code bg-muted text-muted-foreground px-1.5 py-1 rounded-md break-words";
                range.surroundContents(code);
            }
        }
    } 
    else {
        document.execCommand(command, false);
    }
  };

  const toolbarStyle: React.CSSProperties = {
    position: 'absolute',
    top: `${position.top}px`,
    left: `${position.left}px`,
    transform: 'translateX(-50%)',
    zIndex: 1000,
  };
  
  const toolbarOptions = [
    { name: t[language].bold, icon: Bold, action: 'bold' },
    { name: t[language].italic, icon: Italic, action: 'italic' },
    { name: t[language].strikethrough, icon: Strikethrough, action: 'strikeThrough' },
    { name: t[language].code, icon: Code, action: 'formatBlock' },
    { name: t[language].link, icon: LinkIcon, action: 'createLink' },
  ];

  return (
    <div style={toolbarStyle} className="bg-background border rounded-md shadow-lg p-1 flex gap-1">
      <TooltipProvider>
        {toolbarOptions.map((option) => (
          <Tooltip key={option.name}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onMouseDown={(e) => handleFormatAction(e, option.action)}>
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
