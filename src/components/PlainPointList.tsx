import { renderEmphasizedText, personalWorkHighlightClassName } from "@/lib/emphasized-text"
import { cn } from "@/lib/utils"

type PlainPointListProps = {
  points: readonly string[]
  highlightedIndexes?: readonly number[]
}

export function PlainPointList({
  points,
  highlightedIndexes,
}: PlainPointListProps) {
  if (!points.length) {
    return null
  }

  const highlightedSet = new Set(highlightedIndexes)

  return (
    <ul>
      {points.map((point, index) => (
        <li
          key={`${index}-${point}`}
          className={cn(highlightedSet.has(index) && personalWorkHighlightClassName)}
        >
          {renderEmphasizedText(point)}
        </li>
      ))}
    </ul>
  )
}
