import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import { ProjectCard } from "@/components/ProjectCard"
import { type Project } from "@/data/projects"
import { getProjectPointSections } from "@/lib/project-points"

type ProjectGridProps = {
  projects: Project[]
  translationNamespace?: "projects" | "courseProjects"
}

export function ProjectGrid({
  projects,
  translationNamespace = "projects",
}: ProjectGridProps) {
  const { t } = useTranslation(translationNamespace)
  const [columns, setColumns] = useState(2)

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth >= 768) setColumns(2)
      else setColumns(1)
    }

    updateColumns()
    window.addEventListener("resize", updateColumns)
    return () => window.removeEventListener("resize", updateColumns)
  }, [])

  const columnsData = useMemo(() => {
    const cols: Project[][] = Array.from({ length: columns }, () => [])
    const colHeights = Array.from({ length: columns }, () => 0)

    projects.forEach((project) => {
      let estimatedHeight = project.images?.[0]
        ? 260 / (project.images[0].width / project.images[0].height)
        : project.screenshot
          ? 150
          : 0

      const title = t(`items.${project.id}.title`) as string
      estimatedHeight += Math.ceil((title?.length || 0) / 16) * 28

      const summary = t(`items.${project.id}.summary`) as string
      estimatedHeight += Math.ceil((summary?.length || 0) / 24) * 24

      const points = t(`items.${project.id}.points`, { returnObjects: true })
      estimatedHeight += getProjectPointSections(points).points.reduce(
        (total, point) => total + Math.ceil(point.length / 30) * 22 + 10,
        0,
      )

      estimatedHeight += (project.links?.length ?? 1) * 28
      estimatedHeight += Math.ceil(project.tags.length / 3) * 32
      estimatedHeight += 80

      let minColIdx = 0
      let minHeight = colHeights[0]
      for (let i = 1; i < columns; i++) {
        if (colHeights[i] < minHeight) {
          minHeight = colHeights[i]
          minColIdx = i
        }
      }

      cols[minColIdx].push(project)
      colHeights[minColIdx] += estimatedHeight
    })

    return cols
  }, [columns, projects, t])

  return (
    <div className="flex items-start gap-3">
      {columnsData.map((colProjects, colIdx) => (
        <div key={colIdx} className="flex min-w-0 flex-1 flex-col gap-3">
          {colProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              variant="full"
              translationNamespace={translationNamespace}
              className="h-auto"
            />
          ))}
        </div>
      ))}
    </div>
  )
}
