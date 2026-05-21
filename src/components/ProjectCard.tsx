import { ArrowUpRight, Ellipsis } from "lucide-react"
import { useTranslation } from "react-i18next"

import { FeaturePointList } from "@/components/FeaturePointList"
import { GitHubRepoStats } from "@/components/GitHubRepoStats"
import { GlassPanel } from "@/components/GlassPanel"
import { ProjectImageGallery } from "@/components/ProjectImageGallery"
import { type Project } from "@/data/projects"
import { getSemanticTagClassName } from "@/lib/tag-styles"
import { cn } from "@/lib/utils"

type ProjectCardProps = {
  project: Project
  className?: string
  variant?: "compact" | "full"
}

const lifecycleStatusClassName = {
  starting:
    "border-sky-300/60 bg-sky-100/70 text-sky-800 dark:border-sky-300/30 dark:bg-sky-300/15 dark:text-sky-200",
  ongoing:
    "border-emerald-300/60 bg-emerald-100/70 text-emerald-800 dark:border-emerald-300/30 dark:bg-emerald-300/15 dark:text-emerald-200",
  completed:
    "border-zinc-300/70 bg-zinc-100/80 text-zinc-700 dark:border-zinc-300/25 dark:bg-zinc-300/10 dark:text-zinc-200",
} satisfies Record<Project["lifecycleStatus"], string>

export function ProjectCard({
  project,
  className,
  variant = "compact",
}: ProjectCardProps) {
  const { t } = useTranslation("projects")
  const points = t(`items.${project.id}.points`, { returnObjects: true }) as string[]
  const visiblePoints = variant === "compact" ? points.slice(0, 3) : points
  const hiddenPointCount = points.length - visiblePoints.length
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
        "group flex h-full min-h-0 flex-col overflow-hidden transition-colors hover:bg-white/55 dark:hover:bg-white/10",
        className,
      )}
    >
      {project.images?.length ? (
        <ProjectImageGallery images={project.images} />
      ) : project.screenshot ? (
        <img
          src={project.screenshot.src}
          alt={t(project.screenshot.altKey)}
          loading="lazy"
          className="aspect-[16/9] w-full object-cover"
        />
      ) : null}

      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col gap-4 p-4",
        )}
      >
        <div className="flex shrink-0 flex-col gap-3">
          <div className="flex items-center gap-2">
            <h3 className="min-w-0 text-xl font-bold leading-tight text-foreground/90">
              {t(`items.${project.id}.title`)}
            </h3>
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
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {repoLinks.map((link) => {
                const repoContent = (
                  <>
                    {link.repoTags?.map((repoTag) => (
                      <span
                        key={repoTag}
                        className={cn(
                          "rounded-full border px-2 py-0.5 text-[0.6875rem] font-semibold leading-none",
                          getSemanticTagClassName(repoTag),
                          "whitespace-nowrap",
                        )}
                      >
                        {t(`repoTags.${repoTag}`)}
                      </span>
                    ))}
                    <span className="min-w-0 truncate">{link.label}</span>
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
                        "rounded-full border px-2 py-0.5 text-[0.6875rem] font-semibold leading-none",
                        getSemanticTagClassName(repoTag),
                        "whitespace-nowrap",
                      )}
                    >
                      {t(`repoTags.${repoTag}`)}
                    </span>
                  ))}
                </span>
              ) : null}
              <span className="inline-flex min-w-0 items-center gap-1.5">
                <span className="min-w-0 truncate">{project.repoName}</span>
                <GitHubRepoStats repo={project.githubRepo} />
              </span>
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/45 bg-white/25 px-2.5 py-1 text-xs font-medium text-foreground/60 dark:border-white/10 dark:bg-white/[0.04] dark:text-foreground/70"
            >
              {tag}
            </span>
          ))}
        </div>

        <div
          className="flex flex-col gap-4"
        >
          <p className="text-sm leading-relaxed text-foreground/80 dark:text-foreground/90">
            {t(`items.${project.id}.summary`)}
          </p>

          <FeaturePointList
            points={visiblePoints}
            highlightedIndexes={project.highlightPointIndexes}
          />

          {hiddenPointCount > 0 ? (
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground/55 dark:text-foreground/65">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent via-foreground/15 to-foreground/10 dark:via-foreground/20 dark:to-foreground/10" />
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/45 bg-white/35 px-2.5 py-1 shadow-sm shadow-black/5 dark:border-white/10 dark:bg-white/[0.06]">
                <Ellipsis className="h-3.5 w-3.5" />
                {t("morePoints", { count: hiddenPointCount })}
              </span>
              <span className="h-px flex-1 bg-gradient-to-l from-transparent via-foreground/15 to-foreground/10 dark:via-foreground/20 dark:to-foreground/10" />
            </div>
          ) : null}
        </div>

      </div>
    </GlassPanel>
  )
}
