import { useCallback } from "react"
import { useTranslation } from "react-i18next"
import source from "@/content/locales/zh/questions.json"
import type { QuestionThread } from "@/data/questions"

export type QuestionCopy = {
  rounds: Record<string, { question: string; answer?: string }>
}

const original: Record<string, QuestionCopy> = source.items

export function useQuestionCopy() {
  const { i18n } = useTranslation("questions")
  const language = i18n.resolvedLanguage ?? i18n.language
  return useCallback((thread: QuestionThread) => {
    const translated = i18n.getResource(language, "questions", `items.${thread.id}`) as QuestionCopy | undefined
    // A missing translated round must never remove a follow-up from the chain.
    const rounds = Object.fromEntries(thread.rounds.map((id) => [
      id, translated?.rounds?.[id] ?? original[thread.id].rounds[id],
    ]))
    return { rounds, lang: translated ? language : "zh-CN" }
  }, [i18n, language])
}
