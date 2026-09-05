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
import { SanityLive } from "@/sanity/lib/live";

import "./globals.css";

export const metadata: Metadata = {
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

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <html lang="en">
      <body>
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
