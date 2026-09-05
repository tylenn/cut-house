import type { MetadataRoute } from "next";

import { siteUrl } from "@/sanity/env";
// Runs outside the request lifecycle, where the Live API cannot reach.
import { client } from "@/sanity/lib/client";
import { SITEMAP_QUERY } from "@/sanity/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await client.fetch(SITEMAP_QUERY);

  const now = new Date();

  return [
    { url: siteUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${siteUrl}/info`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...projects
      .filter((project) => project.slug)
      .map((project) => ({
        url: `${siteUrl}/work/${project.slug}`,
        lastModified: project._updatedAt
          ? new Date(project._updatedAt)
          : undefined,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
  ];
}
