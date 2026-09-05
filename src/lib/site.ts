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

/**
 * Fallback for <meta name="description">, Open Graph, and JSON-LD when Sanity
 * has not set a site description yet.
 */
export const DEFAULT_DESCRIPTION =
  "Cut House is a global production services company. Cinematography and editing by Tylen — purpose-driven visuals for film, advertising, and commercial work.";

/** Name against the first row of a project's credits, above collaborators. */
export const PRINCIPAL = "Tylen";
