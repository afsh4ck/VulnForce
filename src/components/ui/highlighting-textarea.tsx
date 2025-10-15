
'use client';
import React, { useRef, useEffect, useCallback, useImperativeHandle } from 'react';
import { cn } from '@/lib/utils';

const getHighlightedText = (text: string) => {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/(\[TODO:?.*?\])/g, '<span class="bg-destructive text-destructive-foreground font-bold px-1 rounded-sm">$1</span>')
        .replace(/^(#\s)(.*)/gm, '<span class="text-primary font-bold">$1$2</span>')
        .replace(/^(#{2,4})\s(.*)/gm, '<span class="text-foreground font-bold">$1$2</span>');
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
                <div 
                    ref={backdropRef} 
                    className="absolute inset-0 z-0 overflow-auto whitespace-pre-wrap break-words pointer-events-none p-4 font-code text-sm min-h-[300px] text-muted-foreground"
                >
                    <div dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
                </div>
                <textarea
                    ref={localTextareaRef}
                    value={value}
                    onChange={handleChange}
                    onScroll={syncScroll}
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
