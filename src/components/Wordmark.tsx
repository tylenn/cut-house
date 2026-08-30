/**
 * The wordmark, in exactly one place, so the rail and any future surface that
 * needs it stay identical in size and offset without being kept in sync by hand.
 */
export function Wordmark({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  return (
    <span
      className={`block text-(length:--text-display) leading-(--text-display--line-height) font-bold tracking-[-0.02em] ${className}`}
    >
      {name}
    </span>
  );
}
