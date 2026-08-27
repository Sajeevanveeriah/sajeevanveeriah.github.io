import Image from 'next/image'
import { projectIndex } from '@/content/projects'

/**
 * The complete project index beyond the three flagship records: one grouped
 * column per discipline. Authentic interface captures and system diagrams
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
        {projectIndex.map((group) => (
          <section key={group.group} aria-label={group.group}>
            <h4>{group.group}</h4>
            <ul>
              {group.items.map((item) => (
                <li key={item.title}>
                  {item.image ? (
                    <figure className="further-figure">
                      <Image src={item.image.src} alt={item.image.alt} width={item.image.width} height={item.image.height} sizes="(max-width: 780px) 100vw, (max-width: 1120px) 50vw, 30vw" />
                      <figcaption>{item.image.kind}</figcaption>
                    </figure>
                  ) : null}
                  <p className="further-title">{item.title}</p>
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
