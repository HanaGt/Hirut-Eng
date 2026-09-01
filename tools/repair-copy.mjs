/* ============================================================
   Idempotent copy/markup repair.

   The working tree has been reset to an earlier commit more than once
   during development, discarding recent edits: the Orica logo markup
   disappears from PageBits.tsx, and em dashes vanish from visible copy
   (leaving a double space). This script puts both right and is safe to
   re-run at any time.

     1. Em dashes are written as ASCII escapes that survive a reset or
        re-encode:  \u2014 in TS/TSX string literals, &mdash; in JSX
        text, \2014 in CSS content.
     2. The Orica co-brand slot is ensured to hold the real logo.

   Run: node tools/repair-copy.mjs           (report only)
        node tools/repair-copy.mjs --apply
   ============================================================ */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const APPLY = process.argv.includes('--apply')
const ROOT = fileURLToPath(new URL('../src/', import.meta.url))
const BS = String.fromCharCode(92)
const EMDASH = String.fromCharCode(8212)
const JS_ESC = BS + 'u2014'
const CSS_ESC = BS + '2014 '
const changes = []

const read = (p) => fs.readFileSync(p, 'utf8')
const write = (p, s) => { if (APPLY) fs.writeFileSync(p, s, 'utf8') }

const files = []
;(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name)
    if (e.isDirectory()) walk(p)
    else if (/\.(tsx?|css)$/.test(e.name)) files.push(p)
  }
})(ROOT)

/* Track quote/comment state so a string literal can be told from JSX
   text, and comments are left alone. */
function repairLine(line, isCss) {
  let out = ''
  let quote = null
  let lineComment = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    const n = line[i + 1]
    if (!quote && !lineComment && c === '/' && n === '/') lineComment = true
    if (!lineComment) {
      if (!quote && (c === "'" || c === '"' || c === '`')) { quote = c; out += c; continue }
      if (quote && c === quote && line[i - 1] !== BS) { quote = null; out += c; continue }
    }
    if (c === EMDASH && !lineComment) {
      out += isCss ? (quote ? CSS_ESC : c) : quote ? JS_ESC : '&mdash;'
      continue
    }
    const prevOk = /[\w.,)%"'\u201d]$/.test(out)
    const nextOk = /^ [A-Za-z"'\u201c]/.test(line.slice(i + 1))
    if (c === ' ' && n === ' ' && !lineComment && !isCss && prevOk && nextOk) {
      out += quote ? ' ' + JS_ESC + ' ' : ' &mdash; '
      i++
      continue
    }
    out += c
  }
  return out
}

for (const f of files) {
  const isCss = f.endsWith('.css')
  const src = read(f)
  // CSS has no prose outside `content:` strings; only touch it when a
  // literal em dash is actually there to normalise.
  if (isCss && !src.includes(EMDASH)) continue
  const out = src.split('\n').map((l) => repairLine(l, isCss)).join('\n')
  if (out !== src) { changes.push('dashes: ' + path.relative(ROOT, f)); write(f, out) }
}

/* the CSS placeholder chip label */
const cssPath = path.join(ROOT, 'styles.css')
let css = read(cssPath)
if (/content: 'PLACEHOLDER {2,}'/.test(css)) {
  css = css.replace(/content: 'PLACEHOLDER {2,}'/, "content: 'PLACEHOLDER " + CSS_ESC + " '")
  changes.push('dashes: styles.css PLACEHOLDER label')
  write(cssPath, css)
}

/* the one em dash that wrapped across a line break */
const pb = path.join(ROOT, 'components', 'PageBits.tsx')
let s = read(pb)
const wrapped = /not guessed at\s*\n(\s*)Hirut Engineering/
if (wrapped.test(s)) {
  s = s.replace(wrapped, 'not guessed at\n$1&mdash; Hirut Engineering')
  changes.push('dashes: PageBits line-break case')
  write(pb, s)
}

/* Orica logo into the co-brand slot */
s = read(pb)
if (!s.includes('orica-logo-slot--filled')) {
  const slot = /<span className="orica-logo-slot">[\s\S]*?<\/span>/
  const replacement = [
    '{/* Third-party trademark: shown as supplied, in its official',
    '                colours on a white chip. Never recoloured or redrawn. */}',
    '            <span className="orica-logo-slot orica-logo-slot--filled">',
    '              <picture>',
    '                <source type="image/webp" srcSet="/img/logo/orica.webp" />',
    '                <img',
    '                  src="/img/logo/orica.png"',
    '                  alt="Orica"',
    '                  width={234}',
    '                  height={76}',
    '                  loading="lazy"',
    '                  decoding="async"',
    '                />',
    '              </picture>',
    '            </span>',
  ].join('\n')
  if (slot.test(s)) { changes.push('orica: logo restored into slot'); write(pb, s.replace(slot, replacement)) }
  else changes.push('orica: SLOT NOT FOUND - check PageBits.tsx by hand')
}

/* filled-chip styling */
css = read(cssPath)
if (!css.includes('orica-logo-slot--filled')) {
  const anchor = '.orica-exclusive {'
  const block = [
    '/* holding the real mark now: solid chip, no dashed "pending" border */',
    '.orica-logo-slot--filled {',
    '  border: 1px solid var(--line);',
    '  padding: 10px 16px;',
    '  width: auto;',
    '  min-width: 170px;',
    '}',
    '.orica-logo-slot--filled img { width: 150px; height: auto; }',
    '',
    '',
  ].join('\n')
  if (css.includes(anchor)) { changes.push('orica: chip styling restored'); write(cssPath, css.replace(anchor, block + anchor)) }
  else changes.push('orica: CSS ANCHOR NOT FOUND - check styles.css by hand')
}

console.log(changes.length ? changes.map((c) => ' - ' + c).join('\n') : ' nothing to repair')
console.log(APPLY ? 'APPLIED' : '(dry run - pass --apply to write)')
