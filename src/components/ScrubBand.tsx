import { useEffect, useRef } from 'react'
import { EyebrowWave } from './Waves'
import { prefersReducedMotion, saveData } from './motion'

/* ============================================================
   Signature interaction (§4.1): scroll-scrubbed construction
   time-lapse  "From bare land to handover".

   The four phase captions are BURNED INTO THE VIDEO FRAMES, so as
   the pinned card is scrubbed the right text appears at the right
   moment inside the picture itself.

   Current file is a generated SAMPLE (tools/make-videos.mjs).
   To swap in the real footage, re-encode it ALL-INTRA  every frame
   a keyframe, or seeking snaps between sparse keyframes and the
   effect is ruined  with the captions rendered into the frames:

     ffmpeg -i in.mp4 -an -g 1 -keyint_min 1 -vf scale=1440:-2 \
       -c:v libx264 -crf 25 -pix_fmt yuv420p \
       public/video/timelapse-scrub.mp4

   Behavior contract:
   - Static until ready: poster + the phase list below it, fully
     informative with JS off, reduced motion, or Save-Data.
   - The clip is fetched as a Blob (only once the band is near the
     viewport) and handed to the video as an object URL. Frame-accurate
     scrubbing needs random access to the whole file: streaming it
     leaves `seekable.end === 0` on any host that does not answer HTTP
     Range requests, and `canplaythrough` fires while only a couple of
     seconds are buffered  both make seeks silently no-op. Holding the
     bytes locally removes that dependency entirely.
   - Then the card freezes (position: sticky) and scroll drives
     playback: currentTime is lerped toward the scroll-implied time in
     rAF  raw scroll values are never written.
   - Downgrades itself if seeking stalls (weak devices) or the fetch
     fails; the static band is always the floor.
   ============================================================ */
const SCRUB_VIDEO: { src: string; poster: string } | null = {
  src: '/video/timelapse-scrub.mp4',
  poster: '/img/timelapse-poster.webp',
}

/* Mirrors the captions burned into the video. Shown only in the
   static fallback and to assistive tech  the live scrub reads its
   text from the frames themselves. */
const PHASES = [
  {
    phase: 'Phase 01 · 0–25%',
    title: 'Ground first',
    body: 'Subsurface investigation, piezometers set, borehole drilled. We read the ground before we ask anything of it.',
  },
  {
    phase: 'Phase 02 · 25–50%',
    title: 'Foundations & waterproofing',
    body: 'Excavation, membrane laid at the source, slab poured  the structure rises on ground we understand.',
  },
  {
    phase: 'Phase 03 · 50–75%',
    title: 'Structure & water systems',
    body: 'Frame rises, risers and pumps in, roof tank set  the building learns to move water.',
  },
  {
    phase: 'Phase 04 · 75–100%',
    title: 'Commissioning & handover',
    body: 'Systems tested, fountain and irrigation live, operators trained  and the after-sales program begins.',
  },
]

export function ScrubBand() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const railRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    const video = videoRef.current
    if (!section || !track || !video) return
    if (!SCRUB_VIDEO || prefersReducedMotion() || saveData()) return

    let current = 0
    let rafId = 0
    let stallFrames = 0
    let live = false
    let disposed = false

    const progress = () => {
      const rect = track.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      if (total <= 0) return 0
      return Math.min(1, Math.max(0, -rect.top / total))
    }

    const downgrade = () => {
      live = false
      cancelAnimationFrame(rafId)
      section.classList.remove('scrub--live')
      section.classList.add('scrub--static')
    }

    const loop = () => {
      if (!live || disposed) return
      const p = progress()
      const target = p * (video.duration || 0)
      // Lerp toward the scroll-implied time  never write raw values.
      current += (target - current) * 0.14
      if (Math.abs(target - current) > 0.01 && !video.seeking) {
        try {
          video.currentTime = current
        } catch {
          /* not seekable yet */
        }
      }
      stallFrames = video.seeking ? stallFrames + 1 : 0
      if (stallFrames > 90) {
        downgrade()
        return
      }
      if (railRef.current) railRef.current.style.transform = `scaleX(${p})`
      rafId = requestAnimationFrame(loop)
    }

    const goLive = () => {
      if (live || disposed) return
      live = true
      section.classList.remove('scrub--static')
      section.classList.add('scrub--live')
      current = 0
      rafId = requestAnimationFrame(loop)
    }

    // Only spend the bytes if the reader is actually heading here.
    const controller = new AbortController()
    let objectUrl: string | null = null

    const attach = async () => {
      try {
        const res = await fetch(SCRUB_VIDEO.src, { signal: controller.signal })
        if (!res.ok) return
        const blob = await res.blob()
        if (disposed) return
        objectUrl = URL.createObjectURL(blob)
        video.src = objectUrl
        await new Promise<void>((resolve, reject) => {
          const ok = () => resolve()
          video.addEventListener('loadedmetadata', ok, { once: true })
          video.addEventListener('error', () => reject(new Error('decode')), { once: true })
        })
        if (disposed) return
        // A seekable range that actually spans the clip is the real
        // green light  without it, scrubbing would silently no-op.
        const s = video.seekable
        if (!video.duration || s.length === 0 || s.end(s.length - 1) < video.duration * 0.9) return
        goLive()
      } catch {
        /* offline, aborted, or undecodable  the static band stands */
      }
    }

    // Approaching-the-band trigger, and never before the page is idle 
    // this clip must not compete with first paint on a slow connection.
    let io: IntersectionObserver | null = null
    let cancelled = false
    const arm = () => {
      if (cancelled) return
      if ('IntersectionObserver' in window) {
        io = new IntersectionObserver(
          (entries) => {
            if (entries.some((e) => e.isIntersecting)) {
              io?.disconnect()
              void attach()
            }
          },
          { rootMargin: '60% 0px' },
        )
        io.observe(section)
      } else {
        void attach()
      }
    }
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number
    }
    if (typeof w.requestIdleCallback === 'function') {
      w.requestIdleCallback(arm, { timeout: 4000 })
    } else {
      setTimeout(arm, 1500)
    }

    return () => {
      disposed = true
      cancelled = true
      cancelAnimationFrame(rafId)
      controller.abort()
      io?.disconnect()
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [])

  return (
    <section className="section band-dark scrub scrub--static" id="build-story" ref={sectionRef}>
      <div className="scrub-track" ref={trackRef}>
        <div className="container scrub-stage">
          <div className="scrub-head">
            <p className="eyebrow">
              <EyebrowWave />
              How a project rises
            </p>
            <h2>From bare land to handover</h2>
            <p className="scrub-hint">Keep scrolling  the build runs as you go.</p>
          </div>

          <figure className="scrub-media">
            {/* src is attached as a Blob URL after fetch  see the effect */}
            <video
              className="scrub-video"
              muted
              playsInline
              preload="none"
              ref={videoRef}
              poster={SCRUB_VIDEO?.poster}
              aria-label="Time-lapse: a project built from bare land to handover, in four phases"
            />
            <span className="scrub-rail" aria-hidden="true">
              <span className="scrub-rail-fill" ref={railRef} />
            </span>
            <figcaption className="scrub-note">
              Sample time-lapse  an illustrative sequence standing in until the company's own
              footage is supplied.
            </figcaption>
          </figure>

          {/* Static fallback + accessible transcript of the burned-in captions */}
          <ol className="scrub-steps">
            {PHASES.map((p) => (
              <li className="scrub-step" key={p.phase}>
                <span className="scrub-step-phase">{p.phase}</span>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
