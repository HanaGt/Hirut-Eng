/* ============================================================
   Prepares the official logo for the web from the supplied
   background-removed PNGs in media-src/logo/.

   Produces, into public/img/logo/:
     mark.(webp|png)         official colours, trimmed   light surfaces
     mark-reversed.(webp|png) dark strokes turned paper  dark surfaces
     lockup.(webp|png)        full horizontal lockup, trimmed
     lockup-reversed.(webp|png)
     favicon-32.png, favicon-180.png

   The reversed pair is the conventional treatment for placing a
   dark logo on a dark ground: the near-black strokes become paper,
   the blue wave keeps its hue (lifted slightly so it holds up on
   ink). Nothing is redrawn  only the dark ink is swapped.

   Run: node tools/make-logo.mjs
   ============================================================ */
import { createCanvas, loadImage } from '@napi-rs/canvas'
import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const SRC = new URL('../media-src/logo/', import.meta.url)
const OUT = new URL('../public/img/logo/', import.meta.url)
mkdirSync(OUT, { recursive: true })

const PAPER = [249, 248, 244] // --paper

/** Crop away fully-transparent margins so the mark optically fills its box. */
function trim(img) {
  const c = createCanvas(img.width, img.height)
  const x = c.getContext('2d')
  x.drawImage(img, 0, 0)
  const d = x.getImageData(0, 0, img.width, img.height).data
  let top = img.height, left = img.width, right = -1, bottom = -1
  for (let y = 0; y < img.height; y++) {
    for (let px = 0; px < img.width; px++) {
      if (d[(y * img.width + px) * 4 + 3] > 12) {
        if (y < top) top = y
        if (y > bottom) bottom = y
        if (px < left) left = px
        if (px > right) right = px
      }
    }
  }
  if (right < 0) return { canvas: c, w: img.width, h: img.height }
  const w = right - left + 1
  const h = bottom - top + 1
  const out = createCanvas(w, h)
  out.getContext('2d').drawImage(c, left, top, w, h, 0, 0, w, h)
  return { canvas: out, w, h }
}

/** Swap the dark ink strokes for paper; leave the blue wave alone. */
function reverse(canvas) {
  const w = canvas.width
  const h = canvas.height
  const out = createCanvas(w, h)
  const ctx = out.getContext('2d')
  ctx.drawImage(canvas, 0, 0)
  const img = ctx.getImageData(0, 0, w, h)
  const d = img.data
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] < 8) continue
    const r = d[i], g = d[i + 1], b = d[i + 2]
    const max = Math.max(r, g, b)
    const blueLead = b - Math.max(r, g)
    // Dark, low-saturation pixels are the ink strokes and the wordmark.
    // A strongly blue pixel is the wave  keep it, lift it a little.
    if (blueLead > 26 && max > 70) {
      d[i] = Math.min(255, r + 26)
      d[i + 1] = Math.min(255, g + 30)
      d[i + 2] = Math.min(255, b + 18)
    } else if (max < 178) {
      // Ink strokes go fully to paper; only the anti-aliased fringe
      // (and the source's JPEG mottling) rides the ramp, otherwise the
      // strokes come out a muddy grey instead of clean paper.
      const t = Math.min(1, Math.max(0, (178 - max) / 78))
      d[i] = Math.round(r + (PAPER[0] - r) * t)
      d[i + 1] = Math.round(g + (PAPER[1] - g) * t)
      d[i + 2] = Math.round(b + (PAPER[2] - b) * t)
    }
  }
  ctx.putImageData(img, 0, 0)
  return out
}

function scaleTo(canvas, targetH) {
  const scale = targetH / canvas.height
  const w = Math.round(canvas.width * scale)
  const out = createCanvas(w, targetH)
  const ctx = out.getContext('2d')
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(canvas, 0, 0, w, targetH)
  return out
}

function save(canvas, name) {
  writeFileSync(fileURLToPath(new URL(name + '.png', OUT)), canvas.toBuffer('image/png'))
  writeFileSync(fileURLToPath(new URL(name + '.webp', OUT)), canvas.toBuffer('image/webp', 92))
  console.log('wrote', name, canvas.width + 'x' + canvas.height)
}

const markImg = await loadImage(fileURLToPath(new URL('mark-source.png', SRC)))
const lockupImg = await loadImage(fileURLToPath(new URL('lockup-source.png', SRC)))

const mark = trim(markImg).canvas
const lockup = trim(lockupImg).canvas

// Marks render at ~40px CSS; 256px covers 3x displays comfortably.
save(scaleTo(mark, 256), 'mark')
save(scaleTo(reverse(mark), 256), 'mark-reversed')
save(scaleTo(lockup, 200), 'lockup')
save(scaleTo(reverse(lockup), 200), 'lockup-reversed')

// Favicons: square, mark centred with a little breathing room.
for (const size of [32, 180]) {
  const c = createCanvas(size, size)
  const ctx = c.getContext('2d')
  const pad = Math.round(size * 0.08)
  const box = size - pad * 2
  const s = Math.min(box / mark.width, box / mark.height)
  const w = mark.width * s
  const h = mark.height * s
  ctx.drawImage(mark, (size - w) / 2, (size - h) / 2, w, h)
  writeFileSync(fileURLToPath(new URL(`favicon-${size}.png`, OUT)), c.toBuffer('image/png'))
  console.log('wrote favicon-' + size)
}
