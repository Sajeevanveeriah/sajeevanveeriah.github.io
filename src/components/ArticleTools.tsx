"use client";
import { useEffect, useRef, useState } from "react";

/** A thin bar under the header showing how far through the article the reader is. Decorative, so hidden from assistive technology. */
export function ReadingProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.current?.style.setProperty("--progress", String(max > 0 ? Math.min(1, scrollY / max) : 0));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    return () => {
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, []);
  return <div className="reading-progress" ref={bar} aria-hidden="true" />;
}

/** Shares the page through the device share sheet where there is one, otherwise copies the link. */
export function ShareButton({ title }: { readonly title: string }) {
  const [note, setNote] = useState("");
  async function share() {
    const url = location.href.split("#")[0] ?? location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setNote("Link copied");
    } catch {
      setNote("");
    }
  }
  return (
    <span className="share">
      <button type="button" className="btn btn-secondary btn-small" onClick={share}>Share this article</button>
      <span aria-live="polite" className="share-note">{note}</span>
    </span>
  );
}
