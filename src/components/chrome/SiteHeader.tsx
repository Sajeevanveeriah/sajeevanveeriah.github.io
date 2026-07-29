'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { navigation, site } from '@/content/site'
import styles from './SiteHeader.module.css'

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Close the mobile panel on navigation, so a route change never leaves an
  // open menu covering the page it just moved to.
  useEffect(() => setOpen(false), [pathname])

  return (
    <header className={styles.header}>
      <div className={`wrap ${styles.shell}`}>
        <Link className={styles.brand} href="/" aria-label={`${site.name}, home`}>
          <span className={styles.mark} aria-hidden="true">
            {site.initials}
          </span>
          <span className={styles.brandText}>{site.name}</span>
        </Link>

        <nav
          id="site-nav"
          className={`${styles.nav} ${open ? styles.navOpen : ''}`}
          aria-label="Primary"
        >
          {navigation.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href)
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
          })}
          <a className={styles.navResumeMobile} href={site.resumePath} download>
            Download resume
          </a>
        </nav>

        <div className={styles.actions}>
          <a className={styles.resume} href={site.resumePath} download>
            Resume
          </a>
          <button
            type="button"
            className={styles.menuButton}
            aria-expanded={open}
            aria-controls="site-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>
    </header>
  )
}
