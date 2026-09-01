import { useEffect, useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { PhChip } from './Placeholders'
import { HirutMark } from './Logo'
import { categories } from '../data/products'
import { PHONE_1, PHONE_2, SITE_NAME, TAGLINE } from '../data/site'

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/products', label: 'Products' },
  { to: '/services', label: 'Services' },
  { to: '/projects', label: 'Projects' },
  { to: '/partners', label: 'Partners' },
  { to: '/contact', label: 'Contact' },
] as const

function Brand({ footer = false }: { footer?: boolean }) {
  const inner = (
    <>
      <HirutMark size={footer ? 42 : 38} />
      <span>
        <span className="brand-name">HIRUT</span>
        <span className="brand-sub">Engineering &amp; General Trading PLC</span>
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
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  useEffect(() => {
    const sync = () => setSolid(window.scrollY > 24)
    sync()
    window.addEventListener('scroll', sync, { passive: true })
    return () => window.removeEventListener('scroll', sync)
  }, [])

  // Close the drawer on navigation; reflect open state on <body> for CSS.
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.body.classList.toggle('nav-open', open)
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
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
                  activeOptions={{ exact: item.to === '/' }}
                  activeProps={{ 'aria-current': 'page' }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
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
            <h2 className="footer-h">Explore</h2>
            <ul>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/projects">Projects</Link></li>
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
