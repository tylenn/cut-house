import type Link from "next/link";
import type { useRouter } from "next/navigation";
import type { ComponentProps } from "react";

/** The href type Link accepts under `typedRoutes: true`. */
export type Href = ComponentProps<typeof Link>["href"];

/** The (narrower) type router.push accepts. */
export type PushTarget = Parameters<ReturnType<typeof useRouter>["push"]>[0];

/**
 * typedRoutes checks hrefs against literal route templates, and its `SafeSlug`
 * helper rejects a bare `string` because a string could contain a slash. Slugs
 * come out of Sanity as `string`, so every project link needs the same cast —
 * better once, here, than at each call site.
 */
export function workHref(slug: string): Href {
  return `/work/${slug}` as Href;
}
