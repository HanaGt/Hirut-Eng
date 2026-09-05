import { Link } from '@tanstack/react-router'
import { EyebrowWave, FlowWaves } from './Waves'
import { HirutMark } from './Logo'
import { headerMedia, headerStill, headerVideo } from '../data/media'
import { PHONE_1, PHONE_2 } from '../data/site'

export function Eyebrow({ children, center }: { children: React.ReactNode; center?: boolean }) {
  return (
    <p className="eyebrow" style={center ? { justifyContent: 'center' } : undefined}>
      <EyebrowWave />
      {children}
    </p>
  )
}

type CrumbTo = '/' | '/products' | '/about'

export function Breadcrumbs({
  trail,
  current,
}: {
  trail: Array<{ label: string; to: CrumbTo }>
  current: string
}) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {trail.map((t) => (
        <span key={t.to + t.label}>
          <Link to={t.to} resetScroll>{t.label}</Link>
          <span className="sep">/</span>
        </span>
      ))}
      {current}
    </nav>
  )
}

export function PageHero({
  current,
  trail = [{ label: 'Home', to: '/' }],
  title,
  lead,
  media,
  children,
}: {
  current: string
  trail?: Array<{ label: string; to: CrumbTo }>
  title: React.ReactNode
  lead: React.ReactNode
  /** key into `headerMedia`  still paints at once, clip fades in after */
  media?: keyof typeof headerMedia
  children?: React.ReactNode
}) {
  const m = media ? headerMedia[media] : undefined
  return (
    <section className={m ? 'page-hero page-hero--media' : 'page-hero'}>
      {m ? (
        <>
          <img
            className="page-hero-still"
            {...headerStill(m)}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            decoding="async"
          />
          <video
            className="page-hero-video"
            data-bg-video
            data-src={headerVideo(m)}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            tabIndex={-1}
          />
          <span className="page-hero-scrim" aria-hidden="true" />
        </>
      ) : null}
      <div className="container">
        <Breadcrumbs trail={trail} current={current} />
        <h1>{title}</h1>
        <p className="lead">{lead}</p>
        {children}
      </div>
    </section>
  )
}

export function CtaBand({
  eyebrow,
  heading,
  body,
  label = 'Request a Quote',
  search,
  phones = false,
}: {
  eyebrow?: string
  heading: string
  body?: string
  label?: string
  search?: { type: string }
  phones?: boolean
}) {
  return (
    <section className="section band-dark cta-band">
      <div className="container reveal">
        {eyebrow ? <Eyebrow center>{eyebrow}</Eyebrow> : null}
        <h2>{heading}</h2>
        {body ? <p style={{ maxWidth: '52ch', marginInline: 'auto' }}>{body}</p> : null}
        <Link className="btn btn-primary" to="/contact" search={search} resetScroll>
          {label} <span className="arrow" aria-hidden="true">→</span>
        </Link>
        {phones ? (
          <p style={{ marginTop: '1.4rem' }}>
            <a href={`tel:${PHONE_1.tel}`}>{PHONE_1.display}</a>
            {' · '}
            <a href={`tel:${PHONE_2.tel}`}>{PHONE_2.display}</a>
          </p>
        ) : null}
      </div>
      <FlowWaves on="dark" height="clamp(34px, 5vw, 60px)" />
    </section>
  )
}

/* ============================================================
   Orica Digital Solutions co-branded partnership band (v2 §5): ink background,
   Hirut × Orica Digital Solutions lockup, exclusivity headline, instrument families,
   CTA into the Geotechnical Equipment category. The partner logo is
   NEVER redrawn or restyled - an official file drops into the light
   chip slot untouched.
   ============================================================ */
export function OricaBand({ compact = false }: { compact?: boolean }) {
  return (
    <section className="section orica-band" id="orica">
      <div className="container orica-grid">
        <div className="reveal">
          <p className="orica-exclusive">
            <EyebrowWave />
            Exclusive · East Africa
          </p>
          <div className="orica-lockup">
            <span className="lockup-hirut">
              <HirutMark size={44} />
              HIRUT
            </span>
            <span className="lockup-x" aria-hidden="true">
              ×
            </span>
            {/* Third-party trademark: shown as supplied, in its official
                colours on a white chip. Never recoloured or redrawn. */}
            <span className="orica-logo-slot orica-logo-slot--filled">
              <picture>
                <source type="image/webp" srcSet="/img/logo/orica.webp" />
                <img
                  src="/img/logo/orica.png"
                  alt="Orica Digital Solutions"
                  width={234}
                  height={76}
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </span>
          </div>
          <h2>The only importer &amp; installer of Orica Digital Solutions geotechnical and subsurface instruments in East Africa</h2>
          <p>
            When a dam, a deep excavation, or a slope needs to be understood rather than guessed at,
            Hirut Engineering supplies and installs the globally sought-after Orica Digital Solutions monitoring
            instruments, exclusively in East Africa.
          </p>
          <p>
            Piezometers (vibrating wire and standpipe), inclinometers, extensometers, and complete
            subsurface monitoring systems, installed, commissioned, and monitored by our own
            engineers.
          </p>
          <p style={{ marginTop: '1.2rem' }}>
            <Link
              className="btn btn-primary"
              to="/products/$category"
              params={{ category: 'geotechnical-equipment' }}
            >
              Geotechnical instruments <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </p>
        </div>
        {compact ? null : (
          <div className="reveal" style={{ '--reveal-delay': '.1s' } as React.CSSProperties}>
            <ul className="check-list">
              <li>Vibrating Wire Piezometers (VWP)</li>
              <li>Standpipe Piezometers</li>
              <li>Inclinometers</li>
              <li>Extensometers &amp; Strain Gauges</li>
              <li>Tensiometers &amp; Earth Pressure Cells</li>
              <li>Subsurface monitoring systems with data reporting</li>
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
