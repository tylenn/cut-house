"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";

import {
  SITE_INTRO_PAGE_AT_MS,
  SITE_INTRO_TAGLINE_OUT_AT_MS,
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
 * tagline and fades out with it. It is fetched only when the splash actually
 * runs, and shown only once it is playing: a blocked autoplay (iPhone Low
 * Power Mode) or a slow network leaves the plain white opening.
 */
export function SiteOpening({
  tagline,
  clipUrl,
}: {
  tagline: string;
  clipUrl?: string;
}) {
  const pathname = usePathname();
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

    // Out with the tagline, whether or not the clip ever showed.
    const clipOut = window.setTimeout(() => {
      if (clip) clip.dataset.state = "out";
    }, SITE_INTRO_TAGLINE_OUT_AT_MS);

    const toPage = window.setTimeout(() => {
      setSiteIntroPhase("chrome");
    }, SITE_INTRO_PAGE_AT_MS);

    const done = window.setTimeout(() => {
      clip?.pause();
      clearSiteIntro();
      markSiteIntroPlayed();
    }, getSiteIntroDoneAtMs());

    return () => {
      clip?.removeEventListener("playing", onPlaying);
      clip?.pause();
      window.clearTimeout(clipOut);
      window.clearTimeout(toPage);
      window.clearTimeout(done);
    };
  }, [pathname]);

  return (
    <>
      <div className="site-opening-backdrop" aria-hidden>
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
