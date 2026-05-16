

"use client";
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ImageAsset } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { CodeBlock } from './code-block';

export const MarkdownPreview = ({ content, getImage, isReport }: { content: string, getImage?: (id: string) => ImageAsset | undefined, isReport?: boolean }) => {

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
        let textContent = '';
        React.Children.forEach(children, (child) => {
            if (typeof child === 'string') {
                textContent += child;
            } else if (React.isValidElement(child) && typeof child.props.children === 'string') {
                textContent += child.props.children;
            }
        });

        const match = textContent.match(/(.*) {#(.*)}/);
        const rawText = match ? match[1].trim() : textContent.trim();
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
        <div className="prose dark:prose-invert w-full break-words">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                h1: ({node, children, ...props}) => <CustomHeading level={1} {...props}>{children as any}</CustomHeading>,
                h2: ({node, children, ...props}) => <CustomHeading level={2} {...props}>{children as any}</CustomHeading>,
                h3: ({node, children, ...props}) => <CustomHeading level={3} {...props}>{children as any}</CustomHeading>,
                h4: ({node, children, ...props}) => <CustomHeading level={4} {...props}>{children as any}</CustomHeading>,
                code: (mdProps: any) => {
                    const { inline, className, children, ...props } = mdProps;
                    if (inline) return <code className={className} {...props}>{children}</code>;
                    return <CodeBlock initialLanguage={(className || '').replace('language-', '')} code={String(children)} />;
                }
            }}>
                {content}
            </ReactMarkdown>
        </div>
    );
};
