import { JsonLd } from "@/components/JsonLd";
import { Rail } from "@/components/Rail";
import { SiteFooter } from "@/components/SiteFooter";
import { SetupNotice } from "@/components/SetupNotice";
import { SITE_NAME } from "@/lib/site";
import { siteJsonLd } from "@/lib/seo";
import { isPlaceholderProject } from "@/sanity/env";
import { sanityFetch } from "@/sanity/lib/live";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";

export default async function SiteLayout({
  children,
  modal,
}: Readonly<{ children: React.ReactNode; modal: React.ReactNode }>) {
  // Dev convenience only — see isPlaceholderProject.
  if (isPlaceholderProject) return <SetupNotice />;

  const [{ data: settings }, { data: seoSettings }] = await Promise.all([
    sanityFetch({ query: SITE_SETTINGS_QUERY }),
    sanityFetch({ query: SITE_SETTINGS_QUERY, stega: false }),
  ]);

  const name = settings?.title ?? SITE_NAME;

  return (
    <>
      {seoSettings ? <JsonLd data={siteJsonLd(seoSettings)} /> : null}
      <div className="md:flex md:min-h-screen">
        <Rail name={name} />
        {/* The modal slot lives inside main, and main is the positioned
            ancestor, so an intercepted overlay lands in exactly the same box as
            the standalone page's — one set of positioning rules, not two. */}
        {/* py-5.5 = rail py-5 plus the nav label's py-0.5, so the grid lines up
            with the word "projects", not the padded hit area around it. */}
        <main className="relative min-w-0 flex-1 md:px-(--spacing-edge) md:py-5.5">
          {children}
          {modal}
        </main>
      </div>

      <SiteFooter links={settings?.socialLinks ?? []} />
    </>
  );
}
