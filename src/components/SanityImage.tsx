import Image from "next/image";

import { urlFor } from "@/sanity/lib/image";

/**
 * One structural type covers every image on the site — posters, stills,
 * portraits, lettermark, OG images — rather than deriving a separate prop type
 * per call site. The asset is nullable because an editor can add an image field
 * and leave it empty.
 */
export type SanityImageValue = {
  asset?: { _ref?: string | null } | null;
  hotspot?: unknown;
  crop?: unknown;
  alt?: string | null;
  lqip?: string | null;
  dimensions?: {
    width?: number | null;
    height?: number | null;
    aspectRatio?: number | null;
  } | null;
} | null;

type Props = {
  image: SanityImageValue;
  /** Falls back to the image's own alt text, then to empty (decorative). */
  alt?: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  /** Square-crops to this many pixels instead of using intrinsic dimensions. */
  square?: number;
};

export function SanityImage({
  image,
  alt,
  sizes,
  className,
  priority = false,
  square,
}: Props) {
  if (!image?.asset?._ref) return null;

  const width = square ?? image.dimensions?.width ?? 1600;
  const height = square ?? image.dimensions?.height ?? 900;

  const builder = urlFor(image).width(width).height(height).auto("format");

  return (
    <Image
      src={builder.url()}
      alt={alt ?? image.alt ?? ""}
      width={width}
      height={height}
      sizes={sizes}
      className={className}
      priority={priority}
      // Ships in every asset's metadata, so this costs no extra request and
      // removes the layout shift on load.
      placeholder={image.lqip ? "blur" : undefined}
      blurDataURL={image.lqip ?? undefined}
    />
  );
}
