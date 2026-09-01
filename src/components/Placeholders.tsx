/* Honesty rules (master brief §8): every pending item is visibly marked.
   These are the only two placeholder primitives used across the site. */

export function PhChip({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <p className="ph-chip" style={style}>
      {children}
    </p>
  )
}

/* Sample imagery for the preview build. `note` states plainly that the
   visual is an illustrative stand-in, so nothing here reads as a
   photograph of the company's own delivered work. */
export function SampleImg({
  src,
  srcSet,
  sizes = '(max-width: 640px) 92vw, (max-width: 980px) 46vw, 30vw',
  alt,
  ratio = '16 / 9',
  className,
  priority = false,
}: {
  src: string
  srcSet?: string
  sizes?: string
  alt: string
  ratio?: string
  className?: string
  priority?: boolean
}) {
  return (
    <img
      className={className ? `sample-img ${className}` : 'sample-img'}
      src={src}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      width={1600}
      height={1000}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      style={{ aspectRatio: ratio }}
    />
  )
}

export function PhMedia({
  label,
  detail,
  ratio,
  className,
}: {
  label?: string
  detail: string
  ratio?: string
  className?: string
}) {
  return (
    <div
      className={className ? `ph-media ${className}` : 'ph-media'}
      role="img"
      aria-label={`Placeholder: ${detail}`}
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      <div>
        <strong>{label ?? 'Placeholder'}</strong>
        <span>{detail}</span>
      </div>
    </div>
  )
}
