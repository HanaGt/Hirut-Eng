import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { authMiddleware } from './auth-middleware'
import { getDb } from './db.server'
import { verifyPassword } from './password.server'
import { createSession, destroySession, readAdminSession } from './session.server'

const attempts = new Map<string, { n: number; reset: number }>()

function rateLimitOk() {
  const req = getRequest()
  const ip =
    req.headers.get('cf-connecting-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'local'
  const now = Date.now()
  const row = attempts.get(ip)
  if (!row || row.reset < now) {
    attempts.set(ip, { n: 1, reset: now + 15 * 60 * 1000 })
    return true
  }
  row.n += 1
  return row.n <= 8
}

export const getSession = createServerFn({ method: 'GET' }).handler(async () => {
  const session = readAdminSession()
  return session ? { email: session.email } : null
})

export const loginAdmin = createServerFn({ method: 'POST' })
  .validator((data: unknown) => {
    if (typeof data !== 'object' || data === null) throw new Error('Invalid credentials')
    const email = 'email' in data ? String(data.email).trim().toLowerCase() : ''
    const password = 'password' in data ? String(data.password) : ''
    if (!email || !password) throw new Error('Invalid credentials')
    return { email, password }
  })
  .handler(async ({ data }) => {
    if (!rateLimitOk()) throw new Error('Too many attempts. Try again in a few minutes.')
    const db = getDb()
    const admin = db.prepare('SELECT id, email, password_hash FROM admins WHERE email = ?').get(data.email) as
      | { id: string; email: string; password_hash: string }
      | undefined
    const dummy = db.prepare('SELECT password_hash FROM admins LIMIT 1').get() as { password_hash: string } | undefined
    const hash = admin?.password_hash ?? dummy?.password_hash ?? 'x:x'
    const matches = verifyPassword(data.password, hash)
    if (!admin || !matches) throw new Error('Invalid email or password')
    createSession(admin.id)
    return { email: admin.email }
  })

export const logoutAdmin = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .handler(async () => {
    destroySession()
    return { ok: true }
  })
