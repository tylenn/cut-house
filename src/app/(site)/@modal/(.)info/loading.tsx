/**
 * The scrim appears as soon as /info is clicked, before the sheet's data arrives.
 * Without this, the URL and nav active state update while the grid sits unchanged.
 */
export default function InterceptedInfoLoading() {
  return (
    <div
      aria-hidden
      className="animate-info-overlay-in pointer-events-none fixed inset-0 z-40 bg-(--color-page)/80 backdrop-blur-xl md:absolute md:z-20 md:bg-(--color-page)/88 md:backdrop-blur-[8px]"
    />
  );
}
