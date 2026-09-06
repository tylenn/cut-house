"use client";

import { type ReactNode, useLayoutEffect, useState } from "react";

import { hasSiteIntroPlayed } from "@/lib/site-intro";

type Props = {
  children: ReactNode;
};

/**
 * After the one-time site intro, the grid fades in on each return to home
 * instead of replaying the full stagger.
 */
export function HomeReturn({ children }: Props) {
  const [fadeIn, setFadeIn] = useState(false);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (document.documentElement.dataset.siteIntro) return;
    if (!hasSiteIntroPlayed()) return;

    setFadeIn(true);
  }, []);

  return (
    <div className={fadeIn ? "animate-home-return" : undefined}>{children}</div>
  );
}
