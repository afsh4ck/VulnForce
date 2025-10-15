
'use client';
import React, { useRef, useEffect, useCallback, useImperativeHandle } from 'react';
import { cn } from '@/lib/utils';
import { useSelectionToolbar } from '@/hooks/use-selection-toolbar';

const getHighlightedText = (text: string) => {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/^(#\s)(.*)/gm, '<span class="text-primary font-bold">$1$2</span>')
        .replace(/^(##|###|####)\s(.*)/gm, '<span class="text-foreground font-bold">$1 $2</span>')
        .replace(/(\[TODO:?.*?\])/g, '<span class="bg-destructive text-destructive-foreground font-bold px-1 rounded-sm">$1</span>');
};

interface HighlightingTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'value'> {
  value: string;
  onValueChange: (value: string) => void;
}

export const HighlightingTextarea = React.forwardRef<HTMLTextAreaElement, HighlightingTextareaProps>(
    ({ value, onValueChange, className, ...props }, ref) => {
        const backdropRef = useRef<HTMLDivElement>(null);
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

        const syncScroll = useCallback(() => {
            if (backdropRef.current && localTextareaRef.current) {
                backdropRef.current.scrollTop = localTextareaRef.current.scrollTop;
                backdropRef.current.scrollLeft = localTextareaRef.current.scrollLeft;
            }
        }, []);

        useEffect(() => {
            syncScroll();
        }, [value, syncScroll]);

        const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const textarea = e.currentTarget;
                const { selectionStart, selectionEnd, value } = textarea;
                const newValue = value.substring(0, selectionStart) + '  ' + value.substring(selectionEnd);
                onValueChange(newValue);
                setTimeout(() => {
                    textarea.selectionStart = textarea.selectionEnd = selectionStart + 2;
                }, 0);
            }
        };

        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            onValueChange(e.target.value);
        };
        
        const highlightedHtml = getHighlightedText(value) + '\n';

        return (
            <div className={cn("relative w-full h-full", className)}>
                 <div style={toolbarStyles.toolbar} className="bg-background border rounded-md shadow-lg flex gap-1 p-1">
                    <button onClick={() => applyFormat('bold')} style={toolbarStyles.button}>B</button>
                    <button onClick={() => applyFormat('italic')} style={toolbarStyles.button}>I</button>
                    <button onClick={() => applyFormat('code')} style={toolbarStyles.button}>Code</button>
                    <button onClick={() => applyFormat('link')} style={toolbarStyles.button}>Link</button>
                </div>
                <div 
                    ref={backdropRef} 
                    className="absolute inset-0 z-0 overflow-auto whitespace-pre-wrap break-words pointer-events-none p-2 font-code text-sm min-h-[200px] text-muted-foreground"
                    style={{lineHeight: '1.5rem'}}
                >
                    <div dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
                </div>
                <textarea
                    ref={localTextareaRef}
                    value={value}
                    onChange={handleChange}
                    onScroll={syncScroll}
                    onKeyDown={handleKeyDown}
                    onSelect={handleSelectionChange}
                    className={cn(
                        'relative block w-full h-full resize-none overflow-auto whitespace-pre-wrap break-words border rounded-md bg-transparent text-transparent caret-foreground',
                        'font-code text-sm min-h-[200px]',
                        "p-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    )}
                    style={{lineHeight: '1.5rem'}}
                    spellCheck="false"
                    {...props}
                />
            </div>
        );
    }
);
HighlightingTextarea.displayName = 'HighlightingTextarea';
