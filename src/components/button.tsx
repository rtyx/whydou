import { cva, type VariantProps } from "class-variance-authority"
import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

const button = cva("rounded-lg px-5 py-2.5 text-center text-sm font-medium focus:ring-4 focus:outline-none", {
  variants: {
    variant: {
      primary:
        "bg-linear-to-br from-green-400 to-blue-600 text-white hover:bg-linear-to-bl focus:ring-green-200 dark:focus:ring-green-800",
      outline:
        "border border-slate-300 hover:bg-slate-100 focus:ring-slate-200 dark:border-slate-600 dark:hover:bg-slate-800 dark:focus:ring-slate-700",
    },
  },
  defaultVariants: { variant: "primary" },
})

export function Button({ className, variant, ...props }: ComponentProps<"button"> & VariantProps<typeof button>) {
  return <button {...props} className={cn(button({ variant }), className)} />
}
