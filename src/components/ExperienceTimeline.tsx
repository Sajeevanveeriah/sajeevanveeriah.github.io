import { experience } from '@/content/site'

export function ExperienceTimeline() {
  return (
    <ol className="experience-timeline" aria-label="Career timeline">
      {experience.map((item, index) => {
        const headingId = `experience-${index + 1}`
        const employerUrl =
          'employerUrl' in item && typeof item.employerUrl === 'string'
            ? item.employerUrl
            : undefined

        return (
          <li className="experience-item" key={`${item.period}-${item.organisation}`}>
            <article aria-labelledby={headingId}>
              <p className="experience-period">{item.period}</p>

              <div>
                <h3 className="experience-role" id={headingId}>
                  {item.role}
                </h3>

                <p className="experience-org">
                  {employerUrl ? (
                    <a href={employerUrl}>{item.organisation}</a>
                  ) : (
                    item.organisation
                  )}
                </p>

                <p className="experience-context">{item.context}</p>
                <p className="experience-detail">{item.detail}</p>

                <ul className="experience-tags" aria-label={`Skills used as ${item.role}`}>
                  {item.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </div>
            </article>
          </li>
        )
      })}
    </ol>
  )
}
