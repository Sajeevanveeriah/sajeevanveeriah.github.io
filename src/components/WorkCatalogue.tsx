'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { projects, projectIndex, type Project } from '@/content/projects'
import { getIndexedProjectMedia, getProjectMedia } from '@/content/media'
import { ProjectCard } from './ProjectCard'
import { PictureMedia } from './PictureMedia'
import { ProjectDossierDrawer, type DossierEntry } from './ProjectDossierDrawer'

const categories = ['All', 'Robotics', 'Embedded', 'Software', 'Industrial'] as const
const groupCategory = ['Robotics', 'Software', 'Industrial'] as const
const others = projectIndex.flatMap((g, i) =>
  g.items.map((p) => ({
    ...p,
    group: g.group,
    category: (groupCategory[i] ?? 'Industrial') as 'Robotics' | 'Software' | 'Industrial',
  })),
)

function matches(category: string, query: string, entry: { title: string; category: string; text: string }) {
  const q = query.trim().toLowerCase()
  return (category === 'All' || entry.category === category) && (!q || `${entry.title} ${entry.text}`.toLowerCase().includes(q))
}

export function WorkCatalogue() {
  const [category, setCategory] = useState<string>('All')
  const [query, setQuery] = useState('')
  const [activeDossier, setActiveDossier] = useState<DossierEntry | null>(null)

  useEffect(() => {
    const sync = () => {
      const p = new URLSearchParams(location.search)
      const c = p.get('category') || 'All'
      setCategory((categories as readonly string[]).includes(c) ? c : 'All')
      setQuery(p.get('q') || '')
    }
    sync()
    addEventListener('popstate', sync)
    addEventListener('sv-url-change', sync)
    return () => {
      removeEventListener('popstate', sync)
      removeEventListener('sv-url-change', sync)
    }
  }, [])

  function update(c: string, q: string) {
    setCategory(c)
    setQuery(q)
    const url = new URL(location.href)
    if (c === 'All') url.searchParams.delete('category')
    else url.searchParams.set('category', c)
    if (q) url.searchParams.set('q', q)
    else url.searchParams.delete('q')
    history.replaceState(null, '', url)
  }

  const caseStudies = projects.filter((p: Project) =>
    matches(category, query, { title: p.title, category: p.category, text: `${p.proof} ${p.system} ${p.stack.join(' ')}` }),
  )
  const more = others.filter((p) => matches(category, query, { title: p.title, category: p.category, text: p.summary }))
  const total = caseStudies.length + more.length

  function openProjectDossier(p: Project) {
    const media = getProjectMedia(p.slug)
    setActiveDossier({
      id: p.slug,
      kind: 'case-study',
      title: p.title,
      category: p.category,
      status: p.status,
      summary: p.proof,
      media: media.image,
      video: media.video,
      href: `/work/${p.slug}/`,
      project: p,
    })
  }

  function openIndexedDossier(item: (typeof others)[number]) {
    setActiveDossier({
      id: item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      kind: 'indexed',
      title: item.title,
      category: item.category,
      status: item.group,
      summary: item.summary,
      media: getIndexedProjectMedia(item.title),
      href: item.href ?? `/work/?q=${encodeURIComponent(item.title)}`,
    })
  }

  return (
    <>
      <div className="filters catalogue-controls">
        <div className="segmented" role="group" aria-label="Project category">
          {categories.map((c) => (
            <button type="button" key={c} aria-pressed={category === c} onClick={() => update(c, query)}>
              {c}
            </button>
          ))}
        </div>
        <label className="search">
          <span className="sr-only">Search projects</span>
          <input
            className="field"
            type="search"
            value={query}
            onChange={(e) => update(category, e.target.value)}
            placeholder="Search projects, tools or disciplines"
          />
        </label>
        <button type="button" className="reset" onClick={() => update('All', '')}>
          Reset
        </button>
      </div>
      <p className="result-count" role="status">
        {total} {total === 1 ? 'project' : 'projects'}
      </p>
      {caseStudies.length > 0 && (
        <section className="catalogue-group" aria-labelledby="case-studies-title">
          <h2 id="case-studies-title">Case studies</h2>
          <div className="card-grid">
            {caseStudies.map((p) => (
              <ProjectCard key={p.slug} project={p} onInspect={() => openProjectDossier(p)} />
            ))}
          </div>
        </section>
      )}
      {more.length > 0 && (
        <section className="catalogue-group" aria-labelledby="more-title">
          <h2 id="more-title">More projects and delivery</h2>
          <ul className="project-list with-figures">
            {more.map((p) => (
              <li key={p.title} data-project={p.title}>
                <div className="list-fig media-frame">
                  <PictureMedia media={getIndexedProjectMedia(p.title)} />
                </div>
                <span className="card-kicker">{p.category}</span>
                <h3>{p.href ? <Link href={p.href} prefetch={false}>{p.title}</Link> : p.title}</h3>
                <p>{p.summary}</p>
                <div className="card-actions js-only">
                  <button type="button" className="btn btn-secondary btn-small" onClick={() => openIndexedDossier(p)}>
                    Inspect dossier
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
      {!total && (
        <div className="empty-state">
          <h2>No matching projects</h2>
          <p>Try another search, or reset the filters to see every project.</p>
          <button type="button" onClick={() => update('All', '')}>
            Show all projects
          </button>
        </div>
      )}
      <p className="catalogue-note">
        Looking for writing about these projects?{' '}
        <Link prefetch={false} href="/blog/?topic=Case%20studies">
          Read the case-study articles
        </Link>
        .
      </p>
      <ProjectDossierDrawer entry={activeDossier} onClose={() => setActiveDossier(null)} />
    </>
  )
}
