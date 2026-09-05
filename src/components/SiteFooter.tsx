import { COPYRIGHT_HOLDER } from "@/lib/site";

type Link = { _key: string; label: string | null; url: string | null };

/** Mobile only — on desktop the copyright lives at the foot of the rail. */
export function SiteFooter({ links }: { links: Link[] }) {
  return (
    <footer
      className="stagger-rail px-(--spacing-edge) py-8 md:hidden"
      style={{ "--i": 4 } as React.CSSProperties}
    >
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
        <span>{COPYRIGHT_HOLDER}. All rights reserved.</span>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
