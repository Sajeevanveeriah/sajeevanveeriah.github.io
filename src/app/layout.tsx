import type { Metadata, Viewport } from 'next'
import { site } from '@/content/site'
import { fontVariables } from './fonts'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { SiteHeader } from '@/components/chrome/SiteHeader'
import { SiteFooter } from '@/components/chrome/SiteFooter'
import { CoordinateGrid } from '@/components/robotics/CoordinateGrid'
import { BootSequence } from '@/components/robotics/BootSequence'
import { MotionProvider } from '@/components/motion/MotionProvider'
import { ToolPath } from '@/components/motion/ToolPath'
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
    { media: '(prefers-color-scheme: dark)', color: '#0B0D12' },
    { media: '(prefers-color-scheme: light)', color: '#F3F1EB' },
  ],
  colorScheme: 'dark light',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={site.lang} className={fontVariables} suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          <MotionProvider>
            <BootSequence />
            <CoordinateGrid />
            <SiteHeader />
            <main id="main">
              <ToolPath>{children}</ToolPath>
            </main>
            <SiteFooter />
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
