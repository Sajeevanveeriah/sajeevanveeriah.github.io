'use client'

import { useCallback, useEffect, useState } from 'react'
import styles from './ThemeToggle.module.css'

/**
 * The three-state theme control: System, Light, Dark.
 *
 * Hand-rolled rather than taken from a library. The hard part of theming a
 * static export is the blocking inline script in `layout.tsx` that resolves
 * the theme before first paint, and that has to exist either way. What is
 * left after it is a button, a string in localStorage and a media query
 * listener, which is not worth a dependency.
 *
 * The division of labour is deliberate:
 *
 * - `localStorage` holds the MODE, one of "system", "light" or "dark".
 * - `data-theme` on <html> holds the RESOLVED theme, only ever "light" or
 *   "dark". "system" is not a paint instruction and never reaches CSS.
 *
 * That split is what keeps `tokens.css` to two states instead of three, and
 * it is why System can follow a live OS change without any CSS knowing that
 * System exists.
 */

/** The persisted mode. Not the resolved theme. */
type Mode = 'system' | 'light' | 'dark'

/** The resolved theme. Not the mode. */
type Resolved = 'light' | 'dark'

/**
 * One key, named for the site rather than the generic "theme", so it cannot
 * collide with anything else on the github.io origin. Every other site
 * published under a *.github.io subdomain shares this origin's localStorage
 * namespace, and "theme" is the obvious name for all of them.
 */
const STORAGE_KEY = 'sv-theme'

/**
 * The cycle, as an explicit successor map rather than an array plus modulo
 * indexing. `noUncheckedIndexedAccess` is on, so an array lookup is
 * `Mode | undefined` and every call site would need a non-null assertion to
 * say something the modulo already guarantees. A total record over the union
 * is checked rather than asserted: adding a fourth mode becomes a type error
 * here instead of a silent gap.
 */
const NEXT: Record<Mode, Mode> = {
  system: 'light',
  light: 'dark',
  dark: 'system',
}

const QUERY = '(prefers-color-scheme: dark)'

const LABEL: Record<Mode, string> = {
  system: 'System',
  light: 'Light',
  dark: 'Dark',
}

/** Never trust the stored value: it is user-writable and may be corrupt. */
function isMode(value: unknown): value is Mode {
  return value === 'system' || value === 'light' || value === 'dark'
}

function readMode(): Mode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return isMode(stored) ? stored : 'system'
  } catch {
    // Private browsing can throw rather than return null. Falling back to
    // system is both the safe answer and the correct one.
    return 'system'
  }
}

function systemPrefers(): Resolved {
  return window.matchMedia(QUERY).matches ? 'dark' : 'light'
}

function resolve(mode: Mode): Resolved {
  return mode === 'system' ? systemPrefers() : mode
}

/**
 * Keeps the theme-colour meta tags in step with an explicit choice.
 *
 * `layout.tsx` ships two media-keyed tags, which is the right answer before
 * hydration and the only answer without JavaScript. They cannot express "this
 * reader chose Light on a dark system", so once a choice exists both tags are
 * pinned to the resolved colour. Returning to System restores the media
 * behaviour by writing each tag the colour its own media query selects.
 */
let authored: { light: string; dark: string } | null = null

function syncThemeColour(mode: Mode, resolved: Resolved) {
  const tags = Array.from(
    document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]'),
  )
  if (tags.length === 0) return

  /* Capture the authored colours once, from the media-keyed tags themselves,
     before this function has had a chance to overwrite any of them. They are
     the resolved values of --bg in each theme, and taking them from the
     document rather than repeating the hex here means this cannot drift out
     of step with tokens.css and layout.tsx. */
  if (authored === null) {
    const find = (scheme: string) =>
      tags.find((tag) => (tag.getAttribute('media') ?? '').includes(scheme))
    authored = {
      light: find('light')?.getAttribute('content') ?? '#ffffff',
      dark: find('dark')?.getAttribute('content') ?? '#0d0d0f',
    }
  }

  const colours = authored
  tags.forEach((tag) => {
    if (mode === 'system') {
      // Hand the tags back to their own media queries.
      const media = tag.getAttribute('media') ?? ''
      tag.setAttribute('content', media.includes('dark') ? colours.dark : colours.light)
      return
    }
    tag.setAttribute('content', resolved === 'dark' ? colours.dark : colours.light)
  })
}

