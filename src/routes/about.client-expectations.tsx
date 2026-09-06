import { createFileRoute } from '@tanstack/react-router'

import { AboutNext } from '../components/AboutNav'
import { CtaBand, Eyebrow, PageHero } from '../components/PageBits'
import { clientExpectations, commitmentToEveryClient, customerPromise } from '../data/about'
import { SITE_NAME } from '../data/site'

export const Route = createFileRoute('/about/client-expectations')({
  head: () => ({
    meta: [
      { title: `What Every Client Can Expect | ${SITE_NAME}` },
      {
        name: 'description',
        content:
          'Professional expertise, reliable solutions, clear communication, quality delivery and strong project commitment, and a customer promise upheld on every project: safety, quality supply, engineering integrity, and staying after commissioning.',
      },
    ],
  }),
  component: ClientExpectationsPage,
})

function ClientExpectationsPage() {
  return (
    <>
      <PageHero
        media="about"
        current="What Every Client Can Expect"
        trail={[
          { label: 'Home', to: '/' },
          { label: 'About Us', to: '/about' },
        ]}
        title="What Every Client Can Expect"
        lead="The same commitment on every project, from the first consultation to long after commissioning."
      />

      {/* 5.7 */}
      <section className="section">
        <div className="container">
          <p className="statement-lead prose-measure reveal">
            {clientExpectations.parts.map((part) =>
              part.strong ? (
                <strong key={part.text}>{part.text}</strong>
              ) : (
                <span key={part.text}>{part.text}</span>
              ),
            )}
          </p>
        </div>
      </section>

      {/* 5.6 - intro as prose, then the four promises as a four-card band */}
      <section className="section band-mist-soft" id="customer-promise">
        <div className="container">
          <div className="section-head reveal">
            <Eyebrow>Our Customer Promise</Eyebrow>
            <h2>Four commitments, upheld on every project</h2>
          </div>
          <div className="prose-measure reveal">
            {customerPromise.intro.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
          <div className="grid grid-4" style={{ marginTop: 'clamp(1.6rem, 3vw, 2.4rem)' }}>
            {customerPromise.pillars.map((p, i) => (
              <div
                className="card reveal"
                style={i > 0 ? ({ '--reveal-delay': `${i * 0.06}s` } as React.CSSProperties) : undefined}
                key={p.name}
              >
                <p className="card-num">{String(i + 1).padStart(2, '0')}</p>
                <h3>{p.name}</h3>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5.9 */}
      <section className="section band-dark" id="our-commitment">
        <div className="container">
          <div className="reveal">
            <Eyebrow>Our Commitment to Every Client</Eyebrow>
            <blockquote className="pull-quote">{commitmentToEveryClient.slogan}</blockquote>
            <div className="prose-measure">
              {commitmentToEveryClient.paragraphs.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>
            <p className="signature-line">{commitmentToEveryClient.signature}</p>
            <p className="attribute-line">{commitmentToEveryClient.attributes}</p>
            <AboutNext current="/about/client-expectations" />
          </div>
        </div>
      </section>

      <CtaBand heading="Start with a conversation, not a quotation" />
    </>
  )
}
