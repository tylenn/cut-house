export const SITE_INTRO_KEY = "site-intro-played";
export const SITE_INTRO_GRID_CLASS = "site-intro-grid";

export type SiteIntroPhase = "splash" | "grid" | "chrome";

/** Tagline fade-out — keep in sync with globals.css. */
export const SITE_INTRO_TAGLINE_OUT_AT_MS = 6000;
export const SITE_INTRO_TAGLINE_OUT_DURATION_MS = 700;

/** Opening grid motion — keep in sync with globals.css. */
export const SITE_INTRO_OPENING_GRID_DURATION_MS = 900;
export const SITE_INTRO_OPENING_GRID_STAGGER_MS = 65;

/** When the grid stagger begins — as soon as the tagline fade finishes. */
export const SITE_INTRO_GRID_AT_MS =
  SITE_INTRO_TAGLINE_OUT_AT_MS + SITE_INTRO_TAGLINE_OUT_DURATION_MS;

/** Nav and footer — shortly after the first grid tiles land. */
export const SITE_INTRO_CHROME_AT_MS = SITE_INTRO_GRID_AT_MS + 900;

/** Drop intro attributes once grid tiles and chrome have finished. */
export function getSiteIntroDoneAtMs(gridItemCount = 0): number {
  const gridAnimationEnd =
    SITE_INTRO_GRID_AT_MS +
    Math.max(0, gridItemCount - 1) * SITE_INTRO_OPENING_GRID_STAGGER_MS +
    SITE_INTRO_OPENING_GRID_DURATION_MS;

  return Math.max(
    SITE_INTRO_CHROME_AT_MS + 800,
    gridAnimationEnd + 100,
  );
}

export function hasSiteIntroPlayed(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return sessionStorage.getItem(SITE_INTRO_KEY) === "1";
  } catch {
    return true;
  }
}

export function markSiteIntroPlayed(): void {
  try {
    sessionStorage.setItem(SITE_INTRO_KEY, "1");
  } catch {
    // Private browsing can block sessionStorage — intro still runs once this load.
  }
}

export function formatSiteTitle(name: string): string {
  return name.replace(/\b\w/g, (char) => char.toUpperCase());
}

/** Runs before paint on the home page so the first view can open cold. */
export const SITE_INTRO_BOOTSTRAP = `(function(){try{if(sessionStorage.getItem("${SITE_INTRO_KEY}"))return;if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){sessionStorage.setItem("${SITE_INTRO_KEY}","1");return}if(location.pathname==="/")document.documentElement.dataset.siteIntro="splash"}catch(e){}})();`;

export function setSiteIntroPhase(phase: SiteIntroPhase): void {
  document.documentElement.dataset.siteIntro = phase;
  if (phase === "grid" || phase === "chrome") {
    document.documentElement.classList.add(SITE_INTRO_GRID_CLASS);
  }
}

export function clearSiteIntro(): void {
  delete document.documentElement.dataset.siteIntro;
  document.documentElement.classList.remove(SITE_INTRO_GRID_CLASS);
}
