import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

import { jumpScroll, lockPageScroll, unlockPageScroll } from '../lib/scroll-lock'
import { PhChip } from './Placeholders'
import { leaderInitials, leadership, type Leader } from '../data/leadership'

/* ============================================================
   Leadership roster and profile dialog.

   Every member sits in the same full-width featured strip: portrait,
   name, title and scope, qualifications, years of experience, and
   discipline chips. The full bio opens in a modal so a reader can
   move between people without leaving the page; seven profiles do
   not justify seven routes.

   The dialog is a native <dialog> opened with showModal(), which gives
   the focus trap, the Esc handler and the inert background for free.
   On top of that: backdrop click closes, focus returns to the strip that
   opened it (without scrolling the page), previous/next step through
   all seven, the page scroll position is locked and restored, and the
   open profile is reflected in the URL hash so a single bio can still
   be linked to.
   ============================================================ */

function indexLabel(i: number) {
  return String(i + 1).padStart(2, '0')
}

/** Roles are supplied as "Title | Scope"; Nathan's has no separator. */
function splitRole(role: string) {
  const i = role.indexOf(' | ')
  if (i < 0) return { title: role, scope: '' }
  return { title: role.slice(0, i), scope: role.slice(i + 3) }
}

function Portrait({
  photo,
  name,
  sizes = '116px',
}: {
  photo?: string
  name: string
  sizes?: string
}) {
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
        sizes={sizes}
        loading="lazy"
        decoding="async"
      />
    </picture>
  )
}

function LeaderStrip({
  person,
  index,
  buttonRef,
  onOpen,
}: {
  person: Leader
  index: number
  buttonRef: (el: HTMLButtonElement | null) => void
  onOpen: () => void
}) {
  const { title, scope } = splitRole(person.role)
  return (
    <button
      type="button"
      className="leader-exec"
      ref={buttonRef}
      onClick={onOpen}
      aria-haspopup="dialog"
    >
      <span className="leader-exec-portrait">
        <Portrait
          photo={person.photo}
          name={person.name}
          sizes="(max-width: 720px) 92vw, 280px"
        />
      </span>
      <span className="leader-exec-body">
        <span className="leader-exec-index" aria-hidden="true">
          {indexLabel(index)}
        </span>
        <span className="leader-exec-name">{person.name}</span>
        <span className="leader-exec-title">{title}</span>
        {scope ? <span className="leader-exec-org">{scope}</span> : null}
        <span className="leader-exec-quals">{person.postNominals}</span>
        <span className="leader-exec-stat">
          <strong>{person.experience}</strong> of professional experience
        </span>
        <span className="leader-exec-chips" aria-hidden="true">
          {person.disciplines.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </span>
        <span className="leader-exec-more">
          Read profile <span className="arrow" aria-hidden="true">→</span>
        </span>
      </span>
    </button>
  )
}

/** Keep a shareable #slug without a router navigation (those reset scroll). */
function replaceHashQuietly(slug: string) {
  const url = slug
    ? `${window.location.pathname}${window.location.search}#${slug}`
    : `${window.location.pathname}${window.location.search}`
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`
  if (current === url) return
  window.history.replaceState(window.history.state, '', url)
}

export function LeadershipGrid() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([])
  const openerRef = useRef<HTMLButtonElement | null>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const lockedRef = useRef(false)

  const open = useCallback((i: number) => {
    openerRef.current = cardRefs.current[i] ?? null
    setOpenIndex(i)
  }, [])

  const close = useCallback(() => setOpenIndex(null), [])

  const step = useCallback((delta: number) => {
    setOpenIndex((i) => (i === null ? i : (i + delta + leadership.length) % leadership.length))
  }, [])

  /* Open a profile named in the URL hash (refresh, or a link from
     another page). That is an arrival, so start at the top, then open. */
  useEffect(() => {
    const slug = window.location.hash.replace('#', '')
    if (!slug) return
    const i = leadership.findIndex((p) => p.slug === slug)
    if (i < 0) return
    openerRef.current = null
    jumpScroll(0)
    setOpenIndex(i)
  }, [])

  /* Drive the native dialog, the scroll lock and the hash from state. */
  useLayoutEffect(() => {
    const dlg = dialogRef.current
    if (!dlg) return
    if (openIndex === null) {
      if (lockedRef.current) {
        lockedRef.current = false
        const y = unlockPageScroll()
        if (dlg.open) dlg.close()
        replaceHashQuietly('')
        jumpScroll(y)
        openerRef.current?.focus({ preventScroll: true })
      }
      return
    }
    if (!dlg.open) {
      lockPageScroll()
      lockedRef.current = true
      dlg.showModal()
    }
    replaceHashQuietly(leadership[openIndex].slug)
    bodyRef.current?.scrollTo({ top: 0 })
  }, [openIndex])

  useEffect(() => {
    return () => {
      if (!lockedRef.current) return
      lockedRef.current = false
      unlockPageScroll(false)
    }
  }, [])

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

  const bindRef = (i: number) => (el: HTMLButtonElement | null) => {
    cardRefs.current[i] = el
  }

  return (
    <>
      <div className="leader-roster">
        <div>
          <h3 className="leader-group-label reveal">Executive officer</h3>
          <ul className="leader-strips">
            <li className="reveal">
              <LeaderStrip
                person={leadership[0]}
                index={0}
                buttonRef={bindRef(0)}
                onOpen={() => open(0)}
              />
            </li>
          </ul>
        </div>
        <div>
          <h3 className="leader-group-label reveal">Management staff</h3>
          <ul className="leader-strips">
            {leadership.slice(1).map((p, i) => {
              const index = i + 1
              return (
                <li
                  className="reveal"
                  style={{ '--reveal-delay': `${(i % 4) * 0.05}s` } as React.CSSProperties}
                  key={p.slug}
                >
                  <LeaderStrip
                    person={p}
                    index={index}
                    buttonRef={bindRef(index)}
                    onOpen={() => open(index)}
                  />
                </li>
              )
            })}
          </ul>
        </div>
      </div>

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
                    <Portrait
                      photo={p.photo}
                      name={p.name}
                      sizes="(max-width: 560px) 84px, 116px"
                    />
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
