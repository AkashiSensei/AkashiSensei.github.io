import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Brain,
  FileText,
  Newspaper,
  type LucideIcon,
} from "lucide-react"
import { useTranslation } from "react-i18next"

import { GitHubRepoStats } from "@/components/GitHubRepoStats"
import { GlassPanel } from "@/components/GlassPanel"
import { AppLink } from "@/components/AppLink"
import { type KnowledgeEntry } from "@/data/knowledge"
import { getGitHubRepoUpdatedDate } from "@/lib/github-repo-stats"
import { ProjectImageGallery } from "@/components/ProjectImageGallery"
import { cn } from "@/lib/utils"

type KnowledgeCardProps = {
  entry: KnowledgeEntry
  className?: string
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

const defaultTagClassName =
  "border-white/45 bg-white/25 text-foreground/60 dark:border-white/10 dark:bg-white/[0.04] dark:text-foreground/70"

export function KnowledgeCard({
  entry,
  className,
  variant = "full",
}: KnowledgeCardProps) {
  const { i18n, t } = useTranslation(["knowledge", "common"])
  const Icon = kindIcon[entry.kind]
  const detailPath = `/knowledge/${entry.id}`
  const updatedDate = getGitHubRepoUpdatedDate(entry.githubRepo, entry.updatedAt)
  const updatedLabel = updatedDate
    ? new Intl.DateTimeFormat(i18n.language, {
        month: "long",
        year: "numeric",
      }).format(updatedDate)
    : entry.updatedAt

  return (
    <GlassPanel
      className={cn(
        "flex h-full min-h-0 flex-col overflow-hidden transition-colors hover:bg-white/55 dark:hover:bg-white/10",
        variant === "full" && "h-auto",
        className,
      )}
    >
      {entry.images?.length ? (
        <ProjectImageGallery
          images={entry.images}
          translationNamespace="knowledge"
        />
      ) : null}

      <div className="flex min-h-0 flex-1 flex-col gap-4 p-4">
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
            className="group/title inline-flex w-fit max-w-full items-center gap-1.5 text-xl font-bold leading-tight text-foreground/90 transition-colors hover:text-foreground"
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
            <span className="min-w-0 truncate">{entry.repoName}</span>
            <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover/repo:-translate-y-0.5 group-hover/repo:translate-x-0.5" />
            <GitHubRepoStats repo={entry.githubRepo} />
          </a>
        </div>

        <div className="flex flex-wrap gap-1.5">
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
          <p className="text-sm leading-relaxed text-foreground/80 dark:text-foreground/90">
            {t(`items.${entry.id}.summary`)}
          </p>

          <AppLink
            to={detailPath}
            className="group/detail inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-foreground/65 transition-colors hover:text-foreground dark:text-foreground/75 dark:hover:text-foreground"
          >
            {t("details.viewDetails")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover/detail:translate-x-0.5" />
          </AppLink>
        </div>
      </div>
    </GlassPanel>
  )
}
