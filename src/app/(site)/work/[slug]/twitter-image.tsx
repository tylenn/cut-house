import {
  ogAlt,
  ogContentType,
  ogSize,
  renderProjectOgImage,
} from "@/lib/og";

export const alt = ogAlt;
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return renderProjectOgImage(slug);
}
