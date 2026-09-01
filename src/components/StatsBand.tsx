import { useEffect, useRef } from 'react'
import { stats } from '../data/site'
import { prefersReducedMotion } from './motion'

/* Animated stat counters. The final value is server-rendered (SEO and
   no-JS correct); on intersection the number counts up. */
function StatNum({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const final = `${prefix}${value}${suffix}`

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion() || !('IntersectionObserver' in window)) return
    let raf = 0
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        io.disconnect()
        const dur = 1400
        let start: number | null = null
        const frame = (ts: number) => {
          if (start === null) start = ts
          const p = Math.min((ts - start) / dur, 1)
          const eased = 1 - Math.pow(1 - p, 3)
          el.textContent = `${prefix}${Math.round(value * eased)}${suffix}`
          if (p < 1) raf = requestAnimationFrame(frame)
        }
        raf = requestAnimationFrame(frame)
      },
      { threshold: 0.5 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      el.textContent = final
    }
  }, [value, prefix, suffix, final])

  return (
    <span className="stat-num" ref={ref}>
      {final}
    </span>
  )
}

export function StatsBand() {
  return (
    <section className="stats-band" aria-label="Company statistics">
      <div className="container">
        <div className="stats-grid">
          {stats.map((s) => (
            <div className="stat" key={s.label}>
              <StatNum value={s.value} prefix={'prefix' in s ? s.prefix : ''} suffix={s.suffix} />
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
