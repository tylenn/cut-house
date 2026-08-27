import { TagIcon } from "@sanity/icons/Tag";
import { defineField, defineType } from "sanity";

/**
 * Not surfaced by the launch layout. It exists now so filtering can be switched
 * on later without a content migration.
 */
export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      description: "Optional — a line about what belongs in here.",
    }),
  ],
});
