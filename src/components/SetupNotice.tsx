/**
 * Development-only. Replaces the Content Lake's 404 with the two minutes of
 * setup that actually resolve it.
 */
export function SetupNotice() {
  return (
    <div className="mx-auto max-w-[68ch] px-(--spacing-edge) py-20">
      <h1 className="mb-1 text-(length:--text-display) leading-(--text-display--line-height) font-bold tracking-[-0.02em]">
        cut house
      </h1>
      <p className="mb-10 text-(--color-ink-muted)">
        Not connected to Sanity yet.
      </p>

      <ol className="mb-10 list-decimal space-y-2 pl-4">
        <li>
          Create a project at{" "}
          <a
            href="https://sanity.io/manage"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            sanity.io/manage
          </a>{" "}
          with a dataset named <code>production</code>.
        </li>
        <li>
          Put the project ID in <code>.env.local</code> as{" "}
          <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code>, replacing{" "}
          <code>placeholder</code>.
        </li>
        <li>
          Add <code>http://localhost:3000</code> under Manage → API → CORS
          Origins, with credentials allowed.
        </li>
        <li>Restart the dev server.</li>
      </ol>

      <p className="text-(--color-ink-muted)">
        The layout and motion can be worked on without any of that — see{" "}
        <a href="/preview" className="underline underline-offset-2">
          /preview
        </a>
        , which runs on fixtures. Full instructions are in the README.
      </p>
    </div>
  );
}
