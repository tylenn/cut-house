"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect } from "react";

import {
  SITE_INTRO_PAGE_AT_MS,
  clearSiteIntro,
  getSiteIntroDoneAtMs,
  hasSiteIntroPlayed,
  markSiteIntroPlayed,
  setSiteIntroPhase,
} from "@/lib/site-intro";

/**
 * Once-per-session opening on the home page — centered tagline on white,
 * then Cut House, the grid, and nav/footer in a tight stagger.
 */
export function SiteOpening({ tagline }: { tagline: string }) {
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (hasSiteIntroPlayed()) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      markSiteIntroPlayed();
      clearSiteIntro();
      return;
    }

    if (pathname !== "/") {
      markSiteIntroPlayed();
      clearSiteIntro();
      return;
    }

    if (!document.documentElement.dataset.siteIntro) {
      setSiteIntroPhase("splash");
    }
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/") {
      clearSiteIntro();
      return;
    }

    if (!document.documentElement.dataset.siteIntro) return;

    const toPage = window.setTimeout(() => {
      setSiteIntroPhase("chrome");
    }, SITE_INTRO_PAGE_AT_MS);

    const done = window.setTimeout(() => {
      clearSiteIntro();
      markSiteIntroPlayed();
    }, getSiteIntroDoneAtMs());

    return () => {
      window.clearTimeout(toPage);
      window.clearTimeout(done);
    };
  }, [pathname]);

  return (
    <>
      <div className="site-opening-backdrop" aria-hidden />
      <p className="site-opening-tagline">{tagline}</p>
    </>
  );
}
