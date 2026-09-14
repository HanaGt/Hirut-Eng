import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { basename, resolve } from 'node:path'

export const UPLOAD_KINDS = ['projects', 'products', 'services'] as const
export type UploadKind = (typeof UPLOAD_KINDS)[number]

const MAX_BYTES = 8 * 1024 * 1024
const TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}
const CONTENT: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
}

function kindDir(kind: UploadKind) {
  return resolve(process.cwd(), 'data', 'uploads', kind)
}

function parseUploadUrl(url: string) {
  const match = url.match(/^\/uploads\/(projects|products|services)\/([\w.-]+)$/)
  if (!match) return null
  return { kind: match[1] as UploadKind, name: match[2] }
}

export async function saveUpload(
  kind: UploadKind,
  file: { type: string; size: number; arrayBuffer: () => Promise<ArrayBuffer> },
) {
  const ext = TYPES[file.type]
  if (!ext) throw new Error('Please upload a JPG, PNG, WebP, or GIF.')
  if (file.size > MAX_BYTES) throw new Error('Image must be 8 MB or smaller.')
  const dir = kindDir(kind)
  mkdirSync(dir, { recursive: true })
  const name = `${crypto.randomUUID()}.${ext}`
  writeFileSync(resolve(dir, name), Buffer.from(await file.arrayBuffer()))
  return `/uploads/${kind}/${name}`
}

export function saveProjectImage(file: { type: string; size: number; arrayBuffer: () => Promise<ArrayBuffer> }) {
  return saveUpload('projects', file)
}

export function deleteUploadedImage(url: string) {
  const parsed = parseUploadUrl(url)
  if (!parsed) return
  const path = resolve(kindDir(parsed.kind), parsed.name)
  if (existsSync(path)) unlinkSync(path)
}

export function readUploadedImage(kind: string, file: string) {
  if (!UPLOAD_KINDS.includes(kind as UploadKind)) return null
  const name = basename(file)
  if (!/^[\w.-]+$/.test(name)) return null
  const path = resolve(kindDir(kind as UploadKind), name)
  if (!existsSync(path)) return null
  const ext = name.split('.').pop()?.toLowerCase() ?? ''
  return {
    body: readFileSync(path),
    type: CONTENT[ext] ?? 'application/octet-stream',
  }
}
