import { createServerFn } from '@tanstack/react-start'
import {
  displayTagLabels,
  inquiryLabelForProduct,
  slugifyCategory,
  type Category,
  type ProductTag,
  type ServiceHash,
  type SpecGroup,
} from '../data/products'
import type { InquiryGroup } from '../data/site'
import { authMiddleware } from './auth-middleware'
import { getDb } from './db.server'
import { deleteUploadedImage, saveUpload } from './uploads.server'

const PRODUCT_COLS = `slug, sort_order, published, name, footer_label, tags_json, card_blurb,
  meta_description, og_description, hero_lead, spec_groups_json, spec_note, related_json,
  cta_heading, cta_body, cta_label, feature_orica, image`

const TAGS = new Set<ProductTag>(['water', 'ground', 'power'])
const HASHES = new Set<ServiceHash>(['construction', 'consultancy', 'after-sales'])
const RESERVED_SLUGS = new Set(['new'])

type ProductRow = {
  slug: string
  sort_order: number
  published: number
  name: string
  footer_label: string
  tags_json: string
  card_blurb: string
  meta_description: string
  og_description: string
  hero_lead: string
  spec_groups_json: string
  spec_note: string
  related_json: string
  cta_heading: string
  cta_body: string
  cta_label: string
  feature_orica: number
  image: string
}

export type AdminProduct = {
  slug: string
  sortOrder: number
  published: boolean
  name: string
  footerLabel: string
  tags: ProductTag[]
  cardBlurb: string
  metaDescription: string
  ogDescription: string
  heroLead: string
  specGroups: SpecGroup[]
  specNote: string
  related: Array<{ label: string; hash: ServiceHash }>
  cta: { heading: string; body: string; label: string }
  featureOrica: boolean
  image: string
}

