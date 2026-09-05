"use client";
import { useEffect, useState } from "react";
type Choice = "light" | "system" | "dark";
export function ThemeSegment() {
  const [choice, setChoice] = useState<Choice>("light");
  useEffect(() => {
    let v: Choice = "light";
    try {
      const s = localStorage.getItem("sv-theme");
      if (s === "dark" || s === "system") v = s;
    } catch {}
    setChoice(v);
    const media = matchMedia("(prefers-color-scheme:dark)");
    const apply = () => {
      document.documentElement.dataset.theme =
        v === "system" ? (media.matches ? "dark" : "light") : v;
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [choice]);
  return (
    <label className="theme-label">
      Appearance
      <select
        aria-label="Colour theme"
        value={choice}
        onChange={(e) => {
          const v = e.target.value as Choice;
          try {
            localStorage.setItem("sv-theme", v);
          } catch {}
          document.documentElement.dataset.theme =
            v === "system"
              ? matchMedia("(prefers-color-scheme:dark)").matches
                ? "dark"
                : "light"
              : v;
          setChoice(v);
        }}
      >
        <option value="light">Light</option>
        <option value="system">System</option>
        <option value="dark">Dark</option>
      </select>
    </label>
  );
}
