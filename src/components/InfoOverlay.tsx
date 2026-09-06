"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { MOTION_REVEAL_OUT_MS } from "@/lib/motion";

type Props = {
  children: React.ReactNode;
  /**
   * How the sheet was reached, which is the only thing that differs between
   * the two.
   *
   * "modal" — intercepted from inside the site. Dismiss pops the history entry,
   * so the URL and the grid's scroll position both come back on their own.
   * "page"  — a hard load or a shared link. There is no entry to pop, and
   * going back would leave the site, so dismiss navigates to the index.
   */
  mode?: "page" | "modal";
  /** Override dismiss — used by the preview stage so it does not leave /preview. */
  onDismiss?: () => void;
};

/**
 * The information sheet, presented over the work grid rather than as its own
 * page — per the client's reference (tylermitchell.co), where "About" never
 * replaces the index, it sits on top of it.
 *
 * The grid behind stays in the DOM and is treated by CSS: ghosted almost to
 * white on desktop with a light blur, genuinely blurred on mobile so
 * colour bleeds through.
 *
 * There is no close control. A click anywhere that is not a link dismisses
 * it; Escape does the same. A drag-select is left alone so copy still works.
 * The sheet is fixed to the viewport so the rail and footer are dismiss targets too.
 */
export function InfoOverlay({ children, mode = "page", onDismiss }: Props) {
  const router = useRouter();
  const [closing, setClosing] = useState(false);

  const finishDismiss = useCallback(() => {
    if (onDismiss) onDismiss();
    else if (mode === "modal") router.back();
    else router.push("/");
  }, [mode, onDismiss, router]);

  const dismiss = useCallback(() => {
    if (closing) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finishDismiss();
      return;
    }

    setClosing(true);
    window.setTimeout(finishDismiss, MOTION_REVEAL_OUT_MS);
  }, [closing, finishDismiss]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dismiss]);

  const scrimClassName =
    "pointer-events-none fixed inset-0 bg-(--color-page)/80 backdrop-blur-xl md:bg-(--color-page)/88 md:backdrop-blur-[8px]";
  const animatedScrimClassName = closing
    ? `animate-overlay-out ${scrimClassName}`
    : `animate-overlay-in ${scrimClassName}`;

  const onClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (closing) return;

    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.closest("a")) return;
    if (window.getSelection()?.toString()) return;
    dismiss();
  };

  const contentClassName = closing
    ? "animate-reveal-out relative mx-auto max-w-[68ch] px-(--spacing-edge) py-16"
    : "relative mx-auto max-w-[68ch] px-(--spacing-edge) py-16";

  return (
    <div
      className={`fixed inset-0 z-40 overflow-y-auto overscroll-contain touch-pan-y${closing ? " pointer-events-none" : ""}`}
      onClick={onClick}
    >
      {/* The scrim is what does the ghosting/blurring of the grid underneath.
          Pointer-events off so it cannot steal the pan that scrolls this sheet. */}
      <div aria-hidden className={animatedScrimClassName} />

      <div className={contentClassName}>{children}</div>
    </div>
  );
}
