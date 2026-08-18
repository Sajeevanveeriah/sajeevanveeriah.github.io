import Link from 'next/link'
import { ThemeSegment } from '@/components/ThemeSegment'
import { site } from '@/content/site'

type Section = 'work' | 'practice' | 'contact'

const destinations: readonly { readonly id: Section; readonly label: string }[] = [
  { id: 'work', label: 'Work' },
  { id: 'practice', label: 'Practice' },
  { id: 'contact', label: 'Contact' },
]

export function Masthead({ current, reduced = false }: { readonly current?: Section; readonly reduced?: boolean }) {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label={`${site.name}, home`}>
          <span className="brand-mark" aria-hidden="true">{site.initials}</span>
          <span className="brand-name">{site.name}</span>
        </Link>
        {reduced ? null : (
          <nav className="site-nav" aria-label="Primary">
            {destinations.map((destination) => (
              <Link
                key={destination.id}
                href={`/#${destination.id}`}
                aria-current={current === destination.id ? 'page' : undefined}
              >
                {destination.label}
              </Link>
            ))}
          </nav>
        )}
        <ThemeSegment />
      </div>
    </header>
  )
}
