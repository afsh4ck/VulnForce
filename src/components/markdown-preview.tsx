'use client';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';


const highlightTodos = (text: string) => {
    if (typeof text !== 'string') return text;
    
    const todoRegex = /\[TODO:?.*?\]/gi;
    const parts = text.split(todoRegex);
    let lastIndex = 0;

    const highlightedParts = text.match(todoRegex);

    return parts.flatMap((part, index) => {
        const result = [part];
        if (highlightedParts && index < highlightedParts.length) {
            const todoMatch = highlightedParts[index];
            const todoContent = todoMatch.substring(1, todoMatch.length - 1); // remove brackets
            const todoParts = todoContent.split(/^(TODO:?)/i);
            
            result.push(
                <span key={`todo-${index}`} className="bg-red-500/20 px-1 py-0.5 rounded-sm">
                    <strong className="font-bold text-red-500">{todoParts[1]}</strong>
                    <span className="text-red-400">{todoParts[2]}</span>
                </span>
            );
        }
        return result;
    });
};


const renderWithTodos = (Component: React.ElementType) => {
    return ({ node, children, ...props }: any) => {
        const newChildren = React.Children.map(children, child => {
            if (typeof child === 'string') {
                const todoRegex = /\[TODO:?.*?\]/gi;
                if (todoRegex.test(child)) {
                    return highlightTodos(child);
                }
            }
             if (React.isValidElement(child) && child.props.children && typeof child.props.children === 'string') {
                 if (/\[TODO:?.*?\]/gi.test(child.props.children)) {
                    return React.cloneElement(child, {
                        children: highlightTodos(child.props.children)
                    });
                }
            }
            return child;
        });
        return <Component {...props}>{newChildren}</Component>;
    };
};

const CustomTableCell = ({ children, ...props }: any) => {
    const newChildren = React.Children.map(children, child => {
        if (typeof child === 'string') {
            return highlightTodos(child);
        }
        if (React.isValidElement(child) && child.props.children && typeof child.props.children === 'string') {
            return React.cloneElement(child, {
                children: highlightTodos(child.props.children)
            });
        }
        return child;
    });
    return <td className="border border-border px-4 py-2" {...props}>{newChildren}</td>;
};


export const MarkdownPreview = ({ content }: { content: string }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-4 border-b pb-2 mt-12" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold mb-3 border-b pb-2 mt-12" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-xl font-semibold mb-3 mt-8" {...props} />,
        p: renderWithTodos('p'),
        li: renderWithTodos('li'),
        table: ({ node, ...props }) => <table className="table-auto w-full my-4 border-collapse border border-border" {...props} />,
        thead: ({ node, ...props }) => <thead className="bg-muted" {...props} />,
        tbody: ({ node, ...props }) => <tbody {...props} />,
        tr: ({ node, ...props }) => <tr className="border-b border-border" {...props} />,
        th: ({ node, ...props }) => <th className="border border-border px-4 py-2 text-left font-semibold" {...props} />,
        td: CustomTableCell,
        code({ node, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          const codeContent = String(children).replace(/\n$/, '');
          const highlightedCode = highlightTodos(codeContent);

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
  );
};
