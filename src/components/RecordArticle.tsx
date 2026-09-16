import {ProjectMedia} from './ProjectMedia'
import Link from 'next/link'
import { ArrowLeft } from '@/components/icons'
import { SystemEvidence } from '@/components/SystemEvidence'
import type { Project } from '@/content/projects'
import { resumeFiles } from '@/content/resume'
import { site } from '@/content/site'

function MetaStrip({ items }: { readonly items: readonly { readonly label: string; readonly value: string; readonly accent?: boolean; readonly route?: boolean }[] }) {
  return (
    <div className="meta-strip">
      {items.map((item) => (
        <div key={item.label}>
          <p className="meta-label">{item.label}</p>
          <p className={item.route ? 'meta-route' : `meta-value${item.accent ? ' accent' : ''}`}>{item.value}</p>
        </div>
      ))}
    </div>
  )
}

function Tag({ children }: { readonly children: React.ReactNode }) {
  return <li className="tag">{children}</li>
}

export function RecordArticle({ project, nextProject, position, total }: { readonly project: Project; readonly nextProject: Project; readonly position: number; readonly total: number }) {
  const pad = (value: number) => String(value).padStart(2, '0')

  return (
    <>
      <article className="record shell">
        <Link prefetch={false} className="back-link" href="/work/"><ArrowLeft />Selected work</Link>
        <MetaStrip
          items={[
            { label: 'Project', value: `${pad(position)} of ${pad(total)}` },
            { label: 'Discipline', value: project.category, accent: true },
          ]}
        />
        <header className="record-header">
          <h1>{project.title}</h1>
          <p>{project.system}</p>
        </header>
        {project.image ? (
          <ProjectMedia image={project.image} priority/>
        ) : <SystemEvidence eyebrow="System architecture" title={project.title} steps={project.systemPath} />}
      </article>
      <div className="record-grid shell">
        <aside className="record-rail">
          <hr className="rule-accent" />
          <p className="kicker">My contribution</p>
          <p>{project.ownership}</p>
          <p className="rail-label">Technology</p>
          <ul className="tag-list">
            {project.stack.map((item) => <Tag key={item}>{item}</Tag>)}
          </ul>
        </aside>
        <div className="record-body">
          <section aria-labelledby="problem-heading"><h2 id="problem-heading">Problem</h2><p>{project.problem}</p></section>
          <section aria-labelledby="architecture-heading"><h2 id="architecture-heading">Architecture</h2><p>{project.architecture}</p></section>
          <section aria-labelledby="decisions-heading">
            <h2 id="decisions-heading">Design decisions</h2>
            <ol className="decisions">
              {project.decisions.map((decision, index) => (
                <li key={decision}>
                  <span className="decision-index" aria-hidden="true">{pad(index + 1)}</span>
                  <span>{decision}</span>
                </li>
              ))}
            </ol>
          </section>
          <section aria-labelledby="verification-heading"><h2 id="verification-heading">Verification</h2><p>{project.verification}</p></section>
          {project.trials && <section aria-labelledby="trials-heading">
            <h2 id="trials-heading">Development and testing</h2>
            <dl className="project-trials">
              {project.trials.map((trial) => <div key={trial.area}>
                <dt>{trial.area}</dt>
                <dd><p>{trial.result}</p></dd>
              </div>)}
            </dl>
          </section>}
        </div>
      </div>
      <section className="record-actions" aria-labelledby="record-actions-title">
        <div className="shell">
          <h2 id="record-actions-title">Continue the conversation.</h2>
          <p>Have a related engineering problem? Get in touch or explore another project.</p>
          <div>
            <a href={`mailto:${site.email}`}>Email Saj <span aria-hidden="true">→</span></a>
            <a href={resumeFiles.pdf} download>Resume PDF <span aria-hidden="true">→</span></a>
            <Link prefetch={false} href={`/work/${nextProject.slug}/`} data-next-project>Next: {nextProject.title} <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>
    </>
  )
}
