"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect } from "react";

import {
  SITE_INTRO_CHROME_AT_MS,
  SITE_INTRO_GRID_AT_MS,
  clearSiteIntro,
  getSiteIntroDoneAtMs,
  hasSiteIntroPlayed,
  markSiteIntroPlayed,
  setSiteIntroPhase,
} from "@/lib/site-intro";

/**
 * Once-per-session opening on the home page — splash backdrop, centered
 * tagline, and phase timing. The wordmark lives in the rail.
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

    const toGrid = window.setTimeout(() => {
      setSiteIntroPhase("grid");
    }, SITE_INTRO_GRID_AT_MS);

    const toChrome = window.setTimeout(() => {
      setSiteIntroPhase("chrome");
    }, SITE_INTRO_CHROME_AT_MS);

    const gridItemCount =
      document.querySelectorAll("main .stagger-child").length;
    const done = window.setTimeout(() => {
      clearSiteIntro();
      markSiteIntroPlayed();
    }, getSiteIntroDoneAtMs(gridItemCount));

    return () => {
      window.clearTimeout(toGrid);
      window.clearTimeout(toChrome);
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
