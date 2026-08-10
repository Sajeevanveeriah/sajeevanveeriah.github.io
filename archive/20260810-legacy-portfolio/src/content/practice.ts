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
  /**
   * The two lockups, and the crop each one needs.
   *
   * Saj supplied a light lockup on transparency and a dark lockup baked onto
   * its own deep-navy card. They are different sizes AND different framings:
   * the light artwork's mark ends at x=1070 of 1600 and the dark artwork's
   * mark sits inside 1733x908 with a wide empty band beneath it. Rendered
   * whole, the two would sit at visibly different optical sizes on the same
   * page.
   *
   * Every number below was measured from the actual pixels with sharp, not
   * estimated: `content` is the bounding box of the drawn mark, and `crop` is
   * that box plus proportional padding, expressed as the background-size and
   * background-position percentages that show exactly that region. Both crops
   * resolve to the same 1070/354 aspect ratio, which is what makes the two
   * variants interchangeable inside one fixed-height plate with no layout
   * shift when the theme changes.
   */
  logo: {
    src: '/assets/image/20260806-Independent-Engineering-Practice-Logo-Primary-Rev00.png',
    width: 1600,
    height: 420,
    alt: 'Independent Engineering Practice logo',
  },
  logoDark: {
    src: '/assets/image/20260806-IEP-Logo-Primary-Dark-Rev00.png',
    width: 1733,
    height: 908,
  },
  since: 'Operating since June 2026',
  tagline:
    'Robotic and embedded product development, from system architecture through physical integration, validation and deployment.',
  secondary:
    'Selective engineering software and workflow automation, where it directly supports physical operations.',
  // Same facts as the employer record summary in employers.ts, recast in the
  // indicative business voice Saj asked for on 7 August 2026: the company
  // profile speaks as the practice, never as "I".
  summary:
    'The practice designs, builds and deploys robotic and embedded systems for clients and for its own product work, taking a machine from problem definition and system architecture through mechanism, electronics, firmware, autonomy and software to validation, deployment and practical handover. Engineering software and automation are delivered where they support the physical operation.',
  /**
   * Ordered, not equal. The first three are what the practice is for; the
   * last two are what it does around them. Ten services at equal prominence
   * is what made the practice read as a general contractor rather than as a
   * robotics practice, so the order here is load-bearing and the page renders
   * it as a ranked list rather than as a grid of identical cards.
   */
  services: [
    {
      title: 'Robotic and embedded product development',
      body: 'A machine taken from operating problem and system architecture through mechanism, electronics, firmware, autonomy and handover.',
    },
    {
      title: 'Prototype integration',
      body: 'Existing subsystems made to behave as one machine, with the interfaces and failure modes written down rather than discovered on site.',
    },
    {
      title: 'Robotics and edge-intelligence architecture',
      body: 'Compute, sensing and autonomy chosen against timing, I/O, power, thermals, environment, serviceability and supply, before anything is committed.',
    },
    {
      title: 'Deployment and diagnostics readiness',
      body: 'What an operator needs on the day: observable state, recovery behaviour, service access and evidence that the system does what it claims.',
    },
    {
      title: 'Operational workflow automation',
      body: 'Controlled software with reviewable outputs, where it directly supports the physical operation rather than replacing it.',
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
