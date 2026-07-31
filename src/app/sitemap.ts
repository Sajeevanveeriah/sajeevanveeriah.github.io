import type { MetadataRoute } from 'next'

/* Required under `output: 'export'`: without it Next treats this metadata
   route as dynamic and the build fails rather than emitting a static file. */
export const dynamic = 'force-static'
import { site } from '@/content/site'
import { discoverableProjects } from '@/content/projects'
import { atlas } from '@/content/atlas'
import { publishedEmployers } from '@/content/employers'
import { allPillars } from '@/content/ecosystem'
import { labs } from '@/content/lab'

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
    '/ecosystem/',
    '/lab/',
    '/now/',
    '/notes/',
    '/capability-matrix/',
    ...labs.map((l) => `/lab/${l.slug}/`),
    // Every ecosystem pillar is indexable: each is a substantial reference
    // page in its own right, and the index alone does not carry the records.
    ...allPillars.map((p) => `/ecosystem/${p.slug}/`),
    // Suppressed records and roles still build and still resolve at their own
    // URL, but are never advertised here.
    ...discoverableProjects.map((p) => `/work/${p.slug}/`),
    ...atlas.map((d) => `/atlas/${d.slug}/`),
    // Suppressed employers are absent from `publishedEmployers`, so a withheld
    // record can never be advertised in the sitemap.
    ...publishedEmployers.map((x) => `/employers/${x.slug}/`),
    // The `/about/[role]/` URLs are deliberately absent. They still resolve,
    // for anyone holding an old link, but every one of them now carries
    // `noindex`: six are signposts to the employer page that owns the
    // content, and the seventh is a suppressed record. A sitemap advertises
    // what should be indexed, and none of them should be.
  ]

  return routes.map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: path === '/' ? 'monthly' : 'yearly',
    priority: path === '/' ? 1 : 0.7,
  }))
}
