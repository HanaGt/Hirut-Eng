import { useId } from 'react'

/* The Hirut logomark — a clean vector recreation of the supplied logo
   bitmap (transparent background, crisp at any size). The H posts render
   in currentColor so the mark adapts to light and dark surfaces; the
   wave sweep keeps the brand blues from the delivered logo.
   [PLACEHOLDER: swap the path data for the official vector file if the
   designer can supply an .svg/.ai original — geometry here is traced
   by eye from the bitmap.] */

export const LOGO_BLUE_DEEP = '#1f6fb2'
export const LOGO_BLUE_LIGHT = '#4fa8dc'

export function HirutMark({ size = 40 }: { size?: number }) {
  const uid = useId()
  const grad = `hirut-g-${uid}`
  const mask = `hirut-m-${uid}`
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 128"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={grad} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor={LOGO_BLUE_DEEP} />
          <stop offset="1" stopColor={LOGO_BLUE_LIGHT} />
        </linearGradient>
        <mask id={mask} maskUnits="userSpaceOnUse" x="-12" y="-12" width="144" height="152">
          <rect x="-12" y="-12" width="144" height="152" fill="#fff" />
          {/* wave-shaped negative space cutting the posts */}
          <path d="M -6 74 C 30 62, 60 68, 126 36" stroke="#000" strokeWidth="9" fill="none" />
          <path d="M 4 80 C 36 74, 68 62, 104 42" stroke="#000" strokeWidth="15" fill="none" />
          <path d="M 6 93 C 36 88, 66 78, 98 58" stroke="#000" strokeWidth="14" fill="none" />
          <path d="M 8 106 C 34 102, 60 94, 88 76" stroke="#000" strokeWidth="13" fill="none" />
        </mask>
      </defs>

      {/* the two H posts (currentColor), wave gaps cut via mask */}
      <g mask={`url(#${mask})`} stroke="currentColor" strokeWidth="17" fill="none" strokeLinecap="butt">
        <path d="M 88 6 C 77 36, 84 58, 70 90 C 65 102, 61 112, 57 122" />
        <path d="M 52 10 C 41 40, 48 62, 34 94 C 29 106, 25 116, 21 126" />
      </g>

      {/* the wave sweep */}
      <g fill={`url(#${grad})`}>
        <path d="M 4 80 C 38 76, 70 62, 102 40 L 108 48 C 74 70, 40 86, 4 80 Z" />
        <path d="M 6 93 C 38 89, 68 77, 97 56 L 102 64 C 70 84, 40 98, 6 93 Z" />
        <path d="M 8 106 C 36 102, 62 92, 87 74 L 91 82 C 64 100, 38 110, 8 106 Z" />
      </g>
    </svg>
  )
}
