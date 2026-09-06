/**
 * Who the rights belong to.
 *
 * Not derived from the site title, despite reading similarly: the wordmark is
 * set lowercase as "cut house", while the notice names the company properly.
 * Kept in one module because it renders twice — the rail on desktop, the
 * footer on mobile — and two copies of a string drift.
 */
export const COPYRIGHT_HOLDER = "Cut House";

/** Wordmark / browser-tab name. Lowercase on purpose. */
export const SITE_NAME = "cut house";

/** Fallback line under the name on the opening splash and in Sanity. */
export const DEFAULT_TAGLINE =
  "A global production company driven by culture";

const LEGACY_TAGLINES = new Set([
  "a global production services company",
  "A global production services company",
]);

/** CMS tagline, with legacy seed copy mapped to the current default. */
export function resolveSiteTagline(cmsTagline?: string | null): string {
  const trimmed = cmsTagline?.trim();
  if (!trimmed || LEGACY_TAGLINES.has(trimmed)) return DEFAULT_TAGLINE;
  return trimmed;
}

/**
 * Fallback for <meta name="description">, Open Graph, and JSON-LD when Sanity
 * has not set a site description yet.
 */
export const DEFAULT_DESCRIPTION =
  "Cut House is a global production services company. Cinematography and editing by Tylen — purpose-driven visuals for film, advertising, and commercial work.";

/** Name against the first row of a project's credits, above collaborators. */
export const PRINCIPAL = "Tylen";
