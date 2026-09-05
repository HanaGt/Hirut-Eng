import { createFileRoute } from '@tanstack/react-router'

import { AboutNav, AboutNext } from '../components/AboutNav'
import { CtaBand, Eyebrow, PageHero } from '../components/PageBits'
import { corporatePromise, coreValues, mission, purpose, vision } from '../data/about'
import { SITE_NAME } from '../data/site'

export const Route = createFileRoute('/about/mission-vision-values')({
  head: () => ({
    meta: [
      { title: `Mission, Vision & Values | ${SITE_NAME}` },
      {
        name: 'description',
        content:
          'The vision, mission and purpose of HIRUT Engineering Construction and General Trading, and the ten core values behind them: excellence, integrity, professionalism, innovation, client commitment, sustainability, safety, teamwork, accountability and continuous learning.',
      },
    ],
  }),
  component: MissionVisionValuesPage,
})

const STATEMENTS = [vision, mission, purpose]

function MissionVisionValuesPage() {
  return (
    <>
      <PageHero
        current="Mission, Vision & Values"
        trail={[
          { label: 'Home', to: '/' },
          { label: 'About Us', to: '/about' },
        ]}
        title="Mission, Vision &amp; Values"
        lead="Where we are going, what we do to get there, and the standards we keep on the way."
      />

      <AboutNav current="/about/mission-vision-values" />

      {/* Three short statements, each displayed in full */}
      <section className="section">
        <div className="container">
          <div className="statement-stack">
            {STATEMENTS.map((s, i) => (
              <article
                className="statement reveal"
                style={i > 0 ? ({ '--reveal-delay': `${i * 0.08}s` } as React.CSSProperties) : undefined}
                key={s.title}
                id={s.title.toLowerCase().replace(/\s+/g, '-')}
              >
                <div className="statement-head">
                  <span className="statement-num" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h2>{s.title}</h2>
                </div>
                <div className="prose-measure">
                  {s.paragraphs.map((p) => (
                    <p className="statement-p" key={p.slice(0, 40)}>
                      {p}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5.4 ten values as a compact grid: the words are untouched, the
          layout does the condensing the client asked for */}
      <section className="section band-mist-soft" id="core-values">
        <div className="container">
          <div className="section-head reveal">
            <Eyebrow>Our Core Values</Eyebrow>
            <h2>Ten values, in our own words</h2>
          </div>
          <ul className="value-grid">
            {coreValues.map((v, i) => (
              <li
                className="value-card reveal"
                style={i % 3 !== 0 ? ({ '--reveal-delay': `${(i % 3) * 0.05}s` } as React.CSSProperties) : undefined}
                key={v.n}
              >
                <span className="value-num" aria-hidden="true">
                  {v.n}
                </span>
                <h3>{v.name}</h3>
                <p>{v.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5.5 */}
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
            <AboutNext current="/about/mission-vision-values" />
          </div>
        </div>
      </section>

      <CtaBand heading="Hold us to it on your next project" />
    </>
  )
}
