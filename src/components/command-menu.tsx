
'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Heading1, Heading2, Heading3, Code, List, ListOrdered } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useLanguage } from '@/context/language-context';

type Command = 'h1' | 'h2' | 'h3' | 'pre' | 'ul' | 'ol';

interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (command: Command) => void;
  triggerRef: HTMLElement | null;
}

export const CommandMenu = ({ open, onOpenChange, onSelect, triggerRef }: CommandMenuProps) => {
  const { language } = useLanguage();
  const virtualTriggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const virtualTrigger = virtualTriggerRef.current;
    if (!virtualTrigger || !triggerRef) return;

    const rect = triggerRef.getBoundingClientRect();
    virtualTrigger.style.top = `${rect.bottom}px`;
    virtualTrigger.style.left = `${rect.left}px`;
  }, [triggerRef, open]);

  const t = {
    en: {
      search: "Search commands...",
      empty: "No commands found.",
      elements: "Elements",
      h1: "Heading 1",
      h2: "Heading 2",
      h3: "Heading 3",
      code: "Code Block",
      bulleted: "Bulleted List",
      numbered: "Numbered List",
    },
    es: {
      search: "Buscar comandos...",
      empty: "No se encontraron comandos.",
      elements: "Elementos",
      h1: "Título 1",
      h2: "Título 2",
      h3: "Título 3",
      code: "Bloque de Código",
      bulleted: "Lista de Viñetas",
      numbered: "Lista Numerada",
    }
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <div ref={virtualTriggerRef} className="fixed h-1 w-1 pointer-events-none" />
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" side="bottom" align="start">
        <Command>
          <CommandInput placeholder={t[language].search} />
          <CommandList>
            <CommandEmpty>{t[language].empty}</CommandEmpty>
            <CommandGroup heading={t[language].elements}>
              <CommandItem onSelect={() => onSelect('h1')}>
                <Heading1 className="mr-2 h-4 w-4" />
                <span>{t[language].h1}</span>
              </CommandItem>
              <CommandItem onSelect={() => onSelect('h2')}>
                <Heading2 className="mr-2 h-4 w-4" />
                <span>{t[language].h2}</span>
              </CommandItem>
              <CommandItem onSelect={() => onSelect('h3')}>
                <Heading3 className="mr-2 h-4 w-4" />
                <span>{t[language].h3}</span>
              </CommandItem>
              <CommandItem onSelect={() => onSelect('pre')}>
                <Code className="mr-2 h-4 w-4" />
                <span>{t[language].code}</span>
              </CommandItem>
              <CommandItem onSelect={() => onSelect('ul')}>
                <List className="mr-2 h-4 w-4" />
                <span>{t[language].bulleted}</span>
              </CommandItem>
              <CommandItem onSelect={() => onSelect('ol')}>
                <ListOrdered className="mr-2 h-4 w-4" />
                <span>{t[language].numbered}</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
