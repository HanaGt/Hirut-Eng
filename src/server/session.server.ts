import { getRequestHeader, setResponseHeader } from '@tanstack/react-start/server'
import { getDb } from './db.server'

const COOKIE = 'hirut_admin'
const WEEK = 60 * 60 * 24 * 7

function cookieAttrs(maxAge: number) {
  const secure = process.env.NODE_ENV === 'production'
  return [
    `HttpOnly`,
    secure ? `Secure` : '',
    `SameSite=Lax`,
    `Path=/`,
    `Max-Age=${maxAge}`,
  ]
    .filter(Boolean)
    .join('; ')
}

export function setSessionCookie(token: string) {
  setResponseHeader('Set-Cookie', `${COOKIE}=${token}; ${cookieAttrs(WEEK)}`)
}

export function clearSessionCookie() {
  setResponseHeader('Set-Cookie', `${COOKIE}=; ${cookieAttrs(0)}`)
}

export function readSessionToken() {
  const header = getRequestHeader('cookie')
  if (!header) return null
  for (const part of header.split(/;\s*/)) {
    const eq = part.indexOf('=')
    if (eq === -1) continue
    if (part.slice(0, eq) === COOKIE) return part.slice(eq + 1)
  }
  return null
}

export function readAdminSession() {
  const token = readSessionToken()
  if (!token) return null
  const db = getDb()
  const row = db
    .prepare(
      `SELECT sessions.id, sessions.admin_id, sessions.expires_at, admins.email
       FROM sessions JOIN admins ON admins.id = sessions.admin_id
       WHERE sessions.id = ?`,
    )
    .get(token) as { id: string; admin_id: string; expires_at: number; email: string } | undefined
  if (!row || row.expires_at < Date.now()) {
    if (token) db.prepare('DELETE FROM sessions WHERE id = ?').run(token)
    return null
  }
  return { id: row.id, adminId: row.admin_id, email: row.email }
}

export function createSession(adminId: string) {
  const db = getDb()
  db.prepare('DELETE FROM sessions WHERE admin_id = ?').run(adminId)
  const id = crypto.randomUUID()
  db.prepare('INSERT INTO sessions (id, admin_id, expires_at) VALUES (?, ?, ?)').run(
    id,
    adminId,
    Date.now() + WEEK * 1000,
  )
  setSessionCookie(id)
  return id
}

export function destroySession() {
  const token = readSessionToken()
  if (token) getDb().prepare('DELETE FROM sessions WHERE id = ?').run(token)
  clearSessionCookie()
}
