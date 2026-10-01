import { useId } from "react"
import { ArrowRight, FolderGit2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { AppLink } from "@/components/AppLink"
import { questionProjectKey, type QuestionProject } from "@/data/questions"

export function QuestionProjectLinks({ projects, variant = "inline" }: { projects: QuestionProject[]; variant?: "inline" | "rows" }) {
  const { t } = useTranslation(["projects", "courseProjects"])
  if (!projects.length) return null
  return (
    <ul className={variant === "rows" ? "question-project-rows" : "question-project-links"}>
      {projects.map((project) => (
        <li key={questionProjectKey(project)}>
          <AppLink to={`/${project.module}/${project.id}`} title={project.note}>
            <span className="question-project-name">
              {variant === "rows" && <>
                <span className="question-project-kind">{t(`${project.module === "projects" ? "projects" : "courseProjects"}:title`)}</span>
                <span className="question-project-separator" aria-hidden="true"> / </span>
              </>}
              {t(`${project.module === "projects" ? "projects" : "courseProjects"}:items.${project.id}.title`)}
            </span>
            <ArrowRight size={14} aria-hidden="true" />
          </AppLink>
        </li>
      ))}
    </ul>
  )
}

export function QuestionProjectSummary({ projects }: { projects: QuestionProject[] }) {
  const { t } = useTranslation("questions")
  const headingId = useId()
  if (!projects.length) return null
  return <section className="question-project-summary" aria-labelledby={headingId}>
    <header className="question-project-summary-header">
      <span className="question-project-summary-icon" aria-hidden="true"><FolderGit2 size={20} /></span>
      <h3 id={headingId}>{t("relatedProjectCount", { count: projects.length })}</h3>
    </header>
    <QuestionProjectLinks projects={projects} variant="rows" />
  </section>
}
