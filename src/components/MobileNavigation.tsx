"use client";
import Link from "next/link";
import { useRef } from "react";

const links = [
  ["/work/", "Work"],
  ["/about/", "About"],
  ["/blog/", "Journal"],
  ["/notes/", "Notes"],
  ["/#services", "Services"],
  ["/#contact", "Contact"],
] as const;

export function MobileNavigation() {
  const ref = useRef<HTMLDetailsElement>(null);
  const close = () => {
    if (ref.current) ref.current.open = false;
  };
  return (
    <details
      className="nav-disclosure"
      ref={ref}
      onKeyDown={(e) => {
        if (e.key === "Escape" && ref.current) {
          close();
          ref.current.querySelector("summary")?.focus();
        }
      }}
    >
      <summary>Menu</summary>
      <nav aria-label="Mobile primary">
        {links.map(([href, label]) => (
          <Link prefetch={false} key={href} href={href} onClick={close}>
            {label}
          </Link>
        ))}
      </nav>
    </details>
  );
}
