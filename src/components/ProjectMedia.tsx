"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Props = {
  /** Static frame. Always rendered; the loop fades in on top once it arrives. */
  posterUrl: string;
  /** An uploaded MP4/WebM, or a Mux animated WebP. */
  loopUrl?: string;
  alt: string;
  sizes: string;
  aspectRatio?: number;
  priority?: boolean;
};

/**
 * A grid tile.
 *
 * The client's mockups show every tile playing at once, which is the look — so
 * these autoplay rather than waiting for a hover. The cost is controlled by only
 * ever fetching a loop while its tile is actually on screen: an eight-tile grid
 * on a phone would otherwise pull eight clips the visitor never scrolls to.
 *
 * The loop is mounted on first intersection and then left mounted, so scrolling
 * back up does not re-fetch.
 */
export function ProjectMedia({
  posterUrl,
  loopUrl,
  alt,
  sizes,
  aspectRatio,
  priority = false,
}: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);

  const isVideo = loopUrl ? /\.(mp4|webm)($|\?)/i.test(loopUrl) : false;

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || !loopUrl) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true);
          videoRef.current?.play().catch(() => {
            // Refused (low power mode, data saver). The poster underneath is a
            // perfectly good resting state, so there is nothing to recover from.
          });
        } else {
          videoRef.current?.pause();
        }
      },
      // A little margin so a tile is already running by the time it is read.
      { rootMargin: "200px 0px", threshold: 0.01 },
    );

    observer.observe(frame);
    return () => observer.disconnect();
  }, [loopUrl]);

  return (
    <div
      ref={frameRef}
      className="relative overflow-hidden bg-(--color-rule)"
      style={{ aspectRatio: aspectRatio ?? 16 / 9 }}
    >
      <Image
        src={posterUrl}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover transition-transform duration-(--duration-slow) ease-(--ease-out-soft) group-hover:scale-[1.02]"
      />

      {loopUrl && mounted ? (
        <div
          className="absolute inset-0 transition-opacity duration-(--duration-slow) ease-(--ease-out-soft)"
          // Held back until the first frame is decoded, otherwise the tile
          // flashes white between poster and loop.
          style={{ opacity: ready ? 1 : 0 }}
        >
          {isVideo ? (
            <video
              ref={videoRef}
              src={loopUrl}
              muted
              loop
              playsInline
              preload="none"
              autoPlay
              aria-hidden
              onLoadedData={() => setReady(true)}
              className="h-full w-full object-cover transition-transform duration-(--duration-slow) ease-(--ease-out-soft) group-hover:scale-[1.02]"
            />
          ) : (
            <Image
              src={loopUrl}
              alt=""
              fill
              sizes={sizes}
              // Animated WebP: Next's optimiser would flatten it to one frame.
              unoptimized
              aria-hidden
              onLoad={() => setReady(true)}
              className="object-cover transition-transform duration-(--duration-slow) ease-(--ease-out-soft) group-hover:scale-[1.02]"
            />
          )}
        </div>
      ) : null}
    </div>
  );
}
