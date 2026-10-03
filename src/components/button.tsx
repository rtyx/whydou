import { cva, type VariantProps } from "class-variance-authority"
import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

const button = cva(
  "cursor-pointer rounded px-4 py-2 font-mono text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-40",
  {
    variants: {
      variant: {
        primary: "bg-accent font-medium text-bg hover:bg-fg disabled:hover:bg-accent",
        outline: "text-sub hover:text-fg",
        ghostAccent: "text-accent hover:text-fg disabled:hover:text-accent",
      },
    },
    defaultVariants: { variant: "primary" },
  },
)

export function Button({ className, variant, ...props }: ComponentProps<"button"> & VariantProps<typeof button>) {
  return <button {...props} className={cn(button({ variant }), className)} />
}
