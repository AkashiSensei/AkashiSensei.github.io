import type { QuestionProject, QuestionThread } from "../data/questions"

export { normalizeTagSelection as normalizeQuestionTags, toggleTagSelection as toggleQuestionTag } from "./tag-filter.ts"

export function questionProjectKey(project: QuestionProject) {
  return `${project.module}:${project.id}`
}

export function shuffleQuestions(threads: QuestionThread[], random = Math.random) {
  const result = [...threads]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function filterQuestions(threads: QuestionThread[], tags: string[] = [], project = "") {
  return threads.filter((thread) =>
    (!tags.length || tags.some((tag) => thread.tagIds.includes(tag))) &&
    (!project || thread.relatedProjects.some((ref) => questionProjectKey(ref) === project)),
  )
}

export function relatedQuestionPage(threads: QuestionThread[], page: number) {
  const pageSize = 3
  const pageCount = Math.ceil(threads.length / pageSize)
  const pageIndex = Math.max(0, Math.min(Math.trunc(page) || 0, pageCount - 1))
  return { items: threads.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize), pageIndex, pageCount }
}
