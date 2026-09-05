"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { projects, projectIndex } from "@/content/projects";
import { ProjectMedia } from "./ProjectMedia";
const categories = ["All", "Robotics", "Embedded", "Software", "Industrial"];
export function WorkCatalogue() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  useEffect(() => {
    const sync = () => {
      const p = new URLSearchParams(location.search);
      const c = p.get("category") || "All";
      setCategory(categories.includes(c) ? c : "All");
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
  const entries = [
    ...projects.map((p, i) => ({
      title: p.title,
      summary: p.proof,
      evidence: p.evidence,
      image: p.image,
      slug: p.slug,
      category: ["Robotics", "Embedded", "Software"][i] ?? "Software",
    })),
    ...projectIndex.flatMap((g, i) =>
      g.items.map((p) => ({
        ...p,
        slug: "",
        category: ["Robotics", "Software", "Industrial"][i] ?? "Industrial",
      })),
    ),
  ];
  const shown = entries.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      `${p.title} ${p.summary}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <div className="catalogue-controls">
        <div role="group" aria-label="Project category">
          {categories.map((c) => (
            <button
              key={c}
              aria-pressed={category === c}
              onClick={() => update(c, query)}
            >
              {c}
            </button>
          ))}
        </div>
        <label>
          Find a project
          <input
            type="search"
            value={query}
            onChange={(e) => update(category, e.target.value)}
            placeholder="Search projects"
          />
        </label>
        <button onClick={() => update("All", "")}>Reset</button>
      </div>
      <p className="quiet" role="status">
        {shown.length} {shown.length === 1 ? "project" : "projects"}
      </p>
      <div className="catalogue">
        {shown.map((p) => (
          <article key={p.title}>
            <div>
              <p className="kicker">{p.category}</p>
              <h2>
                {p.slug ? (
                  <Link href={`/work/${p.slug}/`}>{p.title} ↗</Link>
                ) : (
                  p.title
                )}
              </h2>
              <p>{p.summary}</p>
              <p className="quiet">{p.evidence}</p>
              {p.slug && (
                <Link href={`/work/${p.slug}/`}>Read case study →</Link>
              )}
            </div>
            {p.image && <ProjectMedia image={p.image} />}
          </article>
        ))}
      </div>
      {!shown.length && (
        <div className="empty-state">
          <h2>No matching projects</h2>
          <p>Try another search or reset the filters to see all projects.</p>
          <button onClick={() => update("All", "")}>Show all projects</button>
        </div>
      )}
    </>
  );
}
