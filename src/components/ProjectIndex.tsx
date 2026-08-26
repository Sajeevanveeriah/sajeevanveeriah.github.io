import Image from 'next/image'
import { ArrowUpRight } from '@/components/icons'
import { projectIndex } from '@/content/projects'

/**
 * The complete project index beyond the three flagship records: one grouped
 * column per discipline. Each entry carries its committed portfolio visual
 * where one exists, captioned with what the image is - a project visual, an
 * interface visual or a system diagram - never presented as capture
 * evidence. Only projects with a public repository link out.
 */
export function ProjectIndex({ headingId }: { readonly headingId: string }) {
  const total = projectIndex.reduce((count, group) => count + group.items.length, 0)

  return (
    <div className="further-projects" aria-labelledby={headingId}>
      <div className="further-heading">
        <p className="eyebrow">Complete project index</p>
        <h3 id={headingId}>{total} further engineering projects.</h3>
        <p>Carried over from the full portfolio record, each with its evidence class and its committed portfolio visual. Every image is captioned with what it is; the three flagship records above carry the deep case studies and the rendered-build screenshots.</p>
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
