import { ArrowUpRight } from "lucide-react"
import { useTranslation } from "react-i18next"

import { AppLink } from "@/components/AppLink"
import { FeaturePointList } from "@/components/FeaturePointList"
import { GitHubRepoStats } from "@/components/GitHubRepoStats"
import { GlassPanel } from "@/components/GlassPanel"
import { LazyImage } from "@/components/LazyImage"
import { ProjectImageGallery } from "@/components/ProjectImageGallery"
import { type Project } from "@/data/projects"
import { getProjectPointSections } from "@/lib/project-points"
import {
  getCourseProjectSemesterTagClassName,
  getSemanticTagClassName,
} from "@/lib/tag-styles"
import { cn } from "@/lib/utils"

type ProjectCardProps = {
  project: Project
  className?: string
  variant?: "compact" | "full"
  translationNamespace?: "projects" | "courseProjects"
}

const lifecycleStatusClassName = {
  starting:
    "border-sky-300/60 bg-sky-100/70 text-sky-800 dark:border-sky-300/30 dark:bg-sky-300/15 dark:text-sky-200",
  ongoing:
    "border-emerald-300/60 bg-emerald-100/70 text-emerald-800 dark:border-emerald-300/30 dark:bg-emerald-300/15 dark:text-emerald-200",
  completed:
    "border-zinc-300/70 bg-zinc-100/80 text-zinc-700 dark:border-zinc-300/25 dark:bg-zinc-300/10 dark:text-zinc-200",
} satisfies Record<Project["lifecycleStatus"], string>

const defaultTagClassName =
  "border-[rgb(var(--site-surface-rgb)_/_0.45)] bg-[rgb(var(--site-surface-rgb)_/_0.28)] text-foreground/60 dark:border-white/10 dark:bg-white/[0.04] dark:text-foreground/70"

