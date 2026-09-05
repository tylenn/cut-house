"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
export function Rail({ name }: { name: string }) {
  const pathname = usePathname();
  const router = useRouter();

  // Warm the intercepted overlay so the sheet is not waiting on a cold fetch.
  useEffect(() => {
    router.prefetch("/info");
  }, [router]);

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
      {/* Mobile bar — the whole strip toggles the menu. Home is "projects"
          in the open nav, so the name is not a second, nested control. */}
      <button
        type="button"
        onClick={() => setOpenFor(open ? null : pathname)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        className="stagger-rail bg-(--color-page)/90 sticky top-0 z-30 flex w-full cursor-pointer items-center justify-between px-(--spacing-edge) py-4 text-left backdrop-blur-md md:hidden"
        style={{ "--i": 0 } as React.CSSProperties}
      >
        <span className="text-(length:--text-title) leading-(--text-title--line-height) font-extrabold tracking-[-0.02em]">
          {name}
        </span>

        <span
          aria-hidden
          // 18px box (2px under the original 20px hit area). The glyph is
          // narrower, so it is pulled 2px right: the plus's own edge lines
          // up with the name's inset, not the box it is centred in.
          className="relative -mr-0.5 size-[18px]"
        >
          {/* Two strokes that rotate into an ×, rather than swapping glyphs. */}
          <span
            className="absolute top-1/2 left-1/2 -mt-[0.75px] -ml-[7px] block h-[1.5px] w-[14px] bg-current transition-transform duration-(--duration-base) ease-(--ease-out-soft)"
            style={{ transform: open ? "rotate(45deg)" : "none" }}
          />
          <span
            className="absolute top-1/2 left-1/2 -mt-[0.75px] -ml-[7px] block h-[1.5px] w-[14px] bg-current transition-transform duration-(--duration-base) ease-(--ease-out-soft)"
            style={{ transform: open ? "rotate(-45deg)" : "rotate(90deg)" }}
          />
        </span>
      </button>

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
        {NAV.map((item, index) => (
          <TransitionLink
            key={item.href}
            href={item.href}
            className={`stagger-rail -mx-1.5 block w-fit px-1.5 py-0.5 ${
              isActive(item.href)
                ? "font-semibold text-(--color-ink)"
                : "text-(--color-ink-muted) transition-colors duration-(--duration-fast) hover:text-(--color-ink)"
            }`}
            style={{ "--i": index } as React.CSSProperties}
          >
            {item.label}
          </TransitionLink>
        ))}
      </nav>

      <div
        className="stagger-rail hidden px-(--spacing-edge) md:block"
        style={{ "--i": NAV.length } as React.CSSProperties}
      >
        <Wordmark name={name} />
      </div>

      <p
        className="stagger-rail hidden px-(--spacing-edge) text-(length:--text-meta) text-(--color-ink-faint) md:block"
        style={{ "--i": NAV.length + 1 } as React.CSSProperties}
      >
        © {new Date().getFullYear()} {COPYRIGHT_HOLDER}. All rights reserved.
      </p>
    </aside>
  );
}
