import { ProjectCard, type ProjectCardData } from "@/components/ProjectCard";

export function ProjectGrid({ projects }: { projects: ProjectCardData[] }) {
  if (!projects.length) {
    return (
      <p className="px-(--spacing-edge) text-(--color-ink-muted) md:px-0">
        Nothing published yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-(--spacing-gutter) md:grid-cols-2">
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
