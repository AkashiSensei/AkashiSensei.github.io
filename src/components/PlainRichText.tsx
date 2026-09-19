import { type ReactNode } from "react"

import { renderEmphasizedText } from "@/lib/emphasized-text"

export function renderPlainRichText(text: string): ReactNode[] {
  return renderEmphasizedText(text)
}
