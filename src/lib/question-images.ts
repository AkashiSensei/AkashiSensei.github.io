import { projects } from "../data/projects.ts"
import { courseProjects } from "../data/course-projects.ts"
import type { QuestionImageReference, QuestionThread } from "../data/questions"

export function resolveQuestionImage(reference: QuestionImageReference) {
  if ("src" in reference) return { ...reference, namespace: "questions" as const }
  const catalog = reference.module === "projects" ? projects : courseProjects
  const image = catalog.find((project) => project.id === reference.id)?.images?.find(
    (image) => image.altKey === `items.${reference.id}.images.${reference.imageKey}`,
  )
  return image ? { ...image, namespace: reference.module === "projects" ? "projects" as const : "courseProjects" as const } : undefined
}

export function localizeQuestionImage(image: NonNullable<ReturnType<typeof resolveQuestionImage>>, language: string) {
  const source = "localizedSources" in image
    ? image.localizedSources?.[language.startsWith("zh") ? "zh" : "en"]
    : undefined
  return source ? { ...image, ...source } : image
}

export function questionRoundImages(thread: QuestionThread, roundId: string, side: "question" | "answer" = "question") {
  const references = side === "answer" ? thread.answerImages : thread.questionImages
  return (references?.[roundId] ?? []).flatMap((reference) => {
    const image = resolveQuestionImage(reference)
    return image ? [image] : []
  })
}

export function questionThreadHasImages(thread: QuestionThread) {
  return thread.rounds.some((roundId) => questionRoundImages(thread, roundId).length > 0
    || questionRoundImages(thread, roundId, "answer").length > 0)
}

export function questionConversationPartCount(thread: QuestionThread) {
  return thread.rounds.reduce((count, id) => count + 2
    + questionRoundImages(thread, id).length + questionRoundImages(thread, id, "answer").length, 0)
    + Number(thread.relatedProjects.length > 0)
}
