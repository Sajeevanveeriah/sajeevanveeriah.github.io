import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from '@/components/icons'
import type { Project } from '@/content/projects'

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
      <h2 id="boundary-heading">Evidence boundary</h2>
      <p>{text}</p>
    </section>
  )
}

export function RecordArticle({ project, position, total }: { readonly project: Project; readonly position: number; readonly total: number }) {
  const route = `/work/${project.slug}/`
  const pad = (value: number) => String(value).padStart(2, '0')

  return (
    <>
      <article className="record shell">
        <Link className="back-link" href="/#work"><ArrowLeft />Selected work</Link>
        <MetaStrip
          items={[
            { label: 'Record', value: `${pad(position)} of ${pad(total)}` },
            { label: 'Evidence class', value: project.evidence, accent: true },
            { label: 'Route', value: route, route: true },
          ]}
        />
        <header className="record-header">
          <h1>{project.title}</h1>
          <p>{project.system}</p>
        </header>
        <figure className="record-plate">
          <Image
            src={project.image.src}
            alt={project.image.alt}
            width={project.image.width}
            height={project.image.height}
            priority
            sizes="100vw"
          />
          <figcaption>{project.image.alt}</figcaption>
        </figure>
      </article>
      <div className="record-grid shell">
        <aside className="record-rail">
          <hr className="rule-accent" />
          <p className="kicker">Engineering boundary</p>
          <p>{project.ownership}</p>
          <p className="rail-label">Contribution</p>
          <ul className="tag-list">
            {project.stack.map((item) => <Tag key={item}>{item}</Tag>)}
          </ul>
        </aside>
        <div className="record-body">
          <section aria-labelledby="problem-heading"><h2 id="problem-heading">Problem</h2><p>{project.problem}</p></section>
          <section aria-labelledby="system-heading"><h2 id="system-heading">Engineered system</h2><p>{project.system}</p></section>
          <section aria-labelledby="decisions-heading">
            <h2 id="decisions-heading">Decisions</h2>
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
          <section aria-labelledby="outcome-heading"><h2 id="outcome-heading">Outcome</h2><p>{project.outcome}</p></section>
          <EvidenceBoundary text={project.boundary} />
        </div>
      </div>
    </>
  )
}
