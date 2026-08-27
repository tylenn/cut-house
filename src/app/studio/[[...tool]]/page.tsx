import { NextStudio } from "next-sanity/studio";

import config from "../../../../sanity.config";

// The Studio is a client-side SPA; there is nothing for the server to render
// per-request, and forcing static keeps it off the serverless function budget.
export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
