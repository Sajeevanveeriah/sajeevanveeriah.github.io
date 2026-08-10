import type { Metadata, Viewport } from 'next'
import Link from 'next/link'
import { bodyFont, displayFont } from './fonts'
import { ThemeSwitch } from '@/components/ThemeSwitch'
import { site } from '@/content/site'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.jobTitle}`,
    template: `%s | ${site.name}`,
  },
  description: site.proposition,
  authors: [{ name: site.name }],
  alternates: { canonical: '/' },
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    siteName: site.name,
    title: `${site.name} | ${site.jobTitle}`,
    description: site.proposition,
    url: site.url,
    images: [{
      url: '/assets/image/20260806-Inventory-Scanning-Mobile-Robot-Rev00.avif',
      width: 1672,
      height: 941,
      alt: 'Concept visual of an operator-support inventory scanning mobile robot.',
    }],
  },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/favicon.svg' },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f8f5' },
    { media: '(prefers-color-scheme: dark)', color: '#07130f' },
  ],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    url: site.url,
    jobTitle: site.jobTitle,
    sameAs: [site.github, site.linkedin],
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'Deakin University' },
    memberOf: { '@type': 'Organization', name: 'Engineers Australia' },
  }

  return (
    <html lang="en-AU" className={`${displayFont.variable} ${bodyFont.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var m=localStorage.getItem('sv-theme');if(m!=='light'&&m!=='dark')m='system';var d=matchMedia('(prefers-color-scheme:dark)').matches;document.documentElement.dataset.theme=m==='system'?(d?'dark':'light'):m}catch(e){}",
          }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      </head>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <header className="site-header">
          <div className="shell header-inner">
            <Link className="brand" href="/" aria-label="Sajeevan Veeriah, home">
              <span className="brand-mark" aria-hidden="true">{site.initials}</span>
              <span className="brand-name">{site.name}</span>
            </Link>
            <nav aria-label="Primary navigation">
              <Link href="/#work">Work</Link>
              <Link href="/#practice">Practice</Link>
              <Link href="/#contact">Contact</Link>
            </nav>
            <ThemeSwitch />
          </div>
        </header>
        <main id="main">{children}</main>
        <footer className="site-footer">
          <div className="shell footer-grid">
            <div>
              <Link className="footer-name" href="/">{site.name}</Link>
              <p>{site.jobTitle}</p>
            </div>
            <div className="footer-links" aria-label="Professional links">
              <a href={site.github}>GitHub</a>
              <a href={site.linkedin}>LinkedIn</a>
              <a href={site.resume}>Resume</a>
            </div>
            <p className="copyright">© 2026 Sajeevan Veeriah</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
