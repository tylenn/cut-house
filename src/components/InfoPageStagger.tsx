"use client";

import { type ReactNode, useLayoutEffect, useRef } from "react";

/** Milliseconds between each `[data-info-stagger]` block in document order. */
const STAGGER_MS = 130;
const INITIAL_DELAY = 140;

type Props = {
  children: ReactNode;
};

/**
 * Stagger info-sheet sections in document order — Contact, Application,
 * Description, and so on.
 */
export function InfoPageStagger({ children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const blocks = root.querySelectorAll<HTMLElement>("[data-info-stagger]");

    blocks.forEach((block, index) => {
      const delay = INITIAL_DELAY + index * STAGGER_MS;
      block.style.setProperty("--enter-delay", `${delay}ms`);
      block.classList.add("animate-project-stagger");
    });
  }, []);

  return <div ref={ref}>{children}</div>;
}
