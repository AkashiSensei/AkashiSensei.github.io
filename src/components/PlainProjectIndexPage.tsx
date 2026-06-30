import { useEffect, useMemo, useRef, useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { useTranslation } from "react-i18next"

import { AppLink } from "@/components/AppLink"
import { BackButton } from "@/components/BackButton"
import { GitHubRepoStats } from "@/components/GitHubRepoStats"
import { Layout } from "@/components/Layout"
import { ProjectImageGallery } from "@/components/ProjectImageGallery"
import { renderPlainRichText } from "@/components/PlainRichText"
import { type Project } from "@/data/projects"
import { getProjectPointSections } from "@/lib/project-points"
import {
  defaultTagClassName,
  getCourseProjectSemesterTagClassName,
  getSemanticTagClassName,
} from "@/lib/tag-styles"
import { cn } from "@/lib/utils"

type PlainProjectIndexPageProps = {
  projects: Project[]
  translationNamespace?: "projects" | "courseProjects"
}

type PlainProjectRepoLink = {
  label?: string
  url?: string
  githubRepo?: string
  repoTags?: Project["repoTags"]
}

const lifecycleStatusClassName = {
  starting:
    "border-sky-300/60 bg-sky-100/70 text-sky-800 dark:border-sky-300/30 dark:bg-sky-300/15 dark:text-sky-200",
  ongoing:
    "border-emerald-300/60 bg-emerald-100/70 text-emerald-800 dark:border-emerald-300/30 dark:bg-emerald-300/15 dark:text-emerald-200",
  completed:
    "border-zinc-300/70 bg-zinc-100/80 text-zinc-700 dark:border-zinc-300/25 dark:bg-zinc-300/10 dark:text-zinc-200",
} satisfies Record<Project["lifecycleStatus"], string>

const defaultColumnWidth = 640
const defaultColumnGap = 32

function estimateTextRows(
  text: string,
  columnWidth: number,
  characterWidth: number,
) {
  const charsPerLine = Math.max(8, Math.floor(columnWidth / characterWidth))

  return Math.max(1, Math.ceil(Array.from(text).length / charsPerLine))
}

function estimateWrappedRows(labels: string[], columnWidth: number) {
  if (!labels.length) return 0

  let rows = 1
  let occupiedWidth = 0

  labels.forEach((label) => {
    const itemWidth = Math.max(54, Array.from(label).length * 8 + 34)
    const nextWidth = occupiedWidth ? occupiedWidth + 6 + itemWidth : itemWidth

    if (occupiedWidth && nextWidth > columnWidth) {
      rows += 1
      occupiedWidth = itemWidth
    } else {
      occupiedWidth = nextWidth
    }
  })

  return rows
}

function getPlainProjectRepoLinks(project: Project): PlainProjectRepoLink[] {
  return (
    project.links ??
    (project.externalUrl || project.repoName
      ? [
          {
            label: project.repoName,
            url: project.externalUrl,
            githubRepo: project.githubRepo,
            repoTags: project.repoTags,
          },
        ]
      : [])
  )
}

function estimateProjectHeight(
  project: Project,
  title: string,
  summary: string,
  points: string[],
  columnWidth: number,
  repoLinkCount: number,
  tagLabels: string[],
) {
  const firstImage = project.images?.[0]
  const measuredColumnWidth = Math.max(280, columnWidth)
  let estimatedHeight = firstImage
    ? measuredColumnWidth / (firstImage.width / firstImage.height)
    : project.screenshot
      ? 210
      : 0

  estimatedHeight += estimateTextRows(title, measuredColumnWidth, 22) * 32
  estimatedHeight += 22
  estimatedHeight += repoLinkCount ? repoLinkCount * 29 + Math.max(0, repoLinkCount - 1) * 7 : 0
  estimatedHeight += estimateTextRows(summary, measuredColumnWidth, 18) * 29
  estimatedHeight += points.reduce(
    (total, point) =>
      total + estimateTextRows(point, measuredColumnWidth, 18) * 24 + 8,
    0,
  )
  estimatedHeight += estimateWrappedRows(tagLabels, measuredColumnWidth) * 34
  estimatedHeight += 98

  return estimatedHeight
}

export function PlainProjectIndexPage({
  projects,
  translationNamespace = "projects",
}: PlainProjectIndexPageProps) {
  const { t } = useTranslation([translationNamespace, "common"])
  const masonryRef = useRef<HTMLElement | null>(null)
  const [columns, setColumns] = useState(2)
  const [masonryMetrics, setMasonryMetrics] = useState({
    width: 0,
    gap: defaultColumnGap,
  })
  const detailBasePath =
    translationNamespace === "courseProjects" ? "/course-projects" : "/projects"

  useEffect(() => {
    const updateLayoutMetrics = () => {
      setColumns(window.innerWidth >= 768 ? 2 : 1)

      const element = masonryRef.current
      if (!element) return

      const style = window.getComputedStyle(element)
      const nextWidth = Math.round(element.clientWidth)
      const nextGap =
        Number.parseFloat(style.columnGap) ||
        Number.parseFloat(style.gap) ||
        defaultColumnGap

      setMasonryMetrics((previous) =>
        previous.width === nextWidth && previous.gap === nextGap
          ? previous
          : { width: nextWidth, gap: nextGap },
      )
    }

    updateLayoutMetrics()
    window.addEventListener("resize", updateLayoutMetrics)

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(updateLayoutMetrics)

    if (masonryRef.current) {
      resizeObserver?.observe(masonryRef.current)
    }

    return () => {
      window.removeEventListener("resize", updateLayoutMetrics)
      resizeObserver?.disconnect()
    }
  }, [])

  const columnsData = useMemo(() => {
    const cols: Project[][] = Array.from({ length: columns }, () => [])
    const colHeights = Array.from({ length: columns }, () => 0)
    const columnWidth =
      columns > 1 && masonryMetrics.width
        ? (masonryMetrics.width - masonryMetrics.gap * (columns - 1)) / columns
        : masonryMetrics.width || defaultColumnWidth

    projects.forEach((project) => {
      const title = t(`items.${project.id}.title`)
      const summary = t(`items.${project.id}.summary`)
      const points = getProjectPointSections(
        t(`items.${project.id}.points`, { returnObjects: true }),
      ).points.slice(0, 3)
      const repoLinks = getPlainProjectRepoLinks(project)
      const hasCourseProjectTimeTags =
        translationNamespace === "courseProjects"
      const tagLabels = [
        t(`lifecycleStatus.${project.lifecycleStatus}`),
        ...project.tags.map((tag, tagIndex) =>
          hasCourseProjectTimeTags && tagIndex < 2
            ? t(`semesterTags.${tag}`, { defaultValue: tag })
            : tag,
        ),
      ]
      const estimatedHeight = estimateProjectHeight(
        project,
        title,
        summary,
        points,
        columnWidth,
        repoLinks.length,
        tagLabels,
      )
      let minColIdx = 0
      let minHeight = colHeights[0]

      for (let index = 1; index < columns; index += 1) {
        if (colHeights[index] < minHeight) {
          minHeight = colHeights[index]
          minColIdx = index
        }
      }

      cols[minColIdx].push(project)
      colHeights[minColIdx] += estimatedHeight + 42
    })

    return cols
  }, [columns, masonryMetrics.gap, masonryMetrics.width, projects, t, translationNamespace])

  return (
    <Layout mainClassName="plain-home-main">
      <article className="plain-home-document plain-index-document plain-project-index-document" aria-labelledby="plain-project-index-title">
        <header className="plain-home-header plain-index-header">
          <BackButton fallback="/resume" className="plain-index-back" />
          <h1 id="plain-project-index-title">{t("title")}</h1>
          <p className="plain-home-lede">{t("subtitle")}</p>
        </header>

        <section
          ref={masonryRef}
          className="plain-project-masonry"
          aria-label={t("title")}
        >
          {columnsData.map((columnProjects, columnIndex) => (
            <div key={columnIndex} className="plain-project-column">
              {columnProjects.map((project, projectIndex) => {
                const title = t(`items.${project.id}.title`)
                const points = getProjectPointSections(
                  t(`items.${project.id}.points`, { returnObjects: true }),
                ).points.slice(0, 3)
                const hasCourseProjectTimeTags =
                  translationNamespace === "courseProjects"
                const repoLinks = getPlainProjectRepoLinks(project)

                return (
                  <article key={project.id} className="plain-project-item">
                    {project.images?.length ? (
                      <ProjectImageGallery
                        cardAspectRatioMode="natural"
                        cardAutoCycle
                        cardAutoCycleStaggerIndex={columnIndex * 3 + projectIndex}
                        cardScrollable={false}
                        images={project.images}
                        translationNamespace={translationNamespace}
                        className="plain-project-gallery"
                      />
                    ) : project.screenshot ? (
                      <img
                        src={project.screenshot.src}
                        alt={t(project.screenshot.altKey)}
                        className="plain-project-fallback-image"
                        loading="lazy"
                      />
                    ) : null}

                    <div className="plain-project-copy">
                      <header className="plain-index-item-header">
                        <h2>
                          <AppLink to={`${detailBasePath}/${project.id}`}>
                            {title}
                          </AppLink>
                        </h2>
                        <p className="plain-index-meta">
                          {[
                            t(`lifecycleStatus.${project.lifecycleStatus}`),
                            ...(project.status?.map((status) => t(`status.${status}`)) ?? []),
                          ].join(" / ")}
                        </p>
                      </header>

                      {repoLinks.length ? (
                        <div className="plain-project-repo-list">
                          {repoLinks.map((link) => {
                            const repoLabel = link.label ?? link.url ?? t("repoLabel")
                            const repoContent = (
                              <>
                                {link.repoTags?.map((repoTag) => (
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
                                <span className="plain-project-repo-name min-w-0 truncate">
                                  {repoLabel}
                                </span>
                                {link.url ? (
                                  <ArrowUpRight className="plain-project-repo-arrow h-4 w-4 shrink-0" />
                                ) : null}
                                <GitHubRepoStats
                                  repo={link.githubRepo}
                                  className="plain-project-repo-stats"
                                />
                              </>
                            )

                            return link.url ? (
                              <a
                                key={link.url}
                                href={link.url}
                                target="_blank"
                                rel="noreferrer"
                                className="plain-project-repo-link"
                                aria-label={`${t("repoLabel")}: ${repoLabel}`}
                              >
                                {repoContent}
                              </a>
                            ) : (
                              <span
                                key={repoLabel}
                                className="plain-project-repo-link"
                              >
                                {repoContent}
                              </span>
                            )
                          })}
                        </div>
                      ) : null}

                      <p>{t(`items.${project.id}.summary`)}</p>

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
                            lifecycleStatusClassName[project.lifecycleStatus],
                          )}
                        >
                          {t(`lifecycleStatus.${project.lifecycleStatus}`)}
                        </li>
                        {project.tags.map((tag, tagIndex) => {
                          const isCourseProjectTimeTag =
                            hasCourseProjectTimeTags && tagIndex < 2

                          return (
                            <li
                              key={tag}
                              className={cn(
                                "plain-index-tag-pill rounded-full border px-2.5 py-1 text-xs font-semibold",
                                isCourseProjectTimeTag
                                  ? getCourseProjectSemesterTagClassName(project.tags[1])
                                  : defaultTagClassName,
                              )}
                            >
                              {isCourseProjectTimeTag
                                ? t(`semesterTags.${tag}`, { defaultValue: tag })
                                : tag}
                            </li>
                          )
                        })}
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
