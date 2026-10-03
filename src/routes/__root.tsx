import { createRootRoute, Outlet } from "@tanstack/react-router"

export const Route = createRootRoute({
  component: () => (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8 sm:px-8">
      <header className="flex items-baseline justify-between pb-4">
        <span className="text-2xl font-bold tracking-tight text-fg">
          why<span className="text-accent">dou</span>
        </span>
        <span className="text-xs tracking-widest text-sub uppercase">der · die · das</span>
      </header>
      <main className="flex flex-1 flex-col justify-center py-12">
        <Outlet />
      </main>
      <footer className="flex flex-col items-center gap-4 text-xs text-sub">
        <p>
          <kbd className="rounded bg-sub/30 px-1.5 py-0.5 text-bg-deep">tab</kbd> next blank ·{" "}
          <kbd className="rounded bg-sub/30 px-1.5 py-0.5 text-bg-deep">enter</kbd> check
        </p>
        <p>
          Texts: Brüder Grimm, <i className="font-serif text-sm">Kinder- und Hausmärchen</i>, public domain.
        </p>
      </footer>
    </div>
  ),
})
