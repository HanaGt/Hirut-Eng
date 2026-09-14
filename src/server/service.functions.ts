import { createServerFn } from '@tanstack/react-start'
import { authMiddleware } from './auth-middleware'
import { getDb } from './db.server'
import { deleteUploadedImage, saveUpload } from './uploads.server'

export type ServicePhoto = {
  id: string
  src: string
  alt: string
  width: number
  height: number
}

export type ConstructionWork = {
  id: string
  title: string
}

export type ConsultancyCard = {
  id: string
  num: string
  title: string
  body: string
}

export type AfterSalesPillar = {
  id: string
  title: string
  blurb: string
  items: string[]
}

function parseJsonArray(raw: string): string[] {
  try {
    const value = JSON.parse(raw) as unknown
    return Array.isArray(value) ? value.map((item) => String(item).trim()).filter(Boolean) : []
  } catch {
    return []
  }
}

export const listConstructionPhotos = createServerFn({ method: 'GET' }).handler(async () => {
  const rows = getDb()
    .prepare(
      `SELECT id, src, alt FROM service_photos WHERE kind = 'construction' ORDER BY sort_order ASC, src ASC`,
    )
    .all() as Array<{ id: string; src: string; alt: string }>
  return rows.map((row) => ({
    id: row.id,
    src: row.src,
    alt: row.alt,
    width: 1600,
    height: 1000,
  })) satisfies ServicePhoto[]
})

export const addConstructionPhoto = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((data: unknown) => {
    if (!(data instanceof FormData)) throw new Error('Invalid photo')
    const image = data.get('image')
    if (!(image instanceof Blob) || image.size === 0) throw new Error('Please choose an image.')
    return {
      image,
      alt: String(data.get('alt') ?? '').trim(),
    }
  })
  .handler(async ({ data }) => {
    const src = await saveUpload('services', data.image)
    const db = getDb()
    const max = db
      .prepare(`SELECT COALESCE(MAX(sort_order), -1) AS n FROM service_photos WHERE kind = 'construction'`)
      .get() as { n: number }
    const id = crypto.randomUUID()
    db.prepare('INSERT INTO service_photos (id, kind, sort_order, src, alt) VALUES (?, ?, ?, ?, ?)').run(
      id,
      'construction',
      max.n + 1,
      src,
      data.alt,
    )
    return { id }
  })

export const deleteConstructionPhoto = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((data: unknown) => {
    const id = typeof data === 'object' && data && 'id' in data ? String((data as { id: unknown }).id) : ''
    if (!id) throw new Error('Missing photo')
    return { id }
  })
  .handler(async ({ data }) => {
    const db = getDb()
    const row = db.prepare(`SELECT src FROM service_photos WHERE id = ? AND kind = 'construction'`).get(data.id) as
      | { src: string }
      | undefined
    if (row) deleteUploadedImage(row.src)
    db.prepare('DELETE FROM service_photos WHERE id = ?').run(data.id)
    return { ok: true as const }
  })

export const listConstructionWorks = createServerFn({ method: 'GET' }).handler(async () => {
  return getDb()
    .prepare('SELECT id, title FROM service_works ORDER BY sort_order ASC, title ASC')
    .all() as ConstructionWork[]
})

export const saveConstructionWorks = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((data: unknown) => {
    if (typeof data !== 'object' || data === null || !('titles' in data)) throw new Error('Invalid works')
    const titles = (data as { titles: unknown }).titles
    if (!Array.isArray(titles)) throw new Error('Invalid works')
    const next = titles.map((title) => String(title).trim()).filter(Boolean)
    if (next.length === 0) throw new Error('Add at least one construction work')
    return { titles: next }
  })
  .handler(async ({ data }) => {
    const db = getDb()
    db.exec('DELETE FROM service_works')
    const insert = db.prepare('INSERT INTO service_works (id, sort_order, title) VALUES (?, ?, ?)')
    data.titles.forEach((title, i) => insert.run(crypto.randomUUID(), i, title))
    return { ok: true as const }
  })

export const listConsultancyCards = createServerFn({ method: 'GET' }).handler(async () => {
  return getDb()
    .prepare('SELECT id, num, title, body FROM service_consultancy ORDER BY sort_order ASC, title ASC')
    .all() as ConsultancyCard[]
})

export const getConsultancyCard = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .validator((data: unknown) => {
    const id = typeof data === 'object' && data && 'id' in data ? String((data as { id: unknown }).id) : ''
    if (!id) throw new Error('Missing card')
    return { id }
  })
  .handler(async ({ data }) => {
    const row = getDb()
      .prepare('SELECT id, num, title, body FROM service_consultancy WHERE id = ?')
      .get(data.id) as ConsultancyCard | undefined
    if (!row) throw new Error('Consultancy service not found')
    return row
  })

function parseConsultancy(data: unknown) {
  if (!(data instanceof FormData)) throw new Error('Invalid consultancy service')
  const title = String(data.get('title') ?? '').trim()
  const body = String(data.get('body') ?? '').trim()
  const num = String(data.get('num') ?? '').trim()
  if (!title) throw new Error('Title is required')
  if (!body) throw new Error('Description is required')
  return {
    id: String(data.get('id') ?? '') || undefined,
    num,
    title,
    body,
  }
}

