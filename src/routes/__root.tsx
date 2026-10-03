import { createRootRoute, Outlet } from "@tanstack/react-router"

import { ThemeSwitch } from "@/components/theme-switch"

export const Route = createRootRoute({
  component: () => (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8 sm:px-8">
      <header className="flex items-center justify-between pb-4">
        <span className="text-2xl font-bold tracking-tight text-fg">
          why<span className="text-accent">dou</span>
        </span>
        <ThemeSwitch />
      </header>
      <main className="flex flex-1 flex-col justify-center py-12">
        <Outlet />
      </main>
      <footer className="flex flex-col items-center gap-4 text-xs text-sub">
        <p>
          <kbd className="rounded bg-sub/30 px-1.5 py-0.5 text-fg">tab</kbd> next blank ·{" "}
          <kbd className="rounded bg-sub/30 px-1.5 py-0.5 text-fg">enter</kbd> check
        </p>
      </footer>
    </div>
  ),
})
