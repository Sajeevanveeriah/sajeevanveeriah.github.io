"use client";
import { useEffect, useRef } from "react";

const GLYPHS = "01<>/[]#=+*";

/**
 * Resolves a short label from scrambled glyphs, left to right, once on load.
 * Assistive technology reads the real text; the animated copy is hidden from it.
 */
export function DecodeText({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const started = performance.now();
    const duration = 900;
    let frame = 0;
    const step = (now: number) => {
      const done = Math.min((now - started) / duration, 1);
      const settled = Math.floor(done * text.length);
      el.textContent = [...text].map((c, i) => (i < settled || c === " " || c === "/" ? c : GLYPHS[(i * 7 + Math.floor(now / 50)) % GLYPHS.length])).join("");
      if (done < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(frame);
      el.textContent = text;
    };
  }, [text]);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden="true">{text}</span>
    </>
  );
}
