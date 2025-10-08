
'use client';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { ImageAsset } from '@/lib/types';


const highlightOnlyTodoWord = (text: string) => {
    if (typeof text !== 'string') return text;
    // Matches [TODO...] and the word TODO itself, case-sensitive
    const todoRegex = /(\[TODO:?.*?\])/g;

    let lastIndex = 0;
    const result: (string | JSX.Element)[] = [];

    text.replace(todoRegex, (match, p1, offset) => {
        // Push the text before the match
        if (offset > lastIndex) {
            result.push(text.substring(lastIndex, offset));
        }

        // Highlight only the 'TODO' part
        const todoHighlight = <span key={`todo-${offset}`} className="bg-red-500 text-white font-bold px-1 rounded-sm">TODO</span>;

        // Reconstruct the bracketed part
        const bracketedContent = match.replace('TODO', '');
        
        result.push(<span key={offset}>[{todoHighlight}{bracketedContent.substring(4, bracketedContent.length - 1)}]</span>);
        
        lastIndex = offset + match.length;
        return match;
    });

    // Add the remaining text after the last match
    if (lastIndex < text.length) {
        result.push(text.substring(lastIndex));
    }
    
    // Handle standalone TODOs
    const standaloneTodoRegex = /(\bTODO\b)/g;
    const finalResult: (string | JSX.Element)[] = [];
    result.forEach((part, index) => {
        if (typeof part === 'string') {
            let lastStandaloneIndex = 0;
            const subParts: (string | JSX.Element)[] = [];
            part.replace(standaloneTodoRegex, (match, p1, offset) => {
                if (offset > lastStandaloneIndex) {
                    subParts.push(part.substring(lastStandaloneIndex, offset));
                }
                subParts.push(<span key={`standalone-${index}-${offset}`} className="bg-red-500 text-white font-bold px-0.5 rounded-sm">{match}</span>);
                lastStandaloneIndex = offset + match.length;
                return match;
            });
            if (lastStandaloneIndex < part.length) {
                subParts.push(part.substring(lastStandaloneIndex));
            }
            finalResult.push(...subParts);
        } else {
            finalResult.push(part);
        }
    });


    return finalResult.length > 0 ? finalResult : [text];
}


const renderWithTodos = (Component: React.ElementType) => {
    return ({ node, children, ...props }: any) => {
        const newChildren = React.Children.map(children, child => {
            if (typeof child === 'string') {
                return highlightOnlyTodoWord(child);
            }
             if (React.isValidElement(child) && child.props.children && typeof child.props.children === 'string') {
                return React.cloneElement(child, {
                    children: highlightOnlyTodoWord(child.props.children)
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
            return highlightOnlyTodoWord(child);
        }
        if (React.isValidElement(child) && child.props.children && typeof child.props.children === 'string') {
            return React.cloneElement(child, {
                children: highlightOnlyTodoWord(child.props.children)
            });
        }
        return child;
    });
    return <td className="border border-border px-4 py-2" {...props}>{newChildren}</td>;
};


export const MarkdownPreview = ({ content, getImage }: { content: string, getImage: (id: string) => ImageAsset | undefined }) => {

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-4 border-b pb-2 mt-12" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold mb-3 border-b pb-2 mt-12" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-xl font-semibold mb-3 mt-8" {...props} />,
          p: renderWithTodos('p'),
          li: ({ node, ...props }) => <li className="prose-li:text-primary" {...props} />,
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
                      return <img src={imageAsset.dataUrl} alt={props.alt || 'Pasted Image'} className="max-w-full h-auto rounded-md border" />;
                  }
                  // Render a placeholder or an error indicator if the image is not found
                  return <div className="p-4 border border-dashed border-destructive rounded-md text-destructive bg-destructive/10">
                      <p className="font-semibold">Image not found</p>
                      <p className="text-xs">Reference: {imageId}</p>
                  </div>;
              }
              return <img {...props} className="max-w-full h-auto rounded-md border" />;
          },
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const codeContent = String(children).replace(/\n$/, '');
            const highlightedCode = highlightOnlyTodoWord(codeContent);

            return match ? (
              <SyntaxHighlighter
                style={vscDarkPlus as any}
                language={match[1]}
                PreTag="div"
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
