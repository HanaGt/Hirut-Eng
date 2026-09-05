/* Recrop the BKGC/GIW pair and card remaining brand logos from local files. */
import { createCanvas, loadImage } from '@napi-rs/canvas'
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const SRC = join(ROOT, 'media-src/partners')
const OUT = join(ROOT, 'public/img/partners')
mkdirSync(join(OUT, 'domestic'), { recursive: true })
mkdirSync(join(OUT, 'brands'), { recursive: true })

function trimBy(img, keep) {
  const c = createCanvas(img.width, img.height)
  const ctx = c.getContext('2d')
  ctx.drawImage(img, 0, 0)
  const d = ctx.getImageData(0, 0, img.width, img.height).data
  let top = img.height
  let left = img.width
  let right = -1
  let bottom = -1
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      const i = (y * img.width + x) * 4
      if (keep(d[i], d[i + 1], d[i + 2], d[i + 3])) {
        if (y < top) top = y
        if (y > bottom) bottom = y
        if (x < left) left = x
        if (x > right) right = x
      }
    }
  }
  if (right < 0) return c
  const pad = 6
  left = Math.max(0, left - pad)
  top = Math.max(0, top - pad)
  right = Math.min(img.width - 1, right + pad)
  bottom = Math.min(img.height - 1, bottom + pad)
  const w = right - left + 1
  const h = bottom - top + 1
  const out = createCanvas(w, h)
  out.getContext('2d').drawImage(c, left, top, w, h, 0, 0, w, h)
  return out
}

function notPaper(r, g, b, a) {
  if (a < 12) return false
  return Math.max(r, g, b) < 248 || Math.max(r, g, b) - Math.min(r, g, b) > 18
}

function notNearBlack(r, g, b, a) {
  if (a < 12) return false
  return Math.max(r, g, b) > 26
}

function crop(canvas, x, y, w, h) {
  const out = createCanvas(w, h)
  out.getContext('2d').drawImage(canvas, x, y, w, h, 0, 0, w, h)
  return out
}

function mapPixels(canvas, fn) {
  const ctx = canvas.getContext('2d')
  const img = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const d = img.data
  for (let i = 0; i < d.length; i += 4) {
    const next = fn(d[i], d[i + 1], d[i + 2], d[i + 3])
    if (next) {
      d[i] = next[0]
      d[i + 1] = next[1]
      d[i + 2] = next[2]
      d[i + 3] = next[3]
    }
  }
  ctx.putImageData(img, 0, 0)
  return canvas
}

function wipeLime(canvas) {
  return mapPixels(canvas, (r, g, b, a) => {
    if (g > 120 && g > r + 20 && g > b + 30 && r < 210) return [255, 255, 255, a]
    return null
  })
}

function card(src, size = 720) {
  const scale = Math.min((size * 0.84) / src.width, (size * 0.84) / src.height, 1)
  const w = Math.max(1, Math.round(src.width * scale))
  const h = Math.max(1, Math.round(src.height * scale))
  const out = createCanvas(size, size)
  const ctx = out.getContext('2d')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, size, size)
  ctx.drawImage(src, Math.round((size - w) / 2), Math.round((size - h) / 2), w, h)
  return out
}

function save(canvas, dir, slug) {
  writeFileSync(join(dir, `${slug}.png`), canvas.toBuffer('image/png'))
  writeFileSync(join(dir, `${slug}.webp`), canvas.toBuffer('image/webp', 90))
  console.log('wrote', slug, canvas.width + 'x' + canvas.height)
}

async function recropPair() {
  const pair = await loadImage(join(SRC, 'domestic', 'pair.jpg'))
  const pc = createCanvas(pair.width, pair.height)
  pc.getContext('2d').drawImage(pair, 0, 0)
  const split = Math.round(pair.width * 0.66)
  const left = trimBy(crop(pc, 0, 0, split, pair.height), notPaper)
  const right = trimBy(wipeLime(crop(pc, split, 0, pair.width - split, pair.height)), notPaper)
  save(card(left), join(OUT, 'domestic'), 'bkgc')
  save(card(right), join(OUT, 'domestic'), 'giw')
}

async function fromFile(path, slug, keep = notPaper) {
  if (!existsSync(path)) {
    console.log('missing', path)
    return
  }
  try {
    const img = await loadImage(path)
    save(card(trimBy(img, keep)), join(OUT, 'brands'), slug)
  } catch (e) {
    console.log('skip', slug, e.message)
  }
}

async function processBrands() {
  await fromFile(join(SRC, 'brands', 'jcb.png'), 'jcb')
  await fromFile(join(SRC, 'brands', 'encardio.png'), 'encardio-rite', notNearBlack)
  await fromFile(join(SRC, 'brands', 'rst.png'), 'rst-instruments')
  await fromFile(join(SRC, 'brands', 'sme.png'), 'sme-monitoring', notNearBlack)
  await fromFile(join(SRC, 'brands', 'pentax.jpg'), 'pentax')

  for (const slug of ['hunter', 'ustunel']) {
    const svg = join(SRC, 'brands', `${slug}.svg`)
    if (!existsSync(svg)) continue
    copyFileSync(svg, join(OUT, 'brands', `${slug}.svg`))
    console.log('copied', slug + '.svg')
    try {
      const img = await loadImage(svg)
      save(card(trimBy(img, notPaper)), join(OUT, 'brands'), slug)
    } catch (e) {
      console.log('svg raster skip', slug, e.message)
    }
  }
}

await recropPair()
await processBrands()
console.log('done')
