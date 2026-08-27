import { defineCliConfig } from "sanity/cli";

import { dataset, projectId } from "@/sanity/env";

export default defineCliConfig({
  api: { projectId, dataset },
  autoUpdates: false,
  typegen: {
    path: "./src/**/*.{ts,tsx,js,jsx}",
    schema: "./src/sanity/extract.json",
    generates: "./src/sanity/types.ts",
    overloadClientMethods: true,
  },
});
