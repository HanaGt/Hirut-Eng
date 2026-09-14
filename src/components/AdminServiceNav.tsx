import { Link, useRouterState } from '@tanstack/react-router'

const ITEMS = [
  { to: '/admin/services' as const, label: 'Construction', end: true },
  { to: '/admin/services/consultancy' as const, label: 'Consultancy' },
  { to: '/admin/services/after-sales' as const, label: 'After-sales' },
]

function norm(path: string) {
  if (path === '/') return '/'
  return path.replace(/\/$/, '') || '/'
}

export function AdminServiceNav() {
  const current = norm(useRouterState({ select: (s) => s.location.pathname }))
  return (
    <nav className="admin-subnav" aria-label="Service sections">
      {ITEMS.map((item) => {
        const active = item.end
          ? current === item.to
          : current === item.to || current.startsWith(`${item.to}/`)
        return (
          <Link key={item.to} to={item.to} className={active ? 'is-active' : undefined} aria-current={active ? 'page' : undefined}>
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
