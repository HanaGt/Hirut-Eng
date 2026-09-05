import { Link, createFileRoute } from '@tanstack/react-router'

import { ABOUT_SECTIONS, AboutNav, AboutNext } from '../components/AboutNav'
import { CtaBand, Eyebrow, PageHero } from '../components/PageBits'
import { PhChip, PhMedia, SampleImg } from '../components/Placeholders'
import { StatsBand } from '../components/StatsBand'
import { stock, teamImage } from '../data/media'
import { clientExpectations, corporatePromise, leadershipIntro, purpose } from '../data/about'
import { departments } from '../data/departments'
import { leaderInitials, leadership } from '../data/leadership'
import { SITE_NAME } from '../data/site'

export const Route = createFileRoute('/about/')({
  head: () => ({
    meta: [
      { title: `About Us | ${SITE_NAME}` },
      {
        name: 'description',
        content:
          'Founded in 2016 by experienced engineers, HIRUT Engineering Construction and General Trading is a multidisciplinary supply, construction and consultancy firm, and the exclusive East Africa importer and installer of Orica Digital Solutions geotechnical instruments.',
      },
      { property: 'og:title', content: 'About HIRUT Engineering' },
      {
        property: 'og:description',
        content:
          'Engineer-led since 2016. 50+ projects across Ethiopia, 50+ skilled engineers, $100M+ USD total portfolio.',
      },
    ],
  }),
  component: AboutIndexPage,
})

/* Kept from the approved v2 About page. */
const WHY = [
  {
    num: 'Exclusivity',
    title: 'Orica Digital Solutions, exclusively',
    body: 'The only importer and installer of Orica Digital Solutions geotechnical and subsurface instruments in East Africa.',
  },
  {
    num: 'People',
    title: '50+ engineers',
    body: 'An in-house engineering team that designs, installs, and commissions what we sell.',
  },
  {
    num: 'Support',
    title: 'After-sales depth',
    body: 'A six-pillar after-sales program, from training to long-term monitoring and emergency response.',
  },
  {
    num: 'Track record',
    title: '$100M+ portfolio',
    body: 'More than fifty projects across Ethiopia and consultancy work across Africa since 2016.',
  },
]

