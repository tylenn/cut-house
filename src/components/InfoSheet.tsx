import { PortableText } from "@/components/PortableText";
import { SanityImage } from "@/components/SanityImage";
import { sanityFetch } from "@/sanity/lib/live";
import { INFO_PAGE_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";

/**
 * The contents of the information sheet.
 *
 * Shared by the standalone /info page and the intercepted overlay so the two
 * cannot drift. It fetches its own data rather than taking props: both callers
 * would otherwise repeat the same two queries verbatim.
 */
export async function InfoSheet() {
  const [{ data: info }, { data: settings }] = await Promise.all([
    sanityFetch({ query: INFO_PAGE_QUERY }),
    sanityFetch({ query: SITE_SETTINGS_QUERY }),
  ]);

  const links = settings?.socialLinks ?? [];

  // Every section below is conditional, so an unpopulated infoPage renders a
  // blank sheet — which reads as a broken overlay rather than as empty content.
  // The grid says so out loud in the same situation; this echoes it without
  // repeating its exact wording, since both are on screen at once.
  const isEmpty =
    !info?.heading &&
    !info?.bio?.length &&
    !info?.clients?.length &&
    !info?.portrait?.asset &&
    !settings?.email &&
    !settings?.resumeUrl &&
    links.length === 0;

  if (isEmpty) {
    return (
      <p className="text-(--color-ink-muted)">Nothing here yet.</p>
    );
  }

  return (
    <div className="max-w-[68ch] md:pl-0">
      {info?.heading ? (
        <h1 className="mb-8 font-semibold">{info.heading}</h1>
      ) : null}

      {settings?.email || links.length ? (
        <section className="mb-8">
          <h2 className="font-semibold">Contact</h2>
          {settings?.email ? (
            <a
              href={`mailto:${settings.email}`}
              className="block text-(--color-ink-muted) transition-colors duration-(--duration-fast) hover:text-(--color-ink)"
            >
              {settings.email}
            </a>
          ) : null}
          {links.map((link) => (
            <a
              key={link._key}
              href={link.url ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-(--color-ink-muted) transition-colors duration-(--duration-fast) hover:text-(--color-ink)"
            >
              {link.label}
            </a>
          ))}
        </section>
      ) : null}

      {info?.portrait?.asset ? (
        <div className="mb-8 max-w-sm">
          <SanityImage
            image={info.portrait}
            sizes="(max-width: 768px) 100vw, 40vw"
            className="h-auto w-full"
          />
        </div>
      ) : null}

      {info?.bio?.length ? (
        <section className="mb-8">
          <h2 className="mb-1 font-semibold">Description</h2>
          <PortableText value={info.bio} />
        </section>
      ) : null}

      {info?.clients?.length ? (
        <section className="mb-8">
          <h2 className="mb-1 font-semibold">Clients</h2>
          <ul>
            {info.clients.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {settings?.resumeUrl ? (
        <a
          href={settings.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block underline underline-offset-2"
        >
          Download resume
        </a>
      ) : null}
    </div>
  );
}
