import type { Metadata, Viewport } from 'next'
import { site } from '@/content/site'
import { SiteHeader } from '@/components/chrome/SiteHeader'
import { SiteFooter } from '@/components/chrome/SiteFooter'
import { MotionProvider } from '@/components/motion/MotionProvider'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Robotics, Mechatronics and Automation Portfolio`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  authors: [{ name: site.name }],
  alternates: { canonical: '/' },
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
  openGraph: {
    type: 'website',
    siteName: site.name,
    locale: site.locale,
    url: site.url,
  },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/favicon.svg' },
}

export const viewport: Viewport = {
  themeColor: [
    { color: '#F7F7F8' },
  ],
  colorScheme: 'light',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={site.lang}>
      <body>
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          <MotionProvider>
            <SiteHeader />
            <main id="main">
              {children}
            </main>
            <SiteFooter />
          </MotionProvider>
      </body>
    </html>
  )
}
