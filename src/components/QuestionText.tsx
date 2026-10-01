import { Fragment } from "react"

// Only the inline formatting used in the author's notes is interpreted. No raw HTML.
export function QuestionText({ text }: { text: string }) {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*|<br\s*\/?>|\n)/g).map((part, index) => {
    if (part.startsWith("`")) return <code key={index}>{part.slice(1, -1)}</code>
    if (part.startsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>
    if (/^<br\s*\/?>$|^\n$/.test(part)) return <br key={index} />
    return <Fragment key={index}>{part.replaceAll("\\[", "[").replaceAll("\\]", "]")}</Fragment>
  })
}
