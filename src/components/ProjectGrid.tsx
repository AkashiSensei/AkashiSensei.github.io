import { ProjectCard } from "@/components/ProjectCard"
import { type Project } from "@/data/projects"

type ProjectGridProps = {
  projects: Project[]
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          variant="full"
          className="h-auto"
        />
      ))}
    </div>
  )
}
