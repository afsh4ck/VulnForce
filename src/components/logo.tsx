import { ShieldHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  isCollapsed?: boolean;
}

export function Logo({ className, isCollapsed = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2 font-headline text-lg font-bold tracking-tight", className)}>
      <ShieldHalf className="h-7 w-7 text-primary transition-all group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8" />
      <span className={cn("transition-opacity", isCollapsed && "opacity-0 w-0")}>
        VulnForce
      </span>
    </div>
  );
}
