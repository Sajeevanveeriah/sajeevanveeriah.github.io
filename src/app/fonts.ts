import localFont from 'next/font/local'

/**
 * One typeface for the whole product: Archivo at 400 for body copy, 600 for
 * interface labels and navigation, 800 for every heading, index number and
 * kicker.
 *
 * The files are self-hosted latin subsets under public/assets/fonts/. Loading
 * Archivo from Google Fonts would be a third-party runtime request, which the
 * static-first rule does not allow.
 */
export const archivoFont = localFont({
  src: [
    { path: '../../public/assets/fonts/archivo-400.woff2', weight: '400', style: 'normal' },
    { path: '../../public/assets/fonts/archivo-600.woff2', weight: '600', style: 'normal' },
    { path: '../../public/assets/fonts/archivo-800.woff2', weight: '800', style: 'normal' },
  ],
  variable: '--font-archivo',
  display: 'swap',
})
