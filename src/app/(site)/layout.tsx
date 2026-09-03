import { Rail } from "@/components/Rail";
import { SiteFooter } from "@/components/SiteFooter";
import { SetupNotice } from "@/components/SetupNotice";
import { isPlaceholderProject } from "@/sanity/env";
import { sanityFetch } from "@/sanity/lib/live";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";

export default async function SiteLayout({
  children,
  modal,
}: Readonly<{ children: React.ReactNode; modal: React.ReactNode }>) {
  // Dev convenience only — see isPlaceholderProject.
  if (isPlaceholderProject) return <SetupNotice />;

  const { data: settings } = await sanityFetch({ query: SITE_SETTINGS_QUERY });

  const name = settings?.title ?? "Cut House";

  return (
    <>
      <div className="md:flex md:min-h-screen">
        <Rail name={name} tagline={settings?.tagline ?? undefined} />
        {/* The modal slot lives inside main, and main is the positioned
            ancestor, so an intercepted overlay lands in exactly the same box as
            the standalone page's — one set of positioning rules, not two. */}
        <main className="relative min-w-0 flex-1 md:py-4">
          {children}
          {modal}
        </main>
      </div>

      <SiteFooter links={settings?.socialLinks ?? []} />
    </>
  );
}
