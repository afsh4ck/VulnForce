
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

type Command = 'h1' | 'h2' | 'h3' | 'pre' | 'ul' | 'ol';

interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (command: Command) => void;
  triggerRef: HTMLElement | null;
}

export const CommandMenu = ({ open, onOpenChange, onSelect, triggerRef }: CommandMenuProps) => {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <div ref={triggerRef} />
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" side="bottom" align="start">
        <Command>
          <CommandInput placeholder="Search commands..." />
          <CommandList>
            <CommandEmpty>No commands found.</CommandEmpty>
            <CommandGroup heading="Elements">
              <CommandItem onSelect={() => onSelect('h1')}>
                <Heading1 className="mr-2 h-4 w-4" />
                <span>Heading 1</span>
              </CommandItem>
              <CommandItem onSelect={() => onSelect('h2')}>
                <Heading2 className="mr-2 h-4 w-4" />
                <span>Heading 2</span>
              </CommandItem>
              <CommandItem onSelect={() => onSelect('h3')}>
                <Heading3 className="mr-2 h-4 w-4" />
                <span>Heading 3</span>
              </CommandItem>
              <CommandItem onSelect={() => onSelect('pre')}>
                <Code className="mr-2 h-4 w-4" />
                <span>Code Block</span>
              </CommandItem>
              <CommandItem onSelect={() => onSelect('ul')}>
                <List className="mr-2 h-4 w-4" />
                <span>Bulleted List</span>
              </CommandItem>
              <CommandItem onSelect={() => onSelect('ol')}>
                <ListOrdered className="mr-2 h-4 w-4" />
                <span>Numbered List</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
