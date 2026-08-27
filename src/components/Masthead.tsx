import Image from 'next/image'
import Link from 'next/link'
import { ThemeSegment } from '@/components/ThemeSegment'
import { site } from '@/content/site'

type Section = 'atlas' | 'work' | 'experience' | 'about' | 'contact'

const destinations = [
  { id: 'atlas', label: 'Engineer atlas' },
  { id: 'work', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'about', label: 'Beyond engineering' },
  { id: 'contact', label: 'Contact' },
] as const

function DestinationLinks({ current }: { readonly current?: Section }) {
  return <>{destinations.map((destination) => <Link key={destination.id} href={`/#${destination.id}`} aria-current={current === destination.id ? 'page' : undefined}>{destination.label}</Link>)}</>
}

export function Masthead({ current, reduced = false }: { readonly current?: Section; readonly reduced?: boolean }) {
  return (
    <header className="site-header"><div className="shell header-inner">
      <Link className="brand" href="/" aria-label={`${site.name}, home`}><span className="brand-mark" aria-hidden="true"><Image src={site.logo} alt="" width={512} height={512} priority /></span><span className="brand-copy"><span className="brand-name">{site.name}</span><span>Living Systems Atlas</span></span></Link>
      {reduced ? null : <nav className="site-nav" aria-label="Primary"><DestinationLinks current={current} /></nav>}
      <div className="header-actions"><a className="header-resume" href={site.resume}>Resume</a><ThemeSegment /></div>
      {reduced ? null : <details className="nav-disclosure"><summary>Menu</summary><nav aria-label="Mobile primary"><DestinationLinks current={current} /><a href={site.resume}>Resume</a></nav></details>}
    </div></header>
  )
}
