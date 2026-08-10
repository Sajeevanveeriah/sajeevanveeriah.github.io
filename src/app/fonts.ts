import localFont from 'next/font/local'

export const displayFont = localFont({
  src: [
    { path: '../../public/assets/fonts/space-grotesk-500.woff2', weight: '500' },
    { path: '../../public/assets/fonts/space-grotesk-600.woff2', weight: '600' },
    { path: '../../public/assets/fonts/space-grotesk-700.woff2', weight: '700' },
  ],
  variable: '--font-display',
  display: 'swap',
})

export const bodyFont = localFont({
  src: [
    { path: '../../public/assets/fonts/hanken-grotesk-400.woff2', weight: '400' },
    { path: '../../public/assets/fonts/hanken-grotesk-500.woff2', weight: '500' },
    { path: '../../public/assets/fonts/hanken-grotesk-600.woff2', weight: '600' },
  ],
  variable: '--font-body',
  display: 'swap',
})
