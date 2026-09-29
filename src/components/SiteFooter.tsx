import { COPYRIGHT_HOLDER } from "@/lib/site";

type Link = { _key: string; label: string | null; url: string | null };

/** Mobile only — on desktop the copyright lives at the foot of the rail. */
export function SiteFooter({ links }: { links: Link[] }) {
  return (
    <footer
      className="site-chrome site-chrome-footer stagger-rail mt-auto px-(--spacing-edge) pt-8 pb-3 md:hidden"
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
      {/* Fine print: 3px under the body size, in the faintest grey. */}
      <div className="flex justify-between text-[length:calc(var(--text-body)-3px)] text-(--color-ink-faint)">
        <span>{COPYRIGHT_HOLDER}. All rights reserved.</span>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
