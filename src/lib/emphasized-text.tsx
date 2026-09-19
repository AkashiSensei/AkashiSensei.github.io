import { type ReactNode } from "react"

export const personalWorkHighlightClassName =
  "plain-point-highlight text-amber-700 dark:text-violet-300"

export function renderEmphasizedText(
  text: string,
  strongClassName = "font-semibold",
): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className={strongClassName}>
          {part.slice(2, -2)}
        </strong>
      )
    }

    return part
  })
}
