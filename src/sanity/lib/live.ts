import { defineLive } from "next-sanity/live";

import { readToken } from "@/sanity/env";
import { client } from "@/sanity/lib/client";

/**
 * Live Content API. In production this serves cached static data with sync tags
 * attached per query; in draft mode it revalidates over a websocket so Studio
 * edits appear without a reload.
 *
 * `serverToken` and `browserToken` both need Viewer role.
 */
export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: readToken,
  browserToken: readToken,
});
