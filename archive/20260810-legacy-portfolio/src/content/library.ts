/**
 * Engineering Reference Library: the framing for the ecosystem catalogue.
 *
 * The catalogue itself is unchanged, and so is its route. What changed on the
 * 6 August 2026 repositioning is what it is called and where it sits: it is a
 * map of the field, not a list of things Saj has used, and presenting 240
 * entities beside the work made the site read as a catalogue of everything.
 *
 * The disclaimer is not decoration. It is the line that keeps the whole
 * library honest, so it renders on the index, on every pillar page and
 * wherever the library is linked from a capability page.
 */
export const ecosystemLibrary = {
  name: 'Engineering Reference Library',
  path: '/ecosystem/',
  kicker: 'Reference library',
  title: 'Engineering Reference Library',
  lede: 'A reference map of technologies, platforms and selection considerations across the engineering field, kept separate from the work.',
  disclaimer:
    'This reference library maps technologies and selection considerations. It does not claim hands-on project use unless a case study says so.',
  /**
   * The capability the library is actually evidence of. Naming a platform is
   * not experience; choosing between them against real constraints is the
   * engineering, and that is what this says.
   */
  selectionNote:
    'The capability this supports is selection: choosing between a microcontroller, a single-board computer, an edge-AI module and an industrial controller against timing, I/O, compute, power, thermals, environment, safety, lifecycle, supply, serviceability and cost.',
  /** Where project-proven technology is claimed instead. */
  provenLink: {
    label: 'Project-proven capability sits on Expertise',
    href: '/skills/',
  },
} as const