export function ProjectCard({
  project,
  className,
  variant = "full",
  translationNamespace = "projects",
}: ProjectCardProps) {
  const { t } = useTranslation([translationNamespace, "common"])
  const pointsValue = t(`items.${project.id}.points`, { returnObjects: true })
  const { points, highlightedIndexes } = getProjectPointSections(pointsValue)
  const detailPath =
    translationNamespace === "courseProjects"
      ? `/course-projects/${project.id}`
      : `/projects/${project.id}`
  const repoLinks =
    project.links ??
    (project.externalUrl
      ? [
          {
            label: project.repoName,
            githubRepo: project.githubRepo,
            repoTags: project.repoTags,
            url: project.externalUrl,
          },
        ]
      : undefined)

  return (
    <GlassPanel
      className={cn(
        "group detail-link-pair flex h-full min-h-0 flex-col overflow-hidden transition-colors hover:bg-[rgb(var(--site-surface-rgb)_/_0.70)] dark:hover:bg-white/10",
        className,
      )}
    >
      {project.images?.length ? (
        <ProjectImageGallery
          cardAspectRatioMode={variant === "full" ? "natural" : "bounded"}
          images={project.images}
          translationNamespace={translationNamespace}
        />
      ) : project.screenshot ? (
        <LazyImage
          src={project.screenshot.src}
          alt={t(project.screenshot.altKey)}
          placeholderTitle={t(project.screenshot.altKey)}
          loadingLabel={t("common:imageLoading")}
          brightness={project.screenshot.brightness}
          containerClassName="aspect-[16/9] w-full"
          imageClassName="h-full w-full object-cover"
        />
      ) : null}

      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col gap-4 p-4",
        )}
      >
        <div className="flex shrink-0 flex-col gap-3">
          <div className="flex items-center gap-2">
            <AppLink
              to={detailPath}
              className="detail-link-trigger detail-link-emphasis min-w-0 text-xl font-bold leading-tight text-foreground/90 transition-colors hover:text-foreground"
            >
              {t(`items.${project.id}.title`)}
            </AppLink>
            <span
              className={cn(
                "shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold leading-none",
                lifecycleStatusClassName[project.lifecycleStatus],
              )}
            >
              {t(`lifecycleStatus.${project.lifecycleStatus}`)}
            </span>
          </div>

          {repoLinks ? (
            <div className="flex flex-col items-start gap-1.5">
              {repoLinks.map((link) => {
                const repoContent = (
                  <>
                    {link.repoTags?.map((repoTag) => (
                      <span
                        key={repoTag}
                        className={cn(
                          "shrink-0 whitespace-nowrap rounded-full border px-2 py-0.5 text-[0.6875rem] font-semibold leading-none",
                          getSemanticTagClassName(repoTag),
                        )}
                      >
                        {t(`repoTags.${repoTag}`)}
                      </span>
                    ))}
                    <span className="min-w-0 max-w-[8rem] truncate sm:max-w-[10rem] md:max-w-[14rem] xl:max-w-[18rem]">
                      {link.label}
                    </span>
                    {link.url ? (
                      <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover/repo:-translate-y-0.5 group-hover/repo:translate-x-0.5" />
                    ) : null}
                    <GitHubRepoStats repo={link.githubRepo} />
                  </>
                )

                return link.url ? (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${t("repoLabel")}: ${link.label}`}
                    className="group/repo inline-flex min-w-0 w-fit max-w-full items-center gap-1.5 text-sm font-semibold text-foreground/60 transition-colors hover:text-foreground/90 dark:text-foreground/75 dark:hover:text-foreground"
                  >
                    {repoContent}
                  </a>
                ) : (
                  <span
                    key={link.label}
                    className="inline-flex min-w-0 w-fit max-w-full items-center gap-1.5 text-sm font-semibold text-foreground/60 dark:text-foreground/75"
                  >
                    {repoContent}
                  </span>
                )
              })}
            </div>
          ) : (
            <span className="flex max-w-full min-w-0 items-center gap-1.5 text-sm font-semibold text-foreground/60 dark:text-foreground/75">
              {project.repoTags?.length ? (
                <span className="flex shrink-0 flex-wrap gap-1.5">
                  {project.repoTags.map((repoTag) => (
                    <span
                      key={repoTag}
                      className={cn(
                        "shrink-0 whitespace-nowrap rounded-full border px-2 py-0.5 text-[0.6875rem] font-semibold leading-none",
                        getSemanticTagClassName(repoTag),
                      )}
                    >
                      {t(`repoTags.${repoTag}`)}
                    </span>
                  ))}
                </span>
              ) : null}
              {project.repoName ? (
                <span className="inline-flex min-w-0 items-center gap-1.5">
                  <span className="min-w-0 max-w-[8rem] truncate sm:max-w-[10rem] md:max-w-[14rem] xl:max-w-[18rem]">
                    {project.repoName}
                  </span>
                  <GitHubRepoStats repo={project.githubRepo} />
                </span>
              ) : null}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag, tagIndex) => {
            const isCourseProjectTimeTag =
              translationNamespace === "courseProjects" && tagIndex < 2
            const semesterTagClassName = getCourseProjectSemesterTagClassName(
              project.tags[1],
            )
            const tagLabel = isCourseProjectTimeTag
              ? t(`semesterTags.${tag}`, { defaultValue: tag })
              : tag

            return (
            <span
              key={tag}
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs font-semibold",
                isCourseProjectTimeTag
                  ? semesterTagClassName
                  : defaultTagClassName,
              )}
            >
              {tagLabel}
            </span>
          )})}
        </div>

        <div
          className="flex flex-col gap-4"
        >
          <p className="text-sm leading-relaxed text-foreground/80 dark:text-foreground/90">
            {t(`items.${project.id}.summary`)}
          </p>

          {variant === "full" && points.length ? (
            <FeaturePointList
              points={points}
              highlightedIndexes={highlightedIndexes}
              className="gap-2 text-sm"
            />
          ) : null}

        </div>

      </div>
    </GlassPanel>
  )
}
