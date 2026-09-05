import { Masthead } from '@/components/Masthead';
import { SiteFooter } from '@/components/SiteFooter';
import { WorkCatalogue } from '@/components/WorkCatalogue';
export const metadata = { title: 'Engineering work', description: 'Robotics, embedded systems, engineering software and industrial projects.', alternates: { canonical: '/work/' } };
export default function Work() { return <><Masthead current="work"/><main id="main" className="shell"><header className="page-intro"><h1>Work across<br />the system.</h1><p>Robotics, embedded devices and software. Explore the problem, my contribution and the evidence behind each project.</p></header><WorkCatalogue /></main><SiteFooter /></>; }
