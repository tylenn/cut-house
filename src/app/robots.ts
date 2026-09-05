import type { MetadataRoute } from "next";

import { siteUrl } from "@/sanity/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/studio", "/api/", "/preview"] },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
