import { GitCommitHorizontal, Star } from "lucide-react"
import { useTranslation } from "react-i18next"

import githubRepoStats from "@/data/generated/github-repo-stats.json"
import { cn } from "@/lib/utils"

type GitHubRepoStatsProps = {
  repo?: string
  className?: string
}

type GitHubRepoStatsSnapshot = {
  repos: Record<
    string,
    {
      commits?: number
      defaultBranch?: string
      fetchedAt: string
      isPrivate?: boolean
      stars?: number
    }
  >
}

const repoStatsSnapshot = githubRepoStats as GitHubRepoStatsSnapshot

export function GitHubRepoStats({ repo, className }: GitHubRepoStatsProps) {
  const { i18n, t } = useTranslation("common")

  if (!repo) {
    return null
  }

  const snapshot = repoStatsSnapshot.repos[repo]

  if (!snapshot) {
    return null
  }

  const fetchedAt = new Intl.DateTimeFormat(i18n.language, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(snapshot.fetchedAt))
  const stars =
    typeof snapshot.stars === "number" && !snapshot.isPrivate
      ? snapshot.stars
      : undefined
  const commits =
    typeof snapshot.commits === "number" ? snapshot.commits : undefined

  if (stars === undefined && commits === undefined) {
    return null
  }

  return (
    <span
      className={cn(
        "inline-flex shrink-0 whitespace-nowrap items-center gap-1.5 text-foreground/45 dark:text-foreground/60",
        className,
      )}
      title={t("githubRepoStats.tooltip", {
        branch: snapshot.defaultBranch ?? t("githubRepoStats.defaultBranch"),
        commits:
          commits === undefined
            ? t("githubRepoStats.unavailable")
            : commits.toLocaleString(i18n.language),
        stars:
          stars === undefined
            ? t("githubRepoStats.unavailable")
            : stars.toLocaleString(i18n.language),
        time: fetchedAt,
      })}
    >
      {stars !== undefined ? (
        <span className="inline-flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-current" />
          <span>{stars.toLocaleString(i18n.language)}</span>
        </span>
      ) : null}
      {commits !== undefined ? (
        <span className="inline-flex items-center gap-1">
          <GitCommitHorizontal className="h-3.5 w-3.5" />
          <span>{commits.toLocaleString(i18n.language)}</span>
        </span>
      ) : null}
    </span>
  )
}
