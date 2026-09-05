import { ProjectCardLink } from "@/components/ProjectCardLink";
import { ProjectMedia } from "@/components/ProjectMedia";
import { SanityImage } from "@/components/SanityImage";
import { muxAspectRatio, muxLoopUrl, muxPosterUrl } from "@/sanity/lib/mux";
import type { StegaAware } from "@/sanity/lib/stega";
import type { PROJECTS_QUERY_RESULT } from "@/sanity/types";

export type ProjectCardData = StegaAware<PROJECTS_QUERY_RESULT[number]>;

export function ProjectCard({
  project,
  index,
  priority = false,
}: {
  project: ProjectCardData;
  index: number;
  priority?: boolean;
}) {
  const { title, slug, roles, poster, loopUrl, video } = project;
  if (!slug) return null;

  const playbackId = video?.playbackId ?? undefined;
  const aspectRatio = muxAspectRatio(video?.aspectRatio) ?? 16 / 9;
  const label = title ?? "Untitled";
  const sizes = "(max-width: 768px) 100vw, 45vw";

  // uploaded asset -> Mux-generated -> nothing, for both the frame and the loop.
  const posterUrl = playbackId
    ? muxPosterUrl(playbackId, { width: 1200 })
    : undefined;
  const animatedUrl =
    loopUrl ??
    (playbackId ? muxLoopUrl(playbackId, { width: 640, end: 4 }) : undefined);

  const media = poster?.asset ? (
    // An uploaded still overrides everything, including the loop: choosing a
    // frame by hand is a decision to show that frame.
    <div
      className="relative overflow-hidden bg-(--color-rule)"
      style={{ aspectRatio }}
    >
      <SanityImage
        image={poster}
        alt={label}
        sizes={sizes}
        priority={priority}
        className="h-full w-full object-cover transition-transform duration-(--duration-slow) ease-(--ease-out-soft) group-hover:scale-[1.02]"
      />
    </div>
  ) : posterUrl ? (
    <ProjectMedia
      posterUrl={posterUrl}
      loopUrl={animatedUrl}
      alt={label}
      sizes={sizes}
      aspectRatio={aspectRatio}
      priority={priority}
    />
  ) : (
    <div
      className="bg-(--color-rule)"
      style={{ aspectRatio }}
      aria-hidden
    />
  );

  const meta = (
    <div className="px-(--spacing-edge) pt-1 leading-tight md:px-0">
      <div className="font-semibold">{label}</div>
      {roles?.length ? (
        <div className="text-(--color-ink-muted) transition-colors duration-(--duration-fast) group-hover:text-(--color-ink)">
          {roles.join(", ")}
        </div>
      ) : null}
    </div>
  );

  return (
    <ProjectCardLink slug={slug} index={index} media={media} meta={meta} />
  );
}
