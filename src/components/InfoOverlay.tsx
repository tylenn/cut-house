"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { TransitionLink } from "@/components/TransitionLink";

/**
 * The information sheet, presented over the work grid rather than as its own
 * page — per the client's reference (tylermitchell.co), where "About" never
 * replaces the index, it sits on top of it.
 *
 * The grid behind stays in the DOM and is treated by CSS: ghosted almost to
 * white on desktop, genuinely blurred on mobile so colour bleeds through.
 */
export function InfoOverlay({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // Escape closes it, the way any overlay should.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") router.push("/");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  return (
    <div className="absolute inset-0 z-20 overflow-y-auto">
      {/* The scrim is what does the ghosting/blurring of the grid underneath. */}
      <div
        aria-hidden
        className="animate-fade-in fixed inset-0 bg-(--color-page)/80 backdrop-blur-xl md:bg-(--color-page)/92 md:backdrop-blur-none"
      />

      <div className="animate-rise-in relative px-(--spacing-edge) pt-16 pb-24 md:px-0">
        {children}
      </div>

      {/* Desktop: sits where the nav is. Mobile: floats near the foot, following
          the scroll, as in the reference. */}
      <TransitionLink
        href="/"
        className="fixed bottom-8 left-1/2 z-30 -translate-x-1/2 rounded-[2px] bg-(--color-page)/80 px-3 py-1 underline underline-offset-2 backdrop-blur-sm transition-colors duration-(--duration-fast) hover:text-(--color-ink-muted) md:top-5 md:right-(--spacing-edge) md:bottom-auto md:left-auto md:translate-x-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none"
      >
        close
      </TransitionLink>
    </div>
  );
}
