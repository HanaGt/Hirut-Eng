import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { constructionPhotos } from '../data/media'
import { categories } from '../data/products'
import { consultancyCards, constructionWorks } from '../data/services'
import { afterSalesPillars, projects as seedProjects } from '../data/site'
import { hashPassword } from './password.server'

const DB_PATH = resolve(process.cwd(), 'data', 'hirut.db')

export type InquiryStatus = 'new' | 'read' | 'replied' | 'archived'

export type InquiryRow = {
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

export type ProjectRow = {
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
}

export type AdminRow = {
  id: string
  email: string
  password_hash: string
}

export type SessionRow = {
  id: string
  admin_id: string
  expires_at: number
}

let db: DatabaseSync | undefined

export function getDb() {
  if (!db) {
    mkdirSync(dirname(DB_PATH), { recursive: true })
    db = new DatabaseSync(DB_PATH)
    db.exec('PRAGMA journal_mode = WAL')
    db.exec('PRAGMA foreign_keys = ON')
    migrate(db)
    seed(db)
  }
  return db
}

function migrate(database: DatabaseSync) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      admin_id TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS inquiries (
      id TEXT PRIMARY KEY,
      created_at INTEGER NOT NULL,
      name TEXT NOT NULL,
      company TEXT NOT NULL DEFAULT '',
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      inquiry_type TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      notes TEXT NOT NULL DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      sort_order INTEGER NOT NULL DEFAULT 0,
      published INTEGER NOT NULL DEFAULT 1,
      sector TEXT NOT NULL,
      sector_label TEXT NOT NULL,
      region TEXT NOT NULL,
      region_label TEXT NOT NULL,
      year TEXT NOT NULL,
      title TEXT NOT NULL,
      image TEXT NOT NULL DEFAULT '',
      desc TEXT NOT NULL DEFAULT '',
      is_sample INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS product_images (
      slug TEXT PRIMARY KEY,
      image TEXT NOT NULL DEFAULT '',
      alt TEXT NOT NULL DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS products (
      slug TEXT PRIMARY KEY,
      sort_order INTEGER NOT NULL DEFAULT 0,
      published INTEGER NOT NULL DEFAULT 1,
      name TEXT NOT NULL,
      footer_label TEXT NOT NULL,
      tags_json TEXT NOT NULL,
      card_blurb TEXT NOT NULL DEFAULT '',
      meta_description TEXT NOT NULL DEFAULT '',
      og_description TEXT NOT NULL DEFAULT '',
      hero_lead TEXT NOT NULL DEFAULT '',
      spec_groups_json TEXT NOT NULL DEFAULT '[]',
      spec_note TEXT NOT NULL DEFAULT '',
      related_json TEXT NOT NULL DEFAULT '[]',
      cta_heading TEXT NOT NULL DEFAULT '',
      cta_body TEXT NOT NULL DEFAULT '',
      cta_label TEXT NOT NULL DEFAULT '',
      feature_orica INTEGER NOT NULL DEFAULT 0,
      image TEXT NOT NULL DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS service_photos (
      id TEXT PRIMARY KEY,
      kind TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      src TEXT NOT NULL,
      alt TEXT NOT NULL DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS service_works (
      id TEXT PRIMARY KEY,
      sort_order INTEGER NOT NULL DEFAULT 0,
      title TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS service_consultancy (
      id TEXT PRIMARY KEY,
      sort_order INTEGER NOT NULL DEFAULT 0,
      num TEXT NOT NULL DEFAULT '',
      title TEXT NOT NULL,
      body TEXT NOT NULL DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS service_pillars (
      id TEXT PRIMARY KEY,
      sort_order INTEGER NOT NULL DEFAULT 0,
      title TEXT NOT NULL,
      blurb TEXT NOT NULL DEFAULT '',
      items_json TEXT NOT NULL DEFAULT '[]'
    );
  `)
}

function seed(database: DatabaseSync) {
  const adminCount = database.prepare('SELECT COUNT(*) AS n FROM admins').get() as { n: number }
  if (adminCount.n === 0) {
    const email = (process.env.ADMIN_EMAIL ?? '').trim().toLowerCase()
    const password = process.env.ADMIN_PASSWORD ?? ''
    if (!email || !password) {
      console.warn('[admin] set ADMIN_EMAIL and ADMIN_PASSWORD in .env to create the first admin login.')
    } else {
      database
        .prepare('INSERT INTO admins (id, email, password_hash) VALUES (?, ?, ?)')
        .run(crypto.randomUUID(), email, hashPassword(password))
    }
  }

  const projectCount = database.prepare('SELECT COUNT(*) AS n FROM projects').get() as { n: number }
  if (projectCount.n === 0) {
    const insert = database.prepare(`
      INSERT INTO projects (
        id, sort_order, published, sector, sector_label, region, region_label,
        year, title, image, desc, is_sample
      ) VALUES (?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    seedProjects.forEach((p, i) => {
      insert.run(
        crypto.randomUUID(),
        i,
        p.sector,
        p.sectorLabel,
        p.region,
        p.regionLabel,
        p.year,
        p.title,
        p.image ?? '',
        p.desc ?? '',
        p.isSample ? 1 : 0,
      )
    })
  }

  const insertProductImage = database.prepare(
    'INSERT OR IGNORE INTO product_images (slug, image, alt) VALUES (?, ?, ?)',
  )
  for (const category of categories) {
    insertProductImage.run(category.slug, '', category.name)
  }

  const productCount = database.prepare('SELECT COUNT(*) AS n FROM products').get() as { n: number }
  if (productCount.n === 0) {
    const insertProduct = database.prepare(`
      INSERT INTO products (
        slug, sort_order, published, name, footer_label, tags_json, card_blurb,
        meta_description, og_description, hero_lead, spec_groups_json, spec_note,
        related_json, cta_heading, cta_body, cta_label, feature_orica, image
      ) VALUES (?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    const uploaded = database.prepare('SELECT image FROM product_images WHERE slug = ?')
    categories.forEach((category, i) => {
      const photo = uploaded.get(category.slug) as { image: string } | undefined
      insertProduct.run(
        category.slug,
        i,
        category.name,
        category.footerLabel,
        JSON.stringify(category.tags),
        category.cardBlurb,
        category.metaDescription,
        category.ogDescription,
        category.heroLead,
        JSON.stringify(category.specGroups),
        category.specNote ?? '',
        JSON.stringify(category.related),
        category.cta.heading,
        category.cta.body,
        category.cta.label,
        category.featureOrica ? 1 : 0,
        photo?.image ?? '',
      )
    })
  }

  const serviceCount = database.prepare(`SELECT COUNT(*) AS n FROM service_photos WHERE kind = 'construction'`).get() as {
    n: number
  }
  if (serviceCount.n === 0) {
    const insertPhoto = database.prepare(
      'INSERT INTO service_photos (id, kind, sort_order, src, alt) VALUES (?, ?, ?, ?, ?)',
    )
    constructionPhotos.forEach((photo, i) => {
      insertPhoto.run(crypto.randomUUID(), 'construction', i, photo.src, photo.alt)
    })
  }

  const workCount = database.prepare('SELECT COUNT(*) AS n FROM service_works').get() as { n: number }
  if (workCount.n === 0) {
    const insertWork = database.prepare('INSERT INTO service_works (id, sort_order, title) VALUES (?, ?, ?)')
    constructionWorks.forEach((title, i) => {
      insertWork.run(crypto.randomUUID(), i, title)
    })
  }

  const consultancyCount = database.prepare('SELECT COUNT(*) AS n FROM service_consultancy').get() as { n: number }
  if (consultancyCount.n === 0) {
    const insertCard = database.prepare(
      'INSERT INTO service_consultancy (id, sort_order, num, title, body) VALUES (?, ?, ?, ?, ?)',
    )
    consultancyCards.forEach((card, i) => {
      insertCard.run(crypto.randomUUID(), i, card.num, card.title, card.body)
    })
  }

  const pillarCount = database.prepare('SELECT COUNT(*) AS n FROM service_pillars').get() as { n: number }
  if (pillarCount.n === 0) {
    const insertPillar = database.prepare(
      'INSERT INTO service_pillars (id, sort_order, title, blurb, items_json) VALUES (?, ?, ?, ?, ?)',
    )
    afterSalesPillars.forEach((pillar, i) => {
      insertPillar.run(crypto.randomUUID(), i, pillar.title, pillar.blurb, JSON.stringify(pillar.items))
    })
  }
}
