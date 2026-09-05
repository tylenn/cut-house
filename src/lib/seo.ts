import type { Metadata } from "next";

import {
  COPYRIGHT_HOLDER,
  DEFAULT_DESCRIPTION,
  PRINCIPAL,
  SITE_NAME,
} from "@/lib/site";
import { siteUrl } from "@/sanity/env";
import { urlFor } from "@/sanity/lib/image";
import { muxPosterUrl } from "@/sanity/lib/mux";

const DEFAULT_SHARE_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: SITE_NAME,
};

type ShareImage = {
  asset?: { _ref?: string | null } | null;
  alt?: string | null;
} | null | undefined;

export function sanityShareUrl(image: ShareImage): string | undefined {
  if (!image?.asset) return undefined;
  return urlFor(image).width(1200).height(630).fit("crop").url();
}

export function projectShareImageUrl(project: {
  seo?: { image?: ShareImage } | null;
  poster?: ShareImage;
  video?: { playbackId?: string | null } | null;
}): string | undefined {
  return (
    sanityShareUrl(project.seo?.image) ??
    sanityShareUrl(project.poster) ??
    (project.video?.playbackId
      ? muxPosterUrl(project.video.playbackId, { width: 1200 })
      : undefined)
  );
}

export function pageMetadata({
  title,
  description,
  path,
  noIndex,
  ogType = "website",
}: {
  title: string;
  description?: string;
  path: string;
  noIndex?: boolean;
  ogType?: "website" | "video.other";
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      url: path,
      type: ogType,
      locale: "en_CA",
      siteName: SITE_NAME,
      images: [DEFAULT_SHARE_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_SHARE_IMAGE],
    },
  };
}

export function siteJsonLd(settings: {
  title?: string | null;
  tagline?: string | null;
  description?: string | null;
  email?: string | null;
  socialLinks?: Array<{ url?: string | null }> | null;
}) {
  const name = settings.title ?? SITE_NAME;
  const description = settings.description ?? DEFAULT_DESCRIPTION;
  const sameAs = (settings.socialLinks ?? [])
    .map((link) => link.url)
    .filter((url): url is string => Boolean(url));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: COPYRIGHT_HOLDER,
        alternateName: name,
        url: siteUrl,
        logo: `${siteUrl}/cut-house-logo.png`,
        image: `${siteUrl}/cut-house-logo.png`,
        description,
        email: settings.email ?? undefined,
        sameAs: sameAs.length ? sameAs : undefined,
        founder: { "@id": `${siteUrl}/#person` },
      },
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: PRINCIPAL,
        jobTitle: "Cinematographer & Editor",
        worksFor: { "@id": `${siteUrl}/#organization` },
        email: settings.email ?? undefined,
        url: siteUrl,
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name,
        url: siteUrl,
        description,
        publisher: { "@id": `${siteUrl}/#organization` },
        inLanguage: "en",
      },
    ],
  };
}

function isoDuration(seconds: number) {
  const total = Math.round(seconds);
  const minutes = Math.floor(total / 60);
  const rest = total % 60;
  return minutes ? `PT${minutes}M${rest}S` : `PT${rest}S`;
}

export function projectJsonLd(
  project: {
    title?: string | null;
    client?: string | null;
    date?: string | null;
    summary?: string | null;
    seo?: { title?: string | null; description?: string | null } | null;
    video?: { playbackId?: string | null; duration?: number | null } | null;
  },
  path: string,
  image?: string,
) {
  const name = project.seo?.title ?? project.title ?? "Untitled";
  const description = project.seo?.description ?? project.summary ?? undefined;
  const url = `${siteUrl}${path}`;

  const shared = {
    name,
    description,
    url,
    creator: { "@id": `${siteUrl}/#person` },
    publisher: { "@id": `${siteUrl}/#organization` },
    about: project.client ?? undefined,
  };

  if (project.video?.playbackId) {
    return {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      ...shared,
      thumbnailUrl: image,
      uploadDate: project.date ?? undefined,
      duration: project.video.duration
        ? isoDuration(project.video.duration)
        : undefined,
    };
  }

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    ...shared,
    image,
    dateCreated: project.date ?? undefined,
  };
}

export function infoJsonLd({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: title,
    description,
    url: `${siteUrl}/info`,
    isPartOf: { "@id": `${siteUrl}/#website` },
    mainEntity: { "@id": `${siteUrl}/#organization` },
  };
}
