import type { Metadata } from 'next'
import Link from 'next/link'
import { ProjectImage } from '@/components/ui/ProjectImage'
import { HeroMedia } from '@/components/home/HeroMedia'
import { site } from '@/content/site'
import { narrative } from '@/content/about'
import { publishedProjects } from '@/content/projects'
import home from './home.module.css'

export const metadata: Metadata = {
  title: 'Sajeevan Veeriah | Mechatronics, Robotics and AI/ML Engineer',
  description: 'Sajeevan Veeriah builds complete robotics, embedded and intelligent automation systems across mechanics, electronics, software, autonomy, controls and validation.',
  alternates: { canonical: '/' },
}

function PersonSchema() {
  const graph = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'WebSite', '@id': `${site.url}/#website`, url: `${site.url}/`, name: site.name, inLanguage: site.lang },
    { '@type': 'ProfilePage', '@id': `${site.url}/#profile`, url: `${site.url}/`, name: 'Sajeevan Veeriah engineering portfolio', isPartOf: { '@id': `${site.url}/#website` }, mainEntity: { '@id': `${site.url}/#person` } },
    { '@type': 'Person', '@id': `${site.url}/#person`, name: site.name, alternateName: 'Saj Veeriah', url: `${site.url}/`, email: `mailto:${site.email}`, jobTitle: site.jobTitle, sameAs: site.socials.map(x => x.href), alumniOf: { '@type': 'EducationalOrganization', name: 'Deakin University' }, memberOf: { '@type': 'Organization', name: 'Engineers Australia' } },
  ] }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
}

const selectedSlugs = ['engineering-mastery-lab', 'autonomous-navigation-rover', 'ataxia-assessment-device', 'iot-monitoring-platform']
const problems = [
  ['Autonomous systems', 'Sensing, localisation, planning and control integrated as one testable system.'],
  ['Cyber-physical products', 'Mechanics, electronics, firmware and interfaces developed around the real operating problem.'],
  ['Intelligent automation', 'Controls, data and AI/ML joined without losing engineering traceability.'],
  ['Verification', 'Simulation, testing, field evidence and defensible documentation used to close the loop.'],
] as const

export default function HomePage() {
  const selected = selectedSlugs.map(slug => publishedProjects.find(p => p.slug === slug)).filter(Boolean) as typeof publishedProjects
  return <>
    <PersonSchema />
    <section className={home.hero} aria-labelledby="hero-title"><div className="wrap">
      <p className={home.eyebrow}>{site.name}</p>
      <h1 id="hero-title">I build intelligent systems that move, sense and decide.</h1>
      <p className={home.role}>Mechatronics, Robotics and AI/ML Engineer</p>
      <p className={home.lede}>{narrative}</p>
      <div className={home.actions}><Link href="/work/" className={home.primary}>View selected work</Link><a href={site.resumePath} download className={home.secondary}>Download resume</a></div>
      <div className={home.textLinks}><Link href="/skills/">Explore capabilities</Link><Link href="/contact/">Contact</Link></div>
      <HeroMedia projects={selected} />
    </div></section>

    <section className={home.proof} aria-label="Credibility"><div className={`wrap ${home.proofGrid}`}>
      <p>Member, Engineers Australia</p><p>Deakin Honours Distinction, 2025</p><p>Complete systems, from physical architecture through validation</p><p>Professional, university and open-source evidence</p>
    </div></section>

    <section className="section" aria-labelledby="selected-title"><div className="wrap">
      <p className={home.eyebrow}>Selected engineering stories</p><h2 id="selected-title">Evidence of complete-system ownership.</h2>
      <div className={home.stories}>{selected.map((p, index) => <article className={`${home.story} ${home[`story${index}`]} ${index === 2 ? home.dark : ''}`} key={p.slug}>
        <div className={home.storyMedia}>{p.images?.[0] ? <ProjectImage image={p.images[0]} /> : null}</div>
        <div className={home.storyCopy}><p className={home.eyebrow}>{p.domain}</p><h3>{p.title}</h3><p><strong>Problem.</strong> {p.problem}</p><p><strong>Ownership.</strong> {p.homeExcerpt?.ownership ?? p.approach[0]}</p><p><strong>Outcome.</strong> {p.homeExcerpt?.outcome ?? p.outcome}</p><p className={home.disciplines}>{p.disciplines.join(' · ')}</p><Link href={`/work/${p.slug}/`}>Read the case study</Link></div>
      </article>)}</div>
    </div></section>

    <section className={home.problems} aria-labelledby="problems-title"><div className="wrap"><p className={home.eyebrow}>Problems I solve</p><h2 id="problems-title">Across boundaries, not inside silos.</h2><div className={home.problemGrid}>{problems.map(([title, body]) => <article key={title}><h3>{title}</h3><p>{body}</p></article>)}</div></div></section>

    <section className="section" aria-labelledby="capabilities-title"><div className={`wrap ${home.capabilities}`}><div><p className={home.eyebrow}>End-to-end capability</p><h2 id="capabilities-title">From physical architecture to verified behaviour.</h2></div><p>My work connects mechanical design, electronics, sensing, embedded software, autonomy, controls, data and validation. Explore the evidence behind each discipline, rather than a proficiency score.</p><div className={home.textLinks}><Link href="/atlas/">Engineering Atlas</Link><Link href="/skills/">Capability evidence</Link><Link href="/about/">Experience</Link></div></div></section>

    <section className={home.cta} aria-labelledby="cta-title"><div className="wrap"><h2 id="cta-title">Have an engineering problem that crosses disciplines?</h2><p>Review the work, inspect the evidence or start a direct conversation.</p><div className={home.actions}><Link href="/work/" className={home.primary}>Review selected work</Link><a href={`mailto:${site.email}`} className={home.secondary}>Send an email</a><a href="https://www.linkedin.com/in/sajeevan-veeriah/">LinkedIn</a><a href={site.resumePath} download>Resume</a></div></div></section>
  </>
}
