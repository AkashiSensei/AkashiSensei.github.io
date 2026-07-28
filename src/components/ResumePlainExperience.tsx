import { useEffect, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { ArrowUpRight } from "lucide-react"

import directions from "@/data/directions.json"
import { featuredCourseProjects } from "@/data/course-projects"
import { featuredKnowledgeEntries } from "@/data/knowledge"
import { featuredProjects, type Project } from "@/data/projects"
import { featuredSmallTools } from "@/data/tools"
import { featuredWorkbenchGroups, workbenchGroups } from "@/data/workbench"
import { AppLink } from "@/components/AppLink"
import { ContactDialog } from "@/components/ContactDialog"
import { GitHubRepoStats } from "@/components/GitHubRepoStats"
import { ProjectImageGallery } from "@/components/ProjectImageGallery"
import { renderPlainRichText } from "@/components/PlainRichText"
import { PlainWorkbenchSoftwareBar } from "@/components/PlainWorkbenchSoftwareBar"
import {
  defaultTagClassName,
  getCourseProjectSemesterTagClassName,
  getSemanticTagClassName,
} from "@/lib/tag-styles"
import { cn } from "@/lib/utils"

type ValueCard = {
  title: string
  description: string
}

function asStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []
}

function asValueCards(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is ValueCard => (
        typeof item === "object"
        && item !== null
        && "title" in item
        && "description" in item
        && typeof item.title === "string"
        && typeof item.description === "string"
      ))
    : []
}

const lifecycleStatusClassName = {
  starting:
    "border-sky-300/60 bg-sky-100/70 text-sky-800 dark:border-sky-300/30 dark:bg-sky-300/15 dark:text-sky-200",
  ongoing:
    "border-emerald-300/60 bg-emerald-100/70 text-emerald-800 dark:border-emerald-300/30 dark:bg-emerald-300/15 dark:text-emerald-200",
  completed:
    "border-zinc-300/70 bg-zinc-100/80 text-zinc-700 dark:border-zinc-300/25 dark:bg-zinc-300/10 dark:text-zinc-200",
} satisfies Record<Project["lifecycleStatus"], string>

const defaultProjectColumnWidth = 520
const defaultProjectColumnGap = 42

const resumeWorkbenchGroups = [
  ...featuredWorkbenchGroups,
  ...workbenchGroups.filter(
    (group) => !featuredWorkbenchGroups.some((featured) => featured.id === group.id),
  ),
]

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

