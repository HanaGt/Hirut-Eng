/* ============================================================
   About Us content library (revision 3, section 5).

   Every string in this file is client-supplied and FINAL. It is
   reproduced word for word: do not rewrite, shorten, re-tone or
   paraphrase any of it. Layout decisions live in the components;
   the words live here.
   ============================================================ */

export interface Statement {
  title: string
  paragraphs: string[]
}

/* 5.1 */
export const vision: Statement = {
  title: 'Our Vision',
  paragraphs: [
    'To be a leading and trusted multidisciplinary engineering and infrastructure company, recognized for technical excellence, innovation, integrity, and sustainable solutions that contribute to resilient communities and lasting development.',
    'We aspire to become a preferred partner for clients seeking reliable engineering, construction, water infrastructure, geological, mining, geotechnical, and technology solutions, both nationally and across the region.',
  ],
}

/* 5.2 */
export const mission: Statement = {
  title: 'Our Mission',
  paragraphs: [
    'To deliver integrated, high-quality, and sustainable engineering and infrastructure solutions through professional expertise, innovative technology, responsible project management, and an unwavering commitment to client satisfaction.',
    'We are committed to combining technical knowledge, practical experience, modern technology, and multidisciplinary collaboration to transform complex project requirements into safe, efficient, economical, and sustainable solutions.',
    'Through our professional services, we aim to create lasting value for our clients, partners, communities, and stakeholders while continuously developing our people, systems, and technical capabilities.',
  ],
}

/* 5.3 */
export const purpose: Statement = {
  title: 'Our Purpose',
  paragraphs: [
    'Our purpose is to deliver reliable, innovative, and sustainable engineering and infrastructure solutions that create lasting value for our clients, communities, and partners.',
    'We bring together professional expertise, multidisciplinary knowledge, modern technology, and responsible practices to transform complex challenges into practical solutions and contribute to sustainable development',
  ],
}

/* 5.4 - ten values, each with its single supplied sentence */
export const coreValues: Array<{ n: string; name: string; body: string }> = [
  {
    n: '01',
    name: 'Excellence',
    body: 'We pursue the highest standards of technical quality, professionalism, and performance in everything we do.',
  },
  {
    n: '02',
    name: 'Integrity',
    body: 'We conduct our business with honesty, transparency, accountability, and ethical responsibility, building relationships based on trust.',
  },
  {
    n: '03',
    name: 'Professionalism',
    body: 'We apply our knowledge, experience, and professional standards responsibly to deliver dependable results and maintain the confidence of our clients and partners.',
  },
  {
    n: '04',
    name: 'Innovation',
    body: 'We embrace new technologies, modern engineering approaches, digital solutions, and creative thinking to improve the way we solve complex challenges.',
  },
  {
    n: '05',
    name: 'Client Commitment',
    body: 'Our clients are at the center of our work. We listen carefully to their requirements and strive to deliver solutions that meet or exceed their technical, commercial, and operational expectations.',
  },
  {
    n: '06',
    name: 'Sustainability',
    body: 'We promote solutions that consider long-term environmental, economic, technical, and social sustainability, supporting responsible infrastructure development.',
  },
  {
    n: '07',
    name: 'Safety',
    body: 'We place the highest importance on the health, safety, and well-being of our employees, clients, communities, and project stakeholders.',
  },
  {
    n: '08',
    name: 'Teamwork',
    body: 'We believe complex challenges are best addressed through multidisciplinary collaboration, knowledge sharing, mutual respect, and collective responsibility.',
  },
  {
    n: '09',
    name: 'Accountability',
    body: 'We take ownership of our commitments, decisions, and results, maintaining a culture of responsibility, transparency, and continuous improvement.',
  },
  {
    n: '10',
    name: 'Continuous Learning',
    body: 'We continuously develop our people, knowledge, systems, and technologies to remain competitive, adaptable, and capable of responding to evolving industry challenges.',
  },
]

/* 5.5 */
export const corporatePromise = {
  slogan: 'Building Solutions. Connecting Expertise. Creating Sustainable Value.',
  paragraphs: [
    'We are committed to being more than a service provider. We strive to be a trusted technical partner, working alongside our clients from initial concept and investigation through design, construction, implementation, monitoring, and long-term project success.',
  ],
  lines: [
    'Our Vision gives us direction.',
    'Our Mission defines what we do.',
    'Our Values define how we do it.',
  ],
}

/* 5.6 - newly written for HIRUT in the company's own language. It carries the
   same four commitments as the earlier draft, and it requires the CEO's
   approval before it goes live: the page shows that marker until confirmed. */
export const customerPromise = {
  intro: [
    'HIRUT Engineering Construction and General Trading was founded by engineers who kept meeting the same gap on project after project: equipment supplied with no technical backing, and work handed over with no one left accountable for it.',
    'Our promise is the opposite of that. We supply what we would specify ourselves, we design and build to the standard we would want on our own sites, and we remain responsible for the outcome long after commissioning.',
    'Our customer promise is upheld on every project:',
  ],
  pillars: [
    {
      name: 'Safety',
      body: 'We place the health and safety of our people, our clients, and the communities around our projects above schedule and above cost. On every site, every installation, and every drilling operation.',
    },
    {
      name: 'Quality supply',
      body: 'We import and supply only the equipment and materials we are prepared to stand behind technically, backed by direct manufacturer relationships, including our exclusive East African partnership with Orica Digital Solutions.',
    },
    {
      name: 'Engineering integrity',
      body: 'Every investigation, design, and installation is carried out to professional standards by qualified engineers, with honest technical judgment given even when it is not the easiest answer.',
    },
    {
      name: 'We stay',
      body: 'Commissioning is where our commitment begins, not where it ends. Training, maintenance, calibration, warranty support, and emergency response are part of what we deliver, not an afterthought.',
    },
  ],
}

