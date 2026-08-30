/**
 * One-off import of the legacy grid media.
 *
 *   node --env-file=.env.local scripts/seed.ts
 *   node --env-file=.env.local scripts/seed.ts --replace
 *
 * Needs SANITY_API_WRITE_TOKEN (Editor role). Never deploy that token.
 *
 * Everything lands as a draft (`drafts.` prefix) so nothing goes live until it
 * is reviewed and published from the Studio.
 */

import { createClient } from "@sanity/client";
import { readdir, readFile } from "node:fs/promises";
import { basename, extname, join } from "node:path";

const LEGACY_DIR = join(process.cwd(), "legacy", "indeximages");
const MEDIA = /\.(gif|mp4|webm)$/i;

const replace = process.argv.includes("--replace");

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}. See .env.example.`);
  }
  return value;
}

const client = createClient({
  projectId: required("NEXT_PUBLIC_SANITY_PROJECT_ID"),
  dataset: required("NEXT_PUBLIC_SANITY_DATASET"),
  apiVersion: required("NEXT_PUBLIC_SANITY_API_VERSION"),
  token: required("SANITY_API_WRITE_TOKEN"),
  useCdn: false,
});

/** "TURO LANDING GIF.gif" -> "Turo Landing" */
function titleFromFilename(filename: string): string {
  return basename(filename, extname(filename))
    .replace(/\b(gif|mp4|webm|loop|final|v\d+)\b/gi, "")
    .trim()
    .toLowerCase()
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function seedSingletons() {
  // createIfNotExists, so re-running never clobbers settings he has edited.
  await client.createIfNotExists({
    _id: "siteSettings",
    _type: "siteSettings",
    title: "cut house",
    tagline: "a global production services company",
  });

  await client.createIfNotExists({
    _id: "infoPage",
    _type: "infoPage",
    heading: "Information",
    bio: [
      {
        _type: "block",
        _key: "bio0",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "bio0a",
            marks: [],
            text:
              "With the ability to execute distinctive projects, Tylen's work " +
              "has led him to collaborate with global brands such as Sony, " +
              "Salomon, Turo and more. Having majored in design, his creative " +
              "practice is deeply informed by the arts, bringing a unique " +
              "approach to every project.",
          },
        ],
      },
    ],
  });

  console.log("✓ singletons");
}

async function seedProjects() {
  let files: string[];
  try {
    files = (await readdir(LEGACY_DIR)).filter((f) => MEDIA.test(f)).sort();
  } catch {
    console.log(`No legacy media at ${LEGACY_DIR} — skipping projects.`);
    return;
  }

  if (!files.length) {
    console.log("No legacy media found — skipping projects.");
    return;
  }

  for (const [index, filename] of files.entries()) {
    const title = titleFromFilename(filename);
    const slug = slugify(title);
    // ID derived from the slug, so a re-run is idempotent.
    const _id = `drafts.legacy-${slug}`;

    const existing = await client.getDocument(_id).catch(() => undefined);
    if (existing && !replace) {
      console.log(`· ${title} — exists, skipping`);
      continue;
    }

    const buffer = await readFile(join(LEGACY_DIR, filename));

    // Uploaded twice on purpose, and they are not interchangeable:
    //   - as an `image` asset, the Sanity CDN pipeline serves a single static
    //     frame, which gives us a poster without asking anyone to pick one;
    //   - as a `file` asset, the bytes are served untouched, so the GIF stays
    //     animated and can drive the hover loop.
    const [imageAsset, fileAsset] = await Promise.all([
      client.assets.upload("image", buffer, { filename }),
      client.assets.upload("file", buffer, { filename }),
    ]);

    await client.createOrReplace({
      _id,
      _type: "project",
      title,
      slug: { _type: "slug", current: slug },
      poster: {
        _type: "image",
        asset: { _type: "reference", _ref: imageAsset._id },
      },
      loop: {
        _type: "file",
        asset: { _type: "reference", _ref: fileAsset._id },
      },
      // Preserves the old grid order; gaps of 10 leave room to insert by hand.
      orderRank: index * 10,
    });

    console.log(`✓ ${title}`);
  }
}

await seedSingletons();
await seedProjects();
console.log("\nDone. Everything imported as drafts — publish from /studio.");
