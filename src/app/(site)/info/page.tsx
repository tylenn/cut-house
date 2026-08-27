import type { Metadata } from "next";

import { InfoOverlay } from "@/components/InfoOverlay";
import { PortableText } from "@/components/PortableText";
import { ProjectGrid } from "@/components/ProjectGrid";
import { SanityImage } from "@/components/SanityImage";
import { sanityFetch } from "@/sanity/lib/live";
import {
  INFO_PAGE_QUERY,
  PROJECTS_QUERY,
  SITE_SETTINGS_QUERY,
} from "@/sanity/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const { data: info } = await sanityFetch({
    query: INFO_PAGE_QUERY,
    stega: false,
  });

  return {
    title: info?.seo?.title ?? info?.heading ?? "Information",
    description: info?.seo?.description ?? undefined,
    robots: info?.seo?.noIndex ? { index: false, follow: false } : undefined,
  };
}

export default async function InfoPage() {
  const [{ data: info }, { data: settings }, { data: projects }] =
    await Promise.all([
      sanityFetch({ query: INFO_PAGE_QUERY }),
      sanityFetch({ query: SITE_SETTINGS_QUERY }),
      sanityFetch({ query: PROJECTS_QUERY }),
    ]);

  const links = settings?.socialLinks ?? [];

  return (
    <div className="relative min-h-screen">
      {/* Rendered, not faked. A direct visit to /info or a shared link lands on
          the same composition as clicking through from the grid. */}
      <div aria-hidden className="pointer-events-none">
        <ProjectGrid projects={projects ?? []} />
      </div>

      <InfoOverlay>
        <div className="max-w-[68ch] md:pl-0">
          {info?.heading ? (
            <h1 className="mb-8 font-semibold">{info.heading}</h1>
          ) : null}

          {settings?.email || links.length ? (
            <section className="mb-8">
              <h2 className="font-semibold">Contact</h2>
              {settings?.email ? (
                <a
                  href={`mailto:${settings.email}`}
                  className="block text-(--color-ink-muted) transition-colors duration-(--duration-fast) hover:text-(--color-ink)"
                >
                  {settings.email}
                </a>
              ) : null}
              {links.map((link) => (
                <a
                  key={link._key}
                  href={link.url ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-(--color-ink-muted) transition-colors duration-(--duration-fast) hover:text-(--color-ink)"
                >
                  {link.label}
                </a>
              ))}
            </section>
          ) : null}

          {info?.portrait?.asset ? (
            <div className="mb-8 max-w-sm">
              <SanityImage
                image={info.portrait}
                sizes="(max-width: 768px) 100vw, 40vw"
                className="h-auto w-full"
              />
            </div>
          ) : null}

          {info?.bio?.length ? (
            <section className="mb-8">
              <h2 className="mb-1 font-semibold">Description</h2>
              <PortableText value={info.bio} />
            </section>
          ) : null}

          {info?.clients?.length ? (
            <section className="mb-8">
              <h2 className="mb-1 font-semibold">Clients</h2>
              <ul>
                {info.clients.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {settings?.resumeUrl ? (
            <a
              href={settings.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block underline underline-offset-2"
            >
              Download resume
            </a>
          ) : null}
        </div>
      </InfoOverlay>
    </div>
  );
}
