import githubRepoStats from "@/data/generated/github-repo-stats.json"

export type GitHubRepoStatsSnapshot = {
  repos: Record<
    string,
    {
      commits?: number
      defaultBranch?: string
      fetchedAt: string
      isPrivate?: boolean
      pushedAt?: string
      stars?: number
      updatedAt?: string
    }
  >
}

const repoStatsSnapshot = githubRepoStats as GitHubRepoStatsSnapshot

export function getGitHubRepoStats(repo?: string) {
  if (!repo) {
    return undefined
  }

  return repoStatsSnapshot.repos[repo]
}

export function getGitHubRepoUpdatedDate(repo?: string, fallback?: string) {
  const snapshot = getGitHubRepoStats(repo)
  const value = snapshot?.pushedAt ?? snapshot?.updatedAt ?? fallback

  if (!value) {
    return undefined
  }

  const date = new Date(value)

  return Number.isNaN(date.getTime()) ? undefined : date
}
