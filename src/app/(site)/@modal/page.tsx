/**
 * Clears the slot when navigating back to the index.
 *
 * Without an explicit match here the slot keeps its last active state across a
 * soft navigation, and the overlay survives a trip back to the grid.
 */
export default function ModalIndex() {
  return null;
}
