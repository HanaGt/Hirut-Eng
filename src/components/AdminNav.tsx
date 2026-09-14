import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { logoutAdmin } from '../server/auth.functions'
import { HirutMark } from './Logo'

const NAV = [
  { to: '/admin' as const, label: 'Overview', end: true },
  { to: '/admin/inquiries' as const, label: 'Inquiries' },
  { to: '/admin/products' as const, label: 'Products' },
  { to: '/admin/services' as const, label: 'Services' },
  { to: '/admin/projects' as const, label: 'Projects' },
]

function norm(path: string) {
  if (path === '/') return '/'
  return path.replace(/\/$/, '') || '/'
}

export function AdminNav({ email }: { email: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const current = norm(pathname)
  const navigate = useNavigate()
  const logout = useServerFn(logoutAdmin)

  return (
    <aside className="admin-nav">
      <Link className="admin-brand" to="/admin">
        <HirutMark size={32} />
        <span>
          <span className="brand-name">HIRUT</span>
          <span className="admin-brand-sub">Admin</span>
        </span>
      </Link>
      <nav>
        <ul>
          {NAV.map((item) => {
            const active = item.end ? current === item.to : current === item.to || current.startsWith(`${item.to}/`)
            return (
              <li key={item.to}>
                <Link to={item.to} className={active ? 'is-active' : undefined} aria-current={active ? 'page' : undefined}>
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="admin-nav-foot">
        <p className="admin-nav-email">{email}</p>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={async () => {
            await logout()
            await navigate({ to: '/admin/login' })
          }}
        >
          Sign out
        </button>
        <Link className="admin-site-link" to="/">
          View site
        </Link>
      </div>
    </aside>
  )
}
