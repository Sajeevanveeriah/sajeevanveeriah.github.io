import type { MetadataRoute } from 'next'
import { projects } from '@/content/projects'
import { posts } from '@/content/blog'
import { site } from '@/content/site'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '/',
    '/work/', '/about/', '/notes/', '/blog/',
    ...posts.map((post) => `/blog/${post.slug}/`),
    ...projects.map((project) => `/work/${project.slug}/`),
  ]
  return routes.map((path) => {
    const post = posts.find((entry) => path === `/blog/${entry.slug}/`)
    return {
      url: `${site.url}${path}`,
      ...(post ? { lastModified: post.date } : {}),
    }
  })
}
