export const SITE_NAME = 'HIRUT Engineering Construction and General Trading'
/** Short form for the header, hero and nav  matches the logo wordmark. */
export const SITE_NAME_SHORT = 'Hirut Engineering'
/** Wordmark sub-line under HIRUT in the brand lockup. */
export const SITE_DESCRIPTOR = 'Engineering Construction & General Trading'
export const TAGLINE = 'Engineering water. Understanding ground.'
export const PHONE_1 = { display: '+251 911 518 448', tel: '+251911518448' }
export const PHONE_2 = { display: '+251 976 575 859', tel: '+251976575859' }
export const EMAIL = { display: 'info@hirutengineering.com', href: 'mailto:info@hirutengineering.com' }

const OFFICE_QUERY = 'Signal Business Center, Kenenisa Ave, Addis Ababa, Ethiopia'

export const OFFICE = {
  lines: ['Yeka Sub-City, Woreda 07', 'Signal Business Center', 'Addis Ababa, Ethiopia'] as const,
  hours: 'Monday–Friday, 8am–6pm',
  openingHours: 'Mo-Fr 08:00-18:00',
  /** Signal Business Center on Kenenisa Ave (Google Place). */
  lat: 9.0219851,
  lon: 38.7866934,
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(OFFICE_QUERY)}`,
  mapsEmbedUrl: `https://www.google.com/maps?q=${encodeURIComponent(OFFICE_QUERY)}&ll=9.0219851,38.7866934&z=17&hl=en&output=embed`,
}

export const SOCIAL = [
  { id: 'telegram' as const, label: 'Telegram', href: 'https://t.me/Hirutengineering' },
  {
    id: 'facebook' as const,
    label: 'Facebook',
    href: 'https://www.facebook.com/share/1czPpCM8ZQ/?mibextid=wwXIfr',
  },
]

/* §6 content correction: 50M+ → 100M+ (Total portfolio) */
export const stats = [
  { value: 50, suffix: '+', label: 'Projects delivered across Ethiopia' },
  { value: 5, suffix: '+', label: 'Professional consultancy projects delivered across Africa' },
  { value: 10, suffix: '+', label: 'Years of excellence, established 2016' },
  { value: 100, prefix: '$', suffix: 'M+', label: 'USD total contract value (Total portfolio)' },
  { value: 50, suffix: '+', label: 'Skilled engineers' },
] as const

export const inquiryTypes: Array<{ group: string; options: Array<{ value: string; label: string }> }> = [
  {
    group: 'Products',
    options: [
      { value: 'gabions-wire-products', label: 'Gabions & Wire Products' },
      { value: 'geosynthetic-products', label: 'Geosynthetic Products' },
      { value: 'geotechnical-equipment', label: 'Geotechnical Equipment (incl. Orica Digital Solutions instruments)' },
      { value: 'irrigation-farm-equipment', label: 'Irrigation & Farm Equipment' },
      { value: 'power-supply-equipment', label: 'Power Supply Equipment' },
      { value: 'pumps-accessories', label: 'Pumps & Accessories' },
      { value: 'waterproofing-materials', label: 'Waterproofing Materials' },
    ],
  },
  {
    group: 'Services',
    options: [
      { value: 'construction-services', label: 'Construction Works' },
      { value: 'consultancy-services', label: 'Professional & Consultancy Services' },
      { value: 'after-sales', label: 'After-Sales Services' },
    ],
  },
  {
    group: 'Other',
    options: [{ value: 'general', label: 'General inquiry' }],
  },
]

export type Partner = {
  name: string
  logo?: string
}

export const domesticPartners: Partner[] = [
  { name: 'BKGC', logo: '/img/partners/domestic/bkgc.webp?v=2' },
  { name: 'Ethiopian Army Foundation', logo: '/img/partners/domestic/ethiopian-defence-foundation.webp' },
  { name: 'Defence Construction Enterprise', logo: '/img/partners/domestic/defence-construction-enterprise.webp' },
  { name: 'Defence Construction Design Enterprise', logo: '/img/partners/domestic/defence-construction-design-enterprise.webp' },
  { name: 'Amhara Pipe Factory (APF)', logo: '/img/partners/domestic/amhara-pipe-factory.webp' },
  { name: 'Oromia Water Works Construction Enterprise', logo: '/img/partners/domestic/oromia-water-works.webp' },
  { name: 'Zemen Construction Corporation', logo: '/img/partners/domestic/zemen-construction.webp' },
  { name: 'GIW', logo: '/img/partners/domestic/giw.webp?v=2' },
  { name: 'Michael Tilahun Import', logo: '/img/partners/domestic/michael-tilahun-import.webp' },
  { name: 'Sekela Engineering' },
]

