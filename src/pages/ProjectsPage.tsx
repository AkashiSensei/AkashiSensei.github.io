import { ProjectIndexPage } from "@/components/ProjectIndexPage"
import { projects } from "@/data/projects"

export function ProjectsPage() {
  return <ProjectIndexPage projects={projects} />
}
