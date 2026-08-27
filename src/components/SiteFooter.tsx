type Link = { _key: string; label: string | null; url: string | null };

/** Mobile only — on desktop the copyright lives at the foot of the rail. */
export function SiteFooter({
  name,
  links,
}: {
  name: string;
  links: Link[];
}) {
  return (
    <footer className="px-(--spacing-edge) py-8 md:hidden">
      {links.length ? (
        <ul className="mb-6">
          {links.map((link) => (
            <li key={link._key} className="font-semibold">
              <a
                href={link.url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="flex justify-between text-(--color-ink-muted)">
        <span>{name}. All rights reserved.</span>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
