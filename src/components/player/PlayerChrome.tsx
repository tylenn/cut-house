"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  CollapseIcon,
  ExpandIcon,
  PauseIcon,
  PlayIcon,
  ReplayIcon,
  SoundOffIcon,
  SoundOnIcon,
} from "./icons";

/**
 * The slice of HTMLMediaElement the chrome actually touches.
 *
 * Both a plain <video> and <mux-player> satisfy it, which is the point: the
 * controls are not coupled to Mux and survive a change of video backend
 * untouched.
 */
export type MediaLike = Pick<
  HTMLMediaElement,
  | "play"
  | "pause"
  | "paused"
  | "ended"
  | "currentTime"
  | "duration"
  | "muted"
  | "addEventListener"
  | "removeEventListener"
>;

type Props = {
  mediaRef: React.RefObject<MediaLike | null>;
  containerRef: React.RefObject<HTMLElement | null>;
  /** Announced on the play button, so the control is not just "Play". */
  title?: string;
};

/** mm:ss. Hours are not a portfolio problem. */
function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const IDLE_AFTER = 2400;

export function PlayerChrome({ mediaRef, containerRef, title }: Props) {
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [idle, setIdle] = useState(false);
  const [scrubbing, setScrubbing] = useState(false);

  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Read inside the timeupdate listener, which must not resubscribe mid-drag.
  const scrubbingRef = useRef(false);

  const clearIdle = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = null;
  }, []);

  /** Show the bar and restart the countdown. Only ever called from real events. */
  const wake = useCallback(() => {
    setIdle(false);
    clearIdle();
    idleTimer.current = setTimeout(() => setIdle(true), IDLE_AFTER);
  }, [clearIdle]);

  // The timer is the only thing that outlives the component.
  useEffect(() => clearIdle, [clearIdle]);

  // ---- media -> state ---------------------------------------------------
  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;

    // Idle handling hangs off the media events rather than an effect watching
    // `playing`: these are user-driven, so the bar never hides or reappears as
    // a side effect of a render.
    const onPlay = () => {
      setPlaying(true);
      setEnded(false);
      wake();
    };
    const onPause = () => {
      setPlaying(false);
      setIdle(false);
      clearIdle();
    };
    const onEnded = () => {
      setPlaying(false);
      setEnded(true);
      setIdle(false);
      clearIdle();
    };
    // Skipped while scrubbing, or the thumb fights the element's own updates.
    const onTime = () => {
      if (!scrubbingRef.current) setTime(media.currentTime);
    };
    const onMeta = () => setDuration(media.duration);
    const onVolume = () => setMuted(media.muted);

    media.addEventListener("play", onPlay);
    media.addEventListener("pause", onPause);
    media.addEventListener("ended", onEnded);
    media.addEventListener("timeupdate", onTime);
    media.addEventListener("loadedmetadata", onMeta);
    media.addEventListener("durationchange", onMeta);
    media.addEventListener("volumechange", onVolume);

    return () => {
      media.removeEventListener("play", onPlay);
      media.removeEventListener("pause", onPause);
      media.removeEventListener("ended", onEnded);
      media.removeEventListener("timeupdate", onTime);
      media.removeEventListener("loadedmetadata", onMeta);
      media.removeEventListener("durationchange", onMeta);
      media.removeEventListener("volumechange", onVolume);
    };
  }, [mediaRef, wake, clearIdle]);

  // ---- fullscreen -------------------------------------------------------
  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // ---- actions ----------------------------------------------------------
  const toggle = useCallback(() => {
    const media = mediaRef.current;
    if (!media) return;
    if (media.paused) {
      // Rejected autoplay is not an error worth surfacing — the poster stays.
      void media.play().catch(() => {});
    } else {
      media.pause();
    }
  }, [mediaRef]);

  const toggleMute = useCallback(() => {
    const media = mediaRef.current;
    if (!media) return;
    media.muted = !media.muted;
    setMuted(media.muted);
  }, [mediaRef]);

  const toggleFullscreen = useCallback(() => {
    const node = containerRef.current;
    if (!node) return;
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
    else void node.requestFullscreen().catch(() => {});
  }, [containerRef]);

  const seek = useCallback(
    (value: number) => {
      const media = mediaRef.current;
      if (!media) return;
      media.currentTime = value;
      setTime(value);
    },
    [mediaRef],
  );

  const progress = duration > 0 ? (time / duration) * 100 : 0;
  const barHidden = idle && playing && !scrubbing;

  return (
    <div
      className="absolute inset-0 z-10"
      onPointerMove={wake}
      onPointerLeave={() => playing && setIdle(true)}
      style={{ cursor: barHidden ? "none" : "auto" }}
    >
      {/* Click anywhere on the frame to toggle, the way every player behaves.
          Not a <button>: the real controls below carry the accessible names,
          and a full-frame button would swallow the whole player for a screen
          reader. */}
      <div className="absolute inset-0" onClick={toggle} aria-hidden />

      {/* Centre button. Present only when there is something to resume from. */}
      {!playing ? (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <button
            type="button"
            onClick={toggle}
            aria-label={ended ? "Replay" : title ? `Play ${title}` : "Play"}
            className="pointer-events-auto grid h-16 w-16 place-items-center rounded-full bg-(--color-page)/90 text-(--color-ink) shadow-[0_2px_20px_rgba(0,0,0,0.18)] backdrop-blur-sm transition-transform duration-(--duration-fast) ease-(--ease-out-soft) hover:scale-[1.06] focus-visible:scale-[1.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-ink)"
          >
            {ended ? (
              <ReplayIcon className="h-7 w-7" />
            ) : (
              <PlayIcon className="h-8 w-8" />
            )}
          </button>
        </div>
      ) : null}

      {/* Control bar. */}
      <div
        className="absolute right-0 bottom-0 left-0 flex items-center gap-3 bg-gradient-to-t from-black/45 to-transparent px-3 pt-8 pb-3 transition-opacity duration-(--duration-base) ease-(--ease-out-soft)"
        style={{ opacity: barHidden ? 0 : 1 }}
      >
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause" : "Play"}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-(--color-page)/90 text-(--color-ink) transition-transform duration-(--duration-fast) ease-(--ease-out-soft) hover:scale-[1.08] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-page)"
        >
          {playing ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
        </button>

        <span className="shrink-0 text-(length:--text-meta) tabular-nums text-(--color-page)">
          {formatTime(time)}
        </span>

        <input
          type="range"
          min={0}
          max={duration || 0}
          step="any"
          value={time}
          onChange={(e) => seek(Number(e.target.value))}
          onPointerDown={() => {
            scrubbingRef.current = true;
            setScrubbing(true);
          }}
          onPointerUp={() => {
            scrubbingRef.current = false;
            setScrubbing(false);
          }}
          onKeyDown={wake}
          aria-label="Seek"
          className="player-scrub min-w-0 flex-1"
          style={{ ["--progress" as string]: `${progress}%` }}
        />

        <span className="shrink-0 text-(length:--text-meta) tabular-nums text-(--color-page)">
          {formatTime(duration)}
        </span>

        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Unmute" : "Mute"}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-(--color-page) transition-transform duration-(--duration-fast) ease-(--ease-out-soft) hover:scale-[1.12] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-page)"
        >
          {muted ? <SoundOffIcon className="h-5 w-5" /> : <SoundOnIcon className="h-5 w-5" />}
        </button>

        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label={fullscreen ? "Exit full screen" : "Full screen"}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-(--color-page) transition-transform duration-(--duration-fast) ease-(--ease-out-soft) hover:scale-[1.12] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-page)"
        >
          {fullscreen ? <CollapseIcon className="h-5 w-5" /> : <ExpandIcon className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}
