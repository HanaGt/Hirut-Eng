import { createFileRoute } from '@tanstack/react-router'

import { AboutNext } from '../components/AboutNav'
import { LeadershipGrid } from '../components/Leadership'
import { CtaBand, Eyebrow, PageHero } from '../components/PageBits'
import {
  collectiveStrength,
  leadershipIntro,
  leadershipPageIntro,
  teamForComplexChallenges,
} from '../data/about'
import { SITE_NAME } from '../data/site'

export const Route = createFileRoute('/about/leadership')({
  head: () => ({
    meta: [
      { title: `Our Leadership | ${SITE_NAME}` },
      {
        name: 'description',
        content:
          'A multidisciplinary leadership team spanning hydraulic and water engineering, civil and construction engineering, geology, hydrogeology, geotechnical engineering, project management, finance, taxation, information technology, geospatial solutions and digital marketing.',
      },
    ],
  }),
  component: LeadershipPage,
})

function LeadershipPage() {
  return (
    <>
      <PageHero
        current="Our Leadership"
        trail={[
          { label: 'Home', to: '/' },
          { label: 'About Us', to: '/about' },
        ]}
        title={leadershipPageIntro.headline}
        lead={leadershipPageIntro.paragraphs[0]}
      />

      <section className="section">
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: 'start' }}>
            <div className="prose-measure reveal">
              {leadershipPageIntro.paragraphs.slice(1).map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>
            <div className="reveal" style={{ '--reveal-delay': '.1s' } as React.CSSProperties}>
              <Eyebrow>{leadershipPageIntro.philosophyLabel}</Eyebrow>
              <p className="attribute-line">{leadershipPageIntro.philosophy}</p>
              <div className="prose-measure" style={{ marginTop: '1.4rem' }}>
                {leadershipIntro.slice(2).map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured executive + staff directory; the full bio opens in a dialog. */}
      <section className="section band-mist-soft" id="team">
        <div className="container">
          <div className="section-head reveal">
            <Eyebrow>Executive officer and management staff</Eyebrow>
            <h2>Seven professionals, one platform</h2>
            <p className="lead">
              Select any profile to read it in full, and step through the team without leaving the
              page.
            </p>
          </div>
          <LeadershipGrid />
        </div>
      </section>

      {/* 5.12 */}
      <section className="section band-dark" id="collective-strength">
        <div className="container">
          <div className="reveal">
            <Eyebrow>{collectiveStrength.title}</Eyebrow>
            <blockquote className="pull-quote">{collectiveStrength.slogan}</blockquote>
            <div className="prose-measure">
              {collectiveStrength.paragraphs.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5.13 */}
      <section className="section" id="complex-challenges">
        <div className="container">
          <div className="section-head reveal">
            <Eyebrow>Multidisciplinary by design</Eyebrow>
            <h2>{teamForComplexChallenges.title}</h2>
          </div>
          <div className="prose-measure reveal">
            {teamForComplexChallenges.paragraphs.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
          <p className="display-line reveal">{teamForComplexChallenges.closing}</p>
          <AboutNext current="/about/leadership" />
        </div>
      </section>

      <CtaBand heading="Talk to the engineers who will run your project" />
    </>
  )
}
