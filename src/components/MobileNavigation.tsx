'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { resumeFiles } from '@/content/resume'

type Section = 'systems' | 'work' | 'practice' | 'contact'

const destinations = [
  { id: 'systems', label: 'Systems' },
  { id: 'work', label: 'Work' },
  { id: 'practice', label: 'Practice' },
  { id: 'contact', label: 'Contact' },
] as const

export function MobileNavigation({ current }: { readonly current?: Section }) {
  const disclosure = useRef<HTMLDetailsElement>(null)
  const close = () => {
    if (disclosure.current) disclosure.current.open = false
  }

  return (
    <details className="nav-disclosure" ref={disclosure}>
      <summary>Menu</summary>
      <nav aria-label="Mobile primary">
        {destinations.map((destination) => {
          const href = current === 'work' && destination.id === 'work' ? '/work/' : `/#${destination.id}`
          return <Link key={destination.id} href={href} aria-current={current === destination.id ? 'location' : undefined} onClick={close}>{destination.label}</Link>
        })}
        <a href={resumeFiles.pdf} download onClick={close}>Resume PDF</a>
      </nav>
    </details>
  )
}
