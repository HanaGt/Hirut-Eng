import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    scrollRestorationBehavior: 'instant',
    /* Static site: keep preloaded route modules warm so a click does not
       wait on a refetch (that wait is what looks like a full reload). */
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 60_000,
    defaultStaleTime: 60_000,
    defaultPendingMs: 2000,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
