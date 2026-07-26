/**
 * Site-level facts and SEO defaults.
 *
 * Every value here is transcribed verbatim from the previous index.html.
 * Nothing is inferred. The contact model is binding and closed: exactly
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

export const site: SiteConfig = {
  name: 'Sajeevan Veeriah',
  shortName: 'Saj',
  initials: 'SV',
  // Verbatim from index.html:164
  jobTitle: 'Mechatronics, Robotics, Automation and AI/ML Engineer',
  // Verbatim from index.html:1523
  tagline:
    'I work across mechatronics, robotics, automation and AI/ML, connecting physical systems, controls, embedded engineering, software and validation.',
  // Verbatim from index.html:9
  description:
    'I am a mechatronics, robotics, automation and AI/ML engineer working across physical systems, embedded electronics, controls, CAN telemetry, Linux integration and field validation.',
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

/** Primary navigation across the nine routes. */
export interface NavItem {
  readonly label: string
  readonly href: string
}

export const navigation: readonly NavItem[] = [
  { label: 'Work', href: '/work/' },
  { label: 'Atlas', href: '/atlas/' },
  { label: 'Skills', href: '/skills/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
] as const
