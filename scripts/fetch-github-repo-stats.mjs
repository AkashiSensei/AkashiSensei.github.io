import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const sourceFiles = [
  "src/data/projects.ts",
  "src/data/course-projects.ts",
  "src/data/tools.ts",
  "src/data/knowledge.ts",
]
const outputPath = path.join(root, "src/data/generated/github-repo-stats.json")
const legacyOutputPath = path.join(root, "src/data/generated/github-stars.json")
const githubActivityLogin = "AkashiSensei"
const repoBranchOverrides = {
  "AkashiSensei/os2023": "lab6",
}
const hardcodedRepoStats = {
  "AkashiSensei/BUAA-Parallel-2025-basic": {
    commits: 13,
    defaultBranch: "main",
    isPrivate: true,
  },
  "AkashiSensei/predicting-road-accident-risk-buaa": {
    commits: 14,
    defaultBranch: "main",
    isPrivate: true,
  },
  "BUAA-SEF-Team15/Learning_and_Living_Platform_BackEnd": {
    commits: 360,
    defaultBranch: "main",
    isPrivate: true,
  },
  "BUAA-SEF-Team15/Learning_and_Living_Platform_FrontEnd": {
    commits: 281,
    defaultBranch: "main",
    isPrivate: true,
  },
  "Yiyan2023/CareerYiyan-frontend": {
    commits: 6,
    defaultBranch: "main",
    isPrivate: true,
  },
  "Yiyan2023/Yiyan-frontend": {
    commits: 32,
    defaultBranch: "main",
    isPrivate: true,
  },
  "Yiyan2023/administration": {
    commits: 3,
    defaultBranch: "main",
    isPrivate: true,
  },
  "Yiyan2023/backend-literatureDetails": {
    commits: 3,
    defaultBranch: "main",
    isPrivate: true,
  },
  "Yiyan2023/backend-research": {
    commits: 96,
    defaultBranch: "main",
    isPrivate: true,
  },
  "Yiyan2023/backend-researcherPortal": {
    commits: 6,
    defaultBranch: "main",
    isPrivate: true,
  },
  "Yiyan2023/backend-search": {
    commits: 7,
    defaultBranch: "main",
    isPrivate: true,
  },
  "Yiyan2023/backend-userManagement": {
    commits: 15,
    defaultBranch: "main",
    isPrivate: true,
  },
}
const fallbackCourseProjectRepoStats = {
  "AkashiSensei/BUAA-Parallel-Programming-2026-hw": {
    commits: 4,
    defaultBranch: "main",
    isPrivate: false,
    stars: 0,
  },
  "AkashiSensei/BUAA-VR-Experiments-2026-hw": {
    commits: 2,
    defaultBranch: "main",
    isPrivate: false,
    stars: 1,
  },
  "AkashiSensei/Learning_and_Living_Platform_Submit": {
    commits: 7,
    defaultBranch: "main",
    isPrivate: false,
    stars: 3,
  },
  "AkashiSensei/Learning_and_Living_Platform_Support": {
    commits: 287,
    defaultBranch: "main",
    isPrivate: false,
    stars: 6,
  },
  "AkashiSensei/OOP_2022_Iteration": {
    commits: 5,
    defaultBranch: "main",
    isPrivate: false,
    stars: 0,
  },
  "AkashiSensei/Rotating_Calipers_Visualization": {
    commits: 3,
    defaultBranch: "main",
    isPrivate: false,
    stars: 0,
  },
  "AkashiSensei/kernel_analyzer": {
    commits: 34,
    defaultBranch: "main",
    isPrivate: false,
    stars: 0,
  },
  "AkashiSensei/kernel_data_plotter": {
    commits: 2,
    defaultBranch: "main",
    isPrivate: false,
    stars: 0,
  },
  "AkashiSensei/os2023": {
    commits: 29,
    defaultBranch: "lab6",
    isPrivate: false,
    stars: 15,
  },
  "BUAA-OOP-JAVA-TermAssignment/Archive_System": {
    commits: 179,
    defaultBranch: "main",
    isPrivate: false,
    stars: 1,
  },
  "BUAA-OOP-JAVA-TermAssignment/Archive_System_Server": {
    commits: 70,
    defaultBranch: "main",
    isPrivate: false,
    stars: 1,
  },
  "Yiyan2023/CareerYiyan-backend": {
    commits: 3,
    defaultBranch: "main",
    isPrivate: false,
    stars: 0,
  },
}
const fallbackKnowledgeRepoStats = {
  "AkashiSensei/ai-builders-digest": {
    commits: 60,
    defaultBranch: "main",
    isPrivate: false,
    pushedAt: "2026-06-03T23:06:43Z",
    stars: 3,
    updatedAt: "2026-06-03T23:06:47Z",
  },
  "AkashiSensei/blob-article": {
    commits: 9,
    defaultBranch: "main",
    isPrivate: false,
    pushedAt: "2026-06-02T11:38:33Z",
    stars: 0,
    updatedAt: "2026-06-02T11:38:38Z",
  },
  "AkashiSensei/crater-insights": {
    commits: 27,
    defaultBranch: "main",
    isPrivate: false,
    pushedAt: "2026-06-04T08:48:39Z",
    stars: 1,
    updatedAt: "2026-06-04T08:48:39Z",
  },
  "AkashiSensei/paper-vault": {
    commits: 3,
    defaultBranch: "main",
    isPrivate: false,
    pushedAt: "2026-06-02T13:21:24Z",
    stars: 0,
    updatedAt: "2026-06-02T13:22:00Z",
  },
}

