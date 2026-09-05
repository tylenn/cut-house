/**
 * Emits a single JSON-LD script. The payload is already a plain object — no
 * HTML — so stringifying it is safe to drop into the document.
 */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
