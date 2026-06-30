import { useEffect, useMemo, useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { useTranslation } from "react-i18next"

import { AppLink } from "@/components/AppLink"
import { BackButton } from "@/components/BackButton"
import { GitHubRepoStats } from "@/components/GitHubRepoStats"
import { Layout } from "@/components/Layout"
import { SmallToolImageGallery } from "@/components/SmallToolImageGallery"
import { renderPlainRichText } from "@/components/PlainRichText"
import { type SmallTool } from "@/data/tools"
import { cn } from "@/lib/utils"

type PlainToolIndexPageProps = {
  tools: SmallTool[]
}

const roleClassName = {
  author:
    "border-emerald-300/60 bg-emerald-100/70 text-emerald-800 dark:border-emerald-300/30 dark:bg-emerald-300/15 dark:text-emerald-200",
  contributor:
    "border-sky-300/60 bg-sky-100/70 text-sky-800 dark:border-sky-300/30 dark:bg-sky-300/15 dark:text-sky-200",
} satisfies Record<SmallTool["role"], string>

const statusClassName =
  "border-amber-300/50 bg-amber-100/75 text-amber-850 dark:border-amber-300/25 dark:bg-amber-300/12 dark:text-amber-200"

const archivedClassName =
  "border-zinc-300/70 bg-zinc-100/80 text-zinc-700 dark:border-zinc-300/25 dark:bg-zinc-300/10 dark:text-zinc-200"

function getPoints(value: unknown) {
  return Array.isArray(value) ? value.filter((point): point is string => typeof point === "string") : []
}

function estimateToolHeight(
  tool: SmallTool,
  title: string,
  summary: string,
  points: string[],
) {
  const firstImage = tool.screenshots?.[0]
  let estimatedHeight = firstImage
    ? 420 / (firstImage.width / firstImage.height)
    : tool.screenshot
      ? 220
      : 0

  estimatedHeight += Math.ceil(title.length / 18) * 30
  estimatedHeight += Math.ceil(summary.length / 28) * 24
  estimatedHeight += points.reduce(
    (total, point) => total + Math.ceil(point.length / 34) * 22 + 8,
    0,
  )
  estimatedHeight += 120

  return estimatedHeight
}

export function PlainToolIndexPage({ tools }: PlainToolIndexPageProps) {
  const { t } = useTranslation(["tools", "common"])
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
    const cols: SmallTool[][] = Array.from({ length: columns }, () => [])
    const colHeights = Array.from({ length: columns }, () => 0)

    tools.forEach((tool) => {
      const title = t(`items.${tool.id}.title`)
      const summary = t(`items.${tool.id}.summary`)
      const points = getPoints(t(`items.${tool.id}.points`, { returnObjects: true })).slice(0, 3)
      const estimatedHeight = estimateToolHeight(tool, title, summary, points)
      let minColIdx = 0
      let minHeight = colHeights[0]

      for (let index = 1; index < columns; index += 1) {
        if (colHeights[index] < minHeight) {
          minHeight = colHeights[index]
          minColIdx = index
        }
      }

      cols[minColIdx].push(tool)
      colHeights[minColIdx] += estimatedHeight
    })

    return cols
  }, [columns, tools, t])

  return (
    <Layout mainClassName="plain-home-main">
      <article className="plain-home-document plain-index-document plain-project-index-document" aria-labelledby="plain-tool-index-title">
        <header className="plain-home-header plain-index-header">
          <BackButton fallback="/resume" className="plain-index-back" />
          <h1 id="plain-tool-index-title">{t("title")}</h1>
          <p className="plain-home-lede">{t("subtitle")}</p>
        </header>

        <section className="plain-project-masonry" aria-label={t("title")}>
          {columnsData.map((columnTools, columnIndex) => (
            <div key={columnIndex} className="plain-project-column">
              {columnTools.map((tool, toolIndex) => {
                const title = t(`items.${tool.id}.title`)
                const points = getPoints(t(`items.${tool.id}.points`, { returnObjects: true })).slice(0, 3)

                return (
                  <article key={tool.id} className="plain-project-item">
                    {tool.screenshots?.length ? (
                      <SmallToolImageGallery
                        cardAutoCycle
                        cardAutoCycleStaggerIndex={columnIndex * 3 + toolIndex}
                        cardScrollable={false}
                        images={tool.screenshots}
                        className="plain-project-gallery"
                      />
                    ) : tool.screenshot ? (
                      <img
                        src={tool.screenshot.src}
                        alt={tool.screenshot.alt}
                        className="plain-project-fallback-image"
                        loading="lazy"
                      />
                    ) : null}

                    <div className="plain-project-copy">
                      <header className="plain-index-item-header">
                        <h2>
                          <AppLink to={`/tools/${tool.id}`}>
                            {title}
                          </AppLink>
                        </h2>
                        <p className="plain-index-meta">
                          {[
                            t(`labels.${tool.role}`),
                            ...(tool.status ? [t(`labels.${tool.status}`)] : []),
                            ...(tool.archived ? [t("labels.archived")] : []),
                          ].join(" / ")}
                        </p>
                      </header>

                      <div className="plain-project-repo-list">
                        {tool.repoUrl && tool.repoName ? (
                          <a
                            href={tool.repoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="plain-project-repo-link"
                          >
                            <span className="plain-project-repo-name min-w-0 truncate">{tool.repoName}</span>
                            <ArrowUpRight className="plain-project-repo-arrow h-4 w-4 shrink-0" />
                            <GitHubRepoStats
                              repo={tool.githubRepo}
                              className="plain-project-repo-stats"
                            />
                          </a>
                        ) : (
                          <span className="plain-project-repo-link">
                            {tool.repoName ?? t("labels.privateTool")}
                          </span>
                        )}
                      </div>

                      <p>{t(`items.${tool.id}.summary`)}</p>

                      {points.length ? (
                        <ul>
                          {points.map((point) => (
                            <li key={point}>{renderPlainRichText(point)}</li>
                          ))}
                        </ul>
                      ) : null}

                      <ul className="plain-index-tags" aria-label={title}>
                        <li
                          className={cn(
                            "plain-index-tag-pill rounded-full border px-2.5 py-1 text-xs font-semibold",
                            roleClassName[tool.role],
                          )}
                        >
                          {t(`labels.${tool.role}`)}
                        </li>
                        {tool.status ? (
                          <li
                            className={cn(
                              "plain-index-tag-pill rounded-full border px-2.5 py-1 text-xs font-semibold",
                              statusClassName,
                            )}
                          >
                            {t(`labels.${tool.status}`)}
                          </li>
                        ) : null}
                        {tool.archived ? (
                          <li
                            className={cn(
                              "plain-index-tag-pill rounded-full border px-2.5 py-1 text-xs font-semibold",
                              archivedClassName,
                            )}
                          >
                            {t("labels.archived")}
                          </li>
                        ) : null}
                      </ul>
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
