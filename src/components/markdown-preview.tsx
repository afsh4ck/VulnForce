

"use client";
/* eslint-disable @next/next/no-img-element */
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ImageAsset } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { CodeBlock } from './code-block';
import { stripMarkdownText } from '@/lib/todo-utils';

export const MarkdownPreview = ({ content, getImage, isReport }: { content: string, getImage?: (id: string) => ImageAsset | undefined, isReport?: boolean }) => {
    const todoTextRegex = /\b(TODO|TO DO)\b/g;
    const SMALL_IMAGE_WIDTH = 360;

    const getTextFromChildren = (children: React.ReactNode): string => {
        let textContent = '';
        React.Children.forEach(children, (child) => {
            if (typeof child === 'string' || typeof child === 'number') {
                textContent += String(child);
            } else if (React.isValidElement(child)) {
                textContent += getTextFromChildren(child.props.children);
            }
        });
        return textContent;
    };

    const renderTodoText = (value: string) => {
        return value.split(todoTextRegex).map((part, index) => {
            if (part === 'TODO' || part === 'TO DO') {
                return (
                    <span key={`todo-${index}`} className="font-semibold text-red-500">
                        {isReport ? 'TO DO' : part}
                    </span>
                );
            }
            return part;
        });
    };

    const renderTodoNodes = (children: React.ReactNode): React.ReactNode => {
        return React.Children.map(children, (child) => {
            if (typeof child === 'string') {
                return renderTodoText(child);
            }

            if (React.isValidElement(child)) {
                const childProps = child.props as { children?: React.ReactNode };
                if (!childProps.children) return child;
                return React.cloneElement(child as React.ReactElement<any>, {
                    children: renderTodoNodes(childProps.children),
                });
            }

            return child;
        });
    };

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
        const textContent = getTextFromChildren(children);

        const match = textContent.match(/(.*) {#(.*)}/);
        const rawText = stripMarkdownText(match ? match[1].trim() : textContent.trim());
        const id = match ? match[2].trim() : (rawText.trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') || `section-${Math.random().toString(36).substr(2, 9)}`);

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
                    {renderTodoText(title)}
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
              {match ? renderTodoText(rawText) : renderTodoNodes(children)}
            </Tag>
        );
    };

    const CustomImage = ({ src, alt, className, ...props }: { src?: string, alt?: string, className?: string, [key: string]: any }) => {
        const [isSmall, setIsSmall] = React.useState(false);
        const rawSrc = src || '';
        const imageId = rawSrc.startsWith('image://') ? rawSrc.replace('image://', '') : '';
        const resolvedSrc = imageId ? getImage?.(imageId)?.dataUrl : rawSrc;

        if (!resolvedSrc) {
            return (
                <span className="my-4 block rounded-md border border-dashed p-3 text-sm text-muted-foreground">
                    {alt || 'Image not found'}
                </span>
            );
        }

        return (
            <img
                {...props}
                src={resolvedSrc}
                alt={alt || ''}
                loading="lazy"
                data-markdown-image
                onLoad={(event) => {
                    setIsSmall(event.currentTarget.naturalWidth > 0 && event.currentTarget.naturalWidth <= SMALL_IMAGE_WIDTH);
                }}
                className={cn(
                    'my-4 block h-auto max-w-full rounded-md border object-contain',
                    isSmall ? 'w-auto' : 'w-full',
                    className
                )}
            />
        );
    };

    return (
        <div className="prose dark:prose-invert w-full break-words">
            <ReactMarkdown remarkPlugins={[remarkGfm]} urlTransform={(url) => url} components={{
                h1: ({node, children, ...props}) => <CustomHeading level={1} {...props}>{children as any}</CustomHeading>,
                h2: ({node, children, ...props}) => <CustomHeading level={2} {...props}>{children as any}</CustomHeading>,
                h3: ({node, children, ...props}) => <CustomHeading level={3} {...props}>{children as any}</CustomHeading>,
                h4: ({node, children, ...props}) => <CustomHeading level={4} {...props}>{children as any}</CustomHeading>,
                p: ({node, children, ...props}) => <p {...props}>{renderTodoNodes(children)}</p>,
                li: ({node, children, ...props}) => <li {...props}>{renderTodoNodes(children)}</li>,
                td: ({node, children, ...props}) => <td {...props}>{renderTodoNodes(children)}</td>,
                th: ({node, children, ...props}) => <th {...props}>{renderTodoNodes(children)}</th>,
                blockquote: ({node, children, ...props}) => <blockquote {...props}>{renderTodoNodes(children)}</blockquote>,
                strong: ({node, children, ...props}) => <strong {...props}>{renderTodoNodes(children)}</strong>,
                em: ({node, children, ...props}) => <em {...props}>{renderTodoNodes(children)}</em>,
                a: ({node, children, className, ...props}) => {
                    const isTodoLink = /\b(TODO|TO DO)\b/.test(getTextFromChildren(children));
                    return (
                        <a {...props} className={cn(className, isTodoLink && '!text-red-500 font-semibold')}>
                            {renderTodoNodes(children)}
                        </a>
                    );
                },
                code: (mdProps: any) => {
                    const { inline, className, children, ...props } = mdProps;
                    if (inline) return <code className={className} {...props}>{renderTodoNodes(children)}</code>;
                    return <CodeBlock initialLanguage={(className || '').replace('language-', '')} code={String(children)} />;
                },
                img: ({node, ...props}) => <CustomImage {...props} />
            }}>
                {content}
            </ReactMarkdown>
        </div>
    );
};
