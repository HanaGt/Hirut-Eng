import { Link, createFileRoute } from '@tanstack/react-router'

import { CtaBand, Eyebrow, OricaBand } from '../components/PageBits'
import { PhChip, SampleImg } from '../components/Placeholders'
import { ScrubBand } from '../components/ScrubBand'
import { StatsBand } from '../components/StatsBand'
import { FlowWaves } from '../components/Waves'
import { categories } from '../data/products'
import { categoryImages, legImages, projectImages, stock, stockSoft } from '../data/media'
import { SITE_NAME, sampleProjects } from '../data/site'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: `${SITE_NAME} — Water & Ground Engineering, Ethiopia` },
      {
        name: 'description',
        content:
          'Ethiopian engineering, construction and supply company: well drilling, modern irrigation, geotechnical instrumentation, waterproofing and hydraulic works — supplied, built, and supported. Exclusive East Africa importer and installer of Orica geotechnical instruments.',
      },
      { property: 'og:image', content: '/img/hero-poster.jpg' },
      { property: 'og:title', content: 'Hirut Engineering — Engineering water. Understanding ground.' },
      {
        property: 'og:description',
        content:
          'Well drilling, modern irrigation, geotechnical instrumentation and waterproofing across Ethiopia and East Africa — supplied, built, advised, and supported after the sale.',
      },
    ],
    links: [
      {
        rel: 'preload',
        as: 'image',
        type: 'image/webp',
        imagesrcset: '/img/hero-poster-800.webp 800w, /img/hero-poster.webp 1280w',
        imagesizes: '100vw',
        fetchpriority: 'high',
      },
    ],
  }),
  component: HomePage,
})

const ORG_JSON_LD = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  description:
    'Ethiopian engineering, construction and import/supply company working in water and ground: well drilling, modern irrigation, geotechnical instrumentation, hydraulic structures and waterproofing.',
  foundingDate: '2016',
  telephone: ['+251911518448', '+251976575859'],
  areaServed: ['Ethiopia', 'East Africa'],
  knowsAbout: [
    'Well drilling',
    'Irrigation systems',
    'Geotechnical instrumentation',
    'Waterproofing',
    'Hydraulic structures',
    'Gabions',
    'Geosynthetics',
    'Pumps',
  ],
})

const LEGS = [
  {
    num: '01 — Supply',
    title: 'Import & supply',
    body: 'Seven product categories imported and sold with technical backing behind every line.',
    linkShort: 'Browse the catalog',
    to: '/products',
    hash: undefined as string | undefined,
  },
  {
    num: '02 — Build',
    title: 'Construction & installation',
    body: 'Well drilling, hydraulic structures, irrigation and water supply infrastructure, built by our own crews.',
    linkShort: 'Construction services',
    to: '/services',
    hash: 'construction',
  },
  {
    num: '03 — Advise',
    title: 'Design & consultancy',
    body: 'Design, project management and evaluation — engineering judgment before anything goes in the ground.',
    linkShort: 'Consultancy services',
    to: '/services',
    hash: 'consultancy',
  },
  {
    num: '04 — Support',
    title: 'After-sales program',
    body: 'Commissioning, training, maintenance and emergency response — six pillars, not a promise.',
    linkShort: 'After-sales services',
    to: '/services',
    hash: 'after-sales',
  },
]

const PARTNER_BAND = [
  'Orica',
  'RST Instruments',
  'SISGEO',
  'ENCARDIO RITE',
  'Hunter',
  'Perkins',
  'JCB',
  'PENTAX',
  'Defence Construction Enterprise',
  'Oromia Water Works Construction Enterprise',
  'Zemen Construction Corporation',
  'Ethiopian Army Foundation',
]

const PILLARS_COMPACT = [
  { num: '01', title: 'Technical Support & Customer Service', body: 'Application advisory, on-site and remote support, troubleshooting, O&M guidance.' },
  { num: '02', title: 'Installation, Commissioning & Start-Up', body: 'Installation, testing, calibration, performance verification, and start-up support.' },
  { num: '03', title: 'Maintenance, Inspection & Repair', body: 'Preventive and corrective maintenance, servicing, repair, and rehabilitation works.' },
  { num: '04', title: 'Training & Capacity Building', body: 'Equipment O&M, instrumentation, pump and irrigation training, on-site demonstrations.' },
  { num: '05', title: 'Warranty & Defect Support', body: 'Warranty administration, defect investigation and rectification, post-installation follow-up.' },
  { num: '06', title: 'Periodic Monitoring & Emergency Support', body: 'Scheduled inspections, long-term monitoring contracts, and rapid-response repair.' },
]

