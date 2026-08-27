"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, type ComponentProps } from "react";

import type { PushTarget } from "@/lib/routes";

type Props = ComponentProps<typeof Link>;

/**
 * Link that crossfades between pages using the browser's View Transitions API.
 *
 * React 19.2 does not export <ViewTransition> yet, so this drives the native API
 * directly. Pure progressive enhancement: browsers without startViewTransition
 * fall through to an ordinary Next navigation and lose only the crossfade.
 */
export function TransitionLink({ href, onClick, ...props }: Props) {
  const router = useRouter();

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
          // Anything that is not a plain left click belongs to the browser:
          // open-in-new-tab, middle click, and so on.
          event.button !== 0 ||
          !("startViewTransition" in document) ||
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
          return;
        }

        event.preventDefault();

        document.startViewTransition(
          () =>
            new Promise<void>((resolve) => {
              startTransition(() => {
                // Link and router accept the same route universe; the two types
                // are just declared separately.
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
