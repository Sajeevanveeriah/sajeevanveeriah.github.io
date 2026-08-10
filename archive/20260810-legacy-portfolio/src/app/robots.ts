import type { MetadataRoute } from 'next'

/* Required under `output: 'export'`: without it Next treats this metadata
   route as dynamic and the build fails rather than emitting a static file. */
export const dynamic = 'force-static'
import { site } from '@/content/site'

/** Emitted as out/robots.txt by the export. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${site.url}/sitemap.xml`,
  }
}
