import { Masthead } from "@/components/Masthead";
import { SiteFooter } from "@/components/SiteFooter";
import { WorkCatalogue } from "@/components/WorkCatalogue";
import { pageMetadata } from "@/content/seo";

export const metadata = pageMetadata({
  title: "Robotics and engineering projects",
  description: "Explore robotics, embedded systems, industrial automation and engineering software projects, with contributions, design decisions and testing.",
  path: "/work/",
});

export default function Work() {
  return (
    <>
      <Masthead current="work" />
      <main id="main" className="container work-index">
        <header className="page-head">
          <p className="eyebrow">Work</p>
          <h1>Work across the whole system.</h1>
          <p>Robotics, embedded devices, industrial delivery and software. Each case study covers the problem, my contribution and how the result was tested.</p>
        </header>
        <noscript><style>{".catalogue-controls{display:none}"}</style><p className="result-count">All projects are listed below. Turn on JavaScript to search and filter.</p></noscript>
        <WorkCatalogue />
      </main>
      <SiteFooter />
    </>
  );
}
