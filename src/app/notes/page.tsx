import { Masthead } from "@/components/Masthead";
import { SiteFooter } from "@/components/SiteFooter";
import { learningGuide, learningMonths } from "@/content/learning";
export const metadata = {
  title: "Learning and notes",
  description:
    "A practical robotics learning roadmap and downloadable materials.",
  alternates: { canonical: "/notes/" },
};
export default function Notes() {
  return (
    <>
      <Masthead current="notes" />
      <main id="main" className="shell">
        <header className="page-intro">
          <h1>
            Build. Test.
            <br />
            Understand.
          </h1>
          <p>
            A practical robotics learning roadmap, organised around things to
            build and inspect.
          </p>
          <p className="quiet">
            A learning resource and proposed pathway, not a record of completed
            qualifications.
          </p>
          <a className="button" href={learningGuide.docx} download>
            Download roadmap (DOCX) ↓
          </a>
        </header>
        <section className="section">
          <h2>A six-month pathway</h2>
          <ol className="timeline">
            {learningMonths.map((m) => (
              <li key={m.month}>
                <p className="number">Month {m.month}</p>
                <div>
                  <h3>{m.title}</h3>
                  <p>{m.focus}</p>
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
