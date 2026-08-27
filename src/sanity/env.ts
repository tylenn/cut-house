/**
 * Every Sanity/site env var is read here and nowhere else.
 *
 * `required()` throws at module load rather than letting an undefined project ID
 * surface later as a confusing 404 from the Content Lake.
 *
 * Note: `sanity schema extract` evaluates sanity.config.ts, so typegen needs
 * these present. Placeholder values are fine for extraction — the generated
 * types depend on the schema and the queries, not on real data.
 */

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. See .env.example and copy it to .env.local.`,
    );
  }
  return value;
}

export const projectId = required(
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
);

export const dataset = required(
  "NEXT_PUBLIC_SANITY_DATASET",
  process.env.NEXT_PUBLIC_SANITY_DATASET,
);

export const apiVersion = required(
  "NEXT_PUBLIC_SANITY_API_VERSION",
  process.env.NEXT_PUBLIC_SANITY_API_VERSION,
);

/** Viewer-role token. Server-only: draft previews and the Live Content API. */
export const readToken = process.env.SANITY_API_READ_TOKEN;

/** Shared secret on the Sanity webhook that hits /api/revalidate. */
export const revalidateSecret = process.env.SANITY_REVALIDATE_SECRET;

/**
 * Canonical origin for absolute URLs (OG images, sitemap, robots).
 * Falls back to Vercel's production URL so preview deploys still emit absolute URLs.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");

export const studioUrl = "/studio";

/**
 * True while .env.local still holds the shipped placeholder.
 *
 * Used only to show a setup panel in development instead of a Content Lake 404.
 * Production behaviour is untouched on purpose: a real deploy against an
 * unreachable dataset must still fail loudly rather than ship an empty site.
 */
export const isPlaceholderProject =
  process.env.NODE_ENV !== "production" && projectId === "placeholder";
