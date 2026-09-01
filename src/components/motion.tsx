import { useEffect } from 'react'
import { useRouterState } from '@tanstack/react-router'

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

type NetInfo = { saveData?: boolean; effectiveType?: string }
const conn = () =>
  typeof navigator === 'undefined'
    ? undefined
    : (navigator as { connection?: NetInfo }).connection

export const saveData = () => Boolean(conn()?.saveData)

/**
 * Ambient video is a luxury, not the message. On a metered or slow
 * link the still already carries the header, so don't spend megabytes
 * on top of it  a large share of this site's visitors are on
 * mid-range Android over Ethiopian mobile networks.
 */
export const tooSlowForVideo = () => {
  const c = conn()
  if (!c) return false
  return c.saveData === true || /(^|-)2g$/.test(c.effectiveType ?? '')
}

/**
 * Scroll-reveal wiring for every `.reveal` element on the current route.
 *
 * Progressive enhancement: the server-rendered HTML is fully visible.
 * After hydration, only elements still below the viewport get "armed"
 * (hidden) and then revealed on intersection  no flash for above-fold
 * content, nothing hidden without JS, nothing hidden under
 * prefers-reduced-motion.
 */
/**
 * Background videos (§4.2): poster-first, lazy-attached near the
 * viewport, paused while offscreen, and never started at all under
 * reduced motion or Save-Data  the poster is the experience there.
 */
export function BgVideoEffects() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  useEffect(() => {
    const vids = Array.from(document.querySelectorAll<HTMLVideoElement>('[data-bg-video]'))
    if (vids.length === 0) return
    if (prefersReducedMotion() || tooSlowForVideo() || !('IntersectionObserver' in window)) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const v = entry.target as HTMLVideoElement
          if (entry.isIntersecting) {
            if (!v.src && v.dataset.src) v.src = v.dataset.src
            void v
              .play()
              .then(() => v.classList.add('is-playing'))
              .catch(() => {})
          } else {
            v.pause()
          }
        }
      },
      { rootMargin: '200px 0px' },
    )

    // Wait for idle: the hero still is the LCP element, and ambient video
    // must never compete with it for bandwidth on a slow connection.
    let cancelled = false
    const start = () => {
      if (!cancelled) vids.forEach((v) => io.observe(v))
    }
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number
    }
    if (typeof w.requestIdleCallback === 'function') {
      w.requestIdleCallback(start, { timeout: 3000 })
    } else {
      setTimeout(start, 1200)
    }

    return () => {
      cancelled = true
      io.disconnect()
    }
  }, [pathname])

  return null
}

/**
 * Two-way reveal for `.reveal-cycle` elements: they animate in on entry
 * and back out on exit, so a section is composed every time it is
 * scrolled through rather than only the first time.
 *
 * Same progressive-enhancement contract as RevealEffects  the server
 * HTML is fully visible, and the hidden state is only armed (by putting
 * `cycle-armed` on the ancestor) after hydration, never under reduced
 * motion or with JS off.
 */
export function CycleRevealEffects() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  useEffect(() => {
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
      // a little inset so the exit plays before the card clears the screen
      { rootMargin: '-8% 0px -12% 0px', threshold: 0.01 },
    )
    items.forEach((el) => io.observe(el))

    return () => {
      io.disconnect()
      groups.forEach((g) => g.classList.remove('cycle-armed'))
      items.forEach((el) => el.classList.remove('is-in'))
    }
  }, [pathname])

  return null
}

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
