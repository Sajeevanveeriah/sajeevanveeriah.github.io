import type { MetadataRoute } from 'next'

/* Required under `output: 'export'`: without it Next treats this metadata
   route as dynamic and the build fails rather than emitting a static file. */
export const dynamic = 'force-static'
import { site } from '@/content/site'
import { discoverableProjects } from '@/content/projects'
import { atlas } from '@/content/atlas'
import { discoverableExperience } from '@/content/experience'
import { publishedEmployers } from '@/content/employers'

/**
 * Static sitemap, emitted as out/sitemap.xml by the export. Covers every
 * generated route, including all dynamic detail pages.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '/',
    '/work/',
    '/atlas/',
    '/about/',
    '/skills/',
    '/contact/',
    '/employers/',
    '/versatility/',
    // Suppressed records and roles still build and still resolve at their own
    // URL, but are never advertised here.
    ...discoverableProjects.map((p) => `/work/${p.slug}/`),
    ...atlas.map((d) => `/atlas/${d.slug}/`),
    ...discoverableExperience.map((r) => `/about/${r.slug}/`),
    // Draft employers are absent from `publishedEmployers`, so an unrouted
    // record can never be advertised in the sitemap.
    ...publishedEmployers.map((x) => `/employers/${x.slug}/`),
  ]

  return routes.map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: path === '/' ? 'monthly' : 'yearly',
    priority: path === '/' ? 1 : 0.7,
  }))
}
