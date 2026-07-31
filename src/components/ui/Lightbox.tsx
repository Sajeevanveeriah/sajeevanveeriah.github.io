'use client'

import { useCallback, useRef, type ReactNode } from 'react'
import s from './Lightbox.module.css'

/**
 * Image lightbox as progressive enhancement over a plain link.
 *
 * The server renders an ordinary anchor to the full-size asset, so without
 * JavaScript a press simply opens the image, which is a complete fallback
 * rather than a dead control. With JavaScript the click is intercepted and
 * the image opens in a native `<dialog>`: Escape closes it, focus is trapped
 * by the dialog itself, and a backdrop press dismisses it.
 */
export function Lightbox({
  src,
  alt,
  caption,
  children,
}: {
  src: string
  alt: string
  caption?: string
  children: ReactNode
}) {
  const ref = useRef<HTMLDialogElement>(null)

  const open = useCallback((e: React.MouseEvent) => {
    /* Modified clicks keep their browser meaning (new tab, download). */
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    if (!ref.current?.showModal) return
    e.preventDefault()
    ref.current.showModal()
  }, [])

  const onDialogClick = useCallback((e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === ref.current) ref.current?.close()
  }, [])

  return (
    <>
      <a
        className={s.trigger}
        href={src}
        onClick={open}
        aria-label={`View full size: ${alt}`}
      >
        {children}
        <span className={s.hint} aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path
              d="M6.5 2H2v4.5M9.5 14H14V9.5M2 2l5 5M14 14L9 9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Enlarge
        </span>
      </a>
      <dialog ref={ref} className={s.dialog} onClick={onDialogClick} aria-label={alt}>
        <div className={s.body}>
          {/* Plain img on purpose: the dialog shows the already-shipped
              asset at full size, and next/image adds nothing in a static
              export. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={s.image} src={src} alt={alt} />
          {caption ? <p className={s.caption}>{caption}</p> : null}
          <button type="button" className={s.close} onClick={() => ref.current?.close()}>
            Close
          </button>
        </div>
      </dialog>
    </>
  )
}
