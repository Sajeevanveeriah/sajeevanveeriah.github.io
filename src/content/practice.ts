/**
 * Independent Engineering Practice: the company profile.
 *
 * The practice is Saj's own business. Saj supplied the logo, the LinkedIn
 * company page and the PayPal funding link on 7 August 2026 and asked for a
 * dedicated profile section built for project lead generation. The factual
 * claims below are reused from the verified employer record in
 * `employers.ts`; nothing new is asserted about delivery or clients.
 *
 * The LinkedIn company URL spells "practise" because that is the exact
 * registered page address; it is not to be corrected.
 */

export interface PracticeChannel {
  readonly label: string
  readonly href: string
  readonly handle: string
}

export const practice = {
  name: 'Independent Engineering Practice',
  /** Route of the profile page, used by nav, sitemap and internal links. */
  path: '/practice/',
  logo: {
    src: '/assets/image/20260806-Independent-Engineering-Practice-Logo-Primary-Rev00.png',
    width: 1600,
    height: 420,
    alt: 'Independent Engineering Practice logo',
  },
  since: 'Operating since June 2026',
  tagline:
    'Engineering delivery for problems that cross disciplines: robotics, mechatronics, AI/ML, software and end-to-end automation.',
  // Same facts as the employer record summary in employers.ts, recast in the
  // indicative business voice Saj asked for on 7 August 2026: the company
  // profile speaks as the practice, never as "I".
  summary:
    'The practice designs, builds and deploys independent and client-facing engineering systems across robotics, mechatronics, AI/ML, software and end-to-end automation, taking work from problem definition and architecture through implementation, validation, deployment and practical handover.',
  services: [
    {
      title: 'Robotics and autonomy',
      body: 'Supervised robots, mobile platforms and autonomy stacks, designed, built, validated and handed over for real end-users.',
    },
    {
      title: 'Product research and development',
      body: 'Physical products from concept and architecture through electronics, firmware, software and field validation.',
    },
    {
      title: 'Engineering software',
      body: 'Controlled browser and desktop workflows with reviewable outputs: imports, changes, exceptions, rollback and audit.',
    },
    {
      title: 'End-to-end automation',
      body: 'Automation that connects physical systems, data and operator review, with observable behaviour and verified results.',
    },
  ],
  /** Slugs of delivered practice projects, matching `projects.ts`. */
  deliveredSlugs: [
    'upzy-supervised-routine-companion',
    'swl-pricing-inventory-control',
    'inventory-scanning-mobile-robot',
    'modular-education-testing-robot',
  ],
  linkedin: {
    label: 'LinkedIn company page',
    href: 'https://www.linkedin.com/company/independent-engineering-practise/',
    handle: 'linkedin.com/company/independent-engineering-practise',
  } satisfies PracticeChannel,
  paypal: {
    label: 'Support via PayPal',
    href: 'https://paypal.me/SajeevanVeeriah95',
    handle: 'paypal.me/SajeevanVeeriah95',
  } satisfies PracticeChannel,
  /** Pre-filled subject so project enquiries are separable in the inbox. */
  enquirySubject: 'Project enquiry - Independent Engineering Practice',
  engage: {
    kicker: 'Work with the practice',
    title: 'Bring a project.',
    body: 'Describe the operating problem, the constraints and the outcome you need. The practice responds with a proposed approach, the validation plan and what delivery would look like.',
  },
  support: {
    kicker: 'Support the practice',
    title: 'Fund independent engineering.',
    body: 'The practice also builds self-directed systems such as Upzy and the modular robot platform. If you want to support that independent work, donations and funding are welcome.',
  },
} as const
