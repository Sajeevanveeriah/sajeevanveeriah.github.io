import type { MetadataRoute } from 'next'
import { projects } from '@/content/projects'
import { publishedPosts } from '@/content/blog'
import { site } from '@/content/site'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = publishedPosts()
  const latestPost = posts[0]?.date ?? site.updated
  const latest = latestPost > site.updated ? latestPost : site.updated
  const entry = (path: string, lastModified: string) => ({ url: `${site.url}${path}`, lastModified })
  return [
    entry('/', latest),
    entry('/work/', site.updated),
    entry('/about/', site.updated),
    entry('/notes/', site.updated),
    entry('/blog/', latestPost),
    ...posts.map((post) => entry(`/blog/${post.slug}/`, post.date)),
    ...projects.map((project) => entry(`/work/${project.slug}/`, site.updated)),
  ]
}
