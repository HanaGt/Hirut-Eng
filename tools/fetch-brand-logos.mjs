import { createCanvas, loadImage } from '@napi-rs/canvas'
import { mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const OUT = join(ROOT, 'public/img/partners/brands')
mkdirSync(OUT, { recursive: true })

const UA = 'HirutEngineeringSite/1.0 (partner logo fetch; local build)'

function notPaper(r, g, b, a) {
  if (a < 12) return false
  return Math.max(r, g, b) < 248 || Math.max(r, g, b) - Math.min(r, g, b) > 18
}

function trimBy(img, keep) {
  const c = createCanvas(img.width, img.height)
  const ctx = c.getContext('2d')
  ctx.drawImage(img, 0, 0)
  const d = ctx.getImageData(0, 0, img.width, img.height).data
  let top = img.height, left = img.width, right = -1, bottom = -1
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
  const pad = 4
  left = Math.max(0, left - pad)
  top = Math.max(0, top - pad)
  right = Math.min(img.width - 1, right + pad)
  bottom = Math.min(img.height - 1, bottom + pad)
  const out = createCanvas(right - left + 1, bottom - top + 1)
  out.getContext('2d').drawImage(c, left, top, out.width, out.height, 0, 0, out.width, out.height)
  return out
}

function card(src, size = 720) {
  const scale = Math.min((size * 0.82) / src.width, (size * 0.82) / src.height, 4)
  const w = Math.max(1, Math.round(src.width * scale))
  const h = Math.max(1, Math.round(src.height * scale))
  const out = createCanvas(size, size)
  const ctx = out.getContext('2d')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, size, size)
  ctx.drawImage(src, Math.round((size - w) / 2), Math.round((size - h) / 2), w, h)
  return out
}

function save(canvas, slug) {
  writeFileSync(join(OUT, `${slug}.png`), canvas.toBuffer('image/png'))
  writeFileSync(join(OUT, `${slug}.webp`), canvas.toBuffer('image/webp', 90))
  console.log('wrote', slug)
}

async function fetchBuf(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8' },
    redirect: 'follow',
  })
  if (!res.ok) throw new Error(res.status + ' ' + url)
  const buf = Buffer.from(await res.arrayBuffer())
  if (buf.length < 400) throw new Error('tiny ' + url)
  return buf
}

const brands = {
  perkins: [
    'https://logo.clearbit.com/perkins.com',
    'https://www.google.com/s2/favicons?domain=perkins.com&sz=256',
    'https://commons.wikimedia.org/wiki/Special:FilePath/Perkins-Logo.svg',
  ],
  hunter: [
    'https://logo.clearbit.com/hunterindustries.com',
    'https://www.hunterirrigation.com/themes/custom/hunter/logo.svg',
    'https://hunterindustries.com/themes/hunter_industries/img/Hunter_Logo.svg',
  ],
  jcb: [
    'https://logo.clearbit.com/jcb.com',
    'https://www.jcb.com/favicon.ico',
  ],
  'encardio-rite': [
    'https://logo.clearbit.com/encardio.com',
    'https://www.encardio.com/hubfs/raw_assets/public/EncardioRite_July2024/images/logo.svg',
  ],
  'rst-instruments': [
    'https://logo.clearbit.com/rstinstruments.com',
    'https://logo.clearbit.com/orica.com',
  ],
  pentax: [
    'https://logo.clearbit.com/pentax-pumps.it',
    'https://www.pentax-pumps.it/favicon.ico',
  ],
  ustunel: [
    'https://logo.clearbit.com/ustunel.com.tr',
  ],
  'aim-industrials': [
    'https://logo.clearbit.com/aimindustrials.com',
    'https://logo.clearbit.com/aim-industrials.com',
  ],
  'sme-monitoring': [
    'https://logo.clearbit.com/smemonitoring.com',
    'https://logo.clearbit.com/sme-monitoring.com',
  ],
}

for (const [slug, urls] of Object.entries(brands)) {
  if (existsSync(join(OUT, slug + '.png'))) {
    console.log('have', slug)
    continue
  }
  let ok = false
  for (const url of urls) {
    try {
      const buf = await fetchBuf(url)
      const img = await loadImage(buf)
      save(card(trimBy(img, notPaper)), slug)
      ok = true
      break
    } catch (e) {
      console.log('skip', slug, String(e.message).slice(0, 100))
    }
  }
  if (!ok) console.log('FAILED', slug)
}
