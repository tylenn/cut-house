"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

import { TransitionLink } from "@/components/TransitionLink";
import { COPYRIGHT_HOLDER } from "@/lib/site";
import { Wordmark } from "@/components/Wordmark";

const NAV = [
  { href: "/", label: "projects" },
  { href: "/info", label: "information" },
] as const;

/**
 * Desktop: nav pinned top-left, wordmark vertically centred, copyright at the
 * foot.
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
          // The glyph is narrower than its 20px target, so the button is pulled
          // 2px right: what should line up with the wordmark's inset is the
          // plus's own edge, not the edge of the box it is centred in.
          className="relative -mr-0.5 h-5 w-5"
        >
          {/* Two strokes that rotate into an ×, rather than swapping glyphs. */}
          <span
            className="absolute top-1/2 left-1/2 -mt-[0.75px] -ml-2 block h-[1.5px] w-4 bg-current transition-transform duration-(--duration-base) ease-(--ease-out-soft)"
            style={{ transform: open ? "rotate(45deg)" : "none" }}
          />
          <span
            className="absolute top-1/2 left-1/2 -mt-[0.75px] -ml-2 block h-[1.5px] w-4 bg-current transition-transform duration-(--duration-base) ease-(--ease-out-soft)"
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
            // Negative margin cancels the padding, so the target stays large
            // without the label shifting off the rail's optical left edge.
            className={`-mx-1.5 block w-fit px-1.5 py-0.5 transition-colors duration-(--duration-fast) ${
              isActive(item.href)
                ? "font-semibold text-(--color-ink)"
                : "text-(--color-ink-muted) hover:text-(--color-ink)"
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
        © {new Date().getFullYear()} {COPYRIGHT_HOLDER}. All rights reserved.
      </p>
    </aside>
  );
}
