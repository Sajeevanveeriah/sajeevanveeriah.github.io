import Link from 'next/link'
import type { ReactNode } from 'react'

/**
 * The site's single forward affordance. The arrow advances on hover, which
 * is the only movement any of these links make.
 */
export function ArrowLink({
  href,
  children,
  className,
  external = false,
}: {
  href: string
  children: ReactNode
  className?: string
  external?: boolean
}) {
  const inner = (
    <>
      {children}
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M3 8h10M9 4l4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  )

  if (external) {
    return (
      <a
        href={href}
        className={`arrowlink ${className ?? ''}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {inner}
      </a>
    )
  }

  return (
    <Link href={href} className={`arrowlink ${className ?? ''}`}>
      {inner}
    </Link>
  )
}
