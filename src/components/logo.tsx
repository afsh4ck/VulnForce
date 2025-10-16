
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
      <div className={cn("flex items-center justify-center")}>
        <ShieldHalf className={cn(
          "text-primary transition-all duration-300 ease-in-out flex-none shrink-0",
          isCollapsed ? "h-6 w-6" : "h-8 w-8"
        )} />
      </div>
      <span className={cn("whitespace-nowrap transition-opacity", isCollapsed ? "opacity-0 w-0" : "opacity-100")}>
        VulnForce
      </span>
    </div>
  );
}
