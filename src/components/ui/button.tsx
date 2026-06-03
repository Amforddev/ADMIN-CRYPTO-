import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-sm text-sm font-medium ring-offset-bg-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-lime text-bg-base hover:bg-lime-soft": variant === "default",
            "bg-bad text-white hover:bg-bad/90": variant === "destructive",
            "border border-rule bg-transparent hover:bg-bg-elev text-cream": variant === "outline",
            "bg-bg-elev text-cream hover:bg-bg-high": variant === "secondary",
            "hover:bg-bg-elev text-cream": variant === "ghost",
            "text-lime underline-offset-4 hover:underline": variant === "link",
            "h-8 px-4 py-2": size === "default", // 32px height
            "h-7 rounded-sm px-3": size === "sm",
            "h-9 rounded-md px-8": size === "lg",
            "h-8 w-8": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
