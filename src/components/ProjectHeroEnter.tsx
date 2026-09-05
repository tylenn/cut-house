"use client";

import { type ReactNode, useLayoutEffect, useRef } from "react";

import { consumeProjectEnter } from "@/lib/project-enter";

type Props = {
  children: ReactNode;
};

/**
 * One-shot hero entrance driven by sessionStorage set at click time.
 *
 * Grid → detail morphs from the tile's screen rect (transform only). Detail →
 * detail rises from below. Direct loads skip both.
 */
export function ProjectHeroEnter({ children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const data = consumeProjectEnter();
    if (!data) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (data.mode === "adjacent") {
      el.classList.add("animate-project-adjacent-in");
      return;
    }

    if (!data.rect) {
      el.classList.add("animate-project-adjacent-in");
      return;
    }

    const to = el.getBoundingClientRect();
    const from = data.rect;
    const tx = from.x + from.width / 2 - (to.x + to.width / 2);
    const ty = from.y + from.height / 2 - (to.y + to.height / 2);
    const sx = from.width / to.width;
    const sy = from.height / to.height;

    el.style.setProperty("--enter-tx", `${tx}px`);
    el.style.setProperty("--enter-ty", `${ty}px`);
    el.style.setProperty("--enter-sx", String(sx));
    el.style.setProperty("--enter-sy", String(sy));
    el.classList.add("animate-project-from-grid");
  }, []);

  return (
    <div ref={ref} className="project-hero-enter">
      {children}
    </div>
  );
}
