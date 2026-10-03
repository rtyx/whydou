import { useState } from "react"

import { applyTheme, getTheme, THEMES, type Theme } from "@/lib/theme"
import { cn } from "@/lib/utils"

export function ThemeSwitch() {
  const [theme, setTheme] = useState<Theme>(getTheme)

  const choose = (next: Theme) => {
    setTheme(next)
    applyTheme(next)
  }

  return (
    <div role="group" aria-label="Theme" className="flex gap-1 rounded-lg bg-bg-deep p-1 text-xs">
      {THEMES.map((name) => (
        <button
          key={name}
          type="button"
          aria-pressed={theme === name}
          onClick={() => choose(name)}
          className={cn(
            "cursor-pointer rounded px-2.5 py-1 transition-colors focus-visible:outline-2 focus-visible:outline-accent",
            theme === name ? "text-accent" : "text-sub hover:text-fg",
          )}
        >
          {name}
        </button>
      ))}
    </div>
  )
}
