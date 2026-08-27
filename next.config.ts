import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  // Pin the workspace root. There is an unrelated package-lock.json one level up
  // in ~/Documents/GitHub, and without this Turbopack warns about inferring it.
  turbopack: { root: dirname(fileURLToPath(import.meta.url)) },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      // Poster frames and animated loops derived from the Mux playback ID.
      { protocol: "https", hostname: "image.mux.com" },
    ],
  },
  async redirects() {
    // The old static site is archived under legacy/. Keep its two URLs alive.
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/info.html", destination: "/info", permanent: true },
    ];
  },
};

export default nextConfig;
