import Image from 'next/image';
import Link from 'next/link';
import { MobileNavigation } from './MobileNavigation';
import { site } from '@/content/site';
export const destinations = [{ href: '/work/', label: 'Work' }, { href: '/about/', label: 'About' }, { href: '/notes/', label: 'Notes' }, { href: '/#contact', label: 'Contact' }];
export function Masthead({ current, reduced = false }: {
    current?: string;
    reduced?: boolean;
}) { return <header className="site-header"><div className="shell header-inner"><Link className="brand" href="/" aria-label="Sajeevan Veeriah, home"><Image src={site.logo} alt="" width={44} height={44} priority/><span>Sajeevan Veeriah</span></Link>{!reduced && <nav className="site-nav" aria-label="Primary">{destinations.map(d => <Link key={d.href} href={d.href} aria-current={current === d.label.toLowerCase() ? 'page' : undefined}>{d.label}</Link>)}</nav>}<a className="header-resume" href={site.resume}>Resume <span aria-hidden="true">↗</span></a>{!reduced && <MobileNavigation />}</div></header>; }
