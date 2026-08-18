import { ArrowUpRight } from '@/components/icons'
import { site } from '@/content/site'

const boundaryRows = [
  'Robotics and autonomous systems',
  'Embedded sensing and control',
  'System integration and verification',
] as const

export function Hero() {
  return (
    <section className="hero shell" aria-labelledby="hero-title">
      <div>
        <h1 id="hero-title">{site.name}</h1>
        <hr className="rule-accent" />
        <p className="identity">{site.jobTitle}</p>
        <p className="proposition">{site.proposition}</p>
        <div className="actions" aria-label="Primary professional links">
          <a className="button button-primary" href={site.resume}>Resume<ArrowUpRight /></a>
          <a className="button button-secondary" href={site.github}>GitHub<ArrowUpRight /></a>
        </div>
      </div>
      <div>
        <hr className="rule-strong" />
        <p className="kicker">Engineering boundary</p>
        <p className="boundary-statement">From physical behaviour to deployed intelligence.</p>
        <ul className="boundary-rows">
          {boundaryRows.map((row) => <li key={row}>{row}</li>)}
        </ul>
        <p className="credentials">
          {site.credentials.map((credential, index) => (
            <span key={credential}>{index === 0 ? null : <br />}{credential}</span>
          ))}
        </p>
      </div>
    </section>
  )
}
