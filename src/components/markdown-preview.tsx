
'use client';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { ImageAsset } from '@/lib/types';
import { cn } from '@/lib/utils';

const highlightTodos = (text: string) => {
    if (typeof text !== 'string') return text;

    const todoRegex = /(\[TODO:?.*?\]|\bTODO\b)/gi;

    const parts = text.split(todoRegex);

    return parts.map((part, index) => {
        if (todoRegex.test(part)) {
            const isSimpleTodo = part === 'TODO';
            const highlighted = isSimpleTodo
                ? `<span class="bg-red-500 text-white font-bold px-1 rounded-sm">TODO</span>`
                : part.replace(/\[(TODO:?.*?)\]/i, `[<span class="bg-red-500 text-white font-bold px-0.5 rounded-sm">TODO</span>:${part.substring(part.indexOf(':') + 1, part.length -1)}]`);
            return <span key={index} dangerouslySetInnerHTML={{ __html: highlighted }} />;
        }
        return part;
    });
};


const renderWithTodos = (Component: React.ElementType, className?: string) => {
    const RenderComponent = ({ node, children, ...props }: any) => {
        const newChildren = React.Children.map(children, child => {
            if (typeof child === 'string') {
                return highlightTodos(child);
            }
            return child;
        });
        return <Component className={className} {...props}>{newChildren}</Component>;
    };
    RenderComponent.displayName = `renderWithTodos(${Component.displayName || Component.name || 'Component'})`;
    return RenderComponent;
};


export const MarkdownPreview = ({ content, getImage, isReport }: { content: string, getImage: (id: string) => ImageAsset | undefined, isReport?: boolean }) => {

  return (
    <div className="prose dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: renderWithTodos('h1', cn("text-3xl font-bold mb-4 border-b pb-2", isReport && "mt-12")),
          h2: renderWithTodos('h2', cn("text-2xl font-semibold mb-3 border-b pb-2", isReport && "mt-12")),
          h3: renderWithTodos('h3', cn("text-xl font-semibold mb-3", isReport && "mt-8")),
          p: renderWithTodos('p'),
          li: ({node, ...props}) => <li {...props} />, // Let default li handle children with highlightTodos
          table: ({ node, ...props }) => <table className="table-auto w-full my-4 border-collapse border border-border" {...props} />,
          thead: ({ node, ...props }) => <thead className="bg-muted" {...props} />,
          tbody: ({ node, ...props }) => <tbody {...props} />,
          tr: ({ node, ...props }) => <tr className="border-b border-border" {...props} />,
          th: renderWithTodos('th', "border border-border px-4 py-2 text-left font-semibold"),
          td: renderWithTodos('td', "border border-border px-4 py-2"),
          img: ({ node, ...props }) => {
              const url = props.src || '';
              if (url.startsWith('image://')) {
                  const imageId = url.substring('image://'.length);
                  const imageAsset = getImage(imageId);
                  if (imageAsset) {
                      // eslint-disable-next-line @next/next/no-img-element
                      return <img src={imageAsset.dataUrl} alt={props.alt || 'Pasted Image'} className="max-w-full h-auto rounded-md border" />;
                  }
                  return <div className="p-4 border border-dashed border-destructive rounded-md text-destructive bg-destructive/10">
                      <p className="font-semibold">Image not found</p>
                      <p className="text-xs">Reference: {imageId}</p>
                  </div>;
              }
              // eslint-disable-next-line @next/next/no-img-element
              return <img {...props} className="max-w-full h-auto rounded-md border" />;
          },
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const codeContent = String(children).replace(/\n$/, '');

            if (match) { // Code block with language
                return (
                    <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        wrapLines={true}
                        wrapLongLines={true}
                        customStyle={{
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-all',
                        }}
                        codeTagProps={{
                            style: { fontFamily: 'inherit' }
                        }}
                        {...props}
                    >
                        {codeContent}
                    </SyntaxHighlighter>
                );
            }
            
            // Inline code
            return (
              <code className="bg-muted text-muted-foreground font-code px-1 py-0.5 rounded-sm break-words" {...props}>
                {highlightTodos(codeContent)}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