async function loadLocalEnv() {
  for (const envFile of [".env.local", ".env"]) {
    let source

    try {
      source = await readFile(path.join(root, envFile), "utf8")
    } catch {
      continue
    }

    for (const line of source.split(/\r?\n/)) {
      const trimmed = line.trim()

      if (!trimmed || trimmed.startsWith("#")) {
        continue
      }

      const separatorIndex = trimmed.indexOf("=")

      if (separatorIndex === -1) {
        continue
      }

      const key = trimmed.slice(0, separatorIndex).trim()
      const rawValue = trimmed.slice(separatorIndex + 1).trim()
      const value = rawValue.replace(/^["']|["']$/g, "")

      process.env[key] ??= value
    }
  }
}

async function readPreviousSnapshot() {
  for (const previousPath of [outputPath, legacyOutputPath]) {
    try {
      return JSON.parse(await readFile(previousPath, "utf8"))
    } catch {
      // Try the next path.
    }
  }

  return { repos: {} }
}

async function collectReposFromFile(file) {
  const repos = new Set()
  const source = await readFile(path.join(root, file), "utf8")

  for (const match of source.matchAll(/githubRepo:\s*"([^"]+)"/g)) {
    repos.add(match[1])
  }

  return repos
}

async function collectRepos() {
  const repos = new Set()

  for (const file of sourceFiles) {
    for (const repo of await collectReposFromFile(file)) {
      repos.add(repo)
    }
  }

  return [...repos].sort()
}

function createGitHubHeaders() {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "AkashiSensei.github.io build",
    "X-GitHub-Api-Version": "2022-11-28",
  }

  const token =
    process.env.GH_REPO_STATS_TOKEN ?? process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

function getGitHubToken() {
  return process.env.GH_REPO_STATS_TOKEN ?? process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: createGitHubHeaders(),
  })

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`)
  }

  return {
    data: await response.json(),
    headers: response.headers,
  }
}

function getLastPageFromLinkHeader(linkHeader) {
  if (!linkHeader) {
    return undefined
  }

  const lastLink = linkHeader
    .split(",")
    .map((part) => part.trim())
    .find((part) => part.endsWith('rel="last"'))

  if (!lastLink) {
    return undefined
  }

  const page = lastLink.match(/[?&]page=(\d+)/)?.[1]
  return page ? Number(page) : undefined
}

async function fetchDefaultBranchCommitCount(repo, defaultBranch) {
  const url = new URL(`https://api.github.com/repos/${repo}/commits`)
  url.searchParams.set("sha", defaultBranch)
  url.searchParams.set("per_page", "1")

  const { data, headers } = await fetchJson(url)
  const lastPage = getLastPageFromLinkHeader(headers.get("link"))

  if (lastPage) {
    return lastPage
  }

  return Array.isArray(data) ? data.length : undefined
}

