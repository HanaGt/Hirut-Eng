import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { CtaBand, PageHero } from '../components/PageBits'
import { SampleImg } from '../components/Placeholders'
import { PROJECT_REGIONS, PROJECT_SECTORS, PROJECT_YEARS } from '../data/project-meta'
import { projectImages, stock } from '../data/media'
import { listPublishedProjects } from '../server/project.functions'

export const Route = createFileRoute('/projects')({
  loader: () => listPublishedProjects(),
  head: () => ({
    meta: [
      { title: 'Projects | HIRUT Engineering Construction and General Trading' },
      {
        name: 'description',
        content:
          'A portfolio of water supply, irrigation, geotechnical, hydraulic structure, waterproofing, and well drilling projects delivered by Hirut Engineering across Ethiopia and Africa.',
      },
      { property: 'og:title', content: 'Projects | Hirut Engineering' },
      {
        property: 'og:description',
        content: '50+ projects across Ethiopia. 5+ consultancy projects across Africa. $100M+ USD total portfolio.',
      },
    ],
  }),
  component: ProjectsPage,
})

const SECTORS = PROJECT_SECTORS
const REGIONS = PROJECT_REGIONS
const YEARS = PROJECT_YEARS

function ProjectsPage() {
  const projects = Route.useLoaderData()
  const [sector, setSector] = useState('all')
  const [region, setRegion] = useState('all')
  const [year, setYear] = useState('all')

  const visible = useMemo(
    () =>
      projects.filter(
        (p) =>
          (sector === 'all' || p.sector === sector) &&
          (region === 'all' || p.region === region) &&
          (year === 'all' || p.year === year),
      ),
    [projects, sector, region, year],
  )

  return (
    <>
      <PageHero
        media="projects"
        current="Projects"
        title="Fifty projects and counting"
        lead="Water supply, irrigation, geotechnical instrumentation, hydraulic structures, waterproofing, and well drilling, delivered across Ethiopia, with consultancy work across Africa."
      />

      <section className="section">
        <div className="container">
          <form className="filter-row" aria-label="Filter projects" onSubmit={(e) => e.preventDefault()}>
            <label className="sr-only" htmlFor="f-sector">Sector</label>
            <select id="f-sector" value={sector} onChange={(e) => setSector(e.target.value)}>
              <option value="all">All sectors</option>
              {SECTORS.map((s) => (
                <option value={s.value} key={s.value}>{s.label}</option>
              ))}
            </select>
            <label className="sr-only" htmlFor="f-region">Region</label>
            <select id="f-region" value={region} onChange={(e) => setRegion(e.target.value)}>
              <option value="all">All regions</option>
              {REGIONS.map((r) => (
                <option value={r.value} key={r.value}>{r.label}</option>
              ))}
            </select>
            <label className="sr-only" htmlFor="f-year">Year</label>
            <select id="f-year" value={year} onChange={(e) => setYear(e.target.value)}>
              <option value="all">All years</option>
              {YEARS.map((y) => (
                <option value={y.value} key={y.value}>{y.label}</option>
              ))}
            </select>
            <button
              type="button"
              className="chip"
              onClick={() => {
                setSector('all')
                setRegion('all')
                setYear('all')
              }}
            >
              Clear filters
            </button>
          </form>

          {visible.length > 0 ? (
            <div className="grid grid-3">
              {visible.map((p, i) => (
                <div
                  className="card card--media project-card reveal"
                  style={i % 3 !== 0 ? ({ '--reveal-delay': `${(i % 3) * 0.06}s` } as React.CSSProperties) : undefined}
                  key={p.title}
                >
                  {p.image ? (
                    <img
                      className="sample-img"
                      src={p.image}
                      alt={p.title}
                      width={1600}
                      height={1000}
                      loading="lazy"
                      decoding="async"
                      style={{ aspectRatio: '16 / 9' }}
                    />
                  ) : (
                    <SampleImg {...stock(projectImages[i % projectImages.length])} />
                  )}
                  <div className="card-body">
                    <div className="project-meta">
                      <span>{p.sectorLabel}</span>
                      <span>·</span>
                      <span>{p.regionLabel}</span>
                    </div>
                    <h3>{p.title}</h3>
                    <p>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="filter-empty">No projects match the selected filters. Try clearing one.</div>
          )}
        </div>
      </section>

      <CtaBand heading="Your project could anchor this page" />
    </>
  )
}

