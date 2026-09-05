import { useEffect, useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { ABOUT_SECTIONS } from './AboutNav'
import { PhChip } from './Placeholders'
import { HirutMark } from './Logo'
import { categories } from '../data/products'
import { PHONE_1, PHONE_2, SITE_DESCRIPTOR, SITE_NAME, TAGLINE } from '../data/site'

/* About Us carries a submenu of its eight sub-sections. Projects stays out
   of the navigation until real portfolio content exists (revision 3 §6);
   the route itself is still reachable and still prerendered. */
const NAV = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us', sub: ABOUT_SECTIONS },
  { to: '/products', label: 'Products' },
  { to: '/services', label: 'Services' },
  { to: '/partners', label: 'Partners' },
  { to: '/contact', label: 'Contact' },
] as const

function Brand({ footer = false }: { footer?: boolean }) {
  const inner = (
    <>
      <HirutMark size={footer ? 42 : 38} />
      <span>
        <span className="brand-name">HIRUT</span>
        <span className="brand-sub">{SITE_DESCRIPTOR}</span>
      </span>
    </>
  )
  if (footer) return <div className="footer-brand-mark">{inner}</div>
  return (
    <Link className="brand" to="/">
      {inner}
    </Link>
  )
}

export function Header() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  useEffect(() => {
    const sync = () => setSolid(window.scrollY > 24)
    sync()
    window.addEventListener('scroll', sync, { passive: true })
    return () => window.removeEventListener('scroll', sync)
  }, [])

  // Close the drawer and the submenu on navigation; reflect open state on
  // <body> for CSS.
  useEffect(() => {
    setOpen(false)
    setAboutOpen(false)
  }, [pathname])
  useEffect(() => {
    document.body.classList.toggle('nav-open', open)
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  // Esc closes the About submenu, and a click anywhere outside dismisses it.
  useEffect(() => {
    if (!aboutOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAboutOpen(false)
    }
    const onDown = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.nav-item--sub')) setAboutOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onDown)
    }
  }, [aboutOpen])

  return (
    <header className={`site-header header-on-dark${solid ? ' is-solid' : ''}`}>
      <div className="container header-inner">
        <Brand />
        <nav className="site-nav" id="site-nav" aria-label="Primary">
          <ul>
            {NAV.map((item) =>
              'sub' in item ? (
                /* The label stays a link to the landing page; a separate
                   toggle owns the submenu, so About Us is reachable in one
                   click and the eight sections in two, mouse or keyboard.
                   On the mobile drawer the submenu is always shown. */
                <li
                  className={aboutOpen ? 'nav-item--sub is-open' : 'nav-item--sub'}
                  key={item.to}
                  onMouseEnter={() => setAboutOpen(true)}
                  onMouseLeave={() => setAboutOpen(false)}
                >
                  <span className="nav-item-row">
                    <Link to={item.to} activeProps={{ 'aria-current': 'page' }}>
                      {item.label}
                    </Link>
                    <button
                      type="button"
                      className="nav-sub-toggle"
                      aria-expanded={aboutOpen}
                      aria-controls="about-submenu"
                      onClick={() => setAboutOpen((v) => !v)}
                    >
                      <span className="nav-sub-chev" aria-hidden="true" />
                      <span className="sr-only">About Us sections</span>
                    </button>
                  </span>
                  <ul className="nav-sub" id="about-submenu">
                    {item.sub.map((s) => (
                      <li key={s.to}>
                        <Link to={s.to} activeProps={{ 'aria-current': 'page' }}>
                          {s.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    activeOptions={{ exact: item.to === '/' }}
                    activeProps={{ 'aria-current': 'page' }}
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>
        <Link className="btn btn-primary header-cta" to="/contact">
          Request a Quote
        </Link>
        <button
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
          <span className="sr-only">Menu</span>
        </button>
      </div>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Brand footer />
            <p>
              Water and ground engineering, supplied, built, advised, and supported across
              Ethiopia and East Africa since 2016.
            </p>
            <PhChip>physical address, email address &amp; working hours pending</PhChip>
          </div>
          <div>
            <h2 className="footer-h">About Us</h2>
            <ul>
              {ABOUT_SECTIONS.map((s) => (
                <li key={s.to}>
                  <Link to={s.to}>{s.title}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="footer-h">Explore</h2>
            <ul>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/partners">Partners &amp; Brands</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="footer-h">Products</h2>
            <ul>
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link to="/products/$category" params={{ category: c.slug }}>
                    {c.footerLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="footer-h">Contact</h2>
            <ul>
              <li><a href={`tel:${PHONE_1.tel}`}>{PHONE_1.display}</a></li>
              <li><a href={`tel:${PHONE_2.tel}`}>{PHONE_2.display}</a></li>
              <li>
                <Link className="btn btn-primary" style={{ marginTop: 10 }} to="/contact">
                  Request a Quote
                </Link>
              </li>
            </ul>
            <PhChip style={{ marginTop: 12 }}>social links pending</PhChip>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </span>
          <span>{TAGLINE}</span>
        </div>
      </div>
    </footer>
  )
}
