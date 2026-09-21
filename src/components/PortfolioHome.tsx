"use client";

import { useState, type KeyboardEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { projects, projectIndex } from '@/content/projects';
import { site, practiceDomains, community, experience, humanNote, workingStyle, foundation, beyond } from '@/content/site';
import { ArrowUpRight } from './icons';

const featured = ['gendio-controller', 'autonomous-navigation-rover', 'swl-pricing-inventory-control'].map(slug => projects.find(p => p.slug === slug)!);
const disciplines = [
  { label: 'Robotics', title: 'Robotics & autonomous systems', description: 'Sensing, localisation, planning and motion control, connected through testable systems.', tools: 'ROS 2 · Nav2 · Gazebo · Python · C++', slugs: ['autonomous-navigation-rover', 'waterless-solar-panel-cleaner', 'deadline-aware-runtime-assurance'] },
  { label: 'Electronics', title: 'Electronics & embedded systems', description: 'Custom boards, firmware and sensing, with attention to the electrical and mechanical interfaces.', tools: 'ESP32 · KiCad · C/C++ · BLE · Serial protocols', slugs: ['gendio-controller', 'ataxia-assessment-device'] },
  { label: 'Controls', title: 'Control & industrial automation', description: 'PLC and HMI/SCADA integration, production data, commissioning and traceable verification.', tools: 'PLC · HMI/SCADA · MATLAB · Simulink · FAT/SAT', slugs: ['gendio-controller', 'deadline-aware-runtime-assurance'] },
  { label: 'AI & Software', title: 'AI, data & engineering software', description: 'Software that supports real workflows, from local AI and engineering analysis to reviewed business data.', tools: 'Python · TypeScript · React · Local AI · CI/CD', slugs: ['swl-pricing-inventory-control', 'deadline-aware-runtime-assurance'] },
];
const filters = ['All', 'Robotics', 'Embedded', 'Software', 'Industrial'];
const entries = [
  ...[...featured, ...projects.filter(p => !featured.some(f => f.slug === p.slug))].map(p => ({ title: p.title, summary: p.proof, category: p.category as string, slug: p.slug, keywords: p.stack.join(' ') })),
  ...projectIndex.flatMap((g, i) => g.items.map(p => ({ title: p.title, summary: p.summary, category: ['Robotics', 'Software', 'Industrial'][i], slug: '', keywords: g.group }))),
];

function navigateTabs(e: KeyboardEvent<HTMLButtonElement>, index: number, count: number, select: (index: number) => void) {
  const next = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? (index + 1) % count : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? (index + count - 1) % count : e.key === 'Home' ? 0 : e.key === 'End' ? count - 1 : null;
  if (next === null) return;
  e.preventDefault();
  select(next);
  const buttons = e.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
  buttons?.[next]?.focus();
}

export function FeaturedStage() {
  const [selected, setSelected] = useState(0);
  const project = featured[selected]!;
  return <section className="studio-stage" id="work" aria-labelledby="featured-title">
    <div className="studio-shell stage-layout">
      <div className="stage-selection">
        <p className="studio-label">Featured work</p>
        <h2 id="featured-title">From physical systems to intelligent software.</h2>
        <div className="stage-tabs" role="tablist" aria-label="Featured projects" aria-orientation="vertical">
          {featured.map((p, i) => <button key={p.slug} role="tab" id={`feature-tab-${i}`} aria-controls="featured-panel" aria-selected={selected === i} tabIndex={selected === i ? 0 : -1} onClick={() => setSelected(i)} onKeyDown={e => navigateTabs(e, i, featured.length, setSelected)}>{p.title}<ArrowUpRight /></button>)}
        </div>
      </div>
      <div id="featured-panel" className="stage-content" role="tabpanel" aria-labelledby={`feature-tab-${selected}`} tabIndex={0}>
        <figure className="stage-media">
          {project.image && <Image src={project.image.src} width={project.image.width} height={project.image.height} alt={project.image.alt} sizes="(max-width: 760px) 90vw, 38vw" />}
          <figcaption>{project.image?.kind}</figcaption>
        </figure>
        <div className="stage-copy"><p className="studio-label">{project.category}</p><h3>{project.title}</h3><p>{project.proof}</p><Link className="studio-button" href={`/work/${project.slug}/`} prefetch={false}>View project <ArrowUpRight /></Link><p className="stage-stack">{project.stack.slice(0, 3).join(' · ')}</p></div>
      </div>
    </div>
  </section>;
}

export function DisciplineExplorer() {
  const [selected, setSelected] = useState(0);
  const discipline = disciplines[selected]!;
  const related = discipline.slugs.map(slug => projects.find(p => p.slug === slug)!);
  const image = related[0]!.image!;
  return <section className="studio-shell studio-section" id="capabilities" aria-labelledby="discipline-title">
    <div className="studio-heading"><div><p className="studio-label">Explore by discipline</p><h2 id="discipline-title">Different disciplines. A connected approach.</h2></div><p>I work across hardware, controls and software. Explore the projects to see how the pieces fit together.</p></div>
    <div className="discipline-tabs" role="tablist" aria-label="Engineering disciplines">{disciplines.map((d, i) => <button key={d.label} role="tab" id={`discipline-tab-${i}`} aria-controls="discipline-panel" aria-selected={selected === i} tabIndex={selected === i ? 0 : -1} onClick={() => setSelected(i)} onKeyDown={e => navigateTabs(e, i, disciplines.length, setSelected)}>{d.label}</button>)}</div>
    <div className="discipline-panel" role="tabpanel" id="discipline-panel" aria-labelledby={`discipline-tab-${selected}`} tabIndex={0}>
      <figure><Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(max-width: 760px) 90vw, 35vw" /><figcaption>{image.kind}</figcaption></figure>
      <div><h3>{discipline.title}</h3><p>{discipline.description}</p><ul className="discipline-projects">{related.map(p => <li key={p.slug}><Link href={`/work/${p.slug}/`} prefetch={false}>{p.title}<ArrowUpRight /></Link></li>)}</ul><p className="discipline-tools">{discipline.tools}</p>{selected === 2 && <Link className="studio-link" href="/about/#experience">Industrial delivery experience <ArrowUpRight /></Link>}</div>
    </div>
    <details className="capability-detail"><summary>Explore my full engineering toolkit</summary><div className="capability-grid">{practiceDomains.map(d => <div key={d.title}><h3>{d.title}</h3><p>{d.detail}</p></div>)}</div></details>
  </section>;
}

export function ProjectExplorer() {
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(false);
  const matching = entries.filter(p => (category === 'All' || category === p.category) && `${p.title} ${p.summary} ${p.keywords}`.toLowerCase().includes(query.trim().toLowerCase()));
  const shown = expanded || query.trim() || category !== 'All' ? matching : matching.slice(0, 3);
  function reset() { setCategory('All'); setQuery(''); setExpanded(false); }
  return <section className="studio-shell studio-section project-explorer" aria-labelledby="index-title" id="project-index">
    <div className="studio-heading"><div><h2 id="index-title">Project index</h2><p>Search across my engineering, software and community work.</p></div><Link href="/work/" className="studio-link" prefetch={false}>Full project catalogue <ArrowUpRight /></Link></div>
    <div className="explorer-controls"><label className="project-search"><span className="sr-only">Search projects</span><input type="search" placeholder="Search projects, tools or disciplines" value={query} onChange={e => setQuery(e.target.value)} /></label><div className="project-filters" role="group" aria-label="Filter projects by discipline">{filters.map(f => <button key={f} aria-pressed={category === f} onClick={() => setCategory(f)}>{f}</button>)}</div></div>
    <p className="result-count" role="status">{matching.length} {matching.length === 1 ? 'project' : 'projects'}{shown.length < matching.length ? ` · Showing ${shown.length}` : ''}</p>
    <div className="project-rows">{shown.map(p => <article key={p.title} className="project-row"><h3>{p.slug ? <Link href={`/work/${p.slug}/`} prefetch={false}>{p.title}</Link> : p.title}</h3><p>{p.summary}</p><span className="project-category">{p.category}</span>{p.slug ? <Link href={`/work/${p.slug}/`} aria-label={`Read ${p.title}`} prefetch={false}><ArrowUpRight /></Link> : <details className="project-detail"><summary>Details</summary><p>{p.summary}</p><Link href={`/work/?q=${encodeURIComponent(p.title)}`} prefetch={false}>View in catalogue</Link></details>}</article>)}</div>
    {!matching.length && <div className="explorer-empty"><h3>No matching projects</h3><p>Try another keyword or clear the filters.</p><button onClick={reset}>Clear filters</button></div>}
    {shown.length < matching.length && <button className="show-projects" onClick={() => setExpanded(true)}>Show all {matching.length} projects</button>}
    {(query || category !== 'All') && matching.length > 0 && <button className="show-projects" onClick={reset}>Clear filters</button>}
  </section>;
}

const personalTabs = ['Practice', 'Experience', 'Community'];
export function PersonalStory() {
  const [selected, setSelected] = useState(0);
  return <section className="studio-shell studio-section" id="about" aria-labelledby="personal-title">
    <h2 id="personal-title">The engineer behind the systems.</h2>
    <div className="personal-layout"><div className="personal-intro"><p>{humanNote}</p><Link className="studio-link" href="/about/" prefetch={false}>More about Saj <ArrowUpRight /></Link></div>
      <div className="personal-content"><div className="personal-tabs" role="tablist" aria-label="About Saj">{personalTabs.map((label, i) => <button key={label} role="tab" id={`personal-tab-${i}`} aria-controls="personal-panel" aria-selected={selected === i} tabIndex={selected === i ? 0 : -1} onClick={() => setSelected(i)} onKeyDown={e => navigateTabs(e, i, personalTabs.length, setSelected)}>{label}</button>)}</div>
        <div role="tabpanel" id="personal-panel" aria-labelledby={`personal-tab-${selected}`} tabIndex={0}>
          {selected === 0 && <><h3>Multidisciplinary engineering.</h3><p>{workingStyle}</p><Link href="/notes/" className="studio-link" prefetch={false}>Learning roadmap & notes <ArrowUpRight /></Link></>}
          {selected === 1 && <><h3>Practical work across industries.</h3><p>Automation, vehicle testing, field telemetry and manufacturing, with a consistent focus on integration and verification.</p><ul className="experience-links">{experience.slice(0, 3).map(e => <li key={e.role}><span>{e.period}</span><strong>{e.role}</strong></li>)}</ul><Link href="/about/#experience" className="studio-link" prefetch={false}>Complete career timeline <ArrowUpRight /></Link></>}
          {selected === 2 && <><h3>Beyond project delivery.</h3>{community.map(c => <div className="community-item" key={c.title}><h4>{c.title}</h4><p>{c.detail}</p></div>)}<p className="personal-interests">Away from the work: {beyond.map(b => b.title.toLowerCase()).join(', ')}.</p></>}
        </div>
      </div>
      <div className="practice-summary"><div><h3>Physical systems</h3><p>Mechanical design, electronics and system integration.</p></div><div><h3>Control and autonomy</h3><p>Embedded systems, control and robotics.</p></div><div><h3>Software and AI</h3><p>Applications, data and intelligence for real workflows.</p></div></div>
    </div>
    <details className="capability-detail"><summary>Education & professional foundation</summary><div className="foundation-list">{foundation.education.map(e => <p key={e}>{e}</p>)}<p>{site.credentials[0]}</p><p>Languages: {foundation.languages.join(', ')}</p></div></details>
  </section>;
}
