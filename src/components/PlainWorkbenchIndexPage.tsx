import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import { BackButton } from "@/components/BackButton"
import { Layout } from "@/components/Layout"
import { renderPlainRichText } from "@/components/PlainRichText"
import { PlainWorkbenchSoftwareBar } from "@/components/PlainWorkbenchSoftwareBar"
import { type WorkbenchGroup } from "@/data/workbench"

type PlainWorkbenchIndexPageProps = {
  groups: WorkbenchGroup[]
}

function getPoints(value: unknown) {
  return Array.isArray(value)
    ? value.filter((point): point is string => typeof point === "string")
    : []
}

function estimateWorkbenchHeight(
  group: WorkbenchGroup,
  title: string,
  summary: string,
  points: string[],
) {
  let estimatedHeight = 110

  estimatedHeight += Math.ceil(group.software.length / 8) * 38
  estimatedHeight += Math.ceil(title.length / 18) * 30
  estimatedHeight += Math.ceil(summary.length / 28) * 24
  estimatedHeight += points.reduce(
    (total, point) => total + Math.ceil(point.length / 34) * 22 + 8,
    0,
  )

  return estimatedHeight
}

export function PlainWorkbenchIndexPage({
  groups,
}: PlainWorkbenchIndexPageProps) {
  const { t } = useTranslation("workbench")
  const [columns, setColumns] = useState(2)

  useEffect(() => {
    const updateColumns = () => {
      setColumns(window.innerWidth >= 768 ? 2 : 1)
    }

    updateColumns()
    window.addEventListener("resize", updateColumns)
    return () => window.removeEventListener("resize", updateColumns)
  }, [])

  const columnsData = useMemo(() => {
    const cols: WorkbenchGroup[][] = Array.from({ length: columns }, () => [])
    const colHeights = Array.from({ length: columns }, () => 0)

    groups.forEach((group) => {
      const title = t(`items.${group.id}.title`)
      const summary = t(`items.${group.id}.summary`)
      const points = getPoints(
        t(`items.${group.id}.points`, { returnObjects: true }),
      ).slice(0, 4)
      const estimatedHeight = estimateWorkbenchHeight(
        group,
        title,
        summary,
        points,
      )
      let minColIdx = 0
      let minHeight = colHeights[0]

      for (let index = 1; index < columns; index += 1) {
        if (colHeights[index] < minHeight) {
          minHeight = colHeights[index]
          minColIdx = index
        }
      }

      cols[minColIdx].push(group)
      colHeights[minColIdx] += estimatedHeight
    })

    return cols
  }, [columns, groups, t])

  return (
    <Layout mainClassName="plain-home-main">
      <article
        className="plain-home-document plain-index-document plain-project-index-document"
        aria-labelledby="plain-workbench-index-title"
      >
        <header className="plain-home-header plain-index-header">
          <BackButton fallback="/resume" className="plain-index-back" />
          <h1 id="plain-workbench-index-title">{t("title")}</h1>
          <p className="plain-home-lede">{t("subtitle")}</p>
        </header>

        <section className="plain-project-masonry" aria-label={t("title")}>
          {columnsData.map((columnGroups, columnIndex) => (
            <div key={columnIndex} className="plain-project-column">
              {columnGroups.map((group) => {
                const title = t(`items.${group.id}.title`)
                const points = getPoints(
                  t(`items.${group.id}.points`, { returnObjects: true }),
                ).slice(0, 4)

                return (
                  <article key={group.id} className="plain-project-item">
                    <div className="plain-project-copy">
                      <header className="plain-index-item-header">
                        <h2>{title}</h2>
                        <PlainWorkbenchSoftwareBar
                          software={group.software}
                          ariaLabel={title}
                        />
                        <p className="plain-index-meta">
                          {group.software.map((software) => software.name).join(" / ")}
                        </p>
                      </header>

                      <p>{t(`items.${group.id}.summary`)}</p>

                      {points.length ? (
                        <ul>
                          {points.map((point) => (
                            <li key={point}>{renderPlainRichText(point)}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </article>
                )
              })}
            </div>
          ))}
        </section>
      </article>
    </Layout>
  )
}
