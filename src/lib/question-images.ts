import { projects } from "../data/projects.ts"
import { courseProjects } from "../data/course-projects.ts"
import type { QuestionImageReference, QuestionThread } from "../data/questions"

export function resolveQuestionImage(reference: QuestionImageReference) {
  const catalog = reference.module === "projects" ? projects : courseProjects
  const image = catalog.find((project) => project.id === reference.id)?.images?.find(
    (image) => image.altKey === `items.${reference.id}.images.${reference.imageKey}`,
  )
  return image ? { ...image, namespace: reference.module === "projects" ? "projects" : "courseProjects" } : undefined
}

export function questionRoundImages(thread: QuestionThread, roundId: string) {
  return (thread.questionImages?.[roundId] ?? []).flatMap((reference) => {
    const image = resolveQuestionImage(reference)
    return image ? [image] : []
  })
}

export function questionConversationPartCount(thread: QuestionThread) {
  return thread.rounds.reduce((count, id) => count + 2 + questionRoundImages(thread, id).length, 0)
    + Number(thread.relatedProjects.length > 0)
}
