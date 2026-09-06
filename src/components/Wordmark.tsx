"use client";

import { TransitionLink } from "@/components/TransitionLink";

/**
 * The wordmark, in exactly one place, so the rail and any future surface that
 * needs it stay identical in size and offset without being kept in sync by hand.
 *
 * The site title is stored lowercase; the wordmark renders it in title case.
 */
export function Wordmark({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  const label = name.replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <TransitionLink
      href="/"
      className={`block text-(length:--text-wordmark) leading-(--text-wordmark--line-height) font-regular tracking-[-0.02em] ${className}`}
    >
      {label}
    </TransitionLink>
  );
}
