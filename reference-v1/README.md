# Hirut Engineering & General Trading PLC  Website

Production-ready static marketing site. No framework, no build step: plain HTML + one CSS file + one JS file, so it deploys anywhere (any static host, cPanel, Netlify, GitHub Pages, nginx) and stays fast on mid-range Android phones over mobile networks.

## Run it

Open `index.html` directly in a browser, or serve the folder:

```
npx serve .        # or: python -m http.server 8080
```

## Structure

```
index.html                     Home (10 sections incl. signature scrub band)
about.html                     Story, stats, mission/vision slots, why-Hirut, team & certification slots
services.html                  Construction / Consultancy / After-Sales (6 expandable pillars)
projects.html                  Filterable portfolio (6 clearly-labeled SAMPLE cards)
project-detail.html            Project detail TEMPLATE  duplicate per real project
partners.html                  Text-badge partner walls (no logos, by design)
contact.html                   Inquiry form + contact info slots
products/index.html            Hub with Water/Ground/Power filter
products/<category>.html       7 category pages, verbatim spec lists, quote CTAs
assets/css/main.css            Design tokens + all styles
assets/js/main.js              Nav, reveals, counters, scrub controller, filters, form
assets/img/                    (create)  photos, posters, favicon
assets/video/                  (create)  scrub video + background videos
```

## Design tokens

The palette lives in `:root` at the top of `assets/css/main.css`. When the final logo arrives, swap the hexes there  nothing else needs touching. Current system: deep ink navy (authority), hydro cyan (the living accent), warm sand (the geotechnical earth note), warm off-white paper. Signature motif: **depth-gauge / strata ticks** (eyebrow rulers, the scrub band's gauge, stat separators, hero strata SVG).

Type: Space Grotesk (display) + Inter (body), with **Noto Sans Ethiopic** already in the Google Fonts request and font stacks  Ethiopic glyphs load automatically (via unicode-range) the moment Amharic text appears.

## Activating the signature scroll-scrub band (Home, section 4)

The band currently runs in its honest static fallback. To activate the scrub:

1. Re-encode the supplied 10–20s time-lapse **all-intra** (every frame a keyframe  mandatory, or seeking snaps and the effect is ruined), audio stripped, ≤1440px wide, single-digit MB:

   ```
   ffmpeg -i timelapse.mp4 -an -g 1 -keyint_min 1 -vf scale=1440:-2 -c:v libx264 -crf 26 -pix_fmt yuv420p assets/video/timelapse-scrub.mp4
   ```

2. Extract a poster frame:

   ```
   ffmpeg -i assets/video/timelapse-scrub.mp4 -frames:v 1 assets/img/timelapse-poster.jpg
   ```

3. In `index.html`, inside the `<video data-scrub-video>` element: uncomment the `<source>` line and add the `poster` attribute.

That's all. The controller in `main.js` then: gates on ~90% buffered before pinning, lerps `video.currentTime` toward scroll progress via `requestAnimationFrame`, drives the four phase steps and the depth gauge, and **downgrades itself** back to the static band under `prefers-reduced-motion`, Save-Data, JS-off, or if seeking stalls on weak devices.

## Background videos (§4.2)

Compress to ~2–4 MB (`-an`, ~720–1080p, CRF 28–30) and use:

```html
<video data-bg-video data-src="assets/video/clip.mp4" muted loop playsinline poster="assets/img/clip-poster.jpg"></video>
```

`main.js` already lazy-attaches the src near the viewport, pauses offscreen, and shows poster-only under reduced-motion/Save-Data. Always keep the scrim behind overlaid text.

## Photos

Replace any `.ph-media` placeholder block with a real `<img src="…" alt="…" loading="lazy" width="…" height="…">` (WebP/AVIF preferred). Never substitute stock photography  placeholders stay until real photos arrive (honesty rules, brief §8).

## Wiring the contact form

`assets/js/main.js`  search for `PLACEHOLDER: form submission endpoint`. Add a `fetch()` POST to the confirmed endpoint (or a service like Formspree) before the success state is shown. The `?type=` querystring pre-selects the inquiry dropdown; category CTAs already use it.

## Outstanding placeholders (visible on-site as dashed sand chips)

- Final logo, favicon, palette confirmation
- Exact Orica brand wording (“Orica Digital Solutions” vs “Orica Geosolution”)  home, about, partners, geotechnical page
- Hero photo / background videos; scrub-ready time-lapse; full media library
- Mission, vision, values; leadership profiles; certifications & contractor grade
- All real project content (6 sample cards + detail template ready to populate)
- Product datasheet PDFs; company profile PDF
- Form endpoint / destination email; physical address, map, email, hours, socials
- Confirmed partner list, logos + permissions, partner-vs-brand wording
- Client decision on bilingual (English/Amharic) launch

## i18n plan (English/Amharic)

The site is architected for a future `/am/` mirror: every string lives in markup (needed for SEO  no client-side string tables), the type stack already renders Ethiopic, and `<html lang>` is set per page. To launch Amharic: copy pages into `/am/`, translate content, set `lang="am"`, add `<link rel="alternate" hreflang>` pairs, and a toggle link in the header. The company writes its own Amharic copy, so no machine translation.

## SEO / deployment notes

- Per-page titles, meta descriptions, and Open Graph tags are in place; Organization JSON-LD on the homepage, ItemList/Product JSON-LD on category pages.
- When the domain is confirmed, add `<link rel="canonical">` per page and an `og:image`.
- `project-detail.html` carries `noindex` until real projects replace the sample content.
- Serve with gzip/brotli and long cache headers on `/assets/` for green Core Web Vitals.
