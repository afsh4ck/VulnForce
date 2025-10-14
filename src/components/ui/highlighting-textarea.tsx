

'use client';
import React, { useRef, useEffect, useCallback, useImperativeHandle } from 'react';
import { cn } from '@/lib/utils';

const getHighlightedText = (text: string) => {
    if (!text) return '';
    // Matches [TODO: anything] and the word TODO itself, case-sensitive
    const todoRegex = /(\[TODO(?::[^\]]*)?\]|\bTODO\b)/g;

    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(todoRegex, (match) => {
             if (match === 'TODO') {
                return `<span class="bg-red-500 text-white font-bold px-1 rounded-sm">TODO</span>`;
            }
             const highlighted = match.replace('TODO', `<span class="bg-red-500 text-white font-bold px-0.5 rounded-sm">TODO</span>`);
            return highlighted;
        });
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

        const handleScroll = useCallback(() => {
            if (backdropRef.current && localTextareaRef.current) {
                backdropRef.current.scrollTop = localTextareaRef.current.scrollTop;
                backdropRef.current.scrollLeft = localTextareaRef.current.scrollLeft;
            }
        }, []);
        
        const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === 'Enter') {
                const textarea = e.currentTarget;
                const { selectionStart, selectionEnd, value } = textarea;
        
                // Find the start of the current line
                let lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
        
                const currentLine = value.substring(lineStart, selectionStart);
        
                const bulletMatch = currentLine.match(/^(\s*-\s+)/);
                const numberMatch = currentLine.match(/^(\s*\d+\.\s+)/);
        
                if (bulletMatch) {
                    e.preventDefault();
                    const newText = currentLine.trim() === '-' ? '\n' : '\n' + bulletMatch[1];
                    const newValue = value.substring(0, selectionStart) + newText + value.substring(selectionEnd);
                    onValueChange(newValue);
        
                    setTimeout(() => {
                        textarea.selectionStart = textarea.selectionEnd = selectionStart + newText.length;
                    }, 0);
                } else if (numberMatch) {
                    e.preventDefault();
                    const currentNumber = parseInt(numberMatch[1].trim());
                    // If the list item is empty, pressing Enter should remove it and create a newline
                    if (currentLine.trim() === `${currentNumber}.`) {
                         const newValue = value.substring(0, lineStart) + value.substring(selectionEnd);
                         onValueChange(newValue);
                         setTimeout(() => {
                             textarea.selectionStart = textarea.selectionEnd = lineStart;
                         }, 0);

                    } else {
                        const indentation = numberMatch[1].match(/^\s*/)?.[0] || '';
                        const nextNumber = currentNumber + 1;
                        const newText = `\n${indentation}${nextNumber}. `;
                        const newValue = value.substring(0, selectionStart) + newText + value.substring(selectionEnd);
                        onValueChange(newValue);
            
                        setTimeout(() => {
                            textarea.selectionStart = textarea.selectionEnd = selectionStart + newText.length;
                        }, 0);
                    }
                }
            }
        };

        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            onValueChange(e.target.value);
        };
        
        useEffect(() => {
            handleScroll();
        }, [value, handleScroll]);

        const highlightedText = getHighlightedText(value);

        return (
            <div className={cn("relative w-full h-full", className)}>
                <div
                    ref={backdropRef}
                    className={cn(
                        "absolute inset-0 z-0 overflow-auto whitespace-pre-wrap break-words pointer-events-none",
                        "font-code text-sm min-h-[300px]",
                        "p-4" // Match textarea padding
                    )}
                >
                    <span dangerouslySetInnerHTML={{ __html: highlightedText + '\n' }}/>
                </div>
                <textarea
                    ref={localTextareaRef}
                    value={value}
                    onChange={handleChange}
                    onScroll={handleScroll}
                    onKeyDown={handleKeyDown}
                    className={cn(
                        'relative z-10 block w-full h-full resize-none overflow-auto whitespace-pre-wrap break-words border-0 bg-transparent text-transparent caret-foreground',
                        'font-code text-sm min-h-[300px]',
                        "p-4 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    )}
                    spellCheck="false"
                    {...props}
                />
            </div>
        );
    }
);
HighlightingTextarea.displayName = 'HighlightingTextarea';
