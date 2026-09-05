"use client";

import { type ComponentProps, type RefObject } from "react";

import { TransitionLink } from "@/components/TransitionLink";
import {
  setProjectEnterAdjacent,
  setProjectEnterFromGrid,
} from "@/lib/project-enter";

type Props = ComponentProps<typeof TransitionLink> & {
  enter: "grid" | "adjacent";
  mediaRef?: RefObject<HTMLElement | null>;
};

export function ProjectEnterLink({
  enter,
  mediaRef,
  onClick,
  ...props
}: Props) {
  return (
    <TransitionLink
      {...props}
      onClick={(event) => {
        if (enter === "grid") {
          const frame = mediaRef?.current;
          if (frame) setProjectEnterFromGrid(frame.getBoundingClientRect());
        } else {
          setProjectEnterAdjacent();
        }

        onClick?.(event);
      }}
    />
  );
}
