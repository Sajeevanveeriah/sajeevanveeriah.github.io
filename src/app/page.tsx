import Link from 'next/link'
import Image from 'next/image'
import { Masthead } from '@/components/Masthead'
import { ContactBand, SiteFooter } from '@/components/SiteFooter'
import { ProjectCard } from '@/components/ProjectCard'
import { ArrowUpRight } from '@/components/icons'
import { DecodeText } from '@/components/DecodeText'
import { RoboticsHero } from '@/components/RoboticsHero'
import { projects, projectIndex } from '@/content/projects'
import { publishedPosts, formatPostDate, postTopic } from '@/content/blog'
import { learningMonths } from '@/content/learning'
import { site, systemLayers, experience, foundation, practiceDomains } from '@/content/site'

const selectedWork = [
  { title: 'Autonomous Navigation Rover', category: 'Robotics', summary: 'Sensing, localisation and motion control.', image: 'rover.webp', href: '/work/autonomous-navigation-rover/' },
  { title: 'Industrial Display Controller', category: 'Mechatronics', summary: 'Embedded systems and electronics.', image: 'controller.webp', href: '/work/industrial-display-controller/' },
  { title: 'Voltwyn: Local SLM System', category: 'AI/ML', summary: 'Local intelligence, retrieval and controlled tools.', image: 'intelligence.webp', href: '/blog/local-ai-beyond-the-model/' },
]

