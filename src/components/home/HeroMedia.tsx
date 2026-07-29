import type { Project } from '@/content/projects'
import { ProjectImage } from '@/components/ui/ProjectImage'
import styles from './HeroMedia.module.css'

export function HeroMedia({ projects }: { projects: readonly Project[] }) {
  const project = projects.find((item) => item.slug === 'autonomous-navigation-rover') ?? projects[0]
  if (!project?.images?.[0]) return null

  return (
    <figure className={styles.figure} data-motion="hero-composition">
      <div className={styles.viewport}>
        <div className={styles.frame} data-active="true">
          <ProjectImage image={project.images[0]} priority />
        </div>
        <div className={styles.caption}>
          <strong>{project.title}</strong>
          <span>Perception, estimation, planning and control in one verified system.</span>
        </div>
      </div>
    </figure>
  )
}
