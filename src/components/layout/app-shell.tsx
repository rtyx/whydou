import { Link } from "@tanstack/react-router"
import type { ReactNode } from "react"

const link =
  "rounded-md px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:text-fg data-[status=active]:bg-surface-2 data-[status=active]:text-fg"

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
            <span aria-hidden className="flex gap-0.5">
              <span className="size-2 rounded-full bg-masc" />
              <span className="size-2 rounded-full bg-fem" />
              <span className="size-2 rounded-full bg-neut" />
            </span>
            whydou
          </Link>
          <nav className="flex gap-1" aria-label="Main">
            <Link to="/" className={link} activeOptions={{ exact: true }}>
              Practice
            </Link>
            <Link to="/grammar" className={link}>
              Grammar
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-12">{children}</main>
      <footer className="border-t border-border">
        <p className="mx-auto max-w-5xl px-4 py-5 text-xs text-muted sm:px-6">
          Built-in texts: Brothers Grimm, Kinder- und Hausmärchen (public domain).
        </p>
      </footer>
    </div>
  )
}
