import type { Metadata } from "next";

import { ProjectGrid } from "@/components/ProjectGrid";
import { sanityFetch } from "@/sanity/lib/live";
import { PROJECTS_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  // stega: false — metadata strings must not carry invisible Visual Editing
  // characters, they end up in <title> and og: tags verbatim.
  const { data: settings } = await sanityFetch({
    query: SITE_SETTINGS_QUERY,
    stega: false,
  });

  return {
    title: settings?.title ?? "Cut House Co.",
    description: settings?.description ?? undefined,
  };
}

export default async function HomePage() {
  const { data: projects } = await sanityFetch({ query: PROJECTS_QUERY });

  return <ProjectGrid projects={projects ?? []} />;
}
