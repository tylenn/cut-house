import {
  ogAlt,
  ogContentType,
  ogSize,
  renderInfoOgImage,
} from "@/lib/og";

export const alt = ogAlt;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderInfoOgImage();
}
