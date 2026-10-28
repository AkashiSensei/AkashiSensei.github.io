import data from "./questions.json"
import type { ProjectImage } from "./projects"

export type QuestionProject = {
  module: "projects" | "course-projects"
  id: string
  note?: string
}

export type QuestionThread = {
  id: string
  tagIds: string[]
  relatedProjects: QuestionProject[]
  rounds: string[]
  questionImages?: Record<string, QuestionImageReference[]>
  answerImages?: Record<string, QuestionImageReference[]>
}

export type QuestionImageReference = (ProjectImage & {
  localizedSources?: Partial<Record<"zh" | "en", Pick<ProjectImage, "src" | "width" | "height">>>
}) | {
  module: QuestionProject["module"]
  id: string
  imageKey: string
}

export const questionThreads = data.threads as QuestionThread[]
export const questionTags: Record<string, string> = data.tags
export { filterQuestions, questionProjectKey } from "@/lib/questions"
