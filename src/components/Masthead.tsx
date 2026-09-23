import Image from "next/image";
import Link from "next/link";
import { MobileNavigation } from "./MobileNavigation";
import { ThemeToggle } from "./Theme";
import { site } from "@/content/site";

export const destinations = [
  { href: "/work/", label: "Work", key: "work" },
  { href: "/about/", label: "About", key: "about" },
  { href: "/blog/", label: "Journal", key: "blog" },
  { href: "/notes/", label: "Notes", key: "notes" },
] as const;

export function Masthead({ current }: { current?: (typeof destinations)[number]["key"] }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link prefetch={false} className="brand" href="/" aria-label="Sajeevan Veeriah, home">
          <Image src={site.logo} alt="" width={40} height={40} priority />
          <span>Sajeevan Veeriah</span>
        </Link>
        <nav className="site-nav" aria-label="Primary">
          {destinations.map((d) => (
            <Link prefetch={false} key={d.href} href={d.href} aria-current={current === d.key ? "page" : undefined}>
              {d.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <Link prefetch={false} className="btn btn-secondary" href="/#contact">Contact</Link>
          <MobileNavigation />
        </div>
      </div>
    </header>
  );
}
