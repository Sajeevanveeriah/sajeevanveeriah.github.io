"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type { SearchEntry } from "@/content/search";

const score = (entry: SearchEntry, words: string[]) => {
  const title = entry.title.toLowerCase();
  const body = `${entry.kind} ${entry.text}`.toLowerCase();
  let total = 0;
  for (const word of words) {
    if (title.startsWith(word)) total += 6;
    else if (title.includes(word)) total += 4;
    else if (body.includes(word)) total += 1;
    else return 0;
  }
  return total;
};

/** Header search across pages, projects, services and journal posts. Opens with Ctrl+K, Cmd+K or "/". */
export function SiteSearch({ index }: { readonly index: readonly SearchEntry[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const results = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return index.filter((e) => e.kind === "Page");
    return index
      .map((entry) => ({ entry, rank: score(entry, words) }))
      .filter((r) => r.rank > 0)
      .sort((a, b) => b.rank - a.rank)
      .slice(0, 12)
      .map((r) => r.entry);
  }, [index, query]);

  function open() {
    setQuery("");
    setActive(0);
    dialog.current?.showModal();
    input.current?.focus();
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
      if ((event.key === "k" && (event.metaKey || event.ctrlKey)) || (event.key === "/" && !typing)) {
        event.preventDefault();
        if (!dialog.current?.open) open();
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  function go(entry: SearchEntry | undefined) {
    if (!entry) return;
    dialog.current?.close();
    location.assign(entry.href);
  }

  return (
    <>
      <button type="button" className="search-trigger" onClick={open} aria-haspopup="dialog" aria-label="Search the site">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        <span className="search-label" aria-hidden="true">Search</span>
        <kbd aria-hidden="true">Ctrl K</kbd>
      </button>
      <dialog
        ref={dialog}
        className="search-dialog"
        aria-labelledby="search-title"
        onClick={(e) => { if (e.target === dialog.current) dialog.current.close(); }}
      >
        <div className="search-panel">
          <h2 id="search-title" className="sr-only">Search the site</h2>
          <div className="search-field">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            <input
              ref={input}
              type="search"
              value={query}
              placeholder="Search projects, services and articles"
              aria-label="Search the site"
              role="combobox"
              aria-expanded="true"
              aria-controls="search-results"
              aria-activedescendant={results[active] ? `search-option-${active}` : undefined}
              aria-autocomplete="list"
              onChange={(e) => { setQuery(e.target.value); setActive(0); }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") { e.preventDefault(); setActive((i) => Math.min(i + 1, results.length - 1)); }
                else if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
                else if (e.key === "Enter") { e.preventDefault(); go(results[active]); }
              }}
            />
            <button type="button" className="search-close" onClick={() => dialog.current?.close()}>Close</button>
          </div>
          <p className="search-count" aria-live="polite">{query ? `${results.length} ${results.length === 1 ? "result" : "results"}` : "Pages"}</p>
          <ul id="search-results" role="listbox" aria-label="Search results" className="search-results">
            {results.map((entry, i) => (
              <li
                key={entry.href + entry.title}
                id={`search-option-${i}`}
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(entry)}
              >
                <span className="search-kind">{entry.kind}</span>
                <strong>{entry.title}</strong>
                <span className="search-text">{entry.text}</span>
              </li>
            ))}
          </ul>
          {!results.length && <p className="search-empty">Nothing matches that yet. Try a tool, a discipline or a project name.</p>}
          <p className="search-hint" aria-hidden="true"><kbd>↑</kbd> <kbd>↓</kbd> to move, <kbd>Enter</kbd> to open, <kbd>Esc</kbd> to close</p>
        </div>
      </dialog>
    </>
  );
}
