import { createRootRoute, Link, Outlet } from "@tanstack/react-router"

import { AppShell } from "@/components/layout/app-shell"
import { button } from "@/components/button-styles"

export const Route = createRootRoute({
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
  notFoundComponent: () => (
    <div className="flex flex-col items-start gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-muted">The page you were looking for does not exist.</p>
      <Link to="/" className={button({ variant: "outline" })}>
        Back to practice
      </Link>
    </div>
  ),
})
