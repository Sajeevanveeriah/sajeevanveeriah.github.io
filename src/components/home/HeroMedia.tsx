'use client'

import { useEffect, useRef, useState } from 'react'
import type { Project } from '@/content/projects'
import { ProjectImage } from '@/components/ui/ProjectImage'
import styles from './HeroMedia.module.css'

export function HeroMedia({ projects }: { projects: readonly Project[] }) {
  const [active, setActive] = useState(0)
  const [visible, setVisible] = useState(false)
  const [documentVisible, setDocumentVisible] = useState(true)
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry?.isIntersecting ?? false), { threshold: 0.25 })
    const node = root.current
    if (node) observer.observe(node)
    const onVisibility = () => setDocumentVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!visible || !documentVisible || reduce || projects.length < 2) return
    const timer = window.setInterval(() => setActive((value) => (value + 1) % projects.length), 4200)
    return () => window.clearInterval(timer)
  }, [documentVisible, projects.length, visible])

  return (
    <figure className={styles.figure} ref={root}>
      <div className={styles.viewport}>
        {projects.map((project, index) => project.images?.[0] ? (
          <div className={styles.frame} data-active={index === active} aria-hidden={index !== active} key={project.slug}>
            <ProjectImage image={project.images[0]} priority={index === 0} />
          </div>
        ) : null)}
        <div className={styles.caption} aria-live="polite">
          <span>{String(active + 1).padStart(2, '0')}</span>
          <strong>{projects[active]?.title}</strong>
        </div>
      </div>
      <div className={styles.controls} aria-label="Choose engineering project visual">
        {projects.map((project, index) => (
          <button key={project.slug} type="button" aria-label={`Show ${project.title}`} aria-pressed={index === active} onClick={() => setActive(index)}><span /></button>
        ))}
      </div>
    </figure>
  )
}
