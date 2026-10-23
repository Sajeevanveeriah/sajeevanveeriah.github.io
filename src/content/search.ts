import { projects, projectIndex } from './projects'
import { publishedPosts, postTopic } from './blog'
import { areas } from './services'

export interface SearchEntry {
  readonly title: string
  readonly href: string
  readonly kind: 'Page' | 'Case study' | 'Project' | 'Journal' | 'Service'
  readonly text: string
}

const clip = (value: string, max = 150) => (value.length > max ? `${value.slice(0, max - 3).trimEnd()}...` : value)

/** One small index for the header search, built at export time from the same content as the pages. */
export const searchIndex: readonly SearchEntry[] = [
  { title: 'Home', href: '/', kind: 'Page', text: 'Overview, featured project, career and contact' },
  { title: 'Work', href: '/work/', kind: 'Page', text: 'Every project with filters and search' },
  { title: 'Services and rates', href: '/services/', kind: 'Page', text: 'Voltwyn service areas, Define phase and rate basis' },
  { title: 'About', href: '/about/', kind: 'Page', text: 'Career timeline, education, community and life beyond work' },
  { title: 'Journal', href: '/blog/', kind: 'Page', text: 'Articles on robotics, embedded systems, AI and software' },
  { title: 'Robotics learning roadmap', href: '/notes/', kind: 'Page', text: 'Six-month pathway with builds and resources' },
  { title: 'Contact', href: '/#contact', kind: 'Page', text: 'Send a message about a role, project or collaboration' },
  ...projects.map((p) => ({ title: p.title, href: `/work/${p.slug}/`, kind: 'Case study' as const, text: clip(`${p.category}. ${p.proof} ${p.stack.join(', ')}`) })),
  ...projectIndex.flatMap((g) => g.items.map((p) => ({ title: p.title, href: p.href ?? `/work/?q=${encodeURIComponent(p.title)}`, kind: 'Project' as const, text: clip(p.summary) }))),
  ...areas.map((a) => ({ title: a.title, href: `/services/#${a.id}`, kind: 'Service' as const, text: clip(a.scope) })),
  ...publishedPosts().map((post) => ({ title: post.title, href: `/blog/${post.slug}/`, kind: 'Journal' as const, text: clip(`${postTopic(post)}. ${post.description}`) })),
]
