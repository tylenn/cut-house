# cut house

Portfolio site for cut house. Next.js 16 App Router, Sanity for content, Mux for
video, deployed on Vercel. The Studio is embedded at `/studio`, so there is one
repo, one deploy, one domain and one set of environment variables.

Requires **Node 24 LTS**. Node 23 is odd-numbered and outside the engine range of
several transitive dependencies — it installs with warnings and Vercel will not
offer it. There is an `.nvmrc`; run `nvm use`.

```bash
nvm use
npm install
cp .env.example .env.local   # then fill it in, see below
npm run typegen
npm run dev
```

---

## First-time setup

### 1. Create the Sanity project

1. Sign up at [sanity.io/manage](https://sanity.io/manage) and create a project.
2. Create a dataset called `production` (public is fine — the site reads it
   anonymously).
3. Copy the project ID into `NEXT_PUBLIC_SANITY_PROJECT_ID` in `.env.local`.

### 2. Create two API tokens

Under **Manage → API → Tokens**. They are deliberately different roles:

| Env var | Role | Used by | Deployed? |
| --- | --- | --- | --- |
| `SANITY_API_READ_TOKEN` | **Viewer** | Draft previews, Live Content API | Yes |
| `SANITY_API_WRITE_TOKEN` | **Editor** | `scripts/seed.ts` only | **Never** |

The write token can create and delete content. It belongs in `.env.local` on
your machine and nowhere else — do not add it to Vercel.

### 3. Add CORS origins

Under **Manage → API → CORS Origins**, add every origin the Studio runs on, with
**credentials allowed** ticked:

- `http://localhost:3000`
- your production origin, e.g. `https://cuthouse.ca`

Without this the Studio loads but cannot reach the dataset, and the failure is a
generic network error rather than anything that names CORS.

### 4. Connect Mux

Mux credentials are **not** environment variables — do not add them to
`.env.example`. The plugin stores them as a private document inside the dataset.

1. Create a Mux account and an **access token** (Settings → Access Tokens) with
   *Mux Video* read and write permissions.
2. Run `npm run dev`, open `http://localhost:3000/studio`.
3. Open any project, find the **Film** field, and click the gear/settings icon on
   the Mux input.
4. Paste the token ID and secret. Done once, for the whole dataset.

### 5. Import the legacy media (optional)

Drop the old site's grid GIFs into `legacy/indeximages/`, then:

```bash
npm run seed
```

Everything lands as a **draft**, so nothing is public until it is published from
the Studio. The script is idempotent — re-running skips what already exists;
pass `--replace` to overwrite.

---

## Environment variables

```
NEXT_PUBLIC_SANITY_PROJECT_ID       from sanity.io/manage
NEXT_PUBLIC_SANITY_DATASET          production
NEXT_PUBLIC_SANITY_API_VERSION      pinned date, e.g. 2026-01-01
SANITY_API_READ_TOKEN               Viewer role
SANITY_API_WRITE_TOKEN              Editor role — local only
SANITY_REVALIDATE_SECRET            must match the Sanity webhook secret
NEXT_PUBLIC_SITE_URL                canonical origin, no trailing slash
```

`NEXT_PUBLIC_SITE_URL` falls back to `VERCEL_PROJECT_PRODUCTION_URL`, so preview
deploys still emit absolute URLs.

All of these are read in `src/sanity/env.ts` and nowhere else. Missing ones throw
at module load with a message pointing back at `.env.example`, rather than
surfacing later as a confusing 404 from the Content Lake.

---

## Content model

Only `title` and `slug` are ever required. A project can go up today with just a
video and a name and be backfilled months later.

### `project`

| Field | Type | Notes |
| --- | --- | --- |
| `title` | string | **required** |
| `slug` | slug | **required** — the URL is `/work/{slug}` |
| `client` | string | blank means personal work |
| `date` | date | drives the displayed year and the grid order |
| `summary` | text | cards, meta description, link previews |
| `body` | richText | long-form write-up |
| `video` | mux.video | the film |
| `poster` | image | **override** for Mux's chosen frame |
| `loop` | file | **override** for the hover loop; MP4/WebM beats GIF |
| `gallery` | image[] | stills, each with alt + caption |
| `roles` | string[] | his role — Director, Editor, DP |
| `credits` | credit[] | everyone else |
| `categories` | reference[] | taxonomy, unused by the launch layout |
| `externalUrl` | url | campaign page or client site |
| `featured` | boolean | homepage feature |
| `hidden` | boolean | drops out of the grid, URL keeps working |
| `orderRank` | number | manual sort; blank falls back to date desc |
| `seo` | seo | collapsed by default, every field optional |

### Singletons

`siteSettings` and `infoPage` live at fixed document IDs and are pinned in the
Studio sidebar. Document actions are filtered so they cannot be duplicated or
deleted.

### Objects

`richText` (deliberately narrow — no tables, no colour), `credit`, `socialLink`,
`seo`.

---

## Architecture notes

**All reads go through `sanityFetch`.** Production gets cached static data with
sync tags attached per query; draft mode revalidates over a websocket so Studio
edits appear live. The only two exceptions are `generateStaticParams` and
`sitemap.ts`, which run outside the request lifecycle and use the plain client.

**Types are generated, not written.** `npm run typegen` extracts the schema and
regenerates `src/sanity/types.ts` — **run it after any schema or query change**.
That file is committed because the build needs it; `src/sanity/extract.json` is
an intermediate and is gitignored.

**Stega.** Draft mode brands strings with invisible Visual Editing payloads.
Component props widen over both cases via `StegaAware<T>`. `generateMetadata`
passes `stega: false`, because metadata strings land in `<title>` and `og:` tags
verbatim. Body content is never `stegaClean()`ed — that would strip the markers
Visual Editing needs.

**The Mux payoff.** One upload gives a poster frame, an animated loop, an HLS
manifest, the aspect ratio and the duration. `poster` and `loop` in the schema
are therefore only overrides; the fallback chain everywhere is
*uploaded asset → Mux-generated → nothing*. URL builders live in
`src/sanity/lib/mux.ts`, never inline in components.

**Prev/next is index-based, on purpose.** The obvious implementation compares
`orderRank` with `<` / `>` in GROQ. That is a bug here: the grid sorts on
`coalesce(orderRank, 999999) asc, date desc`, so every project without a manual
position shares the same fallback rank, the comparison matches nothing, and the
nav silently vanishes. Instead `PROJECT_ORDER_QUERY` fetches a lightweight
ordered `{title, slug}` list using the *same* ordering and neighbours resolve by
array index.

**Performance.** `next/image` with AVIF/WebP. LQIP blur placeholders come free
out of asset metadata, so there is no layout shift. Hover loops are not mounted
until the first hover or focus. The Mux player is imported from
`@mux/mux-player-react/lazy`, so a grid never downloads a player nobody pressed
play on. `prefers-reduced-motion` is honoured in `globals.css`.

**Two freshness paths.** The Live Content API handles it automatically. The
`/api/revalidate` webhook is belt-and-braces for an immediate purge on publish —
it validates the signature and 401s on failure. Note `revalidateTag` takes two
arguments in Next 16; `updateTag` is the single-arg one but is Server-Action only
and does nothing in a route handler.

**A build against an unreachable dataset fails on purpose.**
`generateStaticParams` does not swallow errors. An empty dataset returns `[]`
cleanly, so the only thing a throw signals is genuine misconfiguration —
and silently shipping an empty portfolio is worse than a failed deploy.

---

## Deploying to Vercel

1. Import the repo. Framework preset is detected; leave the build command alone.
2. Set the Node version to **24.x** under Settings → General.
3. Add every env var above **except `SANITY_API_WRITE_TOKEN`**.
4. Deploy, then add the production origin under
   **sanity.io/manage → API → CORS Origins** with credentials allowed —
   otherwise the deployed Studio cannot reach the dataset.
5. Optional, for instant purges on publish: **Manage → API → Webhooks**, POST to
   `https://your-domain/api/revalidate`, dataset `production`, trigger on
   create/update/delete, and set the secret to match `SANITY_REVALIDATE_SECRET`.

---

## Scripts

| Command | Does |
| --- | --- |
| `npm run dev` | Site at `/`, Studio at `/studio` |
| `npm run build` | Production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run typegen` | Regenerate `src/sanity/types.ts` from schema + queries |
| `npm run seed` | Import `legacy/indeximages/` as drafts |

---

## Design reference

`reference/` holds the client's mockup walkthroughs, chopped to frames, plus
`MOCKUP-NOTES.md` — a written read of the layout, the intro animation, and the
open questions. The current layout is deliberately plain scaffolding; all colour
and type tokens live in a single `@theme` block in `src/app/globals.css` so the
design can drop in without a refactor.
