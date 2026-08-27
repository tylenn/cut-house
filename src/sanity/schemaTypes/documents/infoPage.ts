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
      description: "The title at the top of the page.",
    }),
    defineField({
      name: "bio",
      title: "About",
      type: "richText",
      description: "The main write-up.",
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
      options: { layout: "tags" },
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
