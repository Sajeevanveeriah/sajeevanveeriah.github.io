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

/* The media-keyed pair is what a reader gets before hydration and what a
   reader with JavaScript disabled gets permanently, so it must be correct on
   its own. ThemeController overwrites the `content` of these tags once a
   reader makes an explicit choice, because a media query cannot express
   "this reader chose Light on a dark system".

   The two colours are the resolved values of --bg in each theme and must
   stay in step with tokens.css. */
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0d0d0f' },
  ],
  colorScheme: 'light dark',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /* The font variables must live on <html>, not <body>: the type tokens in
       tokens.css are declared on :root, and a var() inside a custom property
       is substituted where that property is declared. On <body> the family
       variables would be invalid at :root and every token would silently fall
       back to the system stack. */
    /* suppressHydrationWarning covers <html> only, and only because the
       inline script below deliberately writes data-theme and data-js onto it
       before React hydrates. The server cannot know the reader's theme, so
       that attribute mismatch is correct rather than a bug, and it is the
       one place on the page where that is true. */
    <html lang={site.lang} className={fontVariables} suppressHydrationWarning>
      <head>
        {/* Two jobs, one blocking inline script, deliberately not two.
            Both must complete before the first paint, and a second <script>
            element in the head is a second parser stop for no benefit.

            First, resolve the theme. This is the anti-flash pass: it runs
            before any stylesheet paints a background, so the page never
            paints white and then flips to dark. It depends on no framework,
            no module loader and no external file, because any of those would
            arrive too late to matter.

            The whole read is wrapped in try/catch. Private browsing modes
            throw on localStorage access rather than returning null, and an
            uncaught throw here would abort the script and take `data-js`
            down with it. The mode is validated against an exact allow-list,
            so a corrupted or hand-edited value falls through to system
            rather than being written to the attribute.

            data-theme carries the RESOLVED theme, never the mode. "system"
            is not a paint instruction, so it never reaches CSS; it lives in
            localStorage and in ThemeController state instead. When the mode
            is system the attribute is still written, which is what lets the
            controller re-resolve on an OS scheme change without the
            `html:not([data-theme])` media block fighting it.

            Second, arm the scroll-reveal treatment. Without JavaScript this
            never runs, the hidden state is never applied, and every section
            renders complete. Inline and blocking so no element can paint in
            its visible state and then jump to hidden. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var m=localStorage.getItem('sv-theme');" +
              "if(m!=='light'&&m!=='dark'&&m!=='system')m='system';" +
              "document.documentElement.setAttribute('data-theme'," +
              "m==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):m)" +
              '}catch(e){}' +
              "document.documentElement.setAttribute('data-js','')",
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
