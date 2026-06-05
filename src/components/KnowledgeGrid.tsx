import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import { KnowledgeCard } from "@/components/KnowledgeCard"
import { type KnowledgeEntry } from "@/data/knowledge"

type KnowledgeGridProps = {
  entries: KnowledgeEntry[]
}

export function KnowledgeGrid({ entries }: KnowledgeGridProps) {
  const { t } = useTranslation("knowledge")
  const [columns, setColumns] = useState(2)

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth >= 768) setColumns(2)
      else setColumns(1)
    }

    updateColumns()
    window.addEventListener("resize", updateColumns)
    return () => window.removeEventListener("resize", updateColumns)
  }, [])

  const columnsData = useMemo(() => {
    const cols: KnowledgeEntry[][] = Array.from({ length: columns }, () => [])
    const colHeights = Array.from({ length: columns }, () => 0)

    entries.forEach((entry) => {
      const firstImage = entry.images?.[0]
      let estimatedHeight = firstImage
        ? 260 / (firstImage.width / firstImage.height)
        : 0

      const title = t(`items.${entry.id}.title`) as string
      estimatedHeight += Math.ceil((title?.length || 0) / 16) * 28

      const summary = t(`items.${entry.id}.summary`) as string
      estimatedHeight += Math.ceil((summary?.length || 0) / 24) * 24
      estimatedHeight += Math.ceil(entry.tags.length / 3) * 32
      estimatedHeight += 120

      let minColIdx = 0
      let minHeight = colHeights[0]
      for (let i = 1; i < columns; i++) {
        if (colHeights[i] < minHeight) {
          minHeight = colHeights[i]
          minColIdx = i
        }
      }

      cols[minColIdx].push(entry)
      colHeights[minColIdx] += estimatedHeight
    })

    return cols
  }, [columns, entries, t])

  return (
    <div className="flex items-start gap-3">
      {columnsData.map((colEntries, colIdx) => (
        <div key={colIdx} className="flex min-w-0 flex-1 flex-col gap-3">
          {colEntries.map((entry) => (
            <KnowledgeCard key={entry.id} entry={entry} className="h-auto" />
          ))}
        </div>
      ))}
    </div>
  )
}
