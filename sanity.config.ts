"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { muxInput } from "sanity-plugin-mux-input";

import { apiVersion, dataset, projectId, studioUrl } from "@/sanity/env";
import { schemaTypes } from "@/sanity/schemaTypes";
import { SINGLETON_TYPES, structure } from "@/sanity/structure";

export default defineConfig({
  basePath: studioUrl,
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({ structure }),
    muxInput({
      // 'plus' is what unlocks max_resolution_tier and static renditions.
      video_quality: "plus",
      max_resolution_tier: "2160p",
      normalize_audio: true,
      // Required, because we build unsigned image.mux.com / stream.mux.com URLs.
      defaultPublic: true,
      // static_renditions: ["highest"] would add downloadable MP4s. Left off:
      // it costs storage and nothing on the site needs a file download.
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  document: {
    // Singletons live at fixed IDs, so remove the actions that would create a
    // second copy or delete the only one.
    actions: (input, context) =>
      SINGLETON_TYPES.has(context.schemaType)
        ? input.filter(({ action }) =>
            ["publish", "discardChanges", "restore"].includes(action ?? ""),
          )
        : input,
  },
});
