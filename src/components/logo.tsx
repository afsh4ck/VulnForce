import Link from 'next/link';
import { ShieldPlus } from '@/components/icons';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  isCollapsed?: boolean;
  /** Render as a link to the dashboard. Defaults to true. */
  asLink?: boolean;
  href?: string;
}

export function Logo({ className, isCollapsed = false, asLink = true, href = '/dashboard' }: LogoProps) {
  const content = (
    <span className={cn('flex items-center gap-2 font-headline text-xl font-bold tracking-tight', className)}>
      <span className="flex items-center justify-center">
        <ShieldPlus
          weight="fill"
          className={cn(
            // Logo siempre amarillo fosforito original (identidad de marca)
            'flex-none shrink-0 text-[hsl(76_100%_50%)] transition-all duration-300 ease-in-out',
            isCollapsed ? 'h-6 w-6' : 'h-8 w-8',
          )}
        />
      </span>
      <span className={cn('whitespace-nowrap transition-opacity', isCollapsed ? 'opacity-0 w-0' : 'opacity-100')}>
        VulnForce
      </span>
    </span>
  );

  if (!asLink) return content;

  return (
    <Link
      href={href}
      aria-label="VulnForce"
      className="inline-flex w-full items-center rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--sidebar-ring))]"
    >
      {content}
    </Link>
  );
}
