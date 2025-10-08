
'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

const getHighlightedText = (text: string) => {
    // Matches [TODO: anything] or the whole word TODO, case-sensitive for TODO
    const todoRegex = /(\[TODO:?.*?\]|\bTODO\b)/g;

    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(todoRegex, (match) => `<span class="bg-red-500 text-white font-bold px-1 rounded-sm">${match}</span>`);
};

interface HighlightingTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'value'> {
  value: string;
  onValueChange: (value: string) => void;
}

export const HighlightingTextarea = React.forwardRef<HTMLTextAreaElement, HighlightingTextareaProps>(
    ({ value, onValueChange, className, ...props }, ref) => {
        const [text, setText] = useState(value);
        const backdropRef = useRef<HTMLDivElement>(null);
        const localTextareaRef = useRef<HTMLTextAreaElement>(null);

        // Combine refs
        React.useImperativeHandle(ref, () => localTextareaRef.current as HTMLTextAreaElement);

        useEffect(() => {
            setText(value);
        }, [value]);

        const handleScroll = useCallback(() => {
            if (backdropRef.current && localTextareaRef.current) {
                backdropRef.current.scrollTop = localTextareaRef.current.scrollTop;
                backdropRef.current.scrollLeft = localTextareaRef.current.scrollLeft;
            }
        }, []);

        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const newValue = e.target.value;
            setText(newValue);
            onValueChange(newValue);
        };
        
        const highlightedText = getHighlightedText(text);

        return (
            <div className="relative w-full h-full">
                <div
                    ref={backdropRef}
                    className={cn(
                        "absolute inset-0 z-0 overflow-auto whitespace-pre-wrap break-words p-3 text-sm pointer-events-none",
                        "font-code min-h-[300px]",
                         "border border-transparent",
                         className
                    )}
                    dangerouslySetInnerHTML={{ __html: highlightedText + '\n' }}
                />
                <textarea
                    ref={localTextareaRef}
                    value={text}
                    onChange={handleChange}
                    onScroll={handleScroll}
                    className={cn(
                        'absolute inset-0 z-10 block h-full w-full resize-none overflow-auto whitespace-pre-wrap break-words bg-transparent p-3 text-transparent caret-foreground',
                        'font-code min-h-[300px] text-sm',
                        "flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        className
                    )}
                    spellCheck="false"
                    {...props}
                />
            </div>
        );
    }
);
HighlightingTextarea.displayName = 'HighlightingTextarea';
