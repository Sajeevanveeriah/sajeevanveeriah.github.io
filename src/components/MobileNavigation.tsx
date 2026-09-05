"use client";
import Link from "next/link";
import { useRef } from "react";
export function MobileNavigation() {
  const ref = useRef<HTMLDetailsElement>(null);
  return (
    <details
      className="nav-disclosure"
      ref={ref}
      onKeyDown={(e) => {
        if (e.key === "Escape" && ref.current) {
          ref.current.open = false;
          ref.current.querySelector("summary")?.focus();
        }
      }}
    >
      <summary>Menu</summary>
      <nav aria-label="Mobile primary">
        {(
          [
            ["/work/", "Work"],
            ["/about/", "About"],
            ["/notes/", "Notes"],
            ["/#contact", "Contact"],
          ] as const
        ).map(([href, label]) => (
          <Link prefetch={false}
            key={href}
            href={href}
            onClick={() => {
              if (ref.current) ref.current.open = false;
            }}
          >
            {label}
          </Link>
        ))}
      </nav>
    </details>
  );
}
