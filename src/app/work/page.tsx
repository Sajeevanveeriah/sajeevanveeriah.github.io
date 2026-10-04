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
          <h1>See what I build. See how I think.</h1>
          <p>Robots, embedded devices, industrial systems and software for the people using them. Explore the challenge, my contribution, the design decisions and the evidence behind each case study.</p>
          <p>Project labels distinguish prototypes, simulations, research and client work. Search by a project, tool or discipline to find the work most relevant to you.</p>
        </header>
        <noscript><style>{".catalogue-controls{display:none}"}</style><p className="result-count">All projects are listed below. Turn on JavaScript to search and filter.</p></noscript>
        <WorkCatalogue />
      </main>
      <SiteFooter />
    </>
  );
}
