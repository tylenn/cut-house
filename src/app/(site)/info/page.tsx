import type { Metadata } from "next";

import { InfoOverlay } from "@/components/InfoOverlay";
import { InfoSheet } from "@/components/InfoSheet";
import { ProjectGrid } from "@/components/ProjectGrid";
import { sanityFetch } from "@/sanity/lib/live";
import { INFO_PAGE_QUERY, PROJECTS_QUERY } from "@/sanity/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const { data: info } = await sanityFetch({
    query: INFO_PAGE_QUERY,
    stega: false,
  });

  return {
    title: info?.seo?.title ?? info?.heading ?? "Information",
    description: info?.seo?.description ?? undefined,
    robots: info?.seo?.noIndex ? { index: false, follow: false } : undefined,
  };
}

/**
 * A hard load of /info, or a shared link. Interception does not apply here, so
 * the grid has to be drawn to sit behind the sheet — the composition then
 * matches what a click from inside the site produces.
 */
export default async function InfoPage() {
  const { data: projects } = await sanityFetch({ query: PROJECTS_QUERY });

  return (
    <div className="relative min-h-screen">
      <div aria-hidden className="pointer-events-none">
        <ProjectGrid projects={projects ?? []} />
      </div>

      <InfoOverlay>
        <InfoSheet />
      </InfoOverlay>
    </div>
  );
}
