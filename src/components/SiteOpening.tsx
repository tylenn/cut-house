"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";

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
 *
 * With an opening clip set in the Studio, the clip plays behind a white
 * tagline, outlasts it, and dissolves straight into the page as the page
 * reveals, with no white beat between. It is fetched only when the splash
 * actually runs, and shown only once it is playing: a blocked autoplay
 * (iPhone Low Power Mode) or a slow network leaves the plain white opening.
 */
export function SiteOpening({
  tagline,
  clipUrl,
}: {
  tagline: string;
  clipUrl?: string;
}) {
  const pathname = usePathname();
  const backdropRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<HTMLVideoElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    if (hasSiteIntroPlayed()) return;

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

    const backdrop = backdropRef.current;
    const clip = clipRef.current;
    const onPlaying = () => {
      if (!clip || clip.dataset.state === "out") return;
      clip.dataset.state = "ready";
      taglineRef.current?.setAttribute("data-on-clip", "");
    };
    if (clip) {
      clip.addEventListener("playing", onPlaying);
      clip.muted = true; // Autoplay is only allowed muted.
      clip.preload = "auto";
      void clip.play().catch(() => {});
    }

    const toPage = window.setTimeout(() => {
      // A playing clip holds the backdrop open, clear of its white, and fades
      // over the page as it reveals. One that never started just goes, and
      // the page reveals on white as without a clip.
      if (clip?.dataset.state === "ready" && backdrop) {
        backdrop.dataset.clip = "fading";
      }
      if (clip) clip.dataset.state = "out";
      setSiteIntroPhase("chrome");
    }, SITE_INTRO_PAGE_AT_MS);

    const done = window.setTimeout(() => {
      if (backdrop) delete backdrop.dataset.clip;
      clip?.pause();
      clearSiteIntro();
      markSiteIntroPlayed();
    }, getSiteIntroDoneAtMs());

    return () => {
      clip?.removeEventListener("playing", onPlaying);
      clip?.pause();
      if (backdrop) delete backdrop.dataset.clip;
      window.clearTimeout(toPage);
      window.clearTimeout(done);
    };
  }, [pathname]);

  return (
    <>
      <div ref={backdropRef} className="site-opening-backdrop" aria-hidden>
        {clipUrl && pathname === "/" ? (
          // preload="none": nothing is fetched unless the splash plays it.
          <video
            ref={clipRef}
            className="site-opening-clip"
            src={clipUrl}
            muted
            loop
            playsInline
            preload="none"
          />
        ) : null}
      </div>
      <p ref={taglineRef} className="site-opening-tagline">
        {tagline}
      </p>
    </>
  );
}
