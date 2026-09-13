import { Masthead } from "@/components/Masthead";
import { SiteFooter } from "@/components/SiteFooter";
import {
  site,
  experience,
  foundation,
  humanNote,
  workingStyle,
} from "@/content/site";
export const metadata = {
  title: "About Saj",
  description: "Meet Sajeevan Veeriah: engineering experience, mechatronics education, Engineers Australia membership and an approach to building complete systems.",
  alternates: { canonical: "/about/" },
  openGraph: {
    title: "About Saj | Sajeevan Veeriah",
    description: "Meet Sajeevan Veeriah: engineering experience, mechatronics education, Engineers Australia membership and an approach to building complete systems.",
    url: "/about/", type: "website", siteName: site.name, locale: "en_AU",
    images: [{ url: site.logo, alt: site.name }],
  },
  twitter: { card: "summary", title: "About Saj", description: "Meet Sajeevan Veeriah: engineering experience, mechatronics education, Engineers Australia membership and an approach to building complete systems.", images: [site.logo] },
};
export default function About() {
  return (
    <>
      <Masthead current="about" />
      <main id="main" className="shell">
        <header className="page-intro">
          <h1>
            Engineering across
            <br />
            the whole system.
          </h1>
          <p>{site.profile}</p>
          <p>{workingStyle}</p>
        </header>
        <section className="section" id="experience">
          <h2>Career timeline</h2>
          <ol className="timeline">
            {experience.map((e) => (
              <li key={e.role}>
                <p className="quiet">{e.period}</p>
                <div>
                  <h3>{e.role}</h3>
                  <p className="accent">{e.organisation}</p>
                  <p>{e.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
        <section className="section about-preview">
          <div>
            <h2>Education and membership</h2>
            {foundation.education.map((e) => (
              <p key={e}>{e}</p>
            ))}
            <p>{foundation.professional[0]}</p>
          </div>
          <div>
            <h2>Beyond the work</h2>
            <p>{humanNote}</p>
            <a href={`mailto:${site.email}`}>Get in touch →</a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
