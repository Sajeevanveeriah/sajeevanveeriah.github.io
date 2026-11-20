'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import type { Project } from '@/content/projects'
import type { MediaAsset, VideoAsset } from '@/content/media'
import { ArrowUpRight } from './icons'
import { PictureMedia } from './PictureMedia'
import { LoopingVideo } from './LoopingVideo'

export interface DossierEntry {
  readonly id: string
  readonly kind: 'case-study' | 'indexed'
  readonly title: string
  readonly category: 'Robotics' | 'Embedded' | 'Industrial' | 'Software'
  readonly status: string
  readonly summary: string
  readonly media: MediaAsset
  readonly video?: VideoAsset
  readonly href?: string
  readonly project?: Project
}

export function ProjectDossierDrawer({
  entry,
  onClose,
}: {
  readonly entry: DossierEntry | null
  readonly onClose: () => void
}) {
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const drawerRef = useRef<HTMLElement>(null)
  const lastFocusedRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!entry) return
    lastFocusedRef.current = document.activeElement as HTMLElement | null
    closeBtnRef.current?.focus()

    const siblings = Array.from(document.body.children).filter(
      (node): node is HTMLElement => node instanceof HTMLElement && (!drawerRef.current || !node.contains(drawerRef.current)),
    )
    const prevInert = siblings.map((el) => el.inert)
    for (const el of siblings) el.inert = true

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key === 'Tab' && drawerRef.current) {
        const focusables = Array.from(
          drawerRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        ).filter((el) => el.offsetParent !== null)
        if (!focusables.length) return
        const first = focusables[0]!
        const last = focusables[focusables.length - 1]!
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    addEventListener('keydown', onKey)
    return () => {
      siblings.forEach((el, idx) => {
        el.inert = prevInert[idx] ?? false
      })
      document.body.style.overflow = prevOverflow
      removeEventListener('keydown', onKey)
      lastFocusedRef.current?.focus()
    }
  }, [entry, onClose])

  if (!entry) return null

  const p = entry.project

  const handleInternalQueryNav = () => {
    onClose()
    requestAnimationFrame(() => dispatchEvent(new Event('sv-url-change')))
  }

  return (
    <div
      className="dossier-backdrop"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <aside
        ref={drawerRef}
        className="dossier-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dossier-title"
      >
        <header className="dossier-head">
          <div>
            <p className="eyebrow">{entry.category}</p>
            <h2 id="dossier-title">{entry.title}</h2>
            <p className="dossier-status">{entry.status}</p>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            className="dossier-close"
            onClick={onClose}
            aria-label="Close project dossier"
          >
            Close
          </button>
        </header>

        <div className="dossier-body">
          <div className="dossier-media media-frame">
            {entry.video ? (
              <LoopingVideo video={entry.video} priority />
            ) : (
              <PictureMedia media={entry.media} priority />
            )}
          </div>

          {p ? (
            <>
              <section>
                <h3>System summary</h3>
                <p>{p.system}</p>
              </section>
              <section>
                <h3>Problem and engineering context</h3>
                <p>{p.problem}</p>
              </section>
              <section>
                <h3>Architecture</h3>
                <p>{p.architecture}</p>
                <ol className="dossier-path">
                  {p.systemPath.map((step, i) => (
                    <li key={step.label}>
                      <span>{String(i + 1).padStart(2, '0')}</span>
                      <div>
                        <strong>{step.label}</strong>
                        <small>{step.detail}</small>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
              <section>
                <h3>Verification and evidence boundary</h3>
                <p>{p.verification}</p>
              </section>
              <section>
                <h3>Key design decisions</h3>
                <ul className="dossier-decisions">
                  {p.decisions.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </section>
              <section>
                <h3>Stack</h3>
                <ul className="chips">
                  {p.stack.map((tech) => (
                    <li key={tech} className="chip">
                      {tech}
                    </li>
                  ))}
                </ul>
              </section>
            </>
          ) : (
            <section>
              <h3>Engineering overview</h3>
              <p>{entry.summary}</p>
            </section>
          )}
        </div>

        <footer className="dossier-foot">
          {p ? (
            <Link className="btn btn-primary" href={`/work/${p.slug}/`} prefetch={false} onClick={onClose}>
              Open full case study <ArrowUpRight />
            </Link>
          ) : entry.href ? (
            entry.href.startsWith('http') ? (
              <a className="btn btn-primary" href={entry.href} target="_blank" rel="noopener noreferrer">
                Open project reference <ArrowUpRight />
              </a>
            ) : (
              <Link className="btn btn-primary" href={entry.href} prefetch={false} onClick={handleInternalQueryNav}>
                Open project record <ArrowUpRight />
              </Link>
            )
          ) : (
            <Link
              className="btn btn-primary"
              href={`/work/?q=${encodeURIComponent(entry.title)}`}
              prefetch={false}
              onClick={handleInternalQueryNav}
            >
              View in project catalogue <ArrowUpRight />
            </Link>
          )}
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Done
          </button>
        </footer>
      </aside>
    </div>
  )
}
