export type Theme = "system" | "light" | "dark"

export const THEMES: Theme[] = ["system", "light", "dark"]

const KEY = "whydou-theme"

export function getTheme(): Theme {
  try {
    const stored = localStorage.getItem(KEY)
    return THEMES.includes(stored as Theme) ? (stored as Theme) : "system"
  } catch {
    return "system"
  }
}

export function applyTheme(theme: Theme) {
  if (theme === "system") document.documentElement.removeAttribute("data-theme")
  else document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem(KEY, theme)
  } catch {
    // Storage can be blocked; the choice then lasts for this visit only.
  }
}
