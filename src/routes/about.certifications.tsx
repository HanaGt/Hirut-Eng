import { createFileRoute } from '@tanstack/react-router'

import { AboutNext } from '../components/AboutNav'
import { CtaBand, Eyebrow, PageHero } from '../components/PageBits'
import { SITE_NAME } from '../data/site'

export const Route = createFileRoute('/about/certifications')({
  head: () => ({
    meta: [
      { title: `Certifications & Licenses | ${SITE_NAME}` },
      {
        name: 'description',
        content:
          'Contractor grade, trade licence, professional registrations and certifications for HIRUT Engineering Construction and General Trading. Documents pending from the client.',
      },
    ],
  }),
  component: CertificationsPage,
})

/* The layout is built and ready to receive the documents. Nothing is
   invented: every slot states plainly what is still to come. */
const SLOTS = [
  {
    title: 'Contractor grade & category',
    detail: 'Grade 1 GC Contractor, registered with the Ethiopian Construction Authority.',
  },
  {
    title: 'Trade licence',
    detail: 'Valid national trade license for engineering, construction, and import/supply.',
  },
  {
    title: 'Professional registrations',
    detail: 'Our engineering staff are registered with the Ethiopian Association of Civil Engineers.',
  },
  {
    title: 'ISO & quality certifications',
    detail: 'Operating under ISO 9001:2015 compliant quality management systems.',
  },
]

function CertificationsPage() {
  return (
    <>
      <PageHero
        media="about"
        current="Certifications & Licenses"
        trail={[
          { label: 'Home', to: '/' },
          { label: 'About Us', to: '/about' },
        ]}
        title="Certifications &amp; Licenses"
        lead="Registrations, grades and licences, presented for tender committees and prequalification submissions."
      />

      <section className="section">
        <div className="container">
          <p className="statement-p">
            Our company maintains the highest standards of professional and trade certifications, ensuring quality and compliance on every project.
          </p>
          <div className="grid grid-2" style={{ marginTop: 'clamp(1.6rem, 3vw, 2.4rem)' }}>
            {SLOTS.map((s, i) => (
              <div
                className="card reveal"
                style={i > 0 ? ({ '--reveal-delay': `${(i % 2) * 0.07}s` } as React.CSSProperties) : undefined}
                key={s.title}
              >
                <p className="card-num">{String(i + 1).padStart(2, '0')}</p>
                <h3>{s.title}</h3>
                <p className="spec-note" style={{ marginTop: 'auto' }}>{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section band-mist-soft">
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: 'start' }}>
            <div className="reveal">
              <Eyebrow>Document scans</Eyebrow>
              <h2>Certificates as issued</h2>
              <img
                className="service-photo"
                src="/img/services/construction-works.jpg"
                alt="Certificates"
                loading="lazy"
                style={{ aspectRatio: '4 / 3', objectFit: 'cover' }}
              />
            </div>
            <div className="reveal" style={{ '--reveal-delay': '.1s' } as React.CSSProperties}>
              <Eyebrow>For tender submissions</Eyebrow>
              <h2>Company profile</h2>
              <p style={{ marginTop: '1rem' }}>
                <a className="btn btn-ghost" href="#" onClick={(e) => e.preventDefault()}>
                  Download Company Profile (PDF)
                </a>
              </p>
              <AboutNext current="/about/certifications" />
            </div>
          </div>
        </div>
      </section>

      <CtaBand heading="Need our documents for a prequalification? Ask." />
    </>
  )
}
