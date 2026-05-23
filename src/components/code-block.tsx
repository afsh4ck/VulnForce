
'use client';
import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { Button } from './ui/button';
import { Check, Copy, WrapText } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Combobox } from './ui/combobox';
import { useLanguage } from '@/context/language-context';

const languageOptions = [
    { value: 'text', label: 'Plain Text' },
    { value: 'bash', label: 'Bash' }, { value: 'c', label: 'C' }, { value: 'cpp', label: 'C++' }, { value: 'csharp', label: 'C#' }, { value: 'css', label: 'CSS' }, { value: 'diff', label: 'Diff' }, { value: 'go', label: 'Go' }, { value: 'graphql', label: 'GraphQL' }, { value: 'ini', label: 'INI' }, { value: 'java', label: 'Java' }, { value: 'javascript', label: 'JavaScript' }, { value: 'json', label: 'JSON' }, { value: 'kotlin', label: 'Kotlin' }, { value: 'less', label: 'Less' }, { value: 'lua', label: 'Lua' }, { value: 'makefile', label: 'Makefile' }, { value: 'markdown', label: 'Markdown' }, { value: 'objectivec', label: 'Objective-C' }, { value: 'perl', label: 'Perl' }, { value: 'php', label: 'PHP' }, { value: 'python', label: 'Python' }, { value: 'r', label: 'R' }, { value: 'ruby', label: 'Ruby' }, { value: 'rust', label: 'Rust' }, { value: 'scss', label: 'SCSS' }, { value: 'shell', label: 'Shell' }, { value: 'sql', label: 'SQL' }, { value: 'swift', label: 'Swift' }, { value: 'typescript', label: 'TypeScript' }, { value: 'vbnet', label: 'VB.Net' }, { value: 'wasm', label: 'WebAssembly' }, { value: 'xml', label: 'XML' }, { value: 'yaml', label: 'YAML' },
];

export const syntaxTheme = {
    'code[class*="language-"]': {
        color: 'hsl(var(--code-foreground))',
        background: 'transparent',
        fontFamily: 'var(--font-code, "Source Code Pro", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace)',
        direction: 'ltr',
        textAlign: 'left',
        whiteSpace: 'pre',
        wordSpacing: 'normal',
        wordBreak: 'normal',
        lineHeight: '1.65',
        MozTabSize: '2',
        OTabSize: '2',
        tabSize: '2',
        WebkitHyphens: 'none',
        MozHyphens: 'none',
        msHyphens: 'none',
        hyphens: 'none',
    },
    'pre[class*="language-"]': {
        color: 'hsl(var(--code-foreground))',
        background: 'transparent',
        fontFamily: 'var(--font-code, "Source Code Pro", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace)',
        direction: 'ltr',
        textAlign: 'left',
        whiteSpace: 'pre',
        wordSpacing: 'normal',
        wordBreak: 'normal',
        lineHeight: '1.65',
        MozTabSize: '2',
        OTabSize: '2',
        tabSize: '2',
        WebkitHyphens: 'none',
        MozHyphens: 'none',
        msHyphens: 'none',
        hyphens: 'none',
    },
    'code[class*="language-"]::-moz-selection': { background: 'hsl(var(--code-selection))' },
    'code[class*="language-"] *::-moz-selection': { background: 'hsl(var(--code-selection))' },
    'pre[class*="language-"] *::-moz-selection': { background: 'hsl(var(--code-selection))' },
    'code[class*="language-"]::selection': { background: 'hsl(var(--code-selection))' },
    'code[class*="language-"] *::selection': { background: 'hsl(var(--code-selection))' },
    'pre[class*="language-"] *::selection': { background: 'hsl(var(--code-selection))' },
    comment: { color: 'hsl(var(--code-comment))', fontStyle: 'italic' },
    prolog: { color: 'hsl(var(--code-comment))' },
    cdata: { color: 'hsl(var(--code-comment))' },
    doctype: { color: 'hsl(var(--code-comment))' },
    punctuation: { color: 'hsl(var(--code-punctuation))' },
    namespace: { opacity: 0.85 },
    property: { color: 'hsl(var(--code-attr))' },
    tag: { color: 'hsl(var(--code-tag))' },
    boolean: { color: 'hsl(var(--code-number))' },
    number: { color: 'hsl(var(--code-number))' },
    constant: { color: 'hsl(var(--code-number))' },
    symbol: { color: 'hsl(var(--code-number))' },
    deleted: { color: 'hsl(var(--code-tag))' },
    selector: { color: 'hsl(var(--code-function))' },
    'attr-name': { color: 'hsl(var(--code-attr))' },
    string: { color: 'hsl(var(--code-string))' },
    char: { color: 'hsl(var(--code-string))' },
    builtin: { color: 'hsl(var(--code-string))' },
    inserted: { color: 'hsl(var(--code-string))' },
    operator: { color: 'hsl(var(--code-operator))' },
    entity: { color: 'hsl(var(--code-operator))' },
    url: { color: 'hsl(var(--code-string))' },
    variable: { color: 'hsl(var(--code-foreground))' },
    atrule: { color: 'hsl(var(--code-keyword))' },
    keyword: { color: 'hsl(var(--code-keyword))' },
    function: { color: 'hsl(var(--code-function))' },
    'class-name': { color: 'hsl(var(--code-function))' },
    regex: { color: 'hsl(var(--code-regex))' },
    important: { color: 'hsl(var(--code-keyword))', fontWeight: 700 },
    bold: { fontWeight: 700 },
    italic: { fontStyle: 'italic' },
    '.language-bash .token.function': { color: 'hsl(var(--code-foreground))' },
    '.language-bash .token.parameter': { color: 'hsl(var(--code-attr))' },
    '.language-shell .token.function': { color: 'hsl(var(--code-foreground))' },
    '.language-shell .token.parameter': { color: 'hsl(var(--code-attr))' },
    '.language-json .token.property': { color: 'hsl(var(--code-attr))' },
    '.language-json .token.operator': { color: 'hsl(var(--code-punctuation))' },
    '.language-markdown .token.title': { color: 'hsl(var(--code-function))', fontWeight: 700 },
    '.language-markdown .token.code-snippet': { color: 'hsl(var(--code-string))' },
} as any;

