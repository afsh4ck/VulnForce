import React from 'react';
import { Award, FileText, Globe, Network, Scan, Smartphone, Wifi } from '@/components/icons';
import { cn } from '@/lib/utils';

export const projectIconOptions = [
  { value: 'FileText', label: 'FileText', Icon: FileText },
  { value: 'Scan', label: 'Scan', Icon: Scan },
  { value: 'Globe', label: 'Globe', Icon: Globe },
  { value: 'Network', label: 'Network', Icon: Network },
  { value: 'Smartphone', label: 'Smartphone', Icon: Smartphone },
  { value: 'Wifi', label: 'Wifi', Icon: Wifi },
  { value: 'Award', label: 'Award', Icon: Award },
];

export const projectIconComponents = Object.fromEntries(
  projectIconOptions.map((option) => [option.value, option.Icon])
) as Record<string, React.ElementType>;

export function ProjectIcon({ name, className }: { name?: string; className?: string }) {
  const Icon = projectIconComponents[name || ''] || FileText;
  return <Icon className={cn('h-4 w-4', className)} weight="duotone" />;
}

export function ProjectIconSelectItem({ value, label }: { value: string; label: string }) {
  return (
    <span className="flex items-center gap-2">
      <ProjectIcon name={value} className="h-4 w-4 text-muted-foreground" />
      <span>{label}</span>
    </span>
  );
}
