import { Masthead } from "@/components/Masthead";
import { SiteFooter } from "@/components/SiteFooter";
import { site, experience, foundation, humanNote, workingStyle, community, beyond } from "@/content/site";
import { pageMetadata } from "@/content/seo";
import Link from "next/link";

export const metadata = pageMetadata({
  title: "About Saj",
  description: "Meet Sajeevan Veeriah: engineering experience, mechatronics education, Engineers Australia membership and an approach to building complete systems.",
  path: "/about/",
});

export default function About() {
  return (
    <>
      <Masthead current="about" />
      <main id="main" className="container">
        <header className="page-head">
          <p className="eyebrow">About</p>
          <h1>At home between the workshop and the software.</h1>
          <p>{site.profile}</p>
          <p>{workingStyle}</p>
          <div className="hero-actions"><Link className="btn btn-primary" href="/work/" prefetch={false}>Explore my work</Link><a className="btn btn-secondary" href={site.resume}>Resume (PDF)</a></div>
        </header>
        <section className="section" id="experience" aria-labelledby="timeline-title">
          <div className="section-head"><div><h2 id="timeline-title">Career timeline</h2><p>From manufacturing and quality to automotive testing, industrial controls and independent consulting.</p></div></div>
          <ol className="timeline">
            {experience.map((e) => (
              <li key={e.role}>
                <p className="period">{e.period}</p>
                <div>
                  <h3>{e.role}</h3>
                  <p className="organisation">{e.organisation}</p>
                  <p>{e.context}</p>
                  <p>{e.detail}</p>
                  <ul className="chips" aria-label="Focus areas">{e.tags.map((t) => <li className="chip" key={t}>{t}</li>)}</ul>
                </div>
              </li>
            ))}
          </ol>
        </section>
        <section className="section" aria-labelledby="foundation-title">
          <h2 id="foundation-title" className="sr-only">Education, community and life beyond work</h2>
          <div className="about-grid">
            <div className="panel">
              <h2>Education and membership</h2>
              <ul>
                {foundation.education.map((e) => <li key={e}>{e}</li>)}
                <li>{foundation.professional[0]}</li>
                <li>Languages: {foundation.languages.join(", ")}</li>
              </ul>
            </div>
            <div className="panel">
              <h2>Community</h2>
              <ul>{community.map((c) => <li key={c.title}><strong>{c.title}</strong><span>{c.detail}</span></li>)}</ul>
            </div>
            <div className="panel">
              <h2>Beyond the work</h2>
              <p>{humanNote}</p>
              <ul>{beyond.map((b) => <li key={b.title}><strong>{b.title}</strong><span>{b.detail}</span></li>)}</ul>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
