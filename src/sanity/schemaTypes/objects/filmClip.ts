import { PlayIcon } from "@sanity/icons/Play";
import { defineField, defineType } from "sanity";

/**
 * A film beyond the main one — a cutdown, an alternate, behind the scenes.
 * The label is optional: an unnamed clip simply renders without a caption.
 */
export const filmClip = defineType({
  name: "filmClip",
  title: "Film",
  type: "object",
  icon: PlayIcon,
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description: 'Optional — "30s cutdown", "Behind the scenes".',
    }),
    defineField({
      name: "video",
      title: "Film",
      type: "mux.video",
    }),
  ],
  preview: {
    prepare: ({ title }: { title?: string }) => ({
      title: title || "Film",
    }),
    select: { title: "label" },
  },
});
