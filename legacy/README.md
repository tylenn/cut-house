# Legacy site

The previous static site, kept for reference only. Nothing in here is built,
deployed, linked, or type-checked.

- `indeximages/` — the original grid GIFs. `scripts/seed.ts` imports these as
  **drafts** so they can be reviewed and published (or discarded) from the Studio.
- Old URLs `/index.html` and `/info.html` are redirected in `next.config.ts`.

Drop the old repo's files in here as-is. `scripts/seed.ts` reads
`legacy/indeximages/*.{gif,mp4,webm}` and derives titles from the filenames.
