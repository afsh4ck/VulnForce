
"use client"

import * as React from "react"
import {
  type ImperativePanelGroupHandle,
  PanelGroup,
  Panel as ResizablePrimitivePanel,
  PanelResizeHandle,
} from "react-resizable-panels"

import { cn } from "@/lib/utils"

const ResizablePanelGroup = React.forwardRef<
  ImperativePanelGroupHandle,
  React.ComponentProps<typeof PanelGroup>
>(({ className, ...props }, ref) => (
    <PanelGroup
      ref={ref}
      className={cn(
        "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
        className
      )}
      {...props}
    />
  )
)
ResizablePanelGroup.displayName = "ResizablePanelGroup"

const ResizablePanel = ResizablePrimitivePanel

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof PanelResizeHandle> & {
  withHandle?: boolean
}) => (
  <PanelResizeHandle
    className={cn(
      "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:translate-x-0",
      "transition-shadow duration-200",
      "[&[data-panel-group-direction=horizontal]]:hover:shadow-[0_0_2px_1px_hsl(var(--primary))]",
      "[&[data-panel-group-direction=horizontal]][data-resize-handle-state=drag]:shadow-[0_0_2px_1px_hsl(var(--primary))]",
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
      </div>
    )}
  </PanelResizeHandle>
)

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
