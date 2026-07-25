import localFont from 'next/font/local'

/**
 * The three Command typefaces, self-hosted from the woff2 files already in
 * the repository. Loading them through next/font/local fingerprints and
 * preloads them and keeps the zero-third-party-request rule intact: nothing
 * is fetched from Google Fonts at build time or at runtime.
 *
 * display: 'swap' on all three, so text paints in the fallback immediately
 * and no route is ever blocked on a font.
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

export const ibmPlexMono = localFont({
  src: [
    { path: '../../public/assets/fonts/ibm-plex-mono-400.woff2', weight: '400', style: 'normal' },
    { path: '../../public/assets/fonts/ibm-plex-mono-500.woff2', weight: '500', style: 'normal' },
  ],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
  fallback: ['ui-monospace', 'monospace'],
})

export const fontVariables = [
  spaceGrotesk.variable,
  hankenGrotesk.variable,
  ibmPlexMono.variable,
].join(' ')
