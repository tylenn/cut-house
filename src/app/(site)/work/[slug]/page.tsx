import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PortableText } from "@/components/PortableText";
import { TransitionLink } from "@/components/TransitionLink";
import { workHref } from "@/lib/routes";
import { SanityImage } from "@/components/SanityImage";
import { VideoPlayer } from "@/components/VideoPlayer";
import { client } from "@/sanity/lib/client";
import { sanityFetch } from "@/sanity/lib/live";
import {
  muxAspectRatio,
  muxPosterUrl,
  formatDuration,
} from "@/sanity/lib/mux";
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

  const title = project.seo?.title ?? project.title ?? undefined;
  const description = project.seo?.description ?? project.summary ?? undefined;

  return {
    title,
    description,
    robots: project.seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: { title: title ?? undefined, description, type: "video.other" },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;

  const [{ data: project }, { data: order }] = await Promise.all([
    sanityFetch({ query: PROJECT_QUERY, params: { slug } }),
    sanityFetch({ query: PROJECT_ORDER_QUERY }),
  ]);

  if (!project) notFound();

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
  const duration = formatDuration(project.video?.duration);
  const year = project.date ? new Date(project.date).getFullYear() : undefined;

  return (
    <article className="pb-24">
      <div className="animate-fade-in">
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
      </div>

      <header className="animate-rise-in px-(--spacing-edge) pt-2 md:px-0">
        <h1 className="font-semibold">
          {project.title}
          {project.client ? ` — ${project.client}` : null}
        </h1>

        {project.credits?.length ? (
          <dl className="mt-3 max-w-[230px] text-(--color-ink-muted)">
            {project.credits.map((entry, index) => (
              <div
                key={entry._key}
                className="stagger-child flex justify-between gap-4"
                style={{ "--i": index + 2 } as React.CSSProperties}
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

        {year || duration ? (
          <p className="mt-3 text-(--color-ink-faint)">
            {[year, duration].filter(Boolean).join(" · ")}
          </p>
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
        <div className="animate-rise-in mt-8 max-w-[62ch] px-(--spacing-edge) md:px-0">
          <PortableText value={project.body} />
        </div>
      ) : null}

      {project.gallery?.length ? (
        <div className="mt-10 grid grid-cols-1 gap-(--spacing-gutter) md:grid-cols-2">
          {project.gallery.map((still, index) => (
            <figure
              key={still._key}
              className="stagger-child"
              style={{ "--i": index } as React.CSSProperties}
            >
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
        <nav className="mt-16 flex justify-between gap-8 px-(--spacing-edge) md:px-0">
          {previous?.slug ? (
            <TransitionLink
              href={workHref(previous.slug)}
              className="group text-(--color-ink-muted) transition-colors duration-(--duration-fast) hover:text-(--color-ink)"
            >
              <span className="inline-block transition-transform duration-(--duration-base) ease-(--ease-out-soft) group-hover:-translate-x-1">
                ←
              </span>{" "}
              {previous.title}
            </TransitionLink>
          ) : (
            <span />
          )}
          {next?.slug ? (
            <TransitionLink
              href={workHref(next.slug)}
              className="group text-right text-(--color-ink-muted) transition-colors duration-(--duration-fast) hover:text-(--color-ink)"
            >
              {next.title}{" "}
              <span className="inline-block transition-transform duration-(--duration-base) ease-(--ease-out-soft) group-hover:translate-x-1">
                →
              </span>
            </TransitionLink>
          ) : (
            <span />
          )}
        </nav>
      ) : null}
    </article>
  );
}
