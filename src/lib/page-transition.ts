"use client";

import { startTransition } from "react";
import type { useRouter } from "next/navigation";

import {
  MOTION_PAGE_OUT_MS,
  MOTION_PAGE_WHITE_HOLD_MS,
  MOTION_REVEAL_IN_MS,
} from "@/lib/motion";
import type { PushTarget } from "@/lib/routes";

const COVER_ID = "page-transition-cover";
export const PAGE_TRANSITION_READY_EVENT = "page-transition-ready";

function ensureCover(): HTMLElement {
  let cover = document.getElementById(COVER_ID);
  if (!cover) {
    cover = document.createElement("div");
    cover.id = COVER_ID;
    cover.className = "page-transition-cover";
    cover.setAttribute("aria-hidden", "true");
    document.body.appendChild(cover);
  }
  return cover;
}

/**
 * Covers the main column in page color, navigates while fully white, then
 * releases so the next screen fades in — no cross-dissolve between videos.
 */
export function runPageWhiteTransition(
  router: ReturnType<typeof useRouter>,
  href: PushTarget,
  targetPath: string,
): void {
  if (targetPath === "/") {
    document.documentElement.dataset.skipHomeEnter = "true";
  }

  const cover = ensureCover();
  cover.classList.remove("is-releasing");
  // Force reflow so rapid back-to-back clicks restart the fade-in.
  void cover.offsetWidth;
  cover.classList.add("is-visible");

  window.setTimeout(() => {
    let released = false;

    const release = () => {
      if (released) return;
      released = true;
      window.removeEventListener(PAGE_TRANSITION_READY_EVENT, onRouteReady);

      window.setTimeout(() => {
        cover.classList.remove("is-visible");
        cover.classList.add("is-releasing");

        window.setTimeout(() => {
          cover.classList.remove("is-releasing");
        }, MOTION_REVEAL_IN_MS);
      }, MOTION_PAGE_WHITE_HOLD_MS);
    };

    const onRouteReady = (event: Event) => {
      if (
        event instanceof CustomEvent &&
        event.detail?.pathname === targetPath
      ) {
        release();
      }
    };

    window.addEventListener(PAGE_TRANSITION_READY_EVENT, onRouteReady);

    startTransition(() => {
      router.push(href);
    });

    // Avoid trapping the page behind the cover if navigation is interrupted.
    window.setTimeout(release, 8000);
  }, MOTION_PAGE_OUT_MS);
}
