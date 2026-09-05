/* ============================================================
   Departments (revision 3, sections 5.16 to 5.18).

   Client-supplied and verbatim: the intro, each department's prose,
   and every key-capability line are reproduced exactly as written.
   ============================================================ */

/* 5.16 */
export const departmentsIntro = {
  headline: 'Multidisciplinary Expertise. Integrated Solutions.',
  paragraphs: [
    'Our organizational structure brings together specialized departments that work collaboratively to provide comprehensive solutions across the engineering, construction, infrastructure, technology, and business sectors.',
    'Each department is led by experienced professionals with specialized technical and managerial capabilities. By integrating these disciplines, we are able to address complex projects from multiple perspectives while maintaining technical quality, efficiency, safety, and professional standards.',
  ],
}

export interface Department {
  slug: string
  name: string
  /** short label for the tab rail */
  tab: string
  paragraphs: string[]
  capabilities: string[]
  /** shown at the head of the department, where the client asked for it */
  motto?: string
}

/* 5.17 */
export const departments: Department[] = [
  {
    slug: 'hydraulic-water-infrastructure',
    name: 'Hydraulic & Water Infrastructure Department',
    tab: 'Hydraulic & Water Infrastructure',
    paragraphs: [
      'Focused on the planning, design, construction, supervision, and management of hydraulic and water infrastructure projects. The department brings together expertise in irrigation engineering, hydraulics, water resources, hydrogeology, and related infrastructure development.',
    ],
    capabilities: [
      'Hydraulic infrastructure',
      'Irrigation systems',
      'Water supply infrastructure',
      'Drainage systems',
      'Water-resource development',
      'Hydraulic structures',
      'Hydrogeological and water-related investigations',
      'Project planning and management',
    ],
  },
  {
    slug: 'construction',
    name: 'Construction Department',
    tab: 'Construction',
    motto: 'Engineering Integrity, Delivering Excellence!',
    paragraphs: [
      'The Construction Department provides professional construction management and engineering services covering the implementation and supervision of infrastructure and construction projects.',
      'The department combines civil engineering and construction-management expertise to support projects through planning, mobilization, construction, supervision, quality control, and completion.',
    ],
    capabilities: [
      'Civil construction',
      'Construction management',
      'Build project management team for companies',
      'Project supervision, monitoring and evaluation',
      'Infrastructure development',
      'Site management',
      'Quality control',
      'Construction planning and coordination',
      'Consulting on construction and project management',
    ],
  },
  {
    slug: 'geological-geotechnical',
    name: 'Geological & Geotechnical Department',
    tab: 'Geological & Geotechnical',
    paragraphs: [
      'Our Geological and Geotechnical Department provides specialized services for understanding ground conditions, geological formations, groundwater systems, and geotechnical characteristics essential for safe and reliable infrastructure development.',
      'The department supports engineering projects through geological and hydrogeological investigations, subsurface assessment, and geotechnical evaluation.',
    ],
    capabilities: [
      'Geological survey and investigations',
      'Hydrogeological studies',
      'Geotechnical investigations',
      'Mining area survey and investigations',
      'Groundwater assessment',
      'Site characterization',
      'Engineering geology',
      'Subsurface investigation',
      'Geological and geotechnical reporting',
      'Geotechnical consulting for infrastructure projects',
    ],
  },
  {
    slug: 'it-support-geo-solutions',
    name: 'IT Support & Geo-Solutions Department',
    tab: 'IT Support & Geo-Solutions',
    paragraphs: [
      'This department integrates information technology, geospatial technologies, engineering data, and digital solutions to support modern project delivery and organizational efficiency.',
      'It contributes to the digital transformation of engineering operations through technology-driven approaches to data management, visualization, mapping, monitoring, and technical communication.',
    ],
    capabilities: [
      'IT support and systems management',
      'GIS and geospatial solutions',
      'Engineering data management',
      'Digital mapping',
      'Spatial data analysis',
      'Technical data visualization',
      'Digital project-support solutions',
    ],
  },
  {
    slug: 'finance-tax-consultancy',
    name: 'Finance & Tax Consultancy Department',
    tab: 'Finance & Tax Consultancy',
    paragraphs: [
      'The Finance and Tax Consultancy Department supports the company’s financial administration, accounting, taxation, and commercial activities.',
      'Its expertise helps maintain effective financial management, regulatory compliance, financial planning, and responsible business operations.',
    ],
    capabilities: [
      'Accounting and financial management',
      'Tax consultancy',
      'Financial planning',
      'Tax compliance support',
      'Property valuation',
      'Financial analysis',
      'Commercial and administrative support',
    ],
  },
  {
    slug: 'marketing-digital-marketing',
    name: 'Marketing & Digital Marketing Department',
    tab: 'Marketing & Digital Marketing',
    paragraphs: [
      'Our Marketing and Digital Marketing Department is responsible for strengthening the company’s corporate identity, market presence, client engagement, and digital communication.',
      'The department develops market-oriented strategies designed to increase visibility, establish strong client relationships, communicate the company’s capabilities, and support sustainable business development.',
    ],
    capabilities: [
      'Corporate marketing',
      'Digital marketing',
      'Brand development',
      'Business development',
      'Client communication',
      'Digital content',
      'Online presence and corporate communication',
    ],
  },
]

/* 5.18 */
export const integratedAcrossDisciplines = {
  title: 'Integrated Across Disciplines',
  body: 'The real strength of our organizational structure lies in the integration of our departments. Engineering, construction, geology, geotechnical, water infrastructure, technology, finance, and marketing professionals work together to provide solutions that are technically robust, commercially responsible, and aligned with client requirements.',
  slogan: 'One Team. Multiple Disciplines. Integrated Solutions. Sustainable Results.',
}
