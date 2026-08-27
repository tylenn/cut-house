import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";

import { isPlaceholderProject, siteUrl } from "@/sanity/env";
import { SanityLive } from "@/sanity/lib/live";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
