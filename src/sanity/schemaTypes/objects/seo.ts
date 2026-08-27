import { SearchIcon } from "@sanity/icons/Search";
import { defineField, defineType } from "sanity";

/**
 * Every field is optional and every field documents what it falls back to, so
 * leaving the whole object empty is a valid, sensible choice.
 *
 * Length limits are `.warning()`, never `.error()` — a long title should nudge,
 * not block publishing.
 */
export const seo = defineType({
  name: "seo",
  title: "Search & sharing",
  type: "object",
  icon: SearchIcon,
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "title",
      title: "Search title",
      type: "string",
      description:
        "Shown in Google results and browser tabs. Leave blank to use the page title.",
      validation: (Rule) =>
        Rule.max(60).warning("Google usually cuts off around 60 characters."),
    }),
    defineField({
      name: "description",
      title: "Search description",
      type: "text",
      rows: 3,
      description:
        "The grey paragraph under the link in Google. Leave blank to use the summary.",
      validation: (Rule) =>
        Rule.max(160).warning("Google usually cuts off around 160 characters."),
    }),
    defineField({
      name: "image",
      title: "Sharing image",
      type: "image",
      description:
        "The preview when the page is pasted into Instagram, Slack or a text. Leave blank to use the poster frame.",
      options: { hotspot: true },
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      type: "boolean",
      description:
        "Asks Google not to list this page. The page still works for anyone with the link.",
      initialValue: false,
    }),
  ],
});
