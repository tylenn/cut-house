import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/JsonLd";
import { PortableText } from "@/components/PortableText";
import { ProjectEnterLink } from "@/components/ProjectEnterLink";
import { ProjectHeroEnter } from "@/components/ProjectHeroEnter";
import { ProjectPageStagger } from "@/components/ProjectPageStagger";
import { workHref } from "@/lib/routes";
import { pageMetadata, projectJsonLd, projectShareImageUrl } from "@/lib/seo";
import { PRINCIPAL } from "@/lib/site";
import { SanityImage } from "@/components/SanityImage";
import { VideoPlayer } from "@/components/VideoPlayer";
import { client } from "@/sanity/lib/client";
import { sanityFetch } from "@/sanity/lib/live";
import { muxAspectRatio, muxPosterUrl } from "@/sanity/lib/mux";
import {
  PROJECT_ORDER_QUERY,
  PROJECT_QUERY,
  PROJECT_SLUGS_QUERY,
} from "@/sanity/lib/queries";

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

  const [{ data: project }, { data: order }] = await Promise.all([
    sanityFetch({ query: PROJECT_QUERY, params: { slug } }),
    sanityFetch({ query: PROJECT_ORDER_QUERY }),
  ]);

  if (!project) notFound();

  const shareImage = projectShareImageUrl(project);

  // Neighbours by array index, not by a GROQ orderRank comparison: every project
  // without a manual position shares the same coalesced rank, so a < / > query
  // matches nothing and the nav silently disappears.
  const index = (order ?? []).findIndex((entry) => entry.slug === slug);
  const previous = index > 0 ? order?.[index - 1] : undefined;
  const next =
    index >= 0 && index < (order?.length ?? 0) - 1
      ? order?.[index + 1]
      : undefined;

  const playbackId = project.video?.playbackId ?? undefined;
  const aspectRatio = muxAspectRatio(project.video?.aspectRatio);

  return (
    <>
      <JsonLd data={projectJsonLd(project, `/work/${slug}`, shareImage)} />
      <ProjectPageStagger>
        <ProjectHeroEnter>
        {playbackId ? (
          <VideoPlayer
            playbackId={playbackId}
            title={project.title ?? undefined}
            poster={muxPosterUrl(playbackId, { width: 1600 })}
            aspectRatio={aspectRatio}
          />
        ) : project.poster?.asset ? (
          <SanityImage
            image={project.poster}
            alt={project.title ?? ""}
            sizes="(max-width: 768px) 100vw, 66vw"
            priority
            className="h-auto w-full"
          />
        ) : null}
      </ProjectHeroEnter>

      <header className="px-(--spacing-edge) pt-2 md:px-0">
        <h1
          data-project-stagger
          className="text-(length:--text-title) leading-(--text-title--line-height) font-semibold"
        >
          {project.title}
          {project.client ? ` — ${project.client}` : null}
        </h1>

        {project.roles?.length || project.credits?.length ? (
          <dl className="mt-3 max-w-[230px] text-(--color-ink-muted)">
            {/* His row first, and in full ink: the same role/name shape as
                everyone below, but it is the one the visitor came for. */}
            {project.roles?.length ? (
              <div data-project-stagger className="flex justify-between gap-4">
                <dt>{project.roles.join(", ")}</dt>
                <dd className="text-right text-(--color-ink)">{PRINCIPAL}</dd>
              </div>
            ) : null}

            {project.credits?.map((entry) => (
              <div
                key={entry._key}
                data-project-stagger
                className="flex justify-between gap-4"
              >
                <dt>{entry.role}</dt>
                <dd className="text-right">
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

        {project.externalUrl ? (
          <a
            data-project-stagger
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
        <div
          data-project-stagger
          className="mt-8 max-w-[62ch] px-(--spacing-edge) md:px-0"
        >
          <PortableText value={project.body} />
        </div>
      ) : null}

      {project.additionalVideos?.length ? (
        <div className="mt-10 grid grid-cols-1 gap-(--spacing-gutter) md:grid-cols-2">
          {project.additionalVideos.map((clip) => {
            const clipId = clip.video?.playbackId;
            if (!clipId) return null;
            return (
              <figure
                key={clip._key}
                data-project-stagger
              >
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
            <figure key={still._key} data-project-stagger>
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

      {previous || next ? (
        <nav
          data-project-stagger
          className="mt-16 flex justify-between gap-8 px-(--spacing-edge) md:px-0"
        >
          {previous?.slug ? (
            <ProjectEnterLink
              href={workHref(previous.slug)}
              enter="adjacent"
              className="group text-(--color-ink-muted) transition-colors duration-(--duration-fast) hover:text-(--color-ink)"
            >
              <span className="inline-block transition-transform duration-(--duration-base) ease-(--ease-out-soft) group-hover:-translate-x-1">
                ←
              </span>{" "}
              {previous.title}
            </ProjectEnterLink>
          ) : (
            <span />
          )}
          {next?.slug ? (
            <ProjectEnterLink
              href={workHref(next.slug)}
              enter="adjacent"
              className="group text-right text-(--color-ink-muted) transition-colors duration-(--duration-fast) hover:text-(--color-ink)"
            >
              {next.title}{" "}
              <span className="inline-block transition-transform duration-(--duration-base) ease-(--ease-out-soft) group-hover:translate-x-1">
                →
              </span>
            </ProjectEnterLink>
          ) : (
            <span />
          )}
        </nav>
      ) : null}
    </ProjectPageStagger>
    </>
  );
}