export const internationalPartners: Partner[] = [
  { name: 'AIM Industrials', logo: '/img/partners/brands/aim-industrials.webp' },
  { name: 'Orica Digital Solutions', logo: '/img/partners/brands/orica-digital-solutions.webp?v=3' },
  { name: 'RST Instruments', logo: '/img/partners/brands/rst-instruments.webp' },
  { name: 'SISGEO', logo: '/img/partners/brands/sisgeo.webp' },
  { name: 'ENCARDIO RITE', logo: '/img/partners/brands/encardio-rite.webp' },
  { name: 'SME Monitoring', logo: '/img/partners/brands/sme-monitoring.webp' },
  { name: 'Hunter', logo: '/img/partners/brands/hunter.webp?v=2' },
  { name: 'Laxmidrip', logo: '/img/partners/brands/laxmidrip.webp?v=2' },
  { name: 'Perkins', logo: '/img/partners/brands/perkins.webp' },
  { name: 'JCB', logo: '/img/partners/brands/jcb.webp' },
  { name: 'USTUNEL', logo: '/img/partners/brands/ustunel.webp?v=2' },
  { name: 'PENTAX', logo: '/img/partners/brands/pentax.webp?v=2' },
]

const PARTNER_BAND_NAMES = new Set([
  'Orica Digital Solutions',
  'RST Instruments',
  'SISGEO',
  'ENCARDIO RITE',
  'Hunter',
  'Perkins',
  'JCB',
  'PENTAX',
  'Defence Construction Enterprise',
  'Oromia Water Works Construction Enterprise',
  'Zemen Construction Corporation',
  'Ethiopian Army Foundation',
])

export const partnerBand: Partner[] = [...internationalPartners, ...domesticPartners].filter((p) =>
  PARTNER_BAND_NAMES.has(p.name),
)

export interface SampleProject {
  sector: string
  sectorLabel: string
  region: string
  regionLabel: string
  year: string
  title: string
}

export const sampleProjects: SampleProject[] = [
  { sector: 'water-supply', sectorLabel: 'Water Supply', region: 'sample-a', regionLabel: 'Sample Region A', year: 'sample-recent', title: 'Sample: town water supply scheme' },
  { sector: 'geotechnical', sectorLabel: 'Geotechnical', region: 'sample-b', regionLabel: 'Sample Region B', year: 'sample-recent', title: 'Sample: dam instrumentation program' },
  { sector: 'irrigation', sectorLabel: 'Irrigation', region: 'sample-c', regionLabel: 'Sample Region C', year: 'sample-earlier', title: 'Sample: commercial farm drip system' },
  { sector: 'hydraulic', sectorLabel: 'Hydraulic Structures', region: 'sample-a', regionLabel: 'Sample Region A', year: 'sample-earlier', title: 'Sample: hydraulic structure works' },
  { sector: 'waterproofing', sectorLabel: 'Waterproofing', region: 'sample-b', regionLabel: 'Sample Region B', year: 'sample-recent', title: 'Sample: basement waterproofing works' },
  { sector: 'well-drilling', sectorLabel: 'Well Drilling', region: 'sample-c', regionLabel: 'Sample Region C', year: 'sample-earlier', title: 'Sample: deep borehole drilling' },
]

export const afterSalesPillars: Array<{ title: string; blurb: string; items: string[] }> = [
  {
    title: 'Technical Support & Customer Service',
    blurb: 'Application advisory, on-site and remote support, troubleshooting, O&M guidance.',
    items: [
      'Application advisory',
      'On-site and remote support',
      'Troubleshooting and fault diagnosis',
      'Operation & maintenance guidance',
    ],
  },
  {
    title: 'Installation, Commissioning & Start-Up',
    blurb: 'Installation, testing, calibration, performance verification, and start-up support.',
    items: [
      'Installation and commissioning',
      'Testing, calibration, and performance verification',
      'Start-up support',
      'Monitoring and data-quality reporting',
    ],
  },
  {
    title: 'Maintenance, Inspection & Repair',
    blurb: 'Preventive and corrective maintenance, servicing, repair, and rehabilitation works.',
    items: [
      'Preventive and corrective maintenance',
      'Routine servicing',
      'Electrical and control-system support',
      'Battery and power-system inspection',
      'Repair and component replacement',
      'Rehabilitation works',
    ],
  },
  {
    title: 'Training & Capacity Building',
    blurb: 'Equipment O&M, instrumentation, pump and irrigation training, on-site demonstrations.',
    items: [
      'Equipment operation & maintenance training',
      'Geotechnical instrumentation training',
      'Pump and irrigation training',
      'On-site demonstrations',
    ],
  },
  {
    title: 'Warranty & Defect Support',
    blurb: 'Warranty administration, defect investigation and rectification, post-installation follow-up.',
    items: [
      'Warranty administration',
      'Defect investigation and rectification',
      'Replacement or repair per warranty conditions',
      'Post-installation follow-up',
    ],
  },
  {
    title: 'Periodic Monitoring & Emergency Support',
    blurb: 'Scheduled inspections, long-term monitoring contracts, and rapid-response repair.',
    items: [
      'Scheduled inspection programs',
      'Long-term monitoring contracts',
      'Emergency troubleshooting',
      'Rapid-response repair',
    ],
  },
]
