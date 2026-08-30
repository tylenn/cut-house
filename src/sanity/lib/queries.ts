import { defineQuery } from "next-sanity";

/**
 * One image projection, used everywhere.
 *
 * `lqip` is a base64 blur placeholder that already ships in every asset's
 * metadata — it costs no extra request and feeding it to next/image as
 * `blurDataURL` removes the layout shift on load. `dimensions` gives us the
 * intrinsic aspect ratio for the same reason.
 */
const IMAGE_FRAGMENT = /* groq */ `
  asset,
  hotspot,
  crop,
  alt,
  "lqip": asset->metadata.lqip,
  "dimensions": asset->metadata.dimensions
`;

/**
 * The Mux asset, flattened. `data` holds Mux's own report of the asset, which
 * is where the aspect ratio and duration live.
 */
const VIDEO_FRAGMENT = /* groq */ `
  "playbackId": asset->playbackId,
  "aspectRatio": asset->data.aspect_ratio,
  "duration": asset->data.duration,
  "status": asset->status
`;

/**
 * Grid order. Two keys, because `orderRank` is optional: anything without a
 * manual position falls back to a shared sentinel and then sorts by date.
 * PROJECT_ORDER_QUERY below must keep this identical — see the note there.
 */
const GRID_ORDER = /* groq */ `coalesce(orderRank, 999999) asc, date desc`;

export const PROJECTS_QUERY = defineQuery(`
  *[_type == "project" && hidden != true] | order(${GRID_ORDER}) {
    _id,
    title,
    "slug": slug.current,
    client,
    date,
    summary,
    featured,
    roles,
    poster { ${IMAGE_FRAGMENT} },
    "loopUrl": loop.asset->url,
    video { ${VIDEO_FRAGMENT} }
  }
`);

export const PROJECT_QUERY = defineQuery(`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    client,
    date,
    summary,
    body[] {
      ...,
      _type == "inlineImage" => { ${IMAGE_FRAGMENT}, caption },
      markDefs[] { ... }
    },
    roles,
    credits[] { _key, role, name, url },
    categories[]-> { _id, title, "slug": slug.current },
    externalUrl,
    poster { ${IMAGE_FRAGMENT} },
    gallery[] { _key, ${IMAGE_FRAGMENT}, caption },
    video { ${VIDEO_FRAGMENT} },
    additionalVideos[] { _key, label, video { ${VIDEO_FRAGMENT} } },
    seo { title, description, noIndex, image { ${IMAGE_FRAGMENT} } }
  }
`);

/**
 * Prev/next.
 *
 * The tempting version is a GROQ sub-query comparing orderRank with < / >.
 * That is a bug: every project without a manual position shares the same
 * coalesced rank, so the comparison matches nothing and the nav silently
 * disappears. Fetch the ordered list instead — two lines per project — and
 * resolve neighbours by array index. The ordering here MUST match GRID_ORDER.
 */
export const PROJECT_ORDER_QUERY = defineQuery(`
  *[_type == "project" && hidden != true] | order(${GRID_ORDER}) {
    title,
    "slug": slug.current
  }
`);

/** Includes hidden projects: they stay live at their own URL. */
export const PROJECT_SLUGS_QUERY = defineQuery(`
  *[_type == "project" && defined(slug.current)].slug.current
`);

/** Hidden projects are excluded from the sitemap but remain reachable. */
export const SITEMAP_QUERY = defineQuery(`
  *[_type == "project" && hidden != true && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  }
`);

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_id == "siteSettings"][0] {
    title,
    tagline,
    description,
    email,
    socialLinks[] { _key, label, url },
    lettermark { ${IMAGE_FRAGMENT} },
    ogImage { ${IMAGE_FRAGMENT} },
    "resumeUrl": resume.asset->url
  }
`);

export const INFO_PAGE_QUERY = defineQuery(`
  *[_id == "infoPage"][0] {
    heading,
    bio[] {
      ...,
      _type == "inlineImage" => { ${IMAGE_FRAGMENT}, caption },
      markDefs[] { ... }
    },
    portrait { ${IMAGE_FRAGMENT} },
    clients,
    seo { title, description, noIndex, image { ${IMAGE_FRAGMENT} } }
  }
`);
