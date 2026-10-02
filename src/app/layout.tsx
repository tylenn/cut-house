import type { Metadata, Viewport } from "next";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";

import {
  COPYRIGHT_HOLDER,
  DEFAULT_DESCRIPTION,
  PRINCIPAL,
  SITE_NAME,
} from "@/lib/site";
import { isPlaceholderProject, siteUrl } from "@/sanity/env";
import { SanityLive, sanityFetch } from "@/sanity/lib/live";
import { SITE_ICON_QUERY } from "@/sanity/lib/queries";
import { SITE_INTRO_BOOTSTRAP } from "@/lib/site-intro";

import "./globals.css";

const baseMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: SITE_NAME,
    template: `%s — ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: COPYRIGHT_HOLDER,
  authors: [{ name: PRINCIPAL, url: siteUrl }],
  creator: PRINCIPAL,
  publisher: COPYRIGHT_HOLDER,
  keywords: [
    "cut house",
    "cinematography",
    "film editor",
    "production services",
    "commercial video",
    "Tylen",
  ],
  referrer: "origin-when-cross-origin",
  formatDetection: { telephone: false, address: false },
  category: "portfolio",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_CA",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
  },
  appleWebApp: {
    title: SITE_NAME,
    capable: true,
    statusBarStyle: "default",
  },
};

/** Square PNG at `size` from a Sanity image URL (SVGs are rasterised too). */
function iconAt(url: string, size: number) {
  return {
    url: `${url}?w=${size}&h=${size}&fit=crop&fm=png`,
    sizes: `${size}x${size}`,
    type: "image/png",
  };
}

/**
 * The favicon set in Site settings, falling back to the built-in mark in
 * public/. Deliberately not app/icon.* or app/apple-icon.*: file-based icons
 * override this, so a Studio upload would never show.
 */
export async function generateMetadata(): Promise<Metadata> {
  // Every page, the Studio included, runs this: an icon is not worth failing
  // a page over, so any error falls back to the built-in mark.
  let favicon: string | null = null;
  if (!isPlaceholderProject) {
    try {
      ({ data: favicon } = await sanityFetch({
        query: SITE_ICON_QUERY,
        stega: false,
      }));
    } catch {
      favicon = null;
    }
  }

  return {
    ...baseMetadata,
    icons: favicon
      ? {
          icon: [iconAt(favicon, 32), iconAt(favicon, 192)],
          apple: iconAt(favicon, 180),
        }
      : {
          icon: { url: "/icon.svg", type: "image/svg+xml" },
          apple: "/apple-icon.png",
        },
  };
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* Sets data-site-intro before paint on first home visit — see site-intro.ts. */}
        <script dangerouslySetInnerHTML={{ __html: SITE_INTRO_BOOTSTRAP }} />
        {children}
        {/* Attaches sync tags per query so published edits appear without a deploy.
            Skipped while the project ID is still the placeholder, where it would
            only retry a CORS failure every few seconds. */}
        {isPlaceholderProject ? null : <SanityLive />}
        {isDraftMode ? <VisualEditing /> : null}
      </body>
    </html>
  );
}
