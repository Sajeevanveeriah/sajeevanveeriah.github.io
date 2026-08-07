/**
 * Site-level facts and SEO defaults.
 *
 * Every value here was transcribed from the previous index.html; the
 * tagline and description voice was recast to third person on the owner's
 * 7 August 2026 direction, facts unchanged. Nothing is inferred.
 * The contact model is binding and closed: exactly
 * three personal channels plus the resume, and no telephone, address,
 * location, visa, work-rights or availability statement may ever be added.
 */

export interface SocialLink {
  readonly label: string
  readonly href: string
  readonly handle: string
}

export interface SiteConfig {
  readonly name: string
  readonly shortName: string
  readonly initials: string
  readonly jobTitle: string
  readonly tagline: string
  readonly description: string
  readonly url: string
  readonly locale: string
  readonly lang: string
  readonly email: string
  readonly resumePath: string
  readonly socials: readonly SocialLink[]
  readonly credentials: readonly string[]
}

/**
 * The single canonical professional identity string.
 *
 * Every page title, hero role line, header brand role, section kicker, meta
 * description, Open Graph card, Twitter card and JSON-LD `Person.jobTitle`
 * reads this constant rather than restating the role. Six places previously
 * carried their own wording and four of them had already drifted apart, so
 * changing the identity meant changing it in six files and it was never done
 * in all six at once.
 *
 * The form is exact and is not to be paraphrased: Robotics leads, the
 * separator before the final term is an ampersand rather than the word "and",
 * and "End-To-End" is hyphenated with ASCII hyphens and a capital T. The
 * leading order supersedes every earlier ordering used on the site.
 */
export const JOB_TITLE = 'Robotics, Mechatronics, AI/ML & End-To-End Automation Engineer' as const

export const site: SiteConfig = {
  name: 'Sajeevan Veeriah',
  shortName: 'Saj',
  initials: 'SV',
  jobTitle: JOB_TITLE,
  // From index.html:1523; voice recast to third person on the owner's
  // 7 August 2026 direction.
  tagline:
    'Sajeevan works across robotics, mechatronics, AI/ML and end-to-end automation, connecting physical systems, electronics, embedded intelligence, software, controls and validation.',
  // The role label is composed from `JOB_TITLE` so the meta description, the
  // Open Graph card and the Twitter card can never drift from the page title.
  // The capability clause after it is the original wording from index.html:9;
  // the framing was recast to third person on the owner's 7 August 2026
  // direction.
  description: `Sajeevan Veeriah is a ${JOB_TITLE} working across physical systems, embedded electronics, controls, CAN telemetry, Linux integration and field validation.`,
  url: 'https://sajeevanveeriah.github.io',
  locale: 'en_AU',
  lang: 'en-AU',
  email: 'sajeevanveeriah@gmail.com',
  resumePath: '/assets/Resume_Sajeevan_Veeriah.pdf',
  socials: [
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/sajeevan-veeriah/',
      handle: 'linkedin.com/in/sajeevan-veeriah',
    },
    {
      label: 'GitHub',
      href: 'https://github.com/Sajeevanveeriah',
      handle: 'github.com/Sajeevanveeriah',
    },
  ],
  // Verbatim from index.html:173-174
  credentials: ['Member, Engineers Australia', 'Deakin Honours Distinction, 2025'],
} as const

/** Quiet primary navigation. Atlas remains linked from Expertise and project evidence. */
export interface NavItem {
  readonly label: string
  readonly href: string
}

export const navigation: readonly NavItem[] = [
  { label: 'Work', href: '/work/' },
  // The business profile. Saj asked on 7 August 2026 for the practice to be
  // reachable as its own section, built for project lead generation.
  { label: 'Practice', href: '/practice/' },
  { label: 'Expertise', href: '/skills/' },
  // The employer record was reachable from nothing until this entry existed:
  // it had a route, a sitemap line and six detail pages, and no page on the
  // site linked to any of them. Everything a visitor could click led to the
  // thinner career copy instead, which is why the role pages read as empty.
  { label: 'Employers', href: '/employers/' },
  // The ecosystem catalogue is a reference layer about the field rather than
  // about Saj, so it sits after the evidence routes. It gets a plain nav
  // entry and no mega-menu panel on purpose: eight pillars belong on the
  // page, not in a dropdown, and dumping 31 domains into the header would
  // make navigation worse rather than better.
  { label: 'Ecosystem', href: '/ecosystem/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
] as const

/**
 * Mega-menu framing copy.
 *
 * Only the three nav items that own sub-pages get a panel. The link lists
 * themselves are never written here: they are derived at render time from the
 * work records, the atlas domains and the roles, so a panel can never drift
 * out of step with the pages it points at. What lives here is the one
 * sentence that says what the section is, because no copy belongs in a
 * component.
 */
export interface NavPanelCopy {
  /** Which nav href the panel hangs off. */
  readonly href: string
  /** Kicker above the link columns. */
  readonly eyebrow: string
  /** One sentence naming what the section contains. */
  readonly intro: string
  /** Heading for the derived link column. */
  readonly listTitle: string
  /** Label on the link back to the section index. */
  readonly indexLabel: string
}

export const navPanels: readonly NavPanelCopy[] = [
  {
    href: '/work/',
    eyebrow: 'Work',
    intro:
      'Case studies showing the problem, the work Sajeevan owned, the decisions he made and the result he verified.',
    listTitle: 'Records',
    indexLabel: 'Every record, including the archive',
  },
  {
    href: '/skills/',
    eyebrow: 'Expertise',
    intro:
      'Sajeevan\'s capability atlas, with each domain linked to the evidence he can show.',
    listTitle: 'Atlas domains',
    indexLabel: 'Browse the full atlas',
  },
  {
    href: '/employers/',
    eyebrow: 'Employers',
    intro:
      'Sajeevan\'s employment record, separating company background from the work he personally completed.',
    listTitle: 'Employers',
    indexLabel: 'Every employer, and the through-line',
  },
] as const
