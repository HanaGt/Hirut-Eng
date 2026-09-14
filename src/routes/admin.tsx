import { Outlet, createFileRoute, redirect, useRouterState } from '@tanstack/react-router'
import { AdminNav } from '../components/AdminNav'
import { getSession } from '../server/auth.functions'

function isLoginPath(path: string) {
  return path.replace(/\/$/, '') === '/admin/login'
}

export const Route = createFileRoute('/admin')({
  head: () => ({
    meta: [
      { title: 'Admin | Hirut Engineering' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const session = await getSession()
    if (isLoginPath(location.pathname)) {
      if (session) throw redirect({ to: '/admin' })
      return { session: null as { email: string } | null }
    }
    if (!session) {
      throw redirect({
        to: '/admin/login',
        search: { redirect: location.pathname.startsWith('/admin') ? location.pathname : '/admin' },
      })
    }
    return { session }
  },
  component: AdminLayout,
})

function AdminLayout() {
  const { session } = Route.useRouteContext()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  if (isLoginPath(pathname) || !session) return <Outlet />
  return (
    <div className="admin-app">
      <AdminNav email={session.email} />
      <div className="admin-main">
        <Outlet />
      </div>
    </div>
  )
}
