import githubRepoStats from "@/data/generated/github-repo-stats.json"

export type GitHubRepoStatsSnapshot = {
  generatedAt?: string
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
  userActivity?: GitHubUserActivitySnapshot
}

export type GitHubUserActivitySnapshot = {
  commits?: number
  fetchedAt: string
  from: string
  issues?: number
  login: string
  pullRequestReviews?: number
  pullRequests?: number
  repositories?: number
  restrictedContributions?: number
  to: string
  totalContributions?: number
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

export function getGitHubUserActivity() {
  return repoStatsSnapshot.userActivity
}
