"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

import { TransitionLink } from "@/components/TransitionLink";

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
};

/**
 * The information sheet, presented over the work grid rather than as its own
 * page — per the client's reference (tylermitchell.co), where "About" never
 * replaces the index, it sits on top of it.
 *
 * The grid behind stays in the DOM and is treated by CSS: ghosted almost to
 * white on desktop with a light blur, genuinely blurred on mobile so
 * colour bleeds through.
 */
export function InfoOverlay({ children, mode = "page" }: Props) {
  const router = useRouter();

  const dismiss = useCallback(() => {
    if (mode === "modal") router.back();
    else router.push("/");
  }, [mode, router]);

  // Escape closes it, the way any overlay should.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dismiss]);

  const closeClassName =
    "fixed top-4 left-1/2 z-30 -translate-x-1/2 cursor-pointer rounded-full bg-black/15 px-4 py-2 backdrop-blur-md transition-colors duration-(--duration-fast) hover:text-(--color-ink-muted) md:top-5.5 md:right-(--spacing-edge) md:left-auto md:translate-x-0 md:rounded-none md:bg-transparent md:px-0 md:py-0 md:underline md:underline-offset-2 md:backdrop-blur-none";

  const scrimClassName =
    "pointer-events-none fixed inset-0 bg-(--color-page)/80 backdrop-blur-xl md:bg-(--color-page)/88 md:backdrop-blur-[8px]";
  const animatedScrimClassName =
    mode === "modal"
      ? scrimClassName
      : `animate-info-overlay-in ${scrimClassName}`;

  const closeAnimationClassName = "animate-info-close-in";

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto overscroll-contain touch-pan-y md:absolute md:z-20">
      {/* The scrim is what does the ghosting/blurring of the grid underneath.
          Pointer-events off so it cannot steal the pan that scrolls this sheet. */}
      <div aria-hidden className={animatedScrimClassName} />

      <div className="relative px-(--spacing-edge) py-16 md:px-0">{children}</div>

      {/* Desktop: sits where the nav is. Mobile: a pill at the top of the sheet.

          A button when intercepted, because the action is "go back", not "go to
          the index" — and a real link otherwise, so the standalone page keeps
          middle-click and open-in-new-tab. */}
      {mode === "modal" ? (
        <button
          type="button"
          onClick={dismiss}
          className={`${closeClassName} ${closeAnimationClassName}`}
        >
          close
        </button>
      ) : (
        <TransitionLink
          href="/"
          className={`${closeClassName} ${closeAnimationClassName}`}
        >
          close
        </TransitionLink>
      )}
    </div>
  );
}
