import { createRootRoute, Outlet } from "@tanstack/react-router"

export const Route = createRootRoute({
  component: () => (
    <div className="container mx-auto px-4">
      <h1 className="my-6 text-center text-6xl font-normal text-slate-800 dark:text-slate-100">why dou!</h1>
      <main>
        <Outlet />
      </main>
    </div>
  ),
})
