import { Link, createFileRoute } from '@tanstack/react-router'

import { ConstructionSlideshow } from '../components/ConstructionSlideshow'
import { CtaBand, Eyebrow, PageHero } from '../components/PageBits'
import { constructionPhotos } from '../data/media'
import { afterSalesPillars } from '../data/site'

export const Route = createFileRoute('/services')({
  head: () => ({
    meta: [
      { title: 'Services: Construction, Consultancy & After-Sales | Hirut Engineering' },
      {
        name: 'description',
        content:
          'Construction works, professional design and consultancy, and a six-pillar after-sales program: well drilling, irrigation, hydraulic structures, waterproofing, piezometer installation, commissioning, training, maintenance, and long-term monitoring.',
      },
      { property: 'og:title', content: 'Services | Hirut Engineering' },
      {
        property: 'og:description',
        content: 'We build it, we design it, and we support it for years after commissioning.',
      },
    ],
  }),
  component: ServicesPage,
})

const CONSTRUCTION = [
  'Electromechanical & General Sanitary Works',
  'Hydraulic Structure Construction',
  'Modern Irrigation Design & Build',
  'Piezometer Installation & Geotechnical Works',
  'Solar Pump Installation & Commissioning',
  'Water Features & Fountain Works',
  'Water Supply Infrastructure Construction',
  'Waterproofing Works',
  'Well Drilling & General Construction Works',
]

const CONSULTANCY = [
  {
    num: 'PM · M&E',
    title: 'Project Management, Monitoring & Evaluation',
    body: 'Independent oversight that keeps projects on scope, on budget, and honest.',
  },
  {
    num: 'Water',
    title: 'Well Drilling Design & Consultancy',
    body: 'Hydrogeological judgment for boreholes that produce, and keep producing.',
  },
  {
    num: 'Irrigation',
    title: 'Modern Irrigation Consultancy',
    body: 'Drip and sprinkler system design matched to crop, soil, and water source.',
  },
  {
    num: 'Fire',
    title: 'Building Fire System Design & Consultancy',
    body: 'Code-compliant fire system design for commercial and institutional buildings.',
  },
  {
    num: 'Sanitary',
    title: 'Building Sanitary System Design & Consultancy',
    body: 'Water supply and drainage design that works for the life of the building.',
  },
  {
    num: 'Features',
    title: 'Water Features & Aquariums Design & Consultancy',
    body: 'Fountains, features, and aquariums engineered, not just decorated.',
  },
]

function ServicesPage() {
  return (
    <>
      <PageHero
        media="services"
        current="Services"
        title="Build. Advise. Support."
        lead="Three service lines under one roof: construction crews, professional consultants, and an after-sales organization that stays engaged for the life of what we deliver."
      >
        <p style={{ marginTop: '1.4rem', display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <a className="btn btn-ghost" href="#construction">Construction</a>
          <a className="btn btn-ghost" href="#consultancy">Consultancy</a>
          <a className="btn btn-ghost" href="#after-sales">After-Sales</a>
        </p>
      </PageHero>

      {/* Construction */}
      <section className="section" id="construction">
        <div className="container">
          <div className="section-head reveal">
            <Eyebrow>Service line 01</Eyebrow>
            <h2>Construction Works</h2>
            {/* §1.4 construction motto  a banner line for construction works only,
                added alongside the existing copy, not in place of any of it */}
            <p className="motto">Engineering Integrity, Delivering Excellence!</p>
            <p className="lead">
              Field crews and site engineers who install what we import, from a single pump station
              to complete water supply infrastructure.
            </p>
          </div>
          <div className="grid grid-2 construction-split">
            <ul className="spec-list reveal">
              {CONSTRUCTION.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="reveal construction-split-media" style={{ '--reveal-delay': '.1s' } as React.CSSProperties}>
              <ConstructionSlideshow photos={constructionPhotos} />
            </div>
          </div>
          <p style={{ marginTop: '1.6rem' }}>
            <Link className="btn btn-primary" to="/contact" search={{ type: 'construction-services' }}>
              Discuss a construction project <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </p>
        </div>
      </section>

      {/* Consultancy */}
      <section className="section band-mist-soft" id="consultancy">
        <div className="container">
          <div className="section-head reveal">
            <Eyebrow>Service line 02</Eyebrow>
            <h2>Professional &amp; Consultancy Services</h2>
            <p className="lead">
              Design and advisory work delivered across Africa: engineering judgment on paper
              before anything goes in the ground.
            </p>
          </div>
          <div className="grid grid-3">
            {CONSULTANCY.map((c, i) => (
              <div
                className="card reveal"
                style={i % 3 !== 0 ? ({ '--reveal-delay': `${(i % 3) * 0.05}s` } as React.CSSProperties) : undefined}
                key={c.num}
              >
                <p className="card-num">{c.num}</p>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </div>
            ))}
          </div>
          <p style={{ marginTop: '1.6rem' }}>
            <Link className="btn btn-primary" to="/contact" search={{ type: 'consultancy-services' }}>
              Engage our consultants <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </p>
        </div>
      </section>

      {/* After-sales */}
      <section className="section" id="after-sales">
        <div className="container">
          <div className="section-head reveal">
            <Eyebrow>Service line 03 · the differentiator</Eyebrow>
            <h2>After-Sales Services</h2>
            <p className="lead">
              Most suppliers in this market disappear after commissioning. Our after-sales program
              is a six-pillar service organization. Expand each pillar to see exactly what it
              covers.
            </p>
          </div>
          <div className="pillars pillars--light reveal">
            {afterSalesPillars.map((p, i) => (
              <details className="pillar" open={i === 0} key={p.title}>
                <summary>{p.title}</summary>
                <div className="pillar-body">
                  <ul>
                    {p.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
          <p style={{ marginTop: '1.6rem' }}>
            <Link className="btn btn-primary" to="/contact" search={{ type: 'after-sales' }}>
              Ask about after-sales coverage <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </p>
        </div>
      </section>

      <CtaBand heading="One contract. Design, build, and years of support." />
    </>
  )
}