function apply(mode: Mode): Resolved {
  const resolved = resolve(mode)
  document.documentElement.setAttribute('data-theme', resolved)
  syncThemeColour(mode, resolved)
  return resolved
}

/** A distinct shape per state. Colour is never the signal. */
function Icon({ mode }: { mode: Mode }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    focusable: false,
    className: styles.icon,
  }

  if (mode === 'light') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.6v2.3M12 19.1v2.3M4.36 4.36l1.63 1.63M18.01 18.01l1.63 1.63M2.6 12h2.3M19.1 12h2.3M4.36 19.64l1.63-1.63M18.01 5.99l1.63-1.63" />
      </svg>
    )
  }

  if (mode === 'dark') {
    return (
      <svg {...common}>
        <path d="M20.4 13.9A8.4 8.4 0 1 1 10.1 3.6a6.6 6.6 0 0 0 10.3 10.3Z" />
      </svg>
    )
  }

  // System: a disc split light and dark, structurally unlike either of the
  // two above, so the three remain separable in greyscale and at 16px.
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="8.4" />
      <path d="M12 3.6a8.4 8.4 0 0 1 0 16.8Z" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function ThemeToggle() {
  /* Always "system" on the server and on the first client render. The real
     mode is read in the effect below, after hydration, because reading
     localStorage during render would produce markup the server cannot match.
     The page is already painted correctly by then: the inline script in
     layout.tsx set data-theme before any of this ran, so this state catches
     up with the DOM rather than driving it. */
  const [mode, setMode] = useState<Mode>('system')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const stored = readMode()
    setMode(stored)
    setReady(true)
    // Re-apply rather than assume. The inline script and this component must
    // agree, and re-running the resolution is cheaper than proving they do.
    apply(stored)
  }, [])

  useEffect(() => {
    const media = window.matchMedia(QUERY)

    /* Re-resolve on an OS scheme change, but only while the mode is System.
       An explicit Light or Dark choice must survive the reader switching
       their OS theme; that is the whole point of choosing explicitly. */
    const onChange = () => {
      if (readMode() !== 'system') return
      apply('system')
    }

    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  const next = NEXT[mode]

  /* The side effects sit here rather than inside a setState updater on
     purpose. reactStrictMode is on, so React double-invokes updater functions
     in development; a write and a DOM mutation in there would run twice.
     Both happen to be idempotent, but an updater that touches anything
     outside itself is a trap for whoever edits this next. */
  const cycle = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Persistence is a convenience, not a precondition. A private browsing
      // session still gets a working toggle for this page view.
    }
    apply(next)
    setMode(next)
  }, [next])

  /* The accessible name states the current mode and what activating the
     button will do, and it is the announcement mechanism as well. A separate
     aria-live region would be a second announcement of the same fact: the
     button holds focus at the moment it changes, so a screen reader reads the
     new name off the element the reader just operated.

     State is carried three ways, never by colour: a structurally distinct
     icon, a visible text label, and this name. */
  const label = `Theme: ${LABEL[mode]}. Activate to switch to ${LABEL[next]}.`

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={cycle}
      aria-label={label}
      title={label}
      data-mode={mode}
      /* Until the effect has read localStorage the rendered label is the
         server's "System" guess, which may be wrong. Marking it busy is
         honest for the few milliseconds it can be, and it never blocks
         interaction. */
      aria-busy={ready ? undefined : true}
      suppressHydrationWarning
    >
      <Icon mode={mode} />
      <span className={styles.label} suppressHydrationWarning>
        {LABEL[mode]}
      </span>
    </button>
  )
}
