import type { Metadata } from 'next'
import { PageHeader } from '@/components/ui/PageHeader'
import { TierLegend } from '@/components/ui/TierIndicator'
import { WorkIndex } from '@/components/work/WorkIndex'
import { publishedProjects, projectDomains, projectDisciplines } from '@/content/projects'
import s from '@/components/ui/shared.module.css'

export const metadata: Metadata = {
  title: 'Work',
  description:
    'My proof-backed engineering records span software, robotics, automation, embedded sensing, IoT, AI/ML, vehicle validation and manufacturing, with each record carrying its honest evidence tier.',
  alternates: { canonical: '/work/' },
  openGraph: { title: 'Work', url: '/work/' },
}

export default function WorkPage() {
  return (
    <section className="section">
      <div className="wrap">
        <PageHeader
          kicker="01 / Work"
          title="My proof-backed work across the engineering stack."
          lede="I separate my professional delivery from university and personal work, including engineering tools, and give every record an honest evidence tier. Filter my work by domain, discipline or evidence."
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
