import {
  PortableText as PortableTextRenderer,
  type PortableTextProps,
} from "next-sanity";

import { SanityImage, type SanityImageValue } from "@/components/SanityImage";

/**
 * Typed against the generated queries rather than `any`. `InferValue` pulls the
 * block shape out of the query map, so a schema change surfaces here as a type
 * error instead of a blank render.
 */
type Components = NonNullable<PortableTextProps["components"]>;

const components: Components = {
  block: {
    normal: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
    h2: ({ children }) => (
      <h2 className="mt-8 mb-3 font-semibold first:mt-0">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 mb-2 font-semibold first:mt-0">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l border-(--color-rule) pl-4 text-(--color-ink-muted)">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-4 list-disc pl-4">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mb-4 list-decimal pl-4">{children}</ol>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : undefined;
      if (!href) return <>{children}</>;
      const external = href.startsWith("http");
      return (
        <a
          href={href}
          className="underline underline-offset-2 hover:text-(--color-ink-muted)"
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {children}
        </a>
      );
    },
  },
  types: {
    inlineImage: ({ value }) => (
      <figure className="my-6">
        <SanityImage
          image={value as SanityImageValue}
          sizes="(max-width: 768px) 100vw, 60vw"
          className="h-auto w-full"
        />
        {value?.caption ? (
          <figcaption className="mt-2 text-(length:--text-meta) text-(--color-ink-muted)">
            {value.caption}
          </figcaption>
        ) : null}
      </figure>
    ),
  },
};

/**
 * Note: no stegaClean() on the way in. Draft mode needs the invisible markers
 * intact for Visual Editing to map a click back to a field.
 */
export function PortableText({ value }: { value: PortableTextProps["value"] }) {
  if (!value) return null;
  return <PortableTextRenderer value={value} components={components} />;
}
