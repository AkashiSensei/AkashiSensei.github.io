import { useState, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"

import { type WorkbenchGroup } from "@/data/workbench"
import { SoftwareGroupCard } from "@/components/SoftwareGroupCard"

type SoftwareGroupGridProps = {
  groups: WorkbenchGroup[]
}

export function SoftwareGroupGrid({ groups }: SoftwareGroupGridProps) {
  const { t } = useTranslation("workbench")
  const [columns, setColumns] = useState(3)

  // 监听屏幕宽度，动态决定列数
  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth >= 1024) setColumns(3)
      else if (window.innerWidth >= 640) setColumns(2)
      else setColumns(1)
    }

    updateColumns()
    window.addEventListener("resize", updateColumns)
    return () => window.removeEventListener("resize", updateColumns)
  }, [])

  // 核心瀑布流算法：估算高度并分配到最短列
  const columnsData = useMemo(() => {
    const cols: WorkbenchGroup[][] = Array.from({ length: columns }, () => [])
    const colHeights = Array.from({ length: columns }, () => 0)

    groups.forEach((group) => {
      // 1. 估算卡片高度
      // 基础高度：Padding、标题、间距、单行图标区域，大约 150px
      let estimatedHeight = 150

      const summary = t(`items.${group.id}.summary`) as string
      // 假设每列宽度下，大约 22 个中文字符换行
      const summaryLines = Math.ceil((summary?.length || 0) / 22)
      estimatedHeight += summaryLines * 24 // 每行约 24px

      const points = t(`items.${group.id}.points`, { returnObjects: true }) as string[]
      if (Array.isArray(points)) {
        points.forEach((p) => {
          const pLines = Math.ceil((p?.length || 0) / 20)
          estimatedHeight += pLines * 24 + 8 // 加上列表项之间的 gap
        })
      }

      // 2. 寻找当前最短的列
      let minColIdx = 0
      let minHeight = colHeights[0]
      for (let i = 1; i < columns; i++) {
        if (colHeights[i] < minHeight) {
          minHeight = colHeights[i]
          minColIdx = i
        }
      }

      // 3. 分配卡片并更新该列高度
      cols[minColIdx].push(group)
      colHeights[minColIdx] += estimatedHeight
    })

    return cols
  }, [groups, columns, t])

  return (
    <div className="flex items-start gap-3">
      {columnsData.map((colGroups, colIdx) => (
        <div key={colIdx} className="flex min-w-0 flex-1 flex-col gap-3">
          {colGroups.map((group) => (
            <SoftwareGroupCard
              key={group.id}
              group={group}
              className="h-auto max-h-[36rem]"
            />
          ))}
        </div>
      ))}
    </div>
  )
}
