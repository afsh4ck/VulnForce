
'use client';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ImageAsset } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { LinkPreviewCard } from './link-preview-card';
import { CodeBlock } from './code-block';

export const MarkdownPreview = ({ content, getImage, isReport }: { content: string, getImage: (id: string) => ImageAsset | undefined, isReport?: boolean }) => {
    
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
        let textContent = '';
        React.Children.forEach(childArray, (child) => {
            if (typeof child === 'string') {
                textContent += child;
            } else if (React.isValidElement(child) && typeof child.props.children === 'string') {
                textContent += child.props.children;
            }
        });
        
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
                    {title}
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
              {rawText}
            </Tag>
        );
    };

    return (
        <div className="prose dark:prose-invert max-w-full break-words">
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
                    table: ({ node, ...props }) => <div className="overflow-x-auto"><table className="table-auto w-full my-4 border-collapse border border-border" {...props} /></div>,
                    thead: ({ node, ...props }) => <thead className="bg-muted" {...props} />,
                    tbody: ({ node, ...props }) => <tbody {...props} />,
                    tr: ({ node, ...props }) => <tr className="border-b border-border" {...props} />,
                    th: ({ node, ...props }) => <th className="border border-border px-4 py-2 text-left font-semibold" {...props} />,
                    td: ({ node, ...props }) => <td className="border border-border px-4 py-2" {...props} />,
                    hr: () => isReport ? null : <hr className="my-8" />,
                    code({ node, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        const codeContent = String(children).replace(/\n$/, '');
                        
                        if (match) {
                            return (
                               <div className="overflow-x-auto">
                                    <CodeBlock
                                        initialLanguage={match[1]}
                                        code={codeContent}
                                    />
                                </div>
                            );
                        }
                        
                        return (
                        <code className="font-code bg-muted text-muted-foreground px-1.5 py-1 rounded-md break-words" {...props}>
                           {children}
                        </code>
                        );
                    },
                    img: ({node, src, alt, ...props}) => {
                        let finalSrc = src;
                        if (src?.startsWith('image://')) {
                            const imageId = src.substring('image://'.length);
                            const image = getImage(imageId);
                            if (image) {
                                finalSrc = image.dataUrl;
                            } else {
                                return null; // Or a placeholder for broken images
                            }
                        }
                        // eslint-disable-next-line @next/next/no-img-element
                        return <img src={finalSrc} alt={alt} {...props} className="max-w-full h-auto rounded-md border" />;
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};
