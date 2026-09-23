import { Masthead } from "@/components/Masthead";
import { SiteFooter } from "@/components/SiteFooter";
import { learningGuide, learningMonths } from "@/content/learning";
import { pageMetadata } from "@/content/seo";

export const metadata = pageMetadata({
  title: "Robotics learning roadmap",
  description: "A six-month robotics learning roadmap with practical projects, build and test milestones, and downloadable learning materials.",
  path: "/notes/",
});

export default function Notes() {
  return (
    <>
      <Masthead current="notes" />
      <main id="main" className="container">
        <header className="page-head">
          <p className="eyebrow">Notes</p>
          <h1>Build. Test. Understand.</h1>
          <p>{learningGuide.description}</p>
          <a className="btn btn-primary" href={learningGuide.docx} download>Download the roadmap (DOCX)</a>
        </header>
        <section className="section" aria-labelledby="pathway-title">
          <div className="section-head"><div><h2 id="pathway-title">A six-month pathway</h2><p>Each month pairs a focus area with something to build and a short list of free resources.</p></div></div>
          <ol className="roadmap">
            {learningMonths.map((m) => (
              <li key={m.month}>
                <p className="month">Month {m.month}</p>
                <div>
                  <h3>{m.title}</h3>
                  <p>{m.focus}</p>
                  <p className="build"><strong>Build:</strong> {m.build}</p>
                  <ul aria-label={`Month ${m.month} resources`}>{m.resources.map(([label, url]) => <li key={url}><a href={url}>{label}</a></li>)}</ul>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
