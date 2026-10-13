import { ProjectIndexPage } from "@/components/ProjectIndexPage"
import { courseProjects } from "@/data/course-projects"

export function CourseProjectsPage() {
  return <ProjectIndexPage projects={courseProjects} translationNamespace="courseProjects" />
}
