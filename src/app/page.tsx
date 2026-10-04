import Link from 'next/link'
import Image from 'next/image'
import { Masthead } from '@/components/Masthead'
import { ContactBand, SiteFooter } from '@/components/SiteFooter'
import { ProjectCard } from '@/components/ProjectCard'
import { ArrowUpRight } from '@/components/icons'
import { projects, projectIndex } from '@/content/projects'
import { publishedPosts, formatPostDate, postTopic } from '@/content/blog'
import { learningMonths } from '@/content/learning'
import { site, systemLayers, experience, foundation, practiceDomains } from '@/content/site'

const featuredSlug = 'gendio-controller'

export default function Home() {
  const featured = projects.find((p) => p.slug === featuredSlug)!
  const band = projects.filter((p) => ['ndcc-community-systems', 'swl-pricing-inventory-control', 'autonomous-navigation-rover'].includes(p.slug))
  const research = projects.filter((p) => p.publication)
  const posts = publishedPosts().slice(0, 3)
  return <>
    <Masthead />
    <main id="main">
      <section className="container hero" aria-labelledby="hero-title">
        <div>
          <p className="eyebrow">Hardware. Controls. Software.</p>
          <h1 id="hero-title">Sajeevan<br />Veeriah<span>.</span></h1>
          <p className="hero-role">{site.jobTitle}</p>
          <p className="hero-lede">{site.proposition}</p>
          <div className="hero-actions">
            <Link className="btn btn-primary" href="/work/" prefetch={false}>Explore my work <ArrowUpRight /></Link>
            <a className="btn btn-secondary" href={site.resume}>Resume (PDF)</a>
          </div>
          <ul className="hero-credentials">{site.credentials.map((c) => <li key={c}>{c}</li>)}</ul>
          <nav className="hero-routes" aria-label="Explore the portfolio">
            <a href="#experience">Experience</a><a href="#research">Research</a><a href="#contact">Work with me</a>
          </nav>
        </div>
        <figure className="system-stack">
          <figcaption><strong>One system, six layers</strong><span>How I approach an engineering system, from the physical build to verified handover.</span></figcaption>
          <ol>{systemLayers.map((layer) => <li key={layer.index}><span aria-hidden="true">{layer.index}</span><div><strong>{layer.title}</strong><small>{layer.detail}</small></div></li>)}</ol>
        </figure>
      </section>

      <section className="section container" id="work" aria-labelledby="featured-title">
        <div className="section-head"><div><p className="eyebrow">Featured project</p><h2 id="featured-title">From circuit board to browser.</h2><p>One project, connected disciplines: electronics, firmware and an interface a technician can use.</p></div></div>
        <article className="featured">
          {featured.image && <div className="media-frame"><Image src={featured.image.src} alt={featured.image.alt} width={featured.image.width} height={featured.image.height} sizes="(max-width: 1024px) 92vw, 620px" /></div>}
          <div>
            <p className="card-kicker">{featured.category}</p>
            <h3>{featured.title}</h3>
            <p>{featured.system}</p>
            <p className="project-status">{featured.status}</p>
            <ul className="chips">{featured.stack.slice(0, 5).map((s) => <li className="chip" key={s}>{s}</li>)}</ul>
            <Link className="text-link" href={`/work/${featured.slug}/`} prefetch={false}>Read the case study <ArrowUpRight /></Link>
          </div>
        </article>
        <div className="card-grid compact">{band.map((p) => <ProjectCard key={p.slug} project={p} />)}</div>
        <Link className="text-link" href="/work/" prefetch={false}>See all {projects.length + projectIndex.reduce((n, g) => n + g.items.length, 0)} projects <ArrowUpRight /></Link>
        <section className="research-band" id="research" aria-labelledby="research-title">
          <div><p className="eyebrow">Independent research</p><h2 id="research-title">From a working question to a published method.</h2><p>Two reports with methods, results and explicit limits. Published on Zenodo as independent research, without a claim of peer review.</p></div>
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
