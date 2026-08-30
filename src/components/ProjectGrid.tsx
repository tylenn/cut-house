import { ProjectCard, type ProjectCardData } from "@/components/ProjectCard";

/** Enough plates to show the two-up rhythm and that the grid keeps going. */
const PLACEHOLDER_COUNT = 6;

export function ProjectGrid({ projects }: { projects: ProjectCardData[] }) {
  if (!projects.length) {
    // A live site with nothing in it should say so. In development the same
    // state is more useful as grey plates: layout work then is not blocked on
    // anyone having published a film yet.
    if (process.env.NODE_ENV === "production") {
      return (
        <p className="px-(--spacing-edge) text-(--color-ink-muted) md:px-0">
          Nothing published yet.
        </p>
      );
    }

    return (
      <div
        aria-hidden
        className="grid grid-cols-1 gap-(--spacing-grid) md:grid-cols-2 md:pr-(--spacing-edge)"
      >
        {Array.from({ length: PLACEHOLDER_COUNT }, (_, index) => (
          <div
            key={index}
            className="stagger-child"
            style={{ "--i": index } as React.CSSProperties}
          >
            <div className="aspect-video w-full bg-(--color-rule)" />
            <div className="px-(--spacing-edge) pt-2 md:px-0">
              <div className="h-2.5 w-32 bg-(--color-rule)" />
              <div className="mt-1.5 h-2.5 w-44 bg-(--color-rule)/60" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-(--spacing-grid) md:grid-cols-2 md:pr-(--spacing-edge)">
      {projects.map((project, index) => (
        <ProjectCard
          key={project._id}
          project={project}
          index={index}
          // Only the first row is above the fold on a typical viewport.
          priority={index < 2}
        />
      ))}
    </div>
  );
}
