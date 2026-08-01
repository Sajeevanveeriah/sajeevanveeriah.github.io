import { navigation, navPanels, site } from '@/content/site'
import { discoverableProjects } from '@/content/projects'
import { atlas } from '@/content/atlas'
import { discoverableExperience } from '@/content/experience'
import { SiteNav, type NavGroup } from './SiteNav'

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

  // The brand role is passed in rather than written in the nav component, for
  // the same reason every other string is: no copy is hard-coded in a
  // component, and the identity has exactly one source.
  return (
    <SiteNav
      groups={groups}
      siteName={site.name}
      siteRole={site.jobTitle}
      resumePath={site.resumePath}
    />
  )
}
