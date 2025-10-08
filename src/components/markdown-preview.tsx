'use client';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CustomParagraph = ({ children }: { children?: React.ReactNode }) => {
    if (React.Children.count(children) === 1) {
        const child = React.Children.toArray(children)[0];
        if (typeof child === 'string' && /\[TODO:?.*?\]/gi.test(child)) {
             const todoContent = child.replace(/\[|\]/g, '').replace('TODO', '').replace(':', '').trim();
            return (
                <p>
                    <span className="bg-red-500 text-white font-bold px-1 rounded-sm">
                        <strong className="text-red-200">TODO</strong>: {todoContent}
                    </span>
                </p>
            );
        }
    }
    return <p className="mb-4">{children}</p>;
};

const CustomListItem = ({ children }: { children?: React.ReactNode }) => {
     if (React.Children.count(children) === 1) {
        const child = React.Children.toArray(children)[0];
        if (typeof child === 'string' && /\[TODO:?.*?\]/gi.test(child)) {
             const todoContent = child.replace(/\[|\]/g, '').replace('TODO', '').replace(':', '').trim();
            return (
                <li>
                    <span className="bg-red-500 text-white font-bold px-1 rounded-sm">
                        <strong className="text-red-200">TODO</strong>: {todoContent}
                    </span>
                </li>
            );
        }
    }
    return <li>{children}</li>;
};


export const MarkdownPreview = ({ content }: { content: string }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: CustomParagraph,
        li: CustomListItem,
        h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-4 border-b pb-2 mt-12" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold mb-3 border-b pb-2 mt-8" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-xl font-semibold mb-3 mt-6" {...props} />,
        ul: ({ node, ...props }) => <ul className="list-disc pl-8 mb-4" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal pl-8 mb-4" {...props} />,
        blockquote: ({ node, ...props }) => <blockquote className="border-l-4 pl-4 italic text-muted-foreground my-4" {...props} />,
        table: ({ node, ...props }) => <table className="table-auto w-full my-4 border-collapse border border-border" {...props} />,
        thead: ({ node, ...props }) => <thead className="bg-muted" {...props} />,
        tbody: ({ node, ...props }) => <tbody {...props} />,
        tr: ({ node, ...props }) => <tr className="border-b border-border" {...props} />,
        th: ({ node, ...props }) => <th className="border border-border px-4 py-2 text-left font-semibold" {...props} />,
        td: ({ node, ...props }) => <td className="border border-border px-4 py-2" {...props} />,
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
      }}
    >
      {content}
    </ReactMarkdown>
  );
};