async function fetchRepoStats(repo) {
  const { data } = await fetchJson(`https://api.github.com/repos/${repo}`)
  const statsBranch = repoBranchOverrides[repo] ?? data.default_branch
  const commits = await fetchDefaultBranchCommitCount(repo, statsBranch)

  return {
    commits,
    defaultBranch: statsBranch,
    fetchedAt: new Date().toISOString(),
    isPrivate: Boolean(data.private),
    pushedAt: data.pushed_at,
    stars: data.stargazers_count,
    updatedAt: data.updated_at,
  }
}

async function fetchGitHubUserActivity(login, generatedAt) {
  const token = getGitHubToken()

  if (!token) {
    throw new Error("GitHub token is required for the contributions GraphQL API")
  }

  const to = new Date(generatedAt)
  const from = new Date(to)
  from.setUTCFullYear(from.getUTCFullYear() - 1)

  const query = `
    query GitHubUserActivity($login: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $login) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            totalContributions
          }
          restrictedContributionsCount
          totalCommitContributions
          totalIssueContributions
          totalPullRequestContributions
          totalPullRequestReviewContributions
          totalRepositoryContributions
        }
      }
    }
  `

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      ...createGitHubHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: {
        from: from.toISOString(),
        login,
        to: to.toISOString(),
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`)
  }

  const payload = await response.json()

  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join("; "))
  }

  const collection = payload.data?.user?.contributionsCollection

  if (!collection) {
    throw new Error(`No GitHub activity returned for ${login}`)
  }

  return {
    commits: collection.totalCommitContributions,
    fetchedAt: generatedAt,
    from: from.toISOString(),
    issues: collection.totalIssueContributions,
    login,
    pullRequestReviews: collection.totalPullRequestReviewContributions,
    pullRequests: collection.totalPullRequestContributions,
    repositories: collection.totalRepositoryContributions,
    restrictedContributions: collection.restrictedContributionsCount,
    to: to.toISOString(),
    totalContributions: collection.contributionCalendar?.totalContributions,
  }
}

await loadLocalEnv()

const previous = await readPreviousSnapshot()
const repos = await collectRepos()
const courseProjectRepos = await collectReposFromFile("src/data/course-projects.ts")
const knowledgeRepos = await collectReposFromFile("src/data/knowledge.ts")
const generatedAt = new Date().toISOString()
const snapshot = {
  generatedAt,
  repos: {},
}

for (const repo of repos) {
  const isCourseProjectRepo = courseProjectRepos.has(repo)
  const isKnowledgeRepo = knowledgeRepos.has(repo)
  const hardcoded = isCourseProjectRepo ? hardcodedRepoStats[repo] : undefined
  const fallback = isCourseProjectRepo
    ? fallbackCourseProjectRepoStats[repo]
    : isKnowledgeRepo
      ? fallbackKnowledgeRepoStats[repo]
    : undefined

  try {
    if (hardcoded) {
      snapshot.repos[repo] = {
        ...hardcoded,
        fetchedAt: generatedAt,
      }
    } else {
      snapshot.repos[repo] = await fetchRepoStats(repo)
    }
  } catch (error) {
    if (fallback) {
      snapshot.repos[repo] = {
        ...fallback,
        fetchedAt: generatedAt,
      }
      console.warn(`Used fallback GitHub repo stats for ${repo}: ${error.message}`)
    } else if (previous.repos?.[repo]) {
      snapshot.repos[repo] = previous.repos[repo]
      console.warn(`Kept previous GitHub repo stats for ${repo}: ${error.message}`)
    } else {
      console.warn(`Skipped GitHub repo stats for ${repo}: ${error.message}`)
    }
  }
}

try {
  snapshot.userActivity = await fetchGitHubUserActivity(
    githubActivityLogin,
    generatedAt,
  )
} catch (error) {
  if (previous.userActivity) {
    snapshot.userActivity = previous.userActivity
    console.warn(`Kept previous GitHub user activity: ${error.message}`)
  } else {
    console.warn(`Skipped GitHub user activity: ${error.message}`)
  }
}

await mkdir(path.dirname(outputPath), { recursive: true })
await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`)

console.log(`Wrote GitHub repo stats for ${Object.keys(snapshot.repos).length}/${repos.length} repos.`)
