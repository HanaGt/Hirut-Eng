/* ============================================================
   Leadership profiles (revision 3, section 5.11).

   Names, post-nominals, roles and every sentence of the bios are
   client-supplied and reproduced verbatim. Order follows the source:
   CEO first, then Directors, then Finance & Marketing, then Head of
   Marketing.

   `disciplines` are the capability chips shown above each bio. They are
   not new claims: every one of them is a phrase lifted from that
   person's own supplied bio.

   `photo` points at a real supplied portrait (extension-less: .webp is
   preferred, .jpg is the fallback). Two members have no portrait yet;
   their cards carry an initials monogram rather than a stock face of
   somebody else.
   ============================================================ */

export interface Leader {
  /** stable id used for the profile's URL hash */
  slug: string
  name: string
  /** the post-nominal qualifications line, exactly as supplied */
  postNominals: string
  /** the role line, exactly as supplied */
  role: string
  /** years of experience, as stated in the bio */
  experience: string
  /** capability chips, each a phrase from this person's own bio */
  disciplines: string[]
  bio: string[]
  /** heading used by the source: singular for a single qualification */
  qualsLabel: string
  quals: string[]
  photo?: string
}

export const leadership: Leader[] = [
  {
    slug: 'hirut-girma-legesse',
    name: 'Hirut Girma Legesse',
    postNominals: 'B.Sc. (Accounting), M.Sc. (Accounting)',
    role: 'Chief Executive Officer | HIRUT Engineering Construction & General Trading',
    experience: '15+ years',
    disciplines: [
      'Accounting',
      'Financial management',
      'Corporate administration',
      'Business operations',
    ],
    bio: [
      'Hirut Girma Legesse provides executive leadership and strategic direction for HIRUT Engineering Construction and General Trading. With more than 15 years of professional experience in accounting, financial management, corporate administration, and business operations, she brings strong expertise in financial oversight, organizational management, business development, and strategic decision-making.',
      'Her professional background enables her to provide effective leadership in the company’s administrative and commercial activities while supporting sound corporate governance, financial responsibility, operational efficiency, and sustainable organizational growth.',
      'Under her leadership, the company is committed to building a professional organization capable of delivering reliable services while maintaining strong relationships with clients, partners, and stakeholders.',
    ],
    qualsLabel: 'Academic Qualifications',
    quals: ['B.Sc. in Accounting', 'M.Sc. in Accounting'],
    photo: '/img/team/hirut',
  },
  {
    slug: 'michael-tilahun-gebeyehu',
    name: 'Michael Tilahun Gebeyehu (Ph.D.)',
    postNominals:
      'B.Sc. (Irrigation Engineering), M.Sc. (Hydrogeology/Geotechnical Engineering), M.Sc. (Hydraulics Engineering), M.Sc. (PPM), Ph.D.',
    role: 'Director | Hydraulic & Water Infrastructure Construction',
    experience: '20+ years',
    disciplines: [
      'Hydraulic engineering',
      'Water infrastructure',
      'Irrigation engineering',
      'Hydrogeology',
      'Geotechnical engineering',
      'Project planning and management',
    ],
    bio: [
      'Michael Tilahun Gebeyehu is a multidisciplinary engineering professional with more than 20 years of professional experience in hydraulic engineering, water infrastructure, irrigation engineering, hydrogeology, geotechnical engineering, and project planning and management.',
      'His professional career encompasses the planning, investigation, design, construction, supervision, monitoring, and technical management of water and infrastructure projects. His multidisciplinary engineering background allows him to integrate hydraulic, geological, hydrogeological, geotechnical, and construction considerations into practical and sustainable engineering solutions.',
      'He provides technical and strategic leadership for complex water and infrastructure projects, with a strong focus on engineering quality, technical innovation, project performance, risk management, and sustainable infrastructure development.',
      'His combined academic and professional expertise strengthens the company’s ability to provide integrated solutions for challenging water, hydraulic, and infrastructure projects.',
    ],
    qualsLabel: 'Academic Qualifications',
    quals: [
      'B.Sc. in Irrigation Engineering',
      'M.Sc. in Hydrogeology/Geotechnical Engineering',
      'M.Sc. in Hydraulics Engineering',
      'M.Sc. in Project Planning & Management (PPM)',
      'Ph.D. Hydrogeology',
    ],
    photo: '/img/team/michael',
  },
  {
    slug: 'fikru-kinfu-geberekirstos',
    name: 'Fikru Kinfu Geberekirstos (Ph.D.)',
    postNominals: 'B.Sc. (Civil Engineering), M.Sc. (Construction Management), M.Sc. (PPM), Ph.D.',
    role: 'Director | Construction Department & Consulting Engineer',
    experience: '35+ years',
    disciplines: [
      'Civil engineering',
      'Construction management',
      'Project planning',
      'Construction supervision',
      'Project coordination',
    ],
    bio: [
      'Fikru Kinfu Geberekirstos is a senior civil engineering and construction professional with more than 35 years of professional experience in civil engineering, construction management, project planning, construction supervision, and project coordination.',
      'Throughout his professional career, he has contributed to the planning, implementation, supervision, and management of construction projects, with a strong emphasis on technical quality, construction standards, resource coordination, project efficiency, and timely delivery.',
      'As Director of the Construction Department and Consulting Engineer, he provides technical leadership in construction activities and supports the effective transition of projects from planning and design through construction, supervision, quality control, and completion.',
      'His combination of civil engineering expertise, construction-management knowledge, and project-management experience strengthens the company’s capacity to successfully manage complex construction and infrastructure projects.',
    ],
    qualsLabel: 'Academic Qualifications',
    quals: [
      'B.Sc. in Civil Engineering',
      'M.Sc. in Construction Management',
      'M.Sc. in Project Planning & Management (PPM)',
      'Ph.D. in Construction',
    ],
    photo: '/img/team/fikru',
  },
  {
    slug: 'mehari-tadesse-tsegaye',
    name: 'Mehari Tadesse Tsegaye (Ph.D.)',
    postNominals: 'B.Sc. (Geology), M.Sc. (Hydrogeology), Ph.D.',
    role: 'Technical Director | Geological & Geotechnical Department',
    experience: '10+ years',
    disciplines: [
      'Geology',
      'Hydrogeology',
      'Mining',
      'Geotechnical investigation',
      'Subsurface characterization',
      'Engineering assessment',
    ],
    bio: [
      'Mehari Tadesse Tsegaye is a senior geological and hydrogeological professional with more than 10 years of professional experience in geology, hydrogeology, mining, geotechnical investigation, subsurface characterization, and engineering assessment.',
      'His professional expertise supports the investigation and evaluation of geological formations, groundwater systems, subsurface conditions, and geotechnical characteristics that are critical to safe and sustainable infrastructure development.',
      'He has extensive technical involvement in geological investigations, hydrogeological assessment, groundwater studies, geotechnical evaluation, site characterization, geological interpretation, and technical reporting.',
      'As Technical Director, he provides specialized technical leadership for projects where a comprehensive understanding of ground conditions, geological risks, groundwater behavior, and subsurface characteristics is essential for effective engineering design and construction.',
    ],
    qualsLabel: 'Academic Qualifications',
    quals: ['B.Sc. in Geology', 'M.Sc. in Hydrogeology', 'Ph.D. in Hydrogeology'],
    photo: '/img/team/mehari',
  },
  {
    slug: 'hana-guta-feyissa',
    name: 'Hana Guta Feyissa',
    postNominals: 'B.Sc. (Electrical and Computer Engineering), B.A (Management)',
    role: 'Director | IT Support & Geo-Solutions Department',
    experience: '5+ years',
    disciplines: [
      'Electrical and computer engineering',
      'Information technology',
      'Digital systems',
      'Management',
      'Geospatial solutions',
    ],
    bio: [
      'Hana Guta Feyissa is a multidisciplinary professional with more than 5 years of experience in electrical and computer engineering, information technology, digital systems, management, and geospatial solutions.',
      'Her professional experience supports the integration of technology into engineering and business operations, including IT systems, digital workflows, technical data management, geospatial applications, information systems, and digital project-support solutions.',
      'As Director of IT Support and Geo-Solutions, she contributes to the company’s digital transformation by promoting the effective use of technology, engineering data, and geospatial tools to improve operational efficiency, data accessibility, technical communication, visualization, and decision-making.',
      'Her multidisciplinary background provides an important link between engineering operations and modern digital technologies.',
    ],
    qualsLabel: 'Academic Qualifications',
    quals: ['B.Sc. in Electrical & Computer Engineering', 'B.A. in Management'],
  },
  {
    slug: 'tegene-negussie-begashaw',
    name: 'Tegene Negussie Begashaw',
    postNominals:
      'B.Sc. (Accounting), M.Sc. (Accounting), M.A. (Tax and Property Valuation)',
    role: 'Finance & Marketing | Tax Consultant',
    experience: '15+ years',
    disciplines: [
      'Accounting',
      'Financial management',
      'Taxation',
      'Property valuation',
      'Business support',
    ],
    bio: [
      'Tegene Negussie Begashaw is a finance and taxation professional with more than 15 years of experience in accounting, financial management, taxation, property valuation, and business support.',
      'His professional background includes financial administration, accounting, taxation, financial analysis, tax-related advisory services, and commercial support. His combined expertise strengthens the company’s capacity to maintain sound financial practices, regulatory compliance, effective financial planning, and responsible business management.',
      'He also contributes to the company’s marketing and commercial activities, supporting business development and strengthening relationships with clients and business partners.',
      'His financial and tax expertise provides an important foundation for responsible corporate management and sustainable business growth.',
    ],
    qualsLabel: 'Academic Qualifications',
    quals: [
      'B.Sc. in Accounting',
      'M.Sc. in Accounting',
      'M.A. in Tax & Property Valuation',
    ],
  },
  {
    slug: 'nathan-guta-feyissa',
    name: 'Nathan Guta Feyissa',
    postNominals: 'B.A. (Business Administration)',
    role: 'Head of Marketing & Digital Marketing',
    experience: '2+ years',
    disciplines: [
      'Marketing',
      'Digital marketing',
      'Business administration',
      'Brand development',
      'Client engagement',
    ],
    bio: [
      'Nathan Guta Feyissa is a business and marketing professional with more than 2 years of experience in marketing, digital marketing, business administration, brand development, and client engagement.',
      'He leads the company’s marketing and digital communication activities, focusing on corporate brand development, market positioning, digital presence, client engagement, business development, and strategic communication.',
      'His professional experience supports the development and implementation of market-oriented strategies designed to strengthen the company’s corporate identity, expand its market presence, and establish lasting relationships with clients and partners.',
      'Through digital marketing, content development, online communication, and strategic market engagement, he contributes to positioning the company as a modern, professional, and competitive engineering and infrastructure organization.',
    ],
    qualsLabel: 'Academic Qualification',
    quals: ['B.A. in Business Administration'],
    photo: '/img/team/nathan',
  },
]

/** Initials for the monogram, from the first two name parts. */
export function leaderInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
}
