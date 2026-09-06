export const SITE_INTRO_KEY = "site-intro-played";
export const SITE_INTRO_GRID_CLASS = "site-intro-grid";

export type SiteIntroPhase = "splash" | "grid" | "chrome";

/** Tagline fade-in — keep in sync with globals.css. */
export const SITE_INTRO_TAGLINE_IN_DURATION_MS = 480;

/** How long the tagline sits fully visible. */
export const SITE_INTRO_TAGLINE_HOLD_MS = 2000;

/** Tagline fade-out to white — keep in sync with globals.css. */
export const SITE_INTRO_TAGLINE_OUT_DURATION_MS = 640;

export const SITE_INTRO_TAGLINE_OUT_AT_MS =
  SITE_INTRO_TAGLINE_IN_DURATION_MS + SITE_INTRO_TAGLINE_HOLD_MS;

/** Full-white beat after the tagline is gone. */
export const SITE_INTRO_WHITE_HOLD_MS = 480;

/** Opening page fade — keep in sync with globals.css. */
export const SITE_INTRO_OPENING_GRID_DURATION_MS = 1300;
export const SITE_INTRO_OPENING_CHROME_DURATION_MS = 950;
export const SITE_INTRO_OPENING_STAGGER_GRID_MS = 90;
export const SITE_INTRO_OPENING_STAGGER_CHROME_MS = 180;
export const SITE_INTRO_OPENING_CHROME_STEP_MS = 35;

/** Max `--i` on rail/footer chrome during the intro (nav + meta + footer). */
export const SITE_INTRO_OPENING_CHROME_ITEM_COUNT = 5;

/** Page reveal begins after the tagline sequence finishes. */
export const SITE_INTRO_PAGE_AT_MS =
  SITE_INTRO_TAGLINE_OUT_AT_MS +
  SITE_INTRO_TAGLINE_OUT_DURATION_MS +
  SITE_INTRO_WHITE_HOLD_MS;

/** Drop intro attributes once the staggered page fade has finished. */
export function getSiteIntroDoneAtMs(): number {
  const gridEnd =
    SITE_INTRO_OPENING_STAGGER_GRID_MS + SITE_INTRO_OPENING_GRID_DURATION_MS;

  const chromeEnd =
    SITE_INTRO_OPENING_STAGGER_CHROME_MS +
    Math.max(0, SITE_INTRO_OPENING_CHROME_ITEM_COUNT - 1) *
      SITE_INTRO_OPENING_CHROME_STEP_MS +
    SITE_INTRO_OPENING_CHROME_DURATION_MS;

  return SITE_INTRO_PAGE_AT_MS + Math.max(gridEnd, chromeEnd) + 100;
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

export function clearHomeEnter(): void {
  delete document.documentElement.dataset.homeEnter;
}
