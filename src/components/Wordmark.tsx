/**
 * The wordmark, in exactly one place.
 *
 * The intro's final frame and the rail both render this at the same size and
 * the same distance from the left edge. That is the whole trick behind the
 * handoff: when the intro's background fades, the rail's wordmark is already
 * sitting underneath at identical coordinates, so there is nothing to animate
 * and nothing to line up.
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
