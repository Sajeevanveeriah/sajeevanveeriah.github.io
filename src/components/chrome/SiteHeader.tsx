import { navigation, navPanels, site } from '@/content/site'
import { discoverableProjects } from '@/content/projects'
import { atlas } from '@/content/atlas'
import { discoverableExperience } from '@/content/experience'
import { labs } from '@/content/lab'
import { SiteNav, type NavGroup } from './SiteNav'
import { CommandPalette, type PaletteEntry } from './CommandPalette'

/**
 * The header shell is a server component on purpose.
 *
 * The mega-menu lists every work record, every atlas domain and every role.
 * Deriving those lists inside the client nav would pull `projects.ts`,
 * `atlas.ts` and `experience.ts` into the browser bundle: tens of kilobytes
 * of prose to render about forty short links. Building them here reduces what
 * crosses the boundary to a label and an href per entry, and the panel markup
 * ships in the static HTML either way.
 *
 * The lists are derived rather than authored, so a panel cannot drift out of
 * step with the pages it points at when a record or a domain is added.
 */
function linksFor(href: string): readonly { label: string; href: string }[] {
  switch (href) {
    case '/work/':
      return discoverableProjects.map((p) => ({ label: p.title, href: `/work/${p.slug}/` }))
    case '/skills/':
      return atlas.map((d) => ({ label: d.name, href: `/atlas/${d.slug}/` }))
    case '/employers/':
      // Points at the employer pages, not at the old role URLs. Those still
      // resolve, but they are signposts now and nothing should route a reader
      // through one.
      return discoverableExperience.map((r) => ({
        label: `${r.company}, ${r.title}`,
        href: `/employers/${r.slug}/`,
      }))
    default:
      return []
  }
}

export function SiteHeader() {
  const groups: NavGroup[] = navigation.map((item) => {
    const copy = navPanels.find((p) => p.href === item.href)
    const links = copy ? linksFor(item.href) : []
    return {
      label: item.label,
      href: item.href,
      // A nav item only becomes a disclosure if it actually owns sub-pages.
      // Contact has none, so it stays a plain link rather than a button that
      // opens an empty panel.
      panel:
        copy && links.length > 0
          ? {
              eyebrow: copy.eyebrow,
              intro: copy.intro,
              listTitle: copy.listTitle,
              indexLabel: copy.indexLabel,
              links: [...links],
            }
          : null,
    }
  })

  /* The palette index is derived from the same content modules the pages
     render from, so it can never list a page that does not exist. Only a
     label and an href per entry cross the client boundary. */
  const paletteEntries: PaletteEntry[] = [
    { group: 'Pages', label: 'Home', href: '/' },
    ...navigation.map((n) => ({ group: 'Pages', label: n.label, href: n.href })),
    { group: 'Pages', label: 'Engineering Atlas', href: '/atlas/' },
    { group: 'Pages', label: 'Versatility', href: '/versatility/' },
    { group: 'Pages', label: 'Now', href: '/now/' },
    { group: 'Pages', label: 'Field notes', href: '/notes/' },
    { group: 'Pages', label: 'Capability matrix', href: '/capability-matrix/' },
    ...discoverableProjects.map((p) => ({
      group: 'Work records',
      label: p.title,
      href: `/work/${p.slug}/`,
    })),
    ...atlas.map((d) => ({ group: 'Atlas domains', label: d.name, href: `/atlas/${d.slug}/` })),
    ...discoverableExperience.map((r) => ({
      group: 'Employers',
      label: `${r.company}, ${r.title}`,
      href: `/employers/${r.slug}/`,
    })),
    ...labs.map((l) => ({ group: 'Concept labs', label: l.title, href: `/lab/${l.slug}/` })),
  ]

  return (
    <SiteNav
      groups={groups}
      siteName={site.name}
      resumePath={site.resumePath}
      search={<CommandPalette entries={paletteEntries} />}
    />
  )
}
