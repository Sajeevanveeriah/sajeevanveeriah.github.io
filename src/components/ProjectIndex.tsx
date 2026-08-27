import Image from 'next/image'
import { projectIndex } from '@/content/projects'

/**
 * The complete project index beyond the three flagship records: one stacked
 * band per discipline. Authentic interface captures and system diagrams
 * appear where the source record supports them. Text-only entries avoid
 * implying evidence that the portfolio does not hold.
 */
export function ProjectIndex({ headingId }: { readonly headingId: string }) {
  const total = projectIndex.reduce((count, group) => count + group.items.length, 0)

  return (
    <div className="further-projects" aria-labelledby={headingId}>
      <div className="further-heading">
        <p className="eyebrow">Complete project index</p>
        <h3 id={headingId}>{total} further engineering projects.</h3>
        <p>A broader record of robotics, software, industrial and automotive delivery. Visuals appear only where an authentic interface capture or system diagram is available.</p>
      </div>
      <div className="index-groups">
        {projectIndex.map((group, groupIndex) => (
          <section className="index-group" key={group.group} aria-labelledby={`${headingId}-group-${groupIndex + 1}`}>
            <div className="index-group-heading">
              <p aria-hidden="true">{String(groupIndex + 1).padStart(2, '0')}</p>
              <h4 id={`${headingId}-group-${groupIndex + 1}`}>{group.group}</h4>
              <span>{group.items.length} records</span>
            </div>
            <ul className="index-group-list">
              {group.items.map((item, itemIndex) => (
                <li className={item.image ? 'index-project index-project-visual' : 'index-project'} key={item.title}>
                  <div className="further-copy">
                    <span className="further-number" aria-hidden="true">{String(itemIndex + 1).padStart(2, '0')}</span>
                    <p className="further-title">{item.title}</p>
                    <p className="further-evidence">{item.evidence}</p>
                    <p className="further-summary">{item.summary}</p>
                  </div>
                  {item.image ? (
                    <figure className="further-figure">
                      <Image src={item.image.src} alt={item.image.alt} width={item.image.width} height={item.image.height} sizes="(max-width: 760px) 100vw, (max-width: 1160px) 56vw, 48vw" loading="eager" />
                      <figcaption>{item.image.kind}</figcaption>
                    </figure>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
