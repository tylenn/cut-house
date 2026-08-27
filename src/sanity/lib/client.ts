import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId, studioUrl } from "@/sanity/env";

/**
 * The plain client. Reads should go through `sanityFetch` in ./live instead —
 * the only legitimate callers here are `generateStaticParams` and `sitemap.ts`,
 * which run outside the request lifecycle where the Live API cannot reach.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
  stega: { studioUrl },
});
