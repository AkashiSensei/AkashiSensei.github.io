import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import { SmallToolCard } from "@/components/SmallToolCard"
import { type SmallTool } from "@/data/tools"

type SmallToolGridProps = {
  tools: SmallTool[]
}

export function SmallToolGrid({ tools }: SmallToolGridProps) {
  const { t } = useTranslation("tools")
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
    const cols: SmallTool[][] = Array.from({ length: columns }, () => [])
    const colHeights = Array.from({ length: columns }, () => 0)

    tools.forEach((tool) => {
      const screenshotCount = tool.screenshots?.length ?? (tool.screenshot ? 1 : 0)
      let estimatedHeight = screenshotCount > 0 ? 330 : 160

      const title = t(`items.${tool.id}.title`) as string
      estimatedHeight += Math.ceil((title?.length || 0) / 14) * 28

      const summary = t(`items.${tool.id}.summary`) as string
      estimatedHeight += Math.ceil((summary?.length || 0) / 22) * 24

      const points = t(`items.${tool.id}.points`, { returnObjects: true }) as string[]
      if (Array.isArray(points)) {
        points.forEach((point) => {
          estimatedHeight += Math.ceil((point?.length || 0) / 20) * 24 + 8
        })
      }

      let minColIdx = 0
      let minHeight = colHeights[0]
      for (let i = 1; i < columns; i++) {
        if (colHeights[i] < minHeight) {
          minHeight = colHeights[i]
          minColIdx = i
        }
      }

      cols[minColIdx].push(tool)
      colHeights[minColIdx] += estimatedHeight
    })

    return cols
  }, [columns, tools, t])

  return (
    <div className="flex items-start gap-3">
      {columnsData.map((colTools, colIdx) => (
        <div key={colIdx} className="flex min-w-0 flex-1 flex-col gap-3">
          {colTools.map((tool) => (
            <SmallToolCard
              key={tool.id}
              tool={tool}
              className={
                (tool.screenshots?.length ?? (tool.screenshot ? 1 : 0)) > 0
                  ? "h-auto max-h-[52rem]"
                  : "h-auto max-h-[40rem]"
              }
            />
          ))}
        </div>
      ))}
    </div>
  )
}
