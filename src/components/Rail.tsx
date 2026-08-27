"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

import { TransitionLink } from "@/components/TransitionLink";
import { Wordmark } from "@/components/Wordmark";

const NAV = [
  { href: "/", label: "projects" },
  { href: "/info", label: "information" },
] as const;

/**
 * Desktop: nav pinned top-left, wordmark vertically centred, copyright at the
 * foot. The wordmark's position and size are shared with the intro, which is
 * why the handoff at the end of the intro needs no animation at all.
 *
 * Mobile: the rail collapses to a sticky bar and the nav moves behind a `+`
 * that pushes the page down when opened, per the client's mockup.
 */
export function Rail({ name, tagline }: { name: string; tagline?: string }) {
  const pathname = usePathname();

  // Storing *which* page the menu was opened on, rather than a bare boolean,
  // means a navigation closes it for free — no effect resetting state, and so
  // no extra render on every route change.
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor === pathname;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <aside
      // Held still across navigations by ::view-transition-group(rail).
      style={{ viewTransitionName: "rail" }}
      className="md:sticky md:top-0 md:flex md:h-screen md:w-(--spacing-rail) md:shrink-0 md:flex-col md:justify-between md:py-5"
    >
      {/* Mobile bar */}
      <div className="bg-(--color-page)/90 sticky top-0 z-30 flex items-center justify-between px-(--spacing-edge) py-4 backdrop-blur-md md:hidden">
        <TransitionLink href="/" className="flex gap-2">
          <span>{name}</span>
          {tagline ? (
            <span className="text-(--color-ink-muted)">{tagline}</span>
          ) : null}
        </TransitionLink>

        <button
          type="button"
          onClick={() => setOpenFor(open ? null : pathname)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="relative h-5 w-5"
        >
          {/* Two strokes that rotate into an ×, rather than swapping glyphs. */}
          <span
            className="absolute top-1/2 left-0 block h-px w-5 bg-current transition-transform duration-(--duration-base) ease-(--ease-out-soft)"
            style={{ transform: open ? "rotate(45deg)" : "none" }}
          />
          <span
            className="absolute top-1/2 left-0 block h-px w-5 bg-current transition-transform duration-(--duration-base) ease-(--ease-out-soft)"
            style={{ transform: open ? "rotate(-45deg)" : "rotate(90deg)" }}
          />
        </button>
      </div>

      {/* Mobile menu: grid-rows 0fr -> 1fr animates height without a magic max-height. */}
      <div
        id="mobile-nav"
        className="grid transition-[grid-template-rows] duration-(--duration-base) ease-(--ease-out-soft) md:hidden"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <nav className="overflow-hidden">
          <div className="px-(--spacing-edge) pt-1 pb-4">
            {NAV.map((item) => (
              <TransitionLink
                key={item.href}
                href={item.href}
                className={`block py-0.5 ${isActive(item.href) ? "font-semibold" : ""}`}
              >
                {item.label}
              </TransitionLink>
            ))}
          </div>
        </nav>
      </div>

      {/* Desktop nav */}
      <nav className="hidden px-(--spacing-edge) md:block">
        {NAV.map((item) => (
          <TransitionLink
            key={item.href}
            href={item.href}
            className={`-mx-1.5 block w-fit rounded-[2px] px-1.5 py-0.5 transition-colors duration-(--duration-fast) hover:bg-(--color-hover) ${
              isActive(item.href)
                ? "font-semibold text-(--color-ink)"
                : "text-(--color-ink-muted)"
            }`}
          >
            {item.label}
          </TransitionLink>
        ))}
      </nav>

      <div className="hidden px-(--spacing-edge) md:block">
        <Wordmark name={name} />
      </div>

      <p className="hidden px-(--spacing-edge) text-(length:--text-meta) text-(--color-ink-faint) md:block">
        ©{new Date().getFullYear()} {name}. All rights reserved. No part of this
        website may be reproduced without permission.
      </p>
    </aside>
  );
}
