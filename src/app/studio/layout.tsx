/**
 * Bare passthrough. The Studio renders its own <html>-level chrome and theming;
 * wrapping it in the site's layout fights it.
 */
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
