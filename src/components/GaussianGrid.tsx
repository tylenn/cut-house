"use client";

import {
  type HTMLAttributes,
  type ReactNode,
  useEffect,
  useRef,
} from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function GaussianGrid({ children, className, ...props }: Props) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const cards = Array.from(
      grid.querySelectorAll<HTMLElement>("[data-gaussian-card]"),
    );
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let frame = 0;

    const update = () => {
      frame = 0;

      if (reducedMotion.matches) {
        for (const card of cards) {
          card.style.removeProperty("--curve-depth");
          card.style.removeProperty("--curve-scale");
          card.style.removeProperty("--curve-tilt");
          card.style.removeProperty("--curve-z");
          card.style.removeProperty("z-index");
        }
        return;
      }

      const viewportCenter = window.innerHeight / 2;
      const sigma = Math.max(window.innerHeight * 0.32, 240);

      for (const card of cards) {
        const bounds = card.getBoundingClientRect();
        const offset = (bounds.top + bounds.height / 2 - viewportCenter) / sigma;
        const depth = Math.exp(-0.5 * offset * offset);
        const tilt = clamp(offset * depth * 14, -8, 8);
        const scale = 0.94 + depth * 0.06;
        const z = -18 + depth * 46;

        card.style.setProperty("--curve-depth", depth.toFixed(4));
        card.style.setProperty("--curve-scale", scale.toFixed(4));
        card.style.setProperty("--curve-tilt", `${tilt.toFixed(3)}deg`);
        card.style.setProperty("--curve-z", `${z.toFixed(2)}px`);
        card.style.zIndex = String(Math.round(depth * 10));
      }
    };

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(grid);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    reducedMotion.addEventListener("change", scheduleUpdate);
    scheduleUpdate();

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      reducedMotion.removeEventListener("change", scheduleUpdate);
    };
  }, []);

  return (
    <div ref={gridRef} className={className} {...props}>
      {children}
    </div>
  );
}
