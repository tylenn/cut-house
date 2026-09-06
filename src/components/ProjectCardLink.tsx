"use client";

import { type ReactNode } from "react";

import { TransitionLink } from "@/components/TransitionLink";
import { workHref } from "@/lib/routes";

export function ProjectCardLink({
  slug,
  index,
  media,
  meta,
}: {
  slug: string;
  index: number;
  media: ReactNode;
  meta: ReactNode;
}) {
  return (
    <TransitionLink
      href={workHref(slug)}
      className="stagger-child group block"
      style={{ "--i": index } as React.CSSProperties}
    >
      {media}
      {meta}
    </TransitionLink>
  );
}
