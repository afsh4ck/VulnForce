

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
import { resolveVariables, type VariableContext } from '@/lib/markdown-utils';

export const MarkdownPreview = ({ content, getImage, isReport, variables }: { content: string, getImage?: (id: string) => ImageAsset | undefined, isReport?: boolean, variables?: VariableContext }) => {
    const resolvedContent = variables ? resolveVariables(content, variables) : content;
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

        const getSeverityVariant = (severity: string): 'critical' | 'high' | 'medium' | 'low' | 'informational' => {
                switch (severity) {
                    case 'Critical': return 'critical';
                    case 'High': return 'high';
                    case 'Medium': return 'medium';
                    case 'Low': return 'low';
                    default: return 'informational';
                }
        };

    // Garantiza IDs únicos por instancia de MarkdownPreview. Si dos headings
    // colisionan (p.ej. "Recommendations" en varias vulnerabilidades) añadimos
    // un sufijo incremental. Esto es la única forma fiable de evitar que el
    // scrollspy ilumine varios items del TOC a la vez. El Map se reinicia
    // en cada render para que las IDs sean estables y consistentes.
    const seenIds = new Map<string, number>();
    const allocateUniqueId = (base: string): string => {
      const used = seenIds.get(base);
      if (used === undefined) {
        seenIds.set(base, 0);
        return base;
      }
      const next = used + 1;
      seenIds.set(base, next);
      return `${base}-${next}`;
    };

    const CustomHeading = ({ level, children, ...props }: { level: number, children: React.ReactNode, [key: string]: any }) => {
        const textContent = getTextFromChildren(children);

        const match = textContent.match(/(.*) {#(.*)}/);
        const rawText = stripMarkdownText(match ? match[1].trim() : textContent.trim());
        const baseId = match ? match[2].trim() : (rawText.trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') || `section-${Math.random().toString(36).substr(2, 9)}`);
        const id = allocateUniqueId(baseId);

        const severityRegex = /\[SEVERITY:(.*?),CVSS:(.*?)\]/;
        const severityMatch = rawText.match(severityRegex);

        if (level === 2 && isReport && severityMatch) {
            const title = rawText.replace(severityRegex, '').trim();
            const severity = severityMatch[1];
            const cvss = severityMatch[2];
            return (
            <div>
                <div className="flex flex-wrap justify-between items-center gap-3 mb-2">
                  <h2
                    {...props}
                    id={id}
                    data-severity={severity}
                    className={cn(
                      "m-0 text-2xl font-semibold border-b-0 pb-0 font-headline",
                      isReport && "mt-12",
                    )}
                  >
                    {renderTodoText(title)}
                  </h2>
                  <Badge variant={getSeverityVariant(severity)} className="text-sm px-3 py-1 shrink-0">{severity}</Badge>
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
        <div className="prose prose-slate dark:prose-invert max-w-none w-full break-words">
            <ReactMarkdown remarkPlugins={[remarkGfm]} urlTransform={(url) => url} components={{
                h1: ({node, children, ...props}) => <CustomHeading level={1} {...props}>{children as any}</CustomHeading>,
                h2: ({node, children, ...props}) => <CustomHeading level={2} {...props}>{children as any}</CustomHeading>,
                h3: ({node, children, ...props}) => <CustomHeading level={3} {...props}>{children as any}</CustomHeading>,
                h4: ({node, children, ...props}) => <CustomHeading level={4} {...props}>{children as any}</CustomHeading>,
                p: ({node, children, ...props}) => {
                    const text = getTextFromChildren(children);
                    const isTodo = /\b(TODO|TO DO)\b/.test(text);
                    const el = <p {...props}>{renderTodoNodes(children)}</p>;
                    if (isTodo) {
                        return (
                            <div className="todo-block group/todo relative">
                                {el}
                            </div>
                        );
                    }
                    return el;
                },
                li: ({node, children, ...props}) => {
                    const text = getTextFromChildren(children);
                    const isTodo = /\b(TODO|TO DO)\b/.test(text);
                    const el = <li {...props}>{renderTodoNodes(children)}</li>;
                    if (isTodo) {
                        return (
                            <div className="todo-block group/todo relative">
                                {el}
                            </div>
                        );
                    }
                    return el;
                },
                td: ({node, children, ...props}) => <td {...props}>{renderTodoNodes(children)}</td>,
                th: ({node, children, ...props}) => <th {...props}>{renderTodoNodes(children)}</th>,
                blockquote: ({node, children, ...props}) => {
                    const text = getTextFromChildren(children);
                    const isTodo = /\b(TODO|TO DO)\b/.test(text);
                    const el = <blockquote {...props}>{renderTodoNodes(children)}</blockquote>;
                    if (isTodo) {
                        return (
                            <div className="todo-block group/todo relative">
                                {el}
                            </div>
                        );
                    }
                    return el;
                },
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
                // react-markdown v9 removed the `inline` prop. A fenced block is
                // identified by a language- className or multiline content;
                // everything else is inline code.
                code: (mdProps: any) => {
                    const { className, children, node, ...props } = mdProps;
                    const raw = String(children ?? '');
                    const isBlock = /language-/.test(className || '') || raw.includes('\n');
                    if (!isBlock) return <code className={className} {...props}>{renderTodoNodes(children)}</code>;
                    return <CodeBlock initialLanguage={(className || '').replace('language-', '') || 'text'} code={raw.replace(/\n$/, '')} />;
                },
                // Unwrap the <pre> that react-markdown puts around fenced code so
                // the block-level CodeBlock is not nested inside <pre>.
                pre: ({children}: any) => <>{children}</>,
                img: ({node, ...props}) => <CustomImage {...props} />
            }}>
                {resolvedContent}
            </ReactMarkdown>
        </div>
    );
};
