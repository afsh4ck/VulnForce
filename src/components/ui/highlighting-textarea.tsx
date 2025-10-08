
'use client';
import React, { useRef, useEffect, useCallback } from 'react';
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
            // For [TODO...]
            const highlighted = match.replace('TODO', `<span class="bg-red-500 text-white font-bold px-1 rounded-sm">TODO</span>`);
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

        // Combine refs to allow parent to have a ref to the textarea
        React.useImperativeHandle(ref, () => localTextareaRef.current as HTMLTextAreaElement);

        const handleScroll = useCallback(() => {
            if (backdropRef.current && localTextareaRef.current) {
                backdropRef.current.scrollTop = localTextareaRef.current.scrollTop;
                backdropRef.current.scrollLeft = localTextareaRef.current.scrollLeft;
            }
        }, []);

        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            onValueChange(e.target.value);
        };
        
        // This effect ensures the backdrop is scrolled in sync when the value changes and might cause a scrollbar to appear/disappear.
        useEffect(() => {
            handleScroll();
        }, [value, handleScroll]);

        const highlightedText = getHighlightedText(value);

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
                    dangerouslySetInnerHTML={{ __html: highlightedText + '\n' }} // Adding a newline to prevent jitter on the last line
                />
                <textarea
                    ref={localTextareaRef}
                    value={value}
                    onChange={handleChange}
                    onScroll={handleScroll}
                    className={cn(
                        'absolute inset-0 z-10 block h-full w-full resize-none overflow-auto whitespace-pre-wrap break-words bg-transparent p-3 text-transparent caret-foreground',
                        'font-code min-h-[300px] text-sm',
                        "flex w-full rounded-md border border-input bg-transparent px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
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
