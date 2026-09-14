import { createMiddleware } from '@tanstack/react-start'
import { readAdminSession } from './session.server'

export const authMiddleware = createMiddleware({ type: 'function' }).server(async ({ next }) => {
  const session = readAdminSession()
  if (!session) throw new Error('Unauthorized')
  return next({ context: { session } })
})
