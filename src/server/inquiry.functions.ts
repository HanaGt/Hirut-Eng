import { createServerFn } from '@tanstack/react-start'
import { authMiddleware } from './auth-middleware'
import { getDb, type InquiryStatus } from './db.server'
import { notifyWeb3Forms } from './notify.server'
const STATUSES = new Set<InquiryStatus>(['new', 'read', 'replied', 'archived'])

export type InquiryPayload = {
  name: string
  company: string
  phone: string
  email: string
  inquiryTypeLabel: string
  message: string
  honeypot: string
}

export const submitInquiry = createServerFn({ method: 'POST' })
  .validator((data: unknown): InquiryPayload => {
    if (typeof data !== 'object' || data === null) throw new Error('Invalid inquiry')
    const rec = data as Record<string, unknown>
    const str = (k: string) => String(rec[k] ?? '').trim()
    return {
      name: str('name'),
      company: str('company'),
      phone: str('phone'),
      email: str('email'),
      inquiryTypeLabel: str('inquiryTypeLabel'),
      message: str('message'),
      honeypot: str('honeypot'),
    }
  })
  .handler(async ({ data }) => {
    if (data.honeypot) return { ok: true as const }
    if (!data.name || !data.phone || !data.email || !data.inquiryTypeLabel || !data.message) {
      throw new Error('Please complete the required fields.')
    }
    const db = getDb()
    db.prepare(
      `INSERT INTO inquiries (id, created_at, name, company, phone, email, inquiry_type, message, status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new', '')`,
    ).run(
      crypto.randomUUID(),
      Date.now(),
      data.name,
      data.company,
      data.phone,
      data.email,
      data.inquiryTypeLabel,
      data.message,
    )
    await notifyWeb3Forms(data).catch((err) => console.error('[inquiry email]', err))
    return { ok: true as const }
  })

export const listInquiries = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async () => {
    return getDb()
      .prepare(
        `SELECT id, created_at, name, company, phone, email, inquiry_type, message, status, notes
         FROM inquiries ORDER BY created_at DESC`,
      )
      .all() as Array<{
      id: string
      created_at: number
      name: string
      company: string
      phone: string
      email: string
      inquiry_type: string
      message: string
      status: InquiryStatus
      notes: string
    }>
  })

export const getInquiry = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .validator((data: unknown) => {
    const id = typeof data === 'object' && data && 'id' in data ? String((data as { id: unknown }).id) : ''
    if (!id) throw new Error('Missing inquiry')
    return { id }
  })
  .handler(async ({ data }) => {
    const row = getDb()
      .prepare(
        `SELECT id, created_at, name, company, phone, email, inquiry_type, message, status, notes
         FROM inquiries WHERE id = ?`,
      )
      .get(data.id) as
      | {
          id: string
          created_at: number
          name: string
          company: string
          phone: string
          email: string
          inquiry_type: string
          message: string
          status: InquiryStatus
          notes: string
        }
      | undefined
    if (!row) throw new Error('Inquiry not found')
    if (row.status === 'new') {
      getDb().prepare(`UPDATE inquiries SET status = 'read' WHERE id = ? AND status = 'new'`).run(row.id)
      row.status = 'read'
    }
    return row
  })

export const updateInquiry = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((data: unknown) => {
    if (typeof data !== 'object' || data === null) throw new Error('Invalid update')
    const rec = data as Record<string, unknown>
    const id = String(rec.id ?? '')
    const status = String(rec.status ?? '') as InquiryStatus
    const notes = String(rec.notes ?? '')
    if (!id || !STATUSES.has(status)) throw new Error('Invalid update')
    return { id, status, notes }
  })
  .handler(async ({ data }) => {
    const result = getDb()
      .prepare('UPDATE inquiries SET status = ?, notes = ? WHERE id = ?')
      .run(data.status, data.notes, data.id)
    if (result.changes === 0) throw new Error('Inquiry not found')
    return { ok: true as const }
  })

export const deleteInquiry = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((data: unknown) => {
    const id = typeof data === 'object' && data && 'id' in data ? String((data as { id: unknown }).id) : ''
    if (!id) throw new Error('Missing inquiry')
    return { id }
  })
  .handler(async ({ data }) => {
    getDb().prepare('DELETE FROM inquiries WHERE id = ?').run(data.id)
    return { ok: true as const }
  })

export const inquiryStats = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async () => {
    const db = getDb()
    const total = db.prepare('SELECT COUNT(*) AS n FROM inquiries').get() as { n: number }
    const unread = db.prepare(`SELECT COUNT(*) AS n FROM inquiries WHERE status = 'new'`).get() as { n: number }
    const projects = db.prepare('SELECT COUNT(*) AS n FROM projects').get() as { n: number }
    const products = db.prepare('SELECT COUNT(*) AS n FROM products').get() as { n: number }
    const works = db.prepare('SELECT COUNT(*) AS n FROM service_works').get() as { n: number }
    const consultancy = db.prepare('SELECT COUNT(*) AS n FROM service_consultancy').get() as { n: number }
    const pillars = db.prepare('SELECT COUNT(*) AS n FROM service_pillars').get() as { n: number }
    return {
      inquiries: total.n,
      unread: unread.n,
      projects: projects.n,
      products: products.n,
      services: works.n + consultancy.n + pillars.n,
    }
  })
