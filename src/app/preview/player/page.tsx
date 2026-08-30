import { notFound } from "next/navigation";

import { PlayerPreview } from "./PlayerPreview";

/**
 * Player harness. The control chrome and its iconography, with no Mux asset
 * behind it, so the icons can be judged before there is anything to play.
 *
 * Dev only, and safe to delete once the design has settled.
 */
export default function PlayerPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <PlayerPreview />;
}
