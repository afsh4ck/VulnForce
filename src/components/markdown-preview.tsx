
'use client';
import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { ImageAsset } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

const highlightTodos = (text: string) => {
    if (typeof text !== 'string') return text;
    const todoRegex = /(\[TODO:?.*?\]|\bTODO\b)/gi;
    return text.split(todoRegex).map((part, index) => {
        if (todoRegex.test(part)) {
            const isSimpleTodo = part.toUpperCase() === 'TODO';
            const highlighted = isSimpleTodo
                ? `<span class="bg-red-500 text-white font-bold px-1 rounded-sm">TODO</span>`
                : part.replace(/\[(TODO:?.*?)\]/i, `[<span class="bg-red-500 text-white font-bold px-0.5 rounded-sm">TODO</span>:${part.substring(part.indexOf(':') + 1, part.length - 1)}]`);
            return <span key={index} dangerouslySetInnerHTML={{ __html: highlighted }} />;
        }
        return part;
    });
};

const renderWithTodos = (Component: React.ElementType, className?: string, props: any = {}) => {
    const RenderComponent = ({ node, children, ...componentProps }: any) => {
        const newChildren = React.Children.map(children, child => {
            if (typeof child === 'string') {
                return highlightTodos(child);
            }
            if (React.isValidElement(child) && (child.props.node?.tagName === 'code' || child.props.node?.tagName === 'pre')) {
                 return child;
            }
            return child;
        });

        const finalProps = { ...props, ...componentProps };
        
        return <Component className={className} {...finalProps}>{newChildren}</Component>;
    };
    RenderComponent.displayName = `renderWithTodos(${Component.displayName || Component.name || 'Component'})`;
    return RenderComponent;
};

// This function now just processes the markdown and adds IDs to headers.
const addHeaderIds = (markdownContent: string) => {
    if (!markdownContent) return '';
    let idCounter = 0;
    const seen = new Set<string>();
    const generateId = (text: string) => {
        idCounter++;
        let baseSlug = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') || `section-${idCounter}`;
        let finalSlug = baseSlug;
        let counter = 1;
        while (seen.has(finalSlug)) {
            finalSlug = `${baseSlug}-${counter}`;
            counter++;
        }
        seen.add(finalSlug);
        return finalSlug;
    };

    return markdownContent.replace(/^(#{1,6}) (.*)/gm, (match, hashes, text) => {
        const id = generateId(text);
        return `${hashes} ${text} {#${id}}`;
    });
};

export const MarkdownPreview = ({ content, getImage, isReport }: { content: string, getImage: (id: string) => ImageAsset | undefined, isReport?: boolean }) => {
    
    const processedContent = useMemo(() => addHeaderIds(content), [content]);

    const extractIdFromText = (text: string): [string, string] => {
        const match = text.match(/(.*) {#(.*)}/);
        if (match) {
            return [match[1], match[2]];
        }
        return [text, ''];
    }
    
    const getSeverityVariant = (severity: string): 'destructive' | 'high' | 'medium' | 'low' | 'secondary' => {
        switch (severity) {
          case 'Critical': return 'destructive';
          case 'High': return 'high';
          case 'Medium': return 'medium';
          case 'Low': return 'low';
          default: return 'secondary';
        }
    }

    return (
        <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    h1: ({ node, children, ...props }) => {
                        const [text, id] = extractIdFromText(String(children));
                        return <h1 id={id} {...props} className={cn("font-headline text-3xl font-bold mb-4 border-b-2 border-primary pb-2", isReport && "mt-12")}>{renderWithTodos('span', '')({children: text})}</h1>
                    },
                    h2: ({ node, children, ...props }) => {
                        const [text, id] = extractIdFromText(String(children));
                        // Special handling for finding titles in report view
                        if (isReport && /^\d\.\d+ /.test(text)) {
                            const findingTitle = text.replace(/^\d\.\d+ /, '');
                            const finding = { severity: 'High', cvss: 7.5 }; // DUMMY DATA, needs real data
                            return (
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <h2 id={id} {...props} className="font-headline text-2xl font-bold mt-8 border-none pb-0">{renderWithTodos('span', '')({children: findingTitle})}</h2>
                                        {finding && <Badge variant={getSeverityVariant(finding.severity)} className="text-base px-3 py-1">{finding.severity}</Badge>}
                                    </div>
                                    {finding && <p className="font-code text-sm text-muted-foreground my-0">CVSS: {finding.cvss.toFixed(1)}</p>}
                                </div>
                            );
                        }
                        return <h2 id={id} {...props} className={cn("text-2xl font-semibold mb-3 border-b pb-2", isReport && "mt-12")}>{renderWithTodos('span', '')({children: text})}</h2>
                    },
                    h3: ({ node, children, ...props }) => {
                        const [text, id] = extractIdFromText(String(children));
                        return <h3 id={id} {...props} className={cn("text-xl font-semibold mb-3", isReport && "mt-8")}>{renderWithTodos('span', '')({children: text})}</h3>
                    },
                    p: renderWithTodos('p'),
                    li: ({ node, children, ...props }: any) => (
                        <li {...props}>{React.Children.map(children, child => {
                            if (typeof child === 'string') {
                                return highlightTodos(child);
                            }
                            if (React.isValidElement(child) && child.props.node?.tagName === 'p') {
                            return <>{renderWithTodos('p', '')(child.props)}</>;
                            }
                            return child;
                        })}</li>
                    ),
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
                    hr: () => null, // Remove horizontal rules
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
                {processedContent}
            </ReactMarkdown>
        </div>
    );
};
