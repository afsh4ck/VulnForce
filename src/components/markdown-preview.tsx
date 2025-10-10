
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

    const todoRegex = /(\[TODO:?.*?\]|\bTODO\b)/g;

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


const renderWithTodos = (Component: React.ElementType) => {
    return ({ node, children, ...props }: any) => {
        const newChildren = React.Children.map(children, child => {
            if (typeof child === 'string') {
                 return <span dangerouslySetInnerHTML={{ __html: highlightTodos(child) }} />;
            }
             if (React.isValidElement(child) && child.props.children && typeof child.props.children === 'string') {
                return React.cloneElement(child, {
                    children: <span dangerouslySetInnerHTML={{ __html: highlightTodos(child.props.children) }} />
                });
            }
            return child;
        });
        return <Component {...props}>{newChildren}</Component>;
    };
};

const CustomTableCell = ({ children, ...props }: any) => {
    const newChildren = React.Children.map(children, child => {
        if (typeof child === 'string') {
            return <span dangerouslySetInnerHTML={{ __html: highlightTodos(child) }} />;
        }
        if (React.isValidElement(child) && child.props.children && typeof child.props.children === 'string') {
            return React.cloneElement(child, {
                 children: <span dangerouslySetInnerHTML={{ __html: highlightTodos(child.props.children) }} />
            });
        }
        return child;
    });
    return <td className="border border-border px-4 py-2" {...props}>{newChildren}</td>;
};


export const MarkdownPreview = ({ content, getImage, isReport }: { content: string, getImage: (id: string) => ImageAsset | undefined, isReport?: boolean }) => {

  return (
    <div className="prose dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => <h1 className={cn("text-3xl font-bold mb-4 border-b pb-2", isReport && "mt-12")} {...props} />,
          h2: ({ node, ...props }) => <h2 className={cn("text-2xl font-semibold mb-3 border-b pb-2", isReport && "mt-12")} {...props} />,
          h3: ({ node, ...props }) => <h3 className={cn("text-xl font-semibold mb-3", isReport && "mt-8")} {...props} />,
          p: renderWithTodos('p'),
          li: renderWithTodos('li'),
          table: ({ node, ...props }) => <table className="table-auto w-full my-4 border-collapse border border-border" {...props} />,
          thead: ({ node, ...props }) => <thead className="bg-muted" {...props} />,
          tbody: ({ node, ...props }) => <tbody {...props} />,
          tr: ({ node, ...props }) => <tr className="border-b border-border" {...props} />,
          th: ({ node, ...props }) => <th className="border border-border px-4 py-2 text-left font-semibold" {...props} />,
          td: CustomTableCell,
          img: ({ node, ...props }) => {
              const url = props.src || '';
              if (url.startsWith('image://')) {
                  const imageId = url.substring('image://'.length);
                  const imageAsset = getImage(imageId);
                  if (imageAsset) {
                      // eslint-disable-next-line @next/next/no-img-element
                      return <img src={imageAsset.dataUrl} alt={props.alt || 'Pasted Image'} className="max-w-full h-auto rounded-md border" />;
                  }
                  // Render a placeholder or an error indicator if the image is not found
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
            const highlightedCode = <span dangerouslySetInnerHTML={{ __html: highlightTodos(codeContent) }} />;

            return match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                className="rounded-md p-4 bg-card"
                codeTagProps={{
                    style: {
                        fontFamily: 'inherit',
                    }
                }}
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className="bg-muted text-muted-foreground font-code px-1 py-0.5 rounded-sm" {...props}>
                {highlightedCode}
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