export const saveConsultancyCard = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(parseConsultancy)
  .handler(async ({ data }) => {
    const db = getDb()
    if (data.id) {
      const result = db
        .prepare('UPDATE service_consultancy SET num = ?, title = ?, body = ? WHERE id = ?')
        .run(data.num, data.title, data.body, data.id)
      if (result.changes === 0) throw new Error('Consultancy service not found')
      return { id: data.id }
    }
    const max = db.prepare('SELECT COALESCE(MAX(sort_order), -1) AS n FROM service_consultancy').get() as { n: number }
    const id = crypto.randomUUID()
    db.prepare('INSERT INTO service_consultancy (id, sort_order, num, title, body) VALUES (?, ?, ?, ?, ?)').run(
      id,
      max.n + 1,
      data.num,
      data.title,
      data.body,
    )
    return { id }
  })

export const deleteConsultancyCard = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((data: unknown) => {
    const id = typeof data === 'object' && data && 'id' in data ? String((data as { id: unknown }).id) : ''
    if (!id) throw new Error('Missing card')
    return { id }
  })
  .handler(async ({ data }) => {
    getDb().prepare('DELETE FROM service_consultancy WHERE id = ?').run(data.id)
    return { ok: true as const }
  })

export const listAfterSalesPillars = createServerFn({ method: 'GET' }).handler(async () => {
  const rows = getDb()
    .prepare('SELECT id, title, blurb, items_json FROM service_pillars ORDER BY sort_order ASC, title ASC')
    .all() as Array<{ id: string; title: string; blurb: string; items_json: string }>
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    blurb: row.blurb,
    items: parseJsonArray(row.items_json),
  })) satisfies AfterSalesPillar[]
})

export const getAfterSalesPillar = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .validator((data: unknown) => {
    const id = typeof data === 'object' && data && 'id' in data ? String((data as { id: unknown }).id) : ''
    if (!id) throw new Error('Missing pillar')
    return { id }
  })
  .handler(async ({ data }) => {
    const row = getDb()
      .prepare('SELECT id, title, blurb, items_json FROM service_pillars WHERE id = ?')
      .get(data.id) as { id: string; title: string; blurb: string; items_json: string } | undefined
    if (!row) throw new Error('After-sales pillar not found')
    return { id: row.id, title: row.title, blurb: row.blurb, items: parseJsonArray(row.items_json) }
  })

function parsePillar(data: unknown) {
  if (!(data instanceof FormData)) throw new Error('Invalid pillar')
  const title = String(data.get('title') ?? '').trim()
  const blurb = String(data.get('blurb') ?? '').trim()
  const items = String(data.get('items') ?? '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
  if (!title) throw new Error('Title is required')
  if (items.length === 0) throw new Error('Add at least one covered item')
  return {
    id: String(data.get('id') ?? '') || undefined,
    title,
    blurb,
    items,
  }
}

export const saveAfterSalesPillar = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(parsePillar)
  .handler(async ({ data }) => {
    const db = getDb()
    if (data.id) {
      const result = db
        .prepare('UPDATE service_pillars SET title = ?, blurb = ?, items_json = ? WHERE id = ?')
        .run(data.title, data.blurb, JSON.stringify(data.items), data.id)
      if (result.changes === 0) throw new Error('After-sales pillar not found')
      return { id: data.id }
    }
    const max = db.prepare('SELECT COALESCE(MAX(sort_order), -1) AS n FROM service_pillars').get() as { n: number }
    const id = crypto.randomUUID()
    db.prepare('INSERT INTO service_pillars (id, sort_order, title, blurb, items_json) VALUES (?, ?, ?, ?, ?)').run(
      id,
      max.n + 1,
      data.title,
      data.blurb,
      JSON.stringify(data.items),
    )
    return { id }
  })

export const deleteAfterSalesPillar = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((data: unknown) => {
    const id = typeof data === 'object' && data && 'id' in data ? String((data as { id: unknown }).id) : ''
    if (!id) throw new Error('Missing pillar')
    return { id }
  })
  .handler(async ({ data }) => {
    getDb().prepare('DELETE FROM service_pillars WHERE id = ?').run(data.id)
    return { ok: true as const }
  })

export const listPublicServices = createServerFn({ method: 'GET' }).handler(async () => {
  const db = getDb()
  const photos = (
    db
      .prepare(
        `SELECT id, src, alt FROM service_photos WHERE kind = 'construction' ORDER BY sort_order ASC, src ASC`,
      )
      .all() as Array<{ id: string; src: string; alt: string }>
  ).map((row) => ({
    id: row.id,
    src: row.src,
    alt: row.alt,
    width: 1600,
    height: 1000,
  })) satisfies ServicePhoto[]
  const works = db
    .prepare('SELECT id, title FROM service_works ORDER BY sort_order ASC, title ASC')
    .all() as ConstructionWork[]
  const consultancy = db
    .prepare('SELECT id, num, title, body FROM service_consultancy ORDER BY sort_order ASC, title ASC')
    .all() as ConsultancyCard[]
  const pillars = (
    db
      .prepare('SELECT id, title, blurb, items_json FROM service_pillars ORDER BY sort_order ASC, title ASC')
      .all() as Array<{ id: string; title: string; blurb: string; items_json: string }>
  ).map((row) => ({
    id: row.id,
    title: row.title,
    blurb: row.blurb,
    items: parseJsonArray(row.items_json),
  })) satisfies AfterSalesPillar[]
  return { photos, works, consultancy, pillars }
})
