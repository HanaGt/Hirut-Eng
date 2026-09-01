import { createFileRoute } from '@tanstack/react-router'

import { ContactForm } from '../components/ContactForm'
import { PageHero } from '../components/PageBits'
import { PhChip, PhMedia } from '../components/Placeholders'
import { PHONE_1, PHONE_2 } from '../data/site'

export const Route = createFileRoute('/contact')({
  validateSearch: (search: Record<string, unknown>): { type?: string } => ({
    type: typeof search.type === 'string' ? search.type : undefined,
  }),
  head: () => ({
    meta: [
      { title: 'Contact & Request a Quote | Hirut Engineering and General Trading PLC' },
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
              <PhChip>email address pending</PhChip>
            </div>
            <div className="contact-item">
              <h2 className="contact-h">Office</h2>
              <PhChip>physical address pending</PhChip>
              <PhMedia
                ratio="16/9"
                detail="Map embed: pending address confirmation"
                className="contact-map"
              />
            </div>
            <div className="contact-item">
              <h2 className="contact-h">Working hours</h2>
              <PhChip>working hours pending</PhChip>
            </div>
            <div className="contact-item">
              <h2 className="contact-h">Company profile</h2>
              <p>
                <a
                  className="btn btn-ghost"
                  href="#"
                  aria-disabled="true"
                  onClick={(e) => e.preventDefault()}
                >
                  Download company profile (PDF)
                </a>
              </p>
              <PhChip>company profile PDF pending: button built, link to be attached</PhChip>
            </div>
            <div className="contact-item">
              <h2 className="contact-h">Social</h2>
              <PhChip>social links pending</PhChip>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
