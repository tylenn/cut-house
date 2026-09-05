import type { Metadata } from "next";

import { ProjectGrid } from "@/components/ProjectGrid";
import { DEFAULT_DESCRIPTION, SITE_NAME } from "@/lib/site";
import { sanityFetch } from "@/sanity/lib/live";
import { PROJECTS_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  // stega: false — metadata strings must not carry invisible Visual Editing
  // characters, they end up in <title> and og: tags verbatim.
  const { data: settings } = await sanityFetch({
    query: SITE_SETTINGS_QUERY,
    stega: false,
  });

  const title = settings?.title ?? SITE_NAME;
  const description = settings?.description ?? DEFAULT_DESCRIPTION;

  return {
    // absolute so the root title template does not become "cut house — cut house".
    title: { absolute: title },
    description,
    alternates: { canonical: "/" },
    openGraph: {
      title,
      description,
      url: "/",
      type: "website",
      locale: "en_CA",
      siteName: SITE_NAME,
      images: [
        { url: "/og.png", width: 1200, height: 630, alt: title },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.png"],
    },
  };
}

export default async function HomePage() {
  const { data: projects } = await sanityFetch({ query: PROJECTS_QUERY });

  return <ProjectGrid projects={projects ?? []} />;
}
