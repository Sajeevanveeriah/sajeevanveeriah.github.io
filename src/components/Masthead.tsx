import Link from 'next/link'
import { ThemeSegment } from '@/components/ThemeSegment'
import { site } from '@/content/site'

type Section = 'work' | 'practice' | 'contact'

const destinations = [
  { id: 'experience', label: 'Experience' },
  { id: 'systems', label: 'Systems' },
  { id: 'work', label: 'Projects' },
  { id: 'practice', label: 'Capability' },
  { id: 'credentials', label: 'Credentials' },
  { id: 'contact', label: 'Contact' },
] as const

export function Masthead({ current, reduced = false }: { readonly current?: Section; readonly reduced?: boolean }) {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label={`${site.name}, home`}>
          <span className="brand-mark" aria-hidden="true">{site.initials}</span>
          <span className="brand-copy"><span className="brand-name">Systems Atlas</span><span>Engineering portfolio</span></span>
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
        <a className="header-resume" href={site.resume}>Resume</a>
        <ThemeSegment />
      </div>
    </header>
  )
}
