export const SITE_NAME = 'Hirut Engineering and General Trading PLC'
export const TAGLINE = 'Engineering water. Understanding ground.'
export const PHONE_1 = { display: '+251 911 518 448', tel: '+251911518448' }
export const PHONE_2 = { display: '+251 976 575 859', tel: '+251976575859' }

/* §6 content correction: 50M+ → 100M+ (Total portfolio) */
export const stats = [
  { value: 50, suffix: '+', label: 'Projects delivered across Ethiopia' },
  { value: 5, suffix: '+', label: 'Professional consultancy projects delivered across Africa' },
  { value: 10, suffix: '+', label: 'Years of excellence — established 2016' },
  { value: 100, prefix: '$', suffix: 'M+', label: 'USD total contract value (Total portfolio)' },
  { value: 50, suffix: '+', label: 'Skilled engineers' },
] as const

export const inquiryTypes: Array<{ group: string; options: Array<{ value: string; label: string }> }> = [
  {
    group: 'Products',
    options: [
      { value: 'gabions-wire-products', label: 'Gabions & Wire Products' },
      { value: 'geosynthetic-products', label: 'Geosynthetic Products' },
      { value: 'geotechnical-equipment', label: 'Geotechnical Equipment (incl. Orica instruments)' },
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

export const domesticPartners = [
  'BKGC',
  'Ethiopian Army Foundation',
  'Defence Construction Enterprise',
  'Defence Construction Design Enterprise',
  'Amhar Pipe Factory (APF)',
  'Oromia Water Works Construction Enterprise',
  'Zemen Construction Corporation',
  'GIW',
  'Michael Tilahun Import',
  'Sekela Engineering',
]

export const internationalPartners = [
  'AIM Industrials',
  'Orica',
  'RST Instruments',
  'SISGEO',
  'ENCARDIO RITE',
  'SME Monitoring',
  'Hunter',
  'Laxmidrip',
  'Perkins',
  'JCB',
  'USTUNEL',
  'PENTAX',
]

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
