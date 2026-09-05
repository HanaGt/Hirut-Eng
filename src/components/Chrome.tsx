import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { jumpScroll, lockPageScroll, unlockPageScroll } from '../lib/scroll-lock'
import { ABOUT_SECTIONS } from './AboutNav'
import { PhChip } from './Placeholders'
import { HirutMark } from './Logo'
import { categories } from '../data/products'
import { OFFICE, PHONE_1, PHONE_2, SITE_DESCRIPTOR, SITE_NAME, TAGLINE } from '../data/site'

/* Projects stays out of the navigation until real portfolio content exists
   (revision 3 §6); the route itself is still reachable and still prerendered. */
const NAV = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/products', label: 'Products' },
  { to: '/services', label: 'Services' },
  { to: '/partners', label: 'Partners' },
  { to: '/contact', label: 'Contact' },
] as const

function normPath(path: string) {
  if (path === '/') return '/'
  return path.replace(/\/$/, '') || '/'
}

function Brand({ footer = false }: { footer?: boolean }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
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
    <Link
      className="brand"
      to="/"
      viewTransition={false}
      onClick={() => {
        if (normPath(pathname) === '/') jumpScroll(0)
      }}
    >
      {inner}
    </Link>
  )
}

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const pathnameRef = useRef(pathname)
  pathnameRef.current = pathname
  const solid = scrolled

  useLayoutEffect(() => {
    const s = window.scrollY > 24
    setScrolled(s)
    document.body.classList.toggle('is-scrolled', s)
  }, [pathname])

  useEffect(() => {
    const sync = () => {
      const s = window.scrollY > 24
      setScrolled(s)
      document.body.classList.toggle('is-scrolled', s)
    }
    window.addEventListener('scroll', sync, { passive: true })
    return () => {
      window.removeEventListener('scroll', sync)
      document.body.classList.remove('is-scrolled')
    }
  }, [])

  // Close the drawer on navigation; reflect open state on <body> for CSS.
  useEffect(() => {
    setOpen(false)
  }, [pathname])
  useEffect(() => {
    document.body.classList.toggle('nav-open', open)
    if (!open) return
    const lockedOn = pathnameRef.current
    lockPageScroll()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.classList.remove('nav-open')
      /* Same page: put them back. Other page: the router places the
         new screen at the top (or at a hash), so do not replay this one. */
      unlockPageScroll(normPath(pathnameRef.current) === normPath(lockedOn))
    }
  }, [open])

  return (
    <header className={`site-header header-on-dark${solid ? ' is-solid' : ''}`}>
      <div className="container header-inner">
        <Brand />
        <nav className="site-nav" id="site-nav" aria-label="Primary">
          <ul>
            {NAV.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  resetScroll
                  viewTransition={false}
                  activeOptions={{ exact: item.to === '/' }}
                  activeProps={{ 'aria-current': 'page' }}
                  onClick={() => {
                    if (normPath(pathname) === normPath(item.to)) jumpScroll(0)
                  }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link
          className="btn btn-primary header-cta"
          to="/contact"
          resetScroll
          viewTransition={false}
          onClick={() => {
            if (normPath(pathname) === '/contact') jumpScroll(0)
          }}
        >
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
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const topIfHere = (to: string) => () => {
    if (normPath(pathname) === normPath(to)) jumpScroll(0)
  }

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
            <p>
              {OFFICE.lines.map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
            <p>{OFFICE.hours}</p>
            <PhChip>email address pending</PhChip>
          </div>
          <div>
            <h2 className="footer-h">About Us</h2>
            <ul>
              {ABOUT_SECTIONS.map((s) => (
                <li key={s.to}>
                  <Link to={s.to} resetScroll onClick={topIfHere(s.to)}>
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="footer-h">Explore</h2>
            <ul>
              <li><Link to="/services" resetScroll onClick={topIfHere('/services')}>Services</Link></li>
              <li><Link to="/products" resetScroll onClick={topIfHere('/products')}>Products</Link></li>
              <li><Link to="/partners" resetScroll onClick={topIfHere('/partners')}>Partners &amp; Brands</Link></li>
              <li><Link to="/contact" resetScroll onClick={topIfHere('/contact')}>Contact</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="footer-h">Products</h2>
            <ul>
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    to="/products/$category"
                    params={{ category: c.slug }}
                    resetScroll
                    onClick={topIfHere(`/products/${c.slug}`)}
                  >
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
                <Link
                  className="btn btn-primary"
                  style={{ marginTop: 10 }}
                  to="/contact"
                  resetScroll
                  onClick={topIfHere('/contact')}
                >
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