export default function Home() {
  const band = projects.filter((p) => ['ndcc-community-systems', 'pricing-inventory-control', 'autonomous-navigation-rover'].includes(p.slug))
  const research = projects.filter((p) => p.publication)
  const posts = publishedPosts().slice(0, 3)
  const totalProjects = projects.length + projectIndex.reduce((n, g) => n + g.items.length, 0)
  const firstYear = experience.at(-1)?.period.match(/\d{4}/)?.[0]
  return <>
    <Masthead />
    <main id="main" className="portfolio-home">
      <div className="hero-band">
        <section className="container hero robotics-hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><DecodeText text="Robotics / Mechatronics / AI" /></p>
            <h1 id="hero-title"><span className="line"><span>Robotics.</span></span><span className="line"><span>Mechatronics.</span></span><span className="line"><span className="hero-ai">AI.</span></span></h1>
            <p className="hero-role">{site.jobTitle}</p>
            <p className="hero-lede">Hardware, control and intelligence.<br />Built to work together.</p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href="/work/" prefetch={false}>Explore my work <ArrowUpRight /></Link>
              <a className="btn btn-secondary" href={site.resume}>Resume (PDF)</a>
            </div>

          </div>
          <RoboticsHero />
        </section>
        <div className="container current-role"><div><span className="eyebrow">Currently at</span><strong>Farm Frites Australia</strong></div><div><span className="eyebrow">Role</span><span>IT/OT and Systems Engineer</span></div><a className="text-link" href="#experience">View experience <ArrowUpRight /></a></div>
        <section className="container stats" aria-label="Portfolio at a glance">
          <dl>
            <div><dt>Case studies</dt><dd>{projects.length}</dd></div>
            <div><dt>Projects in the index</dt><dd>{totalProjects}</dd></div>
            <div><dt>Journal articles</dt><dd>{publishedPosts().length}</dd></div>
            <div><dt>In industry since</dt><dd>{firstYear}</dd></div>
          </dl>
        </section>
      </div>

      <section className="section container" id="work" aria-labelledby="featured-title">
        <div className="section-head selected-heading"><div><p className="eyebrow">Selected engineering work</p><h2 id="featured-title">Built across<br />disciplines<span className="accent-dot">.</span></h2></div></div>
        <div className="selected-projects">{selectedWork.map((project) => <article className="selected-project" key={project.title}>
          <div className="selected-copy"><p className="eyebrow">{project.category}</p><h3><Link href={project.href} prefetch={false}>{project.title}</Link></h3><p>{project.summary}</p><Link className="text-link" href={project.href} prefetch={false}>View project <ArrowUpRight /></Link></div>
          <Link className="selected-image" href={project.href} prefetch={false} tabIndex={-1} aria-hidden="true"><Image src={`/assets/image/redesign/${project.image}`} alt="" width={1536} height={1024} sizes="(max-width: 800px) 92vw, 65vw" /></Link>
        </article>)}</div>
        <div className="card-grid compact">{band.map((p) => <ProjectCard key={p.slug} project={p} />)}</div>
        <Link className="text-link" href="/work/" prefetch={false}>See all {totalProjects} projects <ArrowUpRight /></Link>
        <section className="research-band" id="research" aria-labelledby="research-title">
          <div><p className="eyebrow">Independent research</p><h2 id="research-title">From a working question to a published method.</h2><p>Independent research connecting physical systems, control and autonomy. Explore the methods and results on Zenodo.</p></div>
          <ul>{research.map((p) => <li key={p.slug}>
            <h3><Link href={`/work/${p.slug}/`} prefetch={false}>{p.title}</Link></h3>
            <p>{p.proof}</p>
            <a className="text-link" href={p.publication!.url}>{p.publication!.label} <ArrowUpRight /></a>
          </li>)}</ul>
        </section>
      </section>

      <section className="section" aria-label="Career and learning">
        <div className="container split">
          <div id="experience">
            <p className="eyebrow">Career</p>
            <h2>Engineering shaped by industry.</h2>
            <ol className="compact-timeline">{experience.map((e) => <li key={e.role}><span className="period">{e.period}</span><div><strong>{e.role}</strong><span>{e.organisation}</span></div></li>)}</ol>
            <Link className="text-link" href="/about/#experience" prefetch={false}>Full career timeline <ArrowUpRight /></Link>
          </div>
          <div>
            <p className="eyebrow">Learning pathway</p>
            <h2>Learn it by building it.</h2>
            <p className="section-intro">A six-month robotics roadmap, from bench fundamentals to a documented robot-learning project.</p>
            <ol className="compact-timeline">{learningMonths.map((m) => <li key={m.month}><span className="period">Month {m.month}</span><div><strong>{m.title}</strong><span>{m.focus}</span></div></li>)}</ol>
            <Link className="text-link" href="/notes/" prefetch={false}>Open the roadmap <ArrowUpRight /></Link>
          </div>
        </div>
      </section>

      <section className="section container system-overview" aria-labelledby="systems-title"><p className="eyebrow">Connected disciplines</p><h2 id="systems-title">One system, six layers</h2><ol>{systemLayers.map((layer) => <li key={layer.index}><span>{layer.index}</span><div><h3>{layer.title}</h3><p>{layer.detail}</p></div></li>)}</ol></section>

      <section className="section container" id="capabilities" aria-labelledby="foundation-title">
        <div className="section-head"><div><p className="eyebrow">Professional foundation</p><h2 id="foundation-title">The disciplines behind the work.</h2><p>Mechatronics education, industry experience and a toolkit that connects physical systems with their software.</p></div></div>
        <div className="foundation">
          <div className="foundation-facts">
            <div><h3>Education</h3>{foundation.education.map((e) => <p key={e}>{e}</p>)}</div>
            <div><h3>Membership</h3><p>{foundation.professional[0]}</p></div>
            <div><h3>Languages</h3><p>{foundation.languages.join(', ')}</p></div>
          </div>
          <div className="toolkit">{practiceDomains.map((d) => <div key={d.title}><h3>{d.title}</h3><p>{d.detail}</p></div>)}</div>
        </div>
      </section>

      <section className="section container" id="journal" aria-labelledby="journal-title">
        <div className="section-head"><div><p className="eyebrow">Journal</p><h2 id="journal-title">Engineering decisions, explained.</h2><p>Recent notes on design choices, practical tests and what the results can tell us.</p></div><Link className="text-link" href="/blog/" prefetch={false}>All posts <ArrowUpRight /></Link></div>
        <div className="post-grid">{posts.map((post) => <article className="post-card" key={post.slug}>
          <p className="post-meta"><span className="topic">{postTopic(post)}</span><time dateTime={post.date}>{formatPostDate(post.date)}</time></p>
          <h3><Link href={`/blog/${post.slug}/`} prefetch={false}>{post.title}</Link></h3>
          <p>{post.description}</p>
        </article>)}</div>
      </section>

      <ContactBand />

      <section className="section container" id="project-index" aria-labelledby="index-title">
        <div className="section-head"><div><p className="eyebrow">Complete project index</p><h2 id="index-title">Projects, research and industry contributions.</h2><p>Explore the full body of work, from independent prototypes to client software and production support.</p></div><Link className="text-link" href="/work/" prefetch={false}>Search the catalogue <ArrowUpRight /></Link></div>
        <div className="project-index">
          <div><h3>Case studies</h3><ul>{projects.map((p) => <li key={p.slug}><Link href={`/work/${p.slug}/`} prefetch={false}>{p.title}</Link></li>)}</ul></div>
          {projectIndex.map((g) => <div key={g.group}><h3>{g.group}</h3><ul>{g.items.map((p) => <li key={p.title}><Link href={`/work/?q=${encodeURIComponent(p.title)}`} prefetch={false}>{p.title}</Link></li>)}</ul></div>)}
        </div>
      </section>
    </main>
    <SiteFooter contact={false} />
  </>
}
