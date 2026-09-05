"use client";

import { type ReactNode, useLayoutEffect, useRef } from "react";

/** Milliseconds of delay per pixel below the article top. */
const MS_PER_PX = 0.42;
const MIN_DELAY = 48;

type Props = {
  children: ReactNode;
};

/**
 * Stagger project-page blocks by vertical position — lower on the page, later
 * in the sequence. Each `[data-project-stagger]` node gets a delay from its Y.
 */
export function ProjectPageStagger({ children }: Props) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const origin = root.getBoundingClientRect().top;
    const blocks = root.querySelectorAll<HTMLElement>("[data-project-stagger]");

    for (const block of blocks) {
      const top = block.getBoundingClientRect().top - origin;
      const delay = Math.round(Math.max(MIN_DELAY, top * MS_PER_PX));
      block.style.setProperty("--enter-delay", `${delay}ms`);
      block.classList.add("animate-project-stagger");
    }
  }, []);

  return <article ref={ref}>{children}</article>;
}
