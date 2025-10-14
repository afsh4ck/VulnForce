
'use client';

import React, { useState, useEffect } from 'react';
import { Skeleton } from './ui/skeleton';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LinkPreviewData {
    title: string;
    description: string;
    image: string;
    favicon: string;
    hostname: string;
}

export const LinkPreviewCard = ({ href }: { href: string }) => {
    const [data, setData] = useState<LinkPreviewData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPreview = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/link-preview?url=${encodeURIComponent(href)}`);
                if (response.ok) {
                    const previewData: LinkPreviewData = await response.json();
                    setData(previewData);
                } else {
                    setData(null);
                }
            } catch (error) {
                console.error("Failed to fetch link preview", error);
                setData(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPreview();
    }, [href]);
    
    if (isLoading) {
        return <Skeleton className="h-24 w-full" />;
    }

    if (!data || !data.title) {
        return (
            <a 
                href={href} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary hover:underline"
            >
                {href}
            </a>
        );
    }
    
    return (
        <a 
            href={href} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group no-underline"
        >
            <div className={cn(
                "my-4 flex items-center gap-4 rounded-lg border bg-card text-card-foreground shadow-sm transition-colors",
                "hover:border-primary"
            )}>
                <div className="flex flex-col p-4 space-y-1">
                    <p className="font-bold text-base line-clamp-1 group-hover:text-primary">{data.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{data.description}</p>
                    <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
                        {data.favicon ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={data.favicon} alt="" className="w-4 h-4" />
                        ) : (
                            <Globe className="w-4 h-4" />
                        )}
                        <span>{data.hostname}</span>
                    </div>
                </div>
            </div>
        </a>
    );
};