function AboutIndexPage() {
  const rest = ABOUT_SECTIONS.filter(
    (s) => s.to !== '/about' && s.to !== '/about/leadership' && s.to !== '/about/departments',
  )
  return (
    <>
      <PageHero
        media="about"
        current="About Us"
        title="Built by engineers, for the long term"
        lead="HIRUT Engineering Construction and General Trading was founded in 2016 by engineers with long field experience. Ten years on, we are a multidisciplinary firm working across water and ground: we supply, we design, we build, and we stay."
      />

      <AboutNav current="/about" />

      {/* Our story - approved v2 copy, kept verbatim */}
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
                exclusive East Africa importer and installer of the globally sought-after Orica
                Digital Solutions geotechnical and subsurface instruments.
              </p>
            </div>
            <div className="reveal" style={{ '--reveal-delay': '.1s' } as React.CSSProperties}>
              <SampleImg {...stock(teamImage)} ratio="4 / 3" sizes="(max-width: 980px) 92vw, 44vw" />
              <p className="sample-note">
                Sample photograph: stock imagery standing in until the company's own site
                photography is supplied.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5.3 Our Purpose, in full */}
      <section className="section band-mist-soft" id="purpose">
        <div className="container">
          <div className="section-head reveal">
            <Eyebrow>Why we exist</Eyebrow>
            <h2>{purpose.title}</h2>
          </div>
          <div className="prose-measure reveal">
            {purpose.paragraphs.map((p) => (
              <p className="statement-p" key={p.slice(0, 40)}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      <StatsBand />

      {/* 5.5 Our Corporate Promise, as a pull-quote band */}
      <section className="section band-dark" id="corporate-promise">
        <div className="container">
          <div className="reveal">
            <Eyebrow>Our Corporate Promise</Eyebrow>
            <blockquote className="pull-quote">{corporatePromise.slogan}</blockquote>
            <div className="prose-measure">
              {corporatePromise.paragraphs.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>
            <p className="display-lines">
              {corporatePromise.lines.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </p>
          </div>
        </div>
      </section>

      {/* Why Hirut - approved v2 copy */}
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

      {/* 5.10 Leadership introduction with a preview row */}
      <section className="section band-mist-soft" id="leadership-preview">
        <div className="container">
          <div className="section-head reveal">
            <Eyebrow>Our people</Eyebrow>
            <h2>Leadership &amp; management team</h2>
          </div>
          <div className="grid grid-2" style={{ alignItems: 'start' }}>
            <div className="prose-measure reveal">
              {leadershipIntro.slice(0, 2).map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
              <p>
                <Link className="btn btn-primary" to="/about/leadership" resetScroll>
                  Meet the leadership team <span className="arrow" aria-hidden="true">→</span>
                </Link>
              </p>
            </div>
            <ul
              className="leader-preview reveal"
              style={{ '--reveal-delay': '.1s' } as React.CSSProperties}
            >
              {leadership.map((p) => (
                <li key={p.slug}>
                  <Link
                    to="/about/leadership"
                    hash={p.slug}
                    resetScroll
                    hashScrollIntoView={false}
                    aria-label={`${p.name}, ${p.role}`}
                  >
                    {p.photo ? (
                      <picture>
                        <source type="image/webp" srcSet={`${p.photo}.webp`} />
                        <img
                          src={`${p.photo}.jpg`}
                          alt=""
                          width={160}
                          height={160}
                          loading="lazy"
                          decoding="async"
                        />
                      </picture>
                    ) : (
                      <span className="leader-monogram" aria-hidden="true">
                        {leaderInitials(p.name)}
                      </span>
                    )}
                    <span className="leader-preview-name">{p.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Departments preview */}
      <section className="section" id="departments-preview">
        <div className="container">
          <div className="section-head reveal">
            <Eyebrow>How we are organised</Eyebrow>
            <h2>Six departments, one platform</h2>
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
        </div>
      </section>

      {/* 5.7 What Every Client Can Expect, in full */}
      <section className="section band-mist-soft" id="client-expectations">
        <div className="container">
          <div className="section-head reveal">
            <Eyebrow>Our promise</Eyebrow>
            <h2>What Every Client Can Expect</h2>
          </div>
          <p className="statement-lead prose-measure reveal">
            {clientExpectations.parts.map((part) =>
              part.strong ? <strong key={part.text}>{part.text}</strong> : <span key={part.text}>{part.text}</span>,
            )}
          </p>
        </div>
      </section>

      {/* The remaining sub-sections */}
      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <Eyebrow>Read on</Eyebrow>
            <h2>More about HIRUT</h2>
          </div>
          <div className="grid grid-3">
            {rest.map((s, i) => (
              <Link
                className="card reveal"
                style={i % 3 !== 0 ? ({ '--reveal-delay': `${(i % 3) * 0.06}s` } as React.CSSProperties) : undefined}
                to={s.to}
                resetScroll
                key={s.to}
              >
                <h3>{s.title}</h3>
                <p>{s.blurb}</p>
                <span className="card-link">Open section →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section band-mist-soft">
        <div className="container">
          <div className="grid grid-2">
            <div className="reveal">
              <Eyebrow>On site</Eyebrow>
              <h2>Our engineers in the field</h2>
              <PhMedia ratio="4 / 3" detail="Team / site photograph from the company's own media library: pending" />
            </div>
            <div className="reveal" style={{ '--reveal-delay': '.1s' } as React.CSSProperties}>
              <Eyebrow>Company profile</Eyebrow>
              <h2>For tender submissions</h2>
              <PhChip>
                company profile PDF pending: the download button appears here once the file is
                supplied
              </PhChip>
              <AboutNext current="/about" />
            </div>
          </div>
        </div>
      </section>

      <CtaBand heading="Work with a firm that will still answer the phone next year" />
    </>
  )
}
