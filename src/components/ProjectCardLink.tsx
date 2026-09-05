"use client";

import { useRef, type ReactNode } from "react";

import { ProjectEnterLink } from "@/components/ProjectEnterLink";
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
  const mediaRef = useRef<HTMLDivElement>(null);

  return (
    <ProjectEnterLink
      href={workHref(slug)}
      enter="grid"
      mediaRef={mediaRef}
      className="stagger-child group block"
      style={{ "--i": index } as React.CSSProperties}
    >
      <div ref={mediaRef}>{media}</div>
      {meta}
    </ProjectEnterLink>
  );
}
