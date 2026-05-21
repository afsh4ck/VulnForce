"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "@/components/icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ComboboxOption {
  label: string;
  value: string;
  /** Optional extra terms to match against (severity, tags, etc.). */
  keywords?: string[];
}

interface ComboboxProps {
  options: ComboboxOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  openOnMount?: boolean;
  className?: string;
}

export function Combobox({
  options,
  selectedValue,
  onSelect,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  openOnMount,
  className,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (openOnMount) setOpen(true);
  }, [openOnMount]);

  // cmdk filtra por el `value` de cada CommandItem. Si pasamos el id del
  // registro (slug-like), no coincide con lo que el usuario escribe. Usamos el
  // label como término principal de búsqueda y guardamos el id real en un Map
  // para resolverlo al seleccionar.
  const valueById = React.useMemo(() => {
    const map = new Map<string, string>();
    options.forEach((option) => {
      const haystack = [option.label, ...(option.keywords ?? [])]
        .filter(Boolean)
        .join(' · ');
      map.set(haystack.toLowerCase(), option.value);
    });
    return map;
  }, [options]);

  const selectedLabel = options.find((option) => option.value === selectedValue)?.label;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-auto justify-between bg-transparent h-8 px-2 hover:bg-primary/10 hover:text-primary",
            className,
          )}
        >
          {selectedLabel || placeholder || "Select option..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Command shouldFilter>
          <CommandInput placeholder={searchPlaceholder || "Search..."} />
          <CommandList className="max-h-[260px] overflow-y-auto">
            <CommandEmpty>{emptyMessage || "No results found."}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const haystack = [option.label, ...(option.keywords ?? [])]
                  .filter(Boolean)
                  .join(' · ')
                  .toLowerCase();
                return (
                  <CommandItem
                    key={option.value}
                    value={haystack}
                    onSelect={(currentValue) => {
                      const resolved = valueById.get(currentValue) ?? '';
                      onSelect(resolved === selectedValue ? "" : resolved);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedValue === option.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {option.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
