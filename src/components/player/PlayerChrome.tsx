"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * The slice of HTMLMediaElement the chrome actually touches.
 *
 * Both a plain <video> and <mux-player> satisfy it, which is the point: the
 * controls are not coupled to Mux and survive a change of video backend
 * untouched.
 *
 * mux-player composes an inner media node (`el.media`) that is the one which
 * actually fires play/pause/timeupdate. play() on the host delegates; the
 * events do not.
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

type MediaHost = MediaLike & { media?: MediaLike | null };

function resolveMedia(el: MediaHost | null): MediaLike | null {
  if (!el) return null;
  if ("media" in el && el.media) return el.media;
  // Host exists but its inner media has not upgraded yet — keep waiting.
  if ("media" in el) return null;
  return el;
}

type Props = {
  mediaRef: React.RefObject<MediaLike | null>;
  containerRef: React.RefObject<HTMLElement | null>;
  /** Announced on the play button, so the control is not just "Play". */
  title?: string;
};

const IDLE_AFTER = 2400;

export function PlayerChrome({ mediaRef, containerRef, title }: Props) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [idle, setIdle] = useState(false);
  const [scrubbing, setScrubbing] = useState(false);
  const [hovered, setHovered] = useState(false);

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
    // Mux's lazy player does not fill the ref until it has intersected and the
    // chunk has loaded. This effect mounts in the same tick as the placeholder,
    // so we wait for the real node rather than attaching to nothing and never
    // hearing play/pause.
    let cancelled = false;
    let media: MediaLike | null = null;
    let frame = 0;

    const onPlay = () => {
      setPlaying(true);
      wake();
    };
    const onPause = () => {
      setPlaying(false);
      setIdle(false);
      clearIdle();
    };
    const onEnded = () => {
      setPlaying(false);
      setIdle(false);
      clearIdle();
    };
    const onTime = () => {
      // Skipped while scrubbing, or the thumb fights the element's own updates.
      if (!scrubbingRef.current && media) setTime(media.currentTime);
    };
    const onMeta = () => {
      if (media) setDuration(media.duration);
    };
    const onVolume = () => {
      if (media) setMuted(media.muted);
    };

    const attach = (el: MediaLike) => {
      media = el;
      setPlaying(!el.paused);
      setMuted(el.muted);
      if (Number.isFinite(el.duration) && el.duration > 0) {
        setDuration(el.duration);
      }
      el.addEventListener("play", onPlay);
      el.addEventListener("pause", onPause);
      el.addEventListener("ended", onEnded);
      el.addEventListener("timeupdate", onTime);
      el.addEventListener("loadedmetadata", onMeta);
      el.addEventListener("durationchange", onMeta);
      el.addEventListener("volumechange", onVolume);
    };

    const wait = () => {
      if (cancelled) return;
      const target = resolveMedia(mediaRef.current as MediaHost | null);
      if (target) {
        attach(target);
        return;
      }
      frame = requestAnimationFrame(wait);
    };

    wait();

    return () => {
      cancelled = true;
      if (frame) cancelAnimationFrame(frame);
      if (!media) return;
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
    const media = resolveMedia(mediaRef.current as MediaHost | null) ?? mediaRef.current;
    if (!media) return;
    if (media.paused) {
      // Rejected autoplay is not an error worth surfacing — the poster stays.
      void media
        .play()
        .then(() => {
          setPlaying(true);
        })
        .catch(() => {});
    } else {
      media.pause();
      setPlaying(false);
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
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => {
        setHovered(false);
        if (playing) setIdle(true);
      }}
      style={{ cursor: barHidden ? "none" : "auto" }}
    >
      {/* Click anywhere on the frame to toggle, the way every player behaves.
          Not a <button>: the real controls below carry the accessible names,
          and a full-frame button would swallow the whole player for a screen
          reader. */}
      <div className="absolute inset-0" onClick={toggle} aria-hidden />

      {/* Centre word. Play while stopped. Pause fades in only after the pointer
          has rested on a playing clip, so a shaky mouse does not flash it. */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause" : title ? `Play ${title}` : "Play"}
          className={`text-(length:--text-title) text-(--color-page) transition-opacity duration-(--duration-base) ease-(--ease-out-soft) focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--color-page) ${
            !playing || (hovered && !barHidden)
              ? "pointer-events-auto opacity-100 delay-200"
              : "pointer-events-none opacity-0 delay-0"
          }`}
        >
          {playing ? "pause" : "play"}
        </button>
      </div>

      {/* Control bar. */}
      <div
        className="absolute right-0 bottom-0 left-0 flex items-center bg-gradient-to-t from-black/45 to-transparent px-3 pt-8 pb-3 transition-opacity duration-(--duration-base) ease-(--ease-out-soft)"
        style={{ opacity: barHidden ? 0 : 1 }}
      >
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Unmute" : "Mute"}
          className="shrink-0 text-(length:--text-body) text-(--color-page) focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--color-page)"
        >
          {muted ? "unmute" : "mute"}
        </button>

        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label={fullscreen ? "Exit full screen" : "Full screen"}
          className="ml-4 shrink-0 text-(length:--text-body) text-(--color-page) focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--color-page)"
        >
          {fullscreen ? "close" : "full screen"}
        </button>

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
          className="player-scrub ml-4 min-w-0 flex-1"
          style={{ ["--progress" as string]: `${progress}%` }}
        />
      </div>
    </div>
  );
}
