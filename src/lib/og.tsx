import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { SITE_NAME } from "@/lib/site";
import { client } from "@/sanity/lib/client";
import {
  INFO_PAGE_QUERY,
  PROJECT_QUERY,
  SITE_SETTINGS_QUERY,
} from "@/sanity/lib/queries";

import { projectShareImageUrl, sanityShareUrl } from "./seo";

export const ogAlt = SITE_NAME;
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const logoSrc = `data:image/png;base64,${(
  await readFile(join(process.cwd(), "public/cut-house-logo.png"))
).toString("base64")}`;

export function renderBrandOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#ffffff",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* ImageResponse / Satori cannot use next/image. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} height="360" alt="" />
      </div>
    ),
    { ...ogSize },
  );
}

function renderCoverOgImage(src: string) {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#111111",
          width: "100%",
          height: "100%",
          display: "flex",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          width={ogSize.width}
          height={ogSize.height}
          alt=""
          style={{ objectFit: "cover" }}
        />
      </div>
    ),
    { ...ogSize },
  );
}

/** Default share image — local logo only, so the route stays static. */
export function renderSiteOgImage() {
  return renderBrandOgImage();
}

export async function renderProjectOgImage(slug: string) {
  try {
    const project = await client.fetch(PROJECT_QUERY, { slug });
    const src = project ? projectShareImageUrl(project) : undefined;
    if (src) return renderCoverOgImage(src);
  } catch {
    // Published share cards should still render if the dataset is unreachable.
  }
  return renderBrandOgImage();
}

export async function renderInfoOgImage() {
  try {
    const [info, settings] = await Promise.all([
      client.fetch(INFO_PAGE_QUERY),
      client.fetch(SITE_SETTINGS_QUERY),
    ]);
    const src =
      sanityShareUrl(info?.seo?.image) ?? sanityShareUrl(settings?.ogImage);
    if (src) return renderCoverOgImage(src);
  } catch {
    // Fall through to the brand mark.
  }
  return renderBrandOgImage();
}
