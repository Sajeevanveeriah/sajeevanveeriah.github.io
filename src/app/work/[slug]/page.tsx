import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Masthead } from '@/components/Masthead'
import { RecordArticle } from '@/components/RecordArticle'
import { SiteFooter } from '@/components/SiteFooter'
import { getProject, projects } from '@/content/projects'

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const project = getProject((await params).slug)
  if (!project) return {}
  return {
    title: project.title,
    description: project.system,
    alternates: { canonical: `/work/${project.slug}/` },
    openGraph: {
      title: project.title,
      description: project.system,
      images: [{ url: project.image.src, width: project.image.width, height: project.image.height, alt: project.image.alt }],
    },
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()
  const position = projects.findIndex((entry) => entry.slug === slug) + 1

  return (
    <>
      <Masthead current="work" />
      <main id="main">
        <RecordArticle project={project} position={position} total={projects.length} />
      </main>
      <SiteFooter />
    </>
  )
}
