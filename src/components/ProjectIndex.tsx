import { ArrowUpRight } from '@/components/icons'
import { projectIndex } from '@/content/projects'

/**
 * The complete project index beyond the three flagship records: one compact,
 * grouped column per discipline. Entries are one-line summaries with an
 * evidence label; only projects with a public repository link out.
 */
export function ProjectIndex({ headingId }: { readonly headingId: string }) {
  const total = projectIndex.reduce((count, group) => count + group.items.length, 0)

  return (
    <div className="further-projects" aria-labelledby={headingId}>
      <div className="further-heading">
        <p className="eyebrow">Complete project index</p>
        <h3 id={headingId}>{total} further engineering projects.</h3>
        <p>Carried over from the full portfolio record, each with its evidence class. The three flagship records above carry the deep case studies.</p>
      </div>
      <div className="index-groups">
        {projectIndex.map((group) => (
          <section key={group.group} aria-label={group.group}>
            <h4>{group.group}</h4>
            <ul>
              {group.items.map((item) => (
                <li key={item.title}>
                  <p className="further-title">
                    {item.link ? <a href={item.link}>{item.title}<ArrowUpRight size={13} /></a> : item.title}
                  </p>
                  <p className="further-evidence">{item.evidence}</p>
                  <p className="further-summary">{item.summary}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
