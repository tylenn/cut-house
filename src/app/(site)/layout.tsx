import { Intro } from "@/components/Intro";
import { hasSeenIntro } from "@/lib/intro.server";
import { Rail } from "@/components/Rail";
import { SiteFooter } from "@/components/SiteFooter";
import { SetupNotice } from "@/components/SetupNotice";
import { isPlaceholderProject } from "@/sanity/env";
import { sanityFetch } from "@/sanity/lib/live";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Dev convenience only — see isPlaceholderProject.
  if (isPlaceholderProject) return <SetupNotice />;

  const [{ data: settings }, seenIntro] = await Promise.all([
    sanityFetch({ query: SITE_SETTINGS_QUERY }),
    hasSeenIntro(),
  ]);

  const name = settings?.title ?? "cut house";

  return (
    <>
      {seenIntro ? null : (
        <Intro
          name={name}
          tagline={settings?.introTagline ?? settings?.tagline ?? undefined}
          playbackId={settings?.introVideo?.playbackId ?? undefined}
        />
      )}

      <div className="md:flex md:min-h-screen">
        <Rail name={name} tagline={settings?.tagline ?? undefined} />
        <main className="min-w-0 flex-1 md:py-4">{children}</main>
      </div>

      <SiteFooter
        name={name}
        links={settings?.socialLinks ?? []}
      />
    </>
  );
}
