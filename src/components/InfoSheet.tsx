import { PortableText } from "@/components/PortableText";
import { SanityImage } from "@/components/SanityImage";
import { getInfoSheetData } from "@/sanity/lib/info";

/**
 * The contents of the information sheet.
 *
 * Shared by the standalone /info page and the intercepted overlay so the two
 * cannot drift. It fetches its own data rather than taking props: both callers
 * would otherwise repeat the same two queries verbatim.
 *
 * Layout matches the client's mockup: Contact, Application, Description,
 * Clients — no page title, socials live in the footer.
 */
export async function InfoSheet() {
  const { info, settings } = await getInfoSheetData();

  // Every section below is conditional, so an unpopulated infoPage renders a
  // blank sheet — which reads as a broken overlay rather than as empty content.
  // The grid says so out loud in the same situation; this echoes it without
  // repeating its exact wording, since both are on screen at once.
  const isEmpty =
    !settings?.email &&
    !info?.availability &&
    !info?.application &&
    !info?.bio?.length &&
    !info?.clients?.length &&
    !info?.portrait?.asset &&
    !settings?.resumeUrl;

  if (isEmpty) {
    return (
      <p className="animate-info-content-in text-(--color-ink-muted)">
        Nothing here yet.
      </p>
    );
  }

  return (
    <div className="animate-info-content-in max-w-[68ch] md:pl-0">
      {settings?.email || info?.availability ? (
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
          {info?.availability ? <p>{info.availability}</p> : null}
        </section>
      ) : null}

      {info?.application ? (
        <section className="mb-8">
          <h2 className="font-semibold">Application</h2>
          <p>{info.application}</p>
        </section>
      ) : null}

      {info?.bio?.length || info?.readMoreUrl ? (
        <section className="mb-8">
          <h2 className="font-semibold">Description</h2>
          {info?.bio?.length ? <PortableText value={info.bio} /> : null}
          {info?.readMoreUrl ? (
            <a
              href={info.readMoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-(--color-ink-muted) transition-colors duration-(--duration-fast) hover:text-(--color-ink)"
            >
              read more
            </a>
          ) : null}
        </section>
      ) : null}

      {info?.clients?.length ? (
        <section className="mb-8">
          <h2 className="font-semibold">Clients</h2>
          <ul>
            {info.clients.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
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
