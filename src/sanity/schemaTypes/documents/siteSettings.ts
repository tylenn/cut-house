import { CogIcon } from "@sanity/icons/Cog";
import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "general", title: "General", default: true },
    { name: "brand", title: "Brand" },
    { name: "contact", title: "Contact" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Site name",
      type: "string",
      group: "general",
      description: "Shown in the corner of every page and in the browser tab.",
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      group: "general",
      description: 'The line under the name — "a global production services company".',
    }),
    defineField({
      name: "description",
      title: "Site description",
      type: "text",
      rows: 3,
      group: "general",
      description:
        "Used in Google results and link previews for pages that do not set their own.",
      validation: (Rule) =>
        Rule.max(160).warning("Google usually cuts off around 160 characters."),
    }),
    defineField({
      name: "lettermark",
      title: "Lettermark",
      type: "image",
      group: "brand",
      description:
        "The mark used in place of the name. An animated GIF works here.",
    }),
    defineField({
      name: "favicon",
      title: "Favicon",
      type: "image",
      group: "brand",
      description: "The tiny icon in the browser tab. A square image works best.",
    }),
    defineField({
      name: "ogImage",
      title: "Default sharing image",
      type: "image",
      group: "brand",
      description:
        "The fallback preview when a link is pasted somewhere. Pages with their own image use that instead.",
      options: { hotspot: true },
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      group: "contact",
      description: "The address shown on the site.",
    }),
    defineField({
      name: "socialLinks",
      title: "Links",
      type: "array",
      group: "contact",
      description: "Instagram, Vimeo, anywhere else worth pointing at.",
      of: [defineArrayMember({ type: "socialLink" })],
    }),
    defineField({
      name: "resume",
      title: "Resume",
      type: "file",
      group: "contact",
      description: "Optional — a PDF people can download.",
      options: { accept: "application/pdf" },
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site settings" }),
  },
});
