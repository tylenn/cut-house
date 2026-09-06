"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { startTransition, type ComponentProps } from "react";

import { runPageWhiteTransition } from "@/lib/page-transition";
import type { Href, PushTarget } from "@/lib/routes";
import { pathFromHref, usesPageWhiteTransition } from "@/lib/routes";

type Props = ComponentProps<typeof Link>;

/** Overlays sit on top of the current page — a root crossfade reads as a delay. */
function usesViewTransition(href: Href) {
  return pathFromHref(href) !== "/info";
}

/**
 * Link that transitions between pages using the View Transitions API, except
 * grid ↔ project detail which fades main to page color before navigating.
 */
export function TransitionLink({ href, onClick, ...props }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Link
      href={href}
      onClick={(event) => {
        onClick?.(event);

        if (
          event.defaultPrevented ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          event.button !== 0 ||
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
          return;
        }

        const to = pathFromHref(href);

        if (usesPageWhiteTransition(pathname, to)) {
          event.preventDefault();
          runPageWhiteTransition(router, href as PushTarget, to!);
          return;
        }

        if (
          !("startViewTransition" in document) ||
          !usesViewTransition(href)
        ) {
          return;
        }

        event.preventDefault();

        document.startViewTransition(
          () =>
            new Promise<void>((resolve) => {
              startTransition(() => {
                router.push(href as PushTarget);
                resolve();
              });
            }),
        );
      }}
      {...props}
    />
  );
}
