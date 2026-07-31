'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import styles from './SiteHeader.module.css'

export interface NavPanel {
  readonly eyebrow: string
  readonly intro: string
  readonly listTitle: string
  readonly indexLabel: string
  readonly links: readonly { readonly label: string; readonly href: string }[]
}

export interface NavGroup {
  readonly label: string
  readonly href: string
  /** null where the item owns no sub-pages. */
  readonly panel: NavPanel | null
}

/** Everything inside `root` that a keyboard can land on, in document order. */
function focusables(root: HTMLElement): HTMLElement[] {
  return Array.from(
    root.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
  ).filter((el) => el.offsetParent !== null || el === document.activeElement)
}

/**
 * Primary navigation with a full-width mega-menu.
 *
 * Behaviour, all of it required rather than decorative:
 *
 *   - Each item that owns sub-pages is a real `<button>` with `aria-expanded`
 *     and `aria-controls`. Nothing opens on hover, so the panel is reachable
 *     by keyboard and by touch on exactly the same terms as by mouse.
 *   - Escape closes the open panel and returns focus to the button that
 *     opened it, so a keyboard user is never dropped at the top of the
 *     document.
 *   - While a panel is open, Tab cycles between the trigger and the panel's
 *     own links rather than walking off into the page behind it.
 *   - A pointer press outside the header closes the panel, and so does a
 *     route change, so a navigation never lands on a page with the menu it
 *     was opened from still covering it.
 *
 * Without JavaScript none of this runs and none of it is needed: the four
 * top-level destinations are plain links, and every sub-page the panels list
 * is reachable from the index page each item already points at.
 */
export function SiteNav({
  groups,
  siteName,
  resumePath,
}: {
  groups: readonly NavGroup[]
  siteName: string
  resumePath: string
}) {
  const pathname = usePathname()
  const idBase = useId()
  const [openHref, setOpenHref] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const headerRef = useRef<HTMLElement | null>(null)
  const triggers = useRef(new Map<string, HTMLButtonElement | null>())
  const panels = useRef(new Map<string, HTMLDivElement | null>())

  const panelId = (href: string) => `${idBase}${href.replace(/\W+/g, '-')}panel`

  const close = useCallback(
    (restoreFocus: boolean) => {
      setOpenHref((current) => {
        if (current && restoreFocus) triggers.current.get(current)?.focus()
        return null
      })
    },
    [],
  )

  // A route change must not leave a panel or the mobile sheet covering the
  // page it just moved to.
  useEffect(() => {
    setOpenHref(null)
    setMobileOpen(false)
  }, [pathname])

  // The header rule is suppressed at the very top so the hero starts on an
  // uninterrupted white field.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Escape, the focus cycle and outside presses all only exist while a panel
  // is open, so nothing is listening on a page nobody has opened a menu on.
  useEffect(() => {
    if (!openHref) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close(true)
        return
      }

      if (event.key !== 'Tab') return

      const trigger = triggers.current.get(openHref)
      const panel = panels.current.get(openHref)
      if (!trigger || !panel) return

      const cycle: HTMLElement[] = [trigger, ...focusables(panel)]
      // `trigger` is always present, so the cycle is never empty.
      const first = cycle[0]!
      const last = cycle[cycle.length - 1]!
      const active = document.activeElement as HTMLElement | null

      if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      } else if (active && !cycle.includes(active)) {
        // Focus was somewhere else entirely, for example after a click.
        event.preventDefault()
        first.focus()
      }
    }

    const onPointerDown = (event: PointerEvent) => {
      if (headerRef.current?.contains(event.target as Node)) return
      // No focus restore: the pointer has already moved the user's attention
      // somewhere else, and yanking focus back to the header would fight it.
      close(false)
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [openHref, close])

  return (
    <header
      ref={headerRef}
      className={`${styles.header} ${scrolled ? styles.scrolled : ''} ${
        openHref ? styles.headerOpen : ''
      }`}
    >
      <div className={`wrap-wide ${styles.shell}`}>
        <Link className={styles.brand} href="/" aria-label={`${siteName}, home`}>
          <span className={styles.brandName}>{siteName}</span>
          <span className={styles.brandRole} aria-hidden="true">
            Mechatronics, robotics and AI/ML engineer
          </span>
        </Link>

        <nav
          id="site-nav"
          className={`${styles.nav} ${mobileOpen ? styles.navOpen : ''}`}
          aria-label="Primary"
        >
          {groups.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href)
            const open = openHref === item.href

            if (!item.panel) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={styles.navLink}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              )
            }

            return (
              <div key={item.href} className={styles.navItem}>
                <button
                  type="button"
                  ref={(el) => {
                    triggers.current.set(item.href, el)
                  }}
                  className={styles.navLink}
                  aria-expanded={open}
                  aria-controls={panelId(item.href)}
                  data-active={active ? '' : undefined}
                  onClick={() => setOpenHref(open ? null : item.href)}
                >
                  {item.label}
                  <span className={styles.chevron} aria-hidden="true" />
                </button>

                <div
                  id={panelId(item.href)}
                  ref={(el) => {
                    panels.current.set(item.href, el)
                  }}
                  className={styles.panel}
                  hidden={!open}
                >
                  {/* Not `wrap-wide`: inside the mobile sheet that wrapper's
                      gutter would indent the panel a second time on top of
                      the sheet's own. The grid carries its own measure. */}
                  <div className={styles.panelGrid}>
                    <div className={styles.panelIntro}>
                      <p className={styles.panelEyebrow}>{item.panel.eyebrow}</p>
                      <p className={styles.panelLede}>{item.panel.intro}</p>
                      <Link className={styles.panelIndex} href={item.href}>
                        {item.panel.indexLabel}
                      </Link>
                    </div>

                    <div className={styles.panelList}>
                      <p className={styles.panelListTitle}>{item.panel.listTitle}</p>
                      <ul className={styles.panelLinks}>
                        {item.panel.links.map((link) => (
                          <li key={link.href}>
                            <Link href={link.href}>{link.label}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          <a className={styles.navResumeMobile} href={resumePath} download>
            Download resume
          </a>
        </nav>

        <div className={styles.actions}>
          <a className={styles.resume} href={resumePath} download>
            Resume
          </a>
          <button
            type="button"
            className={styles.menuButton}
            aria-expanded={mobileOpen}
            aria-controls="site-nav"
            onClick={() => {
              setOpenHref(null)
              setMobileOpen((v) => !v)
            }}
          >
            <span className={styles.burger} aria-hidden="true">
              <span />
              <span />
            </span>
            {mobileOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>
    </header>
  )
}
