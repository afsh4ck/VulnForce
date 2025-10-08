
'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

const getHighlightedText = (text: string) => {
    // Matches [TODO: anything] or the whole word TODO
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

export const HighlightingTextarea = ({ value, onValueChange, className, ...props }: HighlightingTextareaProps) => {
  const [text, setText] = useState(value);
  const backdropRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setText(value);
  }, [value]);

  const handleScroll = useCallback(() => {
    if (backdropRef.current && textareaRef.current) {
      backdropRef.current.scrollTop = textareaRef.current.scrollTop;
      backdropRef.current.scrollLeft = textareaRef.current.scrollLeft;
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
          "absolute inset-0 z-0 overflow-auto whitespace-pre-wrap break-words p-3 text-base pointer-events-none",
          "font-code min-h-[300px] text-base",
          className
        )}
        dangerouslySetInnerHTML={{ __html: highlightedText + '\n' }}
      />
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleChange}
        onScroll={handleScroll}
        className={cn(
          'absolute inset-0 z-10 block h-full w-full resize-none overflow-auto whitespace-pre-wrap break-words bg-transparent p-3 text-transparent caret-white',
          'font-code min-h-[300px] text-base',
           "flex min-h-[80px] w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
           className
        )}
        spellCheck="false"
        {...props}
      />
    </div>
  );
};
