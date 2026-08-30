import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Masthead } from '@/components/Masthead'
import { RecordArticle } from '@/components/RecordArticle'
import { SiteFooter } from '@/components/SiteFooter'
import { featuredProjects, getProject, projects } from '@/content/projects'

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const project = getProject((await params).slug)
  if (!project) return {}
  const image = project.image ?? {
    src: '/assets/image/20260827-Sajeevan-Veeriah-Portfolio-OG-Rev00.png',
    width: 1200,
    height: 630,
    alt: `${project.title} engineering record by Sajeevan Veeriah.`,
  }
  return {
    title: project.title,
    description: project.system,
    alternates: { canonical: `/work/${project.slug}/` },
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
  const position = featuredProjects.findIndex((entry) => entry.slug === slug) + 1
  const nextProject = featuredProjects[position % featuredProjects.length] ?? featuredProjects[0]

  return (
    <>
      <Masthead current="work" />
      <main id="main">
        <RecordArticle project={project} nextProject={nextProject} position={position} total={featuredProjects.length} />
      </main>
      <SiteFooter />
    </>
  )
}
