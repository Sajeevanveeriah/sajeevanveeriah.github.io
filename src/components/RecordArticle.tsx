import Link from 'next/link'
import { ProjectMedia } from './ProjectMedia'
import { ArrowLeft } from '@/components/icons'
import { SystemEvidence } from '@/components/SystemEvidence'
import type { Project } from '@/content/projects'

const pad = (value: number) => String(value).padStart(2, '0')

export function RecordArticle({ project, previous, next, position, total }: { readonly project: Project; readonly previous: Project; readonly next: Project; readonly position: number; readonly total: number }) {
  return (
    <>
      <article className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link prefetch={false} href="/work/"><ArrowLeft />All work</Link>
        </nav>
        <header className="record-head">
          <p className="eyebrow">{project.category}</p>
          <h1>{project.title}</h1>
          <p>{project.system}</p>
          <p className="record-meta"><span>Case study <strong>{position} of {total}</strong></span></p>
        </header>
        {project.image ? (
          <ProjectMedia image={project.image} priority />
        ) : <SystemEvidence eyebrow="System architecture" title={project.title} steps={project.systemPath} />}
        <div className="record-grid">
          <aside className="record-rail" aria-label="Contribution and technology">
            <h2>My contribution</h2>
            <p>{project.ownership}</p>
            <h2>Technology</h2>
            <ul className="chips">{project.stack.map((item) => <li className="chip" key={item}>{item}</li>)}</ul>
          </aside>
          <div className="record-body">
            <section aria-labelledby="problem-heading"><h2 id="problem-heading">Problem</h2><p>{project.problem}</p></section>
            <section aria-labelledby="architecture-heading"><h2 id="architecture-heading">Architecture</h2><p>{project.architecture}</p></section>
            <section aria-labelledby="decisions-heading">
              <h2 id="decisions-heading">Design decisions</h2>
              <ol className="decisions">
                {project.decisions.map((decision, index) => (
                  <li key={decision}><span className="decision-index" aria-hidden="true">{pad(index + 1)}</span><span>{decision}</span></li>
                ))}
              </ol>
            </section>
            <section aria-labelledby="verification-heading"><h2 id="verification-heading">Verification</h2><p>{project.verification}</p></section>
            {project.publication && <section aria-labelledby="publication-heading">
              <h2 id="publication-heading">Research publication</h2>
              <p><a className="text-link" href={project.publication.url}>{project.publication.label}</a></p>
            </section>}
            {project.caseStudy && <section aria-labelledby="case-study-heading">
              <h2 id="case-study-heading">Engineering case study</h2>
              <p>Read the design rationale, verification scope and proposed next experiments.</p>
              <Link prefetch={false} className="text-link" href={project.caseStudy}>Read the {project.title} case study</Link>
            </section>}
            {project.trials && <section aria-labelledby="trials-heading">
              <h2 id="trials-heading">Development and testing</h2>
              <dl className="project-trials">
                {project.trials.map((trial) => <div key={trial.area}><dt>{trial.area}</dt><dd><p>{trial.result}</p></dd></div>)}
              </dl>
            </section>}
          </div>
        </div>
      </article>
      <nav className="container record-nav" aria-label="More case studies">
        <Link prefetch={false} href={`/work/${previous.slug}/`}><span>Previous case study</span><strong>{previous.title}</strong></Link>
        <Link prefetch={false} href={`/work/${next.slug}/`} data-next-project><span>Next case study</span><strong>{next.title}</strong></Link>
      </nav>
    </>
  )
}
