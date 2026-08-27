import { EyeClosedIcon } from "@sanity/icons/EyeClosed";
import { VideoIcon } from "@sanity/icons/Video";
import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * The only type touched daily.
 *
 * Only `title` and `slug` are required — a project can go up today with just a
 * video and a name and be backfilled with credits, stills and a write-up months
 * later. Resist adding `Rule.required()` to anything else.
 */
export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  icon: VideoIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "media", title: "Media" },
    { name: "details", title: "Details" },
    { name: "seo", title: "Search & sharing" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL",
      type: "slug",
      group: "content",
      description: "This becomes the web address: /work/your-title-here",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "client",
      title: "Client",
      type: "string",
      group: "content",
      description: "Leave blank for personal work.",
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      group: "content",
      description:
        "Roughly when it was made. Sets the year shown on the page and the order of the grid.",
      options: { dateFormat: "MMMM YYYY" },
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      group: "content",
      description:
        "One or two sentences. Used on the grid, in Google results and in link previews.",
      validation: (Rule) =>
        Rule.max(280).warning("Long summaries get cut off in link previews."),
    }),
    defineField({
      name: "body",
      title: "Write-up",
      type: "richText",
      group: "content",
      description: "Optional — the longer story behind the project.",
    }),

    defineField({
      name: "video",
      title: "Film",
      type: "mux.video",
      group: "media",
      description:
        "Drag the video file in. Everything else — the still frame, the hover preview, the quality options — is made for you.",
    }),
    defineField({
      name: "poster",
      title: "Still frame",
      type: "image",
      group: "media",
      description:
        "Only if you want a specific frame. Left blank, a frame is picked from the film automatically.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "Describe the image for people using a screen reader.",
        }),
      ],
    }),
    defineField({
      name: "loop",
      title: "Hover preview",
      type: "file",
      group: "media",
      description:
        "Only if you want a specific clip to play when someone hovers the grid. MP4 or WebM look far better and load faster than a GIF.",
      options: { accept: "video/mp4,video/webm,image/gif" },
    }),
    defineField({
      name: "gallery",
      title: "Stills",
      type: "array",
      group: "media",
      description: "Frames, behind-the-scenes, anything that supports the film.",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
              description:
                "Describe the image for people using a screen reader.",
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
              description: "Optional — shown beneath the image.",
            }),
          ],
        }),
      ],
      options: { layout: "grid" },
    }),

    defineField({
      name: "roles",
      title: "Your role",
      type: "array",
      group: "details",
      description: "What you did on this one — Director, Editor, DP.",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
    defineField({
      name: "credits",
      title: "Credits",
      type: "array",
      group: "details",
      description: "Everyone else who worked on it.",
      of: [defineArrayMember({ type: "credit" })],
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      group: "details",
      description: "Optional — used for filtering later on.",
      of: [defineArrayMember({ type: "reference", to: [{ type: "category" }] })],
    }),
    defineField({
      name: "externalUrl",
      title: "Link",
      type: "url",
      group: "details",
      description:
        "Optional — a campaign page, press write-up or the client's site.",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "featured",
      title: "Feature this",
      type: "boolean",
      group: "details",
      description: "Gives it more room on the home page.",
      initialValue: false,
    }),
    defineField({
      name: "hidden",
      title: "Hide from the grid",
      type: "boolean",
      group: "details",
      description:
        "Takes it off the home page but keeps the link working — handy for sending a client a private view.",
      initialValue: false,
    }),
    defineField({
      name: "orderRank",
      title: "Position",
      type: "number",
      group: "details",
      description:
        "Lower numbers come first. Leave blank and it sorts by date, newest first.",
    }),

    defineField({
      name: "seo",
      title: "Search & sharing",
      type: "seo",
      group: "seo",
    }),
  ],
  orderings: [
    {
      title: "Manual order",
      name: "manual",
      by: [
        { field: "orderRank", direction: "asc" },
        { field: "date", direction: "desc" },
      ],
    },
    { title: "Newest first", name: "newest", by: [{ field: "date", direction: "desc" }] },
    { title: "A–Z", name: "alpha", by: [{ field: "title", direction: "asc" }] },
  ],
  preview: {
    select: {
      title: "title",
      client: "client",
      date: "date",
      hidden: "hidden",
      media: "poster",
    },
    prepare({ title, client, date, hidden, media }) {
      const year = date ? new Date(date).getFullYear() : undefined;
      const subtitle = [client, year].filter(Boolean).join(" · ");
      return {
        title: hidden ? `${title} (hidden)` : title,
        subtitle: subtitle || undefined,
        media: hidden ? EyeClosedIcon : media,
      };
    },
  },
});
