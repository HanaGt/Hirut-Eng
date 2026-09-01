import { Link, createFileRoute } from '@tanstack/react-router'

import { CtaBand, Eyebrow, OricaBand, PageHero } from '../components/PageBits'
import { PhChip } from '../components/Placeholders'
import { domesticPartners, internationalPartners } from '../data/site'

export const Route = createFileRoute('/partners')({
  head: () => ({
    meta: [
      { title: 'Partners & Brands  Hirut Engineering and General Trading PLC' },
      {
        name: 'description',
        content:
          'Domestic partners and clients, and international partners and brands Hirut Engineering works with  including Orica, RST Instruments, SISGEO, ENCARDIO RITE, Hunter, Perkins, JCB, and PENTAX.',
      },
      { property: 'og:title', content: 'Partners & Brands  Hirut Engineering' },
      {
        property: 'og:description',
        content: 'The companies we build for, and the brands we bring to East Africa.',
      },
    ],
  }),
  component: PartnersPage,
})

function PartnersPage() {
  return (
    <>
      <PageHero
        media="partners"
        current="Partners & Brands"
        title="The company we keep"
        lead="The organizations we build for at home, and the international brands we bring to East Africa."
      >
        <PhChip>
          names are rendered as styled text badges by design  official logos will be swapped in
          only once each company's permission is confirmed; the international group is labeled
          neutrally until the client confirms which are formal partners versus brands supplied
        </PhChip>
      </PageHero>

      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <Eyebrow>At home</Eyebrow>
            <h2>Domestic partners &amp; clients</h2>
          </div>
          <div className="badge-grid reveal" aria-label="Domestic partners and clients">
            {domesticPartners.map((name) => (
              <span className="p-badge" key={name}>{name}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="section band-mist-soft">
        <div className="container">
          <div className="section-head reveal">
            <Eyebrow>From abroad</Eyebrow>
            <h2>Partners &amp; brands we work with</h2>
          </div>
          <div className="badge-grid reveal" aria-label="International partners and brands">
            {internationalPartners.map((name) => (
              <span className="p-badge" key={name}>{name}</span>
            ))}
          </div>
          <PhChip style={{ marginTop: '1.6rem' }}>
            confirmed partner list, logo files, and permitted wording pending from client
          </PhChip>
          <p style={{ marginTop: '1rem' }}>
            <Link to="/products/$category" params={{ category: 'geotechnical-equipment' }}>
              Inquire about Orica supply →
            </Link>
          </p>
        </div>
      </section>

      <OricaBand compact />

      <CtaBand heading="Become the next name on this page" />
    </>
  )
}