function getResumeProjectRepoLinks(project: Project) {
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

function estimateResumeProjectHeight({
  columnWidth,
  points,
  project,
  repoLinkCount,
  summary,
  tagLabels,
  title,
}: {
  columnWidth: number
  points: string[]
  project: Project
  repoLinkCount: number
  summary: string
  tagLabels: string[]
  title: string
}) {
  const firstImage = project.images?.[0]
  const measuredColumnWidth = Math.max(280, columnWidth)
  let estimatedHeight = firstImage
    ? measuredColumnWidth / (firstImage.width / firstImage.height)
    : project.screenshot
      ? 210
      : 0

  estimatedHeight += estimateTextRows(title, measuredColumnWidth, 20) * 32
  estimatedHeight += 22
  estimatedHeight += repoLinkCount ? repoLinkCount * 29 + Math.max(0, repoLinkCount - 1) * 7 : 0
  estimatedHeight += estimateTextRows(summary, measuredColumnWidth, 18) * 29
  estimatedHeight += points.reduce(
    (total, point) =>
      total + estimateTextRows(point, measuredColumnWidth, 18) * 24 + 8,
    0,
  )
  estimatedHeight += estimateWrappedRows(tagLabels, measuredColumnWidth) * 34
  estimatedHeight += 58

  return estimatedHeight
}

type ResumePlainProjectListProps = {
  detailBasePath: "/projects" | "/course-projects"
  projects: Project[]
  sectionIndex: number
  translationNamespace: "projects" | "courseProjects"
}

function ResumePlainProjectList({
  detailBasePath,
  projects,
  sectionIndex,
  translationNamespace,
}: ResumePlainProjectListProps) {
  const { t } = useTranslation([translationNamespace, "common"])
  const listRef = useRef<HTMLDivElement | null>(null)
  const [columns, setColumns] = useState(2)
  const [listMetrics, setListMetrics] = useState({
    width: 0,
    gap: defaultProjectColumnGap,
  })
  const isCourseProject = translationNamespace === "courseProjects"

  useEffect(() => {
    const updateLayoutMetrics = () => {
      setColumns(window.innerWidth >= 768 ? 2 : 1)

      const element = listRef.current
      if (!element) return

      const style = window.getComputedStyle(element)
      const nextWidth = Math.round(element.clientWidth)
      const nextGap =
        Number.parseFloat(style.columnGap) ||
        Number.parseFloat(style.gap) ||
        defaultProjectColumnGap

      setListMetrics((previous) =>
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

    if (listRef.current) {
      resizeObserver?.observe(listRef.current)
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
      columns > 1 && listMetrics.width
        ? (listMetrics.width - listMetrics.gap * (columns - 1)) / columns
        : listMetrics.width || defaultProjectColumnWidth

    projects.forEach((project) => {
      const title = t(`items.${project.id}.title`)
      const summary = t(`items.${project.id}.summary`)
      const points = asStringArray(
        t(`items.${project.id}.points`, { returnObjects: true }),
      ).slice(0, 2)
      const repoLinks = getResumeProjectRepoLinks(project)
      const tagLabels = [
        t(`lifecycleStatus.${project.lifecycleStatus}`),
        ...project.tags.map((tag, tagIndex) =>
          isCourseProject && tagIndex < 2
            ? t(`semesterTags.${tag}`, { defaultValue: tag })
            : tag,
        ),
      ]
      const estimatedHeight = estimateResumeProjectHeight({
        columnWidth,
        points,
        project,
        repoLinkCount: repoLinks.length,
        summary,
        tagLabels,
        title,
      })
      let minColIdx = 0
      let minHeight = colHeights[0]

      for (let index = 1; index < columns; index += 1) {
        if (colHeights[index] < minHeight) {
          minHeight = colHeights[index]
          minColIdx = index
        }
      }

      cols[minColIdx].push(project)
      colHeights[minColIdx] += estimatedHeight + 36
    })

    return cols
  }, [columns, isCourseProject, listMetrics.gap, listMetrics.width, projects, t])

  return (
    <div ref={listRef} className="plain-resume-project-list">
      {columnsData.map((columnProjects, columnIndex) => (
        <div key={columnIndex} className="plain-resume-project-column">
          {columnProjects.map((project, projectIndex) => {
            const title = t(`items.${project.id}.title`)
            const points = asStringArray(
              t(`items.${project.id}.points`, { returnObjects: true }),
            ).slice(0, 2)
            const repoLinks = getResumeProjectRepoLinks(project)
            const originalProjectIndex = projects.findIndex(
              (candidate) => candidate.id === project.id,
            )
            const staggerIndex =
              sectionIndex * projects.length +
              (originalProjectIndex >= 0 ? originalProjectIndex : projectIndex)

            return (
              <article key={project.id} className="plain-resume-project-item">
            {project.images?.length ? (
              <ProjectImageGallery
                cardAspectRatioMode="natural"
                cardAutoCycle
                cardAutoCycleStaggerIndex={staggerIndex}
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
                <h3>
                  <AppLink to={`${detailBasePath}/${project.id}`}>
                    {title}
                  </AppLink>
                </h3>
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
                        <span className="plain-project-repo-name min-w-0 truncate">{repoLabel}</span>
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
                      <span key={repoLabel} className="plain-project-repo-link">
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
                  const isCourseProjectTimeTag = isCourseProject && tagIndex < 2

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
    </div>
  )
}

export function ResumePlainExperience() {
  const { t } = useTranslation([
    "resume",
    "projects",
    "courseProjects",
    "directions",
    "workbench",
    "knowledge",
    "tools",
  ])
  const descriptionParagraphs = asStringArray(t("description", { returnObjects: true }))
  const valueCards = asValueCards(t("values", { returnObjects: true }))
  const kickerTags = asStringArray(t("kickerTags", { returnObjects: true }))

  return (
    <article className="plain-home-document plain-resume-document" aria-labelledby="plain-resume-title">
      <header className="plain-home-header">
        <p className="plain-home-kicker">{kickerTags.join(" / ")}</p>
        <h1 id="plain-resume-title">{t("titleLead")}</h1>
        <p className="plain-home-lede">{t("titleAccent")}</p>
        <div className="plain-resume-description">
          {descriptionParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="plain-resume-mini-list plain-resume-header-values">
          {valueCards.map((card) => (
            <section key={card.title} className="plain-resume-mini-item">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </section>
          ))}
        </div>

        <div className="plain-home-actions">
          <ContactDialog>
            <button type="button">{t("contact")}</button>
          </ContactDialog>
          <a href="https://github.com/AkashiSensei" target="_blank" rel="noreferrer">
            {t("github")}
          </a>
        </div>
      </header>

      <section>
        <h2>
          <AppLink to="/projects">{t("projects:title")}</AppLink>
        </h2>
        <p>{t("projects:subtitle")}</p>
        <ResumePlainProjectList
          detailBasePath="/projects"
          projects={featuredProjects}
          sectionIndex={0}
          translationNamespace="projects"
        />
      </section>

      <section>
        <h2>{t("directions:title")}</h2>
        <p>{t("directions:subtitle")}</p>
        <div className="plain-resume-mini-list">
          {directions.map((direction) => (
            <section key={direction.id} className="plain-resume-mini-item">
              <h3>{t(`directions:items.${direction.id}.title`)}</h3>
              <p>{t(`directions:items.${direction.id}.summary`)}</p>
            </section>
          ))}
        </div>
      </section>

      <section>
        <h2>
          <AppLink to="/course-projects">{t("courseProjects:title")}</AppLink>
        </h2>
        <p>{t("courseProjects:subtitle")}</p>
        <ResumePlainProjectList
          detailBasePath="/course-projects"
          projects={featuredCourseProjects}
          sectionIndex={1}
          translationNamespace="courseProjects"
        />
      </section>

      <section>
        <h2>
          <AppLink to="/workbench">{t("workbench:title")}</AppLink>
        </h2>
        <p>{t("workbench:subtitle")}</p>
        <div className="plain-resume-mini-list">
          {resumeWorkbenchGroups.map((group, groupIndex) => {
            const title = t(`workbench:items.${group.id}.title`)

            return (
              <section
                key={group.id}
                className={cn(
                  "plain-resume-mini-item",
                  groupIndex >= featuredWorkbenchGroups.length &&
                    "plain-resume-desktop-only",
                )}
              >
                <h3>{title}</h3>
                <PlainWorkbenchSoftwareBar
                  software={group.software}
                  ariaLabel={title}
                />
                <p>{t(`workbench:items.${group.id}.summary`)}</p>
              </section>
            )
          })}
        </div>
      </section>

      <section>
        <h2>
          <AppLink to="/knowledge">{t("knowledge:title")}</AppLink>
        </h2>
        <p>{t("knowledge:subtitle")}</p>
        <div className="plain-resume-mini-list">
          {featuredKnowledgeEntries.map((entry) => (
            <section key={entry.id} className="plain-resume-mini-item">
              <h3><AppLink to={`/knowledge/${entry.id}`}>{t(`knowledge:items.${entry.id}.title`)}</AppLink></h3>
              <p>{t(`knowledge:items.${entry.id}.summary`)}</p>
            </section>
          ))}
        </div>
      </section>

      <section>
        <h2>
          <AppLink to="/tools">{t("tools:title")}</AppLink>
        </h2>
        <p>{t("tools:subtitle")}</p>
        <div className="plain-resume-mini-list">
          {featuredSmallTools.map((tool) => (
            <section key={tool.id} className="plain-resume-mini-item">
              <h3><AppLink to={`/tools/${tool.id}`}>{t(`tools:items.${tool.id}.title`)}</AppLink></h3>
              {tool.repoTags?.length ? (
                <ul className="plain-index-tags" aria-label={t(`tools:items.${tool.id}.title`)}>
                  {tool.repoTags.map((repoTag) => (
                    <li
                      key={repoTag}
                      className={cn(
                        "plain-index-tag-pill rounded-full border px-2 py-0.5 text-[0.6875rem] font-semibold leading-none",
                        getSemanticTagClassName(repoTag),
                      )}
                    >
                      {t(`tools:repoTags.${repoTag}`)}
                    </li>
                  ))}
                </ul>
              ) : null}
              <p>{t(`tools:items.${tool.id}.summary`)}</p>
            </section>
          ))}
        </div>
      </section>
    </article>
  )
}
