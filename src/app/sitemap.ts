import type { MetadataRoute } from 'next'
import { projects } from '@/content/projects'
import { site } from '@/content/site'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '/',
    '/work/',
    ...projects.map((project) => `/work/${project.slug}/`),
    '/open-industrial-automation/',
    '/open-industrial-automation/demo/',
    '/open-industrial-automation/studio/',
  ]
  return routes.map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: path === '/' ? 'monthly' : 'yearly',
    priority: path === '/' ? 1 : 0.75,
  }))
}
