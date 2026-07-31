'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import s from './CommandPalette.module.css'

export interface PaletteEntry {
  readonly group: string
  readonly label: string
  readonly href: string
}

/**
 * Cmd/Ctrl-K command palette over every page the site owns.
 *
 * Progressive enhancement in the strict sense: the entry list is built on
 * the server from the same content modules the pages render from, the
 * trigger is a real button for touch and mouse users, and without
 * JavaScript the button simply is not interactive while every destination
 * remains reachable through the ordinary navigation. The dialog is native,
 * so Escape, focus containment and the backdrop come from the platform.
 */
export function CommandPalette({ entries }: { entries: readonly PaletteEntry[] }) {
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const router = useRouter()

  const open = useCallback(() => {
    const d = dialogRef.current
    if (!d || d.open) return
    setQuery('')
    setCursor(0)
    d.showModal()
    inputRef.current?.focus()
  }, [])

  const close = useCallback(() => dialogRef.current?.close(), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        if (dialogRef.current?.open) close()
        else open()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return entries
    return entries.filter((e) => `${e.label} ${e.group}`.toLowerCase().includes(q))
  }, [entries, query])

  /* Group in the order groups first appear, preserving content order. */
  const grouped = useMemo(() => {
    const map = new Map<string, PaletteEntry[]>()
    for (const e of shown) {
      const list = map.get(e.group)
      if (list) list.push(e)
      else map.set(e.group, [e])
    }
    return Array.from(map.entries())
  }, [shown])

  const clamped = Math.min(cursor, Math.max(0, shown.length - 1))

  const go = useCallback(
    (href: string) => {
      close()
      router.push(href)
    },
    [close, router],
  )

  const onInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setCursor((c) => Math.min(c + 1, shown.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setCursor((c) => Math.max(c - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const target = shown[clamped]
      if (target) go(target.href)
    }
  }

  /* Keep the active option in view as the cursor moves. */
  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${clamped}"]`)
      ?.scrollIntoView({ block: 'nearest' })
  }, [clamped])

  let flatIndex = -1

  return (
    <>
      <button type="button" className={s.trigger} onClick={open} aria-label="Search the site">
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.6" />
          <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <span className={s.triggerLabel}>Search</span>
        <kbd className={s.kbd} aria-hidden="true">
          Ctrl K
        </kbd>
      </button>

      <dialog
        ref={dialogRef}
        className={s.dialog}
        aria-label="Site search"
        onClick={(e) => {
          if (e.target === dialogRef.current) close()
        }}
      >
        <div className={s.panel}>
          <input
            ref={inputRef}
            className={s.input}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={shown.length ? `palette-option-${clamped}` : undefined}
            aria-label="Search records, domains, employers and pages"
            placeholder="Search records, domains, employers and pages"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setCursor(0)
            }}
            onKeyDown={onInputKeyDown}
            autoComplete="off"
            spellCheck={false}
          />
          <ul id="palette-list" ref={listRef} className={s.list} role="listbox">
            {grouped.map(([group, items]) => (
              <li key={group} className={s.group}>
                <p className={s.groupTitle} aria-hidden="true">
                  {group}
                </p>
                <ul className={s.groupList} role="presentation">
                  {items.map((e) => {
                    flatIndex += 1
                    const i = flatIndex
                    return (
                      <li key={e.href} role="presentation">
                        <button
                          type="button"
                          id={`palette-option-${i}`}
                          data-index={i}
                          role="option"
                          aria-selected={i === clamped}
                          className={`${s.option} ${i === clamped ? s.optionActive : ''}`}
                          tabIndex={-1}
                          onPointerMove={() => setCursor(i)}
                          onClick={() => go(e.href)}
                        >
                          <span className={s.optionLabel}>{e.label}</span>
                          <span className={s.optionGroup} aria-hidden="true">
                            {e.group}
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </li>
            ))}
            {shown.length === 0 ? (
              <li className={s.empty} role="presentation">
                Nothing matches that search.
              </li>
            ) : null}
          </ul>
          <p className={s.help} aria-hidden="true">
            Arrow keys to move, Enter to open, Escape to close
          </p>
        </div>
      </dialog>
    </>
  )
}
