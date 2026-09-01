import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'

import { Eyebrow, PageHero } from '../components/PageBits'
import { SampleImg } from '../components/Placeholders'
import { categories } from '../data/products'
import { categoryImages, stock } from '../data/media'

export const Route = createFileRoute('/products/')({
  head: () => ({
    meta: [
      { title: 'Products: Seven Categories | Hirut Engineering and General Trading PLC' },
      {
        name: 'description',
        content:
          'Seven imported product categories: gabions and wire products, geosynthetics, geotechnical equipment, irrigation and farm equipment, power supply, pumps and accessories, and waterproofing materials.',
      },
      { property: 'og:title', content: 'Products | Hirut Engineering' },
      {
        property: 'og:description',
        content: 'Imported, specified honestly, installed by our own engineers, and supported after the sale.',
      },
    ],
  }),
  component: ProductsHub,
})

const FILTERS = [
  { value: 'all', label: 'All categories' },
  { value: 'water', label: 'Water' },
  { value: 'ground', label: 'Ground' },
  { value: 'power', label: 'Power' },
] as const

function ProductsHub() {
  const [filter, setFilter] = useState<'all' | 'water' | 'ground' | 'power'>('all')
  const visible = categories.filter((c) => filter === 'all' || c.tags.includes(filter))

  return (
    <>
      <PageHero
        media="products"
        current="Products"
        title="Seven categories. One standard."
        lead="Everything we import is specified honestly, installed by our own engineers when you want it installed, and covered by a six-pillar after-sales program."
      />

      <section className="section">
        <div className="container">
          <div className="filter-row" role="group" aria-label="Filter product categories">
            {FILTERS.map((f) => (
              <button
                type="button"
                className="chip"
                aria-pressed={filter === f.value}
                onClick={() => setFilter(f.value)}
                key={f.value}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="grid grid-3">
            {visible.map((c, i) => (
              <Link
                className="card card--media reveal"
                style={i % 3 !== 0 ? ({ '--reveal-delay': `${(i % 3) * 0.05}s` } as React.CSSProperties) : undefined}
                to="/products/$category"
                params={{ category: c.slug }}
                key={c.slug}
              >
                <SampleImg {...stock(categoryImages[c.slug])} />
                <div className="card-body">
                  <div className="card-tags">
                    {c.tagLabels.map((t) => (
                      <span className="tag" key={t}>{t}</span>
                    ))}
                  </div>
                  <h3>{c.name}</h3>
                  <p>{c.cardBlurb}</p>
                  <span className="card-link">View category →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section band-ink">
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: 'center' }}>
            <div className="reveal">
              <Eyebrow>Beyond the box</Eyebrow>
              <h2>Every product comes with engineers attached</h2>
              <p>
                Specification advice before you buy. Installation and commissioning when it arrives.
                Training, maintenance, warranty support, and monitoring after it's running. That's
                the difference between a supplier and a partner.
              </p>
            </div>
            <div
              className="reveal"
              style={{ '--reveal-delay': '.1s', textAlign: 'center' } as React.CSSProperties}
            >
              <Link className="btn btn-primary" to="/contact">
                Request a Quote <span className="arrow" aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
