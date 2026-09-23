import { site } from '@/content/site'
import { defaultShareImage } from '@/content/seo'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Masthead } from '@/components/Masthead'
import { RecordArticle } from '@/components/RecordArticle'
import { SiteFooter } from '@/components/SiteFooter'
import { featuredProjects, getProject, projects } from '@/content/projects'

export const dynamicParams = false

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const project = getProject((await params).slug)
  if (!project) return {}
  const image = project.image && !/\.(svg|avif)$/i.test(project.image.src) ? project.image : {
    ...defaultShareImage,
    src: defaultShareImage.url,
    alt: `${project.title} engineering record by Sajeevan Veeriah.`,
  }
  return {
    title: project.title,
    description: project.system,
    alternates: { canonical: `/work/${project.slug}/` },
    twitter: { card: 'summary_large_image', title: project.title, description: project.system, images: [image.src] },
    openGraph: {
      type: 'article',
      url: `/work/${project.slug}/`,
      title: project.title,
      description: project.system,
      images: [{ url: image.src, width: image.width, height: image.height, alt: image.alt }],
    },
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()
  const index = featuredProjects.findIndex((entry) => entry.slug === slug)
  const total = featuredProjects.length
  const previous = featuredProjects[(index + total - 1) % total] ?? featuredProjects[0]
  const next = featuredProjects[(index + 1) % total] ?? featuredProjects[0]

  return (
    <>
      <Masthead current="work" />
      <main id="main">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'CreativeWork',
          '@id': `${site.url}/work/${project.slug}/#project`,
          url: `${site.url}/work/${project.slug}/`, name: project.title,
          description: project.system, inLanguage: 'en-AU',
          author: { '@type': 'Person', '@id': `${site.url}/#person`, name: site.name, url: site.url },
          ...(project.image ? { image: `${site.url}${project.image.src}` } : {}),
        }).replace(/</g, '\\u003c') }} />
        <RecordArticle project={project} previous={previous} next={next} position={index + 1} total={total} />
      </main>
      <SiteFooter />
    </>
  )
}
