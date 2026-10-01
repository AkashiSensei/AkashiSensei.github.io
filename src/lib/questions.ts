import type { QuestionProject, QuestionThread } from "../data/questions"

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

// An empty selection represents the default all-highlighted state.
export function normalizeQuestionTags(selected: string[], available: string[]) {
  const valid = [...new Set(selected)].filter((id) => available.includes(id))
  return valid.length === available.length ? [] : valid
}

export function toggleQuestionTag(selected: string[], id: string, available: string[]) {
  const current = normalizeQuestionTags(selected, available)
  if (!available.includes(id)) return current
  return normalizeQuestionTags(current.includes(id) ? current.filter((tag) => tag !== id) : [...current, id], available)
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
