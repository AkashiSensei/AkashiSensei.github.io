import data from "./questions.json"

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
}

export type QuestionImageReference = {
  module: QuestionProject["module"]
  id: string
  imageKey: string
}

export const questionThreads = data.threads as QuestionThread[]
export const questionTags: Record<string, string> = data.tags
export { filterQuestions, questionProjectKey } from "@/lib/questions"
