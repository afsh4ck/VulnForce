
'use client';
import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from './ui/button';
import { Check, Copy, WrapText } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { cn } from '@/lib/utils';

const languageOptions = [
    { value: 'bash', label: 'Bash' }, { value: 'c', label: 'C' }, { value: 'cpp', label: 'C++' }, { value: 'csharp', label: 'C#' }, { value: 'css', label: 'CSS' }, { value: 'diff', label: 'Diff' }, { value: 'go', label: 'Go' }, { value: 'graphql', label: 'GraphQL' }, { value: 'ini', label: 'INI' }, { value: 'java', label: 'Java' }, { value: 'javascript', label: 'JavaScript' }, { value: 'json', label: 'JSON' }, { value: 'kotlin', label: 'Kotlin' }, { value: 'less', label: 'Less' }, { value: 'lua', label: 'Lua' }, { value: 'makefile', label: 'Makefile' }, { value: 'markdown', label: 'Markdown' }, { value: 'objectivec', label: 'Objective-C' }, { value: 'perl', label: 'Perl' }, { value: 'php', label: 'PHP' }, { value: 'python', label: 'Python' }, { value: 'r', label: 'R' }, { value: 'ruby', label: 'Ruby' }, { value: 'rust', label: 'Rust' }, { value: 'scss', label: 'SCSS' }, { value: 'shell', label: 'Shell' }, { value: 'sql', label: 'SQL' }, { value: 'swift', label: 'Swift' }, { value: 'typescript', label: 'TypeScript' }, { value: 'vbnet', label: 'VB.Net' }, { value: 'wasm', label: 'WebAssembly' }, { value: 'xml', label: 'XML' }, { value: 'yaml', label: 'YAML' },
];

export const CodeBlock = ({ initialLanguage, code }: { initialLanguage: string; code: string }) => {
    const [language, setLanguage] = useState(initialLanguage);
    const [isWrapped, setIsWrapped] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };
    
    const getLanguageLabel = (value: string) => {
        const option = languageOptions.find(opt => opt.value === value);
        return option ? option.label : value;
    }

    return (
        <div className="relative group my-4 rounded-md">
             <div className="absolute top-2 right-2 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                            {getLanguageLabel(language)}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="max-h-60 overflow-y-auto">
                        {languageOptions.map(opt => (
                            <DropdownMenuItem key={opt.value} onSelect={() => setLanguage(opt.value)}>
                                {opt.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsWrapped(!isWrapped)}>
                    <WrapText className={cn("h-4 w-4", isWrapped && "text-primary")} />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopy}>
                    {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
            </div>
            <SyntaxHighlighter
                language={language}
                style={vscDarkPlus}
                customStyle={{
                    margin: 0,
                    padding: '1em',
                    backgroundColor: '#0F172A',
                    borderRadius: '0.375rem',
                }}
                wrapLines={isWrapped}
                wrapLongLines={isWrapped}
            >
                {code}
            </SyntaxHighlighter>
        </div>
    );
};