export const CodeBlock = ({ initialLanguage, code }: { initialLanguage: string; code: string }) => {
    const { language: currentUiLang } = useLanguage();
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

    const t = {
        en: { search: "Search language..." },
        es: { search: "Buscar lenguaje..." }
    }
    
    // If the language is 'text' or not found, render a simple block
    if (language === 'text' || !languageOptions.some(opt => opt.value === language)) {
        return (
             <div className="relative group my-4 overflow-x-auto rounded-md border border-border" style={{ backgroundColor: 'hsl(var(--code-background))' }}>
                <div className="absolute top-2 right-2 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/20 hover:text-primary" onClick={handleCopy}>
                        {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                </div>
                <pre className="p-4 text-sm overflow-x-auto whitespace-pre" style={{ color: 'hsl(var(--code-foreground))' }}>{code}</pre>
            </div>
        )
    }

    return (
        <div className="relative group my-4 overflow-x-auto rounded-md border border-border" style={{ backgroundColor: 'hsl(var(--code-background))' }}>
             <div className="absolute top-2 right-2 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Combobox
                    options={languageOptions}
                    selectedValue={language}
                    onSelect={setLanguage}
                    placeholder={getLanguageLabel(language)}
                    searchPlaceholder={t[currentUiLang].search}
                />

                <Button variant="ghost" size="icon" className={cn("h-8 w-8", isWrapped ? "bg-primary text-black hover:bg-primary/90" : "hover:bg-primary/20 hover:text-primary")} onClick={() => setIsWrapped(!isWrapped)}>
                    <WrapText className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/20 hover:text-primary" onClick={handleCopy}>
                    {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
            </div>
            <SyntaxHighlighter
                language={language}
                style={syntaxTheme}
                customStyle={{
                    margin: 0,
                    padding: '1em',
                    backgroundColor: 'transparent',
                    color: 'hsl(var(--code-foreground))',
                    overflowX: isWrapped ? 'hidden' : 'auto',
                    whiteSpace: isWrapped ? 'pre-wrap' : 'pre',
                    width: isWrapped ? '100%' : 'max-content',
                    minWidth: '100%',
                }}
                codeTagProps={{
                    style: {
                       color: 'hsl(var(--code-foreground))',
                       whiteSpace: isWrapped ? 'pre-wrap' : 'pre',
                       wordWrap: isWrapped ? 'break-word' : 'normal',
                    }
                }}
                wrapLongLines={isWrapped}
            >
                {code}
            </SyntaxHighlighter>
        </div>
    );
};
