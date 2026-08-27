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
      url: '/assets/image/20260827-Sajeevan-Veeriah-Portfolio-OG-Rev00.png',
      width: 1200,
      height: 630,
      alt: 'Sajeevan Veeriah Living Systems Atlas, spanning robotics, embedded engineering, automation, software and validation.',
    }],
  },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/favicon.png', apple: '/favicon.png' },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f4ec' },
    { media: '(prefers-color-scheme: dark)', color: '#0c0f16' },
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
    knowsAbout: ['Robotics', 'Mechatronics', 'Industrial automation', 'Embedded systems', 'Automotive validation', 'IoT', 'AI and machine learning'],
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
