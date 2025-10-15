'use client';
import React, { useRef, useEffect, useCallback, useImperativeHandle } from 'react';
import { cn } from '@/lib/utils';
import { useSelectionToolbar } from '@/hooks/use-selection-toolbar';

interface HighlightingTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'value'> {
  value: string;
  onValueChange: (value: string) => void;
}

export const HighlightingTextarea = React.forwardRef<HTMLTextAreaElement, HighlightingTextareaProps>(
    ({ value, onValueChange, className, ...props }, ref) => {
        const localTextareaRef = useRef<HTMLTextAreaElement>(null);
        
        useImperativeHandle(ref, () => localTextareaRef.current as HTMLTextAreaElement);

        const applyFormat = (format: 'bold' | 'italic' | 'code' | 'link') => {
          if (localTextareaRef.current) {
              const textarea = localTextareaRef.current;
              const start = textarea.selectionStart;
              const end = textarea.selectionEnd;
              const selectedText = value.substring(start, end);

              if (selectedText) {
                  let formattedText = '';
                  switch (format) {
                      case 'bold':
                          formattedText = `**${selectedText}**`;
                          break;
                      case 'italic':
                          formattedText = `*${selectedText}*`;
                          break;
                      case 'code':
                          formattedText = `\`${selectedText}\``;
                          break;
                      case 'link':
                          const url = prompt("Enter URL:");
                          if (url) {
                              formattedText = `[${selectedText}](${url})`;
                          } else {
                              return;
                          }
                          break;
                  }
                  const newValue = value.substring(0, start) + formattedText + value.substring(end);
                  onValueChange(newValue);
                  
                  // Reselect the newly formatted text
                  setTimeout(() => {
                      textarea.focus();
                      textarea.setSelectionRange(start, start + formattedText.length);
                  }, 0);
              }
          }
      };


        const { toolbarStyles, handleSelectionChange } = useSelectionToolbar(localTextareaRef);

        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            onValueChange(e.target.value);
        };

        return (
            <div className={cn("relative w-full h-full", className)}>
                 <div style={toolbarStyles.toolbar} className="bg-background border rounded-md shadow-lg flex gap-1 p-1">
                    <button onClick={() => applyFormat('bold')} style={toolbarStyles.button}>B</button>
                    <button onClick={() => applyFormat('italic')} style={toolbarStyles.button}>I</button>
                    <button onClick={() => applyFormat('code')} style={toolbarStyles.button}>Code</button>
                    <button onClick={() => applyFormat('link')} style={toolbarStyles.button}>Link</button>
                </div>
                <textarea
                    ref={localTextareaRef}
                    value={value}
                    onChange={handleChange}
                    onSelect={handleSelectionChange}
                    className={cn(
                        'relative block w-full h-full resize-none overflow-auto whitespace-pre-wrap break-words border-0 rounded-md bg-transparent caret-foreground',
                        'font-sans text-sm min-h-[200px] leading-relaxed',
                        "p-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    )}
                    spellCheck="false"
                    {...props}
                />
            </div>
        );
    }
);
HighlightingTextarea.displayName = 'HighlightingTextarea';
