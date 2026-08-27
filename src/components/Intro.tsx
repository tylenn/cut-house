"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

import { INTRO_COOKIE } from "@/lib/intro";
import { muxLoopUrl } from "@/sanity/lib/mux";

/**
 * Beat sheet, in ms from mount.
 *
 * Proportions are taken from the client's mockup, measured off the frames in
 * reference/mockup-frames/intro: letters at 0.5/0.8/1.2s, track-in 2.0-2.5s,
 * cut to film 2.5s, cut to white 6.2s, grid 9.0s. That is a ~9.5s demo pace —
 * far too long to sit through on a real visit — so the whole thing is
 * compressed roughly 4x while keeping the relative rhythm.
 */
const BEATS = [
  "start",
  "collapse", // the spread letters track in to become the lockup
  "film", // hard cut to the film behind; type goes white
  "house", // "house" wipes out to complete the word
  "tagline", // the descriptor fades in underneath
  "flat", // cut to white, type returns to black
  "reveal", // backdrop clears; the site is already sitting behind it
  "done",
] as const;

type Phase = (typeof BEATS)[number];

const AT: Record<Phase, number> = {
  start: 0,
  collapse: 520,
  film: 880,
  house: 1080,
  tagline: 1240,
  flat: 1780,
  reveal: 2020,
  done: 2380,
};

/** Per-letter arrival, mirroring the mockup's ~300ms cadence, compressed. */
const LETTER_STAGGER = 90;
const LETTER_FADE = 260;
/** Must land before AT.film, or the track-in is still moving when we cut. */
const TRACK_IN = 360;

type Props = {
  name: string;
  tagline?: string;
  playbackId?: string;
  /**
   * Multiplies every beat. 1 is the real thing; the design harness runs it
   * slower so the sequence can be watched and tuned a beat at a time.
   */
  speed?: number;
};

const noSubscribe = () => () => {};

/**
 * Whether the visitor has asked their OS to stop animations.
 *
 * useSyncExternalStore rather than an effect: the server cannot know the answer,
 * and setting state from an effect instead would cascade an extra render on
 * every page load. Whether the intro has already *played* is decided on the
 * server from a cookie — see lib/intro.ts — so it never reaches this component.
 */
function useReducedMotion() {
  return useSyncExternalStore(
    noSubscribe,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

export function Intro({ name, tagline, playbackId, speed = 1 }: Props) {
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("start");
  const [gone, setGone] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const finish = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setGone(true);
  }, []);

  useEffect(() => {
    // A session cookie, so it expires when the browser closes — same lifetime
    // as sessionStorage, but the server can read it and skip rendering the
    // overlay altogether. That is what keeps a return visit flash-free without
    // a blocking inline script.
    document.cookie = `${INTRO_COOKIE}=seen; path=/; SameSite=Lax; max-age=86400`;

    if (reducedMotion) return;

    document.body.style.overflow = "hidden";

    for (const beat of BEATS) {
      timers.current.push(
        setTimeout(
          () => {
            if (beat === "done") finish();
            else setPhase(beat);
          },
          AT[beat] / speed,
        ),
      );
    }

    const pending = timers.current;
    return () => {
      pending.forEach(clearTimeout);
      document.body.style.overflow = "";
    };
  }, [finish, reducedMotion, speed]);

  // Let people out. A first-time visitor who has seen enough should not be held.
  useEffect(() => {
    if (reducedMotion) return;

    const skip = (event: Event) => {
      if (
        event instanceof KeyboardEvent &&
        !["Escape", " ", "Enter"].includes(event.key)
      ) {
        return;
      }
      finish();
    };
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, [finish, reducedMotion]);

  if (reducedMotion || gone) return null;

  const reached = (beat: Phase) => BEATS.indexOf(phase) >= BEATS.indexOf(beat);

  const collapsed = reached("collapse");
  const onFilm = reached("film") && !reached("flat");
  const revealed = reached("reveal");

  const [first, ...rest] = name.split(" ");
  const remainder = rest.join(" ");

  return (
    <div
      aria-hidden
      className="intro-overlay fixed inset-0 z-50 transition-opacity duration-[360ms] ease-(--ease-out-soft)"
      style={{
        // Only the backdrop fades at the end. The wordmark on top of it is
        // already at the rail's coordinates, so it does not move — it simply
        // stops being the intro's and starts being the page's.
        opacity: revealed ? 0 : 1,
        pointerEvents: revealed ? "none" : "auto",
      }}
    >
      <div
        className="absolute inset-0 transition-colors duration-100 ease-(--ease-in-out-firm)"
        style={{
          background: reached("flat")
            ? "var(--color-page)"
            : onFilm
              ? "#000"
              : "var(--color-bone)",
        }}
      />

      {/* An animated WebP rather than a player: it needs no JS, decodes
          everywhere, and is only on screen for a beat and a half. */}
      {playbackId && onFilm ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={muxLoopUrl(playbackId, { width: 1280, start: 0, end: 4 })}
          alt=""
          className="animate-fade-in absolute inset-0 h-full w-full object-cover"
        />
      ) : null}

      <div className="absolute inset-0 flex flex-col justify-center px-(--spacing-edge)">
        <div
          className="flex items-baseline transition-colors duration-100"
          style={{ color: onFilm ? "#ffffff" : "var(--color-ink)" }}
        >
          {/* The whole opening move is one property. The letters start flung
              across the viewport and track in to the wordmark's real spacing —
              same left edge, same baseline, so nothing needs lining up. */}
          <span
            className="block font-bold whitespace-pre transition-all ease-(--ease-in-out-firm)"
            style={{
              transitionDuration: `${TRACK_IN / speed}ms`,
              fontSize: collapsed
                ? "var(--text-display)"
                : "clamp(2rem, 5.6vw, 4.5rem)",
              lineHeight: "var(--text-display--line-height)",
              letterSpacing: collapsed ? "-0.02em" : "5.6em",
              // letter-spacing also pads the final glyph; pull it back so the
              // three letters sit flush to both edges on the way in.
              marginRight: collapsed ? 0 : "-5.6em",
            }}
          >
            {first.split("").map((glyph, index) => (
              <span
                key={`${glyph}-${index}`}
                style={{
                  animation: `letter-in ${LETTER_FADE / speed}ms var(--ease-out-soft) ${
                    (index * LETTER_STAGGER) / speed
                  }ms both`,
                }}
              >
                {glyph}
              </span>
            ))}
          </span>

          {remainder && reached("house") ? (
            <span
              className="block overflow-hidden font-bold whitespace-pre"
              style={{
                fontSize: "var(--text-display)",
                lineHeight: "var(--text-display--line-height)",
                letterSpacing: "-0.02em",
                // A wipe, not a fade — the word is being completed, not joined.
                animation: `wipe-right ${240 / speed}ms var(--ease-out-soft) both`,
              }}
            >
              {` ${remainder}`}
            </span>
          ) : null}
        </div>

        {tagline && reached("tagline") && !reached("flat") ? (
          <span
            className="animate-fade-in mt-1.5 text-(length:--text-meta)"
            style={{ color: onFilm ? "#ffffff" : "var(--color-ink-muted)" }}
          >
            {tagline}
          </span>
        ) : null}
      </div>
    </div>
  );
}
