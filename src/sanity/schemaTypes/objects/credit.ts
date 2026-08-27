import { UserIcon } from "@sanity/icons/User";
import { defineField, defineType } from "sanity";

export const credit = defineType({
  name: "credit",
  title: "Credit",
  type: "object",
  icon: UserIcon,
  fields: [
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      description: 'What they did — "Director", "Gaffer", "Production".',
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "Person or company. Commas are fine for more than one.",
    }),
    defineField({
      name: "url",
      title: "Link",
      type: "url",
      description: "Optional — their site or Instagram.",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "role" },
  },
});
