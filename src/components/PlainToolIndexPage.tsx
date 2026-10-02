import { PlainImageGallery } from "@/components/PlainImageGallery"
import { ExternalLinkIcon } from "@/components/ExternalLinkIcon"
import { DocumentTag } from "@/components/DocumentTag"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import { AppLink } from "@/components/AppLink"
import { BackButton } from "@/components/BackButton"
import { GitHubRepoStats } from "@/components/GitHubRepoStats"
import { Layout } from "@/components/Layout"
import { SmallToolImageGallery } from "@/components/SmallToolImageGallery"
import { renderPlainRichText } from "@/components/PlainRichText"
import { type SmallTool } from "@/data/tools"
import { getListingPointSections } from "@/lib/project-points"

type PlainToolIndexPageProps = {
  tools: SmallTool[]
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
      const { points } = getListingPointSections(
        t(`items.${tool.id}.points`, { returnObjects: true }),
      )
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
                const { points } = getListingPointSections(
                  t(`items.${tool.id}.points`, { returnObjects: true }),
                )

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
                      <PlainImageGallery single images={[{ src: tool.screenshot.src, alt: tool.screenshot.alt }]} imageClassName="plain-project-fallback-image" />
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
                            {tool.repoTags?.map((repoTag) => (
                              <DocumentTag key={repoTag} label={t(`repoTags.${repoTag}`)} />
                            ))}
                            <span className="plain-project-repo-name min-w-0 truncate">{tool.repoName}</span>
                            <ExternalLinkIcon className="plain-project-repo-arrow h-4 w-4 shrink-0" />
                            <GitHubRepoStats
                              repo={tool.githubRepo}
                              className="plain-project-repo-stats"
                            />
                          </a>
                        ) : (
                          <span className="plain-project-repo-link">
                            {tool.repoTags?.map((repoTag) => (
                              <DocumentTag key={repoTag} label={t(`repoTags.${repoTag}`)} />
                            ))}
                            <span className="plain-project-repo-name min-w-0 truncate">
                              {tool.repoName ?? t("labels.privateTool")}
                            </span>
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
                        <DocumentTag as="li"  label={t(`labels.${tool.role}`)} />
                        {tool.status ? (
                          <DocumentTag as="li"  label={t(`labels.${tool.status}`)} />
                        ) : null}
                        {tool.archived ? (
                          <DocumentTag as="li"  label={t("labels.archived")} />
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
