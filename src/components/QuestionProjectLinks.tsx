import { ArrowRight } from "lucide-react"
import { useTranslation } from "react-i18next"
import { AppLink } from "@/components/AppLink"
import { questionProjectKey, type QuestionProject } from "@/data/questions"

export function QuestionProjectLinks({ projects }: { projects: QuestionProject[] }) {
  const { t } = useTranslation(["projects", "courseProjects"])
  if (!projects.length) return null
  return (
    <ul className="question-project-links">
      {projects.map((project) => (
        <li key={questionProjectKey(project)}>
          <AppLink to={`/${project.module}/${project.id}`} title={project.note}>
            <span className="question-project-name">
              {t(`${project.module === "projects" ? "projects" : "courseProjects"}:items.${project.id}.title`)}
            </span>
            <ArrowRight size={14} aria-hidden="true" />
          </AppLink>
        </li>
      ))}
    </ul>
  )
}
