/**
 * URL builders for everything Mux derives from a single upload.
 *
 * One upload gives us an HLS manifest, a poster frame at any timestamp, and an
 * animated loop — so the `poster` and `loop` fields in the schema exist purely
 * as overrides. The fallback chain everywhere is:
 *   uploaded asset -> Mux-generated -> nothing.
 *
 * These require the asset to be public, which is why the Studio plugin is
 * configured with `defaultPublic: true`.
 */

const IMAGE_HOST = "https://image.mux.com";
const STREAM_HOST = "https://stream.mux.com";

/** The shape the Sanity mux.video field resolves to once the asset is expanded. */
export type MuxAsset = {
  playbackId?: string | null;
  /** Mux reports this as a ratio string, e.g. "16:9". */
  aspectRatio?: string | null;
  duration?: number | null;
} | null;

export function muxPosterUrl(
  playbackId: string,
  options: { width?: number; time?: number } = {},
): string {
  const params = new URLSearchParams();
  if (options.width) params.set("width", String(options.width));
  if (options.time !== undefined) params.set("time", String(options.time));
  const query = params.toString();
  return `${IMAGE_HOST}/${playbackId}/thumbnail.webp${query ? `?${query}` : ""}`;
}

export function muxLoopUrl(
  playbackId: string,
  options: { width?: number; start?: number; end?: number } = {},
): string {
  const params = new URLSearchParams();
  if (options.width) params.set("width", String(options.width));
  if (options.start !== undefined) params.set("start", String(options.start));
  if (options.end !== undefined) params.set("end", String(options.end));
  const query = params.toString();
  return `${IMAGE_HOST}/${playbackId}/animated.webp${query ? `?${query}` : ""}`;
}

export function muxStreamUrl(playbackId: string): string {
  return `${STREAM_HOST}/${playbackId}.m3u8`;
}

/** "16:9" -> 1.777…  Returns undefined when Mux has not reported one yet. */
export function muxAspectRatio(ratio: string | null | undefined) {
  if (!ratio) return undefined;
  const [w, h] = ratio.split(":").map(Number);
  if (!w || !h) return undefined;
  return w / h;
}

/** Seconds -> "1:04". Mux reports fractional seconds. */
export function formatDuration(seconds: number | null | undefined) {
  if (!seconds || seconds < 0) return undefined;
  const total = Math.round(seconds);
  const minutes = Math.floor(total / 60);
  return `${minutes}:${String(total % 60).padStart(2, "0")}`;
}
