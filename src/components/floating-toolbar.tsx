
'use client';

import React from 'react';
import { Button } from './ui/button';
import { Bold, Italic, Strikethrough, Code, Link as LinkIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useLanguage } from '@/context/language-context';

interface FloatingToolbarProps {
  position: { top: number; left: number };
}

const formatText = (command: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    if (!selectedText) return;

    let newNode;
    switch (command) {
        case 'bold':
            newNode = document.createElement('strong');
            break;
        case 'italic':
            newNode = document.createElement('em');
            break;
        case 'strikethrough':
            newNode = document.createElement('s');
            break;
        case 'code':
            newNode = document.createElement('code');
            break;
        case 'link':
            const url = prompt('Enter the URL:');
            if (url) {
                newNode = document.createElement('a');
                newNode.setAttribute('href', url);
                newNode.setAttribute('target', '_blank');
                newNode.setAttribute('rel', 'noopener noreferrer');
            }
            break;
        default:
            return;
    }
    
    if (newNode) {
        const parentElement = range.commonAncestorContainer.parentElement;
        if (parentElement && parentElement.tagName.toLowerCase() === command) {
            // Already wrapped, so unwrap it
            const grandparentElement = parentElement.parentElement;
            if (grandparentElement) {
                while (parentElement.firstChild) {
                    grandparentElement.insertBefore(parentElement.firstChild, parentElement);
                }
                grandparentElement.removeChild(parentElement);
            }
        } else {
             // Not wrapped, so wrap it
            newNode.textContent = selectedText;
            range.deleteContents();
            range.insertNode(newNode);
        }

        // To keep the text selected after formatting
        const newRange = document.createRange();
        newRange.selectNodeContents(newNode);
        selection.removeAllRanges();
        selection.addRange(newRange);
    }
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
    { name: t[language].strikethrough, icon: Strikethrough, action: () => formatText('strikethrough') },
    { name: t[language].code, icon: Code, action: () => formatText('code') },
    { name: t[language].link, icon: LinkIcon, action: () => formatText('link') },
  ];

  return (
    <div style={toolbarStyle} className="bg-background border rounded-md shadow-lg p-1 flex gap-1">
      <TooltipProvider>
        {toolbarOptions.map((option) => (
          <Tooltip key={option.name}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={option.action}>
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

    