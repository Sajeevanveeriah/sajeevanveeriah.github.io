import type { Metadata, Viewport } from 'next'
import { site } from '@/content/site'
import { SiteHeader } from '@/components/chrome/SiteHeader'
import { SiteFooter } from '@/components/chrome/SiteFooter'
import { MotionProvider } from '@/components/motion/MotionProvider'
import './globals.css'
import { fontVariables } from './fonts'

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.jobTitle}`,
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
  themeColor: [{ color: '#ffffff' }],
  colorScheme: 'light',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /* The font variables must live on <html>, not <body>: the type tokens in
       tokens.css are declared on :root, and a var() inside a custom property
       is substituted where that property is declared. On <body> the family
       variables would be invalid at :root and every token would silently fall
       back to the system stack. */
    <html lang={site.lang} className={fontVariables}>
      <head>
        {/* Arms the scroll-reveal treatment. Without JavaScript this never
            runs, the hidden state is never applied, and every section renders
            complete. It is inline and blocking so no element can paint in its
            visible state and then jump to hidden. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.setAttribute('data-js','')",
          }}
        />
      </head>
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
