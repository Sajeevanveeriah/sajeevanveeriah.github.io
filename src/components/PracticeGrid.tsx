import { practiceDomains } from '@/content/site'

export function PracticeGrid() {
  return (
    <section className="band practice-section" id="practice" aria-labelledby="practice-title">
      <div className="shell">
        <div className="section-heading">
          <p className="section-index">03</p>
          <div>
            <h2 id="practice-title">A coherent engineering practice.</h2>
            <p>Technologies support these system capabilities. They do not define the identity.</p>
          </div>
        </div>
        <ul className="domain-list">
          {practiceDomains.map((domain, index) => (
            <li key={domain.title}>
              <span className="domain-index">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{domain.title}</h3>
                <p>{domain.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
