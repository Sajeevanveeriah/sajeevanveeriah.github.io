import type { Metadata, Viewport } from 'next'
import { archivoFont } from './fonts'
import { site } from '@/content/site'
import './globals.css'



export const metadata: Metadata = {
  other: { 'portfolio-release': process.env.GITHUB_SHA ?? 'local' },
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
      url: site.logo,
      width: 512,
      height: 512,
      alt: `${site.name}, ${site.jobTitle}`,
    }],
  },
  twitter: { card: 'summary' },
  icons: { icon: '/favicon.png', apple: '/favicon.png' },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f5f4' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
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
    knowsAbout: ['Robotics', 'Mechatronics', 'Industrial automation', 'Industrial IT', 'Operational technology', 'Embedded systems', 'Controls', 'Automotive validation', 'IoT', 'AI and machine learning', 'Engineering software'],
  }

  return (
    <html lang="en-AU" className={archivoFont.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var m=localStorage.getItem('sv-theme');if(m!=='light'&&m!=='dark'&&m!=='system')m='light';var d=matchMedia('(prefers-color-scheme:dark)').matches;document.documentElement.dataset.theme=m==='system'?(d?'dark':'light'):m}catch(e){}",
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
