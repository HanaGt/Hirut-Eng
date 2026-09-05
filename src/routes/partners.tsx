import { Link, createFileRoute } from '@tanstack/react-router'

import { CtaBand, Eyebrow, OricaBand, PageHero } from '../components/PageBits'
import { PartnerGrid } from '../components/PartnerGrid'
import { domesticPartners, internationalPartners } from '../data/site'

export const Route = createFileRoute('/partners')({
  head: () => ({
    meta: [
      { title: 'Partners & Brands | HIRUT Engineering Construction and General Trading' },
      {
        name: 'description',
        content:
          'Domestic partners and clients, and international partners and brands Hirut Engineering works with, including Orica Digital Solutions, RST Instruments, SISGEO, ENCARDIO RITE, Hunter, Perkins, JCB, and PENTAX.',
      },
      { property: 'og:title', content: 'Partners & Brands | Hirut Engineering' },
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
      />

      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <Eyebrow>At home</Eyebrow>
            <h2>Domestic partners &amp; clients</h2>
          </div>
          <PartnerGrid partners={domesticPartners} label="Domestic partners and clients" />
        </div>
      </section>

      <section className="section band-mist-soft">
        <div className="container">
          <div className="section-head reveal">
            <Eyebrow>From abroad</Eyebrow>
            <h2>Partners &amp; brands we work with</h2>
          </div>
          <PartnerGrid partners={internationalPartners} label="International partners and brands" />
          <p style={{ marginTop: '1.6rem' }}>
            <Link to="/products/$category" params={{ category: 'geotechnical-equipment' }}>
              Inquire about Orica Digital Solutions supply →
            </Link>
          </p>
        </div>
      </section>

      <OricaBand compact />

      <CtaBand heading="Become the next name on this page" />
    </>
  )
}
