import { InfoOutlineIcon } from "@sanity/icons/InfoOutline";
import { defineArrayMember, defineField, defineType } from "sanity";

export const infoPage = defineType({
  name: "infoPage",
  title: "Information page",
  type: "document",
  icon: InfoOutlineIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      description:
        "Browser tab title. Not shown on the page itself — the sections carry the layout.",
    }),
    defineField({
      name: "availability",
      title: "Availability",
      type: "string",
      description: 'The line under the email — "Available globally."',
    }),
    defineField({
      name: "application",
      title: "Application",
      type: "text",
      rows: 3,
      description:
        "The short note under Application, typically about the full list being available on request.",
    }),
    defineField({
      name: "bio",
      title: "Description",
      type: "richText",
      description: "The main write-up.",
    }),
    defineField({
      name: "readMoreUrl",
      title: "Read more",
      type: "url",
      description:
        'Optional. Shown as a "read more" link under the description.',
      validation: (Rule) =>
        Rule.uri({ scheme: ["http", "https", "mailto"] }),
    }),
    defineField({
      name: "portrait",
      title: "Portrait",
      type: "image",
      description: "Optional — a photo to run alongside the text.",
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
      name: "clients",
      title: "Clients",
      type: "array",
      description: "One name per line. Shown as a list.",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "seo",
      title: "Search & sharing",
      type: "seo",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Information page" }),
  },
});
