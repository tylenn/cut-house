import { LinkIcon } from "@sanity/icons/Link";
import { defineField, defineType } from "sanity";

export const socialLink = defineType({
  name: "socialLink",
  title: "Link",
  type: "object",
  icon: LinkIcon,
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description: 'What it says on the site — "Instagram", "Email", "Vimeo".',
    }),
    defineField({
      name: "url",
      title: "Address",
      type: "url",
      description:
        "A web address, an email link (mailto:you@example.com) or a phone link (tel:+15555550123).",
      validation: (Rule) =>
        Rule.uri({ scheme: ["http", "https", "mailto", "tel"] }),
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "url" },
  },
});
