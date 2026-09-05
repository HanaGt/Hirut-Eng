import { useEffect, useRef, useState } from 'react'

import { prefersReducedMotion } from './motion'

const HOLD_MS = 4200

type Photo = { src: string; width: number; height: number; alt: string }

export function ConstructionSlideshow({ photos }: { photos: readonly Photo[] }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useRef(true)

  useEffect(() => {
    const el = rootRef.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(
      ([entry]) => {
        inView.current = Boolean(entry?.isIntersecting)
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (prefersReducedMotion() || paused || photos.length < 2) return
    const id = window.setInterval(() => {
      if (document.hidden || !inView.current) return
      setIndex((n) => (n + 1) % photos.length)
    }, HOLD_MS)
    return () => window.clearInterval(id)
  }, [paused, photos.length])

  const current = photos[index]

  return (
    <div
      ref={rootRef}
      className="service-reel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Construction works on site"
    >
      <div className="service-reel-stage">
        {photos.map((p, i) => (
          <div
            key={p.src}
            className={i === index ? 'service-reel-slide is-current' : 'service-reel-slide'}
            style={{ backgroundImage: `url("${p.src}")` }}
            role={i === index ? 'img' : undefined}
            aria-label={i === index ? p.alt : undefined}
            aria-hidden={i === index ? undefined : true}
          />
        ))}
      </div>
      <div className="service-reel-bar">
        <button
          type="button"
          className="service-reel-toggle"
          aria-pressed={paused}
          aria-label={paused ? 'Play construction photos' : 'Pause construction photos'}
          onClick={() => setPaused((v) => !v)}
        >
          {paused ? (
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M4 2.5 13 8 4 13.5z" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M4 2.5h2.4V13.5H4zm5.6 0H12V13.5H9.6z" fill="currentColor" />
            </svg>
          )}
        </button>
        <div className="service-reel-dots">
          {photos.map((p, i) => (
            <button
              type="button"
              aria-current={i === index ? 'true' : undefined}
              aria-label={`Show photograph ${i + 1} of ${photos.length}`}
              className={i === index ? 'is-current' : undefined}
              key={p.src}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
        <span className="sr-only" aria-live="polite">
          {current ? `Photograph ${index + 1} of ${photos.length}: ${current.alt}` : ''}
        </span>
      </div>
    </div>
  )
}
