import { createFileRoute } from '@tanstack/react-router'

import { CtaBand, Eyebrow, PageHero } from '../components/PageBits'
import { PhChip, PhMedia, SampleImg } from '../components/Placeholders'
import { StatsBand } from '../components/StatsBand'
import { stock, teamImage } from '../data/media'

export const Route = createFileRoute('/about')({
  head: () => ({
    meta: [
      { title: 'About Us — Hirut Engineering and General Trading PLC' },
      {
        name: 'description',
        content:
          'Founded in 2016 by experienced engineers, Hirut Engineering has grown into a multi-disciplinary supply, construction, and consultancy firm — and the exclusive East Africa importer and installer of Orica geotechnical instruments.',
      },
      { property: 'og:title', content: 'About Hirut Engineering' },
      {
        property: 'og:description',
        content:
          'Founded by engineers in 2016. 50+ projects across Ethiopia, 50+ skilled engineers, $100M+ USD total portfolio.',
      },
    ],
  }),
  component: AboutPage,
})

const WHY = [
  {
    num: 'Exclusivity',
    title: 'Orica, exclusively',
    body: 'The only importer and installer of Orica geotechnical and subsurface instruments in East Africa.',
  },
  {
    num: 'People',
    title: '50+ engineers',
    body: 'An in-house engineering team that designs, installs, and commissions what we sell.',
  },
  {
    num: 'Support',
    title: 'After-sales depth',
    body: 'A six-pillar after-sales program — from training to long-term monitoring and emergency response.',
  },
  {
    num: 'Track record',
    title: '$100M+ portfolio',
    body: 'More than fifty projects across Ethiopia and consultancy work across Africa since 2016.',
  },
]

function AboutPage() {
  return (
    <>
      <PageHero
        current="About"
        title="Built by engineers, for the long term"
        lead="Hirut Engineering and General Trading PLC was founded in 2016 by engineers with long field experience. Ten years on, we are a multi-disciplinary firm that supplies, builds, advises — and stays."
      />

      <section className="section">
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: 'center' }}>
            <div className="reveal">
              <Eyebrow>Our story</Eyebrow>
              <h2>From field experience to a full-service firm</h2>
              <p>
                Founded by engineers with many years of experience, our company has successfully
                completed major projects. We deliver quality work in piezometer installation,
                subsurface investigation and research, water well drilling, modern irrigation (drip
                and sprinkler) design and supply, and the importation and installation of building
                waterproofing materials.
              </p>
              <p>
                We import quality construction and seepage-prevention materials, and we are the
                exclusive East Africa importer and installer of Orica's globally sought-after
                geotechnical and subsurface instruments.
              </p>
              <PhChip>
                confirm exact Orica brand wording — “Orica Digital Solutions” vs “Orica Geosolution”
              </PhChip>
            </div>
            <div className="reveal" style={{ '--reveal-delay': '.1s' } as React.CSSProperties}>
              <SampleImg {...stock(teamImage)} ratio="4 / 3" sizes="(max-width: 980px) 92vw, 44vw" />
              <p className="sample-note">
                Sample photograph — stock imagery standing in until the company's own site
                photography is supplied.
              </p>
            </div>
          </div>
        </div>
      </section>

      <StatsBand />

      <section className="section band-mist-soft">
        <div className="container">
          <div className="section-head reveal">
            <Eyebrow>Direction</Eyebrow>
            <h2>Mission, vision &amp; values</h2>
          </div>
          <div className="grid grid-3">
            {(['Mission', 'Vision', 'Values'] as const).map((t, i) => (
              <div
                className="card reveal"
                style={i > 0 ? ({ '--reveal-delay': `${i * 0.08}s` } as React.CSSProperties) : undefined}
                key={t}
              >
                <p className="card-num">{t}</p>
                <h3>{t}</h3>
                <PhChip>{t.toLowerCase()} statement pending from client</PhChip>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <Eyebrow>Why Hirut</Eyebrow>
            <h2>What sets this firm apart</h2>
          </div>
          <div className="grid grid-4">
            {WHY.map((w, i) => (
              <div
                className="card reveal"
                style={i > 0 ? ({ '--reveal-delay': `${i * 0.06}s` } as React.CSSProperties) : undefined}
                key={w.num}
              >
                <p className="card-num">{w.num}</p>
                <h3>{w.title}</h3>
                <p>{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section band-mist-soft">
        <div className="container">
          <div className="grid grid-2">
            <div className="reveal">
              <Eyebrow>People</Eyebrow>
              <h2>Leadership &amp; team</h2>
              <PhChip>
                leadership and team profiles pending — photo, name, role, and short bio slots will
                be populated here
              </PhChip>
              <div className="grid grid-2" style={{ marginTop: '1.4rem' }}>
                <PhMedia ratio="3/4" detail="Team profile" />
                <PhMedia ratio="3/4" detail="Team profile" />
              </div>
            </div>
            <div className="reveal" style={{ '--reveal-delay': '.1s' } as React.CSSProperties}>
              <Eyebrow>Credentials</Eyebrow>
              <h2>Certifications &amp; licenses</h2>
              <PhChip>
                certifications, licenses, and contractor grade pending — document list and scans
                will be presented here
              </PhChip>
              <ul className="check-list" style={{ marginTop: '1.4rem' }}>
                <li><PhChip>certification item pending</PhChip></li>
                <li><PhChip>license item pending</PhChip></li>
                <li><PhChip>contractor grade pending</PhChip></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <CtaBand heading="Work with a firm that will still answer the phone next year" />
    </>
  )
}
