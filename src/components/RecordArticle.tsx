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

function EvidenceBoundary({ text }: { readonly text: string }) {
  return (
    <section className="boundary" aria-labelledby="boundary-heading">
      <h2 id="boundary-heading">Scope and limitations</h2>
      <p>{text}</p>
    </section>
  )
}

export function RecordArticle({ project, nextProject, position, total }: { readonly project: Project; readonly nextProject: Project; readonly position: number; readonly total: number }) {
  const pad = (value: number) => String(value).padStart(2, '0')

  return (
    <>
      <article className="record shell">
        <Link className="back-link" href="/work/"><ArrowLeft />Selected work</Link>
        <MetaStrip
          items={[
            { label: 'Record', value: `${pad(position)} of ${pad(total)}` },
            { label: 'Evidence class', value: project.evidence, accent: true },
            { label: 'Status', value: project.readiness },
          ]}
        />
        <header className="record-header">
          <h1>{project.title}</h1>
          <p>{project.system}</p>
        </header>
        {project.image ? (
          <ProjectMedia image={project.image} priority/>
        ) : <SystemEvidence eyebrow="Verified system path" title={project.title} steps={project.systemPath} />}
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
          <section aria-labelledby="system-heading"><h2 id="system-heading">System boundary</h2><p>{project.system}</p></section>
          <section aria-labelledby="architecture-heading"><h2 id="architecture-heading">Architecture</h2><p>{project.architecture}</p></section>
          <section aria-labelledby="decisions-heading">
            <h2 id="decisions-heading">Constraints and decisions</h2>
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
          <section aria-labelledby="readiness-heading"><h2 id="readiness-heading">Current readiness</h2><p>{project.readiness}</p></section>
          <EvidenceBoundary text={project.boundary} />
        </div>
      </div>
      <section className="record-actions" aria-labelledby="record-actions-title">
        <div className="shell">
          <h2 id="record-actions-title">Continue the conversation.</h2>
          <p>Discuss this work, compare it with your engineering brief, or continue to the next evidence record.</p>
          <div>
            <a href={`mailto:${site.email}`}>Email Saj <span aria-hidden="true">→</span></a>
            <a href={resumeFiles.pdf} download>Resume PDF <span aria-hidden="true">→</span></a>
            <a href={resumeFiles.docx} download>Resume DOCX <span aria-hidden="true">→</span></a>
            <Link href={`/work/${nextProject.slug}/`} data-next-project>Next: {nextProject.title} <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>
    </>
  )
}
