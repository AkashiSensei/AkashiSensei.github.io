import { useEffect, useMemo, useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { useTranslation } from "react-i18next"

import { AppLink } from "@/components/AppLink"
import { BackButton } from "@/components/BackButton"
import { GitHubRepoStats } from "@/components/GitHubRepoStats"
import { Layout } from "@/components/Layout"
import { ProjectImageGallery } from "@/components/ProjectImageGallery"
import { renderPlainRichText } from "@/components/PlainRichText"
import { type KnowledgeEntry } from "@/data/knowledge"
import { getGitHubRepoUpdatedDate } from "@/lib/github-repo-stats"
import { defaultTagClassName, getSemanticTagClassName } from "@/lib/tag-styles"
import { cn } from "@/lib/utils"

type PlainKnowledgeIndexPageProps = {
  entries: KnowledgeEntry[]
}

const kindClassName: Record<KnowledgeEntry["kind"], string> = {
  blog:
    "border-sky-300/55 bg-sky-100/70 text-sky-800 dark:border-sky-300/25 dark:bg-sky-300/12 dark:text-sky-200",
  paperVault:
    "border-emerald-300/55 bg-emerald-100/70 text-emerald-800 dark:border-emerald-300/25 dark:bg-emerald-300/12 dark:text-emerald-200",
  digest:
    "border-amber-300/55 bg-amber-100/75 text-amber-850 dark:border-amber-300/25 dark:bg-amber-300/12 dark:text-amber-200",
  insights:
    "border-violet-300/50 bg-violet-100/70 text-violet-800 dark:border-violet-300/25 dark:bg-violet-300/12 dark:text-violet-200",
}

function getPoints(value: unknown) {
  return Array.isArray(value) ? value.filter((point): point is string => typeof point === "string") : []
}

function estimateKnowledgeHeight(
  entry: KnowledgeEntry,
  title: string,
  summary: string,
  points: string[],
) {
  const firstImage = entry.images?.[0]
  let estimatedHeight = firstImage
    ? 420 / (firstImage.width / firstImage.height)
    : 0

  estimatedHeight += Math.ceil(title.length / 18) * 30
  estimatedHeight += Math.ceil(summary.length / 28) * 24
  estimatedHeight += points.reduce(
    (total, point) => total + Math.ceil(point.length / 34) * 22 + 8,
    0,
  )
  estimatedHeight += Math.ceil(entry.tags.length / 4) * 34
  estimatedHeight += 130

  return estimatedHeight
}

export function PlainKnowledgeIndexPage({ entries }: PlainKnowledgeIndexPageProps) {
  const { i18n, t } = useTranslation(["knowledge", "common"])
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
    const cols: KnowledgeEntry[][] = Array.from({ length: columns }, () => [])
    const colHeights = Array.from({ length: columns }, () => 0)

    entries.forEach((entry) => {
      const title = t(`items.${entry.id}.title`)
      const summary = t(`items.${entry.id}.summary`)
      const points = getPoints(t(`items.${entry.id}.points`, { returnObjects: true })).slice(0, 3)
      const estimatedHeight = estimateKnowledgeHeight(entry, title, summary, points)
      let minColIdx = 0
      let minHeight = colHeights[0]

      for (let index = 1; index < columns; index += 1) {
        if (colHeights[index] < minHeight) {
          minHeight = colHeights[index]
          minColIdx = index
        }
      }

      cols[minColIdx].push(entry)
      colHeights[minColIdx] += estimatedHeight
    })

    return cols
  }, [columns, entries, t])

  return (
    <Layout mainClassName="plain-home-main">
      <article className="plain-home-document plain-index-document plain-project-index-document" aria-labelledby="plain-knowledge-index-title">
        <header className="plain-home-header plain-index-header">
          <BackButton fallback="/resume" className="plain-index-back" />
          <h1 id="plain-knowledge-index-title">{t("title")}</h1>
          <p className="plain-home-lede">{t("subtitle")}</p>
        </header>

        <section className="plain-project-masonry" aria-label={t("title")}>
          {columnsData.map((columnEntries, columnIndex) => (
            <div key={columnIndex} className="plain-project-column">
              {columnEntries.map((entry, entryIndex) => {
                const title = t(`items.${entry.id}.title`)
                const updatedDate = getGitHubRepoUpdatedDate(entry.githubRepo, entry.updatedAt)
                const updatedLabel = updatedDate
                  ? new Intl.DateTimeFormat(i18n.language, {
                      month: "long",
                      year: "numeric",
                    }).format(updatedDate)
                  : entry.updatedAt
                const points = getPoints(t(`items.${entry.id}.points`, { returnObjects: true })).slice(0, 3)

                return (
                  <article key={entry.id} className="plain-project-item">
                    {entry.images?.length ? (
                      <ProjectImageGallery
                        cardAspectRatioMode="natural"
                        cardAutoCycle
                        cardAutoCycleStaggerIndex={columnIndex * 3 + entryIndex}
                        cardScrollable={false}
                        images={entry.images}
                        translationNamespace="knowledge"
                        className="plain-project-gallery"
                      />
                    ) : null}

                    <div className="plain-project-copy">
                      <header className="plain-index-item-header">
                        <h2>
                          <AppLink to={`/knowledge/${entry.id}`}>
                            {title}
                          </AppLink>
                        </h2>
                        <p className="plain-index-meta">
                          {t(`kinds.${entry.kind}`)} / {t("updatedLabel")} {updatedLabel}
                        </p>
                      </header>

                      <div className="plain-project-repo-list">
                        <a
                          href={entry.url}
                          target="_blank"
                          rel="noreferrer"
                          className="plain-project-repo-link"
                          aria-label={`${t("repoLabel")}: ${entry.repoName}`}
                        >
                          {entry.repoTags?.map((repoTag) => (
                            <span
                              key={repoTag}
                              className={cn(
                                "plain-index-tag-pill shrink-0 whitespace-nowrap rounded-full border px-2 py-0.5 text-[0.6875rem] font-semibold leading-none",
                                getSemanticTagClassName(repoTag),
                              )}
                            >
                              {t(`repoTags.${repoTag}`)}
                            </span>
                          ))}
                          <span className="plain-project-repo-name min-w-0 truncate">{entry.repoName}</span>
                          <ArrowUpRight className="plain-project-repo-arrow h-4 w-4 shrink-0" />
                          <GitHubRepoStats
                            repo={entry.githubRepo}
                            className="plain-project-repo-stats"
                          />
                        </a>

                        {entry.externalLinks?.map((link) => (
                          <a
                            key={link.url}
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            className="plain-project-repo-link"
                          >
                            {link.badgeKeys?.map((badgeKey) => (
                              <span
                                key={badgeKey}
                                className={cn(
                                  "plain-index-tag-pill shrink-0 whitespace-nowrap rounded-full border px-2 py-0.5 text-[0.6875rem] font-semibold leading-none",
                                  badgeKey.endsWith(".loginRequired")
                                    ? "border-rose-400/25 bg-rose-400/10 text-rose-700 dark:border-rose-300/20 dark:bg-rose-300/10 dark:text-rose-200"
                                    : "border-amber-400/30 bg-amber-400/12 text-amber-800 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-200",
                                )}
                              >
                                {t(badgeKey)}
                              </span>
                            ))}
                            <span className="plain-project-repo-name min-w-0 truncate">{t(link.labelKey)}</span>
                            <ArrowUpRight className="plain-project-repo-arrow h-4 w-4 shrink-0" />
                          </a>
                        ))}
                      </div>

                      <p>{t(`items.${entry.id}.summary`)}</p>

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
                            kindClassName[entry.kind],
                          )}
                        >
                          {t(`kinds.${entry.kind}`)}
                        </li>
                        {entry.tags.map((tag) => (
                          <li
                            key={tag}
                            className={cn(
                              "plain-index-tag-pill rounded-full border px-2.5 py-1 text-xs font-semibold",
                              defaultTagClassName,
                            )}
                          >
                            {tag}
                          </li>
                        ))}
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
