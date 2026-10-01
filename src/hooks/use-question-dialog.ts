import { createContext, useContext } from "react"

export const QuestionDialogContext = createContext<{
  selectedId: string | null
  openQuestion: (id: string, trigger: HTMLElement) => void
}>({ selectedId: null, openQuestion: () => undefined })

export function useQuestionDialog() {
  return useContext(QuestionDialogContext)
}
