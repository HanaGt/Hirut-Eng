import { createFileRoute } from '@tanstack/react-router'

import { AboutNext } from '../components/AboutNav'
import { StatementSwitcher, ValueBoard } from '../components/MissionVision'
import { CtaBand, Eyebrow, PageHero } from '../components/PageBits'
import { corporatePromise } from '../data/about'
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

function MissionVisionValuesPage() {
  return (
    <>
      <PageHero
        media="about"
        current="Mission, Vision & Values"
        trail={[
          { label: 'Home', to: '/' },
          { label: 'About Us', to: '/about' },
        ]}
        title="Mission, Vision &amp; Values"
        lead="Where we are going, what we do to get there, and the standards we keep on the way."
      />

      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <Eyebrow>Direction</Eyebrow>
            <h2>Vision, mission and purpose</h2>
          </div>
          <div className="reveal">
            <StatementSwitcher />
          </div>
        </div>
      </section>

      <section className="section band-mist-soft" id="core-values">
        <div className="container">
          <div className="section-head reveal">
            <Eyebrow>Our Core Values</Eyebrow>
            <h2>Ten values, in our own words</h2>
          </div>
          <div className="reveal">
            <ValueBoard />
          </div>
        </div>
      </section>

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
