
"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from "@/components/ui/dropdown-menu";
import {
  Heading1,
  Heading2,
  Heading3,
  Trash2,
  Copy,
  Text,
  Code,
} from "lucide-react";
import React from "react";
import { useLanguage } from "@/context/language-context";
import type { ContentBlock } from "@/lib/types";

interface BlockOptionsMenuProps {
  children: React.ReactNode;
  onSelect: (action: 'turnInto' | 'delete' | 'duplicate' | 'split', value?: any) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  blockTag: ContentBlock['tag'];
}

export const BlockOptionsMenu = ({ children, onSelect, open, onOpenChange, blockTag }: BlockOptionsMenuProps) => {
  const { language } = useLanguage();

  const t = {
    en: {
      turnInto: "Turn into",
      delete: "Delete",
      duplicate: "Duplicate",
    },
    es: {
      turnInto: "Convertir en",
      delete: "Eliminar",
      duplicate: "Duplicar",
    }
  }

  const turnIntoOptions = [
    { type: "p", label: "Paragraph", icon: Text },
    { type: "h1", label: "Heading 1", icon: Heading1 },
    { type: "h2", label: "Heading 2", icon: Heading2 },
    { type: "h3", label: "Heading 3", icon: Heading3 },
  ];

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuRadioGroup value={blockTag} onValueChange={(value) => onSelect('turnInto', value)}>
            <DropdownMenuLabel>{t[language].turnInto}</DropdownMenuLabel>
            {turnIntoOptions.map((item) => (
            <DropdownMenuRadioItem key={item.type} value={item.type}>
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.label}</span>
            </DropdownMenuRadioItem>
            ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => onSelect('duplicate')}>
          <Copy className="mr-2 h-4 w-4" />
          <span>{t[language].duplicate}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onSelect('split')}>
          <Code className="mr-2 h-4 w-4" />
          <span>Split view</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onSelect('delete')} className="text-destructive focus:text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          <span>{t[language].delete}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
