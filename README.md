# Hirut Engineering & General Trading PLC — Website (v2)

TypeScript React on **TanStack Start** with file-based routing (TanStack Router). Every route is **statically prerendered at build time** — view-source shows the full page on all 28 emitted pages — and hydrates into an interactive React app. The approved v1 static build is preserved in [`reference-v1/`](reference-v1/).

## Commands

```
npm install
npm run dev        # dev server on :3000
npm run build      # typecheck-clean build + prerender of every route into dist/
npx tsc --noEmit   # typecheck
```

Deploy: serve `dist/client/` as static files (any static host / CDN / nginx). Map extensionless URLs to `<path>/index.html`. Give `/assets/**` (hashed) `Cache-Control: public, max-age=31536000, immutable`, and serve gzip/brotli.

## Structure

```
src/
  styles.css                 Design tokens + full design system (ONLY place hexes exist)
  router.tsx                 Router factory
  routes/
    __root.tsx               Document shell, header/footer, 240ms route transitions
    index.tsx                Home (10 approved sections)
    about.tsx — services.tsx — projects.tsx — partners.tsx — contact.tsx
    products.index.tsx       Hub with Water/Ground/Power filter
    products.$category.tsx   All 7 category pages (data-driven, prerendered)
  components/
    Chrome.tsx               Header (scroll state, mobile drawer) + Footer
    ScrubBand.tsx            §4.1 scroll-scrubbed time-lapse (self-gating)
    StatsBand.tsx            Animated counters (SSR-final values)
    PageBits.tsx             PageHero, CtaBand, OricaBand (co-branded), Eyebrow
    Waves.tsx                The logo's layered wave-sweep motif (dividers, gauge)
    Placeholders.tsx         PhChip / PhMedia / SampleImg (honesty rules)
    ContactForm.tsx          Validated inquiry form (+ ?type= preselect)
    Logo.tsx                 Vector recreation of the logomark
    motion.tsx               Reveal wiring, bg-video lazy-load, RM / Save-Data helpers
  data/
    products.ts              The 7 categories — all approved copy, verbatim
    site.ts                  Stats, partners, pillars, projects, leadership (real, verbatim)
    media.ts                 Every placeholder photo URL — the one file to edit
media-src/timelapse.mp4      Supplied source clip (not deployed)
tools/scrub-captions.filter — ffmpeg caption layout burned into the scrub video
public/video, public/img     Built video + posters, favicon
```

## Brand system

The original water-and-ground palette and type pairing are in force (restored at client request; the interim Montserrat/`#0066A8` system was reverted).

- **Tokens** live once, in `:root` of `src/styles.css`: ink navy (`--ink-950/900/800/700/100`) for authority, hydro cyan (`--hydro-300…700`) as the living accent, warm sand (`--sand-100…600`) for the geotechnical note, and `--paper` / `--paper-2` / `--white` surfaces. Hairlines and tints derive via `color-mix`; every font size references a `--text-*` token. A grep for hex values outside the token block returns nothing.
- **Contrast is measured, not eyeballed.** Every text/background pair in use passes WCAG AA — verified by script: body 14.0:1, muted 6.1:1, links `--hydro-700` 5.1:1 on paper, white-on-`--hydro-700` buttons 5.4:1, `--hydro-300` on ink 9.6–10.5:1, placeholder chips 6.0:1. Note the specificity trap that this fixed: `.band-dark a` / `.site-footer a` out-specify `.btn-primary` and were tinting button labels to 4.07:1, so explicit `a.btn-primary` rules restore white.
- **Motif**: the logo's layered wave sweep (`Waves.tsx`) — the animated hero/CTA wave bands, the scrub band's phase gauge, eyebrow accents. Nothing competes with it.
- **Type**: Space Grotesk display (700 headings / 600 subheads and labels) + Inter body at 16px/1.6. Self-hosted Fontsource **variable** fonts — one file per family downloads for Latin, `font-display: swap` on every face. Noto Sans Ethiopic sits in both stacks for the future Amharic build.

## The logo

The **official logo** is in place. Sources sit in `media-src/logo/` (the supplied background-removed PNGs, mark and full lockup) and `tools/make-logo.mjs` prepares the web assets into `public/img/logo/`:

| File | Use |
|---|---|
| `mark.webp/.png` | official colours — light surfaces |
| `mark-reversed.webp/.png` | dark ink strokes swapped for paper — ink bands |
| `lockup(-reversed).webp/.png` | full horizontal lockup, for print/social |
| `favicon-32.png`, `favicon-180.png` | browser + Apple touch icon |

