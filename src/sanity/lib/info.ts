import { cache } from "react";

import { sanityFetch } from "@/sanity/lib/live";
import { INFO_PAGE_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";

/** Shared by the info page and intercepted overlay; deduped within a request. */
export const getInfoSheetData = cache(async () => {
  const [{ data: info }, { data: settings }] = await Promise.all([
    sanityFetch({ query: INFO_PAGE_QUERY }),
    sanityFetch({ query: SITE_SETTINGS_QUERY }),
  ]);

  return { info, settings };
});
