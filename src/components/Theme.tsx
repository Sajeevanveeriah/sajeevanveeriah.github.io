"use client";
import { useEffect, useState } from "react";

type Choice = "light" | "system" | "dark";
const KEY = "sv-theme";
const EVENT = "sv-theme-change";

function stored(): Choice {
  try {
    const value = localStorage.getItem(KEY);
    if (value === "dark" || value === "system") return value;
  } catch {}
  return "light";
}
function resolve(choice: Choice): "light" | "dark" {
  if (choice !== "system") return choice;
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function choose(choice: Choice) {
  try {
    localStorage.setItem(KEY, choice);
  } catch {}
  document.documentElement.dataset.theme = resolve(choice);
  dispatchEvent(new CustomEvent(EVENT));
}

/** Keeps every theme control in step and follows the OS while "System" is chosen. */
function useTheme() {
  const [choice, setChoice] = useState<Choice>("light");
  const [resolved, setResolved] = useState<"light" | "dark">("light");
  useEffect(() => {
    const media = matchMedia("(prefers-color-scheme: dark)");
    const sync = () => {
      const next = stored();
      setChoice(next);
      setResolved(resolve(next));
      document.documentElement.dataset.theme = resolve(next);
    };
    sync();
    addEventListener(EVENT, sync);
    media.addEventListener("change", sync);
    return () => {
      removeEventListener(EVENT, sync);
      media.removeEventListener("change", sync);
    };
  }, []);
  return { choice, resolved };
}

export function ThemeToggle() {
  const { resolved } = useTheme();
  const next = resolved === "dark" ? "light" : "dark";
  return (
    <button type="button" className="theme-toggle" aria-label={`Switch to ${next} theme`} title={`Switch to ${next} theme`} onClick={() => choose(next)}>
      {resolved === "dark" ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" /></svg>
      )}
    </button>
  );
}

export function ThemeSelect() {
  const { choice } = useTheme();
  return (
    <label className="theme-label">
      Appearance
      <select aria-label="Colour theme" value={choice} onChange={(e) => choose(e.target.value as Choice)}>
        <option value="light">Light</option>
        <option value="system">System</option>
        <option value="dark">Dark</option>
      </select>
    </label>
  );
}
