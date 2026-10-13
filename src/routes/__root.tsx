import { createRootRoute, Outlet } from "@tanstack/react-router"

import { AiStatus } from "@/components/ai-status"
import { ThemeSwitch } from "@/components/theme-switch"

export const Route = createRootRoute({
  component: () => (
    <>
      <div aria-hidden className="flex h-2 w-full">
        <div className="flex-1 bg-black" />
        <div className="flex-1 bg-[#dd0000]" />
        <div className="flex-1 bg-[#ffce00]" />
      </div>
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8 sm:px-8">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b-4 border-double border-sub/40 pb-4">
          <span className="font-display text-4xl leading-none font-semibold text-fg">
            why<span className="text-rot">dou</span>
          </span>
          <div className="flex items-center gap-2">
            <AiStatus />
            <ThemeSwitch />
          </div>
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
    </>
  ),
})
