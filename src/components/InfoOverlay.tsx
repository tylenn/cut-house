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
 * white on desktop with a whisper of blur, genuinely blurred on mobile so
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
    "fixed bottom-8 left-1/2 z-30 -translate-x-1/2 cursor-pointer rounded-[2px] bg-(--color-page)/80 px-3 py-1 underline underline-offset-2 backdrop-blur-sm transition-colors duration-(--duration-fast) hover:text-(--color-ink-muted) md:top-5 md:right-(--spacing-edge) md:bottom-auto md:left-auto md:translate-x-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none";

  return (
    <div className="absolute inset-0 z-20 overflow-y-auto overscroll-contain">
      {/* The scrim is what does the ghosting/blurring of the grid underneath. */}
      <div
        aria-hidden
        className="animate-fade-in fixed inset-0 bg-(--color-page)/80 backdrop-blur-xl md:bg-(--color-page)/88 md:backdrop-blur-[2px]"
      />

      <div className="animate-rise-in relative px-(--spacing-edge) pt-16 pb-24 md:px-0">
        {children}
      </div>

      {/* Desktop: sits where the nav is. Mobile: floats near the foot, following
          the scroll, as in the reference.

          A button when intercepted, because the action is "go back", not "go to
          the index" — and a real link otherwise, so the standalone page keeps
          middle-click and open-in-new-tab. */}
      {mode === "modal" ? (
        <button type="button" onClick={dismiss} className={closeClassName}>
          close
        </button>
      ) : (
        <TransitionLink href="/" className={closeClassName}>
          close
        </TransitionLink>
      )}
    </div>
  );
}
