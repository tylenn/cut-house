/**
 * Player iconography.
 *
 * Deliberately chubby: every shape is built from a thick stroke with round
 * joins over a filled path, so corners inflate outward instead of coming to a
 * point. Against the rest of the site — hairline rules, tight grotesque type —
 * the controls are the one soft thing on the page, which is what makes them
 * read as friendly rather than as a default browser player.
 *
 * All icons inherit `currentColor` and size from their box, so a caller only
 * ever sets text colour and width.
 */

type IconProps = { className?: string };

const BOX = "0 0 24 24";

export function PlayIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox={BOX} className={className} aria-hidden focusable="false">
      {/* Nudged right of centre: optical centring, since the triangle's mass
          sits left of its bounding box. */}
      <path
        d="M9.4 7.6 17.4 12 9.4 16.4Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="3.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PauseIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox={BOX} className={className} aria-hidden focusable="false">
      <rect x="7.3" y="6.4" width="3.9" height="11.2" rx="1.95" fill="currentColor" />
      <rect x="12.8" y="6.4" width="3.9" height="11.2" rx="1.95" fill="currentColor" />
    </svg>
  );
}

export function ReplayIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox={BOX} className={className} aria-hidden focusable="false">
      {/* The arc travels the long way round and stops at 12 o'clock, underneath
          the head. The head is a filled shape rather than a second stroke: two
          round-capped strokes meeting at an angle pile their caps on top of
          each other, which is what made the old join look lumpy. Filled over
          stroked simply unions into one solid form. */}
      <path
        d="M5.94 8.5A7 7 0 1 0 12 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      <path
        d="M8.8 5 12.4 2.9 12.4 7.1Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SpeakerBody() {
  return (
    <path
      d="M5 9.7h2.5l3.3-2.85a1.05 1.05 0 0 1 1.75.8v8.7a1.05 1.05 0 0 1-1.75.8L7.5 14.3H5A1.55 1.55 0 0 1 3.45 12.75v-1.5A1.55 1.55 0 0 1 5 9.7Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  );
}

export function SoundOnIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox={BOX} className={className} aria-hidden focusable="false">
      <SpeakerBody />
      <path
        d="M15.7 9.5a3.4 3.4 0 0 1 0 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
      />
      <path
        d="M18.4 7.3a6.6 6.6 0 0 1 0 9.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SoundOffIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox={BOX} className={className} aria-hidden focusable="false">
      <SpeakerBody />
      <path
        d="M16 9.8 20.4 14.2M20.4 9.8 16 14.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ExpandIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox={BOX} className={className} aria-hidden focusable="false">
      <path
        d="M9 4.6H6.4A1.8 1.8 0 0 0 4.6 6.4V9M15 4.6h2.6A1.8 1.8 0 0 1 19.4 6.4V9M9 19.4H6.4A1.8 1.8 0 0 1 4.6 17.6V15M15 19.4h2.6a1.8 1.8 0 0 0 1.8-1.8V15"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CollapseIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox={BOX} className={className} aria-hidden focusable="false">
      <path
        d="M4.6 9h2.6A1.8 1.8 0 0 0 9 7.2V4.6M19.4 9h-2.6A1.8 1.8 0 0 1 15 7.2V4.6M4.6 15h2.6A1.8 1.8 0 0 1 9 16.8v2.6M19.4 15h-2.6a1.8 1.8 0 0 0-1.8 1.8v2.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
