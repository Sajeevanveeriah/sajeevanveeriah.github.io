'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ReactNode } from 'react'

/**
 * Midnight is the committed default. The system option is kept, matching the
 * previous site's behaviour, and next-themes stamps data-theme on <html>
 * before first paint so there is no flash of the wrong palette.
 *
 * disableTransitionOnChange stops every transitioned property on the page
 * from animating at once when the theme flips, which would read as a stutter
 * rather than as controlled actuation.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}
