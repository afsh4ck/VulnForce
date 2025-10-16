"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  Text,
  Code,
  Minus,
  CheckSquare,
  Quote,
  ImageIcon,
  Link as LinkIcon,
  File as FileIcon,
  Table,
} from "lucide-react";
import React from "react";
import { ScrollArea } from "./ui/scroll-area";
import { useLanguage } from "@/context/language-context";

type BlockType =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "p"
  | "ul"
  | "ol"
  | "hr"
  | "blockquote"
  | "pre"
  | "table";

interface AddBlockMenuProps {
  children: React.ReactNode;
  onSelect: (type: BlockType) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddBlockMenu = ({ children, onSelect, open, onOpenChange }: AddBlockMenuProps) => {
  const { language } = useLanguage();

  const t = {
    en: {
      basic: "Basic Blocks",
      media: "Media & Embeds",
      paragraph: "Paragraph",
      h1: "Heading 1",
      h2: "Heading 2",
      h3: "Heading 3",
      h4: "Heading 4",
      bulleted: "Bulleted list",
      numbered: "Numbered list",
      divider: "Divider",
      quote: "Quote",
      code: "Code block",
      table: "Table",
      image: "Image",
      file: "File",
      url: "URL",
    },
    es: {
      basic: "Bloques Básicos",
      media: "Multimedia e Incrustaciones",
      paragraph: "Párrafo",
      h1: "Título 1",
      h2: "Título 2",
      h3: "Título 3",
      h4: "Título 4",
      bulleted: "Lista de viñetas",
      numbered: "Lista numerada",
      divider: "Divisor",
      quote: "Cita",
      code: "Bloque de código",
      table: "Tabla",
      image: "Imagen",
      file: "Archivo",
      url: "URL",
    }
  }

  const blockOptions = {
    basic: [
      { type: "p", label: t[language].paragraph, icon: Text },
      { type: "h1", label: t[language].h1, icon: Heading1 },
      { type: "h2", label: t[language].h2, icon: Heading2 },
      { type: "h3", label: t[language].h3, icon: Heading3 },
      { type: "h4", label: t[language].h4, icon: Heading4 },
      { type: "ul", label: t[language].bulleted, icon: List },
      { type: "ol", label: t[language].numbered, icon: ListOrdered },
      { type: "hr", label: t[language].divider, icon: Minus },
      { type: "blockquote", label: t[language].quote, icon: Quote },
    ],
    advanced: [
      { type: "pre", label: t[language].code, icon: Code },
      { type: "table", label: t[language].table, icon: Table },
      { type: "image", label: t[language].image, icon: ImageIcon },
      { type: "file", label: t[language].file, icon: FileIcon },
      { type: "url", label: t[language].url, icon: LinkIcon },
    ],
  };


  const handleSelect = (type: BlockType | 'image' | 'file' | 'url') => {
    if (type === 'image' || type === 'file' || type === 'url') {
      // These will require special handling, like opening a dialog
      // For now, we can insert a placeholder
      onSelect('p');
    } else {
      onSelect(type);
    }
  }


  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <ScrollArea className="h-auto max-h-[250px]">
          <DropdownMenuLabel>{t[language].basic}</DropdownMenuLabel>
          <DropdownMenuGroup>
            {blockOptions.basic.map((item) => (
              <DropdownMenuItem key={item.type} onSelect={() => handleSelect(item.type as BlockType)}>
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>{t[language].media}</DropdownMenuLabel>
          <DropdownMenuGroup>
              {blockOptions.advanced.map((item) => (
                  <DropdownMenuItem key={item.type} onSelect={() => handleSelect(item.type as any)}>
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.label}</span>
                  </DropdownMenuItem>
              ))}
          </DropdownMenuGroup>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
