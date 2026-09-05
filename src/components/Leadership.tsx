import { useCallback, useEffect, useRef, useState } from 'react'

import { PhChip } from './Placeholders'
import { leaderInitials, leadership } from '../data/leadership'

/* ============================================================
   Leadership grid and profile dialog.

   The grid shows a summary only: portrait, name, qualifications on one
   line, role and years of experience. The full bio opens in a modal so
   a reader can move between people without losing their place in the
   grid; seven profiles do not justify seven routes.

   The dialog is a native <dialog> opened with showModal(), which gives
   the focus trap, the Esc handler and the inert background for free.
   On top of that: backdrop click closes, focus returns to the card that
   opened it, previous/next step through all seven, the body is locked
   from scrolling, and the open profile is reflected in the URL hash so
   a single bio can still be linked to.
   ============================================================ */

function Portrait({ photo, name }: { photo?: string; name: string }) {
  if (!photo) {
    return (
      <span className="leader-monogram" aria-hidden="true">
        {leaderInitials(name)}
      </span>
    )
  }
  return (
    <picture>
      <source type="image/webp" srcSet={`${photo}.webp`} />
      <img
        className="leader-photo"
        src={`${photo}.jpg`}
        alt={`Portrait of ${name}`}
        width={800}
        height={800}
        sizes="(max-width: 620px) 92vw, (max-width: 980px) 46vw, 31vw"
        loading="lazy"
        decoding="async"
      />
    </picture>
  )
}

export function LeadershipGrid() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([])
  const openerRef = useRef<HTMLButtonElement | null>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  const open = useCallback((i: number) => {
    openerRef.current = cardRefs.current[i] ?? null
    setOpenIndex(i)
  }, [])

  const close = useCallback(() => setOpenIndex(null), [])

  const step = useCallback((delta: number) => {
    setOpenIndex((i) => (i === null ? i : (i + delta + leadership.length) % leadership.length))
  }, [])

  /* Open a profile named in the URL hash on first load. */
  useEffect(() => {
    const slug = window.location.hash.replace('#', '')
    if (!slug) return
    const i = leadership.findIndex((p) => p.slug === slug)
    if (i >= 0) setOpenIndex(i)
  }, [])

  /* Drive the native dialog, the scroll lock and the hash from state. */
  useEffect(() => {
    const dlg = dialogRef.current
    if (!dlg) return
    if (openIndex === null) {
      if (dlg.open) dlg.close()
      document.body.classList.remove('modal-open')
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search)
      }
      openerRef.current?.focus()
      return
    }
    if (!dlg.open) dlg.showModal()
    document.body.classList.add('modal-open')
    window.history.replaceState(null, '', `#${leadership[openIndex].slug}`)
    // a stepped-to profile starts at the top of its own bio
    bodyRef.current?.scrollTo({ top: 0 })
  }, [openIndex])

  /* Esc and the dialog's own close button both fire `close` on the element. */
  useEffect(() => {
    const dlg = dialogRef.current
    if (!dlg) return
    const onClose = () => setOpenIndex(null)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    dlg.addEventListener('close', onClose)
    dlg.addEventListener('keydown', onKey)
    return () => {
      dlg.removeEventListener('close', onClose)
      dlg.removeEventListener('keydown', onKey)
    }
  }, [step])

  const person = openIndex === null ? null : leadership[openIndex]

  return (
    <>
      <ul className="leader-grid">
        {leadership.map((p, i) => (
          <li
            className="reveal"
            style={i % 3 !== 0 ? ({ '--reveal-delay': `${(i % 3) * 0.07}s` } as React.CSSProperties) : undefined}
            key={p.slug}
          >
            <button
              type="button"
              className="leader-card"
              ref={(el) => {
                cardRefs.current[i] = el
              }}
              onClick={() => open(i)}
              aria-haspopup="dialog"
            >
              <span className="leader-portrait">
                <Portrait photo={p.photo} name={p.name} />
              </span>
              <span className="leader-body">
                <span className="leader-name">{p.name}</span>
                <span className="leader-quals-line">{p.postNominals}</span>
                <span className="leader-role">{p.role}</span>
                <span className="leader-stat">
                  <strong>{p.experience}</strong> experience
                </span>
                <span className="leader-more">
                  Read profile <span className="arrow" aria-hidden="true">→</span>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <PhChip style={{ marginTop: '1.6rem' }}>
        professional headshots for all seven leadership members pending: supplied portraits are
        used where they exist and initials stand in elsewhere, never a stock face of another person
      </PhChip>

      {/* Every profile is rendered into the closed dialog rather than only the
          open one, so all seven bios are in the prerendered HTML for search
          engines and for anyone reading the page source, while the reader
          still sees one at a time. */}
      <dialog
        className="leader-modal"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`leader-modal-title-${person ? person.slug : leadership[0].slug}`}
        onClick={(e) => {
          // a click on the dialog element itself is a click on the backdrop
          if (e.target === dialogRef.current) close()
        }}
      >
        <div className="leader-modal-inner">
          <button type="button" className="leader-modal-close" onClick={close}>
            <span aria-hidden="true">×</span>
            <span className="sr-only">Close profile</span>
          </button>
          <div className="leader-modal-scroll" ref={bodyRef}>
            {leadership.map((p, i) => (
              <article key={p.slug} hidden={openIndex !== i}>
                <div className="leader-modal-head">
                  <span className="leader-modal-portrait">
                    <Portrait photo={p.photo} name={p.name} />
                  </span>
                  <div>
                    <p className="leader-modal-eyebrow">Leadership</p>
                    <h2 id={`leader-modal-title-${p.slug}`}>{p.name}</h2>
                    <p className="leader-modal-role">{p.role}</p>
                    <p className="leader-modal-postnominals">{p.postNominals}</p>
                    <p className="leader-modal-stat">
                      <strong>{p.experience}</strong> of professional experience
                    </p>
                  </div>
                </div>

                <ul className="chip-row" aria-label="Disciplines">
                  {p.disciplines.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>

                <div className="leader-modal-bio">
                  {p.bio.map((para) => (
                    <p key={para.slice(0, 40)}>{para}</p>
                  ))}
                </div>

                <div className="leader-modal-quals">
                  <h3>{p.qualsLabel}</h3>
                  <ul>
                    {p.quals.map((q) => (
                      <li key={q} className={q.startsWith('Ph.D') ? 'is-doctorate' : undefined}>
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          <div className="leader-modal-foot">
            <button type="button" className="btn btn-ghost" onClick={() => step(-1)}>
              <span aria-hidden="true">←</span> Previous
            </button>
            <p className="leader-modal-count" aria-live="polite">
              {(openIndex ?? 0) + 1} of {leadership.length}
            </p>
            <button type="button" className="btn btn-ghost" onClick={() => step(1)}>
              Next <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </dialog>
    </>
  )
}
