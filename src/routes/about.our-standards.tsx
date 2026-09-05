import { createFileRoute } from '@tanstack/react-router'

import { AboutNav, AboutNext } from '../components/AboutNav'
import { CtaBand, Eyebrow, PageHero } from '../components/PageBits'
import { ourCommitment, ourStandards } from '../data/about'
import { SITE_NAME } from '../data/site'

export const Route = createFileRoute('/about/our-standards')({
  head: () => ({
    meta: [
      { title: `The Standards We Hold Ourselves To | ${SITE_NAME}` },
      {
        name: 'description',
        content:
          'Technical excellence, quality, integrity, safety, accountability and sustainability: how HIRUT Engineering Construction and General Trading measures its own work, and the commitment behind it.',
      },
    ],
  }),
  component: OurStandardsPage,
})

function OurStandardsPage() {
  return (
    <>
      <PageHero
        current="The Standards We Hold Ourselves To"
        trail={[
          { label: 'Home', to: '/' },
          { label: 'About Us', to: '/about' },
        ]}
        title="The Standards We Hold Ourselves To"
        lead="Excellence is measured not only by what we deliver, but by how we deliver it."
      />

      <AboutNav current="/about/our-standards" />

      {/* 5.8 */}
      <section className="section">
        <div className="container">
          <p className="statement-lead prose-measure reveal">
            {ourStandards.parts.map((part) =>
              part.strong ? (
                <strong key={part.text}>{part.text}</strong>
              ) : (
                <span key={part.text}>{part.text}</span>
              ),
            )}
          </p>
        </div>
      </section>

      {/* 5.14 */}
      <section className="section band-dark" id="commitment">
        <div className="container">
          <div className="reveal">
            <Eyebrow>{ourCommitment.title}</Eyebrow>
            <div className="prose-measure">
              <p className="statement-p">{ourCommitment.body}</p>
            </div>
            <p className="attribute-line">{ourCommitment.attributes}</p>
            <AboutNext current="/about/our-standards" />
          </div>
        </div>
      </section>

      <CtaBand heading="Ask us for the honest technical answer" />
    </>
  )
}
