import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/JsonLd";
import { PortableText } from "@/components/PortableText";
import { ProjectPageStagger } from "@/components/ProjectPageStagger";
import { pageMetadata, projectJsonLd, projectShareImageUrl } from "@/lib/seo";
import { PRINCIPAL } from "@/lib/site";
import { SanityImage } from "@/components/SanityImage";
import { VideoPlayer } from "@/components/VideoPlayer";
import { client } from "@/sanity/lib/client";
import { sanityFetch } from "@/sanity/lib/live";
import { muxAspectRatio, muxPosterUrl } from "@/sanity/lib/mux";
import { PROJECT_QUERY, PROJECT_SLUGS_QUERY } from "@/sanity/lib/queries";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  // Runs outside the request lifecycle, so it uses the plain client rather than
  // sanityFetch. Deliberately not wrapped in try/catch: an empty dataset returns
  // [] cleanly, so the only thing a throw here signals is genuine
  // misconfiguration — and shipping an empty portfolio silently is worse than
  // failing the deploy.
  const slugs = await client.fetch(PROJECT_SLUGS_QUERY);
  return slugs.filter(Boolean).map((slug) => ({ slug: slug as string }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: project } = await sanityFetch({
    query: PROJECT_QUERY,
    params: { slug },
    stega: false,
  });

  if (!project) return {};

  const title = project.seo?.title ?? project.title ?? "Untitled";
  const description = project.seo?.description ?? project.summary ?? undefined;

  return pageMetadata({
    title,
    description,
    path: `/work/${slug}`,
    noIndex: Boolean(project.seo?.noIndex),
    ogType: project.video?.playbackId ? "video.other" : "website",
  });
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;

  const { data: project } = await sanityFetch({
    query: PROJECT_QUERY,
    params: { slug },
  });

  if (!project) notFound();

  const shareImage = projectShareImageUrl(project);

  const playbackId = project.video?.playbackId ?? undefined;
  const aspectRatio = muxAspectRatio(project.video?.aspectRatio);

  return (
    <>
      <JsonLd data={projectJsonLd(project, `/work/${slug}`, shareImage)} />
      <ProjectPageStagger>
        {playbackId ? (
          <div>
            <VideoPlayer
              playbackId={playbackId}
              title={project.title ?? undefined}
              poster={muxPosterUrl(playbackId, { width: 1600 })}
              aspectRatio={aspectRatio}
            />
          </div>
        ) : project.poster?.asset ? (
          <div>
            <SanityImage
              image={project.poster}
              alt={project.title ?? ""}
              sizes="(max-width: 768px) 100vw, 66vw"
              priority
              className="h-auto w-full"
            />
          </div>
        ) : null}

      <header className="pt-2">
        <h1 className="text-(length:--text-title) leading-(--text-title--line-height) font-semibold">
          {project.title}
          {project.client ? ` — ${project.client}` : null}
        </h1>

        {project.roles?.length || project.credits?.length ? (
          <div className="mt-3 text-(--color-ink-muted)">
            {/* His row first, and in full ink: the same role/name shape as
                everyone below, but it is the one the visitor came for. */}
            {project.roles?.length ? (
              <dl>
                <div className="flex items-start gap-6">
                  <dt className="min-w-0">{project.roles.join(", ")}</dt>
                  <dd className="shrink-0 whitespace-nowrap text-(--color-ink)">
                    {PRINCIPAL}
                  </dd>
                </div>
              </dl>
            ) : null}

            {project.credits?.length ? (
              <dl className={project.roles?.length ? "mt-3 max-w-[230px]" : "max-w-[230px]"}>
                {project.credits.map((entry) => (
                  <div key={entry._key} className="flex items-start gap-6">
                    <dt className="min-w-0">{entry.role}</dt>
                    <dd className="shrink-0 whitespace-nowrap">
                      {entry.url ? (
                        <a
                          href={entry.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-colors duration-(--duration-fast) hover:text-(--color-ink)"
                        >
                          {entry.name}
                        </a>
                      ) : (
                        entry.name
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        ) : null}

        {project.externalUrl ? (
          <a
            href={project.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block underline underline-offset-2"
          >
            View the campaign
          </a>
        ) : null}
      </header>

      {project.body?.length ? (
        <div className="mt-8 max-w-[62ch]">
          <PortableText value={project.body} />
        </div>
      ) : null}

      {project.additionalVideos?.length ? (
        <div className="mt-10 grid grid-cols-1 gap-(--spacing-gutter) md:grid-cols-2">
          {project.additionalVideos.map((clip) => {
            const clipId = clip.video?.playbackId;
            if (!clipId) return null;
            return (
              <figure key={clip._key}>
                <VideoPlayer
                  playbackId={clipId}
                  title={clip.label ?? undefined}
                  poster={muxPosterUrl(clipId, { width: 900 })}
                  aspectRatio={muxAspectRatio(clip.video?.aspectRatio)}
                />
                {clip.label ? (
                  <figcaption className="pt-1.5 text-(--color-ink-muted)">
                    {clip.label}
                  </figcaption>
                ) : null}
              </figure>
            );
          })}
        </div>
      ) : null}

      {project.gallery?.length ? (
        <div className="mt-10 grid grid-cols-1 gap-(--spacing-gutter) md:grid-cols-2">
          {project.gallery.map((still) => (
            <figure key={still._key}>
              <SanityImage
                image={still}
                sizes="(max-width: 768px) 100vw, 45vw"
                className="h-auto w-full"
              />
              {still.caption ? (
                <figcaption className="pt-1.5 text-(--color-ink-muted)">
                  {still.caption}
                </figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      ) : null}
    </ProjectPageStagger>
    </>
  );
}
