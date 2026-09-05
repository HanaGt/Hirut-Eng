/* Process partner logos: trim uploaded domestic marks and fetch
   international brand marks into public/img/partners/. */
import { createCanvas, loadImage } from '@napi-rs/canvas'
import { mkdirSync, writeFileSync, copyFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const ASSETS = join(
  process.env.USERPROFILE,
  '.cursor/projects/c-Users-lenovo-Documents-hirut-eng/assets',
)
const SRC = join(ROOT, 'media-src/partners')
const OUT = join(ROOT, 'public/img/partners')
mkdirSync(join(SRC, 'domestic'), { recursive: true })
mkdirSync(join(OUT, 'domestic'), { recursive: true })
mkdirSync(join(OUT, 'brands'), { recursive: true })

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'

function trimBy(img, keep) {
  const c = createCanvas(img.width, img.height)
  const ctx = c.getContext('2d')
  ctx.drawImage(img, 0, 0)
  const d = ctx.getImageData(0, 0, img.width, img.height).data
  let top = img.height,
    left = img.width,
    right = -1,
    bottom = -1
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      const i = (y * img.width + x) * 4
      if (keep(d[i], d[i + 1], d[i + 2], d[i + 3], x, y, img.width, img.height)) {
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

function notBlackFrame(r, g, b, a) {
  if (a < 12) return false
  return Math.max(r, g, b) > 28
}

function crop(canvas, x, y, w, h) {
  const out = createCanvas(w, h)
  out.getContext('2d').drawImage(canvas, x, y, w, h, 0, 0, w, h)
  return out
}

function card(src, size = 720) {
  const scale = Math.min((size * 0.82) / src.width, (size * 0.82) / src.height, 1)
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
  const png = canvas.toBuffer('image/png')
  const webp = canvas.toBuffer('image/webp', 90)
  writeFileSync(join(dir, `${slug}.png`), png)
  writeFileSync(join(dir, `${slug}.webp`), webp)
  console.log('wrote', slug, canvas.width + 'x' + canvas.height)
}

async function processDomestic() {
  const files = {
    'ethiopian-defence-foundation':
      'c__Users_lenovo_AppData_Roaming_Cursor_User_workspaceStorage_918e476661faf990f53e012e2730fb93_images_c4e8eca152304d36a2191e7435c4e9f6-bef45ecf-0755-48c3-9397-143f3eb49820.jpg',
    'oromia-water-works':
      'c__Users_lenovo_AppData_Roaming_Cursor_User_workspaceStorage_918e476661faf990f53e012e2730fb93_images_489595d7b2bc4873bd7e2da7e827523b-97e78c6c-4817-4706-b10e-3596558dff9f.jpg',
    'amhara-pipe-factory':
      'c__Users_lenovo_AppData_Roaming_Cursor_User_workspaceStorage_918e476661faf990f53e012e2730fb93_images_IMG_20260904_133600_443-9bd08376-4f4b-4b76-8964-6081eaf11ab1.jpg',
    'defence-construction-enterprise':
      'c__Users_lenovo_AppData_Roaming_Cursor_User_workspaceStorage_918e476661faf990f53e012e2730fb93_images_Web_Photo_Editor-72ab8e96-e883-4f18-b8a6-08cb4134792b.jpg',
    pair: 'c__Users_lenovo_AppData_Roaming_Cursor_User_workspaceStorage_918e476661faf990f53e012e2730fb93_images_photo_2_2026-09-05_12-50-42-8047c183-c773-47a2-bddc-aa0eeab7c164.jpg',
    'zemen-construction':
      'c__Users_lenovo_AppData_Roaming_Cursor_User_workspaceStorage_918e476661faf990f53e012e2730fb93_images_photo_1_2026-09-05_12-50-42-b4f5da9d-5bf9-49a0-b480-ed9708f8b3cd.jpg',
    'defence-construction-design-enterprise':
      'c__Users_lenovo_AppData_Roaming_Cursor_User_workspaceStorage_918e476661faf990f53e012e2730fb93_images_photo_1_2026-09-05_12-55-53-522323ab-b9cb-4a4d-8a87-2961d951e1d3.jpg',
  }

  for (const [slug, name] of Object.entries(files)) {
    const from = join(ASSETS, name)
    if (!existsSync(from)) throw new Error('missing ' + from)
    copyFileSync(from, join(SRC, 'domestic', slug + '.jpg'))
  }

  const keep = {
    'ethiopian-defence-foundation': notPaper,
    'oromia-water-works': notPaper,
    'defence-construction-enterprise': notPaper,
    'zemen-construction': notPaper,
    'defence-construction-design-enterprise': notPaper,
    'amhara-pipe-factory': notBlackFrame,
  }
  for (const [slug, test] of Object.entries(keep)) {
    const img = await loadImage(join(SRC, 'domestic', slug + '.jpg'))
    save(card(trimBy(img, test)), join(OUT, 'domestic'), slug)
  }

  const pair = await loadImage(join(SRC, 'domestic', 'pair.jpg'))
  const pc = createCanvas(pair.width, pair.height)
  pc.getContext('2d').drawImage(pair, 0, 0)
  const left = trimBy(crop(pc, 0, 0, Math.round(pair.width * 0.66), pair.height), notPaper)
  const giwBox = crop(
    pc,
    Math.round(pair.width * 0.62),
    Math.round(pair.height * 0.24),
    Math.round(pair.width * 0.38),
    Math.round(pair.height * 0.52),
  )
  const gctx = giwBox.getContext('2d')
  const gdata = gctx.getImageData(0, 0, giwBox.width, giwBox.height)
  const gd = gdata.data
  for (let i = 0; i < gd.length; i += 4) {
    const r = gd[i]
    const g = gd[i + 1]
    const b = gd[i + 2]
    if (g > 90 && g >= r - 10 && g > b + 12 && !(b > 80 && b > g)) {
      gd[i] = gd[i + 1] = gd[i + 2] = 255
    }
  }
  gctx.putImageData(gdata, 0, 0)
  save(card(left), join(OUT, 'domestic'), 'bkgc')
  save(card(trimBy(giwBox, notPaper)), join(OUT, 'domestic'), 'giw')
}

async function fetchBuffer(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'image/*,*/*' }, redirect: 'follow' })
  if (!res.ok) throw new Error(url + ' -> ' + res.status)
  return Buffer.from(await res.arrayBuffer())
}

