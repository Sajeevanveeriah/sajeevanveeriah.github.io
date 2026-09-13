import { site } from "@/content/site";
import { Masthead } from "@/components/Masthead";
import { SiteFooter } from "@/components/SiteFooter";
import { WorkCatalogue } from "@/components/WorkCatalogue";
export const metadata = {
  title: "Robotics and engineering projects",
  description: "Explore robotics, embedded systems, industrial automation and engineering software projects, with contributions, technical decisions and evidence.",
  alternates: { canonical: "/work/" },
  openGraph: {
    title: "Robotics and engineering projects | Sajeevan Veeriah",
    description: "Explore robotics, embedded systems, industrial automation and engineering software projects, with contributions, technical decisions and evidence.",
    url: "/work/", type: "website", siteName: site.name, locale: "en_AU",
    images: [{ url: site.logo, alt: site.name }],
  },
  twitter: { card: "summary", title: "Robotics and engineering projects", description: "Explore robotics, embedded systems, industrial automation and engineering software projects, with contributions, technical decisions and evidence.", images: [site.logo] },
};
export default function Work() {
  return (
    <>
      <Masthead current="work" />
      <main id="main" className="shell">
        <header className="page-intro">
          <h1>
            Work across
            <br />
            the system.
          </h1>
          <p>
            Robotics, embedded devices and software. Explore the problem, my
            contribution and the evidence behind each project.
          </p>
        </header>
        <noscript><style>{".catalogue-controls{display:none}"}</style><p>All projects are listed below. Enable JavaScript to use search and category filters.</p></noscript><WorkCatalogue />
      </main>
      <SiteFooter />
    </>
  );
}
