import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        /* Severity-aware variants using CSS tokens defined in globals.css */
        critical: "border-transparent bg-[hsl(var(--severity-critical))] text-[hsl(var(--severity-critical-foreground))] hover:bg-[hsl(var(--severity-critical)/0.92)]",
        high: "border-transparent bg-[hsl(var(--severity-high))] text-[hsl(var(--severity-high-foreground))] hover:bg-[hsl(var(--severity-high)/0.92)]",
        medium: "border-transparent bg-[hsl(var(--severity-medium))] text-[hsl(var(--severity-medium-foreground))] hover:bg-[hsl(var(--severity-medium)/0.92)]",
        low: "border-transparent bg-[hsl(var(--severity-low))] text-[hsl(var(--severity-low-foreground))] hover:bg-[hsl(var(--severity-low)/0.92)]",
        informational: "border-transparent bg-[hsl(var(--severity-informational))] text-[hsl(var(--severity-informational-foreground))] hover:bg-[hsl(var(--severity-informational)/0.92)]",
        /* Project status semantic variants (use soft tint + ring for enterprise look) */
        'status-completed': "border-transparent bg-[hsl(var(--status-completed)/0.15)] text-[hsl(var(--status-completed))] ring-1 ring-inset ring-[hsl(var(--status-completed)/0.35)]",
        'status-in-progress': "border-transparent bg-[hsl(var(--status-in-progress)/0.15)] text-[hsl(var(--status-in-progress))] ring-1 ring-inset ring-[hsl(var(--status-in-progress)/0.35)]",
        'status-on-hold': "border-transparent bg-[hsl(var(--status-on-hold)/0.18)] text-[hsl(var(--status-on-hold))] ring-1 ring-inset ring-[hsl(var(--status-on-hold)/0.30)]",
        'status-blocked': "border-transparent bg-[hsl(var(--status-blocked)/0.15)] text-[hsl(var(--status-blocked))] ring-1 ring-inset ring-[hsl(var(--status-blocked)/0.35)]",
        'status-archived': "border-transparent bg-[hsl(var(--status-archived)/0.18)] text-[hsl(var(--status-archived))] ring-1 ring-inset ring-[hsl(var(--status-archived)/0.30)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
