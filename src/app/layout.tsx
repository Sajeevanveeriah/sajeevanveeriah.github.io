import type { Metadata, Viewport } from 'next'
import { archivoFont } from './fonts'
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
    { media: '(prefers-color-scheme: light)', color: '#f3f2f2' },
    { media: '(prefers-color-scheme: dark)', color: '#2d2b2b' },
  ],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    url: site.url,
    jobTitle: site.jobTitle,
    sameAs: [site.github],
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'Deakin University' },
    memberOf: { '@type': 'Organization', name: 'Engineers Australia' },
  }

  return (
    <html lang="en-AU" className={archivoFont.variable} suppressHydrationWarning>
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
        {children}
      </body>
    </html>
  )
}
