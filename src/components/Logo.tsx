/* The official Hirut Engineering logomark.

   Source files live in media-src/logo/ and are prepared for the web by
   tools/make-logo.mjs. Two variants ship: the mark in its official
   colours for light surfaces, and a reversed one  the dark ink strokes
   swapped for paper, the blue wave kept  for the ink bands, where the
   original would all but disappear. Nothing is redrawn.

   Both are rendered and CSS picks the right one per surface, so the
   correct mark is painted on first frame with no flash and no JS. */

export function HirutMark({ size = 40 }: { size?: number }) {
  return (
    <span className="hirut-mark" style={{ '--mark-h': `${size}px` } as React.CSSProperties}>
      <img
        className="hirut-mark-img hirut-mark-img--on-light"
        src="/img/logo/mark.webp"
        alt=""
        width={287}
        height={256}
        decoding="async"
      />
      <img
        className="hirut-mark-img hirut-mark-img--on-dark"
        src="/img/logo/mark-reversed.webp"
        alt=""
        width={287}
        height={256}
        decoding="async"
      />
    </span>
  )
}
