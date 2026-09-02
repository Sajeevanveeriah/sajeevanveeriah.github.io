import { learningGuide, learningMonths } from '@/content/learning'

export function LearningRoadmap() {
  return (
    <section className="learning-section" id="learning" aria-labelledby="learning-title">
      <div className="shell learning-header">
        <div>
          <p className="kicker">Capability development</p>
          <h2 id="learning-title">Learn the stack by building through it.</h2>
        </div>
        <div className="learning-lead">
          <p>{learningGuide.description}</p>
          <a className="button button-primary" href={learningGuide.docx} download>Download learning guide</a>
        </div>
      </div>
      <ol className="shell learning-path">
        {learningMonths.map((item) => (
          <li key={item.month}>
            <p className="learning-number">{item.month}</p>
            <h3>{item.title}</h3>
            <p>{item.focus}</p>
            <p className="learning-build"><strong>Build:</strong> {item.build}</p>
            <ul aria-label={`${item.title} resources`}>
              {item.resources.map(([label, href]) => <li key={label}><a href={href}>{label}</a></li>)}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  )
}
