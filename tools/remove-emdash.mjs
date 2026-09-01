/* ============================================================
   Removes every em dash from the site, leaving the copy
   grammatically correct.

   Em dashes were doing several different jobs, so each is rewritten
   deliberately rather than swapped for one character:
     appositive / explanation -> colon
     parenthetical pair       -> parentheses
     joined clauses           -> full stop or comma
     page titles              -> pipe
     small label separators   -> middot

   The rewrites live in tools/emdash-table.json, keyed on a @D@
   sentinel so the table never has to contain a dash itself.
   Code comments are not part of the website, so any dash left in one
   becomes a plain hyphen.

   Idempotent: re-run any time (for example after a git reset).

   Run: node tools/remove-emdash.mjs           (report)
        node tools/remove-emdash.mjs --apply
   ============================================================ */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const APPLY = process.argv.includes('--apply')
const ROOT = fileURLToPath(new URL('../src/', import.meta.url))
const TABLE = JSON.parse(
  fs.readFileSync(fileURLToPath(new URL('./emdash-table.json', import.meta.url)), 'utf8'),
)

const BS = String.fromCharCode(92)
const EM = String.fromCharCode(8212)
const D = '@D@'

/* every form the dash currently takes in source */
const forms = [BS + 'u2014', '&mdash;', BS + '2014 ', BS + '2014', EM]

const files = []
;(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name)
    if (e.isDirectory()) walk(p)
    else if (/\.(tsx?|css)$/.test(e.name)) files.push(p)
  }
})(ROOT)

let rewrites = 0
let commentHyphens = 0
const unmatched = []

for (const f of files) {
  const src = fs.readFileSync(f, 'utf8')
  let s = src
  for (const form of forms) s = s.split(form).join(D)
  if (!s.includes(D)) continue

  for (const [find, rep] of TABLE) {
    while (s.includes(find)) {
      s = s.replace(find, rep)
      rewrites++
    }
  }

  s = s
    .split('\n')
    .map((line) => {
      if (!line.includes(D)) return line
      const t = line.trim()
      const isComment =
        t.startsWith('//') || t.startsWith('*') || t.startsWith('/*') || t.startsWith('{/*')
      if (!isComment) unmatched.push(path.relative(ROOT, f) + ': ' + t.slice(0, 130))
      commentHyphens += line.split(D).length - 1
      return line.split(D).join('-')
    })
    .join('\n')

  if (s !== src && APPLY) fs.writeFileSync(f, s, 'utf8')
}

console.log('copy rewrites:', rewrites)
console.log('dashes in comments turned into a hyphen:', commentHyphens)
if (unmatched.length) {
  console.log('\nUNMATCHED in visible copy (add these to the table):')
  for (const u of unmatched) console.log('  ' + u)
} else {
  console.log('no unmatched occurrences in visible copy')
}
console.log(APPLY ? 'APPLIED' : '(dry run)')
