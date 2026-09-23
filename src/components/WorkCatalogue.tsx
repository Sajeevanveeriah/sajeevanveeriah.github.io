"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { projects, projectIndex, type Project } from "@/content/projects";
import { ProjectCard } from "./ProjectCard";

const categories = ["All", "Robotics", "Embedded", "Software", "Industrial"] as const;
const groupCategory = ["Robotics", "Software", "Industrial"] as const;
const others = projectIndex.flatMap((g, i) => g.items.map((p) => ({ ...p, category: groupCategory[i] ?? "Industrial" })));

function matches(category: string, query: string, entry: { title: string; category: string; text: string }) {
  const q = query.trim().toLowerCase();
  return (category === "All" || entry.category === category) && (!q || `${entry.title} ${entry.text}`.toLowerCase().includes(q));
}

export function WorkCatalogue() {
  const [category, setCategory] = useState<string>("All");
  const [query, setQuery] = useState("");
  useEffect(() => {
    const sync = () => {
      const p = new URLSearchParams(location.search);
      const c = p.get("category") || "All";
      setCategory((categories as readonly string[]).includes(c) ? c : "All");
      setQuery(p.get("q") || "");
    };
    sync();
    addEventListener("popstate", sync);
    return () => removeEventListener("popstate", sync);
  }, []);
  function update(c: string, q: string) {
    setCategory(c);
    setQuery(q);
    const url = new URL(location.href);
    if (c === "All") url.searchParams.delete("category");
    else url.searchParams.set("category", c);
    if (q) url.searchParams.set("q", q);
    else url.searchParams.delete("q");
    history.replaceState(null, "", url);
  }
  const caseStudies = projects.filter((p: Project) => matches(category, query, { title: p.title, category: p.category, text: `${p.proof} ${p.system} ${p.stack.join(" ")}` }));
  const more = others.filter((p) => matches(category, query, { title: p.title, category: p.category, text: p.summary }));
  const total = caseStudies.length + more.length;
  return (
    <>
      <div className="filters catalogue-controls">
        <div className="segmented" role="group" aria-label="Project category">
          {categories.map((c) => (
            <button type="button" key={c} aria-pressed={category === c} onClick={() => update(c, query)}>{c}</button>
          ))}
        </div>
        <label className="search">
          <span className="sr-only">Search projects</span>
          <input className="field" type="search" value={query} onChange={(e) => update(category, e.target.value)} placeholder="Search projects, tools or disciplines" />
        </label>
        <button type="button" className="reset" onClick={() => update("All", "")}>Reset</button>
      </div>
      <p className="result-count" role="status">{total} {total === 1 ? "project" : "projects"}</p>
      {caseStudies.length > 0 && (
        <section className="catalogue-group" aria-labelledby="case-studies-title">
          <h2 id="case-studies-title">Case studies</h2>
          <div className="card-grid">{caseStudies.map((p) => <ProjectCard key={p.slug} project={p} />)}</div>
        </section>
      )}
      {more.length > 0 && (
        <section className="catalogue-group" aria-labelledby="more-title">
          <h2 id="more-title">More projects and delivery</h2>
          <ul className="project-list">
            {more.map((p) => (
              <li key={p.title} data-project={p.title}>
                <h3>{p.title}</h3>
                <p>{p.summary}</p>
                <span className="card-kicker">{p.category}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
      {!total && (
        <div className="empty-state">
          <h2>No matching projects</h2>
          <p>Try another search, or reset the filters to see every project.</p>
          <button type="button" onClick={() => update("All", "")}>Show all projects</button>
        </div>
      )}
      <p className="catalogue-note">Looking for writing about these projects? <Link prefetch={false} href="/blog/?topic=Case%20studies">Read the case-study articles</Link>.</p>
    </>
  );
}
