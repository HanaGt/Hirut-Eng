import { createFileRoute } from '@tanstack/react-router'

import { AboutNext } from '../components/AboutNav'
import { Departments } from '../components/Departments'
import { CtaBand, Eyebrow, PageHero } from '../components/PageBits'
import { departmentsIntro, integratedAcrossDisciplines } from '../data/departments'
import { SITE_NAME } from '../data/site'

export const Route = createFileRoute('/about/departments')({
  head: () => ({
    meta: [
      { title: `Our Departments | ${SITE_NAME}` },
      {
        name: 'description',
        content:
          'Six specialised departments: hydraulic and water infrastructure, construction, geological and geotechnical, IT support and geo-solutions, finance and tax consultancy, and marketing and digital marketing.',
      },
    ],
  }),
  component: DepartmentsPage,
})

function DepartmentsPage() {
  return (
    <>
      <PageHero
        media="about"
        current="Our Departments"
        trail={[
          { label: 'Home', to: '/' },
          { label: 'About Us', to: '/about' },
        ]}
        title={departmentsIntro.headline}
        lead={departmentsIntro.paragraphs[0]}
      />

      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <Eyebrow>How we are organised</Eyebrow>
            <h2>Specialised departments, working together</h2>
            <p className="lead">{departmentsIntro.paragraphs[1]}</p>
          </div>
          <div className="reveal">
            <Departments />
          </div>
        </div>
      </section>

      {/* 5.18 */}
      <section className="section band-dark" id="integrated">
        <div className="container">
          <div className="reveal">
            <Eyebrow>{integratedAcrossDisciplines.title}</Eyebrow>
            <div className="prose-measure">
              <p>{integratedAcrossDisciplines.body}</p>
            </div>
            <blockquote className="pull-quote">{integratedAcrossDisciplines.slogan}</blockquote>
            <AboutNext current="/about/departments" />
          </div>
        </div>
      </section>

      <CtaBand heading="Bring us the discipline your project is short of" />
    </>
  )
}
