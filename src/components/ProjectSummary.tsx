import { useId } from "react"
import { ArrowRight, FolderGit2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { AppLink } from "@/components/AppLink"
import { cn } from "@/lib/utils"
import "./project-summary.css"

type ProjectReference = { module: "projects" | "course-projects"; id: string; note?: string }

export function ProjectLinks({ projects, plain = false, variant = "rows" }: {
  projects: ProjectReference[]
  plain?: boolean
  variant?: "rows" | "text"
}) {
  const { t } = useTranslation(["common", "projects", "courseProjects"])
  if (!projects.length) return null
  return <ul className="project-summary-rows" data-variant={variant} data-display-mode={plain ? "plain" : undefined} aria-label={t("common:relatedProjectCount", { count: projects.length })}>
    {projects.map((project) => {
      const namespace = project.module === "projects" ? "projects" : "courseProjects"
      return <li key={`${project.module}:${project.id}`}>
        <AppLink to={`/${project.module}/${project.id}`} title={project.note}>
          <span className="project-summary-name">
            <span className="project-summary-kind">{t(`${namespace}:title`)}</span>
            <span className="project-summary-separator" aria-hidden="true"> / </span>
            <span className={plain ? "site-text-link" : undefined}>{t(`${namespace}:items.${project.id}.title`)}</span>
          </span>
          <ArrowRight size={14} aria-hidden="true" />
        </AppLink>
      </li>
    })}
  </ul>
}

export function ProjectSummary({ projects, className, plain = false, headingLevel = 3 }: {
  projects: ProjectReference[]
  className?: string
  plain?: boolean
  headingLevel?: 2 | 3
}) {
  const { t } = useTranslation(["common", "projects", "courseProjects"])
  const headingId = useId()
  const Heading = headingLevel === 2 ? "h2" : "h3"
  if (!projects.length) return null
  return <section className={cn("project-summary", className)} data-display-mode={plain ? "plain" : undefined} aria-labelledby={headingId}>
    <header className="project-summary-header">
      <span className="project-summary-icon" aria-hidden="true"><FolderGit2 size={20} /></span>
      <Heading id={headingId}>{t("common:relatedProjectCount", { count: projects.length })}</Heading>
    </header>
    <ProjectLinks projects={projects} plain={plain} />
  </section>
}
