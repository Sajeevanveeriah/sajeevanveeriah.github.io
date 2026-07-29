import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/ui/PageHeader'
import { Reveal } from '@/components/motion/Reveal'
import { CareerSpine } from '@/components/about/CareerSpine'
import { narrative, credentials, beyond, beyondHeading } from '@/content/about'
import { experience, experienceGroups } from '@/content/experience'
import a from './about.module.css'

export const metadata: Metadata = {
  title: 'About',
  description:
    'My career record across industries and engineering systems, my formal qualifications, professional membership, community involvement and life beyond the workbench.',
  alternates: { canonical: '/about/' },
  openGraph: { title: 'About', url: '/about/' },
}

export default function AboutPage() {
  const groups = ['recent', 'foundation'] as const

  return (
    <>
      <section className="section">
        <div className="wrap-wide">
          <PageHeader
          signature="spine"
            kicker="About"
            title="Six years on production floors, then engineering delivery on top of it."
            lede={narrative}
          />

          {groups.map((g) => (
            <div key={g} className={a.group}>
              <div className={a.groupHead}>
                <p className="label label-accent">{experienceGroups[g].period}</p>
                <h2 className={a.groupTitle}>{experienceGroups[g].heading}</h2>
                <p className={a.groupNote}>{experienceGroups[g].kicker}</p>
              </div>
              <CareerSpine roles={experience.filter((r) => r.group === g)} />
            </div>
          ))}
        </div>
      </section>

      <section className="section stage-tint" aria-labelledby="creds-title">
        <div className="wrap-wide">
          <Reveal className={a.stageHead}>
            <div>
              <p className="label label-accent">Qualifications and community</p>
              <h2 id="creds-title">Where the formal record sits.</h2>
            </div>
            <p className="lede">
              My degrees, professional membership, short courses and the engineering communities I
              take part in.
            </p>
          </Reveal>

          <div className={a.credentials}>
            {credentials.map((c) => (
              <Reveal as="article" key={c.label} className={a.credential}>
                <h3 className={a.credentialLabel}>{c.label}</h3>
                <ul className={a.credentialList}>
                  {c.items.map((item, i) => (
                    <li key={i}>
                      {item.title ? <strong>{item.title}</strong> : null}
                      {item.detail ? <span>{item.detail}</span> : null}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="beyond-title">
        <div className="wrap-wide">
          <Reveal className={a.stageHead}>
            <div>
              <p className="label label-accent">Beyond engineering</p>
              <h2 id="beyond-title">{beyondHeading.title}</h2>
            </div>
            <p className="lede">{beyondHeading.summary}</p>
          </Reveal>

          <ol className={a.beyond}>
            {beyond.map((b, i) => (
              <li key={b.title} className={a.beyondItem}>
                <span className={a.beyondIndex}>{String(i + 1).padStart(2, '0')}</span>
                <h3 className={a.beyondTitle}>{b.title}</h3>
                <p className={a.beyondBody}>{b.body}</p>
              </li>
            ))}
          </ol>

          <p className={a.beyondFoot}>
            <Link href="/contact/" className="textlink">
              Get in touch
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}
