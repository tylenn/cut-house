import { InfoOverlay } from "@/components/InfoOverlay";
import { InfoSheet } from "@/components/InfoSheet";

/**
 * /info reached by a click from inside the site.
 *
 * The grid stays mounted as `children` underneath — it is never re-rendered or
 * re-fetched, so the overlay opens over exactly the scroll position the visitor
 * was already at. A hard load of /info skips interception entirely and renders
 * the standalone page instead.
 */
export default function InterceptedInfo() {
  return (
    <InfoOverlay mode="modal">
      <InfoSheet />
    </InfoOverlay>
  );
}
