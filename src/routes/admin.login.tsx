import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import { HirutMark } from '../components/Logo'
import { loginAdmin } from '../server/auth.functions'

function safeRedirect(url: unknown) {
  if (typeof url !== 'string' || !url.startsWith('/admin') || url.startsWith('//') || url.includes('\\')) {
    return '/admin'
  }
  return url
}

export const Route = createFileRoute('/admin/login')({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => {
    const redirect = safeRedirect(search.redirect)
    return redirect === '/admin' && search.redirect == null ? {} : { redirect }
  },
  component: LoginPage,
})

function LoginPage() {
  const search = Route.useSearch()
  const next = search.redirect ?? '/admin'
  const navigate = useNavigate()
  const login = useServerFn(loginAdmin)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  return (
    <div className="admin-login">
      <form
        className="admin-login-card"
        onSubmit={async (e) => {
          e.preventDefault()
          const form = e.currentTarget
          const data = new FormData(form)
          setBusy(true)
          setError('')
          try {
            await login({
              data: {
                email: String(data.get('email') ?? ''),
                password: String(data.get('password') ?? ''),
              },
            })
            await navigate({ href: next })
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not sign in.')
          } finally {
            setBusy(false)
          }
        }}
      >
        <HirutMark size={42} />
        <h1>Hirut admin</h1>
        <p>Sign in to manage inquiries, products, services, and projects.</p>
        <div className="field">
          <label htmlFor="admin-email">Email</label>
          <input id="admin-email" name="email" type="email" autoComplete="username" required />
        </div>
        <div className="field">
          <label htmlFor="admin-password">Password</label>
          <input id="admin-password" name="password" type="password" autoComplete="current-password" required />
        </div>
        {error ? (
          <p className="field-error" role="alert">
            {error}
          </p>
        ) : null}
        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
