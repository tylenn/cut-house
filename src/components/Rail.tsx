"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { TransitionLink } from "@/components/TransitionLink";
import { formatSiteTitle } from "@/lib/site-intro";
import { COPYRIGHT_HOLDER } from "@/lib/site";
import { Wordmark } from "@/components/Wordmark";

const NAV = [
  { href: "/", label: "projects" },
  { href: "/info", label: "information" },
] as const;

function NavLabel({ label, active }: { label: string; active: boolean }) {
  const transition =
    "col-start-1 row-start-1 transition-opacity duration-(--duration-base) ease-(--ease-out-soft)";

  return (
    <span className="grid">
      <span className={`${transition} ${active ? "opacity-0" : "opacity-100"}`}>
        {label}
      </span>
      <span
        aria-hidden
        className={`${transition} font-semibold ${active ? "opacity-100" : "opacity-0"}`}
      >
        {label}
      </span>
    </span>
  );
}

/**
 * Desktop: nav pinned top-left, wordmark at 50vh in the rail, copyright at the
 * foot.
 *
 * Mobile: the rail collapses to a sticky bar and the nav moves behind a `+`
 * that pushes the page down when opened, per the client's mockup.
 */
export function Rail({ name }: { name: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const mobileTitle = formatSiteTitle(name);

  // Warm the intercepted overlay so the sheet is not waiting on a cold fetch.
  useEffect(() => {
    router.prefetch("/info");
  }, [router]);

  // Storing *which* page the menu was opened on, rather than a bare boolean,
  // means a navigation closes it for free — no effect resetting state, and so
  // no extra render on every route change.
  const [openFor, setOpenFor] = useState<string | null>(null);
  const [infoOrigin, setInfoOrigin] = useState<string | null>(null);
  const open = openFor === pathname;

  const infoOpen =
    pathname === "/info" || pathname.startsWith("/info/");

  const isActive = (href: string) => {
    if (href === "/info") return false;
    if (href === "/") {
      return pathname === "/" || (infoOpen && infoOrigin === "/");
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      // Held still across navigations by ::view-transition-group(rail).
      style={{ viewTransitionName: "rail" }}
      className="site-chrome md:sticky md:top-0 md:relative md:h-screen md:w-(--spacing-rail) md:shrink-0 md:py-5"
    >
      {/* Mobile bar — the whole strip toggles the menu. Home is "projects"
          in the open nav, so the name is not a second, nested control. */}
      <button
        type="button"
        onClick={() => setOpenFor(open ? null : pathname)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        className="site-chrome-mobile stagger-rail bg-(--color-page)/90 sticky top-0 z-30 flex w-full cursor-pointer items-start justify-between px-(--spacing-edge) py-4 text-left backdrop-blur-md md:hidden"
        style={{ "--i": 0 } as React.CSSProperties}
      >
        <div className="site-opening-brand min-w-0 flex-1">
          <span className="site-opening-mobile-name text-(length:--text-title) leading-(--text-title--line-height) font-extrabold tracking-[-0.02em]">
            {mobileTitle}
          </span>
        </div>

        <span
          aria-hidden
          className="site-opening-menu-toggle relative -mr-0.5 mt-0.5 size-[18px] shrink-0"
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
        className="site-chrome-nav grid transition-[grid-template-rows] duration-(--duration-base) ease-(--ease-out-soft) md:hidden"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <nav className="overflow-hidden">
          <div className="px-(--spacing-edge) pt-1 pb-4">
            {NAV.map((item, index) => {
              const active = isActive(item.href);
              return (
                <TransitionLink
                  key={item.href}
                  href={item.href}
                  onClick={
                    item.href === "/info"
                      ? () => setInfoOrigin(pathname)
                      : undefined
                  }
                  className="stagger-rail block w-fit py-0.5"
                  style={{ "--i": index } as React.CSSProperties}
                >
                  <NavLabel label={item.label} active={active} />
                </TransitionLink>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Desktop nav */}
      <nav className="site-chrome-nav hidden px-(--spacing-edge) md:block">
        {NAV.map((item, index) => {
          const active = isActive(item.href);
          return (
            <TransitionLink
              key={item.href}
              href={item.href}
              onClick={
                item.href === "/info"
                  ? () => setInfoOrigin(pathname)
                  : undefined
              }
              className={`stagger-rail -mx-1.5 block w-fit px-1.5 py-0.5 transition-colors duration-(--duration-fast) hover:text-(--color-ink) ${
                active ? "text-(--color-ink)" : "text-(--color-ink-muted)"
              }`}
              style={{ "--i": index } as React.CSSProperties}
            >
              <NavLabel label={item.label} active={active} />
            </TransitionLink>
          );
        })}
      </nav>

      <div
        className="site-opening-brand stagger-rail hidden px-(--spacing-edge) md:block"
        style={{ "--i": NAV.length } as React.CSSProperties}
      >
        <Wordmark name={name} />
      </div>

      <p
        className="site-chrome-meta stagger-rail absolute right-0 bottom-0 left-0 hidden px-(--spacing-edge) text-(length:--text-meta) text-(--color-ink-faint) md:block"
        style={{ "--i": NAV.length + 1 } as React.CSSProperties}
      >
        © {new Date().getFullYear()} {COPYRIGHT_HOLDER}. All rights reserved.
      </p>
    </aside>
  );
}
