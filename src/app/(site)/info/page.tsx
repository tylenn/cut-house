import type { Metadata } from "next";

import { InfoOverlay } from "@/components/InfoOverlay";
import { InfoSheet } from "@/components/InfoSheet";
import { JsonLd } from "@/components/JsonLd";
import { ProjectGrid } from "@/components/ProjectGrid";
import { infoJsonLd, pageMetadata } from "@/lib/seo";
import { sanityFetch } from "@/sanity/lib/live";
import { INFO_PAGE_QUERY, PROJECTS_QUERY } from "@/sanity/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const { data: info } = await sanityFetch({
    query: INFO_PAGE_QUERY,
    stega: false,
  });

  const title = info?.seo?.title ?? info?.heading ?? "Information";
  const description = info?.seo?.description ?? undefined;

  return pageMetadata({
    title,
    description,
    path: "/info",
    noIndex: Boolean(info?.seo?.noIndex),
  });
}

/**
 * A hard load of /info, or a shared link. Interception does not apply here, so
 * the grid has to be drawn to sit behind the sheet — the composition then
 * matches what a click from inside the site produces.
 */
export default async function InfoPage() {
  const [{ data: projects }, { data: info }] = await Promise.all([
    sanityFetch({ query: PROJECTS_QUERY }),
    sanityFetch({ query: INFO_PAGE_QUERY, stega: false }),
  ]);

  const title = info?.seo?.title ?? info?.heading ?? "Information";
  const description = info?.seo?.description ?? undefined;

  return (
    <div className="relative min-h-screen">
      <JsonLd data={infoJsonLd({ title, description })} />
      <div aria-hidden className="pointer-events-none">
        <ProjectGrid projects={projects ?? []} />
      </div>

      <InfoOverlay>
        <InfoSheet />
      </InfoOverlay>
    </div>
  );
}
