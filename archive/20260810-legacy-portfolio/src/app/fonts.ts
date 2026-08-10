import localFont from 'next/font/local'

/**
 * The two Command typefaces, self-hosted from the woff2 files already in
 * the repository. Loading them through next/font/local fingerprints and
 * preloads them and keeps the zero-third-party-request rule intact: nothing
 * is fetched from Google Fonts at build time or at runtime.
 *
 * display: 'swap' on both, so text paints in the fallback immediately and no
 * route is ever blocked on a font.
 *
 * 'optional' was measured as an alternative, because the homepage LCP element
 * is the h1 and its Lighthouse timing is the webfont repaint, not the first
 * paint. It moved mobile Performance on / from 93 to between 93 and 95 across
 * runs, and it buys that by dropping Space Grotesk altogether on a slow
 * connection. The two-face pairing is a binding part of the design system, so
 * 'swap' stays and the score is reported honestly instead.
 */

export const spaceGrotesk = localFont({
  src: [
    { path: '../../public/assets/fonts/space-grotesk-500.woff2', weight: '500', style: 'normal' },
    { path: '../../public/assets/fonts/space-grotesk-600.woff2', weight: '600', style: 'normal' },
    { path: '../../public/assets/fonts/space-grotesk-700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-space-grotesk',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
})

export const hankenGrotesk = localFont({
  src: [
    { path: '../../public/assets/fonts/hanken-grotesk-400.woff2', weight: '400', style: 'normal' },
    { path: '../../public/assets/fonts/hanken-grotesk-500.woff2', weight: '500', style: 'normal' },
    { path: '../../public/assets/fonts/hanken-grotesk-600.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-hanken-grotesk',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
})

/**
 * IBM Plex Mono is intentionally not loaded.
 *
 * `--font-mono` in tokens.css resolves to `--font-body`, and no rule in the
 * site references `--font-ibm-plex-mono`, so the two woff2 files were being
 * preloaded on every route and rendered by nothing. On throttled mobile they
 * were roughly 27 kB competing for the same slow-4G window as the two faces
 * the headline actually waits on. The files stay in the repository; if a
 * monospace face is wanted later, declare it here and point `--font-mono` at
 * it, so loading and use arrive together.
 */
export const fontVariables = [spaceGrotesk.variable, hankenGrotesk.variable].join(' ')