async function fetchToCard(url, slug) {
  const buf = await fetchBuffer(url)
  const img = await loadImage(buf)
  save(card(trimBy(img, notPaper)), join(OUT, 'brands'), slug)
}

async function fetchBrands() {
  const oricaPng = join(ROOT, 'public/img/logo/orica.png')
  if (existsSync(oricaPng)) {
    const img = await loadImage(oricaPng)
    save(card(img), join(OUT, 'brands'), 'orica-digital-solutions')
  }

  const tries = [
    ['perkins', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Perkins-Logo.svg/800px-Perkins-Logo.svg.png'],
    ['hunter', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Hunter_Industries_Inc_logo.svg/800px-Hunter_Industries_Inc_logo.svg.png'],
    ['sisgeo', 'https://sisgeo.com/wp-content/uploads/2023/04/Logo-nuovo-prova.png'],
    ['jcb', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/JCB_yellow_logo.svg/640px-JCB_yellow_logo.svg.png'],
    ['jcb', 'https://upload.wikimedia.org/wikipedia/en/8/83/JCB_logo.png'],
    ['jcb', 'https://upload.wikimedia.org/wikipedia/commons/4/4e/JCB_logo_yellow.png'],
    ['encardio-rite', 'https://www.encardio.com/hs-fs/hubfs/Encardio%20Rite%20Logo.png'],
    ['encardio-rite', 'https://www.encardio.com/hubfs/Encardio-Rite-logo.png'],
    ['rst-instruments', 'https://www.rstinstruments.com/wp-content/uploads/RST-Instruments-Logo.png'],
    ['rst-instruments', 'https://rstinstruments.com/wp-content/uploads/2021/04/rst-logo.png'],
    ['pentax', 'https://www.pentax-pumps.it/pentax/wp-content/uploads/sites/5/pentax-logo.png'],
    ['pentax', 'https://www.pentax-pumps.it/wp-content/uploads/pentax-logo.png'],
    ['ustunel', 'https://www.ustunel.com.tr/wp-content/uploads/ustunel-logo.png'],
    ['laxmidrip', 'https://www.laxmirubberdrip.com/assets/images/logo.png'],
    ['aim-industrials', 'https://aimindustrials.com/wp-content/uploads/logo.png'],
    ['sme-monitoring', 'https://www.smemonitoring.com/wp-content/uploads/logo.png'],
  ]

  const done = new Set(['orica-digital-solutions'])
  for (const [slug, url] of tries) {
    if (done.has(slug)) continue
    try {
      await fetchToCard(url, slug)
      done.add(slug)
    } catch (e) {
      console.log('skip', slug, String(e.message).slice(0, 120))
    }
  }
}

await processDomestic()
await fetchBrands()
console.log('done')
