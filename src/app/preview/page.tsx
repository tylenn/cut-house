import { notFound } from "next/navigation";

import { PreviewStage } from "./PreviewStage";

/**
 * Design harness. Renders the chrome, the intro and the grid against fixtures so
 * the layout and motion can be worked on before — or independently of — a live
 * dataset.
 *
 * Dev only, and safe to delete once the design has settled.
 */
export default function PreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <PreviewStage />;
}
