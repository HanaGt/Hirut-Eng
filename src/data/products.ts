export type ServiceHash = 'construction' | 'consultancy' | 'after-sales'

export interface SpecGroup {
  title?: string
  items: string[]
}

export interface Category {
  slug: string
  name: string
  footerLabel: string
  tags: Array<'water' | 'ground' | 'power'>
  tagLabels: string[]
  cardBlurb: string
  metaDescription: string
  ogDescription: string
  heroLead: string
  specGroups: SpecGroup[]
  specNote?: string
  mediaPlaceholders: string[]
  related: Array<{ label: string; hash: ServiceHash }>
  cta: { heading: string; body: string; label: string }
  featureOrica?: boolean
}

export const categories: Category[] = [
  {
    slug: 'gabions-wire-products',
    name: 'Gabions & Wire Products',
    footerLabel: 'Gabions & Wire',
    tags: ['ground', 'water'],
    tagLabels: ['Ground', 'Water'],
    cardBlurb:
      'Galvanised and PVC-coated gabions, gabion mattresses, wire and fence meshes — 2.0–3.0 mm.',
    metaDescription:
      'Galvanised gabions, PVC coated gabions and gabion mattresses, galvanised wire meshes and fence meshes (2.0–3.0 mm) — imported and supplied by Hirut Engineering, Ethiopia.',
    ogDescription:
      'Galvanised and PVC-coated gabions, mattresses, wire and fence meshes — 2.0–3.0 mm.',
    heroLead:
      'Rock, held exactly where the river wants to move it. Gabions and wire products for erosion protection, river training, retaining structures, and fencing — galvanised or PVC-coated, in 2.0–3.0 mm wire.',
    specGroups: [
      {
        items: [
          'Galvanised Gabions (2.0–3.0 mm)',
          'Galvanised Wire Meshes (2.0–3.0 mm)',
          'Galvanized Fence Meshes (2.0–3.0 mm)',
          'PVC Coated Gabion Mattress (2.0–3.0 mm)',
          'PVC Coated Gabions (2.0–3.0 mm)',
        ],
      },
    ],
    specNote: 'Sizes, mesh openings, and coating specifications confirmed per order.',
    mediaPlaceholders: ['Gabion materials photo — pending from media library'],
    related: [
      { label: 'Hydraulic Structure Construction', hash: 'construction' },
      { label: 'Piezometer Installation & Geotechnical Works', hash: 'construction' },
      { label: 'After-Sales Services', hash: 'after-sales' },
    ],
    cta: {
      heading: 'Pricing gabions for a project?',
      body: "Send quantities and site details — we'll quote with honest lead times.",
      label: 'Request a gabions quote',
    },
  },
  {
    slug: 'geosynthetic-products',
    name: 'Geosynthetic Products',
    footerLabel: 'Geosynthetics',
    tags: ['ground', 'water'],
    tagLabels: ['Ground', 'Water'],
    cardBlurb:
      'HDPE/LDPE geomembranes, geotextiles 90–1000 GSM, geocells, safety nets, greenhouse plastics.',
    metaDescription:
      'HDPE and LDPE geomembranes (1.0–3.0 mm), geotextiles (90–1000 GSM), geocells, geonets, construction safety nets, greenhouse plastics, and polyethylene sheets — supplied by Hirut Engineering, Ethiopia.',
    ogDescription: 'Geomembranes, geotextiles, geocells, safety nets, and greenhouse plastics.',
    heroLead:
      'Engineered barriers between water and everything it wants to reach. Geomembranes for ponds, landfills, and reservoirs; geotextiles for separation and filtration; geocells for confinement — plus safety nets and greenhouse plastics.',
    specGroups: [
      {
        items: [
          'Construction Safety Nets',
          'Geocells and Geonets',
          'Geotextiles (90–1000 GSM)',
          'Greenhouse Plastics',
          'HDPE Smooth & Textured Geomembranes (1.0–3.0 mm)',
          'LDPE Smooth & Textured Geomembranes (1.0–3.0 mm)',
          'Polyethylene & Polypropylene Sheets (150–500 µm)',
        ],
      },
    ],
    mediaPlaceholders: [
      'Geomembrane photo — pending from media library',
      'Polyethylene sheet photo — pending from media library',
    ],
    related: [
      { label: 'Waterproofing Works', hash: 'construction' },
      { label: 'Modern Irrigation Design & Build', hash: 'construction' },
      { label: 'After-Sales Services', hash: 'after-sales' },
    ],
    cta: {
      heading: 'Lining a pond, a landfill, or a reservoir?',
      body: "Tell us the area and the application — we'll specify thickness, texture, and welding requirements.",
      label: 'Request a geosynthetics quote',
    },
  },
  {
    slug: 'geotechnical-equipment',
    name: 'Geotechnical Equipment',
    footerLabel: 'Geotechnical',
    tags: ['ground'],
    tagLabels: ['Ground', 'Exclusive · Orica'],
    cardBlurb:
      'Piezometers, inclinometers, extensometers, DCPs — with exclusive Orica instruments for East Africa.',
    metaDescription:
      'Vibrating wire and standpipe piezometers, inclinometers, extensometers, strain gauges, DCPs, plate bearing apparatus, tensiometers and earth pressure cells — including exclusive Orica instruments for East Africa.',
    ogDescription:
      'Exclusive East Africa importer and installer of Orica geotechnical and subsurface monitoring instruments.',
    heroLead:
      'Instruments that let the ground speak. Pore pressure, movement, load, and strength — measured, logged, and interpreted, so dams, slopes, and deep excavations are monitored rather than guessed at.',
    specGroups: [
      {
        items: [
          'Dynamic Cone Penetrometers (DCP)',
          'Extensometers & Strain Gauges',
          'Inclinometers',
          'Plate Bearing Apparatus',
          'Standpipe Piezometers',
          'Tensiometers & Earth Pressure Cells',
          'Vibrating Wire Piezometers (VWP)',
        ],
      },
    ],
    mediaPlaceholders: ['Geotechnical equipment / installation photo — pending from media library'],
    related: [
      { label: 'Piezometer Installation & Geotechnical Works', hash: 'construction' },
      { label: 'Periodic Monitoring & Emergency Support', hash: 'after-sales' },
      { label: 'Geotechnical Instrumentation Training', hash: 'after-sales' },
    ],
    cta: {
      heading: 'Instrumenting a dam, slope, or excavation?',
      body: 'From a single standpipe to a full monitoring array with data reporting — talk to the engineers who install these instruments.',
      label: 'Request an instrumentation quote',
    },
    featureOrica: true,
  },
  {
    slug: 'irrigation-farm-equipment',
    name: 'Irrigation & Farm Equipment',
    footerLabel: 'Irrigation & Farm',
    tags: ['water'],
    tagLabels: ['Water'],
    cardBlurb:
      'Centre pivot systems, drip and micro-irrigation, filters, sensors, sprinklers, and power units.',
    metaDescription:
      'Centre pivot systems, drip and micro-irrigation, filters and sensors, sprinklers and power units — supplied and installed with design consultancy by Hirut Engineering, Ethiopia.',
    ogDescription: 'Modern irrigation — designed, supplied, installed, and supported.',
    heroLead:
      'Every drop where the crop needs it. Centre pivots for scale, drip for precision, sprinklers for flexibility — designed for your soil and water source, not sold off a shelf.',
    specGroups: [
      {
        items: [
          'Centre Pivot Systems',
          'Drip & Micro-Irrigation',
          'Filters & Sensors',
          'Sprinklers & Power Units',
        ],
      },
    ],
    specNote:
      'System design, layout, and hydraulic sizing available as a consultancy service — see related services.',
    mediaPlaceholders: ['Irrigation works & materials photo — pending from media library'],
    related: [
      { label: 'Modern Irrigation Design & Build', hash: 'construction' },
      { label: 'Modern Irrigation Consultancy', hash: 'consultancy' },
      { label: 'Pump & Irrigation Training', hash: 'after-sales' },
    ],
    cta: {
      heading: 'Putting a field under irrigation?',
      body: "Share the hectares, crop, and water source — we'll design and quote the right system.",
      label: 'Request an irrigation quote',
    },
  },
  {
    slug: 'power-supply-equipment',
    name: 'Power Supply Equipment',
    footerLabel: 'Power Supply',
    tags: ['power'],
    tagLabels: ['Power'],
    cardBlurb: 'Industrial generators and green diesel generators for prime and standby power.',
    metaDescription:
      'Industrial generators and green diesel generators for prime and standby power — supplied, installed, commissioned, and maintained by Hirut Engineering, Ethiopia.',
    ogDescription: 'Generators that keep pumps pumping and sites running.',
    heroLead:
      'Water systems are only as reliable as the power behind them. Generators for boreholes, pump stations, farms, and sites — sized correctly, commissioned properly, and maintained afterward.',
    specGroups: [{ items: ['Industrial Generators', 'Green Diesel Generators'] }],
    specNote:
      'Ratings, engine brands, and configurations quoted per application — prime or standby duty.',
    mediaPlaceholders: ['Generators photo — pending from media library'],
    related: [
      { label: 'Electromechanical & General Sanitary Works', hash: 'construction' },
      { label: 'Installation, Commissioning & Start-Up', hash: 'after-sales' },
      { label: 'Maintenance, Inspection & Repair', hash: 'after-sales' },
    ],
    cta: {
      heading: 'Need dependable power on site?',
      body: "Tell us the load and the duty cycle — we'll size and quote the right unit.",
      label: 'Request a generator quote',
    },
  },
  {
    slug: 'pumps-accessories',
    name: 'Pumps & Accessories',
    footerLabel: 'Pumps & Accessories',
    tags: ['water'],
    tagLabels: ['Water'],
    cardBlurb:
      'Submersible, centrifugal, booster (VFD/VSP) and PD pumps, plus valves, tanks, hoses, and fittings.',
    metaDescription:
      'Submersible, centrifugal, booster (VFD/VSP) and positive displacement pumps, plus check valves, foot valves, hoses, fittings, pressure switches and tanks — supplied and installed by Hirut Engineering, Ethiopia.',
    ogDescription: 'The right pump for the duty point — with everything that connects it.',
    heroLead:
      'From a borehole 200 metres down to a rooftop tank — pumps matched to the duty point, with every valve, hose, switch, and tank that keeps the system honest.',
    specGroups: [
      {
        title: 'Pumps',
        items: [
          'Booster Pumps (VFD/VSP)',
          'Centrifugal Pumps',
          'Positive Displacement Pumps',
          'Submersible Pumps',
        ],
      },
      {
        title: 'Accessories',
        items: [
          'Check Valves',
          'Foot Valves',
          'Hoses & Fittings',
          'Pressure Switches',
          'Pressure Tanks',
        ],
      },
    ],
    mediaPlaceholders: ['Pumps photo — pending from media library'],
    related: [
      { label: 'Water Supply Infrastructure Construction', hash: 'construction' },
      { label: 'Electromechanical & General Sanitary Works', hash: 'construction' },
      { label: 'Pump & Irrigation Training', hash: 'after-sales' },
    ],
    cta: {
      heading: 'Sizing a pump, or replacing one that failed?',
      body: "Send the head, flow, and application — or just describe the problem. We'll spec it properly.",
      label: 'Request a pumps quote',
    },
  },
  {
    slug: 'waterproofing-materials',
    name: 'Waterproofing Materials',
    footerLabel: 'Waterproofing',
    tags: ['water', 'ground'],
    tagLabels: ['Water', 'Ground'],
    cardBlurb:
      'Bituminous and liquid-applied membranes, crystalline systems, EPDM, epoxies, and chemicals.',
    metaDescription:
      'APP and SBS bituminous membranes, crystalline waterproofing, EPDM rubbers, epoxies, liquid-applied membranes, bentonite and cementitious coatings, construction chemicals — imported and installed by Hirut Engineering, Ethiopia.',
    ogDescription: 'Materials that keep water out — imported and installed by the same firm.',
    heroLead:
      'We spend half our business bringing water up — and the other half keeping it out. Membranes, coatings, and chemicals for basements, roofs, tanks, and joints — imported and installed by the same firm, so the warranty means something.',
    specGroups: [
      {
        items: [
          'Adhesive & Bonding Agents',
          'APP and SBS Modified Bituminous Membranes (Torch-On / Self-Adhesive)',
          'Bentonite Clay & Cementitious Coatings',
          'Construction Chemicals',
          'Crystalline Waterproofing',
          'EPDM Rubbers',
          'Epoxy & Epoxy Resins',
          'Expansion Joint Fillers',
          'Liquid-Applied Membranes',
          'Protection Boards',
          'Thermoplastic Sheets',
        ],
      },
    ],
    mediaPlaceholders: ['Waterproofing materials photo — pending from media library'],
    related: [
      { label: 'Waterproofing Works', hash: 'construction' },
      { label: 'Hydraulic Structure Construction', hash: 'construction' },
      { label: 'Warranty & Defect Support', hash: 'after-sales' },
    ],
    cta: {
      heading: 'Fighting seepage or specifying a new build?',
      body: "Describe the structure and the water problem — we'll recommend the right system and install it.",
      label: 'Request a waterproofing quote',
    },
  },
]

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug)
}
