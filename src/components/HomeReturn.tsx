"use client";

import { type ReactNode, useLayoutEffect, useRef } from "react";

import { MOTION_HOME_RETURN_MS } from "@/lib/motion";
import { clearHomeEnter, hasSiteIntroPlayed } from "@/lib/site-intro";

type Props = {
  children: ReactNode;
};

/**
 * After the one-time site intro, the grid and rail fade in on each return to
 * home instead of replaying the opening.
 */
export function HomeReturn({ children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (document.documentElement.dataset.siteIntro) return;
    if (!hasSiteIntroPlayed()) return;
    if (document.documentElement.dataset.skipHomeEnter) {
      delete document.documentElement.dataset.skipHomeEnter;
      return;
    }
    // Project → home already has the white-cover reveal. Replaying the home
    // entrance here would make the persistent rail look like it reloaded.
    if (document.querySelector(".page-transition-cover.is-visible")) return;

    document.documentElement.dataset.homeEnter = "";
    ref.current?.classList.add("animate-home-return");

    const done = window.setTimeout(() => {
      clearHomeEnter();
    }, MOTION_HOME_RETURN_MS);

    return () => {
      window.clearTimeout(done);
      clearHomeEnter();
    };
  }, []);

  return <div ref={ref}>{children}</div>;
}
