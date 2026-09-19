import { renderEmphasizedText, personalWorkHighlightClassName } from "@/lib/emphasized-text"
import { cn } from "@/lib/utils"

type FeaturePointListProps = {
  points: string[]
  highlightedIndexes?: readonly number[]
  className?: string
}

export function FeaturePointList({
  points,
  highlightedIndexes,
  className,
}: FeaturePointListProps) {
  const highlightedSet = new Set(highlightedIndexes)

  return (
    <ul
      className={cn(
        "flex flex-col gap-2 text-sm leading-relaxed text-foreground/75 dark:text-foreground/85",
        className,
      )}
    >
      {points.map((point, index) => {
        const highlighted = highlightedSet.has(index)

        return (
          <li
            key={`${index}-${point}`}
            className={cn(
              "flex gap-2",
              highlighted && personalWorkHighlightClassName,
            )}
          >
            <span
              className={cn(
                "mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full",
                highlighted
                  ? "bg-amber-700 dark:bg-violet-300"
                  : "bg-foreground/40 dark:bg-foreground/50",
              )}
            />
            <span>{renderEmphasizedText(point, "font-semibold text-foreground")}</span>
          </li>
        )
      })}
    </ul>
  )
}
