import { useLayoutEffect } from 'react'
import { Link } from '@tanstack/react-router'

/* ============================================================
   About Us section navigation.

   The eight sub-sections in their approved order. This is the single
   source of truth for the sticky sub-nav on every /about route, the
   footer About list, and the "next" link that lets a reader move
   through the whole section linearly.
   ============================================================ */

export const ABOUT_SECTIONS = [
  { to: '/about', label: 'About Us', title: 'About Us', blurb: 'Who HIRUT is, in one page.' },
  {
    to: '/about/leadership',
    label: 'Leadership',
    title: 'Our Leadership',
    blurb: 'Seven professionals, their disciplines and their qualifications.',
  },
  {
    to: '/about/departments',
    label: 'Departments',
    title: 'Our Departments',
    blurb: 'Six specialised departments and what each one covers.',
  },
  {
    to: '/about/expertise',
    label: 'Expertise',
    title: 'Our Expertise',
    blurb: 'The capability the products, services and departments add up to.',
  },
  {
    to: '/about/mission-vision-values',
    label: 'Mission, Vision & Values',
    title: 'Mission, Vision & Values',
    blurb: 'Our vision, mission, purpose and the ten values behind them.',
  },
  {
    to: '/about/client-expectations',
    label: 'Client Expectations',
    title: 'What Every Client Can Expect',
    blurb: 'The promise we make on every project.',
  },
  {
    to: '/about/our-standards',
    label: 'Our Standards',
    title: 'The Standards We Hold Ourselves To',
    blurb: 'How we measure our own work.',
  },
  {
    to: '/about/certifications',
    label: 'Certifications',
    title: 'Certifications & Licenses',
    blurb: 'Registrations, grades and licences.',
  },
] as const

export type AboutPath = (typeof ABOUT_SECTIONS)[number]['to']

export function aboutPathFromLocation(pathname: string): AboutPath {
  const p = pathname.replace(/\/$/, '') || '/'
  return ABOUT_SECTIONS.find((s) => s.to === p)?.to ?? '/about'
}

/** Keep the current pill in view on the mobile row without moving the page. */
function revealCurrentTab() {
  const list = document.querySelector<HTMLElement>('.about-nav-list')
  const active = document.querySelector<HTMLElement>('.about-nav-link.is-current')
  const item = active?.parentElement
  if (!list || !item) return
  const left = item.offsetLeft - (list.clientWidth - item.offsetWidth) / 2
  list.scrollTo({ left: Math.max(0, left), behavior: 'auto' })
}

/** Lives in the About layout, above every sub-page. Overlays the header
    video at the top of the page; sticks under the site header on scroll. */
export function AboutNav({ current }: { current: AboutPath }) {
  useLayoutEffect(() => {
    revealCurrentTab()
  }, [current])

  return (
    <nav className="about-nav" aria-label="About Us sections">
      <div className="container">
        <ul className="about-nav-list">
          {ABOUT_SECTIONS.map((s) => {
            const active = s.to === current
            return (
              <li key={s.to}>
                <Link
                  to={s.to}
                  className={active ? 'about-nav-link is-current' : 'about-nav-link'}
                  aria-current={active ? 'page' : undefined}
                  resetScroll={false}
                  viewTransition={false}
                  onClick={active ? (e) => e.preventDefault() : undefined}
                >
                  {s.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}

/** Linear "next" link so the whole section can be read straight through. */
export function AboutNext({ current }: { current: AboutPath }) {
  const i = ABOUT_SECTIONS.findIndex((s) => s.to === current)
  const next = ABOUT_SECTIONS[(i + 1) % ABOUT_SECTIONS.length]
  const wraps = i === ABOUT_SECTIONS.length - 1
  return (
    <div className="about-next reveal">
      <p className="about-next-label">{wraps ? 'Back to the start' : 'Next in About Us'}</p>
      <Link className="about-next-link" to={next.to} resetScroll>
        {next.title} <span className="arrow" aria-hidden="true">→</span>
      </Link>
      <p className="about-next-blurb">{next.blurb}</p>
    </div>
  )
}
