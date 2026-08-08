/**
 * Site-level facts and SEO defaults.
 *
 * Every value here was transcribed from the previous index.html; the
 * tagline and description voice was recast to agentless capability voice
 * (no name, no pronouns in prose) on the owner's 7 August 2026 direction
 * after the named third-person cut was rejected, facts unchanged. Nothing
 * is inferred.
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

/**
 * The specialism, stated under the job title wherever the identity appears.
 *
 * `JOB_TITLE` says what the discipline is; this says what the specialism
 * inside it is, which is the thing a reader has to get in the first screen.
 * The two are deliberately separate constants: the title is the formal
 * professional identity and is not to be replaced by a coined label, and the
 * descriptor is the positioning that sits beneath it.
 */
export const SPECIALIST_DESCRIPTOR =
  'Autonomous Mobile Robotics | Embedded Intelligence | Sensor Fusion and Control' as const

/** The resume adds ROS 2 to the descriptor, because a resume is scanned for it. */
export const RESUME_DESCRIPTOR =
  'Autonomous Mobile Robotics | ROS 2 | Embedded Intelligence | Sensor Fusion and Control' as const

export const site: SiteConfig = {
  name: 'Sajeevan Veeriah',
  shortName: 'Saj',
  initials: 'SV',
  jobTitle: JOB_TITLE,
  // Recast on the 6 August 2026 specialist repositioning: the tagline used to
  // list the disciplines side by side, which read as breadth. It now names
  // the specialism and treats the breadth as what supports it.
  tagline:
    'Autonomous mobile robotics and embedded intelligent systems, engineered across mechanics, sensing, embedded control, autonomy, AI/ML and deployment.',
  // The role label is composed from `JOB_TITLE` so the meta description, the
  // Open Graph card and the Twitter card can never drift from the page title.
  // The capability clause after it is the original wording from index.html:9;
  // the framing was recast on the owner's 7 August 2026 direction. The name
  // appears exactly once here as identity (rule: SEO identity, not prose);
  // the rest of the sentence is agentless.
  description: `Portfolio and engineering practice of Sajeevan Veeriah, a ${JOB_TITLE} specialising in autonomous mobile robotics and embedded intelligent systems, from mechanism and sensing through embedded control, autonomy and deployment.`,
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

/**
 * Five primary destinations, in the order a reader needs them.
 *
 * Two entries were demoted on the 6 August 2026 specialist repositioning,
 * and neither was removed:
 *
 *   - `/ecosystem/` is a reference library about the field rather than about
 *     Saj. A header entry beside the evidence routes gave a catalogue of 240
 *     entities the same weight as the work, which is exactly what made the
 *     site read as "knows of everything" rather than "specialises in this".
 *     It keeps its route and is linked from the footer and from Expertise.
 *   - `/employers/` keeps its route, its detail pages and its footer link.
 *     It is a career appendix, not a primary destination.
 *
 * Demotion is not deletion. Both indexes remain reachable, indexed and in
 * the sitemap; they simply stop competing for the header.
 */
export const navigation: readonly NavItem[] = [
  { label: 'Work', href: '/work/' },
  { label: 'Expertise', href: '/skills/' },
  { label: 'About', href: '/about/' },
  // The business profile. Saj asked on 7 August 2026 for the practice to be
  // reachable as its own section, built for project lead generation.
  { label: 'Practice', href: '/practice/' },
  { label: 'Contact', href: '/contact/' },
] as const

/**
 * Secondary destinations. Reachable from the footer rather than the header,
 * so nothing that exists today becomes unreachable.
 */
export const secondaryNavigation: readonly NavItem[] = [
  { label: 'Engineering Reference Library', href: '/ecosystem/' },
  { label: 'Capability atlas', href: '/atlas/' },
  { label: 'Employment record', href: '/employers/' },
  { label: 'Interactive lab', href: '/lab/' },
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
    // Panel intros recast agentless on the owner's 7 August 2026 direction.
    intro:
      'Robotics first, then embedded intelligence, then the supporting software. Each record states the problem, the interfaces owned and the evidence.',
    listTitle: 'Records',
    indexLabel: 'Every record, including the archive',
  },
  {
    href: '/skills/',
    eyebrow: 'Expertise',
    intro:
      'Three specialist pillars, each linked to the evidence behind it, over a detailed capability atlas.',
    listTitle: 'Atlas domains',
    indexLabel: 'Browse the full atlas',
  },
] as const