function HomePage() {
  const featured = sampleProjects.slice(0, 3)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ORG_JSON_LD }} />

      {/* 1. Hero — poster paints instantly, the ambient loop fades in behind
             it once it is near-buffered (skipped under reduced motion /
             Save-Data by the shared bg-video effect). */}
      <section className="hero">
        {/* The still is the LCP element: eager, preloaded, high priority.
            The ambient loop fades in over it once idle. */}
        <picture>
          <source
            type="image/webp"
            srcSet="/img/hero-poster-800.webp 800w, /img/hero-poster.webp 1280w"
            sizes="100vw"
          />
          <img
            className="hero-bg"
            src="/img/hero-poster.jpg"
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <video
          className="hero-bg hero-bg--video"
          muted
          loop
          playsInline
          preload="none"
          data-bg-video
          data-src="/video/hero-site.mp4"
          aria-hidden="true"
          tabIndex={-1}
        />
        <div className="hero-scrim" aria-hidden="true" />
        <div className="container">
          <Eyebrow>Ethiopia · Since 2016</Eyebrow>
          <h1>
            Engineering <span className="accent-water">water</span>. Understanding{' '}
            <span className="accent-ground">ground</span>.
          </h1>
          <p className="hero-lead">
            From deep boreholes to modern irrigation, from piezometers reading the subsurface to
            membranes sealing it out — Hirut Engineering supplies, builds, advises, and stays to
            support what it delivers.
          </p>
          <div className="hero-ctas">
            <Link className="btn btn-primary" to="/contact">
              Request a Quote <span className="arrow" aria-hidden="true">→</span>
            </Link>
            <Link className="btn btn-ghost" to="/products">
              Explore Products
            </Link>
          </div>
          <p className="sample-note">
            Sample background — an illustrative animated site scene, standing in until the
            company's own footage is supplied.
          </p>
        </div>
        <div className="hero-wave">
          <FlowWaves on="dark" />
        </div>
      </section>

      {/* 2. Stats (§6 correction applied: $100M+ Total portfolio) */}
      <StatsBand />

      {/* 3. What we do */}
      <section className="section" id="what-we-do" data-cycle-group>
        <div className="container">
          <div className="section-head reveal-cycle">
            <Eyebrow>What we do</Eyebrow>
            <h2>One firm, four commitments</h2>
            <p className="lead">
              Most suppliers sell and leave. Most contractors build and hand over. Hirut Engineering
              does both — and designs the work, and stays afterward.
            </p>
          </div>
          <div className="legs" data-cycle-group>
            {LEGS.map((leg, i) => (
              <Link
                className="leg reveal-cycle"
                style={{ '--reveal-delay': `${i * 0.09}s` } as React.CSSProperties}
                to={leg.to as '/products' | '/services'}
                hash={leg.hash}
                key={leg.num}
              >
                <img
                  className="leg-img"
                  {...stockSoft(legImages[i])}
                  sizes="(max-width: 560px) 50vw, (max-width: 980px) 34vw, 20vw"
                  loading="lazy"
                  decoding="async"
                  alt=""
                />
                <span className="leg-body">
                  <span className="leg-num">{leg.num}</span>
                  <h3>{leg.title}</h3>
                  <p>{leg.body}</p>
                  <span className="leg-link">
                    {leg.linkShort} <span className="arrow" aria-hidden="true">→</span>
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Signature scroll-scrubbed band — the one bold moment */}
      <ScrubBand />

      {/* 5. Product categories */}
      <section className="section band-mist-soft" id="products">
        <div className="container">
          <div className="section-head reveal">
            <Eyebrow>Supply</Eyebrow>
            <h2>Seven product categories, imported and backed</h2>
            <p className="lead">
              Every category ships with the same promise: honest specifications, installation
              capability in-house, and support after commissioning.
            </p>
          </div>
          <div className="grid grid-3">
            {categories.map((c, i) => (
              <Link
                className="card card--media reveal"
                style={i % 3 !== 0 ? ({ '--reveal-delay': `${(i % 3) * 0.06}s` } as React.CSSProperties) : undefined}
                to="/products/$category"
                params={{ category: c.slug }}
                key={c.slug}
              >
                <SampleImg {...stock(categoryImages[c.slug])} />
                <div className="card-body">
                  <h3>{c.name}</h3>
                  <p>{c.cardBlurb}</p>
                  <span className="card-link">View category →</span>
                </div>
              </Link>
            ))}
            <Link className="card reveal" to="/contact">
              <p className="card-num">Not sure where to start?</p>
              <h3>Talk to an engineer</h3>
              <p>
                Describe the problem — seepage, a slope, a field to irrigate, a well to drill — and
                we'll specify the right products for it.
              </p>
              <span className="card-link">Request a quote →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Orica co-branded partnership band */}
      <OricaBand />

      {/* 7. Featured projects */}
      <section className="section" id="featured-projects">
        <div className="container">
          <div className="section-head reveal">
            <Eyebrow>Track record</Eyebrow>
            <h2>Selected projects</h2>
            <p className="lead">
              50+ projects delivered across Ethiopia and consultancy work across Africa.
            </p>
            <PhChip>
              real project content pending — the three cards below are labeled samples with
              illustrative artwork, demonstrating the layout only
            </PhChip>
          </div>
          <div className="grid grid-3">
            {featured.map((p, i) => (
              <Link
                className="card card--media project-card reveal"
                style={i > 0 ? ({ '--reveal-delay': `${i * 0.08}s` } as React.CSSProperties) : undefined}
                to="/projects"
                key={p.title}
              >
                <span className="sample-flag">Sample</span>
                <SampleImg {...stock(projectImages[i])} />
                <div className="card-body">
                  <div className="project-meta">
                    <span>{p.sectorLabel}</span>
                    <span>·</span>
                    <span>{p.regionLabel}</span>
                  </div>
                  <h3>{p.title}</h3>
                  <p>Layout demonstration — real project scope, client, and outcome to be supplied.</p>
                  <span className="card-link">All projects →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 8. After-sales promise */}
      <section className="section band-ink" id="after-sales-promise">
        <div className="container">
          <div className="section-head reveal">
            <Eyebrow>Support — the fourth leg</Eyebrow>
            <h2>We're still here after commissioning</h2>
            <p className="lead">
              In this market, a supplier who stays after the sale is rare. Our after-sales program
              has six pillars — each a real service line with its own engineers, not a courtesy
              call.
            </p>
          </div>
          <div className="grid grid-3">
            {PILLARS_COMPACT.map((p, i) => (
              <div
                className="card reveal"
                style={i % 3 !== 0 ? ({ '--reveal-delay': `${(i % 3) * 0.05}s` } as React.CSSProperties) : undefined}
                key={p.num}
              >
                <p className="card-num">{p.num}</p>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
          <p style={{ marginTop: '2rem' }}>
            <Link className="btn btn-ghost" to="/services" hash="after-sales">
              The full after-sales program <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </p>
        </div>
      </section>

      {/* 9. Partners band */}
      <section className="section section--tight band-mist" id="partners-band">
        <div className="container">
          <div className="section-head reveal">
            <Eyebrow>Partners &amp; brands we work with</Eyebrow>
            <h2>Trusted by builders, chosen by brands</h2>
          </div>
          <div className="badge-grid reveal" aria-label="Partners and brands">
            {PARTNER_BAND.map((name) => (
              <span className="p-badge" key={name}>
                {name}
              </span>
            ))}
          </div>
          <p style={{ marginTop: '1.6rem' }}>
            <Link to="/partners">All partners &amp; brands →</Link>
          </p>
        </div>
      </section>

      {/* 10. Contact CTA */}
      <CtaBand
        eyebrow="Start a conversation"
        heading="Tell us what you're building. We'll still be there after handover."
        body="Quotes, specifications, site visits, and honest engineering advice — for projects of any size."
        phones
      />
    </>
  )
}
