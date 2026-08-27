import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";

import { dataset, projectId } from "@/sanity/env";

const builder = createImageUrlBuilder({ projectId, dataset });

/**
 * The generated query shapes are structurally compatible with `SanityImageSource`
 * but not nominally — TypeGen emits its own asset types. One cast here beats a
 * cast at every call site.
 */
export function urlFor(source: unknown) {
  return builder.image(source as SanityImageSource);
}
