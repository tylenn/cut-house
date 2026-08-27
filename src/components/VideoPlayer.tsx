"use client";

// The lazy entrypoint keeps the player bundle out of any page that only shows a
// poster frame. A grid of eight tiles must never download a player nobody has
// pressed play on.
import MuxPlayer from "@mux/mux-player-react/lazy";
import type { MuxCSSProperties } from "@mux/mux-player-react";

type Props = {
  playbackId: string;
  title?: string;
  poster?: string;
  /** Numeric ratio, e.g. 1.777. Reserves the box before metadata loads. */
  aspectRatio?: number;
};

export function VideoPlayer({ playbackId, title, poster, aspectRatio }: Props) {
  const style: MuxCSSProperties = {
    aspectRatio: aspectRatio ?? 16 / 9,
    width: "100%",
    // The player letterboxes in black by default; match the page instead.
    "--media-object-fit": "cover",
  };

  return (
    <MuxPlayer
      playbackId={playbackId}
      metadata={{ video_title: title }}
      poster={poster}
      streamType="on-demand"
      accentColor="#111111"
      style={style}
    />
  );
}
