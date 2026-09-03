import Image from 'next/image'
import Link from 'next/link'
import { Masthead } from '@/components/Masthead'
import { SiteFooter } from '@/components/SiteFooter'
import { featuredProjects } from '@/content/projects'
import { learningGuide, learningMonths } from '@/content/learning'
import { resumeFiles } from '@/content/resume'
import { experience, foundation, humanNote, site } from '@/content/site'
import './reference-fidelity.css'
import './reference-overrides.css'

const systemNodes = [
  ['01', 'Physical system', 'Mechanisms & actuation'], ['02', 'Sensing', 'Perception & world model'],
  ['03', 'Control', 'Real-time & safety'], ['04', 'Autonomy', 'Planning & decisioning'],
  ['05', 'Industrial IT / AI', 'Data & integration'], ['06', 'Verification', 'Validation & reliability'],
] as const

export default function HomePage() {
  const featured = featuredProjects[0]
  return <div className="portfolio-home">
    <Masthead />
    <main id="main">
      <section className="hero" id="overview" aria-labelledby="hero-title"><div className="frame hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Robotics. Intelligence. Automation.</p>
          <h1 id="hero-title"><span>Sajeevan</span><span>Veeriah</span></h1>
          <p className="hero-role">{site.jobTitle}</p><p className="hero-summary">{site.proposition}</p>
          <div className="hero-actions"><a className="primary-action" href="#work">View selected work <span aria-hidden="true">↗</span></a><a className="text-action" href={resumeFiles.pdf} download>Download resume <span aria-hidden="true">↓</span></a></div>
          <p className="membership">Member, Engineers Australia</p>
        </div>
        <figure className="system-portrait">
          <Image src="/assets/image/Smart_Factory_Process_Visualisation_Rev00.webp" alt="Integrated automation system spanning machinery, control and operational data." width={1448} height={1086} priority sizes="(max-width: 860px) 100vw, 54vw" />
          <ol>{systemNodes.map(([number, title, detail], index) => <li className={`system-node node-${index + 1}`} key={number}><span>{number}</span><strong>{title}</strong><small>{detail}</small></li>)}</ol>
          <figcaption>One connected engineering practice from physical system to verified deployment.</figcaption>
        </figure>
      </div></section>

      <section className="statement-section selected-work" id="work" aria-labelledby="work-title"><div className="frame statement-grid">
        <header className="section-intro"><p className="section-number">01 <span>Selected work</span></p><h2 id="work-title">Systems that solve real problems.</h2><p>Robotics, embedded systems and production software engineered around reliability, evidence and clear operating boundaries.</p><Link href="/work/">Explore all projects <span aria-hidden="true">→</span></Link></header>
        <article className="featured-project"><div className="featured-copy"><p className="eyebrow">Featured project</p><h3>{featured.title.replace(' on ROS 2', ' - ROS 2')}</h3><p>{featured.system}</p><ul>{featured.stack.slice(0, 5).map((tag) => <li key={tag}>{tag}</li>)}</ul><Link href={`/work/${featured.slug}/`}>View project case study <span aria-hidden="true">→</span></Link></div><figure><Image src={featured.image!.src} alt={featured.image!.alt} width={featured.image!.width} height={featured.image!.height} sizes="(max-width: 860px) 100vw, 43vw" /><figcaption><strong>Engineering evidence</strong>{featured.verification}</figcaption></figure></article>
      </div></section>

      <section className="statement-section experience-section" id="experience" aria-labelledby="experience-title"><div className="frame statement-grid">
        <header className="section-intro"><p className="section-number">02 <span>Experience</span></p><h2 id="experience-title">A timeline of impact.</h2><p>Professional work across regulated automation, automotive validation, field telemetry and manufacturing systems.</p><a href={resumeFiles.pdf} download>Full work history <span aria-hidden="true">→</span></a></header>
        <ol className="career-line">{experience.slice(0, 4).map((item) => <li key={`${item.period}-${item.role}`}><time>{item.period}</time><div><h3>{item.role}</h3><p>{item.detail}</p></div></li>)}</ol>
      </div></section>

      <section className="statement-section roadmap-section" id="learning" aria-labelledby="learning-title"><div className="frame roadmap-layout">
        <header className="section-intro"><p className="section-number">03 <span>Learning system</span></p><h2 id="learning-title">Build the stack. Prove the skill.</h2><p>{learningGuide.description}</p><a className="download-action" href={learningGuide.docx} download>Download roadmap (DOCX) <span aria-hidden="true">↓</span></a></header>
        <div className="roadmap-track"><p className="roadmap-caption">Six months to build, deploy and document.</p><ol>{learningMonths.map((month) => <li key={month.month}><span>{month.month}</span><i aria-hidden="true" /><h3>{month.title}</h3><p>{month.focus}</p></li>)}</ol><a href={learningGuide.docx} download>Open learning materials <span aria-hidden="true">→</span></a></div>
      </div></section>

      <section className="statement-section project-preview" id="projects" aria-labelledby="projects-title"><div className="frame statement-grid">
        <header className="section-intro"><p className="section-number">04 <span>Project archive</span></p><h2 id="projects-title">Complete projects. Deeper by design.</h2><p>Case studies across robotics, software, industrial automation and automotive delivery.</p><Link href="/work/">Browse every project <span aria-hidden="true">→</span></Link></header>
        <div className="project-strip">{featuredProjects.map((project) => <article key={project.slug}><Image src={project.image!.src} alt={project.image!.alt} width={project.image!.width} height={project.image!.height} sizes="(max-width: 760px) 100vw, 25vw" /><div><p>{project.evidence}</p><h3>{project.title}</h3><ul>{project.stack.slice(0, 3).map((tag) => <li key={tag}>{tag}</li>)}</ul><Link href={`/work/${project.slug}/`} aria-label={`Open ${project.title}`}>→</Link></div></article>)}</div>
      </div></section>

      <section className="closing-section" id="practice"><div className="frame closing-grid">
        <div><p className="section-number">05 <span>Foundation</span></p><h2>Education and professional foundation.</h2><ul>{foundation.education.map((item) => <li key={item}>{item}</li>)}<li>{foundation.professional[0]}</li></ul></div>
        <div><p className="section-number">06 <span>Human note</span></p><h2>Engineer. Problem solver. Systems builder.</h2><p>{humanNote}</p></div>
        <div id="contact"><p className="section-number">07 <span>Contact</span></p><h2>Let&apos;s build something reliable together.</h2><ul className="contact-list"><li><a href={`mailto:${site.email}`}>{site.email}</a></li><li><a href={site.github}>github.com/Sajeevanveeriah</a></li><li>{site.location}</li></ul></div>
      </div></section>
    </main><SiteFooter />
  </div>
}
