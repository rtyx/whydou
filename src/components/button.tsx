import { type VariantProps } from "class-variance-authority"
import type { ComponentProps } from "react"

import { button } from "@/components/button-styles"
import { cn } from "@/lib/utils"

export function Button({ className, variant, size, ...props }: ComponentProps<"button"> & VariantProps<typeof button>) {
  return <button {...props} className={cn(button({ variant, size }), className)} />
}
