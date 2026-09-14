import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

export function hashPassword(password: string) {
  const salt = randomBytes(16)
  const hash = scryptSync(password, salt, 64)
  return `${salt.toString('hex')}:${Buffer.from(hash).toString('hex')}`
}

const DUMMY = hashPassword('not-a-real-password')

export function verifyPassword(password: string, stored: string) {
  const [saltHex, hashHex] = stored.split(':')
  if (!saltHex || !hashHex) {
    verifyPassword(password, DUMMY)
    return false
  }
  const salt = Buffer.from(saltHex, 'hex')
  const expected = Buffer.from(hashHex, 'hex')
  const actual = Buffer.from(scryptSync(password, salt, 64))
  if (actual.length !== expected.length) return false
  return timingSafeEqual(actual, expected)
}