The mark is dark navy, so on the ink header, the footer and the dark bands it would all but disappear. The reversed variant is the conventional fix: **only the dark ink is swapped for paper — the blue wave keeps its hue and nothing is redrawn.** `HirutMark` renders both and CSS picks per surface (`.band-dark`, `.band-ink`, `.site-footer`, and the un-scrolled `.header-on-dark`), so the right mark paints on the first frame with no flash and no JS.

Re-run `node tools/make-logo.mjs` after replacing either source file. If a true vector (`.svg`/`.ai`) ever arrives it should replace the rasters — the supplied files are compressed bitmaps, so the strokes carry faint JPEG mottling that a vector would not.

## Motion

- **Persistent ambient wave flow** — `FlowWaves` renders three layered wave strokes that drift continuously beneath the hero and above every CTA band. Each layer tiles one 1440-unit path twice and translates by exactly one tile, so the loop is seamless; it is transform-only, runs indefinitely, and costs nothing measurable (Lighthouse reports it composited, CLS 0).
- **Two-way section reveal** — “What we do” is four photo tiles that *compose on entry and decompose on exit*, so the band is re-composed every time it is scrolled through rather than animating once and freezing. `CycleRevealEffects` toggles `.reveal-cycle` in both directions (it never un-observes); each tile rises and fades on a 90ms stagger while its photograph settles out of a slight over-scale, and the caption block follows a beat behind. Same progressive-enhancement contract as the one-way reveals: the server HTML is fully visible and the hidden state is only armed after hydration, never under reduced motion.
- **Self-cycling scrub band** — until the time-lapse video is supplied, the four construction phases advance on a 3.2s cycle with the depth gauge filling behind them, so the section is never inert. The cycle stands down automatically the moment the real scroll-scrub goes live.
- Plus scroll reveals, animated stat counters, card hover lifts, and 240ms route transitions. Everything is transform/opacity-only, and all of it stops under `prefers-reduced-motion`.

## Media in this build

Everything visible is in place so the site can be judged as a whole. Two different kinds of stand-in are used, and both are labelled on-page:

| Asset | Source | Replace by |
|---|---|---|
| `public/video/timelapse-scrub.mp4` | the supplied `media-src/timelapse.mp4`, captions burned in | re-running the ffmpeg command below on new footage |
| `public/video/hero-site.mp4` + hero/scrub posters | cut from the same supplied clip | same |
| All photography | **hotlinked stock from Unsplash's CDN** | editing `src/data/media.ts` |

