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
