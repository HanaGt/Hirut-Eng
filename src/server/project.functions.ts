import { createServerFn } from '@tanstack/react-start'
import { authMiddleware } from './auth-middleware'
import { getDb } from './db.server'
import { deleteUploadedImage, saveProjectImage } from './uploads.server'
import { PROJECT_REGIONS, PROJECT_SECTORS, PROJECT_YEARS } from '../data/project-meta'
import type { Project } from '../data/site'

const SECTOR_LABEL: Record<string, string> = Object.fromEntries(PROJECT_SECTORS.map((s) => [s.value, s.label]))
const REGION_LABEL: Record<string, string> = Object.fromEntries(PROJECT_REGIONS.map((r) => [r.value, r.label]))
const YEAR_VALUES = new Set<string>(PROJECT_YEARS.map((y) => y.value))

export type AdminProject = {
  id: string
  sortOrder: number
  published: boolean
  sector: string
  sectorLabel: string
  region: string
  regionLabel: string
  year: string
  title: string
  image: string
  desc: string
  isSample: boolean
}

function rowToAdmin(row: {
  id: string
  sort_order: number
  published: number
  sector: string
  sector_label: string
  region: string
  region_label: string
  year: string
  title: string
  image: string
  desc: string
  is_sample: number
}): AdminProject {
  return {
    id: row.id,
    sortOrder: row.sort_order,
    published: row.published === 1,
    sector: row.sector,
    sectorLabel: row.sector_label,
    region: row.region,
    regionLabel: row.region_label,
    year: row.year,
    title: row.title,
    image: row.image,
    desc: row.desc,
    isSample: row.is_sample === 1,
  }
}

export function toPublicProject(p: AdminProject): Project {
  return {
    sector: p.sector,
    sectorLabel: p.sectorLabel,
    region: p.region,
    regionLabel: p.regionLabel,
    year: p.year,
    title: p.title,
    image: p.image || undefined,
    desc: p.desc || undefined,
    isSample: p.isSample || undefined,
  }
}

export const listPublishedProjects = createServerFn({ method: 'GET' }).handler(async () => {
  const rows = getDb()
    .prepare(
      `SELECT id, sort_order, published, sector, sector_label, region, region_label, year, title, image, desc, is_sample
       FROM projects WHERE published = 1 ORDER BY sort_order ASC, title ASC`,
    )
    .all() as Array<Parameters<typeof rowToAdmin>[0]>
  return rows.map((row) => toPublicProject(rowToAdmin(row)))
})

export const listAdminProjects = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async () => {
    const rows = getDb()
      .prepare(
        `SELECT id, sort_order, published, sector, sector_label, region, region_label, year, title, image, desc, is_sample
         FROM projects ORDER BY sort_order ASC, title ASC`,
      )
      .all() as Array<Parameters<typeof rowToAdmin>[0]>
    return rows.map(rowToAdmin)
  })

export const getAdminProject = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .validator((data: unknown) => {
    const id = typeof data === 'object' && data && 'id' in data ? String((data as { id: unknown }).id) : ''
    if (!id) throw new Error('Missing project')
    return { id }
  })
  .handler(async ({ data }) => {
    const row = getDb()
      .prepare(
        `SELECT id, sort_order, published, sector, sector_label, region, region_label, year, title, image, desc, is_sample
         FROM projects WHERE id = ?`,
      )
      .get(data.id) as Parameters<typeof rowToAdmin>[0] | undefined
    if (!row) throw new Error('Project not found')
    return rowToAdmin(row)
  })

type ProjectInput = {
  id?: string
  title: string
  sector: string
  region: string
  year: string
  desc: string
  published: boolean
  isSample: boolean
  image: Blob | null
  removeImage: boolean
}

function parseProject(data: unknown): ProjectInput {
  if (!(data instanceof FormData)) throw new Error('Invalid project')
  const title = String(data.get('title') ?? '').trim()
  const sector = String(data.get('sector') ?? '')
  const region = String(data.get('region') ?? '')
  const year = String(data.get('year') ?? '')
  if (!title) throw new Error('Title is required')
  if (!(sector in SECTOR_LABEL) || !(region in REGION_LABEL) || !YEAR_VALUES.has(year)) {
    throw new Error('Choose a valid sector, region, and year')
  }
  const image = data.get('image')
  return {
    id: String(data.get('id') ?? '') || undefined,
    title,
    sector,
    region,
    year,
    desc: String(data.get('desc') ?? '').trim(),
    published: data.get('published') === '1',
    isSample: data.get('isSample') === '1',
    image: image instanceof Blob && image.size > 0 ? image : null,
    removeImage: data.get('removeImage') === '1',
  }
}

export const saveProject = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(parseProject)
  .handler(async ({ data }) => {
    const db = getDb()
    const sectorLabel = SECTOR_LABEL[data.sector] ?? data.sector
    const regionLabel = REGION_LABEL[data.region] ?? data.region
    const uploaded = data.image ? await saveProjectImage(data.image) : null

    if (data.id) {
      const current = db.prepare('SELECT image FROM projects WHERE id = ?').get(data.id) as { image: string } | undefined
      if (!current) {
        if (uploaded) deleteUploadedImage(uploaded)
        throw new Error('Project not found')
      }
      let image = current.image
      if (uploaded) {
        deleteUploadedImage(current.image)
        image = uploaded
      } else if (data.removeImage) {
        deleteUploadedImage(current.image)
        image = ''
      }
      db.prepare(
        `UPDATE projects SET title = ?, sector = ?, sector_label = ?, region = ?, region_label = ?, year = ?,
         desc = ?, image = ?, published = ?, is_sample = ? WHERE id = ?`,
      ).run(
        data.title,
        data.sector,
        sectorLabel,
        data.region,
        regionLabel,
        data.year,
        data.desc,
        image,
        data.published ? 1 : 0,
        data.isSample ? 1 : 0,
        data.id,
      )
      return { id: data.id }
    }

    const max = db.prepare('SELECT COALESCE(MAX(sort_order), -1) AS n FROM projects').get() as { n: number }
    const id = crypto.randomUUID()
    db.prepare(
      `INSERT INTO projects (
        id, sort_order, published, sector, sector_label, region, region_label, year, title, image, desc, is_sample
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      id,
      max.n + 1,
      data.published ? 1 : 0,
      data.sector,
      sectorLabel,
      data.region,
      regionLabel,
      data.year,
      data.title,
      uploaded ?? '',
      data.desc,
      data.isSample ? 1 : 0,
    )
    return { id }
  })

export const deleteProject = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((data: unknown) => {
    const id = typeof data === 'object' && data && 'id' in data ? String((data as { id: unknown }).id) : ''
    if (!id) throw new Error('Missing project')
    return { id }
  })
  .handler(async ({ data }) => {
    const db = getDb()
    const row = db.prepare('SELECT image FROM projects WHERE id = ?').get(data.id) as { image: string } | undefined
    if (row) deleteUploadedImage(row.image)
    db.prepare('DELETE FROM projects WHERE id = ?').run(data.id)
    return { ok: true as const }
  })
