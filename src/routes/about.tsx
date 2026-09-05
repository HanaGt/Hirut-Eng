import { Outlet, createFileRoute, useRouterState } from '@tanstack/react-router'

import { aboutPathFromLocation, AboutNav } from '../components/AboutNav'

export const Route = createFileRoute('/about')({
  component: AboutLayout,
})

function AboutLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  return (
    <div className="about-shell">
      <AboutNav current={aboutPathFromLocation(pathname)} />
      <Outlet />
    </div>
  )
}
