import { ShieldHalf } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from './ui/sidebar';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <div className={cn("flex items-center gap-2 font-headline text-xl font-bold tracking-tight", className)}>
      <ShieldHalf className="h-8 w-8 text-primary transition-all" />
      <span className={cn("transition-opacity", isCollapsed && "opacity-0 w-0")}>
        VulnForce
      </span>
    </div>
  );
}