/* A run of copy where the client bolded part of the sentence. Kept as
   segments so the emphasis survives without editing a single word. */
export interface EmphasisedRun {
  parts: Array<{ text: string; strong?: boolean }>
}

/* 5.7 */
export const clientExpectations: EmphasisedRun = {
  parts: [
    { text: 'At HIRUT Engineering Construction & General Trading, our clients can expect ' },
    {
      text: 'professional expertise, reliable solutions, clear communication, quality delivery, and strong project commitment',
      strong: true,
    },
    {
      text: '. We take the time to understand each client’s needs and combine multidisciplinary experience, modern technology, and practical engineering solutions to deliver results that create lasting value. We build relationships based on ',
    },
    { text: 'trust, responsiveness, accountability, and long-term partnership', strong: true },
    { text: '.' },
  ],
}

/* 5.8 */
export const ourStandards: EmphasisedRun = {
  parts: [
    { text: 'We hold ourselves to high standards of ' },
    {
      text: 'technical excellence, quality, integrity, safety, accountability, and sustainability',
      strong: true,
    },
    {
      text: '. Every project is approached with professional care, responsible engineering judgment, and a commitment to continuous improvement. We believe that excellence is measured not only by what we deliver, but by ',
    },
    {
      text: 'how we deliver it and the lasting value we create for our clients and communities',
      strong: true,
    },
    { text: '.' },
  ],
}

/* 5.9 */
export const commitmentToEveryClient = {
  slogan: 'We listen. We understand. We engineer. We deliver.',
  paragraphs: [
    'From the first consultation to project completion and beyond, our commitment is to provide professional expertise, dependable service, transparent communication, and technically responsible solutions.',
    'We measure our success not only by whether a project is completed, but by the quality of the outcome, the value created for our client, and the trust we build throughout the journey.',
  ],
  signature: 'HIRUT Engineering Construction & General Trading',
  attributes:
    'Professional Expertise | Technical Excellence | Quality | Integrity | Safety | Sustainability | Client Commitment',
}

/* 5.10 */
export const leadershipIntro: string[] = [
  'Our company is led by a multidisciplinary team of professionals with extensive expertise in engineering, construction, water infrastructure, geology, geotechnical engineering, finance, information technology, and business management. Our leadership team combines technical knowledge, professional experience, and strategic management to deliver reliable, innovative, and sustainable solutions to our clients.',
  'Our strength is built on people. HIRUT Engineering Construction and General Trading is guided by a multidisciplinary leadership team bringing together expertise in engineering, construction, water infrastructure, geology, geotechnical engineering, project management, finance, information technology, and digital solutions.',
  'Our professionals combine advanced academic qualifications, practical field experience, technical leadership, and strategic management to deliver integrated solutions for complex infrastructure and development challenges.',
  'We believe that successful projects require more than technical knowledge. They require strong leadership, rigorous planning, professional integrity, innovation, and a clear understanding of our clients’ objectives.',
]

/* 5.15 */
export const leadershipPageIntro = {
  headline: 'Leadership Driven by Expertise and Excellence',
  paragraphs: [
    'Our leadership team brings together professionals from diverse technical and managerial disciplines, creating a strong foundation for delivering integrated engineering, construction, infrastructure, and business solutions.',
    'With expertise spanning hydraulic and water engineering, civil and construction engineering, geology, hydrogeology, geotechnical engineering, project management, finance, taxation, information technology, geospatial solutions, and digital marketing, our team provides both strategic direction and technical leadership across the organization.',
    'We believe effective leadership is built on professional competence, integrity, accountability, innovation, and a commitment to excellence. Our leaders combine academic knowledge with practical experience to guide projects from concept and investigation through design, implementation, supervision, and successful completion.',
    'Through collaborative leadership and multidisciplinary coordination, we continuously strengthen our technical capabilities, improve project performance, and create sustainable value for our clients and partners.',
  ],
  philosophyLabel: 'Our Leadership Philosophy',
  philosophy: 'Expertise | Integrity | Innovation | Accountability | Collaboration | Excellence',
}

/* 5.12 */
export const collectiveStrength = {
  title: 'Our Collective Strength',
  slogan: 'One Team. Multiple Disciplines. Integrated Solutions.',
  paragraphs: [
    'The strength of our organization lies in the combination of technical expertise, professional experience, academic excellence, and multidisciplinary collaboration.',
    'Our leadership team brings together complementary capabilities in engineering, construction, water infrastructure, geology, hydrogeology, geotechnical engineering, project management, finance, taxation, information technology, geospatial solutions, and marketing.',
    'This integrated approach enables us to understand projects from multiple technical and managerial perspectives and to develop solutions that are practical, technically sound, economically responsible, and sustainable.',
  ],
}

/* 5.13 */
export const teamForComplexChallenges = {
  title: 'A Team Built for Complex Challenges',
  paragraphs: [
    'Our leadership brings together complementary disciplines under one professional platform. This multidisciplinary approach enables HIRUT to provide integrated engineering, construction, water, geological, geotechnical, technological, financial, and project-management solutions.',
    'From technical investigation and engineering design to construction, project management, digital solutions, and business support, our team is committed to one objective:',
    'Delivering technically sound, professionally managed, and sustainable solutions that create lasting value for our clients and communities.',
  ],
  closing: 'Engineering Excellence. Professional Integrity. Sustainable Solutions.',
}

/* 5.14 */
export const ourCommitment = {
  title: 'Our Commitment',
  body: 'We are committed to maintaining the highest standards of professionalism, technical quality, integrity, safety, innovation, and client service in every project we undertake.',
  attributes:
    'Engineering Excellence | Integrated Expertise | Sustainable Solutions | Lasting Value',
}
