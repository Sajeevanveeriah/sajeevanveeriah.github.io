"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Blocks that rise into place as they scroll into view. */
const REVEAL = [
  ".selected-project", ".system-overview li", ".section-head", ".card-grid > *", ".post-grid > *", ".post-feature", ".toolkit > *",
  ".compact-timeline li", ".project-index > div", ".research-band", ".timeline > li", ".roadmap > li",
  ".service-areas > *", ".about-grid > *", ".rate-card", ".record-section", ".system-evidence",
  ".contact-intro", ".contact-form", ".catalogue-group", ".foundation-facts > div", ".project-list li",
].join(",");

/**
 * Scroll reveals, added after hydration. Only blocks
 * that start below the fold are hidden, so nothing visible on load flickers,
 * and without JavaScript or under reduced motion every block simply shows.
 */
export function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      }
    }, { rootMargin: "0px 0px -8% 0px" });
    const fold = innerHeight;
    const seen = new Map<Element, number>();
    for (const el of document.querySelectorAll<HTMLElement>(REVEAL)) {
      if (el.dataset.reveal || el.getBoundingClientRect().top < fold) continue;
      // Siblings that enter together arrive in a short stagger.
      const parent = el.parentElement!;
      const order = seen.get(parent) ?? 0;
      seen.set(parent, order + 1);
      el.style.setProperty("--reveal-delay", `${Math.min(order, 5) * 70}ms`);
      el.dataset.reveal = "";
      observer.observe(el);
    }
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