**The photography is external.** `src/data/media.ts` is the only file to touch: every image is one entry, and the `stock()` helper builds the `src`/`srcset`. Decorative photos that sit behind a scrim with text over them use `stockSoft()` instead — lower quality and smaller widths, because the overlay hides the difference and those four load during the initial viewport pass (it took the homepage from 83 back to 95 on Lighthouse). Before launch these should be **self-hosted** rather than hotlinked — an external CDN can be blocked (it was, inside Lighthouse's sandboxed Chrome during testing), rate-limited, or changed under you, and none of these photographs depict Hirut's own work. Drop real files into `public/img/` and point the entries at them.

## Page headers

Every inner page header carries a short looping clip instead of a flat gradient. Both the clip and its still are **self-hosted** in `public/video/headers/` and prepared by `node tools/fetch-header-videos.mjs`, which downloads the source, trims it to 8s, and re-encodes to 854x480.

They were briefly hotlinked from the stock CDN, and self-hosting is not a detail: the CDN set **third-party cookies on every visitor** (a privacy problem on a client site, and Lighthouse Best Practices fell to 79) and served ~2.3 MB per header. Local files are 168-789 KB, cookie-free, and under our own cache headers - Best Practices back to 100 and the page from 2,599 KB to 614 KB.

The still is frame one of its own clip, so the fade-in is seamless. Loading is deferred to idle, gated on the header being in view, and skipped entirely under reduced motion, Save-Data, or a 2g-class connection (`tooSlowForVideo`) - on a slow link the still simply stays.

**Scrim maths.** White type over moving footage has to hold at the worst frame, not the average one. Against a pure-white frame, `--paper` needs ~62% ink to clear 4.5:1 and `--ink-100` needs ~66%. The scrim therefore holds ~66% under the text column, eases to 60% at the 64% mark where the lead ends, then drops to 14% so the footage reads - and the lead and breadcrumbs switch to `--paper` on media headers for the extra margin.

## The scrub band (§4.1)

The band is live, driven by the supplied clip. **The four phase captions are burned into the video frames**, so the right words appear inside the picture at the right moment as the pinned card is scrubbed. `tools/scrub-captions.filter` holds the caption layout; to regenerate from new footage:

```
ffmpeg -y -i media-src/timelapse.mp4 -filter_script:v tools/scrub-captions.filter \
  -an -c:v libx264 -preset slow -crf 30 \
  -g 1 -keyint_min 1 -x264-params keyint=1:min-keyint=1:scenecut=0 \
  -pix_fmt yuv420p -movflags +faststart public/video/timelapse-scrub.mp4
```

Edit the caption text and the `enable='between(t,…)'` ranges in that filter file to match the new clip's timing (and the mirrored copy in `ScrubBand.tsx`, which is the no-JS fallback and the accessible transcript). Two ffmpeg gotchas are already worked around in there: a literal `%` silently kills a `drawtext`, and `h` inside `drawbox` means the box's own height, not the frame's — both are why positions are absolute.

**All-intra is mandatory** (`-g 1`): with sparse keyframes the browser snaps between them and the effect is ruined. Verify with
`ffmpeg -i public/video/timelapse-scrub.mp4 -vf showinfo -f null - 2>&1 | grep -c "type:I"` — it must equal the frame count.

How the controller behaves: the clip is **fetched as a Blob** and handed to the video as an object URL, because frame-accurate seeking needs the whole file — streamed, `seekable.end` stays `0` on any host that doesn't answer HTTP Range requests and `canplaythrough` fires with only a couple of seconds buffered, so seeks silently no-op (this cost real debugging time; the Blob removes the dependency). It then pins the card and lerps `currentTime` toward scroll progress in rAF, never writing raw scroll values. It waits for idle and for the band to be approached before spending the bytes, and falls back to the static band under `prefers-reduced-motion`, Save-Data, no-JS, fetch failure, or sustained seek stalls.

Measured: 55% scroll → 5.51s of a 10.01s clip, converging to 9.99s at the end, card pinned throughout.

## Acceptance checks (v2 brief §7) — measured results

1. **SSR/prerender** ✓ — 28 pages prerendered (`dist/client/**/index.html`); every route's HTML contains its full content (verified by grep: headings, spec lists, JSON-LD).
2. **Lighthouse mobile on `/`** ✓ — Performance **95**, Accessibility **100**, Best Practices **100**, SEO **100** (Lighthouse 12, simulated mobile throttling, gzip static serve). LCP 2.6s, CLS 0.002, TBT 0ms. The hero still is preloaded at high priority as the LCP element and both videos wait for idle, so media never competes with first paint. Verified separately: no horizontal overflow at 390 / 430 / 768 px (`scrollWidth === clientWidth`; the only off-canvas element is the nav drawer, by design).
3. **Token discipline** ✓ — zero hexes/rgb/named colors and zero font sizes outside the token system (grep-verified).
4. **Keyboard / focus / reduced-motion** ✓ — global `:focus-visible` outlines (blue on light, aqua on dark), skip link, `aria-current` nav, `aria-expanded` drawer toggle, native `<details>` pillars; every animation is transform/opacity-only and disabled under `prefers-reduced-motion` (CSS media query + JS guards).
5. **Works without JavaScript** ✓ — prerendered HTML is complete and fully visible (reveals only arm after hydration); effects are absent, content is not.

One honest deviation: initial-route JS is **~113 KB gzipped** vs the ~100 KB target — ~94 KB of it is the irreducible framework runtime (react-dom 19 + TanStack Router/Start). Routes are code-split (per-route chunks load on navigation), and because every page is prerendered, content renders before any JS arrives — reflected in the Lighthouse 96.

## Outstanding placeholders (visible on-site as dashed chips)

- **All photography** — currently hotlinked stock, to be replaced with the company's own images and self-hosted (`src/data/media.ts`). Nothing on the site depicts Hirut's real work yet.
- **Video** — the supplied clip is a sample; swap in the company's own footage and re-run the caption/encode command above.
- A true logo **vector** (.svg/.ai) if one exists — the supplied files are bitmaps; the reversed variant is generated, not hand-drawn
- **Official Orica logo file** for the co-branded band (never redrawn — dropped in as delivered), exact entity name (“Orica Digital Solutions” vs “Orica Geosolution”), and permitted partnership wording
- Mission, vision, values; **portrait photographs of the six named leaders** (initials stand in — never a stock face for a real person); Customer Promise and Our Charter wording; certifications & contractor grade
- All real project content (sample cards flagged; v1's `project-detail.html` in `reference-v1/` is the approved detail template to port when content arrives)
- Product datasheet PDFs; company profile PDF
- Form endpoint / destination email; physical address, map, email, hours, socials
- Confirmed partner list, logos + permissions
- Client decision on bilingual launch (add an `/am` route tree; Ethiopic already in the font stacks — Space Grotesk has no Ethiopic glyphs, so Noto Sans Ethiopic is the fallback by design)

When the domain is confirmed: add per-page `<link rel="canonical">`, a real `og:image`, and enable the Start plugin's `sitemap` option with the host.
#   H i r u t - E n g  
 