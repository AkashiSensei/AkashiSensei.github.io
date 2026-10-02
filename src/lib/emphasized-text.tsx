import { type ReactNode } from "react"

export const personalWorkHighlightClassName =
  "plain-point-highlight text-site-bullet-accent"

export function renderEmphasizedText(
  text: string,
  strongClassName = "font-medium",
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
