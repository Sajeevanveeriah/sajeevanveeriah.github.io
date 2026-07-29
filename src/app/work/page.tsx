import type { Metadata } from 'next'
import { PageHeader } from '@/components/ui/PageHeader'
import { TierLegend } from '@/components/ui/TierIndicator'
import { WorkIndex } from '@/components/work/WorkIndex'
import { publishedProjects, projectDomains, projectDisciplines } from '@/content/projects'
import s from '@/components/ui/shared.module.css'

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Selected engineering work across robotics, embedded sensing, intelligent automation, software and validation, with an honest evidence tier for every record.',
  alternates: { canonical: '/work/' },
  openGraph: { title: 'Work', url: '/work/' },
}

export default function WorkPage() {
  return (
    <section className="section">
      <div className="wrap">
        <PageHeader
          kicker="Work"
          title="Systems built, integrated and validated."
          lede="Start with four selected engineering stories, then use the compact archive to inspect professional, university and personal evidence."
        >
          <div className={s.railBlock}>
            <TierLegend compact />
          </div>
        </PageHeader>
        <WorkIndex
          projects={publishedProjects}
          domains={projectDomains}
          disciplines={projectDisciplines}
        />
      </div>
    </section>
  )
}
