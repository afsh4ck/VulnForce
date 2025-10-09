"use client"

import {
  PanelGroup,
  Panel as ResizablePrimitivePanel,
  PanelResizeHandle,
} from "react-resizable-panels"

import { cn } from "@/lib/utils"

const ResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof PanelGroup>) => (
  <PanelGroup
    className={cn(
      "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
      className
    )}
    {...props}
  />
)

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
      "relative flex w-2 items-center justify-center bg-transparent after:absolute after:h-full after:w-px after:bg-border after:content-[''] data-[panel-group-direction=vertical]:h-2 data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:h-px data-[panel-group-direction=vertical]:after:w-full",
      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1",
      "transition-colors hover:bg-primary/20",
      className
    )}
    {...props}
  />
)

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
