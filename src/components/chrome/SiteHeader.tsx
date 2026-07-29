'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { navigation, site } from '@/content/site'
import styles from './SiteHeader.module.css'

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Close the mobile panel on navigation, so a route change never leaves an
  // open menu covering the page it just moved to.
  useEffect(() => setOpen(false), [pathname])

  // The header rule is suppressed at the very top so the hero starts on an
  // uninterrupted white field.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`wrap-wide ${styles.shell}`}>
        <Link className={styles.brand} href="/" aria-label={`${site.name}, home`}>
          <span className={styles.brandName}>{site.name}</span>
          <span className={styles.brandRole} aria-hidden="true">
            Mechatronics, robotics and AI/ML engineer
          </span>
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
            <span className={styles.burger} aria-hidden="true">
              <span />
              <span />
            </span>
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>
    </header>
  )
}
