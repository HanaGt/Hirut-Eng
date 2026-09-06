import { Link, createFileRoute } from '@tanstack/react-router'

import { AboutNext } from '../components/AboutNav'
import { CtaBand, Eyebrow, PageHero } from '../components/PageBits'
import { departments } from '../data/departments'
import { categories } from '../data/products'
import { SITE_NAME } from '../data/site'

export const Route = createFileRoute('/about/expertise')({
  head: () => ({
    meta: [
      { title: `Our Expertise | ${SITE_NAME}` },
      {
        name: 'description',
        content:
          'The capability behind the work: seven product categories, three service lines (construction works, professional and consultancy services, after-sales services), and six specialised departments.',
      },
    ],
  }),
  component: ExpertisePage,
})

/* Assembled only from capability already published on this site: the seven
   product categories, the three service lines, and the six departments.
   No new claims are made here. */
const SERVICE_LINES = [
  {
    hash: 'construction' as const,
    title: 'Construction Works',
    body: 'Field crews and site engineers who install what we import, from a single pump station to complete water supply infrastructure.',
  },
  {
    hash: 'consultancy' as const,
    title: 'Professional & Consultancy Services',
    body: 'Design and advisory work delivered across Africa: engineering judgment on paper before anything goes in the ground.',
  },
  {
    hash: 'after-sales' as const,
    title: 'After-Sales Services',
    body: 'A six-pillar service organisation: commissioning, training, maintenance, warranty support, monitoring and emergency response.',
  },
]

function ExpertisePage() {
  return (
    <>
      <PageHero
        media="about"
        current="Our Expertise"
        trail={[
          { label: 'Home', to: '/' },
          { label: 'About Us', to: '/about' },
        ]}
        title="Our Expertise"
        lead="What the firm can actually do, drawn from what it supplies, what it builds, and the departments that carry the work."
      />

      {/* Supply */}
      <section className="section" id="supply-expertise">
        <div className="container">
          <div className="section-head reveal">
            <Eyebrow>Supply</Eyebrow>
            <h2>Seven product categories</h2>
            <p className="lead">
              Imported and supplied with technical backing, and installed by the same firm that
              sells them.
            </p>
          </div>
          <div className="grid grid-3">
            {categories.map((c, i) => (
              <Link
                className="card reveal"
                style={i % 3 !== 0 ? ({ '--reveal-delay': `${(i % 3) * 0.05}s` } as React.CSSProperties) : undefined}
                to="/products/$category"
                params={{ category: c.slug }}
                resetScroll
                key={c.slug}
              >
                <p className="card-num">{c.tagLabels.join(' · ')}</p>
                <h3>{c.name}</h3>
                <p>{c.cardBlurb}</p>
                <span className="card-link">View category →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Build and advise */}
      <section className="section band-mist-soft" id="service-expertise">
        <div className="container">
          <div className="section-head reveal">
            <Eyebrow>Build &amp; advise</Eyebrow>
            <h2>Three service lines</h2>
          </div>
          <div className="grid grid-3">
            {SERVICE_LINES.map((s, i) => (
              <Link
                className="card reveal"
                style={i > 0 ? ({ '--reveal-delay': `${i * 0.06}s` } as React.CSSProperties) : undefined}
                to="/services"
                hash={s.hash}
                resetScroll
                hashScrollIntoView={{ block: 'start' }}
                key={s.hash}
              >
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <span className="card-link">See the service line →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* The departments that carry it */}
      <section className="section" id="department-expertise">
        <div className="container">
          <div className="section-head reveal">
            <Eyebrow>Who carries the work</Eyebrow>
            <h2>Six departments</h2>
            <p className="lead">
              Each department is led by experienced professionals with specialised technical and
              managerial capabilities.
            </p>
          </div>
          <ul className="dept-preview">
            {departments.map((d, i) => (
              <li
                className="reveal"
                style={i % 3 !== 0 ? ({ '--reveal-delay': `${(i % 3) * 0.05}s` } as React.CSSProperties) : undefined}
                key={d.slug}
              >
                <Link to="/about/departments" hash={d.slug} resetScroll hashScrollIntoView={{ block: 'start' }}>
                  <span className="dept-preview-num" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {d.name}
                </Link>
              </li>
            ))}
          </ul>
          <AboutNext current="/about/expertise" />
        </div>
      </section>

      <CtaBand heading="Describe the problem. We will tell you which discipline it needs." />
    </>
  )
}
