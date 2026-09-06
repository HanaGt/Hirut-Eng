import { createFileRoute } from '@tanstack/react-router'

import { ContactForm } from '../components/ContactForm'
import { PageHero } from '../components/PageBits'
import { SocialIcon } from '../components/SocialIcon'
import { EMAIL, OFFICE, PHONE_1, PHONE_2, SOCIAL } from '../data/site'

export const Route = createFileRoute('/contact')({
  validateSearch: (search: Record<string, unknown>): { type?: string } => ({
    type: typeof search.type === 'string' ? search.type : undefined,
  }),
  head: () => ({
    meta: [
      { title: 'Contact & Request a Quote | HIRUT Engineering Construction and General Trading' },
      {
        name: 'description',
        content:
          'Request a quote from Hirut Engineering: products, construction, consultancy, and after-sales support. Call +251 911 518 448 or +251 976 575 859.',
      },
      { property: 'og:title', content: 'Contact Hirut Engineering' },
      {
        property: 'og:description',
        content: 'Quotes, specifications, site visits, and honest engineering advice.',
      },
    ],
  }),
  component: ContactPage,
})

function ContactPage() {
  const { type } = Route.useSearch()
  return (
    <>
      <PageHero
        media="contact"
        current="Contact"
        title="Request a quote"
        lead="Tell us what you're planning: a product inquiry, a construction project, or a design question. An engineer, not a call center, will get back to you."
      />

      <section className="section">
        <div className="container contact-grid">
          <div className="reveal">
            <ContactForm preselect={type} />
          </div>

          <aside className="reveal" style={{ '--reveal-delay': '.1s' } as React.CSSProperties}>
            <div className="contact-item">
              <h2 className="contact-h">Phone</h2>
              <p>
                <a href={`tel:${PHONE_1.tel}`}>{PHONE_1.display}</a>
                <br />
                <a href={`tel:${PHONE_2.tel}`}>{PHONE_2.display}</a>
              </p>
            </div>
            <div className="contact-item">
              <h2 className="contact-h">Email</h2>
              <p>
                <a href={EMAIL.href}>{EMAIL.display}</a>
              </p>
            </div>
            <div className="contact-item">
              <h2 className="contact-h">Office</h2>
              <p>
                {OFFICE.lines.map((line) => (
                  <span key={line}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
              <div className="contact-map">
                <iframe
                  title="Map of Hirut Engineering office at Signal Business Center, Yeka Sub-City"
                  src={OFFICE.mapsEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
              <a
                className="contact-map-link"
                href={OFFICE.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in Google Maps
              </a>
            </div>
            <div className="contact-item">
              <h2 className="contact-h">Working hours</h2>
              <p>{OFFICE.hours}</p>
            </div>
            <div className="contact-item">
              <h2 className="contact-h">Social</h2>
              <ul className="social-list">
                {SOCIAL.map((s) => (
                  <li key={s.href}>
                    <a className="social-link" href={s.href} target="_blank" rel="noopener noreferrer">
                      <SocialIcon name={s.id} />
                      {s.display}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
