/* The site's motif: the logo's layered wave sweep, echoed in section
   dividers, the scrub band's phase indicator, and eyebrow accents.
   FlowWaves adds the persistent ambient motion &mdash; layered strokes
   drifting continuously, transform-only. */

/* Each wave spans exactly 0→1440 and starts/ends at the same y, so two
   copies (the second translated +1440) tile seamlessly inside a 2880
   viewBox &mdash; a -1440px drift then loops with no visible seam. */
const W1 = 'M0,40 C240,18 480,56 720,42 C960,28 1200,52 1440,40'
const W2 = 'M0,52 C260,32 520,66 780,52 C1040,38 1260,64 1440,52'
const W3 = 'M0,28 C300,12 620,44 940,30 C1160,20 1320,38 1440,28'

function TilingWave({
  d,
  stroke,
  width,
  opacity,
}: {
  d: string
  stroke: string
  width: number
  opacity?: number
}) {
  return (
    <>
      <path d={d} fill="none" stroke={stroke} strokeWidth={width} strokeLinecap="round" opacity={opacity} />
      <path
        d={d}
        transform="translate(1440,0)"
        fill="none"
        stroke={stroke}
        strokeWidth={width}
        strokeLinecap="round"
        opacity={opacity}
      />
    </>
  )
}

/** Persistent, always-on wave motion. Used under the hero and CTA bands. */
export function FlowWaves({
  on = 'dark',
  height = 'clamp(40px, 7vw, 84px)',
}: {
  on?: 'light' | 'dark'
  height?: string
}) {
  const faint = on === 'dark' ? 'var(--ink-100)' : 'var(--muted)'
  return (
    <div className="flow-waves" style={{ height }} aria-hidden="true">
      <svg
        viewBox="0 0 2880 70"
        preserveAspectRatio="none"
        style={{ width: '200%', height: '100%' }}
        focusable="false"
      >
        <g className="flow-layer-3">
          <TilingWave d={W3} stroke={faint} width={2} opacity={0.35} />
        </g>
        <g className="flow-layer-1">
          <TilingWave d={W1} stroke="var(--hydro-300)" width={3.5} />
        </g>
        <g className="flow-layer-2">
          <TilingWave d={W2} stroke="var(--hydro-600)" width={3} opacity={0.9} />
        </g>
      </svg>
    </div>
  )
}

/** Static divider (kept for places that want a quiet rule). */
export function WaveDivider({ on = 'light', flush = false }: { on?: 'light' | 'dark'; flush?: boolean }) {
  const third = on === 'dark' ? 'var(--ink-100)' : 'var(--muted)'
  return (
    <svg
      className={flush ? 'wave-divider wave-divider--flush' : 'wave-divider'}
      viewBox="0 0 1440 70"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      style={{ height: 'clamp(28px, 5vw, 56px)' }}
    >
      <path d={W1} fill="none" stroke="var(--hydro-300)" strokeWidth="4" strokeLinecap="round" />
      <path d={W2} fill="none" stroke="var(--hydro-600)" strokeWidth="3" strokeLinecap="round" />
      <path d={W3} fill="none" stroke={third} strokeWidth="2" strokeLinecap="round" opacity="0.4" />
    </svg>
  )
}

export function EyebrowWave() {
  return (
    <svg className="eyebrow-wave" width="34" height="12" viewBox="0 0 34 12" aria-hidden="true" focusable="false">
      <path d="M1,4.5 C7,1.5 13,7 19,4.5 C25,2 30,6 33,4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M1,9 C7,6 13,11.5 19,9 C25,6.5 30,10.5 33,8.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.45" />
    </svg>
  )
}

/* Phase marker on the scrub band's gauge: a compact triple-wave glyph. */
export function GaugeWave() {
  return (
    <svg width="24" height="14" viewBox="0 0 24 14" aria-hidden="true" focusable="false">
      <path d="M1,3.5 C5,1 9,5.5 13,3.5 C17,1.5 21,4.5 23,3" fill="none" stroke="var(--hydro-300)" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M1,7.5 C5,5 9,9.5 13,7.5 C17,5.5 21,8.5 23,7" fill="none" stroke="var(--hydro-500)" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M1,11.5 C5,9 9,13.5 13,11.5 C17,9.5 21,12.5 23,11" fill="none" stroke="var(--sand-500)" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
    </svg>
  )
}
