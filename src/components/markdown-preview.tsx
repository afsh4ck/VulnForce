'use client';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const Todo = ({ children }: { children: React.ReactNode }) => {
    const text = React.Children.toArray(children).join('');
    const parts = text.split(/(\[?TODO:?.*?\]?)/gi);
    return (
      <>
        {parts.map((part, i) =>
          /\[?TODO:?.*?\]?/gi.test(part) ? (
            <span key={i} className="bg-red-500 text-white font-bold px-1 rounded-sm">
              {part}
            </span>
          ) : (
            <React.Fragment key={i}>{part}</React.Fragment>
          )
        )}
      </>
    );
};

export const MarkdownPreview = ({ content }: { content: string }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ node, ...props }) => <p className="mb-4" {...props} />,
        h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-4 border-b pb-2" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold mb-3 border-b pb-2" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-xl font-semibold mb-3" {...props} />,
        ul: ({ node, ...props }) => <ul className="list-disc pl-8 mb-4" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal pl-8 mb-4" {...props} />,
        li: ({ node, ...props }) => <li className="mb-1" {...props} />,
        blockquote: ({ node, ...props }) => <blockquote className="border-l-4 pl-4 italic text-muted-foreground my-4" {...props} />,
        code({ node, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
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
              {children}
            </code>
          );
        },
        text: ({children}) => <Todo>{children}</Todo>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
};
