import { Link, createFileRoute, notFound } from '@tanstack/react-router'

import { CtaBand, Eyebrow, OricaBand, PageHero } from '../components/PageBits'
import { PhChip, SampleImg } from '../components/Placeholders'
import { categories, getCategory } from '../data/products'
import { categoryImages, stock } from '../data/media'
import { SITE_NAME } from '../data/site'

export const Route = createFileRoute('/products/$category')({
  loader: ({ params }) => {
    const category = getCategory(params.category)
    if (!category) throw notFound()
    return { category }
  },
  head: ({ loaderData }) => {
    const c = loaderData?.category
    if (!c) return { meta: [{ title: SITE_NAME }] }
    return {
      meta: [
        { title: `${c.name}  Hirut Engineering` },
        { name: 'description', content: c.metaDescription },
        { property: 'og:title', content: `${c.name}  Hirut Engineering` },
        { property: 'og:description', content: c.ogDescription },
      ],
    }
  },
  component: CategoryPage,
  notFoundComponent: CategoryNotFound,
})

function CategoryNotFound() {
  return (
    <section className="section" style={{ paddingTop: 'calc(var(--header-h) + 4rem)' }}>
      <div className="container">
        <h1>Category not found</h1>
        <p>
          That product category doesn't exist. <Link to="/products">Browse all seven categories →</Link>
        </p>
      </div>
    </section>
  )
}

function CategoryPage() {
  const { category: c } = Route.useLoaderData()

  const itemListJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: c.name,
    itemListElement: c.specGroups
      .flatMap((g) => g.items)
      .map((name, i) => ({ '@type': 'Product', position: i + 1, name })),
  })

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: itemListJsonLd }} />

      <PageHero
        media="products"
        current={c.name}
        trail={[
          { label: 'Home', to: '/' },
          { label: 'Products', to: '/products' },
        ]}
        title={c.name}
        lead={c.heroLead}
      />

      {c.featureOrica ? <OricaBand compact /> : null}

      <section className="section">
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: 'start' }}>
            <div className="reveal">
              <Eyebrow>Catalog</Eyebrow>
              {c.specGroups.map((group, gi) => (
                <div key={group.title ?? gi}>
                  <h2 style={gi > 0 ? { marginTop: '2rem' } : undefined}>
                    {group.title ?? 'What we supply'}
                  </h2>
                  <ul className="spec-list">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
              {c.specNote ? <p className="spec-note">{c.specNote}</p> : null}
              <h3 style={{ marginTop: '2rem' }}>Spec sheets</h3>
              <p>
                <a
                  className="btn btn-ghost"
                  href="#"
                  aria-disabled="true"
                  onClick={(e) => e.preventDefault()}
                >
                  Download spec sheet (PDF)
                </a>
              </p>
              <PhChip>datasheets pending: download slots built, files to be attached</PhChip>
            </div>
            <div className="reveal" style={{ '--reveal-delay': '.1s' } as React.CSSProperties}>
              <SampleImg
                {...stock(categoryImages[c.slug])}
                ratio="16 / 10"
                sizes="(max-width: 980px) 92vw, 44vw"
              />
              <p className="sample-note">
                Sample photograph: stock imagery standing in until the company's own photography
                of this category is supplied.
              </p>
              <div className="card" style={{ marginTop: '1.2rem' }}>
                <p className="card-num">Related services</p>
                <ul className="check-list" style={{ marginBottom: 0 }}>
                  {c.related.map((r) => (
                    <li key={r.label}>
                      <Link to="/services" hash={r.hash}>
                        {r.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        heading={c.cta.heading}
        body={c.cta.body}
        label={c.cta.label}
        search={{ type: c.slug }}
      />
    </>
  )
}

/* Static paths for prerendering: every category page is emitted at build
   time (linked from the hub and footer, so crawlLinks also finds them). */
export const categorySlugs = categories.map((c) => c.slug)
