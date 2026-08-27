import { CogIcon } from "@sanity/icons/Cog";
import { InfoOutlineIcon } from "@sanity/icons/InfoOutline";
import { TagIcon } from "@sanity/icons/Tag";
import { VideoIcon } from "@sanity/icons/Video";
import type { StructureResolver } from "sanity/structure";

/**
 * Documents that must exist exactly once, at a known ID, so the site can fetch
 * them without a "which one is the real settings document?" query.
 */
export const SINGLETON_TYPES = new Set(["siteSettings", "infoPage"]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.documentTypeListItem("project").title("Projects").icon(VideoIcon),
      S.documentTypeListItem("category").title("Categories").icon(TagIcon),
      S.divider(),
      S.listItem()
        .title("Information page")
        .icon(InfoOutlineIcon)
        .child(S.document().schemaType("infoPage").documentId("infoPage")),
      S.listItem()
        .title("Site settings")
        .icon(CogIcon)
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings"),
        ),
    ]);
