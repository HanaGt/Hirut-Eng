/* ============================================================
   Prepares the supplied Orica logo for the co-brand slot.

   This is a THIRD-PARTY TRADEMARK. The only operation performed is
   cropping the surrounding border/whitespace. The mark itself is
   untouched: no recolouring, no restyling, no redrawing. It is shown
   in its official colours on a white chip, the treatment the brief
   requires.

   Run: node tools/make-orica.mjs
   ============================================================ */
import { createCanvas, loadImage } from '@napi-rs/canvas'
import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const SRC = fileURLToPath(new URL('../media-src/logo/orica-source.png', import.meta.url))
const OUT = new URL('../public/img/logo/', import.meta.url)
mkdirSync(OUT, { recursive: true })

const img = await loadImage(SRC)
const c = createCanvas(img.width, img.height)
const ctx = c.getContext('2d')
ctx.drawImage(img, 0, 0)
const d = ctx.getImageData(0, 0, img.width, img.height).data

let top = img.height, left = img.width, right = -1, bottom = -1
for (let y = 0; y < img.height; y++) {
  for (let x = 0; x < img.width; x++) {
    const i = (y * img.width + x) * 4
    const r = d[i], g = d[i + 1], b = d[i + 2], a = d[i + 3]
    if (a < 20) continue
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    if (!(max < 205 || max - min > 40)) continue  // ignore paper and the faint frame
    if (y < top) top = y
    if (y > bottom) bottom = y
    if (x < left) left = x
    if (x > right) right = x
  }
}

const pad = 2
left = Math.max(0, left - pad); top = Math.max(0, top - pad)
right = Math.min(img.width - 1, right + pad); bottom = Math.min(img.height - 1, bottom + pad)
const w = right - left + 1, h = bottom - top + 1

const out = createCanvas(w, h)
out.getContext('2d').drawImage(c, left, top, w, h, 0, 0, w, h)
writeFileSync(fileURLToPath(new URL('orica.png', OUT)), out.toBuffer('image/png'))
writeFileSync(fileURLToPath(new URL('orica.webp', OUT)), out.toBuffer('image/webp', 92))
console.log('cropped ' + img.width + 'x' + img.height + ' -> ' + w + 'x' + h + ' (border trimmed only)')
