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
  Image as ImageIcon,
  Link as LinkIcon,
  File as FileIcon,
  Table,
} from "lucide-react";
import React from "react";

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

const blockOptions = {
  basic: [
    { type: "p", label: "Paragraph", icon: Text },
    { type: "h1", label: "Heading 1", icon: Heading1 },
    { type: "h2", label: "Heading 2", icon: Heading2 },
    { type: "h3", label: "Heading 3", icon: Heading3 },
    { type: "h4", label: "Heading 4", icon: Heading4 },
    { type: "ul", label: "Bulleted list", icon: List },
    { type: "ol", label: "Numbered list", icon: ListOrdered },
    { type: "hr", label: "Divider", icon: Minus },
    { type: "blockquote", label: "Quote", icon: Quote },
  ],
  advanced: [
    { type: "pre", label: "Code block", icon: Code },
    { type: "table", label: "Table", icon: Table },
    { type: "image", label: "Image", icon: ImageIcon },
    { type: "file", label: "File", icon: FileIcon },
    { type: "url", label: "URL", icon: LinkIcon },
  ],
};

export const AddBlockMenu = ({ children, onSelect, open, onOpenChange }: AddBlockMenuProps) => {

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
        <DropdownMenuLabel>Basic Blocks</DropdownMenuLabel>
        <DropdownMenuGroup>
          {blockOptions.basic.map((item) => (
            <DropdownMenuItem key={item.type} onSelect={() => handleSelect(item.type as BlockType)}>
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Media & Embeds</DropdownMenuLabel>
        <DropdownMenuGroup>
            {blockOptions.advanced.map((item) => (
                <DropdownMenuItem key={item.type} onSelect={() => handleSelect(item.type as any)}>
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.label}</span>
                </DropdownMenuItem>
            ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