function parseJson<T>(raw: string, fallback: T): T {
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function asTags(value: unknown): ProductTag[] {
  if (!Array.isArray(value)) return []
  return value.filter((tag): tag is ProductTag => typeof tag === 'string' && TAGS.has(tag as ProductTag))
}

function asSpecGroups(value: unknown): SpecGroup[] {
  if (!Array.isArray(value)) return []
  const groups: SpecGroup[] = []
  for (const group of value) {
    if (!group || typeof group !== 'object') continue
    const rec = group as { title?: unknown; items?: unknown }
    const items = Array.isArray(rec.items)
      ? rec.items.map((item) => String(item).trim()).filter(Boolean)
      : []
    if (items.length === 0) continue
    const title = String(rec.title ?? '').trim()
    groups.push(title ? { title, items } : { items })
  }
  return groups
}

function asRelated(value: unknown): Array<{ label: string; hash: ServiceHash }> {
  if (!Array.isArray(value)) return []
  return value
    .map((row) => {
      if (!row || typeof row !== 'object') return null
      const rec = row as { label?: unknown; hash?: unknown }
      const label = String(rec.label ?? '').trim()
      const hash = String(rec.hash ?? '') as ServiceHash
      if (!label || !HASHES.has(hash)) return null
      return { label, hash }
    })
    .filter((row): row is { label: string; hash: ServiceHash } => row !== null)
}

function rowToAdmin(row: ProductRow): AdminProduct {
  const tags = asTags(parseJson(row.tags_json, []))
  const featureOrica = row.feature_orica === 1
  return {
    slug: row.slug,
    sortOrder: row.sort_order,
    published: row.published === 1,
    name: row.name,
    footerLabel: row.footer_label,
    tags,
    cardBlurb: row.card_blurb,
    metaDescription: row.meta_description,
    ogDescription: row.og_description,
    heroLead: row.hero_lead,
    specGroups: asSpecGroups(parseJson(row.spec_groups_json, [])),
    specNote: row.spec_note,
    related: asRelated(parseJson(row.related_json, [])),
    cta: { heading: row.cta_heading, body: row.cta_body, label: row.cta_label },
    featureOrica,
    image: row.image,
  }
}

export function toPublicCategory(product: AdminProduct): Category {
  return {
    slug: product.slug,
    name: product.name,
    footerLabel: product.footerLabel,
    tags: product.tags,
    tagLabels: displayTagLabels(product.tags, product.featureOrica),
    cardBlurb: product.cardBlurb,
    metaDescription: product.metaDescription,
    ogDescription: product.ogDescription,
    heroLead: product.heroLead,
    specGroups: product.specGroups,
    specNote: product.specNote || undefined,
    related: product.related,
    cta: product.cta,
    featureOrica: product.featureOrica || undefined,
    image: product.image || undefined,
  }
}

function readProducts(publishedOnly = false) {
  const sql = publishedOnly
    ? `SELECT ${PRODUCT_COLS} FROM products WHERE published = 1 ORDER BY sort_order ASC, name ASC`
    : `SELECT ${PRODUCT_COLS} FROM products ORDER BY sort_order ASC, name ASC`
  return (getDb().prepare(sql).all() as ProductRow[]).map(rowToAdmin)
}

function parseSlug(raw: string) {
  const slug = slugifyCategory(raw)
  if (!slug || slug.length < 2 || slug.length > 80 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error('Use a URL slug like pumps-accessories.')
  }
  if (RESERVED_SLUGS.has(slug)) throw new Error('That slug is reserved.')
  return slug
}

type ProductInput = {
  isNew: boolean
  slug: string
  name: string
  footerLabel: string
  tags: ProductTag[]
  cardBlurb: string
  metaDescription: string
  ogDescription: string
  heroLead: string
  specGroups: SpecGroup[]
  specNote: string
  related: Array<{ label: string; hash: ServiceHash }>
  cta: { heading: string; body: string; label: string }
  featureOrica: boolean
  published: boolean
  image: Blob | null
  removeImage: boolean
}

function parseProduct(data: unknown): ProductInput {
  if (!(data instanceof FormData)) throw new Error('Invalid product')
  const isNew = data.get('isNew') === '1'
  const name = String(data.get('name') ?? '').trim()
  const footerLabel = String(data.get('footerLabel') ?? '').trim()
  const heroLead = String(data.get('heroLead') ?? '').trim()
  const cardBlurb = String(data.get('cardBlurb') ?? '').trim()
  const ctaHeading = String(data.get('ctaHeading') ?? '').trim()
  const ctaBody = String(data.get('ctaBody') ?? '').trim()
  const ctaLabel = String(data.get('ctaLabel') ?? '').trim()
  if (!name) throw new Error('Name is required')
  if (!footerLabel) throw new Error('Footer label is required')
  if (!cardBlurb) throw new Error('Card summary is required')
  if (!heroLead) throw new Error('Hero lead is required')
  if (!ctaHeading || !ctaBody || !ctaLabel) throw new Error('Complete the quote call-to-action')
  const tags = asTags(data.getAll('tags').map((tag) => String(tag)))
  if (tags.length === 0) throw new Error('Choose at least one tag (Water, Ground, or Power)')
  const specGroups = asSpecGroups(parseJson(String(data.get('specGroups') ?? '[]'), []))
  if (specGroups.length === 0) throw new Error('Add at least one catalog item')
  const related = asRelated(parseJson(String(data.get('related') ?? '[]'), []))
  const image = data.get('image')
  return {
    isNew,
    slug: parseSlug(String(data.get('slug') ?? '') || name),
    name,
    footerLabel,
    tags,
    cardBlurb,
    metaDescription: String(data.get('metaDescription') ?? '').trim() || cardBlurb,
    ogDescription: String(data.get('ogDescription') ?? '').trim() || cardBlurb,
    heroLead,
    specGroups,
    specNote: String(data.get('specNote') ?? '').trim(),
    related,
    cta: { heading: ctaHeading, body: ctaBody, label: ctaLabel },
    featureOrica: data.get('featureOrica') === '1',
    published: data.get('published') === '1',
    image: image instanceof Blob && image.size > 0 ? image : null,
    removeImage: data.get('removeImage') === '1',
  }
}

export const listPublishedProducts = createServerFn({ method: 'GET' }).handler(async () => {
  return readProducts(true).map(toPublicCategory)
})

export const listProductNav = createServerFn({ method: 'GET' }).handler(async () => {
  return readProducts(true).map((product) => ({ slug: product.slug, footerLabel: product.footerLabel }))
})

export const listInquiryTypes = createServerFn({ method: 'GET' }).handler(async (): Promise<InquiryGroup[]> => {
  const products: InquiryGroup = {
    group: 'Products',
    options: readProducts(true).map((product) => ({
      value: product.slug,
      label: inquiryLabelForProduct(product.name, product.featureOrica),
    })),
  }
  const services: InquiryGroup = {
    group: 'Services',
    options: [
      { value: 'construction-services', label: 'Construction Works' },
      { value: 'consultancy-services', label: 'Professional & Consultancy Services' },
      { value: 'after-sales', label: 'After-Sales Services' },
    ],
  }
  const other: InquiryGroup = {
    group: 'Other',
    options: [{ value: 'general', label: 'General inquiry' }],
  }
  return [products, services, other].filter((group) => group.options.length > 0)
})

export const getPublishedProduct = createServerFn({ method: 'GET' })
  .validator((data: unknown) => {
    const slug = typeof data === 'object' && data && 'slug' in data ? String((data as { slug: unknown }).slug) : ''
    if (!slug) throw new Error('Missing product')
    return { slug }
  })
  .handler(async ({ data }) => {
    const row = getDb()
      .prepare(`SELECT ${PRODUCT_COLS} FROM products WHERE slug = ? AND published = 1`)
      .get(data.slug) as ProductRow | undefined
    return row ? toPublicCategory(rowToAdmin(row)) : null
  })

export const listAdminProducts = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async () => readProducts(false))

