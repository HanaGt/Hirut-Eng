import { createFileRoute } from '@tanstack/react-router'

import { AboutNext } from '../components/AboutNav'
import { CtaBand, Eyebrow, PageHero } from '../components/PageBits'
import { PhChip, PhMedia } from '../components/Placeholders'
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
    detail: 'grade, category and registering authority pending from client',
  },
  {
    title: 'Trade licence',
    detail: 'licence number, issuing authority and renewal date pending from client',
  },
  {
    title: 'Professional registrations',
    detail: 'professional body registrations for the engineering staff pending from client',
  },
  {
    title: 'ISO & quality certifications',
    detail: 'any ISO or quality-management certifications pending from client',
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
          <PhChip>
            contractor grade/category, trade licence, professional registrations and any ISO
            certifications pending from client: the structure below is built and will receive the
            documents as supplied
          </PhChip>
          <div className="grid grid-2" style={{ marginTop: 'clamp(1.6rem, 3vw, 2.4rem)' }}>
            {SLOTS.map((s, i) => (
              <div
                className="card reveal"
                style={i > 0 ? ({ '--reveal-delay': `${(i % 2) * 0.07}s` } as React.CSSProperties) : undefined}
                key={s.title}
              >
                <p className="card-num">{String(i + 1).padStart(2, '0')}</p>
                <h3>{s.title}</h3>
                <PhChip>{s.detail}</PhChip>
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
              <PhMedia
                ratio="4 / 3"
                detail="Scanned certificates and licences: pending. They will be shown here as supplied, unedited."
              />
            </div>
            <div className="reveal" style={{ '--reveal-delay': '.1s' } as React.CSSProperties}>
              <Eyebrow>For tender submissions</Eyebrow>
              <h2>Company profile</h2>
              <PhChip>
                company profile PDF pending: a download button appears here once the file is
                supplied
              </PhChip>
              <AboutNext current="/about/certifications" />
            </div>
          </div>
        </div>
      </section>

      <CtaBand heading="Need our documents for a prequalification? Ask." />
    </>
  )
}
