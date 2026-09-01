/* ============================================================
   Downloads the page-header clips once and re-encodes them small,
   into public/video/headers/.

   Self-hosted rather than hotlinked on purpose: the stock CDN sets
   third-party cookies on every visitor (a privacy problem on a client
   site, and it costs ~20 Lighthouse Best-Practices points), and its
   originals are ~2.3 MB each. Trimmed and re-encoded they land around
   a quarter of that, served from our own origin with our own caching.

   Sources are free-licence Pexels clips; swap the URLs for the
   company's own footage when it arrives and re-run.

   Run: node tools/fetch-header-videos.mjs
   ============================================================ */
import { spawn } from 'node:child_process'
import { mkdirSync, writeFileSync, existsSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import ffmpegPath from 'ffmpeg-static'

const OUT = new URL('../public/video/headers/', import.meta.url)
const TMP = new URL('../media-src/headers/', import.meta.url)
mkdirSync(OUT, { recursive: true })
mkdirSync(TMP, { recursive: true })

const PX = (id, r) => `https://videos.pexels.com/video-files/${id}/${id}-${r}.mp4`

const CLIPS = [
  { name: 'about', url: PX('8964796', 'sd_640_360_25fps'), start: 0, dur: 8 },
  { name: 'products', url: PX('6060194', 'sd_640_360_30fps'), start: 1, dur: 8 },
  { name: 'services', url: PX('11649490', 'sd_640_360_24fps'), start: 2, dur: 8 },
  { name: 'projects', url: PX('4404097', 'sd_640_360_24fps'), start: 0, dur: 8 },
  { name: 'partners', url: PX('3998659', 'sd_640_360_24fps'), start: 0, dur: 8 },
  { name: 'contact', url: PX('17298949', 'sd_640_360_30fps'), start: 0, dur: 8 },
]

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'

const run = (cmd, args) =>
  new Promise((res, rej) => {
    const p = spawn(cmd, args, { stdio: ['ignore', 'ignore', 'pipe'] })
    let err = ''
    p.stderr.on('data', (d) => (err += d))
    p.on('close', (c) => (c === 0 ? res() : rej(new Error(err.slice(-600)))))
  })

for (const clip of CLIPS) {
  const raw = fileURLToPath(new URL(`${clip.name}-source.mp4`, TMP))
  if (!existsSync(raw)) {
    process.stdout.write(`downloading ${clip.name}… `)
    const res = await fetch(clip.url, { headers: { 'User-Agent': UA } })
    if (!res.ok) {
      console.log('FAILED', res.status)
      continue
    }
    writeFileSync(raw, Buffer.from(await res.arrayBuffer()))
    console.log((statSync(raw).size / 1048576).toFixed(2) + ' MB')
  }

  const out = fileURLToPath(new URL(`${clip.name}.mp4`, OUT))
  const poster = fileURLToPath(new URL(`${clip.name}.jpg`, OUT))

  // 854×480 is plenty behind a scrim; audio stripped; short loop.
  await run(ffmpegPath, [
    '-y', '-ss', String(clip.start), '-t', String(clip.dur), '-i', raw,
    '-an',
    '-vf', 'scale=854:480:force_original_aspect_ratio=increase,crop=854:480,fps=24',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '31', '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    out,
  ])
  await run(ffmpegPath, ['-y', '-i', out, '-frames:v', '1', '-q:v', '5', poster])
  console.log(`  ${clip.name}.mp4  ${(statSync(out).size / 1024).toFixed(0)} KB`)
}
console.log('done')
