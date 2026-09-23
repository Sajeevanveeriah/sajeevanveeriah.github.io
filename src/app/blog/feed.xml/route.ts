import { publishedPosts } from '@/content/blog'
import { site } from '@/content/site'

export const dynamic = 'force-static'

const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export function GET() {
  const posts = publishedPosts()
  const items = posts.map((post) => {
    const url = `${site.url}/blog/${post.slug}/`
    return `    <item>
      <title>${escape(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate>
      <description>${escape(post.description)}</description>
    </item>`
  }).join('\n')
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(site.name)} - Journal</title>
    <link>${site.url}/blog/</link>
    <atom:link href="${site.url}/blog/feed.xml" rel="self" type="application/rss+xml" />
    <description>Practical writing on robotics, embedded systems, AI and software.</description>
    <language>en-AU</language>
    <lastBuildDate>${new Date(`${posts[0]?.date ?? site.updated}T00:00:00Z`).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`
  return new Response(body, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}
