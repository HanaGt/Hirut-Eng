import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { CtaBand, PageHero } from '../components/PageBits'
import { PhChip, SampleImg } from '../components/Placeholders'
import { sampleProjects } from '../data/site'
import { projectImages, stock } from '../data/media'

export const Route = createFileRoute('/projects')({
  head: () => ({
    meta: [
      { title: 'Projects  Hirut Engineering and General Trading PLC' },
      {
        name: 'description',
        content:
          'A portfolio of water supply, irrigation, geotechnical, hydraulic structure, waterproofing, and well drilling projects delivered by Hirut Engineering across Ethiopia and Africa.',
      },
      { property: 'og:title', content: 'Projects  Hirut Engineering' },
      {
        property: 'og:description',
        content: '50+ projects across Ethiopia. 5+ consultancy projects across Africa. $100M+ USD total portfolio.',
      },
    ],
  }),
  component: ProjectsPage,
})

const SECTORS = [
  { value: 'water-supply', label: 'Water Supply' },
  { value: 'irrigation', label: 'Irrigation' },
  { value: 'geotechnical', label: 'Geotechnical' },
  { value: 'hydraulic', label: 'Hydraulic Structures' },
  { value: 'waterproofing', label: 'Waterproofing' },
  { value: 'well-drilling', label: 'Well Drilling' },
]
const REGIONS = [
  { value: 'sample-a', label: 'Sample Region A' },
  { value: 'sample-b', label: 'Sample Region B' },
  { value: 'sample-c', label: 'Sample Region C' },
]
const YEARS = [
  { value: 'sample-recent', label: 'Sample: recent' },
  { value: 'sample-earlier', label: 'Sample: earlier' },
]

function ProjectsPage() {
  const [sector, setSector] = useState('all')
  const [region, setRegion] = useState('all')
  const [year, setYear] = useState('all')

  const visible = useMemo(
    () =>
      sampleProjects.filter(
        (p) =>
          (sector === 'all' || p.sector === sector) &&
          (region === 'all' || p.region === region) &&
          (year === 'all' || p.year === year),
      ),
    [sector, region, year],
  )

  return (
    <>
      <PageHero
        media="projects"
        current="Projects"
        title="Fifty projects and counting"
        lead="Water supply, irrigation, geotechnical instrumentation, hydraulic structures, waterproofing, and well drilling  delivered across Ethiopia, with consultancy work across Africa."
      >
        <PhChip>
          all project content pending  the six cards below are clearly-labeled samples that
          demonstrate the portfolio layout and filters
        </PhChip>
      </PageHero>

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
                  <span className="sample-flag">Sample</span>
                  <SampleImg {...stock(projectImages[sampleProjects.indexOf(p) % projectImages.length])} />
                  <div className="card-body">
                    <div className="project-meta">
                      <span>{p.sectorLabel}</span>
                      <span>·</span>
                      <span>{p.regionLabel}</span>
                    </div>
                    <h3>{p.title}</h3>
                    <p>Sample card for layout only  client, scope, and outcome to be supplied.</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="filter-empty">No projects match the selected filters  try clearing one.</div>
          )}
        </div>
      </section>

      <CtaBand heading="Your project could anchor this page" />
    </>
  )
}
