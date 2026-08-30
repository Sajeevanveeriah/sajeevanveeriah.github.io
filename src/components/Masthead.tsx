import Image from 'next/image'
import Link from 'next/link'
import { MobileNavigation } from '@/components/MobileNavigation'
import { ThemeSegment } from '@/components/ThemeSegment'
import { site } from '@/content/site'

type Section = 'systems' | 'work' | 'practice' | 'contact'

const destinations = [
  { id: 'systems', label: 'Systems' },
  { id: 'work', label: 'Work' },
  { id: 'practice', label: 'Practice' },
  { id: 'contact', label: 'Contact' },
] as const

function DestinationLinks({ current }: { readonly current?: Section }) {
  return <>{destinations.map((destination) => {
    const href = current === 'work' && destination.id === 'work' ? '/work/' : `/#${destination.id}`
    return <Link key={destination.id} href={href} aria-current={current === destination.id ? 'location' : undefined}>{destination.label}</Link>
  })}</>
}

export function Masthead({ current, reduced = false }: { readonly current?: Section; readonly reduced?: boolean }) {
  return (
    <header className="site-header"><div className="shell header-inner">
      <Link className="brand" href="/" aria-label={`${site.name}, home`}><span className="brand-mark" aria-hidden="true"><Image src={site.logo} alt="" width={512} height={512} priority /></span><span className="brand-copy"><span className="brand-name">{site.name}</span><span>Complete systems engineering</span></span></Link>
      {reduced ? null : <nav className="site-nav" aria-label="Primary"><DestinationLinks current={current} /></nav>}
      <div className="header-actions"><a className="header-resume" href={site.resume}>Resume</a><ThemeSegment /></div>
      {reduced ? null : <MobileNavigation current={current} />}
    </div></header>
  )
}
