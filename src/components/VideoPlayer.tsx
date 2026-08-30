"use client";

import { useRef } from "react";
// The lazy entrypoint keeps the player bundle out of any page that only shows a
// poster frame. A grid of eight tiles must never download a player nobody has
// pressed play on.
import MuxPlayer from "@mux/mux-player-react/lazy";
import type {
  MuxCSSProperties,
  MuxPlayerRefAttributes,
} from "@mux/mux-player-react";

import { PlayerChrome } from "@/components/player/PlayerChrome";

type Props = {
  playbackId: string;
  title?: string;
  poster?: string;
  /** Numeric ratio, e.g. 1.777. Reserves the box before metadata loads. */
  aspectRatio?: number;
};

/**
 * Mux supplies the pixels; every control the visitor sees is ours.
 *
 * `--controls: none` switches off Mux's built-in chrome wholesale rather than
 * restyling it piecemeal — half-overridden vendor UI is how players end up with
 * two play buttons a release later. PlayerChrome then drives the element
 * through the standard media API, so it is not coupled to Mux.
 */
export function VideoPlayer({ playbackId, title, poster, aspectRatio }: Props) {
  const playerRef = useRef<MuxPlayerRefAttributes | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const ratio = aspectRatio ?? 16 / 9;

  const style: MuxCSSProperties = {
    width: "100%",
    height: "100%",
    display: "block",
    // The player letterboxes in black by default; match the page instead.
    "--media-object-fit": "cover",
    "--controls": "none",
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-(--color-rule)"
      style={{ aspectRatio: ratio }}
    >
      <MuxPlayer
        ref={playerRef}
        playbackId={playbackId}
        metadata={{ video_title: title }}
        poster={poster}
        streamType="on-demand"
        style={style}
      />
      <PlayerChrome
        mediaRef={playerRef}
        containerRef={containerRef}
        title={title}
      />
    </div>
  );
}
