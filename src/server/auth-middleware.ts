import { createMiddleware } from '@tanstack/react-start'
import { ADMIN_UNAVAILABLE, isEphemeralDb } from './db.server'
import { readAdminSession } from './session.server'

export const authMiddleware = createMiddleware({ type: 'function' }).server(async ({ next }) => {
  if (isEphemeralDb()) throw new Error(ADMIN_UNAVAILABLE)
  const session = readAdminSession()
  if (!session) throw new Error('Unauthorized')
  return next({ context: { session } })
})
