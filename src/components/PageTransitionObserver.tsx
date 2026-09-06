"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { PAGE_TRANSITION_READY_EVENT } from "@/lib/page-transition";

/**
 * Signals after a destination route has committed. The white transition cover
 * stays opaque until this fires, so slow routes cannot reveal stale content.
 */
export function PageTransitionObserver() {
  const pathname = usePathname();

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent(PAGE_TRANSITION_READY_EVENT, {
        detail: { pathname },
      }),
    );
  }, [pathname]);

  return null;
}