export const getAdminProduct = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .validator((data: unknown) => {
    const slug = typeof data === 'object' && data && 'slug' in data ? String((data as { slug: unknown }).slug) : ''
    if (!slug) throw new Error('Missing product')
    return { slug }
  })
  .handler(async ({ data }) => {
    const row = getDb().prepare(`SELECT ${PRODUCT_COLS} FROM products WHERE slug = ?`).get(data.slug) as
      | ProductRow
      | undefined
    if (!row) throw new Error('Product not found')
    return rowToAdmin(row)
  })

export const saveProduct = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(parseProduct)
  .handler(async ({ data }) => {
    const db = getDb()
    const uploaded = data.image ? await saveUpload('products', data.image) : null
    const values = [
      data.name,
      data.footerLabel,
      JSON.stringify(data.tags),
      data.cardBlurb,
      data.metaDescription,
      data.ogDescription,
      data.heroLead,
      JSON.stringify(data.specGroups),
      data.specNote,
      JSON.stringify(data.related),
      data.cta.heading,
      data.cta.body,
      data.cta.label,
      data.featureOrica ? 1 : 0,
    ] as const

    if (!data.isNew) {
      const current = db.prepare('SELECT image FROM products WHERE slug = ?').get(data.slug) as
        | { image: string }
        | undefined
      if (!current) {
        if (uploaded) deleteUploadedImage(uploaded)
        throw new Error('Product not found')
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
        `UPDATE products SET name = ?, footer_label = ?, tags_json = ?, card_blurb = ?,
         meta_description = ?, og_description = ?, hero_lead = ?, spec_groups_json = ?, spec_note = ?,
         related_json = ?, cta_heading = ?, cta_body = ?, cta_label = ?, feature_orica = ?,
         image = ?, published = ? WHERE slug = ?`,
      ).run(...values, image, data.published ? 1 : 0, data.slug)
      return { slug: data.slug }
    }

    const exists = db.prepare('SELECT slug FROM products WHERE slug = ?').get(data.slug)
    if (exists) {
      if (uploaded) deleteUploadedImage(uploaded)
      throw new Error('A product with that URL slug already exists')
    }
    const max = db.prepare('SELECT COALESCE(MAX(sort_order), -1) AS n FROM products').get() as { n: number }
    db.prepare(
      `INSERT INTO products (
        slug, sort_order, published, name, footer_label, tags_json, card_blurb,
        meta_description, og_description, hero_lead, spec_groups_json, spec_note,
        related_json, cta_heading, cta_body, cta_label, feature_orica, image
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(data.slug, max.n + 1, data.published ? 1 : 0, ...values, uploaded ?? '')
    return { slug: data.slug }
  })

export const deleteProduct = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((data: unknown) => {
    const slug = typeof data === 'object' && data && 'slug' in data ? String((data as { slug: unknown }).slug) : ''
    if (!slug) throw new Error('Missing product')
    return { slug }
  })
  .handler(async ({ data }) => {
    const db = getDb()
    const row = db.prepare('SELECT image FROM products WHERE slug = ?').get(data.slug) as { image: string } | undefined
    if (row) deleteUploadedImage(row.image)
    db.prepare('DELETE FROM products WHERE slug = ?').run(data.slug)
    return { ok: true as const }
  })
