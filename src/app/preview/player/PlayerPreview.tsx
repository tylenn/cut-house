"use client";

import { useRef } from "react";

import { PlayerChrome } from "@/components/player/PlayerChrome";
import {
  CollapseIcon,
  ExpandIcon,
  PauseIcon,
  PlayIcon,
  ReplayIcon,
  SoundOffIcon,
  SoundOnIcon,
} from "@/components/player/icons";

const SHEET = [
  { name: "play", Icon: PlayIcon },
  { name: "pause", Icon: PauseIcon },
  { name: "replay", Icon: ReplayIcon },
  { name: "sound on", Icon: SoundOnIcon },
  { name: "sound off", Icon: SoundOffIcon },
  { name: "full screen", Icon: ExpandIcon },
  { name: "exit full screen", Icon: CollapseIcon },
];

export function PlayerPreview() {
  const mediaRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="mx-auto max-w-4xl px-(--spacing-edge) py-16">
      <h1 className="mb-1 font-semibold">player</h1>
      <p className="mb-8 text-(--color-ink-muted)">
        The chrome over an empty frame. Nothing plays — this is here to judge the
        icons and the bar, not playback.
      </p>

      <div
        ref={containerRef}
        className="relative w-full overflow-hidden bg-(--color-rule)"
        style={{ aspectRatio: 16 / 9 }}
      >
        {/* No source on purpose: the chrome must hold up before an asset exists. */}
        <video ref={mediaRef} className="h-full w-full object-cover" playsInline />
        <PlayerChrome
          mediaRef={mediaRef}
          containerRef={containerRef}
          title="preview"
        />
      </div>

      <h2 className="mt-12 mb-4 font-semibold">iconography</h2>
      <ul className="grid grid-cols-2 gap-x-(--spacing-gutter) gap-y-6 sm:grid-cols-4">
        {SHEET.map(({ name, Icon }) => (
          <li key={name} className="flex flex-col items-center gap-2">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-(--color-rule) text-(--color-ink)">
              <Icon className="h-8 w-8" />
            </span>
            <span className="text-(length:--text-meta) text-(--color-ink-muted)">
              {name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
