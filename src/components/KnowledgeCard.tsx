import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Brain,
  FileText,
  Newspaper,
  type LucideIcon,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { GitHubRepoStats } from "@/components/GitHubRepoStats"
import { GlassPanel } from "@/components/GlassPanel"
import { AppLink } from "@/components/AppLink"
import { type KnowledgeEntry } from "@/data/knowledge"
import { getGitHubRepoUpdatedDate } from "@/lib/github-repo-stats"
import { defaultTagClassName, getSemanticTagClassName } from "@/lib/tag-styles"
import { ProjectImageGallery } from "@/components/ProjectImageGallery"
import { cn } from "@/lib/utils"

type KnowledgeCardProps = {
  entry: KnowledgeEntry
  className?: string
  imageAutoCycleStaggerIndex?: number
  variant?: "compact" | "full"
}

const kindIcon: Record<KnowledgeEntry["kind"], LucideIcon> = {
  blog: FileText,
  paperVault: BookOpen,
  digest: Newspaper,
  insights: Brain,
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

export function KnowledgeCard({
  entry,
  className,
  imageAutoCycleStaggerIndex,
  variant = "full",
}: KnowledgeCardProps) {
  const { i18n, t } = useTranslation(["knowledge", "common"])
  const [isCompactDesktop, setIsCompactDesktop] = useState(false)
  const Icon = kindIcon[entry.kind]
  const detailPath = `/knowledge/${entry.id}`
  const updatedDate = getGitHubRepoUpdatedDate(entry.githubRepo, entry.updatedAt)
  const updatedLabel = updatedDate
    ? new Intl.DateTimeFormat(i18n.language, {
        month: "long",
        year: "numeric",
      }).format(updatedDate)
    : entry.updatedAt

  useEffect(() => {
    if (variant !== "compact") {
      return undefined
    }

    const mediaQuery = window.matchMedia("(min-width: 768px)")
    const updateIsCompactDesktop = () => {
      setIsCompactDesktop(mediaQuery.matches)
    }

    updateIsCompactDesktop()
    mediaQuery.addEventListener("change", updateIsCompactDesktop)

    return () => {
      mediaQuery.removeEventListener("change", updateIsCompactDesktop)
    }
  }, [variant])

  return (
    <GlassPanel
      className={cn(
        "detail-link-pair flex h-full min-h-0 flex-col overflow-hidden transition-colors hover:bg-[rgb(var(--site-surface-rgb)_/_0.70)] dark:hover:bg-white/10",
        variant === "full" && "h-auto",
        className,
      )}
    >
      {entry.images?.length ? (
        <ProjectImageGallery
          cardAspectRatio={
            variant === "compact"
              ? isCompactDesktop
                ? "16 / 9.5"
                : "16 / 12.5"
              : undefined
          }
          cardAutoCycle={imageAutoCycleStaggerIndex !== undefined}
          cardAutoCycleStaggerIndex={imageAutoCycleStaggerIndex}
          cardImageFit={variant === "compact" ? "cover" : "contain"}
          cardScrollable={variant === "full"}
          images={entry.images}
          translationNamespace="knowledge"
        />
      ) : null}

      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col p-4",
          variant === "compact" ? "gap-4 md:gap-3.5" : "gap-4",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold leading-none",
              kindClassName[entry.kind],
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {t(`kinds.${entry.kind}`)}
          </span>
          <span className="shrink-0 text-xs font-semibold text-foreground/45 dark:text-foreground/55">
            {t("updatedLabel")} {updatedLabel}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <AppLink
            to={detailPath}
            className={cn(
              "detail-link-trigger detail-link-emphasis group/title inline-flex w-fit max-w-full items-center gap-1.5 leading-tight text-foreground/90 transition-colors hover:text-foreground",
              variant === "compact"
                ? "text-xl font-bold md:text-lg md:font-medium xl:text-xl"
                : "text-xl font-bold",
            )}
          >
            <span className="min-w-0">{t(`items.${entry.id}.title`)}</span>
          </AppLink>
          <a
            href={entry.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`${t("repoLabel")}: ${entry.repoName}`}
            className="group/repo inline-flex min-w-0 w-fit max-w-full items-center gap-1.5 text-sm font-semibold text-foreground/60 transition-colors hover:text-foreground/90 dark:text-foreground/75 dark:hover:text-foreground"
          >
            {entry.repoTags?.map((repoTag) => (
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
              {entry.repoName}
            </span>
            <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover/repo:-translate-y-0.5 group-hover/repo:translate-x-0.5" />
            <GitHubRepoStats repo={entry.githubRepo} />
          </a>
          {entry.externalLinks?.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className={cn(
                "group/external w-fit max-w-full flex-wrap items-center gap-x-1.5 gap-y-1 text-sm font-normal text-foreground/62 transition-colors hover:text-foreground/90 dark:text-foreground/72 dark:hover:text-foreground",
                variant === "compact"
                  ? "hidden xl:inline-flex"
                  : "inline-flex",
              )}
            >
              {link.badgeKeys?.map((badgeKey) => (
                <span
                  key={badgeKey}
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[0.6875rem] font-semibold leading-none whitespace-nowrap",
                    badgeKey.endsWith(".loginRequired")
                      ? "border-rose-400/25 bg-rose-400/10 text-rose-700 dark:border-rose-300/20 dark:bg-rose-300/10 dark:text-rose-200"
                      : "border-amber-400/30 bg-amber-400/12 text-amber-800 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-200",
                  )}
                >
                  {t(badgeKey)}
                </span>
              ))}
              <span>{t(link.labelKey)}</span>
              <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover/external:-translate-y-0.5 group-hover/external:translate-x-0.5" />
            </a>
          ))}
        </div>

        <div
          className={cn(
            "flex-wrap gap-1.5",
            variant === "compact" ? "hidden xl:flex" : "flex",
          )}
        >
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs font-semibold",
                defaultTagClassName,
              )}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-3">
          <p
            className={cn(
              "leading-relaxed text-foreground/80 dark:text-foreground/90",
              variant === "compact"
                ? "text-sm md:text-[0.8125rem] xl:text-sm"
                : "text-sm",
            )}
          >
            {t(`items.${entry.id}.summary`)}
          </p>

          <AppLink
            to={detailPath}
            className="detail-link-trigger detail-link-emphasis group/detail mt-auto inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-foreground/65 transition-colors hover:text-foreground dark:text-foreground/75 dark:hover:text-foreground"
          >
            {t("details.viewDetails")}
            <ArrowRight className="detail-link-arrow h-4 w-4 transition-transform group-hover/detail:translate-x-0.5" />
          </AppLink>
        </div>
      </div>
    </GlassPanel>
  )
}
