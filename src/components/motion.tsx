import { useEffect, useLayoutEffect, useRef } from 'react'
import { useRouterState } from '@tanstack/react-router'

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

type NetInfo = { saveData?: boolean }
const conn = () =>
  typeof navigator === 'undefined'
    ? undefined
    : (navigator as { connection?: NetInfo }).connection

export const saveData = () => Boolean(conn()?.saveData)

/**
 * Skip the clip only when the user asked the browser to save data.
 * The still already carries the header, so a metered connection never
 * pays for a loop it did not request.
 */
export const tooSlowForVideo = () => saveData()

/**
 * Hero / page-header loop. The still is the LCP element; this clip is
 * attached after mount, faded in on the `playing` event, paused while
 * far offscreen, and left as a still under reduced motion or Save-Data.
 *
 * Each video owns its own playback so a client-side navigation cannot
 * miss the clip the way a document-wide idle observer could.
 */
export function AmbientVideo({
  src,
  className,
}: {
  src: string
  className?: string
}) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (prefersReducedMotion() || tooSlowForVideo()) return

    let alive = true
    let inView = true

    const arm = () => {
      v.muted = true
      v.defaultMuted = true
      v.playsInline = true
      v.setAttribute('playsinline', '')
      v.setAttribute('webkit-playsinline', '')
      v.loop = true
      if (v.getAttribute('src') !== src) v.src = src
    }

    const kick = () => {
      if (!alive || !inView) return
      arm()
      void v.play().catch(() => {
        /* autoplay can reject until the first frame is decoded; `playing` is the success path */
      })
    }

    const onPlaying = () => {
      if (alive) v.classList.add('is-playing')
    }

    v.addEventListener('playing', onPlaying)
    v.addEventListener('canplay', kick)
    v.addEventListener('loadeddata', kick)

    const io =
      'IntersectionObserver' in window
        ? new IntersectionObserver(
            (entries) => {
              const e = entries[0]
              if (!e) return
              /* A 0-size rect means the hero has not laid out yet — do not
                 pause, or the in-flight play() is aborted and never retried. */
              inView = e.isIntersecting || e.boundingClientRect.height === 0
              if (inView) kick()
              else v.pause()
            },
            { rootMargin: '200px 0px', threshold: 0 },
          )
        : null
    io?.observe(v)
    kick()

    const onVis = () => {
      if (document.visibilityState === 'visible') kick()
    }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      alive = false
      io?.disconnect()
      v.removeEventListener('playing', onPlaying)
      v.removeEventListener('canplay', kick)
      v.removeEventListener('loadeddata', kick)
      document.removeEventListener('visibilitychange', onVis)
      v.pause()
    }
  }, [src])

  return (
    <video
      ref={ref}
      className={className}
      muted
      loop
      playsInline
      autoPlay
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
    />
  )
}

/**
 * Two-way reveal for `.reveal-cycle` elements: they animate in on entry
 * and back out on exit, so a section is composed every time it is
 * scrolled through rather than only the first time.
 *
 * Same progressive-enhancement contract as RevealEffects - the server
 * HTML is fully visible, and the hidden state is only armed (by putting
 * `cycle-armed` on the ancestor) after hydration, never under reduced
 * motion or with JS off.
 */
export function CycleRevealEffects() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) return
    const groups = Array.from(document.querySelectorAll<HTMLElement>('[data-cycle-group]'))
    const items = Array.from(document.querySelectorAll<HTMLElement>('.reveal-cycle'))
    if (items.length === 0) return

    groups.forEach((g) => g.classList.add('cycle-armed'))

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.classList.toggle('is-in', entry.isIntersecting)
        }
      },
      { rootMargin: '-8% 0px -12% 0px', threshold: 0.01 },
    )

    for (const el of items) {
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
        el.classList.add('is-in')
      }
      io.observe(el)
    }

    return () => {
      io.disconnect()
      groups.forEach((g) => g.classList.remove('cycle-armed'))
      items.forEach((el) => el.classList.remove('is-in'))
    }
  }, [pathname])

  return null
}

/**
 * Scroll-reveal wiring for every `.reveal` element on the current route.
 *
 * Progressive enhancement: the server-rendered HTML is fully visible.
 * After hydration, only elements still below the viewport get "armed"
 * (hidden) and then revealed on intersection - no flash for above-fold
 * content, nothing hidden without JS, nothing hidden under
 * prefers-reduced-motion.
 */
export function RevealEffects() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  useEffect(() => {
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) return

    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal:not(.reveal-cycle)'))
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            io.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )

    for (const el of els) {
      if (el.classList.contains('is-in')) continue
      const rect = el.getBoundingClientRect()
      if (rect.top > window.innerHeight * 0.92) {
        el.classList.add('is-armed')
        io.observe(el)
      } else {
        el.classList.add('is-in')
      }
    }
    return () => io.disconnect()
  }, [pathname])

  return null
}
