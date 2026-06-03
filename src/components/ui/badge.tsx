import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info"
  className?: string
  children?: React.ReactNode
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-lime focus:ring-offset-2",
        {
          "border-transparent bg-bg-elev text-cream": variant === "default",
          "border-transparent bg-bg-high text-cream": variant === "secondary",
          "border-transparent bg-bad/20 text-bad": variant === "destructive",
          "border-transparent bg-good/20 text-good": variant === "success",
          "border-transparent bg-warn/20 text-warn": variant === "warning",
          "border-transparent bg-info/20 text-info": variant === "info",
          "text-stone border-rule": variant === "outline",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
