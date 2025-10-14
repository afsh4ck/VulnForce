
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
import { LinkPreviewCard } from './link-preview-card';

const highlightTodos = (text: string) => {
    if (typeof text !== 'string') return text;
    const todoRegex = /(\[TODO:?.*?\]|\bTODO\b)/gi;

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

const renderWithTodos = (Component: React.ElementType, className?: string, props: any = {}) => {
    const RenderComponent = ({ node, children, ...componentProps }: any) => {
        const newChildren = React.Children.map(children, child => {
            if (typeof child === 'string') {
                return <span dangerouslySetInnerHTML={{ __html: highlightTodos(child) }} />;
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

const addHeaderIds = (markdownContent: string) => {
    if (!markdownContent) return '';
    let idCounter = 0;
    const seen = new Set<string>();

    const generateId = (text: string) => {
        idCounter++;
        let baseSlug = text.toLowerCase().replace(/\[.*?\]/g, '').replace(/\s+/g, '-').replace(/[^\w-]+/g, '') || `section`;
        let finalSlug = `${baseSlug}-${idCounter}`;
        while (seen.has(finalSlug)) {
            idCounter++
            finalSlug = `${baseSlug}-${idCounter}`;
        }
        seen.add(finalSlug);
        return finalSlug;
    };

    return markdownContent.replace(/^(#{1,6}) (.*)/gm, (match, hashes, text) => {
        const existingIdMatch = text.match(/{#([^}]+)}/);
        if (existingIdMatch) {
            return match; 
        }
        const cleanText = text.replace(/\[.*?\]/g, '').trim();
        const id = generateId(cleanText);
        return `${hashes} ${text} {#${id}}`;
    });
};

export const MarkdownPreview = ({ content, getImage, isReport }: { content: string, getImage: (id: string) => ImageAsset | undefined, isReport?: boolean }) => {
    
    const processedContent = useMemo(() => addHeaderIds(content), [content]);
    
    const getSeverityVariant = (severity: string): 'destructive' | 'high' | 'medium' | 'low' | 'secondary' => {
        switch (severity) {
          case 'Critical': return 'destructive';
          case 'High': return 'high';
          case 'Medium': return 'medium';
          case 'Low': return 'low';
          default: return 'secondary';
        }
    };

    const CustomHeading = ({ level, children, ...props }: { level: number, children: React.ReactNode, [key: string]: any }) => {
        const childArray = React.Children.toArray(children);
        const textContent = childArray.map(child => {
            if (typeof child === 'string') return child;
            if (React.isValidElement(child) && typeof child.props.children === 'string') return child.props.children;
            return '';
        }).join('');
        
        const match = textContent.match(/(.*) {#(.*)}/);
        const rawText = match ? match[1].trim() : textContent.trim();
        const id = match ? match[2].trim() : undefined;

        const severityRegex = /\[SEVERITY:(.*?),CVSS:(.*?)\]/;
        const severityMatch = rawText.match(severityRegex);

        if (level === 2 && isReport && severityMatch) {
            const title = rawText.replace(severityRegex, '').trim();
            const severity = severityMatch[1];
            const cvss = severityMatch[2];
            return (
            <div id={id}>
                <div className="flex justify-between items-center mb-2">
                <h2 {...props} className={cn("text-2xl font-semibold border-b-0 pb-0", isReport && "mt-12 font-headline")}>
                    {renderWithTodos('span', '')({ children: title })}
                </h2>
                <Badge variant={getSeverityVariant(severity)} className="text-base px-3 py-1">{severity}</Badge>
                </div>
                <p className="font-code text-sm text-muted-foreground mt-0 mb-6">CVSS: {cvss}</p>
                <Separator className="my-6" />
            </div>
            );
        }
        
        const Tag = `h${level}` as keyof JSX.IntrinsicElements;
        const classNames: Record<number, string> = {
            1: cn("font-headline text-3xl font-bold mb-4 border-b-2 border-primary pb-2", isReport && "mt-12"),
            2: cn("text-2xl font-semibold mb-3 border-b pb-2", isReport && "mt-12 font-headline"),
            3: cn("text-xl font-semibold mb-3 mt-8", isReport && "font-headline"),
            4: cn("text-lg font-semibold mb-2 mt-6", isReport && "font-headline"),
        };

        return (
            <Tag id={id} {...props} className={classNames[level] || ''}>
              {renderWithTodos('span', '')({ children: rawText })}
            </Tag>
        );
    };

    const codeBlockStyle = {
      ...vscDarkPlus,
      'pre[class*="language-"]': {
        ...vscDarkPlus['pre[class*="language-"]'],
        backgroundColor: '#0F172A',
        padding: '1em',
        margin: '0',
        overflowX: 'auto',
        width: '100%',
      },
    };

    return (
        <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    h1: (props) => <CustomHeading level={1} {...props} />,
                    h2: (props) => <CustomHeading level={2} {...props} />,
                    h3: (props) => <CustomHeading level={3} {...props} />,
                    h4: (props) => <CustomHeading level={4} {...props} />,
                    p: ({ node, children, ...props }) => {
                        const isLinkOnly = 
                            node &&
                            node.children.length === 1 &&
                            node.children[0].type === 'element' &&
                            node.children[0].tagName === 'a' &&
                            node.children[0].children.length === 1 &&
                            node.children[0].children[0].type === 'text' &&
                            node.children[0].children[0].value === node.children[0].properties?.href;
                        
                        if (isReport && isLinkOnly) {
                            const href = node.children[0].properties?.href as string;
                            return <LinkPreviewCard href={href} />;
                        }
                        
                        return <p {...props}>{children}</p>;
                    },
                    a: ({ node, children, ...props }) => {
                        return <a {...props} className="text-primary hover:underline">{children}</a>
                    },
                    li: ({ node, children, ...props }: any) => (
                        <li {...props}>{React.Children.map(children, child => {
                            if (typeof child === 'string') {
                                return <span dangerouslySetInnerHTML={{ __html: highlightTodos(child) }} />;
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
                    hr: () => isReport ? null : <hr className="my-8" />,
                    code({ node, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        const codeContent = String(children).replace(/\n$/, '');
                        
                        if (match) { // Code block with language
                            return (
                                <div className="w-full overflow-x-auto my-4 rounded-md">
                                  <SyntaxHighlighter
                                      style={codeBlockStyle}
                                      language={match[1]}
                                      {...props}
                                  >
                                      {codeContent}
                                  </SyntaxHighlighter>
                                </div>
                            );
                        }
                        
                        // Inline code
                        return (
                        <code className="font-code px-1.5 py-1 rounded-md break-words" style={{backgroundColor: '#0F172A'}} {...props}>
                           {children}
                        </code>
                        );
                    },
                    img: ({ src, alt }) => {
                        if (src?.startsWith('image://')) {
                            const imageId = src.substring(8);
                            const image = getImage(imageId);
                            if (image) {
                                // eslint-disable-next-line @next/next/no-img-element
                                return <img src={image.dataUrl} alt={alt} className="max-w-full h-auto rounded-md border" />;
                            }
                        }
                        // eslint-disable-next-line @next/next/no-img-element
                        return <img src={src} alt={alt} />;
                    },
                }}
            >
                {processedContent}
            </ReactMarkdown>
        </div>
    );
};
