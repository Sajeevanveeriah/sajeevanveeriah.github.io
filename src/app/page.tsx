import Link from 'next/link';
import Image from 'next/image';
import { Masthead } from '@/components/Masthead';
import { SiteFooter } from '@/components/SiteFooter';
import { ArrowUpRight } from '@/components/icons';
import { FeaturedStage, DisciplineExplorer, ProjectExplorer, PersonalStory } from '@/components/PortfolioHome';
import { projects } from '@/content/projects';
import { publishedPosts, formatPostDate } from '@/content/blog';
import { site } from '@/content/site';
import './studio.css';

export default function Home() {
  const hero = projects.find(p => p.slug === 'gendio-controller')!;
  const image = hero.image!;
  return <>
    <Masthead />
    <main id="main" className="studio-home">
      <section className="studio-shell studio-hero" aria-labelledby="hero-title">
        <div><h1 id="hero-title">Sajeevan<br />Veeriah<span>.</span></h1><p className="studio-role">{site.jobTitle}</p><p className="studio-tagline">Hardware. Intelligence. Software.</p><p className="studio-intro">I connect hardware, controls and software to build working systems - and test how they behave together.</p><div className="studio-actions"><a className="studio-button" href="#work">Explore my work <ArrowUpRight /></a><Link className="studio-link" href="/about/" prefetch={false}>About Saj <ArrowUpRight /></Link></div></div>
        <figure className="studio-hero-media"><Link href="/work/gendio-controller/" prefetch={false}><Image src={image.src} alt={image.alt} width={image.width} height={image.height} priority sizes="(max-width: 760px) 90vw, 46vw" /></Link><figcaption><span>Gendio Display Controller</span><span>{image.kind}</span></figcaption></figure>
      </section>
      <FeaturedStage /><DisciplineExplorer /><ProjectExplorer /><PersonalStory />
      <section className="studio-shell studio-section studio-journal" id="journal" aria-labelledby="journal-title"><div className="studio-heading"><div><h2 id="journal-title">From the journal</h2><p>Things I am learning, building and working through.</p></div><Link href="/blog/" className="studio-link" prefetch={false}>All posts <ArrowUpRight /></Link></div><div className="journal-entries">{publishedPosts().slice(0, 2).map(post => <article key={post.slug}><time dateTime={post.date}>{formatPostDate(post.date)}</time><h3><Link href={`/blog/${post.slug}/`} prefetch={false}>{post.title}<ArrowUpRight /></Link></h3><p>{post.description}</p></article>)}</div></section>
      <section className="studio-contact" id="contact" aria-labelledby="contact-title"><div className="studio-shell contact-layout"><div><h2 id="contact-title">Have a system to work through?</h2><p>Talk through an engineering problem, a project or a collaboration.</p></div><div className="studio-actions"><a className="studio-button" href={`mailto:${site.email}`}>Contact me <ArrowUpRight /></a><a className="studio-link" href={site.resume}>Resume <ArrowUpRight /></a></div></div><div className="studio-shell studio-services" id="services" role="region" aria-labelledby="services-title"><span id="services-title">Need technical help?</span><a href="https://sajeevanveeriah.github.io/saj-service-desk/request/">Request a service <ArrowUpRight /></a><Link href="/notes/" prefetch={false}>Learning resources <ArrowUpRight /></Link></div></section>
      <noscript><div className="studio-shell"><p>The full project catalogue and about page include all content without interactive tabs.</p><Link href="/work/" prefetch={false}>Browse all projects</Link> · <Link href="/about/" prefetch={false}>Read about Saj</Link></div></noscript>
    </main><SiteFooter />
  </>;
}
